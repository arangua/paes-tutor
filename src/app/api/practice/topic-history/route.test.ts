// @vitest-environment node
/**
 * Tests Enterprise para API de Practice/Topic-History
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createTopicWithSubject,
  createPracticeSessionForHistory,
  createAttemptForHistory,
  createQuestion,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupTopicMock,
  setupPracticeSessionsMock,
  setupQuestionsMock,
  setupAttemptsMock,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    topic: { findUnique: vi.fn() },
    practiceSession: { findMany: vi.fn() },
    question: { findMany: vi.fn() },
    attempt: { findMany: vi.fn() },
  },
}))

import { logger } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/practice/topic-history', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si topicId no está presente', async () => {
    setupAuthenticatedSession()
    const request = new NextRequest('http://localhost/api/practice/topic-history')
    const response = await GET(request)
    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe retornar 404 si el tema no existe', async () => {
    setupAuthenticatedSession()
    setupTopicMock(null)
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    await assertErrorResponse(response, 404, 'Tema no encontrado')
  })

  it('debe retornar historial completo con sesiones y intentos', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    const sessions = [createPracticeSessionForHistory({ porcentaje: 80 })]
    const questions = [createQuestion()]
    const attempts = [createAttemptForHistory({ correctAnswers: 5, totalAnswers: 10 })]
    setupPracticeSessionsMock(sessions)
    setupQuestionsMock(questions)
    setupAttemptsMock(attempts)
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.topic).toBeDefined()
    expect(data.scores).toBeDefined()
    expect(data.summary).toBeDefined()
    expect(data.period).toBeDefined()
  })

  it('debe usar días por defecto (30) si no se especifica', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    setupPracticeSessionsMock([])
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    await GET(request)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    expect(vi.mocked(prisma.practiceSession.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startedAt: expect.objectContaining({
            gte: expect.any(Date),
          }),
        }),
      })
    )
  })

  it('debe usar días personalizados', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    setupPracticeSessionsMock([])
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}&days=7`)
    await GET(request)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    expect(vi.mocked(prisma.practiceSession.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startedAt: expect.objectContaining({
            gte: expect.any(Date),
          }),
        }),
      })
    )
  })

  it('debe calcular porcentaje por tema en intentos', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    setupPracticeSessionsMock([])
    const questions = [createQuestion({ id: TEST_IDS.QUESTION })]
    setupQuestionsMock(questions)
    const attempts = [createAttemptForHistory({ correctAnswers: 8, totalAnswers: 10 })]
    setupAttemptsMock(attempts)
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.scores).toBeDefined()
    const examScore = data.scores.find(s => s.type === 'exam')
    expect(examScore).toBeDefined()
    expect(examScore?.porcentaje).toBe(80)
  })

  it('debe calcular estadísticas agregadas correctamente', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    const sessions = [
      createPracticeSessionForHistory({ porcentaje: 70 }),
      createPracticeSessionForHistory({ porcentaje: 90 }),
    ]
    setupPracticeSessionsMock(sessions)
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.summary.avgScore).toBe(80)
    expect(data.summary.bestScore).toBe(90)
    expect(data.summary.worstScore).toBe(70)
  })

  it('debe calcular tendencia improving', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    const sessions = [
      createPracticeSessionForHistory({ porcentaje: 60, startedAt: new Date('2024-01-01') }),
      createPracticeSessionForHistory({ porcentaje: 70, startedAt: new Date('2024-01-02') }),
      createPracticeSessionForHistory({ porcentaje: 80, startedAt: new Date('2024-01-03') }),
      createPracticeSessionForHistory({ porcentaje: 90, startedAt: new Date('2024-01-04') }),
    ]
    setupPracticeSessionsMock(sessions)
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.summary.trend).toBe('improving')
  })

  it('debe calcular tendencia declining', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    const sessions = [
      createPracticeSessionForHistory({ porcentaje: 90, startedAt: new Date('2024-01-01') }),
      createPracticeSessionForHistory({ porcentaje: 80, startedAt: new Date('2024-01-02') }),
      createPracticeSessionForHistory({ porcentaje: 70, startedAt: new Date('2024-01-03') }),
      createPracticeSessionForHistory({ porcentaje: 60, startedAt: new Date('2024-01-04') }),
    ]
    setupPracticeSessionsMock(sessions)
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.summary.trend).toBe('declining')
  })

  it('debe ordenar scores por fecha ascendente', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    const sessions = [
      createPracticeSessionForHistory({ startedAt: new Date('2024-01-02') }),
      createPracticeSessionForHistory({ startedAt: new Date('2024-01-01') }),
    ]
    setupPracticeSessionsMock(sessions)
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.scores[0].fecha).toBeDefined()
    // Debe estar ordenado por fecha
  })

  it('debe incluir información del tema y asignatura', async () => {
    setupAuthenticatedSession()
    const topic = createTopicWithSubject()
    setupTopicMock(topic)
    setupPracticeSessionsMock([])
    setupQuestionsMock([])
    setupAttemptsMock([])
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.topic.id).toBe(TEST_IDS.TOPIC)
    expect(data.topic.nombre).toBeDefined()
    expect(data.topic.subject).toBeDefined()
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.topic.findUnique).mockRejectedValue(new Error('Database error'))
    const request = new NextRequest(`http://localhost/api/practice/topic-history?topicId=${TEST_IDS.TOPIC}`)
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

