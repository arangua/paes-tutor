/**
 * Contrato de Variables de Entorno
 * 
 * Regla Enterprise:
 * Una app que arranca mal ya falló.
 * 
 * Características:
 * - Tipos explícitos
 * - Strict (sin variables extra)
 * - Dependencias declaradas
 * - Defaults solo cuando son seguros
 */

import { z } from 'zod'

/**
 * Schema de variables de entorno
 * 
 * ⛔ Regla: Nadie lee process.env directamente fuera de env.ts
 */
export const EnvSchema = z
  .object({
    // Entorno de ejecución (opcional porque el loader aplica default)
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(),

    // Base de datos
    DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida'),

    // NextAuth
    NEXTAUTH_SECRET: z
      .string()
      .min(32, 'NEXTAUTH_SECRET debe tener mínimo 32 caracteres'),
    NEXTAUTH_URL: z.url({ error: 'NEXTAUTH_URL debe ser una URL válida' }).optional(),

    // Encriptación
    ENCRYPTION_KEY: z
      .string()
      .min(32, 'ENCRYPTION_KEY debe tener mínimo 32 caracteres'),

    // Redis (Upstash) - Opcional
    UPSTASH_REDIS_REST_URL: z
      .url({ error: 'UPSTASH_REDIS_REST_URL debe ser una URL válida' })
      .optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // AI Services - Opcionales
    OPENAI_API_KEY: z.string().optional(),
    GOOGLE_AI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),

    // Sentry - Opcional
    SENTRY_DSN: z.url({ error: 'SENTRY_DSN debe ser una URL válida' }).optional(),
    NEXT_PUBLIC_SENTRY_DSN: z
      .url({ error: 'NEXT_PUBLIC_SENTRY_DSN debe ser una URL válida' })
      .optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),

    // Logging - Opcional (default aplicado en loader)
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),

    // Next.js Runtime
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
  })
  .strict() // ⛔ Variables extra prohibidas
  .superRefine((env, ctx) => {
    // Dependencia: NEXTAUTH_URL requerida en producción
    if (env.NODE_ENV === 'production' && !env.NEXTAUTH_URL) {
      ctx.addIssue({
        path: ['NEXTAUTH_URL'],
        message: 'NEXTAUTH_URL es requerida en producción',
        code: 'custom',
      })
    }

    // Dependencia: Si hay UPSTASH_REDIS_REST_URL, debe haber token
    if (env.UPSTASH_REDIS_REST_URL && !env.UPSTASH_REDIS_REST_TOKEN) {
      ctx.addIssue({
        path: ['UPSTASH_REDIS_REST_TOKEN'],
        message: 'UPSTASH_REDIS_REST_TOKEN es requerido cuando UPSTASH_REDIS_REST_URL está configurado',
        code: 'custom',
      })
    }

    // Dependencia: Si hay UPSTASH_REDIS_REST_TOKEN, debe haber URL
    if (env.UPSTASH_REDIS_REST_TOKEN && !env.UPSTASH_REDIS_REST_URL) {
      ctx.addIssue({
        path: ['UPSTASH_REDIS_REST_URL'],
        message: 'UPSTASH_REDIS_REST_URL es requerida cuando UPSTASH_REDIS_REST_TOKEN está configurado',
        code: 'custom',
      })
    }

    // Validación: ENCRYPTION_KEY no puede usar prefijos de desarrollo en producción
    if (env.NODE_ENV === 'production') {
      if (env.ENCRYPTION_KEY.startsWith('dev-') || env.ENCRYPTION_KEY.startsWith('test-')) {
        ctx.addIssue({
          path: ['ENCRYPTION_KEY'],
          message: 'ENCRYPTION_KEY no puede usar prefijos de desarrollo/test en producción',
          code: 'custom',
        })
      }
    }
  })

/**
 * Tipo inferido del schema (no duplicado)
 */
export type Env = z.infer<typeof EnvSchema>
