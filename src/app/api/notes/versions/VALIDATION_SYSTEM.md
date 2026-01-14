# Sistema de Validación Centralizado

## 📋 Descripción

Este documento describe el sistema de validación centralizado implementado para mejorar la robustez, mantenibilidad y consistencia del código.

## 🎯 Objetivos

1. **Reducir duplicación**: Centralizar validaciones comunes en funciones reutilizables
2. **Mejorar mantenibilidad**: Cambios en lógica de validación se hacen en un solo lugar
3. **Facilitar testing**: Funciones de validación aisladas son más fáciles de testear
4. **Proporcionar consistencia**: Mismo comportamiento de validación en toda la aplicación
5. **Rastrear performance**: Métricas integradas para monitorear el impacto de validaciones

## 📁 Estructura

### `validation-utils.ts`

Módulo principal que contiene todas las funciones de validación centralizadas.

#### Categorías de Validaciones

1. **Validaciones de Tipos Básicos**
   - `ensureFiniteNumber()`: Valida y normaliza números finitos
   - `ensurePositiveNumber()`: Valida números positivos
   - `ensureInteger()`: Valida números enteros
   - `ensureNonEmptyString()`: Valida strings no vacíos
   - `ensureArray()`: Valida arrays
   - `ensureObject()`: Valida objetos (no arrays)
   - `ensureValidDate()`: Valida fechas

2. **Validaciones de Operaciones Comunes**
   - `safeArrayOperation()`: Ejecuta operaciones de array de forma segura
   - `safeStringOperation()`: Ejecuta operaciones de string de forma segura
   - `safeMathOperation()`: Ejecuta operaciones matemáticas de forma segura

3. **Validaciones de Fechas**
   - `safeToISOString()`: Convierte fecha a ISO string de forma segura
   - `safeToISODate()`: Extrae parte de fecha (YYYY-MM-DD) de forma segura

4. **Validaciones de Promesas**
   - `isPromise()`: Verifica si un valor es una Promise
   - `ensurePromiseArray()`: Valida array de promesas

5. **Validaciones de Estructuras de Datos**
   - `ensureMap()`: Valida Maps
   - `ensureSet()`: Valida Sets
   - `ensureBuffer()`: Valida Buffers

6. **Métricas de Performance**
   - `withValidationMetrics()`: Ejecuta validación con métricas
   - `getValidationMetrics()`: Obtiene métricas acumuladas
   - `resetValidationMetrics()`: Resetea métricas

## 🔧 Uso

### Ejemplo Básico

```typescript
import { ensureFiniteNumber, ensureNonEmptyString } from './validation-utils'

// Antes (código duplicado)
const safeCount = Number.isFinite(count) ? count : 0
const safeTitle = typeof title === 'string' && title.length > 0 ? title : 'Sin título'

// Después (usando sistema centralizado)
const safeCount = ensureFiniteNumber(count, 0)
const safeTitle = ensureNonEmptyString(title, 'Sin título')
```

### Ejemplos Adicionales

#### Validación en Handlers de API

```typescript
import { ensureArray, ensureNonEmptyString, ensureFiniteNumber } from './validation-utils'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Validar array de IDs
  const versionIds = ensureArray(body.versionIds, [])
  if (versionIds.length === 0) {
    return NextResponse.json({ error: 'Se requieren IDs' }, { status: 400 })
  }
  
  // Validar título
  const title = ensureNonEmptyString(body.title, 'Sin título')
  
  // Validar límite
  const limit = ensureFiniteNumber(body.limit, 10)
  
  // ... resto del código
}
```

#### Validación en Procesamiento de Datos

```typescript
import { safeArrayOperation, safeStringOperation } from './validation-utils'

function processVersions(versions: unknown[]) {
  // Procesar array de forma segura
  return safeArrayOperation(
    versions,
    arr => arr
      .filter(v => v !== null)
      .map(v => ({
        id: v.id,
        title: safeStringOperation(v.title, s => s.trim(), 'Sin título'),
      })),
    []
  )
}
```

#### Validación de Fechas en Queries

```typescript
import { ensureValidDate, safeToISODate } from './validation-utils'

function buildDateFilter(dateString: string) {
  const safeDate = ensureValidDate(dateString)
  const isoDate = safeToISODate(safeDate)
  
  return {
    gte: new Date(`${isoDate}T00:00:00Z`),
    lte: new Date(`${isoDate}T23:59:59Z`),
  }
}
```

#### Validación con Métricas

```typescript
import { withValidationMetrics, ensureFiniteNumber } from './validation-utils'

function calculateTotal(values: unknown[]): number {
  return withValidationMetrics('calculateTotal', () => {
    return values.reduce((acc, v) => {
      return acc + ensureFiniteNumber(v, 0)
    }, 0)
  })
}

// Obtener métricas después de ejecutar
const metrics = getValidationMetrics()
console.log(`calculateTotal ejecutado ${metrics.counts['calculateTotal']} veces`)
console.log(`Duración promedio: ${metrics.averageDurations['calculateTotal']}ms`)
```

### Ejemplo con Métricas

```typescript
import { withValidationMetrics, ensureFiniteNumber } from './validation-utils'

function calculateTotal(values: unknown[]): number {
  return withValidationMetrics('calculateTotal', () => {
    return values.reduce((acc, v) => {
      return acc + ensureFiniteNumber(v, 0)
    }, 0)
  })
}

// Obtener métricas
const metrics = getValidationMetrics()
console.log(metrics.counts['calculateTotal']) // Número de veces ejecutado
console.log(metrics.averageDurations['calculateTotal']) // Duración promedio
```

### Ejemplo con Operaciones Seguras

```typescript
import { safeArrayOperation, safeStringOperation } from './validation-utils'

// Operación de array segura
const doubled = safeArrayOperation(
  numbers,
  arr => arr.map(n => n * 2),
  []
)

// Operación de string segura
const preview = safeStringOperation(
  content,
  s => s.substring(0, 200) + (s.length > 200 ? '...' : ''),
  ''
)
```

## 📊 Decisiones de Diseño

### 1. Funciones con Fallback

**Decisión**: Todas las funciones de validación aceptan un parámetro `fallback` que se usa cuando la validación falla.

**Razón**: Proporciona un comportamiento predecible y evita errores en tiempo de ejecución.

**Ejemplo**:
```typescript
const safeValue = ensureFiniteNumber(userInput, 0) // Siempre retorna un número
```

### 2. Métricas de Performance Integradas

**Decisión**: Sistema de métricas opcional que rastrea el tiempo y frecuencia de validaciones.

**Razón**: Permite identificar validaciones que pueden estar impactando el performance.

**Uso**:
```typescript
const result = withValidationMetrics('operationName', () => {
  // código de validación
})
```

### 3. Validaciones Defensivas

**Decisión**: Todas las funciones validan tanto el input como el output de operaciones.

**Razón**: Previene errores silenciosos y proporciona comportamiento robusto.

**Ejemplo**:
```typescript
function ensureFiniteNumber(value: unknown, fallback: number = 0): number {
  // Valida input
  if (typeof value === 'number' && Number.isFinite(value)) {
    // Valida output antes de retornar
    return Number.isFinite(value) ? value : fallback
  }
  return fallback
}
```

### 4. Logging Consistente

**Decisión**: Todas las funciones de validación logean warnings cuando fallan.

**Razón**: Facilita debugging y monitoreo de problemas en producción.

**Ejemplo**:
```typescript
logger.warn(
  { value, fallback },
  'ensureFiniteNumber: valor inválido, usando fallback'
)
```

## 🧪 Testing

El archivo `validation-utils.test.ts` contiene tests unitarios completos para todas las funciones de validación.

### Ejecutar Tests

```bash
npm test validation-utils.test.ts
```

### Cobertura

- ✅ Todos los casos válidos
- ✅ Todos los casos inválidos
- ✅ Casos límite
- ✅ Valores null/undefined
- ✅ Tipos incorrectos
- ✅ Operaciones que fallan

## 📈 Métricas y Monitoreo

### Obtener Métricas

```typescript
import { getValidationMetrics } from './validation-utils'

const metrics = getValidationMetrics()
console.log(metrics.counts) // { 'operation1': 100, 'operation2': 50 }
console.log(metrics.averageDurations) // { 'operation1': 0.5, 'operation2': 1.2 }
```

### Resetear Métricas

```typescript
import { resetValidationMetrics } from './validation-utils'

resetValidationMetrics() // Útil para tests o reinicio de métricas
```

## 🔄 Migración

### Pasos para Migrar Código Existente

1. **Identificar validaciones duplicadas**
   ```typescript
   // Buscar patrones como:
   // Number.isFinite(x) ? x : 0
   // typeof x === 'string' && x.length > 0
   // Array.isArray(x) ? x : []
   ```

2. **Reemplazar con funciones centralizadas**
   ```typescript
   // Antes
   const safe = Number.isFinite(value) ? value : 0
   
   // Después
   import { ensureFiniteNumber } from './validation-utils'
   const safe = ensureFiniteNumber(value, 0)
   ```

3. **Agregar métricas donde sea apropiado**
   ```typescript
   // Para operaciones críticas o frecuentes
   const result = withValidationMetrics('operationName', () => {
     // código
   })
   ```

4. **Actualizar tests**
   - Los tests existentes deberían seguir funcionando
   - Agregar tests para nuevas funciones de validación

## ⚠️ Consideraciones

### Performance

- Las validaciones agregan overhead mínimo
- Las métricas agregan overhead adicional (solo usar donde sea necesario)
- Para operaciones de muy alto volumen, considerar validaciones lazy

### Mantenibilidad

- Documentar decisiones de diseño en comentarios
- Mantener funciones de validación simples y enfocadas
- Evitar lógica de negocio en funciones de validación

### Testing

- Todas las funciones deben tener tests unitarios
- Tests deben cubrir casos válidos, inválidos y límite
- Tests de integración para validar el sistema completo

## 📚 Referencias

- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Defensive Programming Best Practices](https://en.wikipedia.org/wiki/Defensive_programming)
- [JavaScript Validation Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

