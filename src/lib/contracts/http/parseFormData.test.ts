import { describe, it, expect } from 'vitest'
import { parseFormData } from './parseFormData'

describe('parseFormData', () => {
  describe('valid FormData', () => {
    it('parses string values correctly', () => {
      const formData = new FormData()
      formData.append('title', 'Hello')
      formData.append('content', 'World')

      const result = parseFormData(formData)

      expect(result).toEqual({
        title: 'Hello',
        content: 'World',
      })
    })

    it('parses empty string values', () => {
      const formData = new FormData()
      formData.append('field', '')

      const result = parseFormData(formData)

      expect(result).toEqual({
        field: '',
      })
    })

    it('parses multiple values with same key (takes last)', () => {
      const formData = new FormData()
      formData.append('field', 'first')
      formData.append('field', 'second')

      const result = parseFormData(formData)

      // FormData.entries() itera en orden, el último sobrescribe
      expect(result).toEqual({
        field: 'second',
      })
    })

    it('parses special characters correctly', () => {
      const formData = new FormData()
      formData.append('field', 'Hello & World = Test')

      const result = parseFormData(formData)

      expect(result).toEqual({
        field: 'Hello & World = Test',
      })
    })

    it('parses unicode characters correctly', () => {
      const formData = new FormData()
      formData.append('field', '🚀 Test ñáéíóú')

      const result = parseFormData(formData)

      expect(result).toEqual({
        field: '🚀 Test ñáéíóú',
      })
    })
  })

  describe('non-string values (prohibited)', () => {
    it('throws on File object', () => {
      const formData = new FormData()
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      formData.append('file', file)

      expect(() => parseFormData(formData)).toThrow()
    })

    it('throws on Blob object', () => {
      const formData = new FormData()
      const blob = new Blob(['content'], { type: 'text/plain' })
      formData.append('blob', blob)

      expect(() => parseFormData(formData)).toThrow()
    })

    it('throws with descriptive error message', () => {
      const formData = new FormData()
      const blob = new Blob(['content'])
      formData.append('blob', blob)

      expect(() => parseFormData(formData)).toThrow(
        'Unsupported FormData value type'
      )
    })

    it('includes key name in error message', () => {
      const formData = new FormData()
      const blob = new Blob(['content'])
      formData.append('myFile', blob)

      try {
        parseFormData(formData)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toContain('myFile')
        }
      }
    })
  })

  describe('empty FormData', () => {
    it('returns empty object for empty FormData', () => {
      const formData = new FormData()

      const result = parseFormData(formData)

      expect(result).toEqual({})
    })
  })

  describe('mixed valid and invalid', () => {
    it('throws even if one field is invalid', () => {
      const formData = new FormData()
      formData.append('title', 'Valid')
      formData.append('file', new Blob(['content']))

      expect(() => parseFormData(formData)).toThrow()
    })
  })
})
