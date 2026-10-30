export function hexToRgb(hex: string): number[] {
	return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

export function createColorFormatter(options: {
	format: string; delimiter: string; percent: boolean; alphaPercent: boolean;
	decimalZero: boolean; cssNotation: boolean; prefix: boolean; uppercase: boolean; hueUnit: string;
}) {
	const separator = options.delimiter === "Comma" ? ", " : " ";
	const decimal = (number: number) => {
		const text = String(Number(number.toFixed(3)));
		return options.decimalZero ? text : text.replace(/^0\./, ".");
	};
	const numeric = (text: string, name: string, opacity: number) => {
		const alpha = options.alphaPercent ? `${decimal(opacity * 100)}%` : decimal(opacity);
		const components = `${text}${opacity < 1 ? `${options.delimiter === "Comma" ? ", " : " / "}${alpha}` : ""}`;
		return options.cssNotation ? `${name}${opacity < 1 && options.delimiter === "Comma" ? "a" : ""}(${components})` : components;
	};
	return (color: string, opacity = 1): string => {
		if (options.format === "RGB") {
			const rgb = hexToRgb(color).map(channel => options.percent ? `${decimal(channel / 255 * 100)}%` : channel).join(separator);
			return numeric(rgb, "rgb", opacity);
		}
		if (options.format === "HSL") {
			const [h, s, l] = hexToHsl(color);
			const hue = options.hueUnit === "Radians" ? h * Math.PI / 180 : options.hueUnit === "Gradians" ? h / .9 : options.hueUnit === "Turns" ? h / 360 : Number(h.toFixed(1));
			const unit = options.hueUnit === "Radians" ? "rad" : options.hueUnit === "Gradians" ? "grad" : options.hueUnit === "Turns" ? "turn" : options.cssNotation ? "deg" : "°";
			const text = [`${decimal(hue)}${unit}`, `${decimal(Number(s.toFixed(1)))}%`, `${decimal(Number(l.toFixed(1)))}%`].join(separator);
			return numeric(text, "hsl", opacity);
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

export function contrast(hex: string): number {
	const rgb = hexToRgb(hex).map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
	return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05) / 0.05;
}

export function ink(hex: string): string {
	return contrast(hex) > Math.sqrt(21) ? "#141414" : "#ffffff";
}
