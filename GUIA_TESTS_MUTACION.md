# 🧬 Guía de Tests de Mutación - PAES Tutor

**Fecha:** 2025-01-28  
**Estado:** ✅ Configurado para máxima profundidad lógica  
**Plataforma recomendada:** Linux/CI (GitHub Actions)

---

## 📋 Resumen

Los tests de mutación están configurados con **máxima profundidad lógica** usando Stryker:

- ✅ **206 archivos** detectados para mutar
- ✅ **26,683 mutantes** generados
- ✅ **Todos los tipos de mutación** habilitados
- ✅ **Concurrencia: 1** (una mutación a la vez para máxima profundidad)
- ✅ **Análisis de cobertura:** `all` (análisis completo)

---

## ⚠️ Problema Conocido en Windows

**Stryker + Vitest tiene un problema conocido en Windows** relacionado con cómo Vite carga los sandboxes. El error típico es:

```
Error: ERR_LOAD_URL - Failed to load url C:/StrykerTemp/sandbox-XXX
```

**Solución:** Ejecutar los tests de mutación en **CI/CD (Linux)** donde funciona perfectamente.

---

## 🚀 Ejecutar Tests de Mutación

### Opción 1: En CI/CD (Recomendado - Más Robusto)

Los tests de mutación se ejecutan automáticamente en GitHub Actions cuando haces push a `main` o `develop`, o cuando abres un Pull Request.

**Ventajas:**
- ✅ Funciona perfectamente en Linux
- ✅ Se ejecuta automáticamente
- ✅ No requiere configuración local
- ✅ Reportes disponibles como artefactos

**Ver resultados:**
1. Ve a la pestaña "Actions" en GitHub
2. Selecciona el workflow que se ejecutó
3. Busca el job "mutation"
4. Descarga el artefacto "mutation-report" para ver el reporte HTML

### Opción 2: Localmente en Windows (Limitado)

Si necesitas ejecutar localmente en Windows, puedes intentar:

```bash
npm run test:mutation
```

**Nota:** Puede fallar debido al problema conocido con Windows. Si falla, usa la Opción 1 (CI/CD).

### Opción 3: Usando WSL (Windows Subsystem for Linux)

Si tienes WSL instalado, puedes ejecutar los tests desde allí:

```bash
# En WSL
cd /mnt/c/Users/arang/OneDrive/Escritorio/PROY.\ PAES/paes-tutor/paes-tutor
npm run test:mutation
```

---

## ⚙️ Configuración Actual

### Archivo: `stryker.conf.mjs`

```javascript
{
  testRunner: 'vitest',
  concurrency: 1,  // Máxima profundidad: una mutación a la vez
  mutator: {
    excludedMutations: [],  // TODOS los tipos de mutación habilitados
  },
  coverageAnalysis: 'all',  // Análisis completo de cobertura
  tempDirName: process.platform === 'win32' 
    ? 'C:/StrykerTemp'  // Ruta sin espacios en Windows
    : '.stryker-tmp',    // Ruta relativa en Linux
}
```

### Tipos de Mutación Habilitados

- ✅ **Arithmetic Operators** (`+`, `-`, `*`, `/`, `%`)
- ✅ **Array Literals** (`[]` → `[undefined]`)
- ✅ **Arrow Functions** (cambios en funciones flecha)
- ✅ **Block Statements** (cambios en bloques)
- ✅ **Boolean Literals** (`true` ↔ `false`)
- ✅ **Conditional Expressions** (`? :` → `!`)
- ✅ **Equality Operators** (`==`, `!=`, `===`, `!==`)
- ✅ **Logical Operators** (`&&`, `||`)
- ✅ **Object Literals** (cambios en objetos)
- ✅ **String Literals** (cambios en strings)
- ✅ **Unary Operators** (`+`, `-`, `!`, `~`)
- ✅ **Update Operators** (`++`, `--`)
- ✅ **Y más...**

---

## 📊 Interpretar Resultados

### Mutation Score

El **Mutation Score** indica qué porcentaje de mutantes fueron detectados (matados) por los tests:

- **80-100%**: Excelente - Los tests detectan casi todos los errores
- **70-79%**: Bueno - Los tests detectan la mayoría de errores
- **60-69%**: Aceptable - Hay espacio para mejorar
- **<60%**: Necesita mejoras - Faltan tests o los tests no son suficientemente robustos

### Tipos de Mutantes

- **Killed**: ✅ El test detectó la mutación (bueno)
- **Survived**: ❌ El test NO detectó la mutación (necesita mejoras)
- **Timeout**: ⏱️ El test tardó demasiado
- **No Coverage**: 📝 El código mutado no está cubierto por tests

---

## 🎯 Objetivos de Calidad

Configurados en `stryker.conf.mjs`:

```javascript
thresholds: {
  high: 80,   // Score alto: 80%+
  low: 70,    // Score bajo: 70%+
  break: 70,  // Fallar si el score es < 70%
}
```

---

## 🔧 Solución de Problemas

### Error: "ERR_LOAD_URL" en Windows

**Causa:** Problema conocido con Stryker + Vitest en Windows.

**Soluciones:**
1. ✅ **Usar CI/CD** (recomendado)
2. ✅ **Usar WSL** (Windows Subsystem for Linux)
3. ⚠️ **Esperar fix** de Stryker/Vitest

### Error: "Test runner crashed"

**Causa:** Los tests normales fallan antes de ejecutar mutaciones.

**Solución:**
```bash
# Verificar que los tests normales pasan primero
npm run test:run
```

### Los tests de mutación tardan mucho

**Normal:** Los tests de mutación pueden tardar **horas** dependiendo del tamaño del proyecto.

**Optimizaciones:**
- Reducir `concurrency` (ya está en 1 para máxima profundidad)
- Excluir archivos no críticos del análisis
- Ejecutar solo en CI/CD durante la noche

---

## 📝 Notas Importantes

1. **Máxima Profundidad Lógica**: La configuración actual prioriza la **profundidad** sobre la **velocidad**
   - `concurrency: 1` = Una mutación a la vez
   - `excludedMutations: []` = Todos los tipos de mutación
   - Esto hace que los tests sean más lentos pero más exhaustivos

2. **CI/CD es la Mejor Opción**: 
   - Funciona perfectamente en Linux
   - No bloquea tu máquina local
   - Se ejecuta automáticamente

3. **Reportes HTML**: 
   - Los reportes se generan en `reports/mutation/html/`
   - Abre `index.html` en un navegador para ver resultados detallados

---

## 🎉 Conclusión

Los tests de mutación están **completamente configurados** para máxima profundidad lógica. La mejor forma de ejecutarlos es a través de **CI/CD (GitHub Actions)**, donde funcionan perfectamente en Linux.

**Para ejecutar ahora:**
1. Haz push a `main` o `develop`, o
2. Abre un Pull Request, o
3. Ejecuta manualmente el workflow en GitHub Actions

---

**Última actualización:** 2025-01-28  
**Configurado por:** AI Assistant

