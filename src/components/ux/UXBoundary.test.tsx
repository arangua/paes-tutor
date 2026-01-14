/**
 * Tests del UXBoundary
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UXBoundary } from './UXBoundary'

describe('UXBoundary', () => {
  it('debe mostrar loading cuando isLoading es true', () => {
    render(
      <UXBoundary isLoading={true} isEmpty={false}>
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('debe mostrar error cuando hay error', () => {
    render(
      <UXBoundary isLoading={false} isEmpty={false} error="Test error">
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('debe mostrar empty cuando isEmpty es true', () => {
    render(
      <UXBoundary isLoading={false} isEmpty={true}>
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('No hay datos')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('debe mostrar children cuando todo está bien', () => {
    render(
      <UXBoundary isLoading={false} isEmpty={false}>
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
    expect(screen.queryByText('No hay datos')).not.toBeInTheDocument()
  })

  it('debe priorizar loading sobre error', () => {
    render(
      <UXBoundary isLoading={true} isEmpty={false} error="Test error">
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(screen.queryByText('Error')).not.toBeInTheDocument()
  })

  it('debe priorizar error sobre empty', () => {
    render(
      <UXBoundary isLoading={false} isEmpty={true} error="Test error">
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('No hay datos')).not.toBeInTheDocument()
  })

  it('debe mostrar mensaje personalizado de loading', () => {
    render(
      <UXBoundary
        isLoading={true}
        isEmpty={false}
        loadingMessage="Cargando datos..."
      >
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Cargando datos...')).toBeInTheDocument()
  })

  it('debe mostrar título y descripción personalizados de empty', () => {
    render(
      <UXBoundary
        isLoading={false}
        isEmpty={true}
        emptyTitle="Sin resultados"
        emptyDescription="No se encontraron elementos"
      >
        <div>Content</div>
      </UXBoundary>
    )

    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    expect(screen.getByText('No se encontraron elementos')).toBeInTheDocument()
  })
})
