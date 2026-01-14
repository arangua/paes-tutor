/**
 * Función de comparación profunda más robusta que JSON.stringify
 * Maneja casos edge como referencias circulares, funciones, etc.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  // Comparación de igualdad estricta (incluye null, undefined, primitivos)
  if (a === b) return true

  // Si uno es null/undefined y el otro no, son diferentes
  if (a == null || b == null) return false

  // Si no son objetos, son diferentes
  if (typeof a !== 'object' || typeof b !== 'object') return false

  // Si son arrays, comparar elementos
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }

    return true
  }

  // Si uno es array y el otro no, son diferentes
  if (Array.isArray(a) || Array.isArray(b)) return false

  // Comparar objetos
  const keysA = Object.keys(a as Record<string, unknown>)
  const keysB = Object.keys(b as Record<string, unknown>)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false

    const valueA = (a as Record<string, unknown>)[key]
    const valueB = (b as Record<string, unknown>)[key]

    if (!deepEqual(valueA, valueB)) return false
  }

  return true
}

/**
 * Comparación segura que maneja errores (referencias circulares, etc.)
 */
export function safeDeepEqual(a: unknown, b: unknown): boolean {
  try {
    return deepEqual(a, b)
  } catch {
    // Si hay error (referencia circular, etc.), usar JSON.stringify como fallback
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch {
      // Si JSON.stringify también falla, considerar diferentes
      return false
    }
  }
}
