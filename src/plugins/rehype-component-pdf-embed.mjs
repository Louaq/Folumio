/// <reference types="mdast" />
import { h } from "hastscript";

export function PdfEmbedComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("pdf" must be leaf: ::pdf{src="https://..."})',
		]);
	}

	const rawSrc = properties.src || properties.url;
	if (!rawSrc || typeof rawSrc !== "string") {
		return h(
			"p",
			{ class: "pdf-embed-error my-4 text-red-500" },
			"PDF 预览：缺少 src（或 url）属性。",
		);
	}

	const title =
		typeof properties.title === "string" && properties.title.trim()
			? properties.title.trim()
			: "PDF";
	const height =
		typeof properties.height === "string" && properties.height.trim()
			? properties.height.trim()
			: undefined;

	const viewerSrc = `/pdfjs/web/viewer.html?file=${encodeURIComponent(rawSrc)}#zoom=page-width`;

	return h(
		"div",
		{
			class:
				"pdf-embed not-prose my-6 w-full max-w-full rounded-(--radius-large) border border-black/10 dark:border-white/10 bg-(--btn-regular-bg)/30 dark:bg-white/6",
			style: height ? `--pdf-embed-h: ${height};` : undefined,
			"data-pdf-src": rawSrc,
			"data-pdf-title": title,
		},
		[
			h("iframe", {
				"data-pdf-viewer-src": viewerSrc,
				title,
				class: "pdf-embed-viewer",
				loading: "lazy",
				allowfullscreen: true,
				referrerpolicy: "no-referrer-when-downgrade",
			}),
		],
	);
}
