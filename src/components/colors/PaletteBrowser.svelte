<script lang="ts">
	import { ink } from "./color";
	import { colorFamilies, inspirationPalettes, paletteSizes } from "./inspiration";
	import StudioDropdown from "./StudioDropdown.svelte";
	export let onselect: (color: string) => void;
	let dialog: HTMLDialogElement;
	let family = "";
	let count = 0;
	let sort = "推荐";
	let visibleCount = 60;
	let loading = false;
	$: filtered = inspirationPalettes
		.filter(
			(palette) =>
				(!family || palette.families.includes(family)) &&
				(!count || palette.colors.length === count),
		)
		.sort((a, b) =>
			sort === "名称"
				? a.name.localeCompare(b.name, "zh-CN")
				: sort === "颜色数量"
					? a.colors.length - b.colors.length
					: 0,
		);
	function reset() {
		family = "";
		count = 0;
	}
	async function loadNext() {
		if (loading || visibleCount >= filtered.length ||
			dialog.scrollHeight - dialog.scrollTop - dialog.clientHeight > 24) return;
		loading = true;
		await new Promise<void>(resolve => {
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
		});
		visibleCount = Math.min(visibleCount + 60, filtered.length);
		loading = false;
	}
</script>

<button
	class="browse-button"
	on:click={() => { visibleCount = 60; dialog.showModal(); }}
	aria-haspopup="dialog"
>配色灵感</button>
<dialog
	bind:this={dialog}
	aria-labelledby="palette-title"
	on:scroll={loadNext}
	on:cancel={event => event.preventDefault()}
>
	<div class="close-bar">
		<button class="close" aria-label="关闭配色灵感" on:click={() => dialog.close()}>×</button>
	</div>
	<div class="browser">
		<header>
			<h1 id="palette-title">发现下一组配色</h1>
			<p>从色彩中寻找灵感，点击任意色块，开始探索它的色阶。</p>
		</header>
		<div class="filters">
			<div class="filter-row" role="group" aria-label="按色系筛选">
				<span class="filter-label">色系</span>
				<button
					class:active={!family}
					aria-pressed={!family}
					on:click={() => family = ""}
				>全部</button>
				{#each colorFamilies as [name, color]}
					<button
						class:active={family === name}
						aria-pressed={family === name}
						on:click={() => family = family === name ? "" : name}
					><i style:background={color}></i>{name}</button>
				{/each}
			</div>
			<div class="filter-row" role="group" aria-label="按颜色数量筛选">
				<span class="filter-label">数量</span>
				<button class:active={!count} aria-pressed={!count} on:click={() => count = 0}>全部</button>
				{#each paletteSizes as size}
					<button
						class:active={count === size}
						aria-pressed={count === size}
						on:click={() => count = count === size ? 0 : size}
					>{size} 色</button>
				{/each}
			</div>
		</div>
		<div class="sort-row">
			<StudioDropdown id="palette-sort-menu" label="配色排序" options={["推荐", "名称", "颜色数量"]} bind:value={sort} hover>
				<svg class="sort-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 17V3m-3 3 3-3 3 3M10 4h8m-8 5h6m-6 5h4" /></svg>
				排序
			</StudioDropdown>
		</div>
		<p class="result-count" role="status">{filtered.length} 组配色{#if family || count}<button on:click={reset}>清除筛选</button>{/if}</p>
		<div class="palette-grid" aria-busy={loading}>
			{#each filtered.slice(0, visibleCount) as palette}
				<article>
					<div class="swatches" aria-label={palette.name}>
						{#each palette.colors as color}
							<button
								style:background={color}
								style:color={ink(color)}
								aria-label={`将 ${color} 设为基色`}
								title={`使用 ${color}`}
								on:click={() => { onselect(color); dialog.close(); }}
							><span>{color.toUpperCase()}</span></button>
						{/each}
					</div>
					<div class="caption"><h2>{palette.name}</h2><span>{palette.colors.length} 色</span></div>
				</article>
			{:else}
				<div class="empty"><h2>没有找到匹配的配色</h2><p>试试其他色系或颜色数量。</p><button on:click={reset}>查看全部配色</button></div>
			{/each}
		</div>
		{#if visibleCount < filtered.length}
			<div class="load-status" role="status">{loading ? "Loading" : ""}</div>
		{/if}
		<footer>色板来源 <a href="https://colorkit.co/palettes/" target="_blank" rel="noreferrer">ColorKit</a> 与原侧栏预设 · 点击色块设为基色</footer>
	</div>
</dialog>

<style>
	button {
		font: inherit;
	}
	button {
		cursor: pointer;
	}
	.browse-button {
		height: 34px;
		padding: 0 12px;
		flex-shrink: 0;
		border: 1px solid #929c9c;
		border-radius: 7px;
		background: #ffffff80;
		color: #283a40;
		font-size: 13px;
	}
	dialog {
		width: min(1400px, calc(100vw - 48px));
		max-height: calc(100dvh - 48px);
		padding: 0;
		border: 1px solid #ffffff99;
		border-radius: 22px;
		color: #233047;
		background: #fff;
		box-shadow: 0 24px 100px #14283b40;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-gutter: stable;
	}
	dialog::-webkit-scrollbar {
		width: 8px;
	}
	dialog::-webkit-scrollbar-track {
		background: transparent;
		margin: 22px 0;
	}
	dialog::-webkit-scrollbar-thumb {
		border: 2px solid transparent;
		border-radius: 999px;
		background: #627c8580;
		background-clip: padding-box;
	}
	dialog::-webkit-scrollbar-thumb:hover {
		background-color: #49666fcc;
	}
	dialog::-webkit-scrollbar-button {
		display: none;
		width: 0;
		height: 0;
	}
	dialog::-webkit-scrollbar-corner {
		background: transparent;
	}
	dialog::backdrop {
		background: #15233233;
	}
	.browser {
		padding: 45px 48px 24px;
	}
	.close-bar {
		position: sticky;
		top: 0;
		height: 0;
		z-index: 1;
	}
	.close {
		position: absolute;
		right: 6px;
		top: 14px;
		width: 34px;
		height: 34px;
		border: 0;
		border-radius: 50%;
		background: #f2f4f6;
		color: #5f6c7b;
		font-size: 26px;
	}
	header {
		text-align: center;
		margin-bottom: 38px;
	}
	.eyebrow {
		color: #65918d;
		font-size: 11px;
		letter-spacing: 0.2em;
	}
	h1 {
		margin: 10px 0;
		font-size: clamp(26px, 3vw, 40px);
		letter-spacing: -0.04em;
	}
	header > p:last-child {
		color: #85909e;
		font-size: 15px;
		line-height: 1.7;
	}
	.filters {
		display: grid;
		gap: 12px;
	}
	.filter-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
	}
	.filter-label {
		width: 48px;
		color: #86909e;
		font-size: 13px;
	}
	.filter-row button {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 8px 12px;
		border: 1px solid #dfe3e9;
		border-radius: 22px;
		background: #fff;
		color: #344157;
		font-size: 13px;
	}
	.filter-row button:hover,
	.filter-row button.active {
		border-color: #599b95;
		background: #eef7f5;
		color: #246d65;
	}
	i {
		width: 9px;
		height: 9px;
		border: 1px solid #0002;
		border-radius: 50%;
	}
	.sort-row {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 24px;
		gap: 8px;
		color: #788495;
		font-size: 13px;
	}
	.sort-row :global(.dropdown-trigger) {
		min-width: 98px;
		height: 48px;
		justify-content: center;
		gap: 6px;
		padding: 0 18px;
		border: 0;
		border-radius: 10px;
		background: #f4f6f8;
		box-shadow: none;
		color: #344157;
		font: inherit;
		font-size: 16px;
	}
	.sort-row :global(.dropdown-trigger[aria-expanded="true"]) {
		background: #e9ecef;
		box-shadow: none;
	}
	.sort-icon {
		width: 20px;
		height: 20px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sort-row :global(.dropdown-menu) {
		width: 144px;
		padding: 9px;
		overflow: visible;
		border: 0;
		border-radius: 10px;
		background: #333;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: 0 8px 24px #2330471f;
		color: #fff;
	}
	.sort-row :global(.dropdown-menu)::before {
		content: "";
		position: absolute;
		inset: -10px 0 auto;
		height: 10px;
	}
	.sort-row :global(.dropdown-menu)::after {
		content: "";
		position: absolute;
		left: calc(50% - 6px);
		top: -6px;
		border-right: 6px solid transparent;
		border-bottom: 6px solid #333;
		border-left: 6px solid transparent;
	}
	.sort-row :global(.dropdown-menu button) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 0;
		min-height: 30px;
		padding: 6px 10px;
		border-radius: 5px;
		background: #484848;
		font-family: inherit;
		font-size: 13px;
		line-height: 18px;
	}
	.sort-row :global(.dropdown-menu button + button) {
		margin-top: 4px;
	}
	.sort-row :global(.dropdown-menu button:hover),
	.sort-row :global(.dropdown-menu button:focus-visible) {
		background: #484848;
		color: #fff;
		outline: 1px solid #aaa;
		outline-offset: -1px;
	}
	.sort-row :global(.dropdown-menu button[aria-checked="true"]) {
		color: #fff;
		font-weight: 600;
	}
	.sort-row :global(.dropdown-menu button[aria-checked="true"])::after {
		content: "";
		width: 5px;
		height: 9px;
		margin-right: 3px;
		border: solid currentColor;
		border-width: 0 1.5px 1.5px 0;
		transform: rotate(45deg);
	}
	.result-count {
		display: flex;
		gap: 16px;
		align-items: center;
		font-size: 12px;
		color: #8993a1;
		margin: 16px 0;
	}
	.result-count button {
		border: 0;
		padding: 0;
		background: none;
		color: #367e78;
	}
	.palette-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px;
	}
	.swatches {
		display: flex;
		height: 148px;
		overflow: hidden;
		border-radius: 18px;
		box-shadow: 0 5px 22px #2330470c;
	}
	.swatches button {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		flex: 1;
		min-width: 0;
		padding: 12px 0;
		border: 0;
		transition: flex 0.2s;
	}
	.swatches button:hover,
	.swatches button:focus-visible {
		flex: 2.4;
	}
	.swatches button:focus-visible {
		outline-offset: -4px;
	}
	.swatches span {
		opacity: 0;
		font-size: 10px;
		transition: opacity 0.15s;
	}
	.swatches button:hover span,
	.swatches button:focus-visible span {
		opacity: 1;
	}
	.caption {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding-top: 10px;
	}
	.caption h2 {
		margin: 0;
		min-width: 0;
		overflow-wrap: anywhere;
		font-size: 13px;
		font-weight: 500;
	}
	.caption > span {
		color: #929baa;
		font-size: 11px;
		white-space: nowrap;
	}
	.empty {
		grid-column: 1 / -1;
		padding: 50px 0;
		text-align: center;
		color: #85909e;
	}
	.empty h2 {
		font-size: 18px;
		color: #344157;
	}
	.empty button {
		border: 1px solid #c8dcd7;
		border-radius: 20px;
		padding: 9px 18px;
		background: #eef7f5;
		color: #246d65;
	}
	.load-status {
		min-height: 20px;
		margin-top: 28px;
		text-align: center;
		font-size: 13px;
		color: #65918d;
	}
	footer {
		margin-top: 35px;
		font-size: 11px;
		color: #929baa;
		text-align: center;
	}
	a {
		color: inherit;
	}
	@media (max-width: 1000px) {
		.browser {
			padding: 40px 48px 24px 28px;
		}
		.palette-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 600px) {
		dialog {
			width: calc(100vw - 16px);
			max-height: calc(100dvh - 16px);
			border-radius: 16px;
		}
		.browser {
			padding: 40px 48px 24px 18px;
		}
		header {
			margin-bottom: 24px;
		}
		.filter-label {
			width: 100%;
		}
		.filter-row {
			gap: 6px;
		}
		.filter-row button {
			padding: 7px 10px;
		}
		.palette-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}
		.swatches {
			height: 145px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.swatches button,
		.swatches span {
			transition: none;
		}
	}
</style>
