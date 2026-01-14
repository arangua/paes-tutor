# 📋 Mapa de Módulos - PAES Tutor

**Fecha:** 2025-01-28  
**Estado:** ✅ Inventario Completo

---

## 🏗️ Estructura del Proyecto

### **Arquitectura General**
- **Framework:** Next.js 16.1.0 (App Router)
- **Lenguaje:** TypeScript 5
- **Base de Datos:** Prisma + SQLite (desarrollo)
- **Autenticación:** NextAuth.js v5
- **Testing:** Vitest (unitarios), Playwright (E2E)

---

## 📁 Módulos por Capa

### **1. src/lib/** - Lógica de Negocio y Utilidades

#### **1.1 Autenticación y Seguridad** (Crítico)
- `auth.ts` - Autenticación NextAuth
- `auth.test.ts` - Tests de autenticación
- `get-session.ts` - Obtener sesión actual
- `get-session.test.ts` - Tests de sesión
- `security.ts` - Helpers de seguridad (sanitización, validación)
- `security.test.ts` - Tests de seguridad
- `security-logger.ts` - Logging de eventos de seguridad
- `security-logger.test.ts` - Tests de security logger
- `check-admin.ts` - Verificación de permisos admin

#### **1.2 Validación y Helpers** (Crítico)
- `validations.ts` - Schemas Zod para validación
- `validation-helpers.ts` - Helpers de validación
- `api-helpers.ts` - Helpers para APIs (handleApiError, etc.)
- `error-messages.ts` - Mensajes de error centralizados

#### **1.3 Rate Limiting y Middleware** (Crítico)
- `rate-limit.ts` - Rate limiting con Upstash Redis
- `rate-limit.test.ts` - Tests de rate limiting
- `rate-limit-middleware.ts` - Middleware de rate limiting

#### **1.4 Base de Datos y Caché** (Crítico)
- `prisma.ts` - Cliente Prisma
- `cache.ts` - Sistema de caché (in-memory + Redis)

#### **1.5 Cálculo de Puntajes** (Crítico)
- `score-calculator.ts` - Cálculo de puntajes PAES
- `score-transformation.ts` - Transformación de puntajes

#### **1.6 Exámenes y Generación** (Crítico)
- `exam-generator.ts` - Generador de exámenes
- `exam-generator.test.ts` - Tests de generador

#### **1.7 Analytics y Recomendaciones** (Importante)
- `analytics.ts` - Lógica de analytics
- `recommendations.ts` - Sistema de recomendaciones

#### **1.8 Servicios Externos** (Importante)
- `ai-service.ts` - Servicio de IA (OpenAI, Anthropic, Gemini)
- `logger.ts` - Logging estructurado (Pino)
- `monitoring.ts` - Monitoreo y métricas
- `notifications.ts` - Sistema de notificaciones
- `webhooks.ts` - Manejo de webhooks

#### **1.9 Utilidades Especializadas**
- `admission-calendar.ts` - Calendario de admisión
- `admission-calendar.test.ts` - Tests de calendario
- `challenge-constants.ts` - Constantes de challenges
- `challenge-helpers.ts` - Helpers de challenges
- `challenge-timeout.test.ts` - Tests de timeout
- `challenge-timeout.ts` - Timeout de challenges
- `color-contrast.ts` - Utilidades de contraste de color
- `constants.ts` - Constantes generales
- `encryption.ts` - Encriptación de datos
- `encryption.test.ts` - Tests de encriptación
- `error-history-integration.ts` - Integración de historial de errores
- `export-utils.ts` - Utilidades de exportación (PDF, Excel, etc.)
- `official-statistics.ts` - Estadísticas oficiales PAES
- `retry.ts` - Lógica de reintentos
- `shortcut-actions.ts` - Acciones de atajos de teclado
- `spaced-repetition.ts` - Algoritmo de repetición espaciada
- `subject-icons.tsx` - Iconos de asignaturas
- `utils.ts` - Utilidades generales

#### **1.10 Subdirectorio utils/**
- `auth-helpers.ts` - Helpers de autenticación
- `deepEqual.ts` - Comparación profunda
- `deepEqual.test.ts` - Tests de deepEqual
- `embeddings.ts` - Generación de embeddings
- `text-diff.ts` - Diferencias de texto
- `text-diff.test.ts` - Tests de text-diff
- `version-content.ts` - Contenido de versiones
- `version-validators.ts` - Validadores de versiones

#### **1.11 Subdirectorio types/**
- `versions.ts` - Tipos de versiones

---

### **2. src/app/api/** - API Routes

#### **2.1 Autenticación** (Crítico)
- `auth/[...nextauth]/route.ts` - Handler de NextAuth

#### **2.2 Exámenes e Intentos** (Crítico)
- `exams/route.ts` - Listar/crear exámenes
- `exams/route.test.ts` - Tests de exámenes
- `exams/[id]/route.ts` - Obtener examen específico
- `exams/[id]/route.test.ts` - Tests de examen específico
- `attempts/route.ts` - Crear/listar intentos
- `attempts/route.test.ts` - Tests de intentos
- `attempts/[id]/route.ts` - Obtener/actualizar intento
- `attempts/[id]/route.test.ts` - Tests de intento específico
- `attempts/[id]/submit/route.ts` - Enviar intento
- `attempts/[id]/submit/route.test.ts` - Tests de envío

#### **2.3 Analytics** (Importante)
- `analytics/route.ts` - Analytics general
- `analytics/route.test.ts` - Tests de analytics
- `analytics/comparison/route.ts` - Comparaciones
- `analytics/comparison/route.test.ts` - Tests de comparación
- `analytics/direct-comparison/route.ts` - Comparación directa
- `analytics/direct-comparison/route.test.ts` - Tests
- `analytics/errors/route.ts` - Análisis de errores
- `analytics/errors/route.test.ts` - Tests de errores
- `analytics/joint-progress/route.ts` - Progreso conjunto
- `analytics/joint-progress/route.test.ts` - Tests
- `analytics/time/route.ts` - Análisis de tiempo
- `analytics/time/route.test.ts` - Tests de tiempo

#### **2.4 Recomendaciones** (Importante)
- `recommendations/route.ts` - Recomendaciones
- `recommendations/route.test.ts` - Tests de recomendaciones

#### **2.5 Práctica y Challenges** (Importante)
- `practice/questions/route.ts` - Preguntas de práctica
- `practice/questions/route.test.ts` - Tests
- `practice/sessions/route.ts` - Sesiones de práctica
- `practice/sessions/route.test.ts` - Tests
- `practice/stats/route.ts` - Estadísticas de práctica
- `practice/stats/route.test.ts` - Tests
- `practice/topic-history/route.ts` - Historial por tema
- `practice/topic-history/route.test.ts` - Tests
- `challenges/route.ts` - Challenges
- `challenges/route.test.ts` - Tests de challenges
- `challenges/[id]/route.ts` - Challenge específico
- `challenges/[id]/route.test.ts` - Tests
- `challenges/[id]/complete/route.ts` - Completar challenge
- `challenges/[id]/complete/route.test.ts` - Tests
- `challenges/cleanup/route.ts` - Limpieza de challenges

#### **2.6 Materiales y Notas** (Importante)
- `materials/route.ts` - Materiales de estudio
- `materials/route.test.ts` - Tests de materiales
- `materials/[id]/route.ts` - Material específico
- `materials/[id]/route.test.ts` - Tests
- `notes/route.ts` - Notas de estudio
- `notes/versions/` - Sistema de versiones de notas (81 archivos)

#### **2.7 Flashcards** (Importante)
- `flashcards/route.ts` - Flashcards
- `flashcards/route.test.ts` - Tests de flashcards
- `flashcards/auto-create/route.ts` - Auto-creación

#### **2.8 Bookmarks** (Importante)
- `bookmarks/route.ts` - Bookmarks
- `bookmarks/route.test.ts` - Tests de bookmarks
- `bookmarks/check/route.ts` - Verificar bookmark
- `bookmarks/check/route.test.ts` - Tests

#### **2.9 Notificaciones** (Importante)
- `notifications/route.ts` - Notificaciones
- `notifications/route.test.ts` - Tests
- `notifications/[id]/route.ts` - Notificación específica
- `notifications/[id]/route.test.ts` - Tests
- `notifications/read-all/route.ts` - Marcar todas como leídas
- `notifications/read-all/route.test.ts` - Tests

#### **2.10 Usuario y Perfil** (Importante)
- `user/route.ts` - Información de usuario
- `user/route.test.ts` - Tests de usuario
- `user/password/route.ts` - Cambio de contraseña
- `user/ai-keys/route.ts` - Gestión de API keys de IA
- `student/route.ts` - Información de estudiante
- `student/route.test.ts` - Tests de estudiante

#### **2.11 Búsqueda** (Importante)
- `search/route.ts` - Búsqueda global
- `search/route.test.ts` - Tests de búsqueda

#### **2.12 Compartir Recursos** (Importante)
- `shared-exams/route.ts` - Compartir exámenes
- `shared-exams/[id]/route.ts` - Examen compartido específico
- `shared-flashcards/route.ts` - Compartir flashcards
- `shared-flashcards/[id]/route.ts` - Flashcard compartida
- `shared-materials/route.ts` - Compartir materiales
- `shared-materials/[id]/route.ts` - Material compartido
- `shared-notes/route.ts` - Compartir notas
- `shared-notes/[id]/route.ts` - Nota compartida

#### **2.13 Admin** (Opcional)
- `admin/generate-exam/route.ts` - Generar examen
- `admin/import-exams/route.ts` - Importar exámenes
- `admin/import-exams/route.test.ts` - Tests
- `admin/import-answer-key/route.ts` - Importar clave de respuestas
- `admin/import-answer-key/route.test.ts` - Tests
- `admin/import-topics/route.ts` - Importar temas
- `admin/fetch-demre-pdfs/route.ts` - Obtener PDFs DEMRE
- `admin/fetch-demre-pdfs/route.test.ts` - Tests
- `admin/cleanup-test-data/route.ts` - Limpiar datos de test
- `admin/cleanup-test-data/route.test.ts` - Tests

#### **2.14 Otros**
- `subjects/route.ts` - Asignaturas
- `subjects/route.test.ts` - Tests de asignaturas
- `topics/route.ts` - Temas
- `topics/route.test.ts` - Tests de temas
- `careers/route.ts` - Carreras
- `careers/[id]/route.ts` - Carrera específica
- `metrics/route.ts` - Métricas generales
- `metrics/route.test.ts` - Tests de métricas
- `metrics/challenges/route.ts` - Métricas de challenges
- `statistics/route.ts` - Estadísticas
- `admission-calendar/route.ts` - Calendario de admisión
- `admission-calendar/route.test.ts` - Tests
- `score-transformation/route.ts` - Transformación de puntajes
- `schedule/route.ts` - Horarios
- `review/quick/route.ts` - Revisión rápida
- `health/route.ts` - Health check
- `health/route.test.ts` - Tests de health
- `ai/chat/route.ts` - Chat con IA
- `ai/config/route.ts` - Configuración de IA
- `webhooks/route.ts` - Webhooks
- `webhooks/route.test.ts` - Tests de webhooks
- `webhooks/deliveries/route.ts` - Entregas de webhooks
- `webhooks/deliveries/route.test.ts` - Tests

---

### **3. src/hooks/** - Custom Hooks

- `useAutoSave.ts` - Auto-guardado
- `useAutoSave.test.ts` - Tests de auto-guardado
- `useDebounce.ts` - Debounce
- `useDebounce.test.ts` - Tests de debounce
- `useExams.ts` - Hook de exámenes
- `useExams.test.ts` - Tests de hook de exámenes
- `useErrorHistory.ts` - Historial de errores
- `useProgressTracker.ts` - Seguimiento de progreso
- `useSearchHistory.ts` - Historial de búsqueda
- `useSmartAutocomplete.ts` - Autocompletado inteligente
- `useTrash.ts` - Gestión de papelera
- `useUndoRedo.ts` - Deshacer/Rehacer
- `useGlobalUndoRedo.ts` - Deshacer/Rehacer global
- `useKeyboardShortcuts.ts` - Atajos de teclado
- `useCustomizableShortcuts.ts` - Atajos personalizables
- `useOnlineStatus.ts` - Estado de conexión
- `useScoreImprovement.tsx` - Mejora de puntajes
- `useAchievementDetector.tsx` - Detección de logros

---

### **4. src/components/** - Componentes React

#### **4.1 Layout y Navegación**
- `layout/Header.tsx` - Header principal
- `layout/Sidebar.tsx` - Sidebar
- `layout/Breadcrumbs.tsx` - Breadcrumbs

#### **4.2 Dashboard**
- `dashboard/` - Componentes del dashboard (8 archivos)

#### **4.3 Exámenes**
- `exams/ExamCard.tsx` - Card de examen
- `exams/ExamCard.test.tsx` - Tests de ExamCard
- `question-review.tsx` - Revisión de preguntas

#### **4.4 Analytics**
- `analytics/` - Componentes de analytics (1 archivo)
- `charts/` - Componentes de gráficos (1 archivo)

#### **4.5 Recomendaciones**
- `recommendations/` - Componentes de recomendaciones (2 archivos)

#### **4.6 Materiales y Notas**
- `materials/` - Componentes de materiales (2 archivos)
- `notes/` - Componentes de notas (4 archivos)

#### **4.7 Flashcards**
- `flashcards/` - Componentes de flashcards (2 archivos)

#### **4.8 Bookmarks**
- `bookmarks/` - Componentes de bookmarks (1 archivo)

#### **4.9 Challenges**
- `challenges/` - Componentes de challenges (1 archivo)

#### **4.10 Perfil**
- `profile/` - Componentes de perfil (3 archivos)

#### **4.11 Notificaciones**
- `notifications/` - Componentes de notificaciones (1 archivo)

#### **4.12 Búsqueda**
- `search/` - Componentes de búsqueda (1 archivo)

#### **4.13 UI Base (Shadcn)**
- `ui/` - Componentes UI base (32 archivos)

#### **4.14 Otros**
- `ErrorBoundary.tsx` - Error boundary
- `ErrorBoundary.test.tsx` - Tests de ErrorBoundary
- `ErrorBoundaryWrapper.tsx` - Wrapper de error boundary
- `error-boundary.tsx` - Error boundary alternativo
- `GlobalErrorHandler.tsx` - Manejador global de errores
- `keyboard-shortcuts-provider.tsx` - Proveedor de atajos
- `providers/` - Proveedores (1 archivo)
- `pwa/` - Componentes PWA (2 archivos)
- `settings/` - Componentes de configuración (2 archivos)
- `theme/` - Componentes de tema (1 archivo)
- `tutorial/` - Componentes de tutorial (2 archivos)
- `trash/` - Componentes de papelera (1 archivo)
- `help/` - Componentes de ayuda (3 archivos)
- `explanations/` - Componentes de explicaciones (2 archivos)
- `export/` - Componentes de exportación (1 archivo)
- `animations/` - Componentes de animaciones (2 archivos)

---

### **5. src/app/** - Páginas (App Router)

#### **5.1 Páginas Principales**
- `page.tsx` - Página de inicio
- `layout.tsx` - Layout principal
- `globals.css` - Estilos globales

#### **5.2 Autenticación**
- `auth/signin/page.tsx` - Página de login

#### **5.3 Dashboard**
- `dashboard/page.tsx` - Dashboard principal
- `dashboard/page.test.tsx` - Tests del dashboard

#### **5.4 Exámenes**
- `exams/page.tsx` - Listado de exámenes
- `exams/[id]/take/page.tsx` - Realizar examen
- `exams/[id]/results/page.tsx` - Resultados de examen

#### **5.5 Intentos**
- `attempts/[id]/page.tsx` - Detalle de intento

#### **5.6 Práctica**
- `practice/[topicId]/page.tsx` - Práctica por tema
- `practice/[topicId]/history/page.tsx` - Historial de práctica

#### **5.7 Analytics**
- `analytics/page.tsx` - Analytics
- `analytics/comparison/page.tsx` - Comparaciones
- `analytics/errors/page.tsx` - Análisis de errores
- `analytics/time/page.tsx` - Análisis de tiempo

#### **5.8 Recomendaciones**
- `recommendations/page.tsx` - Recomendaciones

#### **5.9 Materiales**
- `materials/page.tsx` - Materiales de estudio

#### **5.10 Notas**
- `notes/page.tsx` - Notas de estudio

#### **5.11 Flashcards**
- `flashcards/page.tsx` - Flashcards
- `flashcards/[id]/page.tsx` - Flashcard específica
- `flashcards/study/page.tsx` - Estudiar flashcards

#### **5.12 Bookmarks**
- `bookmarks/page.tsx` - Bookmarks

#### **5.13 Challenges**
- `challenges/page.tsx` - Challenges

#### **5.14 Notificaciones**
- `notifications/page.tsx` - Notificaciones

#### **5.15 Perfil**
- `profile/page.tsx` - Perfil de usuario

#### **5.16 Compartir**
- `shared-exams/page.tsx` - Exámenes compartidos
- `shared-flashcards/page.tsx` - Flashcards compartidas
- `shared-materials/page.tsx` - Materiales compartidos
- `shared-notes/page.tsx` - Notas compartidas

#### **5.17 Comparación**
- `comparison/page.tsx` - Comparación

#### **5.18 Otros**
- `schedule/page.tsx` - Horarios
- `review/page.tsx` - Revisión
- `ai-tutor/page.tsx` - Tutor de IA
- `help/page.tsx` - Ayuda
- `admin/page.tsx` - Panel de administración

---

## 🔗 Dependencias Críticas

### **Flujo de Dependencias:**
1. **Base:** `src/lib/prisma.ts` → Todas las APIs
2. **Seguridad:** `src/lib/auth.ts` → Todas las APIs protegidas
3. **Validación:** `src/lib/validations.ts` → Todas las APIs
4. **Rate Limiting:** `src/lib/rate-limit.ts` → APIs públicas
5. **Cálculo:** `src/lib/score-calculator.ts` → APIs de intentos
6. **Analytics:** `src/lib/analytics.ts` → APIs de analytics

---

## 📊 Estadísticas

- **Total de módulos en src/lib:** ~50 archivos
- **Total de API routes:** ~80 endpoints
- **Total de hooks:** ~15 hooks
- **Total de componentes:** ~100 componentes
- **Total de páginas:** ~25 páginas

---

## 🎯 Priorización para Revisión

### **Nivel 1 - Crítico (Revisar Primero)**
1. Autenticación y seguridad (`src/lib/auth.ts`, `src/lib/security.ts`)
2. Validación (`src/lib/validations.ts`)
3. Rate limiting (`src/lib/rate-limit.ts`)
4. APIs de exámenes e intentos (`src/app/api/exams/`, `src/app/api/attempts/`)
5. Cálculo de puntajes (`src/lib/score-calculator.ts`)

### **Nivel 2 - Importante (Revisar Segundo)**
1. Analytics (`src/lib/analytics.ts`, `src/app/api/analytics/`)
2. Recomendaciones (`src/lib/recommendations.ts`, `src/app/api/recommendations/`)
3. Práctica y challenges (`src/app/api/practice/`, `src/app/api/challenges/`)
4. Materiales y notas (`src/app/api/materials/`, `src/app/api/notes/`)

### **Nivel 3 - Estándar (Revisar Tercero)**
1. Hooks personalizados (`src/hooks/`)
2. Componentes UI (`src/components/`)
3. Páginas (`src/app/`)

---

**Documento generado:** 2025-01-28  
**Versión:** 1.0

