/**
 * Test Helpers Enterprise para API de Notifications/[id]
 */

import { vi } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createNotification,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../../__tests__/test-helpers'
import type { Notification } from '@prisma/client'

export function setupNotificationMock(notification: Notification | null): void {
  vi.mocked(prisma.notification.findUnique).mockResolvedValue(notification as any)
}

export function setupNotificationUpdateMock(notification: Notification): void {
  vi.mocked(prisma.notification.update).mockResolvedValue(notification as any)
}

export function setupNotificationDeleteMock(): void {
  vi.mocked(prisma.notification.delete).mockResolvedValue({} as any)
}

export function createTestRequestWithNotificationId(
  notificationId: string = 'cnotification123456789012',
  options: { method?: string; body?: any } = {}
): NextRequest {
  return createTestRequest({
    method: options.method ?? 'PATCH',
    body: options.body,
    baseUrl: `http://localhost/api/notifications/${notificationId}`,
  })
}

export { TEST_IDS, createNotification, setupAuthenticatedSession, setupUnauthenticatedSession, createTestRequest, assertSuccessResponse, assertErrorResponse }

