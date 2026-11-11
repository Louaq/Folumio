import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
} from "../types/config";
import { siteConfig } from "./siteConfig";

const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: (NavBarLink | LinkPreset)[] = [
		LinkPreset.Home,
		LinkPreset.Articles,
	];

	// links.push({
	// 	name: "记录",
	// 	url: "",
	// 	icon: "material-symbols:article-outline",
	// 	children: [
	// 	{
	// 		name: "深度学习",
	// 		url: "/categories/深度学习/",
	// 		icon: "material-symbols:article-outline",
	// 	},
	// 	{
	// 		name: "latex",
	// 		url: "/categories/latex/",
	// 		icon: "material-symbols:article-outline",
	// 	},
	// 	{
	// 		name: "半监督",
	// 		url: "/categories/半监督医学图像分割/",
	// 		icon: "material-symbols:article-outline",
	// 	},
	//   ],
	// });

	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}

	if (siteConfig.pages.essays) {
		links.push(LinkPreset.Essays);
	}
	
	if (siteConfig.pages.watchlist) {
		links.push(LinkPreset.Watchlist);
	}

	links.push(LinkPreset.About);


// 	links.push({
// 	name: "更多",
// 	url: "/about/",
// 	icon: "material-symbols:folder-outline",
// 	children: [
// 		LinkPreset.About,
// 		LinkPreset.Watchlist,
// 		{
// 			name: "文章归档",
// 			url: "/archive/",
// 			icon: "material-symbols:folder-outline",
// 		},
// 		{
// 			name: "站点状态",
// 			url: "https://status.louaq.io/",
// 			external: true,
// 			icon: "material-symbols:satellite-alt-outline",
// 		},
// 	],
//    });

	links.push({
		name: "状态",
		url: "https://status.louaq.io/",
		external: true,
		icon: "material-symbols:satellite-alt-outline",
	});

	return { links } as NavBarConfig;
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
