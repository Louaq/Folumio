import { visit } from "unist-util-visit";

// 来自霞葉： https://kasuha.com/posts/fuwari-enhance-ep1/

/**
 * 为正文图片添加加载属性和加载状态样式类，保留 alt 文本，不生成图片说明。
 *
 * @returns {Function} A transformer function for the rehype plugin
 */
export default function rehypeFigure() {
	return (tree) => {
		visit(tree, "element", (node) => {
			// 只处理 img 元素
			if (node.tagName !== "img") {
				return;
			}

			// 正文图片不懒加载（参考 ThriveX-Blog 的做法），渲染即开始下载。
			// markdown-img 类给运行时的"加载完成前模糊占位"用（见 post/rendering.ts）。
			const existingClass = node.properties?.className;
			node.properties = {
				...node.properties,
				loading: node.properties?.loading ?? "eager",
				decoding: node.properties?.decoding ?? "async",
				className: existingClass
					? [].concat(existingClass, "markdown-img")
					: ["markdown-img"],
			};
		});
	};
}
