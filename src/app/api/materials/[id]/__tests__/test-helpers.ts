/**
 * Test Helpers Enterprise para API de Materials/[id]
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/cache'
import {
  TEST_IDS,
  createStudyMaterial,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../../__tests__/test-helpers'
import type { StudyMaterial, Subject, Topic } from '@prisma/client'

export interface StudyMaterialWithRelations extends StudyMaterial {
  subject?: Subject | null
  topic?: Topic | null
}

export function setupMaterialMock(material: StudyMaterialWithRelations | null): void {
  vi.mocked(prisma.studyMaterial.findUnique).mockResolvedValue(material as any)
}

export function setupCacheSuccess(material: StudyMaterialWithRelations | null = null): void {
  vi.mocked(getCached).mockImplementation(async (key: string, fetcher: () => Promise<any>) => {
    if (material !== null) {
      return material
    }
    return await fetcher()
  })
}

export function createTestRequestWithMaterialId(
  materialId: string = 'cmaterial123456789012345',
  options: { method?: string } = {}
): NextRequest {
  return createTestRequest({
    method: options.method ?? 'GET',
    baseUrl: `http://localhost/api/materials/${materialId}`,
  })
}

export { TEST_IDS, createStudyMaterial, setupAuthenticatedSession, setupUnauthenticatedSession, createTestRequest, assertSuccessResponse, assertErrorResponse }

