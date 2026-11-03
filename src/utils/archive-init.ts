/**
 * 归档页“年份展开状态”的初始化与恢复。
 *
 * 归档页内容渲染在 swup 的 #swup-container 内，而 swup 用
 * `new DOMParser().parseFromString(html, "text/html")` 解析目标页面后
 * 通过 `cloneNode(true)` 换入 DOM——DOMParser 生成的文档默认禁用脚本，
 * 其内部 <script> 的“已启动”标记会被 cloneNode 一并复制，导致换入的
 * <script> 永远不会自动执行。也就是说，如果用户是从其他页面通过 swup
 * 单页跳转“第一次”进入归档页（而不是直接整页加载 /archive/），归档页
 * 自身 <script> 里注册的任何事件监听器都不会被注册——之后无论再返回
 * 几次归档页，监听器依然缺失，年份分组状态就再也无法恢复。
 *
 * 因此本函数不能只由归档页自身的 <script> 调用一次；还需要被 Layout.astro
 * 的公共入口按需导入，并在首载和 `astro:page-load` 时调用；Swup 在 `page:view`
 * 钩子派发该事件，因此无需依赖归档页自身脚本重新执行。
 */
export function initArchivePage(): void {
	const list = document.getElementById("archive-list");
	if (!list) return;

	const groupsOf = () =>
		document.querySelectorAll<HTMLDetailsElement>(".archive-year-group");

	// 按查询串分键，使筛选视图与完整视图各自保留独立的展开状态
	const stateKey = () => `archive:open-years:${window.location.search}`;

	function saveOpenYears() {
		const open = Array.from(groupsOf())
			.filter((g) => g.open)
			.map((g) => g.dataset.year || "");
		try {
			sessionStorage.setItem(stateKey(), JSON.stringify(open));
		} catch (_e) {
			/* ignore */
		}
	}

	function restoreOpenYears() {
		let open: string[] | null = null;
		try {
			const raw = sessionStorage.getItem(stateKey());
			if (raw) open = JSON.parse(raw);
		} catch (_e) {
			/* ignore */
		}
		if (!Array.isArray(open)) return;

		for (const group of groupsOf()) {
			group.open = open.includes(group.dataset.year || "");
		}
	}

	function applyFilters() {
		const params = new URLSearchParams(window.location.search);
		const tags = params
			.getAll("tag")
			.map((t) => t.trim())
			.filter(Boolean);
		const categories = params
			.getAll("category")
			.map((c) => c.trim())
			.filter(Boolean);
		const uncategorized = params.get("uncategorized");

		if (!tags.length && !categories.length && !uncategorized) return;

		const labelS = list?.dataset.labelSingular || "";
		const labelP = list?.dataset.labelPlural || "";

		for (const row of document.querySelectorAll<HTMLElement>(
			".archive-row-link",
		)) {
			const postTags = (row.dataset.tags || "").split(",").filter(Boolean);
			const postCat = row.dataset.category || "";
			let hide = false;

			if (tags.length && !postTags.some((t) => tags.includes(t))) hide = true;
			if (categories.length && !categories.includes(postCat)) hide = true;
			if (uncategorized && postCat) hide = true;

			if (hide) row.style.display = "none";
		}

		for (const group of groupsOf()) {
			const visible = group.querySelectorAll(
				".archive-row-link:not([style*='display: none'])",
			);
			const countEl = group.querySelector(".archive-year-count");
			if (!visible.length) {
				group.style.display = "none";
			} else if (countEl) {
				countEl.textContent = `${visible.length} ${visible.length === 1 ? labelS : labelP}`;
				group.open = true;
			}
		}
	}

	restoreOpenYears();
	applyFilters();

	for (const group of groupsOf()) {
		// 每次调用都会换入全新的 DOM 节点（见上方说明），无需担心重复绑定
		group.addEventListener("toggle", saveOpenYears);
	}
}
