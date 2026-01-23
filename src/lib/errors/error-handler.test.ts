import { describe, it, expect } from 'vitest'
import { NextResponse } from 'next/server'
import {
  ContractError,
  DomainError,
  SystemError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from './error-types'
import {
  handleError,
  withErrorHandler,
  isContractError,
  isDomainError,
  isSystemError,
} from './error-handler'

describe('Error Handler', () => {
  describe('handleError', () => {
    it('handles ContractError correctly', async () => {
      const error = new ContractError('Invalid input', undefined, 'INVALID_CONTRACT')
      const response = handleError(error)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json).toHaveProperty('error', 'Invalid request contract')
      expect(json).toHaveProperty('code', 'INVALID_CONTRACT')
    })

    it('handles DomainError correctly', async () => {
      const error = new DomainError('Resource not found', 404, 'NOT_FOUND')
      const response = handleError(error)

      expect(response.status).toBe(404)
      const json = await response.json()
      expect(json).toHaveProperty('error', 'Resource not found')
      expect(json).toHaveProperty('code', 'NOT_FOUND')
    })

    it('handles SystemError correctly', async () => {
      const error = new SystemError('Database connection failed')
      const response = handleError(error)

      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json).toHaveProperty('error', 'Internal server error')
      expect(json).toHaveProperty('code', 'SYSTEM_ERROR')
      // ⛔ No leak de detalles
      expect(json).not.toHaveProperty('message')
    })

    it('converts standard Error to SystemError', async () => {
      const error = new Error('Something went wrong')
      const response = handleError(error)

      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json).toHaveProperty('error', 'Internal server error')
    })

    it('converts unknown error to SystemError', async () => {
      const error = 'String error'
      const response = handleError(error)

      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json).toHaveProperty('error', 'Internal server error')
    })
  })

  describe('withErrorHandler', () => {
    it('returns handler result when no error', async () => {
      const handler = async () => NextResponse.json({ ok: true })
      const response = await withErrorHandler(handler)

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json).toEqual({ ok: true })
    })

    it('handles error in handler', async () => {
      const handler = async () => {
        throw new DomainError('Test error', 400, 'TEST_ERROR')
      }
      const response = await withErrorHandler(handler)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json).toHaveProperty('error', 'Test error')
    })

    it('never throws, always returns NextResponse', async () => {
      const handler = async () => {
        throw new Error('Unexpected error')
      }

      await expect(withErrorHandler(handler)).resolves.toBeInstanceOf(NextResponse)
    })
  })

  describe('error type checks', () => {
    it('isContractError returns true for ContractError', () => {
      const error = new ContractError('Invalid')
      expect(isContractError(error)).toBe(true)
    })

    it('isContractError returns false for other errors', () => {
      const error = new DomainError('Test')
      expect(isContractError(error)).toBe(false)
    })

    it('isDomainError returns true for DomainError', () => {
      const error = new DomainError('Test')
      expect(isDomainError(error)).toBe(true)
    })

    it('isSystemError returns true for SystemError', () => {
      const error = new SystemError('Test')
      expect(isSystemError(error)).toBe(true)
    })
  })

  describe('specific error types', () => {
    it('NotFoundError has correct status and code', async () => {
      const error = new NotFoundError('Note', '123')
      const response = handleError(error)

      expect(response.status).toBe(404)
      const json = await response.json()
      expect(json).toHaveProperty('code', 'NOT_FOUND')
      expect(json).toHaveProperty('error')
    })

    it('ConflictError has correct status and code', async () => {
      const error = new ConflictError('Resource already exists')
      const response = handleError(error)

      expect(response.status).toBe(409)
      const json = await response.json()
      expect(json).toHaveProperty('code', 'CONFLICT')
    })

    it('UnauthorizedError has correct status and code', async () => {
      const error = new UnauthorizedError()
      const response = handleError(error)

      expect(response.status).toBe(401)
      const json = await response.json()
      expect(json).toHaveProperty('code', 'UNAUTHORIZED')
    })

    it('ForbiddenError has correct status and code', async () => {
      const error = new ForbiddenError()
      const response = handleError(error)

      expect(response.status).toBe(403)
      const json = await response.json()
      expect(json).toHaveProperty('code', 'FORBIDDEN')
    })
  })

  describe('error observability', () => {
    it('ContractError includes zodError in observable', () => {
      const zodError = {
        errors: [{ path: ['field'], message: 'Invalid', code: 'invalid_type' }],
      } as any
      const error = new ContractError('Invalid', zodError)

      const observable = error.toObservable()

      expect(observable.error).toHaveProperty('category', 'contract')
      expect(observable.error).toHaveProperty('code', 'INVALID_CONTRACT')
      expect(observable.error).toHaveProperty('httpStatus', 400)
    })

    it('SystemError includes originalError in observable', () => {
      const originalError = new Error('Original')
      const error = new SystemError('System failed', originalError)

      const observable = error.toObservable()

      expect(observable.error).toHaveProperty('originalError')
      expect(observable.error.originalError).toHaveProperty('name', 'Error')
      expect(observable.error.originalError).toHaveProperty('message', 'Original')
    })
  })
})
