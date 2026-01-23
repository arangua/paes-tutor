# Extensión Segura - Checklist

## 🎯 Objetivo

Procedimientos para extender el sistema sin romper baseline, contratos o guards.

**Regla Enterprise:**
> Toda extensión debe mantener o mejorar el baseline.

## 📋 Checklist de Extensión

### 1. Agregar Nuevo Endpoint

#### ✅ Pre-requisitos

- [ ] Endpoint tiene contrato definido (schema Zod)
- [ ] Endpoint tiene validación (validateRequest)
- [ ] Endpoint tiene manejo de errores tipado

#### ✅ Performance

- [ ] Endpoint cumple con baseline de API (< 500ms)
- [ ] Si es crítico, cumple con baseline crítico (< 200ms)
- [ ] Query a DB cumple con baseline (< 100ms simple, < 500ms compleja)
- [ ] Test de performance agregado en `performance.guard.test.ts`

#### ✅ UX

- [ ] Página usa UXBoundary para estados
- [ ] Loading aparece después de 200ms
- [ ] Error tiene acción de recuperación
- [ ] Empty state tiene mensaje claro

#### ✅ Guards

- [ ] `guard:contracts` pasa
- [ ] `guard:ux` pasa
- [ ] `guard:prod-ready` pasa

**Ejemplo:**
```typescript
// 1. Crear endpoint con contrato
// src/app/api/nuevo-endpoint/route.ts
import { validateRequest } from '@/lib/contracts'
import { createEndpointSchema } from './schema'

export async function GET(request: NextRequest) {
  const { input } = await validateRequest({
    schema: createEndpointSchema,
    input: await request.json(),
  })
  
  // 2. Medir performance
  const { result, measurement } = await measurePerformance('api_response', async () => {
    // Lógica
  })
  
  // 3. Validar baseline
  if (!measurement.meetsBaseline) {
    logger.warn('Performance degraded', { measurement })
  }
  
  return NextResponse.json(result)
}
```

### 2. Cambiar Umbral de Performance

#### ⚠️ Requiere RFC

- [ ] RFC creado con justificación técnica
- [ ] Impacto medido y documentado
- [ ] Aprobación de arquitecto/tech lead

#### ✅ Implementación

- [ ] Actualizar baseline en `src/lib/performance/baseline.ts`
- [ ] Actualizar tests en `performance.guard.test.ts`
- [ ] Validar que todos los tests pasan
- [ ] Documentar cambio en RFC

**Ejemplo:**
```typescript
// src/lib/performance/baseline.ts
export const SERVER_BASELINE = {
  // RFC-001: Aumentar umbral de API normal a 600ms
  // Justificación: Operaciones complejas requieren más tiempo
  // Impacto: Medido en producción, 95% de requests < 600ms
  API_MAX_RESPONSE_TIME_MS: 600, // ⬅️ Cambio
} as const
```

### 3. Introducir Excepción Temporal

#### ⚠️ Requiere Justificación

- [ ] Razón técnica clara documentada
- [ ] Plan de corrección definido
- [ ] Timeline establecido
- [ ] Test que valida la excepción

#### ✅ Implementación

- [ ] Comentario en código con razón
- [ ] Test que valida la excepción
- [ ] Test que valida plan de corrección
- [ ] Issue/ticket creado para seguimiento

**Ejemplo:**
```typescript
// EXCEPCIÓN TEMPORAL: Operación compleja requiere más tiempo
// RAZÓN: Migración de datos en progreso
// FECHA: 2025-01-28
// PLAN: Optimizar query después de migración (2025-02-15)
// TODO: Remover después de 2025-02-15
// ISSUE: #123
const { measurement } = await measurePerformance('api_response', async () => {
  // Operación que puede exceder baseline temporalmente
})

// Test que valida excepción
expect(measurement.duration).toBeLessThan(1000) // Umbral temporal
```

### 4. Agregar Nueva Métrica

#### ✅ Implementación

- [ ] Agregar tipo en `PerformanceMetric`
- [ ] Agregar umbral en baseline correspondiente
- [ ] Agregar función `getBaselineThreshold`
- [ ] Agregar test en `performance.guard.test.ts`
- [ ] Documentar en baseline

**Ejemplo:**
```typescript
// 1. Agregar tipo
export type PerformanceMetric = 
  | 'api_response'
  | 'nueva_metrica' // ⬅️ Nueva

// 2. Agregar umbral
export const SERVER_BASELINE = {
  // ... existentes
  NUEVA_METRICA_MAX_TIME_MS: 300,
} as const

// 3. Agregar función
export function getBaselineThreshold(metric: PerformanceMetric): number {
  switch (metric) {
    // ... existentes
    case 'nueva_metrica':
      return SERVER_BASELINE.NUEVA_METRICA_MAX_TIME_MS
  }
}

// 4. Agregar test
it('nueva métrica debe cumplir con baseline', async () => {
  const { measurement } = await measurePerformance('nueva_metrica', async () => {
    // Operación
  })
  expect(measurement.meetsBaseline).toBe(true)
})
```

### 5. Agregar Nuevo Anti-pattern

#### ✅ Implementación

- [ ] Agregar patrón a `FORBIDDEN_PATTERNS` en `guard-ux-patterns.mjs`
- [ ] Agregar mensaje descriptivo
- [ ] Agregar ejemplo de código malo
- [ ] Agregar ejemplo de código bueno
- [ ] Validar que detecta el patrón
- [ ] Documentar en `UX_ANTI_PATTERNS`

**Ejemplo:**
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

### 6. Agregar Nuevo Guard

#### ✅ Implementación

- [ ] Crear script del guard (`.mjs` o `.test.ts`)
- [ ] Agregar script a `package.json`
- [ ] Integrar en `ci:check`
- [ ] Documentar en `ESTANDAR_TESTS.md`
- [ ] Validar que funciona correctamente

**Ejemplo:**
```json
// package.json
{
  "scripts": {
    "guard:nuevo": "node scripts/guard-nuevo.mjs",
    "ci:check": "npm run guard:no-global-patches && ... && npm run guard:nuevo && ..."
  }
}
```

## 🚫 Qué NO Hacer

### ❌ Degradar Baseline

**Prohibido:**
- Cambiar umbral sin RFC
- Relajar contratos sin justificación
- Bypass de guards

### ❌ Violar Contratos

**Prohibido:**
- Render condicional implícito
- Pantalla en blanco
- Error sin acción
- Try/catch silencioso

### ❌ Ignorar Guards

**Prohibido:**
- Deshabilitar guards temporalmente
- Comentar tests de regresión
- Cambiar umbrales sin actualizar tests

## 📚 Referencias

- [PASO_11_COMPLETADO_FINAL.md](./PASO_11_COMPLETADO_FINAL.md) - Baseline oficial
- [ESTANDAR_TESTS.md](./ESTANDAR_TESTS.md) - Estándar de tests
- [PASO_11_3_GUARDS_REGRESION.md](./PASO_11_3_GUARDS_REGRESION.md) - Guards de regresión

---

**Última actualización:** 2025-01-28  
**Estado:** ✅ Checklist congelado
