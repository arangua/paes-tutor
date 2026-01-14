# Test Helpers - API de Versiones

Este directorio contiene utilidades y helpers para tests de la API de versiones, siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.

## 📁 Estructura

```
__tests__/
  ├── test-helpers.ts          # Funciones helper, factories y utilities
  ├── README.md                # Esta documentación
  ├── MIGRATION_GUIDE.md       # Guía de migración
  ├── REFACTORING_SUMMARY.md   # Resumen de refactorización
  ├── PROGRESS.md              # Seguimiento de progreso
  ├── ENTERPRISE_FEATURES.md   # Características enterprise
  └── ENTERPRISE_LEVEL.md      # Niveles enterprise
```

## 🚀 Uso Rápido

### Importar Helpers

```typescript
import {
  // Constantes
  TEST_IDS,
  // Factories
  createStudyNote,
  createStudyNoteVersion,
  // Setup functions
  setupAuthenticatedUser,
  setupSuccessfulGetTest,
  // Request utilities
  createTestRequest,
  // Assertion helpers
  assertSuccessResponse,
  assertErrorResponse,
  // Advanced features
  assertResponseMatches,
  measurePerformance,
  assertResponseTime,
  TestScenarioBuilder,
  // Premium features
  generateRandomCuid,
  generateRandomNote,
  generateRandomVersion,
  generateRandomVersions,
  ErrorScenarioBuilder,
  assertResponseSchema,
  assertResponseHasFields,
  assertResponseArray,
} from './__tests__/test-helpers'
```

### Ejemplo Básico

```typescript
it('debe retornar versiones de una nota', async () => {
  // Setup completo con defaults
  await setupSuccessfulGetTest({
    versionCount: 1,
    versions: [createStudyNoteVersion({ title: 'Version 1' })],
  })

  // Crear request
  const request = createTestRequest({
    queryParams: { noteId: TEST_IDS.NOTE },
  })

  // Ejecutar y validar
  const response = await GET(request)
  const data = await assertSuccessResponse(response)

  expect(data.versions).toBeDefined()
})
```

## 📚 API Reference

### Constantes

#### `TEST_IDS`
IDs de prueba predefinidos:
- `TEST_IDS.NOTE` - ID de nota de prueba
- `TEST_IDS.VERSION` - ID de versión de prueba
- `TEST_IDS.VERSION_2` - Segundo ID de versión
- `TEST_IDS.STUDENT` - ID de estudiante de prueba

### Factories

#### `createStudyNote(options?)`
Crea un objeto de nota de estudio para tests.

```typescript
const note = createStudyNote({
  title: 'Custom Title',
  content: 'Custom Content',
})
```

#### `createStudyNoteVersion(options?)`
Crea un objeto de versión de nota para tests.

```typescript
const version = createStudyNoteVersion({
  title: 'Important Version',
  isImportant: true,
})
```

#### `createMultipleVersions(count, baseOptions?)`
Crea múltiples versiones de prueba.

```typescript
const versions = createMultipleVersions(5, { isImportant: true })
```

### Setup Functions

#### `setupAuthenticatedUser(options?)`
Configura el mock de autenticación con un usuario autenticado.

```typescript
await setupAuthenticatedUser({ studentId: 'custom-id' })
```

#### `setupUnauthenticatedUser()`
Configura el mock de autenticación con un usuario NO autenticado.

```typescript
await setupUnauthenticatedUser()
```

#### `setupNoCache()`
Configura el mock de caché para retornar null.

```typescript
setupNoCache()
```

#### `setupCache(data)`
Configura el mock de caché con datos específicos.

```typescript
setupCache({ versions: [...], total: 10 })
```

#### `setupStudyNote(note)`
Configura el mock de la nota de estudio.

```typescript
setupStudyNote(createStudyNote({ title: 'Custom' }))
setupStudyNote(null) // Para simular nota no encontrada
```

#### `setupVersions(count, versions?)`
Configura los mocks de versiones.

```typescript
setupVersions(5, [
  createStudyNoteVersion({ id: 'v1' }),
  createStudyNoteVersion({ id: 'v2' }),
])
```

#### `setupSuccessfulGetTest(options?)`
Configura un setup completo para un test GET exitoso.

```typescript
await setupSuccessfulGetTest({
  versionCount: 5,
  versions: createMultipleVersions(5),
  cache: { versions: [...] }, // Opcional
})
```

### Request Utilities

#### `createTestRequest(options?)`
Crea un NextRequest para tests con query parameters y body opcionales.

```typescript
// GET con query params
const request = createTestRequest({
  queryParams: { noteId: TEST_IDS.NOTE, limit: 10 },
})

// POST con body
const request = createTestRequest({
  method: 'POST',
  body: { noteId: TEST_IDS.NOTE, versionId: TEST_IDS.VERSION },
})
```

### Assertion Helpers

#### `assertSuccessResponse(response, expectedStatus?)`
Valida que una respuesta sea exitosa.

```typescript
const data = await assertSuccessResponse(response)
expect(data.versions).toBeDefined()
```

#### `assertErrorResponse(response, expectedStatus, expectedError?)`
Valida que una respuesta tenga un error.

```typescript
await assertErrorResponse(response, 404, 'Nota no encontrada')
```

## 🎯 Mejores Prácticas

### 1. Usar Factories en lugar de objetos literales

❌ **Mal:**
```typescript
const version = {
  id: VALID_VERSION_ID,
  title: 'Version 1',
  content: 'Content',
  // ... muchos campos más
}
```

✅ **Bien:**
```typescript
const version = createStudyNoteVersion({
  title: 'Version 1',
  content: 'Content',
})
```

### 2. Usar `setupSuccessfulGetTest` para tests GET comunes

❌ **Mal:**
```typescript
await setupAuthenticatedUser()
setupNoCache()
setupStudyNote({ id: VALID_NOTE_ID, ... })
setupVersions(1, [{ id: VALID_VERSION_ID, ... }])
```

✅ **Bien:**
```typescript
await setupSuccessfulGetTest({
  versionCount: 1,
  versions: [createStudyNoteVersion()],
})
```

### 3. Usar `createTestRequest` en lugar de `new NextRequest`

❌ **Mal:**
```typescript
const request = new NextRequest(
  `http://localhost/api/notes/versions?noteId=${VALID_NOTE_ID}&limit=10`
)
```

✅ **Bien:**
```typescript
const request = createTestRequest({
  queryParams: { noteId: VALID_NOTE_ID, limit: 10 },
})
```

### 4. Usar assertion helpers para validaciones comunes

❌ **Mal:**
```typescript
const response = await GET(request)
const data = await response.json()
expect(response.status).toBe(200)
expect(data).toBeDefined()
```

✅ **Bien:**
```typescript
const response = await GET(request)
const data = await assertSuccessResponse(response)
```

## 🚀 Características Avanzadas (Enterprise Premium)

### Test Scenario Builder

```typescript
const scenario = new TestScenarioBuilder()
  .withAuth({ studentId: TEST_IDS.STUDENT })
  .withNote(createStudyNote())
  .withVersions(1, [createStudyNoteVersion()])
  .build()

await scenario.setup()
const request = scenario.createRequest({ queryParams: { noteId: TEST_IDS.NOTE } })
const response = await GET(request)
```

### Test Data Generators (Premium)

Genera datos aleatorios pero válidos para tests:

```typescript
// Generar datos aleatorios
const randomNote = generateRandomNote()
const randomVersion = generateRandomVersion()
const randomVersions = generateRandomVersions(10)
const randomCuid = generateRandomCuid()

// Con opciones personalizadas
const customNote = generateRandomNote({ title: 'Custom Title' })
```

### Error Scenario Builder (Premium)

Crea escenarios de error de forma declarativa:

```typescript
const errorScenario = new ErrorScenarioBuilder()
  .databaseError('Custom error message')
  .timeout(5000)
  .unauthorized()
  .studentNotFound()
  .noteNotFound()
  .build()

await errorScenario.apply()
```

### Schema Validation (Premium)

Valida la estructura de respuestas:

```typescript
// Validación con función
await assertResponseSchema(response, (data) => {
  expect(data).toHaveProperty('versions')
  expect(Array.isArray(data.versions)).toBe(true)
})

// Validación de campos requeridos
await assertResponseHasFields(response, ['versions', 'total', 'page'])

// Validación de arrays
await assertResponseArray(response, (item) => {
  expect(item).toHaveProperty('id')
  expect(item).toHaveProperty('title')
})
```

### Response Matching

```typescript
await assertResponseMatches(response, {
  versions: expect.arrayContaining([expect.any(Object)]),
  total: expect.any(Number)
})

// O con función personalizada
await assertResponseMatches(response, (data) => {
  return data.versions.length > 0 && data.total >= 0
})
```

### Performance Testing

```typescript
const { duration, result } = await measurePerformance(async () => {
  return await GET(request)
})

expect(duration).toBeLessThan(1000) // Menos de 1 segundo

// O directamente
await assertResponseTime(async () => GET(request), { max: 1000 })
```

## 🔧 Extensión

Para agregar nuevos helpers:

1. Agregar el helper en `test-helpers.ts`
2. Documentar con JSDoc
3. Agregar ejemplos de uso
4. Actualizar este README

## 📝 Notas

- Todos los helpers están completamente tipados con TypeScript
- Los factories usan valores por defecto sensatos
- Las funciones de setup son idempotentes (pueden llamarse múltiples veces)
- Los helpers siguen el principio DRY (Don't Repeat Yourself)

