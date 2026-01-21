'use client'

import React from 'react'
import type { ErrorInfo } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { trackError } from '@/lib/monitoring'

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode
}

/**
 * Wrapper del ErrorBoundary con integración de monitoreo
 */
export function ErrorBoundaryWrapper({ children }: Readonly<ErrorBoundaryWrapperProps>) {
  const handleError = React.useCallback((error: Error, errorInfo: ErrorInfo) => {
    try {
      trackError(error, {
        type: 'react_error_boundary',
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      })
    } catch (err) {
      // Fallback si trackError falla - intentar capturar el error del fallback también
      const fallbackError = err instanceof Error ? err : new Error(String(err))
      trackError(fallbackError, {
        type: 'error_boundary_fallback',
        originalError: error.message,
        componentStack: errorInfo.componentStack,
      })
    }
  }, [])

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}
