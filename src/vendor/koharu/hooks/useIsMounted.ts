// Upstream: cosZone/astro-koharu, 329ce55513a8057708c93c11c5b8c096680ad83c.
// AGPL-3.0; modified 2026-11-07: imports adapted to local vendor directory.
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsMounted() {
	return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
