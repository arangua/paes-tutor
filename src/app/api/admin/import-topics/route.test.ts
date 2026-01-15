// @vitest-environment node
/**
 * Tests Enterprise para POST /api/admin/import-topics
 * 
 * Usa shared enterprise test helpers para mantener tests limpios y mantenibles.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { getCurrentUser } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import {
  createTestRequest,
  assertErrorResponse,
  clearAllMocks,
} from '@/test/enterprise/shared-test-helpers'

// Mock global está en src/test/setup.ts - solo sobrescribir valores específicos con vi.mocked()

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subject: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    topic: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req, handler) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  logApiRequest: vi.fn(),
  logApiError: vi.fn(),
}))

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn(),
  },
}))

vi.mock('path', () => ({
  default: {
    join: vi.fn((...args) => args.join('/')),
    resolve: vi.fn((...args) => args.join('/')),
  },
}))

// Fixtures inline
const validTopics = [
  {
    asignatura: 'Competencia Lectora',
    ejeTematico: 'Comprensión de textos',
    nombre: 'Análisis de textos narrativos',
    descripcion: 'Comprensión de textos narrativos y sus elementos',
  },
  {
    asignatura: 'Matemática M1',
    ejeTematico: 'Álgebra',
    nombre: 'Ecuaciones lineales',
    descripcion: 'Resolución de ecuaciones de primer grado',
  },
  {
    asignatura: 'Matemática M2',
    ejeTematico: 'Geometría',
    nombre: 'Triángulos',
  },
]

const _invalidTopics = [
  {
    asignatura: '', // Inválido: asignatura vacía
    ejeTematico: 'Eje temático',
    nombre: 'Tema',
  },
  {
    asignatura: 'Asignatura inválida', // Inválido: no está en SUBJECT_MAPPING
    ejeTematico: 'Eje temático',
    nombre: 'Tema',
  },
]

describe('POST /api/admin/import-topics', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('Autenticación', () => {
    it('debe rechazar sin sesión (401)', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(null)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: { topics: validTopics },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      await assertErrorResponse(response, 401, 'No autorizado')
    })
  })

  describe('Validación de payload', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
    })

    it('debe rechazar payload inválido - array vacío (400)', async () => {
      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: { topics: [] },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
      expect(data.details).toBeDefined()
    })

    it('debe rechazar payload inválido - campos faltantes (400)', async () => {
      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: {
          topics: [
            {
              asignatura: 'Competencia Lectora',
              // Falta ejeTematico y nombre
            },
          ],
        },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
      expect(data.details).toBeDefined()
      expect(Array.isArray(data.details)).toBe(true)
    })

    it('procesa payload con asignatura no mapeada y reporta error en result.errors (200)', async () => {
      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: {
          topics: [
            {
              asignatura: 'Asignatura inexistente',
              ejeTematico: 'Eje',
              nombre: 'Tema',
            },
          ],
        },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200) // El endpoint retorna 200 pero con errores en result.errors
      expect(data.success).toBe(true)
      expect(data.result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Importación exitosa', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
    })

    it('debe importar topics válidos y retornar conteo (200)', async () => {
      // Mock de subject existente
      const mockSubject = {
        id: 'subject-123',
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        tipo: 'PAES',
      }

      vi.mocked(prisma.subject.findUnique).mockResolvedValue(mockSubject as any)
      vi.mocked(prisma.topic.findFirst).mockResolvedValue(null) // No existe, se crea
      vi.mocked(prisma.topic.create).mockResolvedValue({
        id: 'topic-123',
        subjectId: mockSubject.id,
        nombre: validTopics[0].nombre,
        ejeTematico: validTopics[0].ejeTematico,
        descripcion: validTopics[0].descripcion,
      } as any)

      // Mock de transaction - maneja múltiples topics
      let createdCount = 0
      vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
        const tx = {
          subject: {
            findUnique: vi.fn().mockImplementation(async (args: any) => {
              // Retornar subject para LECTORA, M1, M2
              if (args.where.codigo === 'LECTORA' || args.where.codigo === 'M1' || args.where.codigo === 'M2') {
                return {
                  ...mockSubject,
                  codigo: args.where.codigo,
                  nombre: args.where.codigo === 'LECTORA' ? 'Competencia Lectora' : 
                          args.where.codigo === 'M1' ? 'Matemática M1' : 'Matemática M2',
                }
              }
              return null
            }),
            create: vi.fn().mockImplementation(async (args: any) => ({
              ...mockSubject,
              codigo: args.data.codigo,
              nombre: args.data.nombre,
            })),
          },
          topic: {
            findFirst: vi.fn().mockResolvedValue(null), // No existe, se crea
            create: vi.fn().mockImplementation(async (args: any) => {
              createdCount++
              return {
                id: `topic-${createdCount}`,
                subjectId: args.data.subjectId,
                nombre: args.data.nombre,
                ejeTematico: args.data.ejeTematico,
                descripcion: args.data.descripcion,
              }
            }),
            update: vi.fn(),
          },
        }
        return callback(tx)
      })

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: { topics: validTopics },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBeDefined()
      expect(data.details).toBeDefined()
      expect(data.result).toBeDefined()
      expect(data.result.total).toBe(validTopics.length)
      expect(data.result.created).toBeGreaterThanOrEqual(0)
      expect(data.result.updated).toBeGreaterThanOrEqual(0)
      expect(data.result.skipped).toBeGreaterThanOrEqual(0)
      expect(Array.isArray(data.result.errors)).toBe(true)
    })
  })

  describe('Idempotencia', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
    })

    it('debe actualizar topics existentes sin duplicar (idempotencia)', async () => {
      const mockSubject = {
        id: 'subject-123',
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        tipo: 'PAES',
      }

      const existingTopic = {
        id: 'topic-123',
        subjectId: mockSubject.id,
        nombre: validTopics[0].nombre.trim(),
        ejeTematico: validTopics[0].ejeTematico.trim(),
        descripcion: 'Descripción anterior',
      }

      // Primera ejecución: crea el topic
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
        const tx = {
          subject: {
            findUnique: vi.fn().mockResolvedValue(mockSubject),
            create: vi.fn().mockResolvedValue(mockSubject),
          },
          topic: {
            findFirst: vi.fn().mockResolvedValue(null), // No existe
            create: vi.fn().mockResolvedValue(existingTopic),
            update: vi.fn(),
          },
        }
        return callback(tx)
      })

      const request1 = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: { topics: [validTopics[0]] },
        headers: { 'content-type': 'application/json' },
      })

      const response1 = await POST(request1)
      const data1 = await response1.json()

      expect(response1.status).toBe(200)
      expect(data1.result.created).toBe(1)
      expect(data1.result.updated).toBe(0)

      // Segunda ejecución: actualiza el topic existente
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
        const tx = {
          subject: {
            findUnique: vi.fn().mockResolvedValue(mockSubject),
            create: vi.fn().mockResolvedValue(mockSubject),
          },
          topic: {
            findFirst: vi.fn().mockResolvedValue(existingTopic), // Existe
            create: vi.fn(),
            update: vi.fn().mockResolvedValue({
              ...existingTopic,
              descripcion: validTopics[0].descripcion,
            }),
          },
        }
        return callback(tx)
      })

      const request2 = createTestRequest({
        url: 'http://localhost:3000/api/admin/import-topics',
        method: 'POST',
        body: { topics: [validTopics[0]] },
        headers: { 'content-type': 'application/json' },
      })

      const response2 = await POST(request2)
      const data2 = await response2.json()

      expect(response2.status).toBe(200)
      expect(data2.result.created).toBe(0) // No crea nuevo
      expect(data2.result.updated).toBe(1) // Actualiza existente
      expect(data2.result.total).toBe(1) // Mismo conteo total
    })
  })
})
