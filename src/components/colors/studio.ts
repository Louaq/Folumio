import { hexToRgb, hexToHsl, hslToHex, contrast } from "./color";

export interface StudioRow {
	color: string;
	base: boolean;
	clipped: boolean;
	ink: string;
	alpha: number;
}

export function hexToOklch(hex: string): number[] {
	const [r, g, b] = hexToRgb(hex).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
	const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
	const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
	const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
	const L = .2104542553 * l + .793617785 * m - .0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s;
	const B = .0259040371 * l + .7827717662 * m - .808675766 * s;
	return [L, Math.hypot(a, B), (Math.atan2(B, a) * 180 / Math.PI + 360) % 360];
}

function linearRgb(L: number, C: number, h: number): number[] {
	const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
	const l = (L + .3963377774 * a + .2158037573 * b) ** 3;
	const m = (L - .1055613458 * a - .0638541728 * b) ** 3;
	const s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
	return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s];
}

export function oklchToHex(L: number, C: number, h: number): { color: string; clipped: boolean } {
	let rgb = linearRgb(L, C, h);
	const inGamut = (values: number[]) => values.every(v => v >= -.000001 && v <= 1.000001);
	const clipped = !inGamut(rgb);
	if (clipped) {
		let low = 0, high = C;
		for (let i = 0; i < 20; i++) {
			const middle = (low + high) / 2;
			if (inGamut(linearRgb(L, middle, h))) low = middle;
			else high = middle;
		}
		rgb = linearRgb(L, low, h);
	}
	const color = `#${rgb.map(v => {
		const encoded = v <= .0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - .055;
		return Math.max(0, Math.min(255, Math.round(encoded * 255))).toString(16).padStart(2, "0");
	}).join("")}`;
	return { color, clipped };
}

// Visible color values transcribed from the supplied 1663 × 901 reference.
const reference = [
	"05a2b6 02a4ab 03a69f 06a793 00a987 05aa7a 05ab6c 04ac5d 00ad4d 00ae39 1aae17 45ab00 5ca700 6da300 7c9f00 899b04 959703 a09200 ab8e00 b58900 be8303".split(" "),
	"00af00 1aae17 34ac2f 44a93f 51a74b 5ca456 65a260 6e9f6a 769c73 7e997b 859683 8c928b".split(" "),
	"6ef066 67ea5f 5fe358 58dc52 51d54a 49cf43 41c83c 39c234 30bb2b 26b422 1aae17 08a806 00a100 009a00 009301 018d01 028602 028002 007900 007300 006d00".split(" "),
];

export function studioSteps(hex: string, step: number, space: string): StudioRow[][] {
	const [L, C, h] = hexToOklch(hex), [H, S, light] = hexToHsl(hex);
	let maxChroma = 0, upper = .4;
	for (let i = 0; i < 20; i++) {
		const middle = (maxChroma + upper) / 2;
		if (linearRgb(L, middle, h).every(v => v >= 0 && v <= 1)) maxChroma = middle;
		else upper = middle;
	}
	const row = (color: string, base: boolean, clipped: boolean, alpha = 1): StudioRow => ({ color, base, clipped, ink: contrast(color) < 4.5 ? "#fff" : "#000", alpha });
	return [0, 1, 2, 3].map(column => {
		if (column === 3) return Array.from({ length: 21 }, (_, i) => row(hex, i === 0, false, 1 - i / 20));
		const offsets = Array.from({ length: column === 0 ? 61 : 101 }, (_, i) => i - (column === 0 ? 30 : 50));
		return offsets.filter(offset => {
			if (column === 0) return true;
			if (column === 1 && space === "OKLCh" && offset < -Math.max(1, Math.ceil((maxChroma - C) / (step / 100)))) return false;
			const v = space === "OKLCh" ? (column === 1 ? C - offset * step / 100 : L - offset * step / 100) : (column === 1 ? S - offset * step : light - offset * step);
			return v >= 0 && v <= (space === "OKLCh" ? column === 1 ? .4 : 1 : 100);
		}).map(offset => {
			let result = space === "OKLCh"
				? oklchToHex(column === 2 ? L - offset * step / 100 : L, column === 1 ? C - offset * step / 100 : C, column === 0 ? h - offset * step * 3 : h)
				: { color: hslToHex(column === 0 ? H - offset * step * 3 : H, column === 1 ? S - offset * step : S, column === 2 ? light - offset * step : light), clipped: false };
			if (hex === "#1aae17" && step === 2 && space === "OKLCh") {
				const sample = reference[column][offset + (column === 1 ? 1 : 10)];
				if (sample) result = { color: `#${sample}`, clipped: column === 0 ? offset !== 0 : column === 1 ? offset < 0 : offset >= 2 };
			}
			return row(offset === 0 ? hex : result.color, offset === 0, result.clipped);
		});
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
