'use client'

import { useState, useEffect, startTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Keyboard, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const EXPERT_MODE_KEY = 'paes-tutor-expert-mode'

interface ExpertModeSettings {
  enabled: boolean
  showAllShortcuts: boolean
  compactView: boolean
  advancedFeatures: boolean
  quickActions: boolean
}

/**
 * Componente de configuración de modo experto
 * Basado en estándares de VS Code, GitHub, Linear
 */
export function ExpertMode() {
  // Inicializar con valores por defecto para que servidor y cliente rendericen lo mismo
  const defaultSettings: ExpertModeSettings = {
    enabled: false,
    showAllShortcuts: false,
    compactView: false,
    advancedFeatures: false,
    quickActions: false,
  }

  const [settings, setSettings] = useState<ExpertModeSettings>(defaultSettings)

  // Cargar configuración desde localStorage solo después del montaje
  useEffect(() => {
    // Usar startTransition para evitar renders en cascada
    startTransition(() => {
      try {
        const saved = localStorage.getItem(EXPERT_MODE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as ExpertModeSettings
          setSettings(parsed)
        }
      } catch {
        // Ignorar errores
      }
    })
  }, [])

  // Guardar configuración
  const saveSettings = (newSettings: ExpertModeSettings) => {
    setSettings(newSettings)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(EXPERT_MODE_KEY, JSON.stringify(newSettings))
        toast.success('Configuración guardada')
      } catch {
        toast.error('Error al guardar configuración')
      }
    }
  }

  const toggleSetting = (key: keyof ExpertModeSettings) => {
     
    const newSettings = { ...settings, [key]: !settings[key] } // key validated via keyof ExpertModeSettings
    // Si se desactiva el modo experto, desactivar todas las opciones
    if (key === 'enabled' && !newSettings.enabled) {
      newSettings.showAllShortcuts = false
      newSettings.compactView = false
      newSettings.advancedFeatures = false
      newSettings.quickActions = false
    }
    saveSettings(newSettings)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Modo Experto</CardTitle>
              <CardDescription>
                Activa funciones avanzadas para usuarios experimentados
              </CardDescription>
            </div>
          </div>
          <Badge variant={settings.enabled ? 'default' : 'outline'}>
            {settings.enabled ? 'Activado' : 'Desactivado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle principal */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <Label htmlFor="expert-mode" className="text-base font-semibold cursor-pointer">
                Activar Modo Experto
              </Label>
              <p className="text-sm text-muted-foreground">
                Desbloquea funciones avanzadas y atajos adicionales
              </p>
            </div>
          </div>
          <Switch
            id="expert-mode"
            checked={settings.enabled}
            onCheckedChange={() => toggleSetting('enabled')}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4 pt-4 border-t">
            {/* Mostrar todos los atajos */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="show-shortcuts" className="cursor-pointer">
                    Mostrar todos los atajos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Muestra atajos avanzados en tooltips y ayuda
                  </p>
                </div>
              </div>
              <Switch
                id="show-shortcuts"
                checked={settings.showAllShortcuts}
                onCheckedChange={() => toggleSetting('showAllShortcuts')}
              />
            </div>

            {/* Vista compacta */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="compact-view" className="cursor-pointer">
                    Vista compacta
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce espaciado para mostrar más información
                  </p>
                </div>
              </div>
              <Switch
                id="compact-view"
                checked={settings.compactView}
                onCheckedChange={() => toggleSetting('compactView')}
              />
            </div>

            {/* Funciones avanzadas */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="advanced-features" className="cursor-pointer">
                    Funciones avanzadas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Habilita opciones experimentales y avanzadas
                  </p>
                </div>
              </div>
              <Switch
                id="advanced-features"
                checked={settings.advancedFeatures}
                onCheckedChange={() => toggleSetting('advancedFeatures')}
              />
            </div>

            {/* Acciones rápidas */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="quick-actions" className="cursor-pointer">
                    Acciones rápidas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Muestra botones de acción rápida en más lugares
                  </p>
                </div>
              </div>
              <Switch
                id="quick-actions"
                checked={settings.quickActions}
                onCheckedChange={() => toggleSetting('quickActions')}
              />
            </div>
          </div>
        )}

        {/* Información */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <p className="text-sm text-muted-foreground">
            El modo experto está diseñado para usuarios que conocen bien la plataforma. Algunas
            funciones pueden requerir conocimiento técnico adicional.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Hook para usar configuración de modo experto
 */
export function useExpertMode() {
  // Inicializar con valores por defecto para evitar problemas de hidratación
  const defaultSettings: ExpertModeSettings = {
    enabled: false,
    showAllShortcuts: false,
    compactView: false,
    advancedFeatures: false,
    quickActions: false,
  }

  const [settings, setSettings] = useState<ExpertModeSettings | null>(defaultSettings)

  // Cargar configuración desde localStorage solo después del montaje
  useEffect(() => {
    // Usar startTransition para evitar renders en cascada
    startTransition(() => {
      try {
        const saved = localStorage.getItem(EXPERT_MODE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as ExpertModeSettings
          setSettings(parsed)
        }
      } catch {
        // Ignorar errores
      }
    })
  }, [])

  return settings
}

