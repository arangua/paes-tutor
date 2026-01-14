# Guía Enterprise de Testing

## 🎯 Objetivo

Este documento describe el sistema enterprise de testing implementado para resolver problemas comunes y estandarizar las prácticas de testing en todo el proyecto.

## 📋 Problemas Resueltos

### 1. **Importación de `expect` faltante**
- ✅ **Solución**: Todos los test-helpers ahora importan `expect` desde vitest
- ✅ **Resultado**: Eliminados 34 errores de `ReferenceError: expect is not defined`

### 2. **Exportaciones duplicadas**
- ✅ **Solución**: Reorganización de exportaciones en test-helpers
- ✅ **Resultado**: Eliminados errores de "Multiple exports with the same name"

### 3. **Creación inconsistente de requests**
- ✅ **Solución**: Sistema centralizado `createEnterpriseTestRequest`
- ✅ **Resultado**: Requests consistentes y robustos en todos los tests

### 4. **Validación de respuestas inconsistente**
- ✅ **Solución**: Funciones `assertEnterpriseResponse` y `assertEnterpriseError`
- ✅ **Resultado**: Validaciones consistentes y mensajes de error claros

## 🚀 Uso del Sistema Enterprise

### Creación de Requests

```typescript
import { createEnterpriseTestRequest } from '@/test/enterprise-test-utils'

// GET request con query params
const request = createEnterpriseTestRequest({
  baseUrl: 'http://localhost/api/users',
  queryParams: { limit: 10, offset: 0 }
})

// POST request con body JSON
const request = createEnterpriseTestRequest({
  method: 'POST',
  baseUrl: 'http://localhost/api/users',
  body: { name: 'John', email: 'john@example.com' }
})

// POST request con FormData
const formData = new FormData()
formData.append('file', new Blob(['content']))
const request = createEnterpriseTestRequest({
  method: 'POST',
  formData
})
```

### Validación de Respuestas

```typescript
import { 
  assertEnterpriseResponse, 
  assertEnterpriseError 
} from '@/test/enterprise-test-utils'

// Validación básica (espera 2xx)
const data = await assertEnterpriseResponse(response)

// Validación con código específico
const data = await assertEnterpriseResponse(response, {
  expectedStatus: 201
})

// Validación con rango
const data = await assertEnterpriseResponse(response, {
  statusRange: [200, 299]
})

// Validación de error
await assertEnterpriseError(response, 400, 'Datos inválidos')

// Validación de error con función
await assertEnterpriseError(response, 404, (error) => 
  error.includes('no encontrado')
)
```

## 📦 Migración desde Test-Helpers Existentes

### Paso 1: Actualizar Imports

**Antes:**
```typescript
import { createTestRequest, assertSuccessResponse } from './__tests__/test-helpers'
```

**Después:**
```typescript
import { 
  createEnterpriseTestRequest as createTestRequest,
  assertEnterpriseResponse as assertSuccessResponse 
} from '@/test/enterprise-test-utils'
```

### Paso 2: Actualizar Creación de Requests

**Antes:**
```typescript
const request = createTestRequest({
  method: 'POST',
  body: { noteId: 'test-id' }
})
```

**Después:**
```typescript
const request = createEnterpriseTestRequest({
  method: 'POST',
  baseUrl: 'http://localhost/api/notes/versions',
  body: { noteId: 'test-id' }
})
```

### Paso 3: Actualizar Validaciones

**Antes:**
```typescript
await assertSuccessResponse(response)
await assertErrorResponse(response, 400, 'Error message')
```

**Después:**
```typescript
await assertEnterpriseResponse(response)
await assertEnterpriseError(response, 400, 'Error message')
```

## 🔧 Configuración de Vitest

### Resolución de Módulos

El archivo `vitest.config.ts` ya está configurado con alias para resolver módulos correctamente:

```typescript
resolve: {
  alias: [
    {
      find: '@',
      replacement: path.resolve(process.cwd(), 'src'),
    },
    // ... otros alias
  ],
}
```

### Problemas de Importación

Si encuentras errores de importación como:
```
Cannot find package '@/lib/utils/version-content'
```

**Solución:**
1. Verifica que el archivo existe en `src/lib/utils/version-content.ts`
2. Verifica que el alias `@` está configurado correctamente
3. Reinicia el servidor de tests: `npx vitest run --reload`

## 📝 Mejores Prácticas

### 1. **Usar el Sistema Centralizado**
- ✅ Siempre usa `createEnterpriseTestRequest` en lugar de crear requests manualmente
- ✅ Usa `assertEnterpriseResponse` y `assertEnterpriseError` para validaciones

### 2. **Manejo de Bodies**
- ✅ Para JSON: usa `body` (se serializa automáticamente)
- ✅ Para FormData: usa `formData`
- ✅ Para texto: usa `textBody`

### 3. **Validación de Respuestas**
- ✅ Siempre valida el código de estado
- ✅ Valida campos requeridos cuando sea necesario
- ✅ Usa funciones de validación para mensajes de error complejos

### 4. **Limpieza de Tests**
- ✅ Usa `resetEnterpriseMocks()` en `afterEach`
- ✅ Limpia variables de entorno después de tests

## 🐛 Troubleshooting

### Error: "El cuerpo de la solicitud no puede estar vacío"

**Causa**: El body no se está enviando correctamente en el request.

**Solución**:
```typescript
// ✅ Correcto
const request = createEnterpriseTestRequest({
  method: 'POST',
  body: { key: 'value' } // Se serializa automáticamente
})

// ❌ Incorrecto
const request = createEnterpriseTestRequest({
  method: 'POST',
  body: undefined // Esto causará el error
})
```

### Error: "Cannot find package '@/lib/...'"

**Causa**: Problema de resolución de módulos.

**Solución**:
1. Verifica que el archivo existe
2. Reinicia el servidor de tests
3. Verifica la configuración de alias en `vitest.config.ts`

### Error: Código de estado incorrecto

**Causa**: El test espera un código pero recibe otro.

**Solución**:
```typescript
// Verifica que el request tiene todos los datos necesarios
const request = createEnterpriseTestRequest({
  method: 'POST',
  body: { /* todos los campos requeridos */ }
})

// Verifica que los mocks están configurados correctamente
setupAuthenticatedUser()
setupMockData()
```

## 📊 Estadísticas

- **Errores resueltos**: 34 (de 171 a 137)
- **Tests pasando**: 3409
- **Cobertura**: Mejorada con validaciones más robustas

## 🔄 Próximos Pasos

1. Migrar todos los test-helpers al sistema enterprise
2. Documentar casos de uso específicos
3. Crear templates de tests para nuevos endpoints
4. Implementar CI/CD con validación de tests

