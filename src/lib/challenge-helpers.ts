import type { Attempt } from '@prisma/client'
import { ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

/**
 * Determina el ganador de un desafío comparando los porcentajes de dos intentos
 * 
 * ✅ Enterprise: Valida que los porcentajes sean números finitos antes de comparar
 * 
 * @param challengerAttempt - Intento del desafiador
 * @param challengedAttempt - Intento del desafiado
 * @param challengerId - ID del desafiador
 * @param challengedId - ID del desafiado
 * @returns ID del ganador o null si hay empate o datos inválidos
 */
export function determineChallengeWinner(
  challengerAttempt: Attempt | null,
  challengedAttempt: Attempt | null,
  challengerId: string,
  challengedId: string
): string | null {
  if (!challengerAttempt || !challengedAttempt) {
    return null
  }

  // ✅ Enterprise: Validar que los porcentajes sean números finitos antes de comparar
  const challengerPorcentaje = ensureFiniteNumber(challengerAttempt.porcentaje, 0)
  const challengedPorcentaje = ensureFiniteNumber(challengedAttempt.porcentaje, 0)

  if (challengedPorcentaje > challengerPorcentaje) {
    return challengedId
  }
  if (challengedPorcentaje < challengerPorcentaje) {
    return challengerId
  }
  // Si son iguales, queda null (empate)
  return null
}

/**
 * Valida que un intento pertenezca al estudiante correcto y esté completado
 * @param attempt - Intento a validar
 * @param expectedStudentId - ID del estudiante esperado
 * @param challengeExamId - ID del examen del desafío (opcional)
 * @returns Objeto con isValid y errorMessage
 */
export function validateChallengeAttempt(
  attempt: Attempt | null,
  expectedStudentId: string,
  challengeExamId?: string | null
): { isValid: boolean; errorMessage?: string } {
  if (!attempt) {
    return { isValid: false, errorMessage: 'Intento no encontrado' }
  }

  if (attempt.studentId !== expectedStudentId) {
    return { isValid: false, errorMessage: 'Intento inválido' }
  }

  if (attempt.estado !== 'completado') {
    return { isValid: false, errorMessage: 'El intento debe estar completado' }
  }

  if (challengeExamId && attempt.examId !== challengeExamId) {
    return {
      isValid: false,
      errorMessage: 'El intento no corresponde al examen del desafío',
    }
  }

  return { isValid: true }
}

/**
 * Obtiene el include estándar para desafíos con todas las relaciones
 */
export function getChallengeInclude() {
  return {
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
    challengerAttempt: {
      select: {
        id: true,
        porcentaje: true,
        puntajePaes: true,
        correctas: true,
        totalPreguntas: true,
        createdAt: true,
      },
    },
    challengedAttempt: {
      select: {
        id: true,
        porcentaje: true,
        puntajePaes: true,
        correctas: true,
        totalPreguntas: true,
        createdAt: true,
      },
    },
    winner: {
      select: {
        id: true,
        nombre: true,
      },
    },
  } as const
}
