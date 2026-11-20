"""Merge the bundled fonts, then generate production subsets with cn-font-split."""

from pathlib import Path
from subprocess import run
from tempfile import TemporaryDirectory

from fontTools.merge import Merger


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/font/chill-round"
OUTPUT = ROOT / "dist/font/chill-round"


def merge_weight(directory, weight, output):
    font = Merger().merge([str(p) for p in sorted((SOURCE / directory).glob("*.woff2"))])
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
    font.save(output / f"{weight}.ttf")
    font.close()


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(prefix="font-source-", dir=OUTPUT) as temporary:
        source = Path(temporary)
        for directory, weight in (("ChillRoundFRegular", 400), ("ChillRoundFBold", 700)):
            merge_weight(directory, weight, source)
        run(
            ["node", str(ROOT / "scripts/split-fonts.js"), str(source), str(OUTPUT)],
            check=True,
        )


if __name__ == "__main__":
    main()
