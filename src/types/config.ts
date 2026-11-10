import type { DARK_MODE, LIGHT_MODE } from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	homeBanner: {
		desktop: string;
		mobile: string;
	};
	site_url: string;
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru";

	themeColor: {
		color: string; // 主题色，任意 CSS 颜色，如 "#43bc85" 或 "rgb(67, 188, 133)"
		showModeSwitch?: boolean; // 是否显示明暗/跟随系统模式切换按钮，默认 true
		defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
	};

	// 字体配置
	font: FontConfig;

	floatingControls: {
		music: boolean;
		backToTop: boolean;
	};

	// 站点开始日期，用于计算运行天数
	siteStartDate?: string; // 格式: "YYYY-MM-DD"

	// 可选：站点时区，使用 IANA 时区标识，例如 "Asia/Shanghai"、"UTC"
	timezone?: string;

	// RSS 输出配置
	rss?: {
		// 输出模式：full=输出全文（包含 content），summary=仅输出摘要（即 description）
		mode: "full" | "summary";
	};

	// 提醒框配置
	rehypeCallouts: {
		theme: "github" | "obsidian" | "vitepress";
	};

	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;

	navbar: {
		logo?: {
			enable: boolean; // 是否显示导航栏 Logo
			type: "icon" | "image" | "url";
			value: string; // icon 名称、本地图片路径或网络图片 url
			alt?: string; // 图片alt文本
		};
	};

	showLastModified: boolean; // 控制文章页元信息中的更新日期与正文前过期提醒卡片
	license: {
		enable: boolean;
		name: string;
		url: string;
	};
	outdatedThreshold?: number; // 过期提醒卡片：距上次编辑超过该天数才显示（元信息更新日期不受此限制）

	postPathMode?: "hash" | "legacy";

	// 页面开关配置
	pages: {
		friends: boolean; // 友链页面开关
		watchlist: boolean; // 观影清单页面开关
	};

	// 分页配置
	pagination: {
		postsPerPage: number;
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Watchlist = 7,
	Categories = 8,
	Tags = 9,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileLinkItem = {
	name: string;
	url: string;
	icon: string;
};

export type ProfileStatItem = {
	label: string;
	value?: string;
	href?: string;
};

export type ProfileConfig = {
	avatar?: string;
	cover?: string;
	name: string;
	bio?: string;
	level?: string;
	stats?: ProfileStatItem[];
	links: ProfileLinkItem[];
};

// 评论配置

export type CommentConfig = {
	/**
	 * "none" | "twikoo"
	 */
	type: "none" | "twikoo";
	twikoo?: {
		envId: string;
		region?: string;
		lang?: string;
		visitorCount?: boolean;
	};
};

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE | "auto";

export type ExpressiveCodeConfig = {
	theme?: string;
	darkTheme: string;
	lightTheme: string;
	pluginCollapsible?: PluginCollapsibleConfig;
};

export type PluginCollapsibleConfig = {
	enable: boolean; // 是否启用代码块折叠功能
	lineThreshold: number; // 触发折叠的行数阈值
	previewLines: number; // 折叠时显示的预览行数
	defaultCollapsed: boolean; // 默认是否折叠
};

export type AnnouncementConfig = {
	// enable 属性已移除，现在通过 sidebarLayoutConfig 统一控制
	title?: string; // 公告栏标题
	content: string; // 公告栏内容（支持 HTML）
};

export type HomeTopNoticeItem = {
	title?: string;

	content: string;
	icon?: string;
	link?: {
		enable: boolean;
		url: string;
		external?: boolean;
	};
};

export type HomeTopNoticeConfig = {
	enable: boolean;
	items: HomeTopNoticeItem[];
	/** 多条通知的轮播间隔（毫秒），仅在通知条数 > 1 时生效；缺省 8000 */
	switchInterval?: number;
};

// 正文字体（本地托管，以样式表形式加载）
export type BodyFont = {
	name: string; // 字体显示名称
	family: string; // CSS font-family 名称
	/**
	 * 字体样式表路径，包含 @font-face、unicode-range 与 font-display。
	 */
	css: string;
};

// 代码字体（通过 Astro Font API / fontsource provider 自托管 + 子集化）
export type CodeFont = {
	cssVariable: string; // astro:assets <Font /> 注入的 CSS 变量名
	family: string; // fontsource 家族名
	weights: [string, ...string[]]; // 字重，变量字体可用范围字符串如 "100 800"
	styles: [string, ...string[]]; // 字体样式，如 ["normal"]
	subsets: [string, ...string[]]; // 子集，如 ["latin"]
	fallbacks: string[]; // 注入到 cssVariable 的回退序列（不含字体本身）
};

// 字体配置
export type FontConfig = {
	enable: boolean; // 是否启用自定义字体功能
	preload?: boolean; // 是否预加载代码字体（正文字体已分层，见 BodyFont）
	body: BodyFont; // 正文字体（本地托管 + 分层切片）
	code: CodeFont; // 代码字体（Astro Font API 自托管 + 子集化）
	fallback?: string[]; // 全局字体回退列表
};

export type FooterConfig = {
	copyright: { name: string; url: string };
	poweredBy: { name: string; url: string }[];
	support: { name: string; url: string; image: string };
	navigation: {
		name: string;
		url: string;
		external?: boolean;
		icon?: string;
		noSwup?: boolean;
	}[];
	friendLinks: {
		name: string;
		url: string;
		image: string;
		alt: string;
		width: number;
		height: number;
	}[];
	visitorCount?: {
		enable: boolean; // 是否在页脚显示访客计数
		apiUrl?: string; // 统计接口地址（Vercount，接口与不蒜子兼容）
		showSitePv?: boolean; // 显示全站访问量（PV）
		showSiteUv?: boolean; // 显示全站访客数（UV）
	};
};

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "stats"
	| "runtime"
	| "jieqi";

export type WidgetComponentConfig = {
	type: WidgetComponentType; // 组件类型
	enable: boolean; // 是否启用该组件
	showOnPostPage?: boolean; // 是否在文章详情页显示，默认显示
	position: "top" | "sticky"; // 组件位置：top=固定在顶部，sticky=粘性定位（可滚动）
	order?: number; // 组件显示顺序（数字越小越靠前）
	class?: string; // CSS 类名，用于应用样式和动画
	animationDelay?: number; // 动画延迟时间（毫秒），用于错开动画效果
	style?: string; // 自定义内联样式
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
};

export type SidebarLayoutConfig = {
	components: WidgetComponentConfig[]; // 侧边栏组件配置列表
	defaultAnimation?: {
		enable: boolean; // 是否启用默认动画
		baseDelay: number; // 基础延迟时间（毫秒）
		increment: number; // 递增延迟时间（毫秒），每个组件依次增加的延迟
	};
	responsive?: {
		layout: {
			mobile: "hidden" | "drawer" | "sidebar"; // 移动端布局模式：hidden=不显示侧边栏，drawer=抽屉模式，sidebar=显示侧边栏
			tablet: "hidden" | "drawer" | "sidebar"; // 平板端布局模式
			desktop: "hidden" | "drawer" | "sidebar"; // 桌面端布局模式
		};
	};
};

// 友链配置
export type FriendLink = {
	title: string; // 友链标题
	imgurl: string; // 头像图片URL
	desc: string; // 友链描述
	siteurl: string; // 友链地址
	weight: number; // 权重，数字越大排序越靠前
	enabled: boolean; // 是否启用
	badge?: string; // 卡片右上角徽标文字，如 "PINNED"、"赞助商"，留空则不显示
	badgeIcon?: string; // 徽标图标（Iconify 名称），如 "material-symbols:keep-rounded"
};

// 友链分组的卡片布局
// default = 大卡片（方形头像 + 描述），compact = 小卡片（圆形头像，一行多个）
export type FriendGroupLayout = "default" | "compact";

// 友链分组，如"全站置顶"、"大佬"，可自由增删
export type FriendGroup = {
	name: string; // 分组名，显示为小标题
	description?: string; // 分组说明，显示在小标题下方，可留空
	layout?: FriendGroupLayout; // 卡片布局，默认 "default"
	includeSelf?: boolean; // 是否在该分组开头插入本站卡片（带 OWNER 徽标）
	enabled?: boolean; // 是否启用该分组，默认 true
	weight?: number; // 分组排序权重，数字越大越靠前，默认 0
	friends: FriendLink[]; // 该分组下的友链
};

export type FriendsPageConfig = {
	title?: string; // 页面标题，留空则使用 i18n 中的翻译
	description?: string; // 页面描述，留空则使用 i18n 中的翻译
	showCustomContent?: boolean; // 是否显示申请友链按钮
	showComment?: boolean; // 是否显示评论区，默认 true
	randomizeSort?: boolean; // 是否打乱排序，如果为 true，将忽略 weight，随机排序
};
