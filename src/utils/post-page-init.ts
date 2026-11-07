import { downloadMarkdown } from "./markdown-download";

function initPostShare(post: HTMLElement): void {
	let copyResetTimer: ReturnType<typeof setTimeout>;
	const button = post.querySelector<HTMLButtonElement>("#post-share")!;

	button.onclick = async () => {
		const label = button.querySelector("[data-share-label]")!;
		try {
			await navigator.clipboard.writeText(button.dataset.url!);
			label.textContent = button.dataset.copied!;
			button.title = button.dataset.copied!;
			clearTimeout(copyResetTimer);
			copyResetTimer = setTimeout(() => {
				label.textContent = button.dataset.label!;
				button.title = button.getAttribute("aria-label")!;
			}, 3000);
		} catch {
			label.textContent = button.dataset.failed!;
			button.title = button.dataset.failed!;
		}
	};
}

function initMarkdownCopy(post: HTMLElement): void {
	const button = post.querySelector<HTMLButtonElement>("#post-copy-markdown");
	if (!button) return;
	const actions = button.closest<HTMLElement>(".markdown-actions")!;
	const menu = actions.querySelector("details")!;
	actions.querySelector<HTMLButtonElement>("[data-download-markdown]")!.onclick = () => {
		downloadMarkdown(actions.dataset.markdown!, actions.dataset.title!);
		menu.open = false;
	};
	actions.querySelector<HTMLAnchorElement>("[data-open-studio]")!.onclick = () => {
		sessionStorage.setItem("studio-import", JSON.stringify({ title: actions.dataset.title, markdown: actions.dataset.markdown }));
		menu.open = false;
	};
	menu.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			menu.open = false;
			menu.querySelector("summary")!.focus();
		}
	});
	const closeOutside = (event: MouseEvent) => {
		if (!actions.isConnected) document.removeEventListener("click", closeOutside);
		else if (!actions.contains(event.target as Node)) menu.open = false;
	};
	document.addEventListener("click", closeOutside);
	let resetTimer: ReturnType<typeof setTimeout>;
	button.onclick = async () => {
		const label = button.querySelector("[data-copy-label]")!;
		clearTimeout(resetTimer);
		try {
			await navigator.clipboard.writeText(actions.dataset.markdown!);
			label.textContent = "已复制";
		} catch {
			label.textContent = "复制失败，请重试";
		}
		resetTimer = setTimeout(() => {
			label.textContent = "复制 Markdown";
		}, 3000);
	};
}

function initCustomScrollbar() {
	const katexElements = document.querySelectorAll(
		".katex-display:not([data-scrollbar-initialized])",
	) as NodeListOf<HTMLElement>;
	katexElements.forEach((element) => {
		if (!element.parentNode) return;

		const container = document.createElement("div");
		container.className = "katex-display-container";
		element.parentNode.insertBefore(container, element);
		container.appendChild(element);

		container.style.cssText = `
			overflow-x: auto;
		`;

		element.setAttribute("data-scrollbar-initialized", "true");
	});
}

export function initPostPage(post: HTMLElement): void {
	initPostShare(post);
	initMarkdownCopy(post);
	initCustomScrollbar();

	if (document.getElementById("post-page-toc-content")) {
		void import("./post-page-toc-init").then(({ initPostPageTOC }) => {
			if (post.isConnected) initPostPageTOC();
		});
	}
	if (post.querySelector(".custom-md img.markdown-img")) {
		void import("./markdown-image-init").then(({ initMarkdownImages }) => {
			if (post.isConnected) initMarkdownImages();
		});
	}
	if (post.querySelector(".expressive-code")) {
		void import("./code-copy-feedback-init").then(
			({ initCodeCopyFeedback }) => {
				if (post.isConnected) initCodeCopyFeedback();
			},
		);
		void import("./code-fullscreen-init").then(({ initCodeFullscreen }) => {
			if (post.isConnected) initCodeFullscreen();
		});
	}
	if (
		post.querySelector(
			".custom-md .expressive-code, .custom-md .katex-display-container",
		)
	) {
		void import("./deferred-block-warmup").then(({ warmUpDeferredBlocks }) => {
			if (post.isConnected) warmUpDeferredBlocks();
		});
	}
}
