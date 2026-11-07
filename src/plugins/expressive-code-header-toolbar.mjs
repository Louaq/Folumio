function isElement(node, tagName) {
	return (
		!!node && node.type === "element" && (!tagName || node.tagName === tagName)
	);
}

function hasClass(node, className) {
	const value = node?.properties?.className;
	if (Array.isArray(value)) return value.includes(className);
	if (typeof value === "string") return value.split(/\s+/).includes(className);
	return false;
}

function findFirst(node, predicate) {
	if (!node) return null;
	if (predicate(node)) return node;
	if (Array.isArray(node.children)) {
		for (const child of node.children) {
			const found = findFirst(child, predicate);
			if (found) return found;
		}
	}
	return null;
}

export function pluginHeaderToolbar() {
	return {
		name: "Header Toolbar",
		hooks: {
			postprocessRenderedBlock(context) {
				const root = context.renderData.blockAst;
				const figure = findFirst(
					root,
					(node) => isElement(node, "figure") && hasClass(node, "frame"),
				);
				if (!figure || !Array.isArray(figure.children)) return;

				const header = figure.children.find((node) =>
					isElement(node, "figcaption"),
				);
				if (!header) return;
				if (!Array.isArray(header.children)) header.children = [];

				// 复制按钮原本是 figure 的顶层子节点，移到 header 末尾
				const copyIndex = figure.children.findIndex(
					(node) => isElement(node, "div") && hasClass(node, "copy"),
				);
				const copyButton =
					copyIndex !== -1 ? figure.children.splice(copyIndex, 1)[0] : null;

				// 折叠插件只在 has-title/is-terminal 时才会往 header 里塞按钮，
				// 其余情况从底部悬浮按钮克隆一份挪进 header
				let headerToggle = header.children.find(
					(node) =>
						isElement(node, "button") &&
						hasClass(node, "ec-collapse__header-toggle"),
				);
				if (!headerToggle) {
					const floatingToggle = findFirst(
						root,
						(node) =>
							isElement(node, "button") &&
							hasClass(node, "ec-collapse__toggle"),
					);
					if (floatingToggle) {
						headerToggle = {
							type: "element",
							tagName: "button",
							properties: {
								...floatingToggle.properties,
								className: ["ec-collapse__header-toggle"],
							},
							children: floatingToggle.children,
						};
						header.children.push(headerToggle);
					}
				}
				// 只保留图标，去掉「展开 / 折叠」文字
				if (headerToggle) {
					headerToggle.children = headerToggle.children.filter(
						(node) => !isElement(node, "span"),
					);
				}

				// 全屏按钮：点击逻辑见 code-block-init.ts
				header.children.push({
					type: "element",
					tagName: "button",
					properties: {
						type: "button",
						className: ["ec-fullscreen"],
						title: "全屏查看",
						"aria-label": "全屏查看",
					},
					children: [],
				});

				if (copyButton) header.children.push(copyButton);
			},
		},
	};
}
