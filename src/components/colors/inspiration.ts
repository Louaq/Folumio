import paletteData from "../../../data/colorkit-palettes.json";
import { hexToHsl } from "./color";
import { mosaic } from "./studio";

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

const sidebarPalettes = Array.from({ length: mosaic.length / 6 }, (_, index) => ({
	name: `侧栏配色 ${index + 1}`,
	colors: mosaic.slice(index * 6, index * 6 + 6),
}));

export const inspirationPalettes = [...sidebarPalettes, ...paletteData.palettes].flatMap((palette, index) => {
	const name = palette.name || `色板 ${index + 1}`;
	const groups = Math.ceil(palette.colors.length / 10);
	return Array.from({ length: groups }, (_, group) => {
		const colors = palette.colors.slice(
			Math.floor(group * palette.colors.length / groups),
			Math.floor((group + 1) * palette.colors.length / groups),
		);
		return {
			...palette,
			name: groups > 1 ? `${name}（${group + 1}/${groups}）` : name,
			colors,
			families: colors.map(colorFamily),
		};
	});
});

export const paletteSizes = [...new Set(inspirationPalettes.map(palette => palette.colors.length))]
	.sort((a, b) => a - b);
