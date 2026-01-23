#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, "docs", "ci", "WARNING_BASELINE.json");

// 1) Qué comando auditar (enterprise: el mismo que te importa en CI)
const command = process.env.GUARD_CMD ?? "npm";
const args = process.env.GUARD_ARGS
  ? JSON.parse(process.env.GUARD_ARGS)
  : ["run", "test:run"];

// 2) Patrones CRÍTICOS: si aparecen → fallo inmediato (no hay "budget")
const CRITICAL_PATTERNS = [
  { id: "unhandled-rejection", re: /UnhandledPromiseRejection/i },
  { id: "node-experimental", re: /ExperimentalWarning/i },
  { id: "deprecation", re: /DeprecationWarning/i },
  { id: "react-act", re: /not wrapped in act\(\)/i },
  { id: "vitest-leak", re: /open handles|leaked|detectOpenHandles/i },
];

// 3) Patrones "budget": se permiten SOLO si no aumentan vs baseline
const BUDGET_PATTERNS = [
  { id: "console-error", re: /\bconsole\.error\b/i },
  { id: "console-warn", re: /\bconsole\.warn\b/i },
  // agrega aquí warnings "ruidosos" que quieras trackear sin caer en falsos positivos
];

// --- helpers ---
function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`❌ Missing baseline: ${BASELINE_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(BASELINE_PATH, "utf8");
  return JSON.parse(raw);
}

function countMatches(text, patterns) {
  const counts = {};
  for (const p of patterns) counts[p.id] = 0;

  // cuenta por línea para evitar "múltiples hits" por un mismo warning multilinea
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

// --- run ---
const baseline = readBaseline();

const result = spawnSync(command, args, {
  cwd: ROOT,
  encoding: "utf8",
  shell: process.platform === "win32", // Windows friendly
});

const out = (result.stdout ?? "") + "\n" + (result.stderr ?? "");
const criticalCounts = countMatches(out, CRITICAL_PATTERNS);
const budgetCounts = countMatches(out, BUDGET_PATTERNS);

// 1) críticos: cero tolerancia
const criticalTotal = sumCounts(criticalCounts);
if (criticalTotal > 0) {
  console.error("❌ guard-ci-clean-output: CRITICAL warnings detected");
  console.error(JSON.stringify({ criticalCounts }, null, 2));
  process.exit(1);
}

// 2) budget: no puede aumentar
const allowed = baseline.budget?.byPatternAllowed ?? {};
let increased = [];
for (const [id, count] of Object.entries(budgetCounts)) {
  const allow = Number(allowed[id] ?? 0);
  if (count > allow) increased.push({ id, count, allow });
}

if (increased.length > 0) {
  console.error("❌ guard-ci-clean-output: warning budget increased");
  console.error(JSON.stringify({ increased, budgetCounts }, null, 2));
  
  // Mostrar contexto de los warnings detectados
  console.error("\n📋 Contexto de warnings detectados:");
  const lines = out.split(/\r?\n/);
  for (const inc of increased) {
    const pattern = BUDGET_PATTERNS.find(p => p.id === inc.id);
    if (pattern) {
      console.error(`\n  ${inc.id} (${inc.count} encontrados, ${inc.allow} permitidos):`);
      let shown = 0;
      for (const line of lines) {
        if (pattern.re.test(line) && shown < 3) {
          console.error(`    ${line.substring(0, 150)}`);
          shown++;
        }
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

if (result.status !== 0) {
  // Importante: este guard no reemplaza el fallo del comando; solo audita.
  process.exit(result.status);
}
