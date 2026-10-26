<script lang="ts">
	export let id: string;
	export let label: string;
	export let options: string[];
	export let value: string;
	export let hover = false;
	let menu: HTMLDivElement;
	let trigger: HTMLButtonElement;
	let open = false;
	let left = 0, top = 0;

	function position() {
		const rect = trigger.getBoundingClientRect();
		left = Math.min(rect.left, window.innerWidth - 168);
		top = rect.bottom + 5;
	}
	function select(option: string) {
		value = option;
		menu.hidePopover();
		trigger.focus();
	}
	function navigate(event: KeyboardEvent) {
		const buttons = [...menu.querySelectorAll<HTMLButtonElement>("button")];
		const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
		if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
		event.preventDefault();
		const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
		buttons[next].focus();
	}
</script>

<button class="dropdown-trigger" bind:this={trigger} popovertarget={id} aria-label={label} aria-haspopup="menu" aria-expanded={open} on:pointerenter={event => {
	if (hover && event.pointerType === "mouse") { position(); menu.showPopover(); }
}} on:pointerleave={event => {
	if (hover && event.pointerType === "mouse" && !menu.contains(event.relatedTarget as Node)) menu.hidePopover();
}} on:click={event => {
	position();
	if (hover) { event.preventDefault(); menu.showPopover(); }
}} on:keydown={event => {
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault(); position(); menu.showPopover();
		menu.querySelector<HTMLButtonElement>("button")!.focus();
	}
}}><slot>{value}<svg viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg></slot></button>

<div class="dropdown-menu" {id} popover="auto" role="menu" tabindex="-1" aria-label={label} bind:this={menu} style:left={`${left}px`} style:top={`${top}px`} on:toggle={() => open = menu.matches(":popover-open")} on:keydown={navigate} on:pointerleave={event => {
	if (hover && event.pointerType === "mouse" && !trigger.contains(event.relatedTarget as Node)) menu.hidePopover();
}}>
	{#each options as option}<button type="button" role="menuitemradio" aria-checked={value === option} on:click={() => select(option)}>{option}</button>{/each}
</div>

<style>
	.dropdown-trigger { height:25px; min-width:59px; display:flex; align-items:center; justify-content:space-between; gap:7px; padding:1px 7px; border:1px solid #91919a; border-radius:7px; background:#f8f5f84d; box-shadow:inset 0 0 0 1px #ffffffa6; color:inherit; font:inherit; font-size:12px; cursor:pointer; }
	.dropdown-trigger[aria-expanded="true"] { background:#faf6fa70; box-shadow:inset 0 0 0 1px #fff9,0 0 0 1px #8e83935c; }
	svg { width:9px; height:6px; fill:none; stroke:currentColor; stroke-width:1.1; }
	.dropdown-menu { position:fixed; inset:auto; width:160px; margin:0; padding:0; overflow:hidden; border:1px solid #ffffffc7; border-radius:12px; background:#f5edf4b8; backdrop-filter:blur(22px) saturate(115%); -webkit-backdrop-filter:blur(22px) saturate(115%); box-shadow:0 0 0 1px #aaa1ac,0 6px 18px #30233326; color:#111; }
	.dropdown-menu button { display:block; width:100%; min-height:36px; padding:9px 10px; border:0; background:transparent; color:inherit; font:inherit; font-size:14px; line-height:18px; text-align:left; cursor:pointer; }
	.dropdown-menu button + button { border-top:1px solid #bbaab524; }
	.dropdown-menu button:hover,.dropdown-menu button:focus-visible { background:#ffffff40; outline:none; }
	.dropdown-trigger:focus-visible { outline:2px solid #4e879a; outline-offset:1px; }
</style>
