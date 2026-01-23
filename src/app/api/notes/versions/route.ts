import { NextRequest, NextResponse } from 'next/server'
import { withVersionRateLimit } from './rate-limit'
import { withRequestTimeout } from './timeout-handler'
import { handleGetRequest } from './handlers/get-handler'
import { handlePostRequest } from './handlers/post-handler'
import { handlePatchRequest } from './handlers/patch-handler'
import { handleDeleteRequest } from './handlers/delete-handler'

// Re-exportar para compatibilidad
export { invalidateVersionCache } from './cache'

/**
 * GET: Obtener versiones de una nota
 * 
 * Obtiene todas las versiones históricas de una nota de estudio, incluyendo la versión actual.
 * Soporta paginación, filtros y búsqueda full-text.
 * 
 * @param request - NextRequest con query parameters:
 *   - noteId (string, requerido): ID de la nota (formato CUID)
 *   - limit (number, opcional): Número máximo de versiones a retornar (default: 20, max: 100)
 *   - offset (number, opcional): Número de versiones a saltar (para paginación)
 *   - cursor (string, opcional): Cursor para paginación basada en cursor
 *   - search (string, opcional): Término de búsqueda para filtrar por título, contenido, nombre o tags
 *   - isImportant (boolean, opcional): Filtrar solo versiones marcadas como importantes
 *   - hasName (boolean, opcional): Filtrar solo versiones con nombre personalizado
 *   - dateFrom (string, opcional): Fecha desde (ISO 8601) para filtrar versiones
 *   - dateTo (string, opcional): Fecha hasta (ISO 8601) para filtrar versiones
 * 
 * @returns NextResponse con:
 *   - versions: Array de versiones (incluyendo la versión actual)
 *   - currentVersionId: ID de la versión actual
 *   - total: Número total de versiones
 *   - statistics: Estadísticas de versiones (total, promedio de días entre versiones, etc.)
 *   - pagination: Información de paginación (hasMore, nextCursor, limit, offset)
 * 
 * @example
 * ```typescript
 * // Obtener todas las versiones
 * GET /api/notes/versions?noteId=c123456789012345678901234
 * 
 * // Buscar versiones con filtros
 * GET /api/notes/versions?noteId=c123456789012345678901234&search=matemáticas&isImportant=true
 * 
 * // Paginación
 * GET /api/notes/versions?noteId=c123456789012345678901234&limit=10&offset=20
 * ```
 * 
 * @throws {401} Si el usuario no está autenticado
 *   - Error: "No autorizado"
 *   - Ejemplo de respuesta: `{ "error": "No autorizado" }`
 * @throws {404} Si la nota no existe o no pertenece al estudiante
 *   - Error: "Nota no encontrada"
 *   - Ejemplo de respuesta: `{ "error": "Nota no encontrada" }`
 * @throws {400} Si los parámetros de query son inválidos
 *   - Error: "ID de nota inválido" (si noteId no es un CUID válido)
 *   - Error: "La fecha de inicio debe ser anterior a la fecha de fin" (si dateFrom > dateTo)
 *   - Ejemplo de respuesta: `{ "error": "Datos inválidos", "details": [...] }`
 * 
 * @example Respuesta exitosa:
 * ```json
 * {
 *   "versions": [
 *     {
 *       "id": "c123...",
 *       "title": "Título de la versión",
 *       "content": "Contenido...",
 *       "tags": "tag1,tag2",
 *       "name": "Versión final",
 *       "color": "#FF5733",
 *       "isImportant": true,
 *       "createdAt": "2024-01-01T00:00:00.000Z",
 *       "updatedAt": "2024-01-01T00:00:00.000Z"
 *     }
 *   ],
 *   "currentVersionId": "c123...",
 *   "total": 10,
 *   "statistics": {
 *     "totalVersions": 9,
 *     "averageDaysBetweenVersions": 2.5,
 *     "daysSinceLastUpdate": 1.2,
 *     "lastUpdated": "2024-01-01T00:00:00.000Z",
 *     "importantCount": 3,
 *     "namedCount": 5,
 *     "totalRestores": 2
 *   },
 *   "pagination": {
 *     "hasMore": false,
 *     "nextCursor": null,
 *     "limit": 20,
 *     "offset": 0,
 *     "total": 10
 *   }
 * }
 * ```
 * 
 * @remarks
 * - Para respuestas grandes (>100 versiones), se usa streaming automáticamente
 * - Las respuestas se cachean por 5 minutos
 * - Soporta compresión automática de contenido
 * - La validación de respuestas en streaming se omite por razones de performance
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () => 
    withRequestTimeout(request, () => handleGetRequest(request))
  )
}

/**
 * POST: Restaurar una versión de nota
 * 
 * Restaura el contenido de una versión histórica, reemplazando el contenido actual de la nota.
 * Antes de restaurar, crea automáticamente una nueva versión con el contenido actual como backup.
 * 
 * @param request - NextRequest con body JSON:
 *   - noteId (string, requerido): ID de la nota (formato CUID)
 *   - versionId (string, requerido): ID de la versión a restaurar (formato CUID)
 * 
 * @returns NextResponse con:
 *   - message: Mensaje de confirmación
 *   - note: Nota actualizada con el contenido restaurado
 * 
 * @example
 * ```typescript
 * // Restaurar una versión específica
 * POST /api/notes/versions
 * Body: {
 *   "noteId": "c123456789012345678901234",
 *   "versionId": "c987654321098765432109876"
 * }
 * 
 * // Respuesta exitosa:
 * {
 *   "message": "Versión restaurada correctamente",
 *   "note": { ... }
 * }
 * 
 * // Error si la versión está vacía:
 * {
 *   "error": "No se puede restaurar una versión con contenido vacío"
 * }
 * ```
 * 
 * @throws {401} Si el usuario no está autenticado
 *   - Error: "No autorizado"
 *   - Ejemplo: `{ "error": "No autorizado" }`
 * @throws {404} Si la nota o versión no existe o no pertenece al estudiante
 *   - Error: "Nota no encontrada"
 *   - Error: "Versión no encontrada"
 *   - Error: "Estudiante no encontrado"
 *   - Ejemplo: `{ "error": "Versión no encontrada" }`
 * @throws {400} Si los datos son inválidos o la versión está vacía
 *   - Error: "Datos inválidos" (si noteId o versionId no son CUIDs válidos)
 *   - Error: "No se puede restaurar una versión con contenido vacío"
 *   - Error: "Se ha alcanzado el límite máximo de versiones..." (si se alcanza el límite)
 *   - Ejemplo: `{ "error": "No se puede restaurar una versión con contenido vacío" }`
 * @throws {500} Si ocurre un error al restaurar
 *   - Error: "Error al restaurar versión: nota no encontrada"
 *   - Ejemplo: `{ "error": "Error al restaurar versión: nota no encontrada" }`
 * 
 * @example Respuesta exitosa:
 * ```json
 * {
 *   "message": "Versión restaurada correctamente",
 *   "note": {
 *     "id": "c123...",
 *     "title": "Título restaurado",
 *     "content": "Contenido restaurado...",
 *     "tags": "tag1,tag2",
 *     "createdAt": "2024-01-01T00:00:00.000Z",
 *     "updatedAt": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * ```
 * 
 * @remarks
 * - Dispara webhook 'version.restored' después de restaurar (en background, no bloqueante)
 * - Crea notificaciones automáticas si se alcanza el límite de versiones (en background)
 * - El contenido comprimido se descomprime automáticamente
 * - Crea automáticamente una versión de backup con el contenido actual antes de restaurar
 * - Soporta idempotencia mediante headers
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () =>
    withRequestTimeout(request, () => handlePostRequest(request))
  )
}

/**
 * PATCH: Actualizar metadata de una versión (nombre, color, importancia)
 * 
 * Permite actualizar los metadatos de una versión histórica sin modificar su contenido.
 * Los campos opcionales permiten actualizar solo los valores deseados.
 * 
 * @param request - NextRequest con body JSON:
 *   - noteId (string, requerido): ID de la nota (formato CUID)
 *   - versionId (string, requerido): ID de la versión a actualizar (formato CUID)
 *   - name (string, opcional): Nombre personalizado para la versión (max 100 caracteres)
 *   - color (string, opcional): Color de etiqueta en formato hexadecimal (ej: #FF5733)
 *   - isImportant (boolean, opcional): Marcar/desmarcar versión como importante
 * 
 * @returns NextResponse con:
 *   - message: Mensaje de confirmación
 *   - version: Versión actualizada
 * 
 * @example
 * ```typescript
 * // Actualizar nombre y color
 * PATCH /api/notes/versions
 * Body: {
 *   "noteId": "c123456789012345678901234",
 *   "versionId": "c987654321098765432109876",
 *   "name": "Versión final",
 *   "color": "#FF5733"
 * }
 * 
 * // Marcar como importante
 * PATCH /api/notes/versions
 * Body: {
 *   "noteId": "c123456789012345678901234",
 *   "versionId": "c987654321098765432109876",
 *   "isImportant": true
 * }
 * 
 * // Eliminar nombre personalizado (establecer a null)
 * PATCH /api/notes/versions
 * Body: {
 *   "noteId": "c123456789012345678901234",
 *   "versionId": "c987654321098765432109876",
 *   "name": null
 * }
 * 
 * // Respuesta exitosa:
 * {
 *   "message": "Versión actualizada correctamente",
 *   "version": { ... }
 * }
 * ```
 * 
 * @throws {401} Si el usuario no está autenticado
 *   - Error: "No autorizado"
 *   - Ejemplo: `{ "error": "No autorizado" }`
 * @throws {404} Si la nota o versión no existe o no pertenece al estudiante
 *   - Error: "Nota no encontrada"
 *   - Error: "Versión no encontrada"
 *   - Error: "No se realizaron cambios o versión no encontrada"
 *   - Ejemplo: `{ "error": "Versión no encontrada" }`
 * @throws {400} Si los datos son inválidos (nombre vacío, color inválido, etc.)
 *   - Error: "Datos inválidos" (si noteId o versionId no son CUIDs válidos)
 *   - Error: "El nombre no puede estar vacío" (si se proporciona nombre vacío)
 *   - Error: "El color debe ser un código hexadecimal válido (ej: #FF5733)" (si color es inválido)
 *   - Error: "No se puede actualizar la versión actual" (si versionId === noteId)
 *   - Ejemplo: `{ "error": "El color debe ser un código hexadecimal válido (ej: #FF5733)" }`
 * @throws {500} Si ocurre un error al actualizar
 *   - Error: "Error en la base de datos"
 *   - Ejemplo: `{ "error": "Error en la base de datos" }`
 * 
 * @example Respuesta exitosa:
 * ```json
 * {
 *   "message": "Versión actualizada correctamente",
 *   "version": {
 *     "id": "c123...",
 *     "title": "Título",
 *     "content": "Contenido...",
 *     "name": "Versión final",
 *     "color": "#FF5733",
 *     "isImportant": true,
 *     "createdAt": "2024-01-01T00:00:00.000Z",
 *     "updatedAt": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * ```
 * 
 * @remarks
 * - Dispara webhooks: 'version.updated', 'version.named' (si se actualiza nombre), 
 *   'version.marked_important' (si se marca como importante) - todos en background
 * - El nombre puede ser null para eliminar el nombre personalizado
 * - El color debe seguir el formato hexadecimal de 6 dígitos (#RRGGBB)
 * - Si no se proporcionan campos para actualizar, retorna 404
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () =>
    withRequestTimeout(request, () => handlePatchRequest(request))
  )
}

/**
 * DELETE: Eliminar versión(es) de una nota
 * 
 * Permite eliminar una versión individual o múltiples versiones en lote.
 * Soporta eliminación individual mediante query params o body, y eliminación en lote mediante body.
 * 
 * @param request - NextRequest con:
 *   - Query params (eliminación individual):
 *     - noteId (string, requerido): ID de la nota (formato CUID)
 *     - versionId (string, requerido): ID de la versión a eliminar (formato CUID)
 *   - Body JSON (eliminación en lote):
 *     - noteId (string, requerido): ID de la nota (formato CUID)
 *     - versionIds (string[], requerido): Array de IDs de versiones a eliminar (max 50)
 * 
 * @returns NextResponse con:
 *   - message: Mensaje de confirmación
 * 
 * @example
 * ```typescript
 * // Eliminar una versión (query params)
 * DELETE /api/notes/versions?noteId=c123456789012345678901234&versionId=c987654321098765432109876
 * 
 * // Eliminar una versión (body JSON - alternativa)
 * DELETE /api/notes/versions
 * Body: {
 *   "noteId": "c123456789012345678901234",
 *   "versionId": "c987654321098765432109876"
 * }
 * 
 * // Eliminar múltiples versiones (body - máximo 50)
 * DELETE /api/notes/versions
 * Body: {
 *   "noteId": "c123456789012345678901234",
 *   "versionIds": ["c111111111111111111111111", "c222222222222222222222222"]
 * }
 * 
 * // Respuesta exitosa (individual):
 * {
 *   "message": "Versión eliminada correctamente"
 * }
 * 
 * // Respuesta exitosa (lote):
 * {
 *   "message": "2 versión(es) eliminada(s) correctamente",
 *   "deletedCount": 2
 * }
 * 
 * // Error si se intenta eliminar más de 50:
 * {
 *   "error": "No se pueden eliminar más de 50 versiones a la vez"
 * }
 * ```
 * 
 * @throws {401} Si el usuario no está autenticado
 *   - Error: "No autorizado"
 *   - Ejemplo: `{ "error": "No autorizado" }`
 * @throws {404} Si la nota o versión(es) no existe(n) o no pertenece(n) al estudiante
 *   - Error: "Nota no encontrada"
 *   - Error: "Versión no encontrada"
 *   - Error: "Algunas versiones no fueron encontradas" (en eliminación en lote)
 *   - Ejemplo: `{ "error": "Versión no encontrada" }`
 * @throws {400} Si los datos son inválidos (más de 50 versiones en lote, etc.)
 *   - Error: "Datos inválidos" (si noteId o versionId no son CUIDs válidos)
 *   - Error: "No se pueden eliminar más de 50 versiones a la vez" (si versionIds.length > 50)
 *   - Error: "Debe proporcionar al menos una versión para eliminar" (si versionIds está vacío)
 *   - Ejemplo: `{ "error": "No se pueden eliminar más de 50 versiones a la vez" }`
 * @throws {500} Si ocurre un error al eliminar
 *   - Error: "Error en la base de datos"
 *   - Ejemplo: `{ "error": "Error en la base de datos" }`
 * 
 * @example Respuesta exitosa (individual):
 * ```json
 * {
 *   "message": "Versión eliminada correctamente"
 * }
 * ```
 * 
 * @example Respuesta exitosa (lote):
 * ```json
 * {
 *   "message": "2 versión(es) eliminada(s) correctamente",
 *   "deletedCount": 2
 * }
 * ```
 * 
 * @remarks
 * - Dispara webhook 'version.deleted' para cada versión eliminada (en background)
 * - En eliminación en lote, los webhooks se procesan en paralelo para mejor performance
 * - La eliminación es permanente y no se puede deshacer
 * - Se invalida automáticamente el caché de versiones después de eliminar (en background)
 * - Soporta eliminación individual mediante query params o body JSON
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () =>
    withRequestTimeout(request, () => handleDeleteRequest(request))
  )
}
