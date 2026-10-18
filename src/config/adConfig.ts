import type { AdConfig, AdItem, AdPlacementName } from "../types/config";

export const adConfig: AdConfig = {
	// 总开关：关闭后两个位置都不渲染
	enable: true,

	// 默认横幅宽高比，按素材实际尺寸填写（宽 / 高）；各位置可单独覆盖
	aspectRatio: "350 / 60",

	// 文章正文上方
	top: {
		enable: true,
		items: [
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-1",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQFr5RDbiAbVdF8hcW1.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.onesproxy.com",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				id: "banner-2",
				enable: true,
				image: "https://pic1.imgdb.cn/i/034FQGE2wHXXEYRCq3SghB.gif",
				alt: "广告横幅",
				link: "https://linkstatic.com",
				external: true,
				closable: true,
				label: "广告",
			},
			{
				id: "banner-3",
				enable: true,
				image: "https://pic1.imgdb.cn/i/034FQGqal51eVmyA4QHaCS.gif",
				alt: "广告横幅",
				link: "https://www.proxy-cheap.com/",
				external: true,
				closable: true,
				label: "广告",
			},
		],
	},

	// 文章正文下方（版权声明之后）
	bottom: {
		enable: true,

		// 该位置若用不同尺寸的素材，在这里单独写宽高比即可
		// aspectRatio: "728 / 90",
		items: [
			{
				id: "bottom-1",
				enable: true,
				image: "https://pic1.imgdb.cn/i/034FQIgm9akNXeWogg97gw.gif",
				alt: "广告横幅",
				link: "https://bestproxy.com",
				external: true,
				closable: true,
				label: "广告",
			},
			{
				id: "bottom-2",
				enable: true,
				image: "https://pic1.imgdb.cn/i/034fmi3cO1iNmk0ENwCrJI.gif",
				alt: "广告横幅",
				link: "https://accszone.com/",
				external: true,
				closable: true,
				label: "广告",
			},
			{
				id: "bottom-3",
				enable: true,
				image: "https://pic1.imgdb.cn/i/034FQJifkC3XyLdsWSsiZm.gif",
				alt: "广告横幅",
				link: "https://www.nsocks.com",
				external: true,
				closable: true,
				label: "广告",
			},
		],
	},
};

export function getActiveAdItems(placement: AdPlacementName): AdItem[] {
	const group = adConfig[placement];
	if (!adConfig.enable || !group.enable) {
		return [];
	}

	const now = new Date();
	return group.items.filter((item) => {
		if (!item.enable) {
			return false;
		}
		return !(item.expireDate && now > new Date(item.expireDate));
	});
}

export function getAdAspectRatio(placement: AdPlacementName): string {
	return adConfig[placement].aspectRatio || adConfig.aspectRatio || "350 / 60";
}
