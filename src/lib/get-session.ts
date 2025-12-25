import { auth } from '@/lib/auth'
import { prisma } from './prisma'
import type { User, Student } from '@prisma/client'

export async function getSession() {
  return await auth()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

export async function getCurrentStudentId() {
  const session = await getSession()
  return session?.user?.studentId || null
}

/**
 * Obtiene el usuario de la base de datos con su estudiante asociado
 * Helper para eliminar duplicación de código en múltiples endpoints
 * @param userEmail - Email del usuario de la sesión
 * @returns Usuario con student incluido o null si no existe
 */
export async function getDbUserWithStudent(
  userEmail: string | null | undefined
): Promise<(User & { student: Student | null }) | null> {
  if (!userEmail) {
    return null
  }

  return await prisma.user.findUnique({
    where: { email: userEmail },
    include: { student: true },
  })
}

/**
 * Obtiene el usuario autenticado con su estudiante de la base de datos
 * Helper que combina getCurrentUser y getDbUserWithStudent
 * @returns Usuario con student o null si no está autenticado
 */
export async function getAuthenticatedUserWithStudent(): Promise<
  (User & { student: Student | null }) | null
> {
  const user = await getCurrentUser()
  if (!user?.email) {
    return null
  }

  return await getDbUserWithStudent(user.email)
}
