import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

const FORBIDDEN = [
  /console\.(warn|error|log)\s*=\s*function\b/,
  /\bwindow\.addEventListener\s*=\s*function\b/,
  /\bwindow\.removeEventListener\s*=\s*function\b/,
  /\bEventTarget\.prototype\.addEventListener\s*=\s*function\b/,
  /\bEventTarget\.prototype\.removeEventListener\s*=\s*function\b/,
];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) yield p;
  }
}

let bad = [];
for (const file of walk(SRC)) {
  const txt = fs.readFileSync(file, "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(txt)) bad.push({ file, re: String(re) });
  }
}

if (bad.length) {
  console.error("❌ Global patch detected. Remove console/event overrides:");
  for (const b of bad) console.error(`- ${b.file}  matches ${b.re}`);
  process.exit(1);
}

console.log("✅ guard:no-global-patches passed");
