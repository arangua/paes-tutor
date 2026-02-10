// scripts/lint-critical.mjs
import { spawnSync } from "node:child_process";

const prev = process.env.ESLINT_CRITICAL_MODE;
process.env.ESLINT_CRITICAL_MODE = "true";

function run(cmd) {
  const r = spawnSync(cmd, {
    stdio: "inherit",
    shell: true, // cross-platform (Windows/Linux)
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

try {
  console.log("═══════════════════════════════════════════════════════════");
  console.log(" Ejecutando ESLint en modo CRÍTICO");
  console.log("  (Solo reglas que bloquean issues realmente críticos)");
  console.log("═══════════════════════════════════════════════════════════");

  // IMPORTANT:
  // - Only lint product TS/TSX under src
  // - Never lint docs/markdown/e2e
  run(
    "npx eslint " +
      '"src/**/*.{ts,tsx}" ' +
      "--max-warnings 0 " +
      "--no-error-on-unmatched-pattern " +
      '--ignore-pattern "e2e/**" ' +
      '--ignore-pattern "**/*.md" ' +
      '--ignore-pattern "playwright.config.ts"'
  );

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✓ Lint crítico: OK");
  console.log("═══════════════════════════════════════════════════════════");
} finally {
  if (prev === undefined) delete process.env.ESLINT_CRITICAL_MODE;
  else process.env.ESLINT_CRITICAL_MODE = prev;
}
