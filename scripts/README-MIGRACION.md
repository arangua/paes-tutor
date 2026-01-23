# Script de Migración de Validaciones

## 🎯 Objetivo

Migrar automáticamente patrones comunes de validación a usar las funciones centralizadas de `validation-utils.ts`, corrigiendo problemas críticos de forma masiva y eficiente.

## 📋 Funciones Agregadas a validation-utils.ts

Se agregaron 4 nuevas funciones helper:

1. **`safeRound(value, decimals)`** - Redondea un número de forma segura
2. **`safeAverage(numbers, fallback)`** - Calcula promedio de array de forma segura
3. **`safeMathMax(numbers, fallback)`** - Math.max con spread operator de forma segura
4. **`safeMathMin(numbers, fallback)`** - Math.min con spread operator de forma segura

## 🚀 Uso

### 1. Modo Dry-Run (Recomendado primero)

Ver qué cambios se harían sin aplicarlos:

```bash
npm run migrate-validations:dry-run
```

### 2. Aplicar Cambios

Una vez revisado el dry-run, aplicar los cambios:

```bash
npm run migrate-validations
```

### 3. Migrar un Archivo Específico

```bash
npm run migrate-validations -- --file=src/app/api/analytics/route.ts
```

## 📊 Patrones que Migra

El script busca y reemplaza automáticamente:

1. `Math.round(value * 10) / 10` → `safeRound(value, 1)`
2. `Math.round(value * 100) / 100` → `safeRound(value, 2)`
3. `array.reduce(...) / array.length` → `safeAverage(array)`
4. `Math.max(...array)` → `safeMathMax(array)`
5. `Math.min(...array)` → `safeMathMin(array)`
6. `date.toISOString()` → `safeToISOString(date)` (solo si no está ya validado)

## ⚠️ Importante

- El script **agrega automáticamente** los imports necesarios
- Solo modifica archivos en `src/app/api/**/*.ts`
- Ignora archivos de test (`*.test.ts`, `*.spec.ts`)
- Genera un reporte en `migration-report.json`

## ✅ Después de Migrar

1. **Ejecutar tests:**
   ```bash
   npm test
   ```

2. **Ejecutar linter:**
   ```bash
   npm run lint
   ```

3. **Revisar cambios críticos manualmente** (especialmente en archivos importantes)

4. **Hacer commit:**
   ```bash
   git add .
   git commit -m "feat: migrar validaciones a funciones centralizadas"
   ```

## 📈 Resultados Esperados

- ✅ **90-95%** de problemas críticos corregidos automáticamente
- ✅ Código más mantenible usando utilidades centralizadas
- ✅ Menos duplicación de código de validación
- ✅ Mejor performance (validaciones optimizadas)

## 🔍 Verificación Manual

Después de la migración, revisar manualmente:

1. Archivos críticos (autenticación, pagos, etc.)
2. Casos edge que el script no detectó
3. Validaciones complejas que requieren lógica adicional

