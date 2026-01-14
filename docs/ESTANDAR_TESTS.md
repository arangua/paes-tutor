# 📋 Estándar de Tests - Enterprise

## 🎯 Objetivo

Establecer un estándar claro y consistente para la ubicación y naming de tests, facilitando la comprensión y mantenimiento del código.

## 📁 Estructura de Tests

### **1. Tests de Componentes UI (Base)**

**Ubicación:** `src/components/ui/*.test.tsx`

**Ejemplos:**
- `src/components/ui/input.test.tsx`
- `src/components/ui/textarea.test.tsx`
- `src/components/ui/select-trigger.test.tsx`

**Propósito:** Tests para componentes UI base reutilizables.

### **2. Tests de Componentes Forms (Wrappers)**

**Ubicación:** `src/components/forms/*.test.tsx`

**Ejemplos:**
- `src/components/forms/field-input.test.tsx`
- `src/components/forms/field-textarea.test.tsx`

**Propósito:** Tests para componentes Field que requieren `name` obligatorio.

### **3. Type Contract Tests**

**Ubicación:** `src/components/forms/*.types.test-d.ts`

**Ejemplos:**
- `src/components/forms/field-input.types.test-d.ts`
- `src/components/forms/field-textarea.types.test-d.ts`

**Propósito:** Verificar contratos de tipos TypeScript (no se ejecutan, solo verifican tipos).

## 📋 Convenciones de Naming

### **Tests de Runtime:**
- Patrón: `{component-name}.test.tsx`
- Ejemplo: `field-input.test.tsx`

### **Tests de Type Contract:**
- Patrón: `{component-name}.types.test-d.ts`
- Ejemplo: `field-input.types.test-d.ts`

## ✅ Checklist de Consistencia

Al crear un nuevo test, verifica:

- [ ] ¿Está en la ubicación correcta según el tipo de componente?
- [ ] ¿Sigue el patrón de naming establecido?
- [ ] ¿Si es un componente Field, tiene type contract test?
- [ ] ¿El test está en el mismo directorio que el componente?

## 🔍 Verificación Rápida

**Comando para verificar estructura:**
```bash
# Ver todos los tests de UI
find src/components/ui -name "*.test.tsx"

# Ver todos los tests de Forms
find src/components/forms -name "*.test.tsx"

# Ver todos los type contracts
find src/components/forms -name "*.types.test-d.ts"
```

## 📊 Estado Actual

### **Tests UI:**
- ✅ `src/components/ui/input.test.tsx`
- ✅ `src/components/ui/textarea.test.tsx`
- ✅ `src/components/ui/select-trigger.test.tsx`

### **Tests Forms:**
- ✅ `src/components/forms/field-input.test.tsx`
- ✅ `src/components/forms/field-textarea.test.tsx`

### **Type Contracts:**
- ✅ `src/components/forms/field-input.types.test-d.ts`
- ✅ `src/components/forms/field-textarea.types.test-d.ts`

## 🛡️ Regression Guards

### **4. Performance Regression Guards**

**Ubicación:** `src/lib/performance/performance.guard.test.ts`

**Propósito:** Detectar degradación de performance antes de que llegue a producción.

**Qué protege:**
- ✅ API response time (< 500ms)
- ✅ API crítica time (< 200ms)
- ✅ Database query time (< 100ms)
- ✅ SSR time (< 1000ms)
- ✅ Client performance (hydration, render)

**Ejemplo:**
```typescript
it('API response debe cumplir con baseline (< 500ms)', async () => {
  const { measurement } = await measurePerformance('api_response', async () => {
    // Operación
  })
  expect(measurement.meetsBaseline).toBe(true)
})
```

### **5. UX Técnica Regression Guards**

**Ubicación:** `src/components/ux/ux.guard.test.tsx`

**Propósito:** Validar uso correcto de componentes UX y detectar violaciones de estados obligatorios.

**Qué protege:**
- ✅ Uso obligatorio de UXBoundary
- ✅ Estados explícitos (loading, empty, error)
- ✅ Prioridad correcta de estados
- ✅ Contratos de componentes

**Ejemplo:**
```typescript
it('nunca renderiza pantalla en blanco', () => {
  render(
    <UXBoundary isLoading={false} isEmpty={false}>
      <div>content</div>
    </UXBoundary>
  )
  expect(screen.getByText('content')).toBeInTheDocument()
})
```

### **6. Guards Estructurales (Anti-patterns)**

**Ubicación:** `scripts/guard-ux-patterns.mjs`

**Propósito:** Detectar anti-patterns estructurales antes de tests.

**Qué detecta:**
- ❌ Render condicional implícito (`data && <Component />`)
- ❌ Pantalla en blanco (`if (!data) return null`)
- ❌ Loading sin UXBoundary
- ❌ Error sin ErrorState
- ❌ Try/catch silencioso

**Ejecutar:**
```bash
npm run guard:ux
```

## 🧪 Tests de API Routes

### **Patrón Auth Mock First**

**Requisito:** En tests de API routes que requieren autenticación, el mock de auth DEBE importarse ANTES del route handler.

**Ejemplo:**
```typescript
// @vitest-environment node
// ✅ IMPORTANTE: Importar el mock ANTES del route
import '@/app/api/challenges/__tests__/auth-mock'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from './route' // ← Route importado DESPUÉS del mock
```

**Por qué:** Si el mock se importa después del route, Vitest ya "cableó" el route al módulo real y el mock no tiene efecto, resultando en 401 "No autorizado" en todos los tests.

**Guard automático:** `guard:auth-mock-first` verifica este patrón y falla el CI si se viola.

### **Requisito: `// @vitest-environment node` para tests de routes**

**Requisito:** Todos los tests de API routes DEBEN tener `// @vitest-environment node` en la primera línea del archivo. **Enforced by `guard:route-tests-node-env`.**

**Ejemplo:**
```typescript
// @vitest-environment node
// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'
```

**Por qué:** Los tests de routes necesitan Request/Response reales de Node (undici), no los de happy-dom. Sin esto, `request.json()` y `request.text()` pueden fallar o retornar datos vacíos.

**Guard automático:** `guard:route-tests-node-env` verifica que todos los archivos `src/app/api/**/route.test.ts` tengan esta directiva y falla el CI si falta.

**Configuración global:** `vitest.config.ts` tiene `environment: 'jsdom'` global con `environmentMatchGlobs` para routes, pero el comentario en el archivo anula cualquier configuración y garantiza el entorno correcto.

### **Patrón: Raw Body Cache con Symbol**

**Requisito:** Los helpers `createTestRequest` deben cachear el body usando `Symbol.for("test.rawBody")` para evitar pérdida de datos al leer el body múltiples veces.

**Implementación:**
```typescript
// En createTestRequest
const BODY_SYMBOL = Symbol.for("test.rawBody")
if (bodyString) {
  ;(request as any)[BODY_SYMBOL] = bodyString
  ;(request as any)._bodyText = bodyString // Compatibilidad
}
```

**Por qué:** `request.json()` consume el stream y no está disponible en segundo acceso. El símbolo permite leer el body sin depender de implementaciones internas.

### **Nota: No usar flags locales para estabilizar tests**

**Prohibido:** No usar flags como `--runInBand`, `--no-threads`, o variables de entorno locales para hacer que los tests pasen. Si un test requiere flags especiales para funcionar, el problema está en el test, no en la configuración.

**Solución:** Corregir el test para que funcione con la configuración estándar de Vitest.

## 🔗 Orden CI Congelado

**Script:** `npm run ci:check`

**Orden inmutable:**
1. `guard:prisma` ⬅️ Prisma engine configuration
2. `guard:no-global-patches` ⬅️ No global patches
3. `guard:auth-mock-first` ⬅️ Auth Mock First
4. `guard:route-tests-node-env` ⬅️ Node Environment para routes
5. `guard:no-hardcoded-secrets` ⬅️ No hardcoded secrets
6. `guard:ci-clean-output` ⬅️ CI Clean Output + Warning Budget
7. `guard:contracts` ⬅️ Contracts validation
8. `guard:prod-ready` ⬅️ Production readiness
9. `guard:ux` ⬅️ Performance & UX
10. `contracts:test` ⬅️ Contract tests
11. `lint:critical` ⬅️ Critical linting
12. `test:run` ⬅️ Unit tests (incluye `performance.guard.test.ts` y `ux.guard.test.tsx`)

**Criterios de "CI rojo":**
- ❌ Cualquier guard falla
- ❌ Test de performance falla (`!meetsBaseline`)
- ❌ Test de UX falla (violación de contrato)
- ❌ Coverage cae por debajo del umbral

---

**Última actualización:** 2025-01-28  
**Estado:** ✅ Estándar establecido y documentado
