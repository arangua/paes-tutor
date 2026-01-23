'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserForm } from '@/components/profile/user-form'
import { PasswordForm } from '@/components/profile/password-form'
import { AIKeysForm } from '@/components/profile/ai-keys-form'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  Mail,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Shield,
  Settings,
} from 'lucide-react'
import { HelpIcon } from '@/components/help/help-icon'
import { ShortcutsSettings } from '@/components/settings/shortcuts-settings'
import { ExpertMode } from '@/components/settings/expert-mode'
import { getAvailableShortcutActions } from '@/lib/shortcut-actions'

interface UserData {
  id: string
  name: string | null
  email: string
  emailVerified: string | null
  image: string | null
  createdAt: string
  student: {
    id: string
    nombre: string
  } | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch('/api/user')

        if (res.status === 401) {
          router.push('/auth/signin?callbackUrl=/profile')
          return
        }

        if (!res.ok) {
          throw new Error('Error al cargar información del usuario')
        }

        const data = await res.json()
        setUserData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleUpdateSuccess = () => {
    // Recargar datos del usuario
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => {
        // Silenciar errores al recargar
      })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudo cargar el perfil'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Perfil' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <HelpIcon
              content="Aquí puedes actualizar tu información personal, cambiar tu contraseña y configurar tus API keys para usar el Tutor de IA."
              side="right"
            />
          </div>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
      </div>

      {/* Información de Cuenta */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Información de Cuenta
          </CardTitle>
          <CardDescription>Detalles de tu cuenta de usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ID de Usuario</p>
              <p className="text-sm font-mono">{userData.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
              <p className="text-sm">
                {new Date(userData.createdAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Estado de Email</p>
              <div className="flex items-center gap-2">
                {userData.emailVerified ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="secondary">No verificado</Badge>
                )}
              </div>
            </div>
            {userData.student && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID de Estudiante</p>
                <p className="text-sm font-mono">{userData.student.id}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Información Personal */}
      <div className="mb-6">
        <UserForm
          initialData={{
            name: userData.name,
            email: userData.email,
          }}
          onSuccess={handleUpdateSuccess}
        />
      </div>

      {/* Formulario de Cambio de Contraseña */}
      <div className="mb-6">
        <PasswordForm onSuccess={handleUpdateSuccess} />
      </div>

      {/* Configuración de API Keys de IA */}
      <div className="mb-6">
        <AIKeysForm />
      </div>

      {/* Configuración de Atajos de Teclado */}
      <div className="mb-6">
        <ShortcutsSettings availableActions={getAvailableShortcutActions(router)} />
      </div>

      {/* Modo Experto */}
      <div className="mb-6">
        <ExpertMode />
      </div>

      {/* Información de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>Recomendaciones para mantener tu cuenta segura</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Usa una contraseña única y segura que no uses en otros sitios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Cambia tu contraseña regularmente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>No compartas tu contraseña con nadie</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                Verifica que tu email esté actualizado para recuperar tu cuenta si es necesario
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
