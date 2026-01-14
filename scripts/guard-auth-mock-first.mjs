import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "src", "app", "api");
const AUTH_MOCK = 'import "@/app/api/challenges/__tests__/auth-mock"';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function isTestFile(p) {
  return p.endsWith(".test.ts") || p.endsWith(".test.tsx");
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function firstNonEmptyNonCommentLine(src) {
  const lines = src.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("//")) continue;
    return t;
  }
  return "";
}

const all = walk(TARGET_DIR).filter(isTestFile);

const failures = [];

for (const file of all) {
  // Solo aplicamos la regla a tests de challenges (por ahora).
  if (!file.includes(path.join("challenges"))) continue;

  const src = read(file);

  // Si no usa auth-mock, no aplica (evita falsos positivos en otros suites).
  if (!src.includes(AUTH_MOCK)) continue;

  const first = firstNonEmptyNonCommentLine(src);

  if (!first.includes(AUTH_MOCK)) {
    failures.push({
      file,
      reason: `El primer import efectivo debe ser: ${AUTH_MOCK}`,
      firstLine: first,
    });
  }
}

if (failures.length) {
  console.error("\n❌ guard-auth-mock-first: Se detectaron tests con orden de imports inválido.\n");
  for (const f of failures) {
    console.error(`- ${f.file}`);
    console.error(`  razón: ${f.reason}`);
    console.error(`  primera línea: ${f.firstLine}\n`);
  }
  process.exit(1);
}

console.log("✅ guard-auth-mock-first: OK (orden de imports correcto en challenges)");
