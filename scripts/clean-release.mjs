import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..", "..");

const targets = ["release"];

for (const dir of targets) {
  const abs = resolve(__dirname, dir);
  try {
    rmSync(abs, { recursive: true, force: true });
    console.log(`[clean-release] removed: ${abs}`);
  } catch (e) {
    console.warn(`[clean-release] skip: ${abs} -> ${e?.message || e}`);
  }
}
