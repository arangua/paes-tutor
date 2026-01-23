/**
 * Check de Conectividad a Base de Datos
 * 
 * Regla Enterprise:
 * Si la DB no está disponible al startup, la app NO debe arrancar.
 * 
 * Características:
 * - Validación de DATABASE_URL (solo PostgreSQL)
 * - Query simple y rápida (SELECT 1)
 * - Timeout explícito (5 segundos)
 * - Error tipado (SystemError)
 * - Sin side effects
 */

import { SystemError } from '@/lib/errors/error-types'
import { prisma } from '@/lib/prisma'

/**
 * Timeout para el check de DB (5 segundos)
 */
const DB_CHECK_TIMEOUT_MS = 5000

/**
 * Verifica que la base de datos esté disponible y sea PostgreSQL
 * 
 * @throws {SystemError} Si la DB no está disponible o es SQLite
 */
export async function checkDatabase(): Promise<void> {
  // ⛔ GUARD CRÍTICO: Detectar SQLite antes de intentar conectar
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new SystemError(
      'DATABASE_URL no está configurada',
      new Error('Missing DATABASE_URL environment variable'),
      'DATABASE_STARTUP_FAILURE',
      {
        timestamp: new Date().toISOString(),
      }
    )
  }

  if (dbUrl.startsWith('file:')) {
    throw new SystemError(
      'SQLite DATABASE_URL detectado. Este proyecto solo usa PostgreSQL (Neon)',
      new Error('SQLite is not supported. Use PostgreSQL (Neon) instead'),
      'DATABASE_STARTUP_FAILURE',
      {
        detectedUrl: dbUrl.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
      }
    )
  }

  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    throw new SystemError(
      'DATABASE_URL no es una URL de PostgreSQL válida',
      new Error('Invalid PostgreSQL URL format'),
      'DATABASE_STARTUP_FAILURE',
      {
        detectedUrl: dbUrl.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
      }
    )
  }

  // Verificar conectividad
  try {
    // Usar Promise.race para timeout explícito
    const checkPromise = prisma.$queryRaw`SELECT 1 as value`
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database check timeout'))
      }, DB_CHECK_TIMEOUT_MS)
    })

    await Promise.race([checkPromise, timeoutPromise])
  } catch (error) {
    const originalError = error instanceof Error ? error : new Error(String(error))
    
    throw new SystemError(
      'Database not reachable at startup',
      originalError,
      'DATABASE_STARTUP_FAILURE',
      {
        timeout: DB_CHECK_TIMEOUT_MS,
        timestamp: new Date().toISOString(),
      }
    )
  }
}
