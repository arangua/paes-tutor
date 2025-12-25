'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react'
import { HelpIcon } from '@/components/help/help-icon'
import { TIME_CONSTANTS } from '@/lib/constants'

interface PasswordFormProps {
  onSuccess?: () => void
}

export function PasswordForm({ onSuccess }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Ref para limpiar timeout al desmontar
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validación básica
      if (!currentPassword) {
        setError('La contraseña actual es requerida')
        setIsLoading(false)
        return
      }

      if (newPassword.length < 8) {
        setError('La nueva contraseña debe tener al menos 8 caracteres')
        setIsLoading(false)
        return
      }

      if (!/[A-Z]/.test(newPassword)) {
        setError('La contraseña debe contener al menos una mayúscula')
        setIsLoading(false)
        return
      }

      if (!/[a-z]/.test(newPassword)) {
        setError('La contraseña debe contener al menos una minúscula')
        setIsLoading(false)
        return
      }

      if (!/[0-9]/.test(newPassword)) {
        setError('La contraseña debe contener al menos un número')
        setIsLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        setIsLoading(false)
        return
      }

      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña')
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      if (onSuccess) {
        onSuccess()
      }

      // Ocultar mensaje de éxito después de 3 segundos
      // Limpiar timeout anterior si existe
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      successTimeoutRef.current = setTimeout(
        () => setSuccess(false),
        TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = currentPassword || newPassword || confirmPassword

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Cambiar Contraseña
          </CardTitle>
          <HelpIcon content="Tu contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números. Cámbiala regularmente por seguridad." />
        </div>
        <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Contraseña actualizada exitosamente</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número
              </p>
              <HelpIcon
                content="Ejemplo de contraseña segura: MiClave123. Evita usar información personal o palabras comunes."
                side="right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading || !hasChanges} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cambiando...
              </>
            ) : (
              'Cambiar Contraseña'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
