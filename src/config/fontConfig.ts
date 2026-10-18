export const fontConfig = {
	enable: true,
	// 是否预加载代码字体（正文字体已切片，整包预加载无意义，见 body）
	preload: false,
	body: {
		name: "HarmonyOS Sans SC",
		family: "HarmonyOS Sans SC",
		css: "/font/harmony/result.css",
	},

	// 代码字体（通过 Astro Font API 自托管 + 子集化）
	// astro.config.mjs 据此构建 `fonts` 条目，组件通过 cssVariable 引用。
	code: {
		// astro:assets <Font /> 注入的 CSS 变量名
		cssVariable: "--font-jetbrains-mono",
		// 与 fontsource 家族名一致（fontsource provider 据此匹配）
		family: "JetBrains Mono",
		// 变量字体的字重范围（仅 normal，保持与原 fontsource 导入一致）
		weights: ["100 800"] as [string, ...string[]],
		styles: ["normal"] as ["normal"],
		subsets: ["latin"] as [string, ...string[]],
		// 注入到 --font-jetbrains-mono 的回退序列（不含 JetBrains Mono 本身）
		fallbacks: [
			"ui-monospace",
			"SFMono-Regular",
			"Menlo",
			"Monaco",
			"Consolas",
			"Liberation Mono",
			"Courier New",
			"monospace",
		],
	},

	// 全局字体回退（与 font-family 中顺序一致，含空格的名称需带引号）
	fallback: [
		"-apple-system",
		"BlinkMacSystemFont",
		'"PingFang SC"',
		'"Hiragino Sans GB"',
		'"Microsoft YaHei"',
		'"Segoe UI"',
		'"Roboto"',
		'"Helvetica Neue"',
		"Helvetica",
		"Arial",
		"sans-serif",
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	],
};
