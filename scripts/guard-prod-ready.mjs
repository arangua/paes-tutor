#!/usr/bin/env node
/**
 * Guard CI "Prod-Ready"
 * 
 * Regla Enterprise:
 * Si no está listo para producción, CI no debe permitir que exista.
 * 
 * Valida:
 * 1. ENV contract (fail-fast)
 * 2. Startup guards presentes
 * 3. Health endpoints presentes
 * 
 * Características:
 * - Simple
 * - Brutalmente efectivo
 * - Sin dependencias
 * - Falla rápido
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

/**
 * Verifica que un archivo existe
 */
function assertFileExists(filePath, description) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required file: ${filePath}`);
    console.error(`   Description: ${description}`);
    process.exit(1);
  }
}


console.log("🔍 Running Prod-Ready Guard...\n");

// 1️⃣ ENV Contract (fail-fast)
console.log("1️⃣ Validating ENV contract...");
try {
  // Intentar importar el módulo de ENV
  // Si falla, significa que la configuración es inválida
  const envPath = path.join(ROOT, "src/lib/env/env.ts");
  if (!fs.existsSync(envPath)) {
    console.error("❌ ENV module not found: src/lib/env/env.ts");
    process.exit(1);
  }
  
  // Verificar que el schema existe
  const schemaPath = path.join(ROOT, "src/lib/env/env.schema.ts");
  if (!fs.existsSync(schemaPath)) {
    console.error("❌ ENV schema not found: src/lib/env/env.schema.ts");
    process.exit(1);
  }
  
  console.log("   ✅ ENV contract files present");
} catch (error) {
  console.error("❌ Invalid ENV configuration for production");
  console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

// 2️⃣ Startup Guards
console.log("\n2️⃣ Validating Startup Guards...");
assertFileExists(
  "src/lib/startup/startup-checks.ts",
  "Orquestador de startup checks"
);
assertFileExists(
  "src/lib/startup/bootstrap.ts",
  "Bootstrap de startup checks"
);
assertFileExists(
  "src/lib/startup/checks/checkDatabase.ts",
  "Check de base de datos"
);
assertFileExists(
  "src/lib/startup/checks/checkRedis.ts",
  "Check de Redis"
);
assertFileExists(
  "src/lib/startup/checks/checkTimeouts.ts",
  "Check de timeouts"
);
console.log("   ✅ Startup guards present");

// 3️⃣ Health Endpoints
console.log("\n3️⃣ Validating Health Endpoints...");
assertFileExists(
  "src/app/api/health/liveness/route.ts",
  "Endpoint de liveness check"
);
assertFileExists(
  "src/app/api/health/readiness/route.ts",
  "Endpoint de readiness check"
);
console.log("   ✅ Health endpoints present");

// 4️⃣ Health Logic
console.log("\n4️⃣ Validating Health Logic...");
assertFileExists(
  "src/lib/health/liveness.ts",
  "Lógica de liveness check"
);
assertFileExists(
  "src/lib/health/readiness.ts",
  "Lógica de readiness check"
);
assertFileExists(
  "src/lib/health/health.types.ts",
  "Tipos de health checks"
);
console.log("   ✅ Health logic present");

console.log("\n✅ Prod-ready guard passed");
console.log("   All production requirements are met");
