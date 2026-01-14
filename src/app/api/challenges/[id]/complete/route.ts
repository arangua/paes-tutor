import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import {
  getChallengeInclude,
  determineChallengeWinner,
  validateChallengeAttempt,
} from '@/lib/challenge-helpers'
import { CHALLENGE_STATUS } from '@/lib/challenge-constants'
import { z } from 'zod'

export const runtime = 'nodejs'

const completeChallengeSchema = z.object({
  challengerAttemptId: z.string().optional(), // Para cuando el desafiador completa primero
  challengedAttemptId: z.string().optional(), // Para cuando el desafiado completa
})

/**
 * POST: Completar un desafío (cuando ambos han realizado el examen)
 * Este endpoint se llama cuando cualquiera de los dos completa su intento
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { id } = await params
      const body = await request.json()
      const validation = completeChallengeSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { challengerAttemptId, challengedAttemptId } = validation.data

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

      if (challenge.status !== CHALLENGE_STATUS.ACCEPTED) {
        return NextResponse.json(
          { error: 'El desafío debe estar aceptado para completarlo' },
          { status: 400 }
        )
      }

      // Determinar qué intento se está agregando
      const updateData: {
        challengerAttemptId?: string
        challengedAttemptId?: string
        status?: string
        winnerId?: string | null
        completedAt?: Date
      } = {}

      if (challengerAttemptId) {
        // El desafiador completó su intento
        if (challenge.challengerId !== dbUser.student.id) {
          return NextResponse.json(
            { error: 'Solo el desafiador puede registrar su intento' },
            { status: 403 }
          )
        }

        // Verificar el intento
        const attempt = await prisma.attempt.findUnique({
          where: { id: challengerAttemptId },
        })

        const validation = validateChallengeAttempt(
          attempt,
          challenge.challengerId,
          challenge.examId || undefined
        )
        if (!validation.isValid) {
          return NextResponse.json({ error: validation.errorMessage }, { status: 400 })
        }

        updateData.challengerAttemptId = challengerAttemptId
      }

      if (challengedAttemptId) {
        // El desafiado completó su intento
        if (challenge.challengedId !== dbUser.student.id) {
          return NextResponse.json(
            { error: 'Solo el desafiado puede registrar su intento' },
            { status: 403 }
          )
        }

        // Verificar el intento
        const attempt = await prisma.attempt.findUnique({
          where: { id: challengedAttemptId },
        })

        const validation = validateChallengeAttempt(
          attempt,
          challenge.challengedId,
          challenge.examId || undefined
        )
        if (!validation.isValid) {
          return NextResponse.json({ error: validation.errorMessage }, { status: 400 })
        }

        updateData.challengedAttemptId = challengedAttemptId
      }

      // Si ambos intentos están presentes, determinar el ganador y completar
      const currentChallenge = await prisma.challenge.findUnique({
        where: { id },
        include: {
          challengerAttempt: true,
          challengedAttempt: true,
        },
      })

      // CORRECCIÓN: Validar que currentChallenge sea un objeto válido antes de acceder a propiedades
      const safeCurrentChallenge = currentChallenge && typeof currentChallenge === 'object' ? currentChallenge : null
      const willHaveChallengerAttempt = challengerAttemptId || (safeCurrentChallenge && 'challengerAttemptId' in safeCurrentChallenge ? safeCurrentChallenge.challengerAttemptId : null)
      const willHaveChallengedAttempt = challengedAttemptId || (safeCurrentChallenge && 'challengedAttemptId' in safeCurrentChallenge ? safeCurrentChallenge.challengedAttemptId : null)

      if (willHaveChallengerAttempt && willHaveChallengedAttempt) {
        // Ambos han completado, determinar ganador
        // CORRECCIÓN: Validar que safeCurrentChallenge sea válido antes de acceder a challengerAttempt y challengedAttempt
        const challengerAttempt = challengerAttemptId
          ? await prisma.attempt.findUnique({ where: { id: challengerAttemptId } })
          : (safeCurrentChallenge && 'challengerAttempt' in safeCurrentChallenge ? safeCurrentChallenge.challengerAttempt : null) || null
        const challengedAttempt = challengedAttemptId
          ? await prisma.attempt.findUnique({ where: { id: challengedAttemptId } })
          : (safeCurrentChallenge && 'challengedAttempt' in safeCurrentChallenge ? safeCurrentChallenge.challengedAttempt : null) || null

        if (challengerAttempt && challengedAttempt) {
          const winnerId = determineChallengeWinner(
            challengerAttempt,
            challengedAttempt,
            challenge.challengerId,
            challenge.challengedId
          )

          updateData.status = CHALLENGE_STATUS.COMPLETED
          updateData.winnerId = winnerId
          updateData.completedAt = new Date()
        }
      }

      // Actualizar el desafío
      const updated = await prisma.challenge.update({
        where: { id },
        data: updateData,
        include: getChallengeInclude(),
      })

      return NextResponse.json({ challenge: updated })
    } catch (error) {
      logger.error(
        {
          type: 'challenges_complete_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al completar desafío'
      )
      return NextResponse.json({ error: 'Error al completar desafío' }, { status: 500 })
    }
  })
}
