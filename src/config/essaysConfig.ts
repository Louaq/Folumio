type Essay = {
	date: string; // YYYY-MM-DD
	content: string; // 纯文本，支持换行
	images?: string[]; // 图片地址列表，可用 /assets/... 本地路径或 https:// 外链
};

export const essaysConfig: {
	title: string;
	description: string;
	items: Essay[];
} = {
	title: "随笔",
	description: "记录日常的片刻与想法。",
	items: [
		{
			date: "2026-11-11",
			content: "斗破苍穹完结 (2017-2026)",
			images: ["https://pic1.imgdb.cn/i/034ve1lhQ9s0jxW6U7U7To.webp?w=400"],
		},
		{
			date: "2026-11-10",
			content: "在这里写下一段随笔。\n也可以换行继续记录",
			images: ["https://pic1.imgdb.cn/i/034ZMknGevJT4oWECLatyW.png?w=600"],
		},
		{
			date: "2026-11-09",
			content: "互联网基础设施",
			images: ["https://pic1.imgdb.cn/i/034pQ8sylkcdgznae7R14n.webp?w=350"]

		},
		{
			date: "2026-11-07",
			content: "立冬",
		},
	],
};
