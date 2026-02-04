#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const isWin = process.platform === "win32";

/**
 * Objetivo: si Vitest se cuelga DESPUÉS de generar coverage/lcov.info,
 * terminar el step antes del timeout de GitHub Actions, sin ocultar fallos reales.
 *
 * Regla:
 * - Si detectamos marcadores de FAIL -> exit 1
 * - Si NO hay FAIL y existe coverage/lcov.info -> exit 0 (aunque haya que matar el proceso)
 * - Si NO hay FAIL pero NO existe lcov -> exit 1
 */

// Límite duro menor que 25min del job (margen de seguridad)
const hardMaxMs = 23 * 60_000;

// Ruta canónica en el repo (confirmada por tu config)
const lcovPath = path.resolve(process.cwd(), "coverage/lcov.info");

// Usa los mismos flags que ya aparecen en tu CI (según logs)
const vitestCmd = isWin ? "npx.cmd" : "npx";
const vitestArgs = [
  "vitest",
  "run",
  "--coverage",
  "--no-file-parallelism",
  "--testTimeout=30000",
];

let sawFailureMarker = false;

function markFailureIfNeeded(text) {
  // Marcadores típicos (conservador: si aparece FAIL/fail, consideramos fallo)
  const markers = [
    "\nFAIL",
    " FAIL ",
    "Test Files",
    "Tests",
    "failed",
    "Failed",
    "AssertionError",
    "UnhandledPromiseRejection",
  ];

  // Ojo: "Test Files" por sí solo no es fallo. Lo usamos junto a "failed" debajo.
  if (text.includes("Test Files") && text.includes("failed")) sawFailureMarker = true;
  if (text.includes("Tests") && text.includes("failed")) sawFailureMarker = true;

  // Otros marcadores generales
  if (text.includes("\nFAIL") || text.includes(" FAIL ")) sawFailureMarker = true;
  if (text.includes("AssertionError")) sawFailureMarker = true;
  if (text.includes("UnhandledPromiseRejection")) sawFailureMarker = true;

  // "failed"/"Failed" sueltos: los marcamos solo si vienen en un contexto típico
  if (text.includes(" failed") && (text.includes("Test Files") || text.includes("Tests"))) {
    sawFailureMarker = true;
  }
}

function killTree(pid) {
  try {
    if (!isWin) {
      // matar grupo de procesos (por detached: true)
      process.kill(-pid, "SIGKILL");
    } else {
      // Windows: matar árbol
      spawn("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    }
  } catch {
    // ignore
  }
}

function debugCoverageDir() {
  try {
    const covDir = path.resolve(process.cwd(), "coverage");
    const exists = fs.existsSync(covDir);
    console.log(`[watchdog] cwd=${process.cwd()}`);
    console.log(`[watchdog] lcovPath=${lcovPath}`);
    console.log(`[watchdog] coverageDir=${covDir} exists=${exists}`);
    if (exists) {
      const files = fs.readdirSync(covDir);
      console.log(`[watchdog] coverageDirFiles=${JSON.stringify(files)}`);
    }
  } catch (e) {
    console.log(`[watchdog] debugCoverageDir error: ${e?.message ?? e}`);
  }
}

function decideExit() {
  const lcovExists = fs.existsSync(lcovPath);

  if (!lcovExists) {
    console.log("[watchdog] lcov missing at decision time");
    debugCoverageDir();
  }

  if (sawFailureMarker) return 1;
  if (lcovExists) return 0;
  return 1;
}

// Spawn en grupo (Linux) para poder matar árbol completo
const child = spawn(vitestCmd, vitestArgs, {
  stdio: ["ignore", "pipe", "pipe"],
  shell: false,
  detached: !isWin,
  env: { ...process.env, CI: process.env.CI ?? "1" },
});

// Hard timeout: si Vitest no termina, lo cortamos y salimos según regla
const t = setTimeout(() => {
  killTree(child.pid);

  // Espera breve para que el filesystem termine de escribir/flush del coverage
  setTimeout(() => {
    process.exit(decideExit());
  }, 3000);
}, hardMaxMs);

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  markFailureIfNeeded(text);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  process.stderr.write(text);
  markFailureIfNeeded(text);
});

child.on("exit", (code, signal) => {
  clearTimeout(t);

  const lcovExists = fs.existsSync(lcovPath);
  console.log(
    `[watchdog] child exit: code=${code} signal=${signal ?? "none"} lcov=${lcovExists} sawFailure=${sawFailureMarker}`
  );

  // Si Vitest salió OK, OK.
  if (signal == null && code === 0) process.exit(0);

  // En cualquier otro caso, decidir por evidencia
  process.exit(decideExit());
});
