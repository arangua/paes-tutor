import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { validateBody } from '@/lib/api-helpers'
import { z } from 'zod'
import { invalidateCachePattern } from '@/lib/cache'

// Especificar Node.js runtime
export const runtime = 'nodejs'

// Schema de validación para actualizar usuario
const updateUserSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
  })
  .refine(data => data.name !== undefined || data.email !== undefined, {
    message: 'Debe proporcionar al menos un campo para actualizar',
  })

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('GET', '/api/user')
      const user = await getCurrentUser()

      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Obtener usuario completo con estudiante
      // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      })

      if (!fullUser) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }

      return NextResponse.json(fullUser)
    } catch (error) {
      return handleApiError(error, 'Error al obtener información del usuario', {
        path: '/api/user',
      })
    }
  })
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('PUT', '/api/user')
      const user = await getCurrentUser()

      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar body
      const validation = await validateBody(request, updateUserSchema)
      if (!validation.success) {
        return validation.error
      }

      const { name, email } = validation.data

      // Verificar si el email ya está en uso por otro usuario
      if (email && email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        })

        if (existingUser && existingUser.id !== user.id) {
          return NextResponse.json(
            { error: 'Este email ya está en uso por otro usuario' },
            { status: 400 }
          )
        }
      }

      // Usar transacción para garantizar consistencia entre usuario y estudiante
      const updatedUser = await prisma.$transaction(async tx => {
        // Actualizar usuario
        const userResult = await tx.user.update({
          where: { id: user.id },
          data: {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email, emailVerified: null }), // Reset email verification si cambia
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            createdAt: true,
          },
        })

        // Si hay un estudiante asociado y se actualizó el nombre, actualizar también el estudiante
        if (name !== undefined) {
          const student = await tx.student.findUnique({
            where: { userId: user.id },
          })

          if (student) {
            await tx.student.update({
              where: { id: student.id },
              data: { nombre: name },
            })
          }
        }

        return userResult
      })

      // Invalidar cachés después de la transacción (fuera de la transacción para mejor performance)
      if (name !== undefined) {
        const student = await prisma.student.findUnique({
          where: { userId: user.id },
          select: { id: true },
        })

        if (student) {
          await invalidateCachePattern(`student:${student.id}:*`)
        }
      }

      await invalidateCachePattern(`user:${user.id}:*`)

      return NextResponse.json(updatedUser)
    } catch (error) {
      return handleApiError(error, 'Error al actualizar información del usuario', {
        path: '/api/user',
      })
    }
  })
}
