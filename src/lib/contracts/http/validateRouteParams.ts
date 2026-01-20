import { z } from 'zod'
import { setRecordValue } from '@/lib/safe-record'

/**
 * Validador de route parameters
 * 
 * Extrae y valida parámetros dinámicos de la ruta (ej: /api/notes/[id])
 * 
 * @param params - Objeto con los route params (de Next.js)
 * @param schema - Schema Zod para validar los params
 * @returns Datos validados y tipados
 * @throws Error si la validación falla
 */
export function validateRouteParams<T>(
  params: Record<string, string | string[] | undefined>,
  schema: z.ZodSchema<T>
): T {
  // Convertir arrays a string (tomar primer elemento)
  const normalizedParams: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      setRecordValue(normalizedParams, key, value[0])
    } else {
      setRecordValue(normalizedParams, key, value)
    }
  }

  const result = schema.safeParse(normalizedParams)

  if (!result.success) {
    throw new Error(
      `Invalid route parameters: ${result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
    )
  }

  return result.data
}
