import type { FooterConfig } from "../types/config";
import { profileConfig } from "./profileConfig";

export const footerConfig: FooterConfig = {
	copyright: { name: profileConfig.name, url: "/about/" },
	poweredBy: [
		{ name: "Astro", url: "https://astro.build" },
		{ name: "Folumio", url: "https://github.com/Louaq/Folumio" },
	],
	support: {
		name: "腾讯云",
		url: "https://cloud.tencent.com/",
		image: "/assets/images/tencent-cloud.svg",
	},
	navigation: [
		{ name: "关于", url: "/about/" },
		{ name: "框架", url: "https://github.com/Louaq/Folumio", external: true },
		{ name: "主页", url: "/" },
		{ name: "RSS 订阅", url: "/rss.xml", icon: "lucide:rss", noSwup: true },
		{ name: "站点地图", url: "/sitemap.xml", icon: "lucide:map", noSwup: true },
	],
	friendLinks: [
		{
			name: "穿梭虫洞",
			url: "https://www.foreverblog.cn/go.html",
			image: "/assets/images/wormhole_4_tp.gif",
			alt: "WORMHOLE",
			width: 80,
			height: 22,
		},
		{
			name: "开往友链接力",
			url: "https://www.travellings.cn/go.html",
			image: "/assets/images/kaiwang.gif",
			alt: "Travelling",
			width: 80,
			height: 20,
		},
	],

	// 页脚访客计数（Vercount：免注册，接口与不蒜子兼容）
	visitorCount: {
		enable: true, // 是否显示访客计数
		apiUrl: "https://events.vercount.one/api/v2/log", // 统计接口地址
		showSitePv: true, // 全站访问量
		showSiteUv: true, // 全站访客数
	},
};
