# 🏆 Estándar Enterprise - PAES Tutor

## 📋 Documentación del Estándar Congelado

**Versión:** 1.0.0  
**Fecha de Congelación:** $(date)  
**Nivel:** Enterprise / Internacional (Google/Microsoft)

---

## 🎯 Objetivo

Este documento define el estándar de código congelado para el proyecto PAES Tutor. **Todas las contribuciones deben cumplir con este estándar.**

---

## ✅ Reglas de Código

### **1. TypeScript**

- ✅ **Prohibido `any`** - Usar tipos específicos o `unknown`
- ✅ **Variables no usadas** - Error (excepto con prefijo `_`)
- ✅ **Tipos explícitos** - Requeridos en funciones públicas
- ✅ **Validación de tipos** - `tsc --noEmit` debe pasar

### **2. ESLint**

- ✅ **`no-console`** - Error (excepto `console.warn` y `console.error`)
- ✅ **`no-debugger`** - Error
- ✅ **`no-explicit-any`** - Error
- ✅ **`no-unused-vars`** - Error (excepto con prefijo `_`)
- ✅ **Max warnings: 0** - No se permiten warnings

### **3. Funciones Seguras**

- ✅ **Usar funciones seguras** - `safeDivide()`, `safeRound()`, `safeAverage()`, etc.
- ✅ **Prohibido Math directo** - Usar funciones seguras de `validation-utils.ts`
- ✅ **Prohibido división directa** - Usar `safeDivide()`
- ✅ **Prohibido `toISOString()` directo** - Usar `safeToISOString()`

### **4. Seguridad**

- ✅ **No secrets hardcodeados** - Usar variables de entorno
- ✅ **Validación de inputs** - Zod schemas en todas las APIs
- ✅ **CUID validation** - IDs deben ser CUID válidos
- ✅ **Rate limiting** - Implementado en todas las APIs

### **5. Testing**

- ✅ **Cobertura mínima** - 55% líneas, 40% funciones, 50% branches
- ✅ **Cobertura crítica** - 75% en `src/app/api/**/*.ts`
- ✅ **Tests de regresión** - Para funciones seguras
- ✅ **Tests E2E** - Para flujos críticos

### **6. Performance**

- ✅ **Lazy loading** - Componentes pesados
- ✅ **Code splitting** - Automático con Next.js
- ✅ **Circuit breakers** - En operaciones críticas
- ✅ **Caching** - Para datos frecuentes

---

## 🔧 Herramientas Configuradas

### **Pre-commit (Husky)**
- ✅ Lint-staged (ESLint + Prettier)
- ✅ Validación de tipos TypeScript
- ✅ Validación de console.log/debugger
- ✅ Tests de regresión (si aplica)

### **Pre-push (Husky)**
- ✅ Tests unitarios
- ✅ Cobertura de tests
- ✅ Build de producción
- ✅ Validación de issues críticos

### **CI/CD (GitHub Actions)**
- ✅ Tests unitarios y E2E
- ✅ Análisis SonarCloud
- ✅ CodeQL security scan
- ✅ Dependabot (actualizaciones automáticas)
- ✅ Security scan (Trivy)
- ✅ Performance tests (Lighthouse)

---

## 📊 Quality Gates

### **Bloqueantes (deben pasar)**
- ✅ Linter estricto (`npm run lint:strict`)
- ✅ Validación de tipos (`npm run validate:types`)
- ✅ Tests unitarios (`npm run test:run`)
- ✅ Build de producción (`npm run build`)

### **Advertencias (no bloquean)**
- ⚠️ Cobertura de tests (se reporta pero no bloquea)
- ⚠️ Security scan (se reporta pero no bloquea)
- ⚠️ Performance tests (se reporta pero no bloquea)

---

## 🚫 Prácticas Prohibidas

1. ❌ **`console.log()` en producción** - Usar `logger` de `@/lib/logger`
2. ❌ **`debugger` en código** - Remover antes de commit
3. ❌ **`any` explícito** - Usar tipos específicos
4. ❌ **División directa** - Usar `safeDivide()`
5. ❌ **Secrets hardcodeados** - Usar variables de entorno
6. ❌ **Validación sin Zod** - Todas las APIs deben usar Zod
7. ❌ **Sin manejo de errores** - Usar `handleApiError()`
8. ❌ **Sin logging estructurado** - Usar `logger` con contexto

---

## ✅ Checklist Pre-Commit

Antes de hacer commit, verificar:

- [ ] `npm run lint:strict` pasa
- [ ] `npm run validate:types` pasa
- [ ] `npm run validate:secrets` pasa
- [ ] No hay `console.log` (excepto en logger.ts)
- [ ] No hay `debugger`
- [ ] No hay `any` explícito
- [ ] Se usan funciones seguras
- [ ] Tests pasan (`npm run test:run`)
- [ ] Build funciona (`npm run build`)

---

## 📝 Guía de Contribución

Ver `GUIA_CONTRIBUCION.md` para detalles completos.

---

## 🔄 Actualización del Estándar

Este estándar está **congelado**. Para modificarlo:

1. Crear issue con justificación
2. Revisión por el equipo
3. Actualizar este documento
4. Notificar a todos los contribuidores

---

## 📚 Referencias

- `REGLAS_CODIGO.md` - Reglas detalladas de código
- `GUIA_CONTRIBUCION.md` - Guía para contribuidores
- `FASE_1_ENTERPRISE_COMPLETA.md` - Mejoras de Fase 1
- `FASE_2_COMPLETA_100_PORCIENTO.md` - Mejoras de Fase 2
- `FASE_3_ENTERPRISE_PLAN_OPTIMIZADO.md` - Plan de Fase 3

---

**Última actualización:** $(date)  
**Mantenido por:** Equipo de Desarrollo PAES Tutor

