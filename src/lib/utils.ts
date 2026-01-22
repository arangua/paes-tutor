import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ensureFiniteNumber, ensureInteger, safeDivide } from './utils/validation-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ✅ Enterprise: Utilidades seguras para formateo de tiempo y fechas
 * Estas funciones son seguras para usar en componentes frontend
 */

/**
 * Formatea una duración en segundos a formato legible (MMm SSs)
 * 
 * @param seconds - Duración en segundos (puede ser null/undefined)
 * @returns String formateado o 'N/A' si es inválido
 * 
 * @example
 * ```typescript
 * formatDuration(125) // "2m 5s"
 * formatDuration(null) // "N/A"
 * ```
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) {
    return 'N/A'
  }
  
  const safeSeconds = ensureFiniteNumber(seconds, 0)
  if (safeSeconds < 60) {
    return `${safeSeconds}s`
  }
  
  // ✅ Enterprise: Usar funciones seguras para cálculos
  const mins = ensureInteger(safeDivide(safeSeconds, 60, 0), 0)
  const secs = ensureInteger(safeSeconds % 60, 0)
  return `${mins}m ${secs}s`
}

// Helpers para reducir complejidad cognitiva de formatTimeAgo
type DateInput = Date | string | number

function parseToTimestamp(date: DateInput): number | null {
  if (date instanceof Date) return date.getTime()

  const parsed = new Date(date)
  const ts = parsed.getTime()
  return Number.isFinite(ts) && !Number.isNaN(ts) ? ts : null
}

function pluralize(value: number, singular: string, plural: string): string {
  return value === 1 ? singular : plural
}

function formatUnit(value: number, singular: string, plural: string): string {
  return `hace ${value} ${pluralize(value, singular, plural)}`
}

type TimeUnit = { threshold: number; seconds: number; singular: string; plural: string }

const TIME_UNITS: TimeUnit[] = [
  { threshold: 60, seconds: 1, singular: 'segundo', plural: 'segundos' }, // no se usa directo (manejamos "unos segundos")
  { threshold: 3600, seconds: 60, singular: 'minuto', plural: 'minutos' },
  { threshold: 86400, seconds: 3600, singular: 'hora', plural: 'horas' },
  { threshold: 2592000, seconds: 86400, singular: 'día', plural: 'días' }, // 30 días
  { threshold: 31536000, seconds: 2592000, singular: 'mes', plural: 'meses' }, // 12 meses
  { threshold: Number.POSITIVE_INFINITY, seconds: 31536000, singular: 'año', plural: 'años' },
]

/**
 * Formatea una fecha a tiempo relativo (hace X tiempo)
 * 
 * @param date - Fecha a formatear
 * @returns String con tiempo relativo
 * 
 * @example
 * ```typescript
 * formatTimeAgo(new Date(Date.now() - 3600000)) // "hace 1 hora"
 * ```
 */
export function formatTimeAgo(date: Date | string | number): string {
  const now = Date.now()
  const dateTime = parseToTimestamp(date)

  if (!Number.isFinite(now) || dateTime === null) return 'fecha inválida'

  const diffMs = now - dateTime
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'hace unos segundos'

  const diffInSeconds = ensureInteger(safeDivide(diffMs, 1000, 0), 0)
  if (diffInSeconds < 60) return 'hace unos segundos'

  for (const unit of TIME_UNITS) {
    if (diffInSeconds < unit.threshold) {
      const value = ensureInteger(safeDivide(diffInSeconds, unit.seconds, 0), 0)

      if (unit.singular === 'mes') return formatUnit(value, 'mes', 'meses')
      // "años" ya viene en plural correcto
      return formatUnit(value, unit.singular, unit.plural)
    }
  }

  // Por construcción, nunca llega aquí.
  return 'hace unos segundos'
}

/**
 * Calcula días desde una fecha hasta ahora
 * 
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin (opcional, por defecto ahora)
 * @returns Número de días o 0 si es inválido
 * 
 * @example
 * ```typescript
 * calculateDaysSince(new Date('2024-01-01')) // 365 (aproximadamente)
 * ```
 */
export function calculateDaysSince(
  startDate: Date | string | number,
  endDate: Date | number = Date.now()
): number {
  let startTime: number
  let endTime: number
  
  if (startDate instanceof Date) {
    startTime = startDate.getTime()
  } else if (typeof startDate === 'string' || typeof startDate === 'number') {
    const parsedDate = new Date(startDate)
    startTime = parsedDate.getTime()
  } else {
    return 0
  }
  
  if (endDate instanceof Date) {
    endTime = endDate.getTime()
  } else {
    endTime = ensureFiniteNumber(endDate, Date.now())
  }
  
  // ✅ Enterprise: Validar que las fechas sean válidas
  if (!Number.isFinite(startTime) || Number.isNaN(startTime) || !Number.isFinite(endTime)) {
    return 0
  }
  
  const diffMs = endTime - startTime
  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return 0
  }
  
  // ✅ Enterprise: Usar funciones seguras para cálculos
  const days = ensureInteger(safeDivide(diffMs, 1000 * 60 * 60 * 24, 0), 0)
  return Math.max(0, days) // Asegurar que no sea negativo
}
