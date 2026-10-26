<script lang="ts">
	import { ink } from "./color";
	import { colorFamilies, inspirationPalettes } from "./inspiration";
	export let onselect: (color: string) => void;
	let dialog: HTMLDialogElement;
	let family = "";
	let count = 0;
	let search = "";
	let sort = "推荐";
	$: query = search.trim().toLowerCase();
	$: filtered = inspirationPalettes
		.filter(
			(palette) =>
				(!family || palette.families.includes(family)) &&
				(!count || palette.colors.length === count) &&
				(!query ||
					`${palette.name} ${palette.english} ${palette.colors.join(" ")}`
						.toLowerCase()
						.includes(query)),
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
		search = "";
	}
	function select(color: string) {
		onselect(color);
		dialog.close();
	}
</script>

<button
	class="browse-button"
	on:click={() => dialog.showModal()}
	aria-haspopup="dialog"
>配色灵感</button>
<dialog
	bind:this={dialog}
	aria-labelledby="palette-title"
	on:click={event => { if (event.target === dialog) dialog.close(); }}
>
	<div class="browser">
		<button class="close" aria-label="关闭配色灵感" on:click={() => dialog.close()}>×</button>
		<header>
			<p class="eyebrow">PALETTE INSPIRATION</p>
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
				{#each [2, 3, 4, 5, 6, 7, 8, 9, 10] as size}
					<button
						class:active={count === size}
						aria-pressed={count === size}
						on:click={() => count = count === size ? 0 : size}
					>{size} 色</button>
				{/each}
			</div>
		</div>
		<div class="search-row">
			<input
				type="search"
				aria-label="搜索色板"
				placeholder="搜索名称、风格或 HEX 色值…"
				bind:value={search}
			 />
			<label>排序 <select bind:value={sort}><option>推荐</option><option>名称</option><option>颜色数量</option></select></label>
		</div>
		<p class="result-count" role="status">{filtered.length} 组配色{#if family || count || search}<button on:click={reset}>清除筛选</button>{/if}</p>
		<div class="palette-grid">
			{#each filtered as palette}
				<article>
					<div class="swatches" aria-label={palette.name}>
						{#each palette.colors as color}
							<button
								style:background={color}
								style:color={ink(color)}
								aria-label={`将 ${color} 设为基色`}
								title={`使用 ${color}`}
								on:click={() => select(color)}
							><span>{color.toUpperCase()}</span></button>
						{/each}
					</div>
					<div class="caption"><div><h2>{palette.name}</h2><p>{palette.english}</p></div><span>{palette.colors.length} 色</span></div>
				</article>
			{:else}
				<div class="empty"><h2>没有找到匹配的配色</h2><p>试试其他关键词，或减少筛选条件。</p><button on:click={reset}>查看全部配色</button></div>
			{/each}
		</div>
		<footer>部分色板参考 <a href="https://colorkit.co/palettes/" target="_blank" rel="noreferrer">ColorKit</a> · 点击色块设为基色</footer>
	</div>
</dialog>

<style>
	button,
	input,
	select {
		font: inherit;
	}
	button,
	select {
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
		border: 1px solid #e2e6e9;
		border-radius: 22px;
		color: #233047;
		background: #fff;
		box-shadow: 0 24px 100px #14283b40;
	}
	dialog::backdrop {
		background: #15233266;
		backdrop-filter: blur(7px);
	}
	.browser {
		position: relative;
		padding: 45px 48px 24px;
	}
	.close {
		position: absolute;
		right: 18px;
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
	.search-row {
		display: flex;
		gap: 18px;
		align-items: center;
		justify-content: space-between;
		margin-top: 24px;
	}
	.search-row input {
		width: min(680px, 100%);
		min-width: 0;
		height: 46px;
		border: 1px solid #dce0e6;
		border-radius: 8px;
		padding: 0 15px;
		color: #233047;
		background: #fff;
	}
	.search-row input::placeholder {
		color: #939daa;
	}
	.search-row label {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
		color: #788495;
		font-size: 13px;
	}
	select {
		border: 0;
		border-radius: 7px;
		background: #f4f6f8;
		color: #344157;
		padding: 12px;
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
		font: 10px monospace;
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
		font-size: 13px;
		font-weight: 500;
	}
	.caption p {
		margin: 4px 0 0;
		font-size: 11px;
		color: #929baa;
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
			padding: 40px 28px 24px;
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
			padding: 40px 18px 24px;
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
		.search-row {
			flex-wrap: wrap;
			gap: 12px;
		}
		.search-row input {
			width: 100%;
		}
		.palette-grid {
			grid-template-columns: 1fr;
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
