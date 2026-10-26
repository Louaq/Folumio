<script lang="ts">
	import colors from "./traditional-colors.json";
	import { ink } from "./color";
	export let onselect: (color: string) => void;
	let dialog: HTMLDialogElement;

	const families = [
		{ id: "red", name: "赤色系" },
		{ id: "yellow", name: "黄色系" },
		{ id: "green", name: "青色系" },
		{ id: "blue", name: "蓝色系" },
		{ id: "purple", name: "紫色系" },
		{ id: "white", name: "白色系" },
		{ id: "black", name: "玄色系" },
		{ id: "brown", name: "褐色系" },
	];
	const terms = [...new Set(colors.map((color) => color.solarTerm))];
	let mode = "family";
	let family = "red";
	let term = terms[0];
	$: filtered = colors.filter((color) =>
		mode === "family" ? color.category === family : color.solarTerm === term,
	);
	$: heading =
		mode === "family" ? families.find((item) => item.id === family)!.name : term;
	$: groups = Array.from({ length: Math.ceil(filtered.length / 6) }, (_, index) =>
		filtered.slice(index * 6, index * 6 + 6),
	);

	function select(hex: string) {
		onselect(hex);
		dialog.close();
	}
</script>

<button
	class="browse-button"
	aria-haspopup="dialog"
	on:click={() => dialog.showModal()}
>中国传统色</button>
<dialog
	bind:this={dialog}
	aria-labelledby="traditional-colors-title"
	on:cancel={(event) => event.preventDefault()}
>
	<div class="close-bar">
		<button
			class="close"
			aria-label="关闭中国传统色"
			on:click={() => dialog.close()}
		>×</button>
	</div>
	<div class="gallery">
		<main>
			<div class="modes" role="group" aria-label="浏览方式">
				<button
					class:active={mode === "family"}
					aria-pressed={mode === "family"}
					on:click={() => (mode = "family")}
				>按色系</button>
				<button
					class:active={mode === "term"}
					aria-pressed={mode === "term"}
					on:click={() => (mode = "term")}
				>按节气</button>
			</div>
			<div
				class="filters"
				role="group"
				aria-label={mode === "family" ? "色系" : "节气"}
			>
				{#if mode === "family"}
					{#each families as item}
						<button
							class:active={family === item.id}
							aria-pressed={family === item.id}
							on:click={() => (family = item.id)}
						>{item.name}</button>
					{/each}
				{:else}
					{#each terms as item}
						<button
							class:active={term === item}
							aria-pressed={term === item}
							on:click={() => (term = item)}
						>{item}</button>
					{/each}
				{/if}
			</div>
			<div class="section-heading">
				<h2>{heading}</h2>
				<p>{filtered.length} 种颜色 · 点击色卡设为基色</p>
			</div>
			<div class="color-grid">
				{#each groups as group, index}
					<article>
						<div
							class="swatches"
							role="group"
							aria-label={`${heading} ${index + 1}`}
						>
							{#each group as color (color.id)}
								<button
									style:background={color.hex}
									style:color={ink(color.hex)}
									title={`${color.name} · ${color.pinyin} · ${color.hex}`}
									aria-label={`将${color.name} ${color.hex} 设为基色`}
									on:click={() => select(color.hex)}
								>
									<span class="card-info">
										<span class="color-name">{color.name}</span>
										<span class="hex">{color.hex}</span>
									</span>
								</button>
							{/each}
						</div>
						<div class="caption">
							<h3>{heading} {index + 1}</h3>
							<span>{group.length} 色</span>
						</div>
					</article>
				{/each}
			</div>
		</main>
	</div>
</dialog>

<style>
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
		box-sizing: border-box;
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
	.gallery {
		padding: 28px 48px;
	}
	header {
		position: relative;
		max-width: 1280px;
		margin: 0 auto 32px;
		padding-top: 24px;
		text-align: center;
	}
	a {
		color: inherit;
		text-underline-offset: 4px;
	}
	.eyebrow {
		margin: 24px 0 12px;
		font-size: 11px;
		letter-spacing: 0.2em;
		color: #65918d;
	}
	h1 {
		margin: 10px 0;
		font-size: clamp(26px, 3vw, 40px);
		letter-spacing: -0.04em;
	}
	.intro {
		margin: 14px 0 0;
		font-size: 15px;
		line-height: 1.7;
		color: #85909e;
	}
	main {
		max-width: 1280px;
		margin: auto;
	}
	button {
		cursor: pointer;
		font: inherit;
	}
	.modes,
	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}
	.modes {
		margin: 30px 0;
	}
	.modes button,
	.filters button {
		padding: 10px 24px;
		border: 1px solid #dfe3e9;
		border-radius: 24px;
		background: #fff;
		color: #344157;
		font-size: 13px;
	}
	.filters {
		max-width: 960px;
		margin: auto;
		gap: 8px;
	}
	.modes button:hover,
	.modes button.active,
	.filters button:hover,
	.filters button.active {
		border-color: #599b95;
		background: #eef7f5;
		color: #246d65;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid #599b95;
		outline-offset: 4px;
	}
	.section-heading {
		margin: 44px 0 36px;
		text-align: center;
	}
	h2 {
		margin: 0 0 14px;
		font-size: 24px;
		font-weight: 500;
	}
	.section-heading p {
		color: #8993a1;
		font-size: 12px;
	}
	.color-grid {
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
	.card-info {
		display: grid;
		gap: 7px;
		text-align: center;
		opacity: 0;
		transition: opacity 0.15s;
	}
	.swatches button:hover .card-info,
	.swatches button:focus-visible .card-info {
		opacity: 1;
	}
	.color-name {
		font-size: 13px;
		font-weight: 500;
	}
	.hex {
		font-size: 10px;
	}
	.caption {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding-top: 10px;
	}
	.caption h3 {
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
	footer {
		margin: 48px 0 12px;
		color: #929baa;
		text-align: center;
		font-size: 11px;
		line-height: 1.8;
	}
	@media (max-width: 1000px) {
		.color-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		dialog {
			width: calc(100vw - 16px);
			max-height: calc(100dvh - 16px);
			border-radius: 16px;
		}
		.gallery {
			padding: 20px 16px;
		}
		header {
			padding-top: 32px;
		}
		.color-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}
		.filters {
			gap: 4px;
		}
		.filters button {
			padding: 9px 16px;
		}
		.section-heading {
			margin: 32px 0 24px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.swatches button,
		.card-info {
			transition: none;
		}
	}
</style>
