import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStudentId } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { decompressVersionContent } from '@/lib/utils/version-content'
import { cuidValidator } from '@/lib/utils/version-validators'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { ensureArray, ensureFiniteNumber, ensureValidDate, safeToISODate, safeToISOString, safeMathMax, safeMathMin } from '../validation-utils'

const getTimelineSchema = z.object({
  noteId: cuidValidator('ID de nota inválido').optional(),
  view: z.enum(['day', 'week', 'month', 'year']).default('month'),
  startDate: z.string().datetime({ message: 'Invalid datetime' }).optional(),
  endDate: z.string().datetime({ message: 'Invalid datetime' }).optional(),
  includeCurrent: z.boolean().optional().default(true),
})

/**
 * GET: Obtener versiones organizadas en timeline/calendario
 * 
 * Retorna versiones agrupadas por fecha según la vista seleccionada:
 * - day: Agrupadas por día
 * - week: Agrupadas por semana
 * - month: Agrupadas por mes
 * - year: Agrupadas por año
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () =>
    withRequestTimeout(request, async () => {
      const startTime = Date.now()
      const requestId = getOrCreateRequestId(request)
      const context = createRequestContext(request)
      
      try {
        const studentId = await getCurrentStudentId()
        if (!studentId) {
          const response = NextResponse.json({ error: 'No autorizado' }, { status: 401 })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Enriquecer contexto con studentId
        const enrichedContext = { ...context, studentId }

        const searchParams = request.nextUrl.searchParams
        // CORRECCIÓN: Validar que searchParams.entries() retorne un iterable válido antes de usar Object.fromEntries()
        let queryParams: Record<string, string>
        try {
          const entries = searchParams.entries()
          // Validar que entries() retorne un iterable válido
          if (!entries || typeof entries[Symbol.iterator] !== 'function') {
            logger.warn(
              { searchParams, url: request.url },
              'timeline: searchParams.entries() no retornó un iterable válido, usando objeto vacío'
            )
            queryParams = {}
          } else {
            queryParams = Object.fromEntries(entries)
            // Validar que Object.fromEntries() retorne un objeto válido
            if (!queryParams || typeof queryParams !== 'object' || Array.isArray(queryParams)) {
              logger.warn(
                { entries, queryParams },
                'timeline: Object.fromEntries() retornó resultado inválido, usando objeto vacío'
              )
              queryParams = {}
            }
          }
        } catch (error) {
          logger.warn(
            { error, searchParams, url: request.url },
            'timeline: Error al procesar searchParams, usando objeto vacío'
          )
          queryParams = {}
        }
        
        // Convertir includeCurrent de string a boolean
        if (queryParams.includeCurrent === 'false') {
          queryParams.includeCurrent = false
        } else if (queryParams.includeCurrent === 'true') {
          queryParams.includeCurrent = true
        }

        const validation = getTimelineSchema.safeParse(queryParams)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Parámetros inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

      const { noteId, view, startDate, endDate, includeCurrent } = validation.data

      // Construir filtros de fecha
      const dateFilter: { gte?: Date; lte?: Date } = {}
      if (startDate) {
        dateFilter.gte = new Date(startDate)
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate)
      }

      // Obtener notas del estudiante
      const notes = noteId
        ? await prisma.studyNote.findMany({
            where: { id: noteId, studentId },
            select: { id: true, title: true, updatedAt: true, content: true },
          })
        : await prisma.studyNote.findMany({
            where: { studentId },
            select: { id: true, title: true, updatedAt: true, content: true },
          })

        if (notes.length === 0) {
          const response = NextResponse.json({
            view,
            groups: [],
            totalVersions: 0,
            dateRange: {
              start: startDate || null,
              end: endDate || null,
            },
          })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

      const noteIds = notes.map(n => n.id)

      // Obtener versiones históricas
      const versions = await prisma.studyNoteVersion.findMany({
        where: {
          noteId: { in: noteIds },
          ...((() => {
            // CORRECCIÓN: Validar que dateFilter sea un objeto válido antes de usar Object.keys()
            if (!dateFilter || typeof dateFilter !== 'object' || Array.isArray(dateFilter)) {
              return false
            }
            try {
              const keys = Object.keys(dateFilter)
              // Validar que Object.keys() retorne un array válido
              if (!Array.isArray(keys)) {
                logger.warn(
                  { dateFilter, keys },
                  'timeline: Object.keys(dateFilter) retornó resultado inválido, omitiendo filtro de fecha'
                )
                return false
              }
              // Validar que length sea un número válido
              const safeLength = Number.isFinite(keys.length) ? keys.length : 0
              return safeLength > 0
            } catch (error) {
              logger.warn(
                { error, dateFilter },
                'timeline: Error al verificar Object.keys(dateFilter), omitiendo filtro de fecha'
              )
              return false
            }
          })() && { createdAt: dateFilter }),
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          noteId: true,
          title: true,
          content: true,
          tags: true,
          name: true,
          color: true,
          isImportant: true,
          isCompressed: true,
          createdAt: true,
        },
      })

      // Procesar versiones y descomprimir contenido si es necesario
      // CORRECCIÓN: Validar que versions sea un array válido antes de usar Promise.all()
      let processedVersions: Array<{ id: string; title: string; content: string; tags: string | null; name: string | null; color: string | null; isImportant: boolean; createdAt: Date; noteId: string }>
      if (!Array.isArray(versions) || versions.length === 0) {
        logger.warn(
          { versions },
          'timeline: versions no es un array válido o está vacío, usando array vacío'
        )
        processedVersions = []
      } else {
        try {
          const mapped = versions.map(async (v) => {
            const content = v.isCompressed
              ? await decompressVersionContent(v.content, true, 'versions/timeline')
              : v.content

            // CORRECCIÓN: Validar que content sea un string válido antes de usar substring() y length
            const safeContent = typeof content === 'string' ? content : ''
            const safeContentLength = typeof safeContent === 'string' && Number.isFinite(safeContent.length) ? safeContent.length : 0
            const previewContent = (() => {
              try {
                // Validar que safeContentLength sea un número válido antes de comparar
                if (safeContentLength > 200) {
                  // Validar que safeContent sea un string válido antes de usar substring()
                  if (typeof safeContent === 'string' && safeContent.length > 0) {
                    try {
                      const substring = safeContent.substring(0, 200)
                      // Validar que substring() retorne un string válido
                      return typeof substring === 'string' ? substring + '...' : safeContent
                    } catch (error) {
                      logger.warn(
                        { error, safeContent },
                        'timeline: Error al ejecutar substring() en content, usando content completo'
                      )
                      return safeContent
                    }
                  }
                }
                return safeContent
              } catch (error) {
                logger.warn(
                  { error, safeContent, safeContentLength },
                  'timeline: Error al procesar preview de content, usando content completo'
                )
                return safeContent
              }
            })()

            return {
              id: v.id,
              noteId: v.noteId,
              title: v.title,
              content: previewContent, // Preview corto
              tags: v.tags,
              name: v.name,
              color: v.color,
              isImportant: v.isImportant,
              createdAt: v.createdAt,
              noteTitle: (() => {
                // CORRECCIÓN: Validar que notes sea un array válido antes de usar find()
                if (!Array.isArray(notes)) {
                  return ''
                }
                
                try {
                  const found = notes.find(n => {
                    // Validar que n sea un objeto válido con id
                    return n && typeof n === 'object' && n.id && typeof n.id === 'string' && n.id === v.noteId
                  })
                  
                  // Validar que find() retorne un objeto válido con title
                  if (found && typeof found === 'object' && found.title && typeof found.title === 'string') {
                    return found.title
                  }
                  return ''
                } catch (error) {
                  logger.warn({ error, notes, noteId: v.noteId }, 'Error al ejecutar find() en notes, usando string vacío')
                  return ''
                }
              })(),
            }
          })
          
          processedVersions = await Promise.all(mapped)
        } catch (error) {
          logger.error(
            { error, versions },
            'timeline: Error al procesar versiones con Promise.all(), usando array vacío'
          )
          processedVersions = []
        }
      }

      // Agregar versión actual si está incluida
      const allVersions = includeCurrent
        ? [
            ...notes.map(note => {
              // CORRECCIÓN: Validar que note.content sea un string válido antes de usar substring() y length
              const safeNoteContent = typeof note.content === 'string' ? note.content : ''
              const safeNoteContentLength = typeof safeNoteContent === 'string' && Number.isFinite(safeNoteContent.length) ? safeNoteContent.length : 0
              const previewNoteContent = (() => {
                try {
                  // Validar que safeNoteContentLength sea un número válido antes de comparar
                  if (safeNoteContentLength > 200) {
                    // Validar que safeNoteContent sea un string válido antes de usar substring()
                    if (typeof safeNoteContent === 'string' && safeNoteContent.length > 0) {
                      try {
                        const substring = safeNoteContent.substring(0, 200)
                        // Validar que substring() retorne un string válido
                        return typeof substring === 'string' ? substring + '...' : safeNoteContent
                      } catch (error) {
                        logger.warn(
                          { error, safeNoteContent },
                          'timeline: Error al ejecutar substring() en note.content, usando content completo'
                        )
                        return safeNoteContent
                      }
                    }
                  }
                  return safeNoteContent
                } catch (error) {
                  logger.warn(
                    { error, safeNoteContent, safeNoteContentLength },
                    'timeline: Error al procesar preview de note.content, usando content completo'
                  )
                  return safeNoteContent
                }
              })()

              return {
                id: note.id,
                noteId: note.id,
                title: note.title,
                content: previewNoteContent,
                tags: null,
                name: null,
                color: null,
                isImportant: false,
                createdAt: note.updatedAt,
                noteTitle: note.title,
                isCurrent: true,
              }
            }),
            ...processedVersions.map(v => ({ ...v, isCurrent: false })),
          ]
        : processedVersions.map(v => ({ ...v, isCurrent: false }))

      // Agrupar versiones según la vista
      const groups = groupVersionsByView(allVersions, view)

      // Calcular rango de fechas real
      // DECISIÓN DE DISEÑO: Usa ensureArray y safeMathOperation del sistema de validación centralizado
      const safeAllVersions = ensureArray(allVersions, [])
      const allDates = safeAllVersions.map(v => v.createdAt)
      const safeAllDates = ensureArray(allDates, [])
      
      // Extraer tiempos válidos de fechas
      const getValidTimes = (dates: unknown[]): number[] => {
        return ensureArray(dates, [])
          .map(d => {
            const safeDate = ensureValidDate(d, null)
            if (safeDate === null) return null
            try {
              const time = safeDate.getTime()
              return ensureFiniteNumber(time, NaN)
            } catch {
              return null
            }
          })
          .filter((t): t is number => t !== null && !Number.isNaN(t))
      }
      
      const validTimes = getValidTimes(safeAllDates)
      
      const actualStartDate = validTimes.length > 0
        ? ensureValidDate(new Date(safeMathMin(validTimes, Date.now())), null)
        : null
      
      const actualEndDate = validTimes.length > 0
        ? ensureValidDate(new Date(safeMathMax(validTimes, Date.now())), null)
        : null

      // Auditar acceso
      auditSensitiveOperation('version.timeline.queried', enrichedContext, {
        metadata: { noteId, view, totalVersions: allVersions.length },
      })

      const response = NextResponse.json({
        view,
        groups,
        totalVersions: allVersions.length,
        dateRange: {
          start: actualStartDate ? safeToISOString(actualStartDate) : (startDate || null),
          end: actualEndDate ? safeToISOString(actualEndDate) : (endDate || null),
        },
        stats: {
          totalNotes: notes.length,
          versionsWithNames: allVersions.filter(v => v.name).length,
          importantVersions: allVersions.filter(v => v.isImportant).length,
        },
      })
      
      return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
    } catch (error) {
      const errorRequestId = getOrCreateRequestId(request)
      const errorContext = createRequestContext(request)
      
      // Auditar error antes de retornar
      auditSensitiveOperation('version.timeline.queried', errorContext, {
        severity: 'error',
        outcome: 'failure',
        error: error instanceof Error ? error : new Error(String(error)),
      })
      
      logger.error(
        { error, context: 'notes/versions/timeline/GET' },
        'Error al obtener timeline'
      )
      
      const response = NextResponse.json(
        { error: 'Error al obtener timeline' },
        { status: 500 }
      )
      return addTracingHeaders(addCorsHeaders(response), errorRequestId, Date.now() - startTime)
    }
    })
  )
}

/**
 * Agrupa versiones según la vista seleccionada
 */
function groupVersionsByView(
  versions: Array<{
    id: string
    noteId: string
    title: string
    content: string
    tags: string | null
    name: string | null
    color: string | null
    isImportant: boolean
    createdAt: Date
    noteTitle: string
    isCurrent?: boolean
  }>,
  view: 'day' | 'week' | 'month' | 'year'
): Array<{
  period: string
  periodLabel: string
  date: string
  versions: typeof versions
  count: number
}> {
  const groupsMap = new Map<string, typeof versions>()

  // CORRECCIÓN: Validar que versions sea un array válido antes de usar for...of
  if (!Array.isArray(versions) || versions.length === 0) {
    logger.warn(
      { versions },
      'groupVersionsByView: versions no es un array válido o está vacío, retornando array vacío'
    )
    return []
  }
  
  for (const version of versions) {
    let date = new Date(version.createdAt)
    let period: string
    let periodLabel: string = ''

    switch (view) {
      case 'day': {
        period = safeToISODate(date) || '1970-01-01'
        // CORRECCIÓN: Validar que date sea una fecha válida antes de usar toLocaleDateString()
        try {
          if (date instanceof Date && !Number.isNaN(date.getTime())) {
            const localeDateString = date.toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            periodLabel = typeof localeDateString === 'string' && localeDateString.length > 0
              ? localeDateString
              : period
          } else {
            logger.warn({ date }, 'timeline: date inválido en case day antes de toLocaleDateString, usando period')
            periodLabel = period
          }
        } catch (error) {
          logger.warn({ error, date }, 'timeline: Error al formatear fecha con toLocaleDateString en case day, usando period')
          periodLabel = period
        }
        break
      }

      case 'week': {
        // Calcular inicio de semana (lunes)
        // CORRECCIÓN: Validar que date sea una fecha válida antes de usar getDay() y getDate()
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
          logger.warn(
            { date },
            'timeline: date inválido en case week, usando fecha actual'
          )
          const fallbackDate = new Date()
          if (fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())) {
            date = fallbackDate
          } else {
            logger.error(
              { date, fallbackDate },
              'timeline: new Date() retornó fecha inválida en case week, usando 1970-01-01'
            )
            date = new Date('1970-01-01')
          }
        }
        
        const weekStart = new Date(date)
        // CORRECCIÓN: Validar que weekStart sea una fecha válida antes de usar setDate()
        if (!(weekStart instanceof Date) || Number.isNaN(weekStart.getTime())) {
          logger.error(
            { date, weekStart },
            'timeline: new Date(date) retornó fecha inválida en case week, usando fecha actual'
          )
          const fallbackWeekStart = new Date()
          if (fallbackWeekStart instanceof Date && !Number.isNaN(fallbackWeekStart.getTime())) {
            Object.assign(weekStart, fallbackWeekStart)
          } else {
            logger.error(
              { date, weekStart, fallbackWeekStart },
              'timeline: new Date() retornó fecha inválida en case week, usando 1970-01-01'
            )
            Object.assign(weekStart, new Date('1970-01-01'))
          }
        }
        
        // CORRECCIÓN: Validar que getDay() y getDate() retornen números válidos antes de calcular diff
        let dayOfWeek: number
        try {
          dayOfWeek = date.getDay()
          if (!Number.isFinite(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
            logger.warn(
              { date, dayOfWeek },
              'timeline: getDay() retornó valor inválido en case week, usando 0'
            )
            dayOfWeek = 0
          }
        } catch (error) {
          logger.warn(
            { error, date },
            'timeline: Error al ejecutar getDay() en case week, usando 0'
          )
          dayOfWeek = 0
        }
        
        let currentDate: number
        try {
          currentDate = date.getDate()
          if (!Number.isFinite(currentDate) || currentDate < 1 || currentDate > 31) {
            logger.warn(
              { date, currentDate },
              'timeline: getDate() retornó valor inválido en case week, usando 1'
            )
            currentDate = 1
          }
        } catch (error) {
          logger.warn(
            { error, date },
            'timeline: Error al ejecutar getDate() en case week, usando 1'
          )
          currentDate = 1
        }
        
        // Ajustar para que lunes = 1
        const diff = currentDate - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        // CORRECCIÓN: Validar que diff sea un número finito antes de usar setDate()
        if (!Number.isFinite(diff)) {
          logger.warn(
            { date, dayOfWeek, currentDate, diff },
            'timeline: diff calculado es inválido en case week, usando 1'
          )
          const safeDiff = 1
          try {
            weekStart.setDate(safeDiff)
          } catch (error) {
            logger.error(
              { error, weekStart, safeDiff },
              'timeline: Error al ejecutar setDate() en case week'
            )
          }
        } else {
          try {
            weekStart.setDate(diff)
          } catch (error) {
            logger.error(
              { error, weekStart, diff },
              'timeline: Error al ejecutar setDate() en case week'
            )
          }
        }
        period = safeToISODate(weekStart) || '1970-01-01'
        const weekEnd = new Date(weekStart)
        // CORRECCIÓN: Validar que weekEnd sea una fecha válida antes de usar setDate()
        if (weekEnd instanceof Date && !Number.isNaN(weekEnd.getTime())) {
          const currentDate = weekEnd.getDate()
          if (Number.isFinite(currentDate)) {
            const newDate = currentDate + 6
            if (Number.isFinite(newDate)) {
              weekEnd.setDate(newDate)
              // Validar que setDate() haya funcionado correctamente
              if (Number.isNaN(weekEnd.getTime())) {
                logger.warn({ weekStart, weekEnd, newDate }, 'timeline: setDate() resultó en fecha inválida en weekEnd (switch), usando fecha actual')
                weekEnd.setTime(Date.now())
              }
            }
          }
        }
        // CORRECCIÓN: Validar que weekStart y weekEnd sean fechas válidas antes de usar toLocaleDateString()
        let weekStartLabel = ''
        let weekEndLabel = ''
        try {
          if (weekStart instanceof Date && !Number.isNaN(weekStart.getTime())) {
            const localeString = weekStart.toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'short',
            })
            weekStartLabel = typeof localeString === 'string' && localeString.length > 0 ? localeString : ''
          }
        } catch (error) {
          logger.warn({ error, weekStart }, 'timeline: Error al formatear weekStart con toLocaleDateString (switch), usando string vacío')
        }
        try {
          if (weekEnd instanceof Date && !Number.isNaN(weekEnd.getTime())) {
            const localeString = weekEnd.toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
            weekEndLabel = typeof localeString === 'string' && localeString.length > 0 ? localeString : ''
          }
        } catch (error) {
          logger.warn({ error, weekEnd }, 'timeline: Error al formatear weekEnd con toLocaleDateString (switch), usando string vacío')
        }
        periodLabel = weekStartLabel && weekEndLabel ? `${weekStartLabel} - ${weekEndLabel}` : period
        break
      }

      case 'month': {
        // CORRECCIÓN: Validar que getMonth() retorne un número válido antes de usar padStart()
        const month = date.getMonth() + 1
        const safeMonth = Number.isFinite(month) && month >= 1 && month <= 12 ? month : 1
        const monthString = String(safeMonth)
        // Validar que monthString sea un string válido antes de usar padStart()
        const paddedMonth = typeof monthString === 'string' && monthString.length > 0
          ? monthString.padStart(2, '0')
          : '01'
        // Validar que padStart() retorne un string válido
        period = `${date.getFullYear()}-${typeof paddedMonth === 'string' ? paddedMonth : '01'}` // YYYY-MM
        // CORRECCIÓN: Validar que date sea una fecha válida antes de usar toLocaleDateString()
        try {
          if (date instanceof Date && !Number.isNaN(date.getTime())) {
            const localeDateString = date.toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
            })
            periodLabel = typeof localeDateString === 'string' && localeDateString.length > 0
              ? localeDateString
              : period
          } else {
            logger.warn({ date }, 'timeline: date inválido en case month antes de toLocaleDateString, usando period')
            periodLabel = period
          }
        } catch (error) {
          logger.warn({ error, date }, 'timeline: Error al formatear fecha con toLocaleDateString en case month, usando period')
          periodLabel = period
        }
        break
      }

      case 'year': {
        // CORRECCIÓN: Validar que getFullYear() retorne un número válido antes de usar String()
        const year = date.getFullYear()
        const safeYear = Number.isFinite(year) && year >= 1900 && year <= 2100 ? year : new Date().getFullYear()
        try {
          const yearString = String(safeYear)
          // Validar que String() retorne un string válido
          period = typeof yearString === 'string' && yearString.length > 0 ? yearString : String(new Date().getFullYear())
          periodLabel = period
        } catch (error) {
          logger.warn(
            { error, safeYear },
            'timeline: Error al ejecutar String() en year, usando año actual'
          )
          period = String(new Date().getFullYear())
          periodLabel = period
        }
        break
      }

      default: {
        period = safeToISODate(date) || '1970-01-01'
        periodLabel = period
        
        try {
          const localeDateString = date.toLocaleDateString('es-CL')
          // CORRECCIÓN: Validar que toLocaleDateString() retorne un string válido
          periodLabel = typeof localeDateString === 'string' && localeDateString.length > 0
            ? localeDateString
            : period
        } catch (error) {
          logger.warn(
            { error, date },
            'timeline: Error al formatear fecha con toLocaleDateString para default, usando period'
          )
          periodLabel = period
        }
      }
    }

    // Asegurar que periodLabel tenga un valor antes de usarlo
    if (!periodLabel) {
      periodLabel = period
    }

    // CORRECCIÓN: Validar que groupsMap sea un Map válido antes de usar has(), set() y get()
    if (groupsMap instanceof Map) {
      try {
        const hasPeriod = groupsMap.has(period)
        // Validar que has() retorne un booleano válido
        if (typeof hasPeriod === 'boolean' && !hasPeriod) {
          try {
            groupsMap.set(period, [])
          } catch (error) {
            logger.warn(
              { error, period },
              'timeline: Error al ejecutar set() en groupsMap, omitiendo versión'
            )
            continue
          }
        }
        
        // CORRECCIÓN: Validar que get() retorne un array válido antes de usar push()
        try {
          const versionsArray = groupsMap.get(period)
          if (Array.isArray(versionsArray)) {
            try {
              versionsArray.push(version)
            } catch (error) {
              logger.warn(
                { error, period, version },
                'timeline: Error al ejecutar push() en versionsArray, omitiendo versión'
              )
            }
          } else {
            logger.warn(
              { period, versionsArray },
              'timeline: get() retornó resultado inválido, omitiendo versión'
            )
          }
        } catch (error) {
          logger.warn(
            { error, period },
            'timeline: Error al ejecutar get() en groupsMap, omitiendo versión'
          )
        }
      } catch (error) {
        logger.warn(
          { error, period, version },
          'timeline: Error al procesar groupsMap, omitiendo versión'
        )
      }
    } else {
      logger.warn(
        { groupsMap, period, version },
        'timeline: groupsMap no es un Map válido, omitiendo versión'
      )
    }
  }

  // Convertir a array y ordenar por fecha (más reciente primero)
  // CORRECCIÓN: Validar que groupsMap sea un Map válido antes de usar entries()
  if (!groupsMap || !(groupsMap instanceof Map)) {
    logger.error(
      { groupsMap },
      'timeline: groupsMap no es un Map válido, retornando error'
    )
    throw new Error('Error interno al procesar grupos de versiones')
  }
  
  let groupsEntries: Array<[string, StudyNoteVersion[]]>
  try {
    groupsEntries = Array.from(groupsMap.entries())
    // Validar que Array.from() retorne un array válido
    if (!Array.isArray(groupsEntries)) {
      logger.error(
        { groupsMap, groupsEntries },
        'timeline: Array.from(groupsMap.entries()) retornó resultado inválido'
      )
      throw new Error('Error interno al procesar grupos de versiones')
    }
  } catch (error) {
    logger.error(
      { error, groupsMap },
      'timeline: Error al convertir groupsMap a array'
    )
    throw new Error('Error interno al procesar grupos de versiones')
  }
  
  const groups = groupsEntries
    .map(([period, versions]) => {
      // CORRECCIÓN: Validar que period sea un string válido y versions sea un array válido
      if (typeof period !== 'string' || !Array.isArray(versions)) {
        logger.warn(
          { period, versions },
          'timeline: period o versions inválidos en map de groups, retornando null'
        )
        return null
      }
      
      // Inicializar periodLabel (se calculará más adelante basado en latestDate)
      let periodLabel: string = period
      // Ordenar versiones dentro del grupo por fecha (más reciente primero)
      // CORRECCIÓN: Validar que versions sea un array válido antes de usar sort()
      if (!Array.isArray(versions) || versions.length === 0) {
        logger.warn(
          { period, versions },
          'timeline: versions no es un array válido o está vacío, saltando periodo'
        )
        return null
      }
      
      let sortedVersions: typeof versions
      try {
        sortedVersions = [...versions].sort((a, b) => {
          // CORRECCIÓN: Validar que a y b sean objetos válidos con createdAt antes de usar
          if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
            return 0
          }
          
          // Validar que createdAt exista y sea una fecha válida
          const aTime = a.createdAt instanceof Date && !Number.isNaN(a.createdAt.getTime())
            ? a.createdAt.getTime()
            : 0
          const bTime = b.createdAt instanceof Date && !Number.isNaN(b.createdAt.getTime())
            ? b.createdAt.getTime()
            : 0
          
          // Validar que los tiempos sean números finitos antes de restar
          const diff = Number.isFinite(aTime) && Number.isFinite(bTime) ? bTime - aTime : 0
          return Number.isFinite(diff) ? diff : 0
        })
        
        // Validar que sort() retorne un array válido
        if (!Array.isArray(sortedVersions)) {
          logger.warn(
            { period, versions, sortedVersions },
            'timeline: sort() retornó resultado inválido, usando versions original'
          )
          sortedVersions = versions
        }
      } catch (error) {
        logger.warn(
          { error, period, versions },
          'timeline: Error al ejecutar sort(), usando versions original'
        )
        sortedVersions = versions
      }

      // Obtener la fecha más reciente del grupo para el label
      // CORRECCIÓN: Validar que sortedVersions sea un array válido antes de acceder a [0]
      let latestDate: Date
      if (Array.isArray(sortedVersions) && sortedVersions.length > 0) {
        const firstVersion = sortedVersions[0]
        // Validar que firstVersion sea un objeto válido antes de acceder a createdAt
        if (firstVersion && typeof firstVersion === 'object' && 'createdAt' in firstVersion) {
          const createdAt = firstVersion.createdAt
          // Validar que createdAt sea una fecha válida
          if (createdAt instanceof Date && !Number.isNaN(createdAt.getTime())) {
            latestDate = createdAt
          } else {
            logger.warn(
              { firstVersion, createdAt },
              'timeline: createdAt inválido en primera versión, usando fecha actual'
            )
            const fallbackDate = new Date()
            latestDate = fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())
              ? fallbackDate
              : new Date(0) // Usar epoch como último recurso
          }
        } else {
          logger.warn(
            { firstVersion },
            'timeline: primera versión inválida, usando fecha actual'
          )
          const fallbackDate = new Date()
          latestDate = fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())
            ? fallbackDate
            : new Date(0) // Usar epoch como último recurso
        }
      } else {
        logger.warn(
          { sortedVersions },
          'timeline: sortedVersions está vacío o es inválido, usando fecha actual'
        )
        const fallbackDate = new Date()
        latestDate = fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())
          ? fallbackDate
          : new Date(0) // Usar epoch como último recurso
      }

      // CORRECCIÓN: Validar que latestDate sea una fecha válida antes de usar toLocaleDateString() y toISOString()
      if (latestDate instanceof Date && !Number.isNaN(latestDate.getTime())) {
        try {
          if (view === 'day') {
            const localeString = latestDate.toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            periodLabel = typeof localeString === 'string' && localeString.length > 0 ? localeString : period
          } else if (view === 'week') {
            const weekStart = new Date(latestDate)
            if (weekStart instanceof Date && !Number.isNaN(weekStart.getTime())) {
              const dayOfWeek = latestDate.getDay()
              const currentDate = latestDate.getDate()
              if (Number.isFinite(dayOfWeek) && Number.isFinite(currentDate)) {
                const diff = currentDate - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
                if (Number.isFinite(diff)) {
                  weekStart.setDate(diff)
                  if (Number.isNaN(weekStart.getTime())) {
                    logger.warn({ latestDate, diff }, 'timeline: setDate() resultó en fecha inválida en weekStart, usando fecha actual')
                    weekStart.setTime(Date.now())
                  }
                }
              }
              const weekEnd = new Date(weekStart)
              if (weekEnd instanceof Date && !Number.isNaN(weekEnd.getTime())) {
                const currentWeekEndDate = weekEnd.getDate()
                if (Number.isFinite(currentWeekEndDate)) {
                  const newWeekEndDate = currentWeekEndDate + 6
                  if (Number.isFinite(newWeekEndDate)) {
                    weekEnd.setDate(newWeekEndDate)
                    if (Number.isNaN(weekEnd.getTime())) {
                      logger.warn({ weekStart, newWeekEndDate }, 'timeline: setDate() resultó en fecha inválida en weekEnd, usando fecha actual')
                      weekEnd.setTime(Date.now())
                    }
                  }
                }
                try {
                  const weekStartLabel = weekStart.toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'short',
                  })
                  const weekEndLabel = weekEnd.toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  if (typeof weekStartLabel === 'string' && typeof weekEndLabel === 'string' && weekStartLabel.length > 0 && weekEndLabel.length > 0) {
                    periodLabel = `${weekStartLabel} - ${weekEndLabel}`
                  }
                } catch (error) {
                  logger.warn({ error, weekStart, weekEnd }, 'timeline: Error al formatear weekStart o weekEnd con toLocaleDateString, usando period')
                }
              }
            }
          } else if (view === 'month') {
            const localeString = latestDate.toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
            })
            periodLabel = typeof localeString === 'string' && localeString.length > 0 ? localeString : period
          }
        } catch (error) {
          logger.warn({ error, latestDate, view }, 'timeline: Error al formatear latestDate con toLocaleDateString, usando period')
        }
      } else {
        logger.warn({ latestDate }, 'timeline: latestDate inválido antes de formatear, usando period')
      }

      const safeDateString = safeToISOString(latestDate)

      // CORRECCIÓN: Validar que sortedVersions sea un array válido antes de acceder a length
      const safeSortedVersionsCount = Array.isArray(sortedVersions) && Number.isFinite(sortedVersions.length) && sortedVersions.length >= 0
        ? sortedVersions.length
        : 0
      
      return {
        period,
        periodLabel,
        date: safeDateString,
        versions: sortedVersions,
        count: safeSortedVersionsCount,
      }
    })
    .sort((a, b) => {
      // Ordenar grupos por fecha (más reciente primero)
      // CORRECCIÓN: Validar que a.date y b.date sean strings válidos antes de crear Date y usar getTime()
      if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
        return 0
      }
      const aDateString = typeof a.date === 'string' && a.date.length > 0 ? a.date : ''
      const bDateString = typeof b.date === 'string' && b.date.length > 0 ? b.date : ''
      if (!aDateString || !bDateString) {
        return 0
      }
      try {
        const aDate = new Date(aDateString)
        const bDate = new Date(bDateString)
        if (aDate instanceof Date && !Number.isNaN(aDate.getTime()) && bDate instanceof Date && !Number.isNaN(bDate.getTime())) {
          const aTime = aDate.getTime()
          const bTime = bDate.getTime()
          if (Number.isFinite(aTime) && Number.isFinite(bTime)) {
            return bTime - aTime
          }
        }
      } catch (error) {
        logger.warn({ error, aDate: aDateString, bDate: bDateString }, 'timeline: Error al crear Date o usar getTime() en sort de groups')
      }
      return 0
    })

  return groups
}

