import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { safeRound, safeToISOString } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

const statsQuerySchema = z.object({
  topicId: z.string().optional(),
  subjectId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const topicId = searchParams.get('topicId') || undefined
      const subjectId = searchParams.get('subjectId') || undefined

      // Validar parámetros
      const validation = statsQuerySchema.safeParse({ topicId, subjectId })
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { topicId: validTopicId, subjectId: validSubjectId } = validation.data

      // Obtener métricas de rendimiento
      const metricsWhere: {
        studentId: string
        topicId?: string
        topic?: { subjectId: string }
      } = {
        studentId,
      }

      if (validTopicId) {
        metricsWhere.topicId = validTopicId
      } else if (validSubjectId) {
        metricsWhere.topic = { subjectId: validSubjectId }
      }

      const metrics = await prisma.performanceMetric.findMany({
        where: metricsWhere,
        select: {
          topicId: true,
          porcentaje: true,
          totalPreguntas: true,
          correctas: true,
          nivel: true,
          tendencia: true,
          topic: {
            select: {
              id: true,
              nombre: true,
              ejeTematico: true,
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
        orderBy: { porcentaje: 'asc' }, // Menor rendimiento primero (temas a mejorar)
      })

      // Obtener sesiones de práctica recientes
      const sessionsWhere: {
        studentId: string
        topicId?: string
        topic?: { subjectId: string }
      } = {
        studentId,
      }

      if (validTopicId) {
        sessionsWhere.topicId = validTopicId
      } else if (validSubjectId) {
        sessionsWhere.topic = { subjectId: validSubjectId }
      }

      const recentSessions = await prisma.practiceSession.findMany({
        where: sessionsWhere,
        select: {
          id: true,
          topicId: true,
          porcentaje: true,
          totalPreguntas: true,
          correctas: true,
          startedAt: true,
          finishedAt: true,
          topic: {
            select: {
              nombre: true,
              subject: {
                select: {
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
        orderBy: { startedAt: 'desc' },
        take: 10, // Últimas 10 sesiones
      })

      // Calcular estadísticas agregadas
      const totalSessions = await prisma.practiceSession.count({
        where: sessionsWhere,
      })

      const avgScore =
        recentSessions.length > 0
          ? (() => {
              const sum = recentSessions.reduce((sum, s) => {
                const safeSum = Number.isFinite(sum) ? sum : 0
                const safePorcentaje = Number.isFinite(s?.porcentaje) && s.porcentaje >= 0 && s.porcentaje <= 100
                  ? s.porcentaje
                  : 0
                const result = safeSum + safePorcentaje
                return Number.isFinite(result) ? result : safeSum
              }, 0)
              return Number.isFinite(sum) && recentSessions.length > 0 ? sum / recentSessions.length : 0
            })()
          : 0

      // Agrupar por tema para estadísticas
      const topicStats = metrics
        .filter(metric => metric.topic && metric.topic.subject)
        .map(metric => ({
          topicId: metric.topicId,
          topicName: metric.topic?.nombre || '',
          subjectName: metric.topic?.subject?.nombre || '',
          subjectCode: metric.topic?.subject?.codigo || '',
          ejeTematico: metric.topic?.ejeTematico || null,
          porcentaje: metric.porcentaje,
          totalPreguntas: metric.totalPreguntas,
          correctas: metric.correctas,
          nivel: metric.nivel,
          tendencia: metric.tendencia,
          // Contar sesiones de este tema
          sessionCount: recentSessions.filter(s => s.topicId === metric.topicId).length,
        }))

      return NextResponse.json({
        metrics: topicStats,
        recentSessions: recentSessions
          .filter(session => session.topic && session.topic.subject)
          .map(session => ({
            id: session.id,
            topicId: session.topicId,
            topicName: session.topic?.nombre || '',
            subjectName: session.topic?.subject?.nombre || '',
            porcentaje: session.porcentaje,
            totalPreguntas: session.totalPreguntas,
            correctas: session.correctas,
            startedAt: safeToISOString(session.startedAt),
            finishedAt: safeToISOString(session.finishedAt) || null,
          })),
        summary: {
          totalSessions,
          avgScore: safeRound(avgScore, 1),
          topicsPracticed: metrics.length,
          totalQuestions: (() => {
            // CORRECCIÓN: Validar que metrics sea un array válido y que m.totalPreguntas sea un número finito antes de reducir
            if (!Array.isArray(metrics)) {
              logger.warn({ metrics }, 'practice/stats: metrics no es un array válido, usando 0')
              return 0
            }
            try {
              const sum = metrics.reduce((sum, m) => {
                const safeSum = Number.isFinite(sum) ? sum : 0
                const safeTotalPreguntas = m && typeof m === 'object' && Number.isFinite(m.totalPreguntas) && m.totalPreguntas >= 0
                  ? m.totalPreguntas
                  : 0
                const result = safeSum + safeTotalPreguntas
                return Number.isFinite(result) ? result : safeSum
              }, 0)
              return Number.isFinite(sum) ? sum : 0
            } catch (error) {
              logger.warn({ error, metrics }, 'practice/stats: Error al calcular totalQuestions, usando 0')
              return 0
            }
          })(),
        },
      })
    } catch (error) {
      logger.error(
        {
          type: 'practice_stats_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener estadísticas de práctica'
      )
      return NextResponse.json(
        { error: 'Error al obtener estadísticas de práctica' },
        { status: 500 }
      )
    }
  })
}
