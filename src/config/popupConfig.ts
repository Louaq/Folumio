type PopupConfig = {
	enable: boolean;
	title: string;
	showMode: "always" | "once" | "scheduled";
	scheduledAt: string;
	content: string;
};

export const popupConfig: PopupConfig = {
	enable: true,
	title: "网站公告",
	// always：每次进入页面都弹出（含站内切换）；once：同一浏览器只自动弹出一次；
	// scheduled：指定时间到达后，同一浏览器自动弹出一次。
	showMode: "once",
	// 仅 scheduled 模式使用，+08:00 表示北京时间；修改此时间可安排下一次通知。
	scheduledAt: "2026-11-14T10:00:00+08:00",
	// 支持 HTML；仅填写站点维护者可信的内容。
	content: `
		<p>欢迎来到本站！</p>
		<p>这里可以配置<strong>公告内容</strong>，支持链接、图片、列表等 HTML 标签。</p>
	`,
};
