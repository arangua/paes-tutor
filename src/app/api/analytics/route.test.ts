// @vitest-environment node
/**
 * Tests Enterprise para GET /api/analytics
 * 
 * Usa test helpers enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @see {@link ./__tests__/test-helpers} Para documentación de helpers disponibles
 */

// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock completo de next/server
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; href: string; pathname: string }
      headers: Headers
      constructor(url: string) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          href: url,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers()
      }
    },
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => {
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
  createAttemptWithSelect,
  createMultipleAttempts,
  createPerformanceMetricWithSelect,
  createMultipleMetrics,
  setupAttemptsMocks,
  setupPerformanceMetricsMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertAdvancedAnalyticsResponse,
} from './__tests__/test-helpers'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    attempt: {
      findMany: vi.fn(),
    },
    performanceMetric: {
      findMany: vi.fn(),
    },
  },
}))

// Mock global de get-session está en src/test/setup.ts - solo sobrescribir valores específicos con vi.mocked()
import { getCurrentStudentId } from '@/lib/get-session'

// Mock de rate-limit-middleware
vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: unknown, handler: () => Promise<Response>) => handler()),
}))

// Mock global de logger está en src/test/setup.ts

// Mock de cache
declare global {
  var __mockGetCached__: ReturnType<typeof vi.fn> | undefined
  var __mockGenerateAdvancedAnalytics__: ReturnType<typeof vi.fn> | undefined
  var __mockLogApiRequest__: ReturnType<typeof vi.fn> | undefined
}

vi.mock('@/lib/cache', async () => {
  const actual = await vi.importActual<typeof import('@/lib/cache')>('@/lib/cache')

  globalThis.__mockGetCached__ ??= vi.fn()
  return {
    ...actual,
    getCached: (...args: any[]) => globalThis.__mockGetCached__!(...args),
    cacheKeys: {
      ...actual.cacheKeys,
      studentAnalytics: (studentId: string) => `student:${studentId}:analytics`,
    },
  }
})

// Mock de constants
vi.mock('@/lib/constants', () => ({
  TIME_CONSTANTS: {
    ANALYTICS_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutos
  },
}))

// Mock de analytics
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics')

  globalThis.__mockGenerateAdvancedAnalytics__ ??= vi.fn()
  return {
    ...actual,
    generateAdvancedAnalytics: (...args: any[]) =>
      globalThis.__mockGenerateAdvancedAnalytics__!(...args),
  }
})

// Mock de api-helpers
vi.mock('@/lib/api-helpers', () => ({
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

// Mock de circuit-breaker
vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: async (fn: () => Promise<any>, _fallback?: () => Promise<any>) => {
        return await fn()
      },
    },
  },
}))

// Mock de logger
declare global {
  var __mockLogApiRequest__: ReturnType<typeof vi.fn> | undefined
}

vi.mock('@/lib/logger', async () => {
  const actual = await vi.importActual<typeof import('@/lib/logger')>('@/lib/logger')

  globalThis.__mockLogApiRequest__ ??= vi.fn()

  return {
    ...actual,
    logger: {
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    },
    logApiRequest: (...args: any[]) => globalThis.__mockLogApiRequest__!(...args),
  }
})

// Mock de validation-utils
vi.mock('@/app/api/notes/versions/validation-utils', () => ({
  safeToISODate: vi.fn((date: unknown) => {
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return '1970-01-01'
  }),
}))

// Mock de circuit-breaker
vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: vi.fn(async (fn: () => Promise<any>) => {
        return await fn()
      }),
    },
  },
}))

describe('GET /api/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks() // limpia spies creados dentro del archivo

    globalThis.__mockGetCached__?.mockReset()
    globalThis.__mockGenerateAdvancedAnalytics__?.mockReset()
    globalThis.__mockLogApiRequest__?.mockReset()
    globalThis.__mockLogApiRequest__?.mockResolvedValue(undefined)

    // defaults seguros para evitar "undefined" en tests que esperan respuesta
    globalThis.__mockGetCached__?.mockImplementation(async (key: string, fetcher: () => Promise<unknown>) => {
      return await fetcher()
    })
    globalThis.__mockGenerateAdvancedAnalytics__?.mockResolvedValue({
      ok: true,
      data: {},
    })

    vi.mocked(getCurrentStudentId).mockResolvedValue(TEST_IDS.STUDENT)
  })

  describe('Autenticación', () => {
    it('debe retornar 401 si no está autenticado', async () => {
      vi.mocked(getCurrentStudentId).mockResolvedValue(null)

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })
  })

  describe('Obtención de datos', () => {
    it('debe obtener intentos completados del estudiante', async () => {
      const attempts = createMultipleAttempts(5)
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.attempt.findMany).toHaveBeenCalledWith({
        where: {
          studentId: TEST_IDS.STUDENT,
          estado: 'completado',
        },
        take: 100,
        select: {
          id: true,
          porcentaje: true,
          createdAt: true,
          exam: {
            select: {
              titulo: true,
              subject: {
                select: {
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('debe obtener métricas de performance del estudiante', async () => {
      setupAttemptsMocks([])
      const metrics = createMultipleMetrics(3)
      setupPerformanceMetricsMocks(metrics)

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.performanceMetric.findMany).toHaveBeenCalledWith({
        where: { studentId: TEST_IDS.STUDENT },
        select: {
          topicId: true,
          porcentaje: true,
          totalPreguntas: true,
          correctas: true,
          topic: {
            select: {
              nombre: true,
              subject: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      })
    })

    it('debe limitar intentos a 100 para performance', async () => {
      const attempts = createMultipleAttempts(150) // Más de 100
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      await GET(request)

      // Verificar que se limitó a 100
      expect(prisma.attempt.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        })
      )
    })
  })

  describe('Formateo de datos', () => {
    it('debe formatear intentos correctamente', async () => {
      const attempts = [
        createAttemptWithSelect({
          id: TEST_IDS.ATTEMPT_1,
          porcentaje: 75,
          createdAt: new Date('2024-01-15'),
        }),
      ]
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      await GET(request)

      // Verificar que generateAdvancedAnalytics fue llamado con datos formateados
      expect(globalThis.__mockGenerateAdvancedAnalytics__).toHaveBeenCalled()
      const callArgs = globalThis.__mockGenerateAdvancedAnalytics__.mock.calls[0]
      expect(Array.isArray(callArgs[0])).toBe(true) // formattedAttempts
      expect(Array.isArray(callArgs[1])).toBe(true) // formattedMetrics
    })

    it('debe filtrar intentos sin exam o subject', async () => {
      const attempts = [
        createAttemptWithSelect({
          porcentaje: 75,
        }),
      ]
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      await GET(request)

      // Debe llamar a generateAdvancedAnalytics con intentos filtrados
      expect(globalThis.__mockGenerateAdvancedAnalytics__).toHaveBeenCalled()
    })

    it('debe formatear métricas correctamente', async () => {
      setupAttemptsMocks([])
      const metrics = [
        createPerformanceMetricWithSelect({
          topicId: TEST_IDS.TOPIC_1,
          porcentaje: 80,
          totalPreguntas: 20,
          correctas: 16,
        }),
      ]
      setupPerformanceMetricsMocks(metrics)

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      await GET(request)

      // Verificar que generateAdvancedAnalytics fue llamado con métricas formateadas
      expect(globalThis.__mockGenerateAdvancedAnalytics__).toHaveBeenCalled()
      const callArgs = globalThis.__mockGenerateAdvancedAnalytics__.mock.calls[0]
      const formattedMetrics = callArgs[1]
      expect(Array.isArray(formattedMetrics)).toBe(true)
      if (formattedMetrics.length > 0) {
        expect(formattedMetrics[0]).toHaveProperty('topicId')
        expect(formattedMetrics[0]).toHaveProperty('porcentaje')
        expect(formattedMetrics[0]).toHaveProperty('totalPreguntas')
        expect(formattedMetrics[0]).toHaveProperty('correctas')
      }
    })

    it('debe filtrar métricas sin topic o subject', async () => {
      setupAttemptsMocks([])
      const metrics = [
        createPerformanceMetricWithSelect({
          porcentaje: 80,
        }),
      ]
      setupPerformanceMetricsMocks(metrics)

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      await GET(request)

      // Debe llamar a generateAdvancedAnalytics con métricas filtradas
      expect(globalThis.__mockGenerateAdvancedAnalytics__).toHaveBeenCalled()
    })
  })

  describe('Caché', () => {
    it('debe usar caché para analytics', async () => {
      const cachedAnalytics = {
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      }

      // Simular que el caché tiene un valor
      globalThis.__mockGetCached__.mockResolvedValue(cachedAnalytics)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe retornar el valor del caché sin llamar a la base de datos
      expect(prisma.attempt.findMany).not.toHaveBeenCalled()
      expect(data).toEqual(cachedAnalytics)
    })

    it('debe ejecutar fetcher si no hay caché', async () => {
      setupAttemptsMocks([])
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      // Mock getCached para que ejecute el fetcher
      globalThis.__mockGetCached__.mockImplementation(async (key: string, fetcher: () => Promise<unknown>) => {
        return await fetcher()
      })

      const request = createTestRequest()
      await GET(request)

      // Debe llamar a la base de datos
      expect(prisma.attempt.findMany).toHaveBeenCalled()
      expect(prisma.performanceMetric.findMany).toHaveBeenCalled()
    })
  })

  describe('Generación de análisis avanzado', () => {
    it('debe llamar a generateAdvancedAnalytics con datos formateados', async () => {
      const attempts = createMultipleAttempts(5)
      const metrics = createMultipleMetrics(3)

      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks(metrics)

      const mockAnalytics = {
        trends: [
          { date: '2024-01-15', percentage: 75, examTitle: 'Test', subjectName: 'Matemáticas' },
        ],
        strengths: [
          { topic: 'Álgebra', subject: 'Matemáticas', percentage: 90, totalQuestions: 20, category: 'strength' },
        ],
        weaknesses: [
          { topic: 'Geometría', subject: 'Matemáticas', percentage: 40, totalQuestions: 15, category: 'weakness' },
        ],
        paesPrediction: {
          estimatedScore: 650,
          confidence: 'medium',
          estimatedRange: { min: 600, max: 700 },
        },
        comparison: {
          studentAverage: 70,
          overallAverage: 60,
          percentile: 75,
          comparison: 'above',
        },
        subjectBreakdown: [
          { subject: 'Matemáticas', average: 75, trend: 'improving', attempts: 10 },
        ],
      }

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue(mockAnalytics)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertAdvancedAnalyticsResponse(data)

      // Verificar que se llamó con los datos correctos
      expect(globalThis.__mockGenerateAdvancedAnalytics__).toHaveBeenCalled()
      expect(data).toEqual(mockAnalytics)
    })
  })

  describe('Casos borde', () => {
    it('debe manejar estudiante sin intentos', async () => {
      setupAttemptsMocks([])
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertAdvancedAnalyticsResponse(data)

      // Debe retornar estructura válida aunque no haya datos
      expect(data.trends).toEqual([])
      expect(data.strengths).toEqual([])
      expect(data.weaknesses).toEqual([])
    })

    it('debe manejar estudiante sin métricas', async () => {
      const attempts = createMultipleAttempts(5)
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it('debe manejar intentos con porcentaje inválido', async () => {
      const attempts = [
        createAttemptWithSelect({
          porcentaje: NaN,
        }),
        createAttemptWithSelect({
          porcentaje: Infinity,
        }),
        createAttemptWithSelect({
          porcentaje: -10, // Fuera de rango
        }),
        createAttemptWithSelect({
          porcentaje: 150, // Fuera de rango
        }),
      ]
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar valores inválidos sin fallar
      expect(response.status).toBe(200)
    })

    it('debe manejar fechas inválidas en intentos', async () => {
      const attempts = [
        createAttemptWithSelect({
          porcentaje: 75,
          createdAt: new Date('invalid'),
        }),
      ]
      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar fechas inválidas sin fallar
      expect(response.status).toBe(200)
    })
  })

  describe('Estructura de respuesta', () => {
    it('debe retornar estructura correcta con todos los campos requeridos', async () => {
      const attempts = createMultipleAttempts(5)
      const metrics = createMultipleMetrics(3)

      setupAttemptsMocks(attempts)
      setupPerformanceMetricsMocks(metrics)

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertAdvancedAnalyticsResponse(data)

      // Validar tipos
      expect(Array.isArray(data.trends)).toBe(true)
      expect(Array.isArray(data.strengths)).toBe(true)
      expect(Array.isArray(data.weaknesses)).toBe(true)
      expect(Array.isArray(data.subjectBreakdown)).toBe(true)
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.attempt.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    it('debe manejar errores inesperados correctamente', async () => {
      vi.mocked(getCurrentStudentId).mockRejectedValue(
        new Error('Unexpected error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })

  describe('Logging', () => {
    it('debe registrar la petición API', async () => {
      setupAttemptsMocks([])
      setupPerformanceMetricsMocks([])

      globalThis.__mockGenerateAdvancedAnalytics__.mockReturnValue({
        trends: [],
        strengths: [],
        weaknesses: [],
        paesPrediction: null,
        comparison: null,
        subjectBreakdown: [],
      })

      const request = createTestRequest()
      await GET(request)

      // Asegurar que se drenó la cola de promises/microtasks
      await Promise.resolve()

      expect(globalThis.__mockLogApiRequest__).toHaveBeenCalledWith('GET', '/api/analytics')
    })
  })
})

