/**
 * Utilidades para verificar permisos de administrador
 */

import { getCurrentUser } from './get-session'
import { prisma } from './prisma'

export type UserRole = 'student' | 'admin' | 'teacher'

/**
 * Verifica si el usuario actual es administrador
 * @returns true si el usuario es admin, false en caso contrario
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    return fullUser?.role === 'admin'
  } catch {
    return false
  }
}

/**
 * Verifica si el usuario actual tiene un rol específico
 * @param role - Rol a verificar
 * @returns true si el usuario tiene el rol, false en caso contrario
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    return fullUser?.role === role
  } catch {
    return false
  }
}

/**
 * Verifica si el usuario actual tiene al menos uno de los roles especificados
 * @param roles - Array de roles a verificar
 * @returns true si el usuario tiene al menos uno de los roles, false en caso contrario
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!fullUser?.role) return false
    return roles.includes(fullUser.role as UserRole)
  } catch {
    return false
  }
}

/**
 * Obtiene el rol del usuario actual
 * @returns El rol del usuario o null si no está autenticado
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    return (fullUser?.role as UserRole) || 'student'
  } catch {
    return null
  }
}
