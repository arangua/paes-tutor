import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { validateBody } from '@/lib/api-helpers'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Especificar Node.js runtime
export const runtime = 'nodejs'

// Schema de validación para cambiar contraseña
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña es demasiado larga')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export async function PUT(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('PUT', '/api/user/password')
      const user = await getCurrentUser()

      if (!user) {
        const { logSecurityEvent, getClientIp } = await import('@/lib/security-logger')
        logSecurityEvent({
          type: 'unauthorized_access',
          ip: getClientIp(request),
          path: '/api/user/password',
          severity: 'high',
        })
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar body
      const validation = await validateBody(request, changePasswordSchema)
      if (!validation.success) {
        return validation.error
      }

      const { currentPassword, newPassword } = validation.data

      // Obtener usuario con contraseña
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          password: true,
        },
      })

      if (!fullUser) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }

      // Verificar que el usuario tenga contraseña (no es OAuth)
      if (!fullUser.password) {
        return NextResponse.json(
          { error: 'Este usuario no tiene contraseña configurada (probablemente usa OAuth)' },
          { status: 400 }
        )
      }

      // Verificar contraseña actual
      const isPasswordValid = await bcrypt.compare(currentPassword, fullUser.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
      }

      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = await bcrypt.compare(newPassword, fullUser.password)
      if (isSamePassword) {
        return NextResponse.json(
          { error: 'La nueva contraseña debe ser diferente a la actual' },
          { status: 400 }
        )
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Actualizar contraseña
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      })

      return NextResponse.json({ message: 'Contraseña actualizada exitosamente' })
    } catch (error) {
      return handleApiError(error, 'Error al cambiar contraseña', {
        path: '/api/user/password',
      })
    }
  })
}
