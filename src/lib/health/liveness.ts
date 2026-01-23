/**
 * Liveness Check
 * 
 * Regla Enterprise:
 * Verifica que el proceso está vivo.
 * 
 * Características:
 * - No depende de servicios externos
 * - Siempre rápido
 * - Siempre retorna 'ok' si el proceso responde
 * - Sin side effects
 */

import { LivenessResult } from './health.types'

/**
 * Timeout para liveness check (muy corto, solo verifica proceso)
 */
const LIVENESS_TIMEOUT_MS = 100

/**
 * Verifica que el proceso está vivo
 * 
 * ⚠️ Regla: Este check NUNCA debe fallar si el proceso está corriendo.
 * Si falla, significa que el proceso está colgado.
 * 
 * @returns LivenessResult siempre con status 'ok' si el proceso responde
 */
export async function checkLiveness(): Promise<LivenessResult> {
  // Usar Promise.race para timeout explícito
  const checkPromise = Promise.resolve({
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
  })

  const timeoutPromise = new Promise<LivenessResult>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Liveness check timeout - process may be hung'))
    }, LIVENESS_TIMEOUT_MS)
  })

  try {
    return await Promise.race([checkPromise, timeoutPromise])
  } catch (error) {
    // Si el proceso está tan colgado que ni siquiera puede responder,
    // esto no debería ejecutarse, pero por seguridad:
    throw new Error(`Liveness check failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}
