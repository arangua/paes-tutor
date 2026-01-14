'use client'

import { useState, useCallback } from 'react'
import { safeToISOString, safeDivide, ensureFiniteNumber, ensureInteger } from '@/app/api/notes/versions/validation-utils'

export interface TrashItem {
  id: string
  type: 'note' | 'flashcard' | 'bookmark' | 'attempt'
  title: string
  deletedAt: string
  data: Record<string, unknown> // Datos originales del elemento
}

const TRASH_STORAGE_KEY = 'paes-tutor-trash'
const TRASH_RETENTION_DAYS = 30 // Días antes de eliminar permanentemente

/**
 * Hook para gestionar la papelera de reciclaje
 * Basado en estándares de Gmail, Notion, Linear
 */
export function useTrash() {
  // Cargar elementos de la papelera con lazy initialization
  const [trashItems, setTrashItems] = useState<TrashItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(TRASH_STORAGE_KEY)
      if (saved) {
        const items = JSON.parse(saved) as TrashItem[]
        // ✅ Enterprise: Filtrar elementos expirados usando funciones seguras
        const now = new Date()
        const validItems = items.filter(item => {
          const deletedAt = new Date(item.deletedAt)
          const diffMs = now.getTime() - deletedAt.getTime()
          if (!Number.isFinite(diffMs) || diffMs < 0) {
            return false // Fecha inválida, excluir
          }
          const daysSinceDeleted = ensureFiniteNumber(safeDivide(diffMs, 1000 * 60 * 60 * 24, 0), 0)
          return daysSinceDeleted < TRASH_RETENTION_DAYS
        })
        // Guardar si se filtraron elementos
        if (validItems.length !== items.length) {
          localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(validItems))
        }
        return validItems
      }
    } catch {
      // Ignorar errores
    }
    return []
  })

  // Agregar elemento a la papelera
  const addToTrash = useCallback((item: Omit<TrashItem, 'deletedAt'>) => {
    const trashItem: TrashItem = {
      ...item,
      deletedAt: safeToISOString(new Date()),
    }

    setTrashItems(prev => {
      const updated = [trashItem, ...prev]
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updated))
        } catch {
          // Ignorar errores
        }
      }
      return updated
    })

    return trashItem
  }, [])

  // Restaurar elemento
  const restoreItem = useCallback(
    (id: string) => {
      const item = trashItems.find(i => i.id === id)
      if (!item) return null

      setTrashItems(prev => {
        const updated = prev.filter(i => i.id !== id)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updated))
          } catch {
            // Ignorar errores
          }
        }
        return updated
      })

      return item
    },
    [trashItems]
  )

  // Eliminar permanentemente
  const deletePermanently = useCallback((id: string) => {
    setTrashItems(prev => {
      const updated = prev.filter(i => i.id !== id)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updated))
        } catch {
          // Ignorar errores
        }
      }
      return updated
    })
  }, [])

  // Vaciar papelera
  const emptyTrash = useCallback(() => {
    setTrashItems([])
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(TRASH_STORAGE_KEY)
      } catch {
        // Ignorar errores
      }
    }
  }, [])

  // Obtener elementos por tipo
  const getItemsByType = useCallback(
    (type: TrashItem['type']) => {
      return trashItems.filter(item => item.type === type)
    },
    [trashItems]
  )

  // ✅ Enterprise: Obtener días restantes usando funciones seguras
  const getDaysRemaining = useCallback((deletedAt: string) => {
    const now = new Date()
    const deleted = new Date(deletedAt)
    const diffMs = now.getTime() - deleted.getTime()
    if (!Number.isFinite(diffMs) || diffMs < 0) {
      return TRASH_RETENTION_DAYS // Fecha inválida, retornar máximo
    }
    const daysSinceDeleted = ensureFiniteNumber(safeDivide(diffMs, 1000 * 60 * 60 * 24, 0), 0)
    const remaining = TRASH_RETENTION_DAYS - daysSinceDeleted
    return Math.max(0, ensureInteger(remaining, 0))
  }, [])

  return {
    trashItems,
    addToTrash,
    restoreItem,
    deletePermanently,
    emptyTrash,
    getItemsByType,
    getDaysRemaining,
  }
}
