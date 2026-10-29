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

export function initCoverImages(): void {
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
