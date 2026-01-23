/**
 * Tests Enterprise para Transformación de Puntajes
 * 
 * Cobertura completa de funciones de transformación entre escalas (NEM, PAES, PSU, PDT)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  transformarPuntaje,
  transformarNEM,
  transformarPSUaPAES,
  transformarPDTaPAES,
  obtenerTransformaciones,
  type TipoTransformacion,
} from './score-transformation'
import { prisma } from '@/lib/prisma'

// Mock de prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    scoreTransformation: {
      findMany: vi.fn(),
    },
  },
}))

describe('transformarPuntaje', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar null si no hay transformaciones disponibles', async () => {
    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue([])

    const resultado = await transformarPuntaje(600, 'NEM', '2026')

    expect(resultado).toBeNull()
  })

  it('debe retornar el valor exacto si coincide con valorOrigen', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await transformarPuntaje(600, 'NEM', '2026')

    expect(resultado).toBe(650)
  })

  it('debe usar interpolación lineal entre dos valores', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 500,
        valorDestino: 550,
        activa: true,
      },
      {
        id: 't2',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    // Valor 550 está entre 500 y 600
    // Interpolación: 550 + (550-500)/(600-500) * (650-550) = 550 + 0.5 * 100 = 600
    const resultado = await transformarPuntaje(550, 'NEM', '2026')

    expect(resultado).toBeCloseTo(600, 1)
  })

  it('debe usar el último valor si el valor es mayor que todos', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 500,
        valorDestino: 550,
        activa: true,
      },
      {
        id: 't2',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    // Valor 700 es mayor que todos los valores
    // Debe usar interpolación con el último valor
    const resultado = await transformarPuntaje(700, 'NEM', '2026')

    // Interpolación: 550 + (700-500)/(600-500) * (650-550) = 550 + 2 * 100 = 750
    expect(resultado).toBeCloseTo(750, 1)
  })

  it('debe usar el primer valor si el valor es menor que todos', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 500,
        valorDestino: 550,
        activa: true,
      },
      {
        id: 't2',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    // Valor 400 es menor que todos los valores
    // Debe usar el primer valor que sea >= 400, que es 500
    const resultado = await transformarPuntaje(400, 'NEM', '2026')

    expect(resultado).toBe(550) // valorDestino del primer valor
  })

  it('debe filtrar por tipo correctamente', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    await transformarPuntaje(600, 'NEM', '2026')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'NEM',
        proceso: '2026',
        prueba: null,
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })
  })

  it('debe filtrar por proceso correctamente', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    await transformarPuntaje(600, 'NEM', '2025')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'NEM',
        proceso: '2025',
        prueba: null,
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })
  })

  it('debe filtrar por prueba correctamente', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'PSU_TO_PAES' as TipoTransformacion,
        proceso: '2026',
        prueba: 'MAT',
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    await transformarPuntaje(600, 'PSU_TO_PAES', '2026', 'MAT')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'PSU_TO_PAES',
        proceso: '2026',
        prueba: 'MAT',
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })
  })

  it('debe manejar valores duplicados en valorOrigen', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 500,
        valorDestino: 550,
        activa: true,
      },
      {
        id: 't2',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 500, // Mismo valor que el anterior
        valorDestino: 600,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    // Si hay valores duplicados, debe usar el primero que encuentre (índice 0)
    // Como diferenciaOrigen será 0, retorna el valorDestino del transformacion actual
    const resultado = await transformarPuntaje(500, 'NEM', '2026')

    // Debe usar el primer valor que encuentre (500 -> 550)
    expect(resultado).toBe(550)
  })

  it('debe manejar valores negativos correctamente', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: -100,
        valorDestino: 0,
        activa: true,
      },
      {
        id: 't2',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 0,
        valorDestino: 100,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await transformarPuntaje(-50, 'NEM', '2026')

    // Interpolación entre -100 y 0
    expect(resultado).toBeCloseTo(50, 1)
  })

  it('debe retornar null si no hay transformación anterior para interpolación', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    // Si no hay transformación anterior (indice 0), debe retornar el valorDestino
    const resultado = await transformarPuntaje(550, 'NEM', '2026')

    expect(resultado).toBe(650)
  })
})

describe('transformarNEM', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe transformar NEM a escala PAES', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await transformarNEM(600, '2026')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'NEM',
        proceso: '2026',
        prueba: null,
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })

    expect(resultado).toBe(650)
  })

  it('debe usar proceso por defecto si no se especifica', async () => {
    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue([])

    await transformarNEM(600)

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'NEM',
        proceso: null,
        prueba: null,
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })
  })
})

describe('transformarPSUaPAES', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe transformar puntaje PSU a PAES', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'PSU_TO_PAES' as TipoTransformacion,
        proceso: '2026',
        prueba: 'MAT',
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await transformarPSUaPAES(600, 'MAT', '2026')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'PSU_TO_PAES',
        proceso: '2026',
        prueba: 'MAT',
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })

    expect(resultado).toBe(650)
  })

  it('debe usar proceso por defecto si no se especifica', async () => {
    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue([])

    await transformarPSUaPAES(600, 'MAT')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'PSU_TO_PAES',
        proceso: null,
        prueba: 'MAT',
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })
  })
})

describe('transformarPDTaPAES', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe transformar puntaje PDT a PAES', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'PDT_TO_PAES' as TipoTransformacion,
        proceso: '2026',
        prueba: 'MAT',
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await transformarPDTaPAES(600, 'MAT', '2026')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'PDT_TO_PAES',
        proceso: '2026',
        prueba: 'MAT',
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })

    expect(resultado).toBe(650)
  })

  it('debe usar proceso por defecto si no se especifica', async () => {
    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue([])

    await transformarPDTaPAES(600, 'MAT')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'PDT_TO_PAES',
        proceso: null,
        prueba: 'MAT',
        activa: true,
      },
      orderBy: {
        valorOrigen: 'asc',
      },
    })
  })
})

describe('obtenerTransformaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe obtener todas las transformaciones activas', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
      {
        id: 't2',
        tipo: 'PSU_TO_PAES' as TipoTransformacion,
        proceso: '2026',
        prueba: 'MAT',
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await obtenerTransformaciones()

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        activa: true,
      },
      orderBy: [
        { tipo: 'asc' },
        { valorOrigen: 'asc' },
      ],
    })

    expect(resultado).toEqual(transformacionesMock)
  })

  it('debe filtrar por tipo si se especifica', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await obtenerTransformaciones('NEM')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'NEM',
        activa: true,
      },
      orderBy: [
        { tipo: 'asc' },
        { valorOrigen: 'asc' },
      ],
    })

    expect(resultado).toEqual(transformacionesMock)
  })

  it('debe filtrar por proceso si se especifica', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await obtenerTransformaciones(undefined, '2026')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        proceso: '2026',
        activa: true,
      },
      orderBy: [
        { tipo: 'asc' },
        { valorOrigen: 'asc' },
      ],
    })

    expect(resultado).toEqual(transformacionesMock)
  })

  it('debe filtrar por tipo y proceso si ambos se especifican', async () => {
    const transformacionesMock = [
      {
        id: 't1',
        tipo: 'NEM' as TipoTransformacion,
        proceso: '2026',
        prueba: null,
        valorOrigen: 600,
        valorDestino: 650,
        activa: true,
      },
    ]

    vi.mocked(prisma.scoreTransformation.findMany).mockResolvedValue(
      transformacionesMock as any
    )

    const resultado = await obtenerTransformaciones('NEM', '2026')

    expect(prisma.scoreTransformation.findMany).toHaveBeenCalledWith({
      where: {
        tipo: 'NEM',
        proceso: '2026',
        activa: true,
      },
      orderBy: [
        { tipo: 'asc' },
        { valorOrigen: 'asc' },
      ],
    })

    expect(resultado).toEqual(transformacionesMock)
  })
})

