/**
 * Test Helpers Enterprise para API de Notifications
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import {
  TEST_IDS,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/app/api/attempts/__tests__/test-helpers'
import type { Notification } from '@prisma/client'

export function createNotification(options: {
  id?: string
  studentId?: string
  type?: string
  title?: string
  message?: string
  read?: boolean
  priority?: string
  expiresAt?: Date | null
  relatedId?: string | null
  relatedType?: string | null
  actionUrl?: string | null
  createdAt?: Date
} = {}): Notification {
  const now = new Date()
  return {
    id: options.id ?? 'cnotification123456789012',
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    type: options.type ?? 'system',
    title: options.title ?? 'Test Notification',
    message: options.message ?? 'Test message',
    read: options.read ?? false,
    priority: options.priority ?? 'normal',
    expiresAt: options.expiresAt ?? null,
    relatedId: options.relatedId ?? null,
    relatedType: options.relatedType ?? null,
    actionUrl: options.actionUrl ?? null,
    createdAt: options.createdAt ?? now,
    updatedAt: now,
  } as Notification
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupNotificationsMock(notifications: Notification[] = []): void {
  vi.mocked(prisma.notification.findMany).mockImplementation(async (args: any) => {
    let filtered = [...notifications]
    
    // Filtrar por studentId si está presente
    if (args?.where?.studentId) {
      filtered = filtered.filter(n => n.studentId === args.where.studentId)
    }
    
    // Filtrar por read si está presente
    if (args?.where?.read !== undefined) {
      filtered = filtered.filter(n => n.read === args.where.read)
    }
    
    // Filtrar por type si está presente
    if (args?.where?.type) {
      filtered = filtered.filter(n => n.type === args.where.type)
    }
    
    // Filtrar por expiración si hay filtro OR con expiresAt
    if (args?.where?.OR && Array.isArray(args.where.OR)) {
      filtered = filtered.filter(n => {
        // Debe cumplir con alguna condición del OR
        return args.where.OR.some((condition: any) => {
          if (condition.expiresAt === null) {
            return n.expiresAt === null
          }
          if (condition.expiresAt?.gt) {
            if (n.expiresAt === null) return false
            const expiresDate = n.expiresAt instanceof Date ? n.expiresAt : new Date(n.expiresAt)
            return expiresDate > condition.expiresAt.gt
          }
          return true
        })
      })
    }
    
    // Aplicar orderBy si está presente
    if (args?.orderBy) {
      const orderBy = args.orderBy
      if (orderBy.createdAt === 'desc') {
        filtered.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
          return dateB.getTime() - dateA.getTime()
        })
      }
    }
    
    // Aplicar take si está presente
    if (args?.take) {
      filtered = filtered.slice(0, args.take)
    }
    
    return filtered as any
  })
}

export function setupNotificationCountMock(count: number = 0): void {
  vi.mocked(prisma.notification.count).mockResolvedValue(count)
}

export function setupNotificationCreateMock(notification: Notification): void {
  vi.mocked(prisma.notification.create).mockResolvedValue(notification as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

