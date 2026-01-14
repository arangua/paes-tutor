// @vitest-environment node
/**
 * Tests Enterprise para API de Notifications/Read-All
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupNotificationUpdateManyMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    notification: { updateMany: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

import { logger } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('POST /api/notifications/read-all', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe marcar todas las notificaciones no leídas como leídas', async () => {
    setupAuthenticatedSession()
    setupNotificationUpdateManyMock(5)
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.success).toBe(true)
    expect(data.count).toBe(5)
    expect(vi.mocked(prisma.notification.updateMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studentId: TEST_IDS.STUDENT,
          read: false,
        },
        data: {
          read: true,
          readAt: expect.any(Date),
        },
      })
    )
  })

  it('debe filtrar por tipo si se proporciona', async () => {
    setupAuthenticatedSession()
    setupNotificationUpdateManyMock(3)
    const request = createTestRequest({ method: 'POST', body: { type: 'challenge' } })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.success).toBe(true)
    expect(vi.mocked(prisma.notification.updateMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studentId: TEST_IDS.STUDENT,
          read: false,
          type: 'challenge',
        },
      })
    )
  })

  it('debe retornar count 0 si no hay notificaciones no leídas', async () => {
    setupAuthenticatedSession()
    setupNotificationUpdateManyMock(0)
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.success).toBe(true)
    expect(data.count).toBe(0)
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.notification.updateMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

