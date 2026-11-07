import type { TOCManager } from "@/utils/post/toc";

declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
		};
	}

	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: External library
		swup: any;
		fireflyCachedSubtitle?: string;
		PostPageTOC?: {
			manager: TOCManager | null;
		};
	}

	interface MediaQueryList {
		addListener(listener: (e: MediaQueryListEvent) => void): void;
		removeListener(listener: (e: MediaQueryListEvent) => void): void;
	}
}
