/**
 * Tests Enterprise para admission-calendar.ts
 * 
 * Tests de robustez y regresión para funciones del calendario de admisión.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  obtenerEventosCalendario,
  obtenerProximosEventos,
  obtenerEventosImportantes,
  obtenerProximoEventoImportante,
  diasHastaEvento,
  type EventoCalendario,
  type TipoEvento,
} from './admission-calendar'
// Mock de Prisma
// ✅ Enterprise: Crear el mock dentro del factory para evitar problemas de hoisting
vi.mock('@/lib/prisma', () => ({
  prisma: {
    admissionCalendar: {
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

// Mock de validation-utils
vi.mock('@/app/api/notes/versions/validation-utils', () => ({
  safeDivide: vi.fn((dividend: number, divisor: number, fallback: number) => {
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
  ensureInteger: vi.fn((value: number, fallback: number) => {
    if (Number.isInteger(value) && Number.isFinite(value)) {
      return value
    }
    return fallback
  }),
}))

describe('admission-calendar.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('obtenerEventosCalendario', () => {
    it('debe retornar todos los eventos del proceso', async () => {
      const mockEventos = [
        {
          id: 'event-1',
          proceso: '2026',
          fecha: new Date('2026-01-15'),
          hora: '08:00',
          titulo: 'Evento 1',
          descripcion: 'Descripción 1',
          tipo: 'postulacion',
          importante: true,
        },
        {
          id: 'event-2',
          proceso: '2026',
          fecha: new Date('2026-02-15'),
          hora: null,
          titulo: 'Evento 2',
          descripcion: null,
          tipo: 'aplicacion',
          importante: false,
        },
      ]

      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

      const eventos = await obtenerEventosCalendario('2026')

      expect(eventos).toHaveLength(2)
      expect(eventos[0]).toMatchObject({
        id: 'event-1',
        proceso: '2026',
        titulo: 'Evento 1',
        tipo: 'postulacion',
        importante: true,
      })
      expect(eventos[0].hora).toBe('08:00')
      expect(eventos[0].descripcion).toBe('Descripción 1')
      expect(eventos[1].hora).toBeUndefined()
      expect(eventos[1].descripcion).toBeUndefined()

      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith({
        where: { proceso: '2026' },
        orderBy: { fecha: 'asc' },
      })
    })

    it('debe usar proceso "2026" por defecto', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue([])

      await obtenerEventosCalendario()

      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith({
        where: { proceso: '2026' },
        orderBy: { fecha: 'asc' },
      })
    })

    it('debe retornar array vacío si no hay eventos', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue([])

      const eventos = await obtenerEventosCalendario('2026')

      expect(eventos).toEqual([])
    })

    it('debe manejar errores de base de datos', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockRejectedValue(
        new Error('Database error')
      )

      await expect(obtenerEventosCalendario('2026')).rejects.toThrow('Database error')
    })

    it('debe ordenar eventos por fecha ascendente', async () => {
      const mockEventos = [
        {
          id: 'event-2',
          proceso: '2026',
          fecha: new Date('2026-02-15'),
          hora: null,
          titulo: 'Evento 2',
          descripcion: null,
          tipo: 'aplicacion',
          importante: false,
        },
        {
          id: 'event-1',
          proceso: '2026',
          fecha: new Date('2026-01-15'),
          hora: null,
          titulo: 'Evento 1',
          descripcion: null,
          tipo: 'postulacion',
          importante: false,
        },
      ]

      // Mock que simula el ordenamiento de Prisma
      vi.mocked(prisma.admissionCalendar.findMany).mockImplementation(async (args: any) => {
        const eventos = [...mockEventos]
        // Si hay orderBy, ordenar los resultados
        if (args?.orderBy?.fecha === 'asc') {
          eventos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
        } else if (args?.orderBy?.fecha === 'desc') {
          eventos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
        }
        return eventos as any
      })

      const eventos = await obtenerEventosCalendario('2026')

      // Debe estar ordenado por fecha ascendente (event-1 primero, luego event-2)
      expect(eventos[0].id).toBe('event-1')
      expect(eventos[0].fecha.getTime()).toBeLessThanOrEqual(eventos[1].fecha.getTime())
      expect(eventos[1].id).toBe('event-2')
    })
  })

  describe('obtenerProximosEventos', () => {
    it('debe retornar solo eventos futuros', async () => {
      const ahora = new Date()
      const futuro = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)

      const mockEventos = [
        {
          id: 'event-1',
          proceso: '2026',
          fecha: futuro,
          hora: '08:00',
          titulo: 'Evento Futuro',
          descripcion: null,
          tipo: 'postulacion',
          importante: false,
        },
      ]

      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

      const eventos = await obtenerProximosEventos('2026', 5)

      expect(eventos).toHaveLength(1)
      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith({
        where: {
          proceso: '2026',
          fecha: { gte: expect.any(Date) },
        },
        orderBy: { fecha: 'asc' },
        take: 5,
      })
    })

    it('debe respetar el límite especificado', async () => {
      const ahora = new Date()
      const mockEventos = Array.from({ length: 3 }, (_, i) => ({
        id: `event-${i}`,
        proceso: '2026',
        fecha: new Date(ahora.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
        hora: null,
        titulo: `Evento ${i}`,
        descripcion: null,
        tipo: 'otro' as TipoEvento,
        importante: false,
      }))

      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

      const eventos = await obtenerProximosEventos('2026', 3)

      expect(eventos).toHaveLength(3)
      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
        })
      )
    })

    it('debe usar límite 5 por defecto', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue([])

      await obtenerProximosEventos('2026')

      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        })
      )
    })

    it('debe usar proceso "2026" por defecto', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue([])

      await obtenerProximosEventos()

      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            proceso: '2026',
          }),
        })
      )
    })
  })

  describe('obtenerEventosImportantes', () => {
    it('debe retornar solo eventos importantes futuros', async () => {
      const ahora = new Date()
      const futuro = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)

      const mockEventos = [
        {
          id: 'event-1',
          proceso: '2026',
          fecha: futuro,
          hora: '08:00',
          titulo: 'Evento Importante',
          descripcion: null,
          tipo: 'postulacion',
          importante: true,
        },
      ]

      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

      const eventos = await obtenerEventosImportantes('2026')

      expect(eventos).toHaveLength(1)
      expect(eventos[0].importante).toBe(true)
      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith({
        where: {
          proceso: '2026',
          importante: true,
          fecha: { gte: expect.any(Date) },
        },
        orderBy: { fecha: 'asc' },
      })
    })

    it('debe usar proceso "2026" por defecto', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue([])

      await obtenerEventosImportantes()

      expect(vi.mocked(prisma.admissionCalendar.findMany)).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            proceso: '2026',
          }),
        })
      )
    })
  })

  describe('obtenerProximoEventoImportante', () => {
    it('debe retornar el primer evento importante', async () => {
      const ahora = new Date()
      const futuro = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)

      const mockEventos = [
        {
          id: 'event-1',
          proceso: '2026',
          fecha: futuro,
          hora: '08:00',
          titulo: 'Próximo Evento',
          descripcion: null,
          tipo: 'postulacion',
          importante: true,
        },
      ]

      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

      const evento = await obtenerProximoEventoImportante('2026')

      expect(evento).not.toBeNull()
      expect(evento?.titulo).toBe('Próximo Evento')
    })

    it('debe retornar null si no hay eventos importantes', async () => {
      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue([])

      const evento = await obtenerProximoEventoImportante('2026')

      expect(evento).toBeNull()
    })
  })

  describe('diasHastaEvento', () => {
    it('debe calcular días correctamente para evento futuro', () => {
      const ahora = new Date()
      const fechaFutura = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 días

      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: fechaFutura,
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      const dias = diasHastaEvento(evento)

      // Debe ser aproximadamente 7 días (puede variar por horas)
      expect(dias).toBeGreaterThanOrEqual(6)
      expect(dias).toBeLessThanOrEqual(8)
    })

    it('debe retornar 0 para evento pasado', () => {
      const ahora = new Date()
      const fechaPasada = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 días atrás

      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: fechaPasada,
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      const dias = diasHastaEvento(evento)

      expect(dias).toBe(0)
    })

    it('debe retornar 0 para evento hoy', () => {
      const ahora = new Date()
      ahora.setHours(0, 0, 0, 0)

      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: ahora,
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      const dias = diasHastaEvento(evento)

      expect(dias).toBe(0)
    })

    it('debe manejar fecha inválida (NaN)', () => {
      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: new Date('invalid'),
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      const dias = diasHastaEvento(evento)

      expect(dias).toBe(0)
    })

    it('debe manejar fecha con valor Infinity', () => {
      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: new Date(Infinity),
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      const dias = diasHastaEvento(evento)

      expect(dias).toBe(0)
    })

    it('debe resetear horas para comparar solo fechas', () => {
      const ahora = new Date()
      ahora.setHours(10, 30, 0, 0) // 10:30 AM

      const fechaFutura = new Date(ahora)
      fechaFutura.setDate(fechaFutura.getDate() + 1)
      fechaFutura.setHours(8, 0, 0, 0) // 8:00 AM del día siguiente

      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: fechaFutura,
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      const dias = diasHastaEvento(evento)

      // Debe ser 1 día (independiente de las horas)
      expect(dias).toBe(1)
    })

    it('debe retornar 0 si la diferencia no es finita', () => {
      const evento: EventoCalendario = {
        id: 'event-1',
        proceso: '2026',
        fecha: new Date(),
        titulo: 'Test Event',
        tipo: 'otro',
        importante: false,
      }

      // Mock de getTime para retornar Infinity
      const originalGetTime = Date.prototype.getTime
      Date.prototype.getTime = vi.fn(() => Infinity)

      const dias = diasHastaEvento(evento)

      expect(dias).toBe(0)

      // Restaurar
      Date.prototype.getTime = originalGetTime
    })
  })

  describe('Tests de regresión', () => {
    it('debe manejar eventos con todos los campos opcionales como null', async () => {
      const mockEventos = [
        {
          id: 'event-1',
          proceso: '2026',
          fecha: new Date('2026-01-15'),
          hora: null,
          titulo: 'Evento',
          descripcion: null,
          tipo: 'otro',
          importante: false,
        },
      ]

      vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

      const eventos = await obtenerEventosCalendario('2026')

      expect(eventos[0].hora).toBeUndefined()
      expect(eventos[0].descripcion).toBeUndefined()
    })

    it('debe manejar tipos de evento válidos correctamente', async () => {
      const tipos: TipoEvento[] = ['resultados', 'postulacion', 'aplicacion', 'inscripcion', 'otro']

      for (const tipo of tipos) {
        const mockEventos = [
          {
            id: 'event-1',
            proceso: '2026',
            fecha: new Date('2026-01-15'),
            hora: null,
            titulo: 'Evento',
            descripcion: null,
            tipo,
            importante: false,
          },
        ]

        vi.mocked(prisma.admissionCalendar.findMany).mockResolvedValue(mockEventos as any)

        const eventos = await obtenerEventosCalendario('2026')

        expect(eventos[0].tipo).toBe(tipo)
      }
    })
  })
})

