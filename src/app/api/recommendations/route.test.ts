// @vitest-environment node
/**
 * Tests Enterprise para API de Recommendations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import { handleApiError } from '@/lib/api-helpers'
import { generateRecommendations } from '@/lib/recommendations'
import { getCurrentStudentId } from '@/lib/get-session'
import {
  TEST_IDS,
  createPerformanceMetricForRecommendations,
  createExamForRecommendations,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupPerformanceMetricsMock,
  setupExamsMock,
  setupCacheSuccess,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    performanceMetric: { findMany: vi.fn() },
    exam: { findMany: vi.fn() },
  },
}))

// Mock global de get-session está en src/test/setup.ts - solo sobrescribir valores específicos con vi.mocked()

vi.mock('@/lib/cache', async () => {
  const actual = await vi.importActual<typeof import('@/lib/cache')>('@/lib/cache')
  return {
    ...actual,
    getCached: vi.fn(),
    cacheKeys: {
      studentRecommendations: (studentId: string) => `recommendations:${studentId}`,
    },
  }
})

vi.mock('@/lib/recommendations', async () => {
  const actual = await vi.importActual<typeof import('@/lib/recommendations')>('@/lib/recommendations')
  return {
    ...actual,
    generateRecommendations: vi.fn(),
  }
})

vi.mock('@/lib/constants', () => ({
  TIME_CONSTANTS: {
    RECOMMENDATIONS_CACHE_TTL_MS: 3600000,
  },
}))

vi.mock('@/lib/api-helpers', () => ({
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

// Mock global de logger está en src/test/setup.ts

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((_request: NextRequest, handler: () => Promise<any>, _type?: string) => handler()),
}))

describe('GET /api/recommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupCacheSuccess(null)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar recomendaciones generadas', async () => {
    setupAuthenticatedSession()
    const metrics = [createPerformanceMetricForRecommendations()]
    const exams = [createExamForRecommendations()]
    setupPerformanceMetricsMock(metrics)
    setupExamsMock(exams)
    const mockRecommendations = {
      topics: [{ topicId: TEST_IDS.TOPIC, reason: 'Low performance' }],
      exams: [{ examId: TEST_IDS.EXAM, reason: 'Relevant exam' }],
    }
    vi.mocked(generateRecommendations).mockReturnValue(mockRecommendations)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.topics).toBeDefined()
    expect(data.exams).toBeDefined()
    expect(vi.mocked(generateRecommendations)).toHaveBeenCalled()
  })

  it('debe usar caché para recomendaciones', async () => {
    setupAuthenticatedSession()
    const cachedRecommendations = {
      topics: [],
      exams: [],
    }
    setupCacheSuccess(cachedRecommendations)
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(getCached)).toHaveBeenCalledWith(
      cacheKeys.studentRecommendations(TEST_IDS.STUDENT),
      expect.any(Function),
      TIME_CONSTANTS.RECOMMENDATIONS_CACHE_TTL_MS
    )
  })

  it('debe filtrar métricas sin topic o subject', async () => {
    setupAuthenticatedSession()
    const metrics = [
      createPerformanceMetricForRecommendations(),
      { ...createPerformanceMetricForRecommendations(), topic: null },
    ]
    setupPerformanceMetricsMock(metrics)
    setupExamsMock([])
    vi.mocked(generateRecommendations).mockReturnValue({ topics: [], exams: [] })
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(generateRecommendations)).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          topicId: expect.any(String),
        }),
      ]),
      expect.any(Array)
    )
  })

  it('debe limitar exámenes a 50', async () => {
    setupAuthenticatedSession()
    setupPerformanceMetricsMock([])
    setupExamsMock([])
    vi.mocked(generateRecommendations).mockReturnValue({ topics: [], exams: [] })
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(prisma.exam.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
      })
    )
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.performanceMetric.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest()
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(handleApiError)).toHaveBeenCalled()
  })
})

