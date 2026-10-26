<script lang="ts">
	import { onMount, tick } from "svelte";
	import { hexToHsl, contrast, ink, createColorFormatter } from "./color";
	import { studioSteps, hexToOklch, type StudioRow } from "./studio";
	import StudioIcon from "./StudioIcon.svelte";
	import StudioDropdown from "./StudioDropdown.svelte";
	import PaletteBrowser from "./PaletteBrowser.svelte";
	let base = "#eea8d9";
	let input = "eea8d9";
	let editingInput = false;
	let space = "HSL";
	let format = "Auto";
	let step = 1;
	let recentColors = [base];
	let channels = [true, true, true, true];
	let settings = false;
	let cssNotation = false;
	let delimiter = "Comma";
	let percent = false;
	let prefix = true;
	let alpha = 1;
	let uppercase = false;
	let settingsLeft = 0;
	let settingsTop = 0;
	let alphaPercent = false;
	let decimalZero = false;
	let hueUnit = "Degrees";
	let message = "";
	let copiedRows = new Set<string>();
	let mounted = false;
	let centered = false;
	let stages: HTMLDivElement[] = [];
	let timer: ReturnType<typeof setTimeout>;
	let tooltip: {
		color: string;
		hue: string;
		delta: number;
		ratio: number;
		steps: number;
		x: number;
		y: number;
		key: string;
	} | null = null;
	$: inputHex = input.trim().replace(/^#/, "");
	$: inputColor = editingInput && /^(?:[\da-f]{3}|[\da-f]{6})$/i.test(inputHex)
		? `#${inputHex.length === 3 ? [...inputHex].map(c => c + c).join("") : inputHex}`
		: "";
	$: columns = studioSteps(base, step, space);
	$: value = createColorFormatter({
		format,
		delimiter,
		percent,
		alphaPercent,
		decimalZero,
		cssNotation,
		prefix,
		uppercase,
		alpha,
		hueUnit,
	});
	$: visibleColumns = columns
		.map((rows, index) => ({ rows, index }))
		.filter(({ index }) => channels[index]);
	$: if (format === "Auto") settings = false;
	$: if (mounted) {
		base;
		step;
		space;
		channels;
		tick().then(center);
	}
	onMount(() => {
		mounted = true;
		const query = new URLSearchParams(window.location.search).get("color");
		if (query && /^[\da-f]{6}$/i.test(query)) choose(`#${query}`);
		window.addEventListener("resize", center);
		return () => {
			window.removeEventListener("resize", center);
			clearTimeout(timer);
		};
	});
	function center() {
		visibleColumns.forEach(({ rows, index }) => {
			const before = rows.findIndex((row) => row.base);
			if (stages[index])
				stages[index].scrollTop = Math.max(
					0,
					before * 40 - (window.innerHeight / 2 - 64),
				);
		});
		centered = true;
	}
	function restoreColor(color: string) {
		editingInput = false;
		tooltip = null;
		base = color;
		input = color.slice(1);
	}
	function replayEntry(event: PageTransitionEvent) {
		if (event.persisted) {
			visibleColumns.forEach(({ index }) => {
				if (index === 1)
					stages[index].getAnimations({ subtree: true }).forEach((animation) => {
						animation.currentTime = 0;
						animation.play();
					});
			});
		}
	}
	function choose(color: string) {
		restoreColor(color);
		recentColors = [...recentColors, color].slice(-8);
	}
	function showTooltip(
		event: MouseEvent | FocusEvent,
		row: StudioRow,
		column: number,
		position: number,
		basePosition: number,
	) {
		const hue =
			space === "OKLCh" ? hexToOklch(row.color)[2] : hexToHsl(row.color)[0];
		const baseHue = space === "OKLCh" ? hexToOklch(base)[2] : hexToHsl(base)[0];
		const target = event.currentTarget as HTMLButtonElement;
		const rect = target.getBoundingClientRect();
		const x = event instanceof MouseEvent ? event.clientX : rect.right - 30;
		const y = event instanceof MouseEvent ? event.clientY : rect.bottom;
		const luminance = contrast(row.color);
		const baseLuminance = contrast(base);
		tooltip = {
			color: row.color,
			hue: hue.toFixed(1),
			delta: Number((((hue - baseHue + 540) % 360) - 180).toFixed(1)),
			ratio: Number(
				(
					Math.max(luminance, baseLuminance) /
					Math.min(luminance, baseLuminance)
				).toFixed(2),
			),
			steps: Math.abs(position - basePosition),
			key: `${column}-${position}`,
			x: Math.max(8, Math.min(x + 14, window.innerWidth - 204)),
			y: Math.max(8, Math.min(y + 18, window.innerHeight - 106)),
		};
	}
	function apply() {
		editingInput = false;
		const v = input.trim().replace(/^#/, "");
		if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(v)) {
			notify("请输入 3 位或 6 位 HEX 色值");
			return;
		}
		choose(
			`#${v.length === 3 ? [...v].map((c) => c + c).join("") : v.toLowerCase()}`,
		);
	}
	function notify(text: string) {
		message = text;
		clearTimeout(timer);
		timer = setTimeout(() => (message = ""), 2400);
	}
	function toggleSettings(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		const rect = button.getBoundingClientRect();
		const toolbar = button.closest(".toolbar")!.getBoundingClientRect();
		const width = format === "HEX" ? 172 : 220;
		settingsLeft =
			Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)) -
			toolbar.left;
		settingsTop = rect.bottom - toolbar.top + 5;
		settings = !settings;
	}
	function closePanelsOutside(event: MouseEvent) {
		if (
			settings &&
			!(event.target as Element).closest(
				".settings, .settings-button, .dropdown-menu",
			)
		)
			settings = false;
	}
	async function copy(text: string, rowKey: string) {
		try {
			await navigator.clipboard.writeText(text);
			notify(`已复制 ${text}`);
			copiedRows = new Set(copiedRows).add(rowKey);
		} catch {
			notify("无法访问剪贴板，请选中色值手动复制");
		}
	}
	function toggle(index: number) {
		if (channels[index] && channels.filter(Boolean).length === 1) return;
		channels = channels.map((v, i) => (i === index ? !v : v));
	}
</script>

<svelte:window
	on:click={closePanelsOutside}
	on:pageshow={replayEntry}
/>

<div class="studio">
	<header class="toolbar" aria-label="配色工具栏">
		<a class="home-link joined" href="/" data-no-swup title="返回首页">返回首页</a>
		<PaletteBrowser onselect={choose} />
		<form
			class="color-entry"
			style:--history-count={recentColors.length}
			on:submit|preventDefault={apply}
		>
			<span class="base-marker"
				>{#each recentColors as color}<button
						type="button"
						style:background={color}
						aria-label={`切换到 ${color}`}
						on:click={() => restoreColor(color)}
					></button>{/each}</span
			>
			<button
				class="random"
				type="button"
				aria-label="随机颜色"
				title="随机颜色"
				on:click={() =>
					choose(
						`#${Math.floor(Math.random() * 16777216)
							.toString(16)
							.padStart(6, "0")}`,
					)}><StudioIcon name="shuffle" /></button
			>
			<input
				class="hex-input"
				style:background={inputColor}
				style:color={inputColor ? ink(inputColor) : ""}
				aria-label="基色 HEX"
				bind:value={input}
				on:input={() => (editingInput = true)}
				on:blur={() => (editingInput = false)}
				on:change={apply}
				maxlength="7"
				spellcheck="false"
			/>
			<span
				class="picker-icon"
				style:background={inputColor}
				style:color={inputColor ? ink(inputColor) : ""}
				aria-hidden="true"
				><StudioIcon name="target" /></span
			>
		</form>
		<div class="tool-group">
			<StudioDropdown
				id="studio-space-menu"
				label="色彩空间"
				options={["HSL", "OKLCh"]}
				bind:value={space}
			/>
		</div>
		<div class="tool-group channel-group">
			<span class="tool-symbol"><StudioIcon name="sliders" /></span>
			<div class="joined channels">
				{#each ["H", "S", "L", "A"] as channel, i}<button
						class:enabled={channels[i]}
						aria-label={`显示${["色相", "色度", "明度", "透明度"][i]}列`}
						aria-pressed={channels[i]}
						on:click={() => toggle(i)}>{channel}</button
					>{/each}
			</div>
		</div>
		<div class="tool-group step-group">
			<span class="tool-symbol"><StudioIcon name="steps" /></span>
			<div class="joined step-control">
				<button
					aria-label="减小色阶间隔"
					disabled={step <= 0.25}
					on:click={() => (step /= 2)}><StudioIcon name="division" /></button
				><output aria-label="色阶间隔">{step}</output><button
					aria-label="增大色阶间隔"
					disabled={step >= 8}
					on:click={() => (step *= 2)}><StudioIcon name="multiply" /></button
				>
			</div>
		</div>
		<div class="tool-group format-group">
			<span class="tool-symbol"><StudioIcon name="format" /></span
			><StudioDropdown
				id="studio-format-menu"
				label="色值格式"
				options={["Auto", "HEX", "RGB", "HSL"]}
				bind:value={format}
			/><button
				class="settings-button"
				class:open={settings}
				disabled={format === "Auto"}
				title="色值格式设置"
				aria-label="色值格式设置"
				aria-expanded={settings}
				on:click={toggleSettings}
				><StudioIcon name="gear" /><StudioIcon name="caret" /></button
			>
		</div>
		{#if settings}<div
				class="settings compact-settings"
				class:numeric-settings={format === "RGB" || format === "HSL"}
				style:--settings-left={`${settingsLeft}px`}
				style:--settings-top={`${settingsTop}px`}
				role="region"
				aria-label="格式设置"
			>
				{#if format === "HEX"}
					<label
						>Prefix “#” <input type="checkbox" bind:checked={prefix} /></label
					>
					<div>
						<span>Letter case</span>
						<div class="joined" aria-label="HEX 大小写">
							<button
								aria-label="小写"
								aria-pressed={!uppercase}
								class:enabled={!uppercase}
								on:click={() => (uppercase = false)}>a</button
							><button
								aria-label="大写"
								aria-pressed={uppercase}
								class:enabled={uppercase}
								on:click={() => (uppercase = true)}>A</button
							>
						</div>
					</div>
				{:else}
					<label
						>CSS notation <input
							type="checkbox"
							bind:checked={cssNotation}
						/></label
					>
					<div>
						<span>Delimiter</span>
						<div class="joined" aria-label="分隔符">
							{#each ["Comma", "Space"] as separator}<button
									aria-pressed={delimiter === separator}
									class:enabled={delimiter === separator}
									on:click={() => (delimiter = separator)}>{separator}</button
								>{/each}
						</div>
					</div>
					{#if format === "HSL"}
						<div>
							<span>Hue unit</span><StudioDropdown
								id="studio-hue-unit-menu"
								label="色相单位"
								options={["Degrees", "Radians", "Gradians", "Turns"]}
								bind:value={hueUnit}
							/>
						</div>
					{:else}
						<div>
							<span>Component format</span>
							<div class="joined" aria-label="RGB 分量格式">
								<button
									aria-label="数值"
									aria-pressed={!percent}
									class:enabled={!percent}
									on:click={() => (percent = false)}>#</button
								><button
									aria-label="百分比"
									aria-pressed={percent}
									class:enabled={percent}
									on:click={() => (percent = true)}>%</button
								>
							</div>
						</div>
					{/if}
					<div>
						<span>Alpha format</span>
						<div class="joined" aria-label="透明度格式">
							<button
								aria-label="透明度数值"
								aria-pressed={!alphaPercent}
								class:enabled={!alphaPercent}
								on:click={() => (alphaPercent = false)}>#</button
							><button
								aria-label="透明度百分比"
								aria-pressed={alphaPercent}
								class:enabled={alphaPercent}
								on:click={() => (alphaPercent = true)}>%</button
							>
						</div>
					</div>
					<label
						>Prefix decimals with “0” <input
							type="checkbox"
							bind:checked={decimalZero}
						/></label
					>
				{/if}
			</div>{/if}
	</header>
	<main
		class="columns"
		class:three={visibleColumns.length === 3}
		style:--column-count={visibleColumns.length}
	>
		{#each visibleColumns as { rows, index } (index)}
			<section
				class="column"
				aria-label={[
					"Hue",
					space === "OKLCh" ? "Chroma" : "Saturation",
					"Lightness",
					"Alpha",
				][index]}
			>
				<h1>
					{[
						"Hue",
						space === "OKLCh" ? "Chroma" : "Saturation",
						"Lightness",
						"Alpha",
					][index]}
				</h1>
				<div
					class="stage"
					bind:this={stages[index]}
					on:scroll={() => (tooltip = null)}
					role="region"
					aria-label={`${["Hue", "Chroma", "Lightness", "Alpha"][index]} 独立滚动区域`}
				>
					<div
						class="color-strip"
						class:centered
						class:entering={index === 1 && centered}
						style:--before={rows.findIndex((row) => row.base)}
					>
						{#each rows as row, position}<div
								class="color-row"
								class:base-row={row.base}
								class:transparent={index === 3}
								style:--row-color={row.color}
								style:--row-alpha={index === 3 ? row.alpha : alpha}
								style:color={row.ink}
							>
								<button
									class="color-value"
									aria-label={`复制 ${value(row.color, index === 3 ? row.alpha : alpha)}`}
									aria-describedby={tooltip?.key === `${index}-${position}`
										? "color-tooltip"
										: undefined}
									on:mouseenter={(event) =>
										showTooltip(
											event,
											row,
											index,
											position,
											rows.findIndex((r) => r.base),
										)}
									on:mousemove={(event) =>
										showTooltip(
											event,
											row,
											index,
											position,
											rows.findIndex((r) => r.base),
										)}
									on:mouseleave={() => (tooltip = null)}
									on:focus={(event) =>
										showTooltip(
											event,
											row,
											index,
											position,
											rows.findIndex((r) => r.base),
										)}
									on:blur={() => (tooltip = null)}
									on:click={() =>
										copy(
											value(row.color, index === 3 ? row.alpha : alpha),
											`${index}-${position}-${row.color}`,
										)}
									on:dblclick={() => choose(row.color)}
									><span
										class="hover-copy"
										class:copied={copiedRows.has(
											`${index}-${position}-${row.color}`,
										)}
										><StudioIcon
											name={copiedRows.has(`${index}-${position}-${row.color}`)
												? "check"
												: "copy"}
										/></span
									><span
										>{value(row.color, index === 3 ? row.alpha : alpha)}</span
									></button
								>
								<button
									class="set-base"
									aria-label={`将 ${row.color} 设为基色`}
									title="设为基色"
									on:click={() => choose(row.color)}
									><StudioIcon name="target" /></button
								>
								{#if row.clipped && !row.base}<span
										class="download-color"
										role="img"
										aria-label="此色阶经过 sRGB 色域映射"
										title="此色阶经过 sRGB 色域映射"
										><StudioIcon name="download" /></span
									>{/if}
							</div>{/each}
					</div>
				</div>
			</section>
		{/each}
	</main>
	{#if tooltip}<div
			id="color-tooltip"
			class="color-tooltip"
			role="tooltip"
			style:left={`${tooltip.x}px`}
			style:top={`${tooltip.y}px`}
		>
			<span class="tooltip-swatch" aria-hidden="true">
				<span style:background={tooltip.color}></span>
				<span style:background={base}></span>
			</span>
			<div>
				<div>
					Hue: {tooltip.hue}° ({tooltip.delta >= 0 ? "+" : ""}{tooltip.delta}°)
				</div>
				<div>Contrast: {tooltip.ratio}:1</div>
				<div>Steps: {tooltip.steps}</div>
			</div>
		</div>{/if}
	<div class="toast" class:visible={!!message} role="status">{message}</div>
</div>

<style>
	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
		overflow: hidden;
		margin: 0;
		background: #f3f4f5;
	}
	.studio {
		color: #111;
		width: 100%;
		height: 100dvh;
		font-size: 14px;
		background: #f3f4f5;
	}
	button,
	input,
	output {
		font: inherit;
		color: inherit;
	}
	button {
		cursor: pointer;
	}
	button:disabled {
		cursor: default;
		opacity: 0.4;
	}
	button:focus-visible {
		outline: 2px solid #4e879a;
		outline-offset: 1px;
	}
	.toolbar {
		position: fixed;
		z-index: 5;
		top: 0;
		left: 0;
		right: 0;
		height: 50px;
		display: flex;
		align-items: flex-start;
		padding: 6px 17px;
		gap: 23px;
		border-bottom: 1px solid #d9dddebd;
		background: #f3f4f580;
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
	}
	.color-entry {
		display: flex;
		align-items: center;
		width: calc(135px + var(--history-count) * 8px);
		height: 34px;
		flex-shrink: 0;
		border: 1px solid #929c9c;
		border-radius: 7px;
		box-shadow: inset 0 0 0 1px #fff9;
		background: #f9faf65c;
	}
	.home-link.joined {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		height: 34px;
		padding: 0 10px;
		color: inherit;
		font-size: 13px;
		text-decoration: none;
	}
	.home-link:hover {
		background: #ffffffa6;
	}
	.base-marker {
		align-self: stretch;
		display: flex;
		flex-shrink: 0;
	}
	.base-marker button {
		position: relative;
		width: 8px;
		padding: 0;
		border: 0;
		transition:
			transform 0.15s,
			box-shadow 0.15s;
	}
	.base-marker button:first-child {
		border-radius: 6px 0 0 6px;
	}
	.base-marker button:hover,
	.base-marker button:focus-visible {
		z-index: 1;
		transform: scale(1.2, 1.2);
		box-shadow: 0 2px 7px #0004;
	}
	.random {
		border: 0;
		padding: 0 8px;
		height: 30px;
		background: transparent;
		display: grid;
		place-items: center;
	}
	.random :global(svg) {
		width: 19px;
		height: 19px;
	}
	.hex-input {
		align-self: stretch;
		background: transparent;
		border: 0;
		width: 66px;
		padding: 0;
		font-size: 18px;
		line-height: 25px;
		font-weight: 300;
		outline: none;
	}
	.picker-icon {
		align-self: stretch;
		flex-grow: 1;
		display: grid;
		place-items: center;
		width: 30px;
		border-radius: 0 6px 6px 0;
		color: #9baaa4;
	}
	.picker-icon :global(svg) {
		width: 21px;
		height: 21px;
	}
	.tool-group {
		display: flex;
		align-items: center;
		gap: 7px;
		height: 33px;
		flex-shrink: 0;
	}
	.tool-symbol {
		display: grid;
		place-items: center;
		width: 14px;
		height: 24px;
		padding: 0;
		border: 0;
		background: transparent;
	}
	.tool-symbol :global(svg) {
		width: 14px;
		height: 16px;
	}
	.joined,
	.settings-button {
		height: 25px;
		border: 1px solid #919c9c;
		border-radius: 7px;
		background: #f7f9f95c;
		box-shadow: inset 0 0 0 1px #ffffff9c;
	}
	.channel-group .tool-symbol {
		width: 19px;
	}
	.tool-symbol :global(.sliders-19-icon) {
		width: 19px;
		height: 19px;
	}
	.format-group .tool-symbol {
		width: 19px;
	}
	.tool-symbol :global(.format-19-icon) {
		width: 19px;
		height: 19px;
	}
	.joined {
		display: flex;
		overflow: hidden;
	}
	.joined button {
		min-width: 24px;
		border: 0;
		background: transparent;
		font-size: 12px;
		padding: 1px 6px;
	}
	.joined button.enabled {
		background: #c8dfe17d;
	}
	.joined button:hover {
		background: #ffffff80;
	}
	.channels {
		border-color: #8c91a0;
		background: #c5cfe6a6;
		box-shadow:
			inset 0 1px 3px #0003,
			0 0 0 1px #ffffff80;
	}
	.channels button.enabled {
		background: transparent;
		color: #111;
		box-shadow: none;
	}
	.channels button:not(.enabled) {
		background: #f7f8fcbf;
		box-shadow:
			inset 0 0 0 1px #fff,
			inset 1px 0 0 #8c91a0;
	}
	.step-control button {
		display: grid;
		place-items: center;
	}
	.step-control button:first-child {
		border-right: 1px solid #a7b5b5;
	}
	.step-control button:last-child {
		border-left: 1px solid #a7b5b5;
	}
	.step-control output {
		display: grid;
		place-items: center;
		min-width: 34px;
		font-size: 12px;
	}
	.step-group {
		gap: 8px;
	}
	.format-group {
		gap: 7px;
	}
	.settings-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		width: 42px;
		color: #a9b3b2;
		padding: 0;
	}
	.settings-button :global(.gear-19-icon) {
		width: 19px;
		height: 19px;
		flex-shrink: 0;
	}
	.settings-button :global(.caret-down-21-icon) {
		width: 21px;
		height: 21px;
		flex-shrink: 0;
	}
	.settings-button.open {
		color: #344a4c;
		background: #eef5f4b3;
	}
	.settings {
		position: absolute;
		left: 480px;
		top: 34px;
		width: 230px;
		padding: 13px;
		border: 1px solid #aebbbbc9;
		border-radius: 10px;
		background: #edf4f1c9;
		backdrop-filter: blur(22px);
		box-shadow: 0 6px 22px #344b4b26;
		font-size: 10px;
	}
	.settings > label,
	.settings > div {
		min-height: 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.settings input[type="checkbox"] {
		appearance: none;
		width: 14px;
		height: 14px;
		border: 1px solid #8fa2a1;
		border-radius: 3px;
		background: #f5faf740;
	}
	.settings input:checked {
		background: #5e9b97;
		box-shadow: inset 0 0 0 3px #edf4f1;
	}
	.settings .joined {
		height: 20px;
	}
	.settings .joined button {
		font-size: 10px;
		min-width: 18px;
		padding: 0 6px;
	}
	.settings.compact-settings {
		position: absolute;
		left: var(--settings-left);
		right: auto;
		top: var(--settings-top);
		width: 172px;
		padding: 12px 15px;
		border: 1px solid #b4b4b8;
		border-radius: 12px;
		background: #f3f4f5de;
		backdrop-filter: blur(22px);
		-webkit-backdrop-filter: blur(22px);
		box-shadow:
			inset 0 0 0 1px #ffffffa6,
			0 5px 15px #0000001a;
		font-size: 13px;
	}
	.settings.compact-settings > label,
	.settings.compact-settings > div {
		min-height: 36px;
	}
	.settings.compact-settings input[type="checkbox"] {
		width: 18px;
		height: 18px;
		margin: 0;
		border: 1px solid #99999e;
		border-radius: 5px;
		background: #f7f7f733;
		box-shadow: inset 0 0 0 1px #fff9;
		cursor: pointer;
	}
	.settings.compact-settings input:checked {
		background: #647e7c;
		box-shadow: inset 0 0 0 4px #f3f4f5;
	}
	.settings.compact-settings .joined {
		height: 25px;
		border-color: #97979c;
		border-radius: 6px;
		background: #f7f7f740;
	}
	.settings.compact-settings .joined button {
		min-width: 24px;
		font-size: 13px;
		padding: 0 6px;
	}
	.settings.compact-settings .joined button + button {
		border-left: 1px solid #b2b2b5;
	}
	.settings.compact-settings .joined button.enabled {
		background: #e0e0e340;
		box-shadow: inset 0 1px 3px #00000012;
	}
	.settings.numeric-settings {
		width: 220px;
		background: #f4edf5c9;
	}
	.columns {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: grid;
		grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
		grid-template-rows: minmax(0, 1fr);
	}
	.columns.three {
		grid-template-columns: calc((100% - 380px) / 2 + 2px) 380px minmax(0, 1fr);
	}
	.column {
		min-width: 0;
		min-height: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		border-right: 1px solid #e0e2e3;
	}
	.column:last-child {
		border-right: 0;
	}
	h1 {
		position: absolute;
		top: 50px;
		left: 0;
		right: 0;
		z-index: 3;
		margin: 0;
		height: 34px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		padding: 0 16px;
		font-size: 14px;
		font-weight: 600;
		backdrop-filter: blur(18px);
		box-shadow: 0 7px 14px #00000018;
	}
	.column:first-child h1 {
		background: linear-gradient(90deg, #f3f4f5b8 27%, #bfe6ec99 70%, #c9ebed99);
	}
	.stage {
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
		padding-top: 84px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
		overscroll-behavior-y: contain;
		touch-action: pan-y;
	}
	.stage::-webkit-scrollbar {
		display: none;
	}
	.color-strip:not(.centered) {
		visibility: hidden;
	}
	.color-strip.entering {
		animation: strip-enter 360ms ease-out both;
	}
	@keyframes strip-enter {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.color-strip.entering {
			animation: none;
		}
	}
	.color-strip {
		width: 300px;
		padding-bottom: 45vh;
		margin-top: max(0px, calc(50dvh - 64px - var(--before) * 40px));
		margin-left: auto;
		margin-right: auto;
	}
	.three .column:first-child .color-strip {
		margin-left: auto;
		margin-right: 40px;
	}
	.three .column:last-child .color-strip {
		margin-left: 40px;
		margin-right: auto;
	}
	.color-row {
		height: 40px;
		position: relative;
		background: var(--row-color);
	}
	.color-row:first-child {
		border-radius: 10px 10px 0 0;
	}
	.color-row::before {
		content: "";
		position: absolute;
		inset: 0;
		background: var(--row-color);
		opacity: var(--row-alpha);
		pointer-events: none;
		border-radius: inherit;
	}
	.color-row.transparent {
		background: conic-gradient(#ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0) 0 0 /
			12px 12px;
	}
	.color-row:last-child {
		border-radius: 0 0 10px 10px;
	}
	.color-value {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		padding: 0 30px;
		border: 0;
		background: transparent;
		font-size: 14px;
		font-weight: 500;
		line-height: 40px;
		text-align: center;
		letter-spacing: 0.1px;
		user-select: text;
	}
	.hover-copy {
		display: none;
		width: 23px;
		height: 23px;
	}
	.hover-copy :global(svg) {
		width: 23px;
		height: 23px;
	}
	.set-base {
		display: none;
		position: absolute;
		left: 0;
		top: 0;
		width: 38px;
		height: 100%;
		border: 0;
		border-right: 1px solid #0002;
		background: transparent;
		color: inherit;
		align-items: center;
		justify-content: center;
	}
	.set-base :global(svg) {
		width: 18px;
		height: 18px;
	}
	.hover-copy.copied,
	.color-row:hover .hover-copy,
	.color-row:focus-within .hover-copy {
		display: flex;
	}
	.color-row:hover .set-base,
	.color-row:focus-within .set-base {
		display: flex;
	}
	.base-row {
		z-index: 2;
		width: calc(100% + 10px);
		margin-left: -5px;
		border-radius: 8px;
		box-shadow:
			0 7px 18px #00000038,
			0 2px 5px #0000001f;
	}
	.color-row:hover,
	.color-row:focus-within {
		z-index: 3;
		width: calc(100% + 10px);
		margin-left: -5px;
		border-radius: 8px;
		box-shadow:
			0 7px 18px #00000038,
			0 2px 5px #0000001f;
	}
	.color-tooltip {
		position: fixed;
		z-index: 30;
		display: flex;
		align-items: center;
		gap: 12px;
		width: 192px;
		min-height: 94px;
		padding: 10px;
		border-radius: 18px;
		background: #242424;
		color: #f2f2f2;
		font-size: 12px;
		line-height: 24px;
		box-shadow: 0 4px 12px #00000012;
		pointer-events: none;
	}
	.tooltip-swatch {
		display: flex;
		flex-direction: column;
		width: 36px;
		height: 72px;
		flex-shrink: 0;
		border-radius: 6px;
		overflow: hidden;
	}
	.tooltip-swatch span {
		display: grid;
		place-items: center;
		flex: 1;
	}
	.tooltip-swatch span::after {
		content: "";
		width: 16px;
		height: 16px;
		border: 1px solid #6580a1aa;
		border-radius: 50%;
	}
	.download-color {
		position: absolute;
		right: 11px;
		top: 12px;
		width: 16px;
		height: 16px;
		padding: 0;
		border: 0;
		color: inherit;
		background: transparent;
		opacity: 0.72;
	}
	.download-color :global(svg) {
		width: 14px;
		height: 14px;
	}
	.toast {
		position: fixed;
		z-index: 20;
		top: 16px;
		right: 16px;
		border: 1px solid #aebbbbc9;
		border-radius: 7px;
		background: #eef4f1de;
		backdrop-filter: blur(16px);
		box-shadow: 0 4px 18px #0002;
		padding: 9px 15px;
		font-size: 12px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s;
	}
	.toast.visible {
		opacity: 1;
	}
	@media (max-width: 1250px) {
		.columns.three {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.color-strip {
			width: min(300px, calc(100% - 50px));
		}
		.three .column:first-child .color-strip,
		.three .column:last-child .color-strip {
			margin-left: auto;
			margin-right: auto;
		}
	}
	@media (max-width: 800px) {
		.toolbar {
			gap: 12px;
			padding-left: 10px;
			padding-right: 10px;
			overflow-x: auto;
			overflow-y: visible;
		}
		.settings {
			position: fixed;
			left: auto;
			right: 8px;
			top: 40px;
		}
		.color-strip {
			width: 300px;
		}
		.columns,
		.columns.three {
			grid-template-columns: repeat(var(--column-count), 350px);
			overflow-x: auto;
			overflow-y: hidden;
		}
		.stage {
			touch-action: pan-x pan-y;
		}
		.download-color {
			display: none;
		}
	}
</style>
