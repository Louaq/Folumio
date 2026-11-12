<script lang="ts">
import { navigateToPage } from "@utils/navigation";
import { onDestroy, onMount, tick } from "svelte";
import { cubicInOut } from "svelte/easing";
import { fade } from "svelte/transition";

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
}

let { initialOpen = false, labels }: Props = $props();

const MEILISEARCH_HOST =
	import.meta.env.PUBLIC_MEILISEARCH_HOST || "https://search.louaq.com";
const MEILISEARCH_SEARCH_KEY = import.meta.env.PUBLIC_MEILISEARCH_SEARCH_KEY;
const MEILISEARCH_INDEX_NAME =
	import.meta.env.PUBLIC_MEILISEARCH_INDEX_NAME || "blog";

/** 检索结果条目（doSearch / loadMore 共用的归一化结构） */
interface SearchHit {
	image: string;
	author: string;
	published: string;
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
	results = [];
	activeIndex = -1;
	page = 0;
	nbHits = 0;
	nbPages = 0;
	hasMore = false;
	isLoadingMore = false;
};

const closeModal = () => {
	isOpen = false;
};

const finishCloseModal = () => {
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

const transitionDuration = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200;

function modalTransition() {
	return {
		duration: transitionDuration(),
		easing: cubicInOut,
		css: (t: number) =>
			`opacity: ${t}; transform: translateX(-50%) translateY(${(1 - t) * 0.75}rem) scale(${0.96 + t * 0.04});`,
	};
}

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
					"image",
					"author",
					"published",
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
			image: hit.image as string,
			author: hit.author as string,
			published: hit.published as string,
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
		requestSeq++;
		results = [];
		activeIndex = -1;
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
		if (!_q.trim()) {
			void doSearch(_q, { reset: true });
			return;
		}
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
	<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" class="search-trigger-icon">
		<circle cx="10.5" cy="10.5" r="6.5" />
		<path d="m16 16 4.5 4.5" />
	</svg>
{/snippet}

<button
	type="button"
	aria-label="Open search"
	title={`${labels.search} · Ctrl K`}
	class="search-trigger hidden shrink-0 lg:flex"
	onclick={openModal}
>
	{@render searchIcon(20)}
</button>

<button
	type="button"
	onclick={openModal}
	aria-label="Open search"
	class="search-trigger flex lg:hidden!"
>
	{@render searchIcon(20)}
</button>

{#if isOpen}
	<div class="search-portal-root" use:portal>
		<!-- 遮罩层（portal 到 body，避免被滚动/transform 影响） -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="search-backdrop"
			transition:fade={{ duration: transitionDuration(), easing: cubicInOut }}
			role="presentation"
			onclick={(e) => { e.stopPropagation(); e.preventDefault(); closeModal(); }}
			onmousedown={(e) => { e.stopPropagation(); e.preventDefault(); closeModal(); }}
		></div>

		<!-- 弹窗（portal 到 body，始终在视口顶层） -->
		<div
			class="search-modal"
			transition:modalTransition
			onoutroend={finishCloseModal}
			role="dialog"
			aria-modal="true"
			aria-label="Search"
			tabindex="-1"
		>
		<div class="search-heading">
			<h2>{labels.search}</h2>
			<button type="button" class="search-close" aria-label={labels.announcementClose} onclick={closeModal}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
					<path d="m6 6 12 12M18 6 6 18" />
				</svg>
			</button>
		</div>
		<div class="search-header">
			<div class="search-input-wrap">
				<span class="search-search-icon" aria-hidden="true">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
						<circle cx="10.5" cy="10.5" r="7.5" />
						<path d="m16 16 5 5" />
					</svg>
				</span>
				<input
					bind:this={modalInputEl}
					bind:value={query}
					placeholder="输入关键字，按 Enter 搜索"
					aria-label={labels.search}
					class="search-input"
					onkeydown={handleInputKeydown}
				/>
			</div>
		</div>

		{#if query.trim()}
		<div class="search-body">
			{#if !initialized}
				<div class="search-empty">搜索服务未配置</div>
			{:else if isSearching}
				<div class="search-empty">{labels.searchLoading}</div>
			{:else if results.length === 0}
				<div class="search-empty">{labels.searchNoResults}</div>
			{:else}
				<div class="search-count">找到 {nbHits} 条结果</div>
				<div class="search-list" role="list" bind:this={listEl}>
					{#each results as item, idx}
						<a
							href={item.url}
							class="search-item {idx === activeIndex ? 'is-active' : ''}"
							onclick={(e) => handleResultClick(e, item.url)}
							onmouseenter={() => (activeIndex = idx)}
						>
							{#if item.image}
								<img class="search-thumbnail" src={item.image} alt="" width="96" height="96" loading="lazy" />
							{/if}
							<div class="search-content">
								<div class="search-result-heading">
									<div class="search-title">{@html item.title}</div>
									<span class="search-type">▤ 文章</span>
								</div>
								{#if item.description || item.excerpt}
									<div class="search-excerpt">{@html item.description || item.excerpt}</div>
								{/if}
								<div class="search-meta">
									<span>{item.author || ""}</span>
									{#if item.published}
										<time datetime={item.published}>{new Date(item.published).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</time>
									{/if}
								</div>
							</div>
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
		{/if}

		<footer class="search-footer">
			按 Esc 关闭 <span aria-hidden="true">·</span> 按 Ctrl/⌘ + K 打开
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
		background: rgb(0 0 0 / 40%);
		backdrop-filter: blur(4px);
		z-index: 2147483646;
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
		width: min(640px, calc(100vw - 2rem));
		max-height: min(640px, calc(100vh - 2rem));
		display: flex;
		flex-direction: column;
		border-radius: 16px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.98);
		color: #111827;
		box-shadow:
			0 28px 90px rgba(0, 0, 0, 0.25),
			0 2px 0 rgba(255, 255, 255, 0.6) inset;
		z-index: 2147483647;
	}

	:global(html.dark) .search-modal {
		background: #1e293b;
		color: #e2e8f0;
		box-shadow:
			0 28px 90px rgba(0, 0, 0, 0.55),
			0 0 0 1px rgba(15, 23, 42, 0.5);
	}

	.search-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 24px;
		border-bottom: 1px solid color-mix(in oklch, var(--primary) 22%, transparent);
		flex-shrink: 0;
	}
	.search-heading h2 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
	}
	.search-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: 0;
		background: transparent;
		color: #60606b;
		cursor: pointer;
	}
	.search-header {
		padding: 20px 20px 0;
		flex-shrink: 0;
	}
	.search-input-wrap {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 9px;
		border: 1px solid var(--primary);
	}
	.search-input-wrap:focus-within {
		border-color: var(--primary);
	}
	.search-search-icon {
		position: absolute;
		left: 12px;
		display: flex;
		color: #60606b;
		pointer-events: none;
	}
	:global(html.dark) .search-heading {
		border-color: rgba(148, 163, 184, 0.22);
	}
	:global(html.dark) .search-close,
	:global(html.dark) .search-search-icon {
		color: #cbd5e1;
	}
	:global(html.dark) .search-input-wrap {
		border-color: var(--primary);
	}

	/* 搜索触发按钮：仅图标 + 悬浮放大，参考 Ruyu-Blog 的搜索入口实现
	   注意：display 由 Tailwind 的 hidden/flex/lg:* 工具类控制，此处不设 display，
	   避免 Svelte 作用域样式的属性选择器特异性高于单类 .hidden 而覆盖响应式显隐 */
	.search-trigger {
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		border-radius: 9999px;
		background: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.search-trigger:focus {
		outline: none;
	}
	.search-trigger:hover {
		background: color-mix(in oklch, currentColor 8%, transparent);
	}
	.search-trigger:active {
		transform: scale(0.94);
	}

	.search-trigger-icon {
		display: block;
		color: inherit;
	}

	.search-input {
		width: 100%;
		height: 26px;
		padding: 0 12px 0 40px;
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
		padding: 24px 20px 0;
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
		gap: 12px;
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

	.search-count {
		margin: 0 8px 8px;
		font-size: 13px;
		opacity: 0.7;
	}
	.search-item {
		display: flex;
		align-items: center;
		gap: 20px;
		min-height: 152px;
		padding: 16px 20px;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		border: 1px solid color-mix(in oklch, var(--primary) 22%, transparent);
	}
	.search-item:hover,
	.search-item.is-active,
	.search-item:focus-visible {
		border-color: var(--primary);
		background: color-mix(in oklch, var(--primary) 4%, transparent);
	}
	.search-thumbnail {
		width: 96px;
		height: 96px;
		object-fit: cover;
		border-radius: 8px;
		flex-shrink: 0;
	}
	.search-content {
		flex: 1;
		min-width: 0;
	}
	.search-result-heading {
		display: flex;
		align-items: center;
		gap: 12px;
		justify-content: space-between;
	}
	.search-type {
		flex-shrink: 0;
		padding: 3px 8px;
		border-radius: 6px;
		font-size: 12px;
		color: var(--primary);
		background: color-mix(in oklch, var(--primary) 15%, transparent);
	}
	.search-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 20px;
		font-size: 12px;
		opacity: 0.7;
	}
	.search-content :global(mark) {
		background: transparent;
		color: var(--primary);
		padding: 0;
	}
	@media (max-width: 480px) {
		.search-item { gap: 12px; padding: 12px; }
		.search-thumbnail { width: 64px; height: 64px; }
		.search-result-heading { align-items: flex-start; gap: 8px; }
	}

	.search-title {
		font-size: 18px;
		font-weight: 700;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		line-height: 1.2;
	}

	.search-excerpt {
		margin-top: 10px;
		font-size: 14px;
		opacity: 0.7;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.65;
	}

	.search-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		padding: 12px 16px 18px;
		font-size: 13px;
		line-height: 20px;
		color: #71717a;
		flex-shrink: 0;
	}
	:global(html.dark) .search-footer {
		color: #94a3b8;
	}

</style>
