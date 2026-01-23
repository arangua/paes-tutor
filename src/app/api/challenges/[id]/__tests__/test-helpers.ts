/**
 * Test Helpers Enterprise para API de Challenges/[id]
 */

import { vi } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createUserWithStudent,
  createChallenge,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../../__tests__/test-helpers'
import type { Challenge, Attempt, Exam } from '@prisma/client'

export interface ChallengeWithRelations extends Challenge {
  exam?: Exam | null
  challenger?: any
  challenged?: any
  challengerAttempt?: Attempt | null
  challengedAttempt?: Attempt | null
}

export function createChallengeWithRelations(
  options: Partial<ChallengeWithRelations> = {}
): ChallengeWithRelations {
  const baseChallenge = createChallenge({
    id: options.id,
    examId: options.examId,
    challengerId: options.challengerId,
    challengedId: options.challengedId,
    status: options.status,
    message: options.message,
    deadline: options.deadline,
  })
  return {
    ...baseChallenge,
    challengerAttemptId: options.challengerAttemptId ?? baseChallenge.challengerAttemptId ?? null,
    challengedAttemptId: options.challengedAttemptId ?? baseChallenge.challengedAttemptId ?? null,
    winnerId: options.winnerId ?? baseChallenge.winnerId ?? null,
    completedAt: options.completedAt ?? baseChallenge.completedAt ?? null,
    exam: options.exam ?? null,
    challenger: options.challenger ?? { id: TEST_IDS.STUDENT, nombre: 'Challenger' },
    challenged: options.challenged ?? { id: TEST_IDS.STUDENT_2, nombre: 'Challenged' },
    challengerAttempt: options.challengerAttempt ?? null,
    challengedAttempt: options.challengedAttempt ?? null,
  } as ChallengeWithRelations
}

export function createAttempt(options: {
  id?: string
  studentId?: string
  examId?: string
  estado?: string
  porcentaje?: number
} = {}): Attempt {
  return {
    id: options.id ?? TEST_IDS.ATTEMPT,
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    examId: options.examId ?? TEST_IDS.EXAM,
    estado: options.estado ?? 'completado',
    porcentaje: options.porcentaje ?? 80,
    correctas: 8,
    incorrectas: 2,
    omitidas: 0,
    totalPreguntas: 10,
    puntajePaes: null,
    puntajeEstimado: false,
    startedAt: new Date(),
    finishedAt: new Date(),
    duracionSegundos: 600,
    createdAt: new Date(),
    updatedAt: new Date(),
    exam: options.examId ? ({ id: options.examId } as Exam) : undefined,
  } as Attempt
}

export function setupChallengeMock(challenge: ChallengeWithRelations | null): void {
  vi.mocked(prisma.challenge.findUnique).mockResolvedValue(challenge as any)
}

export function setupChallengeUpdateMock(challenge: ChallengeWithRelations): void {
  vi.mocked(prisma.challenge.update).mockResolvedValue(challenge as any)
}

export function setupAttemptMock(attempt: Attempt | null): void {
  vi.mocked(prisma.attempt.findUnique).mockResolvedValue(attempt as any)
}

export function createTestRequestWithChallengeId(
  challengeId: string = 'cchallenge123456789012345',
  options: { method?: string; body?: any } = {}
): NextRequest {
  return createTestRequest({
    method: options.method ?? 'GET',
    body: options.body,
    baseUrl: `http://localhost/api/challenges/${challengeId}`,
  })
}

export { TEST_IDS, createUserWithStudent, setupAuthenticatedUserWithStudent, setupUnauthenticatedUser, createTestRequest, assertSuccessResponse, assertErrorResponse }

