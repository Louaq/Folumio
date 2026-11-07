// Upstream: cosZone/astro-koharu @ 329ce55513a8057708c93c11c5b8c096680ad83c.
// AGPL-3.0; modified 2026-11-07: resolve audio URLs through the host API.
import { useCallback, useEffect, useRef } from "react";
import {
	resolveLocalAudio,
	type LocalMusicTrack,
} from "@/utils/koharu-music-source";
import { getStoredVolume } from "../store/player";
import { useMediaPlayer } from "./useMediaPlayer";

export function useAudioPlayer(tracks: LocalMusicTrack[]) {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audio = new Audio();
		audio.preload = "none";
		audio.volume = getStoredVolume();
		audioRef.current = audio;
		return () => {
			audio.pause();
			audio.src = "";
			audioRef.current = null;
		};
	}, []);

	const getElement = useCallback(() => audioRef.current, []);

	return useMediaPlayer({ tracks, getUrl: resolveLocalAudio, getElement });
}
