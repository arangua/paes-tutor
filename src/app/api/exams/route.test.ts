// @vitest-environment node
/**
 * Tests Enterprise para GET /api/exams
 * 
 * Usa shared enterprise test helpers para mantener tests limpios y mantenibles.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  setupStandardAuth,
  setupUnauthenticated,
  createTestRequest,
  assertErrorResponse,
  SHARED_TEST_IDS,
  clearAllMocks,
} from '@/test/enterprise/shared-test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    exam: {
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

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: any, handler: () => Promise<Response>) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
  logApiError: vi.fn(),
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCached: vi.fn((key: string, fetcher: () => Promise<any>) => fetcher()),
  cacheKeys: {
    exams: (subjectId?: string, tipo?: string, limit?: number, offset?: number) =>
      `exams:${subjectId || 'all'}:${tipo || 'all'}:${limit || 'all'}:${offset || 'all'}`,
  },
}))

vi.mock('@/lib/api-helpers', () => ({
  validateQuery: vi.fn((_req: any, _schema: any) => ({
    success: true,
    data: {
      subjectId: undefined,
      tipo: undefined,
      limit: 20,
      offset: 0,
    },
  })),
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: error.message || message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
}))

vi.mock('@/lib/validations', () => ({
  examQuerySchema: {},
}))

vi.mock('@/lib/monitoring', () => ({
  measurePerformance: vi.fn((_name: string, fn: () => Promise<any>) => fn()),
  trackMetric: vi.fn(),
  trackError: vi.fn(),
}))

vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: vi.fn((fn: () => Promise<any>, _fallback?: () => Promise<any>) => fn()),
    },
  },
}))

vi.mock('@/lib/constants', () => ({
  TIME_CONSTANTS: {
    EXAMS_CACHE_TTL_MS: 300000, // 5 minutos
  },
}))

describe('GET /api/exams', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('debe retornar error 401 si no está autenticado', async () => {
    // ✅ Enterprise: Usar shared helpers
    setupUnauthenticated()

    const request = createTestRequest({ url: 'http://localhost:3000/api/exams' })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar la lista de exámenes', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    const mockExams = [
      {
        id: '1',
        titulo: 'Simulacro PAES - Competencia Lectora',
        descripcion: 'Examen de práctica',
        tipo: 'simulacro',
        totalPreguntas: 65,
        subject: {
          id: '1',
          nombre: 'Competencia Lectora',
          codigo: 'LECTORA',
        },
        questions: [{ id: '1' }],
      },
    ]

    vi.mocked(prisma.exam.findMany).mockResolvedValue(mockExams as any)
    vi.mocked(prisma.exam.count).mockResolvedValue(1)

    const request = createTestRequest({ url: 'http://localhost:3000/api/exams' })
    const response = await GET(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('exams')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.exams)).toBe(true)
    expect(data.exams).toHaveLength(1)
    expect(data.exams[0].titulo).toBe('Simulacro PAES - Competencia Lectora')
    expect(data.pagination.total).toBe(1)
  })

  it('debe retornar array vacío si no hay exámenes', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    vi.mocked(prisma.exam.findMany).mockResolvedValue([])
    vi.mocked(prisma.exam.count).mockResolvedValue(0)

    const request = createTestRequest({ url: 'http://localhost:3000/api/exams' })
    const response = await GET(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(Array.isArray(data.exams)).toBe(true)
    expect(data.exams).toHaveLength(0)
    expect(data.pagination.total).toBe(0)
  })

  it('debe manejar errores correctamente', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })
    vi.mocked(prisma.exam.findMany).mockRejectedValueOnce(new Error('Database error'))

    const request = createTestRequest({ url: 'http://localhost:3000/api/exams' })
    const response = await GET(request)

    await assertErrorResponse(response, 500)
  })
})
