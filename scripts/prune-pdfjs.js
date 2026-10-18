
import { existsSync } from "node:fs";
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PDFJS = path.join(ROOT, "public", "pdfjs");
const DRY_RUN = process.argv.includes("--dry-run");

const KEEP_LOCALES = new Set(["en-US", "zh-CN", "zh-TW"]);

const KEEP_CMAP_PREFIXES = [
	"Adobe-CNS1-",
	"Adobe-GB1-",
	"Adobe-Identity-",
	"B5",
	"CNS",
	"ETHK-",
	"ETen",
	"GB",
	"HK",
	"UniCNS-",
	"UniGB-",
];
const KEEP_CMAP_EXACT = new Set(["LICENSE"]);

const SANDBOX_FILE = path.join(PDFJS, "build", "pdf.sandbox.mjs");
const VIEWER_MJS = path.join(PDFJS, "web", "viewer.mjs");

let removedBytes = 0;
let removedCount = 0;

async function remove(target, label) {
	if (!existsSync(target)) return;
	const size = await dirSize(target);
	if (DRY_RUN) {
		console.log(`  [dry-run] would remove ${label} (${kb(size)})`);
	} else {
		await rm(target, { recursive: true, force: true });
		console.log(`  removed ${label} (${kb(size)})`);
	}
	removedBytes += size;
	removedCount += 1;
}

async function dirSize(target) {
	const info = await stat(target);
	if (!info.isDirectory()) return info.size;
	let total = 0;
	for (const entry of await readdir(target, { withFileTypes: true })) {
		total += await dirSize(path.join(target, entry.name));
	}
	return total;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function pruneLocales() {
	const localeDir = path.join(PDFJS, "web", "locale");
	if (!existsSync(localeDir)) return;
	console.log("locale/");

	const entries = await readdir(localeDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory() || KEEP_LOCALES.has(entry.name)) continue;
		await remove(path.join(localeDir, entry.name), `locale/${entry.name}`);
	}

	const manifest = path.join(localeDir, "locale.json");
	if (!existsSync(manifest)) return;
	const current = JSON.parse(await readFile(manifest, "utf-8"));
	const next = Object.fromEntries(
		Object.entries(current).filter(([, file]) =>
			KEEP_LOCALES.has(String(file).split("/")[0]),
		),
	);
	if (Object.keys(next).length === Object.keys(current).length) return;
	if (DRY_RUN) {
		console.log(
			`  [dry-run] would rewrite locale.json: ${Object.keys(current).length} -> ${Object.keys(next).length} entries`,
		);
	} else {
		await writeFile(manifest, `${JSON.stringify(next)}\n`, "utf-8");
		console.log(
			`  rewrote locale.json: ${Object.keys(current).length} -> ${Object.keys(next).length} entries`,
		);
	}
}

async function pruneCmaps() {
	const cmapDir = path.join(PDFJS, "web", "cmaps");
	if (!existsSync(cmapDir)) return;
	console.log("cmaps/");

	const keep = (name) =>
		KEEP_CMAP_EXACT.has(name) ||
		KEEP_CMAP_PREFIXES.some((prefix) => name.startsWith(prefix));

	for (const name of await readdir(cmapDir)) {
		if (keep(name)) continue;
		await remove(path.join(cmapDir, name), `cmaps/${name}`);
	}
}

async function pruneSandbox() {
	console.log("build/");
	await remove(SANDBOX_FILE, "build/pdf.sandbox.mjs");

	if (!existsSync(VIEWER_MJS)) return;
	const source = await readFile(VIEWER_MJS, "utf-8");
	// AppOptions 里的 `enableScripting: { value: true, ... }`（对行尾/缩进不敏感）
	const pattern = /(enableScripting:\s*\{\s*value:\s*)true/;
	if (!pattern.test(source)) {
		if (/enableScripting:\s*\{\s*value:\s*false/.test(source)) {
			console.log("  viewer.mjs: enableScripting already disabled");
		} else {
			console.warn(
				"  ⚠ viewer.mjs: 找不到 enableScripting 默认值，请手动确认（pdf.js 可能已升级）",
			);
		}
		return;
	}
	if (DRY_RUN) {
		console.log("  [dry-run] would set viewer.mjs enableScripting -> false");
		return;
	}
	await writeFile(VIEWER_MJS, source.replace(pattern, "$1false"), "utf-8");
	console.log("  viewer.mjs: enableScripting -> false");
}

if (!existsSync(PDFJS)) {
	console.error(`public/pdfjs 不存在：${PDFJS}`);
	process.exit(1);
}

console.log(`Pruning pdf.js assets${DRY_RUN ? " (dry run)" : ""}\n`);
await pruneLocales();
await pruneCmaps();
await pruneSandbox();
console.log(
	`\n${DRY_RUN ? "Would remove" : "Removed"} ${removedCount} item(s), ${(removedBytes / 1024 / 1024).toFixed(2)} MB`,
);
