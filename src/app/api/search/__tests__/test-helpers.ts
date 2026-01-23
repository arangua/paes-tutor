/**
 * Test Helpers Enterprise para API de Search
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { Exam, StudyMaterial, Topic, Attempt, Subject } from '@prisma/client'

export function createExamForSearch(options: {
  id?: string
  titulo?: string
  descripcion?: string
  subjectId?: string
} = {}): Exam & {
  subject?: Subject | null
  _count?: { questions: number }
} {
  return {
    id: options.id ?? TEST_IDS.EXAM,
    titulo: options.titulo ?? 'Test Exam',
    descripcion: options.descripcion ?? 'Test Description',
    tipo: 'simulacro',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
    subject: {
      id: options.subjectId ?? TEST_IDS.SUBJECT,
      nombre: 'Test Subject',
      codigo: 'TEST',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Subject,
    _count: {
      questions: 10,
    },
  } as Exam & {
    subject?: Subject | null
    _count?: { questions: number }
  }
}

export function createMaterialForSearch(options: {
  id?: string
  titulo?: string
  contenido?: string
  subjectId?: string
  topicId?: string | null
} = {}): StudyMaterial & {
  subject?: Subject | null
  topic?: Topic | null
} {
  return {
    id: options.id ?? 'cmaterial123456789012345',
    titulo: options.titulo ?? 'Test Material',
    contenido: options.contenido ?? 'Test Content',
    fuente: null,
    tipo: 'articulo',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    topicId: options.topicId ?? null,
    createdAt: new Date(),
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
  } as StudyMaterial & {
    subject?: Subject | null
    topic?: Topic | null
  }
}

export function createTopicForSearch(options: {
  id?: string
  nombre?: string
  descripcion?: string
  ejeTematico?: string
  subjectId?: string
} = {}): Topic & {
  subject?: Subject | null
} {
  return {
    id: options.id ?? TEST_IDS.TOPIC,
    nombre: options.nombre ?? 'Test Topic',
    descripcion: options.descripcion ?? 'Test Description',
    ejeTematico: options.ejeTematico ?? 'Test Eje',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
    subject: {
      id: options.subjectId ?? TEST_IDS.SUBJECT,
      nombre: 'Test Subject',
      codigo: 'TEST',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Subject,
  } as Topic & {
    subject?: Subject | null
  }
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupExamsMock(exams: Exam[] = []): void {
  vi.mocked(prisma.exam.findMany).mockResolvedValue(exams as any)
}

export function setupMaterialsMock(materials: StudyMaterial[] = []): void {
  vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(materials as any)
}

export function setupTopicsMock(topics: Topic[] = []): void {
  vi.mocked(prisma.topic.findMany).mockResolvedValue(topics as any)
}

export function setupAttemptsMock(attempts: Attempt[] = []): void {
  vi.mocked(prisma.attempt.findMany).mockResolvedValue(attempts as any)
}

export function setupSubjectsMock(subjects: Subject[] = []): void {
  vi.mocked(prisma.subject.findMany).mockResolvedValue(subjects as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

