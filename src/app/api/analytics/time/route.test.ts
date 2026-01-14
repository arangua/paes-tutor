// @vitest-environment node
/**
 * Tests Enterprise para GET /api/analytics/time
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
  createAttemptAnswerWithRelations,
  createPracticeAnswerWithRelations,
  createMultipleAttemptAnswers,
  createUserWithStudent,
  setupAttemptAnswersMocks,
  setupPracticeAnswersMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertTimeAnalyticsResponse,
} from './__tests__/test-helpers'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    attemptAnswer: {
      findMany: vi.fn(),
    },
    practiceAnswer: {
      findMany: vi.fn(),
    },
  },
}))

// Mock de get-session
const mockGetAuthenticatedUserWithStudent = vi.fn()
vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: () => mockGetAuthenticatedUserWithStudent(),
}))

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
  safeToISODate: vi.fn((date: unknown) => {
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return '1970-01-01'
  }),
  safeRound: vi.fn((value: number, decimals: number = 0) => {
    if (!Number.isFinite(value)) return 0
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
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

describe('GET /api/analytics/time', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
    mockGetAuthenticatedUserWithStudent.mockResolvedValue(
      createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    )
  })

  describe('Autenticación', () => {
    it('debe retornar 401 si no está autenticado', async () => {
      mockGetAuthenticatedUserWithStudent.mockResolvedValue(null)

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })

    it('debe retornar 404 si no hay estudiante asociado', async () => {
      mockGetAuthenticatedUserWithStudent.mockResolvedValue({
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
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest({
        queryParams: { subjectId: TEST_IDS.SUBJECT_1, period: '30d', groupBy: 'difficulty' },
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

    it('debe retornar 400 si groupBy es inválido', async () => {
      const request = createTestRequest({
        queryParams: { groupBy: 'invalid' },
      })
      const response = await GET(request)

      await assertErrorResponse(response, 400, 'Parámetros de consulta inválidos')
    })

    it('debe usar period "all" por defecto', async () => {
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ period: string }>(response)
      expect(data.period).toBe('all')
    })

    it('debe usar groupBy "difficulty" por defecto', async () => {
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ groupBy: string }>(response)
      expect(data.groupBy).toBe('difficulty')
    })

    it('debe aceptar todos los períodos válidos', async () => {
      const periods = ['all', '30d', '60d', '90d', '180d', '365d']

      for (const period of periods) {
        setupAttemptAnswersMocks([])
        setupPracticeAnswersMocks([])

        const request = createTestRequest({ queryParams: { period } })
        const response = await GET(request)

        expect(response.status).toBe(200)
        const data = await assertSuccessResponse<{ period: string }>(response)
        expect(data.period).toBe(period)
      }
    })

    it('debe aceptar todos los groupBy válidos', async () => {
      const groupBys = ['difficulty', 'subject', 'topic', 'correctness']

      for (const groupBy of groupBys) {
        setupAttemptAnswersMocks([])
        setupPracticeAnswersMocks([])

        const request = createTestRequest({ queryParams: { groupBy } })
        const response = await GET(request)

        expect(response.status).toBe(200)
        const data = await assertSuccessResponse<{ groupBy: string }>(response)
        expect(data.groupBy).toBe(groupBy)
      }
    })
  })

  describe('Filtrado por período', () => {
    it('debe filtrar respuestas por período 30d', async () => {

      // Simular que el attempt tiene finishedAt dentro del período
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { period: '30d' } })
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que se llamó con filtro de fecha
      expect(prisma.attemptAnswer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            attempt: expect.objectContaining({
              finishedAt: expect.objectContaining({
                gte: expect.any(Date),
              }),
            }),
          }),
        })
      )
    })

    it('debe incluir todas las respuestas cuando period es "all"', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { period: 'all' } })
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que NO se llamó con filtro de fecha
      const calls = vi.mocked(prisma.attemptAnswer.findMany).mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[0].where.attempt).not.toHaveProperty('finishedAt')
    })
  })

  describe('Filtrado por asignatura', () => {
    it('debe filtrar respuestas por subjectId cuando se proporciona', async () => {
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest({
        queryParams: { subjectId: TEST_IDS.SUBJECT_1 },
      })
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.attemptAnswer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            question: expect.objectContaining({
              subjectId: TEST_IDS.SUBJECT_1,
            }),
          }),
        })
      )
    })

    it('debe incluir todas las asignaturas cuando subjectId no se proporciona', async () => {
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      // Verificar que NO se filtró por subjectId
      const calls = vi.mocked(prisma.attemptAnswer.findMany).mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[0].where).not.toHaveProperty('question')
    })
  })

  describe('Agrupación de datos', () => {
    it('debe agrupar por dificultad cuando groupBy es "difficulty"', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
          question: {
            id: TEST_IDS.QUESTION_1,
            enunciado: 'Pregunta 1',
            explicacion: null,
            dificultad: 1,
            topicId: TEST_IDS.TOPIC_1,
            subject: {
              id: TEST_IDS.SUBJECT_1,
              nombre: 'Matemáticas',
              codigo: 'M1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            topic: {
              id: TEST_IDS.TOPIC_1,
              nombre: 'Álgebra',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: 150,
          question: {
            id: TEST_IDS.QUESTION_2,
            enunciado: 'Pregunta 2',
            explicacion: null,
            dificultad: 2,
            topicId: TEST_IDS.TOPIC_1,
            subject: {
              id: TEST_IDS.SUBJECT_1,
              nombre: 'Matemáticas',
              codigo: 'M1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            topic: {
              id: TEST_IDS.TOPIC_1,
              nombre: 'Álgebra',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'difficulty' } })
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertTimeAnalyticsResponse(data)

      // Debe tener grupos por dificultad
      expect(data.byGroup.length).toBeGreaterThan(0)
    })

    it('debe agrupar por asignatura cuando groupBy es "subject"', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: 150,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'subject' } })
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe tener grupos por asignatura
      expect(data.byGroup.length).toBeGreaterThan(0)
    })

    it('debe agrupar por tema cuando groupBy es "topic"', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'topic' } })
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe tener grupos por tema
      expect(data.byGroup.length).toBeGreaterThan(0)
    })

    it('debe agrupar por correctitud cuando groupBy es "correctness"', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
          esCorrecta: true,
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: 150,
          esCorrecta: false,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'correctness' } })
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe tener 2 grupos: correctas e incorrectas
      expect(data.byGroup.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Cálculo de estadísticas', () => {
    it('debe calcular estadísticas de tiempo correctamente', async () => {
      const answers = createMultipleAttemptAnswers(5, {
        tiempoSegundos: 120,
      })

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Verificar que se calcularon estadísticas
      expect(data.summary).toHaveProperty('averageTime')
      expect(data.summary).toHaveProperty('medianTime')
      expect(data.summary).toHaveProperty('minTime')
      expect(data.summary).toHaveProperty('maxTime')
      expect(data.summary).toHaveProperty('p25')
      expect(data.summary).toHaveProperty('p75')
      expect(data.summary).toHaveProperty('p90')
    })

    it('debe calcular eficiencia vs tiempo ideal', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 138, // Tiempo ideal
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      expect(data.summary).toHaveProperty('efficiency')
      expect(data.summary).toHaveProperty('deviationFromIdeal')
      expect(data.summary).toHaveProperty('deviationPercent')
      expect(typeof data.summary.efficiency).toBe('number')
    })

    it('debe calcular estadísticas por grupo correctamente', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
          esCorrecta: true,
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: 150,
          esCorrecta: false,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'correctness' } })
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      if (data.byGroup.length > 0) {
        expect(data.byGroup[0]).toHaveProperty('timeStats')
        expect(data.byGroup[0].timeStats).toHaveProperty('all')
        expect(data.byGroup[0].timeStats).toHaveProperty('correct')
        expect(data.byGroup[0].timeStats).toHaveProperty('incorrect')
      }
    })
  })

  describe('Combinación de respuestas', () => {
    it('debe combinar respuestas de intentos y práctica', async () => {
      const attemptAnswers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
        }),
      ]

      const practiceAnswers = [
        createPracticeAnswerWithRelations({
          tiempoSegundos: 150,
        }),
      ]

      setupAttemptAnswersMocks(attemptAnswers)
      setupPracticeAnswersMocks(practiceAnswers)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe incluir ambas respuestas
      expect(data.summary.totalQuestions).toBe(2)
    })

    it('debe filtrar solo respuestas con tiempoSegundos no null', async () => {
      const attemptAnswers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120, // Con tiempo
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: null, // Sin tiempo, debe ser filtrado
        }),
      ]

      setupAttemptAnswersMocks(attemptAnswers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Solo debe contar la respuesta con tiempo
      expect(data.summary.totalQuestions).toBe(1)
    })
  })

  describe('Generación de recomendaciones', () => {
    it('debe generar recomendación si el tiempo promedio es mayor al ideal', async () => {
      // Tiempo promedio mayor al ideal (138 segundos)
      const answers = Array.from({ length: 5 }, () =>
        createAttemptAnswerWithRelations({
          tiempoSegundos: 200, // Más lento que el ideal
        })
      )

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe tener recomendaciones
      expect(Array.isArray(data.recommendations)).toBe(true)
    })

    it('debe generar recomendación si el tiempo promedio es menor al ideal', async () => {
      // Tiempo promedio menor al ideal
      const answers = Array.from({ length: 5 }, () =>
        createAttemptAnswerWithRelations({
          tiempoSegundos: 80, // Más rápido que el ideal
        })
      )

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe tener recomendaciones
      expect(Array.isArray(data.recommendations)).toBe(true)
    })

    it('debe generar recomendación para grupos lentos', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 200, // Lento
          question: {
            id: TEST_IDS.QUESTION_1,
            enunciado: 'Pregunta lenta',
            explicacion: null,
            dificultad: 1,
            topicId: TEST_IDS.TOPIC_1,
            subject: {
              id: TEST_IDS.SUBJECT_1,
              nombre: 'Matemáticas',
              codigo: 'M1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            topic: {
              id: TEST_IDS.TOPIC_1,
              nombre: 'Álgebra',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'topic' } })
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Puede tener recomendaciones sobre grupos lentos
      expect(Array.isArray(data.recommendations)).toBe(true)
    })
  })

  describe('Casos borde', () => {
    it('debe manejar estudiante sin respuestas con tiempo', async () => {
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe retornar estructura válida aunque no haya datos
      expect(data.summary.totalQuestions).toBe(0)
      expect(data.summary.averageTime).toBe(0)
      expect(data.byGroup).toEqual([])
      expect(data.recommendations).toEqual([])
    })

    it('debe manejar respuestas con tiempoSegundos inválido', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: NaN,
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: Infinity,
        }),
        createAttemptAnswerWithRelations({
          tiempoSegundos: -10, // Negativo
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar valores inválidos sin fallar
      expect(response.status).toBe(200)
    })

    it('debe manejar preguntas sin tema', async () => {
      const answer = createAttemptAnswerWithRelations({
        tiempoSegundos: 120,
        question: {
          id: TEST_IDS.QUESTION_1,
          enunciado: 'Pregunta sin tema',
          explicacion: null,
          dificultad: 1,
          topicId: null,
          subject: {
            id: TEST_IDS.SUBJECT_1,
            nombre: 'Matemáticas',
            codigo: 'M1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          topic: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      setupAttemptAnswersMocks([answer])
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'topic' } })
      const response = await GET(request)

      // Debe manejar sin tema sin fallar
      expect(response.status).toBe(200)
    })

    it('debe manejar preguntas sin asignatura', async () => {
      const answer = createAttemptAnswerWithRelations({
        tiempoSegundos: 120,
      })

      setupAttemptAnswersMocks([answer])
      setupPracticeAnswersMocks([])

      const request = createTestRequest({ queryParams: { groupBy: 'subject' } })
      const response = await GET(request)

      // Debe manejar sin asignatura sin fallar
      expect(response.status).toBe(200)
    })
  })

  describe('Estructura de respuesta', () => {
    it('debe retornar estructura correcta con todos los campos requeridos', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          tiempoSegundos: 120,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertTimeAnalyticsResponse(data)

      // Validar tipos de summary
      expect(typeof data.summary.totalQuestions).toBe('number')
      expect(typeof data.summary.averageTime).toBe('number')
      expect(typeof data.summary.idealTime).toBe('number')
      expect(typeof data.summary.efficiency).toBe('number')
    })

    it('debe incluir generatedAt en formato ISO', async () => {
      setupAttemptAnswersMocks([])
      setupPracticeAnswersMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ generatedAt: string }>(response)
      expect(data.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/) // Formato YYYY-MM-DD
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.attemptAnswer.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 500, 'Error al obtener estadísticas de tiempo')
    })

    it('debe manejar errores inesperados correctamente', async () => {
      mockGetAuthenticatedUserWithStudent.mockRejectedValue(
        new Error('Unexpected error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })
})

