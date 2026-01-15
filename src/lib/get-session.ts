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
 * 
 * Contract:
 * - Returns User | null
 * - Never returns undefined
 * - Safe to use directly in API routes
 * 
 * @returns Usuario con student o null si no está autenticado
 */
export async function getAuthenticatedUserWithStudent(): Promise<
  (User & { student: Student | null }) | null
> {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return null
    }

    // Caso: sin email => null (esto calza con tu test)
    if (!session.user.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true },
    })

    if (!user) {
      return null
    }

    // Si existe usuario aunque student sea null, retorna el usuario
    return user
  } catch (err) {
    return null
  }
}
