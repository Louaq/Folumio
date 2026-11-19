import "@/utils/page-scrollbar-init";
import { updateHomeBannerDescription } from "@/utils/home-banner-description";
import { pathsEqual, url } from "@/utils/navigation";
import { initPageFeatures } from "@/utils/page-features-init";

// The inline layout script handles first paint; these listeners live for the document lifetime.
const navbar = document.getElementById("navbar");
if (navbar) {
	const banner = document.querySelector<HTMLElement>(".banner-stage")!;
	let bannerHeight = banner.getBoundingClientRect().height;
	function updateNavbarHeroOverlap() {
		const scrollTop = Math.max(
			document.body.scrollTop,
			document.documentElement.scrollTop,
		);
		const overBanner = scrollTop < Math.max(0, bannerHeight - 64);
		const bannerScrolled = String(!overBanner);
		if (document.body.dataset.bannerScrolled !== bannerScrolled) {
			document.body.dataset.bannerScrolled = bannerScrolled;
		}
		if (navbar!.classList.contains("top-app-bar--transparent") !== overBanner) {
			navbar!.classList.toggle("top-app-bar--transparent", overBanner);
		}
		const scrolled = scrollTop > 16;
		if (navbar!.classList.contains("top-app-bar--scrolled") !== scrolled) {
			navbar!.classList.toggle("top-app-bar--scrolled", scrolled);
		}
	}
	function measureNavbarHeroOverlap() {
		bannerHeight = banner.getBoundingClientRect().height;
		updateNavbarHeroOverlap();
	}
	updateNavbarHeroOverlap();
	window.addEventListener("scroll", updateNavbarHeroOverlap, { passive: true });
	window.addEventListener("resize", measureNavbarHeroOverlap);
	document.addEventListener("swup:page:view", measureNavbarHeroOverlap);
	document.addEventListener("swup:visit:abort", measureNavbarHeroOverlap);
}

initPageFeatures().then(() => {
	document.dispatchEvent(new Event("folumio:page-features-ready"));
});
// Swup 导航后初始化页面功能。
document.addEventListener("astro:page-load", initPageFeatures);

function setClickOutsideToClose(panel: string, ignores: string[]) {
	document.addEventListener("click", (event) => {
		let panelDom = document.getElementById(panel);
		if (!panelDom) return;
		let tDom = event.target;
		if (!(tDom instanceof Node)) return; // Ensure the event target is an HTML Node
		for (let ig of ignores) {
			let ie = document.getElementById(ig);
			if (ie == tDom || ie?.contains(tDom)) {
				return;
			}
		}
		panelDom.classList.add("float-panel-closed");
	});
}
setClickOutsideToClose("nav-menu-panel", ["nav-menu-panel", "nav-menu-switch"]);
setClickOutsideToClose("search-panel", [
	"search-panel",
	"search-bar",
	"search-switch",
]);

// Navigation lifecycle ported from LyraVoid/Shirone Layout.astro (MIT).
let navigationBound = false;
const setup = () => {
	if (navigationBound) return;
	navigationBound = true;
	// Swup restores positions after replacing content, including history visits.
	history.scrollRestoration = "manual";
	window.swup.findPlugin(
		"SwupScrollPlugin",
	).options.animateScroll.betweenPages = false;
	let scrollStarted = false;
	let visitActive = false;
	let finishTimer: number | undefined;
	function finishVisit() {
		if (!visitActive) return;
		visitActive = false;
		window.clearTimeout(finishTimer);
		finishTimer = window.setTimeout(() => {
			document.getElementById("page-height-extend")?.classList.add("hidden");
		}, 200);
	}
	window.swup.hooks.on(
		"history:popstate",
		(visit: {
			animation: { animate: boolean; name?: string };
			history: { direction?: string };
			scroll: { reset: boolean };
		}) => {
			visit.animation.animate = true;
			if (visit.history.direction === "backwards") {
				visit.animation.name = "history-back";
			}
			visit.scroll.reset = true;
		},
	);
	window.swup.hooks.on("link:click", () =>
		document.documentElement.style.setProperty("--content-delay", "0ms"),
	);
	window.swup.hooks.on(
		"visit:start",
		(visit: {
			history: { popstate: boolean };
			to: { hash: string };
			scroll: { reset: boolean; target?: string | false };
		}) => {
			window.clearTimeout(finishTimer);
			visitActive = true;
			scrollStarted = false;
			document.getElementById("page-height-extend")?.classList.remove("hidden");
			if (
				!visit.history.popstate &&
				visit.scroll.reset &&
				!visit.to.hash &&
				!visit.scroll.target
			) {
				document
					.getElementById("navbar")!
					.classList.add("top-app-bar--transparent");
				document.body.dataset.bannerScrolled = "false";
			}
		},
	);
	window.swup.hooks.on("visit:end", () => {
		if (!scrollStarted) finishVisit();
	});
	window.swup.hooks.on("visit:abort", finishVisit);
	if (window.swup.hooks.exists("scroll:end")) {
		window.swup.hooks.on("scroll:start", () => {
			if (visitActive) scrollStarted = true;
		});
		window.swup.hooks.on("scroll:end", finishVisit);
	}
	const moduleKey = (s: HTMLScriptElement) => s.src || s.textContent;
	const executedModules = new Set(
		Array.from(
			document.querySelectorAll<HTMLScriptElement>('script[type="module"]'),
			moduleKey,
		),
	);
	// Module entries may be injected into the head; only new content needs classic inline scripts rerun.
	window.swup.hooks.on("content:replace", () => {
		for (const old of document.querySelectorAll<HTMLScriptElement>(
			'script[type="module"], #swup-container script:not([type="module"]), #left-sidebar-wrapper script:not([type="module"])',
		)) {
			if (old.type === "module") {
				const key = moduleKey(old);
				if (executedModules.has(key)) continue;
				executedModules.add(key);
			} else if (old.type || old.src) {
				continue;
			}
			const script = document.createElement("script");
			for (const { name, value } of Array.from(old.attributes)) {
				script.setAttribute(name, value);
			}
			script.textContent = old.textContent;
			old.replaceWith(script);
		}
	});
	window.swup.hooks.on("content:replace", (visit: { to: { url: string } }) => {
		// Swup animates both columns; first-load animations must not run again.
		document
			.querySelectorAll(
				"#left-sidebar .onload-animation, #swup-container .onload-animation",
			)
			.forEach((element) => element.classList.remove("onload-animation"));
		document.documentElement.classList.remove("is-reload");
		if (window.PostPageTOC) {
			window.PostPageTOC.manager?.cleanup();
			window.PostPageTOC.manager = null;
		}
		const isHomePage = pathsEqual(visit.to.url, url("/"));
		const toPathname = new URL(visit.to.url, window.location.href).pathname;
		const isPostPage = /\/posts\/.+/.test(toPathname);
		document.body.dataset.pageType = isHomePage
			? "home"
			: isPostPage
				? "post"
				: "page";

		document.body.classList.toggle("lg:is-home", isHomePage);
		document
			.getElementById("navbar")
			?.setAttribute("data-is-home", String(isHomePage));
		const banner = document.querySelector<HTMLElement>(".banner-stage")!;
		const carrier = document.getElementById("grid-class-carrier")!;
		const bannerTitle = banner.querySelector(".banner-stage__title")!;
		bannerTitle.textContent = carrier.dataset.bannerTitle!;
		if (isPostPage) bannerTitle.id = "post-title";
		else bannerTitle.removeAttribute("id");
		updateHomeBannerDescription(carrier.dataset.bannerDescription!, isHomePage);
		const metadata = document.getElementById(
			"banner-metadata-template",
		) as HTMLTemplateElement;
		banner
			.querySelector(".banner-stage__metadata")!
			.replaceChildren(metadata.content.cloneNode(true));
		banner.setAttribute("aria-label", carrier.dataset.bannerTitle!);

		const gridClass = carrier.dataset.gridClass!;
		const mainGrid = document.getElementById("main-grid")!;
		const currentClasses = mainGrid.className.split(" ");
		const newClasses = currentClasses.filter(
			(c) =>
				!c.startsWith("lg:grid-cols-") &&
				!c.startsWith("md:grid-cols-") &&
				!c.startsWith("grid-cols-"),
		);
		mainGrid.className = [...newClasses, ...gridClass.split(" ")].join(" ");
		document.body.dataset.whiteBg = carrier.dataset.whiteBg;
	});
};
if (window.swup?.hooks) setup();
else document.addEventListener("swup:enable", setup, { once: true });

if (document.body.dataset.pageType === "home") {
	updateHomeBannerDescription("", true);
}
