/**
 * Test Helpers para API de Versiones
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de versiones,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCache } from '@/lib/cache'
import type { StudyNote, StudyNoteVersion } from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests (formato: c + 24 caracteres alfanuméricos)
 */
export const TEST_IDS = {
  NOTE: 'c123456789012345678901234',
  VERSION: 'c987654321098765432109876',
  VERSION_2: 'c222222222222222222222222',
  STUDENT: 'c111111111111111111111111',
  STUDENT_2: 'c222222222222222222222222',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL: 'test@example.com',
  STUDENT_NAME: 'Test Student',
  NOTE_TITLE: 'Test Note',
  NOTE_CONTENT: 'Test Content',
  NOTE_TAGS: 'tag1,tag2',
  VERSION_TITLE: 'Test Version',
  VERSION_CONTENT: 'Version Content',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para configurar un usuario autenticado en tests
 */
export interface AuthenticatedUserOptions {
  /** ID del usuario (default: 'user-1') */
  userId?: string
  /** ID del estudiante (default: TEST_IDS.STUDENT) */
  studentId?: string
  /** Email del usuario (default: DEFAULT_TEST_VALUES.EMAIL) */
  email?: string
  /** Nombre del estudiante (default: DEFAULT_TEST_VALUES.STUDENT_NAME) */
  studentName?: string
}

/**
 * Opciones para configurar una nota de estudio en tests
 */
export interface StudyNoteOptions {
  /** ID de la nota (default: TEST_IDS.NOTE) */
  id?: string
  /** Título de la nota (default: DEFAULT_TEST_VALUES.NOTE_TITLE) */
  title?: string
  /** Contenido de la nota (default: DEFAULT_TEST_VALUES.NOTE_CONTENT) */
  content?: string
  /** Tags de la nota (default: DEFAULT_TEST_VALUES.NOTE_TAGS) */
  tags?: string | null
  /** ID del estudiante (default: TEST_IDS.STUDENT) */
  studentId?: string
  /** Fecha de actualización (default: new Date('2024-01-01')) */
  updatedAt?: Date
}

/**
 * Opciones para configurar una versión en tests
 */
export interface StudyNoteVersionOptions {
  /** ID de la versión (default: TEST_IDS.VERSION) */
  id?: string
  /** ID de la nota asociada (default: TEST_IDS.NOTE) */
  noteId?: string
  /** Título de la versión (default: DEFAULT_TEST_VALUES.VERSION_TITLE) */
  title?: string
  /** Contenido de la versión (default: DEFAULT_TEST_VALUES.VERSION_CONTENT) */
  content?: string
  /** Tags de la versión */
  tags?: string | null
  /** Nombre personalizado de la versión */
  name?: string | null
  /** Color de la versión */
  color?: string | null
  /** Si la versión es importante */
  isImportant?: boolean
  /** Si el contenido está comprimido */
  isCompressed?: boolean
  /** Fecha de creación (default: new Date('2024-01-01')) */
  createdAt?: Date
  /** ID del creador (default: TEST_IDS.STUDENT) */
  createdBy?: string
}

/**
 * Opciones para configurar un test GET completo
 */
export interface GetTestSetupOptions {
  /** Configuración de la nota (opcional, usa defaults si no se proporciona) */
  note?: StudyNoteOptions | null
  /** Número de versiones (default: 0) */
  versionCount?: number
  /** Array de versiones (default: []) */
  versions?: StudyNoteVersionOptions[]
  /** Datos de caché (opcional, si no se proporciona usa null) */
  cache?: any
  /** Configuración de usuario (opcional) */
  user?: AuthenticatedUserOptions
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/notes/versions') */
  baseUrl?: string
  /** Query parameters */
  queryParams?: Record<string, string | number | boolean | null>
  /** Método HTTP (default: 'GET') */
  method?: string
  /** Body JSON (se serializa automáticamente) */
  body?: any
  /** Headers adicionales */
  headers?: HeadersInit
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
    id: options.userId ?? 'user-1', // Agregar id del usuario
    email: options.email ?? DEFAULT_TEST_VALUES.EMAIL,
    student: {
      id: options.studentId ?? TEST_IDS.STUDENT,
      nombre: options.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME,
    },
  }
}

/**
 * Factory para crear un objeto de nota de estudio para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de nota de estudio
 * 
 * @example
 * ```typescript
 * const note = createStudyNote({ title: 'Custom Title' })
 * ```
 */
export function createStudyNote(options: StudyNoteOptions = {}): Partial<StudyNote> {
  return {
    id: options.id ?? TEST_IDS.NOTE,
    title: options.title ?? DEFAULT_TEST_VALUES.NOTE_TITLE,
    content: options.content ?? DEFAULT_TEST_VALUES.NOTE_CONTENT,
    tags: options.tags ?? DEFAULT_TEST_VALUES.NOTE_TAGS,
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    updatedAt: options.updatedAt ?? new Date('2024-01-01'),
  } as Partial<StudyNote>
}

/**
 * Factory para crear un objeto de versión de nota para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de versión de nota
 * 
 * @example
 * ```typescript
 * const version = createStudyNoteVersion({ 
 *   title: 'Important Version',
 *   isImportant: true 
 * })
 * ```
 */
export function createStudyNoteVersion(
  options: StudyNoteVersionOptions = {}
): Partial<StudyNoteVersion> {
  return {
    id: options.id ?? TEST_IDS.VERSION,
    noteId: options.noteId ?? TEST_IDS.NOTE,
    title: options.title ?? DEFAULT_TEST_VALUES.VERSION_TITLE,
    content: options.content ?? DEFAULT_TEST_VALUES.VERSION_CONTENT,
    tags: options.tags ?? null,
    name: options.name ?? null,
    color: options.color ?? null,
    isImportant: options.isImportant ?? false,
    isCompressed: options.isCompressed ?? false,
    createdAt: options.createdAt ?? new Date('2024-01-01'),
    createdBy: options.createdBy ?? TEST_IDS.STUDENT,
  } as Partial<StudyNoteVersion>
}

/**
 * Factory para crear múltiples versiones de prueba
 * 
 * @param count - Número de versiones a crear
 * @param baseOptions - Opciones base aplicadas a todas las versiones
 * @returns Array de versiones
 * 
 * @example
 * ```typescript
 * const versions = createMultipleVersions(3, { isImportant: true })
 * ```
 */
export function createMultipleVersions(
  count: number,
  baseOptions: StudyNoteVersionOptions = {}
): Partial<StudyNoteVersion>[] {
  return Array.from({ length: count }, (_, index) =>
    createStudyNoteVersion({
      ...baseOptions,
      id: `${TEST_IDS.VERSION}_${index}`,
      title: `${baseOptions.title ?? DEFAULT_TEST_VALUES.VERSION_TITLE} ${index + 1}`,
    })
  )
}

// ============================================
// UTILITIES PARA REQUESTS
// ============================================

/**
 * Crea un NextRequest para tests con query parameters y body opcionales
 * 
 * @param options - Opciones de configuración del request
 * @returns NextRequest configurado para tests
 * 
 * @example
 * ```typescript
 * // GET request con query params (ruta por defecto)
 * const request = createTestRequest({
 *   queryParams: { noteId: TEST_IDS.NOTE, limit: 10 }
 * })
 * 
 * // GET request con ruta personalizada
 * const request = createTestRequest({
 *   baseUrl: 'http://localhost/api/notes/versions/comments',
 *   queryParams: { versionId: TEST_IDS.VERSION }
 * })
 * 
 * // POST request con body
 * const request = createTestRequest({
 *   method: 'POST',
 *   body: { noteId: TEST_IDS.NOTE, versionId: TEST_IDS.VERSION }
 * })
 * ```
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/notes/versions'
  const method = options.method ?? 'GET'

  // Construir URL con query parameters
  const url = new URL(baseUrl)
  if (options.queryParams) {
    Object.entries(options.queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  // Configurar body si existe
  const init: RequestInit = {
    method,
    headers: options.headers,
  }

  if (options.body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    const bodyString = JSON.stringify(options.body)
    init.body = bodyString
    
    // Configurar headers con Content-Type
    const headers = new Headers(options.headers || {})
    headers.set('Content-Type', 'application/json')
    headers.set('Content-Length', String(bodyString.length))
    init.headers = headers
  }

  // Crear un Request estándar con body como string y header content-type
  const standardRequest = new Request(url.toString(), init)
  
  // Convertir a NextRequest
  const request = new NextRequest(standardRequest)
  
  return request
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura el mock de autenticación con un usuario autenticado
 * 
 * @param options - Opciones de configuración del usuario
 * 
 * @example
 * ```typescript
 * await setupAuthenticatedUser({ studentId: 'custom-id' })
 * ```
 */
export async function setupAuthenticatedUser(options: AuthenticatedUserOptions = {}) {
  const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
  const user = createAuthenticatedUser(options)
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(user as any)
}

/**
 * Configura el mock de autenticación con un usuario NO autenticado
 * 
 * @example
 * ```typescript
 * await setupUnauthenticatedUser()
 * ```
 */
export async function setupUnauthenticatedUser() {
  const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
    email: null,
  } as any)
}

/**
 * Configura el mock de getCurrentStudentId (usado en algunos endpoints)
 * 
 * @param studentId - ID del estudiante o null para simular no autenticado
 * 
 * @example
 * ```typescript
 * setupCurrentStudentId(TEST_IDS.STUDENT)
 * setupCurrentStudentId(null) // Para simular no autenticado
 * ```
 */
export async function setupCurrentStudentId(studentId: string | null) {
  const { getCurrentStudentId } = await import('@/lib/get-session')
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

/**
 * Configura el mock de caché para retornar null (sin caché)
 * 
 * @example
 * ```typescript
 * setupNoCache()
 * ```
 */
export function setupNoCache() {
  vi.mocked(getCache).mockResolvedValue(null)
}

/**
 * Configura el mock de caché con datos específicos
 * 
 * @param cachedData - Datos a retornar desde el caché
 * 
 * @example
 * ```typescript
 * setupCache({ versions: [...], total: 10 })
 * ```
 */
export function setupCache(cachedData: any) {
  vi.mocked(getCache).mockResolvedValue(cachedData)
}

/**
 * Configura el mock de la nota de estudio
 * 
 * @param note - Nota de estudio o null (para simular nota no encontrada)
 * 
 * @example
 * ```typescript
 * setupStudyNote(createStudyNote({ title: 'Custom Note' }))
 * setupStudyNote(null) // Para simular nota no encontrada
 * ```
 */
export function setupStudyNote(note: Partial<StudyNote> | null) {
  vi.mocked(prisma.studyNote.findFirst).mockResolvedValue(note as any)
}

/**
 * Configura el mock de versiones con count y findMany
 * 
 * @param count - Número total de versiones
 * @param versions - Array de versiones a retornar
 * 
 * @example
 * ```typescript
 * setupVersions(2, [
 *   createStudyNoteVersion({ id: 'v1' }),
 *   createStudyNoteVersion({ id: 'v2' })
 * ])
 * ```
 */
export function setupVersions(count: number, versions: Partial<StudyNoteVersion>[] = []) {
  vi.mocked(prisma.studyNoteVersion.count).mockResolvedValue(count)
  vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue(versions as any)
}

/**
 * Configura un setup completo para un test GET exitoso
 * 
 * Esta función configura todos los mocks necesarios para un test GET estándar,
 * permitiendo personalización mediante opciones.
 * 
 * @param options - Opciones de configuración del test
 * 
 * @example
 * ```typescript
 * // Setup básico con defaults
 * await setupSuccessfulGetTest()
 * 
 * // Setup con versiones personalizadas
 * await setupSuccessfulGetTest({
 *   versionCount: 5,
 *   versions: createMultipleVersions(5, { isImportant: true })
 * })
 * 
 * // Setup con caché
 * await setupSuccessfulGetTest({
 *   cache: { versions: [...], total: 10 }
 * })
 * ```
 */
export async function setupSuccessfulGetTest(options: GetTestSetupOptions = {}) {
  // Configurar usuario
  if (options.user) {
    await setupAuthenticatedUser(options.user)
  } else {
    await setupAuthenticatedUser()
  }

  // Configurar caché
  if (options.cache !== undefined) {
    setupCache(options.cache)
  } else {
    setupNoCache()
  }

  // Configurar nota
  if (options.note !== undefined) {
    if (options.note === null) {
      setupStudyNote(null)
    } else {
      setupStudyNote(createStudyNote(options.note))
    }
  } else {
    setupStudyNote(createStudyNote())
  }

  // Configurar versiones
  if (options.versionCount !== undefined || options.versions !== undefined) {
    const versions = options.versions?.map(v => createStudyNoteVersion(v)) ?? []
    setupVersions(options.versionCount ?? versions.length, versions)
  }
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Valida que una respuesta tenga el status esperado y contenga un error
 * 
 * @param response - Response a validar
 * @param expectedStatus - Status HTTP esperado
 * @param expectedError - Mensaje de error esperado (opcional, puede ser string o función que valida)
 * 
 * @example
 * ```typescript
 * await assertErrorResponse(response, 404, 'Nota no encontrada')
 * await assertErrorResponse(response, 400, (error) => error.includes('inválido'))
 * ```
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedError?: string | ((error: string) => boolean)
) {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  expect(data.error).toBeDefined()
  if (expectedError) {
    if (typeof expectedError === 'function') {
      expect(expectedError(data.error)).toBe(true)
    } else {
      expect(data.error).toBe(expectedError)
    }
  }
  return data
}

/**
 * Valida que una respuesta sea exitosa y tenga la estructura esperada
 * 
 * @param response - Response a validar
 * @param expectedStatus - Status HTTP esperado (default: 200)
 * 
 * @example
 * ```typescript
 * const data = await assertSuccessResponse(response)
 * expect(data.versions).toBeDefined()
 * ```
 */
export async function assertSuccessResponse(response: Response, expectedStatus: number = 200) {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  expect(data).toBeDefined()
  return data
}

// ============================================
// ADVANCED ENTERPRISE FEATURES
// ============================================

/**
 * Valida que una respuesta coincida con un schema o estructura esperada
 * 
 * @param response - Response a validar
 * @param matcher - Objeto con propiedades esperadas o función de validación
 * 
 * @example
 * ```typescript
 * // Validar estructura básica
 * await assertResponseMatches(response, {
 *   versions: expect.arrayContaining([expect.any(Object)])
 * })
 * 
 * // Validar con función personalizada
 * await assertResponseMatches(response, (data) => {
 *   return data.versions.length > 0 && data.total >= 0
 * })
 * ```
 */
export async function assertResponseMatches(
  response: Response,
  matcher: Record<string, any> | ((data: any) => boolean)
) {
  const data = await assertSuccessResponse(response)
  
  if (typeof matcher === 'function') {
    expect(matcher(data)).toBe(true)
  } else {
    Object.entries(matcher).forEach(([key, value]) => {
      expect(data).toHaveProperty(key)
      if (value !== undefined) {
        expect(data[key]).toEqual(value)
      }
    })
  }
  
  return data
}

/**
 * Mide el tiempo de ejecución de una operación asíncrona
 * 
 * @param operation - Función asíncrona a medir
 * @returns Objeto con duración y resultado
 * 
 * @example
 * ```typescript
 * const { duration, result } = await measurePerformance(async () => {
 *   return await GET(request)
 * })
 * 
 * expect(duration).toBeLessThan(1000) // Menos de 1 segundo
 * ```
 */
export async function measurePerformance<T>(
  operation: () => Promise<T>
): Promise<{ duration: number; result: T }> {
  const startTime = performance.now()
  const result = await operation()
  const duration = performance.now() - startTime
  
  return { duration, result }
}

/**
 * Valida que una respuesta se complete dentro de un tiempo máximo
 * 
 * @param operation - Función asíncrona a validar
 * @param maxDuration - Duración máxima en milisegundos
 * 
 * @example
 * ```typescript
 * await assertResponseTime(async () => {
 *   return await GET(request)
 * }, { max: 1000 })
 * ```
 */
export async function assertResponseTime(
  operation: () => Promise<Response>,
  options: { max: number }
): Promise<Response> {
  const { duration, result } = await measurePerformance(operation)
  expect(duration).toBeLessThan(options.max)
  return result
}

/**
 * Crea un builder para construir escenarios de test complejos
 * 
 * @example
 * ```typescript
 * const scenario = new TestScenarioBuilder()
 *   .withAuth({ studentId: TEST_IDS.STUDENT })
 *   .withNote(createStudyNote())
 *   .withVersions([createStudyNoteVersion()])
 *   .build()
 * 
 * await scenario.setup()
 * const request = scenario.createRequest({ queryParams: { noteId: TEST_IDS.NOTE } })
 * ```
 */
export class TestScenarioBuilder {
  private authOptions?: AuthenticatedUserOptions
  private note?: Partial<StudyNote> | null
  private versions?: { count: number; items: Partial<StudyNoteVersion>[] }
  private cache?: any

  withAuth(options: AuthenticatedUserOptions) {
    this.authOptions = options
    return this
  }

  withNote(note: Partial<StudyNote> | null) {
    this.note = note
    return this
  }

  withVersions(count: number, items: Partial<StudyNoteVersion>[] = []) {
    this.versions = { count, items }
    return this
  }

  withCache(data: any) {
    this.cache = data
    return this
  }

  async setup() {
    if (this.authOptions) {
      await setupAuthenticatedUser(this.authOptions)
    } else {
      await setupAuthenticatedUser()
    }

    if (this.cache !== undefined) {
      setupCache(this.cache)
    } else {
      setupNoCache()
    }

    if (this.note !== undefined) {
      setupStudyNote(this.note)
    } else {
      setupStudyNote(createStudyNote())
    }

    if (this.versions) {
      setupVersions(this.versions.count, this.versions.items)
    }
  }

  createRequest(options: CreateRequestOptions = {}): NextRequest {
    return createTestRequest(options)
  }

  build() {
    return {
      setup: () => this.setup(),
      createRequest: (options?: CreateRequestOptions) => this.createRequest(options),
    }
  }
}

// ============================================
// TEST DATA GENERATORS (Enterprise Premium)
// ============================================

/**
 * Genera un CUID válido aleatorio para tests
 * 
 * @returns CUID válido (formato: c + 24 caracteres alfanuméricos)
 * 
 * @example
 * ```typescript
 * const randomId = generateRandomCuid()
 * ```
 */
export function generateRandomCuid(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let result = 'c'
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

/**
 * Genera una nota de estudio aleatoria pero válida
 * 
 * @param overrides - Valores específicos para sobrescribir
 * @returns Nota de estudio con datos aleatorios válidos
 * 
 * @example
 * ```typescript
 * const randomNote = generateRandomNote()
 * const customNote = generateRandomNote({ title: 'Custom Title' })
 * ```
 */
export function generateRandomNote(overrides: Partial<StudyNoteOptions> = {}): Partial<StudyNote> {
  return createStudyNote({
    id: overrides.id ?? generateRandomCuid(),
    title: overrides.title ?? `Test Note ${Math.random().toString(36).substring(7)}`,
    content: overrides.content ?? `Random content ${Math.random().toString(36).substring(7)}`,
    tags: overrides.tags ?? `tag${Math.floor(Math.random() * 10)}`,
    updatedAt: overrides.updatedAt ?? new Date(Date.now() - Math.random() * 10000000000),
    ...overrides,
  })
}

/**
 * Genera una versión de nota aleatoria pero válida
 * 
 * @param overrides - Valores específicos para sobrescribir
 * @returns Versión de nota con datos aleatorios válidos
 * 
 * @example
 * ```typescript
 * const randomVersion = generateRandomVersion()
 * const customVersion = generateRandomVersion({ title: 'Custom Version' })
 * ```
 */
export function generateRandomVersion(overrides: Partial<StudyNoteVersionOptions> = {}): Partial<StudyNoteVersion> {
  return createStudyNoteVersion({
    id: overrides.id ?? generateRandomCuid(),
    noteId: overrides.noteId ?? TEST_IDS.NOTE,
    title: overrides.title ?? `Version ${Math.random().toString(36).substring(7)}`,
    content: overrides.content ?? `Version content ${Math.random().toString(36).substring(7)}`,
    tags: overrides.tags ?? `tag${Math.floor(Math.random() * 10)}`,
    createdAt: overrides.createdAt ?? new Date(Date.now() - Math.random() * 10000000000),
    isImportant: overrides.isImportant ?? Math.random() > 0.5,
    ...overrides,
  })
}

/**
 * Genera múltiples versiones aleatorias
 * 
 * @param count - Número de versiones a generar
 * @param baseOptions - Opciones base para todas las versiones
 * @returns Array de versiones aleatorias
 * 
 * @example
 * ```typescript
 * const randomVersions = generateRandomVersions(10)
 * const customVersions = generateRandomVersions(5, { noteId: TEST_IDS.NOTE })
 * ```
 */
export function generateRandomVersions(
  count: number,
  baseOptions: Partial<StudyNoteVersionOptions> = {}
): Partial<StudyNoteVersion>[] {
  return Array.from({ length: count }, () => generateRandomVersion(baseOptions))
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
 *   .databaseError()
 *   .build()
 * 
 * await errorScenario.apply()
 * ```
 */
export class ErrorScenarioBuilder {
  private errors: Array<{ type: string; config: any }> = []

  /**
   * Simula un error de base de datos
   */
  databaseError(message: string = 'Database error') {
    this.errors.push({ type: 'database', config: { message } })
    return this
  }

  /**
   * Simula un timeout
   */
  timeout(duration: number = 5000) {
    this.errors.push({ type: 'timeout', config: { duration } })
    return this
  }

  /**
   * Simula usuario no autorizado
   */
  unauthorized() {
    this.errors.push({ type: 'unauthorized', config: {} })
    return this
  }

  /**
   * Simula estudiante no encontrado
   */
  studentNotFound() {
    this.errors.push({ type: 'studentNotFound', config: {} })
    return this
  }

  /**
   * Simula nota no encontrada
   */
  noteNotFound() {
    this.errors.push({ type: 'noteNotFound', config: {} })
    return this
  }

  /**
   * Aplica todos los errores configurados
   */
  async apply() {
    for (const error of this.errors) {
      switch (error.type) {
        case 'database':
          vi.mocked(prisma.studyNote.findFirst).mockRejectedValue(
            new Error(error.config.message)
          )
          break
        case 'unauthorized':
          await setupUnauthenticatedUser()
          break
        case 'studentNotFound': {
          const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
          vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            student: null,
          } as any)
          break
        }
        case 'noteNotFound':
          setupStudyNote(null)
          break
        case 'timeout':
          // Simular timeout configurando un delay muy largo
          vi.mocked(prisma.studyNote.findFirst).mockImplementation(
            () => new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), error.config.duration)
            ) as any
          )
          break
      }
    }
  }

  /**
   * Construye el escenario de error
   */
  build() {
    return {
      apply: () => this.apply(),
    }
  }
}

// ============================================
// SCHEMA VALIDATION HELPERS (Enterprise Premium)
// ============================================

/**
 * Valida que una respuesta tenga la estructura esperada
 * 
 * @param response - Respuesta a validar
 * @param schema - Schema o función de validación
 * @param expectedStatus - Status HTTP esperado (default: 200)
 * 
 * @example
 * ```typescript
 * // Validación con función
 * await assertResponseSchema(response, (data) => {
 *   expect(data).toHaveProperty('versions')
 *   expect(Array.isArray(data.versions)).toBe(true)
 * })
 * 
 * // Validación con objeto esperado
 * await assertResponseSchema(response, {
 *   versions: expect.arrayContaining([expect.objectContaining({ id: expect.any(String) })])
 * })
 * ```
 */
export async function assertResponseSchema(
  response: Response,
  schema: ((data: any) => void) | Record<string, any>,
  expectedStatus: number = 200
): Promise<any> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()

  if (typeof schema === 'function') {
    schema(data)
  } else {
    expect(data).toMatchObject(schema)
  }

  return data
}

/**
 * Valida que una respuesta contenga ciertos campos requeridos
 * 
 * @param response - Respuesta a validar
 * @param requiredFields - Array de campos requeridos
 * @param expectedStatus - Status HTTP esperado (default: 200)
 * 
 * @example
 * ```typescript
 * await assertResponseHasFields(response, ['versions', 'total', 'page'])
 * ```
 */
export async function assertResponseHasFields(
  response: Response,
  requiredFields: string[],
  expectedStatus: number = 200
): Promise<any> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()

  for (const field of requiredFields) {
    expect(data).toHaveProperty(field)
  }

  return data
}

/**
 * Valida que una respuesta sea un array con elementos que cumplan un schema
 * 
 * @param response - Respuesta a validar
 * @param itemSchema - Schema para cada elemento del array
 * @param expectedStatus - Status HTTP esperado (default: 200)
 * 
 * @example
 * ```typescript
 * await assertResponseArray(response, (item) => {
 *   expect(item).toHaveProperty('id')
 *   expect(item).toHaveProperty('title')
 * })
 * ```
 */
export async function assertResponseArray(
  response: Response,
  itemSchema: (item: any) => void,
  expectedStatus: number = 200
): Promise<any[]> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()

  expect(Array.isArray(data)).toBe(true)
  if (data.length > 0) {
    itemSchema(data[0])
  }

  return data
}

