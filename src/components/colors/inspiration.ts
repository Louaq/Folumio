import { hexToHsl } from "./color";

export const colorFamilies = [
	["红", "#ef4444"], ["橙", "#f59e0b"], ["黄", "#eab308"],
	["绿", "#22c55e"], ["青", "#14d8d4"], ["天蓝", "#87ceeb"],
	["蓝", "#328cdd"], ["紫", "#a855b8"], ["粉", "#f69ac4"],
	["棕", "#80452c"], ["黑", "#171717"], ["灰", "#a5abb3"], ["白", "#ffffff"],
];

export function colorFamily(color: string): string {
	const [h, s, l] = hexToHsl(color);
	if (l < 13) return "黑";
	if (l > 94) return "白";
	if (s < 12) return "灰";
	if (h >= 15 && h < 50 && l < 48) return "棕";
	if (h < 15 || h >= 350) return "红";
	if (h < 45) return "橙";
	if (h < 70) return "黄";
	if (h < 165) return "绿";
	if (h < 190) return "青";
	if (h < 215 && l > 65) return "天蓝";
	if (h < 255) return "蓝";
	if (h < 290) return "紫";
	return "粉";
}

// The first palettes follow the ColorKit reference; scientific palettes reuse the studio collection.
export const inspirationPalettes = [
	{ name: "陶土与海", english: "Clay and Sea", colors: ["#c7522a", "#e5c185", "#fbf2c4", "#74a892", "#008585"] },
	{ name: "柔和时光", english: "Pastel Vibes", colors: ["#d6e6ff", "#d7f9f8", "#ffffea", "#fff0d4", "#fbe0e0", "#e5d4ef"] },
	{ name: "暮色光谱", english: "Evening Spectrum", colors: ["#00202e", "#003f5c", "#2c4875", "#8a508f", "#bc5090", "#ff6361", "#ff8531", "#ffa600", "#ffd380"] },
	{ name: "粉彩虹", english: "Pastel Rainbow", colors: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"] },
	{ name: "落日情绪", english: "Moody Sunset", colors: ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"] },
	{ name: "远山蓝", english: "Sequential Blue", colors: ["#d1dbe4", "#a3b7ca", "#7593af", "#476f95", "#194a7a"] },
	{ name: "星海", english: "Celestial Sea", colors: ["#809bce", "#95b8d1", "#b8e0d4", "#d6eadf", "#eac4d5"] },
	{ name: "森林微风", english: "Forest Breeze", colors: ["#f1ddbf", "#525e75", "#78938a", "#92ba92"] },
	{ name: "苔与石", english: "Moss and Stone", colors: ["#d9d0b4", "#7d6b57", "#879e82", "#666b5e"] },
	{ name: "梅子小夜曲", english: "Plum Serenade", colors: ["#660e60", "#893f71", "#ac6f82", "#cfa093", "#f3d0a4"] },
	{ name: "科研分类", english: "Okabe–Ito · Color universal design", colors: ["#0072b2", "#e69f00", "#009e73", "#cc79a7", "#d55e00", "#56b4e9", "#f0e442"] },
	{ name: "冷暖之间", english: "Diverging Teal and Rose", colors: ["#287d8e", "#8fc3c8", "#f2eee9", "#dda2a0", "#b85260"] },
	{ name: "海岸手记", english: "Coastal Notes", colors: ["#5fcea8", "#5886b5", "#e9b56c", "#d87d82", "#9a8db8"] },
	{ name: "黑白", english: "Monochrome", colors: ["#171717", "#ffffff"] },
	{ name: "赤陶", english: "Terracotta", colors: ["#994636", "#df9b7a", "#f7e5d5"] },
	{ name: "灰阶", english: "Neutral Grayscale", colors: ["#202124", "#41454a", "#636970", "#858d96", "#a8afb7", "#c5cbd1", "#dce0e5", "#e9ecf0", "#f5f6f8", "#ffffff"] },
	{ name: "蓝橙对照", english: "Blue and Orange · Categorical", colors: ["#2878b5", "#f28e2b"] },
	{ name: "青红对照", english: "Teal and Coral · Categorical", colors: ["#168a86", "#e66b60"] },
	{ name: "墨与金", english: "Ink and Gold", colors: ["#233044", "#d7b56d"] },
	{ name: "浆果奶油", english: "Berry and Cream", colors: ["#874667", "#f6e8cc"] },
	{ name: "三色实验", english: "Blue Orange Green · Categorical", colors: ["#3479ae", "#e89b43", "#4c9b80"] },
	{ name: "紫金青", english: "Violet Gold Teal · Categorical", colors: ["#8064a2", "#d9ac4b", "#389b9b"] },
	{ name: "茶室", english: "Quiet Tea", colors: ["#526b51", "#b8bc96", "#f1e5ce"] },
	{ name: "樱与墨", english: "Cherry Blossom and Ink", colors: ["#343848", "#cf8898", "#f7e7e9"] },
	{ name: "极地蓝", english: "Arctic Blue · Sequential", colors: ["#edf7fb", "#c5e4ef", "#86bfd7", "#468eaf", "#225876", "#12354c"] },
	{ name: "松林渐层", english: "Pine Forest · Sequential", colors: ["#eef5e5", "#cadfb0", "#93bf83", "#589c63", "#2e704c", "#194732"] },
	{ name: "紫雾渐层", english: "Violet Mist · Sequential", colors: ["#f4eff8", "#d9cbe9", "#b6a0d3", "#9075b6", "#6c4c91", "#482e67"] },
	{ name: "琥珀渐层", english: "Amber Light · Sequential", colors: ["#fff4d6", "#fadd9b", "#efba64", "#d78e38", "#ad6028", "#77401f"] },
	{ name: "玫瑰渐层", english: "Rose Petals · Sequential", colors: ["#fceef0", "#f4cbd3", "#e99eaf", "#d56f8b", "#ad436c", "#782c52"] },
	{ name: "冷暖平衡", english: "Blue and Rust · Diverging", colors: ["#285f89", "#82b0cd", "#e9eeef", "#e5ad8c", "#af573b"] },
	{ name: "紫绿对映", english: "Violet and Sage · Diverging", colors: ["#634580", "#b29bc9", "#f1eeeb", "#a9c5a0", "#48784d"] },
	{ name: "潮汐温差", english: "Ocean and Sand · Diverging", colors: ["#175c68", "#519ca3", "#b1d4cf", "#f5f0df", "#e7c391", "#cc8b57", "#995438"] },
	{ name: "分组七色", english: "Research Groups · Categorical", colors: ["#4477aa", "#dd8e48", "#4b9b7f", "#bd627b", "#8774b0", "#b7a145", "#6e8e99"] },
	{ name: "图表十色", english: "Chart Colors · Categorical", colors: ["#336b9e", "#e29445", "#4a9570", "#c45f68", "#8c71ae", "#a08058", "#d58eb2", "#7a8791", "#b5ad4a", "#4ba3b0"] },
	{ name: "春日花园", english: "Spring Garden", colors: ["#f1b7c4", "#f6dba7", "#d8e6b0", "#a6ccb7", "#b5c9e4"] },
	{ name: "夏日汽水", english: "Summer Soda", colors: ["#087e8b", "#55c6c1", "#d5f0df", "#ffe49b", "#ff9a76"] },
	{ name: "秋日书页", english: "Autumn Pages", colors: ["#754631", "#b76b3f", "#d6a65b", "#e8d5aa", "#78825b"] },
	{ name: "冬夜", english: "Winter Night", colors: ["#192a3b", "#3e536d", "#7b91a7", "#c4d0dc"] },
	{ name: "杏桃乌龙", english: "Apricot Oolong", colors: ["#9b674a", "#d4a17e", "#f0c9a4", "#f8e6ca"] },
	{ name: "薰衣草拿铁", english: "Lavender Latte", colors: ["#766580", "#ac99b7", "#d3c4d9", "#eee5e5", "#cdb9a4"] },
	{ name: "薄荷可可", english: "Mint Cocoa", colors: ["#4e3e35", "#8e7666", "#d6c5b2", "#c6dfd1", "#77ad99"] },
	{ name: "珊瑚海岸", english: "Coral Coast", colors: ["#125d70", "#3c98a5", "#a9d7d2", "#f6dfc7", "#ec9b88", "#ce6d68"] },
	{ name: "城市霓虹", english: "City Neon", colors: ["#24233d", "#56498c", "#a359b0", "#e673a0", "#ffaf87", "#ffd677"] },
	{ name: "沙漠公路", english: "Desert Highway", colors: ["#534740", "#956952", "#be8b67", "#ddba8c", "#f0dec1", "#9faeaa", "#5e858c"] },
	{ name: "雨后山野", english: "After the Rain", colors: ["#314e52", "#557b76", "#86a396", "#bcc7ac", "#e4e2c7", "#c6b4a0", "#978c89", "#6b7182"] },
	{ name: "花市漫步", english: "Flower Market", colors: ["#a6536c", "#d48299", "#efb6b7", "#f5d8b9", "#e5db9d", "#bdca97", "#87af98", "#709caa"] },
	{ name: "低饱和彩虹", english: "Muted Rainbow", colors: ["#bb6b73", "#d69575", "#dfbe82", "#c7cf9d", "#8fb8a0", "#7daeb6", "#819dc2", "#9d8db8", "#bd92b1"] },
	{ name: "柔彩十色", english: "Soft Color Collection", colors: ["#edb6b6", "#f0c9a6", "#f2dfa4", "#d9e2af", "#b6d9bc", "#aad9d5", "#b1d0e6", "#bcbfe3", "#d3b8dd", "#e6bad0"] },
].map(palette => ({ ...palette, families: palette.colors.map(colorFamily) }));
