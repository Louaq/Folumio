type PageItem = { kind: "page"; num: number } | { kind: "ellipsis" };

export function buildPageItems(current: number, last: number): PageItem[] {
	if (last <= 1) return [];
	if (last <= 9) {
		return Array.from({ length: last }, (_, i) => ({
			kind: "page" as const,
			num: i + 1,
		}));
	}
	const items: PageItem[] = [];
	const delta = 1;
	const left = Math.max(2, current - delta);
	const right = Math.min(last - 1, current + delta);
	items.push({ kind: "page", num: 1 });
	if (left > 2) items.push({ kind: "ellipsis" });
	for (let i = left; i <= right; i++) {
		items.push({ kind: "page", num: i });
	}
	if (right < last - 1) items.push({ kind: "ellipsis" });
	items.push({ kind: "page", num: last });
	return items;
}

// ClientPagination 的页码按钮：模板渲染与客户端重建共用
const clientPageNumBase =
	"inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium tabular-nums";
export const clientPageNumIdle = `${clientPageNumBase} border-(--juejin-border) bg-(--card-bg) text-(--juejin-text-primary) hover:bg-(--btn-plain-bg-hover)`;
export const clientPageNumActive = `${clientPageNumBase} border-(--primary) bg-(--primary) text-white shadow-xs`;

export const ellipsisClass =
	"flex h-9 items-center px-1 text-sm text-(--juejin-text-tertiary) select-none";
export const jumpGroupClass =
	"group/pjump pagination-jump-group ml-0.5 inline-flex max-w-full";
export const jumpShellClass =
	"inline-flex h-9 overflow-hidden rounded-lg border border-(--juejin-border) bg-(--card-bg)";
export const jumpInputSlotClass =
	"jump-input-slot max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none group-hover/pjump:max-w-12 group-hover/pjump:opacity-100 group-focus-within/pjump:max-w-12 group-focus-within/pjump:opacity-100";
export const jumpInputClass =
	"box-border h-9 w-12 min-w-12 shrink-0 border-0 bg-transparent px-1 text-center text-sm text-(--juejin-text-primary) tabular-nums outline-hidden focus:ring-0";
