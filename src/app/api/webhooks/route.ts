import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStudentId } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import type { VersionEvent } from '@/lib/webhooks'
import { safeToISOString } from '../notes/versions/validation-utils' // guard:allow-secret

export const runtime = 'nodejs'

/**
 * Valida que la URL use HTTPS en producción
 */
function validateWebhookUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // En producción, solo permitir HTTPS
    if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
      return false
    }
    // Permitir http:// solo en desarrollo
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
  } catch {
    return false
  }
}

const createWebhookSchema = z.object({
  url: z
    .url({ error: 'URL inválida' })
    .max(2048, 'La URL no puede exceder 2048 caracteres')
    .refine(validateWebhookUrl, {
      message: process.env.NODE_ENV === 'production' 
        ? 'Solo se permiten URLs HTTPS en producción'
        : 'URL inválida',
    }),
  secret: z
    .string()
    .max(256, 'El secreto no puede exceder 256 caracteres')
    .optional(),
  events: z
    .array(z.string())
    .min(1, 'Debe especificar al menos un evento')
    .max(20, 'No se pueden especificar más de 20 eventos'),
  noteId: z.cuid({ error: 'noteId debe ser un CUID válido' }).optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
})

const updateWebhookSchema = z.object({
  url: z
    .url({ error: 'URL inválida' })
    .max(2048, 'La URL no puede exceder 2048 caracteres')
    .refine(validateWebhookUrl, {
      message: process.env.NODE_ENV === 'production' 
        ? 'Solo se permiten URLs HTTPS en producción'
        : 'URL inválida',
    })
    .optional(),
  secret: z
    .string()
    .max(256, 'El secreto no puede exceder 256 caracteres')
    .optional()
    .nullable(),
  events: z
    .array(z.string())
    .min(1)
    .max(20, 'No se pueden especificar más de 20 eventos')
    .optional(),
  active: z.boolean().optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .nullable(),
})

/**
 * GET: Listar webhooks del estudiante
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const noteId = searchParams.get('noteId')

      const webhooks = await prisma.webhook.findMany({
        where: {
          studentId,
          ...(noteId && { noteId: { in: [noteId, null] } }), // Específicos o globales
        },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { deliveries: true },
          },
        },
      })

      // Obtener estadísticas de deliveries recientes
      const webhooksWithStats = await Promise.all(
        webhooks.map(async (webhook) => {
          const recentDeliveries = await prisma.webhookDelivery.findMany({
            where: { webhookId: webhook.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              status: true,
              statusCode: true,
              createdAt: true,
            },
          })

          const successCount = recentDeliveries.filter((d) => d.status === 'success').length
          const failureCount = recentDeliveries.filter((d) => d.status === 'failed').length

          let parsedEvents: string[] = []
          try {
            if (webhook.events && typeof webhook.events === 'string') {
              parsedEvents = JSON.parse(webhook.events) as string[]
              if (!Array.isArray(parsedEvents)) {
                logger.warn({ webhookId: webhook.id, events: webhook.events }, 'webhook.events no es un array válido')
                parsedEvents = []
              }
            }
          } catch (error) {
            logger.warn({ error, webhookId: webhook.id, events: webhook.events }, 'Error al parsear webhook.events')
            parsedEvents = []
          }

          const safeCreatedAt = safeToISOString(webhook.createdAt)
          const safeUpdatedAt = safeToISOString(webhook.updatedAt)
          
          return {
            id: webhook.id,
            url: webhook.url,
            events: parsedEvents,
            active: webhook.active,
            noteId: webhook.noteId,
            description: webhook.description,
            createdAt: safeCreatedAt,
            updatedAt: safeUpdatedAt,
            totalDeliveries: webhook._count.deliveries,
            recentStats: {
              success: successCount,
              failed: failureCount,
              total: recentDeliveries.length,
            },
          }
        })
      )

      return NextResponse.json({ webhooks: webhooksWithStats })
    } catch (error) {
      logger.error({ error, context: 'webhooks/GET' }, 'Error al listar webhooks')
      return NextResponse.json({ error: 'Error al listar webhooks' }, { status: 500 })
    }
  })
}

/**
 * POST: Crear un nuevo webhook
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = createWebhookSchema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.issues },
          { status: 400 }
        )
      }

      const { url, secret, events, noteId, description } = validation.data

      // Verificar que la nota pertenece al estudiante si se especifica
      if (noteId) {
        const note = await prisma.studyNote.findFirst({
          where: { id: noteId, studentId },
        })

        if (!note) {
          return NextResponse.json(
            { error: 'Nota no encontrada' },
            { status: 404 }
          )
        }
      }

      // Validar eventos
      const validEvents: VersionEvent[] = [
        'version.created',
        'version.restored',
        'version.updated',
        'version.deleted',
        'version.marked_important',
        'version.named',
      ]

      const invalidEvents = events.filter(
        (e) => e !== '*' && !validEvents.includes(e as VersionEvent)
      )

      if (invalidEvents.length > 0) {
        return NextResponse.json(
          {
            error: 'Eventos inválidos',
            details: `Eventos no válidos: ${invalidEvents.join(', ')}`,
            validEvents: [...validEvents, '*'],
          },
          { status: 400 }
        )
      }

      // CORRECCIÓN: Validar que events sea válido antes de usar JSON.stringify()
      let eventsString = '[]'
      try {
        if (Array.isArray(events) && events.length > 0) {
          const stringified = JSON.stringify(events)
          eventsString = typeof stringified === 'string' && stringified.length > 0 ? stringified : '[]'
        } else if (Array.isArray(events)) {
          eventsString = '[]'
        }
      } catch (error) {
        logger.warn({ error, events }, 'webhooks/POST: Error al serializar events, usando array vacío')
        eventsString = '[]'
      }

      const webhook = await prisma.webhook.create({
        data: {
          studentId,
          url,
          secret: secret || null,
          events: eventsString,
          noteId: noteId || null,
          description: description || null,
        },
      })

      let parsedEvents: string[] = []
      try {
        if (webhook.events && typeof webhook.events === 'string') {
          parsedEvents = JSON.parse(webhook.events) as string[]
          if (!Array.isArray(parsedEvents)) {
            logger.warn({ webhookId: webhook.id, events: webhook.events }, 'webhook.events no es un array válido en POST')
            parsedEvents = []
          }
        }
      } catch (error) {
        logger.warn({ error, webhookId: webhook.id, events: webhook.events }, 'Error al parsear webhook.events en POST')
        parsedEvents = []
      }

      const safeCreatedAt = safeToISOString(webhook.createdAt)
      const safeUpdatedAt = safeToISOString(webhook.updatedAt)
      
      return NextResponse.json(
        {
          webhook: {
            id: webhook.id,
            url: webhook.url,
            events: parsedEvents,
            active: webhook.active,
            noteId: webhook.noteId,
            description: webhook.description,
            createdAt: safeCreatedAt,
            updatedAt: safeUpdatedAt,
          },
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error({ error, context: 'webhooks/POST' }, 'Error al crear webhook')
      return NextResponse.json({ error: 'Error al crear webhook' }, { status: 500 })
    }
  })
}

/**
 * PATCH: Actualizar un webhook
 */
export async function PATCH(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const { id, ...updateData } = body

      if (!id) {
        return NextResponse.json({ error: 'ID de webhook requerido' }, { status: 400 })
      }

      const validation = updateWebhookSchema.safeParse(updateData)

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.issues },
          { status: 400 }
        )
      }

      // Verificar que el webhook pertenece al estudiante
      const existingWebhook = await prisma.webhook.findFirst({
        where: { id, studentId },
      })

      if (!existingWebhook) {
        return NextResponse.json({ error: 'Webhook no encontrado' }, { status: 404 })
      }

      // Validar eventos si se proporcionan
      if (validation.data.events) {
        const validEvents: VersionEvent[] = [
          'version.created',
          'version.restored',
          'version.updated',
          'version.deleted',
          'version.marked_important',
          'version.named',
        ]

        const invalidEvents = validation.data.events.filter(
          (e) => e !== '*' && !validEvents.includes(e as VersionEvent)
        )

        if (invalidEvents.length > 0) {
          return NextResponse.json(
            {
              error: 'Eventos inválidos',
              details: `Eventos no válidos: ${invalidEvents.join(', ')}`,
              validEvents: [...validEvents, '*'],
            },
            { status: 400 }
          )
        }
      }

      const updatePayload: {
        url?: string
        secret?: string | null
        events?: string
        active?: boolean
        description?: string | null
      } = {}

      if (validation.data.url) updatePayload.url = validation.data.url
      if (validation.data.secret !== undefined) updatePayload.secret = validation.data.secret
      if (validation.data.events) {
        // CORRECCIÓN: Validar que validation.data.events sea válido antes de usar JSON.stringify()
        try {
          if (Array.isArray(validation.data.events) && validation.data.events.length > 0) {
            const stringified = JSON.stringify(validation.data.events)
            updatePayload.events = typeof stringified === 'string' && stringified.length > 0 ? stringified : '[]'
          } else if (Array.isArray(validation.data.events)) {
            updatePayload.events = '[]'
          }
        } catch (error) {
          logger.warn({ error, events: validation.data.events }, 'webhooks/PATCH: Error al serializar events, usando array vacío')
          updatePayload.events = '[]'
        }
      }
      if (validation.data.active !== undefined) updatePayload.active = validation.data.active
      if (validation.data.description !== undefined)
        updatePayload.description = validation.data.description

      const webhook = await prisma.webhook.update({
        where: { id },
        data: updatePayload,
      })

      let parsedEvents: string[] = []
      try {
        if (webhook.events && typeof webhook.events === 'string') {
          parsedEvents = JSON.parse(webhook.events) as string[]
          if (!Array.isArray(parsedEvents)) {
            logger.warn({ webhookId: webhook.id, events: webhook.events }, 'webhook.events no es un array válido en PATCH')
            parsedEvents = []
          }
        }
      } catch (error) {
        logger.warn({ error, webhookId: webhook.id, events: webhook.events }, 'Error al parsear webhook.events en PATCH')
        parsedEvents = []
      }

      const safeCreatedAt = safeToISOString(webhook.createdAt)
      const safeUpdatedAt = safeToISOString(webhook.updatedAt)

      return NextResponse.json({
        webhook: {
          id: webhook.id,
          url: webhook.url,
          events: parsedEvents,
          active: webhook.active,
          noteId: webhook.noteId,
          description: webhook.description,
          createdAt: safeCreatedAt,
          updatedAt: safeUpdatedAt,
        },
      })
    } catch (error) {
      logger.error({ error, context: 'webhooks/PATCH' }, 'Error al actualizar webhook')
      return NextResponse.json(
        { error: 'Error al actualizar webhook' },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE: Eliminar un webhook
 */
export async function DELETE(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')

      if (!id) {
        return NextResponse.json({ error: 'ID de webhook requerido' }, { status: 400 })
      }

      // Verificar que el webhook pertenece al estudiante
      const webhook = await prisma.webhook.findFirst({
        where: { id, studentId },
      })

      if (!webhook) {
        return NextResponse.json({ error: 'Webhook no encontrado' }, { status: 404 })
      }

      await prisma.webhook.delete({
        where: { id },
      })

      return NextResponse.json({ message: 'Webhook eliminado correctamente' })
    } catch (error) {
      logger.error({ error, context: 'webhooks/DELETE' }, 'Error al eliminar webhook')
      return NextResponse.json(
        { error: 'Error al eliminar webhook' },
        { status: 500 }
      )
    }
  })
}

