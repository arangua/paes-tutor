# 📥 Guía de Importación de Exámenes desde DEMRE

Esta guía explica cómo cargar exámenes reales desde el sitio web de DEMRE a la base de datos.

---

## 📋 Requisitos Previos

1. **Base de datos inicializada**: Asegúrate de haber ejecutado el seed inicial

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

2. **Dependencias instaladas**: El proyecto ya incluye `pdf-parse` para extraer texto de PDFs

---

## 🔍 Paso 1: Obtener URLs de PDFs desde DEMRE

1. Visita el sitio de DEMRE:

   ```
   https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes
   ```

2. Navega hasta encontrar los PDFs de los exámenes que quieres importar

3. Haz clic derecho en cada PDF y selecciona "Copiar dirección del enlace" o "Copy link address"

4. Anota las URLs y la información de cada examen:
   - URL del PDF
   - Nombre de la asignatura (ej: "Competencia Lectora", "Matemática M1")
   - Título del examen
   - Año del proceso
   - Tipo (oficial, simulacro, etc.)

---

## ⚙️ Paso 2: Configurar el Script de Importación

Edita el archivo `scripts/import-demre-exams.ts` y agrega las URLs en el array `examsToImport`:

```typescript
const examsToImport = [
  {
    pdfUrl: 'https://demre.cl/.../paes-2026-lectora.pdf',
    subjectName: 'Competencia Lectora',
    examTitle: 'PAES 2026 - Competencia Lectora (Oficial)',
    examType: 'oficial',
    year: '2026',
  },
  {
    pdfUrl: 'https://demre.cl/.../paes-2026-m1.pdf',
    subjectName: 'Matemática M1',
    examTitle: 'PAES 2026 - Matemática M1 (Oficial)',
    examType: 'oficial',
    year: '2026',
  },
  // Agregar más exámenes aquí...
]
```

---

## 🚀 Paso 3: Ejecutar el Script

```bash
npx tsx scripts/import-demre-exams.ts
```

El script:

1. ✅ Descargará los PDFs a `data/pdfs/`
2. ✅ Extraerá el texto de cada PDF
3. ✅ Parseará las preguntas y opciones
4. ✅ Mapeará las preguntas a temas
5. ✅ Creará las preguntas en la base de datos
6. ✅ Creará el examen y lo vinculará con las preguntas

---

## ⚠️ Limitaciones y Consideraciones

### Parsing Automático

El script intenta parsear automáticamente las preguntas del PDF, pero:

- **El formato puede variar**: Los PDFs de DEMRE pueden tener diferentes formatos
- **Puede necesitar ajustes**: Los patrones de regex pueden necesitar ajuste según el PDF
- **Respuestas correctas**: Por defecto, marca la primera opción como correcta (debe ajustarse manualmente)

### Mejoras Recomendadas

1. **Revisión manual**: Después de importar, revisa las preguntas en la base de datos
2. **Corrección de respuestas**: Verifica y corrige las respuestas correctas
3. **Ajuste de temas**: Verifica que las preguntas estén asignadas a los temas correctos
4. **Validación**: Revisa que todas las preguntas tengan 5 opciones (A, B, C, D, E)

---

## 🔧 Ajustar Patrones de Parsing

Si el script no encuentra las preguntas correctamente, puedes ajustar los patrones en la función `parseQuestionsFromText`:

```typescript
// Patrón para encontrar preguntas numeradas
const questionPattern = /(\d+)\.\s+(.+?)(?=\d+\.|$)/gs

// Patrón para encontrar opciones
const optionPattern = /([A-E])\)\s+(.+?)(?=[A-E]\)|$)/g
```

---

## 📝 Mapeo de Asignaturas

El script mapea automáticamente los nombres de asignaturas a códigos internos:

| Nombre DEMRE                 | Código Interno |
| ---------------------------- | -------------- |
| Competencia Lectora          | LECTORA        |
| Matemática M1                | M1             |
| Matemática M2                | M2             |
| Ciencias - Biología          | BIO            |
| Ciencias - Física            | FIS            |
| Ciencias - Química           | QUI            |
| Historia y Ciencias Sociales | HIST           |

---

## 🎯 Alternativa: Importación Manual

Si el parsing automático no funciona bien, puedes:

1. **Descargar los PDFs manualmente**
2. **Extraer las preguntas manualmente** o usar herramientas de OCR
3. **Crear un archivo JSON** con la estructura de preguntas
4. **Usar un script de importación desde JSON** (puede crearse si es necesario)

---

## 📊 Estructura de Datos Esperada

Cada pregunta debe tener:

- `enunciado`: Texto de la pregunta
- `options`: Array de 5 opciones (A, B, C, D, E)
  - `letra`: Letra de la opción
  - `texto`: Texto de la opción
  - `esCorrecta`: Boolean indicando si es la respuesta correcta
- `dificultad`: Número del 1 al 3
- `explicacion`: Explicación de la respuesta correcta
- `fuente`: Origen de la pregunta (ej: "DEMRE PAES 2026")

---

## 🆘 Solución de Problemas

### Error: "Asignatura no encontrada"

- Verifica que el nombre de la asignatura coincida exactamente con los nombres en `SUBJECT_MAPPING`

### Error: "No se encontraron preguntas"

- El formato del PDF puede ser diferente
- Revisa el texto extraído en `data/pdfs/`
- Ajusta los patrones de regex en `parseQuestionsFromText`

### Error: "Error descargando PDF"

- Verifica que la URL sea accesible
- Algunos PDFs pueden requerir autenticación o tener protección

---

## 📚 Recursos Adicionales

- [Documentación de pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [Sitio oficial de DEMRE](https://demre.cl)
- [Publicaciones DEMRE 2026](https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes)

---

**Última actualización:** 2025-01-27
