// Adapted from cosZone/astro-koharu src/hooks/useGlideIndicator.ts (AGPL-3.0-only).
import { GLIDE_FEELS, glideAt, glideSpan, isGlideAtRest, stepGlide, type GlideState } from "./nav-glide";

export function setupNavbarGlide() {
	const container = document.querySelector<HTMLElement>("#navbar .navbar-menu-items")!;
	const indicator = container.querySelector<HTMLElement>(".navbar-indicator")!;
	const items = Array.from(container.querySelectorAll<HTMLElement>(":scope > .dropdown-container > .btn-plain"));
	const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let target: HTMLElement | null = null;
	let state: GlideState | null = null;
	let frame = 0;
	let lastTime = 0;

	function measure() {
		const box = container.getBoundingClientRect();
		const rect = target!.getBoundingClientRect();
		const scale = box.width / container.offsetWidth || 1;
		const origin = box.left + container.clientLeft * scale;
		return { left: (rect.left - origin) / scale, right: (rect.right - origin) / scale };
	}
	function paint(span: { left: number; right: number }) {
		indicator.style.translate = `${span.left}px 0`;
		indicator.style.width = `${Math.max(span.right - span.left, 0)}px`;
	}
	function snap() {
		if (!target || !container.offsetWidth) return;
		const span = measure();
		state = glideAt(span);
		paint(span);
	}
	function tick(now: number) {
		frame = 0;
		if (!target) return;
		const span = measure();
		state = stepGlide(state!, span, GLIDE_FEELS.lively, now - lastTime);
		lastTime = now;
		if (isGlideAtRest(state, span)) { snap(); return; }
		paint(glideSpan(state, GLIDE_FEELS.lively));
		frame = requestAnimationFrame(tick);
	}
	function moveTo(item: HTMLElement | null) {
		target = item;
		indicator.dataset.visible = String(item !== null);
		if (!item || motion.matches) {
			cancelAnimationFrame(frame);
			frame = 0;
			if (item) snap();
			return;
		}
		if (!state) { snap(); return; }
		if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(tick); }
	}
	function restoreActive() {
		moveTo(items.find((item) => item.classList.contains("navbar-link-active")) ?? null);
	}
	items.forEach((item) => {
		item.addEventListener("pointerenter", () => moveTo(item));
		item.addEventListener("focus", () => moveTo(item));
	});
	container.addEventListener("pointerleave", restoreActive);
	container.addEventListener("focusout", (event) => {
		if (!container.contains(event.relatedTarget as Node | null)) restoreActive();
	});
	container.addEventListener("click", () => queueMicrotask(restoreActive));
	const observer = new ResizeObserver(() => { if (!frame) snap(); });
	observer.observe(container);
	items.forEach((item) => observer.observe(item));
	motion.addEventListener("change", () => moveTo(target));
	document.addEventListener("astro:page-load", restoreActive);
	restoreActive();
}
