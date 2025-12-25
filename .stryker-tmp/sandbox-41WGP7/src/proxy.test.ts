// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import proxy from './proxy'
import { NextRequest, NextResponse } from 'next/server'

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

  it('debe redirigir a signin si no hay cookie de sesión en /api/student', async () => {
    const request = createMockRequest('/api/student')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/auth/signin')
  })

  it('debe permitir acceso si hay cookie next-auth.session-token', async () => {
    const request = createMockRequest('/dashboard', {
      'next-auth.session-token': 'valid-token',
    })
    const response = await proxy(request)

    expect(response).toBeInstanceOf(NextResponse)
    // Si hay cookie, debe continuar (no redirigir)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('debe permitir acceso si hay cookie __Secure-next-auth.session-token', async () => {
    const request = createMockRequest('/dashboard', {
      '__Secure-next-auth.session-token': 'valid-token',
    })
    const response = await proxy(request)

    expect(response).toBeInstanceOf(NextResponse)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('debe proteger /api/metrics', async () => {
    const request = createMockRequest('/api/metrics')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/auth/signin')
  })

  it('debe proteger /api/attempts', async () => {
    const request = createMockRequest('/api/attempts')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/auth/signin')
  })

  it('debe proteger /api/exams', async () => {
    const request = createMockRequest('/api/exams')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/auth/signin')
  })

  it('no debe proteger rutas públicas', async () => {
    const request = createMockRequest('/')
    const response = await proxy(request)

    expect(response).toBeInstanceOf(NextResponse)
    const location = response.headers.get('location')
    expect(location).toBeNull()
  })

  it('no debe proteger /auth/signin', async () => {
    const request = createMockRequest('/auth/signin')
    const response = await proxy(request)

    expect(response).toBeInstanceOf(NextResponse)
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
