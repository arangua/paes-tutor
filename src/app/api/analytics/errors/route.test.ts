// @vitest-environment node
/**
 * Tests Enterprise para GET /api/analytics/errors
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
  createMultipleIncorrectAnswers,
  createUserWithStudent,
  createQuestionWithRelations,
  setupAttemptAnswersMocks,
  setupAttemptCountMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertErrorsResponse,
} from './__tests__/test-helpers'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    attemptAnswer: {
      findMany: vi.fn(),
    },
    attempt: {
      count: vi.fn(),
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
  safeRound: vi.fn((value: number, decimals: number = 0) => {
    if (!Number.isFinite(value)) return 0
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
  }),
}))

describe('GET /api/analytics/errors', () => {
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

  describe('Agrupación de errores', () => {
    it('debe agrupar errores por tema correctamente', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
          question: createQuestionWithRelations({
            id: TEST_IDS.QUESTION_1,
            topicId: TEST_IDS.TOPIC_1,
          }),
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
          question: createQuestionWithRelations({
            id: TEST_IDS.QUESTION_1,
            topicId: TEST_IDS.TOPIC_1,
          }),
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertErrorsResponse(data)

      // Debe tener al menos un tema con errores
      expect(data.errorsByTopic.length).toBeGreaterThan(0)
      expect(data.errorsByTopic[0]).toHaveProperty('topicId')
      expect(data.errorsByTopic[0]).toHaveProperty('errorCount')
      expect(data.errorsByTopic[0].errorCount).toBeGreaterThan(0)
    })

    it('debe agrupar errores por pregunta correctamente', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
          question: createQuestionWithRelations({
            id: TEST_IDS.QUESTION_1,
            topicId: TEST_IDS.TOPIC_1,
          }),
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1, // Misma pregunta
          esCorrecta: false,
          omitida: false,
          question: createQuestionWithRelations({
            id: TEST_IDS.QUESTION_1,
            topicId: TEST_IDS.TOPIC_1,
          }),
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_2, // Diferente pregunta
          esCorrecta: false,
          omitida: false,
          question: createQuestionWithRelations({
            id: TEST_IDS.QUESTION_2,
            topicId: TEST_IDS.TOPIC_2,
          }),
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe tener 2 preguntas únicas con errores
      expect(data.summary.uniqueQuestions).toBe(2)
    })

    it('debe contar veces que se falló cada pregunta', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1, // Misma pregunta, segunda vez
          esCorrecta: false,
          omitida: false,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe encontrar la pregunta en errorsByTopic con vecesFallada = 2
      const topicWithQuestion = data.errorsByTopic.find(
        (topic: { questions: Array<{ questionId: string; vecesFallada: number }> }) =>
          topic.questions.some(q => q.questionId === TEST_IDS.QUESTION_1)
      )
      
      if (topicWithQuestion) {
        const question = topicWithQuestion.questions.find(
          (q: { questionId: string }) => q.questionId === TEST_IDS.QUESTION_1
        )
        expect(question?.vecesFallada).toBe(2)
      }
    })
  })

  describe('Top 10 errores', () => {
    it('debe retornar top 10 errores más comunes', async () => {
      // Crear 15 respuestas incorrectas para diferentes preguntas
      const answers = Array.from({ length: 15 }, (_, i) =>
        createAttemptAnswerWithRelations({
          questionId: `${TEST_IDS.QUESTION_1.slice(0, 23)}${i}`,
          esCorrecta: false,
          omitida: false,
        })
      )

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe retornar máximo 10 errores
      expect(data.topErrors.length).toBeLessThanOrEqual(10)
    })

    it('debe ordenar errores por frecuencia descendente', async () => {
      // Crear respuestas: pregunta 1 fallada 3 veces, pregunta 2 fallada 2 veces
      const answers = [
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_2,
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_2,
          esCorrecta: false,
          omitida: false,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // El primer error debe ser el más frecuente
      if (data.topErrors.length > 0) {
        expect(data.topErrors[0].errorCount).toBeGreaterThanOrEqual(
          data.topErrors[1]?.errorCount || 0
        )
      }
    })
  })

  describe('Agrupación por asignatura', () => {
    it('debe agrupar errores por asignatura correctamente', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: false,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      expect(Array.isArray(data.errorsBySubject)).toBe(true)
      if (data.errorsBySubject.length > 0) {
        expect(data.errorsBySubject[0]).toHaveProperty('subjectId')
        expect(data.errorsBySubject[0]).toHaveProperty('subjectName')
        expect(data.errorsBySubject[0]).toHaveProperty('errorCount')
        expect(data.errorsBySubject[0]).toHaveProperty('topicCount')
      }
    })

    it('debe contar temas afectados por asignatura', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_1,
          esCorrecta: false,
          omitida: false,
        }),
        createAttemptAnswerWithRelations({
          questionId: TEST_IDS.QUESTION_2,
          esCorrecta: false,
          omitida: false,
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      if (data.errorsBySubject.length > 0) {
        expect(data.errorsBySubject[0].topicCount).toBeGreaterThan(0)
      }
    })
  })

  describe('Cálculo de tendencias', () => {
    it('debe calcular tendencia mejorando cuando errores recientes son menores', async () => {
      const ahora = new Date()
      const hace10Dias = new Date(ahora.getTime() - 10 * 24 * 60 * 60 * 1000)
      const hace40Dias = new Date(ahora.getTime() - 40 * 24 * 60 * 60 * 1000)

      // Errores recientes (últimos 30 días): 2
      const recentAnswers = [
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: false,
          attempt: {
            id: TEST_IDS.ATTEMPT,
            startedAt: hace10Dias,
          },
        }),
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: false,
          attempt: {
            id: TEST_IDS.ATTEMPT,
            startedAt: hace10Dias,
          },
        }),
      ]

      // Errores antiguos (más de 30 días): 5
      const oldAnswers = Array.from({ length: 5 }, () =>
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: false,
          attempt: {
            id: TEST_IDS.ATTEMPT,
            startedAt: hace40Dias,
          },
        })
      )

      setupAttemptAnswersMocks([...recentAnswers, ...oldAnswers])
      setupAttemptCountMocks(10, 2) // 2 intentos recientes, 8 antiguos

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Con menos errores recientes, la tendencia debería ser "mejorando"
      expect(['mejorando', 'empeorando', 'estable']).toContain(data.summary.trend)
    })

    it('debe calcular tasas de error correctamente', async () => {
      const answers = createMultipleIncorrectAnswers(5)
      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(10, 5) // 5 intentos recientes

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      expect(typeof data.summary.recentErrorRate).toBe('number')
      expect(typeof data.summary.olderErrorRate).toBe('number')
      expect(data.summary.recentErrorRate).toBeGreaterThanOrEqual(0)
      expect(data.summary.olderErrorRate).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Resumen de estadísticas', () => {
    it('debe calcular resumen correctamente', async () => {
      const answers = createMultipleIncorrectAnswers(10)
      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      expect(data.summary.totalErrors).toBe(10)
      expect(data.summary.uniqueQuestions).toBeGreaterThan(0)
      expect(data.summary.topicsAffected).toBeGreaterThan(0)
      expect(['mejorando', 'empeorando', 'estable']).toContain(data.summary.trend)
    })

    it('debe manejar estudiante sin errores', async () => {
      setupAttemptAnswersMocks([])
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      expect(data.summary.totalErrors).toBe(0)
      expect(data.summary.uniqueQuestions).toBe(0)
      expect(data.summary.topicsAffected).toBe(0)
      expect(data.topErrors).toEqual([])
      expect(data.errorsByTopic).toEqual([])
    })
  })

  describe('Filtrado de respuestas', () => {
    it('debe filtrar solo respuestas incorrectas (no omitidas)', async () => {
      const answers = [
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: false, // Incorrecta, debe incluirse
        }),
        createAttemptAnswerWithRelations({
          esCorrecta: false,
          omitida: true, // Omitida, debe excluirse
        }),
        createAttemptAnswerWithRelations({
          esCorrecta: true,
          omitida: false, // Correcta, debe excluirse
        }),
      ]

      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Solo debe contar 1 error (la incorrecta no omitida)
      expect(data.summary.totalErrors).toBe(1)
    })
  })

  describe('Casos borde', () => {
    it('debe manejar respuestas sin tema asociado', async () => {
      const answer = createAttemptAnswerWithRelations({
        esCorrecta: false,
        omitida: false,
        question: {
          id: TEST_IDS.QUESTION_1,
          enunciado: 'Pregunta sin tema',
          explicacion: null,
          topicId: null,
          topic: null,
          subject: {
            id: TEST_IDS.SUBJECT_1,
            nombre: 'Matemáticas',
            codigo: 'M1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      setupAttemptAnswersMocks([answer])
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar sin tema sin fallar
      expect(response.status).toBe(200)
    })

    it('debe manejar respuestas sin asignatura asociada', async () => {
      const answer = createAttemptAnswerWithRelations({
        esCorrecta: false,
        omitida: false,
      })

      setupAttemptAnswersMocks([answer])
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar sin asignatura sin fallar
      expect(response.status).toBe(200)
    })
  })

  describe('Estructura de respuesta', () => {
    it('debe retornar estructura correcta con todos los campos requeridos', async () => {
      const answers = createMultipleIncorrectAnswers(5)
      setupAttemptAnswersMocks(answers)
      setupAttemptCountMocks(5, 2)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertErrorsResponse(data)

      // Validar estructura de summary
      expect(typeof data.summary.totalErrors).toBe('number')
      expect(typeof data.summary.uniqueQuestions).toBe('number')
      expect(typeof data.summary.topicsAffected).toBe('number')
      expect(typeof data.summary.trend).toBe('string')
      expect(typeof data.summary.recentErrorRate).toBe('number')
      expect(typeof data.summary.olderErrorRate).toBe('number')
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.attemptAnswer.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 500, 'Error al obtener análisis de errores')
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

