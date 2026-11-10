import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	title: "Louaq",
	subtitle: "论文阅读笔记",
	// 横幅壁纸：src/assets 下图片相对于 src 的路径、public 路径（以 / 开头）或 https URL。
	homeBanner: {
		desktop: "/assets/coverImage/2.webp",
		mobile: "/assets/images/banner-mobile.webp",
	},
	site_url: "https://louaq.io",
	description:
		"注于多模态医学图像领域的研究者与爱好者。在这个日新月异的医学影像技术世界里，我希望通过这个小小的平台，与大家分享我对前沿论文的阅读心得、技术分析以及实践经验",
	keywords: [
		"louaq",
		"多模态",
		"医学图像分析",
		"AIGC",
		"计算机视觉",
		"论文",
		"CVPR",
		"ECCV",
		"ICCV",
		"MICCAI",
		"TPAMI",
		"TMI",
		"TMM",
		"TIP",
		"TNNLS",
		"ACM MM",
	],

	// 主题色
	themeColor: {
		// 支持 16 进制或 RGB，如 "#43bc85"、"rgb(67, 188, 133)"
		color: "#4fb185",
		showModeSwitch: true,
		defaultMode: "light",
	},

	favicon: [
		{
			src: "/assets/images/index.webp",
			theme: "light",
			sizes: "32x32",
		},
	],

	// 悬浮按钮开关（移动端沿用现有隐藏规则）
	floatingControls: {
		music: true, // 是否启用音乐播放器按钮及播放器
		backToTop: true, // 是否启用返回顶部按钮
	},

	// 导航栏配置
	navbar: {
		// 支持三种类型：
		// 1. Astro图标库: { type: "icon", value: "material-symbols:home-pin-outline" }
		// 2. 本地图片: { type: "image", value: "/assets/images/logo.webp", alt: "Firefly Logo" }
		// 3. 网络图片: { type: "url", value: "https://example.com/logo.png", alt: "Firefly Logo" }
		logo: {
			enable: false, // 是否启用 Logo
			type: "image",
			value: "",
			alt: "",
		},
	},

	// 站点开始日期，用于统计运行天数
	siteStartDate: "2025-11-14", // 请修改为你的站点实际开始日期，格式：YYYY-MM-DD

	timezone: "Asia/Shanghai",

	// RSS 输出配置
	// - full：输出全文（RSS item 包含 content）
	// - summary：仅输出摘要（只保留 description，兼容只想看摘要的阅读器）
	rss: {
		mode: "summary",
	},

	// 提醒框（Admonitions）配置，修改后需要重启开发服务器才能生效
	// 主题：'github' | 'obsidian' | 'vitepress'，每个主题风格和语法不同，可根据喜好选择
	rehypeCallouts: {
		theme: "github",
	},

	// 文章页「上次编辑」相关展示：false 时隐藏元信息里的更新日期 + 正文前的过期提醒卡片
	showLastModified: true,

	license: {
		// 是否启用文章底部许可证信息显示
		enable: true,

		// 许可证名称及链接
		name: "CC BY-NC-SA 4.0",
		url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
	},

	// 文章过期阈值（天数），超过此天数才显示过期提醒卡片（元信息里的更新日期不受此阈值影响）
	outdatedThreshold: 10,

	// 文章 URL：默认 hash，自动生成稳定短 id
	postPathMode: "hash",

	// 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
	pages: {
		friends: true,
		circle: true, 
		watchlist: true, 
	},

	// 分页配置
	pagination: {
		// 首页每页文章数
		postsPerPage: 12,
	},

	// 字体配置
	// 在src/config/fontConfig.ts中配置具体字体
	font: fontConfig,

	//简体中文
	lang: SITE_LANG,
};
