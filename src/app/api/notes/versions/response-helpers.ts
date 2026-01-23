/**
 * Helpers para construir respuestas HTTP optimizadas
 * Incluye compresión, ETags, cache headers, etc.
 */

import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { safeRound } from './validation-utils'

/**
 * Configuración de compresión
 */
const COMPRESSION_THRESHOLD = 1024 // Comprimir respuestas > 1KB

/**
 * Genera un ETag para un objeto
 * CORRECCIÓN: Valida que data pueda ser serializado y maneja errores de JSON.stringify
 */
export function generateETag(data: unknown): string {
  let content: string
  try {
    content = typeof data === 'string' ? data : JSON.stringify(data)
    // Validar que content sea un string válido
    if (typeof content !== 'string') {
      content = String(data || '')
    }
  } catch {
    // Si falla JSON.stringify (referencias circulares, etc.), usar representación de string
    content = String(data || '')
  }
  
  try {
    const hash = createHash('md5').update(content).digest('hex')
    // Validar que hash sea un string válido
    return typeof hash === 'string' && hash.length > 0 ? `"${hash}"` : '"fallback"'
  } catch {
    // Si falla createHash, usar hash por defecto
    return '"fallback"'
  }
}

/**
 * Comprime una respuesta si es lo suficientemente grande
 * CORRECCIÓN: Valida que data pueda ser serializado y que jsonString.length sea válido
 */
export function compressResponse(data: string | object): {
  body: string | Buffer
  compressed: boolean
  contentType: string
} {
  let jsonString: string
  try {
    jsonString = typeof data === 'string' ? data : JSON.stringify(data)
    // Validar que jsonString sea un string válido
    if (typeof jsonString !== 'string') {
      jsonString = String(data || '{}')
    }
  } catch {
    // Si falla JSON.stringify (referencias circulares, etc.), usar string por defecto
    jsonString = typeof data === 'string' ? data : '{}'
  }
  
  // Validar que jsonString.length sea un número finito
  const stringLength = typeof jsonString.length === 'number' && Number.isFinite(jsonString.length)
    ? jsonString.length
    : 0
  
  // Solo comprimir si es lo suficientemente grande
  if (stringLength > COMPRESSION_THRESHOLD) {
    try {
      const buffer = Buffer.from(jsonString, 'utf-8')
      // Validar que buffer sea válido antes de comprimir
      if (Buffer.isBuffer(buffer)) {
        const compressed = gzipSync(buffer)
        // Validar que compressed sea un Buffer válido
        if (Buffer.isBuffer(compressed)) {
          return {
            body: compressed,
            compressed: true,
            contentType: 'application/json',
          }
        }
      }
    } catch {
      // Si falla la compresión, retornar sin comprimir
      // No loguear error para evitar spam en logs
    }
  }
  
  return {
    body: jsonString,
    compressed: false,
    contentType: 'application/json',
  }
}

/**
 * Crea una respuesta JSON optimizada con compresión, ETags y cache headers
 */
export function createOptimizedResponse(
  data: unknown,
  options?: {
    etag?: string
    maxAge?: number
    staleWhileRevalidate?: number
    compress?: boolean
    requestETag?: string | null
  }
): NextResponse {
  // CORRECCIÓN: Validar que maxAge y staleWhileRevalidate sean números válidos
  const safeMaxAge = Number.isFinite(options?.maxAge) && (options?.maxAge ?? 0) >= 0
    ? (options?.maxAge ?? 300)
    : 300
  
  const safeStaleWhileRevalidate = Number.isFinite(options?.staleWhileRevalidate) && (options?.staleWhileRevalidate ?? 0) >= 0
    ? (options?.staleWhileRevalidate ?? 60)
    : 60
  
  const compress = options?.compress ?? true
  const requestETag = options?.requestETag

  // Generar ETag si no se proporciona
  const etag = options?.etag || generateETag(data)
  
  // Validar que etag sea un string válido
  const safeEtag = typeof etag === 'string' && etag.length > 0 ? etag : '"fallback"'

  // Verificar si el cliente tiene una versión en caché (304 Not Modified)
  if (requestETag && typeof requestETag === 'string' && requestETag === safeEtag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'ETag': safeEtag,
        'Cache-Control': `public, max-age=${safeMaxAge}, stale-while-revalidate=${safeStaleWhileRevalidate}`,
      },
    })
  }

  // Preparar respuesta
  let response: NextResponse
  const headers: Record<string, string> = {
    'ETag': safeEtag,
    'Cache-Control': `public, max-age=${safeMaxAge}, stale-while-revalidate=${safeStaleWhileRevalidate}`,
    'Vary': 'Accept-Encoding',
  }

  if (compress) {
    const { body, compressed } = compressResponse(data)
    if (compressed) {
      headers['Content-Encoding'] = 'gzip'
      headers['Content-Type'] = 'application/json'
      response = new NextResponse(body as Buffer, {
        headers,
      })
    } else {
      response = NextResponse.json(data, { headers })
    }
  } else {
    response = NextResponse.json(data, { headers })
  }

  return response
}

/**
 * Agrega headers de CORS a una respuesta
 * CORRECCIÓN: Valida que methods y allowedHeaders sean arrays válidos antes de usar join()
 */
export function addCorsHeaders(
  response: NextResponse,
  options?: {
    origin?: string
    methods?: string[]
    allowedHeaders?: string[]
    credentials?: boolean
  }
): NextResponse {
  // Validar que response no sea null/undefined
  if (!response || typeof response !== 'object') {
    return response
  }
  
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Request-ID', 'If-None-Match'],
    credentials = true,
  } = options || {}

  // CORRECCIÓN: Validar que methods sea un array válido antes de usar join()
  const safeMethods = Array.isArray(methods) && methods.length > 0
    ? methods.filter(m => typeof m === 'string').join(', ')
    : 'GET, POST, PATCH, DELETE, OPTIONS'
  
  // CORRECCIÓN: Validar que allowedHeaders sea un array válido antes de usar join()
  const safeAllowedHeaders = Array.isArray(allowedHeaders) && allowedHeaders.length > 0
    ? allowedHeaders.filter(h => typeof h === 'string').join(', ')
    : 'Content-Type, Authorization, X-Request-ID, If-None-Match'
  
  // Validar que origin sea un string válido
  const safeOrigin = typeof origin === 'string' ? origin : '*'

  try {
    response.headers.set('Access-Control-Allow-Origin', safeOrigin)
    response.headers.set('Access-Control-Allow-Methods', safeMethods)
    response.headers.set('Access-Control-Allow-Headers', safeAllowedHeaders)
    
    if (credentials === true) {
      response.headers.set('Access-Control-Allow-Credentials', 'true') // guard:allow-secret
    }
  } catch {
    // Si falla al setear headers, no fallar la función
    // Solo loguear el error
  }

  return response
}

/**
 * Agrega headers de trazabilidad a una respuesta
 * CORRECCIÓN: Valida que response, requestId y duration sean válidos antes de usar
 */
export function addTracingHeaders(
  response: NextResponse,
  requestId: string,
  duration?: number
): NextResponse {
  // Validar que response no sea null/undefined
  if (!response || typeof response !== 'object') {
    return response
  }
  
  // CORRECCIÓN: Validar que requestId sea un string válido
  const safeRequestId = typeof requestId === 'string' && requestId.length > 0
    ? requestId
    : 'unknown'
  
  try {
    response.headers.set('X-Request-ID', safeRequestId)
    
    // CORRECCIÓN: Validar que duration sea un número finito antes de usar en template string
    if (duration !== undefined && Number.isFinite(duration) && duration >= 0) {
      response.headers.set('X-Response-Time', `${safeRound(duration, 0)}ms`)
    }
  } catch {
    // Si falla al setear headers, no fallar la función
    // Solo loguear el error
  }

  return response
}

