/**
 * Environment Variables - Enterprise Contract
 * 
 * ⛔ Regla: Nadie lee process.env directamente fuera de este módulo
 * 
 * Uso:
 * ```typescript
 * import { env } from '@/lib/env'
 * 
 * env.DATABASE_URL // ✅ Tipado y validado
 * process.env.DATABASE_URL // ❌ Prohibido
 * ```
 */

export { env } from './env'
export { EnvSchema, type Env } from './env.schema'
