import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { getChallengeInclude, determineChallengeWinner } from '@/lib/challenge-helpers'
import { CHALLENGE_STATUS } from '@/lib/challenge-constants'
import { z } from 'zod'

export const runtime = 'nodejs'

const updateChallengeSchema = z.object({
  status: z.enum(['accepted', 'declined', 'cancelled']).optional(),
  challengedAttemptId: z.string().optional(),
})

/**
 * GET: Obtener un desafío específico
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params

      const challenge = await prisma.challenge.findUnique({
        where: { id },
        include: {
          ...getChallengeInclude(),
          challenger: {
            select: {
              id: true,
              nombre: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          challenged: {
            select: {
              id: true,
              nombre: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      })

      if (!challenge) {
        return NextResponse.json({ error: 'Desafío no encontrado' }, { status: 404 })
      }

      // Verificar que el usuario es parte del desafío
      if (
        challenge.challengerId !== dbUser.student.id &&
        challenge.challengedId !== dbUser.student.id
      ) {
        return NextResponse.json(
          { error: 'No tienes permiso para ver este desafío' },
          { status: 403 }
        )
      }

      return NextResponse.json({ challenge })
    } catch (error) {
      logger.error(
        {
          type: 'challenges_get_id_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener desafío'
      )
      return NextResponse.json({ error: 'Error al obtener desafío' }, { status: 500 })
    }
  })
}

/**
 * PATCH: Actualizar un desafío (aceptar, rechazar, completar)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params
      const body = await request.json()
      const validation = updateChallengeSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { status, challengedAttemptId } = validation.data

      // Obtener el desafío
      const challenge = await prisma.challenge.findUnique({
        where: { id },
        include: {
          exam: true,
        },
      })

      if (!challenge) {
        return NextResponse.json({ error: 'Desafío no encontrado' }, { status: 404 })
      }

      // Verificar permisos según la acción
      if (status === CHALLENGE_STATUS.ACCEPTED || status === CHALLENGE_STATUS.DECLINED) {
        // Solo el desafiado puede aceptar o rechazar
        if (challenge.challengedId !== dbUser.student.id) {
          return NextResponse.json(
            { error: 'Solo el estudiante desafiado puede aceptar o rechazar el desafío' },
            { status: 403 }
          )
        }

        if (challenge.status !== 'pending') {
          return NextResponse.json({ error: 'Este desafío ya fue procesado' }, { status: 400 })
        }

        // Actualizar el desafío
        const updated = await prisma.challenge.update({
          where: { id },
          data: {
            status,
            acceptedAt: status === 'accepted' ? new Date() : null,
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
            challenger: {
              select: {
                id: true,
                nombre: true,
              },
            },
            challenged: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        })

        return NextResponse.json({ challenge: updated })
      }

      if (status === CHALLENGE_STATUS.CANCELLED) {
        // Solo el que desafió puede cancelar
        if (challenge.challengerId !== dbUser.student.id) {
          return NextResponse.json(
            { error: 'Solo quien creó el desafío puede cancelarlo' },
            { status: 403 }
          )
        }

        if (challenge.status !== CHALLENGE_STATUS.PENDING) {
          return NextResponse.json(
            { error: 'No se puede cancelar un desafío que ya fue procesado' },
            { status: 400 }
          )
        }

        const updated = await prisma.challenge.update({
          where: { id },
          data: { status: CHALLENGE_STATUS.CANCELLED },
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
            challenger: {
              select: {
                id: true,
                nombre: true,
              },
            },
            challenged: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        })

        return NextResponse.json({ challenge: updated })
      }

      // Si se proporciona challengedAttemptId, significa que el desafiado completó el examen
      if (challengedAttemptId) {
        if (challenge.challengedId !== dbUser.student.id) {
          return NextResponse.json(
            { error: 'Solo el estudiante desafiado puede completar el desafío' },
            { status: 403 }
          )
        }

        if (challenge.status !== CHALLENGE_STATUS.ACCEPTED) {
          return NextResponse.json(
            { error: 'El desafío debe estar aceptado para completarlo' },
            { status: 400 }
          )
        }

        // Verificar que el intento existe y pertenece al examen correcto
        const attempt = await prisma.attempt.findUnique({
          where: { id: challengedAttemptId },
          include: {
            exam: true,
          },
        })

        if (!attempt) {
          return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
        }

        if (attempt.studentId !== dbUser.student.id) {
          return NextResponse.json(
            { error: 'El intento no pertenece al estudiante desafiado' },
            { status: 403 }
          )
        }

        if (challenge.examId && attempt.examId !== challenge.examId) {
          return NextResponse.json(
            { error: 'El intento no corresponde al examen del desafío' },
            { status: 400 }
          )
        }

        if (attempt.estado !== 'completado') {
          return NextResponse.json({ error: 'El intento debe estar completado' }, { status: 400 })
        }

        // Determinar el ganador comparando los resultados
        let winnerId: string | null = null
        if (challenge.challengerAttemptId) {
          const challengerAttempt = await prisma.attempt.findUnique({
            where: { id: challenge.challengerAttemptId },
          })

          if (challengerAttempt) {
            winnerId = determineChallengeWinner(
              challengerAttempt,
              attempt,
              challenge.challengerId,
              dbUser.student.id
            )
          }
        }

        // Actualizar el desafío como completado
        const updated = await prisma.challenge.update({
          where: { id },
          data: {
            status: CHALLENGE_STATUS.COMPLETED,
            challengedAttemptId,
            winnerId,
            completedAt: new Date(),
          },
          include: getChallengeInclude(),
        })

        return NextResponse.json({ challenge: updated })
      }

      return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    } catch (error) {
      logger.error(
        {
          type: 'challenges_patch_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al actualizar desafío'
      )
      return NextResponse.json({ error: 'Error al actualizar desafío' }, { status: 500 })
    }
  })
}
