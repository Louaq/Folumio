"""Repartition the bundled fonts using rendered site text; write only to dist."""

from collections import Counter
from hashlib import sha256
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/font/chill-round"
OUTPUT = ROOT / "dist/font/chill-round"
# Smaller slices avoid downloading hundreds of unrelated glyphs per article.
SLICE_SIZE = 64


class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skipped = 0
        self.characters = set()

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skipped += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skipped -= 1

    def handle_data(self, data):
        if not self.skipped:
            self.characters.update(map(ord, data))


def page_characters(path):
    parser = PageText()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser.characters


def unicode_ranges(characters):
    runs = []
    for codepoint in sorted(characters):
        if runs and codepoint == runs[-1][1] + 1:
            runs[-1][1] = codepoint
        else:
            runs.append([codepoint, codepoint])
    return ",".join(
        f"U+{start:X}" if start == end else f"U+{start:X}-{end:X}"
        for start, end in runs
    )


def build_weight(directory, weight, common, frequency):
    font = Merger().merge([str(p) for p in sorted((SOURCE / directory).glob("*.woff2"))])
    supported = set(font.getBestCmap())
    common = common & supported
    site = sorted((supported & frequency.keys()) - common, key=lambda c: (-frequency[c], c))
    unused = sorted(supported - common - frequency.keys())
    groups = [common]
    for characters in (site, unused):
        groups.extend(
            set(characters[i:i + SLICE_SIZE])
            for i in range(0, len(characters), SLICE_SIZE)
        )

    # The source reserves ChillRoundF/M; give the derived font its own internal name.
    style = "Regular" if weight == 400 else "Bold"
    names = {
        1: "Folumio Round", 2: style, 3: f"Folumio Round {style}",
        4: f"Folumio Round {style}", 6: f"FolumioRound-{style}",
        16: "Folumio Round", 17: style,
    }
    for record in font["name"].names:
        if record.nameID in names:
            font["name"].setName(
                names[record.nameID], record.nameID,
                record.platformID, record.platEncID, record.langID,
            )
    font.flavor = None
    font.recalcTimestamp = False
    original = BytesIO()
    font.save(original)
    font.close()

    rules = []
    total_bytes = 0
    common_bytes = 0
    for index, characters in enumerate(groups):
        part = TTFont(BytesIO(original.getvalue()), recalcTimestamp=False)
        options = subset.Options()
        options.layout_features = ["*"]
        options.recalc_timestamp = False
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=characters)
        subsetter.subset(part)
        part.flavor = "woff2"
        buffer = BytesIO()
        part.save(buffer)
        part.close()
        data = buffer.getvalue()
        label = "common" if index == 0 else "extra"
        filename = f"{weight}-{label}-{sha256(data).hexdigest()[:16]}.woff2"
        (OUTPUT / "subsets" / filename).write_bytes(data)
        total_bytes += len(data)
        if index == 0:
            common_bytes = len(data)
        rules.append(
            '@font-face{font-family:"寒蝉全圆体";'
            f'src:url("./subsets/{filename}")format("woff2");'
            f'font-display:swap;font-weight:{weight};'
            f'unicode-range:{unicode_ranges(characters)};}}'
        )
    print(
        f"Font {weight}: {len(supported)} characters, {len(groups)} slices, "
        f"common {len(common)} characters / {common_bytes / 1024:.1f} KiB, "
        f"total {total_bytes / 1024:.1f} KiB",
        flush=True,
    )
    return rules


def main():
    pages = sorted((ROOT / "dist").rglob("*.html"))
    frequency = Counter(c for page in pages for c in page_characters(page))
    common = page_characters(ROOT / "dist/index.html") | set(range(0x20, 0x7F))
    common.update(c for c, count in frequency.items() if count * 2 >= len(pages))
    (OUTPUT / "subsets").mkdir(exist_ok=True)
    rules = []
    for directory, weight in (("ChillRoundFRegular", 400), ("ChillRoundFBold", 700)):
        rules.extend(build_weight(directory, weight, common, frequency))
    css = "\n".join(rules) + "\n"
    (OUTPUT / "result.css").write_text(css, encoding="utf-8")
    print(f"Font CSS: {len(css.encode('utf-8')) / 1024:.1f} KiB", flush=True)


if __name__ == "__main__":
    main()
