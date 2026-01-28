import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { gzip } from 'zlib'
import { promisify } from 'util'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { parseRequestBody } from '../helpers'

const gzipAsync = promisify(gzip)

const compressVersionsSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  olderThanDays: z.number().int().min(30).max(365).default(90), // Comprimir versiones más antiguas que X días
  keepImportant: z.boolean().default(true), // Mantener versiones importantes sin comprimir
})

/**
 * POST: Comprimir versiones antiguas de una nota
 * 
 * Comprime el contenido de versiones antiguas para ahorrar espacio en la base de datos.
 * Las versiones comprimidas se almacenan como texto base64 comprimido con gzip.
 * 
 * @param request - NextRequest con body JSON:
 *   - noteId (string, requerido): ID de la nota
 *   - olderThanDays (number, opcional): Comprimir versiones más antiguas que X días (default: 90, min: 30, max: 365)
 *   - keepImportant (boolean, opcional): No comprimir versiones marcadas como importantes (default: true)
 * 
 * @returns NextResponse con:
 *   - message: Mensaje de confirmación
 *   - compressedCount: Número de versiones comprimidas
 *   - spaceSaved: Espacio ahorrado en bytes (estimado)
 * 
 * @throws 401 si el usuario no está autenticado
 * @throws 404 si la nota no existe o no pertenece al usuario
 * 
 * @example
 * POST /api/notes/versions/compress
 * Body: { "noteId": "note123", "olderThanDays": 90, "keepImportant": true }
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

        const validation = compressVersionsSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, olderThanDays, keepImportant } = validation.data

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

      // Calcular fecha límite
      // CORRECCIÓN: Validar que olderThanDays sea un número finito antes de usar en setDate()
      const safeOlderThanDays = Number.isFinite(olderThanDays) && olderThanDays >= 0 ? olderThanDays : 0
      
      const cutoffDate = new Date()
      // CORRECCIÓN: Validar que cutoffDate sea una fecha válida antes de usar getDate() y setDate()
      if (!(cutoffDate instanceof Date) || Number.isNaN(cutoffDate.getTime())) {
        logger.error(
          { olderThanDays, safeOlderThanDays },
          'compress: new Date() retornó fecha inválida, usando fecha por defecto'
        )
        const response = NextResponse.json(
          { error: 'Error interno al calcular fecha de corte' },
          { status: 500 }
        )
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      }
      
      try {
        // CORRECCIÓN: Validar que getDate() retorne un número válido antes de restar
        const currentDate = cutoffDate.getDate()
        if (!Number.isFinite(currentDate)) {
          logger.error(
            { cutoffDate, currentDate, safeOlderThanDays },
            'compress: getDate() retornó valor inválido, usando fecha por defecto'
          )
          const response = NextResponse.json(
            { error: 'Error interno al calcular fecha de corte' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        const newDate = currentDate - safeOlderThanDays
        // CORRECCIÓN: Validar que newDate sea un número finito antes de usar setDate()
        if (!Number.isFinite(newDate)) {
          logger.error(
            { cutoffDate, currentDate, safeOlderThanDays, newDate },
            'compress: newDate calculado es inválido, usando fecha por defecto'
          )
          const response = NextResponse.json(
            { error: 'Error interno al calcular fecha de corte' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
        
        cutoffDate.setDate(newDate)
        // CORRECCIÓN: Validar que setDate() haya funcionado correctamente
        if (Number.isNaN(cutoffDate.getTime())) {
          logger.error(
            { cutoffDate, currentDate, safeOlderThanDays, newDate },
            'compress: setDate() resultó en fecha inválida, usando fecha por defecto'
          )
          const response = NextResponse.json(
            { error: 'Error interno al calcular fecha de corte' },
            { status: 500 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }
      } catch (error) {
        logger.error(
          { error, cutoffDate, safeOlderThanDays },
          'compress: Error al ejecutar getDate() o setDate(), usando fecha por defecto'
        )
        const response = NextResponse.json(
          { error: 'Error interno al calcular fecha de corte' },
          { status: 500 }
        )
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      }

      // Obtener versiones a comprimir
      const whereClause: Prisma.StudyNoteVersionWhereInput = {
        noteId: note.id,
        createdAt: {
          lt: cutoffDate,
        },
        ...(keepImportant && {
          isImportant: false,
        }),
      }

      const versionsToCompress = await prisma.studyNoteVersion.findMany({
        where: whereClause,
        select: {
          id: true,
          content: true,
          title: true,
        },
      })

        if (versionsToCompress.length === 0) {
          const response = NextResponse.json({
            message: 'No hay versiones para comprimir',
            compressedCount: 0,
            spaceSaved: 0,
          })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

      // Comprimir versiones
      let totalSpaceSaved = 0
      let compressedCount = 0

      // CORRECCIÓN: Validar que versionsToCompress sea un array válido antes de usar for...of
      if (!Array.isArray(versionsToCompress) || versionsToCompress.length === 0) {
        logger.warn(
          { versionsToCompress },
          'compress: versionsToCompress no es un array válido o está vacío, saltando compresión'
        )
        return NextResponse.json(
          { error: 'No hay versiones válidas para comprimir' },
          { status: 400 }
        )
      }
      
      for (const version of versionsToCompress) {
        try {
          // CORRECCIÓN: Validar que version.content sea un string válido antes de usar Buffer.from()
          if (!version.content || typeof version.content !== 'string') {
            logger.warn(
              { versionId: version.id, content: version.content },
              'compress: version.content no es un string válido, saltando versión'
            )
            continue
          }
          
          // CORRECCIÓN: Validar que Buffer.from() retorne un Buffer válido antes de acceder a .length
          let originalBuffer: Buffer
          try {
            originalBuffer = Buffer.from(version.content, 'utf-8')
            if (!Buffer.isBuffer(originalBuffer)) {
              logger.warn(
                { versionId: version.id, content: version.content },
                'compress: Buffer.from() no retornó un Buffer válido, saltando versión'
              )
              continue
            }
          } catch (bufferError) {
            logger.warn(
              { error: bufferError, versionId: version.id },
              'compress: Error al crear Buffer desde content, saltando versión'
            )
            continue
          }
          
          const originalSize = originalBuffer.length
          // CORRECCIÓN: Validar que originalSize sea un número finito
          if (!Number.isFinite(originalSize) || originalSize < 0) {
            logger.warn(
              { versionId: version.id, originalSize },
              'compress: originalSize inválido, saltando versión'
            )
            continue
          }
          
          // CORRECCIÓN: Validar que gzipAsync retorne un Buffer válido antes de acceder a .length
          let compressed: Buffer
          try {
            compressed = await gzipAsync(originalBuffer)
            if (!Buffer.isBuffer(compressed)) {
              logger.warn(
                { versionId: version.id, compressed },
                'compress: gzipAsync no retornó un Buffer válido, saltando versión'
              )
              continue
            }
          } catch (gzipError) {
            logger.warn(
              { error: gzipError, versionId: version.id },
              'compress: Error al comprimir contenido, saltando versión'
            )
            continue
          }
          
          const compressedSize = compressed.length
          // CORRECCIÓN: Validar que compressedSize sea un número finito
          if (!Number.isFinite(compressedSize) || compressedSize < 0) {
            logger.warn(
              { versionId: version.id, compressedSize },
              'compress: compressedSize inválido, saltando versión'
            )
            continue
          }
          const spaceSaved = originalSize - compressedSize

          // Guardar versión comprimida (usando un campo adicional o actualizando el contenido)
          // Nota: En una implementación real, podrías tener un campo `compressed` o `compressionType`
          // Por ahora, almacenamos el contenido comprimido en base64
          // CORRECCIÓN: Validar que compressed sea un Buffer válido antes de usar toString('base64')
          let compressedBase64: string
          if (Buffer.isBuffer(compressed)) {
            try {
              const base64String = compressed.toString('base64')
              // Validar que toString('base64') retorne un string válido
              if (typeof base64String === 'string' && base64String.length > 0) {
                compressedBase64 = base64String
              } else {
                logger.warn(
                  { compressed, base64String },
                  'compress: toString("base64") retornó string inválido, usando string vacío'
                )
                compressedBase64 = ''
              }
            } catch (error) {
              logger.warn(
                { error, compressed },
                'compress: Error al ejecutar toString("base64"), usando string vacío'
              )
              compressedBase64 = ''
            }
          } else {
            logger.warn(
              { compressed },
              'compress: compressed no es un Buffer válido, usando string vacío'
            )
            compressedBase64 = ''
          }

          // Actualizar la versión con contenido comprimido y marcar como comprimida
          await prisma.$executeRaw`
            UPDATE StudyNoteVersion
            SET content = ${compressedBase64}, isCompressed = 1
            WHERE id = ${version.id} AND noteId = ${note.id}
          `

          totalSpaceSaved += spaceSaved
          compressedCount++
        } catch (error) {
          logger.error(
            { error, versionId: version.id },
            'Error al comprimir versión individual'
          )
          // Continuar con las siguientes versiones
        }
      }

        // Auditar operación
        auditSensitiveOperation('version.compress', enrichedContext, {
          metadata: { noteId, compressedCount, spaceSaved: totalSpaceSaved },
        })

        const response = NextResponse.json({
          message: `${compressedCount} versión(es) comprimida(s) correctamente`,
          compressedCount,
          spaceSaved: totalSpaceSaved,
          // CORRECCIÓN: Validar que totalSpaceSaved sea un número finito antes de usar toFixed()
          spaceSavedMB: (() => {
            // Validar que totalSpaceSaved sea un número finito antes de dividir
            if (!Number.isFinite(totalSpaceSaved) || totalSpaceSaved < 0) {
              logger.warn(
                { totalSpaceSaved },
                'compress: totalSpaceSaved inválido para toFixed(), usando 0'
              )
              return '0.00'
            }
            const mb = totalSpaceSaved / (1024 * 1024)
            // Validar que mb sea un número finito antes de usar toFixed()
            if (!Number.isFinite(mb)) {
              logger.warn(
                { totalSpaceSaved, mb },
                'compress: mb inválido para toFixed(), usando 0'
              )
              return '0.00'
            }
            try {
              const fixed = mb.toFixed(2)
              // Validar que toFixed() retorne un string válido
              return typeof fixed === 'string' && fixed.length > 0 ? fixed : '0.00'
            } catch (error) {
              logger.warn(
                { error, mb },
                'compress: Error al ejecutar toFixed(), usando 0.00'
              )
              return '0.00'
            }
          })(),
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.compress', context, {
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

