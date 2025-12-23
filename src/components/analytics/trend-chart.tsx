'use client'

import { useMemo } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TrendData {
  date: string
  percentage: number
  examTitle: string
  subjectName: string
}

interface TrendChartProps {
  data: TrendData[]
  className?: string
}

export function TrendChart({ data, className }: TrendChartProps) {
  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      name: `Intento ${index + 1}`,
      date: new Date(item.date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
      porcentaje: Math.round(item.percentage * 10) / 10,
      fullDate: item.date,
    }))
  }, [data])

  // Calcular promedio móvil (últimos 3 puntos)
  const dataWithAverage = useMemo(() => {
    return chartData.map((item, index) => {
      if (index < 2) {
        return { ...item, promedio: item.porcentaje }
      }

      const lastThree = chartData.slice(Math.max(0, index - 2), index + 1)
      const avg = lastThree.reduce((sum, d) => sum + d.porcentaje, 0) / lastThree.length

      return {
        ...item,
        promedio: Math.round(avg * 10) / 10,
      }
    })
  }, [chartData])

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tendencias a Largo Plazo</CardTitle>
          <CardDescription>Evolución de tu rendimiento en el tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No hay suficientes datos para mostrar tendencias</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Tendencias a Largo Plazo</CardTitle>
        <CardDescription>
          Evolución de tu rendimiento en el tiempo ({data.length} intentos)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataWithAverage}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
            <YAxis
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}%`, '']}
              labelFormatter={label => `Fecha: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="porcentaje"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Rendimiento"
            />
            <Line
              type="monotone"
              dataKey="promedio"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Promedio Móvil (3)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
