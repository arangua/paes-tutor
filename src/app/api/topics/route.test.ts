// @vitest-environment node
/**
 * Tests Enterprise para API de Topics
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import {
  TEST_IDS,
  createTopic,
  setupTopicsMock,
  createTestRequest,
  assertSuccessResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    topic: { findMany: vi.fn() },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/topics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar todos los temas', async () => {
    const topics = [
      createTopic({ id: 'c1', nombre: 'Topic 1' }),
      createTopic({ id: 'c2', nombre: 'Topic 2' }),
    ]
    setupTopicsMock(topics)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.topics).toHaveLength(2)
  })

  it('debe filtrar por subjectId', async () => {
    const topics = [createTopic({ subjectId: TEST_IDS.SUBJECT })]
    setupTopicsMock(topics)
    const request = createTestRequest({ queryParams: { subjectId: TEST_IDS.SUBJECT } })
    await GET(request)
    expect(vi.mocked(prisma.topic.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { subjectId: TEST_IDS.SUBJECT },
      })
    )
  })

  it('debe ordenar por ejeTematico y nombre', async () => {
    const topics = [createTopic()]
    setupTopicsMock(topics)
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(prisma.topic.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ ejeTematico: 'asc' }, { nombre: 'asc' }],
      })
    )
  })

  it('debe retornar array vacío si no hay temas', async () => {
    setupTopicsMock([])
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.topics).toEqual([])
  })

  it('debe incluir solo campos seleccionados', async () => {
    const topics = [createTopic()]
    setupTopicsMock(topics)
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(prisma.topic.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          nombre: true,
          ejeTematico: true,
          descripcion: true,
          subjectId: true,
        },
      })
    )
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.topic.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest()
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

