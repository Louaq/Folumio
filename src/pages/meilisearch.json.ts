import { getCollection } from "astro:content";
import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { getPostUrlForEntry } from "@/utils/url-utils";

function truncateToBytes(str: string, maxBytes: number): string {
	const encoder = new TextEncoder();
	const bytes = encoder.encode(str);

	if (bytes.length <= maxBytes) {
		return str;
	}

	// 截断到安全字节数
	let truncated = str;
	while (encoder.encode(truncated).length > maxBytes) {
		truncated = truncated.slice(0, Math.floor(truncated.length * 0.9));
	}

	return `${truncated}...`;
}

// 估算对象的字节大小
function estimateObjectSize(obj: any): number {
	return new TextEncoder().encode(JSON.stringify(obj)).length;
}

type MeilisearchRecord = {
	id: string;
	objectID: string;
	type: "post";
	title: string;
	description?: string;
	content: string;
	url: string;
	tags?: string[];
	category?: string;
	updated?: string;
	published?: string;
};

function shrinkRecordToFit(
	record: MeilisearchRecord,
	maxBytes = 9500,
): MeilisearchRecord {
	const safe: MeilisearchRecord = { ...record };
	let size = estimateObjectSize(safe);
	while (size > maxBytes) {
		const nextLen = Math.max(80, Math.floor((safe.content?.length ?? 0) * 0.8));
		safe.content = truncateToBytes(safe.content ?? "", nextLen);
		size = estimateObjectSize(safe);
		// 防止死循环（content 已经很短）
		if ((safe.content?.length ?? 0) <= 90) break;
	}
	return safe;
}

function makeMeiliId(objectID: string): string {
	const hash = createHash("sha256").update(objectID).digest("hex"); // 64 chars, [a-f0-9]

	let base = objectID
		.replace(/[^a-zA-Z0-9-_]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	if (!base) base = "doc";

	// 留出 hash 的空间，避免超过 511 bytes
	const maxBaseBytes = 430;
	// base 这里只包含 ASCII，直接 slice 字符即可
	if (Buffer.byteLength(base, "utf8") > maxBaseBytes) {
		base = base.slice(0, maxBaseBytes);
	}

	return `${base}-${hash.slice(0, 12)}`;
}

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts");

	// 过滤掉草稿文章
	const publishedPosts = posts.filter((post) => !post.data.draft);

	const records: MeilisearchRecord[] = [];

	for (const post of publishedPosts) {
		const isProtected = Boolean(post.data.password);

		const maxContentBytes = 8000;
		const body = post.body ?? "";
		const truncatedContent = isProtected
			? ""
			: truncateToBytes(body, maxContentBytes);

		const objectID = post.id;
		const rec: MeilisearchRecord = {
			// Meilisearch primaryKey：必须满足字符限制
			id: makeMeiliId(objectID),
			objectID,
			type: "post",
			title: post.data.title,
			description: post.data.description || "",
			content: truncatedContent,
			published: post.data.published.toISOString(),
			updated: (post.data.updated ?? post.data.published).toISOString(),
			tags: post.data.tags || [],
			category: post.data.category || "",
			url: getPostUrlForEntry(post),
		};
		records.push(shrinkRecordToFit(rec));
	}

	return new Response(JSON.stringify(records, null, 2), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
