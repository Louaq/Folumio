/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare global {
	interface ImportMetaEnv {
		readonly MEILI_MASTER_KEY: string;
		readonly PASSWORD: string;
	}

	interface Window {
		backToTop: () => void;
		__fireflyJumpTouchOutside: boolean;
		// swup is defined in global.d.ts
	}
}

export {};
