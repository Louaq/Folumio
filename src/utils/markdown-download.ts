export function downloadMarkdown(markdown: string, title: string): void {
	const href = URL.createObjectURL(
		new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
	);
	const link = document.createElement("a");
	link.href = href;
	link.download = `${title.replace(/[<>:"/\\|?*]/g, "-")}.md`;
	link.click();
	URL.revokeObjectURL(href);
}
