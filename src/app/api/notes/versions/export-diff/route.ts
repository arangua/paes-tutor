import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { z } from 'zod'
import { compareVersions } from '@/lib/utils/text-diff'
import { jsPDF } from 'jspdf'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { parseRequestBody } from '../helpers'

const exportDiffSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionId1: cuidValidator('ID de versión 1 inválido'),
  versionId2: cuidValidator('ID de versión 2 inválido'),
  format: z.enum(['txt', 'html', 'pdf']).default('txt'),
})

/**
 * POST: Exportar diff entre dos versiones
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

        const validation = exportDiffSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionId1, versionId2, format } = validation.data

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

      // Obtener las dos versiones
      let version1: { title: string; content: string; tags: string | null; createdAt: Date }
      let version2: { title: string; content: string; tags: string | null; createdAt: Date }

      if (versionId1 === noteId) {
        version1 = {
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.updatedAt,
        }
      } else {
        const v1 = await prisma.studyNoteVersion.findFirst({
          where: { id: versionId1, noteId: note.id },
        })
          if (!v1) {
            const response = NextResponse.json({ error: 'Versión 1 no encontrada' }, { status: 404 })
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
        version1 = {
          title: v1.title,
          content: v1.content,
          tags: v1.tags,
          createdAt: v1.createdAt,
        }
      }

      if (versionId2 === noteId) {
        version2 = {
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.updatedAt,
        }
      } else {
        const v2 = await prisma.studyNoteVersion.findFirst({
          where: { id: versionId2, noteId: note.id },
        })
          if (!v2) {
            const response = NextResponse.json({ error: 'Versión 2 no encontrada' }, { status: 404 })
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
        version2 = {
          title: v2.title,
          content: v2.content,
          tags: v2.tags,
          createdAt: v2.createdAt,
        }
      }

      // Comparar versiones
      const diff = compareVersions(version1, version2)

      // Generar archivo según formato
      if (format === 'pdf') {
        const doc = new jsPDF()
        const margin = 15
        let yPos = margin

        // Título
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text('Comparación de Versiones', margin, yPos)
        yPos += 15

        // Información de versiones
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const v1DateStr = version1.createdAt && (version1.createdAt instanceof Date || typeof version1.createdAt === 'string')
          ? (() => {
              try {
                const date = version1.createdAt instanceof Date ? version1.createdAt : new Date(version1.createdAt)
                return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CL') : 'Fecha inválida'
              } catch {
                return 'Fecha inválida'
              }
            })()
          : 'Fecha inválida'
        doc.text(`Versión 1: ${v1DateStr}`, margin, yPos)
        yPos += 6
        const v2DateStr = version2.createdAt && (version2.createdAt instanceof Date || typeof version2.createdAt === 'string')
          ? (() => {
              try {
                const date = version2.createdAt instanceof Date ? version2.createdAt : new Date(version2.createdAt)
                return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CL') : 'Fecha inválida'
              } catch {
                return 'Fecha inválida'
              }
            })()
          : 'Fecha inválida'
        doc.text(`Versión 2: ${v2DateStr}`, margin, yPos)
        yPos += 10

        // Diferencias
        // CORRECCIÓN: Validar que diff.title sea un objeto válido antes de acceder a propiedades
        if (diff && typeof diff === 'object' && 'title' in diff && diff.title && typeof diff.title === 'object' && 'changed' in diff.title && diff.title.changed) {
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text('Título:', margin, yPos)
          yPos += 8
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(255, 0, 0)
          const oldTitle = (diff.title && typeof diff.title === 'object' && 'old' in diff.title && typeof diff.title.old === 'string') ? diff.title.old : 'N/A'
          doc.text(`- ${oldTitle}`, margin + 5, yPos)
          yPos += 6
          doc.setTextColor(0, 128, 0)
          const newTitle = (diff.title && typeof diff.title === 'object' && 'new' in diff.title && typeof diff.title.new === 'string') ? diff.title.new : 'N/A'
          doc.text(`+ ${newTitle}`, margin + 5, yPos)
          yPos += 10
          doc.setTextColor(0, 0, 0)
        }

        // CORRECCIÓN: Validar que diff.content sea un objeto válido antes de acceder a propiedades
        if (diff && typeof diff === 'object' && 'content' in diff && diff.content && typeof diff.content === 'object' && 'changed' in diff.content && diff.content.changed) {
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text('Contenido:', margin, yPos)
          yPos += 8
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          
          // CORRECCIÓN: Validar que diff.content.diff sea un array válido antes de iterar
          const safeDiffArray = (diff.content && typeof diff.content === 'object' && 'diff' in diff.content && Array.isArray(diff.content.diff)) ? diff.content.diff : []
          for (const diffLine of safeDiffArray) {
            if (yPos > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage()
              yPos = margin
            }
            
            if (diffLine.type === 'removed') {
              doc.setTextColor(255, 0, 0)
              doc.text(`- ${diffLine.text}`, margin + 5, yPos)
            } else if (diffLine.type === 'added') {
              doc.setTextColor(0, 128, 0)
              doc.text(`+ ${diffLine.text}`, margin + 5, yPos)
            } else {
              doc.setTextColor(0, 0, 0)
              doc.text(`  ${diffLine.text}`, margin + 5, yPos)
            }
            yPos += 6
          }
          doc.setTextColor(0, 0, 0)
        }

          const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
          const filename = `diff_${noteId}_${versionId1.slice(0, 8)}_${versionId2.slice(0, 8)}.pdf`

          // Auditar operación
          auditSensitiveOperation('version.exported_diff', enrichedContext, {
            metadata: { noteId, versionId1, versionId2, format },
          })

          const response = new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
      } else if (format === 'html') {
        let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Comparación de Versiones</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    .removed { background: #ffebee; color: #c62828; text-decoration: line-through; }
    .added { background: #e8f5e9; color: #2e7d32; }
    .equal { color: #666; }
    h1 { color: #333; }
    .meta { color: #666; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Comparación de Versiones</h1>
  <div class="meta">
    <p><strong>Versión 1:</strong> ${version1.createdAt && (version1.createdAt instanceof Date || typeof version1.createdAt === 'string')
      ? (() => {
          try {
            const date = version1.createdAt instanceof Date ? version1.createdAt : new Date(version1.createdAt)
            return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CL') : 'Fecha inválida'
          } catch {
            return 'Fecha inválida'
          }
        })()
      : 'Fecha inválida'}</p>
    <p><strong>Versión 2:</strong> ${version2.createdAt && (version2.createdAt instanceof Date || typeof version2.createdAt === 'string')
      ? (() => {
          try {
            const date = version2.createdAt instanceof Date ? version2.createdAt : new Date(version2.createdAt)
            return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CL') : 'Fecha inválida'
          } catch {
            return 'Fecha inválida'
          }
        })()
      : 'Fecha inválida'}</p>
  </div>
`

        // CORRECCIÓN: Validar que diff.title sea un objeto válido antes de acceder a propiedades
        if (diff && typeof diff === 'object' && 'title' in diff && diff.title && typeof diff.title === 'object' && 'changed' in diff.title && diff.title.changed) {
          const oldTitle = (diff.title && typeof diff.title === 'object' && 'old' in diff.title && typeof diff.title.old === 'string') ? diff.title.old : 'N/A'
          const newTitle = (diff.title && typeof diff.title === 'object' && 'new' in diff.title && typeof diff.title.new === 'string') ? diff.title.new : 'N/A'
          html += `
  <h2>Título</h2>
  <div class="removed">- ${oldTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <div class="added">+ ${newTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
`
        }

        // CORRECCIÓN: Validar que diff.content sea un objeto válido antes de acceder a propiedades
        if (diff && typeof diff === 'object' && 'content' in diff && diff.content && typeof diff.content === 'object' && 'changed' in diff.content && diff.content.changed) {
          html += `
  <h2>Contenido</h2>
`
          // CORRECCIÓN: Validar que diff.content.diff sea un array válido antes de iterar
          const safeDiffArray = (diff.content && typeof diff.content === 'object' && 'diff' in diff.content && Array.isArray(diff.content.diff)) ? diff.content.diff : []
          for (const diffLine of safeDiffArray) {
            const className = diffLine.type === 'removed' ? 'removed' : diffLine.type === 'added' ? 'added' : 'equal'
            const prefix = diffLine.type === 'removed' ? '-' : diffLine.type === 'added' ? '+' : ' '
            html += `  <div class="${className}">${prefix} ${diffLine.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>\n`
          }
        }

          html += `</body></html>`

          // Auditar operación
          auditSensitiveOperation('version.exported_diff', enrichedContext, {
            metadata: { noteId, versionId1, versionId2, format },
          })

          const response = new NextResponse(html, {
            headers: {
              'Content-Type': 'text/html',
              'Content-Disposition': `attachment; filename="diff_${noteId}.html"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
      } else {
        // Formato texto
        let text = `Comparación de Versiones\n`
        text += `${'='.repeat(50)}\n\n`
        const v1DateText = version1.createdAt && (version1.createdAt instanceof Date || typeof version1.createdAt === 'string')
          ? (() => {
              try {
                const date = version1.createdAt instanceof Date ? version1.createdAt : new Date(version1.createdAt)
                return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CL') : 'Fecha inválida'
              } catch {
                return 'Fecha inválida'
              }
            })()
          : 'Fecha inválida'
        text += `Versión 1: ${v1DateText}\n`
        const v2DateText = version2.createdAt && (version2.createdAt instanceof Date || typeof version2.createdAt === 'string')
          ? (() => {
              try {
                const date = version2.createdAt instanceof Date ? version2.createdAt : new Date(version2.createdAt)
                return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CL') : 'Fecha inválida'
              } catch {
                return 'Fecha inválida'
              }
            })()
          : 'Fecha inválida'
        text += `Versión 2: ${v2DateText}\n\n`

        // CORRECCIÓN: Validar que diff.title sea un objeto válido antes de acceder a propiedades
        if (diff && typeof diff === 'object' && 'title' in diff && diff.title && typeof diff.title === 'object' && 'changed' in diff.title && diff.title.changed) {
          const oldTitle = (diff.title && typeof diff.title === 'object' && 'old' in diff.title && typeof diff.title.old === 'string') ? diff.title.old : 'N/A'
          const newTitle = (diff.title && typeof diff.title === 'object' && 'new' in diff.title && typeof diff.title.new === 'string') ? diff.title.new : 'N/A'
          text += `TÍTULO:\n`
          text += `- ${oldTitle}\n`
          text += `+ ${newTitle}\n\n`
        }

        // CORRECCIÓN: Validar que diff.content sea un objeto válido antes de acceder a propiedades
        if (diff && typeof diff === 'object' && 'content' in diff && diff.content && typeof diff.content === 'object' && 'changed' in diff.content && diff.content.changed) {
          text += `CONTENIDO:\n`
          // CORRECCIÓN: Validar que diff.content.diff sea un array válido antes de iterar
          const safeDiffArray = (diff.content && typeof diff.content === 'object' && 'diff' in diff.content && Array.isArray(diff.content.diff)) ? diff.content.diff : []
          for (const diffLine of safeDiffArray) {
            const prefix = diffLine.type === 'removed' ? '-' : diffLine.type === 'added' ? '+' : ' '
            text += `${prefix} ${diffLine.text}\n`
          }
        }

          // Auditar operación
          auditSensitiveOperation('version.exported_diff', enrichedContext, {
            metadata: { noteId, versionId1, versionId2, format },
          })

          const response = new NextResponse(text, {
            headers: {
              'Content-Type': 'text/plain',
              'Content-Disposition': `attachment; filename="diff_${noteId}.txt"`,
            },
          })
          
          return addTracingHeaders(response, requestId, Date.now() - startTime)
        }
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.exported_diff', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'POST', {
          customMessage: 'Error al exportar diff'
        })
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

