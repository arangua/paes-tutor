# Diagnóstico de Causas - Prisma Engine Type "client"

## 🔍 Causas Probables (99%)

### Causa A: `previewFeatures = ["driverAdapters"]` en schema.prisma

**Cómo se ve:**
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  // ❌ Esto fuerza engine "client"
}
```

**Efecto:**
- Prisma pasa a engine "client"
- Exige `adapter` o `accelerateUrl` en PrismaClient constructor
- Error: `Using engine type "client" requires either "adapter" or "accelerateUrl"`

**Solución:**
```prisma
generator client {
  provider = "prisma-client-js"
  // ✅ Remover previewFeatures = ["driverAdapters"]
}
```

**Verificación:**
```bash
grep -n "driverAdapters" prisma/schema.prisma
# No debe encontrar nada
```

---

### Causa B: Import desde `@prisma/client/edge`

**Cómo se ve:**
```typescript
// ❌ INCORRECTO
import { PrismaClient } from "@prisma/client/edge"
```

**Efecto:**
- Edge Client también exige `adapter` o `accelerateUrl`
- Mismo error de constructor

**Solución:**
```typescript
// ✅ CORRECTO
import { PrismaClient } from "@prisma/client"
```

**Verificación:**
```bash
grep -n "@prisma/client/edge" src/**/*.ts scripts/**/*.ts
# No debe encontrar nada
```

---

### Causa C: Wiring de Accelerate/adapter parcial

**Cómo se ve:**
```typescript
// Hay referencia a accelerate/adapter pero no está completo
import { withAccelerate } from '@prisma/extension-accelerate'
// Pero falta: const prisma = new PrismaClient().$extends(withAccelerate())
```

**Efecto:**
- Referencia parcial causa confusión
- Puede activar validaciones de Prisma

**Solución:**
- Remover todas las referencias a Accelerate/adapter si no se usan
- O completar la configuración si se necesita

**Verificación:**
```bash
grep -rn "accelerate\|adapter" src/ scripts/ --include="*.ts" --include="*.tsx"
# Revisar cada ocurrencia
```

---

## ✅ Verificación Completa

### 1. Verificar schema.prisma

```bash
# Verificar previewFeatures
grep -n "previewFeatures\|driverAdapters" prisma/schema.prisma

# Verificar engineType
grep -n "engineType" prisma/schema.prisma

# Resultado esperado: Nada (o solo comentarios)
```

### 2. Verificar imports de PrismaClient

```bash
# Buscar imports desde edge
grep -rn "@prisma/client/edge" src/ scripts/ prisma/

# Resultado esperado: Nada
```

### 3. Verificar referencias a Accelerate/adapter

```bash
# Buscar referencias
grep -rn "accelerate\|Accelerate\|withAccelerate\|@prisma/adapter" src/ scripts/ --include="*.ts" --include="*.tsx"

# Resultado esperado: Solo en documentación o comentarios
```

### 4. Ejecutar guardrail

```bash
npm run guard:prisma
```

**Resultado esperado:**
```
✅ Todo correcto: Prisma usa engine estándar de Node
```

---

## 🔧 Fixes Aplicados

### ✅ Fix 1: Schema.prisma
- ❌ Removido: `engineType = "client"`
- ✅ Verificado: No hay `previewFeatures = ["driverAdapters"]`

### ✅ Fix 2: Imports
- ✅ Verificado: Todos los imports usan `@prisma/client` (no `/edge`)

### ✅ Fix 3: Guardrail Actualizado
- ✅ Detecta `previewFeatures = ["driverAdapters"]`
- ✅ Detecta imports desde `@prisma/client/edge`
- ✅ Detecta referencias a Accelerate/adapter

---

## 📋 Checklist de Diagnóstico

Si aún tienes el error, verifica:

- [ ] `prisma/schema.prisma` NO tiene `previewFeatures = ["driverAdapters"]`
- [ ] `prisma/schema.prisma` NO tiene `engineType = "client"`
- [ ] Todos los imports usan `@prisma/client` (no `/edge`)
- [ ] No hay referencias parciales a Accelerate/adapter
- [ ] `npm run guard:prisma` pasa sin errores
- [ ] Caché de Prisma limpiada: `rm -r node_modules/.prisma`
- [ ] Prisma Client regenerado: `npx prisma generate`

---

## 🚨 Si el Error Persiste

### Paso 1: Limpieza Completa

```powershell
# Limpiar todo
Remove-Item -Recurse -Force node_modules\.prisma
Remove-Item -Recurse -Force .next
npx prisma generate
```

### Paso 2: Verificar Variables de Entorno

```powershell
# Verificar que no hay variables de Accelerate
Get-Content .env.local | Select-String "ACCELERATE"
# No debe encontrar nada
```

### Paso 3: Verificar package.json

```powershell
# Verificar dependencias
Get-Content package.json | Select-String "accelerate\|adapter"
# Solo debe aparecer @prisma/adapter-better-sqlite3 (que no se usa)
```

### Paso 4: Debugging

```typescript
// Agregar logging temporal en src/lib/prisma.ts
console.log('[DEBUG] PrismaClient constructor:', {
  hasAdapter: false,
  hasAccelerateUrl: false,
  engineType: 'standard', // No "client"
})
```

---

## 📚 Referencias

- [Prisma Driver Adapters](https://www.prisma.io/docs/concepts/components/prisma-client/driver-adapters)
- [Prisma Edge Client](https://www.prisma.io/docs/concepts/components/prisma-client/edge)
- [Prisma Accelerate](https://www.prisma.io/docs/accelerate)
