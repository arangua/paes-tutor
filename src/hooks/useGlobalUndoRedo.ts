'use client'

import * as React from 'react'
import { useState, useCallback, useEffect, createContext, useContext } from 'react'
import { trackError } from '@/lib/monitoring'

export interface GlobalAction {
  id: string
  type: 'create' | 'update' | 'delete' | 'custom'
  description: string
  undo: () => Promise<void> | void
  redo: () => Promise<void> | void
  timestamp: Date
}

const MAX_HISTORY = 50

// Contexto para compartir estado global
const UndoRedoContext = createContext<ReturnType<typeof useGlobalUndoRedoInternal> | null>(null)

/**
 * Hook interno para sistema de undo/redo
 * Basado en estándares de Google Docs, Figma, Notion
 */
function useGlobalUndoRedoInternal() {
  const [history, setHistory] = useState<GlobalAction[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isUndoing, setIsUndoing] = useState(false)
  const [isRedoing, setIsRedoing] = useState(false)

  const canUndo = currentIndex >= 0
  const canRedo = currentIndex < history.length - 1

  // Agregar acción al historial
  const addAction = useCallback(
    (action: Omit<GlobalAction, 'timestamp'>) => {
      if (isUndoing || isRedoing) return

      const newAction: GlobalAction = {
        ...action,
        timestamp: new Date(),
      }

      setHistory(prev => {
        // Eliminar acciones futuras si estamos en medio del historial
        const newHistory = prev.slice(0, currentIndex + 1)
        // Agregar nueva acción
        const updated = [...newHistory, newAction].slice(-MAX_HISTORY)
        setCurrentIndex(updated.length - 1)
        return updated
      })
    },
    [currentIndex, isUndoing, isRedoing]
  )

  // Deshacer última acción
  const undo = useCallback(async () => {
    if (!canUndo || isUndoing || isRedoing) return

    setIsUndoing(true)
    try {
      // eslint-disable-next-line security/detect-object-injection
      const action = history[currentIndex] // index controlled by canUndo/currentIndex bounds
      if (action) {
        await action.undo()
        setCurrentIndex(prev => prev - 1)
      }
    } catch (error) {
      trackError(
        error instanceof Error ? error : new Error(String(error)),
        {
          type: 'undo_redo_error',
          operation: 'undo',
          currentIndex,
          historyLength: history.length,
        }
      )
    } finally {
      setIsUndoing(false)
    }
  }, [canUndo, currentIndex, history, isUndoing, isRedoing])

  // Rehacer última acción deshecha
  const redo = useCallback(async () => {
    if (!canRedo || isUndoing || isRedoing) return

    setIsRedoing(true)
    try {
      const nextIndex = currentIndex + 1
      // eslint-disable-next-line security/detect-object-injection
      const action = history[nextIndex] // index controlled by canRedo/currentIndex bounds
      if (action) {
        await action.redo()
        setCurrentIndex(nextIndex)
      }
    } catch (error) {
      trackError(
        error instanceof Error ? error : new Error(String(error)),
        {
          type: 'undo_redo_error',
          operation: 'redo',
          currentIndex,
          historyLength: history.length,
        }
      )
    } finally {
      setIsRedoing(false)
    }
  }, [canRedo, currentIndex, history, isUndoing, isRedoing])

  // Limpiar historial
  const clear = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  // Obtener historial reciente
  const getRecentActions = useCallback(
    (limit = 10) => {
      return history.slice(-limit).reverse()
    },
    [history]
  )

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    isUndoing,
    isRedoing,
    clear,
    getRecentActions,
    historyLength: history.length,
    currentIndex,
  }
}

/**
 * Hook para usar undo/redo global (debe usarse dentro del Provider)
 */
export function useGlobalUndoRedo() {
  const context = useContext(UndoRedoContext)
  if (!context) {
    // Retornar implementación básica si no hay provider
    return {
      addAction: () => {},
      undo: async () => {},
      redo: async () => {},
      canUndo: false,
      canRedo: false,
      isUndoing: false,
      isRedoing: false,
      clear: () => {},
      getRecentActions: () => [],
      historyLength: 0,
      currentIndex: -1,
    }
  }
  return context
}

/**
 * Provider para undo/redo global
 */
export function GlobalUndoRedoProvider({ children }: { children: React.ReactNode }) {
  const undoRedo = useGlobalUndoRedoInternal()

  // Atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si está escribiendo en un input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Ctrl/Cmd + Z para undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undoRedo.undo()
      }

      // Ctrl/Cmd + Shift + Z o Ctrl/Cmd + Y para redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault()
        undoRedo.redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undoRedo])

  return React.createElement(UndoRedoContext.Provider, { value: undoRedo }, children)
}

