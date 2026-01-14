# PASO 11.3 — Guards de Regresión (Performance & UX)

## 🎯 Objetivo

Impedir que cualquier PR degrade performance o UX sin que CI lo detecte.

**Regla Enterprise:**
> Toda mejora sin guard es deuda futura.

## ✅ Resultado Esperado

Al cerrar 11.3, se tiene:

- ✅ Guards automáticos que:
  - Detectan degradación de performance
  - Detectan violaciones de UX técnica
- ✅ CI falla cuando se rompe el baseline
- ✅ Señales claras (qué, cuánto, dónde)
- ✅ Sin flakiness
- ✅ Rápidos (no e2e pesados)

## 📐 Estrategia

**Reutilizamos mediciones internas + tests deterministas.**
**Nada de Lighthouse en CI.**

### Capas de Guard

1. **Performance** (server/client)
2. **UX técnica** (estados obligatorios)
3. **Arquitectura UX** (anti-patterns)

## 🧩 Componentes del Guard

### 1. Guard de Performance

**Archivo:** `src/lib/performance/performance.guard.test.ts`

**Qué protege:**
- ✅ API normal / crítica
- ✅ SSR
- ✅ Utilidades de medición

**Cómo:**
- Tests que comparan `measurement.duration` vs baseline
- Falla explícita si `!meetsBaseline`

**Ejemplo:**
```typescript
it('API response debe cumplir con baseline (< 500ms)', async () => {
  const { measurement } = await measurePerformance('api_response', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return { status: 200, data: 'test' }
  })

  expect(measurement.meetsBaseline).toBe(true)
  expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS)
})
```

### 2. Guard de UX Técnica

**Archivo:** `src/components/ux/ux.guard.test.tsx`

**Qué protege:**
- ✅ Uso obligatorio de UXBoundary
- ✅ Estados explícitos
- ✅ Prioridad correcta de estados

**Cómo:**
- Tests de componentes
- Asserts semánticos

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

### 3. Guard Estructural (Anti-patterns UX)

**Archivo:** `scripts/guard-ux-patterns.mjs`

**Qué detecta:**
- ❌ `data && <Component />` - Render condicional implícito
- ❌ `isLoading && <Spinner />` - Loading sin UXBoundary
- ❌ `error && <p>Error</p>` - Error sin ErrorState
- ❌ `if (!data) return null` - Pantalla en blanco
- ❌ `catch () {}` - Try/catch silencioso

**Cómo:**
- Script estático (regex controlado)
- Falla rápido
- Sin dependencias

**Ejemplo de salida:**
```
❌ UX anti-patterns detected:

  📄 src/app/dashboard/page.tsx
     Render condicional implícito - usar UXBoundary
     ❌ {data && <Component />}
     ✅ <UXBoundary isEmpty={!data}><Component /></UXBoundary>
```

## 🔁 Integración en CI

### Scripts en package.json

```json
{
  "scripts": {
    "guard:ux": "node scripts/guard-ux-patterns.mjs",
    "ci:check": "npm run guard:no-global-patches && npm run guard:contracts && npm run guard:prod-ready && npm run guard:ux && npm run contracts:test && npm run test:run"
  }
}
```

### Orden en CI (Congelado)

1. **Lint**
2. **Type check**
3. **`guard:no-global-patches`**
4. **`guard:contracts`**
5. **`guard:prod-ready`**
6. **`guard:ux`** ⬅️ NUEVO
7. **`contracts:test`**
8. **Unit tests** (incluye performance.guard.test.ts y ux.guard.test.tsx)
9. **Coverage**

**📌 El guard UX corre antes de tests largos**
**📌 Falla rápido**

## 🧪 Tests de Guards

### Performance Guard Tests

**Ejecutar:**
```bash
npm test src/lib/performance/performance.guard.test.ts
```

**Cobertura:**
- ✅ API response time
- ✅ API crítica time
- ✅ Database query time
- ✅ SSR time
- ✅ Client performance (hydration, render)
- ✅ Regression detection

### UX Guard Tests

**Ejecutar:**
```bash
npm test src/components/ux/ux.guard.test.tsx
```

**Cobertura:**
- ✅ Estados obligatorios
- ✅ Prioridad de estados
- ✅ Contratos de componentes
- ✅ Sin stack traces en errores

### Guard Estructural

**Ejecutar:**
```bash
npm run guard:ux
```

**Cobertura:**
- ✅ Anti-patterns de render condicional
- ✅ Anti-patterns de loading
- ✅ Anti-patterns de error
- ✅ Pantallas en blanco
- ✅ Try/catch silenciosos

## 📊 Qué Protege Cada Guard

| Guard | Qué Protege | Cómo Falla |
|-------|------------|------------|
| **Performance Guard** | Umbrales de performance | Test falla si `!meetsBaseline` |
| **UX Guard** | Estados obligatorios | Test falla si viola contrato |
| **UX Patterns Guard** | Anti-patterns estructurales | Script falla si detecta patrón |

## 🔧 Cómo Extender

### Agregar Nuevo Umbral de Performance

1. **Agregar al baseline:**
```typescript
// src/lib/performance/baseline.ts
export const SERVER_BASELINE = {
  // ... existentes
  NEW_METRIC_MAX_TIME_MS: 300,
}
```

2. **Agregar test de guard:**
```typescript
// src/lib/performance/performance.guard.test.ts
it('nueva métrica debe cumplir con baseline', async () => {
  const { measurement } = await measurePerformance('new_metric', async () => {
    // ...
  })
  expect(measurement.meetsBaseline).toBe(true)
})
```

### Agregar Nuevo Anti-pattern

1. **Agregar patrón al guard:**
```javascript
// scripts/guard-ux-patterns.mjs
const FORBIDDEN_PATTERNS = [
  // ... existentes
  {
    pattern: /nuevo-patron-prohibido/,
    message: 'Descripción del problema',
    example: '❌ Código malo',
    fix: '✅ Código bueno',
  },
]
```

## 📋 Próximos Pasos

- **PASO 11.4:** Congelación y Documentación

## 📚 Referencias

- [Performance Baseline](./PASO_11_1_PERFORMANCE_BASELINE.md)
- [UX Baseline](./PASO_11_2_UX_BASELINE.md)
- [Performance Guard Tests](../src/lib/performance/performance.guard.test.ts)
- [UX Guard Tests](../src/components/ux/ux.guard.test.tsx)
- [UX Patterns Guard](../scripts/guard-ux-patterns.mjs)

---

**Estado:** ✅ **Completado**  
**Fecha:** 2025-01-28
