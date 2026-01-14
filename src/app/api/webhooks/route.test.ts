// @vitest-environment node
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
      body: string | null
      constructor(url: string, init?: { method?: string; body?: string }) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = { 
          searchParams: new URLSearchParams(),
          pathname: urlObj.pathname
        }
        this.headers = new Headers()
        this.body = init?.body || null
      }
      async json() {
        if (!this.body) {
          throw new Error('No body')
        }
        return JSON.parse(this.body)
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

import { describe, it, expect, beforeEach } from 'vitest'
import { GET, POST, PATCH, DELETE } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { NextRequest } from 'next/server'

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    webhook: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    webhookDelivery: {
      findMany: vi.fn(),
    },
    studyNote: {
      findFirst: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('GET /api/webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
  })

  it('debe retornar lista de webhooks del estudiante', async () => {
    const mockWebhooks = [
      {
        id: 'webhook-1',
        url: 'https://example.com/webhook',
        events: JSON.stringify(['version.created', 'version.updated']),
        active: true,
        noteId: null,
        description: 'Webhook de prueba',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        _count: {
          deliveries: 5,
        },
      },
    ]

    vi.mocked(prisma.webhook.findMany).mockResolvedValue(mockWebhooks as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue([
      { status: 'success', statusCode: 200, createdAt: new Date() },
      { status: 'failed', statusCode: 500, createdAt: new Date() },
    ] as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.webhooks).toHaveLength(1)
    expect(data.webhooks[0].id).toBe('webhook-1')
    expect(data.webhooks[0].events).toEqual(['version.created', 'version.updated'])
  })

  it('debe filtrar webhooks por noteId si se proporciona', async () => {
    vi.mocked(prisma.webhook.findMany).mockResolvedValue([])
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/webhooks?noteId=note-1')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(prisma.webhook.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          studentId: 'student-1',
          noteId: { in: ['note-1', null] },
        }),
      })
    )
  })

  it('debe retornar 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/webhooks')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe incluir estadísticas de deliveries recientes', async () => {
    const mockWebhooks = [
      {
        id: 'webhook-1',
        url: 'https://example.com/webhook',
        events: JSON.stringify(['version.created']),
        active: true,
        noteId: null,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          deliveries: 10,
        },
      },
    ]

    const mockDeliveries = [
      { status: 'success', statusCode: 200, createdAt: new Date() },
      { status: 'success', statusCode: 200, createdAt: new Date() },
      { status: 'failed', statusCode: 500, createdAt: new Date() },
    ]

    vi.mocked(prisma.webhook.findMany).mockResolvedValue(mockWebhooks as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.webhooks[0].recentStats.success).toBe(2)
    expect(data.webhooks[0].recentStats.failed).toBe(1)
    expect(data.webhooks[0].recentStats.total).toBe(3)
  })
})

describe('POST /api/webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
  })

  it('debe crear un webhook correctamente', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      url: 'https://example.com/webhook',
      secret: 'secret-123', // guard:allow-secret
      events: JSON.stringify(['version.created', 'version.updated']),
      active: true,
      noteId: null,
      description: 'Webhook de prueba',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.webhook.create).mockResolvedValue(mockWebhook as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        secret: 'secret-123', // guard:allow-secret
        events: ['version.created', 'version.updated'],
        description: 'Webhook de prueba',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.webhook.id).toBe('webhook-1')
    expect(data.webhook.url).toBe('https://example.com/webhook')
    expect(data.webhook.events).toEqual(['version.created', 'version.updated'])
  })

  it('debe validar que la URL sea válida', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'url-invalida',
        events: ['version.created'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Datos inválidos')
  })

  it('debe validar que se proporcione al menos un evento', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        events: [],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Datos inválidos')
  })

  it('debe validar eventos inválidos', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        events: ['evento.invalido', 'version.created'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Eventos inválidos')
  })

  it('debe permitir el evento wildcard "*"', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      url: 'https://example.com/webhook',
      secret: null,
      events: JSON.stringify(['*']),
      active: true,
      noteId: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.webhook.create).mockResolvedValue(mockWebhook as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        events: ['*'],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
  })

  it('debe validar que la nota pertenezca al estudiante si se especifica', async () => {
    vi.mocked(prisma.studyNote.findFirst).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        events: ['version.created'],
        noteId: 'clxxxxxxxxxxxxxxxxxxxxx', // CUID válido
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Nota no encontrada')
  })

  it('debe validar longitud máxima de URL', async () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(2050)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: longUrl,
        events: ['version.created'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Datos inválidos')
  })

  it('debe validar longitud máxima de secret', async () => {
    const longSecret = 'a'.repeat(300)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        secret: longSecret,
        events: ['version.created'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Datos inválidos')
  })

  it('debe validar longitud máxima de descripción', async () => {
    const longDescription = 'a'.repeat(600)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        events: ['version.created'],
        description: longDescription,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Datos inválidos')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
        events: ['version.created'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })
})

describe('PATCH /api/webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
  })

  it('debe actualizar un webhook correctamente', async () => {
    const existingWebhook = {
      id: 'webhook-1',
      url: 'https://example.com/webhook',
        secret: 'old-secret', // guard:allow-secret
      events: JSON.stringify(['version.created']),
      active: true,
      noteId: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedWebhook = {
      ...existingWebhook,
      url: 'https://example.com/new-webhook',
      events: JSON.stringify(['version.updated']),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(existingWebhook as any)
    vi.mocked(prisma.webhook.update).mockResolvedValue(updatedWebhook as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'PATCH',
      body: JSON.stringify({
        id: 'webhook-1',
        url: 'https://example.com/new-webhook',
        events: ['version.updated'],
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.webhook.url).toBe('https://example.com/new-webhook')
    expect(data.webhook.events).toEqual(['version.updated'])
  })

  it('debe validar que el webhook pertenezca al estudiante', async () => {
    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'PATCH',
      body: JSON.stringify({
        id: 'webhook-1',
        url: 'https://example.com/webhook',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Webhook no encontrado')
  })

  it('debe requerir el ID del webhook', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'PATCH',
      body: JSON.stringify({
        url: 'https://example.com/webhook',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('ID de webhook requerido')
  })

  it('debe validar eventos al actualizar', async () => {
    const existingWebhook = {
      id: 'webhook-1',
      url: 'https://example.com/webhook',
      secret: null,
      events: JSON.stringify(['version.created']),
      active: true,
      noteId: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(existingWebhook as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'PATCH',
      body: JSON.stringify({
        id: 'webhook-1',
        events: ['evento.invalido'],
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Eventos inválidos')
  })

  it('debe permitir desactivar un webhook', async () => {
    const existingWebhook = {
      id: 'webhook-1',
      url: 'https://example.com/webhook',
      secret: null,
      events: JSON.stringify(['version.created']),
      active: true,
      noteId: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedWebhook = {
      ...existingWebhook,
      active: false,
      updatedAt: new Date(),
    }

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(existingWebhook as any)
    vi.mocked(prisma.webhook.update).mockResolvedValue(updatedWebhook as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'PATCH',
      body: JSON.stringify({
        id: 'webhook-1',
        active: false,
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.webhook.active).toBe(false)
  })
})

describe('DELETE /api/webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
  })

  it('debe eliminar un webhook correctamente', async () => {
    const existingWebhook = {
      id: 'webhook-1',
      url: 'https://example.com/webhook',
      secret: null,
      events: JSON.stringify(['version.created']),
      active: true,
      noteId: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(existingWebhook as any)
    vi.mocked(prisma.webhook.delete).mockResolvedValue(existingWebhook as any)

    const request = new NextRequest('http://localhost:3000/api/webhooks?id=webhook-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Webhook eliminado correctamente')
  })

  it('debe validar que el webhook pertenezca al estudiante', async () => {
    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/webhooks?id=webhook-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Webhook no encontrado')
  })

  it('debe requerir el ID del webhook', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('ID de webhook requerido')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/webhooks?id=webhook-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })
})

