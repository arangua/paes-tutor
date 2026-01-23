/**
 * Error Handling Enterprise
 * 
 * Sistema de manejo de errores enterprise con:
 * - Taxonomía única de errores
 * - Separación estricta (contrato, dominio, sistema)
 * - Mapeo consistente a HTTP
 * - Integración con observabilidad
 */

// Error types
export {
  AppError,
  ContractError,
  DomainError,
  SystemError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  type ErrorCategory,
} from './error-types'

// Error handler
export {
  handleError,
  withErrorHandler,
  isErrorCategory,
  isContractError,
  isDomainError,
  isSystemError,
} from './error-handler'
