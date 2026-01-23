# 🎓 PAES Tutor

Sistema de tutoría y práctica para la Prueba de Acceso a la Educación Superior (PAES) de Chile.

## 📋 Descripción

PAES Tutor es una aplicación web completa que permite a los estudiantes:

- Realizar exámenes de práctica completos
- Ver resultados detallados con análisis de rendimiento
- Recibir recomendaciones personalizadas de estudio
- Acceder a materiales de estudio organizados
- Monitorear su progreso con analytics avanzados

## ✨ Características

### 🎯 Funcionalidades Principales

- ✅ **Sistema de Exámenes Interactivo**: Realiza exámenes completos con timer y auto-guardado
- ✅ **Dashboard Personalizado**: Visualiza estadísticas, gráficos y progreso
- ✅ **Sistema de Recomendaciones**: Recibe sugerencias personalizadas basadas en tu rendimiento
- ✅ **Materiales de Estudio**: Accede a recursos organizados por asignatura y tema
- ✅ **Analytics Avanzados**: Análisis profundo de rendimiento, predicción de puntajes PAES
- ✅ **Perfil de Usuario**: Gestiona tu información y contraseña

### 🔒 Seguridad

- ✅ Autenticación robusta con NextAuth.js v5
- ✅ Sanitización automática de inputs (protección XSS)
- ✅ Rate limiting granular por tipo de operación
- ✅ Logging de seguridad y detección de amenazas
- ✅ Validación exhaustiva con Zod

### ⚡ Performance

- ✅ Paginación en todas las listas
- ✅ Queries optimizadas con Prisma (select en lugar de include)
- ✅ Caché inteligente para queries frecuentes
- ✅ Lazy loading de componentes

### 🧪 Testing

- ✅ Tests unitarios con Vitest
- ✅ Tests E2E con Playwright
- ✅ CI/CD con GitHub Actions
- ✅ Cobertura de código > 75%

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20.x o superior
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd paes-tutor
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita `.env` y configura:
   - `NEXTAUTH_SECRET`: Genera un secret con `openssl rand -base64 32`
   - `DATABASE_URL`: Ruta a tu base de datos SQLite (por defecto: `file:./paes.db`)
   - `NEXTAUTH_URL`: URL de tu aplicación (por defecto: `http://localhost:3000`)

4. **Configurar base de datos**

   ```bash
   # Generar Prisma Client
   npx prisma generate

   # Ejecutar migraciones
   npx prisma migrate dev

   # Poblar base de datos con datos de ejemplo
   npx prisma db seed
   ```

5. **Iniciar servidor de desarrollo**

   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Usuario de Prueba

Después de ejecutar el seed, puedes iniciar sesión con:

- **Email**: `estudiante@example.com`
- **Contraseña**: `password123`

## 📚 Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta el linter
```

### Testing

```bash
npm test             # Ejecuta tests en modo watch
npm run test:run     # Ejecuta tests una vez
npm run test:ui      # Ejecuta tests con UI interactiva
npm run test:coverage # Genera reporte de cobertura
npm run test:e2e     # Ejecuta tests end-to-end
npm run test:e2e:ui  # Ejecuta tests E2E con UI
```

### Base de Datos

```bash
npx prisma studio    # Abre Prisma Studio (GUI para BD)
npx prisma migrate   # Ejecuta migraciones
npx prisma generate  # Genera Prisma Client
npx prisma db seed   # Pobla la base de datos
```

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 16.1.0 (App Router), React 19.2.3, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: SQLite (desarrollo), compatible con PostgreSQL/MySQL
- **Autenticación**: NextAuth.js v5
- **Validación**: Zod
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **Gráficos**: Recharts
- **Testing**: Vitest, Playwright
- **Logging**: Pino

### Estructura del Proyecto

```
paes-tutor/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Página de dashboard
│   │   ├── exams/          # Páginas de exámenes
│   │   ├── materials/      # Páginas de materiales
│   │   └── profile/        # Página de perfil
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI base
│   │   ├── dashboard/      # Componentes del dashboard
│   │   ├── layout/         # Componentes de layout
│   │   └── ...
│   ├── lib/                # Utilidades y helpers
│   │   ├── prisma.ts       # Cliente Prisma
│   │   ├── auth.ts         # Configuración NextAuth
│   │   ├── security.ts     # Utilidades de seguridad
│   │   └── ...
│   └── hooks/              # Custom hooks
├── prisma/
│   ├── schema.prisma       # Schema de base de datos
│   └── seed.ts             # Datos de ejemplo
├── e2e/                    # Tests E2E
└── public/                  # Archivos estáticos
```

## 🔐 Variables de Entorno

Ver [`.env.example`](.env.example) para la lista completa de variables de entorno.

### Variables Requeridas

- `DATABASE_URL`: URL de conexión a la base de datos
- `NEXTAUTH_SECRET`: Secret para firmar tokens JWT
- `NEXTAUTH_URL`: URL base de la aplicación

### Variables Opcionales

- `UPSTASH_REDIS_REST_URL`: Para rate limiting en producción
- `UPSTASH_REDIS_REST_TOKEN`: Token de Upstash Redis
- `LOG_LEVEL`: Nivel de logging (debug, info, warn, error)

## 📖 Documentación

- [Guía de Testing](TESTING.md) - Cómo ejecutar y escribir tests
- [Arquitectura del Proyecto](docs/ARCHITECTURE.md) - Documentación detallada de la arquitectura
- [Guía de Contribución](CONTRIBUTING.md) - Cómo contribuir al proyecto

## 🧪 Testing

### Tests Unitarios

Los tests unitarios están en archivos `*.test.ts` o `*.test.tsx` junto a los archivos que testean.

```bash
npm test
```

### Tests E2E

Los tests E2E están en la carpeta `e2e/` y usan Playwright.

```bash
npm run test:e2e
```

### Cobertura

Ver reporte de cobertura:

```bash
npm run test:coverage
# Abre coverage/index.html en el navegador
```

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel detectará Next.js automáticamente

### Docker

```bash
docker build -t paes-tutor .
docker run -p 3000:3000 paes-tutor
```

### Variables de Entorno en Producción

Asegúrate de configurar:

- `NEXTAUTH_SECRET`: Secret seguro (no el de desarrollo)
- `NEXTAUTH_URL`: URL de producción
- `DATABASE_URL`: URL de base de datos de producción
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`: Para rate limiting

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre cómo contribuir al proyecto.

## 📝 Licencia

Este proyecto es privado y de uso interno.

## 👥 Autores

- Equipo de Desarrollo PAES Tutor

## 🙏 Agradecimientos

- Next.js por el excelente framework
- Prisma por el ORM poderoso
- Shadcn UI por los componentes de UI
- La comunidad de código abierto

---

**Última actualización**: 2025-01-27
