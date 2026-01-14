'use client'

import { Button } from '@/components/ui/button'
import { Undo2, Redo2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface UndoRedoToolbarProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  className?: string
}

export function UndoRedoToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  className,
}: UndoRedoToolbarProps) {
  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Deshacer"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Deshacer</strong> (Ctrl+Z)
            <br />
            <span className="text-muted-foreground text-xs">
              Como en Word o Gmail, revierte tu última acción. Útil si borraste algo por error.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Rehacer"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Rehacer</strong> (Ctrl+Shift+Z)
            <br />
            <span className="text-muted-foreground text-xs">
              Recupera lo que acabas de deshacer. Como el botón &quot;adelante&quot; en tu navegador.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
