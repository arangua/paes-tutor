# 🔄 Guía de Migración a Enterprise

Esta guía te ayudará a migrar tests legacy a nivel enterprise.

## 📋 Resumen de Cambios

### Antes (Legacy)
```typescript
import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './auth-helpers'

test('mi test', async ({ page }) => {
  await loginAsTestUser(page)
  await page.goto('/dashboard')
  // ...
})
```

### Después (Enterprise)
```typescript
import { test, expect } from './fixtures'
import { DashboardPage } from './pages'

test('mi test', async ({ authenticatedPage }) => {
  const dashboardPage = new DashboardPage(authenticatedPage)
  await dashboardPage.goto()
  // ...
})
```

---

## 🔐 Autenticación

### ❌ Legacy
```typescript
import { loginAsTestUser, isAuthenticated, logout } from './auth-helpers'

test('test', async ({ page }) => {
  await loginAsTestUser(page)
  const authenticated = await isAuthenticated(page)
  await logout(page)
})
```

### ✅ Enterprise
```typescript
import { test } from './fixtures'
import { isAuthenticated, logout } from './utils/auth-helpers'

test('test', async ({ authenticatedPage }) => {
  // Ya estás autenticado automáticamente
  const authenticated = await isAuthenticated(authenticatedPage)
  await logout(authenticatedPage)
})
```

---

## 📄 Page Objects

### ❌ Legacy
```typescript
test('login', async ({ page }) => {
  await page.goto('/auth/signin')
  await page.getByLabel(/Email/i).fill('email@test.com')
  await page.getByLabel(/Contraseña/i).fill('password')
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
})
```

### ✅ Enterprise
```typescript
import { LoginPage } from './pages'

test('login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('email@test.com', 'password')
})
```

---

## 🎯 Fixtures Enterprise

### Fixtures Disponibles

1. **`authenticatedPage`** - Página ya autenticada
```typescript
test('test', async ({ authenticatedPage }) => {
  // Ya estás autenticado
  await authenticatedPage.goto('/exams')
})
```

2. **`loginPage`** - LoginPage inicializada
```typescript
test('test', async ({ loginPage }) => {
  await loginPage.goto()
  await loginPage.login('email@test.com', 'password')
})
```

3. **`dashboardPage`** - DashboardPage autenticada
```typescript
test('test', async ({ dashboardPage }) => {
  // Ya estás en el dashboard y autenticado
  await dashboardPage.navigateToExams()
})
```

---

## 📦 Page Objects Disponibles

- `LoginPage` - Página de login
- `DashboardPage` - Dashboard
- `ExamsPage` - Listado de exámenes
- `TakeExamPage` - Tomar examen
- `ResultsPage` - Resultados
- `AnalyticsPage` - Analytics
- `NotesPage` - Notas
- `VersionsDialog` - Diálogo de versiones

---

## 🛠️ Utilidades Enterprise

### Performance
```typescript
import { measurePagePerformance, assertPerformanceThresholds } from './utils/performance'

const metrics = await measurePagePerformance(page)
const check = assertPerformanceThresholds(metrics, { maxLoadTime: 5000 })
```

### Accessibility
```typescript
import { runAccessibilityChecks } from './utils/accessibility'

const a11yCheck = await runAccessibilityChecks(page)
expect(a11yCheck.passed).toBe(true)
```

### Visual Regression
```typescript
import { expectNoVisualChanges } from './utils/visual-regression'

await expectNoVisualChanges(page, 'login-page')
```

---

## ✅ Checklist de Migración

- [ ] Reemplazar imports de `auth-helpers` con fixtures
- [ ] Usar Page Objects en lugar de selectores directos
- [ ] Usar fixtures enterprise para autenticación
- [ ] Agregar verificaciones de performance donde sea relevante
- [ ] Agregar verificaciones de accesibilidad donde sea relevante
- [ ] Actualizar documentación del test

---

## 📚 Recursos

- [README.md](./README.md) - Documentación completa
- [LEGACY_FILES.md](./LEGACY_FILES.md) - Información sobre archivos legacy
- [KIT_TESTS_E2E_ENTERPRISE.md](../KIT_TESTS_E2E_ENTERPRISE.md) - Documentación enterprise completa

---

*Última actualización: 2025-01-27*

