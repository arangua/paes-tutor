# 🔄 Flujos Críticos End-to-End - PAES Tutor

**Fecha:** 2025-01-28  
**Estado:** ✅ Flujos Identificados

---

## 🎯 Flujos Críticos Identificados

### **1. Flujo de Autenticación y Acceso** 🔴 CRÍTICO

**Descripción:** Usuario se autentica y accede al sistema

**Pasos:**
1. Usuario visita `/auth/signin`
2. Ingresa credenciales
3. NextAuth valida credenciales (`src/lib/auth.ts`)
4. Se crea sesión JWT
5. Middleware verifica sesión
6. Usuario es redirigido a `/dashboard`

**Módulos involucrados:**
- `src/app/auth/signin/page.tsx`
- `src/lib/auth.ts`
- `src/lib/get-session.ts`
- `src/middleware.ts` (si existe)
- `src/app/dashboard/page.tsx`

**APIs:**
- `POST /api/auth/[...nextauth]`

**Tests requeridos:**
- ✅ Test E2E: Login completo
- ✅ Test unitario: Validación de credenciales
- ✅ Test integración: Creación de sesión

---

### **2. Flujo de Realización de Examen** 🔴 CRÍTICO

**Descripción:** Estudiante selecciona, realiza y obtiene resultados de un examen

**Pasos:**
1. Usuario navega a `/exams`
2. Selecciona un examen
3. Inicia examen en `/exams/[id]/take`
4. Sistema crea intento (`POST /api/attempts`)
5. Usuario responde preguntas (auto-guardado)
6. Sistema actualiza intento (`PUT /api/attempts/[id]`)
7. Usuario finaliza examen (`POST /api/attempts/[id]/submit`)
8. Sistema calcula puntaje (`src/lib/score-calculator.ts`)
9. Usuario ve resultados en `/exams/[id]/results` o `/attempts/[id]`

**Módulos involucrados:**
- `src/app/exams/page.tsx`
- `src/app/exams/[id]/take/page.tsx`
- `src/app/api/exams/route.ts`
- `src/app/api/attempts/route.ts`
- `src/app/api/attempts/[id]/route.ts`
- `src/app/api/attempts/[id]/submit/route.ts`
- `src/lib/score-calculator.ts`
- `src/lib/score-transformation.ts`
- `src/app/exams/[id]/results/page.tsx`
- `src/app/attempts/[id]/page.tsx`

**APIs:**
- `GET /api/exams` - Listar exámenes
- `GET /api/exams/[id]` - Obtener examen
- `POST /api/attempts` - Crear intento
- `PUT /api/attempts/[id]` - Actualizar respuestas
- `POST /api/attempts/[id]/submit` - Finalizar examen

**Tests requeridos:**
- ✅ Test E2E: Flujo completo de examen
- ✅ Test unitario: Cálculo de puntajes
- ✅ Test integración: Creación y actualización de intentos

---

### **3. Flujo de Analytics y Progreso** 🟡 IMPORTANTE

**Descripción:** Usuario visualiza su progreso y analytics

**Pasos:**
1. Usuario accede a `/dashboard`
2. Sistema obtiene analytics (`GET /api/analytics`)
3. Se muestran gráficos y estadísticas
4. Usuario puede ver comparaciones (`/analytics/comparison`)
5. Usuario puede ver análisis de errores (`/analytics/errors`)
6. Usuario puede ver análisis de tiempo (`/analytics/time`)

**Módulos involucrados:**
- `src/app/dashboard/page.tsx`
- `src/app/api/analytics/route.ts`
- `src/app/api/analytics/comparison/route.ts`
- `src/app/api/analytics/errors/route.ts`
- `src/app/api/analytics/time/route.ts`
- `src/lib/analytics.ts`
- `src/components/dashboard/`
- `src/components/charts/`

**APIs:**
- `GET /api/analytics`
- `GET /api/analytics/comparison`
- `GET /api/analytics/errors`
- `GET /api/analytics/time`

**Tests requeridos:**
- ✅ Test E2E: Visualización de dashboard
- ✅ Test integración: Cálculo de analytics
- ✅ Test unitario: Funciones de analytics

---

### **4. Flujo de Recomendaciones** 🟡 IMPORTANTE

**Descripción:** Sistema genera y muestra recomendaciones personalizadas

**Pasos:**
1. Sistema analiza rendimiento del usuario
2. Genera recomendaciones (`src/lib/recommendations.ts`)
3. Usuario accede a `/recommendations`
4. Sistema obtiene recomendaciones (`GET /api/recommendations`)
5. Se muestran recomendaciones personalizadas

**Módulos involucrados:**
- `src/lib/recommendations.ts`
- `src/app/api/recommendations/route.ts`
- `src/app/recommendations/page.tsx`
- `src/components/recommendations/`

**APIs:**
- `GET /api/recommendations`

**Tests requeridos:**
- ✅ Test integración: Generación de recomendaciones
- ✅ Test unitario: Algoritmo de recomendaciones

---

### **5. Flujo de Práctica por Tema** 🟡 IMPORTANTE

**Descripción:** Usuario practica preguntas de un tema específico

**Pasos:**
1. Usuario selecciona tema
2. Accede a `/practice/[topicId]`
3. Sistema obtiene preguntas (`GET /api/practice/questions`)
4. Usuario responde preguntas
5. Sistema guarda respuestas (`POST /api/practice/sessions`)
6. Usuario puede ver historial (`/practice/[topicId]/history`)

**Módulos involucrados:**
- `src/app/practice/[topicId]/page.tsx`
- `src/app/practice/[topicId]/history/page.tsx`
- `src/app/api/practice/questions/route.ts`
- `src/app/api/practice/sessions/route.ts`
- `src/app/api/practice/topic-history/route.ts`

**APIs:**
- `GET /api/practice/questions`
- `POST /api/practice/sessions`
- `GET /api/practice/topic-history`

**Tests requeridos:**
- ✅ Test E2E: Práctica completa
- ✅ Test integración: Guardado de sesiones

---

### **6. Flujo de Gestión de Perfil** 🟢 ESTÁNDAR

**Descripción:** Usuario gestiona su perfil y configuración

**Pasos:**
1. Usuario accede a `/profile`
2. Visualiza información (`GET /api/user`)
3. Edita nombre/email (`PUT /api/user`)
4. Cambia contraseña (`PUT /api/user/password`)
5. Gestiona API keys de IA (`PUT /api/user/ai-keys`)

**Módulos involucrados:**
- `src/app/profile/page.tsx`
- `src/app/api/user/route.ts`
- `src/app/api/user/password/route.ts`
- `src/app/api/user/ai-keys/route.ts`
- `src/components/profile/`

**APIs:**
- `GET /api/user`
- `PUT /api/user`
- `PUT /api/user/password`
- `PUT /api/user/ai-keys`

**Tests requeridos:**
- ✅ Test E2E: Edición de perfil
- ✅ Test integración: Actualización de datos

---

### **7. Flujo de Materiales y Notas** 🟢 ESTÁNDAR

**Descripción:** Usuario gestiona materiales de estudio y notas

**Pasos:**
1. Usuario accede a `/materials` o `/notes`
2. Visualiza lista (`GET /api/materials` o `GET /api/notes`)
3. Crea/edita material o nota
4. Sistema guarda cambios
5. Usuario puede compartir (`POST /api/shared-materials` o `POST /api/shared-notes`)

**Módulos involucrados:**
- `src/app/materials/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/api/materials/route.ts`
- `src/app/api/notes/route.ts`
- `src/app/api/shared-materials/route.ts`
- `src/app/api/shared-notes/route.ts`
- `src/components/materials/`
- `src/components/notes/`

**APIs:**
- `GET /api/materials`
- `POST /api/materials`
- `GET /api/notes`
- `POST /api/notes`
- `POST /api/shared-materials`
- `POST /api/shared-notes`

**Tests requeridos:**
- ✅ Test integración: CRUD de materiales/notas

---

## 📊 Resumen de Flujos Críticos

| Flujo | Prioridad | Complejidad | Tests E2E | Tests Integración | Tests Unitarios |
|-------|-----------|-------------|-----------|-------------------|-----------------|
| Autenticación | 🔴 Crítico | Baja | ✅ 1 | ✅ 1 | ✅ 2 |
| Realización de Examen | 🔴 Crítico | Alta | ✅ 1 | ✅ 3 | ✅ 2 |
| Analytics y Progreso | 🟡 Importante | Media | ✅ 1 | ✅ 4 | ✅ 1 |
| Recomendaciones | 🟡 Importante | Media | ❌ 0 | ✅ 1 | ✅ 1 |
| Práctica por Tema | 🟡 Importante | Media | ✅ 1 | ✅ 3 | ❌ 0 |
| Gestión de Perfil | 🟢 Estándar | Baja | ✅ 1 | ✅ 2 | ❌ 0 |
| Materiales y Notas | 🟢 Estándar | Media | ❌ 0 | ✅ 4 | ❌ 0 |

**Total Tests E2E requeridos:** 5 tests (suficiente para 2 usuarios)

---

## 🎯 Tests E2E Mínimos Recomendados

### **Test 1: Flujo de Autenticación**
```typescript
// e2e/auth.spec.ts
test('Usuario puede autenticarse y acceder al dashboard', async ({ page }) => {
  // Login → Dashboard
});
```

### **Test 2: Flujo Completo de Examen**
```typescript
// e2e/exam-flow.spec.ts
test('Usuario puede realizar un examen completo', async ({ page }) => {
  // Seleccionar examen → Realizar → Ver resultados
});
```

### **Test 3: Visualización de Analytics**
```typescript
// e2e/analytics.spec.ts
test('Usuario puede ver su progreso y analytics', async ({ page }) => {
  // Dashboard → Analytics → Comparaciones
});
```

### **Test 4: Práctica por Tema**
```typescript
// e2e/practice.spec.ts
test('Usuario puede practicar preguntas de un tema', async ({ page }) => {
  // Seleccionar tema → Practicar → Ver historial
});
```

### **Test 5: Gestión de Perfil**
```typescript
// e2e/profile.spec.ts
test('Usuario puede editar su perfil', async ({ page }) => {
  // Perfil → Editar → Guardar
});
```

---

**Documento generado:** 2025-01-28  
**Versión:** 1.0

