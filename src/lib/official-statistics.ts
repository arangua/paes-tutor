/**
 * Utilidades para estadísticas oficiales de DEMRE
 * Compara rendimiento del estudiante con estadísticas nacionales
 */

import { prisma } from '@/lib/prisma'
import { ensureFiniteNumber, safeDivide, safeRound } from './utils/validation-utils'

export interface EstadisticasOficiales {
  prueba: string
  proceso: string
  tipoAplicacion?: string
  promedio: number
  desviacionEstandar: number
  percentil50: number
  percentil75: number
  percentil90: number
  percentil95: number
  preguntasFaciles?: number
  preguntasMedias?: number
  preguntasDificiles?: number
}

/**
 * Obtiene estadísticas oficiales para una prueba
 */
export async function obtenerEstadisticasOficiales(
  prueba: string,
  proceso: string = '2026',
  tipoAplicacion?: string
): Promise<EstadisticasOficiales | null> {
  const estadisticas = await prisma.officialStatistics.findUnique({
    where: {
      prueba_proceso_tipoAplicacion: {
        prueba,
        proceso,
        tipoAplicacion: tipoAplicacion || null,
      },
    },
  })

  if (!estadisticas) {
    return null
  }

  return {
    prueba: estadisticas.prueba,
    proceso: estadisticas.proceso,
    tipoAplicacion: estadisticas.tipoAplicacion ?? undefined,
    promedio: estadisticas.promedio,
    desviacionEstandar: estadisticas.desviacionEstandar,
    percentil50: estadisticas.percentil50,
    percentil75: estadisticas.percentil75,
    percentil90: estadisticas.percentil90,
    percentil95: estadisticas.percentil95,
    preguntasFaciles: estadisticas.preguntasFaciles ?? undefined,
    preguntasMedias: estadisticas.preguntasMedias ?? undefined,
    preguntasDificiles: estadisticas.preguntasDificiles ?? undefined,
  }
}

/**
 * Calcula el percentil aproximado de un puntaje
 */
/**
 * ✅ Enterprise: Calcula el percentil usando funciones seguras
 */
export function calcularPercentil(
  puntaje: number,
  estadisticas: EstadisticasOficiales
): number {
  const { promedio, desviacionEstandar } = estadisticas

  // ✅ Enterprise: Validar valores antes de operar
  const safePuntaje = ensureFiniteNumber(puntaje, 0)
  const safePromedio = ensureFiniteNumber(promedio, 0)
  const safeDesviacion = ensureFiniteNumber(desviacionEstandar, 1) // Evitar división por cero

  // Usar distribución normal aproximada
  safeDivide(safePuntaje - safePromedio, safeDesviacion, 0)

  // ✅ Enterprise: Aproximación simple basada en percentiles conocidos usando funciones seguras
  const safePercentil95 = ensureFiniteNumber(estadisticas.percentil95, 0)
  const safePercentil90 = ensureFiniteNumber(estadisticas.percentil90, 0)
  const safePercentil75 = ensureFiniteNumber(estadisticas.percentil75, 0)
  const safePercentil50 = ensureFiniteNumber(estadisticas.percentil50, 0)

  if (safePuntaje >= safePercentil95) {
    const diff = safePuntaje - safePercentil95
    return safeRound(95 + safeDivide(diff, 50, 0) * 5, 2) // Extrapolación
  }
  if (safePuntaje >= safePercentil90) {
    const diff = safePuntaje - safePercentil90
    const range = safePercentil95 - safePercentil90
    return safeRound(90 + safeDivide(diff, range, 0) * 5, 2)
  }
  if (safePuntaje >= safePercentil75) {
    const diff = safePuntaje - safePercentil75
    const range = safePercentil90 - safePercentil75
    return safeRound(75 + safeDivide(diff, range, 0) * 15, 2)
  }
  if (safePuntaje >= safePercentil50) {
    const diff = safePuntaje - safePercentil50
    const range = safePercentil75 - safePercentil50
    return safeRound(50 + safeDivide(diff, range, 0) * 25, 2)
  }
  if (safePuntaje < safePercentil50) {
    const diff = safePercentil50 - safePuntaje
    const adjustment = safeDivide(diff, safeDesviacion, 0) * 10
    return Math.max(0, safeRound(50 - adjustment, 2))
  }

  return 50
}

/**
 * Compara el rendimiento del estudiante con estadísticas nacionales
 */
export async function compararConEstadisticas(
  puntaje: number,
  prueba: string,
  proceso: string = '2026',
  tipoAplicacion?: string
): Promise<{
  estadisticas: EstadisticasOficiales | null
  percentil: number | null
  diferenciaPromedio: number | null
  nivel: 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto' | null
}> {
  const estadisticas = await obtenerEstadisticasOficiales(
    prueba,
    proceso,
    tipoAplicacion
  )

  if (!estadisticas) {
    return {
      estadisticas: null,
      percentil: null,
      diferenciaPromedio: null,
      nivel: null,
    }
  }

  const percentil = calcularPercentil(puntaje, estadisticas)
  const diferenciaPromedio = puntaje - estadisticas.promedio

  let nivel: 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto'
  if (percentil >= 90) {
    nivel = 'muy_alto'
  } else if (percentil >= 75) {
    nivel = 'alto'
  } else if (percentil >= 50) {
    nivel = 'medio'
  } else if (percentil >= 25) {
    nivel = 'bajo'
  } else {
    nivel = 'muy_bajo'
  }

  return {
    estadisticas,
    percentil,
    diferenciaPromedio,
    nivel,
  }
}

/**
 * Obtiene todas las estadísticas disponibles para un proceso
 */
export async function obtenerTodasEstadisticas(
  proceso: string = '2026'
): Promise<EstadisticasOficiales[]> {
  const estadisticas = await prisma.officialStatistics.findMany({
    where: {
      proceso,
    },
    orderBy: [
      { prueba: 'asc' },
      { tipoAplicacion: 'asc' },
    ],
  })

  return estadisticas.map((e) => ({
    prueba: e.prueba,
    proceso: e.proceso,
    tipoAplicacion: e.tipoAplicacion ?? undefined,
    promedio: e.promedio,
    desviacionEstandar: e.desviacionEstandar,
    percentil50: e.percentil50,
    percentil75: e.percentil75,
    percentil90: e.percentil90,
    percentil95: e.percentil95,
    preguntasFaciles: e.preguntasFaciles ?? undefined,
    preguntasMedias: e.preguntasMedias ?? undefined,
    preguntasDificiles: e.preguntasDificiles ?? undefined,
  }))
}

