import { ensureFiniteNumber } from './validation-utils'

/**
 * Mensajes de error centralizados para la API de versiones
 * Facilita el mantenimiento y la consistencia de mensajes
 */
export const ERROR_MESSAGES = {
  // Autenticación y autorización
  UNAUTHORIZED: 'No autorizado',
  STUDENT_NOT_FOUND: 'Estudiante no encontrado',
  
  // Notas y versiones
  NOTE_NOT_FOUND: 'Nota no encontrada',
  VERSION_NOT_FOUND: 'Versión no encontrada',
  SOME_VERSIONS_NOT_FOUND: 'Algunas versiones no fueron encontradas',
  CANNOT_UPDATE_CURRENT_VERSION: 'No se puede actualizar la versión actual',
  CANNOT_RESTORE_CURRENT_VERSION: 'Esta es la versión actual, no se requiere restauración',
  CANNOT_RESTORE_EMPTY_VERSION: 'No se puede restaurar una versión con contenido vacío',
  
  // Validación
  INVALID_DATA: 'Datos inválidos',
  INVALID_NOTE_ID: 'ID de nota inválido',
  INVALID_VERSION_ID: 'ID de versión inválido',
  INVALID_DATE_RANGE: 'La fecha de inicio debe ser anterior a la fecha de fin',
  EMPTY_NAME: 'El nombre no puede estar vacío',
  INVALID_COLOR: 'El color debe ser un código hexadecimal válido (ej: #FF5733)',
  EMPTY_REQUEST_BODY: 'El cuerpo de la solicitud no puede estar vacío',
  INVALID_JSON: 'El cuerpo de la solicitud debe ser un JSON válido',
  INVALID_CONTENT_TYPE: 'Content-Type debe ser application/json',
  
  // Límites
  VERSION_LIMIT_REACHED: (maxVersions: number) => 
    `Se ha alcanzado el límite máximo de ${maxVersions} versiones para esta nota. Todas las versiones están marcadas como importantes. Por favor, desmarca algunas versiones como importantes o elimina versiones antiguas antes de crear nuevas.`,
  BULK_DELETE_LIMIT_EXCEEDED: (maxDelete: number) => 
    `No se pueden eliminar más de ${maxDelete} versiones a la vez`,
  MIN_VERSIONS_REQUIRED: 'Debe proporcionar al menos una versión para eliminar',
  CONTENT_TOO_LARGE: (maxSizeMB: number, currentSizeMB: number) => {
    // DECISIÓN DE DISEÑO: Usa ensureFiniteNumber del sistema de validación centralizado
    const safeMaxSizeMB = Math.max(0, ensureFiniteNumber(maxSizeMB, 0))
    const safeCurrentSizeMB = Math.max(0, ensureFiniteNumber(currentSizeMB, 0))
    
    let formattedMax: string
    let formattedCurrent: string
    try {
      formattedMax = safeMaxSizeMB.toFixed(2)
      formattedCurrent = safeCurrentSizeMB.toFixed(2)
      // Validar que toFixed() retorne strings válidos
      if (typeof formattedMax !== 'string' || formattedMax.length === 0) {
        formattedMax = '0.00'
      }
      if (typeof formattedCurrent !== 'string' || formattedCurrent.length === 0) {
        formattedCurrent = '0.00'
      }
    } catch {
      formattedMax = '0.00'
      formattedCurrent = '0.00'
    }
    return `El contenido excede el tamaño máximo de ${formattedMax} MB. Tamaño actual: ${formattedCurrent} MB`
  },
  PAYLOAD_TOO_LARGE: (maxSizeMB: number) =>
    `El payload de la solicitud excede el tamaño máximo de ${maxSizeMB} MB`,
  
  // Operaciones
  NO_CHANGES_MADE: 'No se realizaron cambios o versión no encontrada',
  RESTORE_ERROR: 'Error al restaurar versión: nota no encontrada',
  DELETE_ERROR: 'Error al eliminar versión(es)',
  DATABASE_ERROR: 'Error en la base de datos',
  INTERNAL_ERROR: 'Error interno del servidor',
  DUPLICATE_RESTORE: 'No se puede restaurar la misma versión dos veces seguidas',
  INVALID_RESTORE_SEQUENCE: 'La versión a restaurar no es válida para esta operación',
} as const

/**
 * Mensajes de éxito centralizados
 */
export const SUCCESS_MESSAGES = {
  VERSION_RESTORED: 'Versión restaurada correctamente',
  VERSION_UPDATED: 'Versión actualizada correctamente',
  VERSION_DELETED: 'Versión eliminada correctamente',
  VERSIONS_DELETED: (count: number) => `${count} versión(es) eliminada(s) correctamente`,
} as const

