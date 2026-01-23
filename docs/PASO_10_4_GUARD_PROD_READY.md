# PASO 10.4 — Guard CI "Prod-Ready"

## 🎯 Objetivo

Que ningún build o deploy avance si no cumple condiciones mínimas de producción.

**Regla Enterprise:**
> Si no está listo para producción, CI no debe permitir que exista.

## ✅ Resultado Esperado

Al cerrar 10.4, se tiene:

- ✅ CI bloquea:
  - ENV incompleto o inválido
  - Startup Guards degradados
  - Health endpoints ausentes o rotos
- ✅ Guard rápido, determinista y explícito
- ✅ Ejecuta antes de build/deploy
- ✅ Documentado y congelado

## 📐 Estrategia

**Reutilizamos lo que ya existe:**
- ✅ ENV Contracts (10.1)
- ✅ Startup Guards (10.2)
- ✅ Health Checks (10.3)
- ✅ Guards previos (no-global-patches, contracts)

**👉 Sumamos un guard final de producción, no duplicamos lógica.**

## 🧩 Componentes del Guard "Prod-Ready"

### 1️⃣ ENV Obligatorio para Producción

**Qué valida:**
- ✅ Módulo de ENV existe (`src/lib/env/env.ts`)
- ✅ Schema de ENV existe (`src/lib/env/env.schema.ts`)
- ✅ Fail-fast al importar (validación automática)

**Cómo funciona:**
- Verifica que los archivos existen
- Si el módulo se importa y falla, el guard falla

### 2️⃣ Startup Guards Ejecutables

**Qué valida:**
- ✅ `src/lib/startup/startup-checks.ts` existe
- ✅ `src/lib/startup/bootstrap.ts` existe
- ✅ `src/lib/startup/checks/checkDatabase.ts` existe
- ✅ `src/lib/startup/checks/checkRedis.ts` existe
- ✅ `src/lib/startup/checks/checkTimeouts.ts` existe

**Cómo funciona:**
- Verifica que todos los archivos de startup guards están presentes
- No ejecuta los checks (eso es responsabilidad del runtime)
- Solo verifica que no fueron eliminados o "stubbed"

### 3️⃣ Health Endpoints Presentes

**Qué valida:**
- ✅ `src/app/api/health/liveness/route.ts` existe
- ✅ `src/app/api/health/readiness/route.ts` existe
- ✅ `src/lib/health/liveness.ts` existe
- ✅ `src/lib/health/readiness.ts` existe
- ✅ `src/lib/health/health.types.ts` existe

**Cómo funciona:**
- Verifica que los endpoints y su lógica están presentes
- No ejecuta los endpoints (eso es responsabilidad del runtime)
- Solo verifica que no fueron eliminados

## 🛠️ Implementación

### Script del Guard

**Archivo:** `scripts/guard-prod-ready.mjs`

**Características:**
- ✅ Simple
- ✅ Brutalmente efectivo
- ✅ Sin dependencias
- ✅ Falla rápido

**Ejemplo de salida exitosa:**
```
🔍 Running Prod-Ready Guard...

1️⃣ Validating ENV contract...
   ✅ ENV contract files present

2️⃣ Validating Startup Guards...
   ✅ Startup guards present

3️⃣ Validating Health Endpoints...
   ✅ Health endpoints present

4️⃣ Validating Health Logic...
   ✅ Health logic present

✅ Prod-ready guard passed
   All production requirements are met
```

**Ejemplo de fallo:**
```
🔍 Running Prod-Ready Guard...

1️⃣ Validating ENV contract...
   ✅ ENV contract files present

2️⃣ Validating Startup Guards...
❌ Missing required file: src/lib/startup/checks/checkDatabase.ts
   Description: Check de base de datos
```

### Integración en package.json

```json
{
  "scripts": {
    "guard:prod-ready": "node scripts/guard-prod-ready.mjs",
    "ci:check": "npm run guard:no-global-patches && npm run guard:contracts && npm run guard:prod-ready && npm run contracts:test && npm run test:run"
  }
}
```

## 🔗 Orden Final en CI (Congelado)

1. **Lint**
2. **Type check**
3. **`guard:no-global-patches`**
4. **`guard:contracts`**
5. **`guard:prod-ready`** ⬅️ NUEVO
6. **`contracts:test`**
7. **Unit tests**
8. **Coverage**

### Script Único

```bash
npm run ci:check
```

Este script ejecuta todos los guards en orden y falla rápido si alguno falla.

## 🚨 Qué Bloquea el Guard

### ❌ ENV Incompleto

**Ejemplo:**
```
❌ Missing required file: src/lib/env/env.schema.ts
   Description: ENV schema
```

**Causa:** Archivo eliminado o no creado.

**Solución:** Asegurar que el módulo de ENV está completo (PASO 10.1).

### ❌ Startup Guards Degradados

**Ejemplo:**
```
❌ Missing required file: src/lib/startup/checks/checkDatabase.ts
   Description: Check de base de datos
```

**Causa:** Archivo eliminado o no creado.

**Solución:** Asegurar que todos los startup guards están presentes (PASO 10.2).

### ❌ Health Endpoints Ausentes

**Ejemplo:**
```
❌ Missing required file: src/app/api/health/readiness/route.ts
   Description: Endpoint de readiness check
```

**Causa:** Archivo eliminado o no creado.

**Solución:** Asegurar que todos los health endpoints están presentes (PASO 10.3).

## 🔧 Cómo Extender

### Agregar Nueva Validación

1. **Agregar verificación en el script:**
```javascript
// scripts/guard-prod-ready.mjs
assertFileExists(
  "src/nuevo/archivo.ts",
  "Descripción del archivo"
);
```

2. **Actualizar documentación:**
- Agregar a la lista de validaciones
- Documentar qué bloquea

3. **Actualizar tests (si aplica):**
- Agregar test que verifica la nueva validación

## 📊 Comparación con Otros Guards

| Guard | Qué Valida | Cuándo Falla |
|-------|-----------|--------------|
| `guard:no-global-patches` | Sin parches globales | Patches detectados |
| `guard:contracts` | Contratos correctos | Regresiones contractuales |
| `guard:prod-ready` | Componentes de producción | Archivos faltantes |

## 🎯 Próximos Pasos

- **PASO 11:** Performance & UX Baseline

## 📚 Referencias

- [PASO 10.1 - ENV Contracts](./PASO_10_1_ENV_CONTRACTS.md)
- [PASO 10.2 - Startup Guards](./PASO_10_2_STARTUP_GUARDS.md)
- [PASO 10.3 - Health Checks](./PASO_10_3_HEALTH_CHECKS.md)
- [PASO 10 - Completado Final](./PASO_10_COMPLETADO_FINAL.md)

---

**Estado:** ✅ **Completado**  
**Fecha:** 2025-01-28
