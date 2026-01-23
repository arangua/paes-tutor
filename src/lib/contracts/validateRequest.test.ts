import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validateRequest, ContractValidationError } from './validateRequest'

describe('validateRequest', () => {
  const schema = z.object({ value: z.string() }).strict()

  describe('valid input', () => {
    it('returns validated data for valid input', () => {
      const input = { value: 'ok' }

      const result = validateRequest({ schema, input })

      expect(result).toEqual(input)
      expect(result.value).toBe('ok')
    })

    it('preserves type information', () => {
      const input = { value: 'test' }

      const result = validateRequest({ schema, input })

      // TypeScript type check (compile-time)
      // Runtime check
      expect(typeof result.value).toBe('string')
    })
  })

  describe('invalid input', () => {
    it('throws ContractValidationError for invalid input', () => {
      const input = { value: 123 }

      expect(() => validateRequest({ schema, input })).toThrow(
        ContractValidationError
      )
    })

    it('throws with "Invalid request contract" message', () => {
      const input = { value: 123 }

      expect(() => validateRequest({ schema, input })).toThrow(
        'Invalid request contract'
      )
    })

    it('includes zodError in ContractValidationError', () => {
      const input = { value: 123 }

      try {
        validateRequest({ schema, input })
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ContractValidationError)
        if (error instanceof ContractValidationError) {
          expect(error.zodError).toBeDefined()
          // Zod usa 'issues' no 'errors'
          expect(error.zodError?.issues).toHaveLength(1)
        }
      }
    })
  })

  describe('extra fields (strict mode)', () => {
    it('throws for extra fields', () => {
      const input = { value: 'ok', extra: '🚫' }

      expect(() => validateRequest({ schema, input })).toThrow(
        ContractValidationError
      )
    })
  })

  describe('missing fields', () => {
    it('throws for missing required fields', () => {
      const input = {}

      expect(() => validateRequest({ schema, input })).toThrow(
        ContractValidationError
      )
    })
  })

  describe('ContractValidationError.toResponse()', () => {
    it('converts error to NextResponse with 400 status', () => {
      const input = { value: 123 }

      try {
        validateRequest({ schema, input })
        expect.fail('Should have thrown')
      } catch (error) {
        if (error instanceof ContractValidationError) {
          const response = error.toResponse()

          expect(response.status).toBe(400)
          // Verificar que es un NextResponse válido
          expect(response).toBeDefined()
        } else {
          expect.fail('Should be ContractValidationError')
        }
      }
    })

    it('includes error details in response', async () => {
      const input = { value: 123 }

      try {
        validateRequest({ schema, input })
        expect.fail('Should have thrown')
      } catch (error) {
        if (error instanceof ContractValidationError) {
          const response = error.toResponse()
          const json = await response.json()

          expect(json).toHaveProperty('error', 'Invalid request contract')
          expect(json).toHaveProperty('details')
          expect(Array.isArray(json.details)).toBe(true)
          expect(json.details.length).toBeGreaterThan(0)
        } else {
          expect.fail('Should be ContractValidationError')
        }
      }
    })
  })

  describe('complex schema', () => {
    const complexSchema = z
      .object({
        name: z.string().min(1),
        age: z.number().int().positive(),
        email: z.email({ error: 'Email inválido' }).optional(),
        tags: z.array(z.string()).optional(),
      })
      .strict()

    it('validates complex valid input', () => {
      const input = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        tags: ['tag1', 'tag2'],
      }

      const result = validateRequest({ schema: complexSchema, input })

      expect(result).toEqual(input)
    })

    it('rejects complex invalid input', () => {
      const input = {
        name: '',
        age: -5,
        email: 'invalid-email',
        extra: '🚫',
      }

      expect(() => validateRequest({ schema: complexSchema, input })).toThrow(
        ContractValidationError
      )
    })
  })
})
