<script lang="ts">
import { navigateToPage } from "@utils/navigation-utils";
import { onDestroy, onMount, tick } from "svelte";

/**
 * 文案由 SearchLazy.astro 在服务端解析好后传进来，而不是在组件里 import
 * `@i18n/translation`：那个模块静态引用了全部 5 种语言（打包后 ~44KB），
 * 而本组件每页都会水合，等于让每个页面都白背这 44KB。
 */
export interface SearchLabels {
	search: string;
	searchLoading: string;
	searchNoResults: string;
	searchKbdSelect: string;
	searchKbdSwitch: string;
	announcementClose: string;
}

interface Props {
	/** 首次挂载时是否直接打开搜索弹窗（用于懒加载入口） */
	initialOpen?: boolean;
	labels: SearchLabels;
	/** 搜索框为空时默认展示的文章 */
	recentPosts: { url: string; title: string; description: string }[];
}

let { initialOpen = false, labels, recentPosts }: Props = $props();

const MEILISEARCH_HOST =
	import.meta.env.PUBLIC_MEILISEARCH_HOST || "https://search.louaq.com";
const MEILISEARCH_SEARCH_KEY = import.meta.env.PUBLIC_MEILISEARCH_SEARCH_KEY;
const MEILISEARCH_INDEX_NAME =
	import.meta.env.PUBLIC_MEILISEARCH_INDEX_NAME || "blog";

/** 检索结果条目（doSearch / loadMore 共用的归一化结构） */
interface SearchHit {
	url: string;
	title: string;
	description: string;
	excerpt: string;
	tags: string[];
	category: string;
}

let initialized = $state(false);

let isOpen = $state(false);
let query = $state("");
let results: SearchHit[] = $state([]);
let isSearching = $state(false);
let debounceTimer: NodeJS.Timeout;
let activeIndex = $state(-1);
let prevScrollLock: {
	bodyOverflow: string;
	bodyPaddingRight: string;
	htmlOverflow: string;
	htmlPaddingRight: string;
} | null = null;
const hitsPerPage = 20;
let page = $state(0);
let nbHits = $state(0);
let nbPages = $state(0);
let hasMore = $state(false);
let isLoadingMore = $state(false);
let requestSeq = 0;
let listEl: HTMLDivElement | null = $state(null);
let lastScrolledIndex = -1;

let modalInputEl: HTMLInputElement | null = $state(null);

function lockScroll() {
	if (prevScrollLock) return;

	const html = document.documentElement;
	const body = document.body;

	prevScrollLock = {
		bodyOverflow: body.style.overflow,
		bodyPaddingRight: body.style.paddingRight,
		htmlOverflow: html.style.overflow,
		htmlPaddingRight: html.style.paddingRight,
	};

	// 先计算滚动条宽度（必须在 overflow hidden 之前）
	const scrollbarWidth = window.innerWidth - html.clientWidth;

	// 锁滚动（同时锁 html/body，覆盖不同浏览器的滚动容器差异）
	html.style.overflow = "hidden";
	body.style.overflow = "hidden";

	// 用 padding-right 抵消滚动条消失导致的视口变宽（Windows 下最常见抖动来源）
	// 如果浏览器已支持 scrollbar-gutter: stable，则无需（且不应）再做 padding 补偿，否则会过度补偿导致导航栏抖动
	const hasStableScrollbarGutter =
		typeof CSS !== "undefined" &&
		typeof CSS.supports === "function" &&
		CSS.supports("scrollbar-gutter: stable");

	if (!hasStableScrollbarGutter && scrollbarWidth > 0) {
		const computed = window.getComputedStyle(body).paddingRight;
		body.style.paddingRight = `calc(${computed} + ${scrollbarWidth}px)`;
	}
}

function unlockScroll() {
	if (!prevScrollLock) return;

	const html = document.documentElement;
	const body = document.body;

	body.style.overflow = prevScrollLock.bodyOverflow;
	body.style.paddingRight = prevScrollLock.bodyPaddingRight;
	html.style.overflow = prevScrollLock.htmlOverflow;
	html.style.paddingRight = prevScrollLock.htmlPaddingRight;
	prevScrollLock = null;
}

// 简易 Portal：将节点移动到 document.body，避免被页面滚动/transform 影响
function portal(node: HTMLElement) {
	document.body.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		},
	};
}

const openModal = async () => {
	isOpen = true;
	// 锁定背景滚动，避免滚动导致弹窗“丢失/穿透”
	lockScroll();
	await tick();
	modalInputEl?.focus();
	showRecent();
	page = 0;
	nbHits = 0;
	nbPages = 0;
	hasMore = false;
	isLoadingMore = false;
};

const showRecent = () => {
	results = recentPosts.map((post) => ({
		...post,
		excerpt: "",
		tags: [],
		category: "",
	}));
	activeIndex = 0;
};

const closeModal = () => {
	isOpen = false;
	query = "";
	results = [];
	isSearching = false;
	activeIndex = -1;
	page = 0;
	nbHits = 0;
	nbPages = 0;
	hasMore = false;
	isLoadingMore = false;
	unlockScroll();
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeModal();
	navigateToPage(url);
};

const highlightText = (text: string, q: string): string => {
	if (!q || !text) return text;
	// 支持空格分词：对每个 token 高亮，避免整句命中率过低
	const tokens = q
		.split(/\s+/g)
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 8);
	if (tokens.length === 0) return text;
	const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const regex = new RegExp(`(${escaped.join("|")})`, "gi");
	return text.replace(regex, "<mark>$1</mark>");
};

/** 向 Meilisearch 请求一页结果，并归一化为 SearchHit[] */
const queryMeilisearch = async (
	keyword: string,
	pageIndex: number,
): Promise<{ hits: SearchHit[]; total: number }> => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (MEILISEARCH_SEARCH_KEY) {
		headers.Authorization = `Bearer ${MEILISEARCH_SEARCH_KEY}`;
	}

	const response = await fetch(
		`${MEILISEARCH_HOST.replace(/\/$/, "")}/indexes/${MEILISEARCH_INDEX_NAME}/search`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				q: keyword,
				limit: hitsPerPage,
				offset: pageIndex * hitsPerPage,
				attributesToRetrieve: [
					"title",
					"description",
					"content",
					"url",
					"tags",
					"category",
				],
			}),
		},
	);

	const data = await response.json();
	const hits = (data?.hits || []).map((hit: Record<string, unknown>) => {
		const content = typeof hit?.content === "string" ? hit.content : "";
		const excerptRaw = content.replace(/\s+/g, " ").trim().slice(0, 180);
		return {
			url: hit.url as string,
			title: highlightText((hit.title as string) ?? "", keyword),
			description: hit.description
				? highlightText(hit.description as string, keyword)
				: "",
			excerpt: excerptRaw ? highlightText(excerptRaw, keyword) : "",
			tags: (hit.tags as string[]) || [],
			category: (hit.category as string) || "",
		} satisfies SearchHit;
	});

	return { hits, total: data?.estimatedTotalHits ?? 0 };
};

const doSearch = async (keyword: string, opts?: { reset?: boolean }) => {
	if (!initialized) return;

	const trimmed = keyword.trim();
	if (!trimmed) {
		showRecent();
		isSearching = false;
		page = 0;
		nbHits = 0;
		nbPages = 0;
		hasMore = false;
		isLoadingMore = false;
		return;
	}

	if (opts?.reset) {
		page = 0;
		results = [];
		activeIndex = -1;
		nbHits = 0;
		nbPages = 0;
		hasMore = false;
		isLoadingMore = false;
	}

	isSearching = true;
	const currentReq = ++requestSeq;
	try {
		const { hits, total } = await queryMeilisearch(trimmed, page);

		// 如果期间发起了新的请求，丢弃旧结果
		if (currentReq !== requestSeq) return;

		nbHits = total;
		nbPages = Math.ceil(nbHits / hitsPerPage) || 0;
		hasMore = (page + 1) * hitsPerPage < nbHits;

		results = hits;
		activeIndex = results.length > 0 ? 0 : -1;
	} catch (error) {
		// 保持静默失败，避免刷屏；必要时可打开 console
		console.error("Search error:", error);
		results = [];
		activeIndex = -1;
		page = 0;
		nbHits = 0;
		nbPages = 0;
		hasMore = false;
	} finally {
		if (currentReq === requestSeq) isSearching = false;
	}
};

const loadMore = async () => {
	if (!initialized) return;
	const trimmed = query.trim();
	if (!trimmed) return;
	if (!hasMore || isLoadingMore) return;

	isLoadingMore = true;
	const nextPage = page + 1;
	const currentReq = ++requestSeq;
	try {
		const { hits: newHits, total } = await queryMeilisearch(trimmed, nextPage);
		if (currentReq !== requestSeq) return;

		page = nextPage;
		nbHits = total || nbHits;
		nbPages = Math.ceil(nbHits / hitsPerPage) || 0;
		hasMore = (nextPage + 1) * hitsPerPage < nbHits;

		// 追加并去重（按 url）
		const existing = new Set(results.map((r) => r.url));
		const merged = [...results];
		for (const h of newHits) {
			if (h?.url && !existing.has(h.url)) {
				merged.push(h);
				existing.add(h.url);
			}
		}
		results = merged;
	} catch (error) {
		console.error("Load more error:", error);
	} finally {
		if (currentReq === requestSeq) isLoadingMore = false;
	}
};

const moveActive = (delta: number) => {
	if (!results.length) return;
	const next = activeIndex < 0 ? 0 : activeIndex + delta;
	if (next < 0) activeIndex = results.length - 1;
	else if (next >= results.length) activeIndex = 0;
	else activeIndex = next;
};

const openActive = () => {
	if (activeIndex < 0 || activeIndex >= results.length) return;
	const url = results[activeIndex]?.url;
	if (typeof url === "string" && url) {
		closeModal();
		navigateToPage(url);
	}
};

const handleInputKeydown = (e: KeyboardEvent) => {
	if (e.key === "ArrowDown") {
		e.preventDefault();
		moveActive(1);
		return;
	}
	if (e.key === "ArrowUp") {
		e.preventDefault();
		moveActive(-1);
		return;
	}
	if (e.key === "Enter" && results.length > 0) {
		e.preventDefault();
		openActive();
	}
};

// 输入防抖
$effect(() => {
	if (isOpen) {
		// 读取 query 以建立依赖
		const _q = query;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => void doSearch(_q, { reset: true }), 250);
	}
});

// 键盘上下选择时，让高亮项随之滚动到可视区域
$effect(() => {
	if (
		isOpen &&
		listEl &&
		activeIndex >= 0 &&
		activeIndex !== lastScrolledIndex
	) {
		lastScrolledIndex = activeIndex;
		// 等 DOM 更新后再滚动
		tick().then(() => {
			const active = listEl?.querySelector<HTMLAnchorElement>(
				"a.search-item.is-active",
			);
			active?.scrollIntoView({ block: "nearest" });
		});
	}
});

// 放在依赖的函数与 $effect 之后注册，避免 Svelte 5 + Astro 岛水合时 lifecycle_outside_component
onMount(() => {
	let disposed = false;
	let keydownHandler: ((e: KeyboardEvent) => void) | undefined;

	void (async () => {
		initialized = !!MEILISEARCH_HOST && !!MEILISEARCH_INDEX_NAME;

		if (disposed) return;

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) closeModal();
			if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
				e.preventDefault();
				openModal();
			}
		};
		keydownHandler = onKeydown;
		document.addEventListener("keydown", onKeydown);

		if (initialOpen) {
			await tick();
			if (disposed) return;
			await openModal();
		}
	})();

	return () => {
		disposed = true;
		if (keydownHandler) {
			document.removeEventListener("keydown", keydownHandler);
		}
	};
});

onDestroy(() => clearTimeout(debounceTimer));
onDestroy(() => {
	unlockScroll();
});
</script>

{#snippet searchIcon(size: number)}
	<svg viewBox="0 0 1024 1024" width={size} height={size} aria-hidden="true" class="search-trigger-icon">
		<path d="M908.488 821.348L783.7 696.56a401.635 401.635 0 0 1-41.665 48.894 403.103 403.103 0 0 1-35.653 31.68l123.159 123.159c10.855 10.854 25.117 16.282 39.376 16.283 14.262 0.002 28.518-5.427 39.376-16.283l0.188-0.188c10.524-10.524 16.316-24.508 16.316-39.382s-5.792-28.858-16.309-39.375z" fill="#2FBC3C" />
		<path d="M932.967 796.868L803.1 667.001a399.223 399.223 0 0 0 24.478-48.428c20.821-49.225 31.377-101.505 31.377-155.386S848.398 357.024 827.578 307.8c-20.106-47.537-48.887-90.226-85.542-126.881s-79.344-65.435-126.88-85.542C565.931 74.557 513.651 64 459.769 64S353.607 74.557 304.382 95.377c-47.537 20.107-90.226 48.887-126.881 85.542S112.066 260.263 91.96 307.8c-20.82 49.225-31.377 101.504-31.377 155.386S71.139 569.348 91.96 618.573c20.106 47.537 48.887 90.226 85.542 126.881s79.344 65.435 126.881 85.542c49.225 20.82 101.504 31.377 155.386 31.377s106.162-10.557 155.386-31.377a398.173 398.173 0 0 0 62.736-33.395l127.172 127.172c17.605 17.605 40.727 26.407 63.852 26.406 23.126-0.001 46.256-8.805 63.864-26.413l0.188-0.188c17.057-17.056 26.45-39.734 26.45-63.855 0-24.121-9.393-46.799-26.45-63.855z m-24.674 103.425c-10.857 10.857-25.114 16.285-39.376 16.283-14.258-0.001-28.521-5.429-39.376-16.283L706.383 777.134a403.405 403.405 0 0 0 35.653-31.68 401.649 401.649 0 0 0 41.665-48.894l124.787 124.788c10.518 10.518 16.31 24.501 16.31 39.375s-5.792 28.858-16.316 39.382l-0.189 0.188zM459.769 98.619c101.891 0 194.152 42.018 260.37 109.635-9.882-11.269-20.787-22.236-32.792-32.835 185.143 163.447 180.59 397.176 31.458 546.309-64.921 64.921-146.438 99.985-230.202 104.893a367.842 367.842 0 0 1-28.834 1.133c-201.023 0-364.567-163.544-364.567-364.567S258.746 98.619 459.769 98.619z" fill="currentColor" />
		<path d="M224.978 245.35c-98.897 103.804-146.487 307.567-35.566 454.728 147.889 153.727 380.29 106.897 493.595-1.051 103.641-98.742 174.303-311.826 51.99-472.601-163.445-166.451-403.394-92.991-510.019 18.924z m96.27 358.446c-36.341-36.341-56.355-84.659-56.355-136.054 0-51.394 20.014-99.713 56.355-136.054 36.341-36.342 84.659-56.356 136.054-56.356s99.713 20.014 136.054 56.356c36.341 36.341 56.355 84.659 56.355 136.054 0 51.395-20.014 99.713-56.355 136.054s-84.659 56.355-136.054 56.355-99.713-20.014-136.054-56.355z" fill="#8BF268" />
		<path d="M459.769 827.754c9.704 0 19.319-0.385 28.834-1.133-105.408 6.176-214.373-35.409-298.313-125.378 11.822 15.535 25.415 30.434 40.917 44.508-169.676-150.365-178.062-387.067-28.93-536.199C347.102 64.727 571.707 56.258 734.25 225.45a338.221 338.221 0 0 0-14.111-17.196C653.921 140.637 561.66 98.619 459.769 98.619c-201.023 0-364.567 163.544-364.567 364.567s163.544 364.568 364.567 364.568z" fill="#8BF268" />
		<path d="M649.711 467.742c0-51.394-20.014-99.713-56.355-136.054-36.341-36.342-84.659-56.356-136.054-56.356s-99.713 20.014-136.054 56.356c-36.341 36.341-56.355 84.659-56.355 136.054 0 51.395 20.014 99.713 56.355 136.054s84.659 56.355 136.054 56.355 99.713-20.014 136.054-56.355 56.355-84.66 56.355-136.054z m-192.409 157.79c-87.006 0-157.791-70.784-157.791-157.791S370.295 309.95 457.302 309.95s157.791 70.784 157.791 157.791-70.785 157.791-157.791 157.791z" fill="currentColor" />
		<path d="M189.412 700.078C78.491 552.917 126.081 349.154 224.978 245.35c106.625-111.915 346.574-185.374 510.019-18.924-0.248-0.326-0.498-0.651-0.747-0.976C571.707 56.258 347.102 64.727 202.277 209.552 53.145 358.684 61.531 595.386 231.207 745.75c-15.502-14.074-29.095-28.973-40.917-44.508a439.694 439.694 0 0 1-7.684-8.445 344.242 344.242 0 0 0 6.806 7.281z" fill="#FFFFFF" />
		<path d="M734.997 226.426c122.313 160.775 51.651 373.859-51.99 472.601-113.305 107.948-345.706 154.778-493.595 1.051a343.975 343.975 0 0 1-6.805-7.28 445.765 445.765 0 0 0 7.684 8.445c83.939 89.97 192.905 131.554 298.313 125.378 83.764-4.908 165.281-39.972 230.202-104.893 149.132-149.132 153.685-382.862-31.458-546.309 12.005 10.598 22.91 21.566 32.792 32.835a337.686 337.686 0 0 1 14.111 17.196l0.746 0.976z" fill="#2FBC3C" />
	</svg>
{/snippet}

<button
	type="button"
	aria-label="Open search"
	title={`${labels.search} · Ctrl K`}
	class="search-trigger hidden shrink-0 lg:flex"
	onclick={openModal}
>
	{@render searchIcon(24)}
</button>

<button
	type="button"
	onclick={openModal}
	aria-label="Open search"
	class="search-trigger flex lg:hidden!"
>
	{@render searchIcon(22)}
</button>

{#if isOpen}
	<div class="search-portal-root" use:portal>
		<!-- 遮罩层（portal 到 body，避免被滚动/transform 影响） -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="search-backdrop"
			role="presentation"
			onclick={(e) => { e.stopPropagation(); e.preventDefault(); closeModal(); }}
			onmousedown={(e) => { e.stopPropagation(); e.preventDefault(); closeModal(); }}
		></div>

		<!-- 弹窗（portal 到 body，始终在视口顶层） -->
		<div
			class="search-modal"
			role="dialog"
			aria-modal="true"
			aria-label="Search"
			tabindex="-1"
		>
		<div class="search-header">
			<div class="search-input-wrap">
				<span class="search-search-icon" aria-hidden="true">
					{@render searchIcon(20)}
				</span>
				<input
					bind:this={modalInputEl}
					bind:value={query}
					placeholder={labels.search}
					class="search-input"
					onkeydown={handleInputKeydown}
				/>
			</div>
		</div>

		<div class="search-body">
			{#if !initialized}
				<div class="search-empty">搜索服务未配置</div>
			{:else if isSearching}
				<div class="search-empty">{labels.searchLoading}</div>
			{:else if results.length === 0}
				<div class="search-empty">{labels.searchNoResults}</div>
			{:else}
				<div class="search-list" role="list" bind:this={listEl}>
					{#each results as item, idx}
						<a
							href={item.url}
							class="search-item {idx === activeIndex ? 'is-active' : ''}"
							onclick={(e) => handleResultClick(e, item.url)}
							onmouseenter={() => (activeIndex = idx)}
						>
							<div class="search-title">
								{@html item.title}
							</div>
							{#if item.excerpt || item.description}
								<div class="search-excerpt">
									{@html item.excerpt || item.description}
								</div>
							{/if}
						</a>
					{/each}
				</div>

				{#if query.trim()}
				<div class="search-more">
					<div class="search-more-meta">
						已显示 {results.length}{nbHits ? ` / ${nbHits}` : ""}{nbHits ? " 条" : ""}
					</div>
					{#if hasMore}
						<button
							type="button"
							class="search-more-btn"
							onclick={loadMore}
							disabled={isLoadingMore}
						>
							{isLoadingMore ? "加载中…" : "加载更多"}
						</button>
					{/if}
				</div>
				{/if}
			{/if}
		</div>

		<footer class="docsearch-modal-footer">
			<ul class="docsearch-modal-footer-commands" role="list">
				<li>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
							<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
								<path
									d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
								></path>
								<path
									d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
								></path>
							</g>
						</svg>
					</kbd>
					<span class="docsearch-modal-footer-commands-label">{labels.searchKbdSelect}</span>
				</li>
				<li>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 4a1 1 0 0 1 1 1v11.586l4.293-4.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L11 16.586V5a1 1 0 0 1 1-1z"
							></path>
						</svg>
					</kbd>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 4a1 1 0 0 1 .707.293l6 6a1 1 0 0 1-1.414 1.414L13 7.414V19a1 1 0 1 1-2 0V7.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l6-6A1 1 0 0 1 12 4z"
							></path>
						</svg>
					</kbd>
					<span class="docsearch-modal-footer-commands-label">{labels.searchKbdSwitch}</span>
				</li>
				<li>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.2"
							>
								<path
									d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
								></path>
							</g>
						</svg>
					</kbd>
					<span class="docsearch-modal-footer-commands-label">{labels.announcementClose}</span>
				</li>
			</ul>
		</footer>
	</div>
	</div>
{/if}

<style>
	:global(mark) {
		background-color: color-mix(in oklch, var(--primary) 22%, transparent);
		color: var(--primary);
		padding: 0.1em 0.2em;
		border-radius: 3px;
		font-weight: 600;
	}

	.search-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.22);
		z-index: 2147483646;
	}
	:global(html.dark) .search-backdrop {
		background: rgba(0, 0, 0, 0.55);
	}

	.search-portal-root {
		position: fixed;
		inset: 0;
		z-index: 2147483647;
	}

	.search-modal {
		position: fixed;
		top: clamp(1rem, 8vh, 4rem);
		left: 50%;
		transform: translateX(-50%);
		width: min(560px, calc(100vw - 2rem));
		max-height: min(640px, calc(100vh - 2rem));
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.98);
		color: #111827;
		box-shadow:
			0 28px 90px rgba(0, 0, 0, 0.25),
			0 2px 0 rgba(255, 255, 255, 0.6) inset;
		z-index: 2147483647;
		border: 1px solid rgba(0, 0, 0, 0.06);
	}

	:global(html.dark) .search-modal {
		background: #1e293b;
		color: #e2e8f0;
		border: 1px solid rgba(148, 163, 184, 0.22);
		box-shadow:
			0 28px 90px rgba(0, 0, 0, 0.55),
			0 0 0 1px rgba(15, 23, 42, 0.5);
	}

	.search-header {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.75rem 0.75rem 0.6rem 0.75rem;
	}

	.search-input-wrap {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		border-radius: 8px;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(17, 24, 39, 0.12);
		box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);
	}
	:global(html.dark) .search-input-wrap {
		background: #0f172a;
		border: 1px solid rgba(148, 163, 184, 0.28);
		box-shadow: none;
	}
	.search-input-wrap:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 2px color-mix(in oklch, var(--primary) 28%, transparent);
	}
	:global(html.dark) .search-input-wrap:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 2px color-mix(in oklch, var(--primary) 32%, transparent);
	}

	.search-search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: rgba(17, 24, 39, 0.35);
		pointer-events: none;
	}
	:global(html.dark) .search-search-icon {
		color: #60a5fa;
	}

	/* 搜索触发按钮：仅图标 + 悬浮放大，参考 Ruyu-Blog 的搜索入口实现
	   注意：display 由 Tailwind 的 hidden/flex/lg:* 工具类控制，此处不设 display，
	   避免 Svelte 作用域样式的属性选择器特异性高于单类 .hidden 而覆盖响应式显隐 */
	.search-trigger {
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		margin-right: 0.25rem;
		border: none;
		border-radius: 9999px;
		background: none;
		cursor: pointer;
		transition: transform 0.3s linear;
	}
	.search-trigger:hover {
		transform: scale(1.12);
	}
	.search-trigger:active {
		transform: scale(0.94);
	}

	.search-trigger-icon {
		display: block;
		color: rgba(17, 24, 39, 0.55);
	}
	:global(html.dark) .search-trigger-icon {
		color: rgba(255, 255, 255, 0.7);
	}

	.search-input {
		width: 100%;
		height: 46px;
		padding: 0 0.75rem 0 2.85rem;
		background: transparent;
		border: 0;
		outline: 0;
		color: inherit;
		font-size: 1rem;
	}
	.search-input::placeholder {
		color: #64748b;
	}
	:global(html.dark) .search-input::placeholder {
		color: #94a3b8;
	}

	.search-body {
		padding: 0.35rem 0.5rem 0.5rem 0.5rem;
		overflow: auto;
		flex: 1 1 auto;
		min-height: 0;
	}

	.search-empty {
		padding: 0.75rem;
		opacity: 0.8;
		color: #4b5563;
	}
	:global(html.dark) .search-empty {
		color: #cbd5e1;
		opacity: 0.95;
	}

	.search-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.search-more {
		margin-top: 0.5rem;
		padding: 0.25rem 0.25rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.search-more-meta {
		font-size: 0.8rem;
		color: rgba(107, 114, 128, 1);
	}
	:global(html.dark) .search-more-meta {
		color: rgba(156, 163, 175, 1);
	}

	.search-more-btn {
		border: 1px solid rgba(17, 24, 39, 0.14);
		background: rgba(255, 255, 255, 1);
		border-radius: 8px;
		padding: 0.35rem 0.6rem;
		font-size: 0.8rem;
		color: rgba(55, 65, 81, 1);
		cursor: pointer;
	}
	.search-more-btn:hover {
		background: rgba(17, 24, 39, 0.04);
	}
	.search-more-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	:global(html.dark) .search-more-btn {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(31, 41, 55, 1);
		color: rgba(229, 231, 235, 1);
	}
	:global(html.dark) .search-more-btn:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.search-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 64px; /* 统一每条结果高度 */
		padding: 0.6rem 0.75rem;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		background: transparent;
		border: 1px solid rgba(17, 24, 39, 0.08);
		overflow: hidden;
	}
	.search-item:hover {
		background: rgba(17, 24, 39, 0.04);
		border-color: rgba(17, 24, 39, 0.14);
	}
	:global(html.dark) .search-item:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.16);
	}
	:global(html.dark) .search-item {
		border-color: rgba(255, 255, 255, 0.1);
	}

	.search-item.is-active {
		background: transparent;
		border-color: var(--primary);
	}
	:global(html.dark) .search-item.is-active {
		background: transparent;
		border-color: var(--primary);
	}
	.search-item.is-active :global(mark) {
		background-color: color-mix(in oklch, var(--primary) 25%, transparent);
		color: inherit;
	}

	.search-title {
		font-weight: 700;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		line-height: 1.2;
	}

	.search-excerpt {
		margin-top: 0.25rem;
		font-size: 0.9rem;
		opacity: 0.75;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		line-height: 1.2;
	}

	.docsearch-modal-footer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem 1rem;
		padding: 0.5rem 0.75rem;
		background: rgba(249, 250, 251, 1);
		border-top: 1px solid rgba(17, 24, 39, 0.08);
	}
	:global(html.dark) .docsearch-modal-footer {
		background: #0f172a;
		border-top: 1px solid rgba(148, 163, 184, 0.18);
	}

	.docsearch-modal-footer-commands {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		flex: 1;
		gap: 0.65rem 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.docsearch-modal-footer-commands li {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.docsearch-modal-footer-commands li:last-child {
		margin-left: auto;
	}
	.docsearch-modal-footer-commands-key {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5rem;
		height: 1.375rem;
		padding: 0 0.35rem;
		border-radius: 0.25rem;
		border: 1px solid #d1d5db;
		background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
		box-shadow:
			0 1px 1px rgba(15, 23, 42, 0.06),
			inset 0 -1px 0 rgba(15, 23, 42, 0.04);
		color: #374151;
		line-height: 1;
	}
	.docsearch-modal-footer-commands-key :global(svg) {
		display: block;
		flex-shrink: 0;
	}
	:global(html.dark) .docsearch-modal-footer-commands-key {
		border-color: rgba(148, 163, 184, 0.35);
		background: linear-gradient(180deg, #374151 0%, #1f2937 100%);
		color: #e5e7eb;
		box-shadow:
			0 1px 1px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}
	.docsearch-modal-footer-commands-label {
		font-size: 0.75rem;
		color: #6b7280;
		white-space: nowrap;
	}
	:global(html.dark) .docsearch-modal-footer-commands-label {
		color: #9ca3af;
	}

</style>
