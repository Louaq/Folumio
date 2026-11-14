let request: AbortController | undefined;
let timer: number | undefined;

export async function updateHomeBannerDescription(
	description: string,
	isHome: boolean,
): Promise<void> {
	request?.abort();
	window.clearTimeout(timer);
	const element = document.querySelector<HTMLElement>(".banner-stage__copy p")!;
	element.classList.toggle("is-typing", isHome);
	element.textContent = isHome ? "" : description;
	if (!isHome) return;

	const controller = new AbortController();
	request = controller;
	async function nextSentence() {
		try {
			const response = await fetch("https://v1.hitokoto.cn/?c=d&encode=text", {
				signal: controller.signal,
			});
			if (!response.ok) throw new Error(`Hitokoto request failed: ${response.status}`);
			const characters = Array.from(await response.text());
			if (controller.signal.aborted) return;

			function type(index: number) {
				element.textContent = characters.slice(0, index).join("");
				timer = window.setTimeout(
					() => index < characters.length ? type(index + 1) : erase(index),
					index < characters.length ? 100 : 2500,
				);
			}
			function erase(index: number) {
				element.textContent = characters.slice(0, index).join("");
				timer = window.setTimeout(
					() => index > 0 ? erase(index - 1) : void nextSentence(),
					index > 0 ? 50 : 500,
				);
			}
			type(1);
		} catch (error) {
			if (!controller.signal.aborted) console.error(error);
		}
	}
	await nextSentence();
}
