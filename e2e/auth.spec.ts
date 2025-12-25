import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test('debe mostrar la página de inicio de sesión', async ({ page }) => {
    await page.goto('/auth/signin')

    await expect(page.getByRole('heading', { name: /Iniciar Sesión/i })).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Contraseña/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible()
  })

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/auth/signin')

    await page.getByLabel(/Email/i).fill('invalid@email.com')
    await page.getByLabel(/Contraseña/i).fill('wrongpassword')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()

    await expect(page.getByText(/Credenciales inválidas/i)).toBeVisible()
  })

  test('debe redirigir al dashboard después de iniciar sesión', async ({ page }) => {
    await page.goto('/auth/signin')

    // Usar credenciales del seed
    await page.getByLabel(/Email/i).fill('matias@paestutor.com')
    await page.getByLabel(/Contraseña/i).fill('password123')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()

    // Esperar a que se redirija al dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    // Esperar a que el dashboard cargue completamente
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    await expect(page.getByText(/Hola, Matías/i)).toBeVisible({ timeout: 10000 })
  })
})
