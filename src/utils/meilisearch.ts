import { readFile, rm } from "node:fs/promises";
import type { AstroIntegration } from "astro";

function normalizeHost(host: string) {
	return host.replace(/\/$/, "");
}

async function waitForTask(options: {
	host: string;
	adminKey: string;
	taskUid: string | number;
	timeoutMs?: number;
}) {
	const { host, adminKey, taskUid } = options;
	const timeoutMs = options.timeoutMs ?? 60_000;
	const start = Date.now();

	const formatTaskError = (data: any) => {
		// Meilisearch 的失败任务有时会把 error 返回为对象
		if (!data) return "unknown error";
		const err = data.error ?? data;
		if (typeof err === "string") return err;
		if (typeof err === "object") {
			if (typeof err.message === "string") return err.message;
			// 兜底：完整序列化，避免 [object Object]
			try {
				return JSON.stringify(err);
			} catch {
				return String(err);
			}
		}
		return String(err);
	};

	while (Date.now() - start < timeoutMs) {
		const res = await fetch(`${host}/tasks/${taskUid}`, {
			headers: {
				Authorization: `Bearer ${adminKey}`,
			},
		});
		const data = await res.json().catch(() => ({}));
		const status = data?.status;

		if (status === "succeeded") return data;
		if (status === "failed") {
			throw new Error(
				`Meilisearch task failed (uid=${taskUid}): ${formatTaskError(data)}`,
			);
		}

		// enqueued | processing
		await new Promise((r) => setTimeout(r, 1000));
	}

	throw new Error(`Timed out waiting Meilisearch task: ${taskUid}`);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * search.louaq.com 前面挂着一层反向代理（openresty）的 CC 防护：短时间内连续请求
 * 会被拦截并返回 403 + 一个 HTML 拦截页（注意不是 Meilisearch 自己返回的 JSON 错误）。
 * 这里对 403 做指数退避重试，避免整批文档静默丢失。
 */
async function meiliRequest(options: {
	url: string;
	method: "GET" | "POST" | "PATCH";
	adminKey: string;
	body?: unknown;
	/** 403（WAF 拦截）时的最大重试次数 */
	maxRetries?: number;
	logger?: { warn: (msg: string) => void };
}): Promise<Response> {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${options.adminKey}`,
	};

	if (options.body !== undefined) {
		headers["Content-Type"] = "application/json";
	}

	const serialized =
		options.body !== undefined ? JSON.stringify(options.body) : undefined;
	const maxRetries = options.maxRetries ?? 5;

	let res!: Response;
	for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
		res = await fetch(options.url, {
			method: options.method,
			headers,
			body: serialized,
		});

		if (res.status !== 403 || attempt > maxRetries) return res;

		const wait = 3000 * attempt;
		options.logger?.warn(
			`Meilisearch request blocked by upstream WAF (403). Backing off ${wait / 1000}s and retrying (${attempt}/${maxRetries}) ...`,
		);
		await sleep(wait);
	}
	return res;
}

type MeiliLogger = {
	warn: (msg: string) => void;
};

async function addDocumentsWithFallback(options: {
	host: string;
	indexUid: string;
	adminKey: string;
	documents: unknown[];
	logger: MeiliLogger;
}) {
	const { host, indexUid, adminKey, documents, logger } = options;

	// 兼容：不同 Meilisearch 版本对 /documents 的入参可能要求不同
	// - 某些版本接受数组：POST /documents { ... body: documents[] }
	// - 某些版本接受包装：POST /documents { documents: [...] }
	const endpoint = `${host}/indexes/${indexUid}/documents`;

	const tryAdd = async (body: unknown) => {
		const res = await meiliRequest({
			url: endpoint,
			method: "POST",
			adminKey,
			body,
			logger,
		});
		const json = await res.json().catch(() => ({}));
		return { res, json };
	};

	// 1) 优先：数组形式
	let { res, json } = await tryAdd(documents);
	if (res.ok && json?.taskUid) return { res, json };

	// 2) 回退：包装形式
	logger.warn(
		`Meilisearch addDocuments fallback triggered (status=${res.status}). Retrying with { documents: [...] } ...`,
	);
	({ res, json } = await tryAdd({ documents }));
	return { res, json };
}

async function listRemoteIds(options: {
	host: string;
	indexUid: string;
	adminKey: string;
}): Promise<string[]> {
	const { host, indexUid, adminKey } = options;
	const pageSize = 1000;
	const ids: string[] = [];
	let offset = 0;

	while (true) {
		const res = await meiliRequest({
			url: `${host}/indexes/${indexUid}/documents?limit=${pageSize}&offset=${offset}&fields=id`,
			method: "GET",
			adminKey,
		});
		if (!res.ok) throw new Error(`List documents failed: status=${res.status}`);

		const json = await res.json();
		for (const doc of json?.results ?? []) {
			if (typeof doc?.id === "string") ids.push(doc.id);
		}

		offset += pageSize;
		if (offset >= (json?.total ?? 0)) break;
		await sleep(500);
	}

	return ids;
}

/**
 * Meilisearch(=milisearch) 集成
 * 在构建完成后自动将索引数据上传到 Meilisearch（search.louaq.com）
 */
export default function meilisearch(): AstroIntegration {
	return {
		name: "meilisearch",
		hooks: {
			"astro:build:done": async ({ logger, dir }) => {
				const indexFile = new URL("./meilisearch.json", dir);

				// 索引文件只是构建期的中间产物：浏览器搜索走远端 Meilisearch 实例，
				// 没有任何前端代码 fetch 它。留在 dist 里等于白白部署 ~800KB 公开数据。
				const dropIndexFile = async () => {
					try {
						await rm(indexFile, { force: true });
						logger.info("Removed meilisearch.json from build output.");
					} catch (e) {
						logger.warn(
							`Failed to remove meilisearch.json: ${e instanceof Error ? e.message : String(e)}`,
						);
					}
				};

				const MEILISEARCH_HOST =
					process.env.MEILISEARCH_HOST ||
					process.env.PUBLIC_MEILISEARCH_HOST ||
					"https://search.louaq.com";
				const MEILISEARCH_ADMIN_KEY = process.env.MEILISEARCH_ADMIN_KEY;
				const MEILISEARCH_INDEX_NAME =
					process.env.MEILISEARCH_INDEX_NAME || "blog";

				// 没有 admin key 就跳过上传（只要 Meilisearch 端已有索引即可）
				if (!MEILISEARCH_ADMIN_KEY) {
					logger.warn(
						"Meilisearch admin key not configured. Skipping index upload.",
					);
					await dropIndexFile();
					return;
				}

				const host = normalizeHost(MEILISEARCH_HOST);

				try {
					logger.info(`Reading data from: ${indexFile.pathname}`);

					const data = await readFile(indexFile, "utf-8");
					if (!data) throw new Error("No data found in meilisearch.json");

					const records = JSON.parse(data);
					if (!Array.isArray(records))
						throw new Error("Invalid data format: expected an array");

					logger.info(
						`Found ${records.length} records to upload to Meilisearch index: ${MEILISEARCH_INDEX_NAME}`,
					);

					let uploadSucceeded = true;

					// 1) 尝试创建索引（如已存在会失败，这里忽略）
					try {
						const createRes = await meiliRequest({
							url: `${host}/indexes`,
							method: "POST",
							adminKey: MEILISEARCH_ADMIN_KEY,
							body: {
								uid: MEILISEARCH_INDEX_NAME,
								primaryKey: "id",
							},
						});

						// 已存在索引时一般会返回 4xx，这里不致命
						if (!createRes.ok) {
							logger.info(
								`Meilisearch index may already exist: ${MEILISEARCH_INDEX_NAME}`,
							);
						} else {
							const json = await createRes.json().catch(() => ({}));
							if (json?.taskUid) {
								logger.info(
									`Waiting Meilisearch create-index task: ${json.taskUid}`,
								);
								await waitForTask({
									host,
									adminKey: MEILISEARCH_ADMIN_KEY,
									taskUid: json.taskUid,
								}).catch((e) => {
									// 索引已存在是常态；且 addDocuments 会自动建索引，这里失败不影响上传结果
									logger.info(
										`Meilisearch create-index task not applied (ignored): ${e instanceof Error ? e.message : String(e)}`,
									);
								});
							}
						}
					} catch (e) {
						logger.warn(
							`Meilisearch create-index failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
						);
					}

					// 2) 更新索引设置
					// displayedAttributes 用于确保前端能拿到 content/title 等字段（避免默认不返回）
					const searchableAttributes = [
						"title",
						"description",
						"content",
						"tags",
						"category",
						"type",
					];
					const displayedAttributes = [
						"type",
						"image",
						"author",
						"published",
						"title",
						"description",
						"content",
						"url",
						"tags",
						"category",
					];
					const filterableAttributes = ["type", "objectID"];

					try {
						const settingsRes = await meiliRequest({
							url: `${host}/indexes/${MEILISEARCH_INDEX_NAME}/settings`,
							method: "PATCH",
							adminKey: MEILISEARCH_ADMIN_KEY,
							body: {
								searchableAttributes,
								displayedAttributes,
								filterableAttributes,
							},
						});
						const json = await settingsRes.json().catch(() => ({}));
						if (settingsRes.ok && json?.taskUid) {
							logger.info(`Waiting Meilisearch settings task: ${json.taskUid}`);
							await waitForTask({
								host,
								adminKey: MEILISEARCH_ADMIN_KEY,
								taskUid: json.taskUid,
								timeoutMs: 30_000,
							}).catch((e) => {
								uploadSucceeded = false;
								logger.warn(
									`Meilisearch settings task failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
								);
							});
						}
					} catch (e) {
						uploadSucceeded = false;
						logger.warn(
							`Meilisearch setSettings failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
						);
					}

					// 2.6) 清理已下线的观影索引（避免旧数据继续出现在搜索结果中）
					try {
						const deleteRes = await meiliRequest({
							url: `${host}/indexes/${MEILISEARCH_INDEX_NAME}/documents/delete`,
							method: "POST",
							adminKey: MEILISEARCH_ADMIN_KEY,
							body: {
								filter: 'type = "watchlist" OR objectID = "page:watchlist"',
							},
						});
						const deleteJson = await deleteRes.json().catch(() => ({}));
						if (deleteRes.ok && deleteJson?.taskUid) {
							logger.info(
								`Waiting Meilisearch delete-watchlist task: ${deleteJson.taskUid}`,
							);
							await waitForTask({
								host,
								adminKey: MEILISEARCH_ADMIN_KEY,
								taskUid: deleteJson.taskUid,
								timeoutMs: 30_000,
							}).catch((e) => {
								logger.warn(
									`Meilisearch delete-watchlist task failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
								);
							});
						}
					} catch (e) {
						logger.warn(
							`Meilisearch delete-watchlist failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
						);
					}

					// 3) 上传文档（按块，避免单次请求过大）
					// 块之间留出间隔：上游反代的 CC 防护会把连续请求判定为攻击并返回 403
					const chunkSize = Number(
						process.env.MEILISEARCH_UPLOAD_CHUNK_SIZE || 40,
					);
					const pauseMs = Number(
						process.env.MEILISEARCH_UPLOAD_PAUSE_MS || 1500,
					);
					let uploadedBatchCount = 0;
					let taskSucceededBatchCount = 0;
					for (let i = 0; i < records.length; i += chunkSize) {
						const batch = records.slice(i, i + chunkSize);
						uploadedBatchCount += 1;
						if (i > 0) await sleep(pauseMs);
						logger.info(
							`Uploading batch ${i / chunkSize + 1} / ${Math.ceil(records.length / chunkSize)} ...`,
						);

						const { res: addRes, json: addJson } =
							await addDocumentsWithFallback({
								host,
								indexUid: MEILISEARCH_INDEX_NAME,
								adminKey: MEILISEARCH_ADMIN_KEY,
								documents: batch,
								logger: {
									warn: logger.warn.bind(logger),
								},
							});

						if (!addRes.ok) {
							uploadSucceeded = false;
							logger.warn(
								`Meilisearch addDocuments failed: status=${addRes.status} body=${JSON.stringify(addJson).slice(0, 500)}`,
							);
							continue;
						}

						if (!addJson?.taskUid) {
							uploadSucceeded = false;
							logger.warn(
								`Meilisearch addDocuments returned no taskUid (status=${addRes.status}). body=${JSON.stringify(addJson).slice(0, 500)}`,
							);
							continue;
						}

						await waitForTask({
							host,
							adminKey: MEILISEARCH_ADMIN_KEY,
							taskUid: addJson.taskUid,
							timeoutMs: 60_000,
						})
							.then(() => {
								taskSucceededBatchCount += 1;
							})
							.catch((e) => {
								uploadSucceeded = false;
								logger.warn(
									`Meilisearch upload wait failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
								);
							});
					}

					// 4) 清理残留：本地已不存在的文档（文章改名/移动目录会生成新 id，旧文档会留在索引里指向死链）
					// 只在全部批次都成功时执行，避免因部分上传失败而误删仍然有效的文档
					const allBatchesSucceeded =
						uploadSucceeded &&
						uploadedBatchCount > 0 &&
						taskSucceededBatchCount === uploadedBatchCount;

					if (allBatchesSucceeded) {
						try {
							const localIds = new Set(
								records
									.map((r: any) => r?.id)
									.filter(
										(id: unknown): id is string => typeof id === "string",
									),
							);
							const remoteIds = await listRemoteIds({
								host,
								indexUid: MEILISEARCH_INDEX_NAME,
								adminKey: MEILISEARCH_ADMIN_KEY,
							});
							const staleIds = remoteIds.filter((id) => !localIds.has(id));

							if (staleIds.length === 0) {
								logger.info("Meilisearch index has no stale documents.");
							} else {
								logger.info(
									`Deleting ${staleIds.length} stale Meilisearch document(s) ...`,
								);
								const delRes = await meiliRequest({
									url: `${host}/indexes/${MEILISEARCH_INDEX_NAME}/documents/delete-batch`,
									method: "POST",
									adminKey: MEILISEARCH_ADMIN_KEY,
									body: staleIds,
								});
								const delJson = await delRes.json().catch(() => ({}));
								if (delRes.ok && delJson?.taskUid) {
									await waitForTask({
										host,
										adminKey: MEILISEARCH_ADMIN_KEY,
										taskUid: delJson.taskUid,
										timeoutMs: 60_000,
									});
									logger.info(
										`✓ Deleted ${staleIds.length} stale Meilisearch document(s).`,
									);
								} else {
									logger.warn(
										`Meilisearch delete-stale failed: status=${delRes.status} body=${JSON.stringify(delJson).slice(0, 500)}`,
									);
								}
							}
						} catch (e) {
							logger.warn(
								`Meilisearch delete-stale failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
							);
						}
					} else {
						logger.warn(
							"Skipping stale-document cleanup because some uploads failed.",
						);
					}

					if (uploadSucceeded && taskSucceededBatchCount > 0) {
						logger.info(
							`✓ Successfully uploaded records to Meilisearch: ${MEILISEARCH_INDEX_NAME} (batches=${taskSucceededBatchCount}/${uploadedBatchCount})`,
						);
					} else {
						logger.warn(
							`Meilisearch upload finished with failures: index=${MEILISEARCH_INDEX_NAME}, batches=${taskSucceededBatchCount}/${uploadedBatchCount}. Check logs above.`,
						);
					}
				} catch (error) {
					logger.error(
						`✗ Meilisearch upload error: ${error instanceof Error ? error.message : String(error)}`,
					);
					// 不要让构建失败
				} finally {
					await dropIndexFile();
				}
			},
		},
	};
}
