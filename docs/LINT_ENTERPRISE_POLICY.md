# Política de Linting Enterprise

## 📋 Objetivo

Implementar un sistema de linting que:
- **Bloquea CI solo por issues críticos** que pueden causar bugs en producción
- **Evita regresión** verificando archivos cambiados
- **Mantiene auditoría completa** para tracking de deuda técnica
- **No bloquea desarrollo** por deuda técnica histórica

## 🎯 Estrategia de Tres Niveles

### 1. `lint:critical` - Gate de CI (Bloquea)

**Uso:** `npm run lint:critical`

**Objetivo:** Bloquear CI solo por issues realmente críticos que pueden causar bugs o vulnerabilidades en producción.

**Reglas Críticas (Siempre Bloquean):**

#### Variables y Referencias
- ✅ `no-undef` - Variables no definidas (causa runtime errors)
- ✅ `no-unreachable` - Código inalcanzable (indica bugs lógicos)
- ✅ `@typescript-eslint/no-unused-vars` - Variables no usadas (mantiene código limpio)
- ✅ `sonarjs/no-unused-vars` - Variables no usadas (SonarJS)
- ✅ `sonarjs/unused-import` - Imports no usados

#### Seguridad Básica
- ✅ `no-eval` - Uso de eval() (crítico de seguridad)
- ✅ `no-implied-eval` - Eval implícito (crítico de seguridad)
- ✅ `no-new-func` - Constructor Function() (crítico de seguridad)

#### Producción
- ✅ `no-console` - Console.log en producción (excepto warn/error)
- ✅ `no-debugger` - Debugger en producción

#### React Hooks
- ✅ Todas las reglas de `react-hooks` - Críticas para evitar bugs de React

**Reglas Desactivadas en Modo Crítico (No Bloquean):**

#### Deuda Técnica (Requieren Refactorización Masiva)
- ❌ `@typescript-eslint/no-explicit-any` - **Razón:** ~2000+ ocurrencias, requiere refactorización gradual de tipos
- ❌ `sonarjs/cognitive-complexity` - **Razón:** ~500+ funciones, requiere refactorización arquitectónica
- ❌ `sonarjs/no-nested-functions` - **Razón:** Requiere refactorización de patrones
- ❌ `sonarjs/no-nested-conditional` - **Razón:** Requiere refactorización de lógica condicional
- ❌ `sonarjs/no-all-duplicated-branches` - **Razón:** Puede tener falsos positivos
- ❌ `sonarjs/no-identical-expressions` - **Razón:** Puede tener falsos positivos
- ❌ `sonarjs/no-dead-store` - **Razón:** Puede tener falsos positivos

#### Seguridad Avanzada (Pueden Tener Falsos Positivos)
- ❌ Reglas de `security/detect-object-injection` - **Razón:** Muchos falsos positivos en código legacy
- ❌ Reglas de `security/detect-non-literal-regexp` - **Razón:** Requiere validación manual
- ❌ Reglas de `security/detect-non-literal-fs-filename` - **Razón:** Requiere validación manual

**Plan de Reducción:**
- Estas reglas se documentan en `lint:full` para tracking
- Se reducen gradualmente en nuevas features
- Se refactorizan en legacy code durante mantenimiento

### 2. `lint:changed` - Prevención de Regresión

**Uso:** `npm run lint:changed`

**Objetivo:** Verificar que los archivos modificados no introduzcan nuevos issues críticos.

**Comportamiento:**
- Detecta archivos cambiados vs `origin/main` (o HEAD si no hay origin/main)
- Ejecuta `lint:critical` solo sobre esos archivos
- Bloquea CI si se introducen nuevos issues críticos

**Ventajas:**
- ✅ Rápido (solo verifica archivos cambiados)
- ✅ Previene regresión sin bloquear por deuda histórica
- ✅ Permite desarrollo ágil

### 3. `lint:full` - Auditoría Completa

**Uso:** `npm run lint:full`

**Objetivo:** Auditoría completa de todo el código para tracking de deuda técnica.

**Comportamiento:**
- Ejecuta todas las reglas de ESLint
- **NO bloquea CI** - Solo para auditoría y tracking
- Muestra deuda técnica completa

**Reglas Incluidas (Además de Críticas):**

#### TypeScript Estricto
- ✅ `@typescript-eslint/no-explicit-any` - Uso de `any`
- ✅ Todas las reglas de type-checking estricto

#### Calidad de Código (SonarJS)
- ✅ `sonarjs/cognitive-complexity` - Complejidad cognitiva
- ✅ `sonarjs/no-nested-functions` - Funciones anidadas
- ✅ `sonarjs/no-nested-conditional` - Condicionales anidadas
- ✅ `sonarjs/no-all-duplicated-branches` - Ramas duplicadas
- ✅ `sonarjs/no-identical-expressions` - Expresiones idénticas
- ✅ `sonarjs/no-dead-store` - Variables muertas
- ✅ Todas las reglas de SonarJS recomendadas

#### Seguridad Avanzada
- ✅ Todas las reglas de `security` plugin
- ✅ `security/detect-object-injection`
- ✅ `security/detect-non-literal-regexp`
- ✅ `security/detect-non-literal-fs-filename`

**Uso:**
- Ejecutar periódicamente para tracking de deuda
- Integrar en reportes de calidad
- Usar para planificación de refactorización

## 🔧 Scripts Disponibles

### `npm run lint:critical`
Ejecuta ESLint en modo crítico sobre `src/**/*.{ts,tsx}`.
- **Bloquea CI** si hay issues críticos
- **Max warnings: 0**
- Solo reglas que bloquean issues realmente críticos

### `npm run lint:changed`
Ejecuta ESLint en modo crítico solo sobre archivos cambiados vs `origin/main`.
- **Bloquea CI** si se introducen nuevos issues críticos
- **Max warnings: 0**
- Previene regresión sin bloquear por deuda histórica

### `npm run lint:full`
Ejecuta ESLint completo sobre todo el código.
- **NO bloquea CI** - Solo auditoría
- Muestra deuda técnica completa
- Útil para tracking y planificación

### `npm run check:critical-issues`
Ejecuta el gate completo de CI:
```bash
npm run lint:critical && npm run lint:changed && npm run test:run
```

## 📊 Estado Actual de Deuda Técnica

### Issues Críticos (Bloquean CI)
- **Estado:** ✅ Bajo control
- **Acción:** Se corrigen inmediatamente

### Deuda Técnica (No Bloquea CI)
- **`@typescript-eslint/no-explicit-any`:** ~2000+ ocurrencias
  - **Plan:** Refactorización gradual en nuevas features
  - **Prioridad:** Media
- **`sonarjs/cognitive-complexity`:** ~500+ funciones
  - **Plan:** Refactorización durante mantenimiento
  - **Prioridad:** Baja
- **Reglas de seguridad avanzada:** ~300+ warnings
  - **Plan:** Validación manual y corrección gradual
  - **Prioridad:** Media

## 🎯 Plan de Reducción de Deuda

### Fase 1: Prevención (En Curso)
- ✅ Nuevas features no introducen `any`
- ✅ Nuevas features mantienen complejidad baja
- ✅ Nuevas features pasan todas las reglas de seguridad

### Fase 2: Refactorización Gradual (Próximos 3 meses)
- Refactorizar funciones con alta complejidad cognitiva
- Eliminar uso de `any` en código legacy
- Validar y corregir warnings de seguridad

### Fase 3: Consolidación (Próximos 6 meses)
- Reducir deuda técnica a <10% del código base
- Activar reglas adicionales en modo crítico
- Mantener calidad alta sin bloquear desarrollo

## 📝 Notas Importantes

1. **No cambiar reglas críticas sin consenso del equipo**
2. **Documentar cualquier excepción temporal**
3. **Revisar periódicamente qué reglas deberían ser críticas**
4. **Mantener balance entre calidad y velocidad de desarrollo**

## 🔄 Integración con CI/CD

### GitHub Actions / CI Pipeline

```yaml
- name: Check Critical Issues
  run: npm run check:critical-issues

- name: Full Audit (No Blocking)
  run: npm run lint:full
  continue-on-error: true
```

### Pre-commit Hooks

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings 0"
    ]
  }
}
```

## 📚 Referencias

- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [SonarJS Rules](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [Security Plugin Rules](https://github.com/nodesecurity/eslint-plugin-security)
