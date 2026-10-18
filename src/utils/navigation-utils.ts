export function navigateToPage(
	url: string,
	options?: {
		replace?: boolean;
	},
): void {
	if (!url || typeof url !== "string") {
		return;
	}

	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("//")
	) {
		window.open(url, "_blank");
		return;
	}

	if (url.startsWith("#")) {
		const element = document.getElementById(url.slice(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		return;
	}

	if (typeof window !== "undefined" && window.swup) {
		try {
			if (options?.replace) {
				window.swup.navigate(url, { history: false });
			} else {
				window.swup.navigate(url);
			}
		} catch {
			fallbackNavigation(url, options);
		}
	} else {
		fallbackNavigation(url, options);
	}
}

function fallbackNavigation(
	url: string,
	options?: {
		replace?: boolean;
	},
): void {
	if (options?.replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}
