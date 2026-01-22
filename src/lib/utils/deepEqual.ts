/**
 * Función de comparación profunda más robusta que JSON.stringify
 * Maneja casos edge como referencias circulares, funciones, etc.
 */

function deepEqualArrays(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    if (!deepEqual(a[i], b[i])) return false // index controlled by loop bounds
  }
  return true
}

function deepEqualObjects(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false

  // O(1) membership y menos ramas que includes repetido
  const keysBSet = new Set(keysB)

  for (const key of keysA) {
    if (!keysBSet.has(key)) return false

    // eslint-disable-next-line security/detect-object-injection
    const valueA = a[key] // key validated via Object.keys + set membership
    // eslint-disable-next-line security/detect-object-injection
    const valueB = b[key] // key validated via Object.keys + set membership

    if (!deepEqual(valueA, valueB)) return false
  }
  return true
}

export function deepEqual(a: unknown, b: unknown): boolean {
  // Comparación de igualdad estricta (incluye null, undefined, primitivos)
  if (a === b) return true

  // Si uno es null/undefined y el otro no, son diferentes
  if (a == null || b == null) return false

  // Si no son objetos, son diferentes
  if (typeof a !== 'object' || typeof b !== 'object') return false

  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)

  // Si ambos son arrays, comparar elementos
  if (aIsArray && bIsArray) return deepEqualArrays(a, b)

  // Si uno es array y el otro no, son diferentes
  if (aIsArray || bIsArray) return false

  return deepEqualObjects(
    a as Record<string, unknown>,
    b as Record<string, unknown>
  )
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
