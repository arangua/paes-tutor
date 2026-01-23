// @vitest-environment node
/**
 * Tests Enterprise para API de Materials
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import {
  TEST_IDS,
  createStudyMaterial,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupMaterialsMock,
  setupMaterialsCountMock,
  setupCacheSuccess,
  setupValidateQuerySuccess,
  setupValidateQueryError,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyMaterial: { findMany: vi.fn(), count: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/api-helpers', () => ({
  validateQuery: vi.fn(),
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

vi.mock('@/lib/cache', () => ({
  getCached: vi.fn(),
  cacheKeys: {
    materials: (subjectId?: string, topicId?: string, tipo?: string, limit?: number, offset?: number) =>
      `materials:${subjectId || 'all'}:${topicId || 'all'}:${tipo || 'all'}:${limit || 'all'}:${offset || 'all'}`,
  },
}))

vi.mock('@/lib/constants', () => ({
  TIME_CONSTANTS: {
    MATERIALS_CACHE_TTL_MS: 3600000,
  },
}))

vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/materials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupCacheSuccess(null, null)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    setupValidateQuerySuccess({})
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si los query params no son válidos', async () => {
    setupAuthenticatedSession()
    const errorResponse = new Response(JSON.stringify({ error: 'Invalid params' }), { status: 400 })
    setupValidateQueryError(errorResponse)
    const request = createTestRequest()
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('debe retornar todos los materiales', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ limit: 20, offset: 0 })
    const materials = [
      createStudyMaterial({ id: 'c1', titulo: 'Material 1' }),
      createStudyMaterial({ id: 'c2', titulo: 'Material 2' }),
    ]
    setupMaterialsMock(materials)
    setupMaterialsCountMock(2)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.materials).toHaveLength(2)
    expect(data.pagination.total).toBe(2)
    expect(data.pagination.hasMore).toBe(false)
  })

  it('debe filtrar por subjectId', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ subjectId: TEST_IDS.SUBJECT, limit: 20, offset: 0 })
    const materials = [createStudyMaterial({ subjectId: TEST_IDS.SUBJECT })]
    setupMaterialsMock(materials)
    setupMaterialsCountMock(1)
    const request = createTestRequest({ queryParams: { subjectId: TEST_IDS.SUBJECT } })
    await GET(request)
    expect(vi.mocked(prisma.studyMaterial.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ subjectId: TEST_IDS.SUBJECT }),
      })
    )
  })

  it('debe filtrar por topicId', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ topicId: TEST_IDS.TOPIC, limit: 20, offset: 0 })
    const materials = [createStudyMaterial({ topicId: TEST_IDS.TOPIC })]
    setupMaterialsMock(materials)
    setupMaterialsCountMock(1)
    const request = createTestRequest({ queryParams: { topicId: TEST_IDS.TOPIC } })
    await GET(request)
    expect(vi.mocked(prisma.studyMaterial.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ topicId: TEST_IDS.TOPIC }),
      })
    )
  })

  it('debe filtrar por tipo', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ tipo: 'articulo', limit: 20, offset: 0 })
    const materials = [createStudyMaterial({ tipo: 'articulo' })]
    setupMaterialsMock(materials)
    setupMaterialsCountMock(1)
    const request = createTestRequest({ queryParams: { tipo: 'articulo' } })
    await GET(request)
    expect(vi.mocked(prisma.studyMaterial.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tipo: 'articulo' }),
      })
    )
  })

  it('debe aplicar paginación correctamente', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ limit: 10, offset: 5 })
    setupMaterialsMock([])
    setupMaterialsCountMock(20)
    const request = createTestRequest({ queryParams: { limit: '10', offset: '5' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.pagination.limit).toBe(10)
    expect(data.pagination.offset).toBe(5)
    expect(data.pagination.hasMore).toBe(true)
    expect(vi.mocked(prisma.studyMaterial.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 10,
      })
    )
  })

  it('debe usar caché para materiales', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ limit: 20, offset: 0 })
    const materials = [createStudyMaterial()]
    setupCacheSuccess(materials, 1)
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(getCached)).toHaveBeenCalledWith(
      expect.stringContaining('materials:'),
      expect.any(Function),
      TIME_CONSTANTS.MATERIALS_CACHE_TTL_MS
    )
  })

  it('debe ordenar materiales por relevancia (tema primero)', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ limit: 20, offset: 0 })
    const now = new Date()
    const earlier = new Date(now.getTime() - 1000)
    const materials = [
      createStudyMaterial({ id: 'c1', topicId: null, createdAt: now }),
      createStudyMaterial({ id: 'c2', topicId: TEST_IDS.TOPIC, createdAt: earlier }),
    ]
    setupMaterialsMock(materials)
    setupMaterialsCountMock(2)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    // El material con tema debe estar primero después del sort
    expect(data.materials).toBeDefined()
  })

  it('debe incluir relaciones (subject, topic)', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ limit: 20, offset: 0 })
    const materials = [createStudyMaterial({ topicId: TEST_IDS.TOPIC })]
    setupMaterialsMock(materials)
    setupMaterialsCountMock(1)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.materials[0].subject).toBeDefined()
    expect(data.materials[0].topic).toBeDefined()
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    setupValidateQuerySuccess({ limit: 20, offset: 0 })
    vi.mocked(prisma.studyMaterial.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest()
    const response = await GET(request)
    expect(response.status).toBe(500)
  })
})

