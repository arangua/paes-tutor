/**
 * Utilidades para transformación de puntajes
 * Convierte entre diferentes escalas: NEM, PAES, PSU, PDT
 */

import { prisma } from '@/lib/prisma'
import { safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

export type TipoTransformacion =
  | 'NEM'
  | 'PAES'
  | 'PSU_TO_PAES'
  | 'PDT_TO_PAES'
  | 'RANKING'

/**
 * Transforma un puntaje de una escala a otra
 */
export async function transformarPuntaje(
  valor: number,
  tipo: TipoTransformacion,
  proceso?: string,
  prueba?: string
): Promise<number | null> {
  const transformaciones = await prisma.scoreTransformation.findMany({
    where: {
      tipo,
      proceso: proceso || null,
      prueba: prueba || null,
      activa: true,
    },
    orderBy: {
      valorOrigen: 'asc',
    },
  })

  if (transformaciones.length === 0) {
    return null
  }

  // Buscar el valor más cercano
  let transformacion = transformaciones.find(
    (t) => t.valorOrigen >= valor
  )

  // Si no hay valor mayor, usar el último
  if (!transformacion) {
    transformacion = transformaciones[transformaciones.length - 1]
  }

  // Verificar que transformacion existe
  if (!transformacion) {
    return null
  }

  // Si el valor coincide exactamente, retornar directamente
  if (transformacion.valorOrigen === valor) {
    return transformacion.valorDestino
  }

  // ✅ Enterprise: Interpolación lineal usando funciones seguras
  const indice = transformaciones.indexOf(transformacion)
  if (indice > 0) {
    const anterior = transformaciones[indice - 1]
    if (!anterior) {
      return transformacion.valorDestino
    }
    const diferenciaOrigen = ensureFiniteNumber(transformacion.valorOrigen - anterior.valorOrigen, 0)
    const diferenciaDestino = ensureFiniteNumber(
      transformacion.valorDestino - anterior.valorDestino,
      0
    )

    if (diferenciaOrigen > 0) {
      const safeValor = ensureFiniteNumber(valor, 0)
      const safeAnteriorOrigen = ensureFiniteNumber(anterior.valorOrigen, 0)
      const safeAnteriorDestino = ensureFiniteNumber(anterior.valorDestino, 0)
      const factor = safeDivide(safeValor - safeAnteriorOrigen, diferenciaOrigen, 0)
      const result = safeAnteriorDestino + factor * diferenciaDestino
      return ensureFiniteNumber(result, transformacion.valorDestino)
    }
  }

  return transformacion.valorDestino
}

/**
 * Transforma NEM a escala PAES
 */
export async function transformarNEM(
  nem: number,
  proceso?: string
): Promise<number | null> {
  return transformarPuntaje(nem, 'NEM', proceso)
}

/**
 * Transforma puntaje PSU a PAES
 */
export async function transformarPSUaPAES(
  puntajePSU: number,
  prueba: string,
  proceso?: string
): Promise<number | null> {
  return transformarPuntaje(puntajePSU, 'PSU_TO_PAES', proceso, prueba)
}

/**
 * Transforma puntaje PDT a PAES
 */
export async function transformarPDTaPAES(
  puntajePDT: number,
  prueba: string,
  proceso?: string
): Promise<number | null> {
  return transformarPuntaje(puntajePDT, 'PDT_TO_PAES', proceso, prueba)
}

/**
 * Obtiene todas las transformaciones disponibles
 */
export async function obtenerTransformaciones(
  tipo?: TipoTransformacion,
  proceso?: string
) {
  return await prisma.scoreTransformation.findMany({
    where: {
      ...(tipo && { tipo }),
      ...(proceso && { proceso }),
      activa: true,
    },
    orderBy: [
      { tipo: 'asc' },
      { valorOrigen: 'asc' },
    ],
  })
}

