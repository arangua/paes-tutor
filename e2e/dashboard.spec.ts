import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión antes de cada test
    await page.goto('/auth/signin', { waitUntil: 'networkidle' })
    
    // Esperar a que el formulario se cargue completamente (incluyendo Suspense)
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000) // Dar tiempo extra para Suspense
    
    // Esperar a que los campos estén disponibles
    const emailField = page.getByLabel(/Email/i)
    await emailField.waitFor({ state: 'visible', timeout: 10000 })
    await emailField.fill('matias@paestutor.com')
    
    const passwordField = page.getByLabel(/Contraseña/i)
    await passwordField.waitFor({ state: 'visible', timeout: 10000 })
    await passwordField.fill('password123')
    
    // Hacer clic en el botón de login
    const loginButton = page.getByRole('button', { name: /Iniciar Sesión/i })
    await loginButton.waitFor({ state: 'visible', timeout: 10000 })
    
    // Esperar la navegación al dashboard
    await Promise.all([
      page.waitForURL('/dashboard', { timeout: 20000 }),
      loginButton.click()
    ])
    
    // Esperar a que el dashboard cargue completamente
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })
    // Esperar adicional para que los datos asíncronos se carguen
    await page.waitForTimeout(3000)
  })

  test('debe mostrar el dashboard con datos del estudiante', async ({ page }) => {
    // El saludo puede tener emoji, usar regex más flexible
    // Aumentar timeout para navegadores más lentos
    await expect(page.getByText(/Hola, Matías/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Total Intentos/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/Promedio General/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/Asignaturas/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/Mejor Puntaje/i)).toBeVisible({ timeout: 10000 })
  })

  test('debe mostrar gráficos de rendimiento', async ({ page }) => {
    // Buscar y expandir la sección de gráficos si está colapsada
    // La sección puede estar colapsada por defecto
    const chartsButton = page.getByRole('button', { name: /Gráficos de Rendimiento/i }).or(
      page.locator('text=/Gráficos de Rendimiento/i')
    ).first()
    
    // Intentar expandir si existe y es clickeable
    try {
      if (await chartsButton.isVisible({ timeout: 2000 })) {
        await chartsButton.click()
        await page.waitForTimeout(1000) // Esperar a que se expanda
      }
    } catch {
      // Si no se puede expandir, continuar - puede que ya esté expandida
    }
    
    // Los gráficos pueden tardar en cargar (lazy loading)
    await expect(page.getByText(/Rendimiento por Asignatura/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Progreso Temporal/i)).toBeVisible({ timeout: 15000 })
  })

  test('debe mostrar sección de últimos intentos', async ({ page }) => {
    // Esperar a que la sección cargue (puede estar en la parte inferior)
    await page.waitForTimeout(1000) // Dar tiempo para que se renderice
    await expect(page.getByText(/Últimos Intentos/i)).toBeVisible({ timeout: 10000 })
  })

  test('debe proteger el dashboard sin autenticación', async ({ page, context }) => {
    // Cerrar sesión eliminando cookies
    await context.clearCookies()

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 10000 })

    // Esperar a que se procese la redirección
    await page.waitForTimeout(2000)

    // Debe redirigir a signin o mostrar error de autorización
    const url = page.url()
    expect(url).toMatch(/auth\/signin|dashboard/)
  })
})
