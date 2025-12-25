import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test('debe mostrar la página de inicio de sesión', async ({ page }) => {
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' })
    
    // Esperar a que el Suspense se resuelva y el formulario se cargue
    await page.waitForLoadState('domcontentloaded')
    
    // Buscar el texto directamente ya que CardTitle puede no tener role heading
    await expect(page.getByText(/Iniciar Sesión/i).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByLabel(/Email/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByLabel(/Contraseña/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible({ timeout: 10000 })
  })

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' })
    
    // Esperar a que el formulario se cargue
    await page.waitForLoadState('domcontentloaded')
    await page.getByLabel(/Email/i).waitFor({ state: 'visible', timeout: 5000 })

    await page.getByLabel(/Email/i).fill('invalid@email.com')
    await page.getByLabel(/Contraseña/i).fill('wrongpassword')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()

    // Esperar a que aparezca el mensaje de error
    await expect(page.getByText(/Credenciales inválidas/i)).toBeVisible({ timeout: 10000 })
  })

  test('debe redirigir al dashboard después de iniciar sesión', async ({ page }) => {
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' })

    // Esperar a que los campos estén disponibles
    await page.getByLabel(/Email/i).waitFor({ state: 'visible', timeout: 5000 })
    
    // Usar credenciales del seed
    await page.getByLabel(/Email/i).fill('matias@paestutor.com')
    await page.getByLabel(/Contraseña/i).fill('password123')
    
    // Hacer clic y esperar la navegación
    await Promise.all([
      page.waitForURL('/dashboard', { timeout: 15000 }),
      page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    ])

    // Esperar a que el dashboard cargue (usar domcontentloaded para mejor compatibilidad)
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 })
    // Esperar adicional para que los datos se carguen
    await page.waitForTimeout(2000)
    await expect(page.getByText(/Hola, Matías/i)).toBeVisible({ timeout: 15000 })
  })
})
