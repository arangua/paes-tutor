// @vitest-environment node
/**
 * Tests Enterprise para GET /api/health
 * 
 * Usa shared enterprise test helpers para mantener tests limpios y mantenibles.
 */

import { vi } from 'vitest'

vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      constructor(url: string) {
        this.url = url
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
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  assertSuccessResponse,
  clearAllMocks,
} from '@/test/enterprise/shared-test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('GET /api/health', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('debe retornar estado healthy cuando todo está bien', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '1': 1 }] as any)

    const response = await GET()

    // Leer body una sola vez y reutilizar
    const text = await response.text()
    const data = JSON.parse(text)

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('checks')
    expect(data.status).toBe('healthy')
    expect(data.checks.database).toBe('ok')
  })

  it('debe retornar estado degraded cuando la base de datos es lenta', async () => {
    // Simular query lenta (> 1 segundo)
    vi.mocked(prisma.$queryRaw).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([{ '1': 1 }] as any), 1100))
    )

    const response = await GET()

    const data = await response.json()
    expect(data.status).toBe('degraded')
    expect(data.checks.database).toBe('degraded')
  })

  it('debe retornar estado unhealthy cuando la base de datos falla', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error('Database connection failed'))

    const response = await GET()

    expect(response.status).toBe(503)
    const data = await response.json()
    expect(data.status).toBe('unhealthy')
    expect(data.checks.database).toBe('error')
  })

  it('debe incluir información de memoria cuando está disponible', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '1': 1 }] as any)

    const response = await GET()

    const data = await response.json()
    if (data.checks.memory) {
      expect(data.checks.memory).toHaveProperty('used')
      expect(data.checks.memory).toHaveProperty('total')
      expect(data.checks.memory).toHaveProperty('percentage')
    }
  })
})

