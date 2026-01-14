import '@testing-library/jest-dom/vitest'
import { afterEach, vi, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Tipo para HeadersInit (no exportado por next/server)
type HeadersInit = Headers | Record<string, string> | [string, string][]

// Mock global de next/server ANTES de cualquier otra cosa
// Esto es crítico porque next-auth lo importa internamente
vi.mock('next/server', () => {
  // Crear clase NextResponse usando composición en lugar de herencia
  class NextResponse {
    private _response: Response
    
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this._response = new Response(body, init)
    }
    
    // Delegar propiedades y métodos de Response
    get body() { return this._response.body }
    get bodyUsed() { return this._response.bodyUsed }
    get headers() { return this._response.headers }
    get ok() { return this._response.ok }
    get redirected() { return this._response.redirected }
    get status() { return this._response.status }
    get statusText() { return this._response.statusText }
    get type() { return this._response.type }
    get url() { return this._response.url }
    
    clone() { return this._response.clone() }
    arrayBuffer() { return this._response.arrayBuffer() }
    blob() { return this._response.blob() }
    formData() { return this._response.formData() }
    json() { return this._response.json() }
    text() { return this._response.text() }
    
    static json(body: unknown, init?: { status?: number; headers?: HeadersInit }) {
      const response = new NextResponse(JSON.stringify(body), {
        status: init?.status || 200,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
      return response
    }
    
    static next(init?: { headers?: HeadersInit }) {
      return new NextResponse(null, {
        status: 200,
        headers: init?.headers,
      })
    }
    
    static redirect(url: string | URL, init?: { status?: number; headers?: HeadersInit }) {
      return new NextResponse(null, {
        status: init?.status || 307,
        headers: {
          Location: typeof url === 'string' ? url : url.toString(),
          ...init?.headers,
        },
      })
    }
    
    static rewrite(destination: string | URL, init?: { headers?: HeadersInit }) {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'x-middleware-rewrite': typeof destination === 'string' ? destination : destination.toString(),
          ...init?.headers,
        },
      })
    }
  }

  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; pathname: string }
      headers: Headers
      cookies: Map<string, string>
      method: string
      body: ReadableStream | null
      constructor(url: string | URL, init?: { method?: string; headers?: HeadersInit; body?: BodyInit }) {
        const urlObj = typeof url === 'string' ? new URL(url) : url
        this.url = urlObj.toString()
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers(init?.headers)
        this.cookies = new Map()
        this.method = init?.method || 'GET'
        // Guardar el body como string si es BodyInit
        if (init?.body) {
          if (typeof init.body === 'string') {
            this.body = init.body as any
          } else {
            // Para otros tipos de BodyInit, intentar convertirlos a string
            this.body = init.body as any
          }
        } else {
          this.body = null
        }
      }
      async json() {
        if (this.body && typeof this.body === 'string') {
          try {
            return JSON.parse(this.body)
          } catch {
            return {}
          }
        }
        if (this.body && typeof this.body === 'object') {
          return this.body
        }
        return {}
      }
      text() {
        return Promise.resolve('')
      }
      formData() {
        return Promise.resolve(new FormData())
      }
    },
    NextResponse,
  }
})

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
    Tooltip: ({ children }: { children?: React.ReactNode }) => children,
    TooltipProvider: ({ children }: { children?: React.ReactNode }) => children,
    TooltipTrigger: ({ children }: { children?: React.ReactNode }) => children,
    TooltipContent: ({ children }: { children?: React.ReactNode }) => children,
  }
})

// Mocks globales para componentes de UI (para evitar errores de resolución de módulos)
vi.mock('@/components/ui/button', async () => {
  const React = await import('react')
  return {
    Button: ({ children, onClick, ...props }: { children?: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => {
      return React.createElement('button', { onClick, ...props }, children)
    },
  }
})

vi.mock('@/components/ui/card', async () => {
  const React = await import('react')
  return {
    Card: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('div', props, children),
    CardContent: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('div', props, children),
    CardDescription: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('div', props, children),
    CardHeader: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('div', props, children),
    CardTitle: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('h3', props, children),
  }
})

vi.mock('@/components/ui/progress', async () => {
  const React = await import('react')
  return {
    Progress: ({ value, ...props }: { value?: number; [key: string]: unknown }) => React.createElement('div', props, `${value}%`),
  }
})

vi.mock('@/components/ui/badge', async () => {
  const React = await import('react')
  return {
    Badge: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('span', props, children),
  }
})

// Limpiar después de cada test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
