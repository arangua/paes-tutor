# 📊 Estado de Tests - 28 de Enero 2025

## Resumen General

- **Test Files:** 31 fallidos | 46 pasando (77 total)
- **Tests:** 146 fallidos | 762 pasando | 1 saltado (909 total)
- **Duración:** 76.50s
- **Tasa de éxito:** ~84% de tests pasando

---

## 🔴 Problemas Críticos (Bloquean ejecución)

### 1. Errores de Sintaxis/Compilación

#### `src/app/api/attempts/[id]/route.ts:725:6`
```
ERROR: Unexpected "catch"
```
**Problema:** Error de sintaxis - bloque catch mal formado

#### `src/app/api/analytics/comparison/route.ts:371:12` y `385:12`
```
ERROR: Cannot use "continue" here
```
**Problema:** Uso de `continue` fuera de un loop (probablemente dentro de un `.forEach()`)

#### `src/app/api/analytics/time/route.ts:276:10`
```
ERROR: Cannot use "continue" here
```
**Problema:** Mismo problema - `continue` usado incorrectamente

### 2. Errores de Módulos

#### `src/app/api/notes/versions/helpers.test.ts`
```
Cannot find module 'C:\Users\...\node_modules\next\server'
Did you mean to import "next/server.js"?
```
**Problema:** Importación incorrecta de módulo Next.js

### 3. Errores de Mock

#### `src/lib/admission-calendar.test.ts`
```
ReferenceError: Cannot access 'mockFindMany' before initialization
```
**Problema:** Variable de mock usada antes de inicialización (problema de hoisting)

---

## ⚠️ Problemas de Tests (146 fallos)

### Categorías de Errores

#### 1. Problemas con TEST_IDS (Muchos tests de challenges)
```
TypeError: Cannot read properties of undefined (reading 'STUDENT')
TypeError: Cannot read properties of undefined (reading 'EXAM')
TypeError: Cannot read properties of undefined (reading 'ATTEMPT')
```
**Archivos afectados:**
- `src/app/api/challenges/route.test.ts` (múltiples tests)
- `src/app/api/challenges/[id]/route.test.ts` (múltiples tests)

**Causa:** `TEST_IDS` no está definido o no está siendo importado correctamente

#### 2. Problemas de Validación (Muchos tests de notes/versions)
```
Expected: "Datos inválidos"
Received: "El cuerpo de la solicitud no puede estar vacío"
```
**Archivos afectados:**
- `src/app/api/notes/versions/export-diff/route.test.ts`
- `src/app/api/notes/versions/export-bulk/route.test.ts`
- `src/app/api/notes/versions/semantic-search/route.test.ts`
- `src/app/api/notes/versions/merge/route.test.ts`
- `src/app/api/notes/versions/share/route.test.ts`

**Causa:** Los mensajes de error han cambiado, los tests esperan mensajes antiguos

#### 3. Problemas de Códigos de Estado HTTP
```
Expected: 404
Received: 400
```
o
```
Expected: 200
Received: 400
```
**Causa:** Cambios en la lógica de validación que retornan códigos diferentes

#### 4. Timeouts en Tests de Hooks
```
Error: Test timed out in 10000ms
```
**Archivo:** `src/hooks/useAutoSave.test.ts` (6 tests)

**Tests afectados:**
- debe cancelar guardado si los datos cambian antes del delay
- debe guardar al desmontar si hay cambios pendientes
- debe respetar el flag enabled
- debe manejar errores de guardado
- debe usar comparación profunda para detectar cambios
- debe prevenir saves duplicados simultáneos

#### 5. Otros Problemas Específicos

- **bookmarks/route.test.ts:** IDs de bookmarks no coinciden (orden diferente)
- **notifications/route.test.ts:** Filtrado de notificaciones expiradas incorrecto
- **user/route.test.ts:** Errores 500 al actualizar usuario
- **analytics/errors/route.test.ts:** Agrupación de errores incorrecta
- **admin/fetch-demre-pdfs/route.test.ts:** Errores 500 en extracción de PDFs

---

## ✅ Tests Pasando (762 tests en 46 archivos)

Los siguientes archivos de test están pasando completamente:

- `src/app/api/notes/versions/route.test.ts` (21 tests) ✅
- `src/app/api/notes/versions/validation-utils.regression.test.ts` ✅
- `src/app/api/practice/stats/route.test.ts` ✅
- `src/app/api/admin/import-answer-key/route.test.ts` (4 tests) ✅
- `src/lib/utils/text-diff.test.ts` (6 tests) ✅
- `src/lib/rate-limit.test.ts` (9 tests) ✅
- Y muchos más...

---

## 🎯 Prioridades de Corrección

### Prioridad 1: Errores de Sintaxis (Bloquean compilación)
1. ✅ Corregir `route.ts:725` - error de catch
2. ✅ Corregir `comparison/route.ts` - reemplazar `continue` en forEach
3. ✅ Corregir `time/route.ts` - reemplazar `continue` en forEach

### Prioridad 2: Errores de Módulos
1. ✅ Corregir importación de `next/server` en helpers.test.ts

### Prioridad 3: Errores de Mock
1. ✅ Corregir hoisting de mocks en admission-calendar.test.ts

### Prioridad 4: Problemas de Tests
1. ✅ Corregir TEST_IDS en tests de challenges
2. ✅ Actualizar mensajes de error en tests de validación
3. ✅ Ajustar códigos de estado esperados
4. ✅ Corregir timeouts en useAutoSave.test.ts

---

## 📝 Notas

- La mayoría de los tests están pasando (84% de éxito)
- Los errores principales son de sintaxis y validación
- Muchos fallos son por cambios en mensajes de error o códigos de estado
- Los tests de challenges necesitan revisión de TEST_IDS

---

**Fecha:** 2025-01-28  
**Última ejecución:** 09:44:36  
**Duración:** 76.50s

