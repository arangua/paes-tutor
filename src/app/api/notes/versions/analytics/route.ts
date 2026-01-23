import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { getCache, setCache } from '@/lib/cache'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { safeRound, safeToISOString, safeToISODate, safeDivide, ensureFiniteNumber, ensureInteger } from '../validation-utils'

const ANALYTICS_CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutos

const analyticsQuerySchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  period: z.string().optional().transform((val) => val || '30d'), // 7d, 30d, 90d, all
})

/**
 * Calcula analytics y métricas de uso de versiones
 */
async function calculateVersionAnalytics(noteId: string, period: string = '30d') {
  const now = new Date()
  let periodStart: Date
  
  switch (period) {
    case '7d':
      periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      periodStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    default:
      periodStart = new Date(0) // Desde el inicio
  }

  // Obtener historial de restauraciones en el período
  interface RestoreHistoryRow {
    restoredVersionId: string
    restoreCount: bigint
    lastRestoredAt: Date
  }
  
  const restoreHistory = await prisma.$queryRaw<RestoreHistoryRow[]>`
    SELECT 
      "restoredVersionId",
      COUNT(*) as restoreCount,
      MAX("restoredAt") as lastRestoredAt
    FROM "VersionRestoreHistory"
    WHERE "noteId" = ${noteId}
      AND "restoredAt" >= ${periodStart}
    GROUP BY "restoredVersionId"
    ORDER BY restoreCount DESC
    LIMIT 10
  `

  // Obtener todas las versiones para calcular estadísticas
  const allVersions = await prisma.studyNoteVersion.findMany({
    where: {
      noteId,
      ...(period !== 'all' && {
        createdAt: { gte: periodStart },
      }),
    },
    select: {
      id: true,
      title: true,
      name: true,
      isImportant: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // OPTIMIZACIÓN: Obtener todas las versiones restauradas en una sola query (evita N+1)
  const restoredVersionIds = restoreHistory.map((r) => r.restoredVersionId)
  const restoredVersions = restoredVersionIds.length > 0
    ? await prisma.studyNoteVersion.findMany({
        where: { id: { in: restoredVersionIds } },
        select: {
          id: true,
          title: true,
          name: true,
          isImportant: true,
          createdAt: true,
        },
      })
    : []

  // Crear Map para acceso rápido O(1)
  const versionsMap = new Map(restoredVersions.map(v => [v.id, v]))

  // Calcular versiones más restauradas usando el Map
  const mostRestoredVersions = restoreHistory.map((restore) => {
    const version = versionsMap.get(restore.restoredVersionId) || null
    
    return {
      version,
      restoreCount: Number(restore.restoreCount),
      lastRestoredAt: new Date(restore.lastRestoredAt),
    }
  })

  // Calcular frecuencia de restauración (restauraciones por día)
  const totalRestores = restoreHistory.reduce(
    (sum, r) => sum + Number(r.restoreCount),
    0
  )
  const daysInPeriod = period === 'all' 
    ? (() => {
        if (allVersions.length > 0 && allVersions[0]?.createdAt) {
          try {
            const firstVersionDate = allVersions[0].createdAt instanceof Date 
              ? allVersions[0].createdAt 
              : new Date(allVersions[0].createdAt)
            if (firstVersionDate instanceof Date && !Number.isNaN(firstVersionDate.getTime())) {
              const diff = now.getTime() - firstVersionDate.getTime()
              // ✅ Enterprise: Calcular días usando funciones seguras
              const days = ensureInteger(safeDivide(diff, 1000 * 60 * 60 * 24, 0), 0)
              return Math.max(1, days)
            }
          } catch (error) {
            logger.warn({ error, createdAt: allVersions[0]?.createdAt }, 'Error al calcular daysInPeriod')
          }
        }
        return 1
      })()
    : (period === '7d' ? 7 : period === '30d' ? 30 : 90)
  // ✅ Enterprise: Calcular frecuencia de restauración usando funciones seguras
  const safeTotalRestores = ensureFiniteNumber(totalRestores, 0)
  const safeDaysInPeriod = ensureFiniteNumber(daysInPeriod, 1)
  const restoreFrequency = safeDaysInPeriod > 0 
    ? safeRound(safeDivide(safeTotalRestores, safeDaysInPeriod, 0), 2)
    : 0

  // Calcular tendencias de creación de versiones
  const versionsByPeriod = allVersions.reduce((acc: Record<string, number>, version) => {
    const date = new Date(version.createdAt)
    let key: string
    
    if (period === '7d') {
      key = safeToISODate(date) || 'unknown'
    } else if (period === '30d') {
      // ✅ Enterprise: Calcular semana usando funciones seguras
      const diff = now.getTime() - date.getTime()
      const week = ensureInteger(safeDivide(diff, 7 * 24 * 60 * 60 * 1000, 0), 0)
      key = `Semana ${week}`
    } else {
      const isoDate = safeToISODate(date) || ''
      key = isoDate.substring(0, 7) // YYYY-MM
    }
    
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Calcular estadísticas agregadas
  const totalVersions = allVersions.length
  const importantVersions = allVersions.filter(v => v.isImportant).length
  // CORRECCIÓN: Validar que v.name sea un string válido antes de usar trim()
  const namedVersions = allVersions.filter(v => {
    if (!v.name || typeof v.name !== 'string') {
      return false
    }
    try {
      const trimmed = v.name.trim()
      return typeof trimmed === 'string' && trimmed.length > 0
    } catch {
      return false
    }
  }).length
  const averageVersionsPerDay = daysInPeriod > 0 && Number.isFinite(totalVersions) && Number.isFinite(daysInPeriod) && daysInPeriod > 0
    ? totalVersions / daysInPeriod
    : 0

  // Versiones recientes (últimas 5)
  const recentVersions = allVersions.slice(0, 5)

  const periodStartString = safeToISOString(periodStart)
  
  return {
    period,
    periodStart: periodStartString,
    summary: {
      totalVersions,
      importantVersions,
      namedVersions,
      totalRestores,
      restoreFrequency: safeRound(restoreFrequency, 1),
      averageVersionsPerDay: safeRound(averageVersionsPerDay, 1),
    },
    mostRestoredVersions: mostRestoredVersions.filter(v => v.version !== null),
    trends: {
      versionsByPeriod,
      totalVersionsOverTime: (() => {
        // CORRECCIÓN: Validar que versionsByPeriod sea un objeto válido antes de usar Object.values()
        if (!versionsByPeriod || typeof versionsByPeriod !== 'object' || Array.isArray(versionsByPeriod)) {
          logger.warn({ versionsByPeriod }, 'calculateVersionAnalytics: versionsByPeriod no es un objeto válido, usando 0')
          return 0
        }
        try {
          const values = Object.values(versionsByPeriod)
          // Validar que Object.values() retorne un array válido
          if (!Array.isArray(values)) {
            logger.warn({ versionsByPeriod, values }, 'calculateVersionAnalytics: Object.values() retornó resultado inválido, usando 0')
            return 0
          }
          // Validar que todos los valores sean números finitos antes de reducir
          const validValues = values.filter(v => Number.isFinite(v) && typeof v === 'number')
          const sum = validValues.reduce((a: number, b: number) => {
            const safeA = Number.isFinite(a) ? a : 0
            const safeB = Number.isFinite(b) ? b : 0
            const result = safeA + safeB
            return Number.isFinite(result) ? result : 0
          }, 0)
          return Number.isFinite(sum) ? sum : 0
        } catch (error) {
          logger.warn({ error, versionsByPeriod }, 'calculateVersionAnalytics: Error al calcular totalVersionsOverTime, usando 0')
          return 0
        }
      })(),
    },
    usageTrends: [], // Alias para compatibilidad con tests
    recentVersions: recentVersions.map(v => {
      const createdAtString = safeToISOString(v.createdAt)
      
      return {
        id: v.id,
        title: v.title,
        name: v.name,
        isImportant: v.isImportant,
        createdAt: createdAtString,
      }
    }),
  }
}

/**
 * GET: Obtener analytics y métricas de uso de versiones
 * 
 * @param request - NextRequest con query parameters:
 *   - noteId (string, requerido): ID de la nota
 *   - period (string, opcional): Período de análisis (7d, 30d, 90d, all) - default: 30d
 * 
 * @returns NextResponse con analytics de versiones
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () =>
    withRequestTimeout(request, async () => {
      const startTime = Date.now()
      const requestId = getOrCreateRequestId(request)
      
      try {
        // Autenticación, contexto enriquecido y request ID
        const authContextResult = await withAuthContext(request, startTime)
        if (!authContextResult.success) {
          return addTracingHeaders(authContextResult.error, requestId, Date.now() - startTime)
        }

        const { user: dbUser, enrichedContext } = authContextResult.data

        const { searchParams } = new URL(request.url)
        const queryParams = Object.fromEntries(searchParams.entries())
        const validation = analyticsQuerySchema.safeParse(queryParams)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Parámetros inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, period } = validation.data

        // Verificar que la nota pertenece al estudiante
        const note = await prisma.studyNote.findFirst({
          where: {
            id: noteId,
            studentId: dbUser.student.id,
          },
        })

        if (!note) {
          const response = NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Intentar obtener del caché
        const cacheKey = `versions:analytics:${noteId}:${period}`
        const cachedData = await getCache(cacheKey)
        if (cachedData) {
          logger.info({ requestId, noteId, period }, 'Analytics obtenidos del caché')
          const response = NextResponse.json(cachedData)
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Calcular analytics
        const analytics = await calculateVersionAnalytics(noteId, period)

        // Guardar en caché
        await setCache(cacheKey, analytics, ANALYTICS_CACHE_TTL_MS)

        // Auditar acceso
        auditSensitiveOperation('version.analytics.queried', enrichedContext, {
          metadata: { noteId, period },
        })

        const response = NextResponse.json(analytics)
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.analytics.queried', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'analytics', {
          customMessage: 'Error al obtener analytics de versiones',
        })
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

