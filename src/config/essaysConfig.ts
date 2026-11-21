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
			date: "2026-11-22",
			content: "斗破苍穹完结 (2017-2026) \n 三十年河东, 三十年河西, 莫欺少年穷",
			images: ["https://ss1.tupinayun.cn/autoupload/pzwl0/20261121/TSLC/10019X1080/1794790865724.jpg/webp"],
		},
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
	],
};
