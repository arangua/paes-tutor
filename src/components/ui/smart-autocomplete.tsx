'use client'

import React, { useRef, useEffect } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { Loader2, Search, Clock, TrendingUp, X } from 'lucide-react'
import { useSmartAutocomplete, AutocompleteSuggestion } from '@/hooks/useSmartAutocomplete'
import { cn } from '@/lib/utils'

export interface SmartAutocompleteProps {
  /**
   * Valor actual del input
   */
  value: string
  /**
   * Callback cuando cambia el valor
   */
  onChange: (value: string) => void
  /**
   * Placeholder del input
   */
  placeholder?: string
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
   * Clase CSS adicional
   */
  className?: string
  /**
   * Deshabilitar el componente
   */
  disabled?: boolean
  /**
   * Otras props del Input
   */
  inputProps?: React.ComponentProps<typeof Input>
}

/**
 * Componente de autocompletado inteligente
 * Basado en Nielsen Heuristic #4: Consistency and standards
 * y #8: Flexibility and efficiency
 */
export function SmartAutocomplete({
  value,
  onChange,
  placeholder = 'Escribe para buscar...',
  fetchSuggestions,
  localSuggestions = [],
  debounceDelay = 200,
  minChars = 2,
  maxSuggestions = 10,
  onSelect,
  className,
  disabled,
  inputProps,
}: SmartAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const {
    query,
    suggestions,
    isLoading,
    selectedIndex,
    isOpen,
    setQuery,
    selectSuggestion,
    setIsOpen,
    handleKeyDown,
  } = useSmartAutocomplete({
    fetchSuggestions,
    localSuggestions,
    debounceDelay,
    minChars,
    maxSuggestions,
    onSelect,
    onQueryChange: onChange,
  })

  // Sincronizar query con value externo
  useEffect(() => {
    if (value !== query) {
      setQuery(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // setQuery es estable del hook useState, no necesita estar en dependencias
    // Solo value y query son las dependencias necesarias para este efecto
  }, [value, query])

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  // Scroll a la sugerencia seleccionada
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  const getSuggestionIcon = (suggestion: AutocompleteSuggestion) => {
    switch (suggestion.type) {
      case 'history':
        return Clock
      case 'popular':
        return TrendingUp
      default:
        return Search
    }
  }

  const getSuggestionLabel = (suggestion: AutocompleteSuggestion) => {
    switch (suggestion.type) {
      case 'history':
        return 'Reciente'
      case 'popular':
        return 'Popular'
      case 'contextual':
        return 'Sugerido'
      default:
        return 'Resultado'
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          {...inputProps}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= minChars || suggestions.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('pr-10', inputProps?.className)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {query && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg max-h-60 overflow-hidden">
          <CardContent className="p-0">
            <div
              ref={suggestionsRef}
              className="max-h-60 overflow-y-auto"
              role="listbox"
              aria-label="Sugerencias de búsqueda"
              aria-live="polite"
            >
              {suggestions.map((suggestion, index) => {
                const Icon = getSuggestionIcon(suggestion)
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectSuggestion(suggestion)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
                      isSelected ? 'bg-accent' : 'hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{suggestion.text}</span>
                        {suggestion.type && (
                          <Badge variant="outline" className="text-xs">
                            {getSuggestionLabel(suggestion)}
                          </Badge>
                        )}
                      </div>
                      {suggestion.metadata?.subject && (
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.metadata.subject}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

