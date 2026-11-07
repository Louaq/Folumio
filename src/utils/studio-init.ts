import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { downloadMarkdown } from "./markdown-download";

export function initStudio(): void {
	const source =
		document.querySelector<HTMLTextAreaElement>("#markdown-source")!;
	const title = document.querySelector<HTMLInputElement>("#draft-title")!;
	const preview = document.querySelector<HTMLElement>("#markdown-preview")!;
	const position = document.querySelector<HTMLElement>("#cursor-position")!;
	const status = document.querySelector<HTMLElement>("#save-status")!;
	const workspace = document.querySelector<HTMLElement>(".workspace")!;
	const resizer = document.querySelector<HTMLElement>("#studio-resizer")!;
	const resize = (percent: number) => {
		const width = Math.min(80, Math.max(20, percent));
		workspace.style.setProperty("--editor-width", `${width}%`);
		resizer.setAttribute("aria-valuenow", String(Math.round(width)));
	};
	resizer.onpointerdown = (event) => {
		if (event.button !== 0) return;
		event.preventDefault();
		resizer.setPointerCapture(event.pointerId);
		workspace.classList.add("resizing");
		resizer.onpointerup = (up) => resizer.releasePointerCapture(up.pointerId);
		resizer.onpointermove = (move) => {
			const bounds = workspace.getBoundingClientRect();
			resize(((move.clientX - bounds.left) / bounds.width) * 100);
		};
	};
	resizer.onlostpointercapture = () => {
		resizer.onpointermove = null;
		resizer.onpointerup = null;
		workspace.classList.remove("resizing");
	};
	resizer.onkeydown = (event) => {
		const width = Number(resizer.getAttribute("aria-valuenow"));
		const values: Record<string, number> = {
			ArrowLeft: width - 2,
			ArrowRight: width + 2,
			Home: 20,
			End: 80,
		};
		if (!(event.key in values)) return;
		event.preventDefault();
		resize(values[event.key]);
	};
	const imported = sessionStorage.getItem("studio-import");
	const saved = imported || localStorage.getItem("studio-draft");
	if (saved) {
		const draft = JSON.parse(saved);
		source.value = draft.markdown;
		title.value = draft.title;
	}
	type Draft = { title: string; markdown: string };
	const snapshot = (): Draft => ({
		title: title.value,
		markdown: source.value,
	});
	const history = [snapshot()];
	let historyIndex = 0;
	const undo = document.querySelector<HTMLButtonElement>("#studio-undo")!;
	const redo = document.querySelector<HTMLButtonElement>("#studio-redo")!;
	const archive = () => {
		if (!source.value && !title.value) return;
		const drafts: Draft[] = JSON.parse(
			localStorage.getItem("studio-drafts") || "[]",
		);
		const current = snapshot();
		localStorage.setItem(
			"studio-drafts",
			JSON.stringify([
				current,
				...drafts.filter(
					(draft) =>
						draft.title !== current.title ||
						draft.markdown !== current.markdown,
				),
			]),
		);
	};
	const updatePosition = () => {
		const lines = source.value.slice(0, source.selectionStart).split("\n");
		position.textContent = `第 ${lines.length} 行 · 第 ${lines[lines.length - 1].length + 1} 列`;
	};
	const update = () => {
		const current = snapshot();
		if (JSON.stringify(current) !== JSON.stringify(history[historyIndex])) {
			history.splice(historyIndex + 1);
			history.push(current);
			historyIndex++;
		}
		undo.disabled = historyIndex === 0;
		redo.disabled = historyIndex === history.length - 1;
		const body = source.value.replace(
			/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,
			"",
		);
		preview.innerHTML = sanitizeHtml(marked.parse(body, { async: false }), {
			allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
			allowedAttributes: {
				...sanitizeHtml.defaults.allowedAttributes,
				img: ["src", "alt", "title"],
			},
		});
		document.querySelector("#word-count")!.textContent =
			`${source.value.length.toLocaleString()} 字符`;
		localStorage.setItem(
			"studio-draft",
			JSON.stringify({ title: title.value, markdown: source.value }),
		);
		status.textContent = "草稿已保存在此浏览器";
		updatePosition();
	};
	const restoreHistory = (offset: number) => {
		historyIndex += offset;
		source.value = history[historyIndex].markdown;
		title.value = history[historyIndex].title;
		update();
		source.focus();
	};
	undo.onclick = () => restoreHistory(-1);
	redo.onclick = () => restoreHistory(1);
	const handleHistoryKey = (event: KeyboardEvent) => {
		if (!(event.ctrlKey || event.metaKey)) return;
		const key = event.key.toLowerCase();
		if (key !== "z" && key !== "y") return;
		event.preventDefault();
		const button = key === "y" || event.shiftKey ? redo : undo;
		if (!button.disabled) button.click();
	};
	source.onkeydown = handleHistoryKey;
	title.onkeydown = handleHistoryKey;
	document.querySelector<HTMLButtonElement>("#studio-new")!.onclick = () => {
		archive();
		source.value = "";
		title.value = "";
		update();
		source.focus();
	};
	document.querySelector<HTMLButtonElement>("#studio-open")!.onclick = () =>
		document.querySelector<HTMLInputElement>("#open-file")!.click();
	document.querySelector<HTMLButtonElement>("#studio-drafts")!.onclick = () => {
		const drafts: Draft[] = [
			snapshot(),
			...JSON.parse(localStorage.getItem("studio-drafts") || "[]"),
		];
		const list = document.querySelector("#draft-list")!;
		list.replaceChildren();
		drafts.forEach((draft, index) => {
			const button = document.createElement("button");
			button.textContent = `${draft.title || "未命名文章"}${index === 0 ? "（当前）" : ""} · ${draft.markdown.length.toLocaleString()} 字符`;
			button.onclick = () => {
				archive();
				title.value = draft.title;
				source.value = draft.markdown;
				update();
				document.querySelector<HTMLDialogElement>("#drafts-dialog")!.close();
			};
			list.appendChild(button);
		});
		document.querySelector<HTMLDialogElement>("#drafts-dialog")!.showModal();
	};
	document.querySelector<HTMLButtonElement>("#studio-info")!.onclick = () => {
		status.textContent =
			"选中文字后使用工具栏添加格式；草稿自动保存，支持 Ctrl/⌘ Z 撤销。";
	};
	const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
	document.querySelector<HTMLButtonElement>("#studio-properties")!.onclick =
		() => {
			document.querySelector<HTMLInputElement>("#property-title")!.value =
				title.value;
			document.querySelector<HTMLTextAreaElement>(
				"#property-frontmatter",
			)!.value = source.value.match(frontmatterPattern)?.[1] || "";
			document
				.querySelector<HTMLDialogElement>("#properties-dialog")!
				.showModal();
		};
	document.querySelector<HTMLFormElement>("#properties-form")!.onsubmit = (
		event,
	) => {
		event.preventDefault();
		title.value =
			document.querySelector<HTMLInputElement>("#property-title")!.value;
		const metadata = document
			.querySelector<HTMLTextAreaElement>("#property-frontmatter")!
			.value.trim();
		const body = source.value.replace(frontmatterPattern, "");
		source.value = metadata ? `---\n${metadata}\n---\n${body}` : body;
		update();
		document.querySelector<HTMLDialogElement>("#properties-dialog")!.close();
	};
	document
		.querySelectorAll<HTMLButtonElement>("[data-close-dialog]")
		.forEach((button) => {
			button.onclick = () => button.closest("dialog")!.close();
		});
	source.oninput = update;
	title.oninput = update;
	source.onclick = updatePosition;
	source.onkeyup = updatePosition;
	document
		.querySelectorAll<HTMLButtonElement>("[data-before]")
		.forEach((button) => {
			button.onclick = () => {
				const start = source.selectionStart;
				const selected = source.value.slice(start, source.selectionEnd);
				source.setRangeText(
					`${button.dataset.before}${selected}${button.dataset.after || ""}`,
					start,
					source.selectionEnd,
					"end",
				);
				source.focus();
				update();
			};
		});
	document.querySelector<HTMLInputElement>("#open-file")!.onchange = async (
		event,
	) => {
		const file = (event.target as HTMLInputElement).files![0];
		if (!file) return;
		const markdown = await file.text();
		archive();
		source.value = markdown;
		title.value = file.name.replace(/\.[^.]+$/, "");
		update();
		(event.target as HTMLInputElement).value = "";
	};
	document.querySelector<HTMLButtonElement>("#studio-copy")!.onclick =
		async () => {
			try {
				await navigator.clipboard.writeText(source.value);
				status.textContent = "Markdown 已复制";
			} catch {
				status.textContent = "复制失败，请重试";
			}
		};
	document.querySelector<HTMLButtonElement>("#studio-download")!.onclick = () =>
		downloadMarkdown(source.value, title.value || "未命名文章");
	document.querySelector<HTMLButtonElement>("#focus-mode")!.onclick = () => {
		const focused = document.querySelector("main")!.classList.toggle("focus");
		document
			.querySelector("#focus-mode")!
			.setAttribute("aria-pressed", String(focused));
	};
	update();
	if (imported) sessionStorage.removeItem("studio-import");
}
