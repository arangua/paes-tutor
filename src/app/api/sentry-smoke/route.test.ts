// @vitest-environment node
/**
 * Tests para GET /api/sentry-smoke
 * 
 * Verifica que el endpoint de smoke test funcione correctamente
 * con diferentes configuraciones de Sentry.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

// Mock de logger
vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock de Sentry usando vi.hoisted() para evitar problemas de hoisting
const sentryMocks = vi.hoisted(() => ({
  captureException: vi.fn(),
  flush: vi.fn().mockResolvedValue(true),
  withScope: vi.fn((callback: (scope: any) => void) => {
    const mockScope = {
      setTag: vi.fn(),
      setLevel: vi.fn(),
      setContext: vi.fn(),
      setExtra: vi.fn(),
    }
    callback(mockScope)
    return sentryMocks.captureException(new Error('SENTRY_SMOKE_TEST'))
  }),
}))

vi.mock('@sentry/nextjs', async () => {
  const actual = await vi.importActual<typeof import('@sentry/nextjs')>('@sentry/nextjs')

  return {
    ...actual,
    default: {
      captureException: sentryMocks.captureException,
      flush: sentryMocks.flush,
      withScope: sentryMocks.withScope,
    },
    captureException: sentryMocks.captureException,
    flush: sentryMocks.flush,
    withScope: sentryMocks.withScope,
    init: vi.fn(), // no-op
  }
})

describe('GET /api/sentry-smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Sentry mocks
    sentryMocks.captureException.mockReset()
    sentryMocks.flush.mockReset().mockResolvedValue(true)
    sentryMocks.withScope.mockReset()
    // Limpiar variables de entorno
    delete process.env.SMOKE_TEST_KEY
    delete process.env.SENTRY_DSN
  })

  function createRequest(smokeKey?: string): NextRequest {
    const headers = new Headers()
    if (smokeKey) {
      headers.set('x-smoke-key', smokeKey)
    }
    return new NextRequest('http://localhost/api/sentry-smoke', {
      headers,
    })
  }

  it('debe retornar 503 si SMOKE_TEST_KEY no está configurado', async () => {
    const request = createRequest('any-key')

    const response = await GET(request)

    expect(response.status).toBe(503)
    const data = await response.json()
    expect(data.error).toBe('Configuración de smoke test no disponible')
  })

  it('debe retornar 403 si no se proporciona x-smoke-key', async () => {
    process.env.SMOKE_TEST_KEY = 'test-key-123'
    const request = createRequest()

    const response = await GET(request)

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('No autorizado')
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  it('debe retornar 403 si la clave no coincide', async () => {
    process.env.SMOKE_TEST_KEY = 'test-key-123'
    const request = createRequest('wrong-key')

    const response = await GET(request)

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('No autorizado')
  })

  it('debe retornar sentry: disabled si SENTRY_DSN no está configurado', async () => {
    process.env.SMOKE_TEST_KEY = 'test-key-123'
    const request = createRequest('test-key-123')

    const response = await GET(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.sentry).toBe('disabled')
    expect(data.timestamp).toBeDefined()
  })

  it('debe retornar sentry: enabled y enviar error de prueba si SENTRY_DSN está configurado', async () => {
    process.env.SMOKE_TEST_KEY = 'test-key-123'
    process.env.SENTRY_DSN = 'https://test@sentry.io/123'
    const request = createRequest('test-key-123')

    const response = await GET(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.sentry).toBe('enabled')
    expect(data.timestamp).toBeDefined()

    // Verificar que se llamó a Sentry
    expect(sentryMocks.captureException).toHaveBeenCalled()
    expect(sentryMocks.flush).toHaveBeenCalled()
  })

  it('debe manejar errores de Sentry sin fallar', async () => {
    process.env.SMOKE_TEST_KEY = 'test-key-123'
    process.env.SENTRY_DSN = 'https://test@sentry.io/123'
    sentryMocks.captureException.mockImplementation(() => {
      throw new Error('Sentry error')
    })
    const request = createRequest('test-key-123')

    const response = await GET(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.sentry).toBe('enabled')
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('debe retornar 500 si hay un error inesperado', async () => {
    process.env.SMOKE_TEST_KEY = 'test-key-123'
    // Simular error al crear request
    const request = null as any

    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error interno del servidor')
  })
})
