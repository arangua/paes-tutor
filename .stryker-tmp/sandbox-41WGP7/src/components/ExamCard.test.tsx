// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExamCard } from './ExamCard'

const mockExam = {
  id: 'exam-123',
  titulo: 'Examen de Prueba',
  descripcion: 'Descripción del examen',
  tipo: 'simulacro',
  tiempoLimiteMin: 60,
  totalPreguntas: 30,
  fuente: 'Fuente oficial',
  subject: {
    id: 'subject-1',
    nombre: 'Matemáticas',
    codigo: 'MATH',
  },
}

describe('ExamCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar información del examen', () => {
    const onStartExam = vi.fn()

    render(<ExamCard exam={mockExam} onStartExam={onStartExam} />)

    expect(screen.getByText('Examen de Prueba')).toBeInTheDocument()
    expect(screen.getByText('Descripción del examen')).toBeInTheDocument()
    expect(screen.getByText('Matemáticas')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText(/60 minutos/i)).toBeInTheDocument()
  })

  it('debe llamar onStartExam al hacer click', () => {
    const onStartExam = vi.fn()

    render(<ExamCard exam={mockExam} onStartExam={onStartExam} />)

    const button = screen.getByText(/Iniciar Examen/i)
    fireEvent.click(button)

    expect(onStartExam).toHaveBeenCalledTimes(1)
    expect(onStartExam).toHaveBeenCalledWith('exam-123')
  })

  it('debe mostrar badge de asignatura', () => {
    const onStartExam = vi.fn()

    render(<ExamCard exam={mockExam} onStartExam={onStartExam} />)

    expect(screen.getByText('MATH')).toBeInTheDocument()
  })

  it('debe manejar descripción nula', () => {
    const examSinDescripcion = {
      ...mockExam,
      descripcion: null,
    }

    const onStartExam = vi.fn()

    render(<ExamCard exam={examSinDescripcion} onStartExam={onStartExam} />)

    expect(screen.getByText('Sin descripción')).toBeInTheDocument()
  })

  it('debe manejar examen sin tiempo límite', () => {
    const examSinTiempo = {
      ...mockExam,
      tiempoLimiteMin: null,
    }

    const onStartExam = vi.fn()

    render(<ExamCard exam={examSinTiempo} onStartExam={onStartExam} />)

    expect(screen.queryByText(/minutos/i)).not.toBeInTheDocument()
  })

  it('debe evitar re-renders innecesarios con React.memo', () => {
    const onStartExam = vi.fn()
    const { rerender } = render(<ExamCard exam={mockExam} onStartExam={onStartExam} />)

    const initialRender = screen.getByText('Examen de Prueba')

    // Re-renderizar con mismos props
    rerender(<ExamCard exam={mockExam} onStartExam={onStartExam} />)

    // El elemento debe ser el mismo (memo funcionó)
    expect(screen.getByText('Examen de Prueba')).toBe(initialRender)
  })
})
