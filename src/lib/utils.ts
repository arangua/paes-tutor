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
  let dateTime: number
  
  if (date instanceof Date) {
    dateTime = date.getTime()
  } else if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date)
    dateTime = parsedDate.getTime()
  } else {
    return 'fecha inválida'
  }
  
  // ✅ Enterprise: Validar que las fechas sean válidas
  if (!Number.isFinite(now) || !Number.isFinite(dateTime) || Number.isNaN(dateTime)) {
    return 'fecha inválida'
  }
  
  const diffMs = now - dateTime
  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return 'hace unos segundos'
  }
  
  // ✅ Enterprise: Usar funciones seguras para cálculos
  const diffInSeconds = ensureInteger(safeDivide(diffMs, 1000, 0), 0)
  
  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) {
    const minutes = ensureInteger(safeDivide(diffInSeconds, 60, 0), 0)
    return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`
  }
  if (diffInSeconds < 86400) {
    const hours = ensureInteger(safeDivide(diffInSeconds, 3600, 0), 0)
    return `hace ${hours} hora${hours !== 1 ? 's' : ''}`
  }
  const days = ensureInteger(safeDivide(diffInSeconds, 86400, 0), 0)
  if (days < 30) {
    return `hace ${days} día${days !== 1 ? 's' : ''}`
  }
  const months = ensureInteger(safeDivide(days, 30, 0), 0)
  if (months < 12) {
    return `hace ${months} mes${months !== 1 ? 'es' : ''}`
  }
  const years = ensureInteger(safeDivide(months, 12, 0), 0)
  return `hace ${years} año${years !== 1 ? 's' : ''}`
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
