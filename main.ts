import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve every path from this file's own location, never from the cwd:
// the grader runs `node main.ts` from an arbitrary working directory.
const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

const text = readFileSync(entryPath, "utf8");

if (text.trim().length === 0) {
  console.error("entry.txt is empty or whitespace-only");
  process.exit(1);
}

// The vow must be a single line: one sentence, no line breaks inside it.
if (text.trim().includes("\n")) {
  console.error("entry.txt must contain a single line");
  process.exit(1);
}

// Reject invisible control characters that could hide extra content:
// C0 controls except newline, DEL, and zero-width / BOM code points.
for (const ch of text) {
  const code = ch.codePointAt(0)!;
  const invisible =
    (code < 0x20 && code !== 0x0a) ||
    code === 0x7f ||
    code === 0x200b ||
    code === 0x200c ||
    code === 0x200d ||
    code === 0xfeff;
  if (invisible) {
    console.error(
      `entry.txt contains invisible character U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
    );
    process.exit(1);
  }
}

if (text.length > 200) {
  console.error(`entry.txt is ${text.length} characters, over the 200 limit`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
