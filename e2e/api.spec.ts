import { test, expect } from './fixtures'

/**
 * Tests E2E de API Endpoints
 * Versión actualizada usando fixtures enterprise
 */
test.describe('API Endpoints', () => {
  test('debe retornar 401 sin autenticación en /api/student', async ({ page, context }) => {
    // Asegurar que no hay cookies de sesión
    await context.clearCookies()
    
    const response = await page.request.get('/api/student')
    expect(response.status()).toBe(401)
  })

  test('debe retornar 401 sin autenticación en /api/metrics', async ({ page, context }) => {
    await context.clearCookies()
    
    const response = await page.request.get('/api/metrics')
    expect(response.status()).toBe(401)
  })

  test('debe retornar 401 sin autenticación en /api/attempts', async ({ page, context }) => {
    await context.clearCookies()
    
    const response = await page.request.get('/api/attempts')
    expect(response.status()).toBe(401)
  })

  test('debe retornar 401 sin autenticación en /api/exams', async ({ page, context }) => {
    await context.clearCookies()
    
    const response = await page.request.get('/api/exams')
    expect(response.status()).toBe(401)
  })

  test('debe validar query parameters en /api/attempts', async ({ page, context }) => {
    await context.clearCookies()
    
    // Sin autenticación debe retornar 401
    const response = await page.request.get('/api/attempts?limit=invalid')
    expect(response.status()).toBe(401)
  })

  test('debe permitir acceso autenticado a /api/student', async ({ authenticatedPage }) => {
    const response = await authenticatedPage.request.get('/api/student')
    
    // Con autenticación debe retornar 200 o 404 (si no hay datos)
    expect([200, 404]).toContain(response.status())
  })

  test('debe permitir acceso autenticado a /api/attempts', async ({ authenticatedPage }) => {
    const response = await authenticatedPage.request.get('/api/attempts')
    
    // Con autenticación debe retornar 200
    expect(response.status()).toBe(200)
    
    // Verificar que la respuesta es un array
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })
})
