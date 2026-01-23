# 📦 Archivos Legacy - Deprecated

Este documento lista los archivos legacy que se mantienen solo por compatibilidad histórica o referencia, pero **NO deben usarse en nuevos tests**.

## ⚠️ Archivos Legacy

### `auth-helpers.ts` - **DEPRECATED**

**Estado:** Deprecated - Mantenido solo por compatibilidad histórica

**Razón:** Las funciones útiles han sido migradas a `utils/auth-helpers.ts` y la autenticación se maneja mejor con fixtures enterprise.

**Migración:**
```typescript
// ❌ NO USAR (legacy)
import { loginAsTestUser } from './auth-helpers'
await loginAsTestUser(page)

// ✅ USAR (enterprise)
import { test } from './fixtures'
test('mi test', async ({ authenticatedPage }) => {
  // Ya estás autenticado
})
```

**Funciones migradas:**
- `isAuthenticated()` → `utils/auth-helpers.ts`
- `logout()` → `utils/auth-helpers.ts`
- `waitForPageLoad()` → `utils/auth-helpers.ts`
- `loginAsTestUser()` → `utils/auth-helpers.ts` (deprecated, usar fixtures)

---

### `auth-helpers-v2.ts` - **DEPRECATED**

**Estado:** Deprecated - Mantenido solo por referencia histórica

**Razón:** Métodos alternativos de autenticación que ya no son necesarios. El fixture enterprise maneja la autenticación de forma más robusta.

**Funciones:**
- `loginViaAPI()` - Autenticación vía API (no funciona bien con NextAuth v5)
- `loginViaForm()` - Autenticación vía formulario (reemplazado por LoginPage POM)

**Migración:**
```typescript
// ❌ NO USAR (legacy)
import { loginViaAPI, loginViaForm } from './auth-helpers-v2'
await loginViaForm(page)

// ✅ USAR (enterprise)
import { test } from './fixtures'
test('mi test', async ({ authenticatedPage }) => {
  // Ya estás autenticado
})
```

---

## ✅ Archivos Enterprise (Usar estos)

### `fixtures/authenticated.ts`
Fixtures enterprise que proporcionan autenticación automática.

### `utils/auth-helpers.ts`
Utilidades de autenticación enterprise (isAuthenticated, logout, etc.)

### `pages/LoginPage.ts`
Page Object Model para login.

---

## 📋 Plan de Eliminación

Estos archivos se mantendrán temporalmente por compatibilidad, pero se eliminarán en una futura versión mayor.

**Fecha estimada de eliminación:** v2.0.0

---

## 🔄 Checklist de Migración

Si estás usando archivos legacy, migra a enterprise:

- [ ] Reemplazar `loginAsTestUser()` con fixtures `authenticatedPage`
- [ ] Reemplazar `loginViaAPI()` con fixtures `authenticatedPage`
- [ ] Reemplazar `loginViaForm()` con `LoginPage` POM
- [ ] Usar `utils/auth-helpers.ts` para funciones helper
- [ ] Actualizar imports a usar `./fixtures` y `./pages`

---

*Última actualización: 2025-01-27*

