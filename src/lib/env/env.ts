/**
 * Loader único de variables de entorno (fail-fast)
 * 
 * Regla Enterprise:
 * Una app que arranca mal ya falló.
 * 
 * Características:
 * - Se ejecuta al importar (fail-fast)
 * - Falla antes de que la app haga nada
 * - Error tipado (SystemError)
 * - Validación completa con Zod
 */

import { EnvSchema } from './env.schema'
import { SystemError } from '../errors/error-types'

/**
 * Variables de entorno validadas y tipadas
 * 
 * ⛔ Se valida al importar este módulo
 * ⛔ Si falla, la app NO arranca
 * 
 * Uso:
 * ```typescript
 * import { env } from '@/lib/env/env'
 * 
 * env.DATABASE_URL // ✅ Tipado y validado
 * process.env.DATABASE_URL // ❌ Prohibido
 * ```
 */
export const env = (() => {
  // Lista de variables permitidas en el esquema (para filtrar process.env)
  const allowedKeys = [
    'NODE_ENV',
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'ENCRYPTION_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'OPENAI_API_KEY',
    'GOOGLE_AI_API_KEY',
    'ANTHROPIC_API_KEY',
    'SENTRY_DSN',
    'NEXT_PUBLIC_SENTRY_DSN',
    'SENTRY_ORG',
    'SENTRY_PROJECT',
    'LOG_LEVEL',
    'NEXT_RUNTIME',
  ] as const

  // Filtrar process.env para solo incluir variables permitidas
  // Esto evita que variables del sistema (Windows, Node, etc.) causen errores
  const filteredEnv = Object.fromEntries(
    allowedKeys
      // eslint-disable-next-line security/detect-object-injection
      .filter((key) => process.env[key] !== undefined) // key validated via allowedKeys as const
      // eslint-disable-next-line security/detect-object-injection
      .map((key) => [key, process.env[key]]) // key validated via allowedKeys as const
  ) as Record<string, string | undefined>

  // Aplicar defaults seguros antes de validar
  const envWithDefaults = {
    ...filteredEnv,
    // Defaults solo cuando son seguros
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  }

  const parsed = EnvSchema.safeParse(envWithDefaults)

  if (!parsed.success) {
    // Construir mensaje de error detallado
    // Zod usa 'issues' no 'errors'
    const errorMessages = parsed.error.issues.map((error) => {
      const path = error.path.length > 0 ? error.path.join('.') : 'root'
      return `${path}: ${error.message}`
    })

    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.format())
    console.error('\n💡 Corrección:')
    console.error('   - Verifica que todas las variables requeridas están configuradas')
    console.error('   - Verifica que los tipos son correctos')
    console.error('   - Verifica que las dependencias entre variables se cumplen')
    console.error('\n📋 Variables requeridas:')
    console.error('   - NODE_ENV (development | test | production)')
    console.error('   - DATABASE_URL')
    console.error('   - NEXTAUTH_SECRET (mínimo 32 caracteres)')
    console.error('   - ENCRYPTION_KEY (mínimo 32 caracteres)')
    console.error('   - NEXTAUTH_URL (requerida en producción)')

    throw new SystemError(
      `Invalid environment configuration: ${errorMessages.join(', ')}`,
      undefined,
      'INVALID_ENV_CONFIG',
      {
        errors: parsed.error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      }
    )
  }

  return parsed.data
})()
