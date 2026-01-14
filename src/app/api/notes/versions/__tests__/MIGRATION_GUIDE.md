# 🔄 Guía de Migración - Aplicar Test Helpers Enterprise

Esta guía explica cómo migrar archivos de test existentes para usar los helpers enterprise.

## 📋 Checklist de Migración

### Paso 1: Importar Helpers

**Antes:**
```typescript
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
```

**Después:**
```typescript
import {
  TEST_IDS,
  setupAuthenticatedUser,
  setupStudyNote,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../__tests__/test-helpers'
import { prisma } from '@/lib/prisma'
```

### Paso 2: Reemplazar Setup de Autenticación

**Antes:**
```typescript
const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
  email: 'test@example.com',
  student: {
    id: 'student-1',
    nombre: 'Test Student',
  },
} as any)
```

**Después:**
```typescript
await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
```

### Paso 3: Reemplazar Setup de Notas

**Antes:**
```typescript
vi.mocked(prisma.studyNote.findFirst).mockResolvedValue({
  id: 'c123456789012345678901234',
  studentId: 'student-1',
} as any)
```

**Después:**
```typescript
setupStudyNote({
  id: TEST_IDS.NOTE,
  studentId: TEST_IDS.STUDENT,
} as any)
```

O mejor aún, usar el factory:
```typescript
import { createStudyNote } from '../__tests__/test-helpers'
setupStudyNote(createStudyNote())
```

### Paso 4: Reemplazar `new NextRequest`

**Antes:**
```typescript
const request = new NextRequest(
  'http://localhost/api/notes/versions/comments?noteId=c123&versionId=c456'
)
```

**Después:**
```typescript
const request = createTestRequest({
  baseUrl: 'http://localhost/api/notes/versions/comments',
  queryParams: {
    noteId: TEST_IDS.NOTE,
    versionId: TEST_IDS.VERSION,
  },
})
```

**Para POST/PATCH con body:**
```typescript
// Antes
const request = new NextRequest('http://localhost/api/notes/versions/comments', {
  method: 'POST',
  body: JSON.stringify({ noteId: 'c123', comment: 'Test' }),
})

// Después
const request = createTestRequest({
  baseUrl: 'http://localhost/api/notes/versions/comments',
  method: 'POST',
  body: { noteId: TEST_IDS.NOTE, comment: 'Test' },
})
```

### Paso 5: Reemplazar `await response.json()`

**Antes:**
```typescript
const response = await GET(request)
const data = await response.json()
expect(response.status).toBe(200)
expect(data.comments).toBeDefined()
```

**Después:**
```typescript
const response = await GET(request)
const data = await assertSuccessResponse(response)
expect(data.comments).toBeDefined()
```

**Para errores:**
```typescript
// Antes
const response = await GET(request)
const data = await response.json()
expect(response.status).toBe(404)
expect(data.error).toBe('Nota no encontrada')

// Después
const response = await GET(request)
await assertErrorResponse(response, 404, 'Nota no encontrada')
```

### Paso 6: Reemplazar IDs Hardcodeados

**Antes:**
```typescript
const NOTE_ID = 'c123456789012345678901234'
const VERSION_ID = 'c987654321098765432109876'
```

**Después:**
```typescript
import { TEST_IDS } from '../__tests__/test-helpers'
// Usar TEST_IDS.NOTE, TEST_IDS.VERSION, etc.
```

## 📝 Ejemplo Completo de Migración

### Archivo Original

```typescript
it('debe retornar comentarios de una versión', async () => {
  const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
    email: 'test@example.com',
    student: {
      id: 'student-1',
      nombre: 'Test Student',
    },
  } as any)

  vi.mocked(prisma.studyNote.findFirst).mockResolvedValue({
    id: 'c123456789012345678901234',
    studentId: 'student-1',
  } as any)

  vi.mocked(prisma.versionComment.findMany).mockResolvedValue([
    {
      id: 'comment-1',
      comment: 'Este es un comentario',
      createdBy: 'student-1',
      createdAt: new Date(),
    },
  ] as any)

  const request = new NextRequest(
    'http://localhost/api/notes/versions/comments?noteId=c123456789012345678901234&versionId=c987654321098765432109876'
  )

  const response = await GET(request)
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data.comments).toBeDefined()
  expect(Array.isArray(data.comments)).toBe(true)
})
```

### Archivo Migrado

```typescript
it('debe retornar comentarios de una versión', async () => {
  await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

  setupStudyNote({
    id: TEST_IDS.NOTE,
    studentId: TEST_IDS.STUDENT,
  } as any)

  vi.mocked(prisma.versionComment.findMany).mockResolvedValue([
    {
      id: 'comment-1',
      comment: 'Este es un comentario',
      createdBy: TEST_IDS.STUDENT,
      createdAt: new Date(),
    },
  ] as any)

  const request = createTestRequest({
    baseUrl: 'http://localhost/api/notes/versions/comments',
    queryParams: {
      noteId: TEST_IDS.NOTE,
      versionId: TEST_IDS.VERSION,
    },
  })

  const response = await GET(request)
  const data = await assertSuccessResponse(response)

  expect(data.comments).toBeDefined()
  expect(Array.isArray(data.comments)).toBe(true)
})
```

## 🎯 Beneficios de la Migración

1. **Menos código:** ~30-40% menos líneas por test
2. **Más legible:** Intención del código más clara
3. **Más mantenible:** Cambios centralizados
4. **Type safe:** Tipos TypeScript en toda la API
5. **Consistente:** Todos los tests siguen el mismo patrón

## 📚 Archivos Pendientes de Migración

- [ ] `comments/route.test.ts`
- [ ] `compare/route.test.ts`
- [ ] `metrics/route.test.ts`
- [ ] `export/route.test.ts`
- [ ] `export-bulk/route.test.ts`
- [ ] `export-diff/route.test.ts`
- [ ] `timeline/route.test.ts`
- [ ] `share/route.test.ts`
- [ ] `merge/route.test.ts`
- [ ] `analytics/route.test.ts`
- [ ] `semantic-search/route.test.ts`
- [ ] `compress/route.test.ts`
- [ ] `history/route.test.ts`

## ⚠️ Notas Importantes

1. **Rutas personalizadas:** Usar `baseUrl` en `createTestRequest` para rutas diferentes
2. **Mocks específicos:** Algunos tests pueden necesitar mocks adicionales que no están en los helpers
3. **Compatibilidad:** Los helpers son compatibles con código existente, puedes migrar gradualmente
4. **Testing:** Después de migrar, ejecutar los tests para verificar que todo funciona

## 🚀 Comenzar Migración

1. Elegir un archivo de test
2. Seguir los pasos del checklist
3. Ejecutar tests para verificar
4. Repetir para otros archivos

