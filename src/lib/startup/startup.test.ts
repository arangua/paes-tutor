/**
 * Tests de Startup Checks
 * 
 * Regla Enterprise:
 * Tests de ruptura - validar que los checks fallan correctamente.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runStartupChecks } from './startup-checks'
import { checkDatabase } from './checks/checkDatabase'
import { checkRedis } from './checks/checkRedis'
import { checkTimeouts } from './checks/checkTimeouts'
import { SystemError } from '@/lib/errors/error-types'

// Mock de módulos
vi.mock('./checks/checkDatabase')
vi.mock('./checks/checkRedis')
vi.mock('./checks/checkTimeouts')
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Startup Checks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('runStartupChecks', () => {
    it('ejecuta todos los checks en orden', async () => {
      // Mock todos los checks para que pasen
      vi.mocked(checkTimeouts).mockReturnValue(undefined)
      vi.mocked(checkDatabase).mockResolvedValue(undefined)
      vi.mocked(checkRedis).mockResolvedValue(undefined)

      await runStartupChecks()

      // Verificar que todos los checks se ejecutaron
      expect(checkTimeouts).toHaveBeenCalledOnce()
      expect(checkDatabase).toHaveBeenCalledOnce()
      expect(checkRedis).toHaveBeenCalledOnce()
    })

    it('falla si checkTimeouts lanza error', async () => {
      const error = new SystemError('Invalid timeout config', undefined, 'INVALID_TIMEOUT_CONFIG')
      vi.mocked(checkTimeouts).mockImplementation(() => {
        throw error
      })
      vi.mocked(checkDatabase).mockResolvedValue(undefined)
      vi.mocked(checkRedis).mockResolvedValue(undefined)

      await expect(runStartupChecks()).rejects.toThrow(SystemError)
      expect(checkTimeouts).toHaveBeenCalledOnce()
      // No debe ejecutar los demás checks si el primero falla
      expect(checkDatabase).not.toHaveBeenCalled()
      expect(checkRedis).not.toHaveBeenCalled()
    })

    it('falla si checkDatabase lanza error', async () => {
      const error = new SystemError('Database not reachable', undefined, 'DATABASE_STARTUP_FAILURE')
      vi.mocked(checkTimeouts).mockReturnValue(undefined)
      vi.mocked(checkDatabase).mockRejectedValue(error)
      vi.mocked(checkRedis).mockResolvedValue(undefined)

      await expect(runStartupChecks()).rejects.toThrow(SystemError)
      expect(checkTimeouts).toHaveBeenCalledOnce()
      expect(checkDatabase).toHaveBeenCalledOnce()
      // No debe ejecutar Redis si DB falla
      expect(checkRedis).not.toHaveBeenCalled()
    })

    it('falla si checkRedis lanza error', async () => {
      const error = new SystemError('Redis not reachable', undefined, 'REDIS_STARTUP_FAILURE')
      vi.mocked(checkTimeouts).mockReturnValue(undefined)
      vi.mocked(checkDatabase).mockResolvedValue(undefined)
      vi.mocked(checkRedis).mockRejectedValue(error)

      await expect(runStartupChecks()).rejects.toThrow(SystemError)
      expect(checkTimeouts).toHaveBeenCalledOnce()
      expect(checkDatabase).toHaveBeenCalledOnce()
      expect(checkRedis).toHaveBeenCalledOnce()
    })
  })
})

describe('checkDatabase', () => {
  it('debe estar implementado', () => {
    // Verificar que el módulo existe y es una función
    expect(typeof checkDatabase).toBe('function')
  })
})

describe('checkRedis', () => {
  it('debe estar implementado', () => {
    // Verificar que el módulo existe y es una función
    expect(typeof checkRedis).toBe('function')
  })
})

describe('checkTimeouts', () => {
  it('debe estar implementado', () => {
    // Verificar que el módulo existe y es una función
    expect(typeof checkTimeouts).toBe('function')
  })
})
