# PASO 11.2 — UX Técnica Baseline

## 🎯 Objetivo

Asegurar una experiencia técnica consistente y predecible, independientemente del estado (loading, vacío, error), y prohibir anti-patterns que degradan UX aunque "todo funcione".

**Regla Enterprise:**
> La UX técnica es parte del contrato del sistema.

## ✅ Resultado Esperado

Al cerrar 11.2, se tiene:

- ✅ Estados obligatorios definidos y reutilizables:
  - Loading
  - Empty
  - Error (tipado)
- ✅ Umbrales de UX medibles (alineados con 11.1)
- ✅ Anti-patterns prohibidos y detectables
- ✅ Componentes base reutilizables
- ✅ Tests que garantizan consistencia de UX
- ✅ Base lista para guards de regresión (11.3)

## 📐 Alcance

### ✅ Incluye

- UX técnica (no visual)
- Estados y feedback
- Contratos de comportamiento
- Tests unitarios

### ❌ Excluye

- Diseño visual
- Copywriting
- Animaciones complejas

## 🧩 Componentes Implementados

### 1. LoadingState

**Archivo:** `src/components/ux/LoadingState.tsx`

**Características:**
- ✅ Aparece si la operación > 200ms
- ✅ Nunca "parpadea"
- ✅ No bloquea el thread principal
- ✅ Mensaje y descripción personalizables
- ✅ Opción de pantalla completa

**Uso:**
```tsx
<LoadingState 
  message="Cargando datos..."
  description="Obteniendo información"
  fullScreen={true}
/>
```

### 2. EmptyState

**Archivo:** `src/components/ux/EmptyState.tsx`

**Características:**
- ✅ Datos válidos pero vacíos
- ✅ Mensaje neutro (no error)
- ✅ Acción opcional (crear / refrescar)

**Uso:**
```tsx
<EmptyState
  title="No hay datos"
  description="No se encontraron elementos"
  actionLabel="Crear nuevo"
  onAction={() => createNew()}
/>
```

### 3. ErrorState

**Archivo:** `src/components/ux/ErrorState.tsx`

**Características:**
- ✅ Siempre tipado
- ✅ Nunca muestra stack
- ✅ Mensaje estable por tipo de error
- ✅ Acción de recuperación clara (retry / back)

**Uso:**
```tsx
<ErrorState
  error={error}
  onRetry={() => refetch()}
  onBack={() => router.back()}
/>
```

### 4. UXBoundary

**Archivo:** `src/components/ux/UXBoundary.tsx`

**Características:**
- ✅ Orquestador único de estados
- ✅ Prioridad clara: Loading → Error → Empty → Content
- ✅ Reutilizable
- ✅ Testeable

**Uso:**
```tsx
<UXBoundary
  isLoading={isLoading}
  isEmpty={data.length === 0}
  error={error}
  onRetry={() => refetch()}
  loadingMessage="Cargando..."
  emptyTitle="Sin resultados"
>
  <DataList data={data} />
</UXBoundary>
```

## 📋 Reglas de UX

### Estados Obligatorios

**Loading:**
- Aparece si la operación > 200ms
- Nunca "parpadea"
- No bloquea el thread principal

**Empty:**
- Datos válidos pero vacíos
- Mensaje neutro (no error)
- Acción opcional (crear / refrescar)

**Error:**
- Siempre tipado
- Nunca muestra stack
- Mensaje estable por tipo de error
- Acción de recuperación clara

### Prioridad de Estados

1. **Loading** (si `isLoading`)
2. **Error** (si `error`)
3. **Empty** (si `isEmpty`)
4. **Content** (si todo está bien)

## 🚫 Anti-patterns Prohibidos

### ❌ Render Condicional Implícito

**Prohibido:**
```tsx
{data && <Component data={data} />}
```

**Requerido:**
```tsx
<UXBoundary isEmpty={!data || data.length === 0}>
  <Component data={data} />
</UXBoundary>
```

### ❌ Pantalla en Blanco

**Prohibido:**
```tsx
if (!data) return null
```

**Requerido:**
```tsx
<UXBoundary isEmpty={!data}>
  <Component data={data} />
</UXBoundary>
```

### ❌ Spinner Infinito

**Prohibido:**
```tsx
{isLoading && <Spinner />} // Sin timeout
```

**Requerido:**
```tsx
<UXBoundary 
  isLoading={isLoading}
  error={timeout ? new Error('Timeout') : undefined}
>
  <Component />
</UXBoundary>
```

### ❌ Error Genérico Sin Acción

**Prohibido:**
```tsx
{error && <p>Error</p>}
```

**Requerido:**
```tsx
<UXBoundary 
  error={error}
  onRetry={() => refetch()}
/>
```

### ❌ Try/Catch Silencioso en UI

**Prohibido:**
```tsx
try {
  await operation()
} catch {
  // Silencio
}
```

**Requerido:**
```tsx
try {
  await operation()
} catch (error) {
  setError(error)
}
// Mostrar error con UXBoundary
```

## 📊 Baseline de UX

**Archivo:** `src/lib/ux/ux.baseline.ts`

**Umbrales:**
- `LOADING_THRESHOLD_MS: 200` - Mostrar loading
- `FEEDBACK_DELAY_MS: 100` - Feedback visual
- `TRANSITION_MAX_TIME_MS: 300` - Transiciones

**Funciones:**
- `shouldShowLoading(duration)` - ¿Mostrar loading?
- `meetsFeedbackBaseline(duration)` - ¿Cumple feedback?
- `meetsTransitionBaseline(duration)` - ¿Cumple transición?

## 🧪 Tests

**Archivos:**
- `src/lib/ux/ux.test.ts` - Tests de baseline
- `src/components/ux/UXBoundary.test.tsx` - Tests de componente

**Cobertura:**
- ✅ Validación de umbrales
- ✅ Prioridad de estados
- ✅ Mensajes personalizados
- ✅ Acciones de recuperación

**Ejecutar tests:**
```bash
npm test src/lib/ux
npm test src/components/ux
```

## 📋 Próximos Pasos

- **PASO 11.3:** Guards de Regresión
- **PASO 11.4:** Congelación y Documentación

## 📚 Referencias

- [UX Components](../src/components/ux/)
- [UX Baseline](../src/lib/ux/ux.baseline.ts)
- [Performance Baseline](./PASO_11_1_PERFORMANCE_BASELINE.md)

---

**Estado:** ✅ **Completado**  
**Fecha:** 2025-01-28
