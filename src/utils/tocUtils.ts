/**
 * TOC (Table of Contents) 工具类
 * 用于 SidebarTOC 和 FloatingTOC 的共享逻辑
 */

import { warmBlocksBeforeElement } from "@/utils/deferred-block-warmup";

/**
 * TOC 空状态文案。
 *
 * 刻意不 import `@i18n/translation`：本模块只跑在客户端，而那个模块静态引用了
 * 全部 5 种语言（打包后 ~44KB），为一个字符串把它拖进每个页面的首屏 JS 不划算。
 * 文案由 ConfigCarrier.astro 在服务端写进 `#config-carrier[data-toc-empty]`。
 */
function getTocEmptyLabel(): string {
	const carrier = document.getElementById("config-carrier");
	return carrier?.dataset.tocEmpty || "No headings found";
}

export interface TOCConfig {
	contentId: string;
	indicatorId: string;
	maxLevel?: number;
}

export class TOCManager {
	private tocItems: HTMLElement[] = [];
	private observer: IntersectionObserver | null = null;
	private minDepth = 10;
	private maxLevel: number;
	// 目录要跟随的活动项：滚动途中只记录，等正文停下（scrollend）再滚目录，
	// 这样点击目录引起的平滑滚动不会让目录被途经的标题来回拉扯
	private followItem: HTMLElement | null = null;
	private contentId: string;
	private indicatorId: string;

	constructor(config: TOCConfig) {
		this.contentId = config.contentId;
		this.indicatorId = config.indicatorId;
		this.maxLevel = config.maxLevel || 3;
	}

	private getContentContainer(): Element | null {
		return (
			document.querySelector(".custom-md") ||
			document.querySelector(".prose") ||
			document.querySelector(".markdown-content")
		);
	}

	private getAllHeadings(): HTMLElement[] {
		const contentContainer = this.getContentContainer();
		if (!contentContainer) {
			return [];
		}
		return Array.from(
			contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		);
	}

	private calculateMinDepth(headings: HTMLElement[]): number {
		let minDepth = 10;
		headings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			minDepth = Math.min(minDepth, depth);
		});
		return minDepth;
	}

	private filterHeadings(headings: HTMLElement[]): HTMLElement[] {
		return headings.filter((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			return depth < this.minDepth + this.maxLevel;
		});
	}

	/**
	 * 获取标题的纯文本内容（排除 script/style 标签的文本）
	 */
	private getCleanTextContent(element: HTMLElement): string {
		const clone = element.cloneNode(true) as HTMLElement;
		for (const el of clone.querySelectorAll("script, style")) {
			el.remove();
		}
		return clone.textContent || "";
	}

	/**
	 * 转义 HTML 属性值，避免标题中的引号破坏属性
	 */
	private escapeHtmlAttr(value: string): string {
		return value
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	private getEmptyStateHTML(): string {
		return `<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>${getTocEmptyLabel()}</p></div>`;
	}

	public generateTOCHTML(): string {
		const headings = this.getAllHeadings();

		if (headings.length === 0) {
			return this.getEmptyStateHTML();
		}

		this.minDepth = this.calculateMinDepth(headings);
		const filteredHeadings = this.filterHeadings(headings);

		if (filteredHeadings.length === 0) {
			return this.getEmptyStateHTML();
		}

		let tocHTML = "";

		filteredHeadings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			const depthLevel =
				depth === this.minDepth ? 0 : depth === this.minDepth + 1 ? 1 : 2;

			if (!heading.id) {
				return;
			}

			let headingText = this.getCleanTextContent(heading)
				.replace(/#+\s*$/, "")
				.trim();

			// Fallback for empty text (e.g. dynamic subtitle)
			if (!headingText) {
				const dataSubtitles = heading.getAttribute("data-subtitles");
				if (dataSubtitles) {
					try {
						const subtitles = JSON.parse(dataSubtitles);
						headingText = Array.isArray(subtitles) ? subtitles[0] : subtitles;
					} catch {
						// ignore
					}
				}
			}

			if (!headingText) {
				headingText =
					heading.id === "banner-subtitle" ? "Banner Subtitle" : heading.id;
			}

			const escapedHeadingText = this.escapeHtmlAttr(headingText);

			tocHTML += `
        <a
          href="#${heading.id}"
			  class="toc-item toc-level-${depthLevel}"
          data-heading-id="${heading.id}"
		  aria-label="${escapedHeadingText}"
		  title="${escapedHeadingText}"
        >
			  <div class="toc-label ${depth <= this.minDepth + 1 ? "toc-label-primary" : "toc-label-secondary"}">${headingText}</div>
        </a>
      `;
		});

		tocHTML += `<div id="${this.indicatorId}" style="opacity: 0;" class="toc-active-indicator"></div>`;

		return tocHTML;
	}

	public updateTOCContent(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		tocContent.innerHTML = this.generateTOCHTML();
		this.tocItems = Array.from(
			document.querySelectorAll(`#${this.contentId} a`),
		);
	}

	private getVisibleHeadingIds(): string[] {
		const headings = this.getAllHeadings();
		const visibleHeadingIds: string[] = [];

		headings.forEach((heading) => {
			if (heading.id) {
				const rect = heading.getBoundingClientRect();
				const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

				if (isVisible) {
					visibleHeadingIds.push(heading.id);
				}
			}
		});

		// 如果没有可见标题，选择最接近屏幕顶部的标题
		if (visibleHeadingIds.length === 0 && headings.length > 0) {
			let closestHeading: string | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			headings.forEach((heading) => {
				if (heading.id) {
					const rect = heading.getBoundingClientRect();
					const distance = Math.abs(rect.top);

					if (distance < minDistance) {
						minDistance = distance;
						closestHeading = heading.id;
					}
				}
			});

			if (closestHeading) {
				visibleHeadingIds.push(closestHeading);
			}
		}

		return visibleHeadingIds;
	}

	public updateActiveState(): void {
		if (this.tocItems.length === 0) return;

		this.tocItems.forEach((item) => {
			item.classList.remove("visible", "active");
		});

		const visibleHeadingIds = this.getVisibleHeadingIds();

		const activeItems = this.tocItems.filter((item) => {
			const headingId = item.dataset.headingId;
			return headingId && visibleHeadingIds.includes(headingId);
		});

		activeItems.forEach((item) => {
			item.classList.add("visible");
		});
		// 当前所在章节：视口内第一个标题
		activeItems[0]?.classList.add("active");

		this.updateActiveIndicator(activeItems);
	}

	private updateActiveIndicator(activeItems: HTMLElement[]): void {
		const indicator = document.getElementById(this.indicatorId);
		if (!indicator || !this.tocItems.length) return;

		if (activeItems.length === 0) {
			indicator.style.opacity = "0";
			return;
		}

		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		const contentRect = tocContent.getBoundingClientRect();
		const firstActive = activeItems[0];
		const lastActive = activeItems[activeItems.length - 1];

		const firstRect = firstActive.getBoundingClientRect();
		const lastRect = lastActive.getBoundingClientRect();

		const top = firstRect.top - contentRect.top;
		const height = lastRect.bottom - firstRect.top;

		indicator.style.top = `${top}px`;
		indicator.style.height = `${height}px`;
		indicator.style.opacity = "1";

		this.followItem = firstActive;
	}

	private scrollToActiveItem = (): void => {
		const activeItem = this.followItem;
		if (!activeItem) return;

		const tocContainer = document
			.querySelector(`#${this.contentId}`)
			?.closest(".toc-scroll-container");
		if (!tocContainer) return;

		const containerRect = tocContainer.getBoundingClientRect();
		const itemRect = activeItem.getBoundingClientRect();

		// 只在元素不在可视区域时才滚动
		const isVisible =
			itemRect.top >= containerRect.top &&
			itemRect.bottom <= containerRect.bottom;

		if (!isVisible) {
			const itemOffsetTop = activeItem.offsetTop;
			const containerHeight = tocContainer.clientHeight;
			const itemHeight = activeItem.clientHeight;

			const targetScroll = itemOffsetTop - containerHeight / 2 + itemHeight / 2;

			tocContainer.scrollTo({
				top: targetScroll,
				behavior: "smooth",
			});
		}
	};

	public handleClick(event: Event): void {
		event.preventDefault();
		const target = event.currentTarget as HTMLAnchorElement;
		const id = decodeURIComponent(
			target.getAttribute("href")?.substring(1) || "",
		);
		const targetElement = document.getElementById(id);

		if (targetElement) {
			// 落点准确性依赖三件事：
			// 1. warmBlocksBeforeElement 在这里同步强制渲染目标之前的重型块，不依赖
			//    空闲期预热是否已经跑完，跳转前把目标之前的坐标钉死；
			// 2. deferred-block-warmup 在空闲期也让全文 content-visibility: auto 的
			//    重型块各渲染一次并记住真实尺寸，覆盖鼠标滚轮/URL hash 等非点击路径；
			// 3. scrollIntoView 把目标自身的 c-v 祖先链强制渲染后再计算落点。
			// 顶栏偏移交给 CSS 的 scroll-margin-top（markdown.css 中标题已设置），
			// 不要退回手写 getBoundingClientRect + scrollTo 减偏移的方案。
			warmBlocksBeforeElement(targetElement);
			targetElement.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	}

	public setupObserver(): void {
		const headings = this.getAllHeadings();

		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = new IntersectionObserver(
			() => {
				this.updateActiveState();
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0,
			},
		);

		headings.forEach((heading) => {
			if (heading.id) {
				this.observer?.observe(heading);
			}
		});
	}

	public bindClickEvents(): void {
		this.tocItems.forEach((item) => {
			item.addEventListener("click", this.handleClick.bind(this));
		});
	}

	public cleanup(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		window.removeEventListener("scrollend", this.scrollToActiveItem);
	}

	public init(): void {
		this.updateTOCContent();
		this.bindClickEvents();
		this.setupObserver();
		this.updateActiveState();
		this.scrollToActiveItem();
		window.addEventListener("scrollend", this.scrollToActiveItem);
	}
}

export function isPostPage(): boolean {
	return window.location.pathname.includes("/posts/");
}
