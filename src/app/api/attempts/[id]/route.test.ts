// @vitest-environment node
/**
 * Tests Enterprise para API de Attempts/[id]
 * 
 * Este módulo contiene tests unitarios y de robustez para la API de attempts/[id],
 * siguiendo estándares enterprise para garantizar máxima calidad y cobertura.
 * 
 * @module route.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, PUT } from './route'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { invalidateCachePattern } from '@/lib/cache'
import {
  TEST_IDS,
  createAttemptWithRelations,
  createExamWithRelations,
  createAttemptAnswer,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupAttemptMock,
  setupAttemptUpdateMock,
  setupAttemptWithAnswersMock,
  setupDeleteAnswersMock,
  setupCreateAnswersMock,
  setupCacheInvalidationMock,
  setupValidateBodySuccess,
  setupValidateBodyError,
  setupCircuitBreakerSuccess,
  setupCircuitBreakerFallback,
  setupCircuitBreakerError,
  createTestRequestWithBody,
  assertAttemptResponse,
  assertAttemptErrorResponse,
  assertSuccessResponse,
} from './__tests__/test-helpers'

// ============================================
// MOCKS
// ============================================

vi.mock('@/lib/prisma', () => ({
  prisma: {
    attempt: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    attemptAnswer: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/api-helpers', () => ({
  validateBody: vi.fn(),
  handleApiError: vi.fn((error: Error, message: string) => {
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

vi.mock('@/lib/cache', () => ({
  invalidateCachePattern: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Importar logger después del mock para poder usarlo en los tests
import { logger } from '@/lib/logger'

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<NextResponse>) => {
    return handler()
  }),
}))

vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: vi.fn(async (operation: () => Promise<any>, fallback?: () => Promise<any>) => {
        try {
          return await operation()
        } catch (error) {
          if (fallback) {
            return await fallback()
          }
          throw error
        }
      }),
    },
  },
}))

// ============================================
// TESTS GET /api/attempts/[id]
// ============================================

describe('GET /api/attempts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupCircuitBreakerSuccess()
    // Asegurar que getCurrentStudentId esté mockeado por defecto
    vi.mocked(getCurrentStudentId).mockResolvedValue(TEST_IDS.STUDENT)
  })

  it('debe retornar 400 si el ID no tiene formato CUID válido', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: 'invalid-id' })
    const request = new NextRequest('http://localhost/api/attempts/invalid-id')

    const response = await GET(request, { params })

    await assertAttemptErrorResponse(response, 400, 'ID de intento inválido')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })

    await assertAttemptErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si el intento no existe', async () => {
    setupAuthenticatedSession()
    setupAttemptMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })

    await assertAttemptErrorResponse(response, 404, 'Intento no encontrado')
  })

  it('debe retornar 403 si el intento no pertenece al estudiante', async () => {
    setupAuthenticatedSession(TEST_IDS.STUDENT)
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      studentId: TEST_IDS.STUDENT_2, // Diferente estudiante
    })
    setupAttemptMock(attempt)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })

    await assertAttemptErrorResponse(response, 403, 'No autorizado')
  })

  it('debe retornar el intento completo con todas sus relaciones', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
      answers: [
        {
          questionId: TEST_IDS.QUESTION,
          optionSelectedId: TEST_IDS.OPTION,
          esCorrecta: true,
          omitida: false,
        },
      ],
    })
    setupAttemptMock(attempt)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })
    const data = await assertAttemptResponse(response)

    expect(data.id).toBe(TEST_IDS.ATTEMPT)
    expect(data.estado).toBe('completado')
    expect(data.exam).toBeDefined()
    expect(data.exam.subject).toBeDefined()
    expect(data.exam.questions).toBeDefined()
    expect(Array.isArray(data.exam.questions)).toBe(true)
    expect(data.answers).toBeDefined()
    expect(Array.isArray(data.answers)).toBe(true)
  })

  it('debe ordenar las preguntas del examen por orden ascendente', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      questions: [
        { questionId: TEST_IDS.QUESTION, orden: 2 },
        { questionId: TEST_IDS.QUESTION_2, orden: 1 },
      ],
    })
    // Ordenar las preguntas como lo haría Prisma
    const sortedQuestions = [...exam.questions].sort((a, b) => a.orden - b.orden)
    const attempt = createAttemptWithRelations({
      exam: {
        questions: sortedQuestions,
      },
    })
    setupAttemptMock(attempt)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })
    const data = await assertAttemptResponse(response)

    expect(data.exam.questions[0].orden).toBe(1)
    expect(data.exam.questions[1].orden).toBe(2)
  })

  it('debe manejar circuit breaker fallback correctamente', async () => {
    setupAuthenticatedSession()
    setupCircuitBreakerFallback(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })

    await assertAttemptErrorResponse(response, 404, 'Intento no encontrado')
  })

  it('debe manejar errores de base de datos correctamente', async () => {
    setupAuthenticatedSession()
    setupCircuitBreakerError(new Error('Database connection failed'))
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    const response = await GET(request, { params })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toContain('Error al obtener intento')
  })

  it('debe manejar errores al obtener params en catch', async () => {
    setupAuthenticatedSession()
    const params = Promise.reject(new Error('Params error'))
    const request = new NextRequest(`http://localhost/api/attempts/${TEST_IDS.ATTEMPT}`)

    // Simular error en la operación principal
    vi.mocked(prisma.attempt.findUnique).mockRejectedValue(new Error('Database error'))

    const response = await GET(request, { params })

    expect(response.status).toBe(500)
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })
})

// ============================================
// TESTS PUT /api/attempts/[id]
// ============================================

describe('PUT /api/attempts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupCircuitBreakerSuccess()
    setupCacheInvalidationMock()
    // Asegurar que getCurrentStudentId esté mockeado por defecto
    vi.mocked(getCurrentStudentId).mockResolvedValue(TEST_IDS.STUDENT)
  })

  // ============================================
  // Validaciones básicas
  // ============================================

  it('debe retornar 400 si el ID no tiene formato CUID válido', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: 'invalid-id' })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: 'invalid-id' })

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 400, 'ID de intento inválido')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const errorResponse = NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    setupValidateBodyError(errorResponse)
    const request = createTestRequestWithBody({ estado: 'invalid' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Body inválido')
  })

  it('debe retornar 404 si el intento no existe', async () => {
    setupAuthenticatedSession()
    setupAttemptMock(null)
    setupValidateBodySuccess({ estado: 'completado' })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 404, 'Intento no encontrado')
  })

  it('debe retornar 403 si el intento no pertenece al estudiante', async () => {
    setupAuthenticatedSession(TEST_IDS.STUDENT)
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      studentId: TEST_IDS.STUDENT_2,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 403, 'No autorizado')
  })

  it('debe retornar 400 si el intento ya está completado', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 400, 'El intento ya está completado')
  })

  // ============================================
  // Validaciones de respuestas
  // ============================================

  it('debe retornar 400 si hay respuestas duplicadas para la misma pregunta', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [
        { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
        { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION_2, omitida: false }, // Duplicado
      ],
    })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION_2, omitida: false },
        ],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })

    const data = await assertAttemptErrorResponse(response, 400, 'Respuestas duplicadas')
    expect(data.details).toContain(TEST_IDS.QUESTION)
  })

  it('debe retornar 400 si el número de respuestas excede el total de preguntas', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      totalPreguntas: 2,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [
        { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
        { questionId: TEST_IDS.QUESTION_2, optionSelectedId: TEST_IDS.OPTION, omitida: false },
        { questionId: 'c999999999999999999999999', optionSelectedId: TEST_IDS.OPTION, omitida: false }, // Extra
      ],
    })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
          { questionId: TEST_IDS.QUESTION_2, optionSelectedId: TEST_IDS.OPTION, omitida: false },
          { questionId: 'c999999999999999999999999', optionSelectedId: TEST_IDS.OPTION, omitida: false },
        ],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 400, 'Número de respuestas excede')
  })

  it('debe retornar 400 si una pregunta no pertenece al examen', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [
        { questionId: 'c999999999999999999999999', optionSelectedId: TEST_IDS.OPTION, omitida: false }, // Pregunta inválida
      ],
    })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [{ questionId: 'c999999999999999999999999', optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })

    const data = await assertAttemptErrorResponse(response, 400, 'Preguntas inválidas')
    expect(data.details).toContain('c999999999999999999999999')
  })

  it('debe retornar 400 si una opción no pertenece a su pregunta', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupDeleteAnswersMock()
    setupCreateAnswersMock()
    // ✅ Enterprise: Configurar mock de update para evitar error de undefined
    setupAttemptUpdateMock(attempt)
    setupValidateBodySuccess({
      answers: [
        { questionId: TEST_IDS.QUESTION, optionSelectedId: 'cinvalidinvalidinvalid', omitida: false }, // Opción inválida (no existe en TEST_IDS)
      ],
    })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: 'cinvalidinvalidinvalid', omitida: false }],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 400, 'Opciones inválidas')
  })

  it('debe retornar 400 si el examen no tiene preguntas válidas', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    // Simular examen sin questions array válido
    const invalidAttempt = {
      ...attempt,
      exam: {
        ...attempt.exam,
        questions: null, // No es un array
      },
    }
    setupAttemptMock(invalidAttempt as any)
    setupValidateBodySuccess({
      answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
    })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })

    await assertAttemptErrorResponse(response, 400, 'preguntas válidas')
  })

  // ============================================
  // Validaciones de estado
  // ============================================

  it('debe retornar 400 si la transición de estado es inválida', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'cancelado',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    const data = await assertAttemptErrorResponse(response, 400, 'Transición de estado inválida')
    expect(data.details).toContain('cancelado')
  })

  it('debe permitir transición de en_progreso a completado', async () => {
    setupAuthenticatedSession()
    const now = new Date()
    const startedAt = new Date(now.getTime() - 60000) // 1 minuto atrás
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      startedAt,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
      startedAt,
      finishedAt: now,
      duracionSegundos: 60,
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.estado).toBe('completado')
    expect(data.finishedAt).toBeDefined()
    expect(data.duracionSegundos).toBe(60)
  })

  it('debe permitir transición de en_progreso a cancelado', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'cancelado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'cancelado',
    })
    setupAttemptUpdateMock(updatedAttempt)

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'cancelado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.estado).toBe('cancelado')
  })

  // ============================================
  // Actualización de respuestas
  // ============================================

  it('debe actualizar respuestas correctamente', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [
        { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
        { questionId: TEST_IDS.QUESTION_2, optionSelectedId: null, omitida: true },
      ],
    })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      answers: [
        {
          questionId: TEST_IDS.QUESTION,
          optionSelectedId: TEST_IDS.OPTION,
          esCorrecta: true,
          omitida: false,
        },
        {
          questionId: TEST_IDS.QUESTION_2,
          optionSelectedId: null,
          esCorrecta: false,
          omitida: true,
        },
      ],
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({
      ...attempt,
      answers: [
        createAttemptAnswer({
          questionId: TEST_IDS.QUESTION,
          optionSelectedId: TEST_IDS.OPTION,
          esCorrecta: true,
          omitida: false,
        }),
        createAttemptAnswer({
          questionId: TEST_IDS.QUESTION_2,
          optionSelectedId: null,
          esCorrecta: false,
          omitida: true,
        }),
      ] as any,
    })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
          { questionId: TEST_IDS.QUESTION_2, optionSelectedId: null, omitida: true },
        ],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.answers).toBeDefined()
    expect(Array.isArray(data.answers)).toBe(true)
    expect(vi.mocked(prisma.attemptAnswer.deleteMany)).toHaveBeenCalled()
    expect(vi.mocked(prisma.attemptAnswer.createMany)).toHaveBeenCalled()
  })

  it('debe recalcular estadísticas después de actualizar respuestas', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      totalPreguntas: 2,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [
        { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }, // Correcta
        { questionId: TEST_IDS.QUESTION_2, optionSelectedId: TEST_IDS.OPTION_2, omitida: false }, // Incorrecta
      ],
    })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const answersForStats = [
      createAttemptAnswer({
        questionId: TEST_IDS.QUESTION,
        optionSelectedId: TEST_IDS.OPTION,
        esCorrecta: true,
        omitida: false,
      }),
      createAttemptAnswer({
        questionId: TEST_IDS.QUESTION_2,
        optionSelectedId: TEST_IDS.OPTION_2,
        esCorrecta: false,
        omitida: false,
      }),
    ]
    setupAttemptWithAnswersMock({
      ...attempt,
      answers: answersForStats as any,
    })

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      totalPreguntas: 2,
      correctas: 1,
      incorrectas: 1,
      omitidas: 0,
      porcentaje: 50,
    })
    setupAttemptUpdateMock(updatedAttempt)

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false },
          { questionId: TEST_IDS.QUESTION_2, optionSelectedId: TEST_IDS.OPTION_2, omitida: false },
        ],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.correctas).toBe(1)
    expect(data.incorrectas).toBe(1)
    expect(data.omitidas).toBe(0)
    expect(data.porcentaje).toBe(50)
  })

  // ============================================
  // Validaciones de duración
  // ============================================

  it('debe calcular duración correctamente al completar', async () => {
    setupAuthenticatedSession()
    const now = new Date()
    const startedAt = new Date(now.getTime() - 120000) // 2 minutos atrás
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      startedAt,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
      startedAt,
      finishedAt: now,
      duracionSegundos: 120,
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.duracionSegundos).toBe(120)
  })

  it('debe retornar 400 si la duración excede 24 horas', async () => {
    setupAuthenticatedSession()
    const now = new Date()
    const startedAt = new Date(now.getTime() - 25 * 60 * 60 * 1000) // 25 horas atrás
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      startedAt,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    const data = await assertAttemptErrorResponse(response, 400, 'Duración inválida')
    expect(data.details).toContain('24 horas')
  })

  it('debe manejar duración negativa (usar 0)', async () => {
    setupAuthenticatedSession()
    const now = new Date()
    const startedAt = new Date(now.getTime() + 1000) // 1 segundo en el futuro (sincronización)
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      startedAt,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
      startedAt,
      finishedAt: now,
      duracionSegundos: 0,
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.duracionSegundos).toBe(0)
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  it('debe manejar startedAt inválido', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      startedAt: new Date('invalid'),
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
      duracionSegundos: 0,
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.duracionSegundos).toBe(0)
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  // ============================================
  // Invalidación de caché
  // ============================================

  it('debe invalidar caché después de actualizar', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'completado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'completado',
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    await PUT(request, { params })

    expect(vi.mocked(invalidateCachePattern)).toHaveBeenCalledWith(`student:${TEST_IDS.STUDENT}:attempts:*`)
  })

  // ============================================
  // Manejo de errores
  // ============================================

  it('debe manejar errores de circuit breaker', async () => {
    setupAuthenticatedSession()
    setupCircuitBreakerError(new Error('Circuit breaker open'))
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toContain('Error al actualizar intento')
  })

  it('debe manejar errores al guardar respuestas', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
    })
    setupDeleteAnswersMock()
    setupCircuitBreakerError(new Error('Database error'))

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toContain('Error al actualizar intento')
  })

  it('debe manejar errores al obtener params en catch', async () => {
    setupAuthenticatedSession()
    const params = Promise.reject(new Error('Params error'))
    const request = createTestRequestWithBody({ estado: 'completado' }, { attemptId: TEST_IDS.ATTEMPT })

    // Simular error en la operación principal
    vi.mocked(prisma.attempt.findUnique).mockRejectedValue(new Error('Database error'))

    const response = await PUT(request, { params })

    expect(response.status).toBe(500)
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  // ============================================
  // Casos borde
  // ============================================

  it('debe manejar actualización solo de estado sin respuestas', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({ estado: 'cancelado' })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'cancelado',
    })
    setupAttemptUpdateMock(updatedAttempt)

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ estado: 'cancelado' }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.estado).toBe('cancelado')
  })

  it('debe manejar actualización solo de respuestas sin estado', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
    })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      answers: [
        {
          questionId: TEST_IDS.QUESTION,
          optionSelectedId: TEST_IDS.OPTION,
          esCorrecta: true,
          omitida: false,
        },
      ],
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({
      ...attempt,
      answers: [
        createAttemptAnswer({
          questionId: TEST_IDS.QUESTION,
          optionSelectedId: TEST_IDS.OPTION,
          esCorrecta: true,
          omitida: false,
        }),
      ] as any,
    })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody(
      {
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      },
      { attemptId: TEST_IDS.ATTEMPT }
    )

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.estado).toBe('en_progreso')
    expect(data.answers).toHaveLength(1)
  })

  it('debe manejar respuestas con totalPreguntas = 0', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      totalPreguntas: 0,
    })
    setupAttemptMock(attempt)
    setupValidateBodySuccess({
      answers: [],
    })
    setupDeleteAnswersMock()
    setupCreateAnswersMock()

    const updatedAttempt = createAttemptWithRelations({
      id: TEST_IDS.ATTEMPT,
      estado: 'en_progreso',
      totalPreguntas: 0,
      correctas: 0,
      incorrectas: 0,
      omitidas: 0,
      porcentaje: 0,
    })
    setupAttemptUpdateMock(updatedAttempt)
    setupAttemptWithAnswersMock({ ...attempt, answers: [] })

    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithBody({ answers: [] }, { attemptId: TEST_IDS.ATTEMPT })

    const response = await PUT(request, { params })
    const data = await assertSuccessResponse(response)

    expect(data.porcentaje).toBe(0)
  })
})

