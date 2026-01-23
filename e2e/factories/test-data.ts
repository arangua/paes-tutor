/**
 * Test Data Factories para E2E
 * Genera datos de prueba válidos y realistas
 */

/**
 * Generar email de prueba único
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `${prefix}-${timestamp}-${random}@paestutor.com`
}

/**
 * Generar contraseña de prueba
 */
export function generateTestPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Generar nombre de prueba
 */
export function generateTestName(): string {
  const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofía']
  const lastNames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez']
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  return `${firstName} ${lastName}`
}

/**
 * Credenciales de prueba predefinidas
 */
export const TEST_CREDENTIALS = {
  valid: {
    email: 'matias@paestutor.com',
    password: 'password123',
  },
  invalid: {
    email: 'invalid@email.com',
    password: 'wrongpassword',
  },
  empty: {
    email: '',
    password: '',
  },
} as const

/**
 * URLs de prueba
 */
export const TEST_URLS = {
  login: '/auth/signin',
  dashboard: '/dashboard',
  exams: '/exams',
  analytics: '/analytics',
  profile: '/profile',
  materials: '/materials',
} as const

/**
 * Timeouts para diferentes operaciones
 */
export const TEST_TIMEOUTS = {
  navigation: 30000,
  element: 10000,
  network: 20000,
  pageLoad: 20000,
} as const

/**
 * Configuración de test
 */
export const TEST_CONFIG = {
  baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
  headless: process.env.CI ? true : false,
  slowMo: 0, // Puede aumentarse para debugging
} as const

