import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
} from "../types/config";
import { siteConfig } from "./siteConfig";
import { LinkPresets } from "../constants/link-presets";

const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: (NavBarLink | LinkPreset)[] = [

		LinkPreset.Home,
		{
			...LinkPresets[LinkPreset.Archive],
			name: "文章",
			children: [
				{ ...LinkPresets[LinkPreset.Archive], icon: "lucide:archive" },
				{ ...LinkPresets[LinkPreset.Categories], icon: "lucide:grid-2x2" },
				{ ...LinkPresets[LinkPreset.Tags], icon: "lucide:tags" },
			],
		},
	];

	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}
	if (siteConfig.pages.watchlist) {
		links.push(LinkPreset.Watchlist);
	}

	links.push(LinkPreset.About);

	links.push({
		name: "状态",
		url: "https://status.louaq.io",
		external: true,
		icon: "fluent-emoji-flat:satellite-antenna",
	});

	return { links } as NavBarConfig;
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
