'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Loader2,
  Bot,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Info,
} from 'lucide-react'
import { HelpIcon } from '@/components/help/help-icon'
import { TIME_CONSTANTS } from '@/lib/constants'

interface AIKeysData {
  openaiApiKey: string
  anthropicApiKey: string
  geminiApiKey: string
  preferredAIService: string | null
  hasOpenAI: boolean
  hasAnthropic: boolean
  hasGemini: boolean
}

export function AIKeysForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current)
      }
    }
  }, [])

  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
  })

  const [formData, setFormData] = useState<AIKeysData>({
    openaiApiKey: '',
    anthropicApiKey: '',
    geminiApiKey: '',
    preferredAIService: null,
    hasOpenAI: false,
    hasAnthropic: false,
    hasGemini: false,
  })

  useEffect(() => {
    loadKeys()
  }, [])

  const loadKeys = async () => {
    try {
      setLoadingData(true)
      const res = await fetch('/api/user/ai-keys')

      if (!res.ok) {
        throw new Error('Error al cargar configuración')
      }

      const data = await res.json()
      setFormData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch('/api/user/ai-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openaiApiKey: formData.openaiApiKey || null,
          anthropicApiKey: formData.anthropicApiKey || null,
          geminiApiKey: formData.geminiApiKey || null,
          preferredAIService: formData.preferredAIService || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar configuración')
      }

      setSaved(true)
      // Recargar datos para mostrar keys enmascaradas
      await loadKeys()
      // Limpiar campos de entrada
      setFormData(prev => ({
        ...prev,
        openaiApiKey: '',
        anthropicApiKey: '',
        geminiApiKey: '',
      }))

      // Limpiar timeout anterior si existe
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current)
      }
      savedTimeoutRef.current = setTimeout(
        () => setSaved(false),
        TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async (service: 'openai' | 'anthropic' | 'gemini') => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/user/ai-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [`${service}ApiKey`]: null,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al eliminar API key')
      }

      await loadKeys()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Configuración de Servicios de IA
          </CardTitle>
          <HelpIcon content="Puedes usar las API keys de tus cuentas existentes (ChatGPT Plus, Claude Pro, Gemini) sin costo adicional. Las keys se almacenan de forma encriptada." />
        </div>
        <CardDescription>
          Configura tus API keys para usar ChatGPT, Claude o Gemini con tus cuentas existentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>¿Cómo obtener tus API Keys?</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="text-sm">
              Puedes usar las API keys de tus cuentas existentes (ChatGPT Plus, Claude Pro, Gemini)
              sin costo adicional:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>
                <strong>Claude:</strong>{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Obtener API Key <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <strong>ChatGPT:</strong>{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Obtener API Key <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <strong>Gemini:</strong>{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Obtener API Key <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Las API keys se almacenan de forma encriptada y solo tú puedes verlas.
            </p>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OpenAI (ChatGPT) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="openaiApiKey">OpenAI API Key (ChatGPT)</Label>
              {formData.hasOpenAI && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClear('openai')}
                  disabled={loading}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="openaiApiKey"
                  type={showKeys.openai ? 'text' : 'password'}
                  placeholder={formData.hasOpenAI ? '••••••••••••' : 'sk-...'}
                  value={formData.openaiApiKey}
                  onChange={e => setFormData(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  disabled={loading}
                />
                {formData.hasOpenAI && !formData.openaiApiKey && (
                  <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                disabled={loading}
              >
                {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.hasOpenAI && (
              <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p>
            )}
          </div>

          {/* Anthropic (Claude) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="anthropicApiKey">Anthropic API Key (Claude)</Label>
              {formData.hasAnthropic && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClear('anthropic')}
                  disabled={loading}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="anthropicApiKey"
                  type={showKeys.anthropic ? 'text' : 'password'}
                  placeholder={formData.hasAnthropic ? '••••••••••••' : 'sk-ant-...'}
                  value={formData.anthropicApiKey}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, anthropicApiKey: e.target.value }))
                  }
                  disabled={loading}
                />
                {formData.hasAnthropic && !formData.anthropicApiKey && (
                  <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
                disabled={loading}
              >
                {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.hasAnthropic && (
              <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p>
            )}
          </div>

          {/* Gemini */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="geminiApiKey">Gemini API Key (Google)</Label>
              {formData.hasGemini && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClear('gemini')}
                  disabled={loading}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="geminiApiKey"
                  type={showKeys.gemini ? 'text' : 'password'}
                  placeholder={formData.hasGemini ? '••••••••••••' : 'AIza...'}
                  value={formData.geminiApiKey}
                  onChange={e => setFormData(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  disabled={loading}
                />
                {formData.hasGemini && !formData.geminiApiKey && (
                  <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                disabled={loading}
              >
                {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.hasGemini && (
              <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p>
            )}
          </div>

          {/* Servicio preferido */}
          <div className="space-y-2">
            <Label htmlFor="preferredAIService" className="flex items-center gap-2">
              Servicio Preferido
              <HelpIcon
                content="Si tienes múltiples servicios configurados, puedes elegir cuál usar por defecto. Si no seleccionas ninguno, se usará el primero disponible."
                side="right"
              />
            </Label>
            <Select
              value={formData.preferredAIService || '__none__'}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  preferredAIService: value === '__none__' ? null : value,
                }))
              }
            >
              <SelectTrigger id="preferredAIService">
                <SelectValue placeholder="Selecciona un servicio (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Automático (usar el primero disponible)</SelectItem>
                <SelectItem value="anthropic">Claude (Anthropic)</SelectItem>
                <SelectItem value="openai">ChatGPT (OpenAI)</SelectItem>
                <SelectItem value="gemini">Gemini (Google)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              El sistema usará este servicio por defecto si está disponible
            </p>
          </div>

          {/* Mensajes */}
          {saved && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Configuración guardada
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Tus API keys se han guardado correctamente
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Botón de guardar */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Configuración'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
