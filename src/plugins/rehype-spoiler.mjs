export default function rehypeSpoiler() {
	return (tree) => {
		function transform(node) {
			if (
				node.type === "element" &&
				["pre", "code", "spoiler", "script", "style"].includes(node.tagName)
			)
				return;
			if (!node.children) return;

			node.children = node.children.flatMap((child) => {
				if (child.type !== "text") {
					transform(child);
					return [child];
				}

				const parts = [];
				let end = 0;
				for (const match of child.value.matchAll(/!! ([^\n]+?) !!/g)) {
					parts.push({
						type: "text",
						value: child.value.slice(end, match.index),
					});
					parts.push({
						type: "element",
						tagName: "spoiler",
						properties: {},
						children: [{ type: "text", value: match[1] }],
					});
					end = match.index + match[0].length;
				}
				parts.push({ type: "text", value: child.value.slice(end) });
				return parts;
			});
		}

		transform(tree);
	};
}
