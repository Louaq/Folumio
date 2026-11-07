// Host integration for astro-koharu's system reduced-motion setting.
import { useMediaQuery } from "./useMediaQuery";
export function useMotionLevel() {
	return useMediaQuery("(prefers-reduced-motion: reduce)")
		? "reduced"
		: "subtle";
}
