import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
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
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import meilisearch from "./src/utils/meilisearch.ts";

const isDev = process.env.NODE_ENV === "development";
const swupContainers = [
	"#swup-container",
	"#post-toc-floating-layer",
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

	base: "/",
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
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: swupContainers,
			smoothScrolling: false,
			// 开发模式下 Vite 依赖重优化会导致 swup 预加载/缓存命中旧的 deps，出现 504 (Outdated Optimize Dep)
			cache: !isDev,
			// 本站 HTML 体积较大，hover 预取容易在用户仅经过链接时浪费整页下载。
			preload: false,
			accessibility: false,
			// Twikoo 的样式由脚本运行时注入 <style>，而脚本全局只加载一次；
			// 默认 head diff 会把它们当作孤儿标签移除，二次 swup 进入评论页时样式永久丢失。
			// 组件里给这些 style 打了 data-twikoo-style，这里声明保留（#twikoo-css 同理，侧边栏音乐播放器运行时插入的 #aplayer-css 也是）。
			// 搜索框是 client:only：dev 下它的样式由 Vite 运行时注入，不在服务端 HTML 的 head 里，
			// 第一次换页就会被删掉，之后打开搜索弹窗完全没有样式（生产构建是每页都有的静态 <link>）。
			updateHead: {
				awaitAssets: true,
				persistAssets: false,
				persistTags:
					'style[data-twikoo-style], link#twikoo-css, link#aplayer-css, style[data-vite-dev-id*="Search.svelte"]',
			},
			updateBodyClass: false,
			globalInstance: true,
			// 由 Layout.astro 自行重跑脚本：内建的 scripts 插件会把 Astro 内联的 type="module"
			// 也每次重跑，导致其 astro:page-load 监听逐次叠加
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
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				// 跳过锚点链接的处理，让浏览器原生处理
				return event.state && event.state.url && event.state.url.includes("#");
			},
		}),
		icon({
			include: {
				"fa6-brands": ["alipay", "creative-commons", "weixin"],
				"fa6-regular": ["calendar"],
				"fa6-solid": [
					"arrow-right",
					"arrow-rotate-left",
					"arrow-up-right-from-square",
					"chevron-left",
					"chevron-right",
					"user-shield",
					"xmark",
				],
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
		sitemap({
			filter: (page) => {
				const url = new URL(page);
				const pathname = url.pathname;
				if (pathname === "/friends/" && !siteConfig.pages.friends) {
					return false;
				}

				return true;
			},
		}),
		mdx(),
		meilisearch(),
	],
	markdown: {
		// Astro 7: 自定义 remark/rehype 流水线改为传入 unified() 处理器，
		// 替代已弃用的 markdown.remarkPlugins / markdown.rehypePlugins
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
			// 音乐播放器的 /ncm 同源反代只在线上 openresty 里，dev 下转发过去。
			// 不能用下面的 server.proxy：Astro 把 trailingSlash: "always" 的中间件 unshift 到最前，会把无扩展名的 /ncm/xxx 拦成 404。
			// 这里同样在 post 钩子里 unshift，且 enforce: "post" 排在 Astro 插件之后执行，最终位于最前
			{
				name: "ncm-dev-proxy",
				enforce: "post",
				configureServer(server) {
					return () => {
						server.middlewares.stack.unshift({
							route: "/ncm",
							handle: async (req, res) => {
								const r = await fetch(`${siteConfig.site_url}/ncm${req.url}`);
								res.statusCode = r.status;
								res.setHeader("content-type", r.headers.get("content-type"));
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
				"medium-zoom",
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
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
			// Astro 7 / Vite 8 默认用 lightningcss 压缩 CSS，会对原生 `&` 嵌套等语法报错；
			// 显式指定 esbuild 以保持旧的宽松行为
			cssMinify: "esbuild",
		},
	},
});
