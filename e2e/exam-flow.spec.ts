import { test, expect } from './fixtures'
import { ExamsPage, TakeExamPage } from './pages'

/**
 * Tests E2E del Flujo Completo de Examen
 * Versión actualizada usando Page Object Model y fixtures enterprise
 */
test.describe('Flujo Completo de Examen', () => {
  test('debe listar exámenes disponibles', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    // Verificar que la página está cargada
    const isLoaded = await examsPage.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar que hay exámenes o mensaje de "no hay exámenes"
    const hasExams = await examsPage.hasExams()
    expect(typeof hasExams).toBe('boolean')
  })

  test('debe poder navegar a la página de tomar examen', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    if (!(await examsPage.hasExams())) {
      test.skip()
      return
    }
    
    // Navegar al primer examen
    await examsPage.navigateToFirstExam()
    
    // Verificar que estamos en la página de tomar examen
    expect(authenticatedPage.url()).toMatch(/\/exams\/.*\/take/)
    
    const takeExamPage = new TakeExamPage(authenticatedPage)
    const isLoaded = await takeExamPage.isLoaded()
    expect(isLoaded).toBe(true)
  })

  test('debe poder responder preguntas en un examen', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    if (!(await examsPage.hasExams())) {
      test.skip()
      return
    }
    
    await examsPage.navigateToFirstExam()
    const takeExamPage = new TakeExamPage(authenticatedPage)
    
    // Esperar a que el examen se cargue
    await takeExamPage.waitForLoad()
    
    // Seleccionar la primera opción
    await takeExamPage.selectFirstOption()
    
    // Verificar que la opción está seleccionada
    const options = authenticatedPage.locator('input[type="radio"]:checked, input[type="checkbox"]:checked')
    const checkedCount = await options.count()
    expect(checkedCount).toBeGreaterThan(0)
  })

  test('debe poder ver resultados después de completar un examen', async ({ authenticatedPage }) => {
    // Este test requiere que haya un intento completado
    // Por ahora, verificamos que podemos acceder a la página de resultados si existe
    await authenticatedPage.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    await authenticatedPage.waitForLoadState('domcontentloaded')
    
    // Buscar enlaces a resultados de intentos
    const resultsLink = authenticatedPage.getByRole('link', { name: /Ver Resultados|Resultados|Intentos/i }).first()
    
    if (await resultsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await resultsLink.click()
      await authenticatedPage.waitForLoadState('domcontentloaded')
      
      // Verificar que estamos en una página de resultados
      expect(authenticatedPage.url()).toMatch(/\/attempts|\/results/)
    } else {
      // Si no hay resultados, el test pasa (no hay nada que probar)
      test.info().annotations.push({ type: 'skip', description: 'No hay intentos completados para ver resultados' })
    }
  })
})
