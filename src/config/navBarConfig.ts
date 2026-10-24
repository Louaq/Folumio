import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 归档
		LinkPreset.Archive,
	];

	// 根据配置决定是否添加友链，在siteConfig关闭pages.friends时导航栏不显示友链
	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}

	// 根据配置决定是否添加观影清单页面
	if (siteConfig.pages.watchlist) {
		links.push(LinkPreset.Watchlist);
	}

	links.push({
		name: "配色",
		url: "/colors/",
		icon: "fluent-emoji-flat:artist-palette",
	});

	links.push(LinkPreset.About);

	// 监控（服务状态监控 + 探针监控）
	links.push({
		name: "状态",
		url: "https://status.louaq.io",
		external: true,
		icon: "fluent-emoji-flat:satellite-antenna",
	});


	// 构建子菜单，确保所有项都是有效的
	// const aboutChildren: (NavBarLink | LinkPreset)[] = [
	// 	LinkPreset.About,
	// ];

	// 根据配置添加子菜单项
	// if (siteConfig.pages.watchlist) {
	// 	aboutChildren.push(LinkPreset.Watchlist);
	// }

	// links.push({
	// 	name: "关于",
	// 	url: "/content/",
	// 	icon: "material-symbols:info",
	// 	children: aboutChildren,
	// });
	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
