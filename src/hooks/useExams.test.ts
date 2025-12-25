import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useExams } from './useExams'

// Mock de fetch
globalThis.fetch = vi.fn()

describe('useExams', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar exámenes correctamente', async () => {
    const mockExams = [
      {
        id: '1',
        titulo: 'Examen 1',
        descripcion: 'Descripción 1',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExams,
    } as Response)

    const { result } = renderHook(() => useExams())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.exams).toEqual(mockExams)
    expect(result.current.error).toBeNull()
  })

  it('debe manejar estados de loading', async () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})) // Nunca resuelve

    const { result } = renderHook(() => useExams())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.exams).toEqual([])
  })

  it('debe manejar errores de API', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Error del servidor' }),
    } as Response)

    const { result } = renderHook(() => useExams())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.exams).toEqual([])
  })

  it('debe filtrar exámenes por búsqueda', async () => {
    const mockExams = [
      {
        id: '1',
        titulo: 'Examen de Matemáticas',
        descripcion: 'Descripción',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
      {
        id: '2',
        titulo: 'Examen de Lenguaje',
        descripcion: 'Descripción',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's2', nombre: 'Lenguaje', codigo: 'LANG' },
        questions: [],
      },
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExams,
    } as Response)

    const { result } = renderHook(() => useExams())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Filtrar por "Matemáticas"
    const filtered = result.current.filterExams('Matemáticas')

    expect(filtered).toHaveLength(1)
    expect(filtered[0].titulo).toBe('Examen de Matemáticas')
  })

  it('debe extraer subjects únicos', async () => {
    const mockExams = [
      {
        id: '1',
        titulo: 'Examen 1',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
      {
        id: '2',
        titulo: 'Examen 2',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
      {
        id: '3',
        titulo: 'Examen 3',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's2', nombre: 'Lenguaje', codigo: 'LANG' },
        questions: [],
      },
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExams,
    } as Response)

    const { result } = renderHook(() => useExams())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.subjects).toHaveLength(2)
    expect(result.current.subjects[0].nombre).toBe('Lenguaje')
    expect(result.current.subjects[1].nombre).toBe('Matemáticas')
  })

  it('debe extraer tipos únicos', async () => {
    const mockExams = [
      {
        id: '1',
        titulo: 'Examen 1',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
      {
        id: '2',
        titulo: 'Examen 2',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
      {
        id: '3',
        titulo: 'Examen 3',
        tipo: 'oficial',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExams,
    } as Response)

    const { result } = renderHook(() => useExams())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.tipos).toHaveLength(2)
    expect(result.current.tipos).toContain('oficial')
    expect(result.current.tipos).toContain('simulacro')
  })

  it('debe actualizar cuando cambian los filtros', async () => {
    const mockExams = [
      {
        id: '1',
        titulo: 'Examen 1',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockExams,
    } as Response)

    const { result, rerender } = renderHook(({ options }) => useExams(options), {
      initialProps: { options: {} },
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Cambiar filtro
    rerender({ options: { subjectId: 's1' } })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  it('debe validar estructura de exámenes', async () => {
    const invalidExams = [
      {
        id: '1',
        // Falta titulo
        tipo: 'simulacro',
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
      },
      {
        id: '2',
        titulo: 'Examen válido',
        tipo: 'simulacro',
        totalPreguntas: 10,
        subject: { id: 's1', nombre: 'Matemáticas', codigo: 'MATH' },
        questions: [],
      },
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => invalidExams,
    } as Response)

    const { result } = renderHook(() => useExams())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Solo debe incluir el examen válido
    expect(result.current.exams).toHaveLength(1)
    expect(result.current.exams[0].titulo).toBe('Examen válido')
  })
})
