'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * Hook para sistema de undo/redo
 * Basado en estándares de Google Docs, Figma, Notion
 */
export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useUndoRedo<T>(initialState: T, maxHistory = 50) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  })

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  const setPresent = useCallback(
    (newPresent: T) => {
      setState(current => {
        const newPast = [...current.past, current.present].slice(-maxHistory)
        return {
          past: newPast,
          present: newPresent,
          future: [], // Limpiar futuro al hacer nueva acción
        }
      })
    },
    [maxHistory]
  )

  const undo = useCallback(() => {
    if (!canUndo) return

    setState(current => {
      const previous = current.past[current.past.length - 1]
      const newPast = current.past.slice(0, -1)

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      }
    })
  }, [canUndo])

  const redo = useCallback(() => {
    if (!canRedo) return

    setState(current => {
      const next = current.future[0]
      const newFuture = current.future.slice(1)

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      }
    })
  }, [canRedo])

  const clear = useCallback(() => {
    setState({
      past: [],
      present: initialState,
      future: [],
    })
  }, [initialState])

  return {
    state: state.present,
    setState: setPresent,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    history: {
      past: state.past.length,
      future: state.future.length,
    },
  }
}
