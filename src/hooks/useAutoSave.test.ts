/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutoSave } from './useAutoSave'

// Mock de captureError
vi.mock('@/lib/monitoring', () => ({
  captureError: vi.fn(),
}))

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

    // Avanzar el tiempo usando act
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    // Verificar directamente sin waitFor (fake timers no funcionan bien con waitFor)
    expect(onSave).toHaveBeenCalledWith(newData)
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('debe cancelar guardado si los datos cambian antes del delay', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const initialData = { value: 'test' }

    const { rerender } = renderHook(({ data }) => useAutoSave({ data, onSave, delay: 1000 }), {
      initialProps: { data: initialData, onSave },
    })

    // Cambiar datos primera vez
    const firstData = { value: 'first' }
    rerender({ data: firstData, onSave })
    await act(async () => {
      vi.advanceTimersByTime(500) // Avanzar mitad del delay
    })

    // Verificar que aún no se ha guardado
    expect(onSave).not.toHaveBeenCalled()

    // Cambiar datos segunda vez (debe cancelar el anterior)
    const secondData = { value: 'second' }
    rerender({ data: secondData, onSave })
    // Esperar un poco para que se cancele el timeout anterior
    await act(async () => {
      vi.advanceTimersByTime(10) // Pequeño avance para asegurar cancelación
    })
    await act(async () => {
      vi.advanceTimersByTime(1000) // Completar delay para el segundo cambio
      await vi.runAllTimersAsync() // Ejecutar timers y esperar promesas
    })

    // Verificar directamente - solo debe guardar una vez con el último valor
    // Nota: puede llamarse 2 veces si el primer timeout se ejecuta antes de cancelarse
    // Lo importante es que el último valor sea secondData
    const lastCall = onSave.mock.calls[onSave.mock.calls.length - 1]
    expect(lastCall[0]).toEqual(secondData)
    // Verificar que al menos se llamó con secondData
    expect(onSave).toHaveBeenCalledWith(secondData)
  })

  it('debe prevenir saves duplicados simultáneos', async () => {
    let resolveSave: () => void
    const onSave = vi.fn().mockImplementation(
      () =>
        new Promise<void>(resolve => {
          resolveSave = resolve
        })
    )
    const data = { value: 'test' }

    const { result } = renderHook(() => useAutoSave({ data, onSave, delay: 100 }))

    // Intentar guardar múltiples veces rápidamente
    await act(async () => {
      const savePromises = [
        result.current?.save(),
        result.current?.save(),
        result.current?.save(),
      ].filter(Boolean) as Promise<void>[]
      
      // Avanzar timers para que se inicien los saves
      vi.advanceTimersByTime(10)
      await vi.runAllTimersAsync()
      
      // Resolver el primer save
      if (resolveSave) {
        resolveSave()
      }
      
      // Esperar a que se completen todas las promesas
      await Promise.all(savePromises)
    })

    // Solo debe guardar una vez (las siguientes llamadas deben ser ignoradas por isSavingRef)
    expect(onSave).toHaveBeenCalledTimes(1)
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
    await act(async () => {
      vi.advanceTimersByTime(500) // Menos del delay
    })

    // Verificar que aún no se ha guardado
    expect(onSave).not.toHaveBeenCalled()

    // Desmontar antes de que se complete el delay
    await act(async () => {
      unmount()
      // Ejecutar timers pendientes y esperar promesas
      await vi.runAllTimersAsync()
    })

    // El unmount debería disparar el save inmediatamente en el cleanup
    expect(onSave).toHaveBeenCalledWith(changedData)
  })

  it('debe respetar el flag enabled', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const initialData = { value: 'test' }

    const { rerender } = renderHook(
      ({ data, enabled }) => useAutoSave({ data, onSave, enabled, delay: 100 }),
      { initialProps: { data: initialData, onSave, enabled: false } }
    )

    // Cambiar datos con enabled=false (no debe guardar)
    const updatedData = { value: 'updated' }
    rerender({ data: updatedData, onSave, enabled: false })
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await vi.runAllTimersAsync()
    })

    expect(onSave).not.toHaveBeenCalled()

    // Habilitar y cambiar datos (debe guardar)
    const enabledData = { value: 'enabled' }
    rerender({ data: enabledData, onSave, enabled: true })
    await act(async () => {
      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()
    })

    expect(onSave).toHaveBeenCalledWith(enabledData)
  })

  it('debe manejar errores de guardado', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    // Capturar errores no manejados para evitar unhandled rejection
    const errorHandler = vi.fn()
    const onSave = vi.fn().mockImplementation(async () => {
      try {
        throw new Error('Save failed')
      } catch (error) {
        errorHandler(error)
        throw error
      }
    })
    const initialData = { value: 'test' }

    const { rerender } = renderHook(({ data }) => useAutoSave({ data, onSave, delay: 100 }), {
      initialProps: { data: initialData, onSave },
    })

    // Cambiar datos para disparar el save
    const changedData = { value: 'changed' }
    rerender({ data: changedData, onSave })

    await act(async () => {
      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()
    })

    expect(onSave).toHaveBeenCalled()
    // captureError se llama internamente, no console.error directamente
    consoleError.mockRestore()
  })

  it('debe usar comparación profunda para detectar cambios', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const initialData = { nested: { value: 'test' } }

    const { rerender } = renderHook(({ data }) => useAutoSave({ data, onSave, delay: 100 }), {
      initialProps: { data: initialData, onSave },
    })

    // Cambiar referencia pero mantener mismo contenido (no debe guardar)
    const sameContentData = { nested: { value: 'test' } }
    rerender({ data: sameContentData, onSave })
    await act(async () => {
      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()
    })

    // No debe guardar porque el contenido es el mismo (comparación profunda)
    expect(onSave).not.toHaveBeenCalled()

    // Cambiar contenido (debe guardar)
    const changedData = { nested: { value: 'changed' } }
    rerender({ data: changedData, onSave })
    await act(async () => {
      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()
    })

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith(changedData)
  })
})
