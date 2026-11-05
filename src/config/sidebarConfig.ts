import type { SidebarLayoutConfig } from "../types/config";

export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// 组件位置position：top=顶部，sticky=粘性定位(会跟随页面滚动)
	// showOnPostPage：是否在文章详情页显示；false 仅在文章页隐藏，省略时默认显示
	components: [
		{
			// 组件类型：用户资料组件
			type: "profile",
			// 是否启用该组件
			enable: true,
			showOnPostPage: false,
			// 组件显示顺序（数字越小越靠前）
			order: 1,
			// 组件位置
			position: "top",
			// CSS 类名，用于应用样式和动画
			class: "onload-animation",
			// 动画延迟时间（毫秒），用于错开动画效果
			animationDelay: 0,
		},
		{
			// 组件类型：站点运行时间组件
			type: "runtime",
			// 是否启用该组件
			enable: true,
			showOnPostPage: false,
			// 组件显示顺序
			order: 2,
			// 组件位置
			position: "sticky",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 0,
		},
		{
			// 组件类型：公告组件
			type: "announcement",
			// 是否启用该组件
			enable: true,
			showOnPostPage: false,
			// 组件显示顺序
			order: 3,
			// 组件位置
			position: "sticky",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 0,
		},
		{
			// 组件类型：音乐播放器（自建曲库，接口为同源 /ncm）
			type: "music",
			// 是否启用该组件
			enable: true,
			showOnPostPage: false,
			// 组件显示顺序
			order: 4,
			// 组件位置
			position: "sticky",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 0,
		},
		// {
		// 	// 组件类型：分类组件
		// 	type: "categories",
		// 	// 是否启用该组件
		// 	enable: true,
		// 	// 组件显示顺序
		// 	order: 3,
		// 	// 组件位置
		// 	position: "top",
		// 	// CSS 类名
		// 	class: "onload-animation",
		// 	// 动画延迟时间
		// 	animationDelay: 0,
		// 	// 响应式配置
		// 	responsive: {
		// 		// 折叠阈值：当分类数量超过5个时自动折叠
		// 		collapseThreshold: 20,
		// 	},
		// },
		// {
		// 	//组件类型：标签组件
		// 	type: "tags",
		// 	//是否启用该组件
		// 	enable: true,
		// 	//组件显示顺序
		// 	order: 4,
		// 	//组件位置
		// 	position: "sticky",
		// 	//CSS 类名
		// 	class: "onload-animation",
		// 	//动画延迟时间
		// 	animationDelay: 250,
		// 	//响应式配置
		// 	responsive: {
		// 		//折叠阈值：当标签数量超过20个时自动折叠
		// 		collapseThreshold: 10,
		// 	},
		// },
	],

	// 默认动画配置
	defaultAnimation: {
		// 是否启用默认动画
		enable: true,
		// 基础延迟时间（毫秒）
		baseDelay: 0,
		// 递增延迟时间（毫秒），每个组件依次增加的延迟
		increment: 50,
	},

	// 响应式布局配置
	responsive: {
		// 不同设备的布局模式
		// hidden:不显示侧边栏   drawer:抽屉模式(移动端不显示)   sidebar:显示侧边栏
		// 使用 Tailwind 标准断点：mobile(<768px), tablet(768px-1023px), desktop(>=1024px)
		layout: {
			// 移动端：<768px
			mobile: "drawer",
			// 平板端：768px-1023px
			tablet: "sidebar",
			// 桌面端：>=1024px
			desktop: "sidebar",
		},
	},
};
