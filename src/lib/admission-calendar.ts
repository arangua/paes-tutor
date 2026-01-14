/**
 * Utilidades para el calendario del proceso de admisión
 * Basado en fechas oficiales de DEMRE
 */

import { prisma } from '@/lib/prisma'
import { safeDivide, ensureInteger } from '@/app/api/notes/versions/validation-utils'

export type TipoEvento =
  | 'resultados'
  | 'postulacion'
  | 'aplicacion'
  | 'inscripcion'
  | 'otro'

export interface EventoCalendario {
  id: string
  proceso: string
  fecha: Date
  hora?: string
  titulo: string
  descripcion?: string
  tipo: TipoEvento
  importante: boolean
}

/**
 * Obtiene todos los eventos del calendario para un proceso
 */
export async function obtenerEventosCalendario(
  proceso: string = '2026'
): Promise<EventoCalendario[]> {
  const eventos = await prisma.admissionCalendar.findMany({
    where: {
      proceso,
    },
    orderBy: {
      fecha: 'asc',
    },
  })

  return eventos.map((e) => ({
    id: e.id,
    proceso: e.proceso,
    fecha: e.fecha,
    hora: e.hora ?? undefined,
    titulo: e.titulo,
    descripcion: e.descripcion ?? undefined,
    tipo: e.tipo as TipoEvento,
    importante: e.importante,
  }))
}

/**
 * Obtiene los próximos eventos importantes
 */
export async function obtenerProximosEventos(
  proceso: string = '2026',
  limite: number = 5
): Promise<EventoCalendario[]> {
  const ahora = new Date()

  const eventos = await prisma.admissionCalendar.findMany({
    where: {
      proceso,
      fecha: {
        gte: ahora,
      },
    },
    orderBy: {
      fecha: 'asc',
    },
    take: limite,
  })

  return eventos.map((e) => ({
    id: e.id,
    proceso: e.proceso,
    fecha: e.fecha,
    hora: e.hora ?? undefined,
    titulo: e.titulo,
    descripcion: e.descripcion ?? undefined,
    tipo: e.tipo as TipoEvento,
    importante: e.importante,
  }))
}

/**
 * Obtiene eventos importantes próximos
 */
export async function obtenerEventosImportantes(
  proceso: string = '2026'
): Promise<EventoCalendario[]> {
  const ahora = new Date()

  const eventos = await prisma.admissionCalendar.findMany({
    where: {
      proceso,
      importante: true,
      fecha: {
        gte: ahora,
      },
    },
    orderBy: {
      fecha: 'asc',
    },
  })

  return eventos.map((e) => ({
    id: e.id,
    proceso: e.proceso,
    fecha: e.fecha,
    hora: e.hora ?? undefined,
    titulo: e.titulo,
    descripcion: e.descripcion ?? undefined,
    tipo: e.tipo as TipoEvento,
    importante: e.importante,
  }))
}

/**
 * Calcula días hasta un evento específico
 */
/**
 * ✅ Enterprise: Calcula días hasta evento usando funciones seguras
 */
export function diasHastaEvento(evento: EventoCalendario): number {
  const ahora = new Date()
  const fechaEvento = new Date(evento.fecha)

  // ✅ Enterprise: Validar que las fechas sean válidas
  if (!Number.isFinite(ahora.getTime()) || !Number.isFinite(fechaEvento.getTime()) || Number.isNaN(fechaEvento.getTime())) {
    return 0
  }

  // Resetear horas para comparar solo fechas
  ahora.setHours(0, 0, 0, 0)
  fechaEvento.setHours(0, 0, 0, 0)

  const diferencia = fechaEvento.getTime() - ahora.getTime()
  if (!Number.isFinite(diferencia)) {
    return 0
  }

  // ✅ Enterprise: Usar funciones seguras para cálculos
  const dias = ensureInteger(Math.ceil(safeDivide(diferencia, 1000 * 60 * 60 * 24, 0)), 0)

  return Math.max(0, dias) // Asegurar que no sea negativo
}

/**
 * Obtiene el próximo evento importante
 */
export async function obtenerProximoEventoImportante(
  proceso: string = '2026'
): Promise<EventoCalendario | null> {
  const eventos = await obtenerEventosImportantes(proceso)
  return eventos.length > 0 ? eventos[0] : null
}

