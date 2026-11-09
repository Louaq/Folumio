# astro-koharu music player

Source: https://github.com/cosZone/astro-koharu

Pinned revision: `329ce55513a8057708c93c11c5b8c096680ad83c`

The imported code is licensed under AGPL-3.0; see [LICENSE](LICENSE). Original comments and source structure are retained. This directory is not covered by the host repository's MIT license.

The player directly uses upstream `GlobalBGMPlayer`, `PlayerPreview`, `PlayerPlaylist`, `MediaControls`, playback hooks, lyric parser, and the three upstream player stylesheets. `lib/utils.ts` and `hooks/useTranslation.ts` contain the required utility and Chinese translation excerpts.

Host adaptations (2026-11-07):

- Import aliases point into this vendor directory.
- The panel uses the existing floating toolbar, an isolated panel state, and the system reduced-motion preference.
- `src/utils/koharu-music-source.ts` maps `/music.json` to the upstream track format and resolves the `/ncm` audio API lazily after PoW session authentication; a 401 renews the session once.
- `useMediaPlayer` supports asynchronous audio URLs, ignores superseded track requests, skips missing tracks, and renews expired media URLs while preserving playback position.
- The local API has no lyric endpoint, so local tracks use an empty lyric field.
- The upstream Remix icons are bundled locally; no Iconify service request is needed.
- `src/styles/koharu-music.css` isolates upstream light/dark HSL theme tokens and positions the panel in this site's toolbar.

The existing local library supplies one playlist. Multiple upstream playlist tabs appear only when multiple groups are supplied; sample songs and groups from the upstream demo are not copied.
