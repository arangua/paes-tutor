/**
 * Readiness Check Endpoint
 * 
 * Regla Enterprise:
 * Verifica que el servicio puede recibir tráfico ahora.
 * 
 * Semántica: ¿Puede recibir tráfico?
 * - Verifica servicios críticos (DB, Redis)
 * - Timeouts cortos (no reintenta)
 * - 200 si está listo, 503 si está degradado
 * 
 * Uso:
 * - Kubernetes readiness probe
 * - Load balancers (verificar que puede servir tráfico)
 * - Monitoreo de servicios
 * 
 * @route GET /api/health/readiness
 */

import { NextResponse } from 'next/server'
import { checkReadiness } from '@/lib/health/readiness'

export const runtime = 'nodejs'

/**
 * GET /api/health/readiness
 * 
 * Retorna el estado de readiness del servicio
 * 
 * ⚠️ Regla:
 * - 200 si está listo (status: 'ok')
 * - 503 si está degradado (status: 'degraded')
 */
export async function GET(): Promise<NextResponse> {
  try {
    const result = await checkReadiness()

    // Mapeo claro: ok → 200, degraded → 503
    const statusCode = result.status === 'ok' ? 200 : 503

    return NextResponse.json(result, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    // Si hay un error inesperado, considerar degradado
    return NextResponse.json(
      {
        status: 'degraded' as const,
        checks: {
          database: 'down' as const,
          redis: 'down' as const,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}
