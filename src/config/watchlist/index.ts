import { animeItems } from "./animeConfig";
import { movieItems } from "./movieConfig";
import { tvItems } from "./tvConfig";
import type { WatchlistConfig } from "./types";

export type { WatchlistConfig, WatchlistItem } from "./types";

export const watchlistConfig: WatchlistConfig = {
	items: [...animeItems, ...movieItems, ...tvItems],
	display: {
		itemsPerPage: 24,
		sortBy: "date",
		sortOrder: "desc",
		showRating: true,
		showProgress: true,
	},
};
