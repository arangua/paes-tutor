/**
 * Test Helpers Enterprise para API de Challenges
 * 
 * @module test-helpers
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { CHALLENGE_STATUS } from '@/lib/challenge-constants'
import {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
} from '@/app/api/bookmarks/__tests__/test-helpers'
import type { Challenge, Exam, Student, User } from '@prisma/client'
import { setupAuthenticated, setupUnauthenticated } from './auth-mock'

/**
 * Factory para crear un User con Student para tests
 */
export function createUserWithStudent(options: {
  email?: string
  studentId?: string
  studentName?: string
} = {}): User & { student: Student | null } {
  return {
    id: 'user-1',
    email: options.email ?? DEFAULT_TEST_VALUES.EMAIL,
    emailVerified: null,
    image: null,
    name: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: options.studentId ?? TEST_IDS.STUDENT,
      nombre: options.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME,
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as User & { student: Student | null }
}

export interface ChallengeWithRelations extends Challenge {
  exam?: Exam | null
  challenger?: Student & { user?: { email: string } }
  challenged?: Student & { user?: { email: string } }
}

export function createChallenge(options: {
  id?: string
  examId?: string | null
  challengerId?: string
  challengedId?: string
  status?: string
  message?: string | null
  deadline?: Date | null
} = {}): Challenge {
  return {
    id: options.id ?? 'cchallenge123456789012345',
    examId: options.examId ?? null,
    challengerId: options.challengerId ?? TEST_IDS.STUDENT,
    challengedId: options.challengedId ?? TEST_IDS.STUDENT_2,
    status: options.status ?? CHALLENGE_STATUS.PENDING,
    message: options.message ?? null,
    deadline: options.deadline ?? null,
    challengerAttemptId: null,
    challengedAttemptId: null,
    winnerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptedAt: null,
    completedAt: null,
  } as Challenge
}

export function setupAuthenticatedUserWithStudent(
  user: User & { student: Student | null } | null = createUserWithStudent()
): void {
  setupAuthenticated(user)
}

export function setupUnauthenticatedUser(): void {
  setupUnauthenticated()
}

export function setupChallengesMock(challenges: ChallengeWithRelations[] = []): void {
  vi.mocked(prisma.challenge.findMany).mockResolvedValue(challenges as any)
}

export function setupExamMock(exam: Exam | null): void {
  vi.mocked(prisma.exam.findUnique).mockResolvedValue(exam as any)
}

export function setupStudentsMock(students: Student[] = []): void {
  vi.mocked(prisma.student.findMany).mockResolvedValue(students as any)
}

export function setupChallengeCreateMock(challenge: ChallengeWithRelations): void {
  vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
    return await callback({
      challenge: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(challenge),
      },
    })
  })
}

export function setupChallengeCreateConflictMock(): void {
  vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
    await callback({
      challenge: {
        findFirst: vi.fn().mockResolvedValue(createChallenge()),
        create: vi.fn(),
      },
    })
    throw new Error('Ya existe un desafío activo para este examen')
  })
}

// ✅ Enterprise: Re-exportar funciones y constantes necesarias
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
export {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
} from '@/app/api/bookmarks/__tests__/test-helpers'
export { createTestRequest, assertSuccessResponse, assertErrorResponse }
// createUserWithStudent está definido localmente arriba, no necesita re-exportarse

