'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { safeRound, safeAverage } from '@/app/api/notes/versions/validation-utils'

interface ProgressChartProps {
  attempts: Array<{
    porcentaje: number
    startedAt: string
    exam: {
      titulo: string
      subject: {
        codigo: string
      }
    }
  }>
}

export function ProgressChart({ attempts }: Readonly<ProgressChartProps>) {
  if (attempts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <p>No hay intentos para mostrar el progreso</p>
      </div>
    )
  }

  // Preparar datos: últimos 10 intentos ordenados por fecha
  const sortedAttempts = [...attempts]
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .slice(-10)

  const chartData = sortedAttempts.map((attempt, index) => ({
    name: `Intento ${index + 1}`,
    fecha: new Date(attempt.startedAt).toLocaleDateString('es-CL', {
      month: 'short',
      day: 'numeric',
    }),
    porcentaje: safeRound(attempt.porcentaje, 0),
    asignatura: attempt.exam.subject.codigo,
  }))

  // Calcular promedio móvil (últimos 3 intentos)
  const movingAverage = chartData.map((_, index) => {
    if (index < 2) return null
    const lastThree = chartData.slice(index - 2, index + 1)
    const avg = safeAverage(lastThree.map(d => d.porcentaje), 0)
    return safeRound(avg, 0)
  })

  const dataWithAverage = chartData.map((d, i) => ({
    ...d,
    // eslint-disable-next-line security/detect-object-injection
    promedio: movingAverage[i] ?? null, // index controlled by map loop bounds
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dataWithAverage}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={60} />
        <YAxis domain={[0, 100]} />
        <Tooltip
          formatter={(value: number | undefined) => `${value ?? 0}%`}
          labelFormatter={label => `Fecha: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="porcentaje"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Puntaje"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        {movingAverage.some(m => m !== null) && (
          <Line
            type="monotone"
            dataKey="promedio"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Promedio móvil (3 intentos)"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
