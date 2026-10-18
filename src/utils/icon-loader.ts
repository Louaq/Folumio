/**
 * 图标加载管理器
 * 图标未就绪时露出 Icon.astro 的文本 fallback，就绪后换成真正的 iconify-icon。
 */

let bodyObserver: MutationObserver | null = null;

export function initIconLoader() {
	function initContainer(container: Element) {
		if (container.hasAttribute("data-icon-initialized")) return;
		container.setAttribute("data-icon-initialized", "true");

		const loadingIndicator = container.querySelector(
			"[data-loading-indicator]",
		) as HTMLElement;
		const iconElement = container.querySelector(
			"[data-icon-element]",
		) as HTMLElement;

		if (!loadingIndicator || !iconElement) return;

		function showIcon() {
			loadingIndicator.style.display = "none";
			iconElement.classList.remove("opacity-0");
			iconElement.classList.add("opacity-100");
		}

		// 图标数据命中缓存时，绑定之前 shadow DOM 就已经渲染好了，收不到 load 事件
		if (iconElement.shadowRoot?.children.length) {
			showIcon();
			return;
		}

		// 未就绪：先露出文本 fallback，等 iconify-icon 自己派发 load
		loadingIndicator.style.display = "inline-flex";
		iconElement.classList.remove("opacity-100");
		iconElement.classList.add("opacity-0");
		iconElement.addEventListener("load", showIcon, { once: true });
	}

	document.querySelectorAll("[data-icon-container]").forEach(initContainer);

	if (window.MutationObserver && !bodyObserver) {
		bodyObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const el = node as Element;
						if (el.hasAttribute?.("data-icon-container")) {
							initContainer(el);
						} else {
							el.querySelectorAll("[data-icon-container]").forEach(
								initContainer,
							);
						}
					}
				});
			});
		});

		bodyObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}
