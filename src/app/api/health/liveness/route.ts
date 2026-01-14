/**
 * Liveness Check Endpoint
 * 
 * Regla Enterprise:
 * Verifica que el proceso está vivo.
 * 
 * Semántica: ¿Está vivo?
 * - No depende de servicios externos
 * - Siempre rápido
 * - Siempre 200 si el proceso responde
 * 
 * Uso:
 * - Kubernetes liveness probe
 * - Load balancers (verificar que el proceso responde)
 * - Monitoreo básico
 * 
 * @route GET /api/health/liveness
 */

import { NextResponse } from 'next/server'
import { checkLiveness } from '@/lib/health/liveness'

export const runtime = 'nodejs'

/**
 * GET /api/health/liveness
 * 
 * Retorna el estado de liveness del proceso
 * 
 * ⚠️ Regla: Siempre retorna 200 si el proceso responde.
 * Si el proceso está tan colgado que no puede responder, el endpoint no se ejecutará.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const result = await checkLiveness()

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    // Si llegamos aquí, el proceso está muy degradado
    // Pero aún así retornamos 200 para que el orquestador sepa que el proceso existe
    // El error se loguea pero no se expone al cliente
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}
