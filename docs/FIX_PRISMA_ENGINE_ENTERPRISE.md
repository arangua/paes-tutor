# FIX ENTERPRISE CRÍTICO — Prisma Engine Type "client"

## 📋 Resumen

Se ha corregido el problema donde Prisma requería un `adapter` o `accelerateUrl` debido a la configuración `engineType = "client"` en el schema. Ahora Prisma usa el engine estándar de Node.js para PostgreSQL.

## ✅ Archivos Modificados

### 1. `prisma/schema.prisma`
- ❌ **Eliminado:** `engineType = "client"` del generator
- ✅ **Resultado:** Prisma usa engine estándar (no requiere adapter)

**ANTES:**
```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"  // ❌ Esto requería adapter
}
```

**AHORA:**
```prisma
generator client {
  provider = "prisma-client-js"  // ✅ Engine estándar
}
```

### 2. `src/lib/prisma.ts`
- ✅ **Verificado:** Ya estaba correcto (sin adapter, sin accelerateUrl)
- ✅ **Confirmado:** Usa `new PrismaClient()` estándar

**Código actual (correcto):**
```typescript
const client = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
})
// ✅ Sin adapter, sin accelerateUrl
```

### 3. `scripts/guard-prisma-engine.mjs` (NUEVO)
- ✅ **Creado:** Script guardrail que verifica:
  - No hay uso de adapters en código
  - No hay uso de Prisma Accelerate
  - PrismaClient se crea correctamente
  - Schema.prisma no tiene `engineType = "client"`

### 4. `package.json`
- ✅ **Agregado:** Script `guard:prisma` para ejecutar el guardrail
- ✅ **Agregado:** Script `ci:check` que incluye el guardrail

### 5. Scripts de importación
- ✅ **Verificado:** Todos usan `new PrismaClient()` sin adapters
  - `prisma/seed.ts`
  - `scripts/import-demre-exams.ts`
  - `scripts/import-sample-careers.ts`
  - `scripts/import-admission-calendar-2026.ts`

## 🔒 Guardrails Implementados

### Guardrail 1: Script Automático
**Archivo:** `scripts/guard-prisma-engine.mjs`

**Qué verifica:**
- ❌ `new PrismaClient({ adapter: ... })`
- ❌ `new PrismaClient({ accelerateUrl: ... })`
- ❌ `withAccelerate()`
- ❌ `@prisma/adapter-*` imports
- ❌ `@prisma/extension-accelerate` imports
- ⚠️ `engineType = "client"` en código (warning)

**Uso:**
```bash
npm run guard:prisma
```

**Integración:**
```bash
npm run ci:check  # Incluye guard:prisma
```

### Guardrail 2: Schema Validation
El guardrail también verifica que `schema.prisma`:
- ✅ No tiene `engineType = "client"` activo
- ✅ Usa `provider = "prisma-client-js"`

## 🧹 Limpieza Realizada

### 1. Caché de Prisma eliminada
```powershell
Remove-Item -Recurse -Force node_modules\.prisma
```

### 2. Prisma Client regenerado
```bash
npx prisma generate
```

**Resultado:**
- ✅ Prisma Client generado con engine estándar
- ✅ Sin dependencias de adapters
- ✅ Sin dependencias de Accelerate

## ✅ Verificación

### 1. Ejecutar guardrail
```bash
npm run guard:prisma
```

**Resultado esperado:**
```
✅ Todo correcto: Prisma usa engine estándar de Node
```

### 2. Verificar endpoints
```bash
# Terminal 1: Iniciar servidor
npm run dev:safe

# Terminal 2: Probar endpoints
curl http://localhost:3000/api/challenges
curl http://localhost:3000/api/flashcards
curl http://localhost:3000/api/review/quick
```

**Resultado esperado:**
- ✅ 200 (con auth) o 401 (sin auth)
- ❌ NO 500 por error de Prisma constructor

### 3. Verificar logs
En los logs del servidor, **NO debe aparecer:**
- ❌ `PrismaClientConstructorValidationError`
- ❌ `requires either "adapter" or "accelerateUrl"`
- ❌ `@prisma/adapter-*`
- ❌ `withAccelerate`

**Debe aparecer:**
- ✅ `[Prisma] Base de datos configurada (PostgreSQL): ...`
- ✅ `✓ Database check passed`

## 📝 Comandos Usados

```powershell
# 1. Limpiar caché de Prisma
Remove-Item -Recurse -Force node_modules\.prisma

# 2. Regenerar Prisma Client
npx prisma generate

# 3. Ejecutar guardrail
npm run guard:prisma

# 4. Verificar endpoints (después de iniciar servidor)
curl http://localhost:3000/api/challenges
curl http://localhost:3000/api/flashcards
curl http://localhost:3000/api/review/quick
```

## 🎯 Resultado Final

**ANTES:**
- ❌ `engineType = "client"` requería adapter
- ❌ Error: "requires either adapter or accelerateUrl"
- ❌ Endpoints fallaban con 500

**AHORA:**
- ✅ Engine estándar de Node.js
- ✅ Sin errores de constructor
- ✅ Endpoints funcionan correctamente
- ✅ Guardrails previenen problemas futuros

## 🔄 Integración en CI/CD

El guardrail está integrado en `npm run ci:check`:

```json
{
  "scripts": {
    "guard:prisma": "node scripts/guard-prisma-engine.mjs",
    "ci:check": "npm run guard:prisma && npm run lint:critical && npm run test:run"
  }
}
```

Esto asegura que:
1. Prisma está configurado correctamente
2. Linting crítico pasa
3. Tests pasan

## 📋 Checklist de Verificación

- [x] `prisma/schema.prisma` no tiene `engineType = "client"`
- [x] `src/lib/prisma.ts` usa `new PrismaClient()` sin adapters
- [x] Scripts de importación usan `new PrismaClient()` sin adapters
- [x] Guardrail creado y funcionando
- [x] Caché de Prisma limpiada
- [x] Prisma Client regenerado
- [x] Endpoints funcionan (200/401, no 500)
- [x] Logs no muestran errores de constructor
- [x] `npm run guard:prisma` pasa sin errores

## 🚨 Prevención Futura

### Reglas para el equipo:

1. **NO agregar `engineType = "client"` al schema.prisma**
   - Solo se usa con adapters (SQLite, etc.)
   - Para PostgreSQL estándar, no es necesario

2. **NO usar adapters en PrismaClient**
   - Para PostgreSQL, usar `new PrismaClient()` estándar
   - Adapters solo para casos especiales (SQLite, etc.)

3. **NO usar Prisma Accelerate sin configuración explícita**
   - Si se necesita, debe ser una decisión consciente del equipo
   - Debe documentarse y configurarse apropiadamente

4. **Ejecutar guardrail antes de commits**
   - `npm run guard:prisma` debe pasar
   - Integrado en `npm run ci:check`

## 📚 Referencias

- [Prisma Client Constructor](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#constructor)
- [Prisma Engine Types](https://www.prisma.io/docs/concepts/components/prisma-client/engine-types)
- [Prisma Accelerate](https://www.prisma.io/docs/accelerate)
