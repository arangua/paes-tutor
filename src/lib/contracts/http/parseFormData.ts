/**
 * Parser explícito de FormData (sin magia)
 * 
 * Reglas:
 * - No coerciona
 * - No ignora
 * - No transforma
 * - Solo extrae valores string de FormData
 * 
 * @throws Error si encuentra valores no string (ej: File objects)
 */
export function parseFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      result[key] = value
    } else {
      // ⛔ Prohibido: valores no string (File objects, etc.)
      throw new Error(
        `Unsupported FormData value type for key "${key}": expected string, got ${typeof value}`
      )
    }
  }

  return result
}
