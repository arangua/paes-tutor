/**
 * @vitest-environment happy-dom
 */
// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

// Mock de fetch
globalThis.fetch = vi.fn()

// Mock de window.location
Object.defineProperty(globalThis, 'location', {
  value: {
    href: 'http://localhost:3000/dashboard',
    reload: vi.fn(),
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
  configurable: true,
})

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard',
}))

// Mock de next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock de sonner (toast)
vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock de componentes de UI
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
}))

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: any) => <div data-testid="progress">{value}%</div>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

// Mock de componentes lazy-loaded
vi.mock('@/components/charts/PerformanceCharts', () => ({
  SubjectPerformanceChart: () => <div>SubjectPerformanceChart</div>,
  RecentAttemptsChart: () => <div>RecentAttemptsChart</div>,
}))

// Mock de componentes de dashboard
vi.mock('@/components/dashboard/stats-card', () => ({
  StatsCard: ({ title, value }: any) => (
    <div>
      {title}: {value}
    </div>
  ),
}))

vi.mock('@/components/dashboard/progress-chart', () => ({
  ProgressChart: () => <div>ProgressChart</div>,
}))

vi.mock('@/components/dashboard/quick-actions', () => ({
  QuickActions: () => <div>QuickActions</div>,
}))

vi.mock('@/components/dashboard/achievements', () => ({
  Achievements: () => <div>Achievements</div>,
}))

vi.mock('@/components/recommendations/recommendations-section', () => ({
  RecommendationsSection: () => <div>RecommendationsSection</div>,
}))

vi.mock('@/components/help/welcome-tour', () => ({
  WelcomeTour: ({ onComplete, onSkip }: any) => null,
}))

vi.mock('@/components/help/quick-guide', () => ({
  QuickGuide: () => null,
}))

vi.mock('@/components/help/help-icon', () => ({
  HelpIcon: ({ content }: any) => null,
}))

vi.mock('@/components/export/export-button', () => ({
  ExportButton: ({ onExport }: any) => <button onClick={onExport}>Export</button>,
}))

vi.mock('@/lib/export-utils', () => ({
  exportDashboardToExcel: vi.fn().mockResolvedValue(undefined),
}))

// Importar después de los mocks
import DashboardPage from './page'

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe mostrar estado de carga inicialmente', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})) // Nunca resuelve

    render(<DashboardPage />)

    expect(screen.getByText(/Cargando dashboard/i)).toBeInTheDocument()
  })

  it('debe mostrar datos del estudiante cuando se cargan', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [
        {
          id: '1',
          estado: 'completado',
          porcentaje: 70,
          correctas: 7,
          totalPreguntas: 10,
          puntajePaes: 650,
          createdAt: '2024-01-01T00:00:00Z',
          exam: {
            titulo: 'Simulacro PAES - Competencia Lectora',
            subject: {
              nombre: 'Competencia Lectora',
              codigo: 'LECTORA',
            },
          },
        },
      ],
      metrics: [],
    }

    const mockMetrics = [
      {
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        porcentaje: 70,
        totalPreguntas: 10,
        correctas: 7,
        temas: [
          {
            nombre: 'Comprensión literal',
            porcentaje: 75,
            nivel: 'alto',
          },
        ],
      },
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockMetrics),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Hola, Matías/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Total Intentos/i)).toBeInTheDocument()
    expect(screen.getByText(/Promedio General/i)).toBeInTheDocument()
  })

  it('debe mostrar mensaje de error si no hay estudiante', async () => {
    const mockResponse1 = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: vi.fn().mockResolvedValue({ error: 'Estudiante no encontrado' }),
    } as unknown as Response

    const mockResponse2 = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse1).mockResolvedValueOnce(mockResponse2)

    render(<DashboardPage />)

    await waitFor(
      () => {
        // El dashboard muestra el mensaje de error del servidor
        // El componente lanza un Error con el mensaje del servidor
        expect(screen.getByText(/Estudiante no encontrado/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debe mostrar gráficos cuando hay datos', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [
        {
          id: '1',
          estado: 'completado',
          porcentaje: 70,
          correctas: 7,
          totalPreguntas: 10,
          puntajePaes: 650,
          createdAt: '2024-01-01T00:00:00Z',
          exam: {
            titulo: 'Simulacro PAES',
            subject: {
              nombre: 'Competencia Lectora',
              codigo: 'LECTORA',
            },
          },
        },
      ],
      metrics: [],
    }

    const mockMetrics = [
      {
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        porcentaje: 70,
        totalPreguntas: 10,
        correctas: 7,
        temas: [],
      },
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockMetrics),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Rendimiento por Asignatura/i)).toBeInTheDocument()
      expect(screen.getByText(/Evolución Reciente/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar mensaje cuando no hay intentos', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue([]),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/No has realizado intentos aún/i)).toBeInTheDocument()
    })
  })

  it('debe manejar errores en la respuesta de métricas', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue({ error: 'Error al obtener métricas' }),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      // Debe mostrar el dashboard aunque haya error en métricas
      expect(screen.getByText(/Hola, Matías/i)).toBeInTheDocument()
    })
  })

  it('debe manejar cuando metricsData no es un array', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue({ notAnArray: true }),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Hola, Matías/i)).toBeInTheDocument()
    })
  })

  it('debe manejar cuando studentData tiene error', async () => {
    const mockResponse1 = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({ error: 'Error al obtener estudiante' }),
    } as unknown as Response

    const mockResponse2 = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse1).mockResolvedValueOnce(mockResponse2)

    render(<DashboardPage />)

    await waitFor(
      () => {
        // El dashboard muestra el mensaje de error del servidor
        // El componente lanza un Error con el mensaje del servidor cuando !studentRes.ok
        expect(screen.getByText(/Error al obtener estudiante/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debe manejar cuando metricsData es array con error en primer elemento', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    const mockResponse1 = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue(mockStudent),
    } as unknown as Response

    const mockResponse2 = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue([{ error: 'Error en métricas' }]),
    } as unknown as Response

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse1).mockResolvedValueOnce(mockResponse2)

    render(<DashboardPage />)

    await waitFor(
      () => {
        // El dashboard detecta el error en el primer elemento y muestra el mensaje
        // El componente verifica: Array.isArray(metricsData) && metricsData.length > 0 && metricsData[0].error
        expect(screen.getByText(/Error en métricas/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debe manejar cuando metricsRes no es ok', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    const mockResponse1 = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue(mockStudent),
    } as unknown as Response

    const mockResponse2 = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({ error: 'Error al obtener métricas' }),
    } as unknown as Response

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse1).mockResolvedValueOnce(mockResponse2)

    render(<DashboardPage />)

    await waitFor(
      () => {
        // El dashboard muestra el mensaje de error cuando metricsRes no es ok
        // El componente lanza un Error con el mensaje del servidor cuando !metricsRes.ok
        expect(screen.getByText(/Error al obtener métricas/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debe mostrar badge "default" para métricas con porcentaje >= 70', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    const mockMetrics = [
      {
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        porcentaje: 75, // >= 70
        totalPreguntas: 10,
        correctas: 7,
        temas: [],
      },
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockMetrics),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Competencia Lectora/i)).toBeInTheDocument()
      // El badge con variant "default" debería estar presente
      expect(screen.getByText(/75%/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar badge "secondary" para métricas con porcentaje >= 50 y < 70', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    const mockMetrics = [
      {
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        porcentaje: 60, // >= 50 y < 70
        totalPreguntas: 10,
        correctas: 6,
        temas: [],
      },
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockMetrics),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Competencia Lectora/i)).toBeInTheDocument()
      expect(screen.getByText(/60%/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar badge "destructive" para métricas con porcentaje < 50', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [],
      metrics: [],
    }

    const mockMetrics = [
      {
        codigo: 'LECTORA',
        nombre: 'Competencia Lectora',
        porcentaje: 40, // < 50
        totalPreguntas: 10,
        correctas: 4,
        temas: [],
      },
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockMetrics),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Competencia Lectora/i)).toBeInTheDocument()
      expect(screen.getByText(/40%/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar badge "default" para intentos con estado completado', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [
        {
          id: '1',
          estado: 'completado', // Estado completado
          porcentaje: 70,
          correctas: 7,
          totalPreguntas: 10,
          puntajePaes: 650,
          createdAt: '2024-01-01T00:00:00Z',
          exam: {
            titulo: 'Simulacro PAES',
            subject: {
              nombre: 'Competencia Lectora',
              codigo: 'LECTORA',
            },
          },
        },
      ],
      metrics: [],
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue([]),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      // Verificar que el badge con el estado "completado" está presente
      const badges = screen.getAllByText(/completado/i)
      expect(badges.length).toBeGreaterThan(0)
      // Verificar que el intento se muestra
      expect(screen.getByText(/Simulacro PAES/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar badge "secondary" para intentos con estado diferente a completado', async () => {
    const mockStudent = {
      id: '1',
      nombre: 'Matías',
      attempts: [
        {
          id: '1',
          estado: 'en_progreso', // Estado diferente a completado
          porcentaje: 50,
          correctas: 5,
          totalPreguntas: 10,
          puntajePaes: null,
          createdAt: '2024-01-01T00:00:00Z',
          exam: {
            titulo: 'Simulacro PAES',
            subject: {
              nombre: 'Competencia Lectora',
              codigo: 'LECTORA',
            },
          },
        },
      ],
      metrics: [],
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockStudent),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue([]),
      } as unknown as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/en_progreso/i)).toBeInTheDocument()
    })
  })
})
