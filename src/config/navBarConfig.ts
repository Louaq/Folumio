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

	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}
	if (siteConfig.pages.circle) {
		links.push(LinkPreset.Circle);
	}
	if (siteConfig.pages.watchlist) {
		links.push(LinkPreset.Watchlist);
	}

	links.push(LinkPreset.About);

	links.push({
		name: "状态",
		url: "https://status.louaq.io/",
		external: true,
		icon: "material-symbols:satellite-alt-outline",
	});

	return { links } as NavBarConfig;
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
