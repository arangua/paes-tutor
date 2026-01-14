import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { parseRequestBody } from '../helpers'
import { safeMathMax } from '../validation-utils'

const mergeVersionsSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionIds: z
    .array(cuidValidator('ID de versión inválido'))
    .min(2, 'Debe proporcionar al menos 2 versiones para fusionar')
    .max(5, 'No se pueden fusionar más de 5 versiones a la vez'),
  mergeStrategy: z.enum(['append', 'interleave', 'smart']).default('append'),
  title: z.string().min(1).max(200).optional(),
})

/**
 * POST: Fusionar múltiples versiones de una nota
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
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

        // Parsear body JSON
        const bodyResult = await parseRequestBody(request, 'POST')
        if (!bodyResult.success) {
          return addTracingHeaders(bodyResult.error, requestId, Date.now() - startTime)
        }

        const validation = mergeVersionsSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionIds, mergeStrategy, title } = validation.data

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

      // Obtener las versiones a fusionar
      // CORRECCIÓN: Validar que versionIds sea un array válido antes de usar map()
      if (!Array.isArray(versionIds) || versionIds.length === 0) {
        const response = NextResponse.json(
          { error: 'versionIds debe ser un array válido con al menos un elemento' },
          { status: 400 }
        )
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      }
      
      let versionsToMerge: Array<{ id: string; title: string; content: string; tags: string | null; createdAt: Date } | null>
      try {
        // CORRECCIÓN: Validar que versionIds sea un array válido antes de usar Promise.all()
        if (!Array.isArray(versionIds) || versionIds.length === 0) {
          logger.error(
            { versionIds },
            'mergeVersions: versionIds no es un array válido o está vacío'
          )
          const response = NextResponse.json(
            { error: 'IDs de versiones inválidos' },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        // CORRECCIÓN: Validar que versionIds.map() retorne un array válido antes de usar Promise.all()
        const promises = versionIds.map(async (versionId) => {
          // CORRECCIÓN: Validar que versionId sea un string válido antes de usar
          if (!versionId || typeof versionId !== 'string' || versionId.length === 0) {
            logger.warn(
              { versionId },
              'mergeVersions: versionId inválido en map(), retornando null'
            )
            return null
          }
          
          if (versionId === noteId) {
            // Es la versión actual
            return {
              id: note.id,
              title: note.title,
              content: note.content,
              tags: note.tags,
              createdAt: note.updatedAt,
            }
          } else {
            // Es una versión histórica
            const version = await prisma.studyNoteVersion.findFirst({
              where: {
                id: versionId,
                noteId: note.id,
              },
            })
            return version
          }
        })
        
        // CORRECCIÓN: Asignar el resultado de Promise.all() a versionsToMerge
        versionsToMerge = await Promise.all(promises)
        
        // CORRECCIÓN: Validar que Promise.all() retorne un array válido
        if (!Array.isArray(versionsToMerge)) {
          logger.error(
            { versionIds, versionsToMerge },
            'mergeVersions: Promise.all() retornó resultado inválido'
          )
          const response = NextResponse.json(
            { error: 'Error al obtener versiones para fusionar' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
      } catch (error) {
        logger.error(
          { error, versionIds },
          'mergeVersions: Error en Promise.all() al obtener versiones'
        )
        const response = NextResponse.json(
          { error: 'Error al obtener versiones para fusionar' },
          { status: 500 }
        )
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      }

      // Verificar que todas las versiones existen
      // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar some()
      if (!Array.isArray(versionsToMerge)) {
        const response = NextResponse.json(
          { error: 'Error: versionsToMerge no es un array válido' },
          { status: 500 }
        )
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      }
      
      try {
        const hasNullVersions = versionsToMerge.some(v => !v)
        // Validar que some() retorne un booleano válido
        if (typeof hasNullVersions === 'boolean' && hasNullVersions) {
          const response = NextResponse.json(
            { error: 'Una o más versiones no encontradas' },
            { status: 404 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
      } catch (error) {
        logger.warn(
          { error, versionsToMerge },
          'mergeVersions: Error al ejecutar some(), asumiendo que todas las versiones existen'
        )
      }

      // Fusionar contenido según la estrategia
      let mergedContent = ''
      const mergedTags = new Set<string>()

      if (mergeStrategy === 'append') {
        // Simplemente concatenar todas las versiones
        // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar map()
        if (!Array.isArray(versionsToMerge)) {
          logger.error(
            { versionsToMerge },
            'mergeVersions: versionsToMerge no es un array válido en estrategia append'
          )
          const response = NextResponse.json(
            { error: 'Error interno al fusionar versiones' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        try {
          const mapped = versionsToMerge.map((v, idx) => {
            // Validar que v sea un objeto válido antes de acceder a propiedades
            if (!v || typeof v !== 'object') {
              logger.warn(
                { v, idx },
                'mergeVersions: versión inválida en map(), usando valores por defecto'
              )
              return `\n--- Versión ${idx + 1} (Fecha inválida) ---\n\n`
            }
            
            // Validar que createdAt sea válido antes de usar
            let dateString: string
            if (v.createdAt && (v.createdAt instanceof Date || typeof v.createdAt === 'string')) {
              try {
                const date = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt)
                if (date instanceof Date && !Number.isNaN(date.getTime())) {
                  const localeString = date.toLocaleString('es-CL')
                  dateString = typeof localeString === 'string' && localeString.length > 0 ? localeString : 'Fecha inválida'
                } else {
                  dateString = 'Fecha inválida'
                }
              } catch (error) {
                logger.warn({ error, createdAt: v.createdAt }, 'Error al formatear fecha, usando fallback')
                dateString = 'Fecha inválida'
              }
            } else {
              dateString = 'Fecha inválida'
            }
            
            // CORRECCIÓN: Validar que idx sea un número válido antes de usar en template string
            const safeIdx = Number.isFinite(idx) && idx >= 0 ? idx : 0
            const safeIdxPlusOne = safeIdx + 1
            // Validar que safeIdxPlusOne sea un número finito
            const versionNumber = Number.isFinite(safeIdxPlusOne) && safeIdxPlusOne > 0 ? safeIdxPlusOne : 1
            // CORRECCIÓN: Validar que dateString sea un string válido antes de usar en template string
            const safeDateString = typeof dateString === 'string' && dateString.length > 0 ? dateString : 'Fecha inválida'
            const header = `\n--- Versión ${versionNumber} (${safeDateString}) ---\n\n`
            const content = v.content && typeof v.content === 'string' ? v.content : ''
            return header + content
          })
          
          // Validar que mapped sea un array válido antes de usar join()
          if (!Array.isArray(mapped)) {
            logger.error(
              { versionsToMerge, mapped },
              'mergeVersions: map() retornó resultado inválido en estrategia append'
            )
            const response = NextResponse.json(
              { error: 'Error interno al fusionar versiones' },
              { status: 500 }
            )
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
          
          // CORRECCIÓN: Validar que mapped sea un array válido antes de usar join()
          let joinedContent = ''
          try {
            if (Array.isArray(mapped) && mapped.length > 0) {
              const joined = mapped.join('\n\n')
              // Validar que join() retorne un string válido
              joinedContent = typeof joined === 'string' ? joined : ''
            } else {
              joinedContent = ''
            }
          } catch (error) {
            logger.warn(
              { error, mapped },
              'mergeVersions: Error al ejecutar join() en mapped, usando string vacío'
            )
            joinedContent = ''
          }
          
          mergedContent = joinedContent
        } catch (error) {
          logger.error(
            { error, versionsToMerge },
            'mergeVersions: Error al ejecutar map() o join() en estrategia append'
          )
          const response = NextResponse.json(
            { error: 'Error interno al fusionar versiones' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar forEach()
        if (Array.isArray(versionsToMerge)) {
          try {
            versionsToMerge.forEach(v => {
              // Validar que v sea un objeto válido antes de acceder a tags
              if (v && typeof v === 'object' && v.tags && typeof v.tags === 'string' && v.tags.length > 0) {
                try {
                  const tagsArray = v.tags.split(',')
                  // Validar que split() retorne un array válido
                  if (Array.isArray(tagsArray)) {
                    tagsArray.forEach(tag => {
                      // Validar que tag sea un string válido antes de usar trim()
                      if (tag && typeof tag === 'string') {
                        try {
                          const trimmed = tag.trim()
                          // Validar que trim() retorne un string válido antes de usar add()
                          if (typeof trimmed === 'string' && trimmed.length > 0) {
                            // CORRECCIÓN: Validar que mergedTags sea un Set válido antes de usar add()
                            if (mergedTags instanceof Set) {
                              try {
                                mergedTags.add(trimmed)
                              } catch (error) {
                                logger.warn(
                                  { error, trimmed },
                                  'Error al ejecutar add() en mergedTags, omitiendo tag'
                                )
                              }
                            } else {
                              logger.warn(
                                { mergedTags, trimmed },
                                'mergedTags no es un Set válido, omitiendo tag'
                              )
                            }
                          }
                        } catch (error) {
                          logger.warn({ error, tag }, 'Error al ejecutar trim() en tag, omitiendo')
                        }
                      }
                    })
                  }
                } catch (error) {
                  logger.warn({ error, tags: v.tags }, 'Error al ejecutar split() en tags, omitiendo')
                }
              }
            })
          } catch (error) {
            logger.warn({ error, versionsToMerge }, 'Error al ejecutar forEach() en tags, continuando')
          }
        }
      } else if (mergeStrategy === 'interleave') {
        // Intercalar párrafos de cada versión
        // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar map()
        if (!Array.isArray(versionsToMerge)) {
          logger.error(
            { versionsToMerge },
            'mergeVersions: versionsToMerge no es un array válido en estrategia interleave'
          )
          const response = NextResponse.json(
            { error: 'Error interno al fusionar versiones' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        let contents: string[][]
        try {
          contents = versionsToMerge.map(v => {
            // Validar que v sea un objeto válido con content antes de usar split()
            if (!v || typeof v !== 'object' || !v.content || typeof v.content !== 'string') {
              logger.warn({ v }, 'mergeVersions: versión inválida en map() de interleave, usando array vacío')
              return []
            }
            
            try {
              const split = v.content.split('\n\n')
              // Validar que split() retorne un array válido
              return Array.isArray(split) ? split : []
            } catch (error) {
              logger.warn({ error, content: v.content }, 'Error al ejecutar split() en content, usando array vacío')
              return []
            }
          })
          
          // Validar que contents sea un array válido
          if (!Array.isArray(contents)) {
            logger.error(
              { versionsToMerge, contents },
              'mergeVersions: map() retornó resultado inválido en estrategia interleave'
            )
            const response = NextResponse.json(
              { error: 'Error interno al fusionar versiones' },
              { status: 500 }
            )
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
        } catch (error) {
          logger.error(
            { error, versionsToMerge },
            'mergeVersions: Error al ejecutar map() en estrategia interleave'
          )
          const response = NextResponse.json(
            { error: 'Error interno al fusionar versiones' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        // CORRECCIÓN: Validar que contents sea un array válido antes de usar Math.max()
        let maxLength: number
        try {
          const lengths = contents.map(c => {
            // Validar que c sea un array válido
            return Array.isArray(c) && Number.isFinite(c.length) ? c.length : 0
          })
          
          // Validar que lengths sea un array válido antes de usar Math.max()
          if (!Array.isArray(lengths) || lengths.length === 0) {
            logger.warn(
              { contents, lengths },
              'mergeVersions: lengths está vacío o es inválido, usando 0'
            )
            maxLength = 0
          } else {
            // CORRECCIÓN: Validar que lengths tenga elementos válidos antes de usar spread operator con Math.max()
            const validLengths = lengths.filter(l => Number.isFinite(l) && l >= 0)
            if (Array.isArray(validLengths) && validLengths.length > 0) {
              try {
                maxLength = safeMathMax(validLengths, 0)
              } catch (error) {
                logger.warn(
                  { error, validLengths },
                  'mergeVersions: Error al ejecutar Math.max() con spread operator, usando 0'
                )
                maxLength = 0
              }
            } else {
              logger.warn(
                { lengths, validLengths },
                'mergeVersions: validLengths está vacío o es inválido, usando 0'
              )
              maxLength = 0
            }
          }
        } catch (error) {
          logger.warn(
            { error, contents },
            'mergeVersions: Error al calcular maxLength, usando 0'
          )
          maxLength = 0
        }
        
        // CORRECCIÓN: Validar que maxLength sea un número válido antes de usar en for loop
        const safeMaxLength = Number.isFinite(maxLength) && maxLength >= 0 ? maxLength : 0
        
        for (let i = 0; i < safeMaxLength; i++) {
          // CORRECCIÓN: Validar que contents sea un array válido antes de usar forEach()
          if (Array.isArray(contents)) {
            try {
              contents.forEach((paragraphs, versionIdx) => {
                // Validar que paragraphs sea un array válido
                if (Array.isArray(paragraphs)) {
                  // Validar que i sea un número válido antes de acceder a array
                  const safeI = Number.isFinite(i) && i >= 0 ? i : 0
                  // CORRECCIÓN: Validar que paragraphs.length sea un número finito antes de comparar
                  const safeParagraphsLength = Number.isFinite(paragraphs.length) && paragraphs.length >= 0
                    ? paragraphs.length
                    : 0
                  // CORRECCIÓN: Validar que versionIdx sea un número válido antes de sumar
                  const safeVersionIdx = Number.isFinite(versionIdx) && versionIdx >= 0 ? versionIdx : 0
                  const safeVersionIdxPlusOne = safeVersionIdx + 1
                  const versionNumber = Number.isFinite(safeVersionIdxPlusOne) && safeVersionIdxPlusOne > 0
                    ? safeVersionIdxPlusOne
                    : 1
                  if (safeI < safeParagraphsLength && paragraphs[safeI] && typeof paragraphs[safeI] === 'string') {
                    mergedContent += `[V${versionNumber}] ${paragraphs[safeI]}\n\n`
                  }
                }
              })
            } catch (error) {
              logger.warn({ error, i, contents }, 'Error al ejecutar forEach() en contents, saltando iteración')
            }
          }
        }
        
        // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar forEach()
        if (Array.isArray(versionsToMerge)) {
          try {
            versionsToMerge.forEach(v => {
              // Validar que v sea un objeto válido antes de acceder a tags
              if (v && typeof v === 'object' && v.tags && typeof v.tags === 'string' && v.tags.length > 0) {
                try {
                  const tagsArray = v.tags.split(',')
                  // Validar que split() retorne un array válido
                  if (Array.isArray(tagsArray)) {
                    tagsArray.forEach(tag => {
                      // Validar que tag sea un string válido antes de usar trim()
                      if (tag && typeof tag === 'string') {
                        try {
                          const trimmed = tag.trim()
                          // Validar que trim() retorne un string válido antes de usar add()
                          if (typeof trimmed === 'string' && trimmed.length > 0) {
                            // CORRECCIÓN: Validar que mergedTags sea un Set válido antes de usar add()
                            if (mergedTags instanceof Set) {
                              try {
                                mergedTags.add(trimmed)
                              } catch (error) {
                                logger.warn(
                                  { error, trimmed },
                                  'Error al ejecutar add() en mergedTags, omitiendo tag'
                                )
                              }
                            } else {
                              logger.warn(
                                { mergedTags, trimmed },
                                'mergedTags no es un Set válido, omitiendo tag'
                              )
                            }
                          }
                        } catch (error) {
                          logger.warn({ error, tag }, 'Error al ejecutar trim() en tag, omitiendo')
                        }
                      }
                    })
                  }
                } catch (error) {
                  logger.warn({ error, tags: v.tags }, 'Error al ejecutar split() en tags, omitiendo')
                }
              }
            })
          } catch (error) {
            logger.warn({ error, versionsToMerge }, 'Error al ejecutar forEach() en tags, continuando')
          }
        }
      } else {
        // Estrategia 'smart': usar la versión más reciente como base y agregar cambios únicos
        // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar sort()
        if (!Array.isArray(versionsToMerge) || versionsToMerge.length === 0) {
          logger.warn(
            { versionsToMerge },
            'mergeVersions: versionsToMerge no es un array válido o está vacío, usando estrategia simple'
          )
          // Usar estrategia simple si no hay versiones válidas
          const simpleMerged = (() => {
            // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de acceder a [0]
            if (versionsToMerge && Array.isArray(versionsToMerge) && versionsToMerge.length > 0) {
              const firstVersion = versionsToMerge[0]
              // Validar que firstVersion sea un objeto válido antes de acceder a content
              if (firstVersion && typeof firstVersion === 'object' && 'content' in firstVersion) {
                const content = firstVersion.content
                // Validar que content sea un string válido
                return typeof content === 'string' ? content : ''
              } else {
                logger.warn(
                  { firstVersion },
                  'mergeVersions: primera versión inválida en estrategia simple, usando string vacío'
                )
                return ''
              }
            } else {
              return ''
            }
          })()
          return simpleMerged
        }
        
        let sortedVersions: typeof versionsToMerge
        try {
          sortedVersions = [...versionsToMerge].sort((a, b) => {
            // CORRECCIÓN: Validar que a y b sean objetos válidos con createdAt antes de usar
            if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
              return 0
            }
            
            // Validar que createdAt exista y sea válido
            const aDate = a.createdAt && (a.createdAt instanceof Date || typeof a.createdAt === 'string')
              ? new Date(a.createdAt)
              : new Date(0)
            const bDate = b.createdAt && (b.createdAt instanceof Date || typeof b.createdAt === 'string')
              ? new Date(b.createdAt)
              : new Date(0)
            
            // Validar que las fechas sean válidas
            const aTime = aDate instanceof Date && !Number.isNaN(aDate.getTime()) ? aDate.getTime() : 0
            const bTime = bDate instanceof Date && !Number.isNaN(bDate.getTime()) ? bDate.getTime() : 0
            
            // Validar que los tiempos sean números finitos antes de restar
            const diff = Number.isFinite(aTime) && Number.isFinite(bTime) ? bTime - aTime : 0
            return Number.isFinite(diff) ? diff : 0
          })
          
          // Validar que sort() retorne un array válido
          if (!Array.isArray(sortedVersions)) {
            logger.warn(
              { versionsToMerge, sortedVersions },
              'mergeVersions: sort() retornó resultado inválido, usando primera versión'
            )
            sortedVersions = versionsToMerge
          }
        } catch (error) {
          logger.warn(
            { error, versionsToMerge },
            'mergeVersions: Error al ejecutar sort(), usando primera versión'
          )
          sortedVersions = versionsToMerge
        }
        // CORRECCIÓN: Validar que sortedVersions sea un array válido antes de acceder a [0]
        if (!Array.isArray(sortedVersions) || sortedVersions.length === 0) {
          logger.error(
            { sortedVersions },
            'mergeVersions: sortedVersions no es un array válido o está vacío en estrategia smart'
          )
          const response = NextResponse.json(
            { error: 'Error interno al fusionar versiones' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        const baseVersion = sortedVersions[0]
        // Validar que baseVersion sea un objeto válido
        if (!baseVersion || typeof baseVersion !== 'object' || !baseVersion.content || typeof baseVersion.content !== 'string') {
          logger.error(
            { baseVersion },
            'mergeVersions: baseVersion inválido en estrategia smart'
          )
          const response = NextResponse.json(
            { error: 'Error interno al fusionar versiones' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        mergedContent = baseVersion.content
        
        // Agregar contenido único de otras versiones
        // CORRECCIÓN: Validar que baseVersion.content sea un string válido antes de usar toLowerCase() y split()
        let baseWords: Set<string>
        try {
          const lowercased = baseVersion.content.toLowerCase()
          if (typeof lowercased === 'string') {
            const wordsArray = lowercased.split(/\s+/)
            // Validar que split() retorne un array válido
            if (Array.isArray(wordsArray)) {
              baseWords = new Set(wordsArray.filter(w => typeof w === 'string' && w.length > 0))
            } else {
              baseWords = new Set<string>()
            }
          } else {
            baseWords = new Set<string>()
          }
        } catch (error) {
          logger.warn({ error, content: baseVersion.content }, 'Error al crear baseWords, usando Set vacío')
          baseWords = new Set<string>()
        }
        
        // CORRECCIÓN: Validar que sortedVersions sea un array válido antes de usar slice()
        if (Array.isArray(sortedVersions) && sortedVersions.length > 1) {
          try {
            const remainingVersions = sortedVersions.slice(1)
            // Validar que slice() retorne un array válido
            if (Array.isArray(remainingVersions)) {
              remainingVersions.forEach((v, idx) => {
                // Validar que v sea un objeto válido antes de acceder a content
                if (!v || typeof v !== 'object' || !v.content || typeof v.content !== 'string') {
                  logger.warn(
                    { v, idx },
                    'mergeVersions: versión inválida en forEach() de smart, omitiendo'
                  )
                  return
                }
                
                try {
                  const paragraphs = v.content.split('\n\n')
                  // Validar que split() retorne un array válido
                  if (!Array.isArray(paragraphs)) {
                    logger.warn(
                      { content: v.content, paragraphs },
                      'mergeVersions: split() retornó resultado inválido, omitiendo versión'
                    )
                    return
                  }
                  
                  const uniqueParts = paragraphs.filter(para => {
                    // Validar que para sea un string válido
                    if (!para || typeof para !== 'string') {
                      return false
                    }
                    
                    try {
                      const lowercased = para.toLowerCase()
                      if (typeof lowercased !== 'string') {
                        return false
                      }
                      
                      const words = lowercased.split(/\s+/)
                      // Validar que split() retorne un array válido
                      if (!Array.isArray(words)) {
                        return false
                      }
                      
                      // CORRECCIÓN: Validar que words sea un array válido antes de usar some()
                      try {
                        const hasUniqueWord = words.some(w => {
                          // Validar que w sea un string válido antes de usar has()
                          return typeof w === 'string' && w.length > 0 && !baseWords.has(w)
                        })
                        return typeof hasUniqueWord === 'boolean' ? hasUniqueWord : false
                      } catch (error) {
                        logger.warn({ error, words }, 'Error al ejecutar some() en words, retornando false')
                        return false
                      }
                    } catch (error) {
                      logger.warn({ error, para }, 'Error al procesar para, retornando false')
                      return false
                    }
                  })
                  
                  // Validar que filter() retorne un array válido
                  if (Array.isArray(uniqueParts) && uniqueParts.length > 0) {
                    try {
                      const joined = uniqueParts.join('\n\n')
                      // Validar que join() retorne un string válido
                      if (typeof joined === 'string' && joined.length > 0) {
                        // CORRECCIÓN: Validar que idx sea un número válido antes de sumar
                        const safeIdx = Number.isFinite(idx) && idx >= 0 ? idx : 0
                        const safeIdxPlusTwo = safeIdx + 2
                        const versionNumber = Number.isFinite(safeIdxPlusTwo) && safeIdxPlusTwo > 0 ? safeIdxPlusTwo : 2
                        mergedContent += `\n\n--- Contenido adicional de versión ${versionNumber} ---\n\n`
                        mergedContent += joined
                      }
                    } catch (error) {
                      logger.warn({ error, uniqueParts }, 'Error al ejecutar join() en uniqueParts, omitiendo')
                    }
                  }
                } catch (error) {
                  logger.warn({ error, v }, 'Error al procesar versión en forEach() de smart, omitiendo')
                }
              })
            }
          } catch (error) {
            logger.warn({ error, sortedVersions }, 'Error al ejecutar slice() o forEach() en smart, continuando')
          }
        }
        
        // CORRECCIÓN: Validar que versionsToMerge sea un array válido antes de usar forEach()
        if (Array.isArray(versionsToMerge)) {
          try {
            versionsToMerge.forEach(v => {
              // Validar que v sea un objeto válido antes de acceder a tags
              if (v && typeof v === 'object' && v.tags && typeof v.tags === 'string' && v.tags.length > 0) {
                try {
                  const tagsArray = v.tags.split(',')
                  // Validar que split() retorne un array válido
                  if (Array.isArray(tagsArray)) {
                    tagsArray.forEach(tag => {
                      // Validar que tag sea un string válido antes de usar trim()
                      if (tag && typeof tag === 'string') {
                        try {
                          const trimmed = tag.trim()
                          // Validar que trim() retorne un string válido antes de usar add()
                          if (typeof trimmed === 'string' && trimmed.length > 0) {
                            // CORRECCIÓN: Validar que mergedTags sea un Set válido antes de usar add()
                            if (mergedTags instanceof Set) {
                              try {
                                mergedTags.add(trimmed)
                              } catch (error) {
                                logger.warn(
                                  { error, trimmed },
                                  'Error al ejecutar add() en mergedTags, omitiendo tag'
                                )
                              }
                            } else {
                              logger.warn(
                                { mergedTags, trimmed },
                                'mergedTags no es un Set válido, omitiendo tag'
                              )
                            }
                          }
                        } catch (error) {
                          logger.warn({ error, tag }, 'Error al ejecutar trim() en tag, omitiendo')
                        }
                      }
                    })
                  }
                } catch (error) {
                  logger.warn({ error, tags: v.tags }, 'Error al ejecutar split() en tags, omitiendo')
                }
              }
            })
          } catch (error) {
            logger.warn({ error, versionsToMerge }, 'Error al ejecutar forEach() en tags, continuando')
          }
        }
      }

      // Crear nueva nota con el contenido fusionado
      const mergedNote = await prisma.studyNote.create({
        data: {
          title: (() => {
            // CORRECCIÓN: Validar que title sea válido, y si no, validar que new Date().toLocaleString() retorne un string válido
            if (title && typeof title === 'string' && title.length > 0) {
              return title
            }
            try {
              const date = new Date()
              // Validar que date sea una fecha válida
              if (date instanceof Date && !Number.isNaN(date.getTime())) {
                const localeString = date.toLocaleString('es-CL')
                // Validar que toLocaleString() retorne un string válido
                return typeof localeString === 'string' && localeString.length > 0
                  ? `Nota fusionada - ${localeString}`
                  : 'Nota fusionada'
              } else {
                logger.warn(
                  { date },
                  'mergeVersions: new Date() retornó fecha inválida, usando título por defecto'
                )
                return 'Nota fusionada'
              }
            } catch (error) {
              logger.warn(
                { error },
                'mergeVersions: Error al formatear fecha para título, usando título por defecto'
              )
              return 'Nota fusionada'
            }
          })(),
          content: (() => {
            // CORRECCIÓN: Validar que mergedContent sea un string válido antes de usar trim()
            if (mergedContent && typeof mergedContent === 'string') {
              try {
                const trimmed = mergedContent.trim()
                // Validar que trim() retorne un string válido
                return typeof trimmed === 'string' ? trimmed : ''
              } catch (error) {
                logger.warn({ error, mergedContent }, 'Error al ejecutar trim() en mergedContent, usando sin trim')
                return typeof mergedContent === 'string' ? mergedContent : ''
              }
            }
            return ''
          })(),
          tags: (() => {
            // CORRECCIÓN: Validar que mergedTags sea un Set válido antes de usar Array.from()
            if (!mergedTags || !(mergedTags instanceof Set)) {
              logger.warn(
                { mergedTags },
                'mergeVersions: mergedTags no es un Set válido, usando string vacío'
              )
              return ''
            }
            
            try {
              const tagsArray = Array.from(mergedTags)
              // Validar que Array.from() retorne un array válido
              if (!Array.isArray(tagsArray)) {
                logger.warn(
                  { mergedTags, tagsArray },
                  'mergeVersions: Array.from() retornó resultado inválido, usando string vacío'
                )
                return ''
              }
              
              // Filtrar solo strings válidos
              const validTags = tagsArray.filter(tag => typeof tag === 'string' && tag.length > 0)
              
              // Validar que validTags sea un array válido antes de usar join()
              if (!Array.isArray(validTags)) {
                logger.warn(
                  { tagsArray, validTags },
                  'mergeVersions: filter() retornó resultado inválido, usando string vacío'
                )
                return ''
              }
              
              const joined = validTags.join(', ')
              // Validar que join() retorne un string válido
              return typeof joined === 'string' ? joined : ''
            } catch (error) {
              logger.warn(
                { error, mergedTags },
                'mergeVersions: Error al ejecutar Array.from() o join(), usando string vacío'
              )
              return ''
            }
          })(),
          studentId: dbUser.student.id,
        },
      })

        // Auditar operación
        auditSensitiveOperation('version.merged', enrichedContext, {
          metadata: { noteId, versionIds, mergeStrategy, mergedNoteId: mergedNote.id },
        })

        const response = NextResponse.json(
          {
            message: 'Versiones fusionadas correctamente',
            mergedNote: {
              id: mergedNote.id,
              title: mergedNote.title,
              content: mergedNote.content,
              tags: mergedNote.tags,
            },
          },
          { status: 201 }
        )
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.merged', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'POST')
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

