// @vitest-environment node
/**
 * Tests Enterprise para API de Practice/Stats
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createPerformanceMetric,
  createPracticeSession,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupPerformanceMetricsMock,
  setupPracticeSessionsMock,
  setupPracticeSessionsCountMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    performanceMetric: { findMany: vi.fn() },
    practiceSession: { findMany: vi.fn(), count: vi.fn() },
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

describe('GET /api/practice/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar estadísticas sin filtros', async () => {
    setupAuthenticatedSession()
    const metrics = [createPerformanceMetric({ topicId: TEST_IDS.TOPIC })]
    const sessions = [createPracticeSession({ topicId: TEST_IDS.TOPIC })]
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(1)
    const request = new NextRequest('http://localhost/api/practice/stats')
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.metrics).toBeDefined()
    expect(data.recentSessions).toBeDefined()
    expect(data.summary).toBeDefined()
    expect(data.summary.totalSessions).toBe(1)
  })

  it('debe filtrar por topicId', async () => {
    setupAuthenticatedSession()
    const metrics = [createPerformanceMetric({ topicId: TEST_IDS.TOPIC })]
    const sessions = [createPracticeSession({ topicId: TEST_IDS.TOPIC })]
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(1)
    const request = new NextRequest(`http://localhost/api/practice/stats?topicId=${TEST_IDS.TOPIC}`)
    await GET(request)
    expect(vi.mocked(prisma.performanceMetric.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ topicId: TEST_IDS.TOPIC }),
      })
    )
  })

  it('debe filtrar por subjectId', async () => {
    setupAuthenticatedSession()
    const metrics = [createPerformanceMetric()]
    const sessions = [createPracticeSession()]
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(1)
    const request = new NextRequest(`http://localhost/api/practice/stats?subjectId=${TEST_IDS.SUBJECT}`)
    await GET(request)
    expect(vi.mocked(prisma.performanceMetric.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          topic: expect.objectContaining({ subjectId: TEST_IDS.SUBJECT }),
        }),
      })
    )
  })

  it('debe calcular avgScore correctamente', async () => {
    setupAuthenticatedSession()
    const metrics = [createPerformanceMetric()]
    const sessions = [
      createPracticeSession({ porcentaje: 80 }),
      createPracticeSession({ porcentaje: 90 }),
    ]
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(2)
    const request = new NextRequest('http://localhost/api/practice/stats')
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.summary.avgScore).toBe(85)
  })

  it('debe calcular totalQuestions correctamente', async () => {
    setupAuthenticatedSession()
    const metrics = [
      createPerformanceMetric({ totalPreguntas: 10 }),
      createPerformanceMetric({ totalPreguntas: 20 }),
    ]
    const sessions = []
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(0)
    const request = new NextRequest('http://localhost/api/practice/stats')
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.summary.totalQuestions).toBe(30)
  })

  it('debe ordenar métricas por porcentaje ascendente', async () => {
    setupAuthenticatedSession()
    const metrics = [
      createPerformanceMetric({ topicId: 'c1', porcentaje: 90 }),
      createPerformanceMetric({ topicId: 'c2', porcentaje: 70 }),
      createPerformanceMetric({ topicId: 'c3', porcentaje: 80 }),
    ]
    const sessions = []
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(0)
    const request = new NextRequest('http://localhost/api/practice/stats')
    await GET(request)
    expect(vi.mocked(prisma.performanceMetric.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { porcentaje: 'asc' },
      })
    )
  })

  it('debe limitar sesiones recientes a 10', async () => {
    setupAuthenticatedSession()
    const metrics = []
    const sessions = Array.from({ length: 15 }, (_, i) => createPracticeSession({ id: `c${i}` }))
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(15)
    const request = new NextRequest('http://localhost/api/practice/stats')
    await GET(request)
    expect(vi.mocked(prisma.practiceSession.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
      })
    )
  })

  it('debe incluir información de topic y subject en métricas', async () => {
    setupAuthenticatedSession()
    const metrics = [createPerformanceMetric()]
    const sessions = []
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(0)
    const request = new NextRequest('http://localhost/api/practice/stats')
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.metrics[0].topicName).toBeDefined()
    expect(data.metrics[0].subjectName).toBeDefined()
  })

  it('debe manejar métricas sin topic o subject', async () => {
    setupAuthenticatedSession()
    const metrics = [
      {
        ...createPerformanceMetric(),
        topic: null,
      },
    ]
    const sessions = []
    setupPerformanceMetricsMock(metrics)
    setupPracticeSessionsMock(sessions)
    setupPracticeSessionsCountMock(0)
    const request = new NextRequest('http://localhost/api/practice/stats')
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.metrics).toHaveLength(0) // Filtradas porque no tienen topic
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.performanceMetric.findMany).mockRejectedValue(new Error('Database error'))
    const request = new NextRequest('http://localhost/api/practice/stats')
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

