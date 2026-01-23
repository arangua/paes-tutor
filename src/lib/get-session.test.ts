import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
// Desactivar mock global para este test específico (queremos probar la función real)
vi.unmock('@/lib/get-session')
import {
  getSession,
  getCurrentUser,
  getCurrentStudentId,
  getDbUserWithStudent,
  getAuthenticatedUserWithStudent,
} from './get-session'
import type { User, Student } from '@prisma/client'

// Mock de auth
const mockAuth = vi.fn()
vi.mock('./auth', () => ({
  auth: () => mockAuth(),
}))

// Mock de prisma
vi.mock('./prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from './prisma'
const mockPrisma = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>
  }
}

describe('get-session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getSession', () => {
    it('debe retornar la sesión del auth', async () => {
      const mockSession = {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
        },
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await getSession()

      expect(result).toBe(mockSession)
      expect(mockAuth).toHaveBeenCalledTimes(1)
    })

    it('debe retornar null si no hay sesión', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await getSession()

      expect(result).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('debe retornar el usuario de la sesión', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: mockUser,
      })

      const result = await getCurrentUser()

      expect(result).toBe(mockUser)
    })

    it('debe retornar null si no hay sesión', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await getCurrentUser()

      expect(result).toBeNull()
    })

    it('debe retornar null si la sesión no tiene usuario', async () => {
      mockAuth.mockResolvedValue({})

      const result = await getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('getCurrentStudentId', () => {
    it('debe retornar el studentId del usuario', async () => {
      const mockStudentId = 'student-1'

      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          studentId: mockStudentId,
        },
      })

      const result = await getCurrentStudentId()

      expect(result).toBe(mockStudentId)
    })

    it('debe retornar null si no hay sesión', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await getCurrentStudentId()

      expect(result).toBeNull()
    })

    it('debe retornar null si el usuario no tiene studentId', async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })

      const result = await getCurrentStudentId()

      expect(result).toBeNull()
    })
  })

  describe('getDbUserWithStudent', () => {
    it('debe retornar usuario con student cuando existe', async () => {
      const mockUser: User & { student: Student | null } = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        role: 'student',
        openaiApiKey: null,
        anthropicApiKey: null,
        geminiApiKey: null,
        preferredAIService: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: {
          id: 'student-1',
          userId: 'user-1',
          nombre: 'Test Student',
          createdAt: new Date(),
        },
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getDbUserWithStudent('test@example.com')

      expect(result).toBe(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { student: true },
      })
    })

    it('debe retornar null si el email es null', async () => {
      const result = await getDbUserWithStudent(null)

      expect(result).toBeNull()
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('debe retornar null si el email es undefined', async () => {
      const result = await getDbUserWithStudent(undefined)

      expect(result).toBeNull()
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('debe retornar usuario sin student si no tiene asociado', async () => {
      const mockUser: User & { student: Student | null } = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        role: 'student',
        openaiApiKey: null,
        anthropicApiKey: null,
        geminiApiKey: null,
        preferredAIService: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: null,
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getDbUserWithStudent('test@example.com')

      expect(result).toBe(mockUser)
      expect(result?.student).toBeNull()
    })

    it('debe retornar null si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await getDbUserWithStudent('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('getAuthenticatedUserWithStudent', () => {
    it('debe retornar usuario con student cuando está autenticado', async () => {
      const mockUser: User & { student: Student | null } = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        role: 'student',
        openaiApiKey: null,
        anthropicApiKey: null,
        geminiApiKey: null,
        preferredAIService: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: {
          id: 'student-1',
          userId: 'user-1',
          nombre: 'Test Student',
          createdAt: new Date(),
        },
      }

      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getAuthenticatedUserWithStudent()

      expect(result).toBe(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { student: true },
      })
    })

    it('debe retornar null si no hay sesión', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await getAuthenticatedUserWithStudent()

      expect(result).toBeNull()
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('debe retornar null si el usuario no tiene email', async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          // Sin email
        },
      })

      const result = await getAuthenticatedUserWithStudent()

      expect(result).toBeNull()
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('debe retornar null si el usuario no existe en la BD', async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })

      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await getAuthenticatedUserWithStudent()

      expect(result).toBeNull()
    })

    it('debe retornar usuario sin student si no tiene asociado', async () => {
      const mockUser: User & { student: Student | null } = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        role: 'student',
        openaiApiKey: null,
        anthropicApiKey: null,
        geminiApiKey: null,
        preferredAIService: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: null,
      }

      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getAuthenticatedUserWithStudent()

      expect(result).toBe(mockUser)
      expect(result?.student).toBeNull()
    })

    it('nunca debe devolver undefined (contract enforcement)', async () => {
      // Test todos los casos posibles para asegurar que nunca retorna undefined
      
      // Caso 1: Sin sesión
      mockAuth.mockResolvedValue(null)
      const result1 = await getAuthenticatedUserWithStudent()
      expect(result1).not.toBeUndefined()
      expect(result1).toBeNull()

      // Caso 2: Sesión sin user
      mockAuth.mockResolvedValue({})
      const result2 = await getAuthenticatedUserWithStudent()
      expect(result2).not.toBeUndefined()
      expect(result2).toBeNull()

      // Caso 3: Sesión con user sin email
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          // Sin email
        },
      })
      const result3 = await getAuthenticatedUserWithStudent()
      expect(result3).not.toBeUndefined()
      expect(result3).toBeNull()

      // Caso 4: Usuario no existe en BD
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })
      mockPrisma.user.findUnique.mockResolvedValue(null)
      const result4 = await getAuthenticatedUserWithStudent()
      expect(result4).not.toBeUndefined()
      expect(result4).toBeNull()

      // Caso 5: Usuario existe (éxito)
      const mockUser: User & { student: Student | null } = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        role: 'student',
        openaiApiKey: null,
        anthropicApiKey: null,
        geminiApiKey: null,
        preferredAIService: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: null,
      }
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      const result5 = await getAuthenticatedUserWithStudent()
      expect(result5).not.toBeUndefined()
      expect(result5).toBe(mockUser)

      // Caso 6: Error en prisma (catch)
      mockAuth.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      })
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))
      const result6 = await getAuthenticatedUserWithStudent()
      expect(result6).not.toBeUndefined()
      expect(result6).toBeNull()
    })
  })
})
