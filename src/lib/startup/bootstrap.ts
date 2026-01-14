/**
 * Bootstrap de Startup Checks
 * 
 * Regla Enterprise:
 * Se ejecuta automáticamente al importar este módulo.
 * 
 * ⛔ IMPORTANTE: Este módulo debe importarse SOLO en el servidor.
 * 
 * Uso:
 * ```typescript
 * // En app/layout.tsx (server component)
 * import '@/lib/startup/bootstrap'
 * ```
 * 
 * O en un middleware:
 * ```typescript
 * // En middleware.ts
 * import '@/lib/startup/bootstrap'
 * ```
 */

import { runStartupChecks } from './startup-checks'

/**
 * Flag para evitar ejecutar checks múltiples veces
 */
let checksExecuted = false

/**
 * Ejecuta los checks de startup una sola vez
 * 
 * ⛔ Regla: Si falla, el proceso se aborta
 */
async function bootstrap(): Promise<void> {
  // Solo ejecutar una vez
  if (checksExecuted) {
    return
  }

  // Solo ejecutar en Node.js runtime (no en Edge Runtime)
  const isEdgeRuntime =
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge') ||
    (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis)

  if (isEdgeRuntime) {
    // En Edge Runtime, skip los checks (no hay DB/Redis en Edge)
    return
  }

  // Solo ejecutar en servidor (no en cliente)
  if (typeof window !== 'undefined') {
    return
  }

  try {
    await runStartupChecks()
    checksExecuted = true
  } catch (error) {
    // Log el error antes de abortar
    console.error('❌ Startup checks failed. Application will not start.')
    console.error(error)
    
    // En producción, abortar el proceso
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
    
    // Re-lanzar para que el error sea visible
    throw error
  }
}

// Ejecutar bootstrap automáticamente
// Usar void para evitar que el await bloquee la importación
void bootstrap()
