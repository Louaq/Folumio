import { TOCManager } from "@/utils/tocUtils";

/**
 * 文章页左侧的目录（原本内联在 PostPageTOC.astro 的 <script> 里）。
 *
 * 搬出来的原因有两条：
 * 1. 该组件只在文章页渲染，脚本也就只在文章页出现，swup 从非文章页导航过来时不会执行它；
 * 2. 原脚本监听的是 swup 3.x 的 swup:contentReplaced，本项目用的是 swup 4
 *    （事件名为 swup:content:replace），文章之间互相跳转时同样不会重新初始化。
 * 现在由 Layout 常驻脚本在每次导航后调用。目标容器不存在时直接返回，非文章页调用无副作用。
 */

export function initPostPageTOC(): void {
	window.PostPageTOC ??= { manager: null };
	const store = window.PostPageTOC;

	const tocContent = document.getElementById("post-page-toc-content");
	if (!tocContent) return;

	try {
		store.manager?.cleanup();

		store.manager = new TOCManager({
			contentId: "post-page-toc-content",
			indicatorId: "post-page-toc-indicator",
			maxLevel: 3,
		});

		store.manager.init();
	} catch (error) {
		console.error("Failed to load TOCManager for PostPageTOC:", error);
	}
}
