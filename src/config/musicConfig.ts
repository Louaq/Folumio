export const musicConfig = {
	// custom：自有服务（默认）；netease：网易云音乐歌单，通过 Meting 获取
	source: "custom",
	playlistTitle: "本地歌单",
	// 自有服务配置，仅 custom 模式使用
	songsUrl: "https://ncm.louaq.com/music.json",
	apiBase: "https://ncm.louaq.com",
	audioQuality: "standard", 
	// 网易云歌单配置，仅 netease 模式使用
	netease: {
		playlistId: "2083845712", 
		apiUrl: "https://163.hyc.moe/", 
	},
};
