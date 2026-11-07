import { navigateToPage } from "@/utils/navigation";

/**
 * 文章卡片的整卡点击跳转（原本内联在 PostCard.astro 的 <script> 里）。
 *
 * 卡片本身没有 <a>，跳转完全依赖这段委托脚本。而该组件只在列表页渲染，
 * 它的 <script> 也就只在列表页出现；swup 不会执行新页面的脚本，于是
 * 「先落地文章页 → 再点首页」时卡片会完全点不动。改由 Layout 常驻脚本调用。
 * 监听器挂在 document 上，重复调用会先移除再绑定，是幂等的。
 */
let mouseDownData: { x: number; y: number; target: HTMLElement | null } = {
	x: 0,
	y: 0,
	target: null,
};

function handlePostCardMouseDown(e: MouseEvent) {
	const card = (e.target as HTMLElement)?.closest<HTMLElement>(
		".post-card-wrapper[data-url]",
	);
	if (card) {
		mouseDownData = { x: e.clientX, y: e.clientY, target: card };
	}
}

function handlePostCardClick(e: MouseEvent) {
	const card = (e.target as HTMLElement)?.closest<HTMLElement>(
		".post-card-wrapper[data-url]",
	);
	if (!card) return;

	const url = card.getAttribute("data-url");
	if (!url) return;

	const target = e.target as HTMLElement;

	// 点击的是链接、按钮等交互元素时，由元素自己处理
	if (
		target.closest("a, button, input, textarea, select, label, [role='button']")
	) {
		return;
	}

	// 拖动选择文字时不跳转
	if (mouseDownData.target === card) {
		const dx = Math.abs(e.clientX - mouseDownData.x);
		const dy = Math.abs(e.clientY - mouseDownData.y);
		if (dx > 5 || dy > 5) return;
	}

	// 如果用户选中了文字，不跳转
	const selection = window.getSelection();
	if (selection && selection.toString().length > 0) return;

	// 中键 / Ctrl+Click / Cmd+Click 等组合在新窗口打开
	if (e.ctrlKey || e.metaKey || e.shiftKey || (e as MouseEvent).button === 1) {
		window.open(url, "_blank", "noopener");
		return;
	}

	navigateToPage(url);
}

function handlePostCardKeydown(e: KeyboardEvent) {
	if (e.key !== "Enter" && e.key !== " ") return;

	const card = (e.target as HTMLElement)?.closest<HTMLElement>(
		".post-card-wrapper[data-url]",
	);
	if (!card) return;

	const target = e.target as HTMLElement;
	if (target !== card && target.closest("a, button, input, textarea, select")) {
		return;
	}

	const url = card.getAttribute("data-url");
	if (url) {
		e.preventDefault();
		navigateToPage(url);
	}
}

export function initPostList(): void {
	initCoverImages();
	document.removeEventListener("mousedown", handlePostCardMouseDown);
	document.removeEventListener("click", handlePostCardClick);
	document.removeEventListener("keydown", handlePostCardKeydown);

	document.addEventListener("mousedown", handlePostCardMouseDown, {
		passive: true,
	});
	document.addEventListener("click", handlePostCardClick);
	document.addEventListener("keydown", handlePostCardKeydown);
}

const coverSelector = ".post-card-wrapper .cover-image-shell img";
const loadedCoverImages = new Map<string, Set<HTMLImageElement>>();

function coverKey(image: HTMLImageElement): string {
	return JSON.stringify([image.src, image.srcset, image.sizes]);
}

function rememberCover(image: HTMLImageElement): void {
	const key = coverKey(image);
	let images = loadedCoverImages.get(key);
	if (!images) {
		images = new Set();
		loadedCoverImages.set(key, images);
	}
	images.add(image);
	image.classList.add("is-loaded");
}

function handleCoverLoad(event: Event): void {
	const image = event.target;
	if (
		image instanceof HTMLImageElement &&
		image.matches(coverSelector) &&
		image.naturalWidth > 0
	) {
		rememberCover(image);
	}
}

function initCoverImages(): void {
	document.removeEventListener("load", handleCoverLoad, true);
	document.addEventListener("load", handleCoverLoad, true);

	for (const image of document.querySelectorAll<HTMLImageElement>(
		coverSelector,
	)) {
		const cachedImages = loadedCoverImages.get(coverKey(image));
		const cachedImage =
			cachedImages &&
			Array.from(cachedImages).find((cached) => !cached.isConnected);
		if (cachedImage) {
			// 保留已加载和解码的节点，避免后退时新建 lazy 图片再次请求和闪空。
			cachedImage.classList.add("cover-image-restored");
			image.replaceWith(cachedImage);
		} else if (image.complete && image.naturalWidth > 0) {
			image.classList.add("cover-image-restored");
			rememberCover(image);
		}
	}
}
