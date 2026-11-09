import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import katex from "katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import "katex/dist/contrib/mhchem.mjs"; // 加载 mhchem 扩展
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import { pluginCollapsible } from "expressive-code-collapsible"; /* Collapsible */
import rehypeCallouts from "rehype-callouts";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, fontConfig, siteConfig } from "./src/config";
import I18nKey from "./src/i18n/i18nKey";
import { i18n } from "./src/i18n/translation";
import { pluginHeaderToolbar } from "./src/plugins/expressive-code-header-toolbar.mjs"; /* mac 风格标题栏：把复制/折叠按钮挪进 header */
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { PdfEmbedComponent } from "./src/plugins/rehype-component-pdf-embed.mjs";
import { VideoEmbedComponent } from "./src/plugins/rehype-component-video-embed.mjs";
import rehypeExternalLinks from "./src/plugins/rehype-external-links.mjs";
import rehypeFigure from "./src/plugins/rehype-figure.mjs";
import rehypeFileTree from "./src/plugins/rehype-file-tree.mjs";
import rehypeSpoiler from "./src/plugins/rehype-spoiler.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import meilisearch from "./src/utils/meilisearch.ts";

const isDev = process.env.NODE_ENV === "development";
const swupContainers = [
	"#swup-container",
	"#left-sidebar-wrapper",
];
const collapsibleConfig = expressiveCodeConfig.pluginCollapsible;
const collapsibleOptions =
	collapsibleConfig?.enable === true
		? {
				lineThreshold: collapsibleConfig.lineThreshold ?? 15,
				previewLines: collapsibleConfig.previewLines ?? 8,
				defaultCollapsed: collapsibleConfig.defaultCollapsed ?? true,
				expandedAnnouncement: i18n(I18nKey.codeCollapsibleExpanded),
				collapsedAnnouncement: i18n(I18nKey.codeCollapsibleCollapsed),
			}
		: null;
const collapsiblePlugin =
	collapsibleOptions &&
	Object.assign(pluginCollapsible(collapsibleOptions), {
		configDigest: collapsibleOptions,
	});

export default defineConfig({
	site: siteConfig.site_url,

	trailingSlash: "always",
	// 代码字体通过 Astro Font API 自托管 + 子集化；正文字体（CJK）保留 CDN，见 FontSetup.astro
	fonts: fontConfig.enable
		? [
				{
					name: fontConfig.code.family,
					cssVariable: fontConfig.code.cssVariable,
					provider: fontProviders.fontsource(),
					weights: fontConfig.code.weights,
					styles: fontConfig.code.styles,
					subsets: fontConfig.code.subsets,
					fallbacks: fontConfig.code.fallbacks,
				},
			]
		: [],
	integrations: [
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			containers: swupContainers,
			cache: !isDev,
			updateHead: {
				// 与 Shirone 一致：保留基础样式，不等待样式资源后才切页。
				awaitAssets: false,
				persistTags:
					'link[rel=stylesheet]:not([data-swup-optional]), style:not([data-swup-optional])',
			},
			updateBodyClass: false,
			globalInstance: true,
			reloadScripts: false,
			// @swup/astro 仅合并 data-no-swup 与其「ignore」选项到 ignoreVisit，单独的 ignoreVisit 配置不会生效
			ignore: (url) => {
				try {
					const pathname = new URL(url, "https://swup-ignore.local").pathname;
					return pathname.toLowerCase().endsWith(".xml");
				} catch {
					return false;
				}
			},
		}),
		icon({
			iconDir: "public/assets/images",
			include: {
				"fa6-brands": ["creative-commons"],
				"fa6-regular": ["calendar"],
				"fa6-solid": ["chevron-right"],
				"lucide": ["leaf", "map", "rss"],
				"material-symbols": [
					"arrow-outward-rounded",
					"article-outline",
					"article-outline-rounded",
					"book-2-outline-rounded",
					"calendar-today-outline-rounded",
					"chevron-left",
					"chevron-right",
					"close-rounded",
					"dark-mode-outline-rounded",
					"edit-calendar-outline-rounded",
					"folder-open-outline",
					"folder-outline",
					"handshake-outline",
					"home-outline",
					"keyboard-arrow-down-rounded",
					"keyboard-arrow-right",
					"keyboard-double-arrow-right-rounded",
					"menu",
					"more-horiz",
					"movie-outline",
					"person-outline",
					"person-outline-rounded",
					"pinboard",
					"radio-button-partial-outline",
					"satellite-alt-outline",
					"schedule-outline-rounded",
					"sell-outline",
					"tag-rounded",
					"visibility-outline-rounded",
					"wb-sunny-outline-rounded",
					"workspace-premium-rounded",
				],
				"mingcute": [],
				"ri": ["music-2-line"],
				"fluent-emoji-flat": ["hourglass-not-done"],
			},
		}),
		expressiveCode({
			// 默认会把 ec.*.css 以外链形式插在正文第一个代码块前，需二次请求，易出现代码块“先丑后美”的 FOUC
			emitExternalStylesheet: false,
			themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			// 去掉主题里所有斜体 token（catppuccin 的注释、关键字等默认斜体）
			customizeTheme: (theme) => {
				for (const { settings } of theme.settings) {
					if (settings.fontStyle)
						settings.fontStyle = settings.fontStyle
							.replace("italic", "")
							.trim();
				}
			},
			plugins: [
				pluginLineNumbers(),
				...(collapsiblePlugin ? [collapsiblePlugin] : []),
				// 必须排在 collapsiblePlugin 之后：把复制/折叠按钮挪进标题栏
				pluginHeaderToolbar(),
			],
			defaultProps: {
				wrap: false,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				borderRadius: "0.75rem",
				codeFontSize: "13px",
				// 由 Astro Font API 提供（fontsource，自托管 + 子集化），变量已含回退
				codeFontFamily: `var(${fontConfig.code.cssVariable})`,
				codeLineHeight: "1.5rem",
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: true,
			},
		}),
		svelte(),
		react(),
		mdx(),
		meilisearch(),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkMath,
				remarkReadingTime,
				remarkExcerpt,
				remarkDirective,
				remarkSectionize,
				parseDirectiveNode,
			],
			rehypePlugins: [
				rehypeFileTree,
				rehypeSpoiler,
				[rehypeKatex, { katex }],
				[rehypeCallouts, { theme: siteConfig.rehypeCallouts.theme }],
				rehypeSlug,
				rehypeFigure,
				[rehypeExternalLinks, { siteUrl: siteConfig.site_url }],
				[
					rehypeComponents,
					{
						components: {
							github: GithubCardComponent,
							pdf: PdfEmbedComponent,
							video: VideoEmbedComponent,
						},
					},
				],
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							className: ["anchor"],
						},
						content: {
							type: "element",
							tagName: "span",
							properties: {
								className: ["anchor-icon"],
							},
							children: [
								{
									type: "text",
									value: "#",
								},
							],
						},
					},
				],
			],
		}),
	},
	vite: {
		plugins: [
			tailwindcss(),
			{
				name: "ncm-dev-proxy",
				enforce: "post",
				configureServer(server) {
					return () => {
						server.middlewares.stack.unshift({
							route: "/ncm",
							handle: async (req, res) => {
								const headers = new Headers({
									Origin: siteConfig.site_url,
									Referer: `${siteConfig.site_url}/`,
								});
								for (const name of ["cookie", "content-type"]) {
									if (typeof req.headers[name] === "string")
										headers.set(name, req.headers[name]);
								}
								const chunks = [];
								if (req.method === "POST")
									for await (const chunk of req) chunks.push(chunk);
								const r = await fetch(`${siteConfig.site_url}/ncm${req.url}`, {
									method: req.method,
									headers,
									body:
										req.method === "POST" ? Buffer.concat(chunks) : undefined,
								});
								res.statusCode = r.status;
								for (const name of ["content-type", "cache-control"]) {
									if (r.headers.has(name))
										res.setHeader(name, r.headers.get(name));
								}
								res.setHeader("set-cookie", r.headers.getSetCookie());
								res.end(Buffer.from(await r.arrayBuffer()));
							},
						});
					};
				},
			},
		],
		// 歌单 music.json 和封面 /assets/music 只在线上服务器，dev 下转发过去
		server: {
			proxy: {
				"/music.json": { target: siteConfig.site_url, changeOrigin: true },
				"/assets/music": { target: siteConfig.site_url, changeOrigin: true },
			},
		},
		// 开发时预打包 Swup 子入口，减少 504 Outdated Optimize Dep（依赖变更后仍建议重启 dev）
		optimizeDeps: {
			include: [
				"@swup/astro/client",
				"@swup/astro/serialise",
				"@swup/astro/idle",
			],
		},
		resolve: {
			// 避免多份 svelte 运行时导致 onMount 报 lifecycle_outside_component
			dedupe: ["svelte"],
			alias: {
				"@rehype-callouts-theme": `rehype-callouts/theme/${siteConfig.rehypeCallouts.theme}`,
			},
		},
		build: {
			cssMinify: "esbuild",
		},
	},
});
