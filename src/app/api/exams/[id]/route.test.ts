// @vitest-environment node
/**
 * Tests Enterprise para API de Exams/[id]
 * 
 * Este módulo contiene tests unitarios y de robustez para la API de exams/[id],
 * siguiendo estándares enterprise para garantizar máxima calidad y cobertura.
 * 
 * @module route.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached, cacheKeys } from '@/lib/cache'
import { handleApiError } from '@/lib/api-helpers'
import { TIME_CONSTANTS } from '@/lib/constants'
import { logger } from '@/lib/logger'
import {
  TEST_IDS,
  createExamWithRelations,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupExamMock,
  setupCacheSuccess,
  setupCacheError,
  createTestRequestWithExamId,
  assertExamResponse,
  assertExamErrorResponse,
} from './__tests__/test-helpers'

// ============================================
// MOCKS
// ============================================

vi.mock('@/lib/prisma', () => ({
  prisma: {
    exam: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/cache', () => ({
  getCached: vi.fn(),
  cacheKeys: {
    exam: (id: string) => `exam:${id}`,
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  logApiRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => {
    return handler()
  }),
}))

vi.mock('@/lib/api-helpers', () => ({
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

vi.mock('@/lib/constants', () => ({
  TIME_CONSTANTS: {
    EXAMS_CACHE_TTL_MS: 3600000, // 1 hora
  },
}))

// ============================================
// TESTS GET /api/exams/[id]
// ============================================

describe('GET /api/exams/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupCacheSuccess(null) // Por defecto, no hay caché (ejecuta fetcher)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })

    await assertExamErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el ID no tiene formato CUID válido', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: 'invalid-id' })
    const request = createTestRequestWithExamId('invalid-id')

    const response = await GET(request, { params })

    await assertExamErrorResponse(response, 400, 'ID de examen inválido')
  })

  it('debe retornar 400 si el ID está vacío', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: '' })
    const request = createTestRequestWithExamId('')

    const response = await GET(request, { params })

    await assertExamErrorResponse(response, 400, 'ID de examen inválido')
  })

  it('debe retornar 400 si el ID es null', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: null as any })
    const request = createTestRequestWithExamId('')

    const response = await GET(request, { params })

    await assertExamErrorResponse(response, 400, 'ID de examen inválido')
  })

  it('debe retornar 404 si el examen no existe', async () => {
    setupAuthenticatedSession()
    setupExamMock(null)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })

    await assertExamErrorResponse(response, 404, 'Examen no encontrado')
  })

  it('debe retornar el examen completo con todas sus relaciones', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
      titulo: 'Test Exam',
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.id).toBe(TEST_IDS.EXAM)
    expect(data.titulo).toBe('Test Exam')
    expect(data.subject).toBeDefined()
    expect(data.questions).toBeDefined()
    expect(Array.isArray(data.questions)).toBe(true)
  })

  it('debe incluir subject con todas sus propiedades', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
      subject: {
        id: TEST_IDS.SUBJECT,
        nombre: 'Test Subject',
        codigo: 'TEST',
      },
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.subject.id).toBe(TEST_IDS.SUBJECT)
    expect(data.subject.nombre).toBe('Test Subject')
    expect(data.subject.codigo).toBe('TEST')
  })

  it('debe incluir questions ordenadas por orden ascendente', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
      questions: [
        { questionId: TEST_IDS.QUESTION, orden: 2 },
        { questionId: TEST_IDS.QUESTION_2, orden: 1 },
      ],
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    await assertExamResponse(response)

    // Verificar que se llama con orderBy
    expect(vi.mocked(prisma.exam.findUnique)).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          questions: expect.objectContaining({
            orderBy: { orden: 'asc' },
          }),
        }),
      })
    )
  })

  it('debe incluir options para cada question', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
      questions: [
        {
          questionId: TEST_IDS.QUESTION,
          orden: 1,
          question: {
            id: TEST_IDS.QUESTION,
            enunciado: 'Test Question',
            options: [
              { id: TEST_IDS.OPTION, texto: 'Opción A', esCorrecta: true, letra: 'A' },
              { id: TEST_IDS.OPTION_2, texto: 'Opción B', esCorrecta: false, letra: 'B' },
            ],
          },
        },
      ],
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.questions[0].question.options).toBeDefined()
    expect(Array.isArray(data.questions[0].question.options)).toBe(true)
    expect(data.questions[0].question.options.length).toBeGreaterThan(0)
  })

  it('debe usar caché para obtener el examen', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
    })
    setupCacheSuccess(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.id).toBe(TEST_IDS.EXAM)
    expect(vi.mocked(getCached)).toHaveBeenCalledWith(
      cacheKeys.exam(TEST_IDS.EXAM),
      expect.any(Function),
      TIME_CONSTANTS.EXAMS_CACHE_TTL_MS
    )
  })

  it('debe ejecutar fetcher si no hay caché', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
    })
    setupCacheSuccess(null) // No hay caché, ejecuta fetcher
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.id).toBe(TEST_IDS.EXAM)
    expect(vi.mocked(prisma.exam.findUnique)).toHaveBeenCalled()
  })

  it('debe manejar errores de base de datos correctamente', async () => {
    setupAuthenticatedSession()
    setupCacheSuccess(null)
    vi.mocked(prisma.exam.findUnique).mockRejectedValue(new Error('Database error'))
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })

    expect(response.status).toBe(500)
    expect(vi.mocked(handleApiError)).toHaveBeenCalledWith(
      expect.any(Error),
      'Error al obtener examen',
      expect.objectContaining({
        path: `/api/exams/${TEST_IDS.EXAM}`,
      })
    )
  })

  it('debe manejar errores de caché correctamente', async () => {
    setupAuthenticatedSession()
    setupCacheError(new Error('Cache error'))
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })

    expect(response.status).toBe(500)
    expect(vi.mocked(handleApiError)).toHaveBeenCalled()
  })

  it('debe manejar errores al obtener params en catch', async () => {
    setupAuthenticatedSession()
    setupCacheSuccess(null)
    vi.mocked(prisma.exam.findUnique).mockRejectedValue(new Error('Database error'))
    const params = Promise.reject(new Error('Params error'))
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })

    expect(response.status).toBe(500)
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
      }),
      'Error al obtener params en catch de exams/[id]'
    )
  })

  it('debe manejar examen con todas las propiedades opcionales', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
      descripcion: null,
      tiempoLimiteMin: null,
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.descripcion).toBeNull()
    expect(data.tiempoLimiteMin).toBeNull()
  })

  it('debe manejar examen sin questions', async () => {
    setupAuthenticatedSession()
    const exam = createExamWithRelations({
      id: TEST_IDS.EXAM,
      questions: [],
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: TEST_IDS.EXAM })
    const request = createTestRequestWithExamId(TEST_IDS.EXAM)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.questions).toHaveLength(0)
  })

  it('debe validar formato CUID con regex correcto', async () => {
    setupAuthenticatedSession()
    const invalidIds = [
      'invalid',
      'c123', // Muy corto
      'C123456789012345678901234', // Mayúscula
      'c1234567890123456789012345', // Muy largo
      'x123456789012345678901234', // No empieza con 'c'
    ]

    for (const invalidId of invalidIds) {
      const params = Promise.resolve({ id: invalidId })
      const request = createTestRequestWithExamId(invalidId)

      const response = await GET(request, { params })

      await assertExamErrorResponse(response, 400, 'ID de examen inválido')
    }
  })

  it('debe aceptar formato CUID válido', async () => {
    setupAuthenticatedSession()
    const validId = 'c123456789012345678901234'
    const exam = createExamWithRelations({
      id: validId,
    })
    setupExamMock(exam)
    const params = Promise.resolve({ id: validId })
    const request = createTestRequestWithExamId(validId)

    const response = await GET(request, { params })
    const data = await assertExamResponse(response)

    expect(data.id).toBe(validId)
  })
})

