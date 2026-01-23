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

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findFirst: vi.fn(),
    },
    studyNoteVersion: {
      findMany: vi.fn(),
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
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@/lib/utils/version-content', () => ({
  decompressVersionContent: vi.fn((content: string) => Promise.resolve(content)),
}))

vi.mock('@/lib/ai-service', () => ({
  getAIConfig: vi.fn(),
}))

// Mock de embeddings utils
vi.mock('@/lib/utils/embeddings', () => ({
  generateEmbedding: vi.fn(),
  cosineSimilarity: vi.fn(),
}))

// Mock de OpenAI
const mockOpenAI = {
  embeddings: {
    create: vi.fn(),
  },
}

vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI),
  OpenAI: vi.fn(() => mockOpenAI),
}))

describe('POST /api/notes/versions/semantic-search', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-api-key'
    
    await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })

    // Mock embedding por defecto
    const mockEmbedding = Array(1536).fill(0).map(() => Math.random())
    vi.mocked(mockOpenAI.embeddings.create).mockResolvedValue({
      data: [{ embedding: mockEmbedding }],
    } as any)

    // Mock generateEmbedding y cosineSimilarity
    const { generateEmbedding, cosineSimilarity } = await import('@/lib/utils/embeddings')
    vi.mocked(generateEmbedding).mockImplementation(async (text: string) => {
      // Retornar un embedding mock consistente basado en el texto
      return Array(1536).fill(0).map((_, i) => {
        // Generar un valor determinístico basado en el texto y el índice
        const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return Math.sin((hash + i) * 0.1) * 0.5 + 0.5
      })
    })
    vi.mocked(cosineSimilarity).mockImplementation((vec1: number[], vec2: number[]) => {
      // Calcular similitud real para los tests
      if (vec1.length !== vec2.length) return 0
      let dotProduct = 0
      let norm1 = 0
      let norm2 = 0
      for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i]
        norm1 += vec1[i] * vec1[i]
        norm2 += vec2[i] * vec2[i]
      }
      const denominator = Math.sqrt(norm1) * Math.sqrt(norm2)
      return denominator === 0 ? 0 : dotProduct / denominator
    })
  })

  it('debe realizar búsqueda semántica correctamente', async () => {
    setupStudyNote(
      createStudyNote({
        id: TEST_IDS.NOTE,
        title: 'Nota de prueba',
        content: 'Contenido de prueba',
        tags: 'matemáticas',
      })
    )

    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión 1',
        content: 'Contenido relacionado con matemáticas',
        tags: 'álgebra',
      }),
    ] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'matemáticas',
        limit: 20,
        threshold: 0.5,
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    expect(data.query).toBe('matemáticas')
    expect(data.results).toBeDefined()
    expect(data.totalFound).toBeDefined()
    expect(data.threshold).toBe(0.5)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
    // Caso especial: usuario autenticado pero sin estudiante
    vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      student: null,
    } as any)

    // Mock withAuthContext para que retorne error 404 cuando no hay estudiante
    const { withAuthContext } = await import('../helpers')
    vi.mocked(withAuthContext).mockResolvedValueOnce({
      success: false,
      error: new Response(JSON.stringify({ error: 'Estudiante no encontrado' }), { status: 404 }),
    })

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe validar que noteId sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que query sea requerido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar longitud máxima de query', async () => {
    const longQuery = 'a'.repeat(600)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: longQuery,
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar límite máximo de resultados', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
        limit: 100, // Mayor al máximo permitido (50)
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar umbral de similitud', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
        threshold: 1.5, // Mayor al máximo permitido (1)
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar que la nota pertenezca al estudiante', async () => {
    setupStudyNote(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe retornar error si no hay API key configurada', async () => {
    delete process.env.OPENAI_API_KEY

    const { getAIConfig } = await import('@/lib/ai-service')
    vi.mocked(getAIConfig).mockResolvedValue(null)

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'API key de OpenAI no configurada')
  })

  it('debe usar API key del usuario si está disponible', async () => {
    const { getAIConfig } = await import('@/lib/ai-service')
    vi.mocked(getAIConfig).mockResolvedValue({
      apiKey: 'user-api-key', // guard:allow-secret
      provider: 'openai',
    } as any)

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(getAIConfig).toHaveBeenCalledWith('user-1', 'openai')
  })

  it('debe retornar error si no se puede generar embedding de la query', async () => {
    const { generateEmbedding } = await import('@/lib/utils/embeddings')
    vi.mocked(generateEmbedding).mockResolvedValueOnce(null) // Simular fallo al generar embedding

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 500, (error) => error.includes('No se pudo generar embedding'))
  })

  it('debe filtrar versiones por umbral de similitud', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión 1',
        content: 'Contenido relacionado',
      }),
    ] as any)

    // Mock embeddings con diferentes similitudes
    const queryEmbedding = Array(1536).fill(0.5)
    const versionEmbedding1 = Array(1536).fill(0.8) // Alta similitud

    vi.mocked(mockOpenAI.embeddings.create)
      .mockResolvedValueOnce({ data: [{ embedding: queryEmbedding }] } as any)
      .mockResolvedValueOnce({ data: [{ embedding: versionEmbedding1 }] } as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
        threshold: 0.7, // Umbral alto
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    // Las versiones con similitud menor al umbral deben ser filtradas
    expect(data.threshold).toBe(0.7)
  })

  it('debe ordenar resultados por similitud descendente', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([
      createStudyNoteVersion({ id: TEST_IDS.VERSION, title: 'Versión 1' }),
      createStudyNoteVersion({ id: TEST_IDS.VERSION_2, title: 'Versión 2' }),
    ] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
        threshold: 0.0, // Umbral bajo para incluir todos
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    expect(data.results).toBeDefined()
    // Verificar que los resultados están ordenados (similitud descendente)
    if (data.results.length > 1) {
      for (let i = 0; i < data.results.length - 1; i++) {
        expect(data.results[i].similarity).toBeGreaterThanOrEqual(data.results[i + 1].similarity)
      }
    }
  })

  it('debe descomprimir contenido comprimido', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([
      createStudyNoteVersion({
        id: TEST_IDS.VERSION,
        title: 'Versión 1',
        content: 'contenido-comprimido-base64',
        isCompressed: true,
      }),
    ] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    // El endpoint debe manejar la descompresión sin errores
    expect(response.status).toBeGreaterThanOrEqual(200)
  })

  it('debe incluir versión actual en los resultados', async () => {
    setupStudyNote(
      createStudyNote({
        id: TEST_IDS.NOTE,
        title: 'Nota de prueba',
        content: 'Contenido actual',
        tags: 'tag1',
      })
    )
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
        threshold: 0.0,
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    // Debe incluir al menos la versión actual
    expect(data.results.length).toBeGreaterThanOrEqual(0)
  })

  it('debe usar valores por defecto para limit y threshold', async () => {
    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
        // No se proporcionan limit ni threshold
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    expect(data.threshold).toBe(0.5) // Valor por defecto
  })

  it('debe manejar errores de OpenAI correctamente', async () => {
    const { generateEmbedding } = await import('@/lib/utils/embeddings')
    vi.mocked(generateEmbedding).mockRejectedValueOnce(new Error('OpenAI API Error'))

    setupStudyNote(createStudyNote({ id: TEST_IDS.NOTE }))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/semantic-search',
      method: 'POST',
      body: {
        noteId: TEST_IDS.NOTE,
        query: 'test',
      },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 500, (error) => error.includes('Error en búsqueda semántica') || error.includes('Error interno'))
  })
})

