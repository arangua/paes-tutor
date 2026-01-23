# 🤝 Guía de Contribución

Gracias por tu interés en contribuir a PAES Tutor. Esta guía te ayudará a entender cómo contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y acogedor para todos.

## 🚀 Cómo Contribuir

### 1. Fork y Clone

1. Haz fork del repositorio
2. Clona tu fork:
   ```bash
   git clone https://github.com/tu-usuario/paes-tutor.git
   cd paes-tutor
   ```

### 2. Configura el Entorno

Sigue las instrucciones en [README.md](README.md) para configurar el entorno de desarrollo.

### 3. Crea una Rama

Crea una rama para tu feature o fix:

```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/nombre-del-fix
```

**Convención de nombres:**

- `feature/` - Para nuevas funcionalidades
- `fix/` - Para correcciones de bugs
- `docs/` - Para documentación
- `refactor/` - Para refactorización
- `test/` - Para tests

### 4. Realiza tus Cambios

- Escribe código limpio y bien documentado
- Sigue los estándares de código del proyecto
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 5. Ejecuta Tests

Asegúrate de que todos los tests pasen:

```bash
npm run test:run
npm run lint
```

### 6. Commit tus Cambios

Usa mensajes de commit descriptivos:

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad X"
```

**Formato de commits (Conventional Commits):**

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formato, punto y coma, etc.
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

### 7. Push y Pull Request

```bash
git push origin feature/nombre-de-tu-feature
```

Luego crea un Pull Request en GitHub.

## 🛠️ Configuración del Entorno

### Requisitos

- Node.js 20.x o superior
- npm, yarn, pnpm o bun
- Git

### Pasos

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Edita .env con tus valores
   ```

3. **Configurar base de datos**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 📝 Estándares de Código

### TypeScript

- Usa TypeScript strict mode
- Define tipos explícitos cuando sea necesario
- Evita `any` cuando sea posible
- Usa interfaces para objetos complejos

### Estilo de Código

- Usa ESLint (configurado en el proyecto)
- Sigue las convenciones de Next.js
- Usa nombres descriptivos para variables y funciones
- Comenta código complejo

### Estructura de Archivos

- Organiza componentes en carpetas lógicas
- Un componente por archivo
- Usa `index.ts` para exports cuando sea apropiado

### Tests

- Escribe tests para nuevas funcionalidades
- Mantén cobertura > 75% para código crítico
- Usa nombres descriptivos para tests
- Agrupa tests relacionados con `describe`

### Ejemplo de Test

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from './myModule'

describe('myFunction', () => {
  it('debe retornar el resultado correcto', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })
})
```

## 🔄 Proceso de Pull Request

### ⚠️ PR Gate Mínimo (Enterprise)

**Reglas obligatorias antes de crear un PR:**

1. ✅ `npm run ci:check` debe pasar antes de PR
2. ❌ No se aceptan flags locales para estabilizar tests
3. ✅ Para allowlist: usar `// guard:allow-secret` (solo casos legítimos)
4. ⚠️ Warning budget solo se actualiza con decisión documentada

**Baselines enforced:** Ver `docs/BASELINE_INMUTABLE.md` para referencia completa.

### 🚀 Release Gate (Enterprise)

**Antes de merge a main (o release), debe pasar `npm run ci:release`** (automático en main / manual según política).

**Qué incluye:**
- ✅ `ci:check` (todos los guards y tests)
- ✅ Typecheck (`typecheck` = `tsc --noEmit`)
- ✅ Lint completo (`lint`)
- ✅ Build de producción (`build`)

**Workflow:** `.github/workflows/release-gate.yml` se ejecuta automáticamente en push a `main` o manualmente via `workflow_dispatch`.

---

### Antes de Crear el PR

1. ✅ Todos los tests pasan
2. ✅ El linter no muestra errores
3. ✅ La documentación está actualizada
4. ✅ Los commits siguen el formato Conventional Commits

### Crear el PR

1. **Título descriptivo**
   - Ejemplo: `feat: agregar sistema de notificaciones`

2. **Descripción detallada**
   - Qué cambia y por qué
   - Cómo probar los cambios
   - Screenshots si aplica
   - Issues relacionados

3. **Checklist**
   - [ ] Tests agregados/actualizados
   - [ ] Documentación actualizada
   - [ ] Linter sin errores
   - [ ] Tests pasando

### Revisión

- Responde a comentarios de revisión
- Haz cambios si se solicitan
- Mantén el PR actualizado con la rama principal

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que el bug no haya sido reportado ya
2. Prueba con la última versión del código
3. Recolecta información relevante

### Cómo Reportar

Usa el template de issue y proporciona:

1. **Descripción clara del bug**
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Screenshots** (si aplica)
6. **Entorno**:
   - OS
   - Versión de Node.js
   - Versión del navegador
   - Versión del proyecto

### Ejemplo

```markdown
**Descripción:**
El botón de submit no funciona en la página de exámenes.

**Pasos para reproducir:**

1. Ir a /exams/123/take
2. Responder preguntas
3. Hacer click en "Enviar"
4. Nada sucede

**Comportamiento esperado:**
Debería mostrar la página de resultados.

**Comportamiento actual:**
No pasa nada al hacer click.

**Entorno:**

- OS: Windows 11
- Node.js: 20.10.0
- Navegador: Chrome 120
```

## 💡 Sugerir Mejoras

### Feature Requests

1. Verifica que la feature no exista ya
2. Describe la feature claramente
3. Explica por qué sería útil
4. Proporciona ejemplos de uso si es posible

### Template

```markdown
**Feature:**
Descripción breve

**Motivación:**
Por qué sería útil esta feature

**Descripción detallada:**
Cómo funcionaría

**Alternativas consideradas:**
Otras opciones que consideraste

**Ejemplos:**
Ejemplos de cómo se usaría
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

## ❓ Preguntas

Si tienes preguntas, puedes:

- Abrir un issue con la etiqueta `question`
- Contactar a los mantenedores del proyecto

---

**Gracias por contribuir a PAES Tutor! 🎉**
