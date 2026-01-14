import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cuidValidator } from '../../../../lib/utils/version-validators' // guard:allow-secret
import { LIMIT_CONSTANTS } from '../../../../lib/constants'
import { ERROR_MESSAGES } from './error-messages'
import { SIZE_LIMITS } from './config'
import { logger } from '../../../../lib/logger'
import type { Result } from './types'

/**
 * Valida una fecha y su rango permitido
 * CORRECCIÓN: Valida que dateString no sea null/undefined antes de crear Date
 */
function validateDate(dateString: string, fieldName: 'inicio' | 'fin'): Date {
  // Validar que dateString sea un string válido
  if (!dateString || typeof dateString !== 'string' || dateString.trim().length === 0) {
    throw new TypeError(`Fecha de ${fieldName} inválida: string vacío o inválido`)
  }
  
  const date = new Date(dateString.trim())
  // Validar que la fecha es válida
  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Fecha de ${fieldName} inválida: no es una fecha válida`)
  }
  
  // Validar que no sea una fecha demasiado antigua o futura (rango razonable)
  const minDate = new Date('1900-01-01')
  const maxDate = new Date('2100-12-31')
  
  // Validar que minDate y maxDate sean fechas válidas
  if (Number.isNaN(minDate.getTime()) || Number.isNaN(maxDate.getTime())) {
    throw new Error(`Error interno: fechas de rango inválidas`)
  }
  
  if (date < minDate || date > maxDate) {
    throw new Error(`Fecha de ${fieldName} fuera del rango permitido (1900-2100)`)
  }
  return date
}

/**
 * Transforma un string a booleano de forma segura
 */
function transformStringToBoolean(val: string | undefined): boolean | undefined {
  if (val === 'true') return true
  if (val === 'false') return false
  return undefined
}

/**
 * Valida un rango de fechas (dateFrom debe ser anterior a dateTo)
 */
export function validateDateRange(
  dateFrom?: Date,
  dateTo?: Date
): Result<true> {
  if (dateFrom && dateTo && dateFrom > dateTo) {
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_DATE_RANGE },
        { status: 400 }
      ),
    }
  }
  return { success: true, data: true }
}

/**
 * Valida el tamaño del contenido de una versión
 * Previene ataques DoS con contenido muy grande
 * CORRECCIÓN: Valida que content no sea null/undefined antes de usar Buffer.from()
 */
export function validateContentSize(content: string): Result<true> {
  // Validar que content sea un string válido
  if (!content || typeof content !== 'string') {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Content must be a non-empty string' },
        { status: 400 }
      ),
    }
  }
  
  try {
    const buffer = Buffer.from(content, 'utf-8')
    // Validar que buffer sea un Buffer válido
    if (!Buffer.isBuffer(buffer)) {
      return {
        success: false,
        error: NextResponse.json(
          { error: 'Error al calcular tamaño del contenido' },
          { status: 500 }
        ),
      }
    }
    
    const contentSizeBytes = buffer.length
    // Validar que contentSizeBytes sea un número finito
    if (!Number.isFinite(contentSizeBytes) || contentSizeBytes < 0) {
      return {
        success: false,
        error: NextResponse.json(
          { error: 'Error al calcular tamaño del contenido' },
          { status: 500 }
        ),
      }
    }
    
    // Validar que MAX_CONTENT_SIZE sea un número válido antes de comparar
    const maxContentSize = SIZE_LIMITS.MAX_CONTENT_SIZE
    if (!Number.isFinite(maxContentSize) || maxContentSize <= 0) {
      return {
        success: false,
        error: NextResponse.json(
          { error: 'Error de configuración: MAX_CONTENT_SIZE inválido' },
          { status: 500 }
        ),
      }
    }
    
    if (contentSizeBytes > maxContentSize) {
      // Validar que las divisiones sean válidas
      const divisor = 1024 * 1024
      if (!Number.isFinite(divisor) || divisor <= 0) {
        return {
          success: false,
          error: NextResponse.json(
            { error: 'Error al calcular tamaño en MB' },
            { status: 500 }
          ),
        }
      }
      
      const sizeMB = contentSizeBytes / divisor
      const maxMB = maxContentSize / divisor
      
      // Validar que sizeMB y maxMB sean números finitos
      if (!Number.isFinite(sizeMB) || !Number.isFinite(maxMB)) {
        return {
          success: false,
          error: NextResponse.json(
            { error: 'Error al calcular tamaño en MB' },
            { status: 500 }
          ),
        }
      }
      
      return {
        success: false,
        error: NextResponse.json(
          {
            error: ERROR_MESSAGES.CONTENT_TOO_LARGE(maxMB, sizeMB),
            details: {
              currentSize: contentSizeBytes,
              maxSize: maxContentSize,
            },
          },
          { status: 413 } // 413 Payload Too Large
        ),
      }
    }
  } catch {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Error al validar tamaño del contenido' },
        { status: 500 }
      ),
    }
  }
  
  return { success: true, data: true }
}

export const restoreVersionSchema = z.object({
  noteId: cuidValidator(ERROR_MESSAGES.INVALID_NOTE_ID),
  versionId: cuidValidator(ERROR_MESSAGES.INVALID_VERSION_ID),
})

export const updateVersionNameSchema = z.object({
  noteId: cuidValidator(ERROR_MESSAGES.INVALID_NOTE_ID),
  versionId: cuidValidator(ERROR_MESSAGES.INVALID_VERSION_ID),
  name: z.string().max(LIMIT_CONSTANTS.MAX_NOTE_TITLE_LENGTH).optional(),
})

export const updateVersionMetadataSchema = z.object({
  noteId: cuidValidator(ERROR_MESSAGES.INVALID_NOTE_ID),
  versionId: cuidValidator(ERROR_MESSAGES.INVALID_VERSION_ID),
  name: z
    .string()
    .max(SIZE_LIMITS.MAX_VERSION_NAME_LENGTH, `El nombre no puede exceder ${SIZE_LIMITS.MAX_VERSION_NAME_LENGTH} caracteres`)
    .trim()
    .refine((val) => val.length === 0 || val.length >= 1, {
      message: ERROR_MESSAGES.EMPTY_NAME,
    })
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, ERROR_MESSAGES.INVALID_COLOR)
    .optional()
    .nullable(),
  isImportant: z.boolean().optional(),
})

export const deleteVersionSchema = z.object({
  noteId: cuidValidator(ERROR_MESSAGES.INVALID_NOTE_ID),
  versionId: cuidValidator(ERROR_MESSAGES.INVALID_VERSION_ID),
})

export const deleteVersionsBulkSchema = z.object({
  noteId: cuidValidator(ERROR_MESSAGES.INVALID_NOTE_ID),
  versionIds: z
    .array(cuidValidator(ERROR_MESSAGES.INVALID_VERSION_ID))
    .min(1, ERROR_MESSAGES.MIN_VERSIONS_REQUIRED)
    .max(LIMIT_CONSTANTS.VERSION_MAX_BULK_DELETE, ERROR_MESSAGES.BULK_DELETE_LIMIT_EXCEEDED(LIMIT_CONSTANTS.VERSION_MAX_BULK_DELETE)),
})

export const getVersionsQuerySchema = z.object({
  noteId: cuidValidator(ERROR_MESSAGES.INVALID_NOTE_ID),
  limit: z.string().optional().transform((val) => {
    if (!val) return undefined
    // CORRECCIÓN: Validar que val sea un string válido antes de usar parseInt()
    const safeVal = typeof val === 'string' && val.trim().length > 0 ? val.trim() : '0'
    const num = Number.parseInt(safeVal, 10)
    // CORRECCIÓN: Validar que parseInt() retorne un número válido
    if (Number.isNaN(num) || !Number.isFinite(num) || num <= 0) {
      throw new z.ZodError([{
        code: 'custom',
        path: ['limit'],
        message: 'limit debe ser un número entero positivo válido',
      }])
    }
    return num
  }),
  offset: z.string().optional().transform((val) => {
    if (!val) return undefined
    // CORRECCIÓN: Validar que val sea un string válido antes de usar parseInt()
    const safeVal = typeof val === 'string' && val.trim().length > 0 ? val.trim() : '0'
    const num = Number.parseInt(safeVal, 10)
    // CORRECCIÓN: Validar que parseInt() retorne un número válido
    if (Number.isNaN(num) || !Number.isFinite(num) || num < 0) {
      throw new z.ZodError([{
        code: 'custom',
        path: ['offset'],
        message: 'offset debe ser un número entero no negativo válido',
      }])
    }
    return num
  }),
  cursor: z.string().optional(), // Para paginación basada en cursor
  search: z.string().optional(), // Búsqueda en título, contenido, nombre o tags
  isImportant: z.string().optional().transform(transformStringToBoolean), // Filtrar por importancia
  hasName: z.string().optional().transform(transformStringToBoolean), // Filtrar por si tiene nombre personalizado
  dateFrom: z.string().optional().transform((val) => {
    if (!val) return undefined
    return validateDate(val, 'inicio')
  }), // Fecha desde
  dateTo: z.string().optional().transform((val) => {
    if (!val) return undefined
    return validateDate(val, 'fin')
  }), // Fecha hasta
})

/**
 * Valida y normaliza los parámetros de query
 */
export function validateQueryParams(
  request: NextRequest
): Result<z.infer<typeof getVersionsQuerySchema>> {
  // CORRECCIÓN: Validar que request.url sea un string válido antes de usar new URL()
  if (!request || !request.url || typeof request.url !== 'string' || request.url.length === 0) {
    logger.warn(
      { request, url: request?.url },
      'validateQueryParams recibió request.url inválido, retornando error'
    )
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_NOTE_ID, details: 'URL de request inválida' },
        { status: 400 }
      ),
    }
  }
  
  let url: URL
  try {
    url = new URL(request.url)
    // Validar que url sea una instancia válida de URL
    if (!(url instanceof URL)) {
      throw new Error('new URL() no retornó una instancia válida de URL')
    }
  } catch (error) {
    logger.warn(
      { error, url: request.url },
      'validateQueryParams: Error al crear URL, retornando error'
    )
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_NOTE_ID, details: 'URL de request inválida' },
        { status: 400 }
      ),
    }
  }
  
  // CORRECCIÓN: Validar que searchParams sea válido antes de usar entries()
  const searchParams = url.searchParams
  if (!searchParams || typeof searchParams.entries !== 'function') {
    logger.warn(
      { url, searchParams },
      'validateQueryParams: searchParams inválido, retornando error'
    )
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_NOTE_ID, details: 'searchParams inválido' },
        { status: 400 }
      ),
    }
  }
  
  let queryParams: Record<string, string>
  try {
    const entries = searchParams.entries()
    // Validar que entries() retorne un iterable válido
    if (!entries || typeof entries[Symbol.iterator] !== 'function') {
      throw new Error('searchParams.entries() no retornó un iterable válido')
    }
    
    queryParams = Object.fromEntries(entries)
    // Validar que Object.fromEntries() retorne un objeto válido
    if (!queryParams || typeof queryParams !== 'object' || Array.isArray(queryParams)) {
      throw new Error('Object.fromEntries() no retornó un objeto válido')
    }
  } catch (error) {
    logger.warn(
      { error, url: request.url, searchParams },
      'validateQueryParams: Error al procesar searchParams, retornando error'
    )
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_NOTE_ID, details: 'Error al procesar parámetros de query' },
        { status: 400 }
      ),
    }
  }
  const validation = getVersionsQuerySchema.safeParse(queryParams)
  
  if (!validation.success) {
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_NOTE_ID, details: validation.error.issues },
        { status: 400 }
      ),
    }
  }
  
  const { dateFrom, dateTo } = validation.data
  
  // Validar rango de fechas (dateFrom debe ser anterior a dateTo)
  const rangeValidation = validateDateRange(dateFrom, dateTo)
  if (!rangeValidation.success) {
    return rangeValidation
  }
  
  return { success: true, data: validation.data }
}
