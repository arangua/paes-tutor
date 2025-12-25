import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * PATCH: Marcar un examen compartido como visto
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params

      // Verificar que el examen compartido existe y pertenece al usuario
      const sharedExam = await prisma.sharedExam.findUnique({
        where: { id },
        include: {
          exam: true,
        },
      })

      if (!sharedExam) {
        return NextResponse.json({ error: 'Examen compartido no encontrado' }, { status: 404 })
      }

      if (sharedExam.sharedWithId !== dbUser.student.id) {
        return NextResponse.json({ error: 'No tienes permiso para esta acción' }, { status: 403 })
      }

      // Marcar como visto
      const updated = await prisma.sharedExam.update({
        where: { id },
        data: {
          viewed: true,
          viewedAt: new Date(),
        },
        include: {
          exam: {
            include: {
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
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

      return NextResponse.json({ sharedExam: updated })
    } catch (error) {
      logger.error(
        {
          type: 'shared_exams_patch_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al marcar examen como visto'
      )
      return NextResponse.json({ error: 'Error al marcar examen como visto' }, { status: 500 })
    }
  })
}

/**
 * DELETE: Dejar de compartir un examen
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

      // Verificar que el examen compartido existe y fue compartido por el usuario
      const sharedExam = await prisma.sharedExam.findUnique({
        where: { id },
      })

      if (!sharedExam) {
        return NextResponse.json({ error: 'Examen compartido no encontrado' }, { status: 404 })
      }

      if (sharedExam.sharedById !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'Solo puedes eliminar exámenes que compartiste' },
          { status: 403 }
        )
      }

      // Eliminar el compartido
      await prisma.sharedExam.delete({
        where: { id },
      })

      return NextResponse.json({ message: 'Examen dejó de compartirse' })
    } catch (error) {
      logger.error(
        {
          type: 'shared_exams_delete_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al dejar de compartir examen'
      )
      return NextResponse.json({ error: 'Error al dejar de compartir examen' }, { status: 500 })
    }
  })
}
