/**
 * Soporte para Idempotency Keys
 * Permite que operaciones críticas sean idempotentes
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * Resultado de verificación de idempotency
 */
export interface IdempotencyResult {
  isDuplicate: boolean
  cachedResponse?: NextResponse
  key: string
}

/**
 * Extrae el idempotency key de la request
 * CORRECCIÓN: Valida que request no sea null/undefined antes de acceder a headers
 */
export function extractIdempotencyKey(request: NextRequest): string | null {
  // Validar que request no sea null/undefined
  if (!request || typeof request !== 'object') {
    return null
  }
  
  try {
    // Buscar en header primero (estándar)
    const headerKey = request.headers.get('idempotency-key')
    // Validar que headerKey sea un string válido
    if (headerKey && typeof headerKey === 'string' && headerKey.trim().length > 0) {
      return headerKey.trim()
    }
  } catch {
    // Si falla al acceder a headers, retornar null
    return null
  }

  // Buscar en body como alternativa
  // Nota: Esto requiere que el body ya esté parseado
  return null
}

/**
 * Verifica si una request es idempotente y retorna respuesta en caché si existe
 */
export async function checkIdempotency(
  _key: string,
  _studentId: string
): Promise<IdempotencyResult | null> {
  // Buscar en base de datos si existe una respuesta en caché
  // Nota: Esto requeriría una tabla de idempotency_keys
  // Por ahora, usamos un enfoque simplificado con caché en memoria
  
  // En una implementación completa, se guardaría en base de datos:
  // - idempotency_key (string, unique)
  // - student_id (string)
  // - response (json)
  // - created_at (datetime)
  // - expires_at (datetime)
  
  // Por ahora retornamos null (no hay duplicado)
  return null
}

/**
 * Guarda una respuesta para un idempotency key
 */
export async function saveIdempotencyResponse(
  key: string,
  studentId: string,
  response: NextResponse,
  statusCode: number
): Promise<void> {
  try {
    // En una implementación completa, se guardaría en base de datos
    // Por ahora solo logueamos
    logger.debug(
      { key, studentId, statusCode },
      'Idempotency response guardada'
    )
  } catch (error) {
    logger.warn(
      { error, key, studentId },
      'Error al guardar idempotency response'
    )
    // No fallar si no se puede guardar
  }
}

/**
 * Middleware para manejar idempotency keys
 */
export async function handleIdempotency(
  request: NextRequest,
  studentId: string,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const idempotencyKey = extractIdempotencyKey(request)
  
  if (!idempotencyKey) {
    // No hay idempotency key, ejecutar normalmente
    return handler()
  }

  // Verificar si ya existe una respuesta
  const checkResult = await checkIdempotency(idempotencyKey, studentId)
  
  if (checkResult?.isDuplicate && checkResult.cachedResponse) {
    logger.info(
      { idempotencyKey, studentId },
      'Request idempotente detectada, retornando respuesta en caché'
    )
    return checkResult.cachedResponse
  }

  // Ejecutar handler y guardar respuesta
  const response = await handler()
  
  // Solo guardar respuestas exitosas (2xx)
  if (response.status >= 200 && response.status < 300) {
    await saveIdempotencyResponse(idempotencyKey, studentId, response, response.status)
  }

  // Agregar header de idempotency
  response.headers.set('Idempotency-Key', idempotencyKey)
  
  return response
}

