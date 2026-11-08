// 观影清单主配置文件
// 整合所有类型的观影记录

import { animeItems } from "./animeConfig";
import { movieItems } from "./movieConfig";
import { tvItems } from "./tvConfig";
import type { WatchlistConfig } from "./types";

// 导出类型定义供其他文件使用
export type { WatchlistConfig, WatchlistItem } from "./types";

// 整合所有观影记录（仅保留动漫、电影、电视剧）
export const watchlistConfig: WatchlistConfig = {
	items: [...animeItems, ...movieItems, ...tvItems],
	display: {
		// 以下三项由 pages/watchlist.astro 读取，改这里即生效
		itemsPerPage: 24,
		sortBy: "date",
		sortOrder: "desc",
		showRating: true,
		showProgress: true,
	},
};
