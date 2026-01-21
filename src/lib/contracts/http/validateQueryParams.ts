import { z } from 'zod'
import { setRecordValue } from '@/lib/safe-record'

/**
 * Validador de query parameters
 * 
 * Extrae y valida query parameters de la URL
 * Solo valida si el schema está definido (no valida si no hay schema)
 * 
 * @param request - NextRequest con la URL
 * @param schema - Schema Zod para validar los query params (opcional)
 * @returns Datos validados y tipados, o undefined si no hay schema
 * @throws Error si la validación falla
 */
export function validateQueryParams<T>(
  request: Request,
  schema?: z.ZodSchema<T>
): T | undefined {
  if (!schema) {
    return undefined
  }

  const { searchParams } = new URL(request.url)
  const queryParams: Record<string, string> = {}

  for (const [key, value] of searchParams.entries()) {
    setRecordValue(queryParams, key, value)
  }

  const result = schema.safeParse(queryParams)

  if (!result.success) {
    const details = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ')
    throw new Error(
      `Invalid query parameters: ${details}`
    )
  }

  return result.data
}
