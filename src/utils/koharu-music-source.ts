import type { MetingSong } from "@/vendor/koharu/lib/meting";
import { ensureMusicSession, renewMusicSession } from "./music-session";

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
