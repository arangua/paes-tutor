# 🏆 Tests E2E Enterprise con Playwright

Este directorio contiene los tests end-to-end (E2E) **a nivel Enterprise** para PAES Tutor usando Playwright.

## 📋 Estructura Enterprise

```
e2e/
├── pages/                    # Page Object Model (POM)
│   ├── BasePage.ts          # Clase base con funcionalidades comunes
│   ├── LoginPage.ts         # Page Object para login
│   ├── DashboardPage.ts     # Page Object para dashboard
│   ├── ExamsPage.ts         # Page Object para listado de exámenes
│   ├── TakeExamPage.ts      # Page Object para tomar examen
│   ├── ResultsPage.ts       # Page Object para resultados
│   ├── AnalyticsPage.ts     # Page Object para analytics
│   └── index.ts             # Exportación centralizada
│
├── fixtures/                 # Fixtures personalizados
│   ├── authenticated.ts     # Fixture de autenticación
│   └── index.ts             # Exportación centralizada
│
├── factories/                # Test Data Factories
│   └── test-data.ts         # Generadores de datos de prueba
│
├── utils/                     # Utilidades Enterprise
│   ├── performance.ts       # Métricas de performance
│   ├── accessibility.ts     # Testing de accesibilidad
│   ├── visual-regression.ts # Visual regression testing
│   ├── test-isolation.ts    # Aislamiento de tests
│   ├── reporting.ts         # Reporting avanzado
│   └── index.ts             # Exportación centralizada
│
├── tests-enterprise/         # Tests Enterprise (nivel máximo)
│   ├── auth-enterprise.spec.ts
│   ├── dashboard-enterprise.spec.ts
│   ├── exam-flow-enterprise.spec.ts
│   ├── navigation-enterprise.spec.ts
│   ├── performance.spec.ts
│   ├── accessibility.spec.ts
│   └── visual-regression.spec.ts
│
├── auth.spec.ts              # Tests estándar (usando POM)
├── dashboard.spec.ts         # Tests estándar (usando POM)
├── exam-flow.spec.ts         # Tests estándar (usando POM)
├── navigation.spec.ts        # Tests estándar (usando POM)
├── analytics.spec.ts         # Tests estándar (usando POM)
├── api.spec.ts               # Tests de API endpoints (usando fixtures)
├── note-versions.spec.ts     # Tests de versiones de notas (usando POM)
├── auth-helpers.ts           # Helpers de autenticación (legacy, mantenido por compatibilidad)
├── auth-helpers-v2.ts        # Helpers alternativos (legacy)
├── ISSUE_AUTENTICACION.md    # Documentación del fix de autenticación
└── README.md                 # Este archivo
```

## 🚀 Comandos

### Ejecutar todos los tests E2E

```bash
npm run test:e2e
```

### Ejecutar solo tests Enterprise

```bash
npx playwright test e2e/tests-enterprise
```

### Ejecutar tests de performance

```bash
npx playwright test e2e/tests-enterprise/performance.spec.ts
```

### Ejecutar tests de accesibilidad

```bash
npx playwright test e2e/tests-enterprise/accessibility.spec.ts
```

### Generar baselines para visual regression

```bash
npx playwright test e2e/tests-enterprise/visual-regression.spec.ts --update-snapshots
```

### Ejecutar en modo UI (interactivo)

```bash
npm run test:e2e:ui
```

### Ejecutar en modo headed (con navegador visible)

```bash
npm run test:e2e:headed
```

### Ver reporte HTML

```bash
npx playwright show-report
```

## 🏗️ Arquitectura Enterprise

### **Page Object Model (POM)**

Cada página tiene su propia clase que encapsula selectores, acciones y verificaciones:

```typescript
import { LoginPage } from './pages'

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('email@test.com', 'password')
})
```

### **Fixtures Personalizados**

Fixtures que proporcionan páginas ya configuradas:

```typescript
import { test } from './fixtures'

test('mi test', async ({ authenticatedPage, dashboardPage }) => {
  // Ya estás autenticado y en el dashboard
  await dashboardPage.navigateToExams()
})
```

### **Test Data Factories**

Generadores de datos de prueba:

```typescript
import { TEST_CREDENTIALS, generateTestEmail } from './factories/test-data'

const email = generateTestEmail('user')
const credentials = TEST_CREDENTIALS.valid
```

## 📝 Flujos E2E Implementados

### Tests Estándar (usando POM)
- ✅ `auth.spec.ts` - Autenticación
- ✅ `dashboard.spec.ts` - Dashboard
- ✅ `exam-flow.spec.ts` - Flujo de examen
- ✅ `navigation.spec.ts` - Navegación
- ✅ `analytics.spec.ts` - Analytics
- ✅ `api.spec.ts` - Tests de API endpoints
- ✅ `note-versions.spec.ts` - Sistema de versiones de notas

### Tests Enterprise (nivel máximo)
- ✅ `auth-enterprise.spec.ts` - Autenticación con performance y a11y
- ✅ `dashboard-enterprise.spec.ts` - Dashboard con verificaciones avanzadas
- ✅ `exam-flow-enterprise.spec.ts` - Flujo completo con métricas
- ✅ `navigation-enterprise.spec.ts` - Navegación con performance
- ✅ `performance.spec.ts` - Tests dedicados de performance
- ✅ `accessibility.spec.ts` - Tests dedicados de accesibilidad
- ✅ `visual-regression.spec.ts` - Tests de regresión visual

## 🔧 Características Enterprise

### 1. **Performance Testing**
- Métricas automáticas (Load Time, FCP, LCP)
- Verificación de umbrales
- Reportes de performance

### 2. **Accessibility Testing**
- Verificación de títulos y headings
- Labels accesibles
- Navegación por teclado
- Contraste de colores

### 3. **Visual Regression**
- Comparación de screenshots
- Baselines configurables
- Detección de cambios visuales

### 4. **Test Isolation**
- Limpieza automática de datos
- Reset de estado
- Aislamiento entre tests

### 5. **Reporting Avanzado**
- HTML interactivo
- JSON para integración
- JUnit XML para CI/CD
- Métricas detalladas

## 🔐 Autenticación

### Usando Fixtures (Recomendado)

```typescript
import { test } from './fixtures'

test('mi test', async ({ authenticatedPage }) => {
  // Ya estás autenticado
})
```

### Usando Page Object

```typescript
import { LoginPage } from './pages'

const loginPage = new LoginPage(page)
await loginPage.login('matias@paestutor.com', 'password123')
```

**Credenciales de prueba:**
- Email: `matias@paestutor.com`
- Password: `password123`

## 🐛 Debugging

### Ver qué está pasando

```bash
# Modo debug con navegador visible
npx playwright test --headed --debug

# Ver traces
npx playwright show-trace trace.zip
```

### Ejecutar un test específico en modo debug

```bash
npx playwright test e2e/auth.spec.ts --headed --debug
```

## 📊 CI/CD

Los tests E2E se ejecutan automáticamente en CI (GitHub Actions) cuando se hace push o PR.

Ver `.github/workflows/e2e.yml` para la configuración de CI.

## ⚠️ Notas Importantes

1. **Servidor debe estar corriendo**: Los tests esperan que el servidor esté en `http://localhost:3000`
2. **Base de datos**: Los tests usan la base de datos de desarrollo (asegúrate de tener datos de prueba)
3. **Timeouts**: Los tests tienen timeouts generosos para manejar carga lenta
4. **Visual Regression**: Requiere generar baselines primero con `--update-snapshots`

## 🎯 Próximos Tests a Agregar

- [ ] Test de creación de cuenta (si se implementa)
- [ ] Test de cambio de contraseña
- [ ] Test de edición de perfil completo
- [ ] Test de búsqueda de exámenes con filtros
- [ ] Test de exportación de resultados
- [ ] Test de AI Tutor (si está disponible)

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev/)
- [Best Practices de Playwright](https://playwright.dev/docs/best-practices)
- [Guía de Testing de Next.js](https://nextjs.org/docs/testing)
- [KIT_TESTS_E2E_ENTERPRISE.md](../KIT_TESTS_E2E_ENTERPRISE.md) - Documentación completa enterprise
