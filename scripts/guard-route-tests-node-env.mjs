// scripts/guard-route-tests-node-env.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_ROOT = path.join(ROOT, "src", "app", "api");

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function isRouteTest(filePath) {
  const norm = filePath.replace(/\\/g, "/");
  return norm.startsWith(TARGET_ROOT.replace(/\\/g, "/")) && norm.endsWith("route.test.ts");
}

function hasNodeEnvDirective(src) {
  // Must be in the first non-empty lines (allow comments/whitespace above)
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Allow shebang-like? not used; just handle BOM and comments
    if (line === "// @vitest-environment node") return true;

    // If we hit actual code/import without seeing directive, fail fast.
    if (
      line.startsWith("import ") ||
      line.startsWith("export ") ||
      line.startsWith("describe(") ||
      line.startsWith("test(") ||
      line.startsWith("it(") ||
      line.startsWith("const ") ||
      line.startsWith("let ") ||
      line.startsWith("var ") ||
      line.startsWith("function ")
    ) {
      return false;
    }
    // other comments allowed; keep scanning a bit
  }
  return false;
}

const allFiles = walk(TARGET_ROOT);
const routeTests = allFiles.filter(isRouteTest);

const failures = [];
for (const f of routeTests) {
  const src = fs.readFileSync(f, "utf8");
  if (!hasNodeEnvDirective(src)) failures.push(f);
}

if (failures.length) {
  console.error("❌ guard-route-tests-node-env: Missing `// @vitest-environment node` in:");
  for (const f of failures) {
    console.error(" - " + path.relative(ROOT, f));
  }
  process.exit(1);
}

console.log(`✅ guard-route-tests-node-env: OK (${routeTests.length} route test files)`);
