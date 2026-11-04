import type {
	FriendGroup,
	FriendLink,
	FriendsPageConfig,
} from "../types/config";
import { profileConfig } from "./profileConfig";
import { siteConfig } from "./siteConfig";

// 本站友链信息，供友链页面展示及其他站长复制使用
export const friendSiteInfo = {
	name: profileConfig.name,
	desc: "致力于探索如何利用计算机视觉和深度学习技术",
	url: siteConfig.site_url,
	avatar: "/assets/images/avatar.webp",
	rss: `${siteConfig.site_url}/rss.xml`,
	email: "louaqo@gmail.com",
};

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 是否显示底部自定义内容（申请友链流程 + 注意事项）
	showCustomContent: true,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: false,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

const friendGroups: FriendGroup[] = [
	{
		name: "全站置顶",
		layout: "default",
		// 在本分组开头插入本站自己的卡片（带 OWNER 徽标）
		includeSelf: true,
		weight: 100,
		enabled: true,
		friends: [
			// 想置顶某个友链，把它放到这个分组里即可，例如：
			// {
			// 	title: " ",
			// 	imgurl: " ",
			// 	desc: "站点分析",
			// 	siteurl: " ",
			// 	weight: 10,
			// 	enabled: true,
			// 	badge: "PINNED",
			// 	badgeIcon: "material-symbols:keep-rounded",
			// },
		],
	},
	{
		name: "大佬",
		layout: "compact",
		weight: 90,
		enabled: true,
		friends: [
			{
				title: "夏叶",
				imgurl: "https://q1.qlogo.cn/g?b=qq&nk=7618557&s=640",
				desc: "飞萤之火自无梦的长夜亮起，绽放在终竟的明天。",
				siteurl: "https://blog.cuteleaf.cn",
				weight: 10, // 权重，数字越大排序越靠前
				enabled: true, // 是否启用
			},
			{
				title: "最美博客",
				imgurl: "https://s41.ax1x.com/2026/02/28/peSMkwt.png",
				desc: "这是一个 Vue2 Vue3 与 SpringBoot 结合的产物",
				siteurl: "https://poetize.cn/",
				weight: 8,
				enabled: true,
			},
			{
				title: "宇阳",
				imgurl: "https://q1.qlogo.cn/g?b=qq&nk=3311118881&s=640",
				desc: "记录所学知识，缩短和大神的差距！",
				siteurl: "https://liuyuyang.net",
				weight: 7,
				enabled: true,
			},
			{
				title: "Ruyu-blog",
				imgurl: "https://www.chichu.chat/blog-icon.svg",
				desc: "一名造价筑基期的折腾散修",
				siteurl: "https://www.chichu.chat/",
				weight: 6,
				enabled: true,
			},
		],
	},
	{
		name: "论坛",
		layout: "compact",
		weight: 80,
		enabled: true,
		friends: [
			{
				title: "V2EX",
				imgurl: "https://www.v2ex.com/static/img/v2ex@2x.png",
				desc: "V2EX 是一个关于分享和探索的地方",
				siteurl: "https://www.v2ex.com/",
				weight: 10,
				enabled: true,
			},
			{
				title: "NodeSeek",
				imgurl:
					"https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png",
				desc: "NodeSeek",
				siteurl: "https://www.nodeseek.com/",
				weight: 9,
				enabled: true,
			},
			{
				title: "linux DO",
				imgurl:
					"https://cdn3.ldstatic.com/optimized/4X/6/a/6/6a6affc7b1ce8140279e959d32671304db06d5ab_2_512x512.png",
				desc: "Where possible begins",
				siteurl: "https://linux.do/",
				weight: 8, // 权重，数字越大排序越靠前
				enabled: true, // 是否启用
			},
			{
				title: "Linux SB",
				imgurl: "https://linux.sb/app/assets/index.svg",
				desc: "LINUX SB - 更新的理想型社区",
				siteurl: "https://linux.sb/",
				weight: 7,
				enabled: true,
			},
		],
	},
];

// 按配置对友链排序：开启随机排序时忽略权重
const sortFriends = (friends: FriendLink[]): FriendLink[] => {
	const list = friends.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return list.sort(() => Math.random() - 0.5);
	}

	return list.sort((a, b) => b.weight - a.weight);
};

// 获取启用的分组（分组内友链已过滤并排序），供友链页面渲染
// 仅当分组内有友链、或分组配置了展示本站卡片时才会返回
export const getEnabledFriendGroups = (): FriendGroup[] => {
	return friendGroups
		.filter((group) => group.enabled !== false)
		.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
		.map((group) => ({ ...group, friends: sortFriends(group.friends) }))
		.filter((group) => group.friends.length > 0 || group.includeSelf);
};
