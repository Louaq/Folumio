/**
 * 移除文件扩展名（.md, .mdx, .markdown）
 * 用于将 Astro v5 Content Layer API 的 id 转换为 URL 友好的 slug
 */
function removeFileExtension(id: string): string {
	return id.replace(/\.(md|mdx|markdown)$/i, "");
}

/** frontmatter 可能影响路径的字段 */
type PostPathSource = {
	slug?: string | null;
};

const POST_PATH_HASH_HEX_CHARS = 12;

/** 纯 JS 确定性短 id（浏览器与 Node 一致），用于 URL，非加密用途 */
function getStablePostPathId(contentId: string): string {
	let h1 = 5381;
	for (let i = 0; i < contentId.length; i++) {
		h1 = ((h1 << 5) + h1) ^ contentId.charCodeAt(i);
		h1 >>>= 0;
	}
	let h2 = 2166136261;
	for (let i = 0; i < contentId.length; i++) {
		h2 ^= contentId.charCodeAt(i);
		h2 = Math.imul(h2, 16777619);
		h2 >>>= 0;
	}
	const part1 = h1.toString(16).padStart(8, "0");
	const part2 = h2.toString(16).padStart(8, "0");
	return (part1 + part2).slice(0, POST_PATH_HASH_HEX_CHARS);
}

/**
 * 文章在 /posts/… 下的路径段：优先 `slug`，未设置时生成稳定短 hash。
 */
export function getResolvedPostPath(id: string, data: PostPathSource): string {
	const custom = data.slug?.trim();
	if (custom) {
		return custom.replace(/^[\\/]+|[\\/]+$/g, "").replace(/\\/g, "/");
	}
	return getStablePostPathId(id);
}

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function normalizeNavPath(path: string) {
	return new URL(path, "https://nav.local")
		.pathname.replace(/^\/|\/$/g, "")
		.toLowerCase();
}

export function isNavPathActive(currentPath: string, linkPath: string) {
	const current = normalizeNavPath(currentPath);
	const target = normalizeNavPath(url(linkPath));

	if (!target) return !current;
	return current === target || current.startsWith(`${target}/`);
}

/** 最具体路径所属的导航组优先；同路径时保留配置中靠前的一组。 */
export function getActiveNavGroup(currentPath: string, groups: string[][]) {
	let activeGroup = -1;
	let longestPath = -1;
	groups.forEach((paths, index) => {
		for (const path of paths) {
			if (!path || !isNavPathActive(currentPath, path)) continue;
			const length = normalizeNavPath(url(path)).length;
			if (length > longestPath) {
				activeGroup = index;
				longestPath = length;
			}
		}
	});
	return activeGroup;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(slug: string): string {
	const slugWithoutExt = removeFileExtension(slug);
	return url(`/posts/${slugWithoutExt}/`);
}

export function getPostUrlForEntry(entry: {
	id: string;
	data: PostPathSource;
}): string {
	return getPostUrlBySlug(getResolvedPostPath(entry.id, entry.data));
}

export function getTagUrl(tag: string): string {
	if (!tag) return url("/tags/");
	return url(`/tags/${encodeURIComponent(tag.trim())}/`);
}

export function getFileDirFromPath(filePath: string): string {
	return filePath.replace(/^src\//, "").replace(/\/[^/]+$/, "");
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}

export const isHomePage = (pathname: string): boolean => {
	const baseUrl = import.meta.env.BASE_URL || "/";
	const baseUrlNoSlash = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

	if (pathname === baseUrl) return true;
	if (pathname === baseUrlNoSlash) return true;
	if (pathname === "/") return true;

	return false;
};

export function navigateToPage(
	url: string,
	options?: {
		replace?: boolean;
	},
): void {
	if (!url || typeof url !== "string") {
		return;
	}

	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("//")
	) {
		window.open(url, "_blank");
		return;
	}

	if (url.startsWith("#")) {
		const element = document.getElementById(url.slice(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		return;
	}

	if (typeof window !== "undefined" && window.swup) {
		try {
			if (options?.replace) {
				window.swup.navigate(url, { history: false });
			} else {
				window.swup.navigate(url);
			}
		} catch {
			fallbackNavigation(url, options);
		}
	} else {
		fallbackNavigation(url, options);
	}
}

function fallbackNavigation(
	url: string,
	options?: {
		replace?: boolean;
	},
): void {
	if (options?.replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}
