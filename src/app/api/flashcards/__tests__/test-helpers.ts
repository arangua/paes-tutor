/**
 * Test Helpers Enterprise para API de Flashcards
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS as BOOKMARKS_TEST_IDS,
  createUserWithStudent,
} from '@/app/api/bookmarks/__tests__/test-helpers'

// Extender TEST_IDS con IDs adicionales para flashcards
export const TEST_IDS = {
  ...BOOKMARKS_TEST_IDS,
  ATTEMPT: 'c555555555555555555555555',
  FLASHCARD: 'cffffffffffffffffffffffff',
}
import type { Flashcard, Question, Student, User } from '@prisma/client'

export function createFlashcard(options: {
  id?: string
  studentId?: string
  questionId?: string | null
  front?: string
  back?: string
  difficulty?: number
  easeFactor?: number
  interval?: number
  reviewCount?: number
  lastReview?: Date
  nextReview?: Date
} = {}): Flashcard {
  const now = new Date()
  return {
    id: options.id ?? 'cflashcard12345678901234',
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    questionId: options.questionId ?? null,
    front: options.front ?? 'Front text',
    back: options.back ?? 'Back text',
    difficulty: options.difficulty ?? 2.5,
    easeFactor: options.easeFactor ?? 2.5,
    interval: options.interval ?? 1,
    reviewCount: options.reviewCount ?? 0,
    lastReview: options.lastReview ?? now,
    nextReview: options.nextReview ?? now,
    createdAt: now,
    updatedAt: now,
  } as Flashcard
}

export function setupAuthenticatedUserWithStudent(
  user: User & { student: Student | null } | null = createUserWithStudent()
): void {
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(user)
}

export function setupUnauthenticatedUser(): void {
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(null)
}

export function setupFlashcardsMock(flashcards: Flashcard[] = []): void {
  vi.mocked(prisma.flashcard.findMany).mockResolvedValue(flashcards as any)
}

export function setupFlashcardCountMock(count: number = 0): void {
  vi.mocked(prisma.flashcard.count).mockResolvedValue(count)
}

export function setupFlashcardMock(flashcard: Flashcard | null): void {
  vi.mocked(prisma.flashcard.findFirst).mockResolvedValue(flashcard as any)
}

export function setupFlashcardCreateMock(flashcard: Flashcard): void {
  vi.mocked(prisma.flashcard.create).mockResolvedValue(flashcard as any)
}

export function setupFlashcardUpdateMock(flashcard: Flashcard): void {
  vi.mocked(prisma.flashcard.update).mockResolvedValue(flashcard as any)
}

export function setupFlashcardDeleteMock(): void {
  vi.mocked(prisma.flashcard.delete).mockResolvedValue({} as any)
}

export function setupQuestionMock(question: Question | null): void {
  vi.mocked(prisma.question.findUnique).mockResolvedValue(question as any)
}

// Re-exportar funciones y constantes necesarias (TEST_IDS ya está exportado arriba)
export { createUserWithStudent, createTestRequest, assertSuccessResponse, assertErrorResponse } from '@/app/api/bookmarks/__tests__/test-helpers'

