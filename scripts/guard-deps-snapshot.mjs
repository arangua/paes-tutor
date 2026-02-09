#!/usr/bin/env node
/**
 * guard-deps-snapshot.mjs
 *
 * Goal: Keep a deterministic snapshot of "logical" resolved dependencies
 * that is stable across OS/arch (cross-platform), so CI on Linux and dev on
 * Windows don't drift due to native/binary packages (swc/sharp/esbuild/etc).
 *
 * Commands:
 *  - npm run guard:deps-snapshot            (fails on drift)
 *  - npm run guard:deps-snapshot:write      (writes baseline)
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REPO_ROOT = process.cwd();
const LOCK_PATH = path.join(REPO_ROOT, "package-lock.json");
const BASELINE_PATH = path.join(REPO_ROOT, "docs", "ci", "DEPS_SNAPSHOT.json");

const MODE = process.argv.includes("--write") ? "write" : "check";

// --- Cross-platform filter -------------------------------------------------

/**
 * Returns true if a package should be excluded from the snapshot because it is
 * platform-specific (OS/CPU/libc toolchain) and causes Windows/Linux drift.
 *
 * We intentionally keep this filter conservative and focused on known sources
 * of drift and/or explicit lock metadata (os/cpu).
 */
function isPlatformSpecific(name, meta) {
  if (!name) return false;

  // If lock metadata explicitly restricts OS/CPU, treat as platform-specific.
  if (meta?.os?.length || meta?.cpu?.length) return true;

  // Common OS tokens in package names
  const osToken = /(?:^|[\/-])(linux|win32|darwin|android|freebsd|openbsd|netbsd|sunos|aix)(?:[\/-]|$)/i;
  if (osToken.test(name)) return true;

  // Known native/binary families that ship per-platform artifacts
  const knownNativeFamilies = [
    /^@next\/swc-/i,
    /^@esbuild\//i,
    /^@img\/sharp-/i,
    /^@napi-rs\/canvas-/i,
    /^@rollup\/rollup-/i,
    /^lightningcss-/i,
    /^@sentry\/cli-/i,
  ];
  if (knownNativeFamilies.some((re) => re.test(name))) return true;

  // Toolchain / libc hints; only exclude if also appears alongside OS/arch patterns
  // (kept as a safety net).
  const libcOrToolchain = /(?:^|[\/-])(musl|gnu|glibc|msvc)(?:[\/-]|$)/i;
  const archToken = /(?:^|[\/-])(x64|arm64|arm|ia32|ppc64|s390x|riscv64)(?:[\/-]|$)/i;
  if (libcOrToolchain.test(name) && (archToken.test(name) || osToken.test(name))) return true;

  return false;
}

// --- Lock parsing ----------------------------------------------------------

function nameFromPackagesKey(k) {
  // k examples:
  //  "" (root)
  //  "node_modules/react"
  //  "node_modules/@next/swc-linux-x64-gnu"
  //  "node_modules/foo/node_modules/@scope/bar"
  if (!k || k === "") return null;

  const marker = "node_modules/";
  const idx = k.lastIndexOf(marker);
  if (idx === -1) return null;

  const tail = k.slice(idx + marker.length);
  if (!tail) return null;

  if (tail.startsWith("@")) {
    // scoped package: @scope/name
    const parts = tail.split("/");
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return tail;
  }

  // unscoped: first path segment
  return tail.split("/")[0];
}

async function readJson(p) {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw);
}

function buildCrossPlatformResolvedList(lockJson) {
  const packages = lockJson?.packages;
  if (!packages || typeof packages !== "object") {
    throw new Error("package-lock.json does not contain a 'packages' object (npm lockfile v2/v3 expected).");
  }

  const out = [];

  for (const [k, meta] of Object.entries(packages)) {
    if (k === "") continue; // root
    const name = nameFromPackagesKey(k);
    const version = meta?.version;

    if (!name || !version) continue;

    if (isPlatformSpecific(name, meta)) continue;

    // Snapshot line: name@version
    out.push(`${name}@${version}`);
  }

  // Deduplicate + sort stable
  return Array.from(new Set(out)).sort((a, b) => a.localeCompare(b));
}

// --- Diff ------------------------------------------------------------------

function diffLists(baseline, current) {
  const b = new Set(baseline);
  const c = new Set(current);

  const added = [];
  const removed = [];

  for (const x of c) if (!b.has(x)) added.push(x);
  for (const x of b) if (!c.has(x)) removed.push(x);

  added.sort((a, b) => a.localeCompare(b));
  removed.sort((a, b) => a.localeCompare(b));

  return { added, removed };
}

// --- Main ------------------------------------------------------------------

async function main() {
  const lock = await readJson(LOCK_PATH);
  const currentList = buildCrossPlatformResolvedList(lock);

  const snapshot = {
    schemaVersion: 1,
    snapshotMode: "cross-platform",
    generatedAt: new Date().toISOString(),
    generatedBy: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      ci: Boolean(process.env.CI),
    },
    count: currentList.length,
    packages: currentList,
  };

  if (MODE === "write") {
    await fs.mkdir(path.dirname(BASELINE_PATH), { recursive: true });
    await fs.writeFile(BASELINE_PATH, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
    console.log(`✅ guard-deps-snapshot: baseline written (${snapshot.count} packages) -> ${path.relative(REPO_ROOT, BASELINE_PATH)}`);
    return;
  }

  // check
  let baselineJson;
  try {
    baselineJson = await readJson(BASELINE_PATH);
  } catch {
    console.error("❌ guard-deps-snapshot: FAIL");
    console.error(`Baseline not found: ${path.relative(REPO_ROOT, BASELINE_PATH)}`);
    console.error("If this is the first run: npm run guard:deps-snapshot:write && commit the baseline.");
    process.exit(1);
  }

  const baselineList = Array.isArray(baselineJson?.packages) ? baselineJson.packages : [];
  const { added, removed } = diffLists(baselineList, currentList);

  if (added.length === 0 && removed.length === 0) {
    console.log("✅ guard-deps-snapshot: OK");
    console.log(`Snapshot mode: ${baselineJson?.snapshotMode || "unknown"} | packages: ${currentList.length}`);
    return;
  }

  console.error("❌ guard-deps-snapshot: FAIL");
  console.error("Dependency drift detected (cross-platform snapshot; native/binary packages are ignored).");
  console.error("");
  console.error(`Added (${added.length}):`);
  for (const x of added.slice(0, 50)) console.error(`- ${x}`);
  if (added.length > 50) console.error(`- ... (${added.length - 50} more)`);

  console.error("");
  console.error(`Removed (${removed.length}):`);
  for (const x of removed.slice(0, 50)) console.error(`- ${x}`);
  if (removed.length > 50) console.error(`- ... (${removed.length - 50} more)`);

  console.error("");
  console.error("If this change is intentional: npm run guard:deps-snapshot:write && commit the baseline.");
  console.error("Also register the decision in the Decision Log (governance).");
  process.exit(1);
}

main().catch((err) => {
  console.error("❌ guard-deps-snapshot: ERROR");
  console.error(err?.stack || String(err));
  process.exit(1);
});
