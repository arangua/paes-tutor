import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { Document, Packer, Paragraph, HeadingLevel } from 'docx'
import { decompressVersionContent } from '@/lib/utils/version-content'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { parseRequestBody } from '../helpers'
import { safeToISODate, safeToISOString } from '../validation-utils'

const exportBulkSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionIds: z
    .array(cuidValidator('ID de versión inválido'))
    .min(1, 'Debe proporcionar al menos una versión para exportar')
    .max(50, 'No se pueden exportar más de 50 versiones a la vez'),
  format: z.enum(['docx', 'odt', 'rtf', 'json', 'zip']).default('docx'),
})

/**
 * POST: Exportar múltiples versiones en formato de documento
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

        const validation = exportBulkSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionIds, format } = validation.data

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

      // Obtener las versiones seleccionadas con contenido descomprimido
      const versions = await Promise.all(
        versionIds.map(async (versionId) => {
          if (versionId === noteId) {
            return {
              id: note.id,
              title: note.title,
              content: note.content,
              tags: note.tags,
              createdAt: note.updatedAt,
              name: null,
              isImportant: false,
              color: null,
            }
          } else {
            const version = await prisma.studyNoteVersion.findFirst({
              where: {
                id: versionId,
                noteId: note.id,
              },
            })
            if (!version) {
              return null
            }
            
            // Descomprimir si está comprimida
            const isCompressed = (version as { isCompressed?: boolean }).isCompressed || false
            const content = await decompressVersionContent(version.content, isCompressed, 'versions/export-bulk')
            
            return {
              id: version.id,
              title: version.title,
              content,
              tags: version.tags,
              createdAt: version.createdAt,
              name: (version as { name?: string | null }).name || null,
              isImportant: (version as { isImportant?: boolean }).isImportant || false,
              color: (version as { color?: string | null }).color || null,
            }
          }
        })
      )

      // Filtrar versiones nulas
      const validVersions = versions.filter(v => v !== null) as Array<{
        id: string
        title: string
        content: string
        tags: string | null
        createdAt: Date
        name: string | null
        isImportant: boolean
        color: string | null
      }>

        if (validVersions.length === 0) {
          const response = NextResponse.json(
            { error: 'No se encontraron versiones válidas' },
            { status: 404 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

      if (format === 'docx') {
        // Generar documento DOCX
        // CORRECCIÓN: Validar que validVersions sea un array válido antes de usar flatMap()
        if (!Array.isArray(validVersions)) {
          logger.error(
            { validVersions },
            'export-bulk: validVersions no es un array válido, retornando error'
          )
          const response = NextResponse.json(
            { error: 'Error interno: validVersions inválido' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        let children: unknown[] = []
        try {
          // CORRECCIÓN: Validar que validVersions sea un array válido antes de usar flatMap()
          if (!Array.isArray(validVersions)) {
            logger.error(
              { validVersions },
              'export-bulk: validVersions no es un array válido antes de flatMap()'
            )
            const response = NextResponse.json(
              { error: 'Error interno al procesar versiones' },
              { status: 500 }
            )
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
          
          const mapped = validVersions.flatMap((v, idx) => {
            // CORRECCIÓN: Validar que v sea un objeto válido antes de acceder a propiedades
            if (!v || typeof v !== 'object') {
              logger.warn(
                { v, idx },
                'export-bulk: versión inválida en flatMap(), retornando array vacío'
              )
              return []
            }
            
            // Validar que idx sea un número válido
            const safeIdx = Number.isFinite(idx) && idx >= 0 ? idx : 0
            
            return [
              new Paragraph({
                text: `Versión ${safeIdx + 1}${v.name && typeof v.name === 'string' && v.name.length > 0 ? `: ${v.name}` : ''}`,
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph({
                text: (() => {
                  // CORRECCIÓN: Validar que v.createdAt sea válido antes de usar new Date() y toLocaleString()
                  if (v.createdAt && (v.createdAt instanceof Date || typeof v.createdAt === 'string')) {
                    try {
                      const date = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt)
                      if (date instanceof Date && !Number.isNaN(date.getTime())) {
                        const localeString = date.toLocaleString('es-CL')
                        return typeof localeString === 'string' && localeString.length > 0 ? `Fecha: ${localeString}` : 'Fecha: Inválida'
                      }
                    } catch (error) {
                      logger.warn({ error, createdAt: v.createdAt }, 'Error al formatear fecha, usando fallback')
                    }
                  }
                  return 'Fecha: Inválida'
                })(),
              }),
              ...(v.tags && typeof v.tags === 'string' && v.tags.length > 0
                ? [
                    new Paragraph({
                      text: `Tags: ${v.tags}`,
                    }),
                  ]
                : []),
              new Paragraph({
                text: v.title && typeof v.title === 'string' ? v.title : '',
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: v.content && typeof v.content === 'string' ? v.content : '',
              }),
              new Paragraph({
                text: '',
              }), // Espacio entre versiones
            ]
          })
        
        // CORRECCIÓN: Asignar el resultado de flatMap() a children
        children = mapped

        const doc = new Document({
          sections: [
            {
              children: [
                new Paragraph({
                  text: `Versiones de: ${note.title}`,
                  heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                  text: (() => {
                    // CORRECCIÓN: Validar que new Date().toLocaleString() retorne un string válido
                    try {
                      const exportDate = new Date()
                      if (exportDate instanceof Date && !Number.isNaN(exportDate.getTime())) {
                        const localeString = exportDate.toLocaleString('es-CL')
                        return typeof localeString === 'string' && localeString.length > 0
                          ? `Exportado el: ${localeString}`
                          : 'Exportado el: Fecha inválida'
                      } else {
                        return 'Exportado el: Fecha inválida'
                      }
                    } catch (error) {
                      logger.warn({ error }, 'export-bulk: Error al formatear fecha de exportación, usando fallback')
                      return 'Exportado el: Fecha inválida'
                    }
                  })(),
                }),
                new Paragraph({
                  text: '',
                }),
                // CORRECCIÓN: Validar que children sea un array válido antes de usar spread operator
                ...(Array.isArray(children) ? children : []),
              ],
            },
          ],
        })

          const buffer = await Packer.toBuffer(doc)
          const dateStr = safeToISODate(new Date()) || 'unknown'

          // Auditar operación
          // CORRECCIÓN: Validar que validVersions sea un array válido antes de acceder a length
          const safeVersionCount = Array.isArray(validVersions) && Number.isFinite(validVersions.length) && validVersions.length >= 0
            ? validVersions.length
            : 0
          auditSensitiveOperation('version.exported_bulk', enrichedContext, {
            metadata: { noteId, versionIds, format, versionCount: safeVersionCount },
          })

          const response = new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // guard:allow-secret
              'Content-Disposition': `attachment; filename="versiones_${dateStr}.docx"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
        } catch (error) {
          logger.error({ error }, 'export-bulk: Error al generar documento DOCX')
          const response = NextResponse.json(
            { error: 'Error al generar documento' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
      } else if (format === 'rtf') {
        // Generar RTF simple
        let rtfContent = '{\\rtf1\\ansi\\deff0\n'
        rtfContent += `{\\fonttbl{\\f0 Times New Roman;}}\n`
        rtfContent += `{\\colortbl;\\red0\\green0\\blue0;}\n`
        rtfContent += `\\f0\\fs24\n\n`
        // CORRECCIÓN: Validar que note exista y que note.title sea un string válido antes de usar en template string
        const safeNoteTitle = note && typeof note === 'object' && typeof note.title === 'string' && note.title.length > 0
          ? note.title
          : 'Nota sin título'
        rtfContent += `{\\b Versiones de: ${safeNoteTitle}}\\par\n`
        const exportDateString = safeToISOString(new Date()) || 'Fecha inválida'
        rtfContent += `Exportado el: ${exportDateString}\\par\n\\par\n`

        if (Array.isArray(validVersions)) {
          try {
            validVersions.forEach((v, idx) => {
              // Validar que v sea un objeto válido antes de acceder a propiedades
              if (!v || typeof v !== 'object') {
                logger.warn({ v, idx }, 'export-bulk: versión inválida en forEach() RTF, omitiendo')
                return
              }
              
              // Validar que idx sea un número válido
              const safeIdx = Number.isFinite(idx) && idx >= 0 ? idx : 0
              const safeName = v.name && typeof v.name === 'string' && v.name.length > 0 ? v.name : ''
              rtfContent += `{\\b Versión ${safeIdx + 1}${safeName ? `: ${safeName}` : ''}}\\par\n`
              
              if (v.createdAt) {
                try {
                  const date = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt)
                  if (date instanceof Date && !Number.isNaN(date.getTime())) {
                    try {
                      const localeString = date.toLocaleString('es-CL')
                      rtfContent += `Fecha: ${typeof localeString === 'string' && localeString.length > 0 ? localeString : 'Fecha inválida'}\\par\n`
                    } catch {
                      rtfContent += `Fecha: Inválida\\par\n`
                    }
                  } else {
                    rtfContent += `Fecha: Inválida\\par\n`
                  }
                } catch (error) {
                  logger.warn({ error, createdAt: v.createdAt }, 'Error al formatear fecha en RTF')
                  rtfContent += `Fecha: Inválida\\par\n`
                }
              } else {
                rtfContent += `Fecha: Inválida\\par\n`
              }
              
              if (v.tags && typeof v.tags === 'string' && v.tags.length > 0) {
                rtfContent += `Tags: ${v.tags}\\par\n`
              }
              
              const safeTitle = v.title && typeof v.title === 'string' ? v.title : ''
              rtfContent += `{\\b ${safeTitle}}\\par\n`
              
              const safeContent = v.content && typeof v.content === 'string' ? v.content : ''
              try {
                const replaced = safeContent.replace(/\n/g, '\\par\n')
                rtfContent += `${typeof replaced === 'string' ? replaced : safeContent}\\par\n\\par\n`
              } catch {
                rtfContent += `${safeContent}\\par\n\\par\n`
              }
            })
          } catch (error) {
            logger.warn({ error, validVersions }, 'Error al ejecutar forEach() en validVersions para RTF')
          }
        }

        rtfContent += '}'

          const dateStr = safeToISODate(new Date()) || 'unknown'
          
          // Auditar operación
          // CORRECCIÓN: Validar que validVersions sea un array válido antes de acceder a length
          const safeVersionCount = Array.isArray(validVersions) && Number.isFinite(validVersions.length) && validVersions.length >= 0
            ? validVersions.length
            : 0
          auditSensitiveOperation('version.exported_bulk', enrichedContext, {
            metadata: { noteId, versionIds, format, versionCount: safeVersionCount },
          })
          
          const response = new NextResponse(rtfContent, {
            headers: {
              'Content-Type': 'application/rtf',
              'Content-Disposition': `attachment; filename="versiones_${dateStr}.rtf"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
      } else if (format === 'json') {
        // Formato JSON con todas las versiones
        const exportedAtString = safeToISOString(new Date())
        
        // CORRECCIÓN: Validar que note exista y que note.title sea un string válido
        const safeNoteTitle = note && typeof note === 'object' && typeof note.title === 'string' && note.title.length > 0
          ? note.title
          : 'Nota sin título'
        // CORRECCIÓN: Validar que validVersions sea un array válido antes de acceder a length y usar map()
        const safeValidVersions = Array.isArray(validVersions) ? validVersions : []
        const safeTotalVersions = Number.isFinite(safeValidVersions.length) && safeValidVersions.length >= 0
          ? safeValidVersions.length
          : 0
        const jsonData = {
          noteId,
          noteTitle: safeNoteTitle,
          exportedAt: exportedAtString,
          totalVersions: safeTotalVersions,
          versions: safeValidVersions.map(v => ({
            id: v.id,
            title: v.title,
            content: v.content,
            tags: v.tags,
            name: v.name,
            color: v.color,
            isImportant: v.isImportant,
            createdAt: safeToISODate(v.createdAt),
          })),
        }
        
          const content = JSON.stringify(jsonData, null, 2)
          const dateStr = safeToISODate(new Date())
          
          // Auditar operación
          // CORRECCIÓN: Validar que validVersions sea un array válido antes de acceder a length
          const safeVersionCount = Array.isArray(validVersions) && Number.isFinite(validVersions.length) && validVersions.length >= 0
            ? validVersions.length
            : 0
          auditSensitiveOperation('version.exported_bulk', enrichedContext, {
            metadata: { noteId, versionIds, format, versionCount: safeVersionCount },
          })
          
          const response = new NextResponse(content, {
            headers: {
              'Content-Type': 'application/json',
              'Content-Disposition': `attachment; filename="versiones_${dateStr}.json"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
        } else {
          // ODT no está soportado directamente, retornar error
          const response = NextResponse.json(
            { error: 'Formato no soportado. Formatos disponibles: docx, rtf, json' },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.exported_bulk', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'export-bulk', {
          customMessage: 'Error al exportar versiones',
        })
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

