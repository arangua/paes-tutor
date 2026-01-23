/**
 * UX Technical Regression Guard
 * 
 * Regla Enterprise:
 * La UX técnica es parte del contrato del sistema.
 * 
 * Características:
 * - Tests que validan uso correcto de componentes UX
 * - Detecta violaciones de estados obligatorios
 * - Valida prioridad de estados
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UXBoundary } from './UXBoundary'
import { LoadingState } from './LoadingState'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

describe('UX Technical Regression Guard', () => {
  describe('UXBoundary - Estados Obligatorios', () => {
    it('nunca renderiza pantalla en blanco', () => {
      render(
        <UXBoundary isLoading={false} isEmpty={false}>
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('content')).toBeInTheDocument()
    })

    it('siempre muestra loading cuando isLoading es true', () => {
      render(
        <UXBoundary isLoading={true} isEmpty={false}>
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('Cargando...')).toBeInTheDocument()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
    })

    it('siempre muestra error cuando hay error', () => {
      render(
        <UXBoundary isLoading={false} isEmpty={false} error="Test error">
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
    })

    it('siempre muestra empty cuando isEmpty es true', () => {
      render(
        <UXBoundary isLoading={false} isEmpty={true}>
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('No hay datos')).toBeInTheDocument()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
    })
  })

  describe('UXBoundary - Prioridad de Estados', () => {
    it('prioriza loading sobre error', () => {
      render(
        <UXBoundary isLoading={true} isEmpty={false} error="Test error">
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('Cargando...')).toBeInTheDocument()
      expect(screen.queryByText('Error')).not.toBeInTheDocument()
    })

    it('prioriza error sobre empty', () => {
      render(
        <UXBoundary isLoading={false} isEmpty={true} error="Test error">
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.queryByText('No hay datos')).not.toBeInTheDocument()
    })

    it('prioriza empty sobre content', () => {
      render(
        <UXBoundary isLoading={false} isEmpty={true}>
          <div>content</div>
        </UXBoundary>
      )

      expect(screen.getByText('No hay datos')).toBeInTheDocument()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
    })
  })

  describe('LoadingState - Contrato', () => {
    it('siempre muestra mensaje', () => {
      render(<LoadingState message="Cargando datos..." />)
      expect(screen.getByText('Cargando datos...')).toBeInTheDocument()
    })

    it('muestra descripción opcional', () => {
      render(
        <LoadingState
          message="Cargando..."
          description="Obteniendo información"
        />
      )
      expect(screen.getByText('Obteniendo información')).toBeInTheDocument()
    })
  })

  describe('EmptyState - Contrato', () => {
    it('siempre muestra título', () => {
      render(<EmptyState title="Sin resultados" />)
      expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    })

    it('muestra descripción opcional', () => {
      render(
        <EmptyState
          title="Sin resultados"
          description="No se encontraron elementos"
        />
      )
      expect(screen.getByText('No se encontraron elementos')).toBeInTheDocument()
    })

    it('muestra acción opcional', () => {
      const onAction = vi.fn()
      render(
        <EmptyState
          title="Sin resultados"
          actionLabel="Crear nuevo"
          onAction={onAction}
        />
      )
      expect(screen.getByText('Crear nuevo')).toBeInTheDocument()
    })
  })

  describe('ErrorState - Contrato', () => {
    it('siempre muestra mensaje de error', () => {
      render(<ErrorState error="Test error" />)
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('muestra acción de retry cuando está disponible', () => {
      const onRetry = vi.fn()
      render(<ErrorState error="Test error" onRetry={onRetry} />)
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
    })

    it('muestra acción de back cuando está disponible', () => {
      const onBack = vi.fn()
      render(<ErrorState error="Test error" onBack={onBack} />)
      expect(screen.getByText('Volver')).toBeInTheDocument()
    })

    it('nunca muestra stack trace', () => {
      const error = new Error('Test error')
      error.stack = 'Error: Test error\n    at test.ts:1:1'
      render(<ErrorState error={error} />)
      expect(screen.queryByText(/at test.ts/)).not.toBeInTheDocument()
    })
  })
})
