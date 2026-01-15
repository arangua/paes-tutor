// @vitest-environment node
/**
 * Tests Enterprise para GET /api/admission-calendar
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
  createAdmissionCalendarPrisma,
  createMultipleEventos,
  setupAdmissionCalendarMocks,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertResponseHasFields,
  assertResponseArray,
} from './__tests__/test-helpers'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    admissionCalendar: {
      findMany: vi.fn(),
    },
  },
}))

// Mock de auth que retorna la sesión mockeada
declare global {
  var __mockAuth__: ReturnType<typeof vi.fn> | undefined
}

vi.mock('@/lib/auth', () => {
  globalThis.__mockAuth__ ??= vi.fn()
  return {
    authOptions: {},
    auth: globalThis.__mockAuth__,
  }
})

// Mock de logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('GET /api/admission-calendar', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
    globalThis.__mockAuth__.mockResolvedValue({ user: { email: 'test@example.com' } })
  })

  describe('Autenticación', () => {
    it('debe retornar 401 si no está autenticado', async () => {
      globalThis.__mockAuth__.mockResolvedValue(null)

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 401, 'No autorizado')
    })

    it('debe permitir acceso si está autenticado', async () => {
      globalThis.__mockAuth__.mockResolvedValue({ user: { email: 'test@example.com' } })
      setupAdmissionCalendarMocks([createAdmissionCalendarPrisma()])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Obtener todos los eventos (default)', () => {
    it('debe retornar todos los eventos del proceso por defecto', async () => {
      const eventos = createMultipleEventos(3, { proceso: '2026' })
      setupAdmissionCalendarMocks(eventos.map(e => createAdmissionCalendarPrisma(e)))

      const request = createTestRequest({ queryParams: { proceso: '2026' } })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      assertResponseHasFields(data, ['eventos'])
      assertResponseArray(data.eventos, 3)

      expect(prisma.admissionCalendar.findMany).toHaveBeenCalledWith({
        where: { proceso: '2026' },
        orderBy: { fecha: 'asc' },
      })
    })

    it('debe usar proceso "2026" por defecto si no se especifica', async () => {
      setupAdmissionCalendarMocks([createAdmissionCalendarPrisma()])

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.admissionCalendar.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { proceso: '2026' },
        })
      )
    })

    it('debe retornar array vacío si no hay eventos', async () => {
      setupAdmissionCalendarMocks([])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      assertResponseArray(data.eventos, 0)
    })
  })

  describe('Obtener próximos eventos (tipo=proximos)', () => {
    it('debe retornar próximos eventos con límite por defecto', async () => {
      const ahora = new Date()
      const eventosFuturos = [
        createAdmissionCalendarPrisma({
          fecha: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000), // Mañana
        }),
        createAdmissionCalendarPrisma({
          fecha: new Date(ahora.getTime() + 2 * 24 * 60 * 60 * 1000), // Pasado mañana
        }),
      ]
      setupAdmissionCalendarMocks(eventosFuturos)

      const request = createTestRequest({
        queryParams: { tipo: 'proximos', proceso: '2026' },
      })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      assertResponseArray(data.eventos, 2)

      expect(prisma.admissionCalendar.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            proceso: '2026',
            fecha: { gte: expect.any(Date) },
          },
          take: 5, // Límite por defecto
        })
      )
    })

    it('debe respetar el límite especificado', async () => {
      const ahora = new Date()
      const eventosFuturos = Array.from({ length: 10 }, (_, i) =>
        createAdmissionCalendarPrisma({
          fecha: new Date(ahora.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
        })
      )
      setupAdmissionCalendarMocks(eventosFuturos)

      const request = createTestRequest({
        queryParams: { tipo: 'proximos', proceso: '2026', limite: '3' },
      })
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.admissionCalendar.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
        })
      )
    })

    it('debe retornar 400 si el límite es inválido (NaN)', async () => {
      const request = createTestRequest({
        queryParams: { tipo: 'proximos', limite: 'invalid' },
      })
      const response = await GET(request)

      await assertErrorResponse(response, 400, 'límite debe ser un número válido')
    })

    it('debe retornar 400 si el límite es menor a 1', async () => {
      const request = createTestRequest({
        queryParams: { tipo: 'proximos', limite: '0' },
      })
      const response = await GET(request)

      await assertErrorResponse(response, 400, 'límite debe ser un número válido')
    })

    it('debe retornar 400 si el límite es negativo', async () => {
      const request = createTestRequest({
        queryParams: { tipo: 'proximos', limite: '-5' },
      })
      const response = await GET(request)

      await assertErrorResponse(response, 400, 'límite debe ser un número válido')
    })

    it('debe filtrar solo eventos futuros', async () => {
      const ahora = new Date()
      const eventos = [
        createAdmissionCalendarPrisma({
          fecha: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000), // Ayer (no debe aparecer)
        }),
        createAdmissionCalendarPrisma({
          fecha: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000), // Mañana (debe aparecer)
        }),
      ]
      setupAdmissionCalendarMocks([eventos[1]]) // Solo el futuro

      const request = createTestRequest({
        queryParams: { tipo: 'proximos', proceso: '2026' },
      })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      expect(data.eventos).toHaveLength(1)
    })
  })

  describe('Obtener eventos importantes (tipo=importantes)', () => {
    it('debe retornar solo eventos importantes futuros', async () => {
      const ahora = new Date()
      const eventos = [
        createAdmissionCalendarPrisma({
          importante: true,
          fecha: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000),
        }),
        createAdmissionCalendarPrisma({
          importante: false,
          fecha: new Date(ahora.getTime() + 2 * 24 * 60 * 60 * 1000),
        }),
      ]
      setupAdmissionCalendarMocks([eventos[0]]) // Solo el importante

      const request = createTestRequest({
        queryParams: { tipo: 'importantes', proceso: '2026' },
      })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      assertResponseArray(data.eventos, 1)

      expect(prisma.admissionCalendar.findMany).toHaveBeenCalledWith({
        where: {
          proceso: '2026',
          importante: true,
          fecha: { gte: expect.any(Date) },
        },
        orderBy: { fecha: 'asc' },
      })
    })

    it('debe retornar array vacío si no hay eventos importantes', async () => {
      setupAdmissionCalendarMocks([])

      const request = createTestRequest({
        queryParams: { tipo: 'importantes', proceso: '2026' },
      })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      assertResponseArray(data.eventos, 0)
    })
  })

  describe('Obtener próximo evento importante (tipo=proximo)', () => {
    it('debe retornar el próximo evento importante', async () => {
      const ahora = new Date()
      const proximoEvento = createAdmissionCalendarPrisma({
        importante: true,
        fecha: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000),
        titulo: 'Próximo Evento Importante',
      })
      setupAdmissionCalendarMocks([proximoEvento])

      const request = createTestRequest({
        queryParams: { tipo: 'proximo', proceso: '2026' },
      })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ evento: unknown }>(response)
      assertResponseHasFields(data, ['evento'])
      expect((data.evento as { titulo: string }).titulo).toBe('Próximo Evento Importante')
    })

    it('debe retornar null si no hay próximo evento importante', async () => {
      setupAdmissionCalendarMocks([])

      const request = createTestRequest({
        queryParams: { tipo: 'proximo', proceso: '2026' },
      })
      const response = await GET(request)

      const data = await assertSuccessResponse<{ evento: null }>(response)
      expect(data.evento).toBeNull()
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores de base de datos correctamente', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockRejectedValue(
        new Error('Database error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      await assertErrorResponse(response, 500, 'Error al obtener calendario')
    })

    it('debe manejar errores inesperados correctamente', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockRejectedValue(
        new Error('Unexpected error')
      )

      const request = createTestRequest()
      const response = await GET(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('Casos borde', () => {
    it('debe manejar proceso con valor vacío', async () => {
      setupAdmissionCalendarMocks([])

      const request = createTestRequest({ queryParams: { proceso: '' } })
      const response = await GET(request)

      // Debe usar el default '2026'
      expect(response.status).toBe(200)
    })

    it('debe manejar tipo desconocido usando default', async () => {
      setupAdmissionCalendarMocks([createAdmissionCalendarPrisma()])

      const request = createTestRequest({
        queryParams: { tipo: 'desconocido', proceso: '2026' },
      })
      const response = await GET(request)

      // Debe usar el default (todos los eventos)
      expect(response.status).toBe(200)
      const data = await assertSuccessResponse<{ eventos: unknown[] }>(response)
      assertResponseHasFields(data, ['eventos'])
    })

    it('debe manejar límite muy grande', async () => {
      const request = createTestRequest({
        queryParams: { tipo: 'proximos', limite: '999999' },
      })
      const response = await GET(request)

      // Debe aceptar el límite (aunque sea grande)
      expect(response.status).toBe(200)
    })
  })

  describe('Validación de estructura de respuesta', () => {
    it('debe retornar estructura correcta para eventos', async () => {
      const evento = createAdmissionCalendarPrisma({
        id: TEST_IDS.EVENT_1,
        titulo: 'Test Event',
        tipo: 'postulacion',
        importante: true,
      })
      setupAdmissionCalendarMocks([evento])

      const request = createTestRequest()
      const response = await GET(request)

      const data = await assertSuccessResponse<{ eventos: Array<EventoCalendario> }>(response)
      expect(data.eventos[0]).toMatchObject({
        id: TEST_IDS.EVENT_1,
        titulo: 'Test Event',
        tipo: 'postulacion',
        importante: true,
      })
      expect(data.eventos[0]).toHaveProperty('fecha')
      expect(data.eventos[0]).toHaveProperty('proceso')
    })
  })
})

