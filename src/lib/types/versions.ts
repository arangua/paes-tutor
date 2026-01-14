import { Prisma } from '@prisma/client'

/**
 * Versión de nota con todos sus campos (incluyendo campos opcionales del schema)
 * Extiende el tipo base de Prisma para incluir campos que pueden no estar en el tipo generado
 */
export type StudyNoteVersion = Prisma.StudyNoteVersionGetPayload<{ select: Record<string, never> }> & {
  name?: string | null
  color?: string | null
  isImportant?: boolean
  isCompressed?: boolean
  comment?: string | null
}

/**
 * Versión de nota con metadatos extendidos (para uso interno)
 */
export type StudyNoteVersionWithMetadata = StudyNoteVersion & {
  name: string | null
  color: string | null
  isImportant: boolean
  isCompressed: boolean
}

/**
 * Versión de nota con metadatos opcionales (para respuestas API)
 */
export interface VersionWithMetadata {
  id: string
  title: string
  content?: string
  tags: string | null
  name: string | null
  color: string | null
  isImportant: boolean
  isCompressed: boolean
  createdAt: Date
  createdBy: string
}

/**
 * Nota básica (solo campos esenciales)
 */
export interface NoteBasic {
  id: string
  title: string
  content: string
  tags: string | null
  studentId: string
  updatedAt: Date
}

/**
 * Nota completa (para operaciones que requieren todos los campos)
 */
export interface NoteFull {
  id: string
  title: string
  content: string
  tags: string | null
  studentId: string
  updatedAt: Date
}

/**
 * Estadísticas de versiones
 */
export interface VersionStatistics {
  totalVersions: number
  averageDaysBetweenVersions: number | null
  daysSinceLastUpdate: number
  lastUpdated: string
  importantVersions: number
  namedVersions: number
  totalRestores: number
}

/**
 * Información de paginación
 */
export interface PaginationInfo {
  hasMore: boolean
  nextCursor?: string
  limit: number
  offset: number
  total: number
}

/**
 * Respuesta completa de versiones
 */
export interface VersionsResponse {
  versions: VersionWithMetadata[]
  currentVersionId: string
  total: number
  statistics: VersionStatistics
  pagination: PaginationInfo
}

/**
 * Filtros para búsqueda de versiones
 */
export interface VersionFilters {
  cursor?: string
  search?: string
  isImportant?: boolean
  hasName?: boolean
  dateFrom?: Date
  dateTo?: Date
}

/**
 * Resultado de query de versiones
 */
export interface VersionQueryResult {
  versions: StudyNoteVersion[]
  hasMore: boolean
  nextCursor?: string
}

/**
 * Versión con ranking (para búsqueda full-text)
 */
export interface VersionWithRank extends StudyNoteVersion {
  rank?: number
}

/**
 * Condiciones WHERE para PostgreSQL
 */
export interface PostgresWhereConditions {
  whereConditions: string[]
  params: unknown[]
  paramIndex: number
}

/**
 * Parámetros para actualización de metadata de versión
 */
export interface VersionUpdateParams {
  name?: string | null
  color?: string | null
  isImportant?: boolean
}

/**
 * Filtros adicionales para búsqueda (usado internamente)
 */
export interface AdditionalSearchFilters {
  cursor?: string
  isImportant?: boolean
  hasName?: boolean
  dateFrom?: Date
  dateTo?: Date
}

