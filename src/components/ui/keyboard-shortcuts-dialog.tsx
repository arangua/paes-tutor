'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Keyboard } from 'lucide-react'
import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: KeyboardShortcut[]
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
  shortcuts,
}: KeyboardShortcutsDialogProps) {
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      const category = shortcut.category || 'otros'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(shortcut)
      return acc
    },
    {} as Record<string, KeyboardShortcut[]>
  )

  const formatKey = (shortcut: KeyboardShortcut) => {
    const parts: string[] = []
    if (shortcut.ctrl || shortcut.meta) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    parts.push(shortcut.key.toUpperCase())
    return parts.join(' + ')
  }

  const categoryNames: Record<string, string> = {
    navegación: 'Navegación',
    respuesta: 'Respuestas',
    acción: 'Acciones',
    otros: 'Otros',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atajos de Teclado
          </DialogTitle>
          <DialogDescription>
            Presiona <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> para ver esta ayuda
            en cualquier momento
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                {categoryNames[category] || category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-2">
                      {formatKey(shortcut)
                        .split(' + ')
                        .map((key, i) => (
                          <kbd
                            key={i}
                            className="px-2 py-1 bg-background border rounded text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Los atajos funcionan desde cualquier página. Presiona{' '}
            <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> para ver esta ayuda.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
