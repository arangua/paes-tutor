# 🏗️ Arquitectura del Proyecto - PAES Tutor

Este documento describe la arquitectura, decisiones de diseño y patrones utilizados en PAES Tutor.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Patrones de Diseño](#patrones-de-diseño)
- [Flujo de Datos](#flujo-de-datos)
- [Seguridad](#seguridad)
- [Performance](#performance)

## 🎯 Visión General

PAES Tutor es una aplicación web full-stack construida con Next.js 16 (App Router), que utiliza React Server Components y API Routes para crear una experiencia de usuario fluida y performante.

### Principios de Diseño

1. **Separación de Responsabilidades**: Cada módulo tiene una responsabilidad clara
2. **Reutilización**: Componentes y utilidades reutilizables
3. **Type Safety**: TypeScript en todo el proyecto
4. **Seguridad First**: Validación, sanitización y autenticación robusta
5. **Performance**: Optimizaciones desde el inicio

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 16.1.0**: Framework React con App Router
- **React 19.2.3**: Biblioteca UI
- **TypeScript 5**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **Shadcn UI**: Componentes UI accesibles
- **Recharts**: Gráficos y visualizaciones

### Backend

- **Next.js API Routes**: Endpoints REST
- **Prisma 7.2.0**: ORM para base de datos
- **NextAuth.js v5**: Autenticación y autorización
- **Zod 4.2.1**: Validación de esquemas

### Base de Datos

- **SQLite**: Base de datos local (desarrollo)
- **Compatible con PostgreSQL/MySQL**: Para producción

### Infraestructura

- **Pino**: Logging estructurado
- **Upstash Redis**: Rate limiting (producción)
- **Vitest**: Testing unitario
- **Playwright**: Testing E2E

## 🏛️ Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────┐
│              Cliente (Navegador)                 │
│  React Components | Next.js App Router           │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTP/HTTPS
                   │
┌──────────────────▼──────────────────────────────┐
│           Next.js Server                         │
│  ┌──────────────────────────────────────────┐   │
│  │  Middleware (Auth, Rate Limiting)        │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  API Routes (REST Endpoints)              │   │
│  │  - Validación (Zod)                      │   │
│  │  - Sanitización                          │   │
│  │  - Rate Limiting                         │   │
│  │  - Logging                               │   │
│  └──────────────────┬───────────────────────┘   │
│                     │                            │
│  ┌──────────────────▼───────────────────────┐   │
│  │  Business Logic Layer                     │   │
│  │  - Recommendations                       │   │
│  │  - Analytics                             │   │
│  │  - Cache                                 │   │
│  └──────────────────┬───────────────────────┘   │
└─────────────────────┼────────────────────────────┘
                      │
                      │ Prisma ORM
                      │
┌─────────────────────▼────────────────────────────┐
│           Base de Datos (SQLite)                 │
│  - Users, Students                                │
│  - Exams, Questions, Options                      │
│  - Attempts, Answers                              │
│  - Performance Metrics                            │
└───────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
paes-tutor/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── attempts/         # Endpoints de intentos
│   │   │   ├── exams/            # Endpoints de exámenes
│   │   │   ├── student/           # Endpoints de estudiante
│   │   │   ├── recommendations/   # Endpoints de recomendaciones
│   │   │   ├── analytics/         # Endpoints de analytics
│   │   │   └── materials/         # Endpoints de materiales
│   │   ├── dashboard/             # Página de dashboard
│   │   ├── exams/                 # Páginas de exámenes
│   │   ├── materials/             # Páginas de materiales
│   │   ├── profile/               # Página de perfil
│   │   ├── analytics/             # Página de analytics
│   │   └── layout.tsx             # Layout raíz
│   │
│   ├── components/                # Componentes React
│   │   ├── ui/                    # Componentes UI base (Shadcn)
│   │   ├── dashboard/             # Componentes del dashboard
│   │   ├── layout/                # Componentes de layout
│   │   ├── charts/                # Componentes de gráficos
│   │   ├── materials/             # Componentes de materiales
│   │   └── recommendations/      # Componentes de recomendaciones
│   │
│   ├── lib/                       # Utilidades y helpers
│   │   ├── prisma.ts              # Cliente Prisma
│   │   ├── auth.ts                # Configuración NextAuth
│   │   ├── security.ts            # Utilidades de seguridad
│   │   ├── security-logger.ts     # Logger de seguridad
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── cache.ts               # Sistema de caché
│   │   ├── logger.ts              # Logger estructurado
│   │   ├── api-helpers.ts         # Helpers para APIs
│   │   ├── validations.ts         # Schemas Zod
│   │   ├── recommendations.ts     # Algoritmo de recomendaciones
│   │   └── analytics.ts           # Funciones de analytics
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useExams.ts            # Hook para exámenes
│   │   ├── useDebounce.ts         # Hook de debounce
│   │   └── useAutoSave.ts         # Hook de auto-guardado
│   │
│   └── middleware.ts              # Middleware de Next.js
│
├── prisma/
│   ├── schema.prisma              # Schema de base de datos
│   └── seed.ts                    # Datos de ejemplo
│
├── e2e/                           # Tests E2E
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   └── api.spec.ts
│
└── public/                        # Archivos estáticos
```

## 🎨 Patrones de Diseño

### 1. Server Components y Client Components

**Server Components** (por defecto):

- Renderizado en el servidor
- Acceso directo a base de datos
- Sin JavaScript en el cliente
- Mejor performance

**Client Components** (`'use client'`):

- Interactividad
- Hooks de React
- Estado del cliente
- Event handlers

### 2. API Routes Pattern

Todas las API routes siguen este patrón:

```typescript
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      // 1. Autenticación
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // 2. Validación
      const validation = validateQuery(request, schema)
      if (!validation.success) {
        return validation.error
      }

      // 3. Lógica de negocio
      const data = await getData(validation.data)

      // 4. Respuesta
      return NextResponse.json(data)
    } catch (error) {
      return handleApiError(error, 'Mensaje de error')
    }
  })
}
```

### 3. Custom Hooks Pattern

Hooks reutilizables para lógica compleja:

```typescript
export function useExams(options: UseExamsOptions) {
  const [exams, setExams] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Lógica de carga
  }, [options])

  return { exams, isLoading, error }
}
```

### 4. Validation Layer

Validación en múltiples capas:

1. **Frontend**: Validación con Zod antes de enviar
2. **API**: Validación con Zod en el endpoint
3. **Database**: Constraints de Prisma

### 5. Caching Strategy

- **In-memory cache**: Para desarrollo
- **Redis cache**: Para producción (Upstash)
- **Cache keys**: Organizados por tipo de dato
- **Invalidation**: Automática en operaciones de escritura

## 🔄 Flujo de Datos

### Flujo de Autenticación

```
Usuario → Login → NextAuth → JWT Token → Cookie → Middleware → API
```

### Flujo de Creación de Intento

```
Cliente → POST /api/attempts → Validación → Prisma → Cache → Respuesta
```

### Flujo de Renderizado

```
Request → Middleware → Layout → Page → Server Components → HTML
```

## 🔒 Seguridad

### Capas de Seguridad

1. **Middleware**: Protección de rutas
2. **Autenticación**: NextAuth.js con JWT
3. **Validación**: Zod schemas
4. **Sanitización**: Automática en helpers
5. **Rate Limiting**: Por IP y tipo de operación
6. **Logging**: Eventos de seguridad registrados

### Protecciones Implementadas

- ✅ XSS: Sanitización de inputs
- ✅ SQL Injection: Prisma (queries parametrizadas)
- ✅ CSRF: NextAuth tokens
- ✅ Rate Limiting: Prevención de abuso
- ✅ Input Validation: Zod schemas

## ⚡ Performance

### Optimizaciones

1. **Paginación**: Todas las listas paginadas
2. **Select Queries**: Solo campos necesarios
3. **Caching**: Queries frecuentes cacheadas
4. **Lazy Loading**: Componentes pesados
5. **Code Splitting**: Automático con Next.js

### Métricas Objetivo

- Tiempo de respuesta API: < 200ms (con cache)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## 📊 Base de Datos

### Schema Principal

- **User**: Usuarios del sistema
- **Student**: Estudiantes (relacionado con User)
- **Subject**: Asignaturas
- **Topic**: Temas (relacionado con Subject)
- **Exam**: Exámenes
- **Question**: Preguntas
- **Option**: Opciones de respuesta
- **Attempt**: Intentos de examen
- **Answer**: Respuestas de intentos
- **PerformanceMetric**: Métricas de rendimiento
- **StudyMaterial**: Materiales de estudio

### Relaciones

- User 1:1 Student
- Subject 1:N Topic
- Exam N:1 Subject
- Exam N:M Question (ExamQuestion)
- Question 1:N Option
- Attempt N:1 Student, N:1 Exam
- Answer N:1 Attempt, N:1 Question, N:1 Option

## 🧪 Testing

### Estrategia de Testing

1. **Unit Tests**: Funciones y componentes aislados
2. **Integration Tests**: Flujos completos de APIs
3. **E2E Tests**: Flujos de usuario completos

### Cobertura Objetivo

- APIs: > 75%
- Componentes críticos: > 80%
- Utilidades: > 90%

## 🚀 Despliegue

### Entornos

- **Development**: SQLite local, rate limiting en memoria
- **Production**: PostgreSQL/MySQL, Upstash Redis, HTTPS

### CI/CD

- GitHub Actions
- Tests automáticos en PR
- Build y deploy automático

---

**Última actualización**: 2025-01-27
