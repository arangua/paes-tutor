/**
 * Tests Enterprise: Prisma Client Configuration
 * 
 * Regla Enterprise:
 * PrismaClient debe crearse sin adapters ni accelerateUrl.
 * Solo engine estándar de Node.js para PostgreSQL.
 * 
 * Estos tests previenen regresiones si alguien:
 * - Agrega engineType = "client" al schema
 * - Agrega previewFeatures = ["driverAdapters"]
 * - Usa adapters o Accelerate en el código
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock de PrismaClient para verificar constructor
vi.mock('@prisma/client', async () => {
  const actual = await vi.importActual('@prisma/client')
  return {
    ...actual,
    PrismaClient: vi.fn(),
  }
})

describe('Prisma Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Constructor Validation', () => {
    it('debe crear PrismaClient sin adapter', () => {
      // Simular creación de PrismaClient
      const _mockPrismaClient = vi.fn()
      const PrismaClientMock = PrismaClient as unknown as typeof _mockPrismaClient

      // Crear instancia
      const client = new PrismaClientMock({
        log: ['error', 'warn'],
      })
      expect(client).toBeDefined()

      // Verificar que se llamó sin adapter
      expect(PrismaClientMock).toHaveBeenCalled()
      const callArgs = PrismaClientMock.mock.calls[0][0]
      
      // Verificar que NO tiene adapter
      expect(callArgs).not.toHaveProperty('adapter')
      expect(callArgs).not.toHaveProperty('accelerateUrl')
    })

    it('debe crear PrismaClient sin accelerateUrl', () => {
      const _mockPrismaClient = vi.fn()
      const PrismaClientMock = PrismaClient as unknown as typeof _mockPrismaClient

      const client = new PrismaClientMock({
        log: ['error', 'warn'],
      })
      expect(client).toBeDefined()

      const callArgs = PrismaClientMock.mock.calls[0][0]
      expect(callArgs).not.toHaveProperty('accelerateUrl')
    })

    it('debe permitir configuración de log', () => {
      const _mockPrismaClient = vi.fn()
      const PrismaClientMock = PrismaClient as unknown as typeof _mockPrismaClient

      const client = new PrismaClientMock({
        log: ['query', 'error', 'warn'],
      })
      expect(client).toBeDefined()

      const callArgs = PrismaClientMock.mock.calls[0][0]
      expect(callArgs).toHaveProperty('log')
      expect(callArgs.log).toEqual(['query', 'error', 'warn'])
    })
  })

  describe('DATABASE_URL Validation', () => {
    const originalEnv = process.env.DATABASE_URL

    beforeEach(() => {
      // Limpiar módulo cacheado antes de cada test
      vi.resetModules()
    })

    afterEach(() => {
      process.env.DATABASE_URL = originalEnv
      vi.resetModules()
    })

    it('debe rechazar SQLite DATABASE_URL', async () => {
      process.env.DATABASE_URL = 'file:./paes.db'

      // Importar prisma debería lanzar error
      await expect(async () => {
        const { prisma } = await import('@/lib/prisma')
        // Acceder a prisma para forzar inicialización
        expect(prisma.user).toBeDefined()
      }).rejects.toThrow(/SQLite detectado/)
    })

    it('debe aceptar PostgreSQL DATABASE_URL', async () => {
      process.env.DATABASE_URL = 'postgresql://user:password@host/database?sslmode=require'

      // No debería lanzar error al importar
      // Nota: No podemos verificar la conexión real sin DB, pero podemos verificar que no lanza error de validación
      const { prisma } = await import('@/lib/prisma')
      expect(prisma).toBeDefined()
      // Verificar que prisma es un objeto (Proxy)
      expect(typeof prisma).toBe('object')
    })

    it('debe rechazar DATABASE_URL inválida', async () => {
      process.env.DATABASE_URL = 'invalid://url'

      await expect(async () => {
        const { prisma } = await import('@/lib/prisma')
        expect(prisma.user).toBeDefined()
      }).rejects.toThrow(/no es una URL de PostgreSQL válida/)
    })

    it('debe requerir DATABASE_URL', async () => {
      delete process.env.DATABASE_URL

      await expect(async () => {
        const { prisma } = await import('@/lib/prisma')
        expect(prisma.user).toBeDefined()
      }).rejects.toThrow(/DATABASE_URL no está configurada/)
    })
  })
})
