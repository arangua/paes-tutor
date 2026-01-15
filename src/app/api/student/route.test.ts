// @vitest-environment node
/**
 * Tests Enterprise para GET /api/student
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
      body: any
      method: string
      constructor(url: string, init?: any) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          href: url,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers()
        this.body = init?.body
        this.method = init?.method || 'GET'
      }
      async json() {
        if (typeof this.body === 'string') {
          return JSON.parse(this.body)
        }
        return this.body || {}
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
import { getSession } from '@/lib/get-session'
import {
  setupStandardAuth,
  setupUnauthenticated,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  SHARED_TEST_IDS,
  clearAllMocks,
} from '@/test/enterprise/shared-test-helpers'

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
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
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  logApiRequest: vi.fn(),
  logApiError: vi.fn(),
}))

vi.mock('@/lib/cache', () => {
  const mockGetCached = vi.fn((key: string, fetcher: () => Promise<any>) => fetcher())
  return {
    getCached: mockGetCached,
    cacheKeys: {
      student: (id: string) => `student:${id}`,
    },
    __mockGetCached: mockGetCached,
  }
})

describe('GET /api/student', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('debe retornar el estudiante con intentos y métricas', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ studentId: SHARED_TEST_IDS.STUDENT })

    const mockStudent = {
      id: SHARED_TEST_IDS.STUDENT,
      nombre: 'Matías',
      attempts: [
        {
          id: '1',
          estado: 'completado',
          porcentaje: 70,
          correctas: 7,
          totalPreguntas: 10,
          createdAt: new Date(),
          exam: {
            titulo: 'Simulacro PAES',
            subject: {
              nombre: 'Competencia Lectora',
              codigo: 'LECTORA',
            },
          },
        },
      ],
      metrics: [],
    }

    const { getCached } = await import('@/lib/cache')
    vi.mocked(getCached).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)

    vi.mocked(getSession).mockResolvedValue({
      user: {
        id: SHARED_TEST_IDS.USER,
        email: 'test@example.com',
        studentId: SHARED_TEST_IDS.STUDENT,
      },
    } as any)

    const request = createTestRequest({ url: 'http://localhost:3000/api/student' })
    const response = await GET(request)

    await assertSuccessResponse(response, 200, {
      requiredFields: ['nombre', 'attempts'],
    })

    const data = await response.json()
    expect(data.nombre).toBe('Matías')
    expect(data.attempts).toHaveLength(1)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    // ✅ Enterprise: Usar shared helpers
    setupUnauthenticated()
    vi.mocked(getSession).mockResolvedValue(null)

    const request = createTestRequest({ url: 'http://localhost:3000/api/student' })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar información del usuario si no hay estudiante', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth({ hasStudent: false })

    const { getCached } = await import('@/lib/cache')
    vi.mocked(getCached).mockResolvedValue(null)
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
    
    vi.mocked(getSession).mockResolvedValue({
      user: {
        id: SHARED_TEST_IDS.USER,
        email: 'test@example.com',
        name: 'Test User',
        studentId: null,
      },
    } as any)

    const request = createTestRequest({ url: 'http://localhost:3000/api/student' })
    const response = await GET(request)

    await assertSuccessResponse(response, 200)
    const data = await response.json()
    expect(data.isStudent).toBe(false)
    expect(data.nombre).toBe('Test User')
  })

  it('debe manejar errores correctamente', async () => {
    // ✅ Enterprise: Usar shared helpers
    await setupStandardAuth()
    vi.mocked(getSession).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({ url: 'http://localhost:3000/api/student' })
    const response = await GET(request)

    await assertErrorResponse(response, 500)
  })
})
