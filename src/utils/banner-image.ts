import type { ImageMetadata } from "astro";
import { posix } from "node:path";

export type BannerImage = { src: string; width?: number; height?: number };

const images = import.meta.glob<ImageMetadata>(
	"/src/{assets,content}/**/*.{png,jpg,jpeg,webp,gif,avif,svg}",
	{ import: "default" },
);

export async function resolveBannerImage(
	src: string,
	basePath = "/src",
): Promise<BannerImage> {
	if (src.startsWith("/") || /^https?:\/\//.test(src)) return { src };
	return images[posix.join(basePath, src)]();
}
