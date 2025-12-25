import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * PATCH: Marcar un material compartido como visto
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params

      // Verificar que el material compartido existe y pertenece al usuario
      const sharedMaterial = await prisma.sharedMaterial.findUnique({
        where: { id },
        include: {
          material: true,
        },
      })

      if (!sharedMaterial) {
        return NextResponse.json({ error: 'Material compartido no encontrado' }, { status: 404 })
      }

      if (sharedMaterial.sharedWithId !== dbUser.student.id) {
        return NextResponse.json({ error: 'No tienes permiso para esta acción' }, { status: 403 })
      }

      // Marcar como visto
      const updated = await prisma.sharedMaterial.update({
        where: { id },
        data: {
          viewed: true,
          viewedAt: new Date(),
        },
        include: {
          material: {
            include: {
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
              topic: {
                select: {
                  id: true,
                  nombre: true,
                  ejeTematico: true,
                },
              },
            },
          },
          sharedBy: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      })

      return NextResponse.json({ sharedMaterial: updated })
    } catch (error) {
      logger.error(
        {
          type: 'shared_materials_patch_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al marcar material como visto'
      )
      return NextResponse.json({ error: 'Error al marcar material como visto' }, { status: 500 })
    }
  })
}

/**
 * DELETE: Dejar de compartir un material
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params

      // Verificar que el material compartido existe y fue compartido por el usuario
      const sharedMaterial = await prisma.sharedMaterial.findUnique({
        where: { id },
      })

      if (!sharedMaterial) {
        return NextResponse.json({ error: 'Material compartido no encontrado' }, { status: 404 })
      }

      if (sharedMaterial.sharedById !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'Solo puedes eliminar materiales que compartiste' },
          { status: 403 }
        )
      }

      // Eliminar el compartido
      await prisma.sharedMaterial.delete({
        where: { id },
      })

      return NextResponse.json({ message: 'Material dejó de compartirse' })
    } catch (error) {
      logger.error(
        {
          type: 'shared_materials_delete_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al dejar de compartir material'
      )
      return NextResponse.json({ error: 'Error al dejar de compartir material' }, { status: 500 })
    }
  })
}
