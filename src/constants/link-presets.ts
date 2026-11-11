import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: {
		name: i18n(I18nKey.home),
		url: "/",
		icon: "material-symbols:home-outline",
	},
	[LinkPreset.About]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:person-outline",
	},
	[LinkPreset.Archive]: {
		name: i18n(I18nKey.archive),
		url: "/archive/",
		icon: "material-symbols:folder-outline",
	},
	[LinkPreset.Articles]: {
		name: i18n(I18nKey.articles),
		url: "/archive/",
		icon: "material-symbols:article-outline",
		children: [LinkPreset.Archive, LinkPreset.Categories, LinkPreset.Tags],
	},
	[LinkPreset.Essays]: {
		name: i18n(I18nKey.essays),
		url: "/essays/",
		icon: "material-symbols:edit-note-outline",
	},
	[LinkPreset.Friends]: {
		name: i18n(I18nKey.friends),
		url: "/friends/",
		icon: "material-symbols:handshake-outline",
	},
	[LinkPreset.Watchlist]: {
		name: i18n(I18nKey.watchlist),
		url: "/watchlist/",
		icon: "material-symbols:movie-outline",
	},
	[LinkPreset.Categories]: {
		name: i18n(I18nKey.categories),
		url: "/categories/",
		icon: "material-symbols:folder-open-outline",
	},
	[LinkPreset.Tags]: {
		name: i18n(I18nKey.tags),
		url: "/tags/",
		icon: "material-symbols:sell-outline",
	},
};
