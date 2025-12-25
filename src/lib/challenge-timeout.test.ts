import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cancelExpiredChallenges, getChallengesExpiringSoon } from './challenge-timeout'
import { prisma } from './prisma'
import { logger } from './logger'

// Mock de Prisma
vi.mock('./prisma', () => ({
  prisma: {
    challenge: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}))

// Mock de logger
vi.mock('./logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

describe('challenge-timeout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cancelExpiredChallenges', () => {
    it('debería cancelar desafíos pendientes que han expirado (más de 7 días)', async () => {
      const expiredDate = new Date()
      expiredDate.setDate(expiredDate.getDate() - 8) // 8 días atrás

      const expiredChallenges = [
        {
          id: 'challenge-1',
          challengerId: 'student-1',
          challengedId: 'student-2',
          createdAt: expiredDate,
        },
        {
          id: 'challenge-2',
          challengerId: 'student-2',
          challengedId: 'student-1',
          createdAt: expiredDate,
        },
      ]

      vi.mocked(prisma.challenge.findMany).mockResolvedValue(expiredChallenges as any)
      vi.mocked(prisma.challenge.updateMany).mockResolvedValue({ count: 2 })

      const result = await cancelExpiredChallenges()

      expect(result.cancelled).toBe(2)
      expect(prisma.challenge.findMany).toHaveBeenCalledWith({
        where: {
          status: 'pending',
          createdAt: {
            lt: expect.any(Date),
          },
        },
        select: {
          id: true,
          challengerId: true,
          challengedId: true,
          createdAt: true,
        },
      })
      expect(prisma.challenge.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['challenge-1', 'challenge-2'],
          },
        },
        data: {
          status: 'cancelled',
        },
      })
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'challenge_timeout',
          cancelled: 2,
        }),
        expect.any(String)
      )
    })

    it('debería retornar 0 si no hay desafíos expirados', async () => {
      vi.mocked(prisma.challenge.findMany).mockResolvedValue([])

      const result = await cancelExpiredChallenges()

      expect(result.cancelled).toBe(0)
      expect(prisma.challenge.updateMany).not.toHaveBeenCalled()
    })

    it('debería manejar errores correctamente', async () => {
      const error = new Error('Database error')
      vi.mocked(prisma.challenge.findMany).mockRejectedValue(error)

      const result = await cancelExpiredChallenges()

      expect(result.cancelled).toBe(0)
      expect(result.error).toBe('Database error')
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'challenge_timeout_error',
          error: 'Database error',
        }),
        expect.any(String)
      )
    })

    it('no debería cancelar desafíos que aún no han expirado', async () => {
      const recentDate = new Date()
      recentDate.setDate(recentDate.getDate() - 3) // Solo 3 días atrás

      const recentChallenges = [
        {
          id: 'challenge-3',
          challengerId: 'student-1',
          challengedId: 'student-2',
          createdAt: recentDate,
        },
      ]

      vi.mocked(prisma.challenge.findMany).mockResolvedValue([]) // No encuentra desafíos expirados

      const result = await cancelExpiredChallenges()

      expect(result.cancelled).toBe(0)
      expect(prisma.challenge.updateMany).not.toHaveBeenCalled()
    })
  })

  describe('getChallengesExpiringSoon', () => {
    it('debería retornar desafíos próximos a expirar (5+ días)', async () => {
      const expiringDate = new Date()
      expiringDate.setDate(expiringDate.getDate() - 5) // 5 días atrás

      const expiringChallenges = [
        {
          id: 'challenge-4',
          challenger: { id: 'student-1', nombre: 'Estudiante 1' },
          challenged: { id: 'student-2', nombre: 'Estudiante 2' },
          exam: { id: 'exam-1', titulo: 'Examen 1' },
          createdAt: expiringDate,
        },
      ]

      vi.mocked(prisma.challenge.findMany).mockResolvedValue(expiringChallenges as any)

      const result = await getChallengesExpiringSoon()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('challenge-4')
      expect(prisma.challenge.findMany).toHaveBeenCalledWith({
        where: {
          status: 'pending',
          createdAt: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        include: expect.any(Object),
      })
    })

    it('debería retornar array vacío si no hay desafíos próximos a expirar', async () => {
      vi.mocked(prisma.challenge.findMany).mockResolvedValue([])

      const result = await getChallengesExpiringSoon()

      expect(result).toEqual([])
    })

    it('debería manejar errores correctamente', async () => {
      const error = new Error('Database error')
      vi.mocked(prisma.challenge.findMany).mockRejectedValue(error)

      const result = await getChallengesExpiringSoon()

      expect(result).toEqual([])
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'challenge_expiring_soon_error',
          error: 'Database error',
        }),
        expect.any(String)
      )
    })
  })
})
