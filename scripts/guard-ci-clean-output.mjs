#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// 1) Baseline
const BASELINE_PATH = path.join(ROOT, "docs", "ci", "WARNING_BASELINE.json");

// 2) Fuente de logs a auditar (se genera en CI en el test:run)
const INPUT_PATH = process.env.GUARD_INPUT_FILE
  ? path.resolve(ROOT, process.env.GUARD_INPUT_FILE)
  : path.join(ROOT, "docs", "ci", "_last_test_output.txt");

// 3) Patrones CRÍTICOS: si aparecen → fallo inmediato
const CRITICAL_PATTERNS = [
  { id: "unhandled-rejection", re: /UnhandledPromiseRejection/i },
  { id: "node-experimental", re: /ExperimentalWarning/i },
  { id: "deprecation", re: /DeprecationWarning/i },
  { id: "react-act", re: /not wrapped in act\(\)/i },
  { id: "vitest-leak", re: /open handles|leaked|detectOpenHandles/i },
];

// 4) Patrones "budget": se permiten SOLO si no aumentan vs baseline
const BUDGET_PATTERNS = [
  { id: "console-error", re: /\bconsole\.error\b/i },
  { id: "console-warn", re: /\bconsole\.warn\b/i },
];

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing file: ${p}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function readText(p) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing input log: ${p}`);
    console.error(
      "💡 Hint: genera el log en CI con: npm run test:run | tee docs/ci/_last_test_output.txt"
    );
    process.exit(1);
  }
  return fs.readFileSync(p, "utf8");
}

function countMatches(text, patterns) {
  const counts = {};
  for (const p of patterns) counts[p.id] = 0;

  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    for (const p of patterns) {
      if (p.re.test(line)) counts[p.id] += 1;
    }
  }
  return counts;
}

function sumCounts(counts) {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

function main() {
  const baseline = readJson(BASELINE_PATH);
  const out = readText(INPUT_PATH);

  const criticalCounts = countMatches(out, CRITICAL_PATTERNS);
  const budgetCounts = countMatches(out, BUDGET_PATTERNS);

  const criticalTotal = sumCounts(criticalCounts);
  if (criticalTotal > 0) {
    console.error("❌ guard-ci-clean-output: CRITICAL warnings detected");
    console.error(JSON.stringify({ criticalCounts }, null, 2));
    process.exit(1);
  }

  const allowed = baseline.budget?.byPatternAllowed ?? {};
  const increased = [];
  for (const [id, count] of Object.entries(budgetCounts)) {
    const allow = Number(allowed[id] ?? 0);
    if (count > allow) increased.push({ id, count, allow });
  }

  if (increased.length > 0) {
    console.error("❌ guard-ci-clean-output: warning budget increased");
    console.error(JSON.stringify({ increased, budgetCounts }, null, 2));

    console.error("\n📋 Contexto (hasta 3 líneas por patrón aumentado):");
    const lines = out.split(/\r?\n/);
    for (const inc of increased) {
      const pattern = BUDGET_PATTERNS.find((p) => p.id === inc.id);
      if (!pattern) continue;

      console.error(`\n  ${inc.id} (${inc.count} encontrados, ${inc.allow} permitidos):`);
      let shown = 0;
      for (const line of lines) {
        if (pattern.re.test(line) && shown < 3) {
          console.error(`    ${line.substring(0, 150)}`);
          shown++;
        }
      }
    }

    console.error(
      `\n💡 Hint: si esto es legacy aceptado temporalmente, actualiza docs/ci/WARNING_BASELINE.json ` +
        `byPatternAllowed.${increased[0].id} = ${increased[0].count}\n`
    );
    process.exit(1);
  }

  console.log("✅ guard-ci-clean-output: OK (no critical warnings; budget not increased)");
  process.exit(0);
}

main();
