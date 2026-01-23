/**
 * Test Helpers Enterprise para API de Subjects
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { Subject } from '@prisma/client'

export function createSubject(options: {
  id?: string
  nombre?: string
  codigo?: string
  tipo?: string
} = {}): Subject {
  return {
    id: options.id ?? TEST_IDS.SUBJECT,
    nombre: options.nombre ?? 'Test Subject',
    codigo: options.codigo ?? 'TEST',
    tipo: options.tipo ?? 'obligatorio',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Subject
}

export function setupSubjectsMock(subjects: Subject[] = []): void {
  vi.mocked(prisma.subject.findMany).mockResolvedValue(subjects as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

