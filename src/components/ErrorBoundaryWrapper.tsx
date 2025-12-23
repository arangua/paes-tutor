'use client'

import { ErrorBoundary } from './ErrorBoundary'
import { captureError } from '@/lib/monitoring'

/**
 * Wrapper del ErrorBoundary con integración de monitoreo
 */
export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        captureError(error, {
          type: 'react_error_boundary',
          componentStack: errorInfo.componentStack,
          errorBoundary: true,
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
