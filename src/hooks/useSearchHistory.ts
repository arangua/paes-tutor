'use client'

import { useState, useCallback } from 'react'

const SEARCH_HISTORY_KEY = 'paes-tutor-search-history'
const MAX_HISTORY_ITEMS = 10

export interface SearchHistoryItem {
  query: string
  timestamp: number
  type?: 'exam' | 'material' | 'topic' | 'general'
}

/**
 * Hook para manejar historial de búsquedas
 * Basado en estándares de Google, GitHub, VS Code
 */
export function useSearchHistory() {
  // Lazy initialization para evitar setState en efecto
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (saved) {
        return JSON.parse(saved) as SearchHistoryItem[]
      }
    } catch {
      // Ignorar errores de localStorage
    }
    return []
  })

  // Guardar en historial
  const addToHistory = useCallback((query: string, type?: SearchHistoryItem['type']) => {
    if (!query.trim()) return

    setHistory(prev => {
      // Eliminar duplicados y mantener orden cronológico
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase())
      const newItem: SearchHistoryItem = {
        query: query.trim(),
        timestamp: Date.now(),
        type,
      }

      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)

      // Persistir
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // Ignorar errores
      }

      return updated
    })
  }, [])

  // Limpiar historial
  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch {
      // Ignorar errores
    }
  }, [])

  // Obtener sugerencias basadas en query
  const getSuggestions = useCallback(
    (query: string, limit = 5): SearchHistoryItem[] => {
      if (!query.trim()) return history.slice(0, limit)

      const lowerQuery = query.toLowerCase()
      return history.filter(item => item.query.toLowerCase().includes(lowerQuery)).slice(0, limit)
    },
    [history]
  )

  return {
    history,
    addToHistory,
    clearHistory,
    getSuggestions,
  }
}
