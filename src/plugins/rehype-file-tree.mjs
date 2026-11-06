import { h } from "hastscript";

const text = (node) =>
	node.type === "text" ? node.value : (node.children || []).map(text).join("");
const elements = (node) =>
	node.children.filter((child) => child.type === "element");

function renderList(list) {
	return h(
		"ul.ft-list",
		elements(list).map((item) => {
			const children = elements(item);
			const nested = children.find((child) => child.tagName === "ul");
			const label = children.some((child) => child.tagName === "p")
				? structuredClone(
						children.find((child) => child.tagName === "p").children,
					)
				: structuredClone(item.children.filter((child) => child !== nested));
			const first = label[0];
			const change =
				first?.type === "text" && first.value.match(/^(\+\+|--|—) /);
			const status = change ? (change[1] === "++" ? "added" : "removed") : "";
			if (change) first.value = first.value.slice(change[0].length);

			const commentIndex = label.findIndex(
				(child) => child.type === "text" && child.value.includes(" # "),
			);
			let comment = [];
			if (commentIndex !== -1) {
				const node = label[commentIndex];
				const split = node.value.indexOf(" # ");
				comment = [
					{ type: "text", value: node.value.slice(split + 3) },
					...label.splice(commentIndex + 1),
				];
				node.value = node.value.slice(0, split);
			}

			const name = label.map(text).join("").trim();
			const folder = !!nested || name.endsWith("/");
			const extension = name.split(".").pop();
			const kind = folder
				? "folder"
				: {
						ts: "ts",
						scss: "css",
						css: "css",
						md: "md",
						json: "json",
						yaml: "yaml",
						yml: "yaml",
					}[extension] || "file";
			const icon = h(
				`span.ft-icon.ft-icon-${kind}`,
				{ ariaHidden: "true" },
				folder
					? h(
							"svg",
							{ viewBox: "0 0 16 16", fill: "currentColor" },
							h("path", { d: "M1 4h5l2-2h6v3H1zm0 2h14v8H1z" }),
						)
					: { ts: "TS", css: "#", md: "M↓", json: "{}", yaml: "Y" }[kind] ||
							"▤",
			);
			const row = [
				h(
					"span.ft-change",
					{
						ariaLabel:
							status === "added"
								? "新增"
								: status === "removed"
									? "删除"
									: undefined,
					},
					status === "added" ? "+" : status === "removed" ? "-" : "",
				),
				h("span.ft-chevron", { ariaHidden: "true" }),
				...(name === "…" || name === "..." ? [] : [icon]),
				h("span.ft-name", label),
				...(comment.length
					? [h("span.ft-comment", [{ type: "text", value: "# " }, ...comment])]
					: []),
			];
			return h(
				"li.ft-item",
				{ className: ["ft-item", ...(status ? [`ft-${status}`] : [])] },
				folder
					? h("details", { open: !name.endsWith("/") }, [
							h("summary.ft-row", row),
							...(nested ? [renderList(nested)] : []),
						])
					: h("div.ft-row", row),
			);
		}),
	);
}

export default function rehypeFileTree() {
	return (tree) => {
		function transform(parent) {
			if (!parent.children || ["pre", "code"].includes(parent.tagName)) return;
			for (let index = 0; index < parent.children.length; index++) {
				const node = parent.children[index];
				const match =
					node.tagName === "p" &&
					text(node).match(/^::: file-tree(?:[ \t]+(.+))?$/);
				if (!match) {
					transform(node);
					continue;
				}
				let end = index + 1;
				while (
					end < parent.children.length &&
					parent.children[end].type === "text"
				)
					end++;
				const list = parent.children[end];
				if (list?.tagName !== "ul") continue;
				end++;
				while (
					end < parent.children.length &&
					parent.children[end].type === "text"
				)
					end++;
				const closing = parent.children[end];
				if (closing?.tagName !== "p" || text(closing).trim() !== ":::")
					continue;
				parent.children.splice(
					index,
					end - index + 1,
					h("div.file-tree", [
						...(match[1] ? [h("div.ft-title", match[1])] : []),
						renderList(list),
					]),
				);
			}
		}
		transform(tree);
	};
}
