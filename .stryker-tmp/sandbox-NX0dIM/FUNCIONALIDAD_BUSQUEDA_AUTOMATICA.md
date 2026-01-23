# ✅ Funcionalidad de Búsqueda Automática de PDFs

**Fecha:** 2025-01-27  
**Estado:** ✅ **IMPLEMENTADO**

---

## 🎯 Nueva Funcionalidad

Se ha agregado la capacidad de **buscar automáticamente PDFs desde páginas de DEMRE** sin necesidad de copiar manualmente las URLs.

---

## ✨ Características

### 1. Búsqueda Automática

- Ingresa la URL de una página de DEMRE
- El sistema busca automáticamente todos los enlaces a PDFs
- Extrae información relevante (título, asignatura, año)

### 2. Detección Inteligente

- **Asignatura:** Detecta automáticamente la asignatura del PDF basándose en el texto
- **Año:** Extrae el año del título o URL
- **Título:** Usa el texto del enlace como título

### 3. Interfaz Intuitiva

- Lista de PDFs encontrados con scroll
- Clic en un PDF para usarlo automáticamente en el formulario
- Visualización clara de información

---

## 📦 Paquetes Instalados

```bash
npm install axios cheerio
npm install --save-dev @types/cheerio
```

- **axios:** Para hacer peticiones HTTP
- **cheerio:** Para parsear HTML y extraer enlaces

---

## 🔧 Archivos Creados/Modificados

### Nuevo Endpoint API

- **`src/app/api/admin/fetch-demre-pdfs/route.ts`**
  - Endpoint POST para buscar PDFs
  - Extrae enlaces desde páginas HTML
  - Detecta asignatura y año automáticamente
  - Protegido con autenticación y rate limiting

### Página de Importación Mejorada

- **`src/app/admin/import-exams/page.tsx`**
  - Nueva sección de búsqueda automática
  - Lista de PDFs encontrados
  - Integración con formulario de importación

### Middleware Actualizado

- **`src/middleware.ts`**
  - Protección para `/api/admin/*`

---

## 🚀 Cómo Usar

### Opción 1: Búsqueda Automática (Recomendado)

1. **Accede a la página de importación:**
   - Menú → "Importar Exámenes"
   - O: `/admin/import-exams`

2. **Busca PDFs automáticamente:**
   - En la sección "🔍 Obtener PDFs Automáticamente desde DEMRE"
   - Ingresa la URL de la página de DEMRE (ya viene prellenada)
   - Haz clic en "Buscar PDFs"

3. **Selecciona un PDF:**
   - Aparecerá una lista de PDFs encontrados
   - Haz clic en el PDF que quieres importar
   - Se llenará automáticamente el formulario

4. **Completa y ajusta:**
   - Revisa que la asignatura y año sean correctos
   - Ajusta el título si es necesario
   - Haz clic en "Importar Exámenes"

### Opción 2: Manual (Alternativa)

Si la búsqueda automática no funciona o prefieres hacerlo manualmente:

- Sigue las instrucciones en la sección "📝 Instrucciones Manuales"
- Copia y pega las URLs manualmente

---

## 🔍 Detección de Asignaturas

El sistema detecta automáticamente las siguientes asignaturas:

| Patrón             | Asignatura Detectada         |
| ------------------ | ---------------------------- |
| lector, lectora    | Competencia Lectora          |
| matemática m1, m1  | Matemática M1                |
| matemática m2, m2  | Matemática M2                |
| biología, biologia | Ciencias - Biología          |
| física, fisica     | Ciencias - Física            |
| química, quimica   | Ciencias - Química           |
| historia           | Historia y Ciencias Sociales |

---

## 🛡️ Seguridad

- ✅ **Autenticación requerida:** Solo usuarios autenticados pueden buscar PDFs
- ✅ **Rate limiting:** Protección contra abuso
- ✅ **Validación de URL:** Solo acepta URLs de DEMRE
- ✅ **Timeout:** 10 segundos máximo por petición

---

## 📊 Ejemplo de Uso

### URL de Entrada:

```
https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes
```

### PDFs Encontrados:

```json
[
  {
    "url": "https://demre.cl/.../paes-2026-lectora.pdf",
    "title": "PAES 2026 - Competencia Lectora",
    "subject": "Competencia Lectora",
    "year": "2026"
  },
  {
    "url": "https://demre.cl/.../paes-2026-matematica-m1.pdf",
    "title": "PAES 2026 - Matemática M1",
    "subject": "Matemática M1",
    "year": "2026"
  }
]
```

---

## ⚠️ Limitaciones

1. **Formato del HTML:** Depende de la estructura HTML de DEMRE
2. **Detección de asignatura:** Puede no detectar todas las asignaturas correctamente
3. **URLs relativas:** Se convierten automáticamente a absolutas
4. **Timeout:** Si la página tarda más de 10 segundos, fallará

---

## 🔄 Mejoras Futuras

- [ ] Cachear resultados de búsqueda
- [ ] Mejorar detección de asignaturas con más patrones
- [ ] Soporte para múltiples páginas
- [ ] Preview de PDFs antes de importar
- [ ] Filtrado por asignatura en la lista

---

## ✅ Estado

**Funcionalidad completamente implementada y lista para usar.**

---

**Última actualización:** 2025-01-27
