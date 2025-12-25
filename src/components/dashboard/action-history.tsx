'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// ScrollArea no existe, usaremos un div con overflow
import { useGlobalUndoRedo } from '@/hooks/useGlobalUndoRedo'
import { History, Clock, Undo2, Redo2, Trash2, Edit, Plus, FileText } from 'lucide-react'
// Usaremos una función nativa para formatear tiempo
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpIcon } from '@/components/help/help-icon'
import { cn } from '@/lib/utils'

/**
 * Componente para mostrar el historial de acciones recientes en el dashboard
 * Basado en Nielsen Heuristic #3: User control and freedom
 */
export function ActionHistory() {
  const { getRecentActions, historyLength, undo, redo, canUndo, canRedo } = useGlobalUndoRedo()
  const recentActions = getRecentActions(10)

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create':
        return Plus
      case 'update':
        return Edit
      case 'delete':
        return Trash2
      default:
        return FileText
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'update':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'delete':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'hace unos segundos'
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600)
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
    }
    const days = Math.floor(seconds / 86400)
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`
  }

  if (historyLength === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Historial de Acciones</CardTitle>
            </div>
            <HelpIcon
              content={
                <>
                  <strong>Historial de acciones</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Aquí verás las últimas cosas que hiciste en la plataforma. Como el historial de
                    tu navegador, pero para tus acciones dentro de la app.
                  </span>
                </>
              }
            />
          </div>
          <CardDescription>
            Tus acciones recientes aparecerán aquí para que puedas ver qué has hecho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Aún no hay acciones registradas. <br />
              Cuando realices cambios, aparecerán aquí.
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
            <History className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Historial de Acciones</CardTitle>
            <Badge variant="outline" className="ml-2">
              {historyLength}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-8 w-8"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  <strong>Deshacer</strong> (Ctrl+Z)
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Revierte tu última acción. Como en Word o Gmail.
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-8 w-8"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  <strong>Rehacer</strong> (Ctrl+Shift+Z)
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Restaura lo que deshiciste. Como el botón "adelante" en tu navegador.
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
            <HelpIcon
              content={
                <>
                  <strong>Historial de acciones</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Ve las últimas {historyLength || 0} cosas que hiciste. Útil para encontrar
                    cambios recientes o deshacer acciones.
                  </span>
                </>
              }
            />
          </div>
        </div>
        <CardDescription>
          Últimas {recentActions.length} acciones realizadas en la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto pr-2">
          <div className="space-y-2">
            {recentActions.map((action, index) => {
              const Icon = getActionIcon(action.type)
              return (
                <div
                  key={action.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    'hover:bg-muted/50',
                    index === 0 && 'bg-primary/5 border-primary/20'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-md flex-shrink-0',
                      getActionColor(action.type)
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{action.description}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {action.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(action.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

