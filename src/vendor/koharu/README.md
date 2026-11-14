# astro-koharu integrations

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

## Markdown link embedding

Source revision: `dc6e51b4ee04d6c26d4aae37b5c7940e30d2f572` (AGPL-3.0).

`lib/markdown/` contains the upstream standalone-link classifier, remark plugin, HTML templates, metascraper fetcher and disk cache. `components/embed/CodePenEmbed.astro` loads the official CodePen embed script on visibility.

Host adaptations:

- Local anchors and non-HTTP(S) links stay unchanged.
- Preview utility classes use this site's theme tokens and opt out of inline-link styling; links include `noopener noreferrer`.
- `src/components/misc/TweetEmbeds.tsx` adapts the upstream React portals, lazy visibility and theme tracking to this site's Swup lifecycle; `LinkEmbedRuntime.astro` imports it only on pages with tweets.
- The CodePen observer also disconnects on Swup navigation and skips pages without embeds.
- `src/styles/link-embed.css` integrates card and tweet styles with the host theme; preview and tweet images are excluded from the article lightbox.
- Link cards use a text/image grid on desktop and stack below 640px; failed cover images show an icon and label, initialized on first load and after navigation.
- OG metadata is stored in the ignored `.cache/og-data.json` (30-day success cache, one-day error cache).

Place an HTTP(S) URL in its own paragraph to embed it. Twitter/X status links become tweets, CodePen pen/details links become interactive demos, and other URLs become static OG preview cards. Standalone-link detection uses upstream URL-text matching. Links within prose, code blocks and table cells retain their Markdown rendering. The existing `::github` directive is unchanged.
