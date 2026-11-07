// Upstream: cosZone/astro-koharu, 329ce55513a8057708c93c11c5b8c096680ad83c.
// AGPL-3.0; modified 2026-11-07: imports adapted to local vendor directory.
/**
 * Shared media player hook for audio and video players.
 *
 * Encapsulates common playback logic: state management, event binding,
 * play mode cycling, track navigation, volume, and global mutex.
 * Audio/video specifics are abstracted via the `getElement` accessor.
 */

import { useStore } from "@nanostores/react";
import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	createPlaybackTimeStore,
	type PlaybackTimeStore,
} from "../lib/playback-time-store";
import {
	$activePlayerId,
	getStoredMode,
	getStoredVolume,
	type PlayMode,
	setStoredMode,
	setStoredVolume,
} from "../store/player";

export interface MediaPlayerState {
	playing: boolean;
	currentIndex: number;
	loading: boolean;
	error: string | null;
	mode: PlayMode;
	volume: number;
	muted: boolean;
}

export type { PlaybackTimeStore };

export interface UseMediaPlayerOptions<T> {
	tracks: T[];
	getUrl: (track: T) => string | null | Promise<string | null>;
	getElement: () => HTMLMediaElement | null;
}

export function useMediaPlayer<T>({
	tracks,
	getUrl,
	getElement,
}: UseMediaPlayerOptions<T>) {
	const playerId = useId();
	const activeId = useStore($activePlayerId);

	// Track the media element via callback-ref pattern so that the event-binding
	// effect re-runs when the element becomes available (handles video ref timing).
	const [boundElement, setBoundElement] = useState<HTMLMediaElement | null>(
		null,
	);

	const tracksRef = useRef(tracks);
	const getUrlRef = useRef(getUrl);
	const getElementRef = useRef(getElement);
	const loadAndPlayRef = useRef<
		(index: number, skipped?: number, resumeTime?: number) => void
	>(() => {});
	const [timeStore] = useState(() => createPlaybackTimeStore());

	const [state, setState] = useState<MediaPlayerState>({
		playing: false,
		currentIndex: 0,
		loading: false,
		error: null,
		mode: getStoredMode(),
		volume: getStoredVolume(),
		muted: false,
	});
	const stateRef = useRef(state);
	// Host adapter: ignore outdated asynchronous /ncm URL resolutions after a track change.
	const requestId = useRef(0);

	const loadAndPlay = useCallback(
		async (index: number, skipped = 0, resumeTime = 0) => {
			const el = getElementRef.current();
			const currentTracks = tracksRef.current;
			if (!el || !currentTracks[index]) return;
			const request = ++requestId.current;
			el.pause();
			el.removeAttribute("src");
			el.load();
			timeStore.reset();
			setState((s) => ({
				...s,
				currentIndex: index,
				loading: true,
				error: null,
			}));
			try {
				const url = await getUrlRef.current(currentTracks[index]);
				if (request !== requestId.current) return;
				if (url === null) {
					if (skipped + 1 === currentTracks.length) {
						setState((s) => ({
							...s,
							playing: false,
							loading: false,
							error: "歌单暂无可播放曲目",
						}));
					} else
						loadAndPlayRef.current(
							(index + 1) % currentTracks.length,
							skipped + 1,
						);
					return;
				}
				el.src = url;
				el.currentTime = resumeTime;
				await el.play();
				$activePlayerId.set(playerId);
			} catch (error) {
				if (request !== requestId.current) return;
				setState((s) => ({
					...s,
					playing: false,
					loading: false,
					error:
						error instanceof Error ? error.message : "Failed to load media",
				}));
			}
		},
		[playerId, timeStore],
	);

	useLayoutEffect(() => {
		tracksRef.current = tracks;
		getUrlRef.current = getUrl;
		getElementRef.current = getElement;
	}, [tracks, getUrl, getElement]);

	useLayoutEffect(() => {
		stateRef.current = state;
		loadAndPlayRef.current = loadAndPlay;
	}, [state, loadAndPlay]);

	// Poll for the media element becoming available (handles video ref timing).
	// Once resolved, setBoundElement triggers the event-binding effect below.
	useEffect(() => {
		const el = getElementRef.current();
		if (el) {
			setBoundElement(el);
			return;
		}
		// Element not yet available — poll until it is (e.g. video ref after first render)
		let unmounted = false;
		let attempts = 0;
		const MAX_ATTEMPTS = 100; // 5 seconds at 50ms intervals
		const id = setInterval(() => {
			if (unmounted) {
				clearInterval(id);
				return;
			}
			const resolved = getElementRef.current();
			if (resolved) {
				setBoundElement(resolved);
				clearInterval(id);
			} else if (++attempts >= MAX_ATTEMPTS) {
				clearInterval(id);
			}
		}, 50);
		return () => {
			unmounted = true;
			clearInterval(id);
		};
	}, []);

	// Bind media events — re-runs when boundElement changes from null → element
	useEffect(() => {
		const el = boundElement;
		if (!el) return;

		const onTimeUpdate = () => timeStore.setCurrentTime(el.currentTime);
		const onDurationChange = () => timeStore.setDuration(el.duration || 0);
		const onPlaying = () =>
			setState((s) => ({ ...s, playing: true, loading: false, error: null }));
		const onPause = () => setState((s) => ({ ...s, playing: false }));
		const onWaiting = () => setState((s) => ({ ...s, loading: true }));
		const onError = () => {
			const expired =
				el.src &&
				Number(new URL(el.src).searchParams.get("exp")) * 1000 <= Date.now();
			if (expired && stateRef.current.playing) {
				loadAndPlayRef.current(
					stateRef.current.currentIndex,
					0,
					el.currentTime,
				);
			} else
				setState((s) => ({
					...s,
					playing: false,
					loading: false,
					error: "音频加载失败",
				}));
		};
		const onEnded = () => {
			const currentTracks = tracksRef.current;
			const prev = stateRef.current;
			if (currentTracks.length === 0) {
				setState((s) => ({ ...s, playing: false }));
				return;
			}
			let nextIndex: number;
			if (prev.mode === "loop") {
				nextIndex = prev.currentIndex;
			} else if (prev.mode === "random") {
				nextIndex =
					currentTracks.length > 1
						? Math.floor(Math.random() * currentTracks.length)
						: 0;
			} else {
				nextIndex =
					prev.currentIndex + 1 >= currentTracks.length
						? 0
						: prev.currentIndex + 1;
			}
			loadAndPlayRef.current(nextIndex);
		};

		el.addEventListener("timeupdate", onTimeUpdate);
		el.addEventListener("durationchange", onDurationChange);
		el.addEventListener("playing", onPlaying);
		el.addEventListener("pause", onPause);
		el.addEventListener("waiting", onWaiting);
		el.addEventListener("error", onError);
		el.addEventListener("ended", onEnded);

		return () => {
			el.removeEventListener("timeupdate", onTimeUpdate);
			el.removeEventListener("durationchange", onDurationChange);
			el.removeEventListener("playing", onPlaying);
			el.removeEventListener("pause", onPause);
			el.removeEventListener("waiting", onWaiting);
			el.removeEventListener("error", onError);
			el.removeEventListener("ended", onEnded);
		};
	}, [boundElement, timeStore]);

	// Pause when another player starts
	useEffect(() => {
		if (activeId !== null && activeId !== playerId && state.playing) {
			getElementRef.current()?.pause();
		}
	}, [activeId, playerId, state.playing]);

	const play = useCallback(
		(index?: number) => {
			const el = getElementRef.current();
			if (!el || tracksRef.current.length === 0) return;
			const targetIndex = index ?? state.currentIndex;
			const expired =
				el.src &&
				Number(new URL(el.src).searchParams.get("exp")) * 1000 <= Date.now();
			if (index != null || !el.src || expired) {
				loadAndPlay(targetIndex, 0, index == null ? el.currentTime : 0);
			} else {
				el.play().catch((error: Error) =>
					setState((s) => ({
						...s,
						playing: false,
						loading: false,
						error: error.message,
					})),
				);
				$activePlayerId.set(playerId);
			}
		},
		[state.currentIndex, loadAndPlay, playerId],
	);

	const pause = useCallback(() => {
		requestId.current++;
		getElementRef.current()?.pause();
		setState((s) => ({ ...s, loading: false }));
	}, []);

	const togglePlay = useCallback(() => {
		if (state.playing || state.loading) pause();
		else play();
	}, [state.playing, state.loading, pause, play]);

	const nextTrack = useCallback(() => {
		const currentTracks = tracksRef.current;
		if (currentTracks.length === 0) return;
		let next: number;
		if (state.mode === "random") {
			next =
				currentTracks.length > 1
					? Math.floor(Math.random() * currentTracks.length)
					: 0;
		} else {
			next = (state.currentIndex + 1) % currentTracks.length;
		}
		loadAndPlay(next);
	}, [state.mode, state.currentIndex, loadAndPlay]);

	const prevTrack = useCallback(() => {
		const currentTracks = tracksRef.current;
		if (currentTracks.length === 0) return;
		let prev: number;
		if (state.mode === "random") {
			prev =
				currentTracks.length > 1
					? Math.floor(Math.random() * currentTracks.length)
					: 0;
		} else {
			prev =
				state.currentIndex - 1 < 0
					? currentTracks.length - 1
					: state.currentIndex - 1;
		}
		loadAndPlay(prev);
	}, [state.mode, state.currentIndex, loadAndPlay]);

	const seek = useCallback(
		(time: number) => {
			const el = getElementRef.current();
			if (el) {
				el.currentTime = time;
				timeStore.setCurrentTime(time);
			}
		},
		[timeStore],
	);

	const setVolume = useCallback((vol: number) => {
		const clamped = Math.max(0, Math.min(1, vol));
		const el = getElementRef.current();
		if (el) el.volume = clamped;
		setStoredVolume(clamped);
		setState((s) => ({ ...s, volume: clamped, muted: clamped === 0 }));
	}, []);

	const toggleMute = useCallback(() => {
		const el = getElementRef.current();
		if (!el) return;
		const newMuted = !state.muted;
		el.muted = newMuted;
		setState((s) => ({ ...s, muted: newMuted }));
	}, [state.muted]);

	const setMode = useCallback((mode: PlayMode) => {
		setStoredMode(mode);
		setState((s) => ({ ...s, mode }));
	}, []);

	return {
		state,
		timeStore,
		play,
		pause,
		togglePlay,
		nextTrack,
		prevTrack,
		seek,
		setVolume,
		toggleMute,
		setMode,
	};
}
