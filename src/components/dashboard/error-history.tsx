'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// ScrollArea no existe, usaremos un div con overflow
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Wifi,
  Shield,
  Database,
  Settings,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { useErrorHistory, UserError } from '@/hooks/useErrorHistory'
import { HelpIcon } from '@/components/help/help-icon'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Componente para mostrar el historial de errores del usuario
 * Basado en Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 */
export function ErrorHistory() {
  const { errors, unresolvedErrors, markAsResolved, clearHistory, stats } = useErrorHistory()
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  const getCategoryIcon = (category: UserError['category']) => {
    switch (category) {
      case 'validation':
        return FileText
      case 'network':
        return Wifi
      case 'permission':
        return Shield
      case 'data':
        return Database
      case 'system':
        return Settings
      default:
        return AlertCircle
    }
  }

  const getCategoryColor = (category: UserError['category']) => {
    switch (category) {
      case 'validation':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'network':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'permission':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'data':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'system':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getSeverityColor = (severity: UserError['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white'
      case 'high':
        return 'bg-orange-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      const now = new Date()
      const date = new Date(timestamp)
      const diffMs = now.getTime() - date.getTime()
      const diffSecs = Math.floor(diffMs / 1000)
      const diffMins = Math.floor(diffSecs / 60)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffSecs < 60) return 'Hace un momento'
      if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
      if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    } catch {
      return 'Hace un momento'
    }
  }

  // Filtrar errores
  const filteredErrors = errors.filter(error => {
    if (filter === 'unresolved' && error.resolved) return false
    if (filter === 'resolved' && !error.resolved) return false
    if (categoryFilter !== 'all' && error.category !== categoryFilter) return false
    if (severityFilter !== 'all' && error.severity !== severityFilter) return false
    return true
  })

  if (errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle>Historial de Errores</CardTitle>
            </div>
            <HelpIcon
              content={
                <>
                  <strong>Historial de errores</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Aquí verás un registro de los errores que has experimentado, con información
                    sobre cómo resolverlos. Como un registro médico, pero para problemas técnicos.
                  </span>
                </>
              }
            />
          </div>
          <CardDescription>No has experimentado errores recientemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              ¡Excelente! No hay errores registrados en tu historial.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Historial de Errores</CardTitle>
            {unresolvedErrors.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unresolvedErrors.length} sin resolver
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <HelpIcon
              content={
                <>
                  <strong>Historial de errores</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Registro de errores que has experimentado, con soluciones sugeridas. Puedes
                    marcar errores como resueltos cuando los hayas solucionado.
                  </span>
                </>
              }
            />
            {errors.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Limpiar
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          {stats.total} error{stats.total !== 1 ? 'es' : ''} registrado
          {stats.total !== 1 ? 's' : ''} • {stats.unresolved} sin resolver
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter as (value: string) => void}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unresolved">Sin resolver</SelectItem>
                <SelectItem value="resolved">Resueltos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="validation">Validación</SelectItem>
                <SelectItem value="network">Red</SelectItem>
                <SelectItem value="permission">Permisos</SelectItem>
                <SelectItem value="data">Datos</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de errores */}
          <div className="h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {filteredErrors.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
                  No hay errores que coincidan con los filtros seleccionados.
                </div>
              ) : (
                filteredErrors.map(error => {
                  const CategoryIcon = getCategoryIcon(error.category)
                  return (
                    <div
                      key={error.id}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                        'hover:bg-muted/50',
                        error.resolved && 'opacity-60',
                        error.severity === 'critical' && 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20',
                        error.severity === 'high' && 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20'
                      )}
                    >
                      <div
                        className={cn(
                          'p-2 rounded-md flex-shrink-0',
                          getCategoryColor(error.category)
                        )}
                      >
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium leading-tight">{error.title}</p>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', getCategoryColor(error.category))}
                            >
                              {error.category}
                            </Badge>
                            <Badge className={cn('text-xs', getSeverityColor(error.severity))}>
                              {error.severity}
                            </Badge>
                            {error.resolved && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Resuelto
                              </Badge>
                            )}
                          </div>
                          {!error.resolved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsResolved(error.id)}
                              className="h-7 w-7 p-0"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{error.description}</p>
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded p-2 mb-2">
                          <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">
                            Solución:
                          </p>
                          <p className="text-xs text-blue-800 dark:text-blue-400">
                            {error.solution}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(error.timestamp)}
                          </div>
                          {error.path && (
                            <div className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {error.path}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

