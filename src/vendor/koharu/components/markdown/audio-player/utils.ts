// Upstream: cosZone/astro-koharu, 329ce55513a8057708c93c11c5b8c096680ad83c.
// AGPL-3.0; modified 2026-11-07: imports adapted to local vendor directory.
export function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
