/**
 * UX Boundary - Orquestador de Estados
 * 
 * Regla Enterprise:
 * No se renderiza "nada": siempre hay un estado explícito.
 * 
 * Prioridad:
 * 1. Loading (si isLoading)
 * 2. Error (si error)
 * 3. Empty (si isEmpty)
 * 4. Children (si no hay problemas)
 */

import { LoadingState } from './LoadingState'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

interface UXBoundaryProps {
  /**
   * Indica si está cargando
   */
  isLoading: boolean

  /**
   * Indica si los datos están vacíos
   */
  isEmpty: boolean

  /**
   * Error a mostrar (si existe)
   */
  error?: Error | string | null

  /**
   * Mensaje personalizado para loading
   */
  loadingMessage?: string

  /**
   * Descripción para loading
   */
  loadingDescription?: string

  /**
   * Título para empty state
   */
  emptyTitle?: string

  /**
   * Descripción para empty state
   */
  emptyDescription?: string

  /**
   * Acción para empty state
   */
  emptyActionLabel?: string
  onEmptyAction?: () => void

  /**
   * Acción de retry para error
   */
  onRetry?: () => void

  /**
   * Acción de back para error
   */
  onBack?: () => void

  /**
   * Contenido a mostrar cuando no hay problemas
   */
  children: React.ReactNode

  /**
   * Mostrar loading en pantalla completa
   */
  fullScreenLoading?: boolean
}

/**
 * UXBoundary - Maneja estados de UX de forma consistente
 * 
 * @example
 * ```tsx
 * <UXBoundary
 *   isLoading={isLoading}
 *   isEmpty={data.length === 0}
 *   error={error}
 *   onRetry={() => refetch()}
 * >
 *   <DataList data={data} />
 * </UXBoundary>
 * ```
 */
export function UXBoundary({
  isLoading,
  isEmpty,
  error,
  loadingMessage,
  loadingDescription,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  onBack,
  children,
  fullScreenLoading = false,
}: Readonly<UXBoundaryProps>) {
  // Prioridad 1: Loading
  if (isLoading) {
    return (
      <LoadingState
        message={loadingMessage}
        description={loadingDescription}
        fullScreen={fullScreenLoading}
      />
    )
  }

  // Prioridad 2: Error
  if (error) {
    return (
      <ErrorState error={error} onRetry={onRetry} onBack={onBack} />
    )
  }

  // Prioridad 3: Empty
  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    )
  }

  // Prioridad 4: Contenido normal
  return <>{children}</>
}
