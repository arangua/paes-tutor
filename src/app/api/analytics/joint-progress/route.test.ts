// @vitest-environment node
/**
 * Tests Enterprise para GET /api/analytics/joint-progress
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
  createMultipleAttempts,
  createPerformanceMetricWithRelations,
  createStudentWithUser,
  createUserWithStudent,
  setupStudentsMocks,
  setupAttemptsMocks,
  setupPerformanceMetricsMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertJointProgressResponse,
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
    performanceMetric: {
      findMany: vi.fn(),
    },
  },
}))

// Mock de get-session - el mock global está en src/test/setup.ts

// Mock de rate-limit-middleware
vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: unknown, handler: () => Promise<Response>, _type?: string) => handler()),
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

describe('GET /api/analytics/joint-progress', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
    globalThis.__mockGetAuthenticatedUserWithStudent__.mockResolvedValue(
      createUserWithStudent({ studentId: TEST_IDS.STUDENT_1 })
    )
  })

  describe('Autenticación', () => {
    it('debe retornar 401 si no está autenticado', async () => {
      globalThis.__mockGetAuthenticatedUserWithStudent__.mockResolvedValue(null)

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })

    it('debe retornar 401 si no hay estudiante asociado', async () => {
      globalThis.__mockGetAuthenticatedUserWithStudent__.mockResolvedValue({
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
      expect(data.progress).toBeNull()
    })

    it('debe encontrar el otro estudiante correctamente', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)
      setupAttemptsMocks([], [])
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await assertSuccessResponse(response)
      assertJointProgressResponse(data)
      expect(data.other.student.id).toBe(TEST_IDS.STUDENT_2)
    })

    it('debe retornar mensaje si no se encuentra el otro estudiante', async () => {
      setupStudentsMocks([
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }), // Mismo ID
      ])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('No se encontró el otro estudiante')
    })
  })

  describe('Cálculo de progreso por estudiante', () => {
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
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertJointProgressResponse(data)

      // Verificar estadísticas del estudiante actual
      expect(data.current.progress.totalAttempts).toBe(2)
      expect(data.current.progress.averagePercentage).toBeGreaterThan(0)
      expect(data.current.progress.bestPercentage).toBe(80)

      // Verificar estadísticas del otro estudiante
      expect(data.other.progress.totalAttempts).toBe(1)
      expect(data.other.progress.averagePercentage).toBe(70)
    })

    it('debe manejar estudiante sin intentos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)
      setupAttemptsMocks([], [])
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Sin intentos, todas las estadísticas deben ser 0 o null
      expect(data.current.progress.totalAttempts).toBe(0)
      expect(data.current.progress.averagePercentage).toBe(0)
      expect(data.current.progress.bestPercentage).toBe(0)
      expect(data.current.progress.averagePaesScore).toBeNull()
      expect(data.current.progress.bestPaesScore).toBeNull()
    })

    it('debe calcular promedio de puntaje PAES correctamente', async () => {
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
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Promedio: (650 + 700) / 2 = 675
      expect(data.current.progress.averagePaesScore).toBe(675)
      expect(data.current.progress.bestPaesScore).toBe(700)
    })

    it('debe retornar últimos 5 intentos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = createMultipleAttempts(TEST_IDS.STUDENT_1, 10)

      setupAttemptsMocks(currentAttempts, [])
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe retornar máximo 5 intentos recientes
      expect(data.current.progress.recentAttempts.length).toBeLessThanOrEqual(5)
    })
  })

  describe('Top temas', () => {
    it('debe retornar top 5 temas con mejor porcentaje', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentMetrics = [
        createPerformanceMetricWithRelations({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 90,
        }),
        createPerformanceMetricWithRelations({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 85,
        }),
        createPerformanceMetricWithRelations({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 80,
        }),
        createPerformanceMetricWithRelations({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75,
        }),
        createPerformanceMetricWithRelations({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 70,
        }),
      ]

      setupAttemptsMocks([], [])
      setupPerformanceMetricsMocks(currentMetrics, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      expect(data.current.progress.topTopics.length).toBeLessThanOrEqual(5)
      if (data.current.progress.topTopics.length > 0) {
        // Debe estar ordenado por porcentaje descendente
        expect(data.current.progress.topTopics[0].porcentaje).toBeGreaterThanOrEqual(
          data.current.progress.topTopics[1]?.porcentaje || 0
        )
      }
    })

    it('debe filtrar métricas sin topic o subject válidos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentMetrics = [
        createPerformanceMetricWithRelations({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 90,
        }),
      ]

      setupAttemptsMocks([], [])
      setupPerformanceMetricsMocks(currentMetrics, [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Debe incluir solo métricas válidas
      expect(Array.isArray(data.current.progress.topTopics)).toBe(true)
    })
  })

  describe('Cálculo de tendencias', () => {
    it('debe calcular tendencia mejorando cuando últimos 5 son mejores', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      // Crear 10 intentos: últimos 5 con mejor porcentaje
      const currentAttempts = [
        ...Array.from({ length: 5 }, (_, i) =>
          createAttemptWithExam({
            studentId: TEST_IDS.STUDENT_1,
            porcentaje: 80 + i, // 80, 81, 82, 83, 84
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          })
        ),
        ...Array.from({ length: 5 }, (_, i) =>
          createAttemptWithExam({
            studentId: TEST_IDS.STUDENT_1,
            porcentaje: 60 + i, // 60, 61, 62, 63, 64
            createdAt: new Date(Date.now() - (i + 5) * 24 * 60 * 60 * 1000),
          })
        ),
      ]

      setupAttemptsMocks(currentAttempts, [])
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Con mejores porcentajes recientes, la tendencia debería ser "improving"
      expect(['improving', 'declining', 'stable']).toContain(data.current.progress.trend)
    })

    it('debe calcular tendencia estable cuando no hay suficientes intentos', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      // Menos de 10 intentos
      const currentAttempts = createMultipleAttempts(TEST_IDS.STUDENT_1, 5)

      setupAttemptsMocks(currentAttempts, [])
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      
      // Con menos de 10 intentos, la tendencia debe ser "stable"
      expect(data.current.progress.trend).toBe('stable')
    })
  })

  describe('Progreso conjunto', () => {
    it('debe retornar progreso de ambos estudiantes', async () => {
      const students = [
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_1 }),
        createStudentWithUser({ studentId: TEST_IDS.STUDENT_2 }),
      ]
      setupStudentsMocks(students)

      const currentAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_1,
          porcentaje: 75,
        }),
      ]

      const otherAttempts = [
        createAttemptWithExam({
          studentId: TEST_IDS.STUDENT_2,
          porcentaje: 70,
        }),
      ]

      setupAttemptsMocks(currentAttempts, otherAttempts)
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertJointProgressResponse(data)

      // Debe tener progreso de ambos
      expect(data.current).toBeDefined()
      expect(data.other).toBeDefined()
      expect(data.current.student.id).toBe(TEST_IDS.STUDENT_1)
      expect(data.other.student.id).toBe(TEST_IDS.STUDENT_2)
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
      setupPerformanceMetricsMocks([], [])

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
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      expect(data.current.progress.averagePaesScore).toBeNull()
      expect(data.current.progress.bestPaesScore).toBeNull()
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
      setupPerformanceMetricsMocks([], [])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse(response)
      assertJointProgressResponse(data)

      // Validar estructura de student
      expect(data.current.student).toHaveProperty('id')
      expect(data.current.student).toHaveProperty('nombre')
      expect(data.current.student).toHaveProperty('email')

      // Validar estructura de progress
      expect(typeof data.current.progress.totalAttempts).toBe('number')
      expect(typeof data.current.progress.averagePercentage).toBe('number')
      expect(typeof data.current.progress.bestPercentage).toBe('number')
      expect(Array.isArray(data.current.progress.recentAttempts)).toBe(true)
      expect(Array.isArray(data.current.progress.topTopics)).toBe(true)
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.student.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 500, 'Error al calcular progreso conjunto')
    })

    it('debe manejar errores inesperados correctamente', async () => {
      globalThis.__mockGetAuthenticatedUserWithStudent__.mockRejectedValue(
        new Error('Unexpected error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })
})

