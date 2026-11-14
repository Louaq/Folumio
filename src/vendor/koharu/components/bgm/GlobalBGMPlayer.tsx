// Upstream: cosZone/astro-koharu @ 329ce55513a8057708c93c11c5b8c096680ad83c.
// AGPL-3.0; modified 2026-11-07: local playlist adapter, isolated stores, local floating trigger.
/**
 * GlobalBGMPlayer — floating background music player panel.
 *
 * Audio element lives at the component top level (outside AnimatePresence)
 * so that music continues playing when the panel UI is closed.
 * The panel is rendered via AnimatePresence for smooth enter/exit transitions.
 *
 * Playlist resolution is lazy — only triggered on first panel open.
 */

import { LazyMotionProvider } from "@/vendor/koharu/components/common/LazyMotionProvider";
import {
	PlayerPlaylist,
	type PlaylistGroup,
} from "@/vendor/koharu/components/markdown/audio-player/PlayerPlaylist";
import { PlayerPreview } from "@/vendor/koharu/components/markdown/audio-player/PlayerPreview";
import { MediaControls } from "@/vendor/koharu/components/markdown/shared/MediaControls";
import {
	FloatingFocusManager,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useAudioPlayer } from "@/vendor/koharu/hooks/useAudioPlayer";
import { useIsMounted } from "@/vendor/koharu/hooks/useIsMounted";
import { useMotionLevel } from "@/vendor/koharu/hooks/useMotionLevel";
import { useTranslation } from "@/vendor/koharu/hooks/useTranslation";
import { Icon } from "@iconify/react";
import type { LocalMusicTrack as MetingSong } from "@/utils/koharu-music-source";
import { resolveLocalPlaylist } from "@/utils/koharu-music-source";
import { useStore } from "@nanostores/react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { $bgmPanelOpen, $bgmPlaying, closeBgmPanel } from "@/vendor/koharu/store/bgm";
import "@/vendor/koharu/lib/icons";

interface GlobalBGMPlayerProps {
	songsUrl: string;
}

export default function GlobalBGMPlayer({ songsUrl }: GlobalBGMPlayerProps) {
	const { t } = useTranslation();
	const isMounted = useIsMounted();
	const panelOpen = useStore($bgmPanelOpen);
	const motionDisabled = useMotionLevel() === "reduced";

	const [tracks, setTracks] = useState<MetingSong[]>([]);
	const [groups, setGroups] = useState<PlaylistGroup[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState(0);
	const [retryKey, setRetryKey] = useState(0);

	const [playlistRequested, setPlaylistRequested] = useState(false);

	useEffect(() => {
		if (panelOpen) setPlaylistRequested(true);
	}, [panelOpen]);

	// Closing the UI must not cancel the first request and leave subsequent openings stuck loading.
	// biome-ignore lint/correctness/useExhaustiveDependencies: retryKey intentionally triggers another request.
	useEffect(() => {
		if (!playlistRequested) return;
		let cancelled = false;
		setLoading(true);
		setError(null);

		async function resolve() {
			try {
				const allTracks = await resolveLocalPlaylist(songsUrl);
				if (!cancelled) {
					setTracks(allTracks);
					setGroups([
						{ title: "本地歌单", startIndex: 0, count: allTracks.length },
					]);
					setLoading(false);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load playlist",
					);
					setLoading(false);
				}
			}
		}

		resolve();
		return () => {
			cancelled = true;
		};
	}, [playlistRequested, songsUrl, retryKey]);

	// Audio hook at top level — Audio element persists across panel open/close
	const player = useAudioPlayer(tracks);
	useEffect(() => {
		$bgmPlaying.set(player.state.playing);
		return () => $bgmPlaying.set(false);
	}, [player.state.playing]);
	const currentTrack = tracks[player.state.currentIndex] ?? null;

	const isHidden = false;

	// floating-ui: dismiss on ESC / outside click
	const { refs, context } = useFloating({
		open: panelOpen && !isHidden,
		onOpenChange: (open) => {
			if (!open) closeBgmPanel();
		},
	});
	useEffect(() => {
		if (!panelOpen || loading) return;
		const list = refs.floating.current!.querySelector<HTMLDivElement>(
			".audio-player-song-list",
		);
		const current = list?.querySelector<HTMLButtonElement>(
			".audio-player-song-item.current",
		);
		if (!list || !current) return;
		list.scrollTop =
			current.offsetTop -
			list.offsetTop -
			(list.clientHeight - current.offsetHeight) / 2;
	}, [panelOpen, loading, player.state.currentIndex, refs.floating]);
	const dismiss = useDismiss(context, {
		outsidePressEvent: "mousedown",
		// Exclude the BGM toggle button in FloatingGroup to prevent toggle/dismiss race
		outsidePress: (event) => {
			const target = event.target as HTMLElement;
			return !target.closest("[data-bgm-toggle]");
		},
	});
	const role = useRole(context, { role: "dialog" });
	const { getFloatingProps } = useInteractions([dismiss, role]);

	const renderPanelContent = () => {
		if (loading) {
			return (
				<output className="audio-player audio-player-loading bgm-panel-player">
					<div className="audio-player-preview">
						<div className="audio-player-disc-wrapper" aria-hidden="true">
							<div className="bgm-panel-placeholder bgm-panel-placeholder-cover" />
						</div>
						<div className="audio-player-info">
							<div className="audio-player-song-name bgm-panel-loading-label">
								<div className="audio-player-spinner" />
								<span>{t("audio.loading")}</span>
							</div>
							<div className="audio-player-artist" aria-hidden="true">
								<span className="bgm-panel-placeholder bgm-panel-placeholder-artist" />
							</div>
						</div>
					</div>
					<div className="audio-player-controls" aria-hidden="true">
						<div className="audio-player-buttons">
							{[0, 1, 2, 3].map((button) => (
								<span
									key={button}
									className="bgm-panel-placeholder bgm-panel-placeholder-button"
								/>
							))}
						</div>
						<div className="audio-player-progress" />
					</div>
					<div className="audio-player-playlist" aria-hidden="true">
						<div className="audio-player-tabs">
							<span className="bgm-panel-placeholder bgm-panel-placeholder-tab" />
							<span className="bgm-panel-placeholder bgm-panel-placeholder-tab" />
						</div>
						<div className="audio-player-song-list bgm-panel-placeholder-list">
							{[0, 1, 2, 3].map((row) => (
								<span key={row} className="bgm-panel-placeholder" />
							))}
						</div>
					</div>
				</output>
			);
		}

		if (error) {
			return (
				<div
					className="audio-player audio-player-error bgm-panel-player"
					role="alert"
				>
					<span>{t("audio.loadError", { error })}</span>
					<button
						type="button"
						className="audio-player-btn"
						onClick={() => setRetryKey((k) => k + 1)}
					>
						{t("audio.retry")}
					</button>
				</div>
			);
		}

		if (tracks.length === 0) {
			return (
				<div className="audio-player audio-player-empty bgm-panel-player">
					<span>{t("audio.empty")}</span>
				</div>
			);
		}

		return (
			<div className="audio-player not-prose bgm-panel-player bgm-panel-ready">
				<PlayerPreview
					track={currentTrack}
					playing={player.state.playing}
					timeStore={player.timeStore}
				/>
				<MediaControls
					playing={player.state.playing}
					loading={player.state.loading}
					mode={player.state.mode}
					volume={player.state.volume}
					muted={player.state.muted}
					timeStore={player.timeStore}
					onTogglePlay={player.togglePlay}
					onPrev={player.prevTrack}
					onNext={player.nextTrack}
					onSeek={player.seek}
					onSetMode={player.setMode}
					onSetVolume={player.setVolume}
					onToggleMute={player.toggleMute}
				/>
				{player.state.error && (
					<p className="koharu-playback-error" role="alert">
						{player.state.error}
					</p>
				)}
				<PlayerPlaylist
					tracks={tracks}
					groups={groups}
					currentIndex={player.state.currentIndex}
					timeStore={player.timeStore}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onTrackSelect={player.play}
					onSeek={player.seek}
				/>
			</div>
		);
	};

	return (
		<LazyMotionProvider>
			<AnimatePresence>
				{isMounted && panelOpen && !isHidden && (
					<FloatingFocusManager key="bgm-panel" context={context} modal={false}>
						<m.div
							ref={refs.setFloating}
							{...getFloatingProps()}
							id="koharu-bgm-panel"
							className="koharu-bgm-position"
							initial={
								motionDisabled ? false : { opacity: 0, y: 12, scale: 0.98 }
							}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={
								motionDisabled
									? { opacity: 0 }
									: { opacity: 0, y: 8, scale: 0.98 }
							}
							transition={
								motionDisabled
									? { duration: 0 }
									: { duration: 0.18, ease: "easeOut" }
							}
						>
							<div
								className="bgm-panel rounded-2xl shadow-xl"
								aria-busy={loading}
							>
								{/* Close button */}
								<button
									type="button"
									className="koharu-bgm-close"
									onClick={closeBgmPanel}
									aria-label={t("audio.closePanel")}
								>
									<Icon icon="ri:close-line" className="h-4 w-4" />
								</button>
								{renderPanelContent()}
							</div>
						</m.div>
					</FloatingFocusManager>
				)}
			</AnimatePresence>
		</LazyMotionProvider>
	);
}
