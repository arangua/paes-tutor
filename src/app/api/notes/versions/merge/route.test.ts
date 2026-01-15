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
        // Para otros tipos de body, intentar leer como texto y parsear
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
import { POST } from './route'
import { prisma } from '@/lib/prisma'
import {
  setupAuthenticatedUserWithStudent,
  setupUnauthenticated,
} from '@/test/enterprise/shared-test-helpers'
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

vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findFirst: vi.fn(),
      create: vi.fn(),
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
      if (!body || Object.keys(body).length === 0) {
        return { 
          success: false, 
          error: new Response(JSON.stringify({ error: 'El cuerpo de la solicitud no puede estar vacío' }), { status: 400 }) 
        }
      }
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

vi.mock('@/lib/utils/version-content', () => ({
  decompressVersionContent: vi.fn((content) => Promise.resolve(content)),
}))

describe('POST /api/notes/versions/merge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupUnauthenticated() // Default: no autenticado
  })

  it('debe retornar 401 si el usuario no está autenticado', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/merge',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION, TEST_IDS.VERSION_2],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  describe('cuando está autenticado', () => {
    beforeEach(async () => {
      setupAuthenticatedUserWithStudent({
        student: { id: TEST_IDS.STUDENT },
      })
      await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
      // Mock por defecto de studyNote.findFirst
      vi.mocked(prisma.studyNote.findFirst).mockResolvedValue(createStudyNote({
        id: TEST_IDS.NOTE,
        studentId: TEST_IDS.STUDENT,
      }) as any)
    })

    it('debe retornar 400 si se proporcionan menos de 2 versiones', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/merge',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe fusionar versiones correctamente', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    setupStudyNote(
      createStudyNote({
        id: TEST_IDS.NOTE,
        title: 'Nota original',
        content: 'Contenido original',
        tags: 'tag1, tag2',
        updatedAt: new Date(),
      })
    )

    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          title: 'Versión 1',
          content: 'Contenido versión 1',
          tags: 'tag1',
          createdAt: new Date(),
        }) as any
      )
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION_2,
          title: 'Versión 2',
          content: 'Contenido versión 2',
          tags: 'tag2',
          createdAt: new Date(),
        }) as any
      )

    vi.mocked(prisma.studyNote.create).mockResolvedValue({
      id: 'merged-note-1',
      title: 'Nota fusionada',
      content: 'Contenido fusionado',
      tags: 'tag1, tag2',
    } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/merge',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION, TEST_IDS.VERSION_2],
        mergeStrategy: 'append',
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)

    expect(data.message).toContain('fusionadas')
    expect(data.mergedNote).toBeDefined()
    })
  }) // cierra "cuando está autenticado"
})

