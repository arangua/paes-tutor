import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EnvSchema } from './env.schema'

describe('EnvSchema', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Limpiar process.env antes de cada test
    process.env = {}
  })

  afterEach(() => {
    // Restaurar process.env original
    process.env = originalEnv
  })

  describe('valid environment', () => {
    it('accepts valid minimal environment', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.NODE_ENV).toBe('development')
        expect(result.data.DATABASE_URL).toBe('file:./test.db')
      }
    })

    it('accepts valid environment with all optional fields', () => {
      const input = {
        NODE_ENV: 'production',
        DATABASE_URL: 'file:./prod.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        NEXTAUTH_URL: 'https://example.com',
        ENCRYPTION_KEY: 'y'.repeat(32),
        UPSTASH_REDIS_REST_URL: 'https://redis.example.com',
        UPSTASH_REDIS_REST_TOKEN: 'token123',
        OPENAI_API_KEY: 'sk-test',
        SENTRY_DSN: 'https://sentry.io',
        LOG_LEVEL: 'debug',
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(true)
    })
  })

  describe('missing required fields', () => {
    it('rejects missing DATABASE_URL', () => {
      const input = {
        NODE_ENV: 'development',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some((e) => e.path.includes('DATABASE_URL'))).toBe(true)
      }
    })

    it('rejects missing NEXTAUTH_SECRET', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })

    it('rejects missing ENCRYPTION_KEY', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })
  })

  describe('invalid types', () => {
    it('rejects invalid NODE_ENV', () => {
      const input = {
        NODE_ENV: 'invalid',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })

    it('rejects invalid URL format for NEXTAUTH_URL', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
        NEXTAUTH_URL: 'not-a-url',
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })

    it('rejects NEXTAUTH_SECRET too short', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'short',
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })

    it('rejects ENCRYPTION_KEY too short', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'short',
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })
  })

  describe('dependencies', () => {
    it('requires NEXTAUTH_URL in production', () => {
      const input = {
        NODE_ENV: 'production',
        DATABASE_URL: 'file:./prod.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
        // NEXTAUTH_URL faltante
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.errors.some(
            (e) => e.path.includes('NEXTAUTH_URL') && e.message.includes('requerida en producción')
          )
        ).toBe(true)
      }
    })

    it('requires UPSTASH_REDIS_REST_TOKEN when URL is provided', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
        UPSTASH_REDIS_REST_URL: 'https://redis.example.com',
        // UPSTASH_REDIS_REST_TOKEN faltante
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })

    it('requires UPSTASH_REDIS_REST_URL when token is provided', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
        UPSTASH_REDIS_REST_TOKEN: 'token123',
        // UPSTASH_REDIS_REST_URL faltante
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })
  })

  describe('production safety', () => {
    it('rejects ENCRYPTION_KEY with dev- prefix in production', () => {
      const input = {
        NODE_ENV: 'production',
        DATABASE_URL: 'file:./prod.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        NEXTAUTH_URL: 'https://example.com',
        ENCRYPTION_KEY: 'dev-key-' + 'x'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.errors.some(
            (e) =>
              e.path.includes('ENCRYPTION_KEY') &&
              e.message.includes('prefijos de desarrollo/test')
          )
        ).toBe(true)
      }
    })

    it('rejects ENCRYPTION_KEY with test- prefix in production', () => {
      const input = {
        NODE_ENV: 'production',
        DATABASE_URL: 'file:./prod.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        NEXTAUTH_URL: 'https://example.com',
        ENCRYPTION_KEY: 'test-key-' + 'x'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })
  })

  describe('optional fields', () => {
    it('accepts environment without NODE_ENV (default applied in loader)', () => {
      const input = {
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(true)
    })

    it('accepts environment without LOG_LEVEL (default applied in loader)', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(true)
    })
  })

  describe('extra fields (strict mode)', () => {
    it('rejects extra environment variables', () => {
      const input = {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./test.db',
        NEXTAUTH_SECRET: 'x'.repeat(32),
        ENCRYPTION_KEY: 'y'.repeat(32),
        EXTRA_VAR: '🚫',
      }

      const result = EnvSchema.safeParse(input)

      expect(result.success).toBe(false)
    })
  })
})
