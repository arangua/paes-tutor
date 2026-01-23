// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock completo de next/server para evitar problemas con next-auth
// No intentamos importActual porque el módulo no existe en el entorno de pruebas
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; pathname: string }
      headers: Headers
      cookies: Map<string, string>
      constructor(url: string | URL) {
        const urlObj = typeof url === 'string' ? new URL(url) : url
        this.url = urlObj.toString()
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers()
        this.cookies = new Map()
      }
    },
    NextResponse: class NextResponse extends Response {
      static json(body: unknown, init?: { status?: number; headers?: HeadersInit }) {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
          },
        })
      }
      static next() {
        return new Response(null, { status: 200 })
      }
      // @ts-expect-error - NextResponse.redirect tiene una firma diferente a Response.redirect
      static redirect(url: string | URL, init?: { status?: number } | number) {
        const status = typeof init === 'number' ? init : (init?.status || 307)
        return new Response(null, {
          status,
          headers: {
            Location: typeof url === 'string' ? url : url.toString(),
          },
        })
      }
    },
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import proxy from './proxy'
import { NextRequest } from 'next/server'

describe('Proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (pathname: string, cookies: Record<string, string> = {}) => {
    const url = new URL(`http://localhost:3000${pathname}`)
    const request = new NextRequest(url)

    // Agregar cookies al request
    Object.entries(cookies).forEach(([name, value]) => {
      request.cookies.set(name, value)
    })

    return request
  }

  it('debe redirigir a signin si no hay cookie de sesión en /dashboard', async () => {
    const request = createMockRequest('/dashboard')
    const response = await proxy(request)

    expect(response.status).toBe(307) // Redirect
    const location = response.headers.get('location')
    expect(location).toContain('/auth/signin')
    // El callbackUrl está URL encoded como %2Fdashboard
    expect(location).toContain('callbackUrl')
    expect(decodeURIComponent(location!)).toContain('callbackUrl=/dashboard')
  })

  it('debe permitir acceso a /api/student sin cookie (maneja su propia autenticación)', async () => {
    const request = createMockRequest('/api/student')
    const response = await proxy(request)

    // /api/student no está protegido por el proxy según el código
    // NextResponse.next() retorna una instancia de NextResponse (que extiende Response)
    expect(response).toBeInstanceOf(Response)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('debe permitir acceso si hay cookie next-auth.session-token', async () => {
    const request = createMockRequest('/dashboard', {
      'next-auth.session-token': 'valid-token',
    })
    const response = await proxy(request)

    // NextResponse.next() retorna una instancia de NextResponse (que extiende Response)
    expect(response).toBeInstanceOf(Response)
    // Si hay cookie, debe continuar (no redirigir)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('debe permitir acceso si hay cookie __Secure-next-auth.session-token', async () => {
    const request = createMockRequest('/dashboard', {
        '__Secure-next-auth.session-token': 'valid-token', // guard:allow-secret
    })
    const response = await proxy(request)

    // NextResponse.next() retorna una instancia de NextResponse (que extiende Response)
    expect(response).toBeInstanceOf(Response)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('debe proteger /api/metrics', async () => {
    const request = createMockRequest('/api/metrics')
    const response = await proxy(request)

    // Las APIs retornan 401 JSON, no 307 redirect
    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toHaveProperty('error')
    expect(json.error).toBe('No autorizado')
  })

  it('debe proteger /api/attempts', async () => {
    const request = createMockRequest('/api/attempts')
    const response = await proxy(request)

    // Las APIs retornan 401 JSON, no 307 redirect
    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toHaveProperty('error')
    expect(json.error).toBe('No autorizado')
  })

  it('debe proteger /api/exams', async () => {
    const request = createMockRequest('/api/exams')
    const response = await proxy(request)

    // Las APIs retornan 401 JSON, no 307 redirect
    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toHaveProperty('error')
    expect(json.error).toBe('No autorizado')
  })

  it('no debe proteger rutas públicas', async () => {
    const request = createMockRequest('/')
    const response = await proxy(request)

    // NextResponse.next() retorna una instancia de NextResponse (que extiende Response)
    expect(response).toBeInstanceOf(Response)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('no debe proteger /auth/signin', async () => {
    const request = createMockRequest('/auth/signin')
    const response = await proxy(request)

    // NextResponse.next() retorna una instancia de NextResponse (que extiende Response)
    expect(response).toBeInstanceOf(Response)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('debe incluir callbackUrl en la redirección', async () => {
    const request = createMockRequest('/dashboard')
    const response = await proxy(request)

    const location = response.headers.get('location')
    expect(location).toContain('callbackUrl')
    // Verificar que el callbackUrl está codificado correctamente
    expect(location).toContain('%2Fdashboard')
    expect(decodeURIComponent(location!)).toContain('callbackUrl=/dashboard')
  })

  it('debe proteger subrutas de /dashboard', async () => {
    const request = createMockRequest('/dashboard/settings')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/auth/signin')
  })
})
