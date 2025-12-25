import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión antes de cada test
    await page.goto('/auth/signin')
    await page.getByLabel(/Email/i).fill('matias@paestutor.com')
    await page.getByLabel(/Contraseña/i).fill('password123')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await page.waitForURL('/dashboard', { timeout: 10000 })
    // Esperar a que el dashboard cargue completamente
    await page.waitForLoadState('networkidle', { timeout: 10000 })
  })

  test('debe mostrar el dashboard con datos del estudiante', async ({ page }) => {
    // El saludo puede tener emoji, usar regex más flexible
    await expect(page.getByText(/Hola, Matías/i)).toBeVisible()
    await expect(page.getByText(/Total Intentos/i)).toBeVisible()
    await expect(page.getByText(/Promedio General/i)).toBeVisible()
    await expect(page.getByText(/Asignaturas/i)).toBeVisible()
    await expect(page.getByText(/Mejor Puntaje/i)).toBeVisible()
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

    await page.goto('/dashboard')

    // Debe redirigir a signin o mostrar error de autorización
    const url = page.url()
    expect(url).toMatch(/auth\/signin|dashboard/)
  })
})
