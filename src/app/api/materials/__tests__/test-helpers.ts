/**
 * Test Helpers Enterprise para API de Materials
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { getCached } from '@/lib/cache'
import { validateQuery } from '@/lib/api-helpers'
import {
  TEST_IDS,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/app/api/attempts/__tests__/test-helpers'
import type { StudyMaterial, Subject, Topic } from '@prisma/client'

export interface StudyMaterialWithRelations extends StudyMaterial {
  subject?: Subject | null
  topic?: Topic | null
}

export function createStudyMaterial(options: {
  id?: string
  subjectId?: string
  topicId?: string | null
  titulo?: string
  contenido?: string
  fuente?: string | null
  tipo?: string
  createdAt?: Date
} = {}): StudyMaterialWithRelations {
  return {
    id: options.id ?? 'cmaterial123456789012345',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    topicId: options.topicId ?? null,
    titulo: options.titulo ?? 'Test Material',
    contenido: options.contenido ?? 'Test Content',
    fuente: options.fuente ?? null,
    tipo: options.tipo ?? 'articulo',
    createdAt: options.createdAt ?? new Date(),
    subject: {
      id: options.subjectId ?? TEST_IDS.SUBJECT,
      nombre: 'Test Subject',
      codigo: 'TEST',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Subject,
    topic: options.topicId
      ? ({
          id: options.topicId,
          nombre: 'Test Topic',
          ejeTematico: 'Test Eje',
          subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Topic)
      : null,
  } as StudyMaterialWithRelations
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupMaterialsMock(materials: StudyMaterialWithRelations[] = []): void {
  vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(materials as any)
}

export function setupMaterialsCountMock(count: number = 0): void {
  vi.mocked(prisma.studyMaterial.count).mockResolvedValue(count)
}

export function setupCacheSuccess(materials: StudyMaterialWithRelations[] | null = null, total: number | null = null): void {
  vi.mocked(getCached).mockImplementation(async (key: string, fetcher: () => Promise<any>) => {
    if (key.includes(':total')) {
      return total !== null ? total : await fetcher()
    }
    return materials !== null ? materials : await fetcher()
  })
}

export function setupValidateQuerySuccess(data: {
  subjectId?: string
  topicId?: string
  tipo?: string
  limit?: number
  offset?: number
}): void {
  vi.mocked(validateQuery).mockReturnValue({
    success: true,
    data: {
      subjectId: data.subjectId,
      topicId: data.topicId,
      tipo: data.tipo,
      limit: data.limit ?? 20,
      offset: data.offset ?? 0,
    },
  } as any)
}

export function setupValidateQueryError(error: Response): void {
  vi.mocked(validateQuery).mockReturnValue({
    success: false,
    error,
  } as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

