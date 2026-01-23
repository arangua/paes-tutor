/**
 * Calculadora de Puntajes Ponderados para PAES
 * Basado en ponderaciones oficiales de DEMRE
 */

import { prisma } from '@/lib/prisma'
import { safeRound, safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

export interface Ponderaciones {
  nem: number
  ranking: number
  lectora: number
  m1: number
  m2?: number
  ciencias?: number // BIO, FIS o QUI
  historia?: number
}

export interface PuntajesPAES {
  lectora?: number
  m1?: number
  m2?: number
  ciencias?: number // BIO, FIS o QUI
  historia?: number
}

export interface DatosEstudiante {
  nem: number
  ranking: number
  puntajesPAES: PuntajesPAES
}

function validatePonderacionesSum(ponderaciones: Ponderaciones): void {
  const sumaPonderaciones =
    ponderaciones.nem +
    ponderaciones.ranking +
    ponderaciones.lectora +
    ponderaciones.m1 +
    (ponderaciones.m2 || 0) +
    (ponderaciones.ciencias || 0) +
    (ponderaciones.historia || 0)

  if (Math.abs(sumaPonderaciones - 100) > 0.01) {
    throw new Error(
      `Las ponderaciones deben sumar 100. Suma actual: ${sumaPonderaciones}`
    )
  }
}

function addComponentScore(
  score: number,
  value: number,
  ponderacion: number
): number {
  const safeValue = ensureFiniteNumber(value, 0)
  const safePond = ensureFiniteNumber(ponderacion, 0)
  return score + safeDivide(safeValue * safePond, 100, 0)
}

function addOptionalComponentScore(
  score: number,
  value: number | undefined,
  ponderacion: number | undefined,
  errorMessage: string
): number {
  if (!ponderacion || ponderacion <= 0) {
    return score
  }
  if (!value) {
    throw new Error(errorMessage)
  }
  return addComponentScore(score, value, ponderacion)
}

/**
 * Calcula el puntaje ponderado final basado en ponderaciones oficiales
 */
export function calcularPuntajePonderado(
  datos: DatosEstudiante,
  ponderaciones: Ponderaciones
): number {
  const { nem, ranking, puntajesPAES } = datos

  validatePonderacionesSum(ponderaciones)

  let puntajePonderado = 0

  // NEM
  if (ponderaciones.nem > 0) {
    puntajePonderado = addComponentScore(puntajePonderado, nem, ponderaciones.nem)
  }

  // Ranking
  if (ponderaciones.ranking > 0) {
    puntajePonderado = addComponentScore(
      puntajePonderado,
      ranking,
      ponderaciones.ranking
    )
  }

  // Competencia Lectora
  if (ponderaciones.lectora > 0) {
    puntajePonderado = addOptionalComponentScore(
      puntajePonderado,
      puntajesPAES.lectora,
      ponderaciones.lectora,
      'Puntaje de Competencia Lectora es requerido para calcular el puntaje ponderado'
    )
  }

  // Matemática M1
  if (ponderaciones.m1 > 0) {
    puntajePonderado = addOptionalComponentScore(
      puntajePonderado,
      puntajesPAES.m1,
      ponderaciones.m1,
      'Puntaje de Matemática M1 es requerido para calcular el puntaje ponderado'
    )
  }

  // Matemática M2
  puntajePonderado = addOptionalComponentScore(
    puntajePonderado,
    puntajesPAES.m2,
    ponderaciones.m2,
    'Puntaje de Matemática M2 es requerido para calcular el puntaje ponderado'
  )

  // Ciencias
  puntajePonderado = addOptionalComponentScore(
    puntajePonderado,
    puntajesPAES.ciencias,
    ponderaciones.ciencias,
    'Puntaje de Ciencias es requerido para calcular el puntaje ponderado'
  )

  // Historia
  puntajePonderado = addOptionalComponentScore(
    puntajePonderado,
    puntajesPAES.historia,
    ponderaciones.historia,
    'Puntaje de Historia es requerido para calcular el puntaje ponderado'
  )

  return safeRound(puntajePonderado, 1) // Redondear a 1 decimal
}

/**
 * Obtiene las carreras disponibles para un proceso de admisión
 */
export async function obtenerCarreras(proceso: string = '2026') {
  return await prisma.career.findMany({
    where: {
      proceso,
      activa: true,
    },
    orderBy: [
      { universidad: 'asc' },
      { nombre: 'asc' },
    ],
  })
}

/**
 * Obtiene una carrera específica
 */
export async function obtenerCarrera(id: string) {
  return await prisma.career.findUnique({
    where: { id },
  })
}

/**
 * Calcula el puntaje ponderado para una carrera específica
 */
export async function calcularPuntajeParaCarrera(
  carreraId: string,
  datos: DatosEstudiante
): Promise<number> {
  const carrera = await obtenerCarrera(carreraId)

  if (!carrera) {
    throw new Error('Carrera no encontrada')
  }

  const ponderaciones: Ponderaciones = {
    nem: carrera.ponderacionNEM,
    ranking: carrera.ponderacionRanking,
    lectora: carrera.ponderacionLectora,
    m1: carrera.ponderacionM1,
    m2: carrera.ponderacionM2 ?? undefined,
    ciencias: carrera.ponderacionCiencias ?? undefined,
    historia: carrera.ponderacionHistoria ?? undefined,
  }

  return calcularPuntajePonderado(datos, ponderaciones)
}

/**
 * Busca carreras que el estudiante podría postular
 */
export async function buscarCarrerasAdecuadas(
  datos: DatosEstudiante,
  proceso: string = '2026',
  puntajeMinimo?: number
) {
  const carreras = await obtenerCarreras(proceso)

  const resultados = await Promise.all(
    carreras.map(async (carrera) => {
      try {
        const puntajePonderado = await calcularPuntajeParaCarrera(
          carrera.id,
          datos
        )

        // Verificar requisitos
        const cumpleRequisitos =
          !carrera.puntajeMinimo || puntajePonderado >= carrera.puntajeMinimo

        return {
          carrera,
          puntajePonderado,
          cumpleRequisitos,
        }
      } catch {
        // Si falta algún puntaje requerido, no incluir la carrera
        return null
      }
    })
  )

  const carrerasValidas = resultados
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .filter((r) => r.cumpleRequisitos)
    .filter((r) => !puntajeMinimo || r.puntajePonderado >= puntajeMinimo)
    .sort((a, b) => b.puntajePonderado - a.puntajePonderado)

  return carrerasValidas
}

