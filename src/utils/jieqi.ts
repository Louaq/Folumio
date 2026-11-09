const API_URL = "https://api.jieqi.louaq.com/v1/resolve?style=character";
const METADATA_KEY = `jieqi-current-event-v2:${API_URL}`;
const POSTER_CACHE = "jieqi-posters-v1";

interface JieqiEvent {
	key: string;
	category: "solar-term" | "festival" | "holiday";
	start: string;
	end: string;
	card: { name: string; image: string };
}

interface JieqiResult {
	date: string;
	currentTerm: JieqiEvent;
	popup: { candidates: JieqiEvent[] };
	nextCheckAt: string;
}

export async function loadJieqiPoster(cacheHours = 24) {
	const now = Date.now();
	const cacheMs = cacheHours * 60 * 60 * 1000;
	const stored = localStorage.getItem(METADATA_KEY);
	let metadata: { data: JieqiResult; expiresAt: number } | null = stored
		? JSON.parse(stored)
		: null;

	if (!metadata || now >= metadata.expiresAt) {
		const response = await fetch(API_URL, {
			credentials: "omit",
			cache: "no-store",
		});
		if (!response.ok) throw new Error("节气与节日信息加载失败");
		const data: JieqiResult = await response.json();
		metadata = {
			data,
			expiresAt: Math.min(now + cacheMs, Date.parse(data.nextCheckAt)),
		};
		localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
	}

	const { date, currentTerm, popup } = metadata.data;
	const event =
		popup.candidates.find(
			(candidate) =>
				candidate.category !== "solar-term" &&
				candidate.start <= date &&
				candidate.end >= date,
		) ?? currentTerm;
	const cache = await caches.open(POSTER_CACHE);
	let poster = await cache.match(event.card.image);
	let cachedAt = Number(poster?.headers.get("x-jieqi-cached-at"));

	if (!poster || now >= cachedAt + cacheMs) {
		const response = await fetch(event.card.image, {
			credentials: "omit",
			cache: "no-store",
		});
		if (!response.ok) throw new Error("海报加载失败");
		cachedAt = now;
		poster = new Response(await response.blob(), {
			headers: {
				"content-type": response.headers.get("content-type")!,
				"x-jieqi-cached-at": String(cachedAt),
			},
		});
		await cache.put(event.card.image, poster.clone());
	}

	return {
		event,
		image: await poster.blob(),
		refreshAt: Math.min(metadata.expiresAt, cachedAt + cacheMs),
	};
}
