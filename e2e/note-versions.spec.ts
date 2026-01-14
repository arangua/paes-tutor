import { test, expect } from './fixtures'
import { NotesPage, VersionsDialog } from './pages'

/**
 * Tests E2E del Sistema de Versiones de Notas
 * Versión actualizada usando Page Object Model y fixtures enterprise
 */
test.describe('Sistema de Versiones de Notas', () => {
  test('debe cargar versiones de una nota', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    // Abrir diálogo de versiones
    await notesPage.openVersionsDialog(0)
    
    const versionsDialog = new VersionsDialog(authenticatedPage)
    const isLoaded = await versionsDialog.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar que se cargan versiones
    await versionsDialog.waitForVersions()
    const versionCount = await versionsDialog['page'].locator('[data-version-id]').count()
    expect(versionCount).toBeGreaterThan(0)
  })

  test('debe permitir restaurar una versión', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    await notesPage.openVersionsDialog(0)
    const versionsDialog = new VersionsDialog(authenticatedPage)
    await versionsDialog.waitForVersions()
    
    const versionCount = await versionsDialog['page'].locator('[data-version-id]').count()
    test.skip(versionCount <= 1, 'No hay suficientes versiones para restaurar')
    
    await versionsDialog.restoreVersion(1)
    
    // Verificar que se muestra un mensaje de éxito
    const successMessage = versionsDialog['page'].getByText(/restaurada|éxito|success/i)
    await expect(successMessage).toBeVisible({ timeout: 5000 })
  })

  test('debe permitir comparar versiones', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    await notesPage.openVersionsDialog(0)
    const versionsDialog = new VersionsDialog(authenticatedPage)
    await versionsDialog.waitForVersions()
    
    const versionCount = await versionsDialog['page'].locator('[data-version-id]').count()
    test.skip(versionCount < 2, 'No hay suficientes versiones para comparar')
    
    await versionsDialog.compareVersions(0, 1)
    
    // Verificar que se muestra la comparación
    const comparisonText = versionsDialog['page'].getByText(/comparación|diferencias|comparison|differences/i)
    await expect(comparisonText).toBeVisible({ timeout: 5000 })
  })

  test('debe permitir exportar una versión', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    await notesPage.openVersionsDialog(0)
    const versionsDialog = new VersionsDialog(authenticatedPage)
    await versionsDialog.waitForVersions()
    
    // Configurar listener para descarga
    const downloadPromise = authenticatedPage.waitForEvent('download', { timeout: 10000 })
    
    await versionsDialog.exportVersion(0, 'txt')
    
    // Verificar que se inicia la descarga
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.txt$/)
  })

  test('debe permitir buscar versiones', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    await notesPage.openVersionsDialog(0)
    const versionsDialog = new VersionsDialog(authenticatedPage)
    await versionsDialog.waitForVersions()
    
    await versionsDialog.searchVersions('test')
    
    // Verificar que se filtran los resultados
    await authenticatedPage.waitForTimeout(500) // Esperar debounce
    const filteredResults = versionsDialog['page'].locator('[data-version-id]')
    await expect(filteredResults.first()).toBeVisible({ timeout: 5000 })
  })

  test('debe permitir seleccionar múltiples versiones', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    await notesPage.openVersionsDialog(0)
    const versionsDialog = new VersionsDialog(authenticatedPage)
    await versionsDialog.waitForVersions()
    
    const versionCount = await versionsDialog['page'].locator('[data-version-id]').count()
    test.skip(versionCount < 2, 'No hay suficientes versiones para seleccionar')
    
    await versionsDialog.selectVersions(0, 1)
    
    // Verificar que se muestra el contador de seleccionadas
    const counter = versionsDialog['page'].getByText(/2.*seleccionadas|2.*selected/i)
    await expect(counter).toBeVisible({ timeout: 5000 })
  })

  test('debe permitir fusionar versiones', async ({ authenticatedPage }) => {
    const notesPage = new NotesPage(authenticatedPage)
    await notesPage.goto()
    
    const hasNotes = await notesPage.hasNotes()
    test.skip(!hasNotes, 'No hay notas disponibles para probar')
    
    await notesPage.openVersionsDialog(0)
    const versionsDialog = new VersionsDialog(authenticatedPage)
    await versionsDialog.waitForVersions()
    
    const versionCount = await versionsDialog['page'].locator('[data-version-id]').count()
    test.skip(versionCount < 2, 'No hay suficientes versiones para fusionar')
    
    await versionsDialog.selectVersions(0, 1)
    await versionsDialog.mergeVersions('Nota fusionada de prueba')
    
    // Verificar que se muestra un mensaje de éxito
    const successMessage = versionsDialog['page'].getByText(/fusionadas|éxito|merged|success/i)
    await expect(successMessage).toBeVisible({ timeout: 5000 })
  })
})
