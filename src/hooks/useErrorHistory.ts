'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UserError {
  id: string
  timestamp: string
  code: string
  title: string
  description: string
  solution: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'validation' | 'network' | 'permission' | 'data' | 'system'
  path?: string
  context?: Record<string, unknown>
  resolved?: boolean
}

const ERROR_HISTORY_KEY = 'paes-tutor-error-history'
const MAX_ERRORS = 100 // Mantener solo los últimos 100 errores

/**
 * Hook para manejar historial de errores del usuario
 * Basado en Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 */
export function useErrorHistory() {
  const [errors, setErrors] = useState<UserError[]>([])

  // Cargar historial al montar
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(ERROR_HISTORY_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setErrors(Array.isArray(parsed) ? parsed : [])
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, [])

  // Agregar error al historial
  const addError = useCallback((error: UserError) => {
    setErrors(prev => {
      // Evitar duplicados recientes (mismo código en los últimos 5 minutos)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      const recentDuplicate = prev.find(
        e =>
          e.code === error.code &&
          new Date(e.timestamp).getTime() > fiveMinutesAgo &&
          e.path === error.path
      )

      if (recentDuplicate) {
        return prev // No agregar duplicado reciente
      }

      const updated = [error, ...prev].slice(0, MAX_ERRORS)

      // Persistir
      try {
        localStorage.setItem(ERROR_HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // Ignorar errores
      }

      return updated
    })
  }, [])

  // Marcar error como resuelto
  const markAsResolved = useCallback((errorId: string) => {
    setErrors(prev => {
      const updated = prev.map(e => (e.id === errorId ? { ...e, resolved: true } : e))

      try {
        localStorage.setItem(ERROR_HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // Ignorar errores
      }

      return updated
    })
  }, [])

  // Limpiar historial
  const clearHistory = useCallback(() => {
    setErrors([])
    try {
      localStorage.removeItem(ERROR_HISTORY_KEY)
    } catch {
      // Ignorar errores
    }
  }, [])

  // Obtener errores no resueltos
  const unresolvedErrors = errors.filter(e => !e.resolved)

  // Obtener errores por categoría
  const getErrorsByCategory = useCallback(
    (category: UserError['category']) => {
      return errors.filter(e => e.category === category)
    },
    [errors]
  )

  // Obtener errores por severidad
  const getErrorsBySeverity = useCallback(
    (severity: UserError['severity']) => {
      return errors.filter(e => e.severity === severity)
    },
    [errors]
  )

  // Estadísticas
  const stats = {
    total: errors.length,
    unresolved: unresolvedErrors.length,
    byCategory: {
      validation: getErrorsByCategory('validation').length,
      network: getErrorsByCategory('network').length,
      permission: getErrorsByCategory('permission').length,
      data: getErrorsByCategory('data').length,
      system: getErrorsByCategory('system').length,
    },
    bySeverity: {
      low: getErrorsBySeverity('low').length,
      medium: getErrorsBySeverity('medium').length,
      high: getErrorsBySeverity('high').length,
      critical: getErrorsBySeverity('critical').length,
    },
  }

  return {
    errors,
    unresolvedErrors,
    addError,
    markAsResolved,
    clearHistory,
    getErrorsByCategory,
    getErrorsBySeverity,
    stats,
  }
}

