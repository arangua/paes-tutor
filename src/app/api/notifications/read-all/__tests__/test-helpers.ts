/**
 * Test Helpers Enterprise para API de Notifications/Read-All
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import {
  TEST_IDS,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
} from '../../__tests__/test-helpers'

export function setupNotificationUpdateManyMock(count: number = 0): void {
  vi.mocked(prisma.notification.updateMany).mockResolvedValue({ count } as any)
}

export { TEST_IDS, setupAuthenticatedSession, setupUnauthenticatedSession, createTestRequest, assertSuccessResponse, assertErrorResponse }

