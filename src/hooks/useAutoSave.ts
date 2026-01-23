import { useCallback, useRef, useEffect } from 'react'
import { safeDeepEqual } from '@/lib/utils/deepEqual'
import { captureError } from '@/lib/monitoring'

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number
  enabled?: boolean
}

/**
 * Hook personalizado para auto-guardado con debounce
 * Útil para guardar respuestas, formularios, etc.
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<T>(data)
  const isSavingRef = useRef(false)

  const save = useCallback(async () => {
    if (isSavingRef.current) return

    try {
      isSavingRef.current = true
      await onSave(data)
      previousDataRef.current = data
    } catch (error) {
      // Log error usando servicio de monitoreo
      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'autosave_error',
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
      throw error
    } finally {
      isSavingRef.current = false
    }
  }, [data, onSave])

  useEffect(() => {
    if (!enabled) return

    // Comparar datos para evitar saves innecesarios (usar comparación profunda segura)
    if (safeDeepEqual(previousDataRef.current, data)) {
      return
    }

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(() => {
      // Manejar errores silenciosamente para evitar unhandled rejections
      save().catch(() => {
        // El error ya fue capturado y registrado en save()
        // Solo necesitamos evitar que se propague como unhandled rejection
      })
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, enabled, save])

  // Guardar inmediatamente al desmontar
  useEffect(() => {
    let isMounted = true

    return () => {
      isMounted = false

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Guardar datos pendientes si hay cambios (solo si no estamos guardando)
      if (!isSavingRef.current) {
        // Comparar datos de forma segura (maneja referencias circulares, etc.)
        const hasChanges = !safeDeepEqual(previousDataRef.current, data)
        if (hasChanges) {
          // Ejecutar save de forma segura, capturando errores silenciosamente
          // Solo actualizar refs, no estado (el componente ya se está desmontando)
          onSave(data)
            .then(() => {
              // Solo actualizar ref si el componente aún está montado
              // (aunque en cleanup esto siempre será false, es por seguridad)
              if (isMounted) {
                previousDataRef.current = data
              }
            })
            .catch(() => {
              // Silenciar errores en cleanup - el componente ya se está desmontando
              // No intentar actualizar estado
            })
        }
      }
    }
  }, [data, onSave])

  return {
    save: useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return save()
    }, [save]),
  }
}
