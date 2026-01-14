import { NextResponse } from 'next/server'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'

/**
 * Resultado de validación de autenticación
 */
export type AuthValidationResult =
  | { success: true; user: { email: string; student: { id: string } } }
  | { success: false; error: NextResponse }

/**
 * Valida que el usuario esté autenticado y tenga un estudiante asociado
 * 
 * Este helper centraliza el patrón de validación de autenticación que se repite
 * en todos los endpoints de versiones. Retorna un resultado tipado que puede
 * ser usado con destructuring para manejar ambos casos.
 * 
 * @returns Resultado de validación con usuario autenticado o error HTTP
 * 
 * @example
 * ```typescript
 * const authResult = await validateAuthenticatedUser()
 * if (!authResult.success) {
 *   return authResult.error
 * }
 * 
 * const { user } = authResult
 * // user.email y user.student.id están disponibles
 * ```
 */
export async function validateAuthenticatedUser(): Promise<AuthValidationResult> {
  const dbUser = await getAuthenticatedUserWithStudent()
  
  if (!dbUser?.email) {
    return {
      success: false,
      error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    }
  }

  if (!dbUser.student) {
    return {
      success: false,
      error: NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 }),
    }
  }

  return {
    success: true,
    user: {
      email: dbUser.email,
      student: {
        id: dbUser.student.id,
      },
    },
  }
}

/**
 * Resultado de validación de propiedad de nota
 */
export type NoteOwnershipResult =
  | { success: true; note: { id: string; title: string; studentId: string } }
  | { success: false; error: NextResponse }

/**
 * Valida que una nota existe y pertenece al estudiante especificado
 * 
 * Este helper centraliza el patrón de validación de propiedad de nota que se repite
 * en múltiples endpoints. Retorna un resultado tipado con la nota o un error HTTP.
 * 
 * @param noteId - ID de la nota a validar
 * @param studentId - ID del estudiante que debe ser propietario
 * @returns Resultado de validación con la nota o error HTTP
 * 
 * @example
 * ```typescript
 * const noteResult = await validateNoteOwnership(noteId, studentId)
 * if (!noteResult.success) {
 *   return noteResult.error
 * }
 * 
 * const { note } = noteResult
 * // note.id, note.title, note.studentId están disponibles
 * ```
 */
export async function validateNoteOwnership(
  noteId: string,
  studentId: string
): Promise<NoteOwnershipResult> {
  const note = await prisma.studyNote.findFirst({
    where: {
      id: noteId,
      studentId,
    },
    select: {
      id: true,
      title: true,
      studentId: true,
    },
  })

  if (!note) {
    return {
      success: false,
      error: NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 }),
    }
  }

  return {
    success: true,
    note,
  }
}

