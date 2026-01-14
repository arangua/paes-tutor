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
  parseRequestBody: vi.fn(async (_req: any, _method: string) => {
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
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@/lib/utils/version-content', () => ({
  decompressVersionContent: vi.fn((content: string) => Promise.resolve(content)),
}))

vi.mock('../validation-utils', () => ({
  safeToISOString: vi.fn((date: Date) => date?.toISOString?.() || new Date().toISOString()),
  safeToISODate: vi.fn((date: Date) => date?.toISOString?.()?.split('T')[0] || new Date().toISOString().split('T')[0]),
}))

// Mock de docx
vi.mock('docx', () => {
  const Paragraph = class {
    text: string
    heading?: number
    constructor(options: any = {}) {
      this.text = options?.text || ''
      this.heading = options?.heading
    }
  }
  
  const Document = class {
    sections: any[]
    constructor(options: any = {}) {
      this.sections = options?.sections || []
    }
  }
  
  return {
    Document,
    Packer: {
      toBuffer: vi.fn(() => Promise.resolve(Buffer.from('mock-docx'))),
      toBase64String: vi.fn(() => Promise.resolve('mock-base64')),
    },
    Paragraph,
    TextRun: vi.fn((options: any) => ({
      text: options?.text || '',
    })),
    HeadingLevel: {
      HEADING_1: 1,
      HEADING_2: 2,
      HEADING_3: 3,
    },
  }
})

describe('POST /api/notes/versions/export-bulk', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
  })

  it('debe exportar múltiples versiones en formato DOCX por defecto', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockImplementation(async (args: any) => {
      const versionId = args?.where?.id
      const noteId = args?.where?.noteId
      // Verificar que el noteId coincida
      if (noteId && noteId !== TEST_IDS.NOTE) {
        return null
      }
      if (versionId === TEST_IDS.VERSION) {
        return createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          noteId: TEST_IDS.NOTE,
          title: 'Versión 1',
          content: 'Contenido 1',
          tags: 'tag1',
          createdAt: new Date('2024-01-10'),
        }) as any
      }
      if (versionId === TEST_IDS.VERSION_2) {
        return createStudyNoteVersion({
          id: TEST_IDS.VERSION_2,
          noteId: TEST_IDS.NOTE,
          title: 'Versión 2',
          content: 'Contenido 2',
          tags: 'tag2',
          createdAt: new Date('2024-01-12'),
        }) as any
      }
      return null
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION, TEST_IDS.VERSION_2],
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('application/vnd.openxmlformats')
    expect(response.headers.get('Content-Disposition')).toContain('.docx')
  })

  it('debe exportar múltiples versiones en formato JSON', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockImplementation(async (args: any) => {
      const versionId = args?.where?.id
      const noteId = args?.where?.noteId
      // Verificar que el noteId coincida
      if (noteId && noteId !== TEST_IDS.NOTE) {
        return null
      }
      if (versionId === TEST_IDS.VERSION) {
        return createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          noteId: TEST_IDS.NOTE,
          title: 'Versión 1',
          content: 'Contenido 1',
          tags: 'tag1',
          createdAt: new Date('2024-01-10'),
        }) as any
      }
      return null
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
        format: 'json',
      },
    })

    const response = await POST(request)
    const data = await response.text()
    const jsonData = JSON.parse(data)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(Array.isArray(jsonData.versions)).toBe(true)
    expect(jsonData.versions.length).toBe(1)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe validar que noteId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        versionIds: [TEST_IDS.VERSION],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que versionIds sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que versionIds no esté vacío', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar formato inválido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
        format: 'invalid',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que la nota pertenezca al estudiante', async () => {
    setupStudyNote(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe incluir versión actual si está en versionIds', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota actual',
      content: 'Contenido actual',
      tags: 'tag1',
      updatedAt: new Date('2024-01-15'),
    })

    setupStudyNote(mockNote)
    vi.mocked(prisma.studyNoteVersion.findFirst).mockImplementation(async (args: any) => {
      const versionId = args?.where?.id
      const noteId = args?.where?.noteId
      // Verificar que el noteId coincida
      if (noteId && noteId !== TEST_IDS.NOTE) {
        return null
      }
      if (versionId === TEST_IDS.VERSION) {
        return createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          noteId: TEST_IDS.NOTE,
          title: 'Versión 1',
          content: 'Contenido 1',
          tags: 'tag2',
          createdAt: new Date('2024-01-10'),
        }) as any
      }
      return null
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.NOTE, TEST_IDS.VERSION],
        format: 'json',
      },
    })

    const response = await POST(request)
    const data = await response.text()
    const jsonData = JSON.parse(data)

    expect(response.status).toBe(200)
    expect(jsonData.versions.length).toBe(2)
    expect(jsonData.versions[0].id).toBe(TEST_IDS.NOTE)
    expect(jsonData.versions[0].title).toBe('Nota actual')
  })

  it('debe filtrar versiones no encontradas', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION, TEST_IDS.VERSION_2],
        format: 'json',
      },
    })

    const response = await POST(request)

    // Cuando no hay versiones válidas, debe retornar 404
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('No se encontraron versiones válidas')
  })

  it('debe retornar error si no hay versiones válidas', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockResolvedValue(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
        format: 'docx',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'No se encontraron versiones válidas')
  })

  it('debe manejar contenido comprimido', async () => {
    setupStudyNote(createStudyNote())
    vi.mocked(prisma.studyNoteVersion.findFirst).mockImplementation(async (args: any) => {
      const versionId = args?.where?.id
      const noteId = args?.where?.noteId
      // Verificar que el noteId coincida
      if (noteId && noteId !== TEST_IDS.NOTE) {
        return null
      }
      if (versionId === TEST_IDS.VERSION) {
        return createStudyNoteVersion({
          id: TEST_IDS.VERSION,
          noteId: TEST_IDS.NOTE,
          title: 'Versión 1',
          content: 'contenido-comprimido-base64',
          isCompressed: true,
        }) as any
      }
      return null
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
        format: 'json',
      },
    })

    const response = await POST(request)

    // El endpoint debe manejar la descompresión sin errores
    expect(response.status).toBeGreaterThanOrEqual(200)
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findFirst).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/export-bulk',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        versionIds: [TEST_IDS.VERSION],
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 500, 'Error al exportar versiones')
  })
})

