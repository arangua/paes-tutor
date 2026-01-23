/**
 * Test Helpers Enterprise para API de Bookmarks
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de bookmarks,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import type {
  Bookmark,
  Question,
  QuestionOption,
  Subject,
  Topic,
  User,
  Student,
} from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests
 */
export const TEST_IDS = {
  STUDENT: 'c111111111111111111111111',
  STUDENT_2: 'c222222222222222222222222',
  EXAM: 'c333333333333333333333333', // ✅ Enterprise: Agregado para compatibilidad con tests de challenges
  ATTEMPT: 'c444444444444444444444444', // ✅ Enterprise: Agregado para compatibilidad con tests de challenges
  QUESTION: 'c777777777777777777777777',
  QUESTION_2: 'c888888888888888888888888',
  QUESTION_3: 'c999999999999999999999999',
  OPTION: 'c999999999999999999999999',
  OPTION_2: 'caaaaaaaaaaaaaaaaaaaaaaaa',
  TOPIC: 'cbbbbbbbbbbbbbbbbbbbbbbbb',
  SUBJECT: 'cccccccccccccccccccccccc',
  BOOKMARK: 'cddddddddddddddddddddddd',
  BOOKMARK_2: 'ceeeeeeeeeeeeeeeeeeeeeee',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL: 'test@example.com',
  STUDENT_NAME: 'Test Student',
  QUESTION_TEXT: 'Test Question',
  OPTION_TEXT: 'Test Option',
  SUBJECT_NAME: 'Test Subject',
  SUBJECT_CODE: 'TEST',
  TOPIC_NAME: 'Test Topic',
  NOTES: 'Test notes',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear un Bookmark con relaciones
 */
export interface BookmarkWithRelationsOptions {
  id?: string
  studentId?: string
  questionId?: string
  notes?: string | null
  createdAt?: Date
  question?: {
    id?: string
    enunciado?: string
    topicId?: string
    subjectId?: string
    options?: Array<{
      id?: string
      texto?: string
      esCorrecta?: boolean
      letra?: string
    }>
    subject?: {
      nombre?: string
      codigo?: string
    }
    topic?: {
      nombre?: string
      ejeTematico?: string | null
    }
  }
}

/**
 * Opciones para crear un User con Student
 */
export interface UserWithStudentOptions {
  email?: string
  studentId?: string
  studentName?: string
  student?: Student | null
}

// ============================================
// FACTORIES
// ============================================

/**
 * Factory para crear un Subject
 */
export function createSubject(options: {
  id?: string
  nombre?: string
  codigo?: string
} = {}): Subject {
  return {
    id: options.id ?? TEST_IDS.SUBJECT,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.SUBJECT_NAME,
    codigo: options.codigo ?? DEFAULT_TEST_VALUES.SUBJECT_CODE,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Subject
}

/**
 * Factory para crear un Topic
 */
export function createTopic(options: {
  id?: string
  nombre?: string
  ejeTematico?: string | null
  subjectId?: string
} = {}): Topic {
  return {
    id: options.id ?? TEST_IDS.TOPIC,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
    ejeTematico: options.ejeTematico ?? null,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Topic
}

/**
 * Factory para crear un QuestionOption
 */
export function createQuestionOption(options: {
  id?: string
  questionId?: string
  texto?: string
  esCorrecta?: boolean
  letra?: string
} = {}): QuestionOption {
  return {
    id: options.id ?? TEST_IDS.OPTION,
    questionId: options.questionId ?? TEST_IDS.QUESTION,
    texto: options.texto ?? DEFAULT_TEST_VALUES.OPTION_TEXT,
    esCorrecta: options.esCorrecta ?? false,
    letra: options.letra ?? 'A',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as QuestionOption
}

/**
 * Factory para crear un Question con Options, Subject y Topic
 */
export function createQuestionWithRelations(options: {
  id?: string
  enunciado?: string
  topicId?: string
  subjectId?: string
  options?: Array<{
    id?: string
    texto?: string
    esCorrecta?: boolean
    letra?: string
  }>
  subject?: {
    nombre?: string
    codigo?: string
  }
  topic?: {
    nombre?: string
    ejeTematico?: string | null
  }
} = {}): Question & {
  options: QuestionOption[]
  subject: { nombre: string; codigo: string }
  topic: { nombre: string; ejeTematico: string | null } | null
} {
  const questionId = options.id ?? TEST_IDS.QUESTION
  const defaultOptions = [
    createQuestionOption({ id: TEST_IDS.OPTION, questionId, texto: 'Opción A', esCorrecta: true, letra: 'A' }),
    createQuestionOption({ id: TEST_IDS.OPTION_2, questionId, texto: 'Opción B', esCorrecta: false, letra: 'B' }),
  ]

  return {
    id: questionId,
    enunciado: options.enunciado ?? DEFAULT_TEST_VALUES.QUESTION_TEXT,
    explicacion: 'Test explanation',
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    createdAt: new Date(),
    updatedAt: new Date(),
    options: options.options
      ? options.options.map((opt, idx) =>
          createQuestionOption({
            id: opt.id ?? (idx === 0 ? TEST_IDS.OPTION : TEST_IDS.OPTION_2),
            questionId,
            texto: opt.texto ?? `Opción ${String.fromCharCode(65 + idx)}`,
            esCorrecta: opt.esCorrecta ?? idx === 0,
            letra: opt.letra ?? String.fromCharCode(65 + idx),
          })
        )
      : defaultOptions,
    subject: options.subject
      ? { nombre: options.subject.nombre ?? DEFAULT_TEST_VALUES.SUBJECT_NAME, codigo: options.subject.codigo ?? DEFAULT_TEST_VALUES.SUBJECT_CODE }
      : { nombre: DEFAULT_TEST_VALUES.SUBJECT_NAME, codigo: DEFAULT_TEST_VALUES.SUBJECT_CODE },
    topic: options.topic
      ? { nombre: options.topic.nombre ?? DEFAULT_TEST_VALUES.TOPIC_NAME, ejeTematico: options.topic.ejeTematico ?? null }
      : { nombre: DEFAULT_TEST_VALUES.TOPIC_NAME, ejeTematico: null },
  } as Question & {
    options: QuestionOption[]
    subject: { nombre: string; codigo: string }
    topic: { nombre: string; ejeTematico: string | null } | null
  }
}

/**
 * Factory para crear un Student
 */
export function createStudent(options: {
  id?: string
  nombre?: string
  userId?: string
} = {}): Student {
  return {
    id: options.id ?? TEST_IDS.STUDENT,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.STUDENT_NAME,
    userId: options.userId ?? 'user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Student
}

/**
 * Factory para crear un User con Student
 */
export function createUserWithStudent(options: UserWithStudentOptions = {}): User & { student: Student | null } {
  const studentId = options.studentId ?? TEST_IDS.STUDENT
  const student = options.student ?? createStudent({ id: studentId, nombre: options.studentName })

  return {
    id: 'user-id',
    email: options.email ?? DEFAULT_TEST_VALUES.EMAIL,
    name: null,
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    student,
  } as User & { student: Student | null }
}

/**
 * Factory para crear un Bookmark con relaciones
 */
export function createBookmarkWithRelations(
  options: BookmarkWithRelationsOptions = {}
): Bookmark & {
  question: Question & {
    options: QuestionOption[]
    subject: { nombre: string; codigo: string }
    topic: { nombre: string; ejeTematico: string | null } | null
  }
} {
  const questionId = options.questionId ?? TEST_IDS.QUESTION
  const question = options.question
    ? createQuestionWithRelations({
        id: questionId,
        enunciado: options.question.enunciado,
        topicId: options.question.topicId,
        subjectId: options.question.subjectId,
        options: options.question.options,
        subject: options.question.subject,
        topic: options.question.topic,
      })
    : createQuestionWithRelations({ id: questionId })

  return {
    id: options.id ?? TEST_IDS.BOOKMARK,
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    questionId,
    notes: options.notes ?? null,
    createdAt: options.createdAt ?? new Date(),
    question,
  } as Bookmark & {
    question: Question & {
      options: QuestionOption[]
      subject: { nombre: string; codigo: string }
      topic: { nombre: string; ejeTematico: string | null } | null
    }
  }
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura un usuario autenticado con estudiante
 */
export function setupAuthenticatedUserWithStudent(
  user: User & { student: Student | null } | null = createUserWithStudent()
): void {
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(user)
}

/**
 * Configura un usuario no autenticado
 */
export function setupUnauthenticatedUser(): void {
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(null)
}

/**
 * Configura un usuario autenticado sin estudiante
 */
export function setupUserWithoutStudent(): void {
  const user = {
    id: 'user-id',
    email: DEFAULT_TEST_VALUES.EMAIL,
    name: null,
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    student: null,
  } as User & { student: Student | null }
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(user)
}

/**
 * Configura el mock de Prisma para findMany de Bookmark
 */
export function setupBookmarksMock(
  bookmarks: Array<
    Bookmark & {
      question?: Question & {
        options?: QuestionOption[]
        subject?: { nombre: string; codigo: string }
        topic?: { nombre: string; ejeTematico: string | null } | null
      }
    }
  > = []
): void {
  // Ordenar bookmarks por createdAt descendente para simular el comportamiento de Prisma
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    const dateA = a.createdAt?.getTime() ?? 0
    const dateB = b.createdAt?.getTime() ?? 0
    return dateB - dateA // Descendente
  })
  vi.mocked(prisma.bookmark.findMany).mockResolvedValue(sortedBookmarks as any)
}

/**
 * Configura el mock de Prisma para findUnique de Bookmark
 */
export function setupBookmarkMock(
  bookmark: (Bookmark & {
    question?: Question & {
      options?: QuestionOption[]
      subject?: { nombre: string; codigo: string }
      topic?: { nombre: string; ejeTematico: string | null } | null
    }
  }) | null
): void {
  vi.mocked(prisma.bookmark.findUnique).mockResolvedValue(bookmark as any)
}

/**
 * Configura el mock de Prisma para findUnique de Question
 */
export function setupQuestionMock(question: Question | null): void {
  vi.mocked(prisma.question.findUnique).mockResolvedValue(question as any)
}

/**
 * Configura el mock de Prisma para create de Bookmark
 */
export function setupBookmarkCreateMock(
  bookmark: Bookmark & {
    question?: Question & {
      subject?: { nombre: string; codigo: string }
      topic?: { nombre: string } | null
    }
  }
): void {
  vi.mocked(prisma.bookmark.create).mockResolvedValue(bookmark as any)
}

/**
 * Configura el mock de Prisma para delete de Bookmark
 */
export function setupBookmarkDeleteMock(): void {
  vi.mocked(prisma.bookmark.delete).mockResolvedValue({} as any)
}

// ============================================
// REQUEST UTILITIES
// ============================================

/**
 * Opciones para crear un NextRequest
 */
export interface CreateRequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  queryParams?: Record<string, string>
  body?: any
  baseUrl?: string
}

/**
 * Crea un NextRequest para tests
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/bookmarks'
  const method = options.method ?? 'GET'

  let url = baseUrl

  // Agregar query parameters
  if (options.queryParams) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (value !== null && value !== undefined) {
        params.append(key, String(value))
      }
    }
    const queryString = params.toString()
    if (queryString) {
      const urlObj = new URL(url)
      urlObj.search = queryString
      url = urlObj.toString()
    }
  }

  const headers = new Headers()
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // Crear Request estándar primero (compatible con Node/undici)
  const bodyString = options.body ? JSON.stringify(options.body) : undefined
  const request = new Request(url, {
    method,
    headers,
    body: bodyString,
  }) as any

  // PASO 4: Cachear el body en el Request con un símbolo estable (no _bodyText)
  if (bodyString) {
    const BODY_SYMBOL = Symbol.for("test.rawBody")
    ;(request as any)[BODY_SYMBOL] = bodyString
    // También mantener _bodyText para compatibilidad con código existente
    ;(request as any)._bodyText = bodyString
  }

  // Agregar campo nextUrl para que request.nextUrl.searchParams funcione
  request.nextUrl = new URL(url)

  return request as NextRequest
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Valida que una respuesta sea exitosa y retorna los datos
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
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedError: string | ((error: string) => boolean)
): Promise<any> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  const errorMessage = data.error || data.message || ''

  if (typeof expectedError === 'string') {
    expect(errorMessage).toContain(expectedError)
  } else {
    expect(expectedError(errorMessage)).toBe(true)
  }
  
  return data
}

/**
 * Valida que una respuesta tenga los campos requeridos
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
 * Valida que una respuesta de Bookmark tenga la estructura correcta
 */
export async function assertBookmarkResponse(response: Response): Promise<any> {
  const data = await assertSuccessResponse(response)
  expect(data).toHaveProperty('bookmark')
  expect(data.bookmark).toHaveProperty('id')
  expect(data.bookmark).toHaveProperty('studentId')
  expect(data.bookmark).toHaveProperty('questionId')
  expect(data.bookmark).toHaveProperty('question')
  expect(data.bookmark.question).toHaveProperty('options')
  expect(Array.isArray(data.bookmark.question.options)).toBe(true)
  return data
}

/**
 * Valida que una respuesta de Bookmarks (array) tenga la estructura correcta
 */
export async function assertBookmarksResponse(response: Response): Promise<any> {
  const data = await assertSuccessResponse(response)
  expect(data).toHaveProperty('bookmarks')
  expect(Array.isArray(data.bookmarks)).toBe(true)
  return data
}

