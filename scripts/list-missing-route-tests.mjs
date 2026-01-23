import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const API_DIR = path.join(ROOT, "src", "app", "api");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(API_DIR);
const routes = files.filter((f) => f.endsWith(`${path.sep}route.ts`));
const tests = new Set(files.filter((f) => f.endsWith(`${path.sep}route.test.ts`)));

const missing = [];
for (const route of routes) {
  const testPath = route.replace(`${path.sep}route.ts`, `${path.sep}route.test.ts`);
  if (!tests.has(testPath)) missing.push(route);
}

function toEndpoint(file) {
  const rel = path.relative(API_DIR, path.dirname(file));
  return "/api/" + rel.split(path.sep).join("/");
}

const missingEndpoints = missing
  .map((f) => ({ endpoint: toEndpoint(f), file: path.relative(ROOT, f) }))
  .sort((a, b) => a.endpoint.localeCompare(b.endpoint));

console.log(`Missing route.test.ts: ${missingEndpoints.length}\n`);
for (const m of missingEndpoints) {
  console.log(`${m.endpoint}  ->  ${m.file}`);
}
