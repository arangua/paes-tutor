/**
 * Dashboard de Métricas de Validación
 * 
 * Proporciona una interfaz visual para monitorear métricas de validación
 * en tiempo real. Útil para debugging y optimización.
 */

'use client'

import { useEffect, useState } from 'react'

interface ValidationMetrics {
  counts: Record<string, number>
  averageDurations: Record<string, number>
  summary: {
    totalValidations: number
    uniqueValidationTypes: number
    averageDuration: number
    topValidations: Array<{
      name: string
      count: number
      averageDuration: number
    }>
  }
}

export default function ValidationDashboard() {
  const [metrics, setMetrics] = useState<ValidationMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notes/versions/validation-metrics') // guard:allow-secret
      if (!response.ok) {
        throw new Error('Error al obtener métricas')
      }
      const data = await response.json()
      if (data.success) {
        setMetrics(data.metrics)
        setError(null)
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const resetMetrics = async () => {
    try {
      const response = await fetch('/api/notes/versions/validation-metrics', { // guard:allow-secret
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchMetrics()
      }
    } catch (err) {
      console.error('Error al resetear métricas:', err)
    }
  }

  useEffect(() => {
    fetchMetrics()

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 5000) // Actualizar cada 5 segundos
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando métricas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchMetrics}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Métricas de Validación</h1>
            <p className="mt-2 text-gray-600">
              Monitoreo en tiempo real del sistema de validación centralizado
            </p>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                name="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Auto-refresh</span>
            </label>
            <button
              onClick={fetchMetrics}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Actualizar
            </button>
            <button
              onClick={resetMetrics}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Resetear
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {metrics && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Validaciones</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.summary.totalValidations.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tipos Únicos</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.summary.uniqueValidationTypes}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Duración Promedio</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.summary.averageDuration.toFixed(2)}ms
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Última Actualización</h3>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Top Validations */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Top 10 Validaciones Más Frecuentes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conteo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración Promedio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiempo Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.summary.topValidations.map((validation, index) => (
                      <tr key={validation.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm font-mono text-gray-900">{validation.name}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {validation.count.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {validation.averageDuration.toFixed(2)}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(validation.count * validation.averageDuration).toFixed(2)}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All Validations */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Todas las Validaciones</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conteo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración Promedio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(metrics.counts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([name, count], index) => (
                        <tr key={name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-sm font-mono text-gray-900">{name}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metrics.averageDurations[name]?.toFixed(2) || '0.00'}ms
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

