import { atom } from "nanostores";
import type { LightboxOrigin } from "./lightbox-flip";
export interface ImageLightboxData {
	src: string;
	alt: string;
	/** `origin` is the on-page geometry captured at open time, used to zoom in and back out. */
	images: { src: string; alt: string; origin?: LightboxOrigin }[];
	currentIndex: number;
}

export const $imageLightboxData = atom<ImageLightboxData | null>(null);
let previousOverflow = "";
export function openImage(data: ImageLightboxData) {
	previousOverflow = document.body.style.overflow;
	document.body.style.overflow = "hidden";
	$imageLightboxData.set(data);
}
export function closeModal() {
	if (!$imageLightboxData.get()) return;
	document.body.style.overflow = previousOverflow;
	$imageLightboxData.set(null);
}
export function navigateImage(direction: 1 | -1): boolean {
	const data = $imageLightboxData.get();
	if (!data) return false;
	const newIndex = data.currentIndex + direction;
	if (newIndex < 0 || newIndex >= data.images.length) return false;
	const target = data.images[newIndex];
	$imageLightboxData.set({
		...data,
		src: target.src,
		alt: target.alt,
		currentIndex: newIndex,
	});
	return true;
}
