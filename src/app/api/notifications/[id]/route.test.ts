// @vitest-environment node
/**
 * Tests Enterprise para API de Notifications/[id]
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PATCH, DELETE } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createNotification,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupNotificationMock,
  setupNotificationUpdateMock,
  setupNotificationDeleteMock,
  createTestRequestWithNotificationId,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    notification: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
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

describe('PATCH /api/notifications/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { body: { read: true } })
    const response = await PATCH(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si la notificación no existe', async () => {
    setupAuthenticatedSession()
    setupNotificationMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { body: { read: true } })
    const response = await PATCH(request, { params })
    await assertErrorResponse(response, 404, 'Notificación no encontrada')
  })

  it('debe retornar 403 si la notificación no pertenece al estudiante', async () => {
    setupAuthenticatedSession(TEST_IDS.STUDENT_2)
    const notification = createNotification({ studentId: TEST_IDS.STUDENT })
    setupNotificationMock(notification)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { body: { read: true } })
    const response = await PATCH(request, { params })
    await assertErrorResponse(response, 403, 'No autorizado')
  })

  it('debe marcar notificación como leída', async () => {
    setupAuthenticatedSession()
    const notification = createNotification({ read: false })
    setupNotificationMock(notification)
    // Crear objeto actualizado con readAt incluido
    const updated = {
      ...notification,
      read: true,
      readAt: new Date(),
    } as any
    setupNotificationUpdateMock(updated)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { body: { read: true } })
    const response = await PATCH(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.notification.read).toBe(true)
    expect(data.notification.readAt).toBeDefined()
  })

  it('debe marcar notificación como no leída', async () => {
    setupAuthenticatedSession()
    const notification = createNotification({ read: true })
    setupNotificationMock(notification)
    const updated = createNotification({ ...notification, read: false, readAt: null })
    setupNotificationUpdateMock(updated)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { body: { read: false } })
    const response = await PATCH(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.notification.read).toBe(false)
  })
})

describe('DELETE /api/notifications/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { method: 'DELETE' })
    const response = await DELETE(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si la notificación no existe', async () => {
    setupAuthenticatedSession()
    setupNotificationMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { method: 'DELETE' })
    const response = await DELETE(request, { params })
    await assertErrorResponse(response, 404, 'Notificación no encontrada')
  })

  it('debe retornar 403 si la notificación no pertenece al estudiante', async () => {
    setupAuthenticatedSession(TEST_IDS.STUDENT_2)
    const notification = createNotification({ studentId: TEST_IDS.STUDENT })
    setupNotificationMock(notification)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { method: 'DELETE' })
    const response = await DELETE(request, { params })
    await assertErrorResponse(response, 403, 'No autorizado')
  })

  it('debe eliminar notificación correctamente', async () => {
    setupAuthenticatedSession()
    const notification = createNotification()
    setupNotificationMock(notification)
    setupNotificationDeleteMock()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithNotificationId(undefined, { method: 'DELETE' })
    const response = await DELETE(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.success).toBe(true)
    expect(vi.mocked(prisma.notification.delete)).toHaveBeenCalledWith({
      where: { id: TEST_IDS.ATTEMPT },
    })
  })
})

