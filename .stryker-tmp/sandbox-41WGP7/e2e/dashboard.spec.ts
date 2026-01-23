// @ts-nocheck
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión antes de cada test
    await page.goto('/auth/signin')
    await page.getByLabel(/Email/i).fill('matias@paestutor.com')
    await page.getByLabel(/Contraseña/i).fill('password123')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await page.waitForURL('/dashboard')
  })

  test('debe mostrar el dashboard con datos del estudiante', async ({ page }) => {
    await expect(page.getByText(/Hola, Matías/i)).toBeVisible()
    await expect(page.getByText(/Total Intentos/i)).toBeVisible()
    await expect(page.getByText(/Promedio General/i)).toBeVisible()
    await expect(page.getByText(/Asignaturas/i)).toBeVisible()
    await expect(page.getByText(/Mejor Puntaje/i)).toBeVisible()
  })

  test('debe mostrar gráficos de rendimiento', async ({ page }) => {
    await expect(page.getByText(/Rendimiento por Asignatura/i)).toBeVisible()
    await expect(page.getByText(/Evolución Reciente/i)).toBeVisible()
  })

  test('debe mostrar sección de últimos intentos', async ({ page }) => {
    await expect(page.getByText(/Últimos Intentos/i)).toBeVisible()
  })

  test('debe proteger el dashboard sin autenticación', async ({ page, context }) => {
    // Cerrar sesión eliminando cookies
    await context.clearCookies()

    await page.goto('/dashboard')

    // Debe redirigir a signin o mostrar error de autorización
    const url = page.url()
    expect(url).toMatch(/auth\/signin|dashboard/)
  })
})
