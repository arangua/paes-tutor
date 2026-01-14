import { describe, it, expect } from 'vitest'
import { CreateNoteSchema } from './create-note.schema'

describe('CreateNoteSchema', () => {
  describe('valid input', () => {
    it('accepts valid input with required fields', () => {
      const input = {
        title: 'Note title',
        content: 'Note content',
      }

      expect(() => CreateNoteSchema.parse(input)).not.toThrow()
      const result = CreateNoteSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('accepts valid input with all optional fields', () => {
      const input = {
        title: 'Note title',
        content: 'Note content',
        questionId: 'c123456789012345678901234',
        topicId: 'c987654321098765432109876',
        tags: 'tag1,tag2',
      }

      expect(() => CreateNoteSchema.parse(input)).not.toThrow()
      const result = CreateNoteSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('accepts valid input with partial optional fields', () => {
      const input = {
        title: 'Note title',
        content: 'Note content',
        questionId: 'c123456789012345678901234',
      }

      expect(() => CreateNoteSchema.parse(input)).not.toThrow()
      const result = CreateNoteSchema.parse(input)
      expect(result).toEqual(input)
    })
  })

  describe('missing fields (Invariante 1)', () => {
    it('rejects missing required field: title', () => {
      const input = {
        content: 'Note content',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects missing required field: content', () => {
      const input = {
        title: 'Note title',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects empty object', () => {
      const input = {}

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })
  })

  describe('extra fields (Invariante 2)', () => {
    it('rejects extra field', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        extra: '🚫',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects multiple extra fields', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        extra1: '🚫',
        extra2: '🚫',
        extra3: '🚫',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects extra field even with valid optional fields', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        questionId: 'c123456789012345678901234',
        extra: '🚫',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })
  })

  describe('invalid types (Invariante 3)', () => {
    it('rejects invalid type: title as number', () => {
      const input = {
        title: 123,
        content: 'Content',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects invalid type: content as boolean', () => {
      const input = {
        title: 'Title',
        content: true,
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects invalid type: questionId as number', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        questionId: 123,
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects invalid type: tags as array', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        tags: ['tag1', 'tag2'],
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects null for required fields', () => {
      const input = {
        title: null,
        content: 'Content',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects undefined for required fields', () => {
      const input = {
        title: undefined,
        content: 'Content',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })
  })

  describe('empty strings (Invariante 1)', () => {
    it('rejects empty string for title', () => {
      const input = {
        title: '',
        content: 'Content',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects empty string for content', () => {
      const input = {
        title: 'Title',
        content: '',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects whitespace-only strings', () => {
      const input = {
        title: '   ',
        content: '   ',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })
  })

  describe('CUID validation for optional fields', () => {
    it('rejects invalid CUID format for questionId', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        questionId: 'invalid-cuid',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('rejects invalid CUID format for topicId', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        topicId: 'invalid-cuid',
      }

      expect(() => CreateNoteSchema.parse(input)).toThrow()
    })

    it('accepts valid CUID format', () => {
      const input = {
        title: 'Title',
        content: 'Content',
        questionId: 'c123456789012345678901234',
        topicId: 'c987654321098765432109876',
      }

      expect(() => CreateNoteSchema.parse(input)).not.toThrow()
    })
  })
})
