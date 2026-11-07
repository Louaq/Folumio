// Extracted from astro-koharu Chinese translations; AGPL-3.0.
// Modified 2026-11-07: use the host site's Chinese locale.
const messages: Record<string, string> = {
	"media.play": "播放",
	"media.pause": "暂停",
	"media.mute": "静音",
	"media.unmute": "取消静音",
	"media.fullscreen": "全屏",
	"media.exitFullscreen": "退出全屏",
	"media.pictureInPicture": "画中画",
	"media.playbackSpeed": "播放速度",
	"media.download": "下载",
	"media.prevTrack": "上一曲",
	"media.nextTrack": "下一曲",
	"media.volume": "音量 {percent}%",
	"media.progress": "播放进度",
	"media.playModeOrder": "顺序播放",
	"media.playModeRandom": "随机播放",
	"media.playModeLoop": "单曲循环",
	"audio.loading": "加载播放列表…",
	"audio.loadError": "加载失败: {error}",
	"audio.retry": "重试",
	"audio.empty": "暂无曲目",
	"audio.listTab": "列表 {index}",
	"audio.closePanel": "关闭面板",
};
export function useTranslation() {
	return {
		t: (key: string, values: Record<string, string> = {}) =>
			Object.entries(values).reduce(
				(text, [name, value]) => text.replace(`{${name}}`, value),
				messages[key],
			),
	};
}
