# ✅ Paso 8.4: Guard CI de Contratos

## 🎯 Objetivo

Garantizar que ninguna ruptura contractual llegue a `main` sin que CI falle primero.

## 📐 Regla Enterprise

> **Si el contrato se rompe y CI no falla, el sistema está mal diseñado.**

## 🔒 Estrategia de Guard (3 Capas)

### **Capa 1: Tests Contractuales Obligatorios**

**Script:** `npm run contracts:test`

**Qué protege:**
- ✅ Invariantes contractuales
- ✅ Validación de schemas
- ✅ Parsers correctos
- ✅ Orquestador funcionando

**Características:**
- 📌 Corre solo los tests contractuales
- 📌 Rápido
- 📌 Sin ruido

### **Capa 2: Guard Estructural (Anti-Regresión)**

**Script:** `npm run guard:contracts`

**Qué detecta:**
- ❌ Eliminación de `.strict()` en schemas
- ❌ Uso de `z.coerce` (coerciones silenciosas)
- ❌ Uso de `any` en contratos
- ❌ Validación fuera del orquestador

**Características:**
- 📌 Simple
- 📌 Brutalmente efectivo
- 📌 Cero dependencias
- 📌 Determinista

### **Capa 3: Integración en CI**

**Orden en CI:**
1. Lint
2. Type check
3. `guard:no-global-patches`
4. **`guard:contracts`** ⬅️ NUEVO
5. **`contracts:test`** ⬅️ NUEVO
6. Unit tests generales
7. Coverage

**Script único:** `npm run ci:check`

## 📋 Implementación

### **1. Guard Estructural**

**Archivo:** `scripts/guard-contracts.mjs`

**Detecta:**
- Schemas sin `.strict()`
- Uso de `z.coerce`
- Uso de `any` en contratos
- Validación directa fuera del orquestador

**Ejemplo de error:**
```
❌ Guard de contratos falló. Regresiones detectadas:

  - src/lib/contracts/schemas/create-note.schema.ts
    Schema sin .strict() - campos extra no están prohibidos

  - src/lib/contracts/http/parseFormData.ts
    Uso prohibido de 'any' en contratos
```

### **2. Scripts en package.json**

```json
{
  "scripts": {
    "guard:contracts": "node ./scripts/guard-contracts.mjs",
    "contracts:test": "vitest run src/lib/contracts",
    "ci:check": "npm run guard:no-global-patches && npm run guard:contracts && npm run contracts:test && npm run test:run"
  }
}
```

### **3. Workflow CI**

**Archivo:** `.github/workflows/ci.yml`

**Orden de ejecución:**
```yaml
- name: Run guard:no-global-patches
  run: npm run guard:no-global-patches

- name: Run guard:contracts
  run: npm run guard:contracts
  # ✅ Enterprise: Verifica que los contratos no se degraden

- name: Run contract tests
  run: npm run contracts:test
  # ✅ Enterprise: Ejecuta tests de ruptura contractual

- name: Run unit tests
  run: npm run test:run
```

## 🔒 Qué Protege el Guard

### **1. Schemas con .strict()**

**Prohibido:**
```typescript
// ❌ MAL
export const MySchema = z.object({
  name: z.string(),
})
```

**Requerido:**
```typescript
// ✅ BIEN
export const MySchema = z.object({
  name: z.string(),
}).strict()
```

### **2. Sin z.coerce**

**Prohibido:**
```typescript
// ❌ MAL
z.coerce.number() // Coerción silenciosa
```

**Requerido:**
```typescript
// ✅ BIEN
z.string().transform((val) => {
  const num = parseInt(val, 10)
  if (isNaN(num)) throw new Error('Invalid number')
  return num
})
```

### **3. Sin any**

**Prohibido:**
```typescript
// ❌ MAL
function validate(input: any) { ... }
const data: any = ...
```

**Requerido:**
```typescript
// ✅ BIEN
function validate<T>(input: unknown, schema: ZodSchema<T>): T { ... }
const data: CreateNoteInput = ...
```

### **4. Validación Solo en Orquestador**

**Prohibido:**
```typescript
// ❌ MAL (en cualquier archivo excepto validateRequest.ts)
const result = schema.safeParse(data)
```

**Requerido:**
```typescript
// ✅ BIEN
const result = validateRequest({ schema, input: data })
```

## 🚨 Cómo Falla CI (Ejemplos)

### **Ejemplo 1: Schema sin .strict()**

```typescript
// src/lib/contracts/schemas/my-schema.schema.ts
export const MySchema = z.object({
  name: z.string(),
}) // ❌ Falta .strict()
```

**CI Output:**
```
❌ Guard de contratos falló. Regresiones detectadas:

  - src/lib/contracts/schemas/my-schema.schema.ts
    Schema sin .strict() - campos extra no están prohibidos
```

**CI Status:** ❌ Failed

### **Ejemplo 2: Uso de z.coerce**

```typescript
// src/lib/contracts/schemas/my-schema.schema.ts
export const MySchema = z.object({
  age: z.coerce.number(), // ❌ Prohibido
})
```

**CI Output:**
```
❌ Guard de contratos falló. Regresiones detectadas:

  - src/lib/contracts/schemas/my-schema.schema.ts
    Uso prohibido de z.coerce (coerciones silenciosas)
```

**CI Status:** ❌ Failed

### **Ejemplo 3: Validación Directa**

```typescript
// src/lib/contracts/http/parseFormData.ts
const result = schema.safeParse(data) // ❌ Validación directa
```

**CI Output:**
```
❌ Guard de contratos falló. Regresiones detectadas:

  - src/lib/contracts/http/parseFormData.ts
    Validación directa fuera del orquestador (usar validateRequest)
```

**CI Status:** ❌ Failed

## 🔧 Cómo Extender el Guard

### **Agregar Nuevo Patrón Prohibido**

En `scripts/guard-contracts.mjs`:

```javascript
const FORBIDDEN_PATTERNS = [
  // ... patrones existentes
  {
    pattern: /nuevo-patron-prohibido/,
    message: "Mensaje de error descriptivo",
  },
];
```

### **Agregar Nueva Verificación**

```javascript
// Verificar nueva regla
if (nuevaCondicion) {
  errors.push({
    file: relativePath,
    message: "Nueva regla violada",
  });
  failed = true;
}
```

## 📊 Resultado Esperado

Al cerrar este paso:

- ✅ **El pipeline CI garantiza** que los contratos sigan siendo estrictos
- ✅ **Ningún schema puede perder** `.strict()` sin CI rojo
- ✅ **El orquestador no se debilita** (validación centralizada)
- ✅ **El guard corre antes** de cualquier build / deploy
- ✅ **El guard es determinista, rápido y explícito**
- ✅ **Documentado y congelado**

## 🏁 Cierre Formal del Paso 8

Cuando esto esté en verde:

- ✅ **Datos inválidos no pueden entrar** (validación antes de lógica)
- ✅ **Contratos no pueden degradarse** (guard estructural)
- ✅ **CI es el guardián real** (tests + guard)
- ✅ **Patrón replicable** a todo el sistema
- ✅ **Base sólida** para Paso 9

## 📋 Checklist de Implementación

- [x] ✅ Guard estructural implementado (`guard-contracts.mjs`)
- [x] ✅ Script `contracts:test` agregado
- [x] ✅ Script `guard:contracts` agregado
- [x] ✅ Script `ci:check` actualizado
- [x] ✅ Workflow CI actualizado
- [x] ✅ Documentación completa

## 🚀 Uso

### **Local:**
```bash
# Ejecutar guard estructural
npm run guard:contracts

# Ejecutar tests de contratos
npm run contracts:test

# Ejecutar todos los guards
npm run ci:check
```

### **CI:**
Los guards se ejecutan automáticamente en cada push/PR.

---

**Fecha:** 2026-01-10  
**Estado:** ✅ Guard CI implementado y documentado  
**Próximo:** Paso 9 (si aplica)
