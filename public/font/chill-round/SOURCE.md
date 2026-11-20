Fonts: ChillRoundF Regular and Bold

Original: https://github.com/Warren2060/ChillRound

Web font subsets: https://github.com/cosZone/astro-koharu/tree/329ce55513a8057708c93c11c5b8c096680ad83c/public/fonts

License: SIL Open Font License 1.1 (see LICENSE).

The stylesheets are combined into result.css, with relative URLs adjusted and the Bold face mapped to the same CSS family at weight 700. Font binaries are unchanged.

Production builds run `scripts/build-font-subsets.py` after Astro renders the site.
Install its build dependencies with `python -m pip install -r scripts/font-requirements.txt`
before running `pnpm build` (Python 3.12 is used in CI).

The original fonts in this directory remain the input for development and rebuilding.
Python merges the bundled WOFF2 files into temporary TTF inputs and renames them.
`scripts/split-fonts.js` uses `cn-font-split@7.4.3` to split those inputs and generate
CSS using its WASM implementation. The WASM library is downloaded by the project's
postinstall script, which requires access to the upstream GitHub releases. Temporary
TTF files are removed afterwards.

The generated stylesheet replaces `dist/font/chill-round/result.css`; WOFF2 files
live in `dist/font/chill-round/subsets/400` and `subsets/700`, with content hashes
in their filenames. Both weights use the CSS family "寒蝉全圆体". Splitting uses
cn-font-split's default grouping and preserves the original character coverage,
with `unicode-range` declarations and `font-display: swap`; none are preloaded.
Derived fonts use the internal name "Folumio Round" to respect the original font's
reserved names. The original copyright and license are retained.
