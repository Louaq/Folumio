// Host integration: isolate astro-koharu panel state from its settings/router stores.
import { atom } from "nanostores";
export const $bgmPanelOpen = atom(false);
export const $bgmPlaying = atom(false);
export const closeBgmPanel = () => $bgmPanelOpen.set(false);
export const toggleBgmPanel = () => $bgmPanelOpen.set(!$bgmPanelOpen.get());
