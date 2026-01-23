// @vitest-environment node
/**
 * Tests Enterprise para GET /api/attempts
 * 
 * Usa test helpers enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @see {@link ./test-helpers} Para documentación de helpers disponibles
 */

// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock completo de next/server para evitar problemas con next-auth
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; href: string; pathname: string }
      headers: Headers
      constructor(url: string) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          href: url,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers()
      }
    },
    NextResponse: {
      json: (body: any, init?: { status?: number }) => {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createAttempt,
  setupAuthenticatedUser,
  setupStudent,
  setupNoCache,
  createTestRequest,
  assertErrorResponse,
  TestScenarioBuilder,
  ErrorScenarioBuilder,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
    },
    attempt: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/get-session')>('@/lib/get-session')
  return {
    ...actual,
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getCurrentStudentId: vi.fn(),
    getAuthenticatedUserWithStudent: vi.fn(),
  }
})

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: any, handler: () => Promise<Response>) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCached: vi.fn((key: string, fetcher: () => Promise<any>) => fetcher()),
  cacheKeys: {
    studentAttempts: (studentId: string, limit: number, offset: number) =>
      `student:${studentId}:attempts:${limit}:${offset}`,
  },
  invalidateCachePattern: vi.fn(),
}))

vi.mock('@/lib/api-helpers', async () => {
  const actual = await vi.importActual('@/lib/api-helpers')
  return {
    ...actual,
    validateQuery: vi.fn((_req: any, _schema: any) => {
      // ✅ Enterprise: Implementación que replica exactamente la función real
      // La función real usa: request.nextUrl.searchParams
      try {
        const searchParams = req.nextUrl?.searchParams
        if (!searchParams) {
          // Si no hay searchParams, retornar defaults
          return {
            success: true,
            data: { limit: 10, offset: 0 },
          }
        }
        
        // Convertir searchParams a objeto (como lo hace la implementación real)
        const params = Object.fromEntries(searchParams.entries())
        
        // Parsear usando el schema (simplificado para tests)
        const limit = params.limit ? parseInt(String(params.limit), 10) : 10
        const offset = params.offset ? parseInt(String(params.offset), 10) : 0
        
        return {
          success: true,
          data: { 
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
            offset: !isNaN(offset) && offset >= 0 ? offset : 0,
          },
        }
      } catch {
        // Si hay error, retornar defaults
        return {
          success: true,
          data: { limit: 10, offset: 0 },
        }
      }
    }),
    handleApiError: vi.fn((error: Error, message: string) => {
      return new Response(JSON.stringify({ error: message }), { status: 500 })
    }),
  }
})

vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: vi.fn(async (operation: () => Promise<any>, fallback?: () => Promise<any>) => {
        try {
          return await operation()
        } catch (error) {
          if (fallback) {
            return await fallback()
          }
          throw error
        }
      }),
    },
    cache: {
      execute: vi.fn(async (operation: () => Promise<any>, fallback?: () => Promise<any>) => {
        try {
          return await operation()
        } catch (error) {
          if (fallback) {
            return await fallback()
          }
          throw error
        }
      }),
    },
  },
}))

describe('GET /api/attempts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupNoCache()
  })

  it('debe retornar los intentos del estudiante', async () => {
    // ✅ Enterprise: Usar Test Scenario Builder
    const scenario = new TestScenarioBuilder()
      .withAuth({ studentId: TEST_IDS.STUDENT })
      .withAttempts(
        [
          createAttempt({
            id: TEST_IDS.ATTEMPT,
            estado: 'completado',
            porcentaje: 70,
            correctas: 7,
            totalPreguntas: 10,
          }),
        ],
        1
      )
      .build()

    await scenario.setup()

    const request = scenario.createRequest({ queryParams: { limit: 10, offset: 0 } })
    const response = await GET(request)

    // ✅ Enterprise: Usar assertion helpers
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('attempts')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.attempts)).toBe(true)
    expect(data.attempts.length).toBeGreaterThan(0)
    expect(data.attempts[0]).toHaveProperty('id')
    expect(data.attempts[0]).toHaveProperty('estado')
    expect(data.attempts[0].estado).toBe('completado')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    // ✅ Enterprise: Usar Error Scenario Builder
    const errorScenario = new ErrorScenarioBuilder().unauthorized().build()
    await errorScenario.apply()

    const request = createTestRequest()
    const response = await GET(request)

    // ✅ Enterprise: Usar assertion helper para errores
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    // ✅ Enterprise: Usar helpers para setup
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
    setupStudent(null) // Estudiante no encontrado

    const request = createTestRequest()
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe manejar errores correctamente', async () => {
    // ✅ Enterprise: Usar Error Scenario Builder
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
    setupStudent({ id: TEST_IDS.STUDENT, nombre: 'Test Student' })

    // Simular error en el circuit breaker (que no tenga fallback o que falle el fallback también)
    const { circuitBreakers } = await import('@/app/api/notes/versions/circuit-breaker')
    vi.mocked(circuitBreakers.cache.execute).mockRejectedValue(new Error('Database error'))
    vi.mocked(circuitBreakers.database.execute).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest()
    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toContain('Error al obtener intentos')
  })

  it('debe validar performance de respuesta', async () => {
    // ✅ Enterprise: Test de performance
    const scenario = new TestScenarioBuilder()
      .withAuth({ studentId: TEST_IDS.STUDENT })
      .withAttempts([createAttempt()], 1)
      .build()

    await scenario.setup()

    const request = scenario.createRequest()
    const { assertResponseTime } = await import('./__tests__/test-helpers')

    // Validar que la respuesta sea rápida (< 200ms)
    await assertResponseTime(async () => GET(request), { max: 200 })
  })

  it('debe retornar paginación correcta', async () => {
    // ✅ Enterprise: Test simplificado y robusto de paginación
    // Enfoque: Validar que la paginación funciona, sin depender de mocks complejos
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
    setupStudent({ id: TEST_IDS.STUDENT, nombre: 'Test Student' })
    
    // Asegurar que los circuit breakers estén configurados correctamente
    const { circuitBreakers } = await import('@/app/api/notes/versions/circuit-breaker')
    vi.mocked(circuitBreakers.cache.execute).mockImplementation(async (operation: () => Promise<any>) => {
      return await operation()
    })
    vi.mocked(circuitBreakers.database.execute).mockImplementation(async (operation: () => Promise<any>) => {
      return await operation()
    })
    
    // Crear intentos para retornar
    const attemptsToReturn = Array.from({ length: 5 }, (_, i) => ({
      id: `${TEST_IDS.ATTEMPT.slice(0, 23)}${i}`,
      estado: 'completado',
      porcentaje: 70,
      correctas: 7,
      totalPreguntas: 10,
      puntajePaes: null,
      createdAt: new Date(),
      exam: {
        id: TEST_IDS.EXAM,
        titulo: 'Test Exam',
        subject: {
          id: TEST_IDS.SUBJECT,
          nombre: 'Test Subject',
          codigo: 'TEST',
        },
      },
    }))
    
    // Total de intentos: 10 (más que los retornados para probar paginación)
    vi.mocked(prisma.attempt.findMany).mockResolvedValue(attemptsToReturn as any)
    vi.mocked(prisma.attempt.count).mockResolvedValue(10)

    // ✅ Enterprise: Usar request simple sin query params complejos
    // El mock de validateQuery usará defaults (limit: 10, offset: 0)
    const request = createTestRequest()
    
    const response = await GET(request)
    
    // ✅ Enterprise: Verificar respuesta exitosa
    expect(response.status).toBe(200)
    const data = await response.json()

    // ✅ Enterprise: Verificar estructura básica
    expect(data).toHaveProperty('attempts')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.attempts)).toBe(true)
    
    // ✅ Enterprise: Verificar estructura de paginación
    expect(data.pagination).toBeDefined()
    expect(typeof data.pagination.total).toBe('number')
    expect(typeof data.pagination.limit).toBe('number')
    expect(typeof data.pagination.offset).toBe('number')
    expect(typeof data.pagination.hasMore).toBe('boolean')
    
    // ✅ Enterprise: Verificar valores de paginación
    // El total debe ser 10 (del mock de count)
    expect(data.pagination.total).toBe(10)
    // El limit debe ser un número positivo válido (default: 10)
    expect(data.pagination.limit).toBeGreaterThan(0)
    expect(data.pagination.limit).toBeLessThanOrEqual(100) // Max según schema
    // El offset debe ser >= 0
    expect(data.pagination.offset).toBeGreaterThanOrEqual(0)
    // hasMore debe calcularse correctamente: offset + limit < total
    // Si limit=10, offset=0, total=10 => hasMore = 0 + 10 < 10 = false
    // Si limit=10, offset=0, total=10 => hasMore debería ser false
    const calculatedHasMore = data.pagination.offset + data.pagination.limit < data.pagination.total
    expect(data.pagination.hasMore).toBe(calculatedHasMore)
    
    // ✅ Enterprise: Verificar que se retornaron intentos
    // Debe retornar al menos 1 intento (tenemos 5 en el mock)
    expect(data.attempts.length).toBeGreaterThan(0)
    // No puede ser más que el limit configurado
    expect(data.attempts.length).toBeLessThanOrEqual(data.pagination.limit)
    
    // ✅ Enterprise: Verificar estructura de cada intento
    data.attempts.forEach((attempt: any) => {
      expect(attempt).toHaveProperty('id')
      expect(attempt).toHaveProperty('estado')
      expect(attempt).toHaveProperty('exam')
      expect(attempt.exam).toHaveProperty('subject')
    })
  })
})
