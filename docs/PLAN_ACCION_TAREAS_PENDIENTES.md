# 📋 Plan de Acción - Tareas Pendientes

**Fecha:** 2025-01-28  
**Estado:** ✅ Errores TypeScript/ESLint corregidos - Listo para continuar

---

## ✅ Estado Actual

### Completado Recientemente:
- ✅ **101+ errores de TypeScript** corregidos
- ✅ **Todos los errores de ESLint** corregidos
- ✅ **28 archivos** modificados y verificados
- ✅ **Build sin errores** (según ERRORES_BUILD_PENDIENTES.md)

### Pendiente:
- ⚠️ **Tests fallidos** (1 archivo con error, 4 tests fallando)
- ⚠️ **Tests faltantes** (~45 tests para nuevos componentes/hooks)
- ⚠️ **Warnings de linting** (mejoras opcionales)

---

## 🎯 Priorización de Tareas

### 🔴 PRIORIDAD ALTA - Corregir Tests Existentes

#### 1. Corregir `src/app/api/exams/route.test.ts` (Error de Módulo)
**Estado:** ❌ Bloquea ejecución de tests  
**Tiempo estimado:** 30-60 minutos

**Problema:**
```
Error: Cannot find module 'next/server' imported from next-auth/lib/env.js
```

**Solución:**
- Actualizar mocks para incluir `getCurrentStudentId`
- Mockear correctamente NextAuth
- Actualizar tests para reflejar autenticación requerida

**Archivo:** `src/app/api/exams/route.test.ts`

---

#### 2. Corregir `src/app/dashboard/page.test.tsx` (4 Tests Fallando)
**Estado:** ⚠️ Tests importantes pero no bloquean  
**Tiempo estimado:** 30-45 minutos

**Tests fallando:**
1. `debe mostrar mensaje de error si no hay estudiante`
2. `debe manejar cuando studentData tiene error`
3. `debe manejar cuando metricsData es array con error en primer elemento`
4. `debe manejar cuando metricsRes no es ok`

**Solución:**
- Corregir mocks de `fetch` para retornar objetos Response correctos
- Asegurar que `res.json()` sea una función mockeada

**Archivo:** `src/app/dashboard/page.test.tsx`

---

### 🟠 PRIORIDAD MEDIA - Crear Tests Críticos

#### 3. Crear tests para `useAutoSave.ts`
**Estado:** ⚠️ Hook crítico sin tests  
**Tiempo estimado:** 45-60 minutos

**Tests necesarios (~7 tests):**
- [ ] Debe guardar automáticamente después del delay
- [ ] Debe cancelar guardado si los datos cambian antes del delay
- [ ] Debe prevenir saves duplicados simultáneos
- [ ] Debe guardar al desmontar si hay cambios pendientes
- [ ] Debe respetar el flag `enabled`
- [ ] Debe manejar errores de guardado
- [ ] Debe usar comparación profunda (safeDeepEqual)

**Archivo a crear:** `src/hooks/useAutoSave.test.ts`

---

#### 4. Crear tests para `ErrorBoundary.tsx`
**Estado:** ⚠️ Componente crítico sin tests  
**Tiempo estimado:** 45-60 minutos

**Tests necesarios (~6 tests):**
- [ ] Debe renderizar children cuando no hay error
- [ ] Debe mostrar UI de error cuando hay error
- [ ] Debe llamar onError callback si está definido
- [ ] Debe mostrar mensaje de error en desarrollo
- [ ] Debe permitir resetear el error
- [ ] Debe redirigir a inicio si se solicita

**Archivo a crear:** `src/components/ErrorBoundary.test.tsx`

---

### 🟡 PRIORIDAD MEDIA - Crear Tests Importantes

#### 5. Crear tests para `useExams.ts`
**Estado:** ⚠️ Hook importante sin tests  
**Tiempo estimado:** 45-60 minutos

**Tests necesarios (~7 tests):**
- [ ] Debe cargar exámenes correctamente
- [ ] Debe manejar estados de loading
- [ ] Debe manejar errores de API
- [ ] Debe filtrar exámenes por búsqueda
- [ ] Debe extraer subjects únicos
- [ ] Debe extraer tipos únicos
- [ ] Debe actualizar cuando cambian los filtros

**Archivo a crear:** `src/hooks/useExams.test.ts`

---

#### 6. Crear tests para `ExamCard.tsx`
**Estado:** ⚠️ Componente importante sin tests  
**Tiempo estimado:** 30-45 minutos

**Tests necesarios (~6 tests):**
- [ ] Debe renderizar información del examen
- [ ] Debe llamar onStartExam al hacer click
- [ ] Debe evitar re-renders innecesarios (React.memo)
- [ ] Debe mostrar badge de asignatura
- [ ] Debe mostrar tiempo límite si existe
- [ ] Debe manejar descripción nula

**Archivo a crear:** `src/components/ExamCard.test.tsx`

---

#### 7. Crear tests para `deepEqual.ts`
**Estado:** ⚠️ Utilidad importante sin tests  
**Tiempo estimado:** 30-45 minutos

**Tests necesarios (~6 tests):**
- [ ] Debe comparar primitivos correctamente
- [ ] Debe comparar objetos correctamente
- [ ] Debe comparar arrays correctamente
- [ ] Debe manejar null y undefined
- [ ] Debe manejar referencias circulares (safeDeepEqual)
- [ ] Debe usar fallback a JSON.stringify si hay error

**Archivo a crear:** `src/lib/utils/deepEqual.test.ts`

---

### ⚪ PRIORIDAD BAJA - Tests Opcionales

#### 8. Crear tests para `useDebounce.ts`
**Estado:** ⚪ Hook simple sin tests  
**Tiempo estimado:** 20-30 minutos

**Tests necesarios (~5 tests):**
- [ ] Debe retornar el valor inicial inmediatamente
- [ ] Debe actualizar el valor después del delay
- [ ] Debe cancelar actualización si el valor cambia antes del delay
- [ ] Debe funcionar con diferentes tipos de datos
- [ ] Debe limpiar el timeout al desmontar

**Archivo a crear:** `src/hooks/useDebounce.test.ts`

---

## 📊 Resumen de Tiempo Estimado

### Fase 1: Correcciones Críticas (1-2 horas)
- ✅ Corregir `exams/route.test.ts` - 30-60 min
- ✅ Corregir `dashboard/page.test.tsx` - 30-45 min

### Fase 2: Tests Críticos (1.5-2 horas)
- ✅ Tests para `useAutoSave` - 45-60 min
- ✅ Tests para `ErrorBoundary` - 45-60 min

### Fase 3: Tests Importantes (2-2.5 horas)
- ✅ Tests para `useExams` - 45-60 min
- ✅ Tests para `ExamCard` - 30-45 min
- ✅ Tests para `deepEqual` - 30-45 min

### Fase 4: Tests Opcionales (20-30 minutos)
- ✅ Tests para `useDebounce` - 20-30 min

**Total estimado:** 4.5-7 horas

---

## 🚀 Plan de Ejecución Recomendado

### Opción A: Enfoque Rápido (Correcciones Primero)
1. ✅ Corregir tests existentes (1-2 horas)
2. ✅ Crear tests críticos (1.5-2 horas)
3. ⚪ Crear tests importantes (2-2.5 horas) - Opcional
4. ⚪ Crear tests opcionales (20-30 min) - Opcional

**Total mínimo:** 2.5-4 horas para tener tests funcionales

### Opción B: Enfoque Completo
1. ✅ Corregir tests existentes
2. ✅ Crear todos los tests faltantes
3. ✅ Verificar cobertura > 90%

**Total:** 4.5-7 horas para cobertura completa

---

## 📝 Comandos Útiles

### Ejecutar Tests
```bash
# Todos los tests
npm run test:run

# Tests en modo watch
npm run test

# Cobertura
npm run test:coverage
```

### Verificar Estado
```bash
# Linting
npm run lint:strict

# Build
npm run build
```

---

## ✅ Próximo Paso Inmediato

**Recomendación:** Empezar con **Corregir `src/app/api/exams/route.test.ts`**

**Razón:**
- Es el único error que bloquea la ejecución de tests
- Es relativamente rápido de corregir (30-60 min)
- Una vez corregido, podemos ejecutar todos los tests

---

**¿Continuamos con la corrección de tests fallidos?**

