// @vitest-environment node
/**
 * Tests Enterprise para GET /api/analytics/comparison
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

import { describe, it, expect, beforeEach, vi as vitest } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createPerformanceMetric,
  createMetricsForMultipleStudents,
  createUserWithStudent,
  setupPerformanceMetricsMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertComparisonResponse,
  assertResponseHasFields,
} from './__tests__/test-helpers'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    performanceMetric: {
      findMany: vi.fn(),
    },
  },
}))

// Mock de get-session
declare global {
  var __mockGetAuthenticatedUserWithStudent__: ReturnType<typeof vi.fn> | undefined
}

vi.mock('@/lib/get-session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/get-session')>('@/lib/get-session')
  
  globalThis.__mockGetAuthenticatedUserWithStudent__ ??= vi.fn()
  
  return {
    ...actual,
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getCurrentStudentId: vi.fn(),
    getAuthenticatedUserWithStudent: () => globalThis.__mockGetAuthenticatedUserWithStudent__?.(),
  }
})

// Mock de rate-limit-middleware
vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: unknown, handler: () => Promise<Response>) => handler()),
}))

// Mock de logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock de validation-utils
vi.mock('@/app/api/notes/versions/validation-utils', () => ({
  safeRound: vi.fn((value: number, decimals: number = 0) => {
    if (!Number.isFinite(value)) return 0
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
  }),
  safeToISODate: vi.fn((date: unknown) => {
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return '1970-01-01'
  }),
  safeDivide: vi.fn((dividend: number, divisor: number, fallback: number) => {
    if (divisor === 0 || !Number.isFinite(dividend) || !Number.isFinite(divisor)) {
      return fallback
    }
    const result = dividend / divisor
    return Number.isFinite(result) ? result : fallback
  }),
  ensureFiniteNumber: vi.fn((value: unknown, fallback: number) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    return fallback
  }),
}))

describe('GET /api/analytics/comparison', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
    globalThis.__mockGetAuthenticatedUserWithStudent__?.mockResolvedValue(
      createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    )
  })

  describe('Autenticación', () => {
    it('debe retornar 401 si no está autenticado', async () => {
      globalThis.__mockGetAuthenticatedUserWithStudent__?.mockResolvedValue(null)

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })

    it('debe retornar 404 si no hay estudiante asociado', async () => {
      globalThis.__mockGetAuthenticatedUserWithStudent__?.mockResolvedValue({
        ...createUserWithStudent(),
        student: null,
      })

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 404, 'Estudiante no encontrado')
    })
  })

  describe('Validación de query parameters', () => {
    it('debe aceptar query params válidos', async () => {
      setupPerformanceMetricsMocks([])

      const request = createTestRequest({
        queryParams: { subjectId: TEST_IDS.SUBJECT_1, period: '30d' },
      })
      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it('debe retornar 400 si period es inválido', async () => {
      const request = createTestRequest({
        queryParams: { period: 'invalid' },
      })
      const response = await GET(request)

      await assertErrorResponse(response, 400, 'Parámetros de consulta inválidos')
    })

    it('debe usar period "all" por defecto', async () => {
      setupPerformanceMetricsMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ period: string }>(response)
      expect(data.period).toBe('all')
    })

    it('debe aceptar todos los períodos válidos', async () => {
      const periods = ['all', '30d', '60d', '90d', '180d', '365d']

      for (const period of periods) {
        setupPerformanceMetricsMocks([])

        const request = createTestRequest({ queryParams: { period } })
        const response = await GET(request)

        expect(response.status).toBe(200)
        const data = await assertSuccessResponse<{ period: string }>(response)
        expect(data.period).toBe(period)
      }
    })
  })

  describe('Filtrado por período', () => {
    it('debe filtrar métricas por período 30d', async () => {
      const ahora = new Date()
      const hace25Dias = new Date(ahora.getTime() - 25 * 24 * 60 * 60 * 1000)
      const hace35Dias = new Date(ahora.getTime() - 35 * 24 * 60 * 60 * 1000)

      const metrics = [
        createPerformanceMetric({ updatedAt: hace25Dias }), // Dentro del período
        createPerformanceMetric({ updatedAt: hace35Dias }), // Fuera del período
      ]

      setupPerformanceMetricsMocks(metrics)

      const request = createTestRequest({ queryParams: { period: '30d' } })
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que se llamó con filtro de fecha
      expect(prisma.performanceMetric.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            updatedAt: expect.objectContaining({
              gte: expect.any(Date),
            }),
          }),
        })
      )
    })

    it('debe incluir todas las métricas cuando period es "all"', async () => {
      const ahora = new Date()
      const hace100Dias = new Date(ahora.getTime() - 100 * 24 * 60 * 60 * 1000)

      const metrics = [
        createPerformanceMetric({ updatedAt: ahora }),
        createPerformanceMetric({ updatedAt: hace100Dias }),
      ]

      setupPerformanceMetricsMocks(metrics)

      const request = createTestRequest({ queryParams: { period: 'all' } })
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que NO se llamó con filtro de fecha
      expect(prisma.performanceMetric.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({
          where: expect.objectContaining({
            updatedAt: expect.anything(),
          }),
        })
      )
    })
  })

  describe('Filtrado por asignatura', () => {
    it('debe filtrar métricas por subjectId cuando se proporciona', async () => {
      setupPerformanceMetricsMocks([])

      const request = createTestRequest({
        queryParams: { subjectId: TEST_IDS.SUBJECT_1 },
      })
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.performanceMetric.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            topic: expect.objectContaining({
              subjectId: TEST_IDS.SUBJECT_1,
            }),
          }),
        })
      )
    })

    it('debe incluir todas las asignaturas cuando subjectId no se proporciona', async () => {
      setupPerformanceMetricsMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que NO se filtró por subjectId
      const calls = vi.mocked(prisma.performanceMetric.findMany).mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[0].where).not.toHaveProperty('topic')
    })
  })

  describe('Cálculo de comparación', () => {
    it('debe calcular comparación correctamente con métricas del estudiante', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 20,
          correctas: 15, // 75%
        }),
      ]

      const allMetrics = [
        ...studentMetrics,
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_2,
          totalPreguntas: 20,
          correctas: 10, // 50%
        }),
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_3,
          totalPreguntas: 20,
          correctas: 18, // 90%
        }),
      ]

      // Primera llamada: métricas del estudiante
      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        // Segunda llamada: todas las métricas
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertComparisonResponse(data)

      // Verificar que se calculó el porcentaje del estudiante
      expect(data.overall).toHaveProperty('percentage')
      expect(data.overall).toHaveProperty('percentile')
      expect(data.overall).toHaveProperty('position')
    })

    it('debe agrupar métricas por asignatura', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          topicId: TEST_IDS.TOPIC_1,
          totalPreguntas: 20,
          correctas: 15,
        }),
      ]

      const allMetrics = [
        ...studentMetrics,
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_2,
          topicId: TEST_IDS.TOPIC_1,
          totalPreguntas: 20,
          correctas: 10,
        }),
      ]

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ bySubject: unknown[] }>(response)
      expect(Array.isArray(data.bySubject)).toBe(true)
    })

    it('debe calcular estadísticas descriptivas correctamente', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 20,
          correctas: 15,
        }),
      ]

      const allMetrics = createMetricsForMultipleStudents(
        [TEST_IDS.STUDENT, TEST_IDS.STUDENT_2, TEST_IDS.STUDENT_3],
        2
      )

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{
        overall: { statistics: unknown }
        bySubject: Array<{ statistics: unknown }>
      }>(response)

      // Verificar que se calcularon estadísticas
      expect(data.overall.statistics).toBeDefined()
      assertResponseHasFields(data.overall.statistics, [
        'min',
        'max',
        'mean',
        'median',
        'p25',
        'p75',
        'p90',
        'p95',
      ])

      if (data.bySubject.length > 0) {
        expect(data.bySubject[0]).toHaveProperty('statistics')
      }
    })
  })

  describe('Casos borde', () => {
    it('debe manejar estudiante sin métricas', async () => {
      setupPerformanceMetricsMocks([])
      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce([]) // Métricas del estudiante
        .mockResolvedValueOnce([]) // Todas las métricas

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertComparisonResponse(data)

      // Debe retornar estructura válida aunque no haya datos
      expect(data.overall.percentage).toBe(0)
      expect(data.bySubject).toEqual([])
    })

    it('debe manejar métricas con totalPreguntas = 0', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 0,
          correctas: 0,
        }),
      ]

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce([])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it('debe filtrar métricas con menos de 10 preguntas en comparación general', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 20,
          correctas: 15,
        }),
      ]

      const allMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_2,
          totalPreguntas: 5, // Menos de 10, debe ser filtrado
          correctas: 3,
        }),
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_3,
          totalPreguntas: 15, // >= 10, debe incluirse
          correctas: 12,
        }),
      ]

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que se filtró por totalPreguntas >= 10
      const calls = vi.mocked(prisma.performanceMetric.findMany).mock.calls
      const allMetricsCall = calls[calls.length - 1]
      expect(allMetricsCall[0].where).toHaveProperty('totalPreguntas')
      expect(allMetricsCall[0].where.totalPreguntas).toEqual({ gte: 10 })
    })

    it('debe manejar métricas con valores NaN o Infinity', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 20,
          correctas: 15,
        }),
      ]

      const allMetrics = [
        ...studentMetrics,
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_2,
          totalPreguntas: 20,
          correctas: 10,
        }),
      ]

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar valores inválidos sin fallar
      expect(response.status).toBe(200)
    })
  })

  describe('Estructura de respuesta', () => {
    it('debe retornar estructura correcta con todos los campos requeridos', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 20,
          correctas: 15,
        }),
      ]

      const allMetrics = [
        ...studentMetrics,
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_2,
          totalPreguntas: 20,
          correctas: 10,
        }),
      ]

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertComparisonResponse(data)

      // Validar estructura de overall
      const overall = data.overall as {
        percentage: number
        percentile: number
        position: number
        totalStudents: number
        statistics: unknown
      }
      expect(typeof overall.percentage).toBe('number')
      expect(typeof overall.percentile).toBe('number')
      expect(typeof overall.position).toBe('number')
      expect(typeof overall.totalStudents).toBe('number')

      // Validar estructura de bySubject
      if (data.bySubject.length > 0) {
        const subject = data.bySubject[0] as {
          subjectId: string
          subjectName: string
          subjectCode: string
          studentPercentage: number
          studentTotalQuestions: number
          studentCorrectAnswers: number
          percentile: number
          position: number
          totalStudents: number
          statistics: unknown
        }
        expect(typeof subject.subjectId).toBe('string')
        expect(typeof subject.subjectName).toBe('string')
        expect(typeof subject.subjectCode).toBe('string')
        expect(typeof subject.studentPercentage).toBe('number')
        expect(typeof subject.percentile).toBe('number')
        expect(typeof subject.position).toBe('number')
      }
    })

    it('debe incluir generatedAt en formato ISO', async () => {
      setupPerformanceMetricsMocks([])
      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ generatedAt: string }>(response)
      expect(data.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/) // Formato YYYY-MM-DD
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.performanceMetric.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 500, 'Error al obtener comparación anónima')
    })

    it('debe manejar errores inesperados correctamente', async () => {
      globalThis.__mockGetAuthenticatedUserWithStudent__?.mockRejectedValue(
        new Error('Unexpected error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })

  describe('Tests de regresión - Funciones helper internas', () => {
    it('debe calcular percentil correctamente para valores extremos', async () => {
      const studentMetrics = [
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT,
          totalPreguntas: 20,
          correctas: 20, // 100%
        }),
      ]

      const allMetrics = [
        ...studentMetrics,
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_2,
          totalPreguntas: 20,
          correctas: 0, // 0%
        }),
        createPerformanceMetric({
          studentId: TEST_IDS.STUDENT_3,
          totalPreguntas: 20,
          correctas: 10, // 50%
        }),
      ]

      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce(studentMetrics as any)
        .mockResolvedValueOnce(allMetrics as any)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ overall: { percentile: number } }>(response)
      // El percentil debe estar entre 0 y 100
      expect(data.overall.percentile).toBeGreaterThanOrEqual(0)
      expect(data.overall.percentile).toBeLessThanOrEqual(100)
    })

    it('debe calcular estadísticas correctamente con array vacío', async () => {
      setupPerformanceMetricsMocks([])
      vi.mocked(prisma.performanceMetric.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{
        overall: { statistics: { min: number; max: number; mean: number } }
      }>(response)

      // Con array vacío, todas las estadísticas deben ser 0
      expect(data.overall.statistics.min).toBe(0)
      expect(data.overall.statistics.max).toBe(0)
      expect(data.overall.statistics.mean).toBe(0)
    })
  })
})

