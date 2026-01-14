'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
  category?: string
}

/**
 * Hook para manejar atajos de teclado globales
 * Basado en estándares de Gmail, GitHub, VS Code
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  // Memoizar los shortcuts para evitar re-registrar listeners innecesariamente
  // Usar JSON.stringify para comparación profunda (mejor usar useMemo con dependencias específicas)
  const shortcutsRef = useRef(shortcuts)
  
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    if (shortcuts.length === 0) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Usar la referencia actual para evitar problemas de closure
      const currentShortcuts = shortcutsRef.current
      // Ignorar si el usuario está escribiendo en un input
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Permitir algunos atajos incluso en inputs (como Escape, flechas, números)
        const allowedKeys = ['Escape', 'ArrowLeft', 'ArrowRight', '1', '2', '3', '4', 'b', 'B']
        if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
          return
        }
      }

      for (const shortcut of currentShortcuts) {
        const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase()
        const ctrlMatches =
          shortcut.ctrl !== undefined
            ? shortcut.ctrl
              ? event.ctrlKey || event.metaKey
              : !event.ctrlKey && !event.metaKey
            : true
        const shiftMatches =
          shortcut.shift !== undefined ? (shortcut.shift ? event.shiftKey : !event.shiftKey) : true
        const altMatches =
          shortcut.alt !== undefined ? (shortcut.alt ? event.altKey : !event.altKey) : true

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // shortcuts.length no está en deps porque usamos ref para shortcuts actuales
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * Atajos de teclado globales estándar
 */
export const globalShortcuts = (router: ReturnType<typeof useRouter>) => [
  {
    key: 'k',
    ctrl: true,
    description: 'Abrir búsqueda global',
    action: () => {
      // Disparar evento para abrir búsqueda
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
      document.dispatchEvent(event)
    },
    category: 'navegación',
  },
  {
    key: 'd',
    ctrl: true,
    shift: true,
    description: 'Ir al Dashboard',
    action: () => router.push('/dashboard'),
    category: 'navegación',
  },
  {
    key: 'e',
    ctrl: true,
    shift: true,
    description: 'Ir a Exámenes',
    action: () => router.push('/exams'),
    category: 'navegación',
  },
  {
    key: 'p',
    ctrl: true,
    shift: true,
    description: 'Ir a Perfil',
    action: () => router.push('/profile'),
    category: 'navegación',
  },
  {
    key: 'f',
    ctrl: true,
    shift: true,
    description: 'Ir a Flashcards',
    action: () => router.push('/flashcards'),
    category: 'navegación',
  },
  {
    key: 'n',
    ctrl: true,
    shift: true,
    description: 'Ir a Notas',
    action: () => router.push('/notes'),
    category: 'navegación',
  },
  {
    key: 'h',
    ctrl: true,
    shift: true,
    description: 'Ir a Ayuda',
    action: () => router.push('/help'),
    category: 'navegación',
  },
]

/**
 * Atajos de teclado para exámenes
 */
export const examShortcuts = (
  onPrevious: () => void,
  onNext: () => void,
  onSelectOption: (index: number) => void,
  onBookmark?: () => void,
  onFinish?: () => void
) => [
  {
    key: 'ArrowLeft',
    description: 'Pregunta anterior',
    action: onPrevious,
    category: 'navegación',
  },
  {
    key: 'ArrowRight',
    description: 'Siguiente pregunta',
    action: onNext,
    category: 'navegación',
  },
  {
    key: '1',
    description: 'Seleccionar opción 1',
    action: () => onSelectOption(0),
    category: 'respuesta',
  },
  {
    key: '2',
    description: 'Seleccionar opción 2',
    action: () => onSelectOption(1),
    category: 'respuesta',
  },
  {
    key: '3',
    description: 'Seleccionar opción 3',
    action: () => onSelectOption(2),
    category: 'respuesta',
  },
  {
    key: '4',
    description: 'Seleccionar opción 4',
    action: () => onSelectOption(3),
    category: 'respuesta',
  },
  {
    key: 'b',
    description: 'Marcar/desmarcar favorito',
    action: onBookmark || (() => {}),
    category: 'acción',
  },
  {
    key: 'Enter',
    shift: true,
    description: 'Finalizar examen',
    action: onFinish || (() => {}),
    category: 'acción',
  },
]
