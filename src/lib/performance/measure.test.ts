/**
 * Tests de Utilidades de Medición
 */

import { describe, it, expect } from 'vitest'
import { measurePerformance, measurePerformanceSync, measurePerformanceBatch } from './measure'

describe('measurePerformance', () => {
  it('debe medir el tiempo de una operación asíncrona', async () => {
    const { result, measurement } = await measurePerformance('api_response', async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      return 'test'
    })

    expect(result).toBe('test')
    expect(measurement.metric).toBe('api_response')
    expect(measurement.duration).toBeGreaterThanOrEqual(50)
    expect(measurement.duration).toBeLessThan(100) // Debe ser rápido
    expect(measurement.threshold).toBe(500)
    expect(measurement.meetsBaseline).toBe(true)
    expect(measurement.timestamp).toBeDefined()
  })

  it('debe detectar cuando no se cumple el baseline', async () => {
    const { measurement } = await measurePerformance('api_critical', async () => {
      await new Promise((resolve) => setTimeout(resolve, 250)) // Excede 200ms
      return 'test'
    })

    expect(measurement.meetsBaseline).toBe(false)
    expect(measurement.duration).toBeGreaterThan(200)
  })

  it('debe propagar errores con información de performance', async () => {
    await expect(
      measurePerformance('api_response', async () => {
        throw new Error('Test error')
      })
    ).rejects.toThrow('Performance measurement failed')
  })
})

describe('measurePerformanceSync', () => {
  it('debe medir el tiempo de una operación síncrona', () => {
    const { result, measurement } = measurePerformanceSync('db_query', () => {
      // Simular operación síncrona
      let sum = 0
      for (let i = 0; i < 1000; i++) {
        sum += i
      }
      return sum
    })

    expect(result).toBe(499500) // Suma de 0 a 999
    expect(measurement.metric).toBe('db_query')
    expect(measurement.duration).toBeGreaterThanOrEqual(0)
    expect(measurement.threshold).toBe(100)
    expect(measurement.meetsBaseline).toBe(true)
  })
})

describe('measurePerformanceBatch', () => {
  it('debe medir múltiples operaciones en paralelo', async () => {
    const operations = [
      {
        metric: 'api_response' as const,
        operation: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return 'result1'
        },
      },
      {
        metric: 'api_critical' as const,
        operation: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return 'result2'
        },
      },
    ]

    const results = await measurePerformanceBatch(operations)

    expect(results).toHaveLength(2)
    expect(results[0].result).toBe('result1')
    expect(results[1].result).toBe('result2')
    expect(results[0].measurement.metric).toBe('api_response')
    expect(results[1].measurement.metric).toBe('api_critical')
    expect(results[0].measurement.meetsBaseline).toBe(true)
    expect(results[1].measurement.meetsBaseline).toBe(true)
  })
})
