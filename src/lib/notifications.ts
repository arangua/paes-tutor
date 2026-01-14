/**
 * Utilidades para crear y gestionar notificaciones automáticas
 */

import { prisma } from '@/lib/prisma'
import { ensureInteger, safeDivide } from '@/app/api/notes/versions/validation-utils'

export type NotificationType =
  | 'recommendation'
  | 'reminder'
  | 'achievement'
  | 'challenge'
  | 'shared'
  | 'schedule'
  | 'system'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

interface CreateNotificationParams {
  studentId: string
  type: NotificationType
  title: string
  message: string
  relatedId?: string
  relatedType?: 'topic' | 'exam' | 'attempt' | 'challenge' | 'schedule' | 'material'
  actionUrl?: string
  priority?: NotificationPriority
  expiresAt?: Date
}

/**
 * Crea una notificación para un estudiante
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        studentId: params.studentId,
        type: params.type,
        title: params.title,
        message: params.message,
        relatedId: params.relatedId || null,
        relatedType: params.relatedType || null,
        actionUrl: params.actionUrl || null,
        priority: params.priority || 'normal',
        expiresAt: params.expiresAt || null,
      },
    })

    return notification
  } catch (error) {
    console.error('Error al crear notificación:', error)
    throw error
  }
}

/**
 * Crea notificaciones de recomendación basadas en temas débiles
 */
export async function createRecommendationNotifications(studentId: string) {
  try {
    // Obtener métricas con bajo rendimiento
    const weakMetrics = await prisma.performanceMetric.findMany({
      where: {
        studentId,
        porcentaje: { lt: 50 },
        totalPreguntas: { gte: 3 }, // Al menos 3 preguntas para considerar
      },
      include: {
        topic: {
          include: {
            subject: true,
          },
        },
      },
      take: 5, // Máximo 5 recomendaciones
    })

    const notifications = []

    for (const metric of weakMetrics) {
      // Verificar si ya existe una notificación reciente para este tema
      const existingNotification = await prisma.notification.findFirst({
        where: {
          studentId,
          type: 'recommendation',
          relatedId: metric.topicId,
          relatedType: 'topic',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 días
          },
        },
      })

      if (!existingNotification) {
        const notification = await createNotification({
          studentId,
          type: 'recommendation',
          title: `Tema a reforzar: ${metric.topic.nombre}`,
          message: `Tu rendimiento en ${metric.topic.nombre} es del ${metric.porcentaje.toFixed(1)}%. Te recomendamos practicar más este tema para mejorar tu puntaje PAES.`,
          relatedId: metric.topicId,
          relatedType: 'topic',
          actionUrl: `/practice/${metric.topicId}`,
          priority: metric.porcentaje < 30 ? 'high' : 'normal',
        })

        notifications.push(notification)
      }
    }

    return notifications
  } catch (error) {
    console.error('Error al crear notificaciones de recomendación:', error)
    throw error
  }
}

/**
 * Crea notificaciones de recordatorio para sesiones de estudio programadas
 */
export async function createScheduleReminders(studentId: string) {
  try {
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Buscar sesiones programadas en las próximas 24 horas que no tengan recordatorio
    const upcomingSessions = await prisma.studySchedule.findMany({
      where: {
        studentId,
        completed: false,
        scheduledAt: {
          gte: now,
          lte: in24Hours,
        },
        reminderSent: false,
      },
      include: {
        topic: {
          include: {
            subject: true,
          },
        },
        exam: true,
      },
    })

    const notifications = []

    for (const session of upcomingSessions) {
      const notification = await createNotification({
        studentId,
        type: 'reminder',
        title: `Recordatorio: ${session.title}`,
        message: `Tienes una sesión de estudio programada para ${new Date(session.scheduledAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}.`,
        relatedId: session.id,
        relatedType: 'schedule',
        actionUrl: session.examId
          ? `/exams/${session.examId}`
          : session.topicId
            ? `/practice/${session.topicId}`
            : '/dashboard',
        priority: 'normal',
      })

      // Marcar como recordatorio enviado
      await prisma.studySchedule.update({
        where: { id: session.id },
        data: { reminderSent: true },
      })

      notifications.push(notification)
    }

    return notifications
  } catch (error) {
    console.error('Error al crear recordatorios de sesiones:', error)
    throw error
  }
}

/**
 * Crea notificación de logro cuando se alcanza un hito
 */
export async function createAchievementNotification(
  studentId: string,
  achievement: {
    title: string
    message: string
    relatedId?: string
    relatedType?: 'topic' | 'exam' | 'attempt'
    actionUrl?: string
  }
) {
  try {
    return await createNotification({
      studentId,
      type: 'achievement',
      title: achievement.title,
      message: achievement.message,
      relatedId: achievement.relatedId,
      relatedType: achievement.relatedType,
      actionUrl: achievement.actionUrl,
      priority: 'normal',
    })
  } catch (error) {
    console.error('Error al crear notificación de logro:', error)
    throw error
  }
}

/**
 * Crea notificaciones de recordatorio para flashcards pendientes de repaso
 */
export async function createFlashcardReminders(studentId: string) {
  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Obtener flashcards que están vencidas o vencen en las próximas 24 horas
    const dueFlashcards = await prisma.flashcard.findMany({
      where: {
        studentId,
        nextReview: {
          lte: tomorrow,
        },
      },
      include: {
        question: {
          include: {
            subject: {
              select: {
                nombre: true,
                codigo: true,
              },
            },
            topic: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
      take: 20, // Máximo 20 notificaciones
    })

    if (dueFlashcards.length === 0) {
      return []
    }

    // Verificar si ya existe una notificación reciente para flashcards
    const existingNotification = await prisma.notification.findFirst({
      where: {
        studentId,
        type: 'reminder',
        relatedType: 'topic',
        createdAt: {
          gte: new Date(now.getTime() - 12 * 60 * 60 * 1000), // Últimas 12 horas
        },
      },
    })

    if (existingNotification) {
      return [] // Ya hay una notificación reciente
    }

    // Crear notificación agrupada
    const overdueCount = dueFlashcards.filter(f => new Date(f.nextReview) <= now).length
    const upcomingCount = dueFlashcards.length - overdueCount

    let title = ''
    let message = ''

    if (overdueCount > 0 && upcomingCount > 0) {
      title = `${overdueCount} flashcards vencidas y ${upcomingCount} próximas a vencer`
      message = `Tienes ${overdueCount} flashcards que debes repasar ya y ${upcomingCount} que vencen pronto. ¡No dejes que se acumulen!`
    } else if (overdueCount > 0) {
      title = `${overdueCount} flashcards pendientes de repaso`
      message = `Tienes ${overdueCount} flashcards que debes repasar. El repaso regular mejora la retención a largo plazo.`
    } else {
      title = `${upcomingCount} flashcards próximas a vencer`
      message = `Tienes ${upcomingCount} flashcards que vencen en las próximas 24 horas. ¡Prepárate para repasarlas!`
    }

    const notification = await createNotification({
      studentId,
      type: 'reminder',
      title,
      message,
      actionUrl: '/flashcards/study',
      priority: overdueCount > 5 ? 'high' : overdueCount > 0 ? 'normal' : 'low',
      expiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000), // Expira en 48 horas
    })

    return [notification]
  } catch (error) {
    console.error('Error al crear recordatorios de flashcards:', error)
    throw error
  }
}

/**
 * Crea notificaciones automáticas para límites de versiones
 * Notifica cuando se acerca o alcanza el límite de versiones por nota
 */
export async function createVersionLimitNotifications(studentId: string) {
  try {
    const { LIMIT_CONSTANTS } = await import('@/lib/constants')
    const maxVersions = LIMIT_CONSTANTS.MAX_NOTE_VERSIONS
    const warningThreshold = Math.floor(maxVersions * 0.8) // 80% del límite

    // Obtener todas las notas del estudiante con sus versiones
    const notes = await prisma.studyNote.findMany({
      where: { studentId },
      include: {
        versions: {
          select: { id: true },
        },
      },
    })

    const notifications = []

    for (const note of notes) {
      const versionCount = note.versions.length
      
      // Verificar si ya existe una notificación reciente para esta nota
      const existingNotification = await prisma.notification.findFirst({
        where: {
          studentId,
          type: 'reminder',
          relatedId: note.id,
          relatedType: 'material',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 días
          },
        },
      })

      if (existingNotification) {
        continue // Ya hay una notificación reciente
      }

      if (versionCount >= maxVersions) {
        // Límite alcanzado
        const notification = await createNotification({
          studentId,
          type: 'reminder',
          title: `Límite de versiones alcanzado`,
          message: `Tu nota "${note.title}" ha alcanzado el límite de ${maxVersions} versiones. Las versiones más antiguas se eliminarán automáticamente cuando crees nuevas versiones.`,
          relatedId: note.id,
          relatedType: 'material',
          actionUrl: `/notes/${note.id}`,
          priority: 'normal',
        })
        notifications.push(notification)
      } else if (versionCount >= warningThreshold) {
        // Cerca del límite
        const remaining = maxVersions - versionCount
        const notification = await createNotification({
          studentId,
          type: 'reminder',
          title: `Cerca del límite de versiones`,
          message: `Tu nota "${note.title}" tiene ${versionCount} versiones. Te quedan ${remaining} versiones antes de alcanzar el límite.`,
          relatedId: note.id,
          relatedType: 'material',
          actionUrl: `/notes/${note.id}`,
          priority: 'low',
        })
        notifications.push(notification)
      }
    }

    return notifications
  } catch (error) {
    console.error('Error al crear notificaciones de límite de versiones:', error)
    throw error
  }
}

/**
 * Crea notificaciones para versiones importantes que están por expirar
 * (si se implementa un sistema de expiración de versiones antiguas)
 */
export async function createVersionExpirationNotifications(studentId: string) {
  try {
    const now = new Date()
    const expirationWarningDays = 7 // Avisar 7 días antes de la expiración
    new Date(now.getTime() + expirationWarningDays * 24 * 60 * 60 * 1000)

    // Obtener versiones importantes que podrían expirar pronto
    // Nota: Esto requiere un campo de expiración en StudyNoteVersion si se implementa
    // Por ahora, verificamos versiones importantes antiguas (más de 90 días)
    const oldImportantVersions = await prisma.studyNoteVersion.findMany({
      where: {
        note: {
          studentId,
        },
        isImportant: true,
        createdAt: {
          lte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // Más de 90 días
        },
      },
      include: {
        note: {
          select: {
            id: true,
            title: true,
            studentId: true,
          },
        },
      },
      take: 10, // Máximo 10 notificaciones
    })

    const notifications = []

    for (const version of oldImportantVersions) {
      // Verificar si ya existe una notificación reciente para esta versión
      const existingNotification = await prisma.notification.findFirst({
        where: {
          studentId: version.note.studentId,
          type: 'reminder',
          relatedId: version.id,
          relatedType: 'material',
          createdAt: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
          },
        },
      })

      if (existingNotification) {
        continue
      }

      // ✅ Enterprise: Calcular días usando funciones seguras
      const diffMs = now.getTime() - version.createdAt.getTime()
      if (!Number.isFinite(diffMs) || diffMs < 0) {
        continue // Fecha inválida, saltar
      }
      const daysOld = ensureInteger(safeDivide(diffMs, 1000 * 60 * 60 * 24, 0), 0)

      const notification = await createNotification({
        studentId: version.note.studentId,
        type: 'reminder',
        title: `Versión importante antigua`,
        message: `La versión "${version.name || version.title}" de tu nota "${version.note.title}" tiene ${daysOld} días. Considera revisarla o crear una nueva versión actualizada.`,
        relatedId: version.note.id,
        relatedType: 'material',
        actionUrl: `/notes/${version.note.id}?version=${version.id}`,
        priority: 'low',
        expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // Expira en 30 días
      })
      notifications.push(notification)
    }

    return notifications
  } catch (error) {
    console.error('Error al crear notificaciones de expiración de versiones:', error)
    throw error
  }
}

/**
 * Limpia notificaciones expiradas
 */
export async function cleanupExpiredNotifications() {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })

    return result.count
  } catch (error) {
    console.error('Error al limpiar notificaciones expiradas:', error)
    throw error
  }
}
