import Parser from "rss-parser";
import { getEnabledFriendGroups } from "@/config/friendsConfig";

let feedPromise: ReturnType<typeof loadFriendFeed>;

export function getFriendFeed() {
	return feedPromise ??= loadFriendFeed();
}

async function loadFriendFeed() {
	const friends = getEnabledFriendGroups().flatMap((group) => group.friends);
	const sources = [...new Map(
		friends.filter((friend) => friend.rss).map((friend) => [friend.rss!, friend]),
	).values()];
	const parser = new Parser();
	const results = await Promise.allSettled(sources.map(async (friend) => {
		const response = await fetch(friend.rss!, { signal: AbortSignal.timeout(10000) });
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const feed = await parser.parseString(await response.text());
		return feed.items.flatMap((item) => {
			const timestamp = Date.parse(item.isoDate || item.pubDate || "");
			if (!item.title || !item.link || !Number.isFinite(timestamp)) return [];
			const link = new URL(item.link, friend.rss);
			if (link.protocol !== "https:" && link.protocol !== "http:") return [];
			return [{
				title: item.title,
				url: link.href,
				date: new Date(timestamp).toISOString(),
				timestamp,
				friend,
			}];
		}).sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
	}));
	const failed: string[] = [];
	const articles = results.flatMap((result, index) => {
		if (result.status === "fulfilled") return result.value;
		failed.push(sources[index].title);
		console.warn(`[朋友圈] ${sources[index].title}: ${String(result.reason)}`);
		return [];
	}).sort((a, b) => b.timestamp - a.timestamp);
	return {
		articles: [...new Map(articles.map((article) => [article.url, article])).values()].slice(0, 60),
		sourceCount: sources.length,
		failed,
	};
}
