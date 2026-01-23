/**
 * Test Helpers Enterprise para API de Admission Calendar
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de admission calendar,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { AdmissionCalendar } from '@prisma/client'
import type { EventoCalendario, TipoEvento } from '@/lib/admission-calendar'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests
 */
export const TEST_IDS = {
  STUDENT: 'c111111111111111111111111',
  EVENT_1: 'c222222222222222222222222',
  EVENT_2: 'c333333333333333333333333',
  EVENT_3: 'c444444444444444444444444',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  PROCESO: '2026',
  PROCESO_2: '2027',
  TITULO: 'Evento de Prueba',
  DESCRIPCION: 'Descripción de prueba',
  HORA: '08:00',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear un evento de calendario en tests
 */
export interface EventoCalendarioOptions {
  /** ID del evento (default: TEST_IDS.EVENT_1) */
  id?: string
  /** Proceso (default: DEFAULT_TEST_VALUES.PROCESO) */
  proceso?: string
  /** Fecha del evento */
  fecha?: Date
  /** Hora del evento */
  hora?: string | null
  /** Título del evento */
  titulo?: string
  /** Descripción del evento */
  descripcion?: string | null
  /** Tipo de evento */
  tipo?: TipoEvento
  /** Si es importante */
  importante?: boolean
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/admission-calendar') */
  baseUrl?: string
  /** Query parameters */
  queryParams?: Record<string, string | number | boolean | null>
  /** Método HTTP (default: 'GET') */
  method?: string
  /** Headers adicionales */
  headers?: HeadersInit
}

// ============================================
// FACTORIES
// ============================================

/**
 * Factory para crear un evento de calendario para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de evento de calendario
 * 
 * @example
 * ```typescript
 * const evento = createEventoCalendario({
 *   titulo: 'Postulación',
 *   tipo: 'postulacion',
 *   importante: true
 * })
 * ```
 */
export function createEventoCalendario(
  options: EventoCalendarioOptions = {}
): EventoCalendario {
  const ahora = new Date()
  const fechaFutura = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 días en el futuro

  return {
    id: options.id ?? TEST_IDS.EVENT_1,
    proceso: options.proceso ?? DEFAULT_TEST_VALUES.PROCESO,
    fecha: options.fecha ?? fechaFutura,
    hora: options.hora ?? DEFAULT_TEST_VALUES.HORA,
    titulo: options.titulo ?? DEFAULT_TEST_VALUES.TITULO,
    descripcion: options.descripcion ?? DEFAULT_TEST_VALUES.DESCRIPCION,
    tipo: options.tipo ?? 'otro',
    importante: options.importante ?? false,
  }
}

/**
 * Factory para crear un evento de calendario de Prisma para tests
 * 
 * @param options - Opciones de configuración
 * @returns Objeto de evento de calendario de Prisma
 */
export function createAdmissionCalendarPrisma(
  options: EventoCalendarioOptions = {}
): AdmissionCalendar {
  const ahora = new Date()
  const fechaFutura = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    id: options.id ?? TEST_IDS.EVENT_1,
    proceso: options.proceso ?? DEFAULT_TEST_VALUES.PROCESO,
    fecha: options.fecha ?? fechaFutura,
    hora: options.hora ?? DEFAULT_TEST_VALUES.HORA,
    titulo: options.titulo ?? DEFAULT_TEST_VALUES.TITULO,
    descripcion: options.descripcion ?? DEFAULT_TEST_VALUES.DESCRIPCION,
    tipo: options.tipo ?? 'otro',
    importante: options.importante ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Crea múltiples eventos de calendario
 * 
 * @param count - Número de eventos a crear
 * @param baseOptions - Opciones base para todos los eventos
 * @returns Array de eventos
 */
export function createMultipleEventos(
  count: number,
  baseOptions: EventoCalendarioOptions = {}
): EventoCalendario[] {
  return Array.from({ length: count }, (_, i) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() + i + 1) // Eventos en días consecutivos

    return createEventoCalendario({
      ...baseOptions,
      id: `${TEST_IDS.EVENT_1.slice(0, 23)}${i}`,
      fecha,
    })
  })
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura mocks de Prisma para eventos de calendario
 * 
 * @param eventos - Eventos a retornar en findMany
 */
export function setupAdmissionCalendarMocks(
  eventos: AdmissionCalendar[] = []
): void {
  vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(eventos as any)
}

/**
 * Configura un usuario autenticado para tests
 * 
 * @param session - Objeto de sesión mockeado
 */
export function setupAuthenticatedSession(session: { email?: string } | null = { email: 'test@example.com' }): void {
  vi.doMock('next-auth', () => ({
    getServerSession: vi.fn().mockResolvedValue(session),
  }))
}

/**
 * Configura un usuario no autenticado para tests
 */
export function setupUnauthenticatedSession(): void {
  vi.doMock('next-auth', () => ({
    getServerSession: vi.fn().mockResolvedValue(null),
  }))
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
 *   queryParams: { proceso: '2026', tipo: 'proximos', limite: 5 }
 * })
 * ```
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/admission-calendar'
  const method = options.method ?? 'GET'
  
  let url = baseUrl
  
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
      const urlObj = new URL(url)
      urlObj.search = queryString
      url = urlObj.toString()
    }
  }
  
  const headers = new Headers(options.headers)
  
  return new NextRequest(url, {
    method,
    headers,
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
 */
export async function assertSuccessResponse<T = unknown>(response: Response): Promise<T> {
  expect(response.status).toBeGreaterThanOrEqual(200)
  expect(response.status).toBeLessThan(300)
  return (await response.json()) as T
}

/**
 * Valida que una respuesta sea un error con el código y mensaje esperados
 * 
 * @param response - Response a validar
 * @param expectedStatus - Código de estado esperado
 * @param expectedMessage - Mensaje esperado (opcional, puede ser string o función)
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedMessage?: string | ((message: string) => boolean)
): Promise<void> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  expect(data).toHaveProperty('error')
  
  if (expectedMessage) {
    if (typeof expectedMessage === 'function') {
      expect(expectedMessage(data.error)).toBe(true)
    } else {
      expect(data.error).toContain(expectedMessage)
    }
  }
}

/**
 * Valida que una respuesta tenga los campos requeridos
 * 
 * @param data - Datos a validar
 * @param fields - Campos requeridos
 */
export function assertResponseHasFields(data: unknown, fields: string[]): void {
  for (const field of fields) {
    expect(data).toHaveProperty(field)
  }
}

/**
 * Valida que una respuesta sea un array con la estructura esperada
 * 
 * @param data - Datos a validar
 * @param minLength - Longitud mínima esperada
 * @param itemValidator - Función para validar cada item (opcional)
 */
export function assertResponseArray<T>(
  data: unknown,
  minLength: number = 0,
  itemValidator?: (item: T) => void
): asserts data is T[] {
  expect(Array.isArray(data)).toBe(true)
  expect((data as T[]).length).toBeGreaterThanOrEqual(minLength)
  
  if (itemValidator && (data as T[]).length > 0) {
    itemValidator((data as T[])[0])
  }
}

