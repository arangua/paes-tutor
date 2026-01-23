/**
 * Sistema de métricas de uso y observabilidad para versiones
 * Registra métricas de negocio además de performance
 */

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { safeRound, safeToISOString } from './validation-utils'

/**
 * Tipos de eventos de métricas
 */
export type MetricEvent = 
  | 'version.restored'
  | 'version.updated'
  | 'version.deleted'
  | 'version.bulk_deleted'
  | 'version.metadata_updated'
  | 'version.queried'
  | 'version.limit_reached'
  | 'version.content_validated'
  | 'version.payload_validated'
  | 'version.background_operation_failed' // guard:allow-secret
  | 'version.cache_hit'
  | 'version.cache_miss'
  | 'version.cache_set'
  | 'version.cache_invalidated'

/**
 * Registra una métrica de uso
 * No bloquea la operación principal
 * CORRECCIÓN: Valida que event sea válido y que Date.toISOString() retorne un valor válido
 */
export function trackVersionMetric(
  event: MetricEvent,
  metadata?: Record<string, unknown>
): void {
  // CORRECCIÓN: Validar que event sea un string válido
  if (!event || typeof event !== 'string') {
    logger.warn(
      { event, metadata },
      'trackVersionMetric recibió event inválido, omitiendo'
    )
    return
  }
  
  // Ejecutar en background para no bloquear
  if (typeof globalThis.setTimeout === 'function') {
    globalThis.setTimeout(() => {
    try {
      const timestamp = safeToISOString(new Date())
      
      logger.info(
        {
          event,
          ...metadata,
          timestamp,
          type: 'version_metric',
        },
        `Métrica de versión: ${event}`
      )
    } catch (error) {
      // Si falla el logging, no fallar la función
      logger.warn(
        { error, event },
        'Error al registrar métrica de versión'
      )
    }
  }, 0)
  } else {
    // Fallback si setTimeout no está disponible
    Promise.resolve().then(() => {
      try {
        const timestamp = safeToISOString(new Date())
        
        logger.info(
          {
            event,
            ...metadata,
            timestamp,
            type: 'version_metric',
          },
          `Métrica de versión: ${event}`
        )
      } catch (error) {
        logger.warn(
          { error, event },
          'Error al registrar métrica de versión'
        )
      }
    })
  }
}

/**
 * Registra métricas agregadas en la base de datos
 * Para análisis a largo plazo
 */
export async function recordVersionMetric(
  event: MetricEvent,
  studentId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  // CORRECCIÓN: Validar que event y studentId sean strings válidos
  if (!event || typeof event !== 'string') {
    logger.warn(
      { event, studentId, metadata },
      'recordVersionMetric recibió event inválido, omitiendo'
    )
    return
  }
  
  if (!studentId || typeof studentId !== 'string') {
    logger.warn(
      { event, studentId, metadata },
      'recordVersionMetric recibió studentId inválido, omitiendo'
    )
    return
  }
  
  try {
    const timestamp = safeToISOString(new Date())
    
    // Aquí se podría guardar en una tabla de métricas si existe
    // Por ahora solo logueamos
    logger.info(
      {
        event,
        studentId,
        ...metadata,
        timestamp,
        type: 'version_metric_db',
      },
      `Métrica de versión registrada: ${event}`
    )
  } catch (error) {
    // No fallar si las métricas fallan
    logger.warn(
      { error, event, studentId },
      'Error al registrar métrica de versión'
    )
  }
}

/**
 * Obtiene estadísticas de uso de versiones para un estudiante
 */
export async function getVersionUsageStats(studentId: string): Promise<{
  totalRestores: number
  totalUpdates: number
  totalDeletes: number
  totalQueries: number
  averageVersionsPerNote: number
}> {
  try {
    const [totalRestores, totalUpdates, totalDeletes, notesWithVersions] = await Promise.all([
      prisma.versionRestoreHistory.count({
        where: { restoredBy: studentId },
      }),
      // Contar actualizaciones (versiones con name, color o isImportant modificados)
      prisma.studyNoteVersion.count({
        where: {
          createdBy: studentId,
          OR: [
            { name: { not: null } },
            { color: { not: null } },
            { isImportant: true },
          ],
        },
      }),
      // Esto es una aproximación - las eliminaciones no se trackean directamente
      // Se podría mejorar con una tabla de auditoría
      Promise.resolve(0),
      prisma.studyNote.count({
        where: {
          studentId,
          versions: {
            some: {},
          },
        },
      }),
    ])

    const totalVersions = await prisma.studyNoteVersion.count({
      where: { createdBy: studentId },
    })

    return {
      totalRestores,
      totalUpdates,
      totalDeletes,
      totalQueries: 0, // Se podría trackear con middleware
      averageVersionsPerNote: notesWithVersions > 0 && 
        Number.isFinite(totalVersions) && Number.isFinite(notesWithVersions) &&
        totalVersions >= 0 && notesWithVersions > 0
        ? (() => {
            const avg = totalVersions / notesWithVersions
            // Validar que el promedio sea un número válido antes de redondear
            if (Number.isFinite(avg)) {
              const rounded = safeRound(avg, 1)
              return Number.isFinite(rounded) ? rounded : 0
            }
            return 0
          })()
        : 0,
    }
  } catch (error) {
    logger.error(
      { error, studentId },
      'Error al obtener estadísticas de uso de versiones'
    )
    return {
      totalRestores: 0,
      totalUpdates: 0,
      totalDeletes: 0,
      totalQueries: 0,
      averageVersionsPerNote: 0,
    }
  }
}

