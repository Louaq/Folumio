import { musicConfig } from "@/config/musicConfig";
import { fetchMeting, type MetingSong } from "@/vendor/koharu/lib/meting";

type LocalSong = {
	id: number;
	name: string;
	artist: string;
	cover: string;
	lyrics?: string;
};
export type LocalMusicTrack = MetingSong & { id?: number };

export async function resolveLocalPlaylist(
	source: string,
): Promise<LocalMusicTrack[]> {
	if (musicConfig.source === "netease") {
		return fetchMeting(
			"netease",
			"playlist",
			musicConfig.netease.playlistId,
			musicConfig.netease.apiUrl,
		);
	}
	const response = await fetch(source);
	if (!response.ok) throw new Error(`歌单加载失败 (${response.status})`);
	const songs: LocalSong[] = await response.json();
	return songs.map((song) => ({
		id: song.id,
		name: song.name,
		artist: song.artist,
		pic: song.cover ? new URL(song.cover, musicConfig.apiBase).href : "",
		url: `${musicConfig.apiBase}/song/url/v1?id=${song.id}&level=${musicConfig.audioQuality}`,
		lrc: song.lyrics ? new URL(song.lyrics, musicConfig.apiBase).href : "",
	}));
}

export async function resolveLocalAudio(
	track: LocalMusicTrack,
): Promise<string | null> {
	if (musicConfig.source === "netease") return track.url;
	const response = await fetch(
		`${musicConfig.apiBase}/song/url/v1?id=${track.id}&level=${musicConfig.audioQuality}`,
		{ cache: "no-store" },
	);
	if (!response.ok) throw new Error(`音频接口请求失败 (${response.status})`);
	const { data } = await response.json();
	return data[0].url === null ? null : data[0].url.replace(/^http:/, "https:");
}
