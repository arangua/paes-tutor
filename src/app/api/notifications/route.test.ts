// @vitest-environment node
/**
 * Tests Enterprise para API de Notifications
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  createNotification,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupNotificationsMock,
  setupNotificationCountMock,
  setupNotificationCreateMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    notification: { findMany: vi.fn(), count: vi.fn(), create: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/get-session')>('@/lib/get-session')
  return {
    ...actual,
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getCurrentStudentId: vi.fn(),
    getAuthenticatedUserWithStudent: vi.fn(),
  }
})

vi.mock('@/lib/logger', async () => {
  const actual = await vi.importActual<typeof import('@/lib/logger')>('@/lib/logger')
  return {
    ...actual,
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
    logApiRequest: vi.fn(),
  }
})

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar todas las notificaciones', async () => {
    setupAuthenticatedSession()
    const notifications = [
      createNotification({ id: 'c1', title: 'Notification 1' }),
      createNotification({ id: 'c2', title: 'Notification 2' }),
    ]
    setupNotificationsMock(notifications)
    setupNotificationCountMock(0)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.notifications).toBeDefined()
    expect(data.unreadCount).toBeDefined()
  })

  it('debe filtrar por unreadOnly=true', async () => {
    setupAuthenticatedSession()
    const notifications = [createNotification({ id: 'c1', read: false })]
    setupNotificationsMock(notifications)
    setupNotificationCountMock(1)
    const request = createTestRequest({ queryParams: { unreadOnly: 'true' } })
    await GET(request)
    expect(vi.mocked(prisma.notification.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ read: false }),
      })
    )
  })

  it('debe filtrar por type', async () => {
    setupAuthenticatedSession()
    const notifications = [createNotification({ type: 'challenge' })]
    setupNotificationsMock(notifications)
    setupNotificationCountMock(0)
    const request = createTestRequest({ queryParams: { type: 'challenge' } })
    await GET(request)
    expect(vi.mocked(prisma.notification.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: 'challenge' }),
      })
    )
  })

  it('debe validar limit entre 1 y 100', async () => {
    setupAuthenticatedSession()
    const request = createTestRequest({ queryParams: { limit: '0' } })
    const response = await GET(request)
    await assertErrorResponse(response, 400, 'límite debe ser un número entre 1 y 100')
  })

  it('debe ordenar por prioridad (urgent > high > normal > low)', async () => {
    setupAuthenticatedSession()
    const notifications = [
      createNotification({ id: 'c1', priority: 'normal', createdAt: new Date('2024-01-01') }),
      createNotification({ id: 'c2', priority: 'urgent', createdAt: new Date('2024-01-02') }),
      createNotification({ id: 'c3', priority: 'high', createdAt: new Date('2024-01-03') }),
    ]
    setupNotificationsMock(notifications)
    setupNotificationCountMock(0)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.notifications[0].priority).toBe('urgent')
    expect(data.notifications[1].priority).toBe('high')
  })

  it('debe filtrar notificaciones expiradas', async () => {
    setupAuthenticatedSession()
    const now = new Date()
    const past = new Date(now.getTime() - 1000)
    const future = new Date(now.getTime() + 1000)
    const notifications = [
      createNotification({ id: 'c1', expiresAt: past }),
      createNotification({ id: 'c2', expiresAt: future }),
      createNotification({ id: 'c3', expiresAt: null }),
    ]
    setupNotificationsMock(notifications)
    setupNotificationCountMock(0)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    // Las expiradas deben ser filtradas
    expect(data.notifications.length).toBeLessThanOrEqual(2)
  })

  it('debe manejar errores de base de datos con OR', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.notification.findMany).mockRejectedValueOnce(new Error('OR error'))
    const notifications = [createNotification()]
    vi.mocked(prisma.notification.findMany).mockResolvedValueOnce(notifications as any)
    setupNotificationCountMock(0)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.notifications).toBeDefined()
  })
})

describe('POST /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = createTestRequest({
      method: 'POST',
      body: { type: 'system', title: 'Test', message: 'Test message' },
    })
    const response = await POST(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    setupAuthenticatedSession()
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe crear notificación correctamente', async () => {
    setupAuthenticatedSession()
    const notification = createNotification({
      type: 'system',
      title: 'Test',
      message: 'Test message',
    })
    setupNotificationCreateMock(notification)
    const request = createTestRequest({
      method: 'POST',
      body: { type: 'system', title: 'Test', message: 'Test message' },
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)
    expect(data.notification.title).toBe('Test')
  })

  it('debe crear notificación con expiresAt', async () => {
    setupAuthenticatedSession()
    const future = new Date(Date.now() + 86400000)
    const notification = createNotification({ expiresAt: future })
    setupNotificationCreateMock(notification)
    const request = createTestRequest({
      method: 'POST',
      body: {
        type: 'system',
        title: 'Test',
        message: 'Test message',
        expiresAt: future.toISOString(),
      },
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)
    expect(data.notification.expiresAt).toBeDefined()
  })

  it('debe validar tipos de notificación válidos', async () => {
    setupAuthenticatedSession()
    const request = createTestRequest({
      method: 'POST',
      body: { type: 'invalid', title: 'Test', message: 'Test message' },
    })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe validar longitud de title y message', async () => {
    setupAuthenticatedSession()
    const request = createTestRequest({
      method: 'POST',
      body: {
        type: 'system',
        title: '',
        message: 'a'.repeat(1001),
      },
    })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })
})

