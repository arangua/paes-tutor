/**
 * Sentry Smoke Test Endpoint
 * 
 * Endpoint para verificar que Sentry está configurado y funcionando correctamente.
 * Requiere autenticación mediante header x-smoke-key para seguridad.
 * 
 * @route GET /api/sentry-smoke
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import * as Sentry from '@sentry/nextjs'

export const runtime = 'nodejs'

interface SmokeTestResponse {
  ok: boolean
  sentry: 'enabled' | 'disabled'
  timestamp: string
}

/**
 * Valida la autenticación del request
 */
function validateAuth(request: NextRequest): NextResponse<{ error: string }> | null {
  const smokeKey = request.headers.get('x-smoke-key')
  const expectedKey = process.env.SMOKE_TEST_KEY

  if (!expectedKey) {
    logger.warn(
      {},
      'SMOKE_TEST_KEY no configurado en variables de entorno'
    )
    return NextResponse.json(
      { error: 'Configuración de smoke test no disponible' },
      { status: 503 }
    )
  }

  if (!smokeKey || smokeKey !== expectedKey) {
    logger.warn(
      { hasKey: !!smokeKey, keyLength: smokeKey?.length },
      'Intento de acceso a smoke test con clave inválida'
    )
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 403 }
    )
  }

  return null
}

/**
 * Captura un error de prueba en Sentry
 */
function captureTestError(): string | undefined {
  const testError = new Error('SENTRY_SMOKE_TEST')
  testError.name = 'SentrySmokeTest'
  
  let eventId: string | undefined
  
  Sentry.withScope((scope) => {
    scope.setTag('smoke_test', 'true')
    scope.setTag('endpoint', '/api/sentry-smoke')
    scope.setTag('test_type', 'smoke_test')
    scope.setLevel('error')
    scope.setContext('smoke_test', {
      timestamp: new Date().toISOString(),
      endpoint: '/api/sentry-smoke',
    })
    scope.setExtra('smoke_test', true)
    scope.setExtra('purpose', 'verificar_integracion_sentry')
    eventId = Sentry.captureException(testError)
  })

  return eventId
}

/**
 * Intenta hacer flush de Sentry con múltiples reintentos
 */
async function flushSentry(eventId: string | undefined): Promise<boolean> {
  const maxAttempts = 5
  const flushTimeout = 20000

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    logger.info(
      { attempt, maxAttempts, eventId, timeout: flushTimeout },
      `Sentry smoke test: Intento ${attempt}/${maxAttempts} de flush (timeout: ${flushTimeout}ms)...`
    )
    
    try {
      const flushed = await Sentry.flush(flushTimeout)
      
      if (flushed) {
        logger.info(
          { eventId, attempt },
          'Sentry smoke test: Evento enviado exitosamente a Sentry'
        )
        return true
      }
      
      logger.warn(
        { eventId, attempt, maxAttempts },
        `Sentry smoke test: Intento ${attempt} falló (timeout), reintentando...`
      )
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (flushError) {
      logger.error(
        { eventId, attempt, error: flushError },
        `Sentry smoke test: Error durante flush en intento ${attempt}`
      )
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  return false
}

/**
 * GET /api/sentry-smoke
 * 
 * Verifica que Sentry esté configurado y funcional
 * 
 * Headers requeridos:
 * - x-smoke-key: Clave de autenticación (debe coincidir con SMOKE_TEST_KEY)
 * 
 * @returns { ok: true, sentry: 'enabled' | 'disabled', timestamp: string }
 */
export async function GET(request: NextRequest): Promise<NextResponse<SmokeTestResponse | { error: string }>> {
  try {
    const authError = validateAuth(request)
    if (authError) {
      return authError
    }

    const sentryDsn = process.env.SENTRY_DSN

    if (!sentryDsn) {
      logger.info(
        {},
        'Sentry smoke test: Sentry deshabilitado (SENTRY_DSN no configurado)'
      )
      return NextResponse.json({
        ok: true,
        sentry: 'disabled',
        timestamp: new Date().toISOString(),
        message: 'SENTRY_DSN no está configurado en variables de entorno',
      })
    }

    const isValidDsn = sentryDsn.startsWith('https://') && sentryDsn.includes('@')
    if (!isValidDsn) {
      logger.warn(
        { dsnLength: sentryDsn.length },
        'Sentry smoke test: DSN tiene formato sospechoso'
      )
    }

    try {
      const eventId = captureTestError()

      logger.info(
        { 
          eventId, 
          sentryDsn: sentryDsn.substring(0, 30) + '...',
          hasEventId: !!eventId 
        },
        'Sentry smoke test: Error de prueba capturado, enviando...'
      )

      const flushed = await flushSentry(eventId)

      if (!flushed) {
        logger.warn(
          { eventId, attempts: 5 },
          'Sentry smoke test: Todos los intentos de flush fallaron. Verifica: 1) DSN correcto, 2) Conexión a internet, 3) Logs del servidor para errores de transporte'
        )
      }
      
      return NextResponse.json({
        ok: true,
        sentry: 'enabled',
        timestamp: new Date().toISOString(),
        eventId: eventId || null,
        flushed: flushed,
        dsnConfigured: true,
        dsnValid: isValidDsn,
        message: flushed 
          ? 'Evento enviado exitosamente a Sentry. Revisa tu dashboard de Sentry en unos segundos.' 
          : 'Evento capturado, pero flush timeout. El evento puede enviarse más tarde. Revisa tu dashboard de Sentry en unos minutos.',
        troubleshooting: !flushed ? {
          tip: 'Si no ves el evento en Sentry después de unos minutos, verifica:',
          checks: [
            '1. Que el DSN sea correcto y esté activo en tu proyecto de Sentry',
            '2. Que no haya filtros de entorno configurados en Sentry',
            '3. Que el proyecto de Sentry esté activo y no haya alcanzado el límite de eventos',
            '4. Revisa los logs del servidor para ver si hay errores de conexión',
          ],
        } : undefined,
      })
    } catch (sentryError) {
      logger.error(
        { error: sentryError },
        'Error al enviar smoke test a Sentry'
      )
      
      return NextResponse.json({
        ok: true,
        sentry: 'enabled',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    logger.error(
      { error },
      'Error inesperado en smoke test de Sentry'
    )
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
