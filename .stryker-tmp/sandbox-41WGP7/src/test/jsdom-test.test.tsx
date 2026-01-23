/**
 * @vitest-environment happy-dom
 */
// @ts-nocheck

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('jsdom test', () => {
  it('debe tener document disponible', () => {
    expect(typeof document).toBe('object')
    expect(document).toBeDefined()
  })

  it('debe tener window disponible', () => {
    expect(typeof globalThis.window).toBe('object')
    expect(globalThis.window).toBeDefined()
  })

  it('debe poder renderizar un componente simple', () => {
    const TestComponent = () => <div>Test</div>
    render(<TestComponent />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
