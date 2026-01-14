import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import SignInPage from './page'

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mock de next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

// Mock de los componentes UI para simplificar
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

describe('SignInPage', () => {
  const mockPush = vi.fn()
  const mockRouter = {
    push: mockPush,
    refresh: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue(mockRouter as any)
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'callbackUrl') return '/profile'
        if (key === 'error') return null
        return null
      }),
    } as any)
  })

  it('debe renderizar el formulario de inicio de sesión', async () => {
    render(<SignInPage />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe mostrar error si el email es inválido', async () => {
    const user = userEvent.setup()
    render(<SignInPage />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i })

    await user.type(emailInput, 'email-invalido')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Por favor ingresa un email válido/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe llamar a signIn con las credenciales correctas', async () => {
    const user = userEvent.setup()
    const mockSignIn = vi.mocked(signIn)
    
    // Mock de signIn exitoso
    mockSignIn.mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: 'http://localhost:3000/dashboard',
    } as any)

    // Mock de searchParams sin callbackUrl (usa default '/dashboard')
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'callbackUrl') return null
        return null
      }),
    } as any)

    render(<SignInPage />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i })

    await user.type(emailInput, 'matias@paestutor.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'matias@paestutor.com',
        password: 'password123', // guard:allow-secret
        redirect: false,
        callbackUrl: '/dashboard',
      })
    }, { timeout: 3000 })
  })

  it('debe mostrar error si signIn retorna error', async () => {
    const user = userEvent.setup()
    const mockSignIn = vi.mocked(signIn)
    
    // Mock de signIn con error
    mockSignIn.mockResolvedValue({
      ok: false,
      error: 'CredentialsSignin',
      status: 401,
      url: null,
    } as any)

    render(<SignInPage />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i })

    await user.type(emailInput, 'matias@paestutor.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      // El componente muestra "Credenciales inválidas. Verifica tu email y contraseña."
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe normalizar el email a minúsculas', async () => {
    const user = userEvent.setup()
    const mockSignIn = vi.mocked(signIn)
    
    mockSignIn.mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: 'http://localhost:3000/profile',
    } as any)

    // Mock de searchParams con callbackUrl='/profile'
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'callbackUrl') return '/profile'
        return null
      }),
    } as any)

    render(<SignInPage />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i })

    // Email con mayúsculas
    await user.type(emailInput, 'Matias@Paestutor.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      // Verificar que se normalizó a minúsculas
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'matias@paestutor.com',
        password: 'password123', // guard:allow-secret
        redirect: false,
        callbackUrl: '/profile',
      })
    }, { timeout: 3000 })
  })

  it('debe manejar errores de red o excepciones', async () => {
    const user = userEvent.setup()
    const mockSignIn = vi.mocked(signIn)
    
    // Mock de signIn que lanza una excepción
    mockSignIn.mockRejectedValue(new Error('Network error'))

    render(<SignInPage />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Contraseña/i)
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i })

    await user.type(emailInput, 'matias@paestutor.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument()
    })
  })
})

