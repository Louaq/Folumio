const root = document.documentElement;
const rail = document.createElement("div");
const thumb = document.createElement("div");
rail.className = "page-scrollbar";
thumb.className = "page-scrollbar-thumb";
rail.tabIndex = 0;
rail.setAttribute("role", "scrollbar");
rail.setAttribute("aria-label", "页面滚动条");
rail.setAttribute("aria-orientation", "vertical");
rail.setAttribute("aria-valuemin", "0");
rail.setAttribute("aria-valuemax", "100");
rail.appendChild(thumb);
document.body.appendChild(rail);
root.classList.add("has-page-scrollbar");

let hideTimer: ReturnType<typeof setTimeout>;
let scrollRange = 0;
let thumbHeight = 0;

function updateScrollbar(): void {
	const height = root.clientHeight;
	scrollRange = root.scrollHeight - height;
	rail.hidden = scrollRange <= 0;
	if (rail.hidden) return;
	thumbHeight = Math.max(32, height * height / root.scrollHeight);
	const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
	thumb.style.height = `${thumbHeight}px`;
	thumb.style.transform = `translateY(${progress * (height - thumbHeight)}px)`;
	rail.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
}

window.addEventListener("scroll", () => {
	updateScrollbar();
	root.classList.add("is-page-scrolling");
	clearTimeout(hideTimer);
	hideTimer = setTimeout(() => {
		root.classList.remove("is-page-scrolling");
	}, 800);
}, { passive: true });

rail.onpointerdown = (event) => {
	if (event.button !== 0) return;
	event.preventDefault();
	rail.focus();
	rail.setPointerCapture(event.pointerId);
	rail.classList.add("dragging");
	const offset = event.target === thumb ? event.clientY - thumb.getBoundingClientRect().top : thumbHeight / 2;
	const move = (clientY: number) => {
		const progress = Math.min(1, Math.max(0, (clientY - offset) / (root.clientHeight - thumbHeight)));
		window.scrollTo({ top: progress * scrollRange, behavior: "instant" });
	};
	move(event.clientY);
	rail.onpointermove = (pointer) => move(pointer.clientY);
	rail.onpointerup = (pointer) => rail.releasePointerCapture(pointer.pointerId);
};
rail.onlostpointercapture = () => {
	rail.classList.remove("dragging");
	rail.onpointermove = null;
	rail.onpointerup = null;
};
rail.onkeydown = (event) => {
	const targets: Record<string, number> = {
		ArrowUp: window.scrollY - 40, ArrowDown: window.scrollY + 40,
		PageUp: window.scrollY - root.clientHeight, PageDown: window.scrollY + root.clientHeight,
		Home: 0, End: scrollRange,
	};
	if (!(event.key in targets)) return;
	event.preventDefault();
	window.scrollTo({ top: targets[event.key], behavior: "instant" });
};
window.addEventListener("resize", updateScrollbar);
new ResizeObserver(updateScrollbar).observe(document.body);
updateScrollbar();
