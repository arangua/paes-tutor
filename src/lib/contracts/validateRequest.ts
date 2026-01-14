import { ZodSchema } from 'zod'
import { ContractError } from '../errors/error-types'

// Alias para compatibilidad con tests
export const ContractValidationError = ContractError

/**
 * Orquestador único de validación (pieza central)
 * 
 * Reglas:
 * - Un solo punto de validación
 * - Reusable
 * - Testeable
 * - Guardable en CI
 * 
 * ⛔ Invariante: Errores de contrato NO llegan al dominio
 * 
 * @param schema - Schema Zod para validar
 * @param input - Datos a validar (unknown)
 * @returns Datos validados y tipados
 * @throws ContractError si la validación falla
 */
export function validateRequest<T>({
  schema,
  input,
}: {
  schema: ZodSchema<T>
  input: unknown
}): T {
  const result = schema.safeParse(input)

  if (!result.success) {
    // Construir mensaje de error detallado
    // Zod usa 'issues' no 'errors'
    const errorMessages = result.error.issues.map((error) => {
      const path = error.path.length > 0 ? error.path.join('.') : 'root'
      return `${path}: ${error.message}`
    })

    throw new ContractError(
      `Invalid request contract: ${errorMessages.join(', ')}`,
      result.error,
      'INVALID_CONTRACT'
    )
  }

  return result.data
}
