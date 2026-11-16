// Fancybox configuration and styling adapted from LyraVoid/Shirone (MIT).
import { Fancybox, type FancyboxOptions } from "@fancyapps/ui";

/**
 * Adapted from https://github.com/LyraVoid/Shirone (MIT).
 * Copyright and license: src/vendor/shirone/LICENSE
 *
 * Fancybox 配置模块
 * 提供图片灯箱的选择器和默认选项
 */

// Fancybox 配置类型
type FancyboxConfig = Partial<FancyboxOptions>;

// 默认 Fancybox 配置
const getDefaultFancyboxConfig = (): FancyboxConfig => ({
	Carousel: {
		infinite: true,
		Lazyload: { preload: 3 },
		Thumbs: { showOnStart: false },
		Toolbar: {
			display: {
				left: ["counter"],
				middle: [
					"zoomIn",
					"zoomOut",
					"toggle1to1",
					"rotateCCW",
					"rotateCW",
					//"flipX",
					//"flipY",
					//"reset",
				],
				//right: ["autoplay", "fullscreen", "close"],
				right: ["fullscreen", "close"],
			},
		},
		Zoomable: {
			Panzoom: { maxScale: 3, minScale: 1 },
		},
	},
	dragToClose: true,
	keyboard: {
		Escape: "close",
		Delete: "close",
		Backspace: "close",
		PageUp: "next",
		PageDown: "prev",
		ArrowUp: "next",
		ArrowDown: "prev",
		ArrowRight: "next",
		ArrowLeft: "prev",
	},
});

export function open(images: { src: string; thumbSrc: string; thumbEl: HTMLImageElement; caption: string }[], startIndex: number) {
    const config = getDefaultFancyboxConfig();
    Fancybox.show(images, {
        ...config,
        startIndex,
        Carousel: { ...config.Carousel, transition: "slide" },
    });
}

export function close() {
    Fancybox.close();
}
