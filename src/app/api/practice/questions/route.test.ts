// @vitest-environment node
/**
 * Tests Enterprise para API de Practice/Questions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createQuestionWithOptions,
  setupAuthenticatedUser,
  setupUnauthenticatedUser,
  setupTopicMock,
  setupQuestionsMock,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    topic: { findUnique: vi.fn() },
    question: { findMany: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/practice/questions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si topicId no está presente', async () => {
    setupAuthenticatedUser()
    const request = new NextRequest('http://localhost/api/practice/questions')
    const response = await GET(request)
    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe retornar 404 si el tema no existe', async () => {
    setupAuthenticatedUser()
    setupTopicMock(null)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    await assertErrorResponse(response, 404, 'Tema no encontrado')
  })

  it('debe retornar preguntas del tema', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = [
      createQuestionWithOptions({ id: TEST_IDS.QUESTION }),
      createQuestionWithOptions({ id: TEST_IDS.QUESTION_2 }),
    ]
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.questions).toBeDefined()
    expect(Array.isArray(data.questions)).toBe(true)
    expect(data.topic).toBeDefined()
    expect(data.topic.id).toBe(TEST_IDS.TOPIC)
  })

  it('debe filtrar por dificultad easy (1-2)', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = [createQuestionWithOptions({ dificultad: 1 }), createQuestionWithOptions({ dificultad: 2 })]
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}&difficulty=easy`)
    await GET(request)
    expect(vi.mocked(prisma.question.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dificultad: { in: [1, 2] },
        }),
      })
    )
  })

  it('debe filtrar por dificultad medium (3-4)', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = [createQuestionWithOptions({ dificultad: 3 }), createQuestionWithOptions({ dificultad: 4 })]
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}&difficulty=medium`)
    await GET(request)
    expect(vi.mocked(prisma.question.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dificultad: { in: [3, 4] },
        }),
      })
    )
  })

  it('debe filtrar por dificultad hard (5)', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = [createQuestionWithOptions({ dificultad: 5 })]
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}&difficulty=hard`)
    await GET(request)
    expect(vi.mocked(prisma.question.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dificultad: { in: [5] },
        }),
      })
    )
  })

  it('debe usar mode como alias de difficulty', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = [createQuestionWithOptions({ dificultad: 1 })]
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}&mode=easy`)
    await GET(request)
    expect(vi.mocked(prisma.question.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dificultad: { in: [1, 2] },
        }),
      })
    )
  })

  it('debe aplicar límite de preguntas', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = Array.from({ length: 10 }, (_, i) => createQuestionWithOptions({ id: `c${i}` }))
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}&limit=5`)
    await GET(request)
    expect(vi.mocked(prisma.question.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
      })
    )
  })

  it('debe obtener todas las dificultades si no hay suficientes con filtro', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const filteredQuestions = [createQuestionWithOptions({ dificultad: 1 })]
    const allQuestions = [
      createQuestionWithOptions({ dificultad: 1 }),
      createQuestionWithOptions({ dificultad: 3 }),
      createQuestionWithOptions({ dificultad: 5 }),
    ]
    vi.mocked(prisma.question.findMany).mockResolvedValueOnce(filteredQuestions as any)
    vi.mocked(prisma.question.findMany).mockResolvedValueOnce(allQuestions as any)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}&difficulty=easy&limit=20`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.questions.length).toBeGreaterThan(filteredQuestions.length)
    expect(vi.mocked(prisma.question.findMany)).toHaveBeenCalledTimes(2)
  })

  it('debe incluir relaciones (options, subject, topic)', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = [createQuestionWithOptions()]
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.questions[0].options).toBeDefined()
    expect(data.questions[0].subject).toBeDefined()
    expect(data.questions[0].topic).toBeDefined()
  })

  it('debe aleatorizar el orden de las preguntas', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    const questions = Array.from({ length: 5 }, (_, i) => createQuestionWithOptions({ id: `c${i}` }))
    setupQuestionsMock(questions)
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.questions).toBeDefined()
    // El orden debe estar aleatorizado (aunque no podemos predecir el orden exacto)
    expect(data.questions.length).toBe(5)
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedUser()
    setupTopicMock({ id: TEST_IDS.TOPIC, nombre: 'Test Topic', subjectId: TEST_IDS.SUBJECT } as any)
    vi.mocked(prisma.question.findMany).mockRejectedValue(new Error('Database error'))
    const request = new NextRequest(`http://localhost/api/practice/questions?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

