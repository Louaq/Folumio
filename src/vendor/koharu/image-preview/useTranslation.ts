const messages: Record<string, string> = {
	"common.loading": "加载中...",
	"image.preview": "图片预览",
	"image.loadError": "图片加载失败",
	"image.retry": "重试",
	"image.hintMobileGallery": "左右滑动切图 · 双指缩放 · 下滑关闭",
	"image.zoomIn": "放大",
	"image.zoomOut": "缩小",
	"image.resetZoom": "重置",
	"image.resetZoomRotate": "重置缩放和旋转",
	"image.rotate": "旋转 90°",
	"image.close": "关闭",
	"image.prev": "上一张",
	"image.next": "下一张",
	"image.counter": "{current} / {total}",
	"image.hintDesktop": "双击放大 · 滚轮缩放 · 点击空白关闭",
	"image.hintMobile": "双击或双指缩放 · 下滑或轻点空白关闭",
};
export function useTranslation() {
	return {
		t: (key: string, params: Record<string, string | number> = {}) =>
			Object.entries(params).reduce(
				(text, [name, value]) => text.replace(`{${name}}`, String(value)),
				messages[key],
			),
	};
}
