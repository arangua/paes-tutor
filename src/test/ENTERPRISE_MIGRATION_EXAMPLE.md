# Ejemplo de Migración al Sistema Enterprise

Este documento muestra cómo migrar un test existente al nuevo sistema enterprise.

## 📝 Test Original

```typescript
// src/app/api/notes/versions/semantic-search/route.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../semantic-search/route'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  TEST_IDS,
  createStudyNote,
  setupStudyNote,
} from '../__tests__/test-helpers'

describe('POST /api/notes/versions/semantic-search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar error si no hay API key configurada', async () => {
    delete process.env.OPENAI_API_KEY

    const { getAIConfig } = await import('@/lib/ai-service')
    vi.mocked(getAIConfig).mockResolvedValue(null)

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'API key de OpenAI no configurada')
  })
})
```

## ✅ Test Migrado

```typescript
// src/app/api/notes/versions/semantic-search/route.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../semantic-search/route'
import {
  createEnterpriseTestRequest,
  assertEnterpriseError,
  setupTestEnv,
} from '@/test/enterprise-test-utils'
import {
  TEST_IDS,
  createStudyNote,
  setupStudyNote,
} from '../__tests__/test-helpers'

describe('POST /api/notes/versions/semantic-search', () => {
  let cleanupEnv: (() => void) | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    // Limpiar variables de entorno de tests anteriores
    cleanupEnv?.()
  })

  afterEach(() => {
    cleanupEnv?.()
  })

  it('debe retornar error si no hay API key configurada', async () => {
    // ✅ Enterprise: Usar setupTestEnv para manejar variables de entorno
    cleanupEnv = setupTestEnv({
      OPENAI_API_KEY: undefined,
    })

    const { getAIConfig } = await import('@/lib/ai-service')
    vi.mocked(getAIConfig).mockResolvedValue(null)

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    // ✅ Enterprise: Usar createEnterpriseTestRequest
    const request = createEnterpriseTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    // ✅ Enterprise: Usar assertEnterpriseError
    await assertEnterpriseError(
      response,
      400,
      'API key de OpenAI no configurada'
    )
  })
})
```

## 🔄 Cambios Principales

### 1. **Imports Actualizados**
```typescript
// ❌ Antes
import { createTestRequest, assertErrorResponse } from '../__tests__/test-helpers'

// ✅ Después
import {
  createEnterpriseTestRequest,
  assertEnterpriseError,
  setupTestEnv,
} from '@/test/enterprise-test-utils'
```

### 2. **Creación de Requests**
```typescript
// ❌ Antes
const request = createTestRequest({
  baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
  method: 'POST',
  body: { noteId: TEST_IDS.NOTE, query: 'test' },
})

// ✅ Después (mismo código, pero más robusto internamente)
const request = createEnterpriseTestRequest({
  baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
  method: 'POST',
  body: { noteId: TEST_IDS.NOTE, query: 'test' },
})
```

### 3. **Validación de Respuestas**
```typescript
// ❌ Antes
await assertErrorResponse(response, 400, 'API key de OpenAI no configurada')

// ✅ Después
await assertEnterpriseError(
  response,
  400,
  'API key de OpenAI no configurada'
)
```

### 4. **Manejo de Variables de Entorno**
```typescript
// ❌ Antes
delete process.env.OPENAI_API_KEY

// ✅ Después
cleanupEnv = setupTestEnv({
  OPENAI_API_KEY: undefined,
})
// ... en afterEach
cleanupEnv?.()
```

## 📊 Beneficios de la Migración

1. **Consistencia**: Todos los tests usan las mismas utilidades
2. **Robustez**: Mejor manejo de errores y validaciones
3. **Mantenibilidad**: Cambios centralizados en un solo lugar
4. **Debugging**: Mensajes de error más descriptivos
5. **Type Safety**: Mejor tipado TypeScript

## 🚀 Próximos Pasos

1. Migrar tests críticos primero
2. Validar que todos los tests pasan
3. Migrar tests restantes gradualmente
4. Actualizar documentación de nuevos tests

