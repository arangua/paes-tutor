import { NextResponse } from 'next/server'

/**
 * Tipo estándar para resultados de operaciones que pueden fallar
 * Usado consistentemente en toda la API de versiones
 * 
 * Patrón de tipo discriminado que permite manejo seguro de errores
 * sin necesidad de excepciones o valores null/undefined.
 * 
 * @template T - Tipo de los datos cuando la operación es exitosa
 * 
 * @example
 * ```typescript
 * const result: Result<string> = await someOperation()
 * 
 * if (result.success) {
 *   // TypeScript sabe que result.data existe aquí
 *   console.log(result.data) // string
 * } else {
 *   // TypeScript sabe que result.error existe aquí
 *   return result.error // NextResponse
 * }
 * ```
 */
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: NextResponse }

/**
 * Tipo para métricas de performance
 */
export interface PerformanceMetrics {
  totalDuration: number
  alerts?: string[]
  [key: string]: number | string[] | undefined
}

/**
 * Tipo para contexto de autenticación con métricas
 * 
 * Contiene el usuario autenticado con su estudiante asociado (garantizado no-null)
 * y métricas de performance de la autenticación.
 * 
 * @example
 * ```typescript
 * const authContext: AuthContext = {
 *   user: {
 *     id: 'user_123',
 *     email: 'user@example.com',
 *     student: {
 *       id: 'student_456',
 *       // ... otros campos del estudiante
 *     }
 *   },
 *   metrics: {
 *     authDuration: 45, // ms
 *   }
 * }
 * ```
 */
export interface AuthContext {
  /** Usuario autenticado con estudiante garantizado (no-null) */
  user: Awaited<ReturnType<typeof import('@/lib/get-session').getAuthenticatedUserWithStudent>> & {
    student: NonNullable<Awaited<ReturnType<typeof import('@/lib/get-session').getAuthenticatedUserWithStudent>>['student']>
  }
  /** Métricas de performance de la autenticación y otras operaciones */
  metrics: {
    /** Duración de la autenticación en milisegundos */
    authDuration: number
    /** Otras métricas opcionales (ej: queryDuration, cacheDuration) */
    [key: string]: number
  }
}

/**
 * Tipos para request bodies
 */
export interface RestoreVersionRequest {
  noteId: string
  versionId: string
}

export interface UpdateVersionMetadataRequest {
  noteId: string
  versionId: string
  name?: string | null
  color?: string | null
  isImportant?: boolean
}

export interface DeleteVersionRequest {
  noteId: string
  versionId: string
}

export interface DeleteVersionsBulkRequest {
  noteId: string
  versionIds: string[]
}

/**
 * Tipos para responses
 */
export interface VersionResponse {
  id: string
  title: string
  content: string
  tags: string | null
  name: string | null
  color: string | null
  isImportant: boolean
  createdAt: string
  updatedAt: string
}

export interface VersionsResponse {
  versions: VersionResponse[]
  currentVersionId: string
  total: number
  statistics: {
    totalVersions: number
    averageDaysBetweenVersions: number
    daysSinceLastUpdate: number
    lastUpdated: string
    importantCount: number
    namedCount: number
    totalRestores: number
  }
  pagination: {
    hasMore: boolean
    nextCursor?: string
    limit: number
    offset: number
    total: number
  }
}

export interface StudyNoteWithRelations {
  id: string
  title: string
  content: string
  tags: string | null
  createdAt: Date
  updatedAt: Date
  question?: {
    id: string
    subject?: {
      nombre: string
    } | null
  } | null
  topic?: {
    id: string
    subject?: {
      nombre: string
    } | null
  } | null
}

export interface RestoreVersionResponse {
  message: string
  note: StudyNoteWithRelations
}

export interface UpdateVersionResponse {
  message: string
  version: VersionResponse
}

export interface DeleteVersionResponse {
  message: string
}

/**
 * Tipo para nota mínima usada en operaciones de eliminación
 * 
 * Contiene solo los campos necesarios para identificar y registrar
 * la eliminación de versiones, sin necesidad de cargar toda la nota.
 * 
 * @example
 * ```typescript
 * const note: NoteForDeletion = {
 *   id: 'c123456789012345678901234',
 *   title: 'Nota de ejemplo'
 * }
 * ```
 */
export interface NoteForDeletion {
  /** ID único de la nota (formato CUID) */
  id: string
  /** Título de la nota para logging y auditoría */
  title: string
}

