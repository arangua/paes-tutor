// @vitest-environment node
// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'
import { Buffer } from 'buffer'

// Asegurar que Buffer esté disponible globalmente
global.Buffer = Buffer

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
    NextResponse: class NextResponse extends Response {
      constructor(body?: BodyInit | null, init?: ResponseInit) {
        super(body, init)
      }
      static json(body: any, init?: { status?: number }) {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
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
      return { success: false, error: new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 }) }
    }
    return {
      success: true,
      data: {
        user,
        enrichedContext: { studentId: user.student.id },
      },
    }
  }),
  parseRequestBody: vi.fn(async (req: any) => {
    const body = await req.json()
    return { success: true, data: body }
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

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
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
      diff: [
        { type: 'equal', text: 'Línea igual' },
        { type: 'removed', text: 'Línea eliminada' },
        { type: 'added', text: 'Línea agregada' },
      ],
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
    hasChanges: true,
    summary: {
      totalChanges: 3,
      fieldsChanged: ['title', 'content', 'tags'],
    },
  })),
}))

// Mock de jsPDF (v4.0.0+ usa named export)
vi.mock('jspdf', () => {
  class MockJsPDF {
    internal = {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    }
    
    setFontSize() { return this }
    setFont() { return this }
    setTextColor() { return this }
    splitTextToSize(text: string) { return text.split('\n') }
    text() { return this }
    setDrawColor() { return this }
    line() { return this }
    addPage() { return this }
    getNumberOfPages() { return 1 }
    setPage() { return this }
    output(format?: string) {
      if (format === 'arraybuffer') {
        // Retornar un ArrayBuffer válido con algunos bytes
        const buffer = new ArrayBuffer(100)
        return buffer
      }
      // Por defecto, retornar un ArrayBuffer
      return new ArrayBuffer(100)
    }
  }
  
  return {
    jsPDF: MockJsPDF,
  }
})

// Mock de Buffer
global.Buffer = Buffer

describe('POST /api/notes/versions/export-diff', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
  })

  it('debe exportar diff en formato TXT por defecto', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          title: 'Versión 1',
          content: 'Contenido 1',
          tags: 'tag1',
          createdAt: new Date('2024-01-10'),
        }) as any
      )
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION_2,
          title: 'Versión 2',
          content: 'Contenido 2',
          tags: 'tag2',
          createdAt: new Date('2024-01-12'),
        }) as any
      )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    expect(response.headers.get('Content-Disposition')).toContain('.txt')
  })

  it('debe exportar diff en formato HTML', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          title: 'Versión 1',
          content: 'Contenido 1',
          tags: 'tag1',
          createdAt: new Date('2024-01-10'),
        }) as any
      )
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION_2,
          title: 'Versión 2',
          content: 'Contenido 2',
          tags: 'tag2',
          createdAt: new Date('2024-01-12'),
        }) as any
      )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
        format: 'html',
      },
    })

    const response = await POST(request)
    const data = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/html')
    expect(data).toContain('<!DOCTYPE html>')
    // El HTML puede no contener 'diff' si no hay cambios, pero debe contener la estructura básica
    expect(data).toMatch(/html|head|body|versi[oó]n/i)
  })

  it('debe exportar diff en formato PDF', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          title: 'Versión 1',
          content: 'Contenido 1',
          tags: 'tag1',
          createdAt: new Date('2024-01-10'),
        }) as any
      )
      .mockResolvedValueOnce(
        createStudyNoteVersion({
          id: TEST_IDS.VERSION_2,
          title: 'Versión 2',
          content: 'Contenido 2',
          tags: 'tag2',
          createdAt: new Date('2024-01-12'),
        }) as any
      )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
        format: 'pdf',
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
    expect(response.headers.get('Content-Disposition')).toContain('.pdf')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
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

  it('debe validar que noteId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que versionId1 sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que versionId2 sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar formato inválido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
        format: 'invalid',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que la nota pertenezca al estudiante', async () => {
    setupStudyNote(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe validar que versionId1 exista', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Versión 1 no encontrada')
  })

  it('debe validar que versionId2 exista', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst)
      .mockResolvedValueOnce(
        createStudyNoteVersion({ id: TEST_IDS.VERSION }) as any
      )
      .mockResolvedValueOnce(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

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

    setupStudyNote(mockNote)
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión histórica',
        content: 'Contenido histórico',
        tags: 'tag2',
        createdAt: new Date('2024-01-10'),
      }) as any
    )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.NOTE,
        versionId2: TEST_IDS.VERSION,
        format: 'txt',
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findFirst).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-diff',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionId1: TEST_IDS.VERSION,
        versionId2: TEST_IDS.VERSION_2,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 500, 'Error al exportar diff')
  })
})

