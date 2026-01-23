'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import { HelpIcon } from '@/components/help/help-icon'
import { ErrorMessageComponent } from '@/components/ui/error-message'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { validateEmail, validateString } from '@/lib/validation-helpers'
import { cn } from '@/lib/utils'
import { TIME_CONSTANTS } from '@/lib/constants'

interface UserFormProps {
  readonly initialData: {
    readonly name: string | null
    readonly email: string
  }
  readonly onSuccess?: () => void
}

interface FieldError {
  message: string
  code: string
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [name, setName] = useState(initialData.name || '')
  const [email, setEmail] = useState(initialData.email || '')
  const [isLoading, setIsLoading] = useState(false)
  const [structuredError, setStructuredError] = useState<ReturnType<typeof getErrorMessage> | null>(null)
  const [success, setSuccess] = useState(false)

  // Validación en tiempo real
  const [nameError, setNameError] = useState<FieldError | null>(null)
  const [emailError, setEmailError] = useState<FieldError | null>(null)
  const [nameTouched, setNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  // Ref para limpiar timeout al desmontar
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup de timeout al desmontar
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
        successTimeoutRef.current = null
      }
    }
  }, [])

  // Validar nombre en tiempo real
  useEffect(() => {
    if (nameTouched) {
      const validation = validateString(name, {
        minLength: 2,
        maxLength: 100,
        allowEmpty: false,
        required: true,
      })

      if (validation.isValid) {
        setNameError(null)
      } else {
        setNameError({
          message: validation.error || 'El nombre debe tener entre 2 y 100 caracteres',
          code: ERROR_CODES.VALIDATION_REQUIRED,
        })
      }
    }
  }, [name, nameTouched])

  // Validar email en tiempo real
  useEffect(() => {
    if (emailTouched) {
      const validation = validateEmail(email)

      if (validation.isValid) {
        setEmailError(null)
      } else {
        setEmailError({
          message: validation.error || 'Email inválido',
          code: ERROR_CODES.VALIDATION_INVALID_FORMAT,
        })
      }
    }
  }, [email, emailTouched])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  // Restaurar valores originales
  const handleReset = useCallback(() => {
    setName(initialData.name || '')
    setEmail(initialData.email)
    setNameError(null)
    setEmailError(null)
    setStructuredError(null)
    setNameTouched(false)
    setEmailTouched(false)
    // Limpiar timeout de éxito si existe
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = null
    }
  }, [initialData.name, initialData.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStructuredError(null)
    setSuccess(false)

    // Marcar campos como tocados para mostrar errores
    setNameTouched(true)
    setEmailTouched(true)

    // Validación usando helpers
    const nameValidation = validateString(name, {
      minLength: 2,
      maxLength: 100,
      allowEmpty: false,
      required: true,
    })

    const emailValidation = validateEmail(email)

    if (!nameValidation.isValid) {
      const errorMsg = getErrorMessage(ERROR_CODES.VALIDATION_REQUIRED, {
        field: 'nombre',
        minLength: 2,
        maxLength: 100,
      })
      setStructuredError(errorMsg)
      setIsLoading(false)
      return
    }

    if (!emailValidation.isValid) {
      const errorMsg = getErrorMessage(ERROR_CODES.VALIDATION_INVALID_FORMAT, {
        field: 'email',
        expected: 'ejemplo@correo.com',
      })
      setStructuredError(errorMsg)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameValidation.sanitized,
          email: emailValidation.sanitized,
        }),
      })

      if (!res.ok) {
        // Parsear JSON de forma segura, puede fallar si la respuesta no es JSON
        const { safeJsonParse } = await import('@/lib/api-helpers')
        const errorData = await safeJsonParse<{ error?: string }>(res, {
          path: typeof window !== 'undefined' ? window.location.pathname : '/profile',
          operation: 'actualizar información de usuario',
        })
        const errorInfo = extractErrorInfo(errorData.error || 'Error al actualizar información')
        const errorMsg = getErrorMessage(errorInfo.code, {
          message: errorInfo.message,
          ...errorInfo.context,
        })
        setStructuredError(errorMsg)
        return
      }

      // Respuesta exitosa - no necesitamos parsear el body si no lo usamos

      setSuccess(true)
      setNameTouched(false)
      setEmailTouched(false)
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
      const errorInfo = extractErrorInfo(err)
      const errorMsg = getErrorMessage(errorInfo.code, {
        message: errorInfo.message,
        ...errorInfo.context,
      })
      setStructuredError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = name !== (initialData.name || '') || email !== initialData.email
  const isFormValid = !nameError && !emailError && name.trim() && email.trim()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Información Personal</CardTitle>
            <HelpIcon content="Tu nombre se mostrará en el dashboard y en tus estadísticas. Si cambias tu email, deberás verificarlo nuevamente." />
          </div>
          {hasChanges && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Restaurar valores originales"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
          )}
        </div>
        <CardDescription>Actualiza tu nombre y dirección de correo electrónico</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {structuredError && (
            <ErrorMessageComponent
              error={structuredError}
              onDismiss={() => {
                setStructuredError(null)
              }}
            />
          )}


          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Información actualizada exitosamente</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre
              <HelpIcon
                content="Este nombre se mostrará en tu dashboard y en todas las estadísticas. Puedes cambiarlo en cualquier momento."
                side="right"
              />
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  if (!nameTouched) setNameTouched(true)
                }}
                onBlur={() => setNameTouched(true)}
                placeholder="Tu nombre completo"
                required
                maxLength={100}
                aria-invalid={nameError !== null}
                aria-describedby={nameError ? 'name-error' : undefined}
                className={cn(
                  nameError && 'border-destructive focus-visible:ring-destructive/20',
                  !nameError && nameTouched && name.trim() && 'border-green-500/50',
                )}
              />
              {nameError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
              )}
              {!nameError && nameTouched && name.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {nameError && (
              <p id="name-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {nameError.message}
              </p>
            )}
            {!nameError && nameTouched && name.trim() && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Nombre válido
              </p>
            )}
            {name.trim() && (
              <p className="text-xs text-muted-foreground">
                {name.length}/100 caracteres
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Correo Electrónico
              <HelpIcon
                content="Si cambias tu email, recibirás un correo de verificación. Tu email se usa para iniciar sesión y recuperar tu cuenta."
                side="right"
              />
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (!emailTouched) setEmailTouched(true)
                }}
                onBlur={() => setEmailTouched(true)}
                placeholder="tu@email.com"
                required
                aria-invalid={emailError !== null}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={cn(
                  emailError && 'border-destructive focus-visible:ring-destructive/20',
                  !emailError && emailTouched && email.trim() && 'border-green-500/50',
                )}
              />
              {emailError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
              )}
              {!emailError && emailTouched && email.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {emailError && (
              <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError.message}
              </p>
            )}
            {!emailError && emailTouched && email.trim() && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Email válido
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Si cambias tu email, deberás verificarlo nuevamente
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading || !hasChanges}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !hasChanges || !isFormValid}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
