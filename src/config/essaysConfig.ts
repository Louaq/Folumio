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
			date: "2026-11-16",
			content: "双帝之战",
			images: ["https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/oHXB/0X0/034yRWiovDnULU5JLBYnnN.webp?imageMogr2/thumbnail/300x"],
		},
		{
			date: "2026-11-10",
			content: "在这里写下一段随笔。\n也可以换行继续记录",
			images: ["https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/6Vpt/1920X1080/034ZMknGevJT4oWECLatyW.png?imageMogr2/thumbnail/300x"],
		},
		{
			date: "2026-11-07",
			content: "立冬",
			images: ["https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/0uun/0X0/term-lidong-character-v1.webp"]
		},
	],
};
