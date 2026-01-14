'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Loader2, Bot, Send, AlertCircle, Settings } from 'lucide-react'
import { HelpIcon } from '@/components/help/help-icon'
import Link from 'next/link'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIService {
  service: string
  name: string
  configured: boolean
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [availableServices, setAvailableServices] = useState<AIService[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Cargar servicios disponibles al montar
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch('/api/ai/config')
        const data = await res.json()
        if (data.availableServices) {
          setAvailableServices(data.availableServices)
          if (data.defaultService) {
            setSelectedService(data.defaultService)
          }
        }
      } catch {
        // Error silencioso - el usuario verá el mensaje en la UI
      }
    }
    loadServices()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: AIMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chat',
          messages: newMessages,
          service: selectedService || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener respuesta de IA')
      }

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.content,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setMessages(newMessages) // Mantener el mensaje del usuario aunque falle
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Tutor de IA</h1>
          <HelpIcon
            content="El Tutor de IA usa ChatGPT, Claude o Gemini para responder tus preguntas. Necesitas configurar al menos una API key en tu perfil. Puedes usar tus propias cuentas o compartidas."
            side="right"
          />
        </div>
        <p className="text-muted-foreground mt-2">
          Haz preguntas sobre los temas de PAES y recibe explicaciones personalizadas
        </p>
      </div>

      {/* Configuración de servicios */}
      {availableServices.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
            <CardDescription>Selecciona el servicio de IA que deseas usar</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map(service => (
                  <SelectItem key={service.service} value={service.service}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              {availableServices.length === 1
                ? 'Solo hay un servicio configurado'
                : `${availableServices.length} servicios disponibles`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alerta si no hay servicios */}
      {availableServices.length === 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              No hay servicios de IA configurados. Para usar el Tutor de IA, necesitas configurar al
              menos una API key.
            </p>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div>
                <p className="font-semibold mb-2">
                  📝 Opción 1: Configuración por Usuario (Recomendado)
                </p>
                <p className="text-sm mb-2">
                  Configura tus propias API keys en tu perfil para usar tus cuentas existentes
                  (ChatGPT Plus, Claude Pro, Gemini).
                </p>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Ir a Configuración de Perfil
                  </Link>
                </Button>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">⚙️ Opción 2: Configuración Global (.env)</p>
                <p className="text-sm mb-2">
                  Agrega una de estas variables a tu archivo{' '}
                  <code className="bg-background px-1 py-0.5 rounded">.env</code>:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 font-mono bg-background p-2 rounded">
                  <li>ANTHROPIC_API_KEY=tu_clave_aqui (Claude)</li>
                  <li>OPENAI_API_KEY=tu_clave_aqui (ChatGPT)</li>
                  <li>GEMINI_API_KEY=tu_clave_aqui (Gemini)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Luego reinicia el servidor:{' '}
                  <code className="bg-background px-1 py-0.5 rounded">npm run dev</code>
                </p>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-semibold mb-1">📚 ¿Necesitas ayuda?</p>
              <p className="text-muted-foreground">
                Consulta la guía completa en:{' '}
                <code className="bg-background px-1 py-0.5 rounded">
                  GUIA_CONFIGURACION_API_KEYS.md
                </code>
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Obtén tus API keys en: Claude (console.anthropic.com), ChatGPT
                (platform.openai.com), Gemini (makersuite.google.com)
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Chat */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Conversación
          </CardTitle>
          <CardDescription>Pregunta sobre cualquier tema de PAES</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mensajes */}
          <div className="space-y-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Comienza una conversación haciendo una pregunta</p>
                <p className="text-sm mt-2">Ejemplo: &quot;Explícame las ecuaciones cuadráticas&quot;</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Escribe tu pregunta aquí..."
              disabled={loading || availableServices.length === 0}
              rows={3}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim() || availableServices.length === 0}
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>¿Cómo funciona?</strong> El Tutor de IA utiliza modelos avanzados de lenguaje
            para responder tus preguntas sobre los temas de PAES.
          </p>
          <p>
            <strong>Servicios disponibles:</strong> Puedes usar Claude (Anthropic), ChatGPT (OpenAI)
            o Gemini (Google) según tengas configurado.
          </p>
          <p>
            <strong>Privacidad:</strong> Las API keys se almacenan de forma segura y solo se usan
            para procesar tus consultas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
