# PASO 11.1 — Performance Baseline (Medición)

## 🎯 Objetivo

Definir qué medir y cómo, estableciendo umbrales aceptables de performance.

**Regla Enterprise:**
> No se optimiza lo que no se mide, y no se protege lo que no tiene guard.

## ✅ Resultado Esperado

Al cerrar 11.1, se tiene:

- ✅ Baseline explícito de performance (server + client)
- ✅ Umbrales aceptables definidos
- ✅ Utilidades de medición reutilizables
- ✅ Tests de baseline que validan umbrales
- ✅ Separación clara server vs client

## 📐 Alcance

### ✅ Incluye

- Performance server (API/SSR)
- Performance client (render/hydration)
- Umbrales explícitos y medibles
- Utilidades de medición deterministas

### ❌ Excluye

- Optimizaciones (eso viene después)
- Métricas de negocio
- Análisis de usuarios

## 🧩 Componentes Implementados

### 1. Baseline de Umbrales

**Archivo:** `src/lib/performance/baseline.ts`

**Umbrales Server:**
- `API_MAX_RESPONSE_TIME_MS: 500` - APIs normales
- `API_CRITICAL_MAX_RESPONSE_TIME_MS: 200` - APIs críticas (health, auth)
- `DB_QUERY_MAX_TIME_MS: 100` - Queries simples
- `DB_COMPLEX_QUERY_MAX_TIME_MS: 500` - Queries complejas
- `SSR_MAX_TIME_MS: 1000` - Server-side rendering

**Umbrales Client:**
- `FCP_MAX_TIME_MS: 1800` - First Contentful Paint
- `TTI_MAX_TIME_MS: 3800` - Time to Interactive
- `HYDRATION_MAX_TIME_MS: 500` - Hydration
- `INITIAL_RENDER_MAX_TIME_MS: 1000` - Render inicial

**Umbrales UX:**
- `LOADING_THRESHOLD_MS: 200` - Mostrar loading
- `FEEDBACK_DELAY_MS: 100` - Feedback visual
- `TRANSITION_MAX_TIME_MS: 300` - Transiciones

### 2. Utilidades de Medición

**Archivo:** `src/lib/performance/measure.ts`

**Funciones:**
- `measurePerformance()` - Mide operaciones asíncronas
- `measurePerformanceSync()` - Mide operaciones síncronas
- `measurePerformanceBatch()` - Mide múltiples operaciones en paralelo

**Características:**
- Determinista
- CI-friendly
- Sin side effects
- Retorna métricas estructuradas

### 3. Tests de Baseline

**Archivos:**
- `src/lib/performance/baseline.test.ts` - Tests de umbrales
- `src/lib/performance/measure.test.ts` - Tests de utilidades
- `src/lib/performance/api-baseline.test.ts` - Tests de baseline de API

## 📊 Uso

### Medir Performance de API

```typescript
import { measurePerformance } from '@/lib/performance'

const { result, measurement } = await measurePerformance('api_response', async () => {
  return await GET(request)
})

if (!measurement.meetsBaseline) {
  throw new Error(`Performance degraded: ${measurement.duration}ms > ${measurement.threshold}ms`)
}
```

### Medir Performance de Query

```typescript
const { result, measurement } = await measurePerformance('db_query', async () => {
  return await prisma.user.findMany()
})

expect(measurement.meetsBaseline).toBe(true)
```

### Verificar Umbral

```typescript
import { getBaselineThreshold, meetsBaseline } from '@/lib/performance'

const threshold = getBaselineThreshold('api_response') // 500
const isOk = meetsBaseline('api_response', 400) // true
```

## 🧪 Tests

**Ejecutar tests de baseline:**
```bash
npm test src/lib/performance
```

**Tests incluidos:**
- ✅ Validación de umbrales definidos
- ✅ Validación de coherencia entre umbrales
- ✅ Tests de utilidades de medición
- ✅ Tests de baseline de API

## 📋 Próximos Pasos

- **PASO 11.2:** UX Técnica Baseline
- **PASO 11.3:** Guards de Regresión
- **PASO 11.4:** Congelación y Documentación

## 📚 Referencias

- [Performance Baseline](../src/lib/performance/baseline.ts)
- [Performance Measure](../src/lib/performance/measure.ts)

---

**Estado:** ✅ **Completado**  
**Fecha:** 2025-01-28
