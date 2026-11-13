/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * 内嵌视频播放（Video.js 10，@videojs/html），运行时按需加载，见 VideoEmbedRuntime.astro。
 * 用法：::video{src="https://..." poster="可选" title="可选"}
 * - src / url：视频直链（mp4/webm 等；.m3u8 走 hls.js）
 * - poster：封面图
 * - title：无障碍说明
 * 媒体元素由运行时插入：组件名 video 与 <video> 标签同名，这里输出 <video> 会被 rehype-components 再处理一遍。
 */
export function VideoEmbedComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("video" must be leaf: ::video{src="https://..."})',
		]);
	}

	const src = properties.src || properties.url;
	if (!src || typeof src !== "string") {
		return h(
			"p",
			{ class: "video-embed-error my-4 text-red-500" },
			"视频播放：缺少 src（或 url）属性。",
		);
	}

	return h(
		"video-player",
		{
			class: "video-embed not-prose my-6 block w-full max-w-full",
			poster: properties.poster,
			"data-video-src": src,
			"data-video-title": properties.title,
			// 元数据到达前隐藏，运行时在 loadedmetadata 时移除以淡入
			"data-loading": "",
		},
		// 不固定尺寸：高度随视频自身比例，避免黑边
		[h("video-skin", { style: "display: block; width: 100%; --media-border-radius: 12px;" })],
	);
}
