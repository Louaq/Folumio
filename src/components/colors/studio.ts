import { hexToRgb, contrast } from "./color";

export interface StudioRow {
	color: string;
	base: boolean;
	clipped: boolean;
	ink: string;
	alpha: number;
}

function rgbToOklab(rgb: number[]): number[] {
	const [r, g, b] = rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
	const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
	const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
	const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
	return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s];
}

function rgbToOklch(rgb: number[]): number[] {
	const [L, a, b] = rgbToOklab(rgb);
	const hue = 180 / Math.PI * Math.atan2(b, a);
	return [L, Math.sqrt(a * a + b * b), hue < 0 ? hue + 360 : hue];
}

export function hexToOklch(hex: string): number[] {
	return rgbToOklch(hexToRgb(hex));
}

function rgbToHex(rgb: number[]): string {
	return `#${rgb.map(v => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function hslToRgb(hue: number, saturation: number, lightness: number): number[] {
	const degrees = hue % 360, h = (degrees < 0 ? degrees + 360 : degrees) / 60;
	const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const x = c * (1 - Math.abs(h % 2 - 1)), m = lightness - c / 2;
	const rgb = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
	return rgb.map(v => (v + m) * 255);
}

function rgbToHsl(rgb: number[]): number[] {
	const [r, g, b] = rgb.map(v => v / 255);
	const maximum = Math.max(r, g, b), delta = maximum - Math.min(r, g, b);
	const lightness = maximum - delta / 2;
	const hue = delta === 0 ? 0 : 60 * (maximum === r ? (g - b) / delta : maximum === g ? 2 + (b - r) / delta : 4 + (r - g) / delta);
	const saturation = lightness === 0 || lightness === 1 ? 0 : (maximum - lightness) / Math.min(lightness, 1 - lightness);
	return [hue < 0 ? hue + 360 : hue, saturation, lightness];
}

function oklchToRgb(L: number, C: number, h: number): { rgb: number[]; clipped: boolean } {
	const convert = (chroma: number) => {
		const radians = h / (180 / Math.PI), a = chroma * Math.cos(radians), b = chroma * Math.sin(radians);
		const rootL = L + .3963377774 * a + .2158037573 * b;
		const rootM = L - .1055613458 * a - .0638541728 * b;
		const rootS = L - .0894841775 * a - 1.291485548 * b;
		const l = rootL * rootL * rootL, m = rootM * rootM * rootM, s = rootS * rootS * rootS;
		return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s]
			.map(v => (v <= .0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - .055) * 255);
	};
	const inGamut = (rgb: number[]) => rgb.every(v => v >= 0 && v <= 255);
	let rgb = convert(C);
	const clipped = !inGamut(rgb);
	if (clipped) {
		let low = 0, high = C;
		while (true) {
			const middle = (low + high) / 2;
			rgb = convert(middle);
			if ((high - low) / 2 < .001) break;
			if (inGamut(rgb)) low = middle;
			else high = middle;
		}
	}
	return { rgb: rgb.map(v => Math.max(0, Math.min(255, v))), clipped };
}

export function oklchToHex(L: number, C: number, h: number): { color: string; clipped: boolean } {
	const { rgb, clipped } = oklchToRgb(L, C, h);
	return { color: rgbToHex(rgb), clipped };
}

export function studioSteps(hex: string, step: number, space: string): StudioRow[][] {
	const perceptual = space === "OKLCh";
	let components = perceptual ? hexToOklch(hex) : rgbToHsl(hexToRgb(hex));
	const original = perceptual ? oklchToRgb(components[0], components[1], components[2]) : { rgb: hexToRgb(hex), clipped: false };
	if (perceptual && original.clipped) components = original.rgb.every(v => Math.round(v) === 0) ? [0, 0, 0] : original.rgb.every(v => Math.round(v) === 255) ? [1, 0, 0] : rgbToOklch(original.rgb);
	type Stop = StudioRow & { position: number; lab: number[]; key: string };
	return [0, 1, 2, 3].map(column => {
		const channel = perceptual ? [2, 1, 0, 3][column] : column;
		const start = column === 3 ? 1 : components[channel];
		const sample = (position: number, base = false): Stop => {
			const coordinates = [...components];
			if (column !== 3) coordinates[channel] = position;
			const alpha = column === 3 ? position : 1;
			let mapped = original;
			if (!base) {
				if (perceptual) mapped = oklchToRgb(coordinates[0], coordinates[1], coordinates[2]);
				else {
					const rgb = hslToRgb(coordinates[0], coordinates[1], coordinates[2]);
					mapped = { rgb: rgb.map(v => Math.max(0, Math.min(255, v))), clipped: rgb.some(v => v < 0 || v > 255) };
				}
			}
			const color = rgbToHex(mapped.rgb);
			// 0to255 measures translucent colors after compositing over #e6e6e6.
			const lab = rgbToOklab(mapped.rgb.map(v => alpha * v + (1 - alpha) * 230));
			const suffix = alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, "0") : "";
			return { color, base, clipped: mapped.clipped, ink: contrast(color) < 4.5 ? "#fff" : "#000", alpha, position, lab, key: color + suffix };
		};
		const advance = (position: number, endpoint: number): Stop => {
			const origin = sample(position), end = sample(endpoint);
			const distance = (stop: Stop) => 100 * Math.sqrt(stop.lab.reduce((sum, v, i) => sum + (v - origin.lab[i]) ** 2, 0));
			const increasing = endpoint > position;
			let low = increasing ? origin : end, high = increasing ? end : origin;
			let lowDistance = distance(low), highDistance = distance(high);
			while (low.position <= high.position) {
				const middle = sample((low.position + high.position) / 2), delta = distance(middle);
				if (delta === lowDistance || delta === highDistance) break;
				if (delta === step) return middle;
				if (increasing ? delta < step : delta > step) { low = middle; lowDistance = delta; }
				else { high = middle; highDistance = delta; }
			}
			if (lowDistance === 0 && highDistance === 0) return end;
			const closest = lowDistance === 0 ? high : highDistance === 0 ? low : Math.abs(lowDistance - step) > Math.abs(highDistance - step) ? high : low;
			return closest.key === end.key ? end : closest;
		};
		const side = (endpoint: number): Stop[] => {
			const stops: Stop[] = [];
			let position = start;
			while (position !== endpoint) {
				const next = advance(position, endpoint);
				stops.push(next);
				position = next.position;
			}
			return stops;
		};
		const before = side(column === 0 ? start + 180 : perceptual && column === 1 ? .4 : 1).reverse();
		const after = side(column === 0 ? start - 180 : 0);
		const stops = [...before, sample(start, true), ...after];
		let baseIndex = before.length;
		// Preserve the terminal colors while removing duplicate boundary swatches.
		while (stops.length >= 2 && stops[0].key === stops[1].key) { stops.splice(1, 1); baseIndex = Math.max(0, baseIndex - 1); }
		while (stops.length >= 2 && stops.at(-1)!.key === stops.at(-2)!.key) stops.splice(-2, 1);
		stops[Math.min(baseIndex, stops.length - 1)] = sample(start, true);
		return stops.map(({ position, lab, key, ...row }) => row);
	});
}


export const mosaic = `
c17598 8f7cba a56eaf 7cb0af 9daeac 6ec9da
8a95be 89abde 7ba693 869c56 8ff07d a8dabc
b5dbbf 9be1a9 7bdb5c 8fec86 8eed98 9de1ad
9f8ce0 73e3c6 87e28f a8f056 8dd78d 61fbcc
88a6e3 a9dab6 8efb8b 98d989 a8fb71 bcf1aa
78a4c3 865ec4 c3b6a7 c3fbb9 adc0bb b1f4b4
55a8eb 90abc1 eea8d9 b3c0b3 8ef18e 8fc3c8
8f5bc3 a865c9 8aa48a 55d3ce 91cfa0 fbd6ba
d45acb c282ce 94b156 8eaba6 a8baaf e1b3c4
979c8d 9b7fb3 92afb4 728480 beb5ad 98fbb3
f1bf7a 84a99f a8a7b9 a292db b19da3 aedf66
a8b176 cff28b a9b6bc 93a8cc b1c2bf a8c1c5
ef996d e2d67f fbe5c3 e2d0ca c7e6f2 a9d9be
e7da69 dc7d85 d8c3aa c9a3d9 c5abd2 b6f3ae
eee6a1 c78f93 c7b16c ddbeb8 c5d6a9 d6baba
9ef9b3 8cd6db c1ab95 ddd256 beaf81 c0bb6f
a8fbcc a9918b b27b78 c3a476 8f8170 818ea7
8383a5 aba887 d89e86 8fbe6c af8c96 a874b5
70748e 88909e a486b9 af92aa c955b8 9d5bc9
75917c 74978f 9399a8 e184bf 9684ae 8472ac
c5797a a9a2ba 689bdc 8297a1 bd55c5 ca84d1
6181ce 6161cf a68cbb 6379a9 98866d fb8f7c
9e55fc bd9bca 99c7bb 9a99c2 8f8c75 bd959c
74a0e8 b0e4c3 96bacb 55ada9 99c78b dcafc2
97a8cc 97b6d3 8cb696 a79bb0 a8c2b4 d89dcd
747dc1 80b4b7 9ba7b1 d6b5b2 e4c5b1 f4b3fc
5563e8 7ccbdb 7bfbdd d4a7d9 dad0c1 a69ee8
779bf8 74fbd1 bddad3 fbc5f5 b5ecca a4d8d3
657ce6 97adad b1bcad c29cb9 a8badd c7d8ee
6e77b8 809bb6 b5b4bd d083c0 d1b4b6 b77fae
8aa8ca a5a8c0 fb89bb da707d e0889d b27483
888aae 77a09c caa699 e5aa97 af93b1 fb55c6
74a8cc a081db ddabc7 e682d2 cd55d3 f47ea3
ab94fb 7b7fd0 b8a9f1 fb7fba bea7a1 fb558d
b368c0 a394dd a8a8e8 b8a4ce af93c8 c297c4
af51ae 6551c0 799ea9 7aacc8 bcb1e1 bc79ef
`.trim().split(/\s+/).map(color => `#${color}`);
