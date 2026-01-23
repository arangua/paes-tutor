# 📋 Fase 2: Plan Detallado de Revisión por Bloques

**Fecha:** 2025-01-28  
**Estado:** ✅ Plan Creado

---

## 🎯 Estrategia de Revisión

### **Orden de Ejecución (por dependencias y riesgo):**
1. **src/lib/** - Utilidades base (sin dependencias externas)
2. **src/app/api/** - APIs (dependen de src/lib)
3. **src/hooks/** - Hooks (dependen de APIs y lib)
4. **src/components/** - Componentes (dependen de hooks y APIs)
5. **src/app/** - Páginas (dependen de todo lo anterior)

---

## 📦 BLOQUE 1: src/lib - Utilidades Base y Helpers Críticos

### **Archivos a Revisar (8 archivos):**
1. `src/lib/prisma.ts` - Cliente Prisma
2. `src/lib/utils.ts` - Utilidades generales
3. `src/lib/constants.ts` - Constantes
4. `src/lib/error-messages.ts` - Mensajes de error
5. `src/lib/api-helpers.ts` - Helpers para APIs
6. `src/lib/utils/deepEqual.ts` - Comparación profunda
7. `src/lib/utils/deepEqual.test.ts` - Tests existentes
8. `src/lib/utils/text-diff.ts` - Diferencias de texto

**Prioridad:** 🔴 CRÍTICO (base de todo el sistema)

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que `prisma.ts` exporta cliente correctamente
- [ ] Verificar que `utils.ts` tiene funciones esenciales (safeDivide, ensureFiniteNumber, etc.)
- [ ] Verificar que `constants.ts` tiene todas las constantes necesarias
- [ ] Verificar que `error-messages.ts` tiene mensajes para todos los casos
- [ ] Verificar que `api-helpers.ts` tiene `handleApiError` y helpers de validación
- [ ] Verificar que `deepEqual.ts` funciona correctamente
- [ ] Verificar que `text-diff.ts` genera diferencias correctamente
- [ ] Verificar casos edge: valores null, undefined, objetos anidados

#### **2b) Robustez**
- [ ] Manejo de errores en todas las funciones
- [ ] Validación de inputs (tipos, null checks)
- [ ] Try-catch en operaciones críticas
- [ ] Logging estructurado donde aplica
- [ ] Circuit breakers si aplica (no aplica en este bloque)
- [ ] Rate limiting si aplica (no aplica en este bloque)
- [ ] Sanitización de inputs si aplica

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto (sin `any` explícito)
- [ ] Documentación JSDoc en funciones públicas
- [ ] Complejidad ciclomática < 10
- [ ] Funciones pequeñas y enfocadas (< 50 líneas)
- [ ] Nombres descriptivos
- [ ] Sin código duplicado
- [ ] Tests con cobertura > 80%

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/utils.test.ts` (NUEVO)
   - Test: `safeDivide` con casos normales y edge
   - Test: `ensureFiniteNumber` con valores válidos e inválidos
   - Test: Otras funciones de utilidad

2. `src/lib/utils/deepEqual.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre todos los casos

3. `src/lib/utils/text-diff.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre todos los casos

4. `src/lib/api-helpers.test.ts` (NUEVO)
   - Test: `handleApiError` con diferentes tipos de errores
   - Test: Helpers de validación

5. `src/lib/error-messages.test.ts` (NUEVO - opcional)
   - Test: Verificar que todos los códigos tienen mensajes

#### **Tests de Integración:**
- No aplica (este bloque no tiene APIs)

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios (solo este bloque)
npm run test -- src/lib/utils.test.ts src/lib/api-helpers.test.ts src/lib/utils/deepEqual.test.ts src/lib/utils/text-diff.test.ts

# 4. Build (verificar que no rompe)
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 80%
- ✅ Build: exitoso sin errores

---

## 📦 BLOQUE 2: src/lib - Validación y Seguridad

### **Archivos a Revisar (7 archivos):**
1. `src/lib/validations.ts` - Schemas Zod
2. `src/lib/validation-helpers.ts` - Helpers de validación
3. `src/lib/security.ts` - Helpers de seguridad
4. `src/lib/security.test.ts` - Tests existentes
5. `src/lib/security-logger.ts` - Logging de seguridad
6. `src/lib/security-logger.test.ts` - Tests existentes
7. `src/lib/encryption.ts` - Encriptación
8. `src/lib/encryption.test.ts` - Tests existentes

**Prioridad:** 🔴 CRÍTICO (seguridad)

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que `validations.ts` tiene schemas para todas las APIs
- [ ] Verificar que `validation-helpers.ts` valida correctamente
- [ ] Verificar que `security.ts` sanitiza inputs (XSS protection)
- [ ] Verificar que `security-logger.ts` registra eventos de seguridad
- [ ] Verificar que `encryption.ts` encripta/desencripta correctamente
- [ ] Verificar casos edge: inputs maliciosos, valores null/undefined

#### **2b) Robustez**
- [ ] Validación exhaustiva de todos los inputs
- [ ] Sanitización de strings (XSS, SQL injection)
- [ ] Manejo seguro de errores (no exponer información sensible)
- [ ] Logging de intentos de seguridad
- [ ] Encriptación robusta (algoritmos seguros)
- [ ] Rate limiting si aplica (no aplica en este bloque)

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc
- [ ] Tests con cobertura > 90% (crítico para seguridad)
- [ ] Sin código duplicado
- [ ] Funciones pequeñas y enfocadas

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/validations.test.ts` (NUEVO)
   - Test: Todos los schemas Zod validan correctamente
   - Test: Casos edge (valores null, undefined, tipos incorrectos)

2. `src/lib/validation-helpers.test.ts` (NUEVO)
   - Test: Helpers de validación funcionan correctamente

3. `src/lib/security.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre: sanitización, detección de patrones peligrosos

4. `src/lib/security-logger.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre todos los casos de logging

5. `src/lib/encryption.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre: encriptación, desencriptación, casos edge

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios (solo este bloque)
npm run test -- src/lib/validations.test.ts src/lib/validation-helpers.test.ts src/lib/security.test.ts src/lib/security-logger.test.ts src/lib/encryption.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 90%
- ✅ Build: exitoso

---

## 📦 BLOQUE 3: src/lib - Autenticación y Sesiones

### **Archivos a Revisar (4 archivos):**
1. `src/lib/auth.ts` - Configuración NextAuth
2. `src/lib/auth.test.ts` - Tests existentes
3. `src/lib/get-session.ts` - Obtener sesión
4. `src/lib/get-session.test.ts` - Tests existentes
5. `src/lib/check-admin.ts` - Verificación admin

**Prioridad:** 🔴 CRÍTICO (autenticación)

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que `auth.ts` configura NextAuth correctamente
- [ ] Verificar que `get-session.ts` obtiene sesión correctamente
- [ ] Verificar que `check-admin.ts` verifica permisos correctamente
- [ ] Verificar casos edge: sesión expirada, usuario no autenticado

#### **2b) Robustez**
- [ ] Manejo seguro de tokens JWT
- [ ] Validación de sesiones
- [ ] Protección contra ataques de sesión
- [ ] Logging de eventos de autenticación
- [ ] Manejo de errores sin exponer información sensible

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc
- [ ] Tests con cobertura > 90%
- [ ] Código claro y mantenible

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/auth.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre: configuración, callbacks

2. `src/lib/get-session.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre: sesión válida, sesión inválida, no autenticado

3. `src/lib/check-admin.test.ts` (NUEVO)
   - Test: Usuario admin
   - Test: Usuario no admin
   - Test: Usuario no autenticado

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios
npm run test -- src/lib/auth.test.ts src/lib/get-session.test.ts src/lib/check-admin.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 90%
- ✅ Build: exitoso

---

## 📦 BLOQUE 4: src/lib - Rate Limiting y Caché

### **Archivos a Revisar (5 archivos):**
1. `src/lib/rate-limit.ts` - Rate limiting
2. `src/lib/rate-limit.test.ts` - Tests existentes
3. `src/lib/rate-limit-middleware.ts` - Middleware
4. `src/lib/cache.ts` - Sistema de caché
5. `src/lib/retry.ts` - Lógica de reintentos

**Prioridad:** 🔴 CRÍTICO (protección y performance)

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que `rate-limit.ts` limita requests correctamente
- [ ] Verificar que `rate-limit-middleware.ts` aplica límites
- [ ] Verificar que `cache.ts` cachea y recupera datos correctamente
- [ ] Verificar que `retry.ts` reintenta operaciones correctamente
- [ ] Verificar casos edge: límites alcanzados, caché expirado

#### **2b) Robustez**
- [ ] Manejo de errores en rate limiting
- [ ] Invalidación correcta de caché
- [ ] Circuit breakers en reintentos
- [ ] Logging de eventos críticos
- [ ] Fallbacks apropiados

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc
- [ ] Tests con cobertura > 80%
- [ ] Configuración clara

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/rate-limit.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre: límites, expiración, diferentes tipos

2. `src/lib/cache.test.ts` (NUEVO)
   - Test: Guardar y recuperar del caché
   - Test: Invalidación de caché
   - Test: Expiración de caché

3. `src/lib/retry.test.ts` (NUEVO)
   - Test: Reintentos exitosos
   - Test: Reintentos fallidos
   - Test: Exponential backoff

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios
npm run test -- src/lib/rate-limit.test.ts src/lib/cache.test.ts src/lib/retry.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 80%
- ✅ Build: exitoso

---

## 📦 BLOQUE 5: src/lib - Cálculo de Puntajes

### **Archivos a Revisar (3 archivos):**
1. `src/lib/score-calculator.ts` - Cálculo de puntajes PAES
2. `src/lib/score-transformation.ts` - Transformación de puntajes
3. `src/lib/official-statistics.ts` - Estadísticas oficiales

**Prioridad:** 🔴 CRÍTICO (lógica de negocio core)

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que `score-calculator.ts` calcula puntajes correctamente
- [ ] Verificar que `score-transformation.ts` transforma puntajes según reglas PAES
- [ ] Verificar que `official-statistics.ts` usa estadísticas oficiales
- [ ] Verificar casos edge: puntajes 0, puntajes máximos, valores null

#### **2b) Robustez**
- [ ] Validación de inputs (números válidos, rangos)
- [ ] Manejo de errores (división por cero, valores inválidos)
- [ ] Precisión numérica (redondeo correcto)
- [ ] Logging de cálculos críticos

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc (especialmente fórmulas)
- [ ] Tests con cobertura > 90% (crítico para lógica de negocio)
- [ ] Código claro y comentado

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/score-calculator.test.ts` (NUEVO)
   - Test: Cálculo correcto de puntajes
   - Test: Casos edge (0, máximo, valores inválidos)
   - Test: Precisión numérica

2. `src/lib/score-transformation.test.ts` (NUEVO)
   - Test: Transformación según reglas PAES
   - Test: Diferentes procesos de admisión
   - Test: Casos edge

3. `src/lib/official-statistics.test.ts` (NUEVO)
   - Test: Uso correcto de estadísticas oficiales
   - Test: Validación de datos

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios
npm run test -- src/lib/score-calculator.test.ts src/lib/score-transformation.test.ts src/lib/official-statistics.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 90%
- ✅ Build: exitoso

---

## 📦 BLOQUE 6: src/lib - Exámenes y Generación

### **Archivos a Revisar (2 archivos):**
1. `src/lib/exam-generator.ts` - Generador de exámenes
2. `src/lib/exam-generator.test.ts` - Tests existentes

**Prioridad:** 🟡 IMPORTANTE

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que genera exámenes correctamente
- [ ] Verificar distribución de preguntas por tema
- [ ] Verificar casos edge: sin preguntas, temas sin preguntas

#### **2b) Robustez**
- [ ] Validación de inputs
- [ ] Manejo de errores
- [ ] Logging

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc
- [ ] Tests con cobertura > 80%

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/exam-generator.test.ts` (YA EXISTE - verificar cobertura)
   - Verificar que cubre todos los casos

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios
npm run test -- src/lib/exam-generator.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 80%
- ✅ Build: exitoso

---

## 📦 BLOQUE 7: src/lib - Analytics y Recomendaciones

### **Archivos a Revisar (2 archivos):**
1. `src/lib/analytics.ts` - Lógica de analytics
2. `src/lib/recommendations.ts` - Sistema de recomendaciones

**Prioridad:** 🟡 IMPORTANTE

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que `analytics.ts` calcula métricas correctamente
- [ ] Verificar que `recommendations.ts` genera recomendaciones relevantes
- [ ] Verificar casos edge: sin datos, datos insuficientes

#### **2b) Robustez**
- [ ] Validación de datos
- [ ] Manejo de errores
- [ ] Performance (no bloquea con grandes volúmenes)

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc
- [ ] Tests con cobertura > 75%

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/analytics.test.ts` (NUEVO)
   - Test: Cálculo de métricas
   - Test: Casos edge

2. `src/lib/recommendations.test.ts` (NUEVO)
   - Test: Generación de recomendaciones
   - Test: Casos edge

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios
npm run test -- src/lib/analytics.test.ts src/lib/recommendations.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 75%
- ✅ Build: exitoso

---

## 📦 BLOQUE 8: src/lib - Servicios y Utilidades Restantes

### **Archivos a Revisar (10 archivos - dividir si es necesario):**
1. `src/lib/logger.ts` - Logging estructurado
2. `src/lib/monitoring.ts` - Monitoreo
3. `src/lib/notifications.ts` - Notificaciones
4. `src/lib/ai-service.ts` - Servicio de IA
5. `src/lib/admission-calendar.ts` - Calendario de admisión
6. `src/lib/admission-calendar.test.ts` - Tests existentes
7. `src/lib/challenge-helpers.ts` - Helpers de challenges
8. `src/lib/challenge-timeout.ts` - Timeout de challenges
9. `src/lib/challenge-timeout.test.ts` - Tests existentes
10. `src/lib/export-utils.ts` - Utilidades de exportación

**Prioridad:** 🟢 ESTÁNDAR

---

### **Checklist de Revisión - 3 Capas**

#### **2a) Funcionalidad Crítica**
- [ ] Verificar que cada servicio funciona correctamente
- [ ] Verificar casos edge

#### **2b) Robustez**
- [ ] Manejo de errores
- [ ] Logging
- [ ] Timeouts apropiados

#### **2c) Mantenibilidad**
- [ ] TypeScript estricto
- [ ] Documentación JSDoc
- [ ] Tests con cobertura > 70%

---

### **Tests a Crear/Actualizar**

#### **Tests Unitarios Requeridos:**
1. `src/lib/admission-calendar.test.ts` (YA EXISTE - verificar cobertura)
2. `src/lib/challenge-timeout.test.ts` (YA EXISTE - verificar cobertura)
3. Tests nuevos para servicios críticos si aplica

---

### **Comandos de Verificación al Cerrar Bloque**

```bash
# 1. Lint
npm run lint:strict

# 2. Type Check
npm run validate:types

# 3. Tests Unitarios
npm run test -- src/lib/admission-calendar.test.ts src/lib/challenge-timeout.test.ts

# 4. Build
npm run build
```

**Criterio de Éxito:**
- ✅ Lint: 0 warnings
- ✅ Type Check: 0 errors
- ✅ Tests: 100% passing, cobertura > 70%
- ✅ Build: exitoso

---

## 📝 Notas Importantes

1. **Orden de ejecución:** Los bloques deben ejecutarse en orden (1 → 8)
2. **Criterios de éxito:** Todos los comandos deben pasar antes de continuar
3. **Tests:** Crear tests nuevos donde falten, actualizar existentes si es necesario
4. **Documentación:** Agregar JSDoc donde falte
5. **TypeScript:** Corregir errores de tipos encontrados

---

**Documento generado:** 2025-01-28  
**Versión:** 1.0  
**Próximo paso:** Ejecutar Bloque 1

