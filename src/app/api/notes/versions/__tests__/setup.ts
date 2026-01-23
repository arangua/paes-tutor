/**
 * Setup Global para Tests de Versiones
 * 
 * Este archivo centraliza la configuración global de mocks y setup
 * para todos los tests del módulo de versiones, siguiendo estándares enterprise.
 * 
 * @module setup
 */

import { vi } from 'vitest'
import { beforeEach } from 'vitest'

/**
 * Mock de next/server para todos los tests
 * 
 * Este mock se aplica automáticamente antes de cualquier import
 * para evitar problemas con next-auth y asegurar consistencia.
 */
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; pathname: string }
      headers: Headers
      cookies: Map<string, string>
      method: string
      private _body: BodyInit | null
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
        this._body = init?.body || null
      }
      async json() {
        if (!this._body) {
          return Promise.resolve({})
        }
        if (typeof this._body === 'string') {
          try {
            return Promise.resolve(JSON.parse(this._body))
          } catch {
            return Promise.resolve({})
          }
        }
        // Para otros tipos de body, intentar leer como texto y parsear
        try {
          const text = await (this._body as any).text?.() || String(this._body)
          return Promise.resolve(JSON.parse(text))
        } catch {
          return Promise.resolve({})
        }
      }
    },
    NextResponse: {
      json: (body: any, init?: { status?: number }) => {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  }
})

/**
 * Mock de Prisma para todos los tests
 */
vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    studyNoteVersion: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    versionRestoreHistory: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    sharedNoteVersion: {
      create: vi.fn(),
    },
    student: {
      findMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $executeRaw: vi.fn(),
  },
}))

/**
 * Mock de get-session para todos los tests
 */
vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
  getCurrentStudentId: vi.fn(),
}))

/**
 * Mock de rate-limit-middleware para todos los tests
 */
vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: any, handler: () => Promise<Response>) => handler()),
}))

/**
 * Mock de logger para todos los tests
 */
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}))

/**
 * Mock de cache para todos los tests
 */
vi.mock('@/lib/cache', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
  invalidateVersionCache: vi.fn(),
}))

/**
 * Setup global antes de cada test
 * 
 * Limpia todos los mocks para asegurar aislamiento entre tests.
 */
beforeEach(() => {
  vi.clearAllMocks()
})

