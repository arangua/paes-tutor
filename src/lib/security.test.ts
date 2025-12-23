import { describe, it, expect } from 'vitest'
import {
  sanitizeString,
  sanitizeObject,
  containsDangerousPatterns,
  isValidCuid,
  isValidEmail,
  isValidLength,
  sanitizeAndValidate,
} from './security'

describe('security', () => {
  describe('sanitizeString', () => {
    it('debe retornar string vacío para null o undefined', () => {
      expect(sanitizeString(null)).toBe('')
      expect(sanitizeString(undefined)).toBe('')
    })

    it('debe sanitizar espacios en blanco', () => {
      expect(sanitizeString('  hello  ')).toBe('hello')
    })

    it('debe eliminar caracteres de control', () => {
      expect(sanitizeString('hello\x00world')).toBe('helloworld')
      expect(sanitizeString('hello\x1Fworld')).toBe('helloworld')
    })

    it('debe preservar caracteres válidos', () => {
      expect(sanitizeString('hello\nworld')).toBe('hello\nworld')
      expect(sanitizeString('hello\rworld')).toBe('hello\rworld')
      expect(sanitizeString('hello\tworld')).toBe('hello\tworld')
    })

    it('debe limitar longitud máxima', () => {
      const longString = 'a'.repeat(20000)
      const sanitized = sanitizeString(longString)
      expect(sanitized.length).toBe(10000)
    })

    it('debe sanitizar strings normales correctamente', () => {
      expect(sanitizeString('Hello World')).toBe('Hello World')
      expect(sanitizeString('test@example.com')).toBe('test@example.com')
    })
  })

  describe('sanitizeObject', () => {
    it('debe sanitizar strings en objeto', () => {
      const obj = {
        name: '  John  ',
        email: 'test@example.com',
        age: 25,
      }
      const sanitized = sanitizeObject(obj)
      expect(sanitized.name).toBe('John')
      expect(sanitized.email).toBe('test@example.com')
      expect(sanitized.age).toBe(25)
    })

    it('debe sanitizar objetos anidados', () => {
      const obj = {
        user: {
          name: '  Jane  ',
          profile: {
            bio: '  Developer  ',
          },
        },
      }
      const sanitized = sanitizeObject(obj)
      expect(sanitized.user.name).toBe('Jane')
      expect(sanitized.user.profile.bio).toBe('Developer')
    })

    it('debe sanitizar arrays', () => {
      const obj = {
        tags: ['  tag1  ', '  tag2  '],
        numbers: [1, 2, 3],
      }
      const sanitized = sanitizeObject(obj)
      expect(sanitized.tags[0]).toBe('tag1')
      expect(sanitized.tags[1]).toBe('tag2')
      expect(sanitized.numbers).toEqual([1, 2, 3])
    })

    it('debe preservar tipos no string', () => {
      const obj = {
        string: '  test  ',
        number: 42,
        boolean: true,
        nullValue: null,
      }
      const sanitized = sanitizeObject(obj)
      expect(sanitized.string).toBe('test')
      expect(sanitized.number).toBe(42)
      expect(sanitized.boolean).toBe(true)
      expect(sanitized.nullValue).toBe(null)
    })
  })

  describe('containsDangerousPatterns', () => {
    it('debe detectar scripts', () => {
      expect(containsDangerousPatterns('<script>alert("xss")</script>')).toBe(true)
      expect(containsDangerousPatterns('<SCRIPT>alert("xss")</SCRIPT>')).toBe(true)
    })

    it('debe detectar event handlers', () => {
      expect(containsDangerousPatterns('onclick="alert(1)"')).toBe(true)
      expect(containsDangerousPatterns('onerror="alert(1)"')).toBe(true)
    })

    it('debe detectar javascript URLs', () => {
      expect(containsDangerousPatterns('javascript:alert(1)')).toBe(true)
      expect(containsDangerousPatterns('JAVASCRIPT:alert(1)')).toBe(true)
    })

    it('debe detectar iframes', () => {
      expect(containsDangerousPatterns('<iframe src="evil.com"></iframe>')).toBe(true)
    })

    it('debe retornar false para strings seguros', () => {
      expect(containsDangerousPatterns('Hello World')).toBe(false)
      expect(containsDangerousPatterns('test@example.com')).toBe(false)
      expect(containsDangerousPatterns('https://example.com')).toBe(false)
    })

    it('debe retornar false para null o undefined', () => {
      expect(containsDangerousPatterns(null as any)).toBe(false)
      expect(containsDangerousPatterns(undefined as any)).toBe(false)
    })
  })

  describe('isValidCuid', () => {
    it('debe validar cuid correctamente', () => {
      expect(isValidCuid('c123456789012345678901234')).toBe(true)
      expect(isValidCuid('cabcdefghijklmnopqrstuvwx')).toBe(true)
    })

    it('debe rechazar cuids inválidos', () => {
      expect(isValidCuid('1234567890123456789012345')).toBe(false)
      expect(isValidCuid('c123')).toBe(false)
      expect(isValidCuid('c1234567890123456789012345')).toBe(false)
      expect(isValidCuid('')).toBe(false)
      expect(isValidCuid(null)).toBe(false)
      expect(isValidCuid(undefined)).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('debe validar emails correctos', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.co.uk')).toBe(true)
    })

    it('debe rechazar emails inválidos', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail(null)).toBe(false)
      expect(isValidEmail(undefined)).toBe(false)
    })

    it('debe rechazar emails muy largos', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      expect(isValidEmail(longEmail)).toBe(false)
    })
  })

  describe('isValidLength', () => {
    it('debe validar longitud dentro del rango', () => {
      expect(isValidLength('hello', 0, 10)).toBe(true)
      expect(isValidLength('hello', 5, 10)).toBe(true)
    })

    it('debe rechazar strings muy cortos', () => {
      expect(isValidLength('hi', 5, 10)).toBe(false)
    })

    it('debe rechazar strings muy largos', () => {
      expect(isValidLength('hello world', 0, 5)).toBe(false)
    })

    it('debe retornar false para null o undefined', () => {
      expect(isValidLength(null)).toBe(false)
      expect(isValidLength(undefined)).toBe(false)
    })
  })

  describe('sanitizeAndValidate', () => {
    it('debe sanitizar y validar string válido', () => {
      const result = sanitizeAndValidate('  hello  ', {
        minLength: 3,
        maxLength: 10,
      })
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('hello')
      expect(result.error).toBeUndefined()
    })

    it('debe rechazar string muy corto', () => {
      const result = sanitizeAndValidate('hi', {
        minLength: 5,
        maxLength: 10,
      })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Longitud')
    })

    it('debe rechazar string con patrones peligrosos', () => {
      const result = sanitizeAndValidate('<script>alert(1)</script>', {
        checkDangerous: true,
      })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('no permitido')
    })

    it('debe permitir string vacío si allowEmpty es true', () => {
      const result = sanitizeAndValidate('', {
        allowEmpty: true,
      })
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('')
    })

    it('debe rechazar null o undefined si allowEmpty es false', () => {
      const result = sanitizeAndValidate(null, {
        allowEmpty: false,
      })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('requerido')
    })
  })
})
