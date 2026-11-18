import { h } from "hastscript";
import { SKIP, visit } from "unist-util-visit";

const ADMONITION_TYPES = [
	"note",
	"tip",
	"important",
	"warning",
	"caution",
	"abstract",
	"summary",
	"tldr",
	"info",
	"todo",
	"success",
	"check",
	"done",
	"question",
	"help",
	"faq",
	"attention",
	"failure",
	"missing",
	"fail",
	"danger",
	"error",
	"bug",
	"example",
	"quote",
	"cite",
];

export function parseDirectiveNode() {
	return (tree, file) => {
		let codeTabGroup = 0;
		visit(tree, (node, index, parent) => {
			// 时间中的 :59 等纯数字行内指令应保留为原文。
			if (node.type === "textDirective" && /^\d+$/.test(node.name)) {
				parent.children[index] = {
					type: "text",
					value: file
						.toString()
						.slice(node.position.start.offset, node.position.end.offset),
				};
				return SKIP;
			}

			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				const name = node.name ? node.name.toLowerCase() : "";

				if (node.type === "containerDirective" && name === "code-tabs") {
					const tabs = [];
					let tab;
					for (const child of node.children) {
						if (child.type === "paragraph") {
							const source = file.toString().slice(
								child.position.start.offset,
								child.position.end.offset,
							);
							const marker = /^@tab(:active)?[ \t]+(.+)$/.exec(source);
							if (marker) {
								tab = { label: marker[2].trim(), active: Boolean(marker[1]) };
								tabs.push(tab);
							}
						} else if (child.type === "code" && tab && !tab.code) {
							tab.code = child;
						}
					}

					const panels = tabs.filter(({ code }) => code);
					if (panels.length === 0) return;

					const groupName = `folumio-code-tabs-${++codeTabGroup}`;
					const selected = panels.find(({ active }) => active) ?? panels[0];
					node.data = {
						hName: "div",
						hProperties: { className: ["code-tabs"], role: "group", ariaLabel: "代码块分组" },
					};
					node.children = panels.flatMap((panel, index) => {
						const { label, code } = panel;
						const id = `${groupName}-${index + 1}`;
						return [
							{
								type: "paragraph",
								data: {
									hName: "input",
									hProperties: { type: "radio", name: groupName, id, checked: panel === selected },
								},
								children: [],
							},
							{
								type: "paragraph",
								data: { hName: "label", hProperties: { htmlFor: id } },
								children: [{ type: "text", value: label }],
							},
							{
								type: "paragraph",
								data: { hName: "div", hProperties: { className: ["code-tab-panel"] } },
								children: [code],
							},
						];
					});
					return SKIP;
				}

				// 仅对 containerDirective 进行 Admonition 转换
				if (
					node.type === "containerDirective" &&
					ADMONITION_TYPES.includes(name)
				) {
					const type = name.toUpperCase();

					// 处理 label (自定义标题)
					const firstChild = node.children[0];
					if (firstChild?.data?.directiveLabel) {
						// 如果有 label，注入 [!TYPE] 到 label 开头
						if (
							firstChild.children.length > 0 &&
							firstChild.children[0].type === "text"
						) {
							firstChild.children[0].value = `[!${type}] ${firstChild.children[0].value}`;
						} else {
							firstChild.children.unshift({
								type: "text",
								value: `[!${type}] `,
							});
						}
					} else {
						// 没有 label，插入包含 [!TYPE] 的新段落作为第一个子节点
						node.children.unshift({
							type: "paragraph",
							children: [{ type: "text", value: `[!${type}]` }],
						});
					}

					// 转换为 Blockquote
					node.type = "blockquote";
					node.data = node.data || {};
					node.data.hName = "blockquote";
					// 关键：清除可能存在的 hProperties，防止变为自定义标签
					delete node.data.hProperties;
				} else if (node.type === "containerDirective" && name === "grid") {
					// 多图并排，参考 https://blog.cuteleaf.cn/posts/dev-notes/markdown-image-grid/
					// 取出各段落里的图片平铺进网格，列数 = 图片数（最多 4）
					const images = node.children.flatMap((child) =>
						child.type === "paragraph"
							? child.children.filter((n) => n.type === "image")
							: [],
					);
					node.children = images;
					node.data = {
						hName: "div",
						hProperties: {
							className: ["image-grid"],
							style: `--cols: ${Math.min(images.length, 4)}`,
						},
					};
				} else {
					// 其他 Directive，保留原有逻辑：转换为自定义 HTML 标签
					const data = node.data || {};
					node.data = data;
					node.attributes = node.attributes || {};

					// Add specific attributes for directive labels
					if (
						node.children.length > 0 &&
						node.children[0].data &&
						node.children[0].data.directiveLabel
					) {
						node.attributes["has-directive-label"] = true;
					}

					const hast = h(node.name, node.attributes);
					data.hName = hast.tagName;
					data.hProperties = hast.properties;
				}
			}
		});
	};
}
