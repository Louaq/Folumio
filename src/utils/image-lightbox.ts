// Fancybox configuration and styling adapted from LyraVoid/Shirone (MIT).
import { Fancybox } from "@fancyapps/ui";
import { getDefaultFancyboxConfig } from "./fancybox-config";

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
