import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiRateLimit } from './rate-limit'

describe('rate-limit', () => {
  beforeEach(() => {
    // Reset rate limiter state between tests
    vi.clearAllMocks()
  })

  describe('apiRateLimit.general', () => {
    it('debe permitir requests dentro del límite', async () => {
      const identifier = 'test-ip-1'

      // Hacer 5 requests (dentro del límite de 10)
      for (let i = 0; i < 5; i++) {
        const result = await apiRateLimit.general(identifier)
        expect(result.success).toBe(true)
        expect(result.remaining).toBeGreaterThan(0)
      }
    })

    it('debe retornar límite y reset correctos', async () => {
      const identifier = 'test-ip-2'
      const result = await apiRateLimit.general(identifier)

      // En desarrollo el límite es 100, en producción es 10
      const expectedLimit = process.env.NODE_ENV === 'production' ? 10 : 100
      expect(result.limit).toBe(expectedLimit)
      expect(result.reset).toBeGreaterThan(Date.now())
      expect(result.remaining).toBeLessThanOrEqual(expectedLimit)
    })
  })

  describe('apiRateLimit.auth', () => {
    it('debe tener límite más estricto que general', async () => {
      const identifier = 'test-ip-3'
      const result = await apiRateLimit.auth(identifier)

      expect(result.limit).toBe(5)
      expect(result.remaining).toBeLessThanOrEqual(5)
    })

    it('debe bloquear después de exceder límite', async () => {
      const identifier = 'test-ip-4'

      // Hacer más requests que el límite
      let lastResult
      for (let i = 0; i < 10; i++) {
        lastResult = await apiRateLimit.auth(identifier)
      }

      // Después de varios intentos, debería estar bloqueado
      expect(lastResult?.success).toBe(false)
      expect(lastResult?.remaining).toBe(0)
    })
  })

  describe('apiRateLimit.read', () => {
    it('debe tener límite apropiado para lectura', async () => {
      const identifier = 'test-ip-5'
      const result = await apiRateLimit.read(identifier)

      // En desarrollo el límite es 200, en producción es 30
      const expectedLimit = process.env.NODE_ENV === 'production' ? 30 : 200
      expect(result.limit).toBe(expectedLimit)
      expect(result.remaining).toBeLessThanOrEqual(expectedLimit)
    })
  })

  describe('apiRateLimit.write', () => {
    it('debe tener límite apropiado para escritura', async () => {
      const identifier = 'test-ip-6'
      const result = await apiRateLimit.write(identifier)

      expect(result.limit).toBe(20)
      expect(result.remaining).toBeLessThanOrEqual(20)
    })
  })

  describe('apiRateLimit.sensitive', () => {
    it('debe tener límite muy estricto', async () => {
      const identifier = 'test-ip-7'
      const result = await apiRateLimit.sensitive(identifier)

      expect(result.limit).toBe(3)
      expect(result.remaining).toBeLessThanOrEqual(3)
    })

    it('debe bloquear rápidamente después de pocos intentos', async () => {
      const identifier = 'test-ip-8'

      // Hacer más requests que el límite (3)
      let lastResult
      for (let i = 0; i < 5; i++) {
        lastResult = await apiRateLimit.sensitive(identifier)
      }

      expect(lastResult?.success).toBe(false)
      expect(lastResult?.remaining).toBe(0)
    })
  })

  describe('diferentes identificadores', () => {
    it('debe manejar diferentes IPs independientemente', async () => {
      const ip1 = '192.168.1.1'
      const ip2 = '192.168.1.2'

      // Agotar límite para ip1
      for (let i = 0; i < 10; i++) {
        await apiRateLimit.general(ip1)
      }

      // ip2 debería tener límite completo
      const result = await apiRateLimit.general(ip2)
      expect(result.success).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })
  })
})
