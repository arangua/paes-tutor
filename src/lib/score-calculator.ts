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

/**
 * Calcula el puntaje ponderado final basado en ponderaciones oficiales
 */
export function calcularPuntajePonderado(
  datos: DatosEstudiante,
  ponderaciones: Ponderaciones
): number {
  const { nem, ranking, puntajesPAES } = datos

  // Validar que las ponderaciones sumen 100
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

  // Calcular puntaje ponderado
  let puntajePonderado = 0

  // ✅ Enterprise: Calcular componentes del puntaje ponderado usando funciones seguras
  // NEM
  if (ponderaciones.nem > 0) {
    if (nem === undefined || nem === null) {
      throw new Error('NEM es requerido para calcular el puntaje ponderado')
    }
    const safeNem = ensureFiniteNumber(nem, 0)
    const safeNemPond = ensureFiniteNumber(ponderaciones.nem, 0)
    puntajePonderado += safeDivide(safeNem * safeNemPond, 100, 0)
  }

  // Ranking
  if (ponderaciones.ranking > 0) {
    if (ranking === undefined || ranking === null) {
      throw new Error('Ranking es requerido para calcular el puntaje ponderado')
    }
    const safeRanking = ensureFiniteNumber(ranking, 0)
    const safeRankingPond = ensureFiniteNumber(ponderaciones.ranking, 0)
    puntajePonderado += safeDivide(safeRanking * safeRankingPond, 100, 0)
  }

  // Competencia Lectora
  if (ponderaciones.lectora > 0) {
    if (!puntajesPAES.lectora) {
      throw new Error(
        'Puntaje de Competencia Lectora es requerido para calcular el puntaje ponderado'
      )
    }
    const safeLectora = ensureFiniteNumber(puntajesPAES.lectora, 0)
    const safeLectoraPond = ensureFiniteNumber(ponderaciones.lectora, 0)
    puntajePonderado += safeDivide(safeLectora * safeLectoraPond, 100, 0)
  }

  // Matemática M1
  if (ponderaciones.m1 > 0) {
    if (!puntajesPAES.m1) {
      throw new Error(
        'Puntaje de Matemática M1 es requerido para calcular el puntaje ponderado'
      )
    }
    const safeM1 = ensureFiniteNumber(puntajesPAES.m1, 0)
    const safeM1Pond = ensureFiniteNumber(ponderaciones.m1, 0)
    puntajePonderado += safeDivide(safeM1 * safeM1Pond, 100, 0)
  }

  // Matemática M2
  if (ponderaciones.m2 && ponderaciones.m2 > 0) {
    if (!puntajesPAES.m2) {
      throw new Error(
        'Puntaje de Matemática M2 es requerido para calcular el puntaje ponderado'
      )
    }
    const safeM2 = ensureFiniteNumber(puntajesPAES.m2, 0)
    const safeM2Pond = ensureFiniteNumber(ponderaciones.m2, 0)
    puntajePonderado += safeDivide(safeM2 * safeM2Pond, 100, 0)
  }

  // Ciencias
  if (ponderaciones.ciencias && ponderaciones.ciencias > 0) {
    if (!puntajesPAES.ciencias) {
      throw new Error(
        'Puntaje de Ciencias es requerido para calcular el puntaje ponderado'
      )
    }
    const safeCiencias = ensureFiniteNumber(puntajesPAES.ciencias, 0)
    const safeCienciasPond = ensureFiniteNumber(ponderaciones.ciencias, 0)
    puntajePonderado += safeDivide(safeCiencias * safeCienciasPond, 100, 0)
  }

  // Historia
  if (ponderaciones.historia && ponderaciones.historia > 0) {
    if (!puntajesPAES.historia) {
      throw new Error(
        'Puntaje de Historia es requerido para calcular el puntaje ponderado'
      )
    }
    const safeHistoria = ensureFiniteNumber(puntajesPAES.historia, 0)
    const safeHistoriaPond = ensureFiniteNumber(ponderaciones.historia, 0)
    puntajePonderado += safeDivide(safeHistoria * safeHistoriaPond, 100, 0)
  }

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

