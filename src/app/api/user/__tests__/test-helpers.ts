/**
 * Test Helpers Enterprise para API de User
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { validateBody } from '@/lib/api-helpers'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { User, Student } from '@prisma/client'

export function createUser(options: {
  id?: string
  name?: string
  email?: string
  emailVerified?: Date | null
  image?: string | null
} = {}): User {
  return {
    id: options.id ?? TEST_IDS.USER,
    name: options.name ?? 'Test User',
    email: options.email ?? 'test@example.com',
    emailVerified: options.emailVerified ?? null,
    image: options.image ?? null,
    createdAt: new Date(),
  } as User
}

export function createUserWithStudent(options: {
  user?: Partial<User>
  student?: Partial<Student>
} = {}): User & { student?: Student | null } {
  const user = createUser(options.user)
  return {
    ...user,
    student: options.student
      ? ({
          id: options.student.id ?? TEST_IDS.STUDENT,
          nombre: options.student.nombre ?? 'Test Student',
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Student)
      : null,
  } as User & { student?: Student | null }
}

export function setupAuthenticatedUser(user: User | null = createUser()): void {
  vi.mocked(getCurrentUser).mockResolvedValue(user as any)
}

export function setupUnauthenticatedUser(): void {
  vi.mocked(getCurrentUser).mockResolvedValue(null)
}

export function setupUserMock(user: User & { student?: Student | null } | null): void {
  vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any)
}

export function setupUserUpdateMock(user: User): void {
  vi.mocked(prisma.user.update).mockResolvedValue(user as any)
}

export function setupStudentMock(student: Student | null): void {
  vi.mocked(prisma.student.findUnique).mockResolvedValue(student as any)
}

export function setupStudentUpdateMock(student: Student): void {
  vi.mocked(prisma.student.update).mockResolvedValue(student as any)
}

export function setupTransactionMock(callback: (tx: any) => Promise<any>): void {
  vi.mocked(prisma.$transaction).mockImplementation(async (_fn: any) => {
    // Crear objeto tx con los métodos mockeados
    const tx = {
      user: {
        update: vi.fn(),
      },
      student: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    }
    // Configurar los mocks según el callback (esto configura tx.user.update, etc.)
    const expectedResult = await callback(tx)
    // Ejecutar la función de transacción con el tx mockeado
    // La función fn recibirá el tx y usará tx.user.update, etc.
    // Retornar el resultado esperado del callback
    return expectedResult
  })
}

export function setupValidateBodySuccess(data: { name?: string; email?: string }): void {
  vi.mocked(validateBody).mockResolvedValue({
    success: true,
    data,
  } as any)
}

export function setupValidateBodyError(error: Response): void {
  vi.mocked(validateBody).mockResolvedValue({
    success: false,
    error,
  } as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

