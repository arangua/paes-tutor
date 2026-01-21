# Ejemplos Prácticos - Enterprise Premium Framework

## 📚 Índice de Ejemplos

1. [Test Básico con Builder Pattern](#test-básico)
2. [Test con Validación Avanzada](#test-con-validación)
3. [Test con Mocks Avanzados](#test-con-mocks)
4. [Test de Performance](#test-de-performance)
5. [Test de Errores](#test-de-errores)
6. [Test Completo End-to-End](#test-completo)

## 🚀 Test Básico con Builder Pattern

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from '@/app/api/users/route'
import { request, validator } from '@/test/enterprise'
import { createTestUser } from '@/test/enterprise'

describe('POST /api/users', () => {
  it('debe crear un usuario correctamente', async () => {
    // Crear request con Builder Pattern
    const testRequest = request()
      .url('http://localhost/api/users')
      .method('POST')
      .body({
        email: 'test@example.com',
        name: 'Test User',
      })
      .header('Content-Type', 'application/json')
      .build()

    // Ejecutar endpoint
    const response = await POST(testRequest)

    // Validar respuesta
    const result = await validator()
      .status(201)
      .requires(['id', 'email', 'name'])
      .validate(response)

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('id')
    expect(result.data).toHaveProperty('email', 'test@example.com')
  })
})
```

## ✅ Test con Validación Avanzada

```typescript
import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/users/route'
import { request, validator } from '@/test/enterprise'
import { z } from 'zod'

// Schema de validación
const userSchema = z.object({
  id: z.string().regex(/^c[a-z0-9]{24}$/),
  email: z.email({ error: 'Invalid email' }),
  name: z.string().min(1),
  createdAt: z.date(),
})

describe('GET /api/users', () => {
  it('debe retornar usuarios con validación de schema', async () => {
    const testRequest = request()
      .url('http://localhost/api/users')
      .method('GET')
      .query({ limit: 10, offset: 0 })
      .build()

    const response = await GET(testRequest)

    // Validación avanzada con schema
    const result = await validator()
      .status(200)
      .schema(z.array(userSchema))
      .maxResponseTime(500)
      .contentType('application/json')
      .headers({
        'Content-Type': 'application/json',
      })
      .validate(response)

    expect(result.success).toBe(true)
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.metrics?.responseTime).toBeLessThan(500)
  })
})
```

## 🎭 Test con Mocks Avanzados

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/users/route'
import { request, mock, PrismaMockFactory, createTestUser } from '@/test/enterprise'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: PrismaMockFactory.create(),
}))

describe('GET /api/users con mocks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar usuarios desde mock de Prisma', async () => {
    // Configurar mock con datos
    const mockUsers = [
      createTestUser({ email: 'user1@example.com' }),
      createTestUser({ email: 'user2@example.com' }),
    ]

    const prismaMock = PrismaMockFactory.create()
    PrismaMockFactory.configure(prismaMock, {
      users: mockUsers,
    })

    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)

    const testRequest = request()
      .url('http://localhost/api/users')
      .method('GET')
      .build()

    const response = await GET(testRequest)

    const result = await validator()
      .status(200)
      .validate(response)

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1)
  })

  it('debe simular timeout en mock', async () => {
    // Mock con timeout
    const timeoutMock = mock()
      .timing({ timeout: true, delay: 6000 })
      .build()

    vi.mocked(prisma.user.findMany).mockImplementation(timeoutMock as any)

    const testRequest = request()
      .url('http://localhost/api/users')
      .method('GET')
      .timeout(5000)
      .build()

    await expect(GET(testRequest)).rejects.toThrow()
  })
})
```

## ⚡ Test de Performance

```typescript
import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/users/route'
import { request, validator } from '@/test/enterprise'

describe('Performance Tests', () => {
  it('debe responder en menos de 500ms', async () => {
    const testRequest = request()
      .url('http://localhost/api/users')
      .method('GET')
      .build()

    const startTime = Date.now()
    const response = await GET(testRequest)
    const endTime = Date.now()

    const result = await validator()
      .status(200)
      .maxResponseTime(500)
      .validate(response)

    expect(result.success).toBe(true)
    expect(result.metrics?.responseTime).toBeLessThan(500)
    expect(endTime - startTime).toBeLessThan(500)
  })

  it('debe validar tiempo mínimo y máximo', async () => {
    const testRequest = request()
      .url('http://localhost/api/users')
      .method('GET')
      .build()

    const response = await GET(testRequest)

    const result = await validator()
      .status(200)
      .minResponseTime(10) // Mínimo 10ms (para evitar respuestas instantáneas sospechosas)
      .maxResponseTime(1000) // Máximo 1 segundo
      .validate(response)

    expect(result.success).toBe(true)
    if (result.metrics) {
      expect(result.metrics.responseTime).toBeGreaterThanOrEqual(10)
      expect(result.metrics.responseTime).toBeLessThanOrEqual(1000)
    }
  })
})
```

## ❌ Test de Errores

```typescript
import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/users/route'
import { request, validator, assertEnterpriseError } from '@/test/enterprise'

describe('Error Handling Tests', () => {
  it('debe retornar 400 para datos inválidos', async () => {
    const testRequest = request()
      .url('http://localhost/api/users')
      .method('POST')
      .body({ email: 'invalid-email' }) // Email inválido
      .build()

    const response = await POST(testRequest)

    // Validar error
    await assertEnterpriseError(
      response,
      400,
      'Datos inválidos'
    )
  })

  it('debe retornar 404 para recurso no encontrado', async () => {
    const testRequest = request()
      .url('http://localhost/api/users/nonexistent-id')
      .method('GET')
      .build()

    const response = await GET(testRequest)

    await assertEnterpriseError(
      response,
      404,
      (error) => error.includes('no encontrado')
    )
  })

  it('debe validar estructura de error', async () => {
    const testRequest = request()
      .url('http://localhost/api/users/invalid')
      .method('GET')
      .build()

    const response = await GET(testRequest)

    const result = await validator()
      .status(400)
      .validate(response)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.message).toBeDefined()
  })
})
```

## 🎯 Test Completo End-to-End

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST, GET, PUT, DELETE } from '@/app/api/users/route'
import {
  request,
  validator,
  EnterpriseRequestFactory,
  createTestUser,
  createTestStudent,
  mock,
  PrismaMockFactory,
} from '@/test/enterprise'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: PrismaMockFactory.create(),
}))

// Schemas
const userSchema = z.object({
  id: z.string().regex(/^c[a-z0-9]{24}$/),
  email: z.email({ error: 'Invalid email' }),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

describe('API Users - Test Completo Enterprise', () => {
  let prismaMock: ReturnType<typeof PrismaMockFactory.create>

  beforeEach(() => {
    vi.clearAllMocks()
    prismaMock = PrismaMockFactory.create()
  })

  describe('POST /api/users', () => {
    it('debe crear usuario con validación completa', async () => {
      // 1. Preparar datos
      const newUser = createTestUser({
        email: 'new@example.com',
        name: 'New User',
      })

      // 2. Configurar mock
      vi.mocked(prismaMock.user?.create).mockResolvedValue(newUser as any)

      // 3. Crear request
      const testRequest = request()
        .url('http://localhost/api/users')
        .method('POST')
        .body({
          email: newUser.email,
          name: newUser.name,
        })
        .header('Content-Type', 'application/json')
        .build()

      // 4. Ejecutar
      const response = await POST(testRequest)

      // 5. Validar
      const result = await validator()
        .status(201)
        .schema(userSchema)
        .requires(['id', 'email', 'name', 'createdAt'])
        .maxResponseTime(1000)
        .contentType('application/json')
        .validate(response)

      // 6. Assertions
      expect(result.success).toBe(true)
      expect(result.data).toMatchObject({
        email: newUser.email,
        name: newUser.name,
      })
      expect(prismaMock.user?.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /api/users', () => {
    it('debe retornar lista de usuarios', async () => {
      const users = [
        createTestUser({ email: 'user1@example.com' }),
        createTestUser({ email: 'user2@example.com' }),
      ]

      vi.mocked(prismaMock.user?.findMany).mockResolvedValue(users as any)

      const testRequest = EnterpriseRequestFactory.get(
        'http://localhost/api/users',
        { limit: 10 }
      )

      const response = await GET(testRequest)

      const result = await validator()
        .status(200)
        .schema(z.array(userSchema))
        .maxResponseTime(500)
        .validate(response)

      expect(result.success).toBe(true)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data).toHaveLength(2)
    })
  })

  describe('PUT /api/users/:id', () => {
    it('debe actualizar usuario', async () => {
      const updatedUser = createTestUser({
        id: 'user-123',
        email: 'updated@example.com',
        name: 'Updated User',
      })

      vi.mocked(prismaMock.user?.update).mockResolvedValue(updatedUser as any)

      const testRequest = EnterpriseRequestFactory.put(
        'http://localhost/api/users/user-123',
        { name: 'Updated User' }
      )

      const response = await PUT(testRequest)

      const result = await validator()
        .status(200)
        .schema(userSchema)
        .validate(response)

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('name', 'Updated User')
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('debe eliminar usuario', async () => {
      vi.mocked(prismaMock.user?.delete).mockResolvedValue({} as any)

      const testRequest = EnterpriseRequestFactory.delete(
        'http://localhost/api/users/user-123'
      )

      const response = await DELETE(testRequest)

      const result = await validator()
        .status(204)
        .validate(response)

      expect(result.success).toBe(true)
      expect(prismaMock.user?.delete).toHaveBeenCalledTimes(1)
    })
  })
})
```

## 🎓 Mejores Prácticas

1. **Usa Builder Pattern** para requests complejos
2. **Valida con schemas** para type safety
3. **Configura mocks** antes de ejecutar tests
4. **Valida métricas** de performance
5. **Limpia mocks** después de cada test
6. **Usa Factory Methods** para requests simples
7. **Documenta casos de uso** específicos

---

**Versión**: 2.0.0 Premium  
**Nivel**: Enterprise Maximum

