import { useMediaQuery } from "./useMediaQuery";
export function useMotionLevel() {
	return useMediaQuery("(prefers-reduced-motion: reduce)") ? "reduced" : "full";
}
