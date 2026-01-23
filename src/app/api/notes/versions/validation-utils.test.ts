/**
 * Tests unitarios para el sistema de validación centralizado
 * 
 * Estos tests verifican que todas las funciones de validación
 * funcionen correctamente con diferentes tipos de inputs,
 * incluyendo casos límite y valores inválidos.
 */

import {
  ensureFiniteNumber,
  ensurePositiveNumber,
  ensureInteger,
  ensureNonEmptyString,
  ensureArray,
  ensureObject,
  ensureValidDate,
  safeArrayOperation,
  safeStringOperation,
  safeMathOperation,
  safeToISOString,
  safeToISODate,
  isPromise,
  ensurePromiseArray,
  ensureMap,
  ensureSet,
  ensureBuffer,
  withValidationMetrics,
  getValidationMetrics,
  resetValidationMetrics,
} from './validation-utils'

describe('validation-utils', () => {
  beforeEach(() => {
    resetValidationMetrics()
  })

  describe('ensureFiniteNumber', () => {
    it('debe retornar el número si es válido', () => {
      expect(ensureFiniteNumber(42)).toBe(42)
      expect(ensureFiniteNumber(0)).toBe(0)
      expect(ensureFiniteNumber(-10)).toBe(-10)
      expect(ensureFiniteNumber(3.14)).toBe(3.14)
    })

    it('debe parsear strings numéricos', () => {
      expect(ensureFiniteNumber('42')).toBe(42)
      expect(ensureFiniteNumber('3.14')).toBe(3.14)
    })

    it('debe usar fallback para valores inválidos', () => {
      expect(ensureFiniteNumber(null, 0)).toBe(0)
      expect(ensureFiniteNumber(undefined, 10)).toBe(10)
      expect(ensureFiniteNumber('invalid', 5)).toBe(5)
      expect(ensureFiniteNumber(NaN, 7)).toBe(7)
      expect(ensureFiniteNumber(Infinity, 9)).toBe(9)
    })
  })

  describe('ensurePositiveNumber', () => {
    it('debe retornar el número si es positivo', () => {
      expect(ensurePositiveNumber(42)).toBe(42)
      expect(ensurePositiveNumber(1)).toBe(1)
      expect(ensurePositiveNumber(0.1)).toBe(0.1)
    })

    it('debe usar fallback para números no positivos', () => {
      expect(ensurePositiveNumber(0, 1)).toBe(1)
      expect(ensurePositiveNumber(-10, 5)).toBe(5)
    })
  })

  describe('ensureInteger', () => {
    it('debe retornar el número si es entero', () => {
      expect(ensureInteger(42)).toBe(42)
      expect(ensureInteger(0)).toBe(0)
      expect(ensureInteger(-10)).toBe(-10)
    })

    it('debe redondear hacia abajo números decimales', () => {
      expect(ensureInteger(3.14)).toBe(3)
      expect(ensureInteger(3.99)).toBe(3)
      expect(ensureInteger(-3.14)).toBe(-4)
    })
  })

  describe('ensureNonEmptyString', () => {
    it('debe retornar el string si es válido', () => {
      expect(ensureNonEmptyString('hello')).toBe('hello')
      expect(ensureNonEmptyString('  hello  ', '', true)).toBe('hello')
    })

    it('debe usar fallback para strings vacíos', () => {
      expect(ensureNonEmptyString('', 'fallback')).toBe('fallback')
      expect(ensureNonEmptyString('   ', 'fallback', true)).toBe('fallback')
    })

    it('debe usar fallback para valores no string', () => {
      expect(ensureNonEmptyString(null, 'fallback')).toBe('fallback')
      expect(ensureNonEmptyString(undefined, 'fallback')).toBe('fallback')
      expect(ensureNonEmptyString(42, 'fallback')).toBe('fallback')
    })
  })

  describe('ensureArray', () => {
    it('debe retornar el array si es válido', () => {
      expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3])
      expect(ensureArray([])).toEqual([])
    })

    it('debe usar fallback para valores no array', () => {
      expect(ensureArray(null, [])).toEqual([])
      expect(ensureArray(undefined, [1, 2])).toEqual([1, 2])
      expect(ensureArray('not array', [])).toEqual([])
    })
  })

  describe('ensureObject', () => {
    it('debe retornar el objeto si es válido', () => {
      const obj = { a: 1, b: 2 }
      expect(ensureObject(obj)).toEqual(obj)
    })

    it('debe usar fallback para valores no objeto', () => {
      const fallback = { default: true }
      expect(ensureObject(null, fallback)).toEqual(fallback)
      expect(ensureObject([], fallback)).toEqual(fallback)
      expect(ensureObject('not object', fallback)).toEqual(fallback)
    })
  })

  describe('ensureValidDate', () => {
    it('debe retornar la fecha si es válida', () => {
      const date = new Date('2024-01-01')
      expect(ensureValidDate(date)).toEqual(date)
    })

    it('debe parsear strings de fecha', () => {
      const date = ensureValidDate('2024-01-01')
      expect(date instanceof Date).toBe(true)
      expect(!Number.isNaN(date.getTime())).toBe(true)
    })

    it('debe usar fallback para fechas inválidas', () => {
      const fallback = new Date('2024-01-01')
      const result = ensureValidDate('invalid', fallback)
      expect(result instanceof Date).toBe(true)
      expect(!Number.isNaN(result.getTime())).toBe(true)
    })
  })

  describe('safeArrayOperation', () => {
    it('debe ejecutar la operación si el array es válido', () => {
      const result = safeArrayOperation([1, 2, 3], arr => arr.map(x => x * 2), [])
      expect(result).toEqual([2, 4, 6])
    })

    it('debe usar fallback si el array es inválido', () => {
      const fallback = []
      const result = safeArrayOperation(null, arr => arr.map(x => x * 2), fallback)
      expect(result).toEqual(fallback)
    })

    it('debe usar fallback si la operación falla', () => {
      const fallback = []
      const result = safeArrayOperation([1, 2, 3], () => {
        throw new Error('test error')
      }, fallback)
      expect(result).toEqual(fallback)
    })
  })

  describe('safeStringOperation', () => {
    it('debe ejecutar la operación si el string es válido', () => {
      const result = safeStringOperation('hello', s => s.toUpperCase(), '')
      expect(result).toBe('HELLO')
    })

    it('debe usar fallback si el string es inválido', () => {
      const fallback = 'fallback'
      const result = safeStringOperation(null, s => s.toUpperCase(), fallback)
      expect(result).toBe(fallback)
    })
  })

  describe('safeMathOperation', () => {
    it('debe ejecutar la operación si los valores son válidos', () => {
      const result = safeMathOperation([1, 2, 3], nums => Math.max(...nums), 0)
      expect(result).toBe(3)
    })

    it('debe filtrar valores inválidos', () => {
      const result = safeMathOperation([1, NaN, 3, 'invalid'], nums => Math.max(...nums), 0)
      expect(result).toBe(3)
    })

    it('debe usar fallback si no hay valores válidos', () => {
      const result = safeMathOperation([NaN, 'invalid'], nums => Math.max(...nums), 10)
      expect(result).toBe(10)
    })
  })

  describe('safeToISOString', () => {
    it('debe convertir fecha válida a ISO string', () => {
      const date = new Date('2024-01-01T00:00:00Z')
      const result = safeToISOString(date)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('debe usar fallback para fechas inválidas', () => {
      const fallback = '1970-01-01T00:00:00.000Z'
      const result = safeToISOString('invalid', fallback)
      expect(result).toBe(fallback)
    })
  })

  describe('safeToISODate', () => {
    it('debe extraer la parte de fecha de un ISO string', () => {
      const date = new Date('2024-01-01T12:00:00Z')
      const result = safeToISODate(date)
      expect(result).toBe('2024-01-01')
    })

    it('debe usar fallback si falla', () => {
      const fallback = '1970-01-01'
      const result = safeToISODate('invalid', fallback)
      expect(result).toBe(fallback)
    })
  })

  describe('isPromise', () => {
    it('debe identificar promesas válidas', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    it('debe rechazar valores que no son promesas', () => {
      expect(isPromise(null)).toBe(false)
      expect(isPromise({})).toBe(false)
      expect(isPromise([])).toBe(false)
    })
  })

  describe('ensurePromiseArray', () => {
    it('debe retornar array de promesas válidas', () => {
      const promises = [Promise.resolve(1), Promise.resolve(2)]
      const result = ensurePromiseArray(promises)
      expect(result.length).toBe(2)
    })

    it('debe filtrar promesas inválidas', () => {
      const mixed = [Promise.resolve(1), null, Promise.resolve(2)]
      const result = ensurePromiseArray(mixed)
      expect(result.length).toBe(2)
    })
  })

  describe('ensureMap', () => {
    it('debe retornar el Map si es válido', () => {
      const map = new Map([['a', 1]])
      expect(ensureMap(map)).toBe(map)
    })

    it('debe usar fallback para valores no Map', () => {
      const fallback = new Map([['default', 0]])
      const result = ensureMap(null, fallback)
      expect(result instanceof Map).toBe(true)
    })
  })

  describe('ensureSet', () => {
    it('debe retornar el Set si es válido', () => {
      const set = new Set([1, 2, 3])
      expect(ensureSet(set)).toBe(set)
    })

    it('debe usar fallback para valores no Set', () => {
      const fallback = new Set([0])
      const result = ensureSet(null, fallback)
      expect(result instanceof Set).toBe(true)
    })
  })

  describe('ensureBuffer', () => {
    it('debe retornar el Buffer si es válido', () => {
      const buffer = Buffer.from('test')
      const result = ensureBuffer(buffer)
      // En happy-dom, puede retornar Uint8Array, verificar que tiene los datos correctos
      if (Buffer.isBuffer(result)) {
        expect(result).toBe(buffer)
      } else {
        // Si es Uint8Array, verificar que tiene los mismos datos
        expect(result).toBeInstanceOf(Uint8Array)
        expect(Array.from(result)).toEqual(Array.from(buffer))
      }
    })

    it('debe usar fallback para valores no Buffer', () => {
      const fallback = Buffer.alloc(0)
      const result = ensureBuffer(null, fallback)
      // Verificar que es un Buffer o Uint8Array compatible
      expect(Buffer.isBuffer(result) || result instanceof Uint8Array).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('withValidationMetrics', () => {
    it('debe ejecutar la validación y registrar métricas', () => {
      const result = withValidationMetrics('test', () => 42)
      expect(result).toBe(42)
      
      const metrics = getValidationMetrics()
      expect(metrics.counts['test']).toBe(1)
      expect(metrics.averageDurations['test']).toBeGreaterThanOrEqual(0)
    })

    it('debe manejar errores en validaciones', () => {
      expect(() => {
        withValidationMetrics('error-test', () => {
          throw new Error('test error')
        })
      }).toThrow('test error')
    })
  })

  describe('getValidationMetrics', () => {
    it('debe retornar métricas vacías inicialmente', () => {
      resetValidationMetrics()
      const metrics = getValidationMetrics()
      expect(Object.keys(metrics.counts).length).toBe(0)
      expect(Object.keys(metrics.averageDurations).length).toBe(0)
    })

    it('debe acumular métricas de múltiples validaciones', () => {
      resetValidationMetrics()
      withValidationMetrics('test1', () => 1)
      withValidationMetrics('test2', () => 2)
      withValidationMetrics('test1', () => 3)
      
      const metrics = getValidationMetrics()
      expect(metrics.counts['test1']).toBe(2)
      expect(metrics.counts['test2']).toBe(1)
    })
  })
})

