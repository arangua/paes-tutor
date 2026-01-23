/**
 * Sentry Test Endpoint
 * 
 * Endpoint simple para probar que Sentry funciona en el servidor.
 * No requiere autenticación (solo para pruebas de desarrollo).
 * 
 * @route POST /api/sentry-test
 */

import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export const runtime = 'nodejs'

export async function POST() {
  try {
    // Verificar si Sentry está configurado
    const sentryDsn = process.env.SENTRY_DSN

    if (!sentryDsn) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SENTRY_DSN no está configurado' 
        },
        { status: 503 }
      )
    }

    // Crear error de prueba
    const testError = new Error('Sentry Test Error from Server')
    testError.name = 'SentryServerTest'

    let eventId: string | undefined

    // Usar withScope para asegurar que el contexto se aplique correctamente
    Sentry.withScope((scope) => {
      // Configurar tags
      scope.setTag('test_type', 'server_test')
      scope.setTag('endpoint', '/api/sentry-test')
      scope.setTag('source', 'api')

      // Configurar nivel
      scope.setLevel('error')

      // Configurar contexto
      scope.setContext('test', {
        timestamp: new Date().toISOString(),
        source: 'server',
        endpoint: '/api/sentry-test',
      })

      // Configurar datos extra
      scope.setExtra('test', true)
      scope.setExtra('purpose', 'verify_sentry_server_integration') // guard:allow-secret

      // Capturar la excepción
      eventId = Sentry.captureException(testError)
    })

    // Flush para asegurar que el error se envíe inmediatamente
    const flushed = await Sentry.flush(5000)

    return NextResponse.json({
      success: true,
      eventId: eventId || null,
      flushed,
      message: flushed
        ? 'Error enviado exitosamente a Sentry'
        : 'Error capturado, pero flush timeout (puede enviarse más tarde)',
    })
  } catch (error) {
    console.error('Error al enviar test a Sentry:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al enviar test a Sentry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
