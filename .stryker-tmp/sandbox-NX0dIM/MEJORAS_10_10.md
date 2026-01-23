# Mejoras para Alcanzar 10/10 - PAES Tutor

## Estado Actual: 9/10 ✅

Ya implementado:

- ✅ DRY (código duplicado eliminado)
- ✅ Logging estructurado
- ✅ Tipos TypeScript mejorados
- ✅ Validación de datos (POST/PUT)
- ✅ Manejo de errores
- ✅ Seguridad

## 🎯 Mejoras Restantes para 10/10

### 1. **Validación de Query Parameters** (Alta Prioridad)

**Problema:** Los endpoints GET no validan parámetros de query string con Zod.

**Archivos afectados:**

- `src/app/api/bookmarks/route.ts` - `topicId`, `subjectId`
- `src/app/api/notes/route.ts` - `questionId`, `topicId`, `search`
- `src/app/api/schedule/route.ts` - `startDate`, `endDate`, `completed`, `scheduleId`
- `src/app/api/flashcards/route.ts` - `dueOnly`, `limit`, `flashcardId`
- `src/app/api/search/route.ts` - `q`, `types`, `limit`

**Solución:**

```typescript
// Ejemplo para schedule/route.ts
const querySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  completed: z
    .enum(['true', 'false'])
    .optional()
    .transform(val => val === 'true'),
  scheduleId: z.string().cuid().optional(),
})

const query = querySchema.parse(Object.fromEntries(searchParams))
```

**Impacto:** Previene errores de validación, mejora seguridad, mejor DX.

---

### 2. **Optimizaciones React con useMemo/useCallback** (Media Prioridad)

**Problema:** Algunos componentes recalculan valores en cada render.

**Archivos afectados:**

- `src/app/schedule/page.tsx` - `getSchedulesByDate()` se recalcula
- `src/app/bookmarks/page.tsx` - Filtros podrían memoizarse
- `src/app/flashcards/page.tsx` - Filtros y ordenamiento

**Solución:**

```typescript
// schedule/page.tsx
const schedulesByDate = useMemo(() => {
  const grouped = new Map<string, StudySchedule[]>()
  schedules.forEach(schedule => {
    const date = new Date(schedule.scheduledAt).toISOString().split('T')[0]
    if (!grouped.has(date)) grouped.set(date, [])
    grouped.get(date)!.push(schedule)
  })
  return grouped
}, [schedules])
```

**Impacto:** Mejora performance, reduce re-renders innecesarios.

---

### 3. **Skeleton Loaders Consistentes** (Media Prioridad)

**Problema:** Solo algunos componentes usan skeleton loaders.

**Archivos que necesitan skeletons:**

- `src/app/bookmarks/page.tsx`
- `src/app/flashcards/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/schedule/page.tsx`
- `src/app/practice/page.tsx`

**Solución:**

```typescript
import { Skeleton } from '@/components/ui/skeleton'

{loading ? (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <Skeleton key={i} className="h-24 w-full" />
    ))}
  </div>
) : (
  // contenido real
)}
```

**Impacto:** Mejor UX, percepción de velocidad.

---

### 4. **Validación de Límites y Paginación** (Media Prioridad)

**Problema:** Los límites de query no están validados ni acotados.

**Archivos afectados:**

- `src/app/api/flashcards/route.ts` - `limit` sin validación
- `src/app/api/search/route.ts` - `limit` sin validación
- `src/app/api/review/quick/route.ts` - `limit` sin validación

**Solución:**

```typescript
const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(100).optional()),
})
```

**Impacto:** Previene DoS, mejora performance.

---

### 5. **Manejo de Estados de Carga Unificado** (Baja Prioridad)

**Problema:** Múltiples estados booleanos (`loading`, `isLoading`, `isChecking`) podrían consolidarse.

**Solución:** Crear hook personalizado:

```typescript
// hooks/useAsyncState.ts
function useAsyncState<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      setData(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute }
}
```

**Impacto:** Código más limpio, menos duplicación.

---

### 6. **Validación de IDs (CUID)** (Baja Prioridad)

**Problema:** IDs de URL no se validan como CUID antes de usar en queries.

**Solución:**

```typescript
const idSchema = z.string().cuid()
const validId = idSchema.parse(id) // Lanza error si no es CUID válido
```

**Impacto:** Previene errores de base de datos, mejor seguridad.

---

### 7. **Error Boundaries en Páginas** (Baja Prioridad)

**Problema:** No hay error boundaries específicos para páginas críticas.

**Solución:**

```typescript
// components/ErrorBoundary.tsx ya existe, pero podría usarse más
// En layout.tsx o páginas específicas
<ErrorBoundary fallback={<ErrorFallback />}>
  <PageContent />
</ErrorBoundary>
```

**Impacto:** Mejor manejo de errores en producción.

---

## 📊 Priorización

### Para alcanzar 10/10, implementar:

1. **Validación de Query Parameters** (Alta) - 0.5 puntos
2. **Optimizaciones React** (Media) - 0.3 puntos
3. **Skeleton Loaders** (Media) - 0.1 puntos
4. **Validación de Límites** (Media) - 0.1 puntos

**Total:** +1.0 punto → **10/10** ✅

### Opcionales (mejoras adicionales):

- Manejo de estados unificado
- Validación de CUID
- Error boundaries adicionales

---

## 🚀 Plan de Implementación

### Fase 1: Validación de Query Parameters (Crítico)

- [ ] `bookmarks/route.ts`
- [ ] `notes/route.ts`
- [ ] `schedule/route.ts`
- [ ] `flashcards/route.ts`
- [ ] `search/route.ts`

### Fase 2: Optimizaciones React

- [ ] `schedule/page.tsx` - useMemo para agrupación
- [ ] `bookmarks/page.tsx` - useMemo para filtros
- [ ] `flashcards/page.tsx` - useMemo para filtros

### Fase 3: Skeleton Loaders

- [ ] Agregar skeletons a todas las páginas de lista

### Fase 4: Validación de Límites

- [ ] Validar y acotar todos los `limit` parameters

---

## 📝 Notas

- Las mejoras están ordenadas por impacto/prioridad
- Las mejoras de "Baja Prioridad" son opcionales pero recomendadas
- El código actual ya es muy bueno (9/10), estas mejoras lo llevan a excelencia (10/10)
