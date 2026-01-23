/**
 * Tests de Health Checks
 * 
 * Regla Enterprise:
 * Validar comportamiento determinista y contrato estable.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkLiveness } from './liveness'
import { checkReadiness } from './readiness'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env/env'

// Mock de módulos
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

// Mock de env - usar factory function sin variables externas
vi.mock('@/lib/env/env', () => {
  return {
    env: {
      UPSTASH_REDIS_REST_URL: undefined as string | undefined,
      UPSTASH_REDIS_REST_TOKEN: undefined as string | undefined,
    },
  }
})

// Mock de Redis - usar mock compartido para ping()
const mockRedisPing = vi.fn()

vi.mock('@upstash/redis', () => ({
  Redis: class Redis {
    ping = mockRedisPing
    constructor(_config: any) {}
  },
}))

describe('Health Checks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Resetear env a estado sin Redis configurado
    env.UPSTASH_REDIS_REST_URL = undefined
    env.UPSTASH_REDIS_REST_TOKEN = undefined
    // Resetear mock de Redis
    mockRedisPing.mockReset()
  })

  describe('checkLiveness', () => {
    it('siempre retorna status ok si el proceso responde', async () => {
      const result = await checkLiveness()

      expect(result.status).toBe('ok')
      expect(result.timestamp).toBeDefined()
      expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0)
    })

    it('retorna timestamp en formato ISO-8601', async () => {
      const result = await checkLiveness()

      // Verificar formato ISO-8601
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('checkReadiness', () => {
    it('retorna ok cuando todos los servicios están disponibles', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ check: 1 }])

      const result = await checkReadiness()

      expect(result.status).toBe('ok')
      expect(result.checks.database).toBe('ok')
      expect(result.checks.redis).toBe('skipped') // No configurado
      expect(result.timestamp).toBeDefined()
    })

    it('retorna degraded cuando la base de datos está down', async () => {
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error('Database connection failed'))

      const result = await checkReadiness()

      expect(result.status).toBe('degraded')
      expect(result.checks.database).toBe('down')
      expect(result.checks.redis).toBe('skipped')
    })

    it('retorna degraded cuando Redis está configurado pero down', async () => {
      // Mock env con Redis configurado
      env.UPSTASH_REDIS_REST_URL = 'https://redis.example.com'
      env.UPSTASH_REDIS_REST_TOKEN = 'token123'

      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ check: 1 }])

      // Mock Redis que falla - configurar ping antes de llamar checkReadiness
      mockRedisPing.mockRejectedValue(new Error('Redis connection failed'))

      const result = await checkReadiness()

      expect(result.status).toBe('degraded')
      expect(result.checks.database).toBe('ok')
      expect(result.checks.redis).toBe('down')

      // Limpiar después del test
      env.UPSTASH_REDIS_REST_URL = undefined
      env.UPSTASH_REDIS_REST_TOKEN = undefined
    })

    it('retorna ok cuando Redis está configurado y disponible', async () => {
      // Mock env con Redis configurado
      env.UPSTASH_REDIS_REST_URL = 'https://redis.example.com'
      env.UPSTASH_REDIS_REST_TOKEN = 'token123'

      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ check: 1 }])

      // Mock Redis que funciona - configurar ping antes de llamar checkReadiness
      mockRedisPing.mockResolvedValue('PONG')

      const result = await checkReadiness()

      expect(result.status).toBe('ok')
      expect(result.checks.database).toBe('ok')
      expect(result.checks.redis).toBe('ok')

      // Limpiar después del test
      env.UPSTASH_REDIS_REST_URL = undefined
      env.UPSTASH_REDIS_REST_TOKEN = undefined
    })

    it('retorna skipped para Redis cuando no está configurado', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ check: 1 }])

      const result = await checkReadiness()

      expect(result.checks.redis).toBe('skipped')
    })

    it('retorna timestamp en formato ISO-8601', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ check: 1 }])

      const result = await checkReadiness()

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('ejecuta checks en paralelo para mejor performance', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ check: 1 }])

      const startTime = Date.now()
      await checkReadiness()
      const duration = Date.now() - startTime

      // Si se ejecutan en paralelo, debería ser rápido (< 100ms en tests)
      expect(duration).toBeLessThan(100)
    })
  })
})
