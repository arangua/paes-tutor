import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { type } = await request.json().catch(() => ({})) // Opcional: filtrar por tipo

      const where: {
        studentId: string
        read: boolean
        type?: string
      } = {
        studentId,
        read: false,
      }

      if (type) {
        where.type = type
      }

      const result = await prisma.notification.updateMany({
        where,
        data: {
          read: true,
          readAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        count: result.count,
      })
    } catch (error) {
      logger.error(
        {
          type: 'notifications_read_all_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al marcar todas las notificaciones como leídas'
      )
      return NextResponse.json(
        { error: 'Error al marcar todas las notificaciones como leídas' },
        { status: 500 }
      )
    }
  })
}
