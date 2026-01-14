import { describe, it, expect } from 'vitest'
import { parseJsonBody } from './parseJsonBody'

describe('parseJsonBody', () => {
  describe('valid JSON', () => {
    it('parses valid JSON object', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ title: 'Hello', content: 'World' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await parseJsonBody(request)

      expect(result).toEqual({
        title: 'Hello',
        content: 'World',
      })
    })

    it('parses valid JSON array', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify([1, 2, 3]),
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await parseJsonBody(request)

      expect(result).toEqual([1, 2, 3])
    })

    it('parses valid JSON primitive', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify('string'),
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await parseJsonBody(request)

      expect(result).toBe('string')
    })
  })

  describe('empty body', () => {
    it('returns empty object for empty body', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: '',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await parseJsonBody(request)

      expect(result).toEqual({})
    })

    it('returns empty object for whitespace-only body', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: '   ',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await parseJsonBody(request)

      expect(result).toEqual({})
    })
  })

  describe('invalid JSON', () => {
    it('throws on invalid JSON syntax', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: '{ invalid json }',
        headers: { 'Content-Type': 'application/json' },
      })

      await expect(parseJsonBody(request)).rejects.toThrow('Invalid JSON body')
    })

    it('throws on malformed JSON', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: '{ "key": }',
        headers: { 'Content-Type': 'application/json' },
      })

      await expect(parseJsonBody(request)).rejects.toThrow('Invalid JSON body')
    })

    it('includes original error message', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: '{ invalid }',
        headers: { 'Content-Type': 'application/json' },
      })

      try {
        await parseJsonBody(request)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toContain('Invalid JSON body')
        }
      }
    })
  })
})
