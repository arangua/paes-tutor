// @vitest-environment node
/**
 * Tests Enterprise para API de Practice/Sessions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createUserWithStudent,
  createPracticeSession,
  createQuestionWithCorrectOption,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  setupUserWithoutStudent,
  setupTopicMock,
  setupQuestionsMock,
  setupPracticeSessionCreateMock,
  setupPerformanceMetricMock,
  setupPerformanceMetricUpdateMock,
  setupPerformanceMetricCreateMock,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    topic: { findUnique: vi.fn() },
    question: { findMany: vi.fn() },
    practiceSession: { create: vi.fn() },
    performanceMetric: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('POST /api/practice/sessions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId: TEST_IDS.TOPIC, answers: [] }),
    })
    const response = await POST(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    setupUserWithoutStudent()
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId: TEST_IDS.TOPIC, answers: [] }),
    })
    const response = await POST(request)
    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe retornar 404 si el tema no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock(null)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId: TEST_IDS.TOPIC, answers: [] }),
    })
    const response = await POST(request)
    await assertErrorResponse(response, 404, 'Tema no encontrado')
  })

  it('debe crear sesión de práctica correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    const question = createQuestionWithCorrectOption({ id: TEST_IDS.QUESTION })
    setupQuestionsMock([question])
    const session = createPracticeSession({
      topicId: TEST_IDS.TOPIC,
      totalPreguntas: 1,
      correctas: 1,
      incorrectas: 0,
      omitidas: 0,
      porcentaje: 100,
    })
    setupPracticeSessionCreateMock(session)
    setupPerformanceMetricMock(null)
    setupPerformanceMetricCreateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [
          {
            questionId: TEST_IDS.QUESTION,
            optionSelectedId: TEST_IDS.OPTION,
            omitida: false,
            tiempoSegundos: 30,
          },
        ],
      }),
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.session.topicId).toBe(TEST_IDS.TOPIC)
    expect(data.session.correctas).toBe(1)
    expect(data.session.porcentaje).toBe(100)
  })

  it('debe calcular estadísticas correctamente (correctas, incorrectas, omitidas)', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    const question1 = createQuestionWithCorrectOption({ id: TEST_IDS.QUESTION, optionId: TEST_IDS.OPTION })
    const question2 = createQuestionWithCorrectOption({ id: TEST_IDS.QUESTION_2, optionId: TEST_IDS.OPTION_2 })
    setupQuestionsMock([question1, question2])
    const session = createPracticeSession({
      topicId: TEST_IDS.TOPIC,
      totalPreguntas: 3,
      correctas: 1,
      incorrectas: 1,
      omitidas: 1,
      porcentaje: 33.33,
    })
    setupPracticeSessionCreateMock(session)
    setupPerformanceMetricMock(null)
    setupPerformanceMetricCreateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }, // Correcta
          { questionId: TEST_IDS.QUESTION_2, optionSelectedId: TEST_IDS.OPTION, omitida: false }, // Incorrecta (opción incorrecta)
          { questionId: 'c999999999999999999999999', omitida: true }, // Omitida
        ],
      }),
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.session.correctas).toBe(1)
    expect(data.session.incorrectas).toBe(1)
    expect(data.session.omitidas).toBe(1)
  })

  it('debe calcular duración total correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    const question = createQuestionWithCorrectOption()
    setupQuestionsMock([question])
    const session = createPracticeSession({
      duracionSegundos: 90,
    })
    setupPracticeSessionCreateMock(session)
    setupPerformanceMetricMock(null)
    setupPerformanceMetricCreateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [
          { questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, tiempoSegundos: 30 },
          { questionId: TEST_IDS.QUESTION_2, optionSelectedId: TEST_IDS.OPTION, tiempoSegundos: 60 },
        ],
      }),
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.session.duracionSegundos).toBe(90)
  })

  it('debe actualizar métricas de rendimiento si existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    const question = createQuestionWithCorrectOption()
    setupQuestionsMock([question])
    const session = createPracticeSession()
    setupPracticeSessionCreateMock(session)
    const existingMetric = {
      id: 'cmetric123456789012345',
      studentId: TEST_IDS.STUDENT,
      topicId: TEST_IDS.TOPIC,
      totalPreguntas: 10,
      correctas: 8,
      porcentaje: 80,
    }
    setupPerformanceMetricMock(existingMetric as any)
    setupPerformanceMetricUpdateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      }),
    })
    await POST(request)
    expect(vi.mocked(prisma.performanceMetric.update)).toHaveBeenCalled()
  })

  it('debe crear métricas de rendimiento si no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    const question = createQuestionWithCorrectOption()
    setupQuestionsMock([question])
    const session = createPracticeSession()
    setupPracticeSessionCreateMock(session)
    setupPerformanceMetricMock(null)
    setupPerformanceMetricCreateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      }),
    })
    await POST(request)
    expect(vi.mocked(prisma.performanceMetric.create)).toHaveBeenCalled()
  })

  it('debe manejar respuestas sin tiempoSegundos', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    const question = createQuestionWithCorrectOption()
    setupQuestionsMock([question])
    const session = createPracticeSession({ duracionSegundos: 0 })
    setupPracticeSessionCreateMock(session)
    setupPerformanceMetricMock(null)
    setupPerformanceMetricCreateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [{ questionId: TEST_IDS.QUESTION, optionSelectedId: TEST_IDS.OPTION, omitida: false }],
      }),
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.session.duracionSegundos).toBe(0)
  })

  it('debe manejar porcentaje 0 cuando totalPreguntas es 0', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupTopicMock({ id: TEST_IDS.TOPIC } as any)
    setupQuestionsMock([])
    const session = createPracticeSession({
      totalPreguntas: 0,
      correctas: 0,
      porcentaje: 0,
    })
    setupPracticeSessionCreateMock(session)
    setupPerformanceMetricMock(null)
    setupPerformanceMetricCreateMock({} as any)
    const request = new NextRequest('http://localhost/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: TEST_IDS.TOPIC,
        answers: [],
      }),
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response)
    expect(data.session.porcentaje).toBe(0)
  })
})

