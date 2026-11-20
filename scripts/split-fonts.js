import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fontSplit, StaticWasm } from "cn-font-split/dist/wasm/index.mjs";

const [source, output] = process.argv.slice(2);
const styles = [];
const wasmPath = fileURLToPath(
  new URL("libffi-wasm32-wasip1.wasm", import.meta.resolve("cn-font-split")),
);
const wasm = new StaticWasm(new Uint8Array(await readFile(wasmPath)));

for (const weight of [400, 700]) {
  const directory = path.join(output, "subsets", String(weight));
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  const files = await fontSplit(
    {
      input: new Uint8Array(await readFile(path.join(source, `${weight}.ttf`))),
      outDir: directory,
      css: {
        fontFamily: "寒蝉全圆体",
        fontWeight: String(weight),
        fontStyle: "normal",
        fontDisplay: "swap",
        compress: true,
      },
      renameOutputFont: "[hash:16].[ext]",
      testHtml: false,
      reporter: false,
    },
    wasm.WasiHandle,
  );
  for (const { name, data } of files) {
    await writeFile(path.join(directory, name), data);
  }
  const css = await readFile(path.join(directory, "result.css"), "utf8");
  styles.push(css.replaceAll("url(\"./", `url("./subsets/${weight}/`));
}

await writeFile(path.join(output, "result.css"), styles.join("\n"));
