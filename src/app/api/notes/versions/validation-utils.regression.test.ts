/**
 * Tests de Regresión para Validation Utils
 * 
 * Estos tests validan que las funciones helper funcionan correctamente
 * en todos los casos edge, incluyendo valores inválidos, NaN, Infinity, etc.
 */

import { describe, it, expect } from 'vitest'
import {
  safeRound,
  safeAverage,
  safeMathMax,
  safeMathMin,
  safeDivide,
} from './validation-utils'

describe('Validation Utils - Regression Tests', () => {
  describe('safeRound', () => {
    it('debe manejar NaN correctamente', () => {
      expect(safeRound(NaN)).toBe(0)
      expect(safeRound(NaN, 2)).toBe(0)
    })

    it('debe manejar Infinity correctamente', () => {
      expect(safeRound(Infinity)).toBe(0)
      expect(safeRound(-Infinity)).toBe(0)
      expect(safeRound(Infinity, 2)).toBe(0)
    })

    it('debe manejar valores finitos correctamente', () => {
      expect(safeRound(3.14159, 2)).toBe(3.14)
      expect(safeRound(3.14159, 0)).toBe(3)
      expect(safeRound(3.5, 0)).toBe(4)
      expect(safeRound(3.4, 0)).toBe(3)
    })

    it('debe manejar decimales inválidos', () => {
      expect(safeRound(3.14159, -1)).toBe(3) // Usa 0 decimales si es negativo
      expect(safeRound(3.14159, NaN)).toBe(3)
      expect(safeRound(3.14159, Infinity)).toBe(3)
    })

    it('debe manejar valores muy grandes', () => {
      expect(safeRound(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER)
      expect(safeRound(Number.MAX_VALUE, 0)).toBe(0) // Si excede, retorna 0
    })

    it('debe manejar valores muy pequeños', () => {
      expect(safeRound(Number.MIN_SAFE_INTEGER, 0)).toBe(Number.MIN_SAFE_INTEGER)
      expect(safeRound(0.0000001, 7)).toBe(0.0000001)
    })
  })

  describe('safeAverage', () => {
    it('debe manejar array vacío', () => {
      expect(safeAverage([])).toBe(0)
      expect(safeAverage([], 10)).toBe(10)
    })

    it('debe manejar array con NaN', () => {
      expect(safeAverage([1, NaN, 3])).toBe(2) // (1 + 3) / 2
      expect(safeAverage([NaN, NaN])).toBe(0)
    })

    it('debe manejar array con Infinity', () => {
      expect(safeAverage([1, Infinity, 3])).toBe(2) // Filtra Infinity
      expect(safeAverage([Infinity, Infinity])).toBe(0)
    })

    it('debe manejar array con valores mixtos', () => {
      expect(safeAverage([1, '2', 3, null, undefined])).toBe(2) // Solo números válidos
    })

    it('debe calcular promedio correctamente', () => {
      expect(safeAverage([1, 2, 3, 4, 5])).toBe(3)
      expect(safeAverage([10, 20, 30])).toBe(20)
      expect(safeAverage([-5, 0, 5])).toBe(0)
    })

    it('debe usar fallback cuando no hay valores válidos', () => {
      expect(safeAverage([NaN, Infinity, 'invalid'], 100)).toBe(100)
    })

    it('debe manejar array con un solo elemento', () => {
      expect(safeAverage([5])).toBe(5)
      expect(safeAverage([NaN])).toBe(0)
    })
  })

  describe('safeMathMax', () => {
    it('debe manejar array vacío', () => {
      expect(safeMathMax([])).toBe(0)
      expect(safeMathMax([], 10)).toBe(10)
    })

    it('debe manejar array con NaN', () => {
      expect(safeMathMax([1, NaN, 3])).toBe(3) // Filtra NaN
      expect(safeMathMax([NaN, NaN])).toBe(0)
    })

    it('debe manejar array con Infinity', () => {
      expect(safeMathMax([1, Infinity, 3])).toBe(3) // Filtra Infinity
    })

    it('debe encontrar el máximo correctamente', () => {
      expect(safeMathMax([1, 5, 3, 9, 2])).toBe(9)
      expect(safeMathMax([-5, -1, -10])).toBe(-1)
      expect(safeMathMax([0, 0, 0])).toBe(0)
    })

    it('debe usar fallback cuando no hay valores válidos', () => {
      expect(safeMathMax([NaN, Infinity, 'invalid'], 100)).toBe(100)
    })

    it('debe manejar array con un solo elemento', () => {
      expect(safeMathMax([5])).toBe(5)
      expect(safeMathMax([NaN])).toBe(0)
    })

    it('debe usar reduce como fallback si spread falla', () => {
      // Crear array muy grande que podría causar problemas con spread
      const largeArray = Array.from({ length: 100000 }, (_, i) => i)
      expect(safeMathMax(largeArray)).toBe(99999)
    })
  })

  describe('safeMathMin', () => {
    it('debe manejar array vacío', () => {
      expect(safeMathMin([])).toBe(0)
      expect(safeMathMin([], 10)).toBe(10)
    })

    it('debe manejar array con NaN', () => {
      expect(safeMathMin([1, NaN, 3])).toBe(1) // Filtra NaN
      expect(safeMathMin([NaN, NaN])).toBe(0)
    })

    it('debe manejar array con Infinity', () => {
      expect(safeMathMin([1, Infinity, 3])).toBe(1) // Filtra Infinity
    })

    it('debe encontrar el mínimo correctamente', () => {
      expect(safeMathMin([1, 5, 3, 9, 2])).toBe(1)
      expect(safeMathMin([-5, -1, -10])).toBe(-10)
      expect(safeMathMin([0, 0, 0])).toBe(0)
    })

    it('debe usar fallback cuando no hay valores válidos', () => {
      expect(safeMathMin([NaN, Infinity, 'invalid'], 100)).toBe(100)
    })

    it('debe manejar array con un solo elemento', () => {
      expect(safeMathMin([5])).toBe(5)
      expect(safeMathMin([NaN])).toBe(0)
    })

    it('debe usar reduce como fallback si spread falla', () => {
      // Crear array muy grande que podría causar problemas con spread
      const largeArray = Array.from({ length: 100000 }, (_, i) => i)
      expect(safeMathMin(largeArray)).toBe(0)
    })
  })

  describe('safeDivide', () => {
    it('debe realizar división correctamente', () => {
      expect(safeDivide(10, 2)).toBe(5)
      expect(safeDivide(15, 3)).toBe(5)
      expect(safeDivide(7, 2)).toBe(3.5)
      expect(safeDivide(0, 5)).toBe(0)
    })

    it('debe manejar división por cero', () => {
      expect(safeDivide(10, 0)).toBe(0) // Fallback por defecto
      expect(safeDivide(10, 0, 100)).toBe(100) // Fallback personalizado
      expect(safeDivide(-5, 0, -10)).toBe(-10)
    })

    it('debe manejar valores NaN', () => {
      expect(safeDivide(NaN, 2)).toBe(0)
      expect(safeDivide(10, NaN)).toBe(0)
      expect(safeDivide(NaN, NaN)).toBe(0)
      expect(safeDivide(NaN, 2, 5)).toBe(5)
    })

    it('debe manejar valores Infinity', () => {
      expect(safeDivide(Infinity, 2)).toBe(0)
      expect(safeDivide(10, Infinity)).toBe(0)
      expect(safeDivide(Infinity, Infinity)).toBe(0)
      expect(safeDivide(-Infinity, 2)).toBe(0)
    })

    it('debe manejar valores null/undefined', () => {
      expect(safeDivide(null, 2)).toBe(0)
      expect(safeDivide(10, null)).toBe(0)
      expect(safeDivide(undefined, 2)).toBe(0)
      expect(safeDivide(10, undefined)).toBe(0)
      expect(safeDivide(null, null, 5)).toBe(5)
    })

    it('debe manejar strings numéricos', () => {
      expect(safeDivide('10', '2')).toBe(5)
      expect(safeDivide('15', 3)).toBe(5)
      expect(safeDivide(10, '2')).toBe(5)
    })

    it('debe manejar strings no numéricos', () => {
      expect(safeDivide('invalid', 2)).toBe(0)
      expect(safeDivide(10, 'invalid')).toBe(0)
      expect(safeDivide('invalid', 'invalid', 5)).toBe(5)
    })

    it('debe manejar resultados no finitos', () => {
      // Casos donde el resultado podría ser Infinity
      expect(safeDivide(Number.MAX_VALUE, 0.1)).toBe(0) // Resultado muy grande
      expect(safeDivide(Number.MAX_VALUE, 0.1, 100)).toBe(100)
    })

    it('debe usar fallback cuando el resultado no es finito', () => {
      const result = safeDivide(1e308, 1e-308) // Resultado muy grande
      expect(Number.isFinite(result) || result === 0).toBe(true)
    })

    it('debe manejar números negativos', () => {
      expect(safeDivide(-10, 2)).toBe(-5)
      expect(safeDivide(10, -2)).toBe(-5)
      expect(safeDivide(-10, -2)).toBe(5)
    })

    it('debe manejar números decimales', () => {
      expect(safeDivide(3.5, 2)).toBe(1.75)
      expect(safeDivide(10, 3)).toBeCloseTo(3.3333333333333335)
      expect(safeDivide(0.1, 0.2)).toBe(0.5)
    })

    it('debe manejar valores muy pequeños', () => {
      expect(safeDivide(0.0001, 0.0002)).toBe(0.5)
      expect(safeDivide(Number.MIN_VALUE, 2)).toBe(0) // Resultado muy pequeño
    })

    it('debe manejar valores muy grandes', () => {
      expect(safeDivide(Number.MAX_SAFE_INTEGER, 2)).toBe(Number.MAX_SAFE_INTEGER / 2)
      expect(safeDivide(Number.MAX_SAFE_INTEGER, 0)).toBe(0) // División por cero
    })
  })

  describe('Casos Edge Combinados', () => {
    it('debe manejar arrays con todos los tipos de valores inválidos', () => {
      const mixedArray: unknown[] = [1, NaN, Infinity, -Infinity, 'string', null, undefined, 5]
      expect(safeAverage(mixedArray)).toBe(3) // (1 + 5) / 2
      expect(safeMathMax(mixedArray)).toBe(5)
      expect(safeMathMin(mixedArray)).toBe(1)
    })

    it('debe manejar valores en los límites de Number', () => {
      expect(safeRound(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER)
      expect(safeRound(Number.MIN_SAFE_INTEGER, 0)).toBe(Number.MIN_SAFE_INTEGER)
    })

    it('debe mantener consistencia entre funciones', () => {
      const numbers = [1, 2, 3, 4, 5]
      const avg = safeAverage(numbers)
      const max = safeMathMax(numbers)
      const min = safeMathMin(numbers)
      
      expect(avg).toBeGreaterThanOrEqual(min)
      expect(avg).toBeLessThanOrEqual(max)
      expect(max).toBeGreaterThanOrEqual(min)
    })

    it('debe usar safeDivide con safeAverage para cálculos consistentes', () => {
      const numbers = [10, 20, 30]
      const sum = numbers.reduce((a, b) => a + b, 0)
      const avg1 = safeAverage(numbers)
      const avg2 = safeDivide(sum, numbers.length, 0)
      
      expect(avg1).toBe(avg2)
    })
  })
})

