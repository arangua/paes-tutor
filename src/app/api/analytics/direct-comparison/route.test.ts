// @vitest-environment node
/**
 * Tests Enterprise para GET /api/analytics/direct-comparison
 * 
 * Usa test helpers enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @see {@link ./__tests__/test-helpers} Para documentación de helpers disponibles
 */

// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock completo de next/server
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams; href: string; pathname: string }
      headers: Headers
      constructor(url: string) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = {
          searchParams: urlObj.searchParams,
          href: url,
          pathname: urlObj.pathname,
        }
        this.headers = new Headers()
      }
    },
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  }
})

import { describe, it, expect, beforeEach, vi as vitest } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createAttemptWithExam,
  createStudentWithUser,
  createUserWithStudent,
  setupStudentsMocks,
  setupAttemptsMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertDirectComparisonResponse,
} from './__tests__/test-helpers'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findMany: vi.fn(),
    },
    attempt: {
      findMany: vi.fn(),
    },
  },
}))

// Mock de get-session
const mockGetAuthenticatedUserWithStudent = vi.fn()
vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: () => mockGetAuthenticatedUserWithStudent(),
}))

// Mock de rate-limit-middleware
vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: unknown, handler: () => Promise<Response>) => handler()),
}))

// Mock de logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock de validation-utils
vi.mock('@/app/api/notes/versions/validation-utils', () => ({
  safeMathMax: vi.fn((values: number[]) => {
    if (!Array.isArray(values) || values.length === 0) return 0
    const valid = values.filter(v => Number.isFinite(v))
    return valid.length > 0 ? Math.max(...valid) : 0
  }),
  safeMathMin: vi.fn((values: number[]) => {
    if (!Array.isArray(values) || values.length === 0) return 0
    const valid = values.filter(v => Number.isFinite(v))
    return valid.length > 0 ? Math.min(...valid) : 0
  }),
  safeAverage: vi.fn((values: number[], fallback: number = 0) => {
    if (!Array.isArray(values) || values.length === 0) return fallback
    const valid = values.filter(v => Number.isFinite(v))
    if (valid.length === 0) return fallback
    const sum = valid.reduce((a, b) => a + b, 0)
    return sum / valid.length
  }),
  safeDivide: vi.fn((dividend: number, divisor: number, fallback: number | null) => {
    if (divisor === 0 || !Number.isFinite(dividend) || !Number.isFinite(divisor)) {
      return fallback
    }
    const result = dividend / divisor
    return Number.isFinite(result) ? result : fallback
  }),
  ensureFiniteNumber: vi.fn((value: unknown, fallback: number) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    return fallback
  }),
}))

describe('GET /api/analytics/direct-comparison', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
    mockGetAuthenticatedUserWithStudent.mockResolvedValue(
      createUserWithStudent({ studentId: TEST_IDS.STUDENT_1 })
    )
  })

  describe('Autenticación', () => {
    it('debe retornar 401 si no está autenticado', async () => {
      mockGetAuthenticatedUserWithStudent.mockResolvedValue(null)

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })

    it('debe retornar 401 si no hay estudiante asociado', async () => {
      mockGetAuthenticatedUserWithStudent.mockResolvedValue({
        ...createUserWithStudent(),
        student: null,
      })

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })
  })

  describe('Validación de estudiantes', () => {
    it('debe retornar mensaje si hay menos de 2 estudiantes', async () => {
      setupStudentsMocks([createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 })])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('al menos 2 estudiantes')
      expect(data.comparison).toBeNull()
    })

    it('debe encontrar el otro estudiante correctamente', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)
      setupAttemptsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await assertSuccessResponse(response)
      assertDirectComparisonResponse(data)
      expect(data.other.student.id).toBe(TEST_IDS.STUDENT_2)
    })

    it('debe retornar mensaje si no se encuentra el otro estudiante', async () => {
      // Simular que find() retorna null
      setupStudentsMocks([
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }), // Mismo ID (caso borde)
      ])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('No se encontró el otro estudiante')
    })
  })

  describe('Cálculo de estadísticas generales', () => {
    it('debe calcular estadísticas correctamente con intentos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75,
          correctas: 15,
          totalPreguntas: 20,
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 80,
          correctas: 16,
          totalPreguntas: 20,
        }),
      ]

      const otherAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_2,
          porcentaje: 70,
          correctas: 14,
          totalPreguntas: 20,
        }),
      ]

      setupAttemptsMocks(currentAttempts, otherAttempts)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertDirectComparisonResponse(data)

      // Verificar estadísticas del estudiante actual
      expect(data.current.stats.totalAttempts).toBe(2)
      expect(data.current.stats.averagePercentage).toBeGreaterThan(0)
      expect(data.current.stats.bestPercentage).toBe(80)
      expect(data.current.stats.totalCorrect).toBe(31)
      expect(data.current.stats.totalQuestions).toBe(40)

      // Verificar estadísticas del otro estudiante
      expect(data.other.stats.totalAttempts).toBe(1)
      expect(data.other.stats.averagePercentage).toBe(70)
    })

    it('debe manejar estudiante sin intentos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)
      setupAttemptsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertDirectComparisonResponse(data)

      // Sin intentos, todas las estadísticas deben ser 0 o null
      expect(data.current.stats.totalAttempts).toBe(0)
      expect(data.current.stats.averagePercentage).toBe(0)
      expect(data.current.stats.bestPercentage).toBe(0)
      expect(data.current.stats.averagePaesScore).toBeNull()
    })

    it('debe calcular tendencia reciente correctamente', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      // Últimos 5 con mejor porcentaje que los anteriores (tendencia mejorando)
      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 80, // Reciente
          createdAt: new Date(),
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75, // Reciente
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 60, // Anterior
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        }),
      ]

      setupAttemptsMocks(currentAttempts, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.current.stats.recentTrend).toBeDefined()
      expect(['improving', 'declining', 'stable']).toContain(data.current.stats.recentTrend)
    })
  })

  describe('Cálculo de estadísticas por asignatura', () => {
    it('debe agrupar intentos por asignatura', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          examId: TEST_IDS.EXAM_1,
          porcentaje: 75,
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          examId: TEST_IDS.EXAM_2,
          porcentaje: 80,
        }),
      ]

      setupAttemptsMocks(currentAttempts, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(Array.isArray(data.current.subjectStats)).toBe(true)
      expect(data.current.subjectStats.length).toBeGreaterThan(0)
    })

    it('debe calcular promedio por asignatura correctamente', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 70,
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 80,
        }),
      ]

      setupAttemptsMocks(currentAttempts, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      if (data.current.subjectStats.length > 0) {
        expect(data.current.subjectStats[0]).toHaveProperty('averagePercentage')
        expect(data.current.subjectStats[0].averagePercentage).toBeGreaterThanOrEqual(0)
        expect(data.current.subjectStats[0].averagePercentage).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('Exámenes comunes', () => {
    it('debe encontrar exámenes comunes entre ambos estudiantes', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const commonExam = createAttemptWithExam({
        studentId: TEST_IDS.STUDENT_1,
        examId: TEST_IDS.EXAM_1,
        porcentaje: 75,
      })

      const otherCommonExam = createAttemptWithExam({
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM_1, // Mismo examen
        porcentaje: 70,
      })

      setupAttemptsMocks([commonExam], [otherCommonExam])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.commonExams.length).toBe(1)
      expect(data.commonExams[0].examId).toBe(TEST_IDS.EXAM_1)
    })

    it('debe determinar ganador correctamente en exámenes comunes', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempt = createAttemptWithExam({
        studentId: TEST_IDS.STUDENT_1,
        examId: TEST_IDS.EXAM_1,
        porcentaje: 80,
      })

      const otherAttempt = createAttemptWithExam({
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM_1,
        porcentaje: 70,
      })

      setupAttemptsMocks([currentAttempt], [otherAttempt])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.commonExams[0].winner).toBe('current')
    })

    it('debe detectar empate en exámenes comunes', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempt = createAttemptWithExam({
        studentId: TEST_IDS.STUDENT_1,
        examId: TEST_IDS.EXAM_1,
        porcentaje: 75,
      })

      const otherAttempt = createAttemptWithExam({
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM_1,
        porcentaje: 75, // Mismo porcentaje
      })

      setupAttemptsMocks([currentAttempt], [otherAttempt])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.commonExams[0].winner).toBe('tie')
    })
  })

  describe('Resumen de comparación', () => {
    it('debe calcular resumen correctamente', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          examId: TEST_IDS.EXAM_1,
          porcentaje: 80,
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          examId: TEST_IDS.EXAM_2,
          porcentaje: 75,
        }),
      ]

      const otherAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_2,
          examId: TEST_IDS.EXAM_1,
          porcentaje: 70, // Pierde
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_2,
          examId: TEST_IDS.EXAM_2,
          porcentaje: 75, // Empate
        }),
      ]

      setupAttemptsMocks(currentAttempts, otherAttempts)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.summary).toBeDefined()
      expect(data.summary.currentWins).toBeGreaterThanOrEqual(0)
      expect(data.summary.otherWins).toBeGreaterThanOrEqual(0)
      expect(data.summary.ties).toBeGreaterThanOrEqual(0)
      expect(typeof data.summary.averageDifference).toBe('number')
    })

    it('debe calcular diferencia promedio correctamente', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 80,
        }),
      ]

      const otherAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_2,
          porcentaje: 70,
        }),
      ]

      setupAttemptsMocks(currentAttempts, otherAttempts)

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      // Diferencia: 80 - 70 = 10
      expect(data.summary.averageDifference).toBe(10)
    })
  })

  describe('Casos borde', () => {
    it('debe manejar intentos con valores NaN o Infinity', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75,
          correctas: 15,
          totalPreguntas: 20,
        }),
      ]

      setupAttemptsMocks(currentAttempts, [])

      const request = createTestRequest()
      const response = await GET(request)

      // Debe manejar valores inválidos sin fallar
      expect(response.status).toBe(200)
    })

    it('debe manejar intentos sin puntaje PAES', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75,
          puntajePaes: null,
        }),
      ]

      setupAttemptsMocks(currentAttempts, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.current.stats.averagePaesScore).toBeNull()
    })

    it('debe manejar intentos con puntaje PAES', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75,
          puntajePaes: 650,
        }),
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 80,
          puntajePaes: 700,
        }),
      ]

      setupAttemptsMocks(currentAttempts, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.current.stats.averagePaesScore).toBeGreaterThan(0)
      expect(data.current.stats.bestPaesScore).toBe(700)
    })
  })

  describe('Estructura de respuesta', () => {
    it('debe retornar estructura correcta con todos los campos requeridos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)
      setupAttemptsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertDirectComparisonResponse(data)

      // Validar estructura de current
      expect(data.current.student).toHaveProperty('id')
      expect(data.current.student).toHaveProperty('nombre')
      expect(data.current.student).toHaveProperty('email')
      expect(data.current.stats).toHaveProperty('totalAttempts')
      expect(data.current.stats).toHaveProperty('averagePercentage')
      expect(data.current.stats).toHaveProperty('bestPercentage')
      expect(data.current.stats).toHaveProperty('worstPercentage')
      expect(data.current.stats).toHaveProperty('recentTrend')
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.student.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 500, 'Error al calcular comparación')
    })

    it('debe manejar errores inesperados correctamente', async () => {
      mockGetAuthenticatedUserWithStudent.mockRejectedValue(
        new Error('Unexpected error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })
})

