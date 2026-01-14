'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  X,
  Loader2,
  BookOpen,
  FileText,
  Tag,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { toast } from 'sonner'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { TIME_CONSTANTS } from '@/lib/constants'

interface SearchResult {
  type: 'exam' | 'material' | 'topic' | 'attempt'
  id: string
  title: string
  description?: string
  subject: string
  subjectCode?: string
  topic?: string
  ejeTematico?: string
  tipo?: string
  totalPreguntas?: number
  estado?: string
  puntaje?: number
  porcentaje?: number
  relevance: number
  url: string
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TYPE_LABELS = {
  exam: 'Examen',
  material: 'Material',
  topic: 'Tema',
  attempt: 'Intento',
}

const TYPE_ICONS = {
  exam: BookOpen,
  material: FileText,
  topic: Tag,
  attempt: Clock,
}

const TYPE_COLORS = {
  exam: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  material: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  topic: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  attempt: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 300)
  const { history, addToHistory, getSuggestions } = useSearchHistory()

  // Obtener sugerencias del historial
  const historySuggestions = getSuggestions(query, 5)

  // Buscar
  useEffect(() => {
    if (!open) return

    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`)

        if (!response.ok) {
          throw new Error('Error al buscar')
        }

        // Validar respuesta con Zod para type safety en runtime
        const { validateResponse } = await import('@/lib/api-helpers')
        const { searchResponseSchema } = await import('@/lib/validations')
        
        const validation = await validateResponse(response, searchResponseSchema, {
          path: '/api/search',
          operation: 'búsqueda global',
        })

        if (!validation.success) {
          throw new Error(validation.error)
        }

        const { results, suggestions } = validation.data
        setResults(results)
        setSuggestions(suggestions || [])
      } catch (error) {
        const errorInfo = extractErrorInfo(error)
        const errorMessage = getErrorMessage(ERROR_CODES.NETWORK_SERVER_ERROR, {
          message: errorInfo.message,
        })
        toast.error(errorMessage.title, {
          description: `${errorMessage.description} ${errorMessage.solution}`,
        })
        setResults([])
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, open])

  // Enfocar input cuando se abre
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus()
      }, TIME_CONSTANTS.FOCUS_DELAY_MS)
      setQuery('')
      setSelectedIndex(0)
      return () => clearTimeout(timeout)
    }
  }, [open])

  const handleSelect = useCallback((index: number) => {
    if (index < results.length) {
      // Seleccionar resultado
      const result = results[index]
      addToHistory(query, result.type)
      onOpenChange(false)
      router.push(result.url)
    } else if (index < results.length + suggestions.length) {
      // Seleccionar sugerencia del servidor
      const suggestion = suggestions[index - results.length]
      setQuery(suggestion)
      addToHistory(suggestion)
    } else {
      // Seleccionar sugerencia del historial
      const historyIndex = index - results.length - suggestions.length
      const historyItem = historySuggestions[historyIndex]
      if (historyItem) {
        setQuery(historyItem.query)
        addToHistory(historyItem.query, historyItem.type)
      }
    }
  }, [results, query, addToHistory, onOpenChange, router, suggestions, historySuggestions])

  // Manejar teclado
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const maxIndex = results.length + suggestions.length + historySuggestions.length - 1
          return prev < maxIndex ? prev + 1 : prev
        })
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(selectedIndex)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, results, suggestions, selectedIndex, onOpenChange, handleSelect, historySuggestions.length])

  const handleResultClick = (result: SearchResult) => {
    addToHistory(query, result.type)
    onOpenChange(false)
    router.push(result.url)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    addToHistory(suggestion)
  }

  const handleRecentSearchClick = (item: SearchHistoryItem) => {
    setQuery(item.query)
    addToHistory(item.query, item.type)
  }

  if (!open) return null

  return (
    <div
      id="search"
      role="search"
      aria-label="Búsqueda global"
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[20vh] px-4"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg w-full max-w-2xl">
        {/* Input */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar exámenes, materiales, temas..."
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="border-0 focus-visible:ring-0 text-lg"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                setResults([])
                setSuggestions([])
                inputRef.current?.focus()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Contenido */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && !query && history.length > 0 && (
            <div className="p-4">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Búsquedas recientes
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 5).map((item, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentSearchClick(item)}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {item.query}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!isLoading && query && results.length === 0 && suggestions.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron resultados para &quot;{query}&quot;</p>
            </div>
          )}

          {/* Resultados */}
          {!isLoading && results.length > 0 && (
            <div className="p-2">
              {results.map((result, idx) => {
                const Icon = TYPE_ICONS[result.type]
                const isSelected = idx === selectedIndex

                return (
                  <Card
                    key={`${result.type}-${result.id}`}
                    className={`mb-2 cursor-pointer transition-colors ${
                      isSelected ? 'bg-accent border-primary' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${TYPE_COLORS[result.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {TYPE_LABELS[result.type]}
                            </Badge>
                            <span className="font-semibold truncate">{result.title}</span>
                          </div>
                          {result.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {result.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                            <span>{result.subject}</span>
                            {result.topic && (
                              <>
                                <span>•</span>
                                <span>{result.topic}</span>
                              </>
                            )}
                            {result.year && (
                              <>
                                <span>•</span>
                                <span>{result.year}</span>
                              </>
                            )}
                            {result.porcentaje !== undefined && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {result.porcentaje}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Sugerencias del servidor */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Sugerencias</div>
              <div className="space-y-1">
                {suggestions.map((suggestion, idx) => {
                  const suggestionIndex = results.length + idx
                  const isSelected = suggestionIndex === selectedIndex

                  return (
                    <Button
                      key={idx}
                      variant="ghost"
                      className={`w-full justify-start ${isSelected ? 'bg-accent' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sugerencias del historial */}
          {!isLoading && query && historySuggestions.length > 0 && (
            <div className="p-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Búsquedas anteriores
              </div>
              <div className="space-y-1">
                {historySuggestions.map((item, idx) => {
                  const historyIndex = results.length + suggestions.length + idx
                  const isSelected = historyIndex === selectedIndex

                  return (
                    <Button
                      key={idx}
                      variant="ghost"
                      className={`w-full justify-start ${isSelected ? 'bg-accent' : ''}`}
                      onClick={() => handleRecentSearchClick(item)}
                    >
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {item.query}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">Enter</kbd>
              Seleccionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">Esc</kbd>
              Cerrar
            </span>
          </div>
          {results.length > 0 && (
            <span>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
