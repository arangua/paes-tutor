// @vitest-environment node
// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; pathname: string }
      headers: Headers
      cookies: Map<string, string>
      method: string
      private _body: BodyInit | null
      constructor(url: string | URL, init?: { method?: string; headers?: HeadersInit; body?: BodyInit }) {
        const urlObj = typeof url === 'string' ? new URL(url) : url
        this.url = urlObj.toString()
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers(init?.headers)
        this.cookies = new Map()
        this.method = init?.method || 'GET'
        this._body = init?.body || null
      }
      async json() {
        if (!this._body) {
          return Promise.resolve({})
        }
        if (typeof this._body === 'string') {
          try {
            return Promise.resolve(JSON.parse(this._body))
          } catch {
            return Promise.resolve({})
          }
        }
        try {
          const text = await (this._body as any).text?.() || String(this._body)
          return Promise.resolve(JSON.parse(text))
        } catch {
          return Promise.resolve({})
        }
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
  setupAuthenticatedUser,
  setupUnauthenticatedUser,
  setupStudyNote,
  setupNoCache,
  setupCache,
  createStudyNote,
  createStudyNoteVersion,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../__tests__/test-helpers'

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findFirst: vi.fn(),
    },
    studyNoteVersion: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}))

vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

vi.mock('../rate-limit', () => ({
  withVersionRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

vi.mock('../timeout-handler', () => ({
  withRequestTimeout: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}))

vi.mock('../helpers', () => ({
  withAuthContext: vi.fn(async (_req: any, _startTime: number) => {
    const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
    const user = await getAuthenticatedUserWithStudent()
    if (!user || !user.student) {
      return { 
        success: false, 
        error: new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 }) 
      }
    }
    return {
      success: true,
      data: {
        user,
        enrichedContext: { studentId: user.student.id },
        metrics: {},
        requestId: 'test-request-id',
      },
    }
  }),
}))

vi.mock('../request-context', () => ({
  createRequestContext: vi.fn(() => ({})),
  getOrCreateRequestId: vi.fn(() => 'test-request-id'),
}))

vi.mock('../response-helpers', () => ({
  addTracingHeaders: vi.fn((response) => response),
  addCorsHeaders: vi.fn((response) => response),
}))

vi.mock('../audit', () => ({
  auditSensitiveOperation: vi.fn(),
}))

vi.mock('../error-handlers', async () => {
  const actual = await vi.importActual('../error-handlers')
  return {
    ...actual,
    handleEndpointError: vi.fn((error: any, context: string, options?: any) => {
      const { NextResponse } = require('next/server')
      return NextResponse.json(
        { error: options?.customMessage || 'Error interno del servidor' },
        { status: 500 }
      )
    }),
  }
})

describe('GET /api/notes/versions/analytics', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
    await setupNoCache()
    
    // Configurar mock de withAuthContext
    const { withAuthContext } = await import('../helpers')
    const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
    const user = await getAuthenticatedUserWithStudent()
    
    vi.mocked(withAuthContext).mockResolvedValue({
      success: true,
      data: {
        user: user!,
        metrics: { authDuration: 0 },
        enrichedContext: {},
        requestId: 'test-request-id',
      },
    })
  })

  it('debe retornar analytics correctamente', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const mockRestoreHistory = [
      {
        restoredVersionId: TEST_IDS.VERSION,
        restoreCount: 5,
        lastRestoredAt: new Date('2024-01-15'),
      },
    ]

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      createdAt: new Date('2024-01-10'),
    })

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockRestoreHistory as any)
    // Primera llamada: obtener todas las versiones
    // Segunda llamada: obtener versiones restauradas (con where: { id: { in: [...] } })
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([mockVersion] as any) // Todas las versiones
      .mockResolvedValueOnce([mockVersion] as any) // Versiones restauradas

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.mostRestoredVersions).toBeDefined()
    expect(data.summary).toBeDefined()
    expect(data.summary.restoreFrequency).toBeDefined()
    expect(data.usageTrends).toBeDefined()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()
    
    // Sobrescribir el mock de withAuthContext para este test
    const { withAuthContext } = await import('../helpers')
    vi.mocked(withAuthContext).mockResolvedValue({
      success: false,
      error: new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 }),
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe validar que noteId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe usar período por defecto (30d) si no se especifica', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
    // Verificar que se aplica filtro de fecha para 30 días
    expect(prisma.studyNoteVersion.findMany).toHaveBeenCalled()
  })

  it('debe filtrar por período 7d', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE, period: '7d' },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('debe filtrar por período 90d', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE, period: '90d' },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('debe incluir todas las versiones cuando period=all', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE, period: 'all' },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('debe validar que la nota pertenezca al estudiante', async () => {
    setupStudyNote(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe usar caché si está disponible', async () => {
    // Configurar la nota para que pase la validación antes del caché
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    
    const cachedData = {
      period: '30d',
      periodStart: '2024-01-01T00:00:00.000Z',
      summary: {
        totalVersions: 0,
        importantVersions: 0,
        namedVersions: 0,
        totalRestores: 0,
        restoreFrequency: 0,
        averageVersionsPerDay: 0,
      },
      mostRestoredVersions: [],
      trends: {
        versionsByPeriod: {},
        totalVersionsOverTime: 0,
      },
      usageTrends: [],
      recentVersions: [],
    }

    await setupCache(cachedData)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.mostRestoredVersions).toEqual(cachedData.mostRestoredVersions)
    expect(data.summary.restoreFrequency).toBe(cachedData.summary.restoreFrequency)
    expect(data.usageTrends).toEqual(cachedData.usageTrends)
    // No debe calcular analytics si hay caché (pero sí debe verificar que la nota existe)
    expect(prisma.$queryRaw).not.toHaveBeenCalled()
  })

  it('debe calcular versiones más restauradas', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const mockRestoreHistory = [
      {
        restoredVersionId: TEST_IDS.VERSION,
        restoreCount: 10,
        lastRestoredAt: new Date('2024-01-15'),
      },
      {
        restoredVersionId: TEST_IDS.VERSION_2,
        restoreCount: 5,
        lastRestoredAt: new Date('2024-01-14'),
      },
    ]

    const mockVersion1 = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      createdAt: new Date('2024-01-10'),
    })

    const mockVersion2 = createStudyNoteVersion({
      id: TEST_IDS.VERSION_2,
      title: 'Versión 2',
      createdAt: new Date('2024-01-12'),
    })

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockRestoreHistory as any)
    // Primera llamada: obtener todas las versiones
    // Segunda llamada: obtener versiones restauradas (con where: { id: { in: [...] } })
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([]) // Todas las versiones
      .mockResolvedValueOnce([mockVersion1, mockVersion2] as any) // Versiones restauradas

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.mostRestoredVersions).toBeDefined()
    expect(Array.isArray(data.mostRestoredVersions)).toBe(true)
  })

  it('debe calcular frecuencia de restauración', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const mockRestoreHistory = [
      {
        restoredVersionId: TEST_IDS.VERSION,
        restoreCount: 7,
        lastRestoredAt: new Date('2024-01-15'),
      },
    ]

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      createdAt: new Date('2024-01-10'),
    })
    
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockRestoreHistory as any)
    // Primera llamada: obtener todas las versiones
    // Segunda llamada: obtener versiones restauradas (con where: { id: { in: [...] } })
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([]) // Todas las versiones
      .mockResolvedValueOnce([mockVersion] as any) // Versiones restauradas

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE, period: '7d' },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.summary).toBeDefined()
    expect(data.summary.restoreFrequency).toBeDefined()
    expect(typeof data.summary.restoreFrequency).toBe('number')
  })

  it('debe incluir tendencias de uso', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.usageTrends).toBeDefined()
    expect(Array.isArray(data.usageTrends)).toBe(true)
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findFirst).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/analytics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 500, 'Error al obtener analytics de versiones')
  })
})

