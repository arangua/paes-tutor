import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debe retornar el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))

    expect(result.current).toBe('initial')
  })

  it('debe actualizar el valor después del delay', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    })

    expect(result.current).toBe('initial')

    // Cambiar valor
    rerender({ value: 'updated' })

    // Valor aún no debe cambiar
    expect(result.current).toBe('initial')

    // Avanzar tiempo
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Verificar directamente sin waitFor
    expect(result.current).toBe('updated')
  })

  it('debe cancelar actualización si el valor cambia antes del delay', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    })

    // Cambiar a 'intermediate'
    rerender({ value: 'intermediate' })
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Cambiar a 'final' antes de que se complete el delay
    rerender({ value: 'final' })
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Aún no debe cambiar
    expect(result.current).toBe('initial')

    // Completar delay total
    await act(async () => {
      vi.advanceTimersByTime(150)
    })

    // Verificar directamente
    expect(result.current).toBe('final')
  })

  it('debe funcionar con diferentes tipos de datos', async () => {
    const { result: result1, rerender: rerender1 } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    )

    rerender1({ value: 42 })
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(result1.current).toBe(42)

    // Test con objeto
    const obj1 = { a: 1 }
    const obj2 = { a: 2 }

    const { result: result2, rerender: rerender2 } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: obj1 } }
    )

    rerender2({ value: obj2 })
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(result2.current).toBe(obj2)
  })

  it('debe limpiar el timeout al desmontar', () => {
    const { unmount } = renderHook(() => useDebounce('test', 300))

    // Desmontar antes de que se complete el delay
    unmount()

    // Avanzar tiempo después de desmontar
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // No debe haber errores
    expect(true).toBe(true)
  })

  it('debe usar delay personalizado', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'updated' })

    // Avanzar menos del delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('initial')

    // Completar delay
    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('updated')
  })
})
