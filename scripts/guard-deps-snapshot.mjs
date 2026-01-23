#!/usr/bin/env node
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const BASELINE_PATH = "docs/ci/DEPS_SNAPSHOT.json";

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
}

function fail(msg) {
  console.error(`❌ guard-deps-snapshot: FAIL\n${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`✅ guard-deps-snapshot: OK\n${msg}`);
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function sha256FileText(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function getSnapshot() {
  // npm ls entrega el árbol, pero para snapshot estable usamos `npm ls --all --json`
  // y aplanamos dependencias -> nombre@version
  const raw = sh("npm ls --all --json");
  const tree = JSON.parse(raw);

  const set = new Set();

  function walk(node) {
    if (!node) return;
    const deps = node.dependencies || {};
    for (const [name, dep] of Object.entries(deps)) {
      // dep.version puede faltar en dependencias opcionales o peer dependencies no instaladas
      // Solo agregamos si tiene versión (dependencias realmente instaladas)
      const version = dep?.version;
      if (version) {
        set.add(`${name}@${version}`);
        walk(dep);
      }
      // Si no tiene versión, es probablemente opcional/peer no instalada, la ignoramos
    }
  }

  walk(tree);

  return {
    generatedAt: new Date().toISOString(),
    node: process.version,
    npm: sh("npm -v"),
    count: set.size,
    packages: Array.from(set).sort(),
  };
}

function buildSnapshot(snapshotData, packageLockSha256) {
  return {
    meta: { packageLockSha256 },
    generatedAt: snapshotData.generatedAt,
    node: snapshotData.node,
    npm: snapshotData.npm,
    count: snapshotData.count,
    packages: snapshotData.packages,
  };
}

function stableStringify(obj) {
  return JSON.stringify(obj, null, 2) + "\n";
}

const mode = process.argv.includes("--write") ? "write" : "check";

if (!existsSync("package-lock.json")) {
  fail("package-lock.json no existe. Este guard requiere lockfile.");
}

// Leer package-lock.json y calcular hash
const lockText = readFileSync("package-lock.json", "utf8");
const packageLockSha256 = sha256FileText(lockText);

const snapshotData = getSnapshot();

if (mode === "write") {
  ensureDir(BASELINE_PATH);
  const snapshot = buildSnapshot(snapshotData, packageLockSha256);
  writeFileSync(BASELINE_PATH, stableStringify(snapshot), "utf8");
  ok(`Baseline escrito: ${BASELINE_PATH} (${snapshot.count} packages, lockfile SHA256: ${packageLockSha256.substring(0, 16)}...)`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  fail(
    [
      `No existe baseline: ${BASELINE_PATH}`,
      "Solución: ejecuta `npm run guard:deps-snapshot:write` y commitea el archivo.",
    ].join("\n")
  );
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));

// Validar hash del lockfile
if (!baseline.meta?.packageLockSha256) {
  fail(
    [
      "DEPS_SNAPSHOT.json no tiene meta.packageLockSha256.",
      "Solución: ejecuta `npm run guard:deps-snapshot:write` y commitea el cambio.",
    ].join("\n")
  );
}

if (baseline.meta.packageLockSha256 !== packageLockSha256) {
  fail(
    [
      "Dependency drift (lockfile fingerprint mismatch).",
      `baseline: ${baseline.meta.packageLockSha256}`,
      `current : ${packageLockSha256}`,
      "Si el cambio es intencional: npm run guard:deps-snapshot:write y commitea.",
    ].join("\n")
  );
}

const baselinePkgs = Array.isArray(baseline.packages) ? baseline.packages : null;
if (!baselinePkgs) fail("Baseline inválido: falta `packages`.");

const currentPkgs = snapshotData.packages;

const missing = baselinePkgs.filter((p) => !currentPkgs.includes(p));
const added = currentPkgs.filter((p) => !baselinePkgs.includes(p));

if (missing.length || added.length) {
  const lines = [];
  lines.push("Se detectó drift de dependencias resueltas (transitivas incluidas).");
  if (added.length) lines.push(`\nNuevas (${added.length}):\n- ${added.slice(0, 50).join("\n- ")}${added.length > 50 ? "\n- ... (truncado)" : ""}`);
  if (missing.length) lines.push(`\nRemovidas (${missing.length}):\n- ${missing.slice(0, 50).join("\n- ")}${missing.length > 50 ? "\n- ... (truncado)" : ""}`);

  lines.push(
    "\nSi el cambio es legítimo: actualiza el baseline con `npm run guard:deps-snapshot:write` " +
      "y registra decisión en Decision Log."
  );

  fail(lines.join("\n"));
}

ok(`Snapshot estable. (${snapshotData.count} packages, lockfile SHA256: ${packageLockSha256.substring(0, 16)}...)`);
