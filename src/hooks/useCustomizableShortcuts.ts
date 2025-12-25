'use client'

import { useState, useEffect, useCallback } from 'react'

const SHORTCUTS_STORAGE_KEY = 'paes-tutor-custom-shortcuts'

export interface CustomShortcut {
  id: string
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: string // ID de la acción
  category: string
  enabled: boolean
}

export interface ShortcutAction {
  id: string
  name: string
  description: string
  handler: () => void
  category: string
}

/**
 * Hook para gestionar atajos de teclado personalizables
 * Basado en estándares de VS Code, GitHub, Linear
 */
export function useCustomizableShortcuts(availableActions: ShortcutAction[]) {
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, CustomShortcut>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar atajos personalizados del localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(SHORTCUTS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setCustomShortcuts(parsed)
      } else {
        // Inicializar con atajos por defecto
        const defaults: Record<string, CustomShortcut> = {}
        availableActions.forEach(action => {
          defaults[action.id] = {
            id: action.id,
            key: '',
            description: action.description,
            action: action.id,
            category: action.category,
            enabled: true,
          }
        })
        setCustomShortcuts(defaults)
      }
    } catch {
      // Si hay error, usar defaults
    } finally {
      setIsLoaded(true)
    }
  }, [availableActions])

  // Guardar atajos personalizados
  const saveShortcuts = useCallback((shortcuts: Record<string, CustomShortcut>) => {
    setCustomShortcuts(shortcuts)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts))
      } catch {
        // Ignorar errores de localStorage
      }
    }
  }, [])

  // Actualizar un atajo específico
  const updateShortcut = useCallback(
    (actionId: string, shortcut: Partial<CustomShortcut>) => {
      const updated = {
        ...customShortcuts,
        [actionId]: {
          ...customShortcuts[actionId],
          ...shortcut,
        },
      }
      saveShortcuts(updated)
    },
    [customShortcuts, saveShortcuts]
  )

  // Restablecer a valores por defecto
  const resetToDefaults = useCallback(() => {
    const defaults: Record<string, CustomShortcut> = {}
    availableActions.forEach(action => {
      defaults[action.id] = {
        id: action.id,
        key: '',
        description: action.description,
        action: action.id,
        category: action.category,
        enabled: true,
      }
    })
    saveShortcuts(defaults)
  }, [availableActions, saveShortcuts])

  // Obtener atajos activos para usar con useKeyboardShortcuts
  const getActiveShortcuts = useCallback(() => {
    return Object.values(customShortcuts)
      .filter(s => s.enabled && s.key)
      .map(s => {
        const action = availableActions.find(a => a.id === s.action)
        if (!action) return null

        return {
          key: s.key,
          ctrl: s.ctrl,
          shift: s.shift,
          alt: s.alt,
          meta: s.meta,
          description: s.description,
          action: action.handler,
          category: s.category,
        }
      })
      .filter(Boolean) as Array<{
      key: string
      ctrl?: boolean
      shift?: boolean
      alt?: boolean
      meta?: boolean
      description: string
      action: () => void
      category: string
    }>
  }, [customShortcuts, availableActions])

  return {
    customShortcuts,
    updateShortcut,
    resetToDefaults,
    getActiveShortcuts,
    isLoaded,
  }
}
