# 📋 Tests Pendientes - PAES Tutor

**Fecha:** 2025-01-27  
**Estado:** ⚠️ **TESTS PENDIENTES IDENTIFICADOS**

---

## 📊 Resumen Ejecutivo

Se han identificado **tests pendientes** y **tests que necesitan corrección** después de implementar todas las mejoras.

**Tests Existentes:** 6 archivos  
**Tests Pasando:** 50/54 (92.6%)  
**Tests Fallando:** 4  
**Tests Faltantes:** ~15-20 tests para nuevos componentes/hooks

---

## ❌ Tests con Problemas (Necesitan Corrección)

### 1. 🔴 **`src/app/api/exams/route.test.ts` - Error de Módulo**

**Problema:**

```
Error: Cannot find module 'next/server' imported from next-auth/lib/env.js
```

**Causa:** El test no está mockeando correctamente las dependencias de NextAuth.

**Solución Requerida:**

- Actualizar mocks para incluir `getCurrentStudentId`
- Mockear correctamente NextAuth
- Actualizar tests para reflejar que ahora requiere autenticación

**Prioridad:** 🔴 **ALTA** - Bloquea ejecución de tests

---

### 2. 🟡 **`src/app/dashboard/page.test.tsx` - 4 Tests Fallando**

**Tests Fallando:**

1. `debe mostrar mensaje de error si no hay estudiante`
2. `debe manejar cuando studentData tiene error`
3. `debe manejar cuando metricsData es array con error en primer elemento`
4. `debe manejar cuando metricsRes no es ok`

**Problema:** Los mocks de `fetch` no están configurados correctamente para estos casos.

**Solución Requerida:**

- Corregir mocks de `fetch` para retornar objetos Response correctos
- Asegurar que `res.json()` sea una función mockeada

**Prioridad:** 🟡 **MEDIA** - Tests importantes pero no bloquean

---

## 📝 Tests Faltantes (Nuevos Componentes/Hooks)

### 3. ⚠️ **Tests para Hooks Personalizados**

#### `useDebounce.ts`

**Tests Necesarios:**

- [ ] Debe retornar el valor inicial inmediatamente
- [ ] Debe actualizar el valor después del delay
- [ ] Debe cancelar actualización si el valor cambia antes del delay
- [ ] Debe funcionar con diferentes tipos de datos (string, number, object)
- [ ] Debe limpiar el timeout al desmontar

**Archivo:** `src/hooks/useDebounce.test.ts` (crear)

**Prioridad:** 🟡 **MEDIA** - Hook importante pero simple

---

#### `useExams.ts`

**Tests Necesarios:**

- [ ] Debe cargar exámenes correctamente
- [ ] Debe manejar estados de loading
- [ ] Debe manejar errores de API
- [ ] Debe filtrar exámenes por búsqueda
- [ ] Debe extraer subjects únicos
- [ ] Debe extraer tipos únicos
- [ ] Debe actualizar cuando cambian los filtros

**Archivo:** `src/hooks/useExams.test.ts` (crear)

**Prioridad:** 🟡 **MEDIA** - Hook importante para la funcionalidad principal

---

#### `useAutoSave.ts`

**Tests Necesarios:**

- [ ] Debe guardar automáticamente después del delay
- [ ] Debe cancelar guardado si los datos cambian antes del delay
- [ ] Debe prevenir saves duplicados simultáneos
- [ ] Debe guardar al desmontar si hay cambios pendientes
- [ ] Debe respetar el flag `enabled`
- [ ] Debe manejar errores de guardado
- [ ] Debe usar comparación profunda (safeDeepEqual)

**Archivo:** `src/hooks/useAutoSave.test.ts` (crear)

**Prioridad:** 🟠 **ALTA** - Hook crítico para auto-guardado

---

### 4. ⚠️ **Tests para Componentes Nuevos**

#### `ExamCard.tsx`

**Tests Necesarios:**

- [ ] Debe renderizar información del examen
- [ ] Debe llamar onStartExam al hacer click
- [ ] Debe evitar re-renders innecesarios (React.memo)
- [ ] Debe mostrar badge de asignatura
- [ ] Debe mostrar tiempo límite si existe
- [ ] Debe manejar descripción nula

**Archivo:** `src/components/ExamCard.test.tsx` (crear)

**Prioridad:** 🟡 **MEDIA** - Componente importante pero no crítico

---

#### `ErrorBoundary.tsx`

**Tests Necesarios:**

- [ ] Debe renderizar children cuando no hay error
- [ ] Debe mostrar UI de error cuando hay error
- [ ] Debe llamar onError callback si está definido
- [ ] Debe mostrar mensaje de error en desarrollo
- [ ] Debe permitir resetear el error
- [ ] Debe redirigir a inicio si se solicita

**Archivo:** `src/components/ErrorBoundary.test.tsx` (crear)

**Prioridad:** 🟠 **ALTA** - Componente crítico para manejo de errores

---

### 5. ⚠️ **Tests para Utilidades**

#### `deepEqual.ts`

**Tests Necesarios:**

- [ ] Debe comparar primitivos correctamente
- [ ] Debe comparar objetos correctamente
- [ ] Debe comparar arrays correctamente
- [ ] Debe manejar null y undefined
- [ ] Debe manejar referencias circulares (safeDeepEqual)
- [ ] Debe usar fallback a JSON.stringify si hay error

**Archivo:** `src/lib/utils/deepEqual.test.ts` (crear)

**Prioridad:** 🟡 **MEDIA** - Utilidad importante pero no crítica

---

### 6. ⚠️ **Tests para APIs Actualizadas**

#### `src/app/api/attempts/[id]/route.test.ts`

**Tests Necesarios (Actualizar):**

- [ ] Debe validar formato de ID (cuid) en GET
- [ ] Debe validar formato de ID (cuid) en PUT
- [ ] Debe invalidar caché después de actualizar

**Archivo:** Actualizar existente

**Prioridad:** 🟡 **MEDIA** - Validaciones nuevas

---

#### `src/app/api/attempts/[id]/submit/route.test.ts`

**Tests Necesarios (Crear):**

- [ ] Debe validar formato de ID
- [ ] Debe validar estado cancelado
- [ ] Debe invalidar caché después de submit
- [ ] Debe calcular métricas correctamente

**Archivo:** `src/app/api/attempts/[id]/submit/route.test.ts` (crear)

**Prioridad:** 🟡 **MEDIA** - Endpoint importante

---

## 📊 Resumen de Tests Pendientes

### Tests que Necesitan Corrección (2 archivos)

1. ❌ `src/app/api/exams/route.test.ts` - Error de módulo
2. ⚠️ `src/app/dashboard/page.test.tsx` - 4 tests fallando

### Tests Faltantes (7 archivos nuevos)

1. ⚠️ `src/hooks/useDebounce.test.ts` - ~5 tests
2. ⚠️ `src/hooks/useExams.test.ts` - ~7 tests
3. ⚠️ `src/hooks/useAutoSave.test.ts` - ~7 tests
4. ⚠️ `src/components/ExamCard.test.tsx` - ~6 tests
5. ⚠️ `src/components/ErrorBoundary.test.tsx` - ~6 tests
6. ⚠️ `src/lib/utils/deepEqual.test.ts` - ~6 tests
7. ⚠️ `src/app/api/attempts/[id]/submit/route.test.ts` - ~4 tests

**Total Estimado:** ~45 tests adicionales

---

## 🎯 Priorización

### Prioridad Alta (Corregir Primero)

1. 🔴 **Corregir `src/app/api/exams/route.test.ts`** - Bloquea ejecución
2. 🟠 **Crear tests para `useAutoSave`** - Hook crítico
3. 🟠 **Crear tests para `ErrorBoundary`** - Componente crítico

### Prioridad Media (Hacer Después)

4. 🟡 **Corregir tests de Dashboard** - 4 tests fallando
5. 🟡 **Crear tests para `useExams`** - Hook importante
6. 🟡 **Crear tests para `ExamCard`** - Componente importante
7. 🟡 **Crear tests para `deepEqual`** - Utilidad importante
8. 🟡 **Crear tests para submit route** - Endpoint importante

### Prioridad Baja (Opcional)

9. ⚪ **Crear tests para `useDebounce`** - Hook simple
10. ⚪ **Actualizar tests de attempts/[id]** - Validaciones nuevas

---

## 📝 Plan de Acción Recomendado

### Fase 1: Correcciones Críticas (1-2 horas)

1. Corregir error de módulo en `exams/route.test.ts`
2. Corregir mocks en `dashboard/page.test.tsx`
3. Crear tests básicos para `useAutoSave`
4. Crear tests básicos para `ErrorBoundary`

### Fase 2: Tests Importantes (2-3 horas)

5. Crear tests para `useExams`
6. Crear tests para `ExamCard`
7. Crear tests para `deepEqual`
8. Crear tests para submit route

### Fase 3: Tests Opcionales (1-2 horas)

9. Crear tests para `useDebounce`
10. Actualizar tests de attempts/[id]

**Total Estimado:** 4-7 horas de trabajo

---

## ✅ Estado Actual de Tests

### Tests Pasando: 50/54 (92.6%)

- ✅ `src/lib/auth.test.ts` - 7/7
- ✅ `src/middleware.test.ts` - 11/11
- ✅ `src/app/api/student/route.test.ts` - 4/4
- ✅ `src/app/api/attempts/route.test.ts` - 4/4
- ✅ `src/app/api/metrics/route.test.ts` - 9/9
- ⚠️ `src/app/dashboard/page.test.tsx` - 11/15
- ❌ `src/app/api/exams/route.test.ts` - 0/3 (error de módulo)

### Tests E2E: 3 archivos configurados

- ✅ `e2e/auth.spec.ts`
- ✅ `e2e/dashboard.spec.ts`
- ✅ `e2e/api.spec.ts`

---

## 🎯 Conclusión

**¿Tenemos tests pendientes?** **SÍ**

**Resumen:**

- ✅ **50 tests pasando** (92.6%)
- ❌ **1 archivo con error** (bloquea ejecución)
- ⚠️ **4 tests fallando** (necesitan corrección de mocks)
- 📝 **~45 tests faltantes** (nuevos componentes/hooks)

**Recomendación:**

1. **Corregir tests existentes primero** (1-2 horas)
2. **Crear tests críticos** para hooks y componentes nuevos (2-3 horas)
3. **Completar tests opcionales** cuando haya tiempo (1-2 horas)

**Total:** 4-7 horas para tener cobertura completa

---

**Fecha de Análisis:** 2025-01-27  
**Próxima Revisión:** Después de corregir tests existentes
