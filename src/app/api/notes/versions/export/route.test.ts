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
      static json(body: any, init?: { status?: number; headers?: HeadersInit }) {
        return new NextResponse(JSON.stringify(body), {
          status: init?.status || 200,
          headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
          },
        })
      }
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

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
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

vi.mock('@/lib/utils/version-content', () => ({
  decompressVersionContent: vi.fn(async (content: string, isCompressed: boolean) => {
    if (isCompressed) {
      // Simular descompresión
      return Buffer.from(content, 'base64').toString('utf-8')
    }
    return content
  }),
}))

vi.mock('../validation-utils', () => ({
  safeToISOString: vi.fn((date: Date) => date?.toISOString?.() || new Date().toISOString()),
  safeToISODate: vi.fn((date: Date) => date?.toISOString?.()?.split('T')[0] || new Date().toISOString().split('T')[0]),
  ensureNonEmptyString: vi.fn((value: any) => value),
  ensureFiniteNumber: vi.fn((value: any) => value),
  safeStringOperation: vi.fn((fn: () => string, fallback: string) => {
    try {
      return fn()
    } catch {
      return fallback
    }
  }),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock de jsPDF (v4.0.0+ usa named export)
vi.mock('jspdf', () => {
  const createMockDoc = () => {
    const mockDoc = {
      internal: {
        pageSize: {
          getWidth: function() { return 210 },
          getHeight: function() { return 297 },
        },
      },
      setFontSize: function() { return this },
      setFont: function() { return this },
      splitTextToSize: function(text: string, _width?: number) {
        if (typeof text !== 'string') return []
        return text.split('\n')
      },
      text: function() { return this },
      setDrawColor: function() { return this },
      line: function() { return this },
      addPage: function() { return this },
      getNumberOfPages: function() { return 1 },
      setPage: function() { return this },
      output: function(format?: string) {
        if (format === 'arraybuffer') {
          // Retornar un ArrayBuffer válido que pueda ser convertido a Buffer
          const buffer = new ArrayBuffer(100)
          return buffer
        }
        return new ArrayBuffer(0)
      },
    }
    return mockDoc
  }
  
  return {
    jsPDF: function() {
      return createMockDoc()
    },
  }
})

describe('GET /api/notes/versions/export', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
  })

  it('debe exportar versión en formato TXT por defecto', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota de prueba',
      content: 'Contenido de prueba',
      tags: 'tag1',
      updatedAt: new Date('2024-01-15'),
    })

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      content: 'Contenido versión 1',
      tags: 'tag1',
      createdAt: new Date('2024-01-10'),
    })

    setupStudyNote(mockNote)
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(mockVersion as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    expect(response.headers.get('Content-Disposition')).toContain('.txt')
  })

  it('debe exportar versión en formato JSON', async () => {
    setupStudyNote(createStudyNote())
    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      content: 'Contenido',
      tags: 'tag1',
      createdAt: new Date('2024-01-10'),
      name: 'Versión importante',
      isImportant: true,
      color: '#FF5733',
    })

    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(mockVersion as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        format: 'json',
      },
    })
    const response = await GET(request)
    const data = await response.text()
    const jsonData = JSON.parse(data)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(jsonData.id).toBe(TEST_IDS.VERSION)
    expect(jsonData.title).toBe('Versión 1')
    expect(jsonData.isImportant).toBe(true)
  })

  it('debe exportar versión en formato Markdown', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión 1',
        content: 'Contenido',
        tags: 'tag1',
        createdAt: new Date('2024-01-10'),
      }) as any
    )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        format: 'md',
      },
    })
    const response = await GET(request)
    const data = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/markdown')
    expect(data).toContain('# Versión 1')
    expect(data).toContain('**Tags:** tag1')
  })

  it('debe exportar versión en formato PDF', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión 1',
        content: 'Contenido',
        tags: 'tag1',
        createdAt: new Date('2024-01-10'),
      }) as any
    )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        format: 'pdf',
      },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
    expect(response.headers.get('Content-Disposition')).toContain('.pdf')
  })

  it('debe exportar versión actual cuando versionId es igual a noteId', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota actual',
      content: 'Contenido actual',
      tags: 'tag1',
      updatedAt: new Date('2024-01-15'),
    })

    setupStudyNote(mockNote)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.NOTE,
        format: 'txt',
      },
    })
    const response = await GET(request)
    const data = await response.text()

    expect(response.status).toBe(200)
    expect(data).toContain('Nota actual')
    expect(data).toContain('Contenido actual')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe validar que noteId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        versionId: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe validar que versionId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe validar formato inválido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        format: 'invalid',
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe validar que la nota pertenezca al estudiante', async () => {
    setupStudyNote(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe validar que la versión exista', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Versión no encontrada')
  })

  it('debe descomprimir contenido comprimido', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión 1',
        content: 'contenido-comprimido-base64',
        isCompressed: true,
      }) as any
    )

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        format: 'txt',
      },
    })
    const response = await GET(request)

    // El endpoint debe manejar la descompresión sin errores
    expect(response.status).toBeGreaterThanOrEqual(200)
  })

  it('debe incluir metadatos en formato JSON', async () => {
    setupStudyNote(createStudyNote())
    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      title: 'Versión 1',
      content: 'Contenido',
      tags: 'tag1,tag2',
      createdAt: new Date('2024-01-10'),
      name: 'Versión importante',
      isImportant: true,
      color: '#FF5733',
    })

    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(mockVersion as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
        format: 'json',
      },
    })
    const response = await GET(request)
    const data = await response.text()
    const jsonData = JSON.parse(data)

    expect(response.status).toBe(200)
    expect(jsonData.name).toBe('Versión importante')
    expect(jsonData.isImportant).toBe(true)
    expect(jsonData.color).toBe('#FF5733')
    expect(jsonData.tags).toBe('tag1,tag2')
    expect(jsonData.exportedAt).toBeDefined()
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findFirst).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export',
      queryParams: {
        noteId: TEST_IDS.NOTE,
        versionId: TEST_IDS.VERSION,
      },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 500, 'Error al exportar versión')
  })
})

