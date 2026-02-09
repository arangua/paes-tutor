#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, "docs", "ci", "WARNING_BASELINE.json");

const DEFAULT_TIMEOUT_MS = 120_000; // 2 min (enterprise-safe)
const TIMEOUT_MS = Number(process.env.CI_CLEAN_OUTPUT_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

function isCanceledError(err) {
  const msg = String(err?.message ?? "");
  return err?.name === "AbortError" || /canceled|cancelled/i.test(msg);
}

function runWithTimeout(fn) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  if (t.unref) t.unref();
  return fn(ac.signal).finally(() => clearTimeout(t));
}

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
];

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

function runCommand(signal) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      shell: process.platform === "win32",
      encoding: "utf8",
      signal,
    });

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => { stdout += d; });
    child.stderr?.on("data", (d) => { stderr += d; });

    child.on("error", (err) => {
      if (err?.name === "AbortError") reject(err);
      else reject(err);
    });

    child.on("close", (code) => {
      resolve({
        stdout,
        stderr,
        status: code,
      });
    });
  });
}

async function main() {
  const baseline = readBaseline();

  try {
    const result = await runWithTimeout((signal) => runCommand(signal));

    const out = (result.stdout ?? "") + "\n" + (result.stderr ?? "");
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
      console.error("\n📋 Contexto de warnings detectados:");
      const lines = out.split(/\r?\n/);
      for (const inc of increased) {
        const pattern = BUDGET_PATTERNS.find((p) => p.id === inc.id);
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
      process.exit(result.status);
    }
    process.exit(0);
  } catch (err) {
    if (isCanceledError(err)) {
      console.error(
        `❌ guard-ci-clean-output: CANCELED (timeout=${TIMEOUT_MS}ms). Ajusta CI_CLEAN_OUTPUT_TIMEOUT_MS o reduce el scope del scan.`
      );
    } else {
      console.error("❌ guard-ci-clean-output: FAILED");
    }
    console.error(err?.message ?? err);
    process.exit(1);
  }
}

main();
