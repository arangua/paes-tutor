# ⚠️ PROBLEMAS DE BUILD DE PRODUCCIÓN

**Fecha:** 2025-01-28  
**Comando ejecutado:** `npm run build`  
**Estado:** ❌ **BUILD FALLA** - Requiere corrección antes de producción

---

## 🚨 ERRORES CRÍTICOS ENCONTRADOS

### 1. Variables Duplicadas en `note-versions.tsx`

**Error:**
```
the name `hasMoreVersions` is defined multiple times
the name `loadingMore` is defined multiple times
the name `nextCursor` is defined multiple times
```

**Ubicación:** `src/components/notes/note-versions.tsx` (líneas 117-121)

**Problema:** Variables de estado declaradas dos veces.

**Solución:** Eliminar las declaraciones duplicadas.

---

### 2. Módulos Faltantes (Opcionales pero causan warnings)

**Errores:**
- `@google/generative-ai` - No instalado (usado en `ai-service.ts`)
- `openai` - No instalado (usado en `ai-service.ts` y `embeddings.ts`)
- `@radix-ui/react-switch` - No instalado (usado en `switch.tsx`)

**Impacto:** ⚠️ MEDIO - Son imports dinámicos, no bloquean funcionalidad pero generan warnings.

**Solución:** 
- Instalar dependencias opcionales: `npm install @google/generative-ai openai @radix-ui/react-switch`
- O hacer los imports condicionales (ya están así, pero Next.js los detecta en build)

---

### 3. Export `FilePdf` No Existe en lucide-react

**Error:**
```
Export FilePdf doesn't exist in target module
Did you mean to import File?
```

**Ubicación:** `src/components/notes/note-versions.tsx` (línea 41)

**Problema:** `FilePdf` no existe en lucide-react, debería ser `File`.

**Solución:** Cambiar `FilePdf` por `File` o usar otro icono.

---

### 4. Export `authOptions` No Existe

**Error:**
```
Export authOptions doesn't exist in target module
Did you mean to import auth?
```

**Ubicación:** Múltiples archivos:
- `src/app/api/admission-calendar/route.ts`
- `src/app/api/careers/[id]/route.ts`
- `src/app/api/careers/route.ts`
- `src/app/api/score-transformation/route.ts`
- `src/app/api/statistics/route.ts`

**Problema:** NextAuth v5 cambió la API. `authOptions` ya no existe, se usa `auth` directamente.

**Solución:** Actualizar imports para usar la nueva API de NextAuth v5.

---

### 5. Export `getServerSession` No Existe

**Error:**
```
Export getServerSession doesn't exist in target module
```

**Ubicación:** Mismos archivos que el problema anterior.

**Problema:** En NextAuth v5, `getServerSession` se reemplaza por `auth()`.

**Solución:** Actualizar código para usar `auth()` en lugar de `getServerSession()`.

---

## 📋 CHECKLIST DE CORRECCIÓN

### Críticos (Deben corregirse):

- [ ] **Corregir variables duplicadas** en `note-versions.tsx`
- [ ] **Corregir import de FilePdf** → usar `File` o icono correcto
- [ ] **Actualizar imports de NextAuth** en 5 archivos:
  - [ ] `src/app/api/admission-calendar/route.ts`
  - [ ] `src/app/api/careers/[id]/route.ts`
  - [ ] `src/app/api/careers/route.ts`
  - [ ] `src/app/api/score-transformation/route.ts`
  - [ ] `src/app/api/statistics/route.ts`

### Opcionales (Pueden corregirse después):

- [ ] **Instalar dependencias opcionales** o hacer imports más condicionales
- [ ] **Verificar que build pasa** después de correcciones

---

## 🔧 SOLUCIONES RÁPIDAS

### 1. Corregir Variables Duplicadas

```typescript
// src/components/notes/note-versions.tsx
// Eliminar líneas duplicadas 117-121
// Mantener solo una declaración de cada variable
```

### 2. Corregir Import de FilePdf

```typescript
// Cambiar:
import { FilePdf } from 'lucide-react'

// Por:
import { File } from 'lucide-react'
// Y usar File en lugar de FilePdf
```

### 3. Actualizar NextAuth v5

```typescript
// Antes (NextAuth v4):
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
const session = await getServerSession(authOptions)

// Después (NextAuth v5):
import { auth } from '@/lib/auth'
const session = await auth()
```

---

## ⏱️ TIEMPO ESTIMADO DE CORRECCIÓN

- **Correcciones críticas:** 30-60 minutos
- **Verificación de build:** 10 minutos
- **Total:** 40-70 minutos

---

## ✅ VERIFICACIÓN POST-CORRECCIÓN

Después de corregir, ejecutar:

```bash
npm run build
```

Debe completarse sin errores (warnings opcionales están bien).

---

**Última actualización:** 2025-01-28  
**Prioridad:** 🔴 **CRÍTICA** - Bloquea despliegue a producción

