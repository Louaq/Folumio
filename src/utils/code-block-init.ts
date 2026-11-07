/**
 * 代码块复制按钮：点击后把图标换成对勾，3 秒后恢复。
 *
 * expressive-code 自带的反馈是一个绿色文字气泡（.feedback），是在点击后异步
 * （await navigator.clipboard.writeText 成功后）才插入 DOM 的，没法用 CSS
 * 提前拦住，纯 opacity 隐藏它也还留着节点。这里用 MutationObserver 监听，
 * 一旦它被插入就立刻整个删掉。事件委托 + 全局观察都挂在 document 上，
 * 不依赖枚举 DOM，swup 换页后新出现的复制按钮无需重新初始化。
 */

const COPIED_CLASS = "ec-copy-done";
const COPIED_DURATION_MS = 3000;
const FEEDBACK_SELECTOR = ".expressive-code .copy .feedback";

function scheduleRevert(button: HTMLElement): void {
	const prevTimer = button.dataset.copyTimer;
	if (prevTimer) window.clearTimeout(Number(prevTimer));

	const timerId = window.setTimeout(() => {
		button.classList.remove(COPIED_CLASS);
		delete button.dataset.copyTimer;
	}, COPIED_DURATION_MS);
	button.dataset.copyTimer = String(timerId);
}

function stripFeedbackBubbles(node: Node): void {
	if (!(node instanceof Element)) return;
	if (node.matches(FEEDBACK_SELECTOR)) {
		node.remove();
		return;
	}
	for (const el of node.querySelectorAll(FEEDBACK_SELECTOR)) el.remove();
}

function initCodeCopyFeedback(): void {
	if (document.documentElement.dataset.codeCopyFeedbackInit === "1") return;
	document.documentElement.dataset.codeCopyFeedbackInit = "1";

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const button = target.closest<HTMLElement>(".expressive-code .copy button");
		if (!button) return;

		button.classList.add(COPIED_CLASS);
		scheduleRevert(button);
	});

	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) stripFeedbackBubbles(node);
		}
	}).observe(document.body, { childList: true, subtree: true });
}

/**
 * 代码块全屏按钮（.ec-fullscreen，由 expressive-code-header-toolbar 插件注入标题栏）：
 * 点击后把所在的 figure.frame 铺满浏览器视口（不是系统级全屏），再点一次或按 Esc 退出。
 * 用 Popover API 把 figure 送进顶层（top layer），不受外层 content-visibility 的包含块
 * 和折叠容器 max-height 裁剪影响，折叠的长代码铺满时自然完整显示。
 * popover 属性只在打开期间挂上（常驻会被 UA 样式隐藏），关闭后摘掉。
 * 事件委托挂在 document 上，swup 换页后新出现的按钮无需重新初始化。
 */

function initCodeFullscreen(): void {
	if (document.documentElement.dataset.codeFullscreenInit === "1") return;
	document.documentElement.dataset.codeFullscreenInit = "1";

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const button = target.closest(".expressive-code .ec-fullscreen");
		if (!button) return;

		const figure = button.closest("figure") as HTMLElement;
		if (figure.matches(":popover-open")) {
			figure.hidePopover();
			return;
		}
		figure.popover = "auto";
		figure.showPopover();
	});

	// toggle 事件不冒泡，用捕获阶段在 document 上统一处理（含 Esc 关闭）
	document.addEventListener(
		"toggle",
		(event) => {
			const target = event.target as HTMLElement;
			if (
				(event as ToggleEvent).newState === "closed" &&
				target.matches(".expressive-code .frame")
			)
				target.removeAttribute("popover");
		},
		true,
	);
}

export function initCodeBlocks(): void {
	initCodeCopyFeedback();
	initCodeFullscreen();
}
