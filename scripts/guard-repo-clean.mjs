#!/usr/bin/env node
import { execSync } from "node:child_process";

// Allowlist vacía por defecto
// Ejemplo futuro (solo con Decision Log):
// const ALLOWLIST = [/\.snap$/];
const ALLOWLIST = [];

function getRepoChanges() {
  try {
    const out = execSync("git status --porcelain", { encoding: "utf8" }).trim();
    if (!out) return [];
    return out.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch (error) {
    // Si no estamos en un repo git, retornar vacío
    return [];
  }
}

function isAllowed(changeLine) {
  // changeLine ejemplo: " M path/file.ts"
  const path = changeLine.slice(3);
  return ALLOWLIST.some((rx) => rx.test(path));
}

// Verificar si estamos en un repositorio git
let inGit = true;
try {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "pipe", encoding: "utf8" });
} catch {
  inGit = false;
}

if (!inGit) {
  console.log("✅ guard-repo-clean: OK (no se detectó git; verificación omitida)");
  process.exit(0);
}

// Obtener todos los cambios del repositorio
const changes = getRepoChanges();
const notAllowed = changes.filter((c) => !isAllowed(c));

if (notAllowed.length === 0) {
  console.log("✅ guard-repo-clean: OK (repositorio limpio)");
  process.exit(0);
}

const message =
  "Repo clean violation: el repositorio fue modificado durante ci:check.\n" +
  notAllowed.map((c) => ` - ${c}`).join("\n") +
  "\n\nSolución:\n" +
  " - Corrige el script/test que modifica archivos, o\n" +
  " - Si el cambio es intencional, documenta la allowlist en DECISION_LOG.md.";

if (process.env.CI) {
  console.error(`❌ guard-repo-clean: FAIL\n${message}`);
  process.exit(1);
} else {
  console.warn(`⚠️  guard-repo-clean: WARNING\n${message}`);
  process.exit(0);
}
