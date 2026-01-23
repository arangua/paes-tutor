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
    },
    studyNoteVersion: {
      findFirst: vi.fn(),
    },
    student: {
      findMany: vi.fn(),
    },
    sharedNoteVersion: {
      findFirst: vi.fn(),
      create: vi.fn(),
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

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

describe('POST /api/notes/versions/share', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si el usuario no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/share',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si los IDs son inválidos', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/share',
      method: 'POST',
      body: {
        noteId: 'invalid-id',
        versionId: 'invalid-id',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe compartir versión correctamente', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        noteId: TEST_IDS.NOTE,
      }) as any
    )

    vi.mocked(prisma.student.findMany).mockResolvedValue([
      { id: TEST_IDS.STUDENT },
      { id: TEST_IDS.STUDENT_2 },
    ] as any)

    vi.mocked(prisma.sharedNoteVersion.findFirst).mockResolvedValue(null) // No existe previamente
    vi.mocked(prisma.sharedNoteVersion.create).mockResolvedValue({
      id: 'shared-1',
      noteId: TEST_IDS.NOTE,
      versionId: TEST_IDS.VERSION,
      sharedById: TEST_IDS.STUDENT,
      sharedWithId: TEST_IDS.STUDENT_2,
      message: 'Mira esta versión',
      note: {
        id: TEST_IDS.NOTE,
        title: 'Nota de prueba',
      },
      sharedWith: {
        id: TEST_IDS.STUDENT_2,
        nombre: 'Estudiante 2',
      },
    } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/share',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        message: 'Mira esta versión',
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)

    expect(data.message).toContain('compartida')
  })
})

