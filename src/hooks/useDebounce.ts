import { useState, useEffect } from 'react'

/**
 * Hook personalizado para debounce de valores
 * Útil para búsquedas y filtros que no necesitan ejecutarse en cada keystroke
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
