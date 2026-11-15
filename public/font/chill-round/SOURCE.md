Fonts: ChillRoundF Regular and Bold

Original: https://github.com/Warren2060/ChillRound

Web font subsets: https://github.com/cosZone/astro-koharu/tree/329ce55513a8057708c93c11c5b8c096680ad83c/public/fonts

License: SIL Open Font License 1.1 (see LICENSE).

The stylesheets are combined into result.css, with relative URLs adjusted and the Bold face mapped to the same CSS family at weight 700. Font binaries are unchanged.

Production builds run `scripts/build-font-subsets.py` after Astro renders the site.
Install its build dependencies with `python -m pip install -r scripts/font-requirements.txt`
before running `pnpm build` (Python 3.12 is used in CI).

The original fonts in this directory remain the input for development and rebuilding.
Only `dist/font/chill-round/result.css` is replaced; generated WOFF2 files live in
`dist/font/chill-round/subsets` with content hashes in their filenames.

For each weight (400 and 700), the shared subset contains homepage text, printable
ASCII, and characters appearing on at least half of the rendered pages. Remaining
site characters are grouped by page frequency into slices of up to 256 characters.
Characters absent from the current site are preserved in separate supplementary
slices, so newly encountered text can still use the font's original coverage.
All slices use non-overlapping `unicode-range` declarations and `font-display: swap`;
none are preloaded. Derived fonts use the internal name "Folumio Round" to respect
the original font's reserved names. The original copyright and license are retained.
