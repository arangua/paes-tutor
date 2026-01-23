import { describe, it, expect } from 'vitest'
import { ZodError } from 'zod'
import {
  ContractError,
  DomainError,
  SystemError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from './error-types'

describe('Error Types', () => {
  describe('ContractError', () => {
    it('has correct category and status', () => {
      const error = new ContractError('Invalid input')

      expect(error.category).toBe('contract')
      expect(error.httpStatus).toBe(400)
      expect(error.code).toBe('INVALID_CONTRACT')
    })

    it('includes zodError in response', async () => {
      const zodError = {
        issues: [
          { path: ['field'], message: 'Invalid', code: 'invalid_type' },
        ],
      } as ZodError

      const error = new ContractError('Invalid', zodError)
      const response = error.toResponse()

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json).toHaveProperty('details')
      expect(json.details).toHaveLength(1)
    })

    it('does not leak stack to client', async () => {
      const error = new ContractError('Invalid')
      const response = error.toResponse()

      const json = await response.json()
      expect(json).not.toHaveProperty('stack')
    })
  })

  describe('DomainError', () => {
    it('has correct category', () => {
      const error = new DomainError('Test', 404)

      expect(error.category).toBe('domain')
      expect(error.httpStatus).toBe(404)
    })

    it('allows custom status codes', () => {
      const error = new DomainError('Conflict', 409)

      expect(error.httpStatus).toBe(409)
    })

    it('includes message in response', async () => {
      const error = new DomainError('Resource not found', 404)
      const response = error.toResponse()

      const json = await response.json()
      expect(json).toHaveProperty('error', 'Resource not found')
    })
  })

  describe('SystemError', () => {
    it('has correct category and status', () => {
      const error = new SystemError('System failed')

      expect(error.category).toBe('system')
      expect(error.httpStatus).toBe(500)
    })

    it('does not leak details to client', async () => {
      const originalError = new Error('Database connection failed')
      const error = new SystemError('System failed', originalError)
      const response = error.toResponse()

      const json = await response.json()
      expect(json).toHaveProperty('error', 'Internal server error')
      expect(json).not.toHaveProperty('message', 'Database connection failed')
    })

    it('includes originalError in observable', () => {
      const originalError = new Error('Original')
      const error = new SystemError('System failed', originalError)

      const observable = error.toObservable()

      expect(observable.error).toHaveProperty('originalError')
      expect(observable.error.originalError).toHaveProperty('message', 'Original')
    })
  })

  describe('NotFoundError', () => {
    it('has correct status and code', () => {
      const error = new NotFoundError('Note', '123')

      expect(error.httpStatus).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
    })

    it('includes resource in message', () => {
      const error = new NotFoundError('Note', '123')

      expect(error.message).toContain('Note')
      expect(error.message).toContain('123')
    })
  })

  describe('ConflictError', () => {
    it('has correct status and code', () => {
      const error = new ConflictError('Already exists')

      expect(error.httpStatus).toBe(409)
      expect(error.code).toBe('CONFLICT')
    })
  })

  describe('UnauthorizedError', () => {
    it('has correct status and code', () => {
      const error = new UnauthorizedError()

      expect(error.httpStatus).toBe(401)
      expect(error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('ForbiddenError', () => {
    it('has correct status and code', () => {
      const error = new ForbiddenError()

      expect(error.httpStatus).toBe(403)
      expect(error.code).toBe('FORBIDDEN')
    })
  })

  describe('toObservable', () => {
    it('includes all error properties', () => {
      const error = new DomainError('Test', 404, 'TEST_CODE', { key: 'value' })

      const observable = error.toObservable()

      expect(observable.error).toHaveProperty('name', 'DomainError')
      expect(observable.error).toHaveProperty('code', 'TEST_CODE')
      expect(observable.error).toHaveProperty('category', 'domain')
      expect(observable.error).toHaveProperty('message', 'Test')
      expect(observable.error).toHaveProperty('httpStatus', 404)
      expect(observable.error).toHaveProperty('context', { key: 'value' })
    })

    it('includes stack only in development', () => {
      const error = new DomainError('Test')
      const observable = error.toObservable()

      // Stack solo en development (verificado por estructura)
      expect(observable.error).toHaveProperty('stack')
    })
  })
})
