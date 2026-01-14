/**
 * Error State Component
 * 
 * Regla Enterprise:
 * Siempre tipado
 * Nunca muestra stack
 * Mensaje estable por tipo de error
 * Acción de recuperación clara (retry / back)
 */

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppError } from '@/lib/errors/error-types'
import { getErrorMessage } from '@/lib/error-messages'
import type { ErrorCode } from '@/lib/error-messages'

interface ErrorStateProps {
  error: Error | AppError | string | null | undefined
  onRetry?: () => void
  onBack?: () => void
  retryLabel?: string
  backLabel?: string
}

/**
 * Extrae información del error de forma segura
 */
function extractErrorInfo(error: Error | AppError | string): {
  message: string
  code?: string
} {
  if (typeof error === 'string') {
    return { message: error }
  }

  if (error instanceof AppError) {
    // Intentar obtener mensaje estructurado
    try {
      const errorMessage = getErrorMessage(error.code as ErrorCode, error.context)
      return {
        message: errorMessage.message,
        code: error.code,
      }
    } catch {
      return {
        message: error.message,
        code: error.code,
      }
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'Ocurrió un error inesperado',
  }
}

export function ErrorState({
  error,
  onRetry,
  onBack,
  retryLabel = 'Reintentar',
  backLabel = 'Volver',
}: ErrorStateProps) {
  if (!error) {
    return null
  }

  const { message, code } = extractErrorInfo(error)

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Error</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          {code && (
            <p className="text-xs text-muted-foreground">Código: {code}</p>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              {retryLabel}
            </Button>
          )}
          {onBack && (
            <Button onClick={onBack} variant="outline">
              {backLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
