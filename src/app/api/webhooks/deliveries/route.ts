import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStudentId } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const getDeliveriesSchema = z.object({
  webhookId: z.string().min(1),
  status: z.enum(['pending', 'success', 'failed', 'all']).optional().default('all'),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
})

/**
 * GET: Obtener deliveries (historial) de un webhook
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())
      const validation = getDeliveriesSchema.safeParse(queryParams)

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros inválidos', details: validation.error.issues },
          { status: 400 }
        )
      }

      const { webhookId, status, limit, offset } = validation.data

      // Verificar que el webhook pertenece al estudiante
      const webhook = await prisma.webhook.findFirst({
        where: { id: webhookId, studentId },
      })

      if (!webhook) {
        return NextResponse.json({ error: 'Webhook no encontrado' }, { status: 404 })
      }

      const deliveries = await prisma.webhookDelivery.findMany({
        where: {
          webhookId,
          ...(status !== 'all' && { status }),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          event: true,
          status: true,
          statusCode: true,
          response: true,
          attempts: true,
          lastAttempt: true,
          deliveredAt: true,
          createdAt: true,
        },
      })

      const total = await prisma.webhookDelivery.count({
        where: {
          webhookId,
          ...(status !== 'all' && { status }),
        },
      })

      return NextResponse.json({
        deliveries,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    } catch (error) {
      logger.error(
        { error, context: 'webhooks/deliveries/GET' },
        'Error al obtener deliveries'
      )
      return NextResponse.json(
        { error: 'Error al obtener deliveries' },
        { status: 500 }
      )
    }
  })
}

