
import fs from "fs"
import path from "path"
import { execFileSync } from "child_process"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

const SRC_FONT = path.join(root, "font-src/HarmonyOS_Sans_SC_Regular.ttf")
const OUT_FONT = path.join(root, "font-src/HarmonyOS_Sans_SC-subset.woff2")

const SCAN_DIRS = ["src/content", "src/config", "src/i18n", "src/components", "src/layouts", "src/pages"]
const SCAN_EXTS = new Set([".md", ".mdx", ".astro", ".ts", ".tsx", ".svelte", ".json"])

const BASE_CHARS =
  " \t\r\n" +
  Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("") +
  "，。、；：？！“”‘’（）【】《》…—·～「」『』〈〉﹏﹍﹎"

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, files)
    } else if (SCAN_EXTS.has(path.extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

const chars = new Set(BASE_CHARS)

for (const dir of SCAN_DIRS) {
  const abs = path.join(root, dir)
  if (!fs.existsSync(abs)) continue
  for (const file of walk(abs)) {
    const text = fs.readFileSync(file, "utf-8")
    for (const ch of text) chars.add(ch)
  }
}

console.log(`Scanned source/content, found ${chars.size} unique characters.`)

const charsFile = path.join(root, ".font-subset-chars.txt")
fs.writeFileSync(charsFile, Array.from(chars).join(""), "utf-8")

try {
  execFileSync(
    "pyftsubset",
    [
      SRC_FONT,
      `--output-file=${OUT_FONT}`,
      `--text-file=${charsFile}`,
      "--flavor=woff2",
      "--layout-features=*",
      "--glyph-names",
      "--symbol-cmap",
      "--legacy-cmap",
      "--notdef-glyph",
      "--notdef-outline",
      "--recommended-glyphs",
      "--name-legacy",
      "--drop-tables=",
      "--desubroutinize",
    ],
    { stdio: "inherit" },
  )
} finally {
  fs.rmSync(charsFile, { force: true })
}

const outSize = fs.statSync(OUT_FONT).size
const srcSize = fs.statSync(SRC_FONT).size
console.log(
  `Done: ${(srcSize / 1024 / 1024).toFixed(1)}MB -> ${(outSize / 1024).toFixed(0)}KB (${OUT_FONT})`,
)
