// @vitest-environment node
/**
 * Tests Enterprise para API de Materials/[id]
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import { handleApiError } from '@/lib/api-helpers'
import {
  TEST_IDS,
  createStudyMaterial,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupMaterialMock,
  setupCacheSuccess,
  createTestRequestWithMaterialId,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyMaterial: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/cache', () => ({
  getCached: vi.fn(),
  cacheKeys: {
    material: (id: string) => `material:${id}`,
  },
}))

vi.mock('@/lib/constants', () => ({
  TIME_CONSTANTS: {
    MATERIALS_CACHE_TTL_MS: 3600000,
  },
}))

vi.mock('@/lib/api-helpers', () => ({
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/materials/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupCacheSuccess(null)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithMaterialId()
    const response = await GET(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el ID no es CUID válido', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: 'invalid-id' })
    const request = createTestRequestWithMaterialId('invalid-id')
    const response = await GET(request, { params })
    await assertErrorResponse(response, 400, 'ID inválido')
  })

  it('debe retornar 404 si el material no existe', async () => {
    setupAuthenticatedSession()
    setupMaterialMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithMaterialId()
    const response = await GET(request, { params })
    await assertErrorResponse(response, 404, 'Material no encontrado')
  })

  it('debe retornar el material con todas sus relaciones', async () => {
    setupAuthenticatedSession()
    const material = createStudyMaterial({ id: TEST_IDS.ATTEMPT, topicId: TEST_IDS.TOPIC })
    setupMaterialMock(material)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithMaterialId()
    const response = await GET(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.id).toBe(TEST_IDS.ATTEMPT)
    expect(data.subject).toBeDefined()
    expect(data.topic).toBeDefined()
  })

  it('debe usar caché para materiales', async () => {
    setupAuthenticatedSession()
    const material = createStudyMaterial()
    setupCacheSuccess(material)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithMaterialId()
    await GET(request, { params })
    expect(vi.mocked(getCached)).toHaveBeenCalledWith(
      cacheKeys.material(TEST_IDS.ATTEMPT),
      expect.any(Function),
      TIME_CONSTANTS.MATERIALS_CACHE_TTL_MS
    )
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.studyMaterial.findUnique).mockRejectedValue(new Error('Database error'))
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithMaterialId()
    const response = await GET(request, { params })
    expect(response.status).toBe(500)
    expect(vi.mocked(handleApiError)).toHaveBeenCalled()
  })
})

