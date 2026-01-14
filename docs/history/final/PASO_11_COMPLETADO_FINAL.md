# PASO 11 — Completado Final (Performance & UX Baseline)

## 🔒 Declaración de Congelación

**Estado del sistema:** ✅ **Congelado (Enterprise)**

**Cambios permitidos:** Solo vía RFC con tests + guards

**Cambios prohibidos:**
- ❌ Degradar baseline
- ❌ Relajar contratos
- ❌ Bypass de guards

**CI:** Autoridad final

---

## 🎯 Objetivo General

Establecer un baseline medible y protegible de performance y UX, sin introducir deuda y sin optimizar a ciegas.

**Regla Enterprise:**
> No se optimiza lo que no se mide, y no se protege lo que no tiene guard.

## ✅ Resultado Final

Al cerrar el Paso 11, se tiene:

- ✅ Baseline explícito de performance (server + client)
- ✅ Anti-patterns prohibidos y detectables
- ✅ Métricas estables y repetibles
- ✅ Tests/guards de regresión
- ✅ CI alerta si se degrada UX/performance
- ✅ Documentación congelada

## 📊 Baselines Oficiales (Congelados)

### Performance - Server

| Métrica | Umbral | Archivo |
|---------|--------|---------|
| API normal | < 500ms | `src/lib/performance/baseline.ts` |
| API crítica | < 200ms | `src/lib/performance/baseline.ts` |
| Query simple | < 100ms | `src/lib/performance/baseline.ts` |
| Query compleja | < 500ms | `src/lib/performance/baseline.ts` |
| SSR | < 1000ms | `src/lib/performance/baseline.ts` |

**Código:**
```typescript
export const SERVER_BASELINE = {
  API_MAX_RESPONSE_TIME_MS: 500,
  API_CRITICAL_MAX_RESPONSE_TIME_MS: 200,
  DB_QUERY_MAX_TIME_MS: 100,
  DB_COMPLEX_QUERY_MAX_TIME_MS: 500,
  SSR_MAX_TIME_MS: 1000,
} as const
```

### Performance - Client

| Métrica | Umbral | Archivo |
|---------|--------|---------|
| FCP | < 1800ms | `src/lib/performance/baseline.ts` |
| TTI | < 3800ms | `src/lib/performance/baseline.ts` |
| Hydration | < 500ms | `src/lib/performance/baseline.ts` |
| Render inicial | < 1000ms | `src/lib/performance/baseline.ts` |

**Código:**
```typescript
export const CLIENT_BASELINE = {
  FCP_MAX_TIME_MS: 1800,
  TTI_MAX_TIME_MS: 3800,
  HYDRATION_MAX_TIME_MS: 500,
  INITIAL_RENDER_MAX_TIME_MS: 1000,
} as const
```

### UX Técnica

| Métrica | Umbral | Archivo |
|---------|--------|---------|
| Loading threshold | > 200ms | `src/lib/performance/baseline.ts` |
| Feedback delay | < 100ms | `src/lib/performance/baseline.ts` |
| Transition max | < 300ms | `src/lib/performance/baseline.ts` |

**Código:**
```typescript
export const UX_BASELINE = {
  LOADING_THRESHOLD_MS: 200,
  FEEDBACK_DELAY_MS: 100,
  TRANSITION_MAX_TIME_MS: 300,
} as const
```

## 🛡️ Guards Activos y su Propósito

### 1. Guard de Performance

**Archivo:** `src/lib/performance/performance.guard.test.ts`

**Propósito:**
- Detecta degradación de performance
- Valida que las métricas cumplen con el baseline
- Falla CI si `!meetsBaseline`

**Qué protege:**
- ✅ API response time
- ✅ API crítica time
- ✅ Database query time
- ✅ SSR time
- ✅ Client performance

### 2. Guard de UX Técnica

**Archivo:** `src/components/ux/ux.guard.test.tsx`

**Propósito:**
- Valida uso correcto de componentes UX
- Detecta violaciones de estados obligatorios
- Valida prioridad de estados

**Qué protege:**
- ✅ Uso obligatorio de UXBoundary
- ✅ Estados explícitos (loading, empty, error)
- ✅ Prioridad correcta de estados
- ✅ Contratos de componentes

### 3. Guard Estructural (Anti-patterns UX)

**Archivo:** `scripts/guard-ux-patterns.mjs`

**Propósito:**
- Detecta anti-patterns estructurales
- Previene regresiones de UX antes de tests
- Falla rápido

**Qué detecta:**
- ❌ Render condicional implícito
- ❌ Pantalla en blanco
- ❌ Loading sin UXBoundary
- ❌ Error sin ErrorState
- ❌ Try/catch silencioso

## 🚫 Anti-patterns Prohibidos (Lista Cerrada)

### Performance

1. ❌ **Optimización prematura sin medición**
   - ✅ Medir primero, optimizar después

2. ❌ **Cambiar umbrales sin RFC**
   - ✅ RFC obligatorio para cambios de baseline

3. ❌ **Bypass de guards de performance**
   - ✅ Todos los cambios deben pasar guards

### UX Técnica

1. ❌ **Render condicional implícito**
   ```tsx
   // ❌ PROHIBIDO
   {data && <Component />}
   
   // ✅ REQUERIDO
   <UXBoundary isEmpty={!data}>
     <Component />
   </UXBoundary>
   ```

2. ❌ **Pantalla en blanco**
   ```tsx
   // ❌ PROHIBIDO
   if (!data) return null
   
   // ✅ REQUERIDO
   <UXBoundary isEmpty={!data}>...</UXBoundary>
   ```

3. ❌ **Spinner infinito**
   ```tsx
   // ❌ PROHIBIDO
   {isLoading && <Spinner />} // Sin timeout
   
   // ✅ REQUERIDO
   <UXBoundary isLoading={isLoading} error={timeout ? error : undefined}>
     ...
   </UXBoundary>
   ```

4. ❌ **Error genérico sin acción**
   ```tsx
   // ❌ PROHIBIDO
   {error && <p>Error</p>}
   
   // ✅ REQUERIDO
   <UXBoundary error={error} onRetry={() => refetch()}>
     ...
   </UXBoundary>
   ```

5. ❌ **Try/catch silencioso en UI**
   ```tsx
   // ❌ PROHIBIDO
   try {
     await operation()
   } catch {
     // Silencio
   }
   
   // ✅ REQUERIDO
   try {
     await operation()
   } catch (error) {
     setError(error)
   }
   ```

## 📋 Procedimiento para Cambios Futuros (RFC Interno)

### Cambiar Umbral de Performance

1. **Crear RFC:**
   - Justificación técnica
   - Impacto medido
   - Tests actualizados

2. **Actualizar baseline:**
   ```typescript
   // src/lib/performance/baseline.ts
   export const SERVER_BASELINE = {
     // ... existentes
     NEW_METRIC_MAX_TIME_MS: 300, // ⬅️ Cambio propuesto
   } as const
   ```

3. **Actualizar tests de guard:**
   ```typescript
   // src/lib/performance/performance.guard.test.ts
   it('nueva métrica debe cumplir con baseline', async () => {
     // Test actualizado
   })
   ```

4. **Validar en CI:**
   - Todos los guards deben pasar
   - Tests de regresión deben pasar

### Agregar Nueva Métrica

1. **Agregar al baseline:**
   ```typescript
   // src/lib/performance/baseline.ts
   export type PerformanceMetric = 
     | 'api_response'
     | 'nueva_metrica' // ⬅️ Nueva métrica
   ```

2. **Agregar umbral:**
   ```typescript
   export const SERVER_BASELINE = {
     // ... existentes
     NUEVA_METRICA_MAX_TIME_MS: 300,
   } as const
   ```

3. **Agregar test de guard:**
   ```typescript
   // src/lib/performance/performance.guard.test.ts
   it('nueva métrica debe cumplir con baseline', async () => {
     // Test
   })
   ```

### Agregar Nuevo Anti-pattern

1. **Agregar al guard estructural:**
   ```javascript
   // scripts/guard-ux-patterns.mjs
   const FORBIDDEN_PATTERNS = [
     // ... existentes
     {
       pattern: /nuevo-patron-prohibido/,
       message: 'Descripción',
       example: '❌ Código malo',
       fix: '✅ Código bueno',
     },
   ]
   ```

2. **Validar en CI:**
   - Guard debe detectar el patrón
   - Documentar en anti-patterns prohibidos

### Excepción Temporal

1. **Justificar excepción:**
   - Razón técnica clara
   - Plan de corrección
   - Timeline

2. **Agregar comentario en código:**
   ```typescript
   // EXCEPCIÓN TEMPORAL: [Razón]
   // FECHA: [Fecha]
   // PLAN: [Plan de corrección]
   // TODO: Remover después de [Fecha]
   ```

3. **Testear excepción:**
   - Test que valida la excepción
   - Test que valida el plan de corrección

## 🔗 CI — Orden Final (Inmutable)

**Archivo:** `package.json` (script `ci:check`)

**Orden congelado:**
1. **Lint**
2. **Type check**
3. **`guard:no-global-patches`**
4. **`guard:contracts`**
5. **`guard:prod-ready`**
6. **`guard:ux`** ⬅️ Performance & UX
7. **`contracts:test`**
8. **Unit tests** (incluye `performance.guard.test.ts` y `ux.guard.test.tsx`)
9. **Coverage**

**Criterios de "CI rojo":**
- ❌ Cualquier guard falla
- ❌ Test de performance falla (`!meetsBaseline`)
- ❌ Test de UX falla (violación de contrato)
- ❌ Coverage cae por debajo del umbral

## 📚 Documentación Relacionada

- [PASO 11.1 - Performance Baseline](./PASO_11_1_PERFORMANCE_BASELINE.md)
- [PASO 11.2 - UX Baseline](./PASO_11_2_UX_BASELINE.md)
- [PASO 11.3 - Guards de Regresión](./PASO_11_3_GUARDS_REGRESION.md)
- [EXTENSION_SEGURA.md](./EXTENSION_SEGURA.md)
- [ESTANDAR_TESTS.md](./ESTANDAR_TESTS.md)

## 🏁 Cierre del Paso 11

**Al cerrar 11.4:**

✅ Baseline medido y protegido  
✅ UX técnica contractual  
✅ Regresiones imposibles sin CI rojo  
✅ Sistema listo para operar y escalar

---

**Estado:** ✅ **Congelado (Enterprise)**  
**Fecha:** 2025-01-28  
**Próximo:** Sistema listo para producción
