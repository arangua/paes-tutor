'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para detectar el estado de conexión a internet
 * Basado en estándares de Google Chrome y Firefox
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return navigator.onLine
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
