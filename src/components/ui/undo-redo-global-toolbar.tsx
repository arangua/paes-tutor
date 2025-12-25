'use client'

import { Button } from '@/components/ui/button'
import { Undo2, Redo2, History } from 'lucide-react'
import { useGlobalUndoRedo } from '@/hooks/useGlobalUndoRedo'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

/**
 * Toolbar global para undo/redo
 * Basado en estándares de Google Docs, Figma
 */
export function GlobalUndoRedoToolbar() {
  const { undo, redo, canUndo, canRedo, getRecentActions, historyLength } = useGlobalUndoRedo()
  const recentActions = getRecentActions(10)

  return (
    <div className="flex items-center gap-1">
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
              Revierte cambios en toda la app. Funciona como el "deshacer" de Google Docs.
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
              Restaura lo que deshiciste. Como el botón "adelante" en tu navegador web.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>

      {historyLength > 0 && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <History className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                <strong>Historial de acciones</strong>
                <br />
                <span className="text-muted-foreground text-xs">
                  Ve las últimas {historyLength || 0} cosas que hiciste. Útil para encontrar
                  cambios recientes.
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              Historial reciente
              <Badge variant="outline" className="ml-2">
                {historyLength}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentActions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay acciones recientes
              </div>
            ) : (
              recentActions.map((action, idx) => (
                <DropdownMenuItem key={action.id} className="flex flex-col items-start gap-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{action.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {action.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {action.type}
                  </Badge>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
