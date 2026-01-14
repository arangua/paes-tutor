/**
 * Contracts - Sistema de validación de contratos HTTP
 * 
 * Este módulo proporciona un patrón único y reutilizable para validar
 * todos los inputs que cruzan el borde HTTP (API Routes).
 * 
 * Arquitectura:
 * - Parsers: Extraen datos del request (FormData, JSON, params)
 * - Validators: Validan datos con schemas Zod
 * - Orquestador: validateRequest (punto único de validación)
 * 
 * Reglas:
 * - ✅ Un contrato por endpoint
 * - ✅ Validación antes de toda lógica
 * - ✅ Sin coerciones silenciosas
 * - ✅ Sin defaults implícitos
 * - ✅ Sin campos extra permitidos
 */

// Parsers
export { parseFormData } from './http/parseFormData'
export { parseJsonBody } from './http/parseJsonBody'
export { validateRouteParams } from './http/validateRouteParams'
export { validateQueryParams } from './http/validateQueryParams'

// Orquestador
export { validateRequest } from './validateRequest'

// Schemas (exportar según necesidad)
export * from './schemas/create-note.schema'
