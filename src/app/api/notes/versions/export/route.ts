import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { jsPDF } from 'jspdf'
import { decompressVersionContent } from '@/lib/utils/version-content'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { safeToISOString, safeToISODate } from '../validation-utils'

const exportVersionSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionId: cuidValidator('ID de versión inválido'),
  format: z.enum(['txt', 'md', 'pdf', 'json']).default('txt'),
})

/**
 * GET: Exportar una versión de nota como archivo
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

        const validation = exportVersionSchema.safeParse(queryParams)
        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Parámetros inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionId, format } = validation.data

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

      // Obtener la versión a exportar con metadatos
      let version: {
        id: string
        title: string
        content: string
        tags: string | null
        createdAt: Date
        name: string | null
        isImportant: boolean
        color: string | null
      }

      if (versionId === noteId) {
        // Versión actual
        version = {
          id: noteId,
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.updatedAt,
          name: null,
          isImportant: false,
          color: null,
        }
      } else {
        // Versión histórica
        const v = await prisma.studyNoteVersion.findFirst({
          where: {
            id: versionId,
            noteId: note.id,
          },
        })

          if (!v) {
            const response = NextResponse.json({ error: 'Versión no encontrada' }, { status: 404 })
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }

        // Descomprimir si está comprimida
        const isCompressed = (v as { isCompressed?: boolean }).isCompressed || false
        const content = await decompressVersionContent(v.content, isCompressed, 'versions/export')

        version = {
          id: versionId,
          title: v.title,
          content,
          tags: v.tags,
          createdAt: v.createdAt,
          name: (v as { name?: string | null }).name || null,
          isImportant: (v as { isImportant?: boolean }).isImportant || false,
          color: (v as { color?: string | null }).color || null,
        }
      }

      // Generar contenido del archivo
      if (format === 'pdf') {
        // Formato PDF
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 15
        let yPos = margin

        // Título
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        // CORRECCIÓN: Validar que version.title sea un string válido antes de usar splitTextToSize()
        const safeTitle = typeof version.title === 'string' && version.title.length > 0 ? version.title : 'Sin título'
        const safePageWidth = Number.isFinite(pageWidth) && pageWidth > 0 ? pageWidth : 210 // A4 width default
        const safeMargin = Number.isFinite(margin) && margin >= 0 ? margin : 15
        const safeWidth = safePageWidth - 2 * safeMargin
        const titleLines = Number.isFinite(safeWidth) && safeWidth > 0
          ? doc.splitTextToSize(safeTitle, safeWidth)
          : [safeTitle]
        // CORRECCIÓN: Validar que titleLines sea un array válido antes de usar text()
        if (Array.isArray(titleLines) && titleLines.length > 0) {
          try {
            doc.text(titleLines, safeMargin, yPos)
          } catch (error) {
            logger.warn({ error, titleLines, safeMargin, yPos }, 'export: Error al ejecutar doc.text() para título, usando título simple')
            try {
              doc.text(safeTitle, safeMargin, yPos)
            } catch (fallbackError) {
              logger.warn({ error: fallbackError, safeTitle }, 'export: Error al ejecutar doc.text() para título de fallback')
            }
          }
        } else {
          logger.warn({ titleLines, safeTitle }, 'export: titleLines no es un array válido, usando título simple')
          try {
            doc.text(safeTitle, safeMargin, yPos)
          } catch (error) {
            logger.warn({ error, safeTitle }, 'export: Error al ejecutar doc.text() para título simple')
          }
        }
        // CORRECCIÓN: Validar que titleLines.length, 8 y 5 sean números finitos antes de calcular
        const safeTitleLinesLength = Array.isArray(titleLines) && Number.isFinite(titleLines.length) && titleLines.length >= 0
          ? titleLines.length
          : 0
        const safeMultiplier = Number.isFinite(8) ? 8 : 8
        const safeAddend = Number.isFinite(5) ? 5 : 5
        const safeProduct = safeTitleLinesLength * safeMultiplier
        const safeSum = Number.isFinite(safeProduct) ? safeProduct + safeAddend : safeAddend
        yPos = Number.isFinite(safeSum) && Number.isFinite(yPos) ? yPos + safeSum : yPos

        // Metadata
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        if (version.tags) {
          doc.text(`Tags: ${version.tags}`, margin, yPos)
          // CORRECCIÓN: Validar que 6 sea un número finito antes de sumar
          const safeIncrementTags = Number.isFinite(6) ? 6 : 6
          const newYPosTags = Number.isFinite(yPos) ? yPos + safeIncrementTags : yPos
          yPos = Number.isFinite(newYPosTags) ? newYPosTags : yPos
        }
        // CORRECCIÓN: Validar que version.createdAt sea una fecha válida antes de usar toLocaleString()
        let dateString: string
        if (version.createdAt instanceof Date && !Number.isNaN(version.createdAt.getTime())) {
          try {
            const localeString = version.createdAt.toLocaleString('es-CL')
            dateString = typeof localeString === 'string' && localeString.length > 0 ? localeString : 'Fecha inválida'
          } catch (error) {
            logger.warn({ error, createdAt: version.createdAt }, 'Error al formatear fecha con toLocaleString, usando ISO')
            dateString = safeToISOString(version.createdAt) || 'Fecha inválida'
          }
        } else {
          dateString = safeToISOString(new Date()) || 'Fecha inválida'
        }
        doc.text(`Fecha: ${dateString}`, margin, yPos)
        // CORRECCIÓN: Validar que 8 sea un número finito antes de sumar
        const safeIncrementDate = Number.isFinite(8) ? 8 : 8
        const newYPosDate = Number.isFinite(yPos) ? yPos + safeIncrementDate : yPos
        yPos = Number.isFinite(newYPosDate) ? newYPosDate : yPos

        // Línea separadora
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        // CORRECCIÓN: Validar que 10 sea un número finito antes de sumar
        const safeIncrement2 = Number.isFinite(10) ? 10 : 10
        const newYPos2 = Number.isFinite(yPos) ? yPos + safeIncrement2 : yPos
        yPos = Number.isFinite(newYPos2) ? newYPos2 : yPos

        // Contenido
        doc.setFontSize(12)
        // CORRECCIÓN: Validar que version.content sea un string válido antes de usar splitTextToSize()
        const safeContent = typeof version.content === 'string' && version.content.length > 0 ? version.content : ''
        const safeContentWidth = Number.isFinite(safePageWidth) && safePageWidth > 0 ? safePageWidth - 2 * safeMargin : safePageWidth - 2 * safeMargin
        const contentLines = Number.isFinite(safeContentWidth) && safeContentWidth > 0 && safeContent.length > 0
          ? doc.splitTextToSize(safeContent, safeContentWidth)
          : safeContent.length > 0 ? [safeContent] : []
        const lineHeight = 7
        const pageHeight = doc.internal.pageSize.getHeight()

        // CORRECCIÓN: Validar que contentLines sea un array válido antes de usar for...of
        if (!Array.isArray(contentLines) || contentLines.length === 0) {
          logger.warn(
            { contentLines },
            'export: contentLines no es un array válido o está vacío, saltando líneas'
          )
          // Continuar sin agregar líneas si contentLines es inválido
        } else {
          for (const line of contentLines) {
            // CORRECCIÓN: Validar que line sea un string válido antes de usar
            if (typeof line === 'string' && line.length > 0) {
              // CORRECCIÓN: Validar que yPos, lineHeight, pageHeight y margin sean números finitos antes de comparar
              const safeYPos = Number.isFinite(yPos) ? yPos : margin
              const safeLineHeight = Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : 7
              const safePageHeight = Number.isFinite(pageHeight) && pageHeight > 0 ? pageHeight : 841.89 // A4 height
              const safeMargin = Number.isFinite(margin) && margin >= 0 ? margin : 20
              
              const safeSum = safeYPos + safeLineHeight
              const safeThreshold = safePageHeight - safeMargin
              
              if (Number.isFinite(safeSum) && Number.isFinite(safeThreshold) && safeSum > safeThreshold) {
                try {
                  doc.addPage()
                  yPos = safeMargin
                } catch (error) {
                  logger.warn(
                    { error, doc },
                    'export: Error al ejecutar addPage(), continuando en misma página'
                  )
                }
              }
              
              try {
                doc.text(line, safeMargin, safeYPos)
                // CORRECCIÓN: Validar que yPos += lineHeight sea un número finito
                const newYPos = safeYPos + safeLineHeight
                yPos = Number.isFinite(newYPos) ? newYPos : safeYPos
              } catch (error) {
                logger.warn(
                  { error, line, margin: safeMargin, yPos: safeYPos },
                  'export: Error al ejecutar doc.text(), saltando línea'
                )
              }
            } else {
              logger.warn(
                { line },
                'export: line inválido en contentLines, saltando línea'
              )
            }
          }
        }

        // CORRECCIÓN: Validar que doc.output('arraybuffer') retorne un valor válido antes de usar Buffer.from()
        let pdfBuffer: Buffer
        try {
          const arrayBuffer = doc.output('arraybuffer')
          // Validar que arrayBuffer sea válido antes de usar Buffer.from()
          if (arrayBuffer === null || arrayBuffer === undefined) {
            logger.error(
              { versionId: version.id },
              'export: doc.output("arraybuffer") retornó null/undefined'
            )
            const response = NextResponse.json(
              { error: 'Error al generar PDF' },
              { status: 500 }
            )
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
          
          pdfBuffer = Buffer.from(arrayBuffer)
          // Validar que Buffer.from() retorne un Buffer válido
          if (!Buffer.isBuffer(pdfBuffer)) {
            logger.error(
              { versionId: version.id, arrayBuffer },
              'export: Buffer.from() no retornó un Buffer válido'
            )
            const response = NextResponse.json(
              { error: 'Error al generar PDF' },
              { status: 500 }
            )
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
        } catch (bufferError) {
          logger.error(
            { error: bufferError, versionId: version.id },
            'export: Error al crear Buffer desde doc.output(), retornando error'
          )
          const response = NextResponse.json(
            { error: 'Error al generar PDF' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        // CORRECCIÓN: Validar que version.title y version.createdAt sean válidos antes de usar replace(), toLowerCase(), toISOString() y split()
        let safeFilename: string
        if (typeof version.title === 'string' && version.title.length > 0) {
          try {
            // CORRECCIÓN: Validar que replace() retorne un string válido antes de usar toLowerCase()
            const replaced = version.title.replace(/[^a-z0-9]/gi, '_')
            if (typeof replaced === 'string' && replaced.length > 0) {
              try {
                const lowerCased = replaced.toLowerCase()
                safeFilename = typeof lowerCased === 'string' && lowerCased.length > 0 ? lowerCased : 'version'
              } catch (toLowerCaseError) {
                logger.warn(
                  { error: toLowerCaseError, replaced },
                  'export: Error al ejecutar toLowerCase(), usando version'
                )
                safeFilename = 'version'
              }
            } else {
              logger.warn(
                { title: version.title, replaced },
                'export: replace() retornó string inválido, usando version'
              )
              safeFilename = 'version'
            }
          } catch (replaceError) {
            logger.warn(
              { error: replaceError, title: version.title },
              'export: Error al ejecutar replace(), usando version'
            )
            safeFilename = 'version'
          }
        } else {
          safeFilename = 'version'
        }
          
          const datePart = safeToISODate(version.createdAt) || 'unknown'
          
          const filename = `${safeFilename}_${datePart}.pdf`

          // Auditar operación
          auditSensitiveOperation('version.exported', enrichedContext, {
            metadata: { noteId, versionId, format },
          })

          const response = new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
        }

      let content: string | Buffer
      let filename: string
      let mimeType: string

      if (format === 'json') {
        // Formato JSON con todos los metadatos
        const jsonData = {
          id: version.id,
          title: version.title,
          content: version.content,
          tags: version.tags,
          name: version.name,
          color: version.color,
          isImportant: version.isImportant,
          createdAt: safeToISOString(version.createdAt),
          exportedAt: safeToISOString(new Date()),
          noteId,
        }
        content = JSON.stringify(jsonData, null, 2)
        // CORRECCIÓN: Validar que version.title y version.createdAt sean válidos antes de usar replace(), toLowerCase(), toISOString() y split()
        let safeTitle = 'version'
        if (typeof version.title === 'string' && version.title.length > 0) {
          try {
            const replaced = version.title.replace(/[^a-z0-9]/gi, '_')
            // Validar que replace() retorne un string válido antes de usar toLowerCase()
            if (typeof replaced === 'string') {
              try {
                const lowercased = replaced.toLowerCase()
                // Validar que toLowerCase() retorne un string válido
                safeTitle = typeof lowercased === 'string' && lowercased.length > 0 ? lowercased : 'version'
              } catch (error) {
                logger.warn({ error, replaced }, 'export: Error al ejecutar toLowerCase() en safeTitle, usando version')
                safeTitle = typeof replaced === 'string' && replaced.length > 0 ? replaced : 'version'
              }
            } else {
              logger.warn({ versionTitle: version.title }, 'export: replace() retornó resultado inválido, usando version')
              safeTitle = 'version'
            }
          } catch (error) {
            logger.warn({ error, versionTitle: version.title }, 'export: Error al ejecutar replace() en version.title, usando version')
            safeTitle = 'version'
          }
        }
        
        const datePart = safeToISODate(version.createdAt) || 'unknown'
        
        filename = `${safeTitle}_${datePart}.json`
        mimeType = 'application/json'
      } else if (format === 'md') {
        // Formato Markdown
        content = `# ${version.title}\n\n`
        if (version.name) {
          content += `**Nombre:** ${version.name}\n\n`
        }
        if (version.tags) {
          content += `**Tags:** ${version.tags}\n\n`
        }
        if (version.color) {
          content += `**Color:** ${version.color}\n\n`
        }
        if (version.isImportant) {
          content += `**⭐ Importante**\n\n`
        }
        // CORRECCIÓN: Validar que version.createdAt sea una fecha válida antes de usar toLocaleString()
        let dateString: string
        if (version.createdAt instanceof Date && !Number.isNaN(version.createdAt.getTime())) {
          try {
            const localeString = version.createdAt.toLocaleString('es-CL')
            dateString = typeof localeString === 'string' && localeString.length > 0 ? localeString : 'Fecha inválida'
          } catch (error) {
            logger.warn({ error, createdAt: version.createdAt }, 'Error al formatear fecha con toLocaleString para MD, usando ISO')
            dateString = safeToISOString(version.createdAt) || 'Fecha inválida'
          }
        } else {
          dateString = new Date().toLocaleString('es-CL') || 'Fecha inválida'
        }
        content += `**Fecha:** ${dateString}\n\n`
        content += `---\n\n`
        content += version.content
        
        // CORRECCIÓN: Validar que version.title y version.createdAt sean válidos antes de usar replace(), toLowerCase(), toISOString() y split()
        let safeFilenameMd = 'version'
        if (typeof version.title === 'string' && version.title.length > 0) {
          try {
            const replaced = version.title.replace(/[^a-z0-9]/gi, '_')
            // Validar que replace() retorne un string válido antes de usar toLowerCase()
            if (typeof replaced === 'string') {
              try {
                const lowercased = replaced.toLowerCase()
                // Validar que toLowerCase() retorne un string válido
                safeFilenameMd = typeof lowercased === 'string' && lowercased.length > 0 ? lowercased : 'version'
              } catch (error) {
                logger.warn({ error, replaced }, 'export: Error al ejecutar toLowerCase() en safeFilenameMd, usando version')
                safeFilenameMd = typeof replaced === 'string' && replaced.length > 0 ? replaced : 'version'
              }
            } else {
              logger.warn({ versionTitle: version.title }, 'export: replace() retornó resultado inválido, usando version')
              safeFilenameMd = 'version'
            }
          } catch (error) {
            logger.warn({ error, versionTitle: version.title }, 'export: Error al ejecutar replace() en version.title, usando version')
            safeFilenameMd = 'version'
          }
        }
        
        const datePart = safeToISODate(version.createdAt) || 'unknown'
        
        filename = `${safeFilenameMd}_${datePart}.md`
        mimeType = 'text/markdown'
      } else {
        // Formato texto plano
        // CORRECCIÓN: Validar que version.title sea un string válido antes de usar length y repeat()
        const safeTitle = typeof version.title === 'string' && version.title.length > 0 ? version.title : 'Versión'
        const safeTitleLength = Number.isFinite(safeTitle.length) && safeTitle.length > 0 ? safeTitle.length : 1
        
        content = `${safeTitle}\n`
        // CORRECCIÓN: Validar que safeTitleLength sea un número válido antes de usar repeat()
        const safeRepeatLength = Number.isFinite(safeTitleLength) && safeTitleLength > 0 ? safeTitleLength : 1
        try {
          const repeated = '='.repeat(safeRepeatLength)
          // Validar que repeat() retorne un string válido
          content += typeof repeated === 'string' ? repeated : '='
        } catch (error) {
          logger.warn({ error, safeRepeatLength }, 'Error al ejecutar repeat() en título, usando fallback')
          content += '='
        }
        content += '\n\n'
        if (version.name) {
          content += `Nombre: ${version.name}\n`
        }
        if (version.tags) {
          content += `Tags: ${version.tags}\n`
        }
        if (version.color) {
          content += `Color: ${version.color}\n`
        }
        if (version.isImportant) {
          content += `⭐ Importante\n`
        }
        const dateString = safeToISOString(version.createdAt) || 'Fecha inválida'
        content += `Fecha: ${dateString}\n\n`
        // CORRECCIÓN: Validar que repeat() retorne un string válido
        try {
          const repeated = '-'.repeat(50)
          // Validar que repeat() retorne un string válido
          content += typeof repeated === 'string' ? repeated : '-'.repeat(50)
        } catch (error) {
          logger.warn({ error }, 'Error al ejecutar repeat() en separador, usando fallback')
          content += '-'.repeat(50)
        }
        content += '\n\n'
        content += version.content
        
        // CORRECCIÓN: Validar que version.title y version.createdAt sean válidos antes de usar replace(), toLowerCase(), toISOString() y split()
        let safeFilenameTxt = 'version'
        if (typeof version.title === 'string' && version.title.length > 0) {
          try {
            const replaced = version.title.replace(/[^a-z0-9]/gi, '_')
            // Validar que replace() retorne un string válido antes de usar toLowerCase()
            if (typeof replaced === 'string') {
              try {
                const lowercased = replaced.toLowerCase()
                // Validar que toLowerCase() retorne un string válido
                safeFilenameTxt = typeof lowercased === 'string' && lowercased.length > 0 ? lowercased : 'version'
              } catch (error) {
                logger.warn({ error, replaced }, 'export: Error al ejecutar toLowerCase() en safeFilenameTxt, usando version')
                safeFilenameTxt = typeof replaced === 'string' && replaced.length > 0 ? replaced : 'version'
              }
            } else {
              logger.warn({ versionTitle: version.title }, 'export: replace() retornó resultado inválido, usando version')
              safeFilenameTxt = 'version'
            }
          } catch (error) {
            logger.warn({ error, versionTitle: version.title }, 'export: Error al ejecutar replace() en version.title, usando version')
            safeFilenameTxt = 'version'
          }
        }
        
        const datePart = safeToISODate(version.createdAt) || 'unknown'
        
        filename = `${safeFilenameTxt}_${datePart}.txt`
        mimeType = 'text/plain'
      }

        // Auditar operación
        auditSensitiveOperation('version.exported', enrichedContext, {
          metadata: { noteId, versionId, format },
        })

        // Retornar archivo
        const response = new NextResponse(content, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        })
        
        return addTracingHeaders(response, requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.exported', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'GET', {
          customMessage: 'Error al exportar versión',
        })
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

