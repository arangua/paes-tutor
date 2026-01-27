import { z } from 'zod'
import type { PrismaClient } from '@prisma/client'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'

/**
 * Ajusta esta interfaz según tu auth real.
 * Necesitamos, como mínimo:
 * - userId (string)
 * - studentId (string) o una forma de derivarlo
 * - isAdmin (boolean) opcional
 */
export type CurrentUser = {
  userId: string
  studentId: string | null
  isAdmin?: boolean
}

/**
 * AJUSTAR: Reemplaza esta función por tu mecanismo real (ej: getCurrentUser()).
 * Debe retornar null si no hay sesión.
 */
export async function getCurrentUserOrNull(): Promise<CurrentUser | null> {
  const dbUser = await getAuthenticatedUserWithStudent()
  if (!dbUser) {
    return null
  }

  return {
    userId: dbUser.id,
    studentId: dbUser.student?.id ?? null,
    isAdmin: dbUser.role === 'admin',
  }
}

export const paramsSchema = z.object({
  id: z.string().min(1),
})

export const versionParamsSchema = z.object({
  id: z.string().min(1),
  version: z.coerce.number().int().positive(),
})

export const restoreBodySchema = z.object({
  version: z.number().int().positive(),
  reason: z.string().optional(),
})

export async function requireStudyNoteAccess(prisma: PrismaClient, noteId: string) {
  const user = await getCurrentUserOrNull()
  if (!user) {
    return { ok: false as const, status: 401 as const, message: 'Unauthorized' }
  }

  const note = await prisma.studyNote.findUnique({
    where: { id: noteId },
    select: { id: true, studentId: true },
  })

  if (!note) {
    return { ok: false as const, status: 404 as const, message: 'StudyNote not found' }
  }

  // Admin override (si aplica)
  if (user.isAdmin) {
    return { ok: true as const, status: 200 as const, user, note }
  }

  if (!user.studentId) {
    return { ok: false as const, status: 403 as const, message: 'Forbidden' }
  }

  if (note.studentId !== user.studentId) {
    return { ok: false as const, status: 403 as const, message: 'Forbidden' }
  }

  return { ok: true as const, status: 200 as const, user, note }
}
