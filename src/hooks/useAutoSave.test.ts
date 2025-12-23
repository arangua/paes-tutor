import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAutoSave } from './useAutoSave'

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debe guardar automáticamente después del delay', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const data = { value: 'test' }

    const { rerender } = renderHook(({ data }) => useAutoSave({ data, onSave, delay: 1000 }), {
      initialProps: { data, onSave },
    })

    // Cambiar datos
    const newData = { value: 'updated' }
    rerender({ data: newData, onSave })

    // Avanzar el tiempo
    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(newData)
      expect(onSave).toHaveBeenCalledTimes(1)
    })
  })

  it('debe cancelar guardado si los datos cambian antes del delay', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    let data = { value: 'test' }

    const { rerender } = renderHook(({ data }) => useAutoSave({ data, onSave, delay: 1000 }), {
      initialProps: { data, onSave },
    })

    // Cambiar datos primera vez
    data = { value: 'first' }
    rerender({ data, onSave })
    vi.advanceTimersByTime(500) // Avanzar mitad del delay

    // Cambiar datos segunda vez (debe cancelar el anterior)
    data = { value: 'second' }
    rerender({ data, onSave })
    vi.advanceTimersByTime(1000) // Completar delay

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith({ value: 'second' })
    })
  })

  it('debe prevenir saves duplicados simultáneos', async () => {
    const onSave = vi
      .fn()
      .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)))
    const data = { value: 'test' }

    const { result } = renderHook(() => useAutoSave({ data, onSave, delay: 100 }))

    // Intentar guardar múltiples veces rápidamente
    vi.advanceTimersByTime(100)
    result.current.save()
    result.current.save()
    result.current.save()

    await waitFor(() => {
      // Solo debe guardar una vez
      expect(onSave).toHaveBeenCalledTimes(1)
    })
  })

  it('debe guardar al desmontar si hay cambios pendientes', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const initialData = { value: 'initial' }
    const changedData = { value: 'changed' }

    const { rerender, unmount } = renderHook(
      ({ data }) => useAutoSave({ data, onSave, delay: 1000 }),
      { initialProps: { data: initialData, onSave } }
    )

    // Cambiar datos pero no esperar el delay
    rerender({ data: changedData, onSave })
    vi.advanceTimersByTime(500) // Menos del delay

    // Desmontar antes de que se complete el delay
    unmount()

    // Avanzar tiempo restante
    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(changedData)
    })
  })

  it('debe respetar el flag enabled', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const data = { value: 'test' }

    const { rerender } = renderHook(
      ({ data, enabled }) => useAutoSave({ data, onSave, enabled, delay: 100 }),
      { initialProps: { data, onSave, enabled: false } }
    )

    // Cambiar datos con enabled=false
    rerender({ data: { value: 'updated' }, onSave, enabled: false })
    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(onSave).not.toHaveBeenCalled()
    })

    // Habilitar y cambiar datos
    rerender({ data: { value: 'enabled' }, onSave, enabled: true })
    vi.advanceTimersByTime(100)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ value: 'enabled' })
    })
  })

  it('debe manejar errores de guardado', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
    const data = { value: 'test' }

    const { result } = renderHook(() => useAutoSave({ data, onSave, delay: 100 }))

    vi.advanceTimersByTime(100)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled()
      expect(consoleError).toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })

  it('debe usar comparación profunda para detectar cambios', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const data = { nested: { value: 'test' } }

    const { rerender } = renderHook(({ data }) => useAutoSave({ data, onSave, delay: 100 }), {
      initialProps: { data, onSave },
    })

    // Cambiar referencia pero mantener mismo contenido (no debe guardar)
    rerender({ data: { nested: { value: 'test' } }, onSave })
    vi.advanceTimersByTime(100)

    await waitFor(() => {
      // No debe guardar porque el contenido es el mismo
      expect(onSave).not.toHaveBeenCalled()
    })

    // Cambiar contenido (debe guardar)
    rerender({ data: { nested: { value: 'changed' } }, onSave })
    vi.advanceTimersByTime(100)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
    })
  })
})
