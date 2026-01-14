# Guía de Migración al Sistema de Validación Centralizado

## 📋 Introducción

Esta guía te ayudará a migrar código existente para usar el sistema de validación centralizado (`validation-utils.ts`). El objetivo es reducir duplicación, mejorar consistencia y facilitar mantenimiento.

## 🎯 Beneficios de Migrar

- ✅ **Menos código duplicado**: Validaciones comunes en un solo lugar
- ✅ **Consistencia**: Mismo comportamiento en toda la aplicación
- ✅ **Mantenibilidad**: Cambios en un solo lugar
- ✅ **Métricas**: Rastreo automático de performance
- ✅ **Testing**: Funciones aisladas más fáciles de testear

## 📝 Patrones Comunes de Migración

### 1. Validación de Números

**Antes:**
```typescript
const safeCount = Number.isFinite(count) ? count : 0
const safeLength = typeof length === 'number' && Number.isFinite(length) && length > 0 ? length : 1
```

**Después:**
```typescript
import { ensureFiniteNumber, ensurePositiveNumber } from './validation-utils'

const safeCount = ensureFiniteNumber(count, 0)
const safeLength = ensurePositiveNumber(length, 1)
```

### 2. Validación de Strings

**Antes:**
```typescript
const safeTitle = typeof title === 'string' && title.length > 0 ? title : 'Sin título'
const trimmed = value ? value.trim() : ''
```

**Después:**
```typescript
import { ensureNonEmptyString } from './validation-utils'

const safeTitle = ensureNonEmptyString(title, 'Sin título')
const trimmed = ensureNonEmptyString(value, '', true) // true = aplicar trim
```

### 3. Validación de Arrays

**Antes:**
```typescript
if (!Array.isArray(items) || items.length === 0) {
  return []
}
const safeItems = items.filter(item => item !== null)
```

**Después:**
```typescript
import { ensureArray } from './validation-utils'

const safeItems = ensureArray(items, [])
const filtered = safeItems.filter(item => item !== null)
```

### 4. Validación de Objetos

**Antes:**
```typescript
if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
  return {}
}
```

**Después:**
```typescript
import { ensureObject } from './validation-utils'

const safeObj = ensureObject(obj, {})
```

### 5. Validación de Fechas

**Antes:**
```typescript
const date = new Date(dateString)
if (date instanceof Date && !Number.isNaN(date.getTime())) {
  const iso = date.toISOString()
  const datePart = iso.split('T')[0]
}
```

**Después:**
```typescript
import { ensureValidDate, safeToISODate } from './validation-utils'

const safeDate = ensureValidDate(dateString)
const datePart = safeToISODate(safeDate)
```

### 6. Operaciones Seguras

**Antes:**
```typescript
try {
  const result = array.map(x => x * 2)
  return result
} catch (error) {
  logger.warn({ error }, 'Error en map')
  return []
}
```

**Después:**
```typescript
import { safeArrayOperation } from './validation-utils'

const result = safeArrayOperation(
  array,
  arr => arr.map(x => x * 2),
  []
)
```

### 7. Operaciones de String Seguras

**Antes:**
```typescript
try {
  if (typeof str === 'string' && str.length > 0) {
    const upper = str.toUpperCase()
    return upper.substring(0, 100)
  }
} catch (error) {
  return ''
}
```

**Después:**
```typescript
import { safeStringOperation } from './validation-utils'

const result = safeStringOperation(
  str,
  s => s.toUpperCase().substring(0, 100),
  ''
)
```

### 8. Operaciones Matemáticas Seguras

**Antes:**
```typescript
const numbers = [1, 2, 3, NaN, 'invalid']
const validNumbers = numbers.filter(n => Number.isFinite(n))
const max = validNumbers.length > 0 ? Math.max(...validNumbers) : 0
```

**Después:**
```typescript
import { safeMathOperation } from './validation-utils'

const max = safeMathOperation(
  numbers,
  nums => Math.max(...nums),
  0
)
```

## 🔄 Proceso de Migración Paso a Paso

### Paso 1: Identificar Validaciones

Busca patrones como:
- `Number.isFinite(...) ? ... : ...`
- `typeof ... === 'string' && ...length > 0`
- `Array.isArray(...) ? ... : ...`
- `instanceof Date && !Number.isNaN(...getTime())`

### Paso 2: Importar Funciones Necesarias

```typescript
import {
  ensureFiniteNumber,
  ensureNonEmptyString,
  ensureArray,
  ensureObject,
  ensureValidDate,
  safeToISODate,
  safeStringOperation,
  safeArrayOperation,
  safeMathOperation,
} from './validation-utils'
```

### Paso 3: Reemplazar Validaciones

Reemplaza las validaciones manuales con las funciones del sistema centralizado.

### Paso 4: Agregar Métricas (Opcional)

Para operaciones críticas o frecuentes:

```typescript
import { withValidationMetrics } from './validation-utils'

const result = withValidationMetrics('operationName', () => {
  // tu código aquí
})
```

### Paso 5: Probar

Ejecuta los tests y verifica que todo funcione correctamente.

## 📚 Ejemplos Completos

### Ejemplo 1: Función de Procesamiento

**Antes:**
```typescript
function processItems(items: unknown[]): number {
  if (!Array.isArray(items)) {
    return 0
  }
  
  let total = 0
  for (const item of items) {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      const value = (item as { value: unknown }).value
      if (typeof value === 'number' && Number.isFinite(value)) {
        total += value
      }
    }
  }
  
  return Number.isFinite(total) ? total : 0
}
```

**Después:**
```typescript
import { ensureArray, ensureFiniteNumber, ensureObject } from './validation-utils'

function processItems(items: unknown[]): number {
  const safeItems = ensureArray(items, [])
  
  let total = 0
  for (const item of safeItems) {
    const safeItem = ensureObject(item, {})
    if ('value' in safeItem) {
      const value = ensureFiniteNumber(safeItem.value, 0)
      total += value
    }
  }
  
  return ensureFiniteNumber(total, 0)
}
```

### Ejemplo 2: Función de Formateo

**Antes:**
```typescript
function formatDate(date: unknown): string {
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    const iso = date.toISOString()
    if (typeof iso === 'string' && iso.length > 0) {
      const parts = iso.split('T')
      if (Array.isArray(parts) && parts.length > 0) {
        return parts[0]
      }
    }
  }
  return new Date().toISOString().split('T')[0]
}
```

**Después:**
```typescript
import { ensureValidDate, safeToISODate } from './validation-utils'

function formatDate(date: unknown): string {
  const safeDate = ensureValidDate(date)
  return safeToISODate(safeDate)
}
```

## ⚠️ Consideraciones Importantes

### 1. Fallbacks

Todas las funciones del sistema centralizado aceptan un parámetro `fallback`. Asegúrate de elegir valores por defecto apropiados:

```typescript
// ✅ Bueno: fallback apropiado
const count = ensureFiniteNumber(userInput, 0)

// ❌ Evitar: fallback que podría causar problemas
const count = ensureFiniteNumber(userInput, -1) // podría ser problemático
```

### 2. Performance

Para operaciones de muy alto volumen, considera usar validaciones lazy o cachear resultados:

```typescript
// Para operaciones frecuentes, usar withValidationMetrics
const result = withValidationMetrics('highVolumeOperation', () => {
  // código
})
```

### 3. Logging

El sistema centralizado logea warnings automáticamente. Si necesitas logging adicional, agrégalo después de la validación:

```typescript
const safeValue = ensureFiniteNumber(value, 0)
if (safeValue === 0 && value !== 0) {
  logger.warn({ value }, 'Valor inválido convertido a 0')
}
```

## 🧪 Testing

Después de migrar, asegúrate de:

1. **Ejecutar tests existentes**: Verifica que no se rompieron funcionalidades
2. **Agregar tests nuevos**: Si es necesario, agrega tests para casos límite
3. **Verificar métricas**: Usa `getValidationMetrics()` para verificar que las validaciones se están ejecutando

## 📊 Verificar Migración

Para verificar que la migración fue exitosa:

```typescript
import { getValidationMetrics } from './validation-utils'

// Después de ejecutar código migrado
const metrics = getValidationMetrics()
console.log(metrics.counts) // Debería mostrar las validaciones ejecutadas
```

## 🎯 Checklist de Migración

- [ ] Identificar todas las validaciones en el archivo
- [ ] Importar funciones necesarias de `validation-utils`
- [ ] Reemplazar validaciones manuales
- [ ] Agregar métricas donde sea apropiado
- [ ] Ejecutar tests
- [ ] Verificar que no hay regresiones
- [ ] Actualizar documentación si es necesario

## 📞 Soporte

Si tienes preguntas o encuentras problemas durante la migración:

1. Revisa la documentación en `VALIDATION_SYSTEM.md`
2. Consulta los ejemplos en este documento
3. Revisa código ya migrado como referencia (ej: `helpers.ts`, `filters.ts`)

## 🎉 Conclusión

Migrar al sistema de validación centralizado mejora significativamente la calidad y mantenibilidad del código. Sigue esta guía paso a paso y no dudes en consultar los ejemplos proporcionados.

