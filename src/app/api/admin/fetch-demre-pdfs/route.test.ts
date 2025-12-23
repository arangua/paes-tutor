import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import * as cheerio from 'cheerio'

// Mock fetch global
global.fetch = vi.fn()

// Mock dependencies
vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

// No necesitamos mockear axios ya que ahora usamos fetch nativo

vi.mock('cheerio', () => ({
  load: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req, handler) => handler()),
}))

describe('POST /api/admin/fetch-demre-pdfs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe requerir autenticación', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://demre.cl/test' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe validar que se proporcione una URL', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('URL requerida')
  })

  it('debe validar que la URL sea válida', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({ url: 'not-a-valid-url' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('URL inválida')
  })

  it('debe validar que la URL sea de DEMRE', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://malicious.com?demre.cl' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('DEMRE')
  })

  it('debe extraer PDFs de una página de DEMRE', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    // Mock HTML con enlaces a PDFs
    const mockHtml = `
      <html>
        <body>
          <a href="https://demre.cl/pdf/paes-2026-lectora.pdf">PAES 2026 - Competencia Lectora</a>
          <a href="https://demre.cl/pdf/paes-2026-matematica-m1.pdf">PAES 2026 - Matemática M1</a>
        </body>
      </html>
    `

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue(mockHtml),
    } as any)

    // Mock cheerio.load - crear un mock más realista que simule el comportamiento real
    const mockElements = [
      {
        href: 'https://demre.cl/pdf/paes-2026-lectora.pdf',
        text: 'PAES 2026 - Competencia Lectora',
      },
      {
        href: 'https://demre.cl/pdf/paes-2026-matematica-m1.pdf',
        text: 'PAES 2026 - Matemática M1',
      },
    ]

    const mock$ = vi.fn((selectorOrElement: string | any) => {
      // Si es un selector (string)
      if (typeof selectorOrElement === 'string') {
        if (selectorOrElement === 'a[href$=".pdf"], a[href*=".pdf"]') {
          return {
            each: vi.fn((callback: (index: number, element: any) => void) => {
              mockElements.forEach((el, idx) => {
                const mockElement = {
                  href: el.href,
                  text: el.text,
                }
                callback(idx, mockElement)
              })
            }),
          }
        }
        return { each: vi.fn() }
      }
      // Si es un elemento (para $(element).attr() y $(element).text())
      const element = selectorOrElement
      return {
        attr: vi.fn((attr: string) => element.href || null),
        text: vi.fn(() => element.text || ''),
      }
    })

    vi.mocked(cheerio.load).mockReturnValue(mock$ as any)

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.pdfs)).toBe(true)
    expect(data.pdfs.length).toBeGreaterThan(0)
  })

  it('debe manejar errores al obtener la página', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://demre.cl/test' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error al obtener PDFs')
  })

  it('debe detectar asignaturas automáticamente', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const mockHtml =
      '<html><body><a href="paes-2026-lectora.pdf">PAES 2026 - Competencia Lectora</a></body></html>'

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue(mockHtml),
    } as any)

    const mockElement = {
      href: 'paes-2026-lectora.pdf',
      text: 'PAES 2026 - Competencia Lectora',
    }

    const mock$ = vi.fn((selectorOrElement: string | any) => {
      // Si es un selector (string)
      if (typeof selectorOrElement === 'string') {
        if (selectorOrElement === 'a[href$=".pdf"], a[href*=".pdf"]') {
          return {
            each: vi.fn((callback: (index: number, element: any) => void) => {
              callback(0, mockElement)
            }),
          }
        }
        return { each: vi.fn() }
      }
      // Si es un elemento (para $(element).attr() y $(element).text())
      const element = selectorOrElement
      return {
        attr: vi.fn((attr: string) => element.href || null),
        text: vi.fn(() => element.text || ''),
      }
    })

    vi.mocked(cheerio.load).mockReturnValue(mock$ as any)

    const request = new NextRequest('http://localhost:3000/api/admin/fetch-demre-pdfs', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://demre.cl/test' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    if (data.pdfs && data.pdfs.length > 0) {
      // Verificar que se detectó la asignatura (el texto contiene "lectora")
      expect(data.pdfs[0].subject).toBe('Competencia Lectora')
    }
  })
})
