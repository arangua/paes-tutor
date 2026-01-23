// @vitest-environment node
/**
 * Tests Enterprise para GET /api/metrics
 * 
 * Usa shared enterprise test helpers para mantener tests limpios y mantenibles.
 */

// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

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
  setupStandardAuth,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertArrayResponse,
  SHARED_TEST_IDS,
  clearAllMocks,
} from '@/test/enterprise/shared-test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    performanceMetric: {
      findMany: vi.fn(),
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
  logApiError: vi.fn(),
  logger: {
    warn: vi.fn(),
  },
}))

vi.mock('@/lib/api-helpers', async () => {
  const actual = await vi.importActual('@/lib/api-helpers')
  return {
    ...actual,
    validateQuery: vi.fn((_req: any, _schema: any) => ({
      success: true,
      data: {},
    })),
    handleApiError: vi.fn((error: Error, message: string) => {
      return new Response(JSON.stringify({ error: message }), { status: 500 })
    }),
  }
})

vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: vi.fn((operation: () => Promise<any>) => operation()),
    },
  },
}))

describe('GET /api/metrics', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('debe retornar métricas agrupadas por asignatura', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    const mockStudent = { id: SHARED_TEST_IDS.STUDENT, nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 10,
        correctas: 7,
        porcentaje: 70,
        nivel: 'medio',
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '2',
        totalPreguntas: 8,
        correctas: 6,
        porcentaje: 75,
        nivel: 'alto',
        topic: {
          id: '2',
          nombre: 'Números',
          subject: {
            codigo: 'M1',
            nombre: 'Matemática M1',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const request = createTestRequest({ url: 'http://localhost:3000/api/metrics' })
    const response = await GET(request)

    const data = await assertArrayResponse(response, {
      minLength: 1,
      itemValidator: (item: any) => {
        expect(item).toHaveProperty('codigo')
        expect(item).toHaveProperty('nombre')
        expect(item).toHaveProperty('totalPreguntas')
        expect(item).toHaveProperty('correctas')
      },
    })
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.totalPreguntas).toBe(10)
    expect(lectora.correctas).toBe(7)
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT, hasStudent: false })

    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
    const { getSession } = await import('@/lib/get-session')
    vi.mocked(getSession).mockResolvedValue(null)
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const request = createTestRequest({ url: 'http://localhost:3000/api/metrics' })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe calcular correctamente el porcentaje por asignatura', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    const mockStudent = { id: SHARED_TEST_IDS.STUDENT, nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 10,
        correctas: 8,
        porcentaje: 80,
        nivel: 'alto',
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const request = createTestRequest({ url: 'http://localhost:3000/api/metrics' })
    const response = await GET(request)

    const data = await assertSuccessResponse(response, 200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora.porcentaje).toBe(80)
  })

  it('debe manejar errores correctamente', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    const mockStudent = { id: SHARED_TEST_IDS.STUDENT, nombre: 'Matías' }
    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({ url: 'http://localhost:3000/api/metrics' })
    const response = await GET(request)

    await assertErrorResponse(response, 500, 'Error al obtener métricas')
  })

  it('debe agrupar múltiples métricas de la misma asignatura', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    const mockStudent = { id: SHARED_TEST_IDS.STUDENT, nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 5,
        correctas: 4,
        porcentaje: 80,
        nivel: 'alto',
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '2',
        totalPreguntas: 5,
        correctas: 3,
        porcentaje: 60,
        nivel: 'medio',
        topic: {
          id: '2',
          nombre: 'Comprensión inferencial',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const request = createTestRequest({ url: 'http://localhost:3000/api/metrics' })
    const response = await GET(request)

    const data = await assertSuccessResponse(response, 200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.totalPreguntas).toBe(10) // 5 + 5
    expect(lectora.correctas).toBe(7) // 4 + 3
    expect(lectora.porcentaje).toBe(70) // 7/10 * 100
    expect(lectora.temas).toHaveLength(2)
  })
})
