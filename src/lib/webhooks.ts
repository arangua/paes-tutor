/**
 * Sistema de webhooks para eventos de versiones
 * 
 * Permite a los usuarios suscribirse a eventos relacionados con versiones
 * y recibir notificaciones en URLs externas cuando ocurren estos eventos.
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import crypto from 'node:crypto'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'

export type VersionEvent =
  | 'version.created'
  | 'version.restored'
  | 'version.updated'
  | 'version.deleted'
  | 'version.marked_important'
  | 'version.named'

export interface WebhookPayload {
  event: VersionEvent
  timestamp: string
  data: {
    noteId: string
    noteTitle: string
    versionId: string
    versionTitle: string
    versionName?: string | null
    isImportant?: boolean
    createdAt: string
    [key: string]: unknown
  }
}

/**
 * Dispara webhooks para un evento específico
 */
export async function triggerWebhooks(
  event: VersionEvent,
  data: WebhookPayload['data'],
  noteId?: string
): Promise<void> {
  try {
    // Buscar webhooks activos que escuchan este evento
    const webhooks = await prisma.webhook.findMany({
      where: {
        active: true,
        ...(noteId && { 
          OR: [
            { noteId },
            { noteId: null },
          ],
        }), // Webhooks específicos o globales
      },
    })

    // Filtrar webhooks que escuchan este evento específico
    const relevantWebhooks = webhooks.filter((webhook) => {
      try {
        const events = JSON.parse(webhook.events) as string[]
        return events.includes(event) || events.includes('*') // '*' escucha todos los eventos
      } catch {
        return false
      }
    })

    if (relevantWebhooks.length === 0) {
      return
    }

    // Crear payload
    const payload: WebhookPayload = {
      event,
      timestamp: safeToISOString(new Date()),
      data,
    }

    // Disparar webhooks en paralelo (sin esperar respuesta)
    const deliveries = relevantWebhooks.map((webhook) =>
      deliverWebhook(webhook, payload)
    )

    // Ejecutar en paralelo sin bloquear
    Promise.all(deliveries).catch((error) => {
      logger.error({ error }, 'Error al disparar webhooks')
    })
  } catch (error) {
    logger.error({ error, event }, 'Error al buscar webhooks para evento')
  }
}

/**
 * Entrega un webhook a una URL específica
 */
async function deliverWebhook(
  webhook: { id: string; url: string; secret: string | null },
  payload: WebhookPayload
): Promise<void> {
  try {
    // Firmar payload si hay secret
    const signature = webhook.secret
      ? generateSignature(JSON.stringify(payload), webhook.secret)
      : null

    // Realizar petición HTTP
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PAES-Tutor-Webhooks/1.0',
        ...(signature && { 'X-Webhook-Signature': signature }),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // Timeout de 10 segundos
    })

    const responseText = await response.text().catch(() => 'No response body')

    // Guardar delivery en base de datos
    await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event: payload.event,
        payload: JSON.stringify(payload),
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        response: responseText.substring(0, 1000), // Limitar tamaño
        attempts: 1,
        lastAttempt: new Date(),
        ...(response.ok && { deliveredAt: new Date() }),
        ...(!response.ok && {
          nextRetry: new Date(Date.now() + 5 * 60 * 1000), // Reintentar en 5 minutos
        }),
      },
    })

    if (!response.ok) {
      logger.warn(
        {
          webhookId: webhook.id,
          url: webhook.url,
          status: response.status,
          event: payload.event,
        },
        'Webhook falló'
      )
    }
  } catch (error) {
    // Guardar delivery fallido
    await prisma.webhookDelivery
      .create({
        data: {
          webhookId: webhook.id,
          event: payload.event,
          payload: JSON.stringify(payload),
          status: 'failed',
          statusCode: null,
          response:
            error instanceof Error ? error.message.substring(0, 1000) : String(error),
          attempts: 1,
          lastAttempt: new Date(),
          nextRetry: new Date(Date.now() + 5 * 60 * 1000), // Reintentar en 5 minutos
        },
      })
      .catch((dbError) => {
        logger.error({ error: dbError }, 'Error al guardar delivery fallido')
      })

    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        webhookId: webhook.id,
        url: webhook.url,
        event: payload.event,
      },
      'Error al entregar webhook'
    )
  }
}

/**
 * Genera una firma HMAC para el payload
 */
function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Verifica la firma de un webhook (para uso en el servidor receptor)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(payload, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Reintenta webhooks fallidos
 */
export async function retryFailedWebhooks(): Promise<void> {
  try {
    const failedDeliveries = await prisma.webhookDelivery.findMany({
      where: {
        status: 'failed',
        nextRetry: { lte: new Date() },
        attempts: { lt: 5 }, // Máximo 5 intentos
      },
      include: {
        webhook: {
          select: {
            id: true,
            url: true,
            secret: true,
            active: true,
          },
        },
      },
      take: 50, // Procesar máximo 50 a la vez
    })

    for (const delivery of failedDeliveries) {
      if (!delivery.webhook.active) {
        continue
      }

      try {
        // Validar que el payload es JSON válido
        JSON.parse(delivery.payload) as WebhookPayload

        const signature = delivery.webhook.secret
          ? generateSignature(delivery.payload, delivery.webhook.secret)
          : null

        const response = await fetch(delivery.webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'PAES-Tutor-Webhooks/1.0',
            ...(signature && { 'X-Webhook-Signature': signature }),
          },
          body: delivery.payload,
          signal: AbortSignal.timeout(10000),
        })

        const responseText = await response.text().catch(() => 'No response body')

        await prisma.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            status: response.ok ? 'success' : 'failed',
            statusCode: response.status,
            response: responseText.substring(0, 1000),
            attempts: { increment: 1 },
            lastAttempt: new Date(),
            ...(response.ok && { deliveredAt: new Date() }),
            ...(!response.ok && {
              nextRetry:
                delivery.attempts < 4
                  ? new Date(Date.now() + Math.pow(2, delivery.attempts) * 60 * 1000) // Backoff exponencial
                  : null, // No más reintentos después de 5 intentos
            }),
          },
        })
      } catch (error) {
        await prisma.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            attempts: { increment: 1 },
            lastAttempt: new Date(),
            nextRetry:
              delivery.attempts < 4
                ? new Date(Date.now() + Math.pow(2, delivery.attempts) * 60 * 1000)
                : null,
          },
        })

        logger.error(
          {
            error: error instanceof Error ? error.message : String(error),
            deliveryId: delivery.id,
          },
          'Error al reintentar webhook'
        )
      }
    }
  } catch (error) {
    logger.error({ error }, 'Error al procesar reintentos de webhooks')
  }
}

