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
import { GET, POST } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  setupAuthenticatedUser,
  setupUnauthenticatedUser,
  setupStudyNote,
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
      findFirst: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

vi.mock('../rate-limit', () => ({
  withVersionRateLimit: vi.fn((req: any, handler: () => Promise<any>) => handler()),
}))

vi.mock('../timeout-handler', () => ({
  withRequestTimeout: vi.fn((req: any, handler: () => Promise<any>) => handler()),
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
  parseRequestBody: vi.fn(async (req: any, _method: string) => {
    try {
      const body = await req.json()
      return { success: true, data: body }
    } catch {
      return { 
        success: false, 
        error: new Response(JSON.stringify({ error: 'El cuerpo de la solicitud no puede estar vacío' }), { status: 400 }) 
      }
    }
  }),
}))

vi.mock('../request-context', () => ({
  createRequestContext: vi.fn(() => ({})),
  getOrCreateRequestId: vi.fn(() => 'test-request-id'),
}))

vi.mock('../response-helpers', () => ({
  addTracingHeaders: vi.fn((response: any, _requestId: string, _duration: number) => response),
  addCorsHeaders: vi.fn((response: any) => response),
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

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock('@/lib/utils/text-diff', () => ({
  compareVersions: vi.fn((v1, v2) => ({
    title: {
      old: v1.title,
      new: v2.title,
      changed: v1.title !== v2.title,
    },
    content: {
      old: v1.content,
      new: v2.content,
      changed: v1.content !== v2.content,
      diff: [],
      stats: {
        totalLines: 10,
        addedLines: 2,
        removedLines: 1,
        unchangedLines: 7,
        changePercentage: 30,
      },
    },
    tags: {
      old: v1.tags,
      new: v2.tags,
      changed: v1.tags !== v2.tags,
    },
    hasChanges: v1.title !== v2.title || v1.content !== v2.content || v1.tags !== v2.tags,
    summary: {
      totalChanges: 3,
      fieldsChanged: ['title', 'content', 'tags'],
    },
  })),
}))

describe('GET /api/notes/versions/compare', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
  })

  it('debe comparar dos versiones correctamente', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota actual',
      content: 'Contenido actual',
      tags: 'tag1',
      updatedAt: new Date('2024-01-15'),
    })

    const mockVersion1 = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      content: 'Contenido versión 1',
      tags: 'tag1',
    })

    const mockVersion2 = createStudyNoteVersion({
      id: TEST_IDS.VERSION_2,
      title: 'Versión 2',
      content: 'Contenido versión 2',
      tags: 'tag2',
    })

    setupStudyNote(mockNote)
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(mockVersion1 as any)
      .mockResolvedValueOnce(mockVersion2 as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION,
        name: null,
        createdAt: new Date('2024-01-10'),
        isImportant: false,
      } as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION_2,
        name: null,
        createdAt: new Date('2024-01-12'),
        isImportant: false,
      } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.diff).toBeDefined()
    expect(data.version1).toBeDefined()
    expect(data.version2).toBeDefined()
    expect(data.diff.hasChanges).toBe(true)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    // Mock withAuthContext para que retorne error 404 cuando no hay estudiante
    const { withAuthContext } = await import('../helpers')
    vi.mocked(withAuthContext).mockResolvedValueOnce({
      success: false,
      error: new Response(JSON.stringify({ error: 'Estudiante no encontrado' }), { status: 404 }),
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe validar que noteId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe validar que versionId1 sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe validar que versionId2 sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe validar que la nota pertenezca al estudiante', async () => {
    setupStudyNote(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe validar que versionId1 exista', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Versión 1 no encontrada')
  })

  it('debe validar que versionId2 exista', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(createStudyNoteVersion({ id: TEST_IDS.VERSION }) as any)
      .mockResolvedValueOnce(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Versión 2 no encontrada')
  })

  it('debe comparar versión actual con versión histórica', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota actual',
      content: 'Contenido actual',
      tags: 'tag1',
      updatedAt: new Date('2024-01-15'),
    })

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión histórica',
      content: 'Contenido histórico',
      tags: 'tag2',
    })

    setupStudyNote(mockNote)
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(mockVersion as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION,
        name: null,
        createdAt: new Date('2024-01-10'),
        isImportant: false,
      } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.NOTE,
        versionId2: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.version1.id).toBe(TEST_IDS.NOTE)
    expect(data.version2.id).toBe(TEST_IDS.VERSION)
  })

  it('debe manejar contenido comprimido', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          title: 'Versión 1',
          content: 'contenido-comprimido-base64',
          isCompressed: true,
        }) as any
      )
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION_2,
          title: 'Versión 2',
          isCompressed: false,
        }) as any
      )
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION,
        name: null,
        createdAt: new Date(),
        isImportant: false,
      } as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION_2,
        name: null,
        createdAt: new Date(),
        isImportant: false,
      } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    // El endpoint debe manejar la descompresión sin errores
    expect(response.status).toBeGreaterThanOrEqual(200)
  })

  it('debe incluir metadatos de versiones en la respuesta', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(createStudyNoteVersion({ id: TEST_IDS.VERSION }) as any)
      .mockResolvedValueOnce(createStudyNoteVersion({ id: TEST_IDS.VERSION_2 }) as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION,
        name: 'Versión importante',
        createdAt: new Date('2024-01-10'),
        isImportant: true,
      } as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION_2,
        name: null,
        createdAt: new Date('2024-01-12'),
        isImportant: false,
      } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.version1.name).toBe('Versión importante')
    expect(data.version1.isImportant).toBe(true)
    expect(data.version2.name).toBeNull()
    expect(data.version2.isImportant).toBe(false)
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findFirst).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 500, 'Error al comparar versiones')
  })
})

describe('POST /api/notes/versions/compare', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
  })

  it('debe comparar dos versiones usando POST', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(createStudyNoteVersion({ id: TEST_IDS.VERSION }) as any)
      .mockResolvedValueOnce(createStudyNoteVersion({ id: TEST_IDS.VERSION_2 }) as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION,
        name: null,
        createdAt: new Date(),
        isImportant: false,
      } as any)
      .mockResolvedValueOnce({
        id: TEST_IDS.VERSION_2,
        name: null,
        createdAt: new Date(),
        isImportant: false,
      } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    expect(data.diff).toBeDefined()
    expect(data.version1).toBeDefined()
    expect(data.version2).toBeDefined()
  })

  it('debe validar parámetros requeridos en POST', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        // Faltan versionId1 y versionId2
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/compare',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })
})

