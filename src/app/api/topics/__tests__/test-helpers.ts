/**
 * Test Helpers Enterprise para API de Topics
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { Topic } from '@prisma/client'

export function createTopic(options: {
  id?: string
  nombre?: string
  ejeTematico?: string
  descripcion?: string
  subjectId?: string
} = {}): Topic {
  return {
    id: options.id ?? TEST_IDS.TOPIC,
    nombre: options.nombre ?? 'Test Topic',
    ejeTematico: options.ejeTematico ?? 'Test Eje',
    descripcion: options.descripcion ?? 'Test Description',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Topic
}

export function setupTopicsMock(topics: Topic[] = []): void {
  vi.mocked(prisma.topic.findMany).mockResolvedValue(topics as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

