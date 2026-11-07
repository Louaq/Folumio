import type { APIRoute } from "astro";
import { siteConfig } from "@/config";
import {
	getCategoryList,
	getSortedPosts,
	getTagList,
} from "@/utils/content-utils";
import { getPostUrlForEntry, getTagUrl, url } from "@/utils/navigation";

export const GET: APIRoute = async ({ site }) => {
	const [posts, categories, tags] = await Promise.all([
		getSortedPosts(),
		getCategoryList(),
		getTagList(),
	]);
	const paths = ["/", "/about/", "/archive/", "/categories/", "/tags/"];
	if (siteConfig.pages.friends) paths.push("/friends/");
	if (siteConfig.pages.watchlist) paths.push("/watchlist/");

	const pageSize = siteConfig.pagination.postsPerPage;
	for (let page = 2; page <= Math.ceil(posts.length / pageSize); page++) {
		paths.push(`/${page}/`);
	}
	for (const category of categories) {
		paths.push(category.url);
		for (let page = 2; page <= Math.ceil(category.count / pageSize); page++) {
			paths.push(`${category.url}${page}/`);
		}
	}
	for (const tag of tags) {
		const tagUrl = getTagUrl(tag.name);
		paths.push(tagUrl);
		for (let page = 2; page <= Math.ceil(tag.count / pageSize); page++) {
			paths.push(`${tagUrl}${page}/`);
		}
	}
	paths.push(...posts.map(getPostUrlForEntry));

	const locations = [...new Set(paths.map((path) => new URL(url(path), site).href))];
	const entries = locations.map(
		(location) => `<url><loc>${location.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</loc></url>`,
	);
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`,
		{ headers: { "Content-Type": "application/xml; charset=utf-8" } },
	);
};
