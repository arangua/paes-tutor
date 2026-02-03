#!/usr/bin/env node
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import { existsSync, readFileSync } from "node:fs";

const ALLOWED_GIT_PREFIX = "git ";

function sh(cmd) {
  const trimmed = typeof cmd === "string" ? cmd.trim() : "";
  if (!trimmed.startsWith(ALLOWED_GIT_PREFIX)) {
    throw new Error(`guard-lockfile-policy: comando no permitido (allowlist: ${ALLOWED_GIT_PREFIX.trim()})`);
  }
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
}

function fail(msg) {
  console.error(`❌ guard-lockfile-policy: FAIL\n${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`✅ guard-lockfile-policy: OK\n${msg}`);
}

if (!existsSync("package.json")) fail("package.json no existe en la raíz.");
if (!existsSync("package-lock.json")) fail("package-lock.json no existe en la raíz.");

const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
if (lock.lockfileVersion !== 3) {
  fail(`lockfileVersion esperado 3, encontrado: ${lock.lockfileVersion}`);
}

// Si no estamos en git (casos raros), hacemos un check mínimo.
let inGit = true;
try {
  sh("git rev-parse --is-inside-work-tree");
} catch {
  inGit = false;
}

if (!inGit) {
  ok("No se detectó git; verificación mínima realizada (existencia + lockfileVersion).");
  process.exit(0);
}

// Política: si cambia package.json en el PR/commit, package-lock.json debe cambiar también.
const changed = sh("git diff --name-only --diff-filter=ACMRT HEAD~1..HEAD || true")
  .split("\n")
  .map(s => s.trim())
  .filter(Boolean);

const pkgChanged = changed.includes("package.json");
const lockChanged = changed.includes("package-lock.json");

if (pkgChanged && !lockChanged) {
  fail(
    [
      "Se detectó cambio en package.json sin cambio en package-lock.json.",
      "Solución: ejecuta `npm install` (o `npm install --package-lock-only`) y commitea el lockfile.",
    ].join("\n")
  );
}

// Consistencia: regenerar lockfile (sin instalar node_modules) y exigir que no haya diffs.
// Guardar estado actual antes de regenerar
const lockBefore = readFileSync("package-lock.json", "utf8");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
try {
  execFileSync(npmCmd, [
    "install",
    "--package-lock-only",
    "--ignore-scripts",
    "--no-audit",
    "--fund=false",
  ], { stdio: "pipe", encoding: "utf8", shell: true });
} catch (e) {
  fail(
    [
      "Falló `npm install --package-lock-only`.",
      "Esto suele indicar inconsistencia entre package.json y el lockfile, o un entorno npm roto.",
      "Detalle:",
      String(e?.stdout || "") + String(e?.stderr || ""),
    ].join("\n")
  );
}

// Leer lockfile regenerado
const lockAfter = readFileSync("package-lock.json", "utf8");

// Normalizar line endings para comparación (ignorar diferencias CRLF vs LF)
const lockBeforeNormalized = lockBefore.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
const lockAfterNormalized = lockAfter.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// Si el contenido normalizado es diferente, hay cambios reales
if (lockBeforeNormalized !== lockAfterNormalized) {
  // Verificar si son cambios reales de dependencias o solo formato
  const lockBeforeParsed = JSON.parse(lockBeforeNormalized);
  const lockAfterParsed = JSON.parse(lockAfterNormalized);
  
  // Comparar versiones críticas
  if (lockBeforeParsed.lockfileVersion !== lockAfterParsed.lockfileVersion) {
    fail(
      [
        "package-lock.json tiene lockfileVersion inconsistente.",
        `Esperado: ${lockBeforeParsed.lockfileVersion}, Regenerado: ${lockAfterParsed.lockfileVersion}`,
        "Solución: commitea el package-lock.json resultante de `npm install --package-lock-only`.",
      ].join("\n")
    );
  }
  
  // Si hay diferencias, es un cambio real que necesita commit
  fail(
    [
      "package-lock.json no es determinístico/consistente (se modificaría al regenerarlo).",
      "Solución: commitea el package-lock.json resultante de `npm install --package-lock-only`.",
    ].join("\n")
  );
}

// Restaurar el lockfile original si no había cambios reales
if (lockBefore !== lockAfter) {
  // Solo diferencias de line endings, restaurar original
  fs.writeFileSync("package-lock.json", lockBefore, "utf8");
}

ok("Lockfile presente, lockfileVersion=3, política y consistencia OK.");
