# 📖 Guía de Estilo - PAES Tutor

**Versión:** 1.0.0  
**Última actualización:** 2025-01-28

---

## 🎨 Guía Visual

### Colores

#### Paleta Principal

```css
/* Primario - Azul oscuro */
Primary: #1a1f2e
Primary Hover: #2a3441
Primary Foreground: #f8f9fa

/* Secundario - Gris claro */
Secondary: #f1f3f5
Secondary Foreground: #1a1f2e

/* Destructivo - Rojo */
Destructive: #dc2626
Destructive Hover: #b91c1c

/* Acento - Azul claro */
Accent: #3b82f6
Accent Foreground: #ffffff
```

#### Colores Semánticos

```css
/* Éxito */
Success: #10b981
Success Background: #d1fae5

/* Advertencia */
Warning: #f59e0b
Warning Background: #fef3c7

/* Error */
Error: #ef4444
Error Background: #fee2e2

/* Información */
Info: #3b82f6
Info Background: #dbeafe
```

### Tipografía

#### Jerarquía

```css
/* Títulos */
h1: 2.25rem (36px) - font-bold
h2: 1.875rem (30px) - font-semibold
h3: 1.5rem (24px) - font-semibold
h4: 1.25rem (20px) - font-medium

/* Cuerpo */
Body Large: 1.125rem (18px) - font-normal
Body: 1rem (16px) - font-normal
Body Small: 0.875rem (14px) - font-normal
Caption: 0.75rem (12px) - font-normal
```

#### Fuentes

- **Sans**: Geist Sans (principal)
- **Mono**: Geist Mono (código)

### Espaciado

Sistema de 4px:

```
0.5: 2px
1:   4px
2:   8px
3:   12px
4:   16px
6:   24px
8:   32px
12:  48px
16:  64px
```

---

## 🖼️ Componentes Visuales

### Botones

#### Estilos

1. **Primary** (default)
   - Fondo: Primary color
   - Texto: Blanco
   - Uso: Acciones principales

2. **Secondary**
   - Fondo: Secondary color
   - Texto: Primary color
   - Uso: Acciones secundarias

3. **Outline**
   - Borde: Primary color
   - Fondo: Transparente
   - Uso: Acciones menos importantes

4. **Ghost**
   - Sin borde ni fondo
   - Hover: Background sutil
   - Uso: Acciones terciarias

5. **Destructive**
   - Fondo: Rojo
   - Texto: Blanco
   - Uso: Acciones destructivas

#### Tamaños

- **Small**: 32px altura, padding 12px
- **Default**: 36px altura, padding 16px
- **Large**: 40px altura, padding 24px

### Cards

#### Estructura

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido principal
  </CardContent>
</Card>
```

#### Estilos

- **Borde**: 1px sólido, color border
- **Radio**: 12px (rounded-xl)
- **Sombra**: shadow-sm
- **Padding**: 24px (py-6)

### Inputs

#### Estados

1. **Default**
   - Borde: border-input
   - Fondo: bg-transparent

2. **Focus**
   - Borde: ring color
   - Ring: 3px

3. **Error**
   - Borde: destructive color
   - Ring: destructive/20

4. **Success**
   - Borde: green-500
   - Icono: CheckCircle2

### Badges

#### Variantes

- **Default**: Fondo primary, texto blanco
- **Secondary**: Fondo secondary, texto primary
- **Destructive**: Fondo rojo, texto blanco
- **Outline**: Borde, fondo transparente

---

## 📝 Lenguaje y Tono

### Principios

1. **Claro y Directo**
   - Evitar jerga técnica
   - Frases cortas
   - Lenguaje natural

2. **Positivo y Alentador**
   - "¡Excelente progreso!" en lugar de "Bien hecho"
   - "Continúa así" en lugar de "No está mal"

3. **Accionable**
   - Verbos en imperativo
   - Instrucciones claras
   - Pasos específicos

### Ejemplos

#### ✅ Bueno

- "Guarda tus cambios antes de continuar"
- "Selecciona al menos una opción"
- "Tu progreso se guardó correctamente"

#### ❌ Evitar

- "Error: campo requerido" (muy técnico)
- "OK" (demasiado genérico)
- "Haz clic aquí" (no específico)

---

## 🎯 Iconografía

### Librería

**Lucide React** - Iconos consistentes y modernos

### Uso

1. **Tamaños Estándar**
   - Pequeño: 16px (h-4 w-4)
   - Mediano: 20px (h-5 w-5)
   - Grande: 24px (h-6 w-6)

2. **Contexto**
   - Iconos contextuales según tipo de contenido
   - Colores semánticos cuando es apropiado
   - Tooltips descriptivos

### Iconos Comunes

- **Acciones**: Plus, Trash2, Edit, Save
- **Navegación**: ArrowRight, ArrowLeft, Home
- **Estados**: CheckCircle2, XCircle, AlertCircle, Loader2
- **Contenido**: BookOpen, FileText, Tag, Clock

---

## 📱 Responsive Design

### Breakpoints

```css
sm:  640px   /* Móvil grande */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
2xl: 1536px  /* Desktop extra grande */
```

### Estrategia

1. **Mobile First**: Diseñar primero para móvil
2. **Progressive Enhancement**: Agregar features en pantallas grandes
3. **Touch Targets**: Mínimo 44px × 44px
4. **Contenido**: Priorizar información importante

---

## ♿ Accesibilidad

### Contraste

- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Componentes UI**: Mínimo 3:1

### Navegación

- **Teclado**: Todas las funciones accesibles
- **Focus**: Indicadores visibles
- **Skip Links**: Para saltar contenido repetitivo

### ARIA

- **Labels**: Siempre etiquetar inputs
- **Roles**: Usar roles semánticos
- **States**: Indicar estados (aria-invalid, aria-disabled)

---

## ✅ Checklist de Diseño

Antes de crear un nuevo componente:

- [ ] Usa componentes base existentes
- [ ] Sigue la guía de colores
- [ ] Implementa estados (hover, focus, disabled)
- [ ] Incluye estados de error y éxito
- [ ] Es responsive
- [ ] Es accesible (ARIA, teclado)
- [ ] Tiene documentación
- [ ] Usa TypeScript correctamente
- [ ] Sigue patrones establecidos

---

**Mantenido por:** Equipo de Diseño PAES Tutor  
**Última revisión:** 2025-01-28

