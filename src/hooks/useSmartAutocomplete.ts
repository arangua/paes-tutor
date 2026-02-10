'use client'

import { useState, useEffect, useCallback, useRef, startTransition } from 'react'
import { useDebounce } from './useDebounce'

export interface AutocompleteSuggestion {
  id: string
  text: string
  type?: 'history' | 'popular' | 'contextual' | 'server'
  metadata?: {
    subject?: string
    topic?: string
    relevance?: number
    frequency?: number
  }
}

export interface UseSmartAutocompleteOptions {
  /**
   * Función para obtener sugerencias del servidor
   */
  fetchSuggestions?: (query: string) => Promise<AutocompleteSuggestion[]>
  /**
   * Sugerencias locales (historial, populares, etc.)
   */
  localSuggestions?: AutocompleteSuggestion[]
  /**
   * Delay para debounce (ms)
   */
  debounceDelay?: number
  /**
   * Número mínimo de caracteres para buscar
   */
  minChars?: number
  /**
   * Máximo número de sugerencias a mostrar
   */
  maxSuggestions?: number
  /**
   * Callback cuando se selecciona una sugerencia
   */
  onSelect?: (suggestion: AutocompleteSuggestion) => void
  /**
   * Callback cuando cambia el query
   */
  onQueryChange?: (query: string) => void
}

/**
 * Hook avanzado para autocompletado inteligente
 * Basado en Nielsen Heuristic #4: Consistency and standards
 * y #8: Flexibility and efficiency
 */
export function useSmartAutocomplete(options: UseSmartAutocompleteOptions = {}) {
  const {
    fetchSuggestions,
    localSuggestions = [],
    debounceDelay = 200,
    minChars = 2,
    maxSuggestions = 10,
    onSelect,
    onQueryChange,
  } = options

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedQuery = useDebounce(query, debounceDelay)

  // Combinar y rankear sugerencias
  const rankSuggestions = useCallback(
    (local: AutocompleteSuggestion[], server: AutocompleteSuggestion[]): AutocompleteSuggestion[] => {
      const combined = [...local, ...server]

      // Ordenar por relevancia
      const sorted = [...combined].sort((a, b) => {
        // Prioridad por tipo
        const typePriority = {
          history: 4,
          contextual: 3,
          server: 2,
          popular: 1,
        }
        const aPriority = typePriority[a.type || 'server'] || 0
        const bPriority = typePriority[b.type || 'server'] || 0
        if (aPriority !== bPriority) return bPriority - aPriority

        // Luego por relevancia
        const aRelevance = a.metadata?.relevance || 0
        const bRelevance = b.metadata?.relevance || 0
        if (aRelevance !== bRelevance) return bRelevance - aRelevance

        // Finalmente por frecuencia
        const aFreq = a.metadata?.frequency || 0
        const bFreq = b.metadata?.frequency || 0
        return bFreq - aFreq
      })

      return sorted.slice(0, maxSuggestions)
    },
    [maxSuggestions]
  )

  // Filtrar sugerencias locales basadas en el query
  const filterLocalSuggestions = useCallback(
    (query: string): AutocompleteSuggestion[] => {
      if (!query.trim()) return localSuggestions.slice(0, maxSuggestions)

      const lowerQuery = query.toLowerCase()
      return localSuggestions
        .filter(suggestion => {
          const text = suggestion.text.toLowerCase()
          return text.startsWith(lowerQuery) || text.includes(lowerQuery)
        })
        .map(suggestion => {
          const text = suggestion.text.toLowerCase()
          const lowerQuery = query.toLowerCase()
          // Crear nueva instancia con metadata actualizada (no mutar el original)
          return {
            ...suggestion,
            metadata: {
              ...suggestion.metadata,
              relevance: text.startsWith(lowerQuery) ? 100 : 50,
            },
          }
        })
        .slice(0, maxSuggestions)
    },
    [localSuggestions, maxSuggestions]
  )

  // Obtener sugerencias del servidor
  useEffect(() => {
    if (!fetchSuggestions || debouncedQuery.length < minChars) {
      // Usar startTransition para evitar renders en cascada
      startTransition(() => {
        setSuggestions(filterLocalSuggestions(debouncedQuery))
        setIsLoading(false)
      })
      return
    }

    // Cancelar request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    // Usar startTransition para diferir la actualización del estado
    startTransition(() => {
      setIsLoading(true)
    })

    fetchSuggestions(debouncedQuery)
      .then(serverSuggestions => {
        if (signal.aborted) return

        const localFiltered = filterLocalSuggestions(debouncedQuery)
        const ranked = rankSuggestions(localFiltered, serverSuggestions)
        setSuggestions(ranked)
        setIsOpen(true)
      })
      .catch(() => {
        if (signal.aborted) return
        // Si falla el servidor, usar solo sugerencias locales
        setSuggestions(filterLocalSuggestions(debouncedQuery))
      })
      .finally(() => {
        if (!signal.aborted) {
          startTransition(() => {
            setIsLoading(false)
          })
        }
      })

    return () => {
      // Cleanup: abortar request si el componente se desmonta
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedQuery, fetchSuggestions, minChars, filterLocalSuggestions, rankSuggestions])

  // Manejar selección
  const selectSuggestion = useCallback(
    (suggestion: AutocompleteSuggestion) => {
      setQuery(suggestion.text)
      setIsOpen(false)
      setSelectedIndex(-1)
      if (onSelect) {
        onSelect(suggestion)
      }
    },
    [onSelect]
  )

  // Manejar cambio de query
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      setSelectedIndex(-1)
      setIsOpen(newQuery.length >= minChars)
      if (onQueryChange) {
        onQueryChange(newQuery)
      }
    },
    [minChars, onQueryChange]
  )

  // Navegación con teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
             
            selectSuggestion(suggestions[selectedIndex]) // index validated via bounds check
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    },
    [isOpen, suggestions, selectedIndex, selectSuggestion]
  )

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    query,
    suggestions,
    isLoading,
    selectedIndex,
    isOpen,
    setQuery: handleQueryChange,
    selectSuggestion,
    setIsOpen,
    handleKeyDown,
  }
}

