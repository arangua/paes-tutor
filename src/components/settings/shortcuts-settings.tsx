'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCustomizableShortcuts, ShortcutAction } from '@/hooks/useCustomizableShortcuts'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { RotateCcw, Keyboard, Save } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ShortcutsSettingsProps {
  availableActions: ShortcutAction[]
}

/**
 * Componente para configurar atajos de teclado personalizables
 * Basado en VS Code, GitHub, Linear
 */
export function ShortcutsSettings({ availableActions }: ShortcutsSettingsProps) {
  const { customShortcuts, updateShortcut, resetToDefaults, getActiveShortcuts, isLoaded } =
    useCustomizableShortcuts(availableActions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [capturedKeys, setCapturedKeys] = useState<{
    key: string
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
  } | null>(null)

  // Registrar atajos activos
  const activeShortcuts = getActiveShortcuts()
  useKeyboardShortcuts(activeShortcuts)

  const handleStartCapture = (actionId: string) => {
    setEditingId(actionId)
    setCapturing(true)
    setCapturedKeys(null)
  }

  const handleKeyCapture = useCallback(
    (e: KeyboardEvent) => {
      if (!capturing || !editingId) return

      e.preventDefault()
      e.stopPropagation()

      // Ignorar teclas especiales solas
      if (['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(e.key)) {
        return
      }

      setCapturedKeys({
        key: e.key,
        ctrl: e.ctrlKey || e.metaKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey && !e.ctrlKey,
      })
      setCapturing(false)
    },
    [capturing, editingId]
  )

  useEffect(() => {
    if (capturing) {
      window.addEventListener('keydown', handleKeyCapture)
      return () => window.removeEventListener('keydown', handleKeyCapture)
    }
  }, [capturing, handleKeyCapture])

  const handleSaveShortcut = (actionId: string) => {
    if (!capturedKeys) {
      setEditingId(null)
      return
    }

    // Verificar si el atajo ya está en uso
    const isInUse = Object.values(customShortcuts).some(
      s =>
        s.id !== actionId &&
        s.enabled &&
        s.key === capturedKeys.key &&
        s.ctrl === capturedKeys.ctrl &&
        s.shift === capturedKeys.shift &&
        s.alt === capturedKeys.alt
    )

    if (isInUse) {
      toast.error('Este atajo ya está en uso', {
        description: 'Por favor, elige otro atajo o deshabilita el existente.',
      })
      return
    }

    updateShortcut(actionId, {
      key: capturedKeys.key,
      ctrl: capturedKeys.ctrl,
      shift: capturedKeys.shift,
      alt: capturedKeys.alt,
      meta: capturedKeys.meta,
    })

    setEditingId(null)
    setCapturedKeys(null)
    toast.success('Atajo guardado correctamente')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setCapturing(false)
    setCapturedKeys(null)
  }

  const formatShortcut = (
    shortcut: ReturnType<typeof useCustomizableShortcuts>['customShortcuts'][string]
  ) => {
    if (!shortcut.key) return 'No asignado'
    const parts: string[] = []
    if (shortcut.ctrl || shortcut.meta) parts.push(shortcut.meta ? 'Cmd' : 'Ctrl')
    if (shortcut.alt) parts.push('Alt')
    if (shortcut.shift) parts.push('Shift')
    parts.push(shortcut.key.toUpperCase())
    return parts.join(' + ')
  }

  // Agrupar por categoría
  const groupedActions = availableActions.reduce(
    (acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = []
      }
      acc[action.category].push(action)
      return acc
    },
    {} as Record<string, typeof availableActions>
  )

  if (!isLoaded) {
    return <div className="text-center py-8">Cargando configuración...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Atajos de Teclado Personalizables
            </CardTitle>
            <CardDescription className="mt-2">
              Personaliza los atajos de teclado según tus preferencias. Haz clic en un atajo para
              editarlo.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(groupedActions)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(groupedActions).map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedActions).map(([category, actions]) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-4">
              {actions.map(action => {
                const shortcut = customShortcuts[action.id]
                const isEditing = editingId === action.id

                return (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label className="font-semibold">{action.name}</Label>
                        {shortcut?.enabled && shortcut.key && (
                          <Badge variant="secondary" className="text-xs">
                            {formatShortcut(shortcut)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={shortcut?.enabled ?? true}
                        onCheckedChange={enabled => updateShortcut(action.id, { enabled })}
                      />

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          {capturing ? (
                            <span className="text-sm text-muted-foreground animate-pulse">
                              Presiona las teclas...
                            </span>
                          ) : capturedKeys ? (
                            <span className="text-sm font-mono">
                              {formatShortcut({
                                ...shortcut,
                                key: capturedKeys.key,
                                ctrl: capturedKeys.ctrl,
                                shift: capturedKeys.shift,
                                alt: capturedKeys.alt,
                                meta: capturedKeys.meta,
                              })}
                            </span>
                          ) : null}
                          <Button size="sm" onClick={() => handleSaveShortcut(action.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartCapture(action.id)}
                          disabled={!shortcut?.enabled}
                        >
                          {shortcut?.key ? 'Editar' : 'Asignar'}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Dialog para capturar teclas */}
        {capturing && (
          <Dialog open={capturing} onOpenChange={() => handleCancelEdit()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Capturar Atajo</DialogTitle>
                <DialogDescription>
                  Presiona la combinación de teclas que deseas usar para esta acción.
                </DialogDescription>
              </DialogHeader>
              <div className="py-8 text-center">
                <Keyboard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Presiona las teclas...</p>
                <p className="text-sm text-muted-foreground">
                  La combinación se capturará automáticamente
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
