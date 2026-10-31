import type { HomeTopNoticeConfig, HomeTopNoticeItem } from "../types/config";

export const homeTopNoticeConfig: HomeTopNoticeConfig = {
	enable: true,
	// 轮播间隔（毫秒），只有多条通知时才有效
	switchInterval: 10000,
	items: [
		{
			title: "最新动态",
			content: "每晚23:00-24:00 进行维护，期间可能无法访问",
			link: {
				enable: false,
				text: "",
				url: "",
				external: false,
			},
		},
		{
			title: "每日一言",
			content: "天上白玉京，十二楼五城",
			link: {
				enable: false,
				text: "",
				url: "",
				external: false,
			},
		},
	],
};

/** 供布局与组件统一解析：启用且 content 非空的条目 */
export function getNormalizedHomeTopNoticeItems(): HomeTopNoticeItem[] {
	const cfg = homeTopNoticeConfig;
	if (!cfg.enable) return [];
	return (cfg.items ?? []).filter(
		(item) => (item?.content ?? "").trim() !== "",
	);
}
