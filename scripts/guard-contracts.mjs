#!/usr/bin/env node
/**
 * Guard CI de Contratos
 * 
 * Detecta regresiones en el sistema de contratos:
 * - Eliminación de .strict() en schemas
 * - Uso de z.coerce (coerciones silenciosas)
 * - Uso de any en contratos
 * - Validación fuera del orquestador
 * 
 * Regla Enterprise:
 * Si el contrato se rompe y CI no falla, el sistema está mal diseñado.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const CONTRACTS_DIR = path.join(ROOT, "src/lib/contracts");

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    return stat.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const files = walk(CONTRACTS_DIR);

let failed = false;
const errors = [];

// Patrones prohibidos
const FORBIDDEN_PATTERNS = [
  {
    pattern: /z\.coerce/,
    message: "Uso prohibido de z.coerce (coerciones silenciosas)",
  },
  {
    pattern: /:\s*any\b/,
    message: "Uso prohibido de 'any' en contratos",
  },
  {
    pattern: /as\s+any\b/,
    message: "Uso prohibido de 'as any' en contratos",
  },
];

// Verificar schemas tienen .strict()
for (const file of files) {
  if (!file.endsWith(".ts")) continue;

  const content = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(ROOT, file);

  // Verificar schemas tienen .strict()
  if (file.includes("schemas") && file.endsWith(".schema.ts")) {
    // Buscar definiciones de schema
    const hasSchemaDefinition = /export\s+(const|function)\s+\w+Schema\s*=/s.test(content);
    
    if (hasSchemaDefinition) {
      // Verificar que tiene .strict()
      if (!content.includes(".strict()")) {
        errors.push({
          file: relativePath,
          message: "Schema sin .strict() - campos extra no están prohibidos",
        });
        failed = true;
      }
    }
  }

  // Verificar patrones prohibidos
  for (const { pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      errors.push({
        file: relativePath,
        message: message,
      });
      failed = true;
    }
  }

  // Verificar que no hay validación directa fuera del orquestador
  // (excepto en validateRequest.ts y helpers especializados del sistema de contratos)
  const isContractHelper = 
    file.includes("validateRequest.ts") ||
    file.includes("validateQueryParams.ts") ||
    file.includes("validateRouteParams.ts") ||
    file.includes(".test.ts");
  
  if (
    !isContractHelper &&
    content.includes("schema.safeParse") &&
    !content.includes("validateRequest")
  ) {
    errors.push({
      file: relativePath,
      message: "Validación directa fuera del orquestador (usar validateRequest)",
    });
    failed = true;
  }
}

// Reportar errores
if (failed) {
  console.error("❌ Guard de contratos falló. Regresiones detectadas:\n");
  for (const { file, message } of errors) {
    console.error(`  - ${file}`);
    console.error(`    ${message}\n`);
  }
  console.error("💡 Corrección:");
  console.error("   - Agregar .strict() a todos los schemas");
  console.error("   - Eliminar z.coerce (usar transform explícito)");
  console.error("   - Eliminar 'any' (usar tipos explícitos)");
  console.error("   - Usar validateRequest() en lugar de validación directa");
  process.exit(1);
}

console.log("✅ guard:contracts passed");
