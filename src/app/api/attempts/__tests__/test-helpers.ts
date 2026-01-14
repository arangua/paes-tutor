/**
 * Test Helpers Enterprise para API de Attempts
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de attempts,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * Basado en el patrón enterprise implementado en notes/versions/__tests__/test-helpers.ts
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Attempt, Exam, Question, QuestionOption } from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests (formato: c + 24 caracteres alfanuméricos)
 */
export const TEST_IDS = {
  STUDENT: 'c111111111111111111111111',
  STUDENT_2: 'c222222222222222222222222',
  EXAM: 'c333333333333333333333333',
  EXAM_2: 'c444444444444444444444444',
  ATTEMPT: 'c555555555555555555555555',
  ATTEMPT_2: 'c666666666666666666666666',
  QUESTION: 'c777777777777777777777777',
  QUESTION_2: 'c888888888888888888888888',
  OPTION: 'c999999999999999999999999',
  OPTION_2: 'caaaaaaaaaaaaaaaaaaaaaaaa',
  TOPIC: 'cbbbbbbbbbbbbbbbbbbbbbbbb',
  SUBJECT: 'cccccccccccccccccccccccc',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL: 'test@example.com',
  STUDENT_NAME: 'Test Student',
  EXAM_TITLE: 'Test Exam',
  EXAM_DESCRIPTION: 'Test Description',
  QUESTION_TEXT: 'Test Question',
  OPTION_TEXT: 'Test Option',
  SUBJECT_NAME: 'Test Subject',
  SUBJECT_CODE: 'TEST',
  TOPIC_NAME: 'Test Topic',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para configurar un usuario autenticado en tests
 */
export interface AuthenticatedUserOptions {
  /** ID del estudiante (default: TEST_IDS.STUDENT) */
  studentId?: string
  /** Email del usuario (default: DEFAULT_TEST_VALUES.EMAIL) */
  email?: string
  /** Nombre del estudiante (default: DEFAULT_TEST_VALUES.STUDENT_NAME) */
  studentName?: string
}

/**
 * Opciones para configurar un examen en tests
 */
export interface ExamOptions {
  /** ID del examen (default: TEST_IDS.EXAM) */
  id?: string
  /** Título del examen (default: DEFAULT_TEST_VALUES.EXAM_TITLE) */
  titulo?: string
  /** Descripción del examen (default: DEFAULT_TEST_VALUES.EXAM_DESCRIPTION) */
  descripcion?: string | null
  /** Tipo de examen */
  tipo?: string
  /** Tiempo límite en minutos */
  tiempoLimiteMin?: number | null
  /** Total de preguntas */
  totalPreguntas?: number
  /** ID de la asignatura (default: TEST_IDS.SUBJECT) */
  subjectId?: string
}

/**
 * Opciones para configurar un intento en tests
 */
export interface AttemptOptions {
  /** ID del intento (default: TEST_IDS.ATTEMPT) */
  id?: string
  /** ID del estudiante (default: TEST_IDS.STUDENT) */
  studentId?: string
  /** ID del examen (default: TEST_IDS.EXAM) */
  examId?: string
  /** Estado del intento */
  estado?: 'en_progreso' | 'completado' | 'cancelado'
  /** Porcentaje de aciertos */
  porcentaje?: number
  /** Preguntas correctas */
  correctas?: number
  /** Preguntas incorrectas */
  incorrectas?: number
  /** Preguntas omitidas */
  omitidas?: number
  /** Total de preguntas */
  totalPreguntas?: number
  /** Puntaje PAES */
  puntajePaes?: number | null
  /** Si el puntaje es estimado */
  puntajeEstimado?: boolean
  /** Fecha de inicio */
  startedAt?: Date
  /** Fecha de finalización */
  finishedAt?: Date | null
  /** Duración en segundos */
  duracionSegundos?: number | null
}

/**
 * Opciones para configurar una pregunta en tests
 */
export interface QuestionOptions {
  /** ID de la pregunta (default: TEST_IDS.QUESTION) */
  id?: string
  /** Enunciado de la pregunta */
  enunciado?: string
  /** Explicación de la pregunta */
  explicacion?: string
  /** ID del tema (default: TEST_IDS.TOPIC) */
  topicId?: string | null
}

/**
 * Opciones para configurar una opción de pregunta en tests
 */
export interface QuestionOptionOptions {
  /** ID de la opción (default: TEST_IDS.OPTION) */
  id?: string
  /** ID de la pregunta (default: TEST_IDS.QUESTION) */
  questionId?: string
  /** Letra de la opción (A, B, C, D, E) */
  letra?: string
  /** Texto de la opción */
  texto?: string
  /** Si es la respuesta correcta */
  esCorrecta?: boolean
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/attempts') */
  baseUrl?: string
  /** Query parameters */
  queryParams?: Record<string, string | number | boolean | null>
  /** Método HTTP (default: 'GET') */
  method?: string
  /** Body JSON (se serializa automáticamente) */
  body?: any
  /** Headers adicionales */
  headers?: HeadersInit
  /** ID de intento para rutas [id] */
  attemptId?: string
}

// ============================================
// FACTORIES
// ============================================

/**
 * Factory para crear un objeto de usuario autenticado para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de usuario autenticado mockeado
 * 
 * @example
 * ```typescript
 * const user = createAuthenticatedUser({ studentId: 'custom-id' })
 * ```
 */
export function createAuthenticatedUser(options: AuthenticatedUserOptions = {}) {
  return {
    email: options.email ?? DEFAULT_TEST_VALUES.EMAIL,
    student: {
      id: options.studentId ?? TEST_IDS.STUDENT,
      nombre: options.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME,
    },
  }
}

/**
 * Factory para crear un objeto de examen para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de examen
 * 
 * @example
 * ```typescript
 * const exam = createExam({ titulo: 'Custom Exam', totalPreguntas: 20 })
 * ```
 */
export function createExam(options: ExamOptions = {}): Partial<Exam> {
  return {
    id: options.id ?? TEST_IDS.EXAM,
    titulo: options.titulo ?? DEFAULT_TEST_VALUES.EXAM_TITLE,
    descripcion: options.descripcion ?? DEFAULT_TEST_VALUES.EXAM_DESCRIPTION,
    tipo: options.tipo ?? 'objetiva',
    tiempoLimiteMin: options.tiempoLimiteMin ?? null,
    totalPreguntas: options.totalPreguntas ?? 10,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
  } as Partial<Exam>
}

/**
 * Factory para crear un objeto de intento para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de intento
 * 
 * @example
 * ```typescript
 * const attempt = createAttempt({ 
 *   estado: 'completado', 
 *   porcentaje: 85 
 * })
 * ```
 */
export function createAttempt(options: AttemptOptions = {}): Partial<Attempt> {
  const now = new Date()
  return {
    id: options.id ?? TEST_IDS.ATTEMPT,
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    examId: options.examId ?? TEST_IDS.EXAM,
    estado: options.estado ?? 'en_progreso',
    porcentaje: options.porcentaje ?? 0,
    correctas: options.correctas ?? 0,
    incorrectas: options.incorrectas ?? 0,
    omitidas: options.omitidas ?? 0,
    totalPreguntas: options.totalPreguntas ?? 10,
    puntajePaes: options.puntajePaes ?? null,
    puntajeEstimado: options.puntajeEstimado ?? false,
    startedAt: options.startedAt ?? now,
    finishedAt: options.finishedAt ?? null,
    duracionSegundos: options.duracionSegundos ?? null,
  } as Partial<Attempt>
}

/**
 * Factory para crear un objeto de pregunta para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de pregunta
 */
export function createQuestion(options: QuestionOptions = {}): Partial<Question> {
  return {
    id: options.id ?? TEST_IDS.QUESTION,
    enunciado: options.enunciado ?? DEFAULT_TEST_VALUES.QUESTION_TEXT,
    explicacion: options.explicacion ?? 'Test explanation',
    topicId: options.topicId ?? TEST_IDS.TOPIC,
  } as Partial<Question>
}

/**
 * Factory para crear un objeto de opción de pregunta para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de opción
 */
export function createQuestionOption(options: QuestionOptionOptions = {}): Partial<QuestionOption> {
  return {
    id: options.id ?? TEST_IDS.OPTION,
    questionId: options.questionId ?? TEST_IDS.QUESTION,
    letra: options.letra ?? 'A',
    texto: options.texto ?? DEFAULT_TEST_VALUES.OPTION_TEXT,
    esCorrecta: options.esCorrecta ?? false,
  } as Partial<QuestionOption>
}

/**
 * Factory para crear múltiples intentos
 * 
 * @param count - Número de intentos a crear
 * @param baseOptions - Opciones base para todos los intentos
 * @returns Array de intentos
 */
export function createMultipleAttempts(
  count: number,
  baseOptions: AttemptOptions = {}
): Partial<Attempt>[] {
  return Array.from({ length: count }, (_, index) =>
    createAttempt({
      ...baseOptions,
      id: `${TEST_IDS.ATTEMPT.slice(0, -1)}${index}`,
    })
  )
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura un usuario autenticado para tests
 * 
 * @param options - Opciones de configuración
 * 
 * @example
 * ```typescript
 * await setupAuthenticatedUser({ studentId: TEST_IDS.STUDENT })
 * ```
 */
export async function setupAuthenticatedUser(options: AuthenticatedUserOptions = {}) {
  const { getCurrentStudentId } = await import('@/lib/get-session')
  const studentId = options.studentId ?? TEST_IDS.STUDENT
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

/**
 * Configura un usuario no autenticado para tests
 * 
 * @example
 * ```typescript
 * await setupUnauthenticatedUser()
 * ```
 */
export async function setupUnauthenticatedUser() {
  const { getCurrentStudentId } = await import('@/lib/get-session')
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

/**
 * Configura getCurrentStudentId directamente
 * 
 * @param studentId - ID del estudiante
 * 
 * @example
 * ```typescript
 * await setupCurrentStudentId(TEST_IDS.STUDENT)
 * ```
 */
export async function setupCurrentStudentId(studentId: string) {
  const { getCurrentStudentId } = await import('@/lib/get-session')
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

// ============================================
// REQUEST UTILITIES
// ============================================

/**
 * Crea un NextRequest para tests
 * 
 * @param options - Opciones de configuración
 * @returns NextRequest configurado
 * 
 * @example
 * ```typescript
 * const request = createTestRequest({
 *   queryParams: { limit: 10, offset: 0 }
 * })
 * ```
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/attempts'
  const method = options.method ?? 'GET'
  
  let url = baseUrl
  
  // Agregar ID si se proporciona
  if (options.attemptId) {
    url = `${baseUrl}/${options.attemptId}`
    if (options.baseUrl?.includes('/submit')) {
      url = `${baseUrl}/${options.attemptId}/submit`
    }
  }
  
  // ✅ Enterprise: Agregar query parameters de forma robusta
  if (options.queryParams) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (value !== null && value !== undefined) {
        params.append(key, String(value))
      }
    }
    const queryString = params.toString()
    if (queryString) {
      // Asegurar que la URL tenga el formato correcto
      const urlObj = new URL(url)
      urlObj.search = queryString
      url = urlObj.toString()
    }
  }
  
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  // ✅ Enterprise: Crear NextRequest con URL completa para que nextUrl.searchParams funcione
  return new NextRequest(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Valida que una respuesta sea exitosa y retorna los datos
 * 
 * @param response - Response a validar
 * @returns Datos parseados de la respuesta
 * @throws Si la respuesta no es exitosa
 * 
 * @example
 * ```typescript
 * const data = await assertSuccessResponse(response)
 * expect(data.attempts).toBeDefined()
 * ```
 */
export async function assertSuccessResponse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(
      `Expected successful response but got ${response.status}: ${JSON.stringify(errorData)}`
    )
  }
  return await response.json()
}

/**
 * Valida que una respuesta sea un error con el código y mensaje esperados
 * 
 * @param response - Response a validar
 * @param expectedStatus - Código de estado esperado
 * @param expectedError - Mensaje de error esperado (string o función)
 * 
 * @example
 * ```typescript
 * await assertErrorResponse(response, 404, 'Intento no encontrado')
 * // O con función
 * await assertErrorResponse(response, 400, (error) => error.includes('inválido'))
 * ```
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedError: string | ((error: string) => boolean)
): Promise<void> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  const errorMessage = data.error || data.message || ''
  
  if (typeof expectedError === 'string') {
    expect(errorMessage).toContain(expectedError)
  } else {
    expect(expectedError(errorMessage)).toBe(true)
  }
}

/**
 * Valida que una respuesta tenga los campos requeridos
 * 
 * @param response - Response a validar
 * @param requiredFields - Array de campos requeridos
 * 
 * @example
 * ```typescript
 * await assertResponseHasFields(response, ['attempts', 'pagination'])
 * ```
 */
export async function assertResponseHasFields(
  response: Response,
  requiredFields: string[]
): Promise<void> {
  const data = await assertSuccessResponse(response)
  for (const field of requiredFields) {
    expect(data).toHaveProperty(field)
  }
}

/**
 * Valida que una respuesta sea un array con validación opcional de items
 * 
 * @param response - Response a validar
 * @param itemValidator - Función opcional para validar cada item
 * 
 * @example
 * ```typescript
 * await assertResponseArray(response, (item) => {
 *   expect(item).toHaveProperty('id')
 *   expect(item).toHaveProperty('estado')
 * })
 * ```
 */
export async function assertResponseArray<T = any>(
  response: Response,
  itemValidator?: (item: T) => void
): Promise<T[]> {
  const data = await assertSuccessResponse<T[]>(response)
  expect(Array.isArray(data)).toBe(true)
  
  if (itemValidator) {
    for (const item of data) {
      itemValidator(item)
    }
  }
  
  return data
}

/**
 * Valida el tiempo de respuesta de una operación
 * 
 * @param operation - Operación a medir
 * @param options - Opciones de validación
 * 
 * @example
 * ```typescript
 * await assertResponseTime(async () => GET(request), { max: 200 })
 * ```
 */
export async function assertResponseTime<T>(
  operation: () => Promise<T>,
  options: { max: number }
): Promise<T> {
  const startTime = Date.now()
  const result = await operation()
  const duration = Date.now() - startTime
  
  expect(duration).toBeLessThan(options.max)
  return result
}

/**
 * Mide el performance de una operación
 * 
 * @param operation - Operación a medir
 * @returns Resultado y duración
 * 
 * @example
 * ```typescript
 * const { duration, result } = await measurePerformance(async () => GET(request))
 * console.log(`Operation took ${duration}ms`)
 * ```
 */
export async function measurePerformance<T>(operation: () => Promise<T>): Promise<{
  result: T
  duration: number
}> {
  const startTime = Date.now()
  const result = await operation()
  const duration = Date.now() - startTime
  return { result, duration }
}

// ============================================
// TEST DATA GENERATORS (Enterprise Premium)
// ============================================

/**
 * Genera un CUID aleatorio válido
 * 
 * @returns CUID aleatorio
 */
export function generateRandomCuid(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const randomChars = Array.from({ length: 24 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `c${randomChars}`
}

/**
 * Genera un intento aleatorio pero válido
 * 
 * @param overrides - Valores a sobrescribir
 * @returns Intento aleatorio
 */
export function generateRandomAttempt(overrides: Partial<AttemptOptions> = {}): Partial<Attempt> {
  return createAttempt({
    id: generateRandomCuid(),
    estado: ['en_progreso', 'completado', 'cancelado'][
      Math.floor(Math.random() * 3)
    ] as 'en_progreso' | 'completado' | 'cancelado',
    porcentaje: Math.floor(Math.random() * 100),
    correctas: Math.floor(Math.random() * 10),
    incorrectas: Math.floor(Math.random() * 10),
    omitidas: Math.floor(Math.random() * 5),
    totalPreguntas: 10 + Math.floor(Math.random() * 20),
    ...overrides,
  })
}

/**
 * Genera múltiples intentos aleatorios
 * 
 * @param count - Número de intentos a generar
 * @param baseOptions - Opciones base
 * @returns Array de intentos aleatorios
 */
export function generateRandomAttempts(
  count: number,
  baseOptions: Partial<AttemptOptions> = {}
): Partial<Attempt>[] {
  return Array.from({ length: count }, () => generateRandomAttempt(baseOptions))
}

// ============================================
// SETUP FUNCTIONS (Enterprise)
// ============================================

/**
 * Configura el mock de Prisma para un estudiante
 * 
 * @param student - Estudiante a mockear (null para no encontrado)
 */
export function setupStudent(student: { id: string; nombre: string } | null) {
  vi.mocked(prisma.student.findUnique).mockResolvedValue(student as any)
}

/**
 * Configura el mock de Prisma para intentos
 * 
 * @param attempts - Array de intentos a retornar
 * @param total - Total de intentos (para paginación)
 */
export function setupAttempts(attempts: Partial<Attempt>[] = [], total: number = 0) {
  // Asegurar que los intentos tengan la estructura completa esperada por la API
  const attemptsWithStructure = attempts.map(attempt => ({
    id: attempt.id ?? TEST_IDS.ATTEMPT,
    estado: attempt.estado ?? 'en_progreso',
    porcentaje: attempt.porcentaje ?? 0,
    correctas: attempt.correctas ?? 0,
    totalPreguntas: attempt.totalPreguntas ?? 10,
    puntajePaes: attempt.puntajePaes ?? null,
    createdAt: attempt.startedAt ?? new Date(),
    exam: {
      id: TEST_IDS.EXAM,
      titulo: 'Test Exam',
      subject: {
        id: TEST_IDS.SUBJECT,
        nombre: 'Test Subject',
        codigo: 'TEST',
      },
    },
    ...attempt,
  }))
  
  vi.mocked(prisma.attempt.findMany).mockResolvedValue(attemptsWithStructure as any)
  vi.mocked(prisma.attempt.count).mockResolvedValue(total)
}

/**
 * Configura el mock de caché
 * 
 * @param data - Datos a retornar del caché (null para no cachear)
 * 
 * @remarks
 * Esta función asume que @/lib/cache ya está mockeado en el test.
 * Si no está mockeado, esta función no tendrá efecto.
 */
export function setupCache(data: any) {
  // El mock debe estar configurado en el test file
  // Esta función solo actualiza la implementación del mock
  try {
    const { getCached } = require('@/lib/cache')
    if (vi.isMockFunction(getCached)) {
      vi.mocked(getCached).mockImplementation(async (key: string, fetcher: () => Promise<any>) => {
        if (data !== null) {
          return data
        }
        return await fetcher()
      })
    }
  } catch {
    // Si el módulo no está disponible, simplemente no hacer nada
    // El test debe configurar el mock antes de llamar a esta función
  }
}

/**
 * Configura que no hay caché (siempre ejecuta fetcher)
 * 
 * @remarks
 * Esta función asume que @/lib/cache ya está mockeado en el test.
 * Si no está mockeado, esta función no tendrá efecto.
 */
export function setupNoCache() {
  // El mock debe estar configurado en el test file
  // Esta función solo actualiza la implementación del mock
  try {
    const { getCached } = require('@/lib/cache')
    if (vi.isMockFunction(getCached)) {
      vi.mocked(getCached).mockImplementation(async (key: string, fetcher: () => Promise<any>) => {
        return await fetcher()
      })
    }
  } catch {
    // Si el módulo no está disponible, simplemente no hacer nada
    // El test debe configurar el mock antes de llamar a esta función
  }
}

// ============================================
// TEST SCENARIO BUILDER (Enterprise Premium)
// ============================================

/**
 * Builder para crear escenarios de test complejos (Fluent API)
 * 
 * @example
 * ```typescript
 * const scenario = new TestScenarioBuilder()
 *   .withAuth({ studentId: TEST_IDS.STUDENT })
 *   .withAttempt(createAttempt())
 *   .withExam(createExam())
 *   .withCache(null)
 *   .build()
 * 
 * await scenario.setup()
 * const request = scenario.createRequest({ queryParams: { limit: 10 } })
 * ```
 */
export class TestScenarioBuilder {
  private authOptions?: AuthenticatedUserOptions
  private attempt?: Partial<Attempt> | null
  private attempts?: { items: Partial<Attempt>[]; total: number }
  private exam?: Partial<Exam> | null
  private cache?: any

  /**
   * Configura autenticación
   */
  withAuth(options: AuthenticatedUserOptions) {
    this.authOptions = options
    return this
  }

  /**
   * Configura un intento
   */
  withAttempt(attempt: Partial<Attempt> | null) {
    this.attempt = attempt
    return this
  }

  /**
   * Configura múltiples intentos
   */
  withAttempts(items: Partial<Attempt>[] = [], total: number = 0) {
    this.attempts = { items, total }
    return this
  }

  /**
   * Configura un examen
   */
  withExam(exam: Partial<Exam> | null) {
    this.exam = exam
    return this
  }

  /**
   * Configura caché
   */
  withCache(data: any) {
    this.cache = data
    return this
  }

  /**
   * Ejecuta el setup de todos los mocks configurados
   */
  async setup() {
    // Configurar autenticación
    if (this.authOptions) {
      await setupAuthenticatedUser(this.authOptions)
    } else {
      await setupAuthenticatedUser()
    }

    // Configurar caché
    if (this.cache !== undefined) {
      setupCache(this.cache)
    } else {
      setupNoCache()
    }

    // Configurar estudiante
    if (this.authOptions?.studentId) {
      setupStudent({
        id: this.authOptions.studentId,
        nombre: this.authOptions.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME,
      })
    } else {
      setupStudent({
        id: TEST_IDS.STUDENT,
        nombre: DEFAULT_TEST_VALUES.STUDENT_NAME,
      })
    }

    // Configurar intentos
    if (this.attempts) {
      setupAttempts(this.attempts.items, this.attempts.total)
    } else if (this.attempt !== undefined) {
      setupAttempts(this.attempt ? [this.attempt] : [], this.attempt ? 1 : 0)
    }
  }

  /**
   * Crea un NextRequest para el test
   */
  createRequest(options: CreateRequestOptions = {}): NextRequest {
    return createTestRequest(options)
  }

  /**
   * Construye el objeto de escenario final
   */
  build() {
    return {
      setup: () => this.setup(),
      createRequest: (options?: CreateRequestOptions) => this.createRequest(options),
    }
  }
}

// ============================================
// ERROR SCENARIO BUILDER (Enterprise Premium)
// ============================================

/**
 * Builder para crear escenarios de error de forma declarativa
 * 
 * @example
 * ```typescript
 * const errorScenario = new ErrorScenarioBuilder()
 *   .databaseError('Database connection failed')
 *   .unauthorized()
 *   .studentNotFound()
 *   .build()
 * 
 * await errorScenario.apply()
 * ```
 */
export class ErrorScenarioBuilder {
  private errors: Array<() => void> = []

  /**
   * Simula error de base de datos
   */
  databaseError(message: string = 'Database error') {
    this.errors.push(() => {
      vi.mocked(prisma.attempt.findMany).mockRejectedValue(new Error(message))
      vi.mocked(prisma.attempt.findUnique).mockRejectedValue(new Error(message))
      vi.mocked(prisma.attempt.create).mockRejectedValue(new Error(message))
      vi.mocked(prisma.attempt.update).mockRejectedValue(new Error(message))
    })
    return this
  }

  /**
   * Simula usuario no autenticado
   */
  unauthorized() {
    this.errors.push(async () => {
      await setupUnauthenticatedUser()
    })
    return this
  }

  /**
   * Simula estudiante no encontrado
   */
  studentNotFound() {
    this.errors.push(() => {
      setupStudent(null)
    })
    return this
  }

  /**
   * Simula intento no encontrado
   */
  attemptNotFound() {
    this.errors.push(() => {
      vi.mocked(prisma.attempt.findUnique).mockResolvedValue(null)
    })
    return this
  }

  /**
   * Simula timeout
   */
  timeout(ms: number = 5000) {
    this.errors.push(() => {
      vi.mocked(prisma.attempt.findMany).mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
      )
    })
    return this
  }

  /**
   * Aplica todos los errores configurados
   */
  async apply() {
    for (const errorFn of this.errors) {
      await errorFn()
    }
  }

  /**
   * Construye el objeto de escenario de error
   */
  build() {
    return {
      apply: () => this.apply(),
    }
  }
}

