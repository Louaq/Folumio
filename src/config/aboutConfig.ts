import { profileConfig } from "./profileConfig";
import { siteConfig } from "./siteConfig";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";

export const aboutPageConfig = {
	pageTitle: i18n(I18nKey.about),
	eyebrow: "ABOUT ME",
	title: "关于我",
	headerDescription: "很高兴，在这里与你相遇。",
	avatar: profileConfig.avatar!,
	avatarAlt: `${profileConfig.name}的头像`,
	status: { label: "持续学习中", icon: "🌱" },
	researchLabel: "研究与探索",
	blog: {
		label: "关于这个博客",
		title: "让知识慢慢积累。",
		description: `始于 ${siteConfig.siteStartDate}，每一篇都是探索的足迹。`,
	},
	statisticsLabels: { posts: "篇文章", tags: "个标签", categories: "个分类" },
	archiveLink: { label: "看看我的记录", url: "/archive/" },
	introduction: "在医学影像与人工智能的交叉处，读论文、做研究，也把探索的过程记录下来。",
	identityTags: ["医学影像", "多模态学习", "论文阅读", "计算机视觉", "深度学习", "实践记录"],
	pursuit: "让影像中的信息被更好地理解。",
	keywords: ["MRI", "CT", "PET", "多模态融合", "医学图像分割", "图像配准", "图像重建", "辅助诊断"],
	directions: [
		{
			title: "多模态，更多视角",
			description: "关注 MRI、CT、PET 等不同成像模态的融合与分析。",
		},
		{
			title: "从影像到理解",
			description: "探索深度学习在医学图像分割、配准与重建中的应用。",
		},
		{
			title: "把探索写下来",
			description: "分享前沿论文的阅读心得、技术分析与实践经验。",
		},
	],
};
