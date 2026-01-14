#!/usr/bin/env node
// Enterprise Guard — No Hardcoded Secrets
// - Scans src/**/*.{ts,tsx,js,jsx,mjs,cjs} for suspicious secret-like literals
// - Excludes tests and common mock folders by default
// - Fails CI if suspicious patterns are found
// Tuning:
// - Add file ignores in IGNORE_PATH_PARTS
// - Add line allows with: // guard:allow-secret (for unavoidable false positives)

import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const IGNORE_PATH_PARTS = [
  "/node_modules/",
  "/.next/",
  "/dist/",
  "/build/",
  "/coverage/",
  "/__tests__/",
  "/__mocks__/",
  "/test/",
  "/tests/",
  "/vitest/",
  "/playwright/",
];

const ALLOW_LINE_MARKER = "guard:allow-secret";

// Heuristics:
// 1) Assignments/objects with key names like apiKey/secret/password/token in proximity to a string literal
// 2) Bearer tokens in strings
// 3) URLs containing user:pass@
// 4) Private key blocks
// 5) Long high-entropy-ish tokens (base64 / jwt-like) in string literals
const RULES = [
  {
    name: "private-key-block",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: "url-credentials",
    regex: /\bhttps?:\/\/[^/\s:@]+:[^/\s:@]+@/g,
  },
  {
    name: "bearer-token",
    regex: /\bBearer\s+[A-Za-z0-9\-_=.]{12,}\b/g,
  },
  {
    name: "jwt-like",
    regex: /\beyJ[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?\b/g,
  },
  {
    name: "suspicious-secret-keys-near-string",
    // matches e.g. apiKey: "...." OR "apiKey"="...." OR password = '...'
    regex:
      /\b(api[_-]?key|secret|password|passphrase|token|auth[_-]?token|client[_-]?secret|private[_-]?key)\b\s*[:=]\s*(['"`])([^'"`\n]{8,})\2/gi,
  },
  {
    name: "aws-access-key-id",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: "github-token",
    regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g,
  },
  {
    name: "slack-token",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    name: "generic-long-token-in-string",
    // string literal containing a long token-ish segment; tuned to reduce false positives.
    // Note: you can allow specific lines with // guard:allow-secret
    regex: /(['"`])([A-Za-z0-9\/+_=.-]{32,})\1/g,
  },
];

function shouldIgnore(filePath) {
  const p = filePath.replaceAll("\\", "/");
  return IGNORE_PATH_PARTS.some((part) => p.includes(part));
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (shouldIgnore(full)) continue;
    if (e.isDirectory()) {
      walk(full, files);
    } else if (e.isFile()) {
      const ext = path.extname(e.name);
      if (EXTENSIONS.has(ext)) files.push(full);
    }
  }
  return files;
}

function getLineInfo(text, index) {
  // compute 1-based line number and line snippet
  const before = text.slice(0, index);
  const lineNumber = before.split("\n").length;
  const lineStart = before.lastIndexOf("\n") + 1;
  const lineEnd = text.indexOf("\n", index);
  const end = lineEnd === -1 ? text.length : lineEnd;
  const line = text.slice(lineStart, end);
  return { lineNumber, line };
}

function isAllowedLine(line) {
  return line.includes(ALLOW_LINE_MARKER);
}

function main() {
  const files = walk(SRC_DIR);
  const findings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");

    for (const rule of RULES) {
      rule.regex.lastIndex = 0;
      let m;
      while ((m = rule.regex.exec(raw)) !== null) {
        const idx = m.index;
        const { lineNumber, line } = getLineInfo(raw, idx);

        if (isAllowedLine(line)) continue;

        // Reduce false positives: generic-long-token-in-string
        // If it looks like a placeholder (e.g., "YOUR_API_KEY", "REPLACE_ME"), ignore.
        if (rule.name === "generic-long-token-in-string") {
          const token = m[2] ?? "";
          const upper = token.toUpperCase();
          if (
            upper.includes("YOUR_") ||
            upper.includes("REPLACE") ||
            upper.includes("EXAMPLE") ||
            upper.includes("DUMMY") ||
            upper.includes("PLACEHOLDER")
          ) {
            continue;
          }
        }

        findings.push({
          file: path.relative(PROJECT_ROOT, file),
          rule: rule.name,
          lineNumber,
          line: line.trim(),
        });
      }
    }
  }

  if (findings.length > 0) {
    console.error("❌ guard-no-hardcoded-secrets: FAILED");
    console.error(
      "Found suspicious secret-like patterns. Fix by using process.env, secret manager, or add // guard:allow-secret for proven false positives.\n"
    );

    // Print grouped results
    const byFile = new Map();
    for (const f of findings) {
      const arr = byFile.get(f.file) ?? [];
      arr.push(f);
      byFile.set(f.file, arr);
    }

    for (const [file, arr] of byFile.entries()) {
      console.error(`\n— ${file}`);
      for (const x of arr) {
        console.error(
          `  L${x.lineNumber} [${x.rule}] ${x.line.length > 220 ? x.line.slice(0, 220) + "…" : x.line}`
        );
      }
    }

    process.exit(1);
  }

  console.log(`✅ guard-no-hardcoded-secrets: OK (${files.length} files scanned)`);
}

main();
