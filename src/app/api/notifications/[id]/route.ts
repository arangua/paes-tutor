import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params
      const body = await request.json()
      const { read } = body

      // Verificar que la notificación pertenece al estudiante
      const notification = await prisma.notification.findUnique({
        where: { id },
      })

      if (!notification) {
        return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
      }

      if (notification.studentId !== studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      // Actualizar notificación
      const updated = await prisma.notification.update({
        where: { id },
        data: {
          read: read === true,
          readAt: read === true ? new Date() : null,
        },
      })

      return NextResponse.json({ notification: updated })
    } catch (error) {
      logger.error(
        {
          type: 'notifications_update_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al actualizar notificación'
      )
      return NextResponse.json({ error: 'Error al actualizar notificación' }, { status: 500 })
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params

      // Verificar que la notificación pertenece al estudiante
      const notification = await prisma.notification.findUnique({
        where: { id },
      })

      if (!notification) {
        return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
      }

      if (notification.studentId !== studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      await prisma.notification.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      logger.error(
        {
          type: 'notifications_delete_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al eliminar notificación'
      )
      return NextResponse.json({ error: 'Error al eliminar notificación' }, { status: 500 })
    }
  })
}
