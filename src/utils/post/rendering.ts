const LOADING_CLASS = "markdown-img--loading";

function track(img: HTMLImageElement): void {
	// 已经处理过或已经加载完的，直接跳过
	if (img.dataset.mdImgTracked === "1") return;
	img.dataset.mdImgTracked = "1";

	if (img.complete && img.naturalWidth > 0) return;

	img.classList.add(LOADING_CLASS);

	const clear = () => {
		img.classList.remove(LOADING_CLASS);
		img.removeEventListener("load", clear);
		img.removeEventListener("error", clear);
	};

	img.addEventListener("load", clear);
	// 加载失败也要把模糊去掉，否则会留下一块糊掉的占位
	img.addEventListener("error", clear);
}

function initMarkdownImages(): void {
	const imgs = document.querySelectorAll<HTMLImageElement>(
		".custom-md img.markdown-img",
	);
	for (const img of imgs) {
		track(img);
	}
}

let pendingWarmup: number | null = null;
let resizeListenerBound = false;
let resizeTimeout: number | null = null;
let lastWarmedWidth = 0;

function collectDeferredBlocks(): HTMLElement[] {
	return Array.from(
		document.querySelectorAll<HTMLElement>(
			".custom-md .expressive-code, .custom-md .katex-display-container",
		),
	);
}

function renderOnceToRememberSizes(blocks: HTMLElement[]): void {
	for (const block of blocks) {
		block.style.contentVisibility = "visible";
	}
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			for (const block of blocks) {
				block.style.contentVisibility = "";
			}
		});
	});
}

function scheduleWarmup(): void {
	if (pendingWarmup !== null) {
		window.clearTimeout(pendingWarmup);
	}
	// Safari 未普遍支持 requestIdleCallback，直接调用会中断页面初始化和布局钩子注册。
	pendingWarmup = window.setTimeout(() => {
		pendingWarmup = null;
		// 等 web 字体就绪后再量：字体换用会改变换行数与块高，
		// 提前记住的尺寸会作废
		document.fonts.ready.then(() => {
			const blocks = collectDeferredBlocks();
			if (blocks.length === 0) return;
			lastWarmedWidth = window.innerWidth;
			renderOnceToRememberSizes(blocks);
		});
	}, 0);
}

export function warmBlocksBeforeElement(target: Element): void {
	const blocks = collectDeferredBlocks().filter(
		(block) =>
			target.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_PRECEDING,
	);
	if (blocks.length === 0) return;
	renderOnceToRememberSizes(blocks);
}

/**
 * 每次进入新页面（首载与 swup content:replace）调用。
 * 非文章页无匹配块，内部空转，无副作用。
 */
function warmUpDeferredBlocks(): void {
	scheduleWarmup();

	if (!resizeListenerBound) {
		resizeListenerBound = true;
		window.addEventListener("resize", () => {
			if (resizeTimeout !== null) {
				clearTimeout(resizeTimeout);
			}
			resizeTimeout = window.setTimeout(() => {
				resizeTimeout = null;
				// 仅宽度变化会改变换行与块高；移动端滚动引发的工具栏高度抖动忽略
				if (window.innerWidth !== lastWarmedWidth) {
					scheduleWarmup();
				}
			}, 300);
		});
	}
}

export function initPostRendering(post: HTMLElement): void {
	if (post.querySelector(".custom-md img.markdown-img")) initMarkdownImages();
	if (
		post.querySelector(
			".custom-md .expressive-code, .custom-md .katex-display-container",
		)
	)
		warmUpDeferredBlocks();
}
