// @vitest-environment node
// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock completo de next/server para evitar problemas con next-auth
// No intentamos importActual porque el módulo no existe en el entorno de pruebas
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams }
      headers: Headers
      constructor(url: string) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = { searchParams: urlObj.searchParams }
        this.headers = new Headers()
      }
    },
    NextResponse: {
      json: (body: any, init?: { status?: number }) => {
        const response = new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { 'Content-Type': 'application/json' },
        })
        // Sobrescribir el método json() para que devuelva el body directamente
        response.json = async () => body
        return response
      },
    },
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { NextRequest } from 'next/server'

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    webhook: {
      findFirst: vi.fn(),
    },
    webhookDelivery: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/get-session')>('@/lib/get-session')
  return {
    ...actual,
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getCurrentStudentId: vi.fn(),
    getAuthenticatedUserWithStudent: vi.fn(),
  }
})

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

// Mock global de logger está en src/test/setup.ts

describe('GET /api/webhooks/deliveries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
  })

  it('debe obtener deliveries correctamente', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    const mockDeliveries = [
      {
        id: 'delivery-1',
        event: 'version.restored',
        status: 'success',
        statusCode: 200,
        response: 'OK',
        attempts: 1,
        lastAttempt: new Date('2024-01-15'),
        deliveredAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
      },
    ]

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(1)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.deliveries).toBeDefined()
    expect(Array.isArray(data.deliveries)).toBe(true)
    expect(data.deliveries.length).toBe(1)
    expect(data.pagination).toBeDefined()
    expect(data.pagination.total).toBe(1)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe validar que webhookId sea requerido', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks/deliveries')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Parámetros inválidos')
  })

  it('debe validar que el webhook pertenezca al estudiante', async () => {
    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Webhook no encontrado')
  })

  it('debe filtrar por estado success', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    const mockDeliveries = [
      {
        id: 'delivery-1',
        event: 'version.restored',
        status: 'success',
        statusCode: 200,
        response: 'OK',
        attempts: 1,
        lastAttempt: new Date(),
        deliveredAt: new Date(),
        createdAt: new Date(),
      },
    ]

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(1)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1&status=success'
    )
    const response = await GET(request)
    await response.json()

    expect(response.status).toBe(200)
    expect(prisma.webhookDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          webhookId: 'webhook-1',
          status: 'success',
        }),
      })
    )
  })

  it('debe filtrar por estado failed', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    const mockDeliveries = [
      {
        id: 'delivery-1',
        event: 'version.restored',
        status: 'failed',
        statusCode: 500,
        response: 'Error',
        attempts: 3,
        lastAttempt: new Date(),
        deliveredAt: null,
        createdAt: new Date(),
      },
    ]

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(1)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1&status=failed'
    )
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(prisma.webhookDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'failed',
        }),
      })
    )
  })

  it('debe incluir todos los estados cuando status=all', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    const mockDeliveries = [
      {
        id: 'delivery-1',
        event: 'version.restored',
        status: 'success',
        statusCode: 200,
        response: 'OK',
        attempts: 1,
        lastAttempt: new Date(),
        deliveredAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 'delivery-2',
        event: 'version.updated',
        status: 'failed',
        statusCode: 500,
        response: 'Error',
        attempts: 2,
        lastAttempt: new Date(),
        deliveredAt: null,
        createdAt: new Date(),
      },
    ]

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(2)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1&status=all'
    )
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(prisma.webhookDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({
          status: expect.anything(),
        }),
      })
    )
  })

  it('debe aplicar paginación correctamente', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    const mockDeliveries = [
      {
        id: 'delivery-1',
        event: 'version.restored',
        status: 'success',
        statusCode: 200,
        response: 'OK',
        attempts: 1,
        lastAttempt: new Date(),
        deliveredAt: new Date(),
        createdAt: new Date(),
      },
    ]

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(10)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1&limit=5&offset=0'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(prisma.webhookDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 0,
      })
    )
    expect(data.pagination.limit).toBe(5)
    expect(data.pagination.offset).toBe(0)
    expect(data.pagination.hasMore).toBe(true)
  })

  it('debe usar valores por defecto para limit y offset', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue([])
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(0)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pagination.limit).toBe(50)
    expect(data.pagination.offset).toBe(0)
  })

  it('debe validar límites de paginación', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1&limit=200'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Parámetros inválidos')
  })

  it('debe ordenar por fecha de creación descendente', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue([])
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(0)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1'
    )
    await GET(request)

    expect(prisma.webhookDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      })
    )
  })

  it('debe incluir información de paginación', async () => {
    const mockWebhook = {
      id: 'webhook-1',
      studentId: 'student-1',
      url: 'https://example.com/webhook',
      active: true,
    }

    const mockDeliveries = [
      {
        id: 'delivery-1',
        event: 'version.restored',
        status: 'success',
        statusCode: 200,
        response: 'OK',
        attempts: 1,
        lastAttempt: new Date(),
        deliveredAt: new Date(),
        createdAt: new Date(),
      },
    ]

    vi.mocked(prisma.webhook.findFirst).mockResolvedValue(mockWebhook as any)
    vi.mocked(prisma.webhookDelivery.findMany).mockResolvedValue(mockDeliveries as any)
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(1)

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1&limit=10&offset=0'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pagination).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      hasMore: false,
    })
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.webhook.findFirst).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest(
      'http://localhost:3000/api/webhooks/deliveries?webhookId=webhook-1'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error al obtener deliveries')
  })
})

