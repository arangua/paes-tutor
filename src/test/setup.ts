import '@testing-library/jest-dom/vitest'
import { afterEach, vi, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Configurar localStorage y window para tests
beforeAll(() => {
  // Mock de localStorage con implementación básica
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
      length: 0,
      key: (index: number) => Object.keys(store)[index] || null,
    }
  })()

  // Asegurar que localStorage esté disponible
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    })
  }

  // Mock de window.location si no existe
  if (typeof window !== 'undefined' && !window.location) {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
        reload: vi.fn(),
        assign: vi.fn(),
        replace: vi.fn(),
      },
      writable: true,
      configurable: true,
    })
  }
})

// Mock de Tooltip de Radix UI para evitar errores en tests
vi.mock('@radix-ui/react-tooltip', async () => {
  const actual = await vi.importActual('@radix-ui/react-tooltip')
  return {
    ...actual,
    Tooltip: ({ children, ...props }: any) => children,
    TooltipProvider: ({ children }: any) => children,
    TooltipTrigger: ({ children }: any) => children,
    TooltipContent: ({ children }: any) => children,
  }
})

// Mocks globales para componentes de UI (para evitar errores de resolución de módulos)
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => {
    const React = require('react')
    return React.createElement('button', { onClick, ...props }, children)
  },
}))

vi.mock('@/components/ui/card', () => {
  const React = require('react')
  return {
    Card: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardDescription: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardHeader: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardTitle: ({ children, ...props }: any) => React.createElement('h3', props, children),
  }
})

vi.mock('@/components/ui/progress', () => {
  const React = require('react')
  return {
    Progress: ({ value, ...props }: any) => React.createElement('div', props, `${value}%`),
  }
})

vi.mock('@/components/ui/badge', () => {
  const React = require('react')
  return {
    Badge: ({ children, ...props }: any) => React.createElement('span', props, children),
  }
})

// Limpiar después de cada test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

