import { describe, it, expect } from 'vitest'
import { deepEqual, safeDeepEqual } from './deepEqual'

describe('deepEqual', () => {
  describe('Primitivos', () => {
    it('debe comparar números correctamente', () => {
      expect(deepEqual(1, 1)).toBe(true)
      expect(deepEqual(1, 2)).toBe(false)
      expect(deepEqual(0, -0)).toBe(true)
    })

    it('debe comparar strings correctamente', () => {
      expect(deepEqual('test', 'test')).toBe(true)
      expect(deepEqual('test', 'test2')).toBe(false)
    })

    it('debe comparar booleanos correctamente', () => {
      expect(deepEqual(true, true)).toBe(true)
      expect(deepEqual(true, false)).toBe(false)
    })

    it('debe comparar null y undefined correctamente', () => {
      expect(deepEqual(null, null)).toBe(true)
      expect(deepEqual(undefined, undefined)).toBe(true)
      expect(deepEqual(null, undefined)).toBe(false)
      expect(deepEqual(undefined, null)).toBe(false)
    })
  })

  describe('Arrays', () => {
    it('debe comparar arrays vacíos', () => {
      expect(deepEqual([], [])).toBe(true)
    })

    it('debe comparar arrays con elementos', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
      expect(deepEqual([1, 2, 3], [1, 2])).toBe(false)
    })

    it('debe comparar arrays anidados', () => {
      expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)
      expect(deepEqual([1, [2, 3]], [1, [2, 4]])).toBe(false)
    })
  })

  describe('Objetos', () => {
    it('debe comparar objetos vacíos', () => {
      expect(deepEqual({}, {})).toBe(true)
    })

    it('debe comparar objetos con propiedades', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
      expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
    })

    it('debe comparar objetos con propiedades en diferente orden', () => {
      expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    })

    it('debe comparar objetos anidados', () => {
      expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true)

      expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false)
    })
  })

  describe('Casos Edge', () => {
    it('debe distinguir entre array y objeto', () => {
      expect(deepEqual([], {})).toBe(false)
      expect(deepEqual({ 0: 1 }, [1])).toBe(false)
    })

    it('debe manejar valores mixtos', () => {
      expect(deepEqual({ a: 1, b: [2, 3], c: { d: 4 } }, { a: 1, b: [2, 3], c: { d: 4 } })).toBe(
        true
      )
    })
  })
})

describe('safeDeepEqual', () => {
  it('debe funcionar igual que deepEqual para casos normales', () => {
    expect(safeDeepEqual(1, 1)).toBe(true)
    expect(safeDeepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(safeDeepEqual([1, 2], [1, 2])).toBe(true)
  })

  it('debe manejar referencias circulares', () => {
    const circular: any = { a: 1 }
    circular.self = circular

    // No debe lanzar error
    expect(() => safeDeepEqual(circular, circular)).not.toThrow()
    expect(safeDeepEqual(circular, circular)).toBe(true)
  })

  it('debe usar fallback a JSON.stringify si hay error', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }

    // Ambos deberían ser iguales
    expect(safeDeepEqual(obj1, obj2)).toBe(true)
  })

  it('debe retornar false si JSON.stringify también falla', () => {
    const circular1: any = { a: 1 }
    circular1.self = circular1

    const circular2: any = { a: 2 }
    circular2.self = circular2

    // Debe retornar false si ambos fallan
    expect(safeDeepEqual(circular1, circular2)).toBe(false)
  })
})
