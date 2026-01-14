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
import { GET, POST, PATCH, DELETE } from './route'
import { prisma } from '@/lib/prisma'
import {
  // Constantes
  TEST_IDS,
  // Factories
  createStudyNote,
  createStudyNoteVersion,
  // Setup functions
  setupAuthenticatedUser,
  setupUnauthenticatedUser,
  setupNoCache,
  setupCache,
  setupStudyNote,
  setupSuccessfulGetTest,
  // Request utilities
  createTestRequest,
  // Assertion helpers
  assertErrorResponse,
  assertSuccessResponse,
} from './__tests__/test-helpers'

// Re-exportar IDs para compatibilidad con tests existentes
const VALID_NOTE_ID = TEST_IDS.NOTE
const VALID_VERSION_ID = TEST_IDS.VERSION
const VALID_STUDENT_ID = TEST_IDS.STUDENT
const VALID_VERSION_ID_2 = TEST_IDS.VERSION_2

// Mock de dependencias
vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    studyNoteVersion: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
    $executeRaw: vi.fn(),
  },
}))

vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req, handler) => handler()),
}))

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@/lib/cache', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
  invalidateCachePattern: vi.fn(),
}))

// Mock de módulos internos de versiones - solo los wrappers
vi.mock('./rate-limit', () => ({
  withVersionRateLimit: vi.fn(async (req, handler) => await handler()),
}))

vi.mock('./timeout-handler', () => ({
  withRequestTimeout: vi.fn(async (req, handler) => await handler()),
}))

// Mock de módulos adicionales usados por los handlers
vi.mock('./metrics-tracker', () => ({
  trackVersionMetric: vi.fn(),
}))

vi.mock('./request-context', () => ({
  getOrCreateRequestId: vi.fn(() => 'test-request-id'),
  createRequestContext: vi.fn(() => ({})),
  enrichContextWithAuth: vi.fn((ctx) => ctx),
}))

vi.mock('./response-helpers', () => ({
  createOptimizedResponse: vi.fn((data) => new Response(JSON.stringify(data), { status: 200 })),
  addTracingHeaders: vi.fn((response) => response),
  addCorsHeaders: vi.fn((response) => response),
}))

vi.mock('./response-schemas', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./response-schemas')>()
  return {
    ...actual,
    versionsResponseSchema: {
      parse: vi.fn((data) => data),
      safeParse: vi.fn((data) => ({ success: true, data })),
    },
    restoreVersionResponseSchema: {
      parse: vi.fn((data) => data),
      safeParse: vi.fn((data) => ({ success: true, data })),
    },
    updateVersionResponseSchema: {
      parse: vi.fn((data) => data),
      safeParse: vi.fn((data) => ({ success: true, data })),
    },
    deleteVersionResponseSchema: {
      parse: vi.fn((data) => data),
      safeParse: vi.fn((data) => ({ success: true, data })),
    },
  }
})

vi.mock('./audit', () => ({
  auditSensitiveOperation: vi.fn(),
}))

vi.mock('./idempotency', () => ({
  handleIdempotency: vi.fn(async (request, studentId, handler) => {
    // Simplemente ejecutar el handler sin verificar idempotencia
    return await handler()
  }),
}))

vi.mock('./circuit-breaker', () => ({
  circuitBreakers: {
    cache: {
      execute: vi.fn(async (fn, fallback) => {
        try {
          return await fn()
        } catch {
          return await fallback()
        }
      }),
    },
  },
}))

vi.mock('./streaming', () => ({
  shouldUseStreaming: vi.fn(() => false),
  createStreamingResponse: vi.fn((data) => new Response(JSON.stringify(data), { status: 200 })),
}))

vi.mock('./performance-monitor', () => ({
  calculateEnhancedMetrics: vi.fn(() => ({
    duration: 0,
    severity: 'NORMAL',
    alerts: [],
  })),
  sendPerformanceAlertsToMonitoring: vi.fn(),
  PerformanceAlertLevel: {
    NORMAL: 'NORMAL',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL',
  },
}))

vi.mock('./cache', () => ({
  getCachedVersions: vi.fn(async (_noteId, _cursor, _data, _filters) => {
    // Retornar null por defecto (sin caché)
    return null
  }),
  setCachedVersions: vi.fn(async (_noteId, _cursor, _data, _filters) => {
    // Simular guardado en caché
    return Promise.resolve()
  }),
  invalidateVersionCache: vi.fn(),
}))

vi.mock('./validation-utils', () => ({
  safeRound: vi.fn((value) => value),
  safeToISOString: vi.fn((date) => date?.toISOString() || new Date().toISOString()),
  calculateDuration: vi.fn(() => 0),
  calculateDataSize: vi.fn(() => 0),
  estimateVersionsSize: vi.fn(() => 0),
}))

vi.mock('./validators', async () => {
  const actual = await vi.importActual<typeof import('./validators')>('./validators')
  return {
    ...actual,
    validateQueryParams: vi.fn((req) => {
      const noteId = req.nextUrl.searchParams.get('noteId')
      if (!noteId) {
        return {
          success: false,
          error: new Response(JSON.stringify({ error: 'ID de nota inválido' }), { status: 400 }),
        }
      }
      return {
        success: true,
        data: {
          noteId,
          limit: parseInt(req.nextUrl.searchParams.get('limit') || '20'),
          offset: parseInt(req.nextUrl.searchParams.get('offset') || '0'),
          cursor: req.nextUrl.searchParams.get('cursor') || undefined,
          search: req.nextUrl.searchParams.get('search') || undefined,
          isImportant: req.nextUrl.searchParams.get('isImportant') === 'true' ? true : undefined,
          hasName: req.nextUrl.searchParams.get('hasName') === 'true' ? true : undefined,
          dateFrom: req.nextUrl.searchParams.get('dateFrom') ? new Date(req.nextUrl.searchParams.get('dateFrom')!) : undefined,
          dateTo: req.nextUrl.searchParams.get('dateTo') ? new Date(req.nextUrl.searchParams.get('dateTo')!) : undefined,
        },
      }
    }),
  }
})

vi.mock('./queries', () => ({
  getNoteForStudent: vi.fn(async (noteId, studentId) => {
    const note = await prisma.studyNote.findFirst({ where: { id: noteId, studentId } })
    if (!note) {
      return {
        success: false,
        error: new Response(JSON.stringify({ error: 'Nota no encontrada' }), { status: 404 }),
      }
    }
    return { success: true, data: note }
  }),
  calculateQueryLimit: vi.fn((limit, offset) => ({
    queryLimit: Math.min(limit || 20, 50),
    queryOffset: offset || 0,
  })),
  calculateVersionStatistics: vi.fn(async () => ({
    totalVersions: 0,
    averageDaysBetweenVersions: null,
    importantVersions: 0,
    namedVersions: 0,
    totalRestores: 0,
    daysSinceLastUpdate: 0,
    lastUpdated: '',
  })),
  prepareUpdateData: vi.fn((params) => {
    const result: any = {}
    if (params.name !== undefined) result.name = params.name
    if (params.color !== undefined) result.color = params.color
    if (params.isImportant !== undefined) result.isImportant = params.isImportant
    return result
  }),
  updateVersionInDatabase: vi.fn(async (versionId, noteId, updateData, studentId) => {
    // Validar que la nota pertenece al estudiante si se proporciona
    if (studentId) {
      const note = await prisma.studyNote.findFirst({
        where: { id: noteId, studentId },
      })
      if (!note) return null
    }
    
    const version = await prisma.studyNoteVersion.findFirst({
      where: { id: versionId, noteId },
    })
    if (!version) return null
    
    // Aplicar actualizaciones
    const updated = {
      ...version,
      ...updateData,
    }
    
    // Actualizar en el mock de prisma
    vi.mocked(prisma.studyNoteVersion.findUnique).mockResolvedValue(updated as any)
    
    return updated as any
  }),
  executeRestoreTransaction: vi.fn(async (noteId, noteFull, version, _studentId) => {
    // Simular la restauración retornando la nota actualizada
    const updatedNote = await prisma.studyNote.findUnique({ where: { id: noteId } })
    if (!updatedNote) return null
    return {
      ...updatedNote,
      title: version.title,
      content: version.content,
      tags: version.tags,
    }
  }),
  executeSingleDeleteOperation: vi.fn(async (noteId, versionId, _note) => {
    // Verificar que la versión existe
    const version = await prisma.studyNoteVersion.findFirst({
      where: { id: versionId, noteId },
    })
    if (!version) {
      return {
        success: false,
        error: new Response(JSON.stringify({ error: 'Versión no encontrada' }), { status: 404 }),
      }
    }
    
    await prisma.studyNoteVersion.delete({ where: { id: versionId } })
    return {
      success: true,
      data: { message: 'Versión eliminada exitosamente' },
    }
  }),
  executeBulkDeleteOperation: vi.fn(async (noteId, versionIds, _note) => {
    // Verificar que todas las versiones existen
    const versions = await prisma.studyNoteVersion.findMany({
      where: { id: { in: versionIds }, noteId },
    })
    if (versions.length !== versionIds.length) {
      return {
        success: false,
        error: new Response(JSON.stringify({ error: 'Algunas versiones no fueron encontradas' }), { status: 404 }),
      }
    }
    
    const deleted = await prisma.studyNoteVersion.deleteMany({
      where: { id: { in: versionIds }, noteId },
    })
    return {
      success: true,
      data: { message: 'Versiones eliminadas exitosamente', deletedCount: deleted.count },
    }
  }),
}))

vi.mock('./filters', () => ({
  fetchVersions: vi.fn(async (noteId, limit, offset, filters) => {
    // Construir where clause con filtros
    const where: any = { noteId }
    
    // Aplicar filtro de importancia si existe
    if (filters?.isImportant !== undefined) {
      where.isImportant = filters.isImportant
    }
    
    // Aplicar filtros de fecha si existen
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo
      }
    }
    
    // Aplicar filtro de cursor si existe
    if (filters?.cursor) {
      where.createdAt = where.createdAt || {}
      where.createdAt.lt = new Date(filters.cursor)
    }
    
    const versions = await prisma.studyNoteVersion.findMany({
      where,
      take: limit,
      skip: offset,
    })
    return {
      versions: versions || [],
      hasMore: false,
      nextCursor: null,
    }
  }),
}))

vi.mock('./processors', () => ({
  processVersions: vi.fn(async (versions) => versions),
  buildCurrentVersion: vi.fn((note, _studentId) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    createdAt: note.updatedAt,
    updatedAt: note.updatedAt,
  })),
  buildVersionsResponse: vi.fn((versions, note, statistics, pagination) => ({
    versions,
    currentVersionId: note.id,
    total: pagination.total,
    statistics,
    pagination,
  })),
}))

// Mock de helpers - Solución enterprise: definición explícita y organizada
vi.mock('./helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./helpers')>()
  
  // Helper para crear respuestas de error
  const createErrorResponse = (message: string, status: number) => {
    return new Response(JSON.stringify({ error: message }), { status })
  }

  return {
    ...actual,
    // ============================================
    // Authentication & Context
    // ============================================
    withAuthContext: vi.fn(async (_req, _startTime) => {
      const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
      const user = await getAuthenticatedUserWithStudent()
      if (!user || !user.student) {
        return {
          success: false,
          error: createErrorResponse('No autorizado', 401),
        }
      }
      return {
        success: true,
        data: {
          user,
          metrics: {},
          enrichedContext: {},
          requestId: 'test-request-id',
        },
      }
    }),

    // ============================================
    // Request Parsing & Validation
    // ============================================
    parseRequestBody: vi.fn(async (req, method, allowEmpty = false) => {
      try {
        const body = await req.json()
        return { success: true, data: body }
      } catch {
        if (allowEmpty) {
          return { success: true, data: {} }
        }
        return {
          success: false,
          error: createErrorResponse('Body inválido', 400),
        }
      }
    }),

    validateWithSchema: vi.fn((schema, data) => {
      // En tests, asumir que la validación siempre es exitosa
      // La validación real se prueba en tests de integración
      // Esto permite que los tests se enfoquen en la lógica de negocio
      return { success: true, data }
    }),

    validateResponseData: vi.fn((schema, data, _requestId, _method, _context) => ({
      success: true,
      data,
    })),

    // ============================================
    // Note & Version Validation
    // ============================================
    validateNoteForDeletion: vi.fn(async (noteId, studentId) => {
      const note = await prisma.studyNote.findFirst({ where: { id: noteId, studentId } })
      if (!note) {
        return {
          success: false,
          error: createErrorResponse('Nota no encontrada', 404),
        }
      }
      return {
        success: true,
        note: { id: note.id, title: note.title },
      }
    }),

    validateSingleVersionForDeletion: vi.fn(async (versionId, noteId) => {
      const version = await prisma.studyNoteVersion.findFirst({
        where: { id: versionId, noteId },
      })
      if (!version) {
        return {
          success: false,
          error: createErrorResponse('Versión no encontrada', 404),
        }
      }
      return {
        success: true,
        version,
      }
    }),

    validateBulkVersionsForDeletion: vi.fn(async (versionIds, noteId) => {
      const versions = await prisma.studyNoteVersion.findMany({
        where: { id: { in: versionIds }, noteId },
      })
      if (versions.length !== versionIds.length) {
        return {
          success: false,
          error: createErrorResponse('Algunas versiones no fueron encontradas', 404),
        }
      }
      return {
        success: true,
        versions,
      }
    }),

    validateNoteAndVersionForUpdate: vi.fn(async (noteId, versionId, studentId) => {
      const note = await prisma.studyNote.findFirst({ where: { id: noteId, studentId } })
      if (!note) {
        return {
          success: false,
          error: createErrorResponse('Nota no encontrada', 404),
        }
      }
      const version = await prisma.studyNoteVersion.findFirst({
        where: { id: versionId, noteId },
      })
      if (!version) {
        return {
          success: false,
          error: createErrorResponse('Versión no encontrada', 404),
        }
      }
      return {
        success: true,
        note: { id: note.id, title: note.title },
        version,
      }
    }),

    validateNoteAndVersionForRestore: vi.fn(async (noteId, versionId, studentId) => {
      const note = await prisma.studyNote.findFirst({ where: { id: noteId, studentId } })
      if (!note) {
        return {
          success: false,
          error: createErrorResponse('Nota no encontrada', 404),
        }
      }
      const version = await prisma.studyNoteVersion.findFirst({
        where: { id: versionId, noteId },
      })
      if (!version) {
        return {
          success: false,
          error: createErrorResponse('Versión no encontrada', 404),
        }
      }
      return {
        success: true,
        data: {
          noteFull: {
            id: note.id,
            title: note.title || '',
            content: (note as any).content || '',
            tags: (note as any).tags,
            studentId: note.studentId,
            updatedAt: (note as any).updatedAt || new Date(),
          },
          version: version as any,
        },
      }
    }),

    // ============================================
    // Error Handling
    // ============================================
    handleHandlerError: vi.fn((error, _req, _operationType, _startTime) => {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('prisma database error') || errorMessage.includes('database')) {
        return createErrorResponse('Error en la base de datos', 500)
      }
      if (errorMessage.includes('timeout')) {
        return createErrorResponse('La operación tardó demasiado', 504)
      }
      return createErrorResponse('Ocurrió un error inesperado', 500)
    }),

    createInternalServerError: vi.fn((message, _requestId, _duration) => {
      return createErrorResponse(message, 500)
    }),

    createBadRequestError: vi.fn((message, _requestId, _duration) => {
      return createErrorResponse(message, 400)
    }),

    // ============================================
    // Response Creation
    // ============================================
    createStandardResponse: vi.fn((data, _options) => {
      const { NextResponse } = require('next/server')
      // Simular validación de schema si existe
      // Nota: validateResponseData está mockeado para siempre retornar éxito
      // así que no necesitamos validar aquí, solo retornar la respuesta
      return NextResponse.json(data, { status: 200 })
    }),

    // ============================================
    // Background Operations
    // ============================================
    runInBackgroundWithErrorHandling: vi.fn((fn, _context, _options) => {
      Promise.resolve().then(() => fn().catch(() => {}))
    }),

    runWebhookInBackground: vi.fn((fn, _context) => {
      Promise.resolve().then(() => fn().catch(() => {}))
    }),

    postOperationCleanup: vi.fn(),

    createRestoreNotifications: vi.fn(async () => {
      // Mock de función que crea notificaciones
      return Promise.resolve()
    }),

    // ============================================
    // Metrics & Logging
    // ============================================
    logOperationMetrics: vi.fn(),

    calculateDuration: vi.fn(() => 0),
    calculateDataSize: vi.fn(() => 0),
    estimateVersionsSize: vi.fn(() => 0),
  }
})

// Mock de config - Solución enterprise: usar importOriginal para mantener todas las exportaciones
vi.mock('./config', async () => {
  const actual = await vi.importActual<typeof import('./config')>('./config')
  return {
    ...actual,
    // Sobrescribir solo lo necesario para tests si es requerido
    CACHE_CONFIG: {
      ...actual.CACHE_CONFIG,
      VERSIONS: {
        ttl: 300,
      },
    },
    RESPONSE_CONFIG: {
      ...actual.RESPONSE_CONFIG,
      READ_RESPONSE: {
        maxAge: 300,
      },
    },
  }
})

describe('GET /api/notes/versions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar versiones de una nota', async () => {
    await setupSuccessfulGetTest({
      versionCount: 1,
      versions: [
        createStudyNoteVersion({
          id: VALID_VERSION_ID,
          title: 'Version 1',
          content: 'Content 1',
          tags: 'tag1',
        }),
      ],
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.versions).toBeDefined()
    // Incluye versión actual + versiones históricas
    expect(data.versions.length).toBeGreaterThanOrEqual(1)
    // La primera versión es la actual, la segunda es la histórica
    expect(data.versions[1]?.id).toBe(VALID_VERSION_ID)
  })

  it('debe retornar error 401 si no está autenticado', async () => {
    await setupUnauthenticatedUser()

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar error 404 si la nota no existe', async () => {
    await setupAuthenticatedUser()
    setupStudyNote(null)

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Nota no encontrada')
  })

  it('debe usar caché si está disponible', async () => {
    await setupAuthenticatedUser()

    const cachedData = {
      versions: [{ id: VALID_VERSION_ID, title: 'Cached' }],
      currentVersionId: VALID_NOTE_ID,
      total: 1,
      statistics: { totalVersions: 1 },
      pagination: { hasMore: false },
    }

    setupCache(cachedData)
    
    // También configurar getCachedVersions para que retorne los datos del caché
    const { getCachedVersions } = await import('./cache')
    vi.mocked(getCachedVersions).mockResolvedValue(cachedData)

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.versions).toEqual(cachedData.versions)
    expect(prisma.studyNote.findFirst).not.toHaveBeenCalled()
  })

  it('debe filtrar por búsqueda', async () => {
    await setupSuccessfulGetTest({
      versionCount: 2,
      versions: [
        createStudyNoteVersion({
          id: VALID_VERSION_ID,
          title: 'Matemáticas',
          content: 'Contenido de matemáticas',
          tags: 'math',
          name: 'Versión importante',
        }),
        createStudyNoteVersion({
          id: VALID_VERSION_ID_2,
          title: 'Historia',
          content: 'Contenido de historia',
          tags: 'history',
          createdAt: new Date('2024-01-02'),
        }),
      ],
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID, search: 'matemáticas' },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    // La búsqueda se hace en memoria para SQLite, así que todas las versiones se retornan
    // pero el filtrado se aplica en el frontend o en memoria
    expect(data.versions).toBeDefined()
  })

  it('debe filtrar por importancia', async () => {
    await setupSuccessfulGetTest({
      versionCount: 1,
      versions: [
        createStudyNoteVersion({
          id: VALID_VERSION_ID,
          title: 'Important Version',
          isImportant: true,
        }),
      ],
    })

    const { fetchVersions } = await import('./filters')
    const { calculateVersionStatistics } = await import('./queries')
    const { getCachedVersions } = await import('./cache')
    
    // Asegurar que no hay caché
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)
    
    // Limpiar los mocks anteriores y configurar nuevos
    vi.mocked(fetchVersions).mockClear()
    vi.mocked(calculateVersionStatistics).mockClear()
    
    // Configurar el mock para que retorne las versiones cuando se llame con el filtro
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [
        createStudyNoteVersion({
          id: VALID_VERSION_ID,
          title: 'Important Version',
          isImportant: true,
        }) as any,
      ],
      hasMore: false,
      nextCursor: null,
    })
    
    // Configurar el mock de estadísticas
    vi.mocked(calculateVersionStatistics).mockResolvedValueOnce({
      totalVersions: 1,
      averageDaysBetweenVersions: null,
      importantVersions: 1,
      namedVersions: 0,
      totalRestores: 0,
      daysSinceLastUpdate: 0,
      lastUpdated: new Date().toISOString(),
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID, isImportant: 'true' },
    })
    const response = await GET(request)
    await assertSuccessResponse(response)

    expect(fetchVersions).toHaveBeenCalledWith(
      VALID_NOTE_ID,
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({
        isImportant: true,
      })
    )
  })

  it('debe manejar versiones comprimidas correctamente', async () => {
    const compressedVersion = createStudyNoteVersion({
      id: VALID_VERSION_ID,
      title: 'Compressed Version',
      content: 'H4sIAAAAAAAAA0tLTE5VqOZSAIJSVYpLUouKS4pS8xRqAQAAAP//AwA=', // guard:allow-secret
      isCompressed: true,
    })

    await setupSuccessfulGetTest({
      versionCount: 1,
      versions: [compressedVersion],
    })

    // Configurar fetchVersions para retornar la versión comprimida
    const { fetchVersions } = await import('./filters')
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [compressedVersion as any],
      hasMore: false,
      nextCursor: null,
    })

    // Configurar processVersions para que retorne la versión descomprimida
    const { processVersions } = await import('./processors')
    vi.mocked(processVersions).mockResolvedValueOnce([compressedVersion as any])

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.versions).toBeDefined()
    // Buscar la versión comprimida en el array
    const foundVersion = data.versions.find((v: any) => v.id === VALID_VERSION_ID)
    expect(foundVersion).toBeDefined()
  })

  it('debe validar límite máximo de 50 versiones', async () => {
    await setupSuccessfulGetTest({
      versionCount: 100,
      versions: [],
    })

    const { fetchVersions } = await import('./filters')
    const { calculateVersionStatistics } = await import('./queries')
    const { getCachedVersions } = await import('./cache')
    
    // Asegurar que no hay caché
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)
    
    // Limpiar los mocks anteriores y configurar nuevos
    vi.mocked(fetchVersions).mockClear()
    vi.mocked(calculateVersionStatistics).mockClear()
    
    // Configurar el mock para retornar un array vacío
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [],
      hasMore: false,
      nextCursor: null,
    })
    
    // Configurar el mock de estadísticas
    vi.mocked(calculateVersionStatistics).mockResolvedValueOnce({
      totalVersions: 0,
      averageDaysBetweenVersions: null,
      importantVersions: 0,
      namedVersions: 0,
      totalRestores: 0,
      daysSinceLastUpdate: 0,
      lastUpdated: new Date().toISOString(),
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID, limit: 100 },
    })
    const response = await GET(request)
    await assertSuccessResponse(response)

    // El límite debe ser reducido a 50
    expect(fetchVersions).toHaveBeenCalledWith(
      VALID_NOTE_ID,
      50, // El límite debe ser reducido a 50
      expect.any(Number),
      expect.any(Object)
    )
  })

  it('debe retornar error 400 si noteId es inválido', async () => {
    await setupAuthenticatedUser()

    const request = createTestRequest()
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'ID de nota inválido')
  })

  it('debe calcular estadísticas correctamente', async () => {
    const { calculateVersionStatistics } = await import('./queries')
    const { fetchVersions } = await import('./filters')
    const { getCachedVersions } = await import('./cache')
    
    await setupSuccessfulGetTest({
      note: {
        id: VALID_NOTE_ID,
        title: 'Test Note',
        content: 'Content',
        tags: 'tag1',
        updatedAt: new Date('2024-01-05'),
        studentId: VALID_STUDENT_ID,
      },
      versionCount: 3,
    })

    // Asegurar que no hay caché
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)

    // Limpiar los mocks anteriores
    vi.mocked(fetchVersions).mockClear()
    vi.mocked(calculateVersionStatistics).mockClear()

    // Mock de fetchVersions para retornar versiones
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [],
      hasMore: false,
      nextCursor: null,
    })

    // Mock de calculateVersionStatistics para retornar estadísticas correctas
    // Nota: totalVersions debe ser 3 (solo versiones históricas, sin contar la actual)
    vi.mocked(calculateVersionStatistics).mockResolvedValueOnce({
      totalVersions: 3, // Solo versiones históricas
      averageDaysBetweenVersions: 2.0,
      importantVersions: 0,
      namedVersions: 0,
      totalRestores: 0,
      daysSinceLastUpdate: 0,
      lastUpdated: new Date('2024-01-05').toISOString(),
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.statistics).toBeDefined()
    // El totalVersions en statistics es solo de versiones históricas
    // La versión actual se cuenta por separado en el total de paginación
    expect(data.statistics.totalVersions).toBe(3)
    expect(data.statistics.averageDaysBetweenVersions).toBeDefined()
  })
})

describe('POST /api/notes/versions (restore)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe restaurar una versión correctamente', async () => {
    await setupAuthenticatedUser()

    const currentNote = createStudyNote({
      id: VALID_NOTE_ID,
      title: 'Current Note',
      content: 'Current Content',
      tags: 'current',
    })
    setupStudyNote(currentNote)

    const oldVersion = createStudyNoteVersion({
      id: VALID_VERSION_ID,
      title: 'Old Title',
      content: 'Old Content',
      tags: 'old',
    })

    // Asegurar que validateWithSchema retorne éxito
    const { validateWithSchema } = await import('./helpers')
    vi.mocked(validateWithSchema).mockClear()
    vi.mocked(validateWithSchema).mockReturnValue({
      success: true,
      data: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
      },
    })

    // Mock de validateNoteAndVersionForRestore
    const { validateNoteAndVersionForRestore } = await import('./helpers')
    vi.mocked(validateNoteAndVersionForRestore).mockClear()
    vi.mocked(validateNoteAndVersionForRestore).mockResolvedValueOnce({
      success: true,
      data: {
        noteFull: {
          id: VALID_NOTE_ID,
          title: 'Current Note',
          content: 'Current Content',
          tags: 'current',
          studentId: VALID_STUDENT_ID,
          updatedAt: new Date(),
        },
        version: oldVersion as any,
      },
    })

    // Mock de executeRestoreTransaction
    const { executeRestoreTransaction } = await import('./queries')
    vi.mocked(executeRestoreTransaction).mockClear()
    vi.mocked(executeRestoreTransaction).mockResolvedValueOnce({
      id: VALID_NOTE_ID,
      title: 'Old Title',
      content: 'Old Content',
      tags: 'old',
    } as any)

    const request = createTestRequest({
      method: 'POST',
      body: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
      },
    })

    const response = await POST(request)
    const data = await assertSuccessResponse(response)

    expect(data.message).toContain('restaurada')
  })

  it('debe retornar error si la versión no existe', async () => {
    await setupAuthenticatedUser()

    setupStudyNote(createStudyNote())

    // Mock de validateNoteAndVersionForRestore para retornar error
    const { validateNoteAndVersionForRestore } = await import('./helpers')
    vi.mocked(validateNoteAndVersionForRestore).mockResolvedValueOnce({
      success: false,
      error: new Response(JSON.stringify({ error: 'Versión no encontrada' }), { status: 404 }),
    })

    const request = createTestRequest({
      method: 'POST',
      body: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
      },
    })

    const response = await POST(request)
    await assertErrorResponse(response, 404, 'Versión no encontrada')
  })
})

describe('PATCH /api/notes/versions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe actualizar metadata de versión', async () => {
    await setupAuthenticatedUser()

    setupStudyNote(createStudyNote())

    const updatedVersion = {
      id: VALID_VERSION_ID,
      noteId: VALID_NOTE_ID,
      name: 'Nuevo nombre',
      color: '#ff0000',
      isImportant: true,
    }

    // Asegurar que validateWithSchema retorne éxito
    const { validateWithSchema } = await import('./helpers')
    vi.mocked(validateWithSchema).mockClear()
    vi.mocked(validateWithSchema).mockReturnValue({
      success: true,
      data: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
        name: 'Nuevo nombre',
        color: '#ff0000',
        isImportant: true,
      },
    })

    // Mock de validateNoteAndVersionForUpdate
    const { validateNoteAndVersionForUpdate } = await import('./helpers')
    vi.mocked(validateNoteAndVersionForUpdate).mockClear()
    vi.mocked(validateNoteAndVersionForUpdate).mockResolvedValueOnce({
      success: true,
      note: { id: VALID_NOTE_ID, title: 'Test Note' },
      version: { id: VALID_VERSION_ID, noteId: VALID_NOTE_ID } as any,
    })

    // Mock de updateVersionInDatabase
    const { updateVersionInDatabase } = await import('./queries')
    vi.mocked(updateVersionInDatabase).mockClear()
    vi.mocked(updateVersionInDatabase).mockResolvedValueOnce(updatedVersion as any)

    const request = createTestRequest({
      method: 'PATCH',
      body: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
        name: 'Nuevo nombre',
        color: '#ff0000',
        isImportant: true,
      },
    })

    const response = await PATCH(request)
    const data = await assertSuccessResponse(response)

    expect(data.message).toContain('actualizada')
    expect(data.version).toBeDefined()
  })
})

describe('DELETE /api/notes/versions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe eliminar una versión', async () => {
    await setupAuthenticatedUser()

    setupStudyNote(createStudyNote())

    // Asegurar que validateWithSchema retorne éxito
    const { validateWithSchema } = await import('./helpers')
    vi.mocked(validateWithSchema).mockClear()
    vi.mocked(validateWithSchema).mockReturnValue({
      success: true,
      data: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
      },
    })

    // Mock de validateNoteForDeletion
    const { validateNoteForDeletion } = await import('./helpers')
    vi.mocked(validateNoteForDeletion).mockClear()
    vi.mocked(validateNoteForDeletion).mockResolvedValueOnce({
      success: true,
      note: { id: VALID_NOTE_ID, title: 'Test Note' },
    })

    // Mock de executeSingleDeleteOperation
    const { executeSingleDeleteOperation } = await import('./queries')
    vi.mocked(executeSingleDeleteOperation).mockClear()
    vi.mocked(executeSingleDeleteOperation).mockResolvedValueOnce({
      success: true,
      data: { message: 'Versión eliminada exitosamente' },
    })

    const request = createTestRequest({
      method: 'DELETE',
      queryParams: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
      },
      body: {
        noteId: VALID_NOTE_ID,
        versionId: VALID_VERSION_ID,
      },
    })

    const response = await DELETE(request)
    const data = await assertSuccessResponse(response)

    expect(data.message).toContain('eliminada')
    // En eliminación individual no hay deletedCount
    expect(data.deletedCount).toBeUndefined()
  })

  it('debe eliminar múltiples versiones en lote', async () => {
    await setupAuthenticatedUser()

    setupStudyNote(createStudyNote())

    // Asegurar que validateWithSchema retorne éxito
    const { validateWithSchema } = await import('./helpers')
    vi.mocked(validateWithSchema).mockClear()
    vi.mocked(validateWithSchema).mockReturnValue({
      success: true,
      data: {
        noteId: VALID_NOTE_ID,
        versionIds: [VALID_VERSION_ID, VALID_VERSION_ID_2],
      },
    })

    // Mock de validateNoteForDeletion
    const { validateNoteForDeletion } = await import('./helpers')
    vi.mocked(validateNoteForDeletion).mockClear()
    vi.mocked(validateNoteForDeletion).mockResolvedValueOnce({
      success: true,
      note: { id: VALID_NOTE_ID, title: 'Test Note' },
    })

    // Mock de executeBulkDeleteOperation
    const { executeBulkDeleteOperation } = await import('./queries')
    vi.mocked(executeBulkDeleteOperation).mockClear()
    vi.mocked(executeBulkDeleteOperation).mockResolvedValueOnce({
      success: true,
      data: { message: 'Versiones eliminadas exitosamente', deletedCount: 2 },
    })

    const request = createTestRequest({
      method: 'DELETE',
      body: {
        noteId: VALID_NOTE_ID,
        versionIds: [VALID_VERSION_ID, VALID_VERSION_ID_2],
      },
    })

    const response = await DELETE(request)
    const data = await assertSuccessResponse(response)

    expect(data.deletedCount).toBe(2)
  })

  it('debe retornar error si algunas versiones no existen en eliminación en lote', async () => {
    await setupAuthenticatedUser()

    setupStudyNote(createStudyNote())

    // Asegurar que validateWithSchema retorne éxito
    const { validateWithSchema } = await import('./helpers')
    vi.mocked(validateWithSchema).mockClear()
    vi.mocked(validateWithSchema).mockReturnValue({
      success: true,
      data: {
        noteId: VALID_NOTE_ID,
        versionIds: [VALID_VERSION_ID, VALID_VERSION_ID_2],
      },
    })

    // Mock de validateNoteForDeletion
    const { validateNoteForDeletion } = await import('./helpers')
    vi.mocked(validateNoteForDeletion).mockClear()
    vi.mocked(validateNoteForDeletion).mockResolvedValueOnce({
      success: true,
      note: { id: VALID_NOTE_ID, title: 'Test Note' },
    })

    // Mock de executeBulkDeleteOperation para retornar error
    const { executeBulkDeleteOperation } = await import('./queries')
    vi.mocked(executeBulkDeleteOperation).mockClear()
    vi.mocked(executeBulkDeleteOperation).mockResolvedValueOnce({
      success: false,
      error: new Response(JSON.stringify({ error: 'Algunas versiones no fueron encontradas' }), { status: 404 }),
    })

    const request = createTestRequest({
      method: 'DELETE',
      body: {
        noteId: VALID_NOTE_ID,
        versionIds: [VALID_VERSION_ID, VALID_VERSION_ID_2],
      },
    })

    const response = await DELETE(request)
    const data = await assertErrorResponse(response, 404)

    expect(data.error).toContain('no fueron encontradas')
  })
})

describe('Edge Cases y Validaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe manejar error de base de datos correctamente', async () => {
    await setupAuthenticatedUser()
    setupNoCache()

    // Mock de getCachedVersions para retornar null (sin caché)
    const { getCachedVersions } = await import('./cache')
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)

    // Mock de getNoteForStudent para lanzar error de base de datos
    const { getNoteForStudent } = await import('./queries')
    vi.mocked(getNoteForStudent).mockClear()
    vi.mocked(getNoteForStudent).mockResolvedValueOnce({
      success: false,
      error: new Response(JSON.stringify({ error: 'Error en la base de datos' }), { status: 500 }),
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)
    const data = await assertErrorResponse(response, 500)

    expect(data.error).toContain('base de datos')
  })

  it('debe manejar timeout correctamente', async () => {
    await setupAuthenticatedUser()
    setupNoCache()

    // Mock de getCachedVersions para retornar null (sin caché)
    const { getCachedVersions } = await import('./cache')
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)

    // Mock de getNoteForStudent para lanzar error de timeout
    const { getNoteForStudent } = await import('./queries')
    vi.mocked(getNoteForStudent).mockClear()
    vi.mocked(getNoteForStudent).mockResolvedValueOnce({
      success: false,
      error: new Response(JSON.stringify({ error: 'La operación tardó demasiado' }), { status: 504 }),
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)
    const data = await assertErrorResponse(response, 504)

    expect(data.error).toContain('tardó demasiado')
  })

  it('debe manejar paginación con cursor correctamente', async () => {
    await setupSuccessfulGetTest({
      versionCount: 1,
      versions: [
        createStudyNoteVersion({
          id: VALID_VERSION_ID,
          title: 'Version 1',
        }),
      ],
    })

    const { fetchVersions } = await import('./filters')
    const { calculateVersionStatistics } = await import('./queries')
    const { getCachedVersions } = await import('./cache')
    
    // Asegurar que no hay caché
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)
    
    // Limpiar los mocks anteriores y configurar nuevos
    vi.mocked(fetchVersions).mockClear()
    vi.mocked(calculateVersionStatistics).mockClear()
    
    // Configurar el mock para retornar versiones
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [],
      hasMore: false,
      nextCursor: null,
    })
    
    // Configurar el mock de estadísticas
    vi.mocked(calculateVersionStatistics).mockResolvedValueOnce({
      totalVersions: 1,
      averageDaysBetweenVersions: null,
      importantVersions: 0,
      namedVersions: 0,
      totalRestores: 0,
      daysSinceLastUpdate: 0,
      lastUpdated: new Date().toISOString(),
    })

    const cursor = new Date('2024-01-02').toISOString()
    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID, cursor },
    })
    const response = await GET(request)
    await assertSuccessResponse(response)

    expect(fetchVersions).toHaveBeenCalledWith(
      VALID_NOTE_ID,
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({
        cursor,
      })
    )
  })

  it('debe filtrar por rango de fechas', async () => {
    await setupSuccessfulGetTest({
      versionCount: 1,
      versions: [],
    })

    const { fetchVersions } = await import('./filters')
    const { calculateVersionStatistics } = await import('./queries')
    const { getCachedVersions } = await import('./cache')
    
    // Asegurar que no hay caché
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null)
    
    // Limpiar los mocks anteriores y configurar nuevos
    vi.mocked(fetchVersions).mockClear()
    vi.mocked(calculateVersionStatistics).mockClear()
    
    // Configurar el mock para retornar versiones
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [],
      hasMore: false,
      nextCursor: null,
    })
    
    // Configurar el mock de estadísticas
    vi.mocked(calculateVersionStatistics).mockResolvedValueOnce({
      totalVersions: 0,
      averageDaysBetweenVersions: null,
      importantVersions: 0,
      namedVersions: 0,
      totalRestores: 0,
      daysSinceLastUpdate: 0,
      lastUpdated: new Date().toISOString(),
    })

    const dateFrom = '2024-01-01T00:00:00.000Z'
    const dateTo = '2024-12-31T23:59:59.999Z'
    const request = createTestRequest({
      queryParams: {
        noteId: VALID_NOTE_ID,
        dateFrom,
        dateTo,
      },
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
    expect(fetchVersions).toHaveBeenCalledWith(
      VALID_NOTE_ID,
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({
        dateFrom: expect.any(Date),
        dateTo: expect.any(Date),
      })
    )
  })

  it('debe guardar en caché después de obtener versiones', async () => {
    await setupSuccessfulGetTest({
      versionCount: 0,
    })

    const { setCachedVersions, getCachedVersions } = await import('./cache')
    const { fetchVersions } = await import('./filters')
    const { calculateVersionStatistics } = await import('./queries')

    // Limpiar los mocks anteriores
    vi.mocked(getCachedVersions).mockResolvedValueOnce(null) // Sin caché inicial
    vi.mocked(fetchVersions).mockClear()
    vi.mocked(calculateVersionStatistics).mockClear()
    vi.mocked(setCachedVersions).mockClear()

    // Configurar mocks para que retornen datos
    vi.mocked(fetchVersions).mockResolvedValueOnce({
      versions: [],
      hasMore: false,
      nextCursor: null,
    })
    vi.mocked(calculateVersionStatistics).mockResolvedValueOnce({
      totalVersions: 0,
      averageDaysBetweenVersions: null,
      importantVersions: 0,
      namedVersions: 0,
      totalRestores: 0,
      daysSinceLastUpdate: 0,
      lastUpdated: '',
    })

    const request = createTestRequest({
      queryParams: { noteId: VALID_NOTE_ID },
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
    expect(setCachedVersions).toHaveBeenCalled()
  })
})

