#!/usr/bin/env node
import { execSync } from "node:child_process";

function sh(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString("utf8");
}

// Files staged for commit
const out = sh("git diff --cached --name-only");
const files = out.split(/\r?\n/).filter(Boolean);

// Block new/changed markdown files in repo root (except README.md)
const offenders = files.filter((p) => {
  if (!p.toLowerCase().endsWith(".md")) return false;
  const normalized = p.replaceAll("\\", "/");
  if (normalized.includes("/")) return false; // not root
  return normalized.toLowerCase() !== "readme.md";
});

if (offenders.length > 0) {
  console.error("\n❌ Markdown en la raíz no permitido (excepto README.md).");
  console.error("Mueve estos archivos a docs/ (por ejemplo docs/notes/, docs/analysis/, docs/runbooks/):\n");
  for (const f of offenders) console.error(`- ${f}`);
  console.error("\n(Guard: scripts/guard-no-root-markdown.mjs)\n");
  process.exit(1);
}

process.exit(0);
