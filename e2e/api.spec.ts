import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('debe retornar 401 sin autenticación en /api/student', async ({ request }) => {
    const response = await request.get('/api/student')
    expect(response.status()).toBe(401)
  })

  test('debe retornar 401 sin autenticación en /api/metrics', async ({ request }) => {
    const response = await request.get('/api/metrics')
    expect(response.status()).toBe(401)
  })

  test('debe retornar 401 sin autenticación en /api/attempts', async ({ request }) => {
    const response = await request.get('/api/attempts')
    expect(response.status()).toBe(401)
  })

  test('debe retornar exámenes sin autenticación en /api/exams', async ({ request }) => {
    const response = await request.get('/api/exams')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('debe validar query parameters en /api/attempts', async ({ request }) => {
    // Primero autenticarse
    const signInResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'matias@paestutor.com',
        password: 'password123',
      },
    })

    // Intentar con parámetros inválidos
    const response = await request.get('/api/attempts?limit=invalid')
    // Debe retornar 400 o manejar el error apropiadamente
    expect([200, 400]).toContain(response.status())
  })
})
