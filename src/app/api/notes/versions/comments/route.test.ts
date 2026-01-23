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
import { GET, POST, PATCH, DELETE } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  setupAuthenticatedUser,
  setupStudyNote,
  createTestRequest,
  assertSuccessResponse,
} from '../__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findFirst: vi.fn(),
    },
    studyNoteVersion: {
      findFirst: vi.fn(),
    },
    versionComment: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
    // PASO 4: Usar símbolo para cachear body (solución enterprise mínima)
    const BODY_SYMBOL = Symbol.for("test.rawBody")
    const rawFromSymbol = (req as any)[BODY_SYMBOL]
    
    // Si hay body en el símbolo, usarlo directamente
    if (typeof rawFromSymbol === "string" && rawFromSymbol.trim().length > 0) {
      try {
        return { success: true, data: JSON.parse(rawFromSymbol) }
      } catch {
        return { 
          success: false, 
          error: new Response(JSON.stringify({ error: 'El cuerpo de la solicitud no puede estar vacío' }), { status: 400 }) 
        }
      }
    }
    
    // Fallback: intentar leer desde _bodyText (para compatibilidad)
    const bodyText = (req as any)._bodyText
    if (typeof bodyText === "string" && bodyText.trim().length > 0) {
      try {
        return { success: true, data: JSON.parse(bodyText) }
      } catch {
        return { 
          success: false, 
          error: new Response(JSON.stringify({ error: 'El cuerpo de la solicitud no puede estar vacío' }), { status: 400 }) 
        }
      }
    }
    
    // Si no hay body, retornar error
    return { 
      success: false, 
      error: new Response(JSON.stringify({ error: 'El cuerpo de la solicitud no puede estar vacío' }), { status: 400 }) 
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

describe('GET /api/notes/versions/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar comentarios de una versión', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    setupStudyNote({
      id: TEST_IDS.NOTE,
      studentId: TEST_IDS.STUDENT,
    } as any)

    vi.mocked(prisma.versionComment.findMany).mockResolvedValue([
      {
        id: 'comment-1',
        comment: 'Este es un comentario',
        createdBy: 'student-1',
        createdAt: new Date(),
      },
    ] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/comments',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.comments).toBeDefined()
    expect(Array.isArray(data.comments)).toBe(true)
  })
})

describe('POST /api/notes/versions/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe crear comentario correctamente', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    setupStudyNote({
      id: TEST_IDS.NOTE,
      studentId: TEST_IDS.STUDENT,
    } as any)

    // Mock de verificación de versión (cuando versionId !== noteId)
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue({
      id: TEST_IDS.VERSION,
      noteId: TEST_IDS.NOTE,
    } as any)

    vi.mocked(prisma.versionComment.create).mockResolvedValue({
      id: 'comment-1',
      noteId: TEST_IDS.NOTE,
      versionId: TEST_IDS.VERSION,
      comment: 'Nuevo comentario',
      createdBy: TEST_IDS.STUDENT,
      createdAt: new Date(),
    } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/comments',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        comment: 'Nuevo comentario',
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)

    expect(data.message).toContain('creado')
  })
})

describe('PATCH /api/notes/versions/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe actualizar comentario correctamente', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    const commentId = 'c123456789012345678901234' // CUID válido
    
    vi.mocked(prisma.versionComment.findFirst).mockResolvedValue({
      id: commentId,
      createdBy: TEST_IDS.STUDENT,
      noteId: TEST_IDS.NOTE,
      versionId: TEST_IDS.VERSION,
    } as any)

    vi.mocked(prisma.versionComment.update).mockResolvedValue({
      id: commentId,
      comment: 'Comentario actualizado',
    } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/comments',
      method: 'PATCH',
      body: {
        commentId: commentId,
        comment: 'Comentario actualizado',
      },
    })

    const response = await PATCH(request)
    const data = await assertSuccessResponse(response)

    expect(data.message).toContain('actualizado')
  })
})

describe('DELETE /api/notes/versions/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe eliminar comentario correctamente', async () => {
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    vi.mocked(prisma.versionComment.findFirst).mockResolvedValue({
      id: 'comment-1',
      createdBy: TEST_IDS.STUDENT,
      noteId: TEST_IDS.NOTE,
      versionId: TEST_IDS.VERSION,
    } as any)

    vi.mocked(prisma.versionComment.delete).mockResolvedValue({
      id: 'comment-1',
    } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost/api/notes/versions/comments',
      method: 'DELETE',
      queryParams: {
        commentId: 'comment-1',
      },
    })

    const response = await DELETE(request)
    const data = await assertSuccessResponse(response)

    expect(data.message).toContain('eliminado')
  })
})

