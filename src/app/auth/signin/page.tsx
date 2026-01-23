'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

function SignInForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'CredentialsSignin') {
      setError('Credenciales inválidas')
    }
  }, [searchParams])

  const handleLogin = async () => {
    if (loading) return
    
    setError('')
    setLoading(true)

    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido')
      setLoading(false)
      return
    }

    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      const normalizedEmail = email.trim().toLowerCase()
      
      let result
      try {
        result = await signIn('credentials', {
          email: normalizedEmail,
          password,
          redirect: false,
          callbackUrl,
        })
      } catch (signInError) {
        // Ignorar errores de extensiones del navegador que no afectan la funcionalidad
        const errorMessage = signInError instanceof Error ? signInError.message : String(signInError)
        const isExtensionError = 
          errorMessage.includes('message channel closed') ||
          errorMessage.includes('message port closed') ||
          errorMessage.includes('asynchronous response') ||
          errorMessage.includes('listener indicated')
        
        if (isExtensionError) {
          // Si es error de extensión, verificar si la sesión se estableció
          await new Promise(resolve => setTimeout(resolve, 1000))
          const hasCookie = document.cookie.includes('next-auth.session-token') || 
                           document.cookie.includes('__Secure-next-auth.session-token') // guard:allow-secret
          
          if (hasCookie) {
            window.location.replace(callbackUrl)
            return
          }
        }
        throw signInError
      }

      if (!result) {
        setError('Error: No se recibió respuesta del servidor.')
        setLoading(false)
        return
      }

      if (result.error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.')
        setLoading(false)
      } else if (result.ok) {
        // Verificar que la sesión se estableció correctamente
        try {
          const sessionCheck = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include',
          })
          const sessionData = await sessionCheck.json()
          
          if (!sessionData?.user) {
            setError('Error: La sesión no se estableció correctamente. Por favor intenta nuevamente.')
            setLoading(false)
            return
          }
        } catch {
          // Si falla la verificación, redirigir de todas formas
          // El servidor puede leer cookies HttpOnly aunque no las veamos desde JS
        }
        
        // Redirigir después de confirmar la sesión
        const redirectUrl = result.url || callbackUrl
        setTimeout(() => {
          window.location.replace(redirectUrl)
        }, 200)
      } else {
        setError('Error inesperado. Por favor intenta nuevamente.')
        setLoading(false)
      }
    } catch (err) {
      // Ignorar errores de extensiones del navegador
      const errorMessage = err instanceof Error ? err.message : String(err)
      const isExtensionError = 
        errorMessage.includes('message channel closed') ||
        errorMessage.includes('message port closed') ||
        errorMessage.includes('Extension context invalidated') ||
        errorMessage.includes('asynchronous response') ||
        errorMessage.includes('listener indicated')
      
      if (isExtensionError) {
        // Intentar redirigir si es error de extensión (puede ser que la sesión se estableció)
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
        setTimeout(() => {
          window.location.replace(callbackUrl)
        }, 500)
        return
      }
      
      setError('Error al iniciar sesión. Por favor intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(to bottom right, #f5f5f5, #e5e5e5)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#1a1a1a'
        }}>
          Iniciar Sesión
        </h1>
        <p style={{ 
          color: '#666', 
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          Ingresa tus credenciales para acceder a PAES Tutor
        </p>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            color: '#c00',
            borderRadius: '6px',
            border: '1px solid #fcc',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            // No hacer nada aquí, el botón maneja el click
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                fontSize: '0.875rem',
                color: '#333'
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="tu@email.com"
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                fontSize: '0.875rem',
                color: '#333'
              }}
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function SignInPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(prev => prev ? prev : true)
    })
  }, [])

  if (!mounted) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Cargando...</div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Cargando...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
