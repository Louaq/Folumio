import type { MetingSong } from "@/vendor/koharu/lib/meting";

type LocalSong = { id: number; name: string; artist: string; cover: string };
export type LocalMusicTrack = MetingSong & { id: number };

export async function resolveLocalPlaylist(
	source: string,
): Promise<LocalMusicTrack[]> {
	const response = await fetch(source);
	if (!response.ok) throw new Error(`歌单加载失败 (${response.status})`);
	const songs: LocalSong[] = await response.json();
	return songs.map((song) => ({
		id: song.id,
		name: song.name,
		artist: song.artist,
		pic: song.cover,
		url: `/ncm/song/url/v1?id=${song.id}&level=standard`,
		lrc: "",
	}));
}

export async function resolveLocalAudio(
	track: LocalMusicTrack,
): Promise<string | null> {
	const call = () =>
		fetch(`/ncm/song/url/v1?id=${track.id}&level=standard`, {
			credentials: "same-origin",
			cache: "no-store",
		});
	await ensureMusicSession();
	let response = await call();
	if (response.status === 401) {
		await renewMusicSession();
		response = await call();
	}
	if (!response.ok) throw new Error(`音频接口请求失败 (${response.status})`);
	const { data } = await response.json();
	return data[0].url === null ? null : data[0].url.replace(/^http:/, "https:");
}

let sessionExpiresAt = 0;
let pendingSession: Promise<void> | null = null;

async function solveMusicChallenge(
	challenge: string,
	difficulty: number,
): Promise<number> {
	const encoder = new TextEncoder();
	for (let nonce = 0; ; nonce++) {
		const digest = new Uint8Array(
			await crypto.subtle.digest(
				"SHA-256",
				encoder.encode(`${challenge}:${nonce}`),
			),
		);
		let bits = 0;
		for (const byte of digest) {
			if (byte === 0) bits += 8;
			else {
				bits += Math.clz32(byte) - 24;
				break;
			}
		}
		if (bits >= difficulty) return nonce;
	}
}

async function createSession(): Promise<void> {
	const challengeResponse = await fetch("/ncm/token", {
		credentials: "same-origin",
		cache: "no-store",
	});
	if (!challengeResponse.ok)
		throw new Error(`音乐认证失败 (${challengeResponse.status})`);
	const { challenge, difficulty } = await challengeResponse.json();
	const nonce = await solveMusicChallenge(challenge, difficulty);
	const response = await fetch("/ncm/token", {
		method: "POST",
		credentials: "same-origin",
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ nonce }),
	});
	if (!response.ok) throw new Error(`音乐认证失败 (${response.status})`);
	const { ttl } = await response.json();
	sessionExpiresAt = Date.now() + (ttl - 30) * 1000;
}

function ensureMusicSession(): Promise<void> {
	if (Date.now() < sessionExpiresAt) return Promise.resolve();
	if (!pendingSession)
		pendingSession = createSession().finally(() => {
			pendingSession = null;
		});
	return pendingSession;
}

function renewMusicSession(): Promise<void> {
	sessionExpiresAt = 0;
	return ensureMusicSession();
}
