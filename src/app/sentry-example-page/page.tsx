'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function SentryExamplePage() {
  const [clientErrorStatus, setClientErrorStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [serverErrorStatus, setServerErrorStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')
  const [eventId, setEventId] = useState<string | null>(null)

  const triggerClientError = () => {
    try {
      setClientErrorStatus('idle')
      setEventId(null)

      // Crear un error de prueba en el cliente
      const testError = new Error('Sentry Test Error from Client')
      testError.name = 'SentryClientTest'

      Sentry.withScope((scope) => {
        scope.setTag('test_type', 'client_test')
        scope.setTag('page', 'sentry-example-page')
        scope.setLevel('error')
        scope.setContext('test', {
          timestamp: new Date().toISOString(),
          source: 'client',
        })
        scope.setExtra('test', true)
        scope.setExtra('purpose', 'verify_sentry_client_integration') // guard:allow-secret

        const id = Sentry.captureException(testError)
        setEventId(id || null)
      })

      // Flush para asegurar que se envíe
      Sentry.flush(2000).then((flushed) => {
        if (flushed) {
          setClientErrorStatus('success')
        } else {
          // Aún marcamos como éxito si tenemos eventId, el flush puede fallar pero el evento se enviará más tarde
          if (eventId) {
            setClientErrorStatus('success')
          } else {
            setClientErrorStatus('error')
          }
        }
      }).catch(() => {
        // Si hay error en flush pero tenemos eventId, aún es éxito
        if (eventId) {
          setClientErrorStatus('success')
        } else {
          setClientErrorStatus('error')
        }
      })
    } catch (error) {
      console.error('Error al enviar error de prueba:', error)
      setClientErrorStatus('error')
    }
  }

  const triggerServerError = async () => {
    try {
      setServerErrorStatus('loading')
      setEventId(null)

      const response = await fetch('/api/sentry-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setEventId(data.eventId || null)
        setServerErrorStatus('success')
      } else {
        setServerErrorStatus('error')
      }
    } catch (error) {
      console.error('Error al llamar al endpoint de prueba:', error)
      setServerErrorStatus('error')
    }
  }

  const triggerUndefinedFunction = () => {
    // @ts-expect-error - Intencionalmente llamando función no definida
    myUndefinedFunction()
  }

  const isClientConfigured = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sentry Test Page</h1>
        <p className="text-muted-foreground">
          Esta página te permite probar que Sentry está configurado correctamente
        </p>
      </div>

      {/* Estado de configuración */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de Configuración</CardTitle>
          <CardDescription>Verifica que Sentry esté configurado correctamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            {isClientConfigured ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Cliente (Browser): Configurado</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Cliente (Browser): No configurado (NEXT_PUBLIC_SENTRY_DSN faltante)</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span>Servidor: Verificar con el botón de prueba</span>
          </div>
        </CardContent>
      </Card>

      {/* Prueba de error en cliente */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Probar Error en Cliente (Browser)</CardTitle>
          <CardDescription>
            Envía un error de prueba desde el navegador a Sentry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={triggerClientError}
            disabled={!isClientConfigured}
            className="w-full sm:w-auto"
          >
            {clientErrorStatus === 'idle' && 'Enviar Error de Prueba'}
            {clientErrorStatus === 'success' && (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Error Enviado
              </>
            )}
            {clientErrorStatus === 'error' && (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Error al Enviar
              </>
            )}
          </Button>

          {clientErrorStatus === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>¡Éxito!</AlertTitle>
              <AlertDescription>
                El error se ha enviado a Sentry. Revisa tu dashboard de Sentry en unos segundos.
                {eventId && (
                  <div className="mt-2">
                    <strong>Event ID:</strong> <code className="text-xs">{eventId}</code>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {clientErrorStatus === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudo enviar el error. Verifica la configuración de Sentry.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Prueba de error en servidor */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Probar Error en Servidor</CardTitle>
          <CardDescription>
            Envía un error de prueba desde el servidor a Sentry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={triggerServerError}
            disabled={serverErrorStatus === 'loading'}
            className="w-full sm:w-auto"
          >
            {serverErrorStatus === 'idle' && 'Enviar Error de Prueba'}
            {serverErrorStatus === 'loading' && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            )}
            {serverErrorStatus === 'success' && (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Error Enviado
              </>
            )}
            {serverErrorStatus === 'error' && (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Error al Enviar
              </>
            )}
          </Button>

          {serverErrorStatus === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>¡Éxito!</AlertTitle>
              <AlertDescription>
                El error se ha enviado a Sentry desde el servidor. Revisa tu dashboard de Sentry en unos segundos.
                {eventId && (
                  <div className="mt-2">
                    <strong>Event ID:</strong> <code className="text-xs">{eventId}</code>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {serverErrorStatus === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudo enviar el error. Verifica que el endpoint /api/sentry-test esté configurado.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Prueba de función no definida */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Probar Función No Definida</CardTitle>
          <CardDescription>
            Como sugiere Sentry, llama a una función que no existe para generar un error
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={triggerUndefinedFunction}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            Llamar myUndefinedFunction()
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Esto generará un error que Sentry debería capturar automáticamente
          </p>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>1. Prueba el error del cliente:</strong> Haz clic en el botón para enviar un error desde el navegador.
          </p>
          <p>
            <strong>2. Prueba el error del servidor:</strong> Haz clic en el botón para enviar un error desde el servidor.
          </p>
          <p>
            <strong>3. Prueba función no definida:</strong> Haz clic en el botón para generar un error automático.
          </p>
          <p>
            <strong>4. Verifica en Sentry:</strong> Ve a tu proyecto en Sentry y busca los eventos en la sección &quot;Issues&quot;.
          </p>
          <p className="text-muted-foreground mt-4">
            <strong>Nota:</strong> Los eventos pueden tardar unos segundos en aparecer en Sentry.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
