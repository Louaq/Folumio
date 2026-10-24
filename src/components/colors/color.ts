export function hexToRgb(hex: string): number[] {
	return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

export function createColorFormatter(options: {
	format: string; delimiter: string; percent: boolean; alphaPercent: boolean;
	decimalZero: boolean; cssNotation: boolean; prefix: boolean; uppercase: boolean; alpha: number; hueUnit: string;
}) {
	return (color: string, opacity = options.alpha): string => {
		const separator = options.delimiter === "Comma" ? ", " : " ";
		const decimal = (number: number) => {
			const text = String(Number(number.toFixed(3)));
			return options.decimalZero ? text : text.replace(/^0\./, ".");
		};
		if (options.format === "RGB") {
			const rgb = hexToRgb(color).map(channel => options.percent ? `${decimal(channel / 255 * 100)}%` : channel).join(separator);
			const alpha = options.alphaPercent ? `${decimal(opacity * 100)}%` : decimal(opacity);
			const components = `${rgb}${opacity < 1 ? `${options.delimiter === "Comma" ? ", " : " / "}${alpha}` : ""}`;
			return options.cssNotation ? `${opacity < 1 && options.delimiter === "Comma" ? "rgba" : "rgb"}(${components})` : components;
		}
		if (options.format === "HSL") {
			const [h, s, l] = hexToHsl(color);
			const hue = options.hueUnit === "Radians" ? h * Math.PI / 180 : options.hueUnit === "Gradians" ? h / .9 : options.hueUnit === "Turns" ? h / 360 : Number(h.toFixed(1));
			const unit = options.hueUnit === "Radians" ? "rad" : options.hueUnit === "Gradians" ? "grad" : options.hueUnit === "Turns" ? "turn" : options.cssNotation ? "deg" : "°";
			const text = [`${decimal(hue)}${unit}`, `${decimal(Number(s.toFixed(1)))}%`, `${decimal(Number(l.toFixed(1)))}%`].join(separator);
			const alpha = options.alphaPercent ? `${decimal(opacity * 100)}%` : decimal(opacity);
			const components = `${text}${opacity < 1 ? `${options.delimiter === "Comma" ? ", " : " / "}${alpha}` : ""}`;
			return options.cssNotation ? `${opacity < 1 && options.delimiter === "Comma" ? "hsla" : "hsl"}(${components})` : components;
		}
		const suffix = opacity < 1 ? Math.round(opacity * 255).toString(16).padStart(2, "0") : "";
		const hex = `${color.slice(1)}${suffix}`;
		return `${(options.format === "HEX" ? options.prefix : options.cssNotation || options.prefix) ? "#" : ""}${options.uppercase ? hex.toUpperCase() : hex}`;
	};
}

export function hexToHsl(hex: string): number[] {
	const [r, g, b] = hexToRgb(hex).map((channel) => channel / 255);
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	const delta = max - min, lightness = (max + min) / 2;
	if (delta === 0) return [0, 0, lightness * 100];
	const hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
	return [(hue * 60 + 360) % 360, delta / (1 - Math.abs(2 * lightness - 1)) * 100, lightness * 100];
}

export function hslToHex(hue: number, saturation: number, lightness: number): string {
	const h = ((hue % 360) + 360) % 360 / 60;
	const s = saturation / 100, l = lightness / 100;
	const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h % 2 - 1)), m = l - c / 2;
	const rgb = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
	return `#${rgb.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("")}`;
}

export function contrast(hex: string): number {
	const rgb = hexToRgb(hex).map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
	return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05) / 0.05;
}

export function ink(hex: string): string {
	return contrast(hex) > Math.sqrt(21) ? "#141414" : "#ffffff";
}

export function colorSteps(hex: string, count: number): string[][] {
	const [h, s, l] = hexToHsl(hex), middle = (count - 1) / 2;
	const light = Math.max(96, l), dark = Math.min(8, l);
	return [
		Array.from({ length: count }, (_, i) => hslToHex(h + (i - middle) * 12, s, l)),
		Array.from({ length: count }, (_, i) => hslToHex(h, i <= middle ? 100 - (100 - s) * i / middle : s * (count - 1 - i) / middle, l)),
		Array.from({ length: count }, (_, i) => hslToHex(h, s, i <= middle ? light - (light - l) * i / middle : l - (l - dark) * (i - middle) / middle)),
	].map((column) => column.map((color, i) => i === middle ? hex.toLowerCase() : color));
}

export const palettes = [
	{ name: "海岸手记", english: "Coastal notes", type: "分类", colors: ["#5fcea8", "#5886b5", "#e9b56c", "#d87d82", "#9a8db8"] },
	{ name: "Okabe–Ito", english: "Color universal design", type: "分类", colors: ["#0072b2", "#e69f00", "#009e73", "#cc79a7", "#d55e00", "#56b4e9", "#f0e442"] },
	{ name: "暮色蓝", english: "Sequential blue", type: "连续", colors: ["#dbe9f6", "#a6c8e3", "#6c9dc7", "#386fa4", "#17456f"] },
	{ name: "冷暖之间", english: "Diverging teal & rose", type: "发散", colors: ["#287d8e", "#8fc3c8", "#f2eee9", "#dda2a0", "#b85260"] },
];
