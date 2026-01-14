import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const createNotificationSchema = z.object({
  type: z.enum([
    'recommendation',
    'reminder',
    'achievement',
    'challenge',
    'shared',
    'schedule',
    'system',
  ]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  relatedId: z.string().optional(),
  relatedType: z.enum(['topic', 'exam', 'attempt', 'challenge', 'schedule', 'material']).optional(),
  actionUrl: z.string().url().optional().or(z.literal('')),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  expiresAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const unreadOnly = searchParams.get('unreadOnly') === 'true'
      const limitStr = searchParams.get('limit') || '50'
      const limit = parseInt(limitStr, 10)
      if (isNaN(limit) || limit < 1 || limit > 100) {
        return NextResponse.json(
          { error: 'El límite debe ser un número entre 1 y 100' },
          { status: 400 }
        )
      }
      const type = searchParams.get('type')

      // Construir la consulta where
      const now = new Date()
      const whereClause: {
        studentId: string
        OR?: Array<{ expiresAt: null } | { expiresAt: { gt: Date } }>
        read?: boolean
        type?: string
      } = {
        studentId,
      }

      // Filtrar por expiración: solo notificaciones que no han expirado
      // SQLite puede tener problemas con OR, así que usamos una aproximación diferente
      whereClause.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }]

      if (unreadOnly) {
        whereClause.read = false
      }

      if (type) {
        whereClause.type = type
      }

      // Obtener todas las notificaciones
      let allNotifications
      try {
        // Verificar que el modelo Notification existe
        if (!prisma.notification) {
          throw new Error(
            'Modelo Notification no disponible. Por favor, reinicia el servidor de desarrollo después de ejecutar: npx prisma generate'
          )
        }

        allNotifications = await prisma.notification.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit * 2, // Obtener más para poder ordenar por prioridad
        })
      } catch (dbError) {
        // Log del error de base de datos para depuración
        const dbErrorMessage = dbError instanceof Error ? dbError.message : String(dbError)
        logger.warn(
          {
            type: 'notifications_db_query_fallback',
            error: dbErrorMessage,
            studentId,
          },
          'Error en consulta de notificaciones, intentando consulta simplificada'
        )

        // Si falla con OR, intentar sin filtro de expiración
        try {
          const simpleWhere: any = { studentId }
          if (unreadOnly) {
            simpleWhere.read = false
          }
          if (type) {
            simpleWhere.type = type
          }

          allNotifications = await prisma.notification.findMany({
            where: simpleWhere,
            orderBy: { createdAt: 'desc' },
            take: limit * 2,
          })

          // Filtrar expiradas manualmente
          // CORRECCIÓN: Validar que n.expiresAt sea válido antes de crear Date y comparar
          allNotifications = allNotifications.filter(n => {
            if (!n || typeof n !== 'object') {
              return false
            }
            if (!n.expiresAt) {
              return true // No expira
            }
            try {
              const expiresDate = n.expiresAt instanceof Date ? n.expiresAt : new Date(n.expiresAt)
              if (expiresDate instanceof Date && !Number.isNaN(expiresDate.getTime())) {
                const expiresTime = expiresDate.getTime()
                const nowTime = now instanceof Date && !Number.isNaN(now.getTime()) ? now.getTime() : Date.now()
                return Number.isFinite(expiresTime) && Number.isFinite(nowTime) && expiresTime > nowTime
              }
            } catch {
              // Si falla la comparación, asumir que no expira
              return true
            }
            return true // Si no se puede determinar, incluir la notificación
          })
        } catch (fallbackError) {
          // Si también falla la consulta simplificada, podría ser un problema de conexión
          const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          
          // Si es un error de conexión a la base de datos, retornar array vacío en lugar de error
          if (
            fallbackMessage.includes('Cannot open database') ||
            fallbackMessage.includes('directory does not exist') ||
            fallbackMessage.includes('ENOENT') ||
            fallbackMessage.includes('SQLITE')
          ) {
            logger.warn(
              {
                type: 'notifications_db_unavailable',
                error: fallbackMessage,
                studentId,
              },
              'Base de datos no disponible, retornando notificaciones vacías'
            )
            allNotifications = []
          } else {
            // Para otros errores, relanzar
            throw fallbackError
          }
        }
      }

      // Ordenar por prioridad manualmente (urgent > high > normal > low)
      const priorityOrder: Record<string, number> = {
        urgent: 4,
        high: 3,
        normal: 2,
        low: 1,
      }

      const notifications = allNotifications
        .filter(n => n && typeof n === 'object')
        .sort((a, b) => {
          const safeAPriority = a.priority && typeof a.priority === 'string' ? a.priority : 'normal'
          const safeBPriority = b.priority && typeof b.priority === 'string' ? b.priority : 'normal'
          const priorityDiff = (priorityOrder[safeBPriority] || 0) - (priorityOrder[safeAPriority] || 0)
          if (priorityDiff !== 0) return priorityDiff
          const timeA = (() => {
            if (!a.createdAt) return 0
            try {
              const date = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
              if (date instanceof Date && !Number.isNaN(date.getTime())) {
                const time = date.getTime()
                return Number.isFinite(time) ? time : 0
              }
            } catch {
              // Ignorar errores de fecha
            }
            return 0
          })()
          const timeB = (() => {
            if (!b.createdAt) return 0
            try {
              const date = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
              if (date instanceof Date && !Number.isNaN(date.getTime())) {
                const time = date.getTime()
                return Number.isFinite(time) ? time : 0
              }
            } catch {
              // Ignorar errores de fecha
            }
            return 0
          })()
          const diff = timeB - timeA
          return Number.isFinite(diff) ? diff : 0
        })
        .slice(0, Number.isFinite(limit) && limit > 0 ? limit : 50)

      // Contar no leídas (con manejo de error para OR)
      let unreadCount = 0
      try {
        const nowForCount = new Date()
        unreadCount = await prisma.notification.count({
          where: {
            studentId,
            read: false,
            OR: [{ expiresAt: null }, { expiresAt: { gt: nowForCount } }],
          },
        })
      } catch (countError) {
        const countErrorMessage = countError instanceof Error ? countError.message : String(countError)
        
        // Si es un error de conexión a la base de datos, usar 0 como valor por defecto
        if (
          countErrorMessage.includes('Cannot open database') ||
          countErrorMessage.includes('directory does not exist') ||
          countErrorMessage.includes('ENOENT') ||
          countErrorMessage.includes('SQLITE')
        ) {
          logger.warn(
            {
              type: 'notifications_count_db_unavailable', // guard:allow-secret
              error: countErrorMessage,
              studentId,
            },
            'Base de datos no disponible para contar notificaciones, usando 0'
          )
          unreadCount = 0
        } else {
          // Si falla por otra razón, intentar contar todas y filtrar manualmente
          try {
            const allUnread = await prisma.notification.findMany({
              where: {
                studentId,
                read: false,
              },
            })
            const nowForCount = new Date()
            // CORRECCIÓN: Validar que n.expiresAt sea válido antes de crear Date y comparar
            unreadCount = allUnread.filter(n => {
              if (!n || typeof n !== 'object') {
                return false
              }
              if (!n.expiresAt) {
                return true // No expira
              }
              try {
                const expiresDate = n.expiresAt instanceof Date ? n.expiresAt : new Date(n.expiresAt)
                if (expiresDate instanceof Date && !Number.isNaN(expiresDate.getTime())) {
                  const expiresTime = expiresDate.getTime()
                  const nowTime = nowForCount instanceof Date && !Number.isNaN(nowForCount.getTime()) ? nowForCount.getTime() : Date.now()
                  return Number.isFinite(expiresTime) && Number.isFinite(nowTime) && expiresTime > nowTime
                }
              } catch {
                // Si falla la comparación, asumir que no expira
                return true
              }
              return true // Si no se puede determinar, incluir la notificación
            }).length
          } catch (fallbackCountError) {
            const fallbackCountMessage = fallbackCountError instanceof Error ? fallbackCountError.message : String(fallbackCountError)
            
            // Si también falla el fallback, usar 0
            if (
              fallbackCountMessage.includes('Cannot open database') ||
              fallbackCountMessage.includes('directory does not exist') ||
              fallbackCountMessage.includes('ENOENT') ||
              fallbackCountMessage.includes('SQLITE')
            ) {
              logger.warn(
                {
                  type: 'notifications_count_fallback_failed', // guard:allow-secret
                  error: fallbackCountMessage,
                  studentId,
                },
                'Fallback de conteo también falló, usando 0'
              )
              unreadCount = 0
            } else {
              // Para otros errores, relanzar
              throw fallbackCountError
            }
          }
        }
      }

      return NextResponse.json({
        notifications,
        unreadCount,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined

      logger.error(
        {
          type: 'notifications_get_error',
          error: errorMessage,
          stack: errorStack,
        },
        'Error al obtener notificaciones'
      )

      // En desarrollo, devolver el error completo para debugging
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            error: 'Error al obtener notificaciones',
            details: errorMessage,
            stack: errorStack,
          },
          { status: 500 }
        )
      }

      return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = createNotificationSchema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { expiresAt, ...data } = validation.data

      const notification = await prisma.notification.create({
        data: {
          ...data,
          studentId,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          actionUrl: data.actionUrl || null,
        },
      })

      return NextResponse.json({ notification }, { status: 201 })
    } catch (error) {
      logger.error(
        {
          type: 'notifications_create_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al crear notificación'
      )
      return NextResponse.json({ error: 'Error al crear notificación' }, { status: 500 })
    }
  })
}
