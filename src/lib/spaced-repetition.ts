/**
 * Implementación del algoritmo SM-2 (SuperMemo 2) para repaso espaciado
 * Basado en: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

import { safeRound } from '@/app/api/notes/versions/validation-utils'

export interface SM2Result {
  easeFactor: number
  interval: number // días hasta próximo repaso
  nextReview: Date
  reviewCount: number // nuevo contador de repasos
}

export interface SM2Input {
  quality: number // 0-5: 0=no recordé, 5=perfecto
  easeFactor: number
  interval: number
  reviewCount: number
}

/**
 * Calcula el próximo intervalo de repaso usando el algoritmo SM-2
 * @param input Parámetros actuales de la tarjeta
 * @returns Nuevos parámetros calculados
 */
export function calculateSM2(input: SM2Input): SM2Result {
  const { quality } = input
  let { easeFactor, interval, reviewCount } = input

  // Calcular nuevo factor de facilidad
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Asegurar que el factor de facilidad no sea menor que 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3
  }

  // Calcular nuevo intervalo
  if (quality < 3) {
    // Si la respuesta fue incorrecta, reiniciar
    interval = 1
    reviewCount = 0
  } else {
    if (reviewCount === 0) {
      interval = 1
    } else if (reviewCount === 1) {
      interval = 6
    } else {
      interval = safeRound(interval * easeFactor, 0)
    }
    reviewCount++
  }

  // Calcular próxima fecha de repaso
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    easeFactor,
    interval,
    nextReview,
    reviewCount,
  }
}

/**
 * Convierte una respuesta del usuario a un valor de calidad (0-5)
 * @param isCorrect Si la respuesta fue correcta
 * @param difficulty Dificultad percibida (opcional)
 * @returns Valor de calidad 0-5
 */
export function responseToQuality(
  isCorrect: boolean,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): number {
  if (!isCorrect) return 0

  switch (difficulty) {
    case 'easy':
      return 5
    case 'medium':
      return 4
    case 'hard':
      return 3
    default:
      return 4
  }
}
