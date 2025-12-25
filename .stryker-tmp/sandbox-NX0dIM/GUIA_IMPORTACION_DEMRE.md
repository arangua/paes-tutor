# 📥 Guía Rápida: Importar Exámenes desde DEMRE

## 🚀 Inicio Rápido

### 1. Obtener URLs de PDFs

1. Visita: https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes
2. Encuentra los PDFs de los exámenes
3. Copia las URLs de los PDFs

### 2. Configurar el Script

Edita `scripts/import-demre-exams.ts` y agrega las URLs:

```typescript
const examsToImport = [
  {
    pdfUrl: 'URL_DEL_PDF_AQUI',
    subjectName: 'Competencia Lectora', // o 'Matemática M1', etc.
    examTitle: 'PAES 2026 - Competencia Lectora',
    examType: 'oficial',
    year: '2026',
  },
]
```

### 3. Ejecutar

```bash
npm run import:demre
```

O directamente:

```bash
npx tsx scripts/import-demre-exams.ts
```

---

## 📋 Asignaturas Disponibles

- `Competencia Lectora` → LECTORA
- `Matemática M1` → M1
- `Matemática M2` → M2
- `Ciencias - Biología` → BIO
- `Ciencias - Física` → FIS
- `Ciencias - Química` → QUI
- `Historia y Ciencias Sociales` → HIST

---

## ⚠️ Notas Importantes

1. **Parsing Automático**: El script intenta extraer preguntas automáticamente, pero puede necesitar ajustes según el formato del PDF

2. **Respuestas Correctas**: Por defecto marca la primera opción como correcta. Debes revisar y corregir manualmente después de importar

3. **Revisión Manual**: Siempre revisa las preguntas importadas en la base de datos para verificar que estén correctas

---

## 📚 Documentación Completa

Ver `scripts/README_IMPORTACION.md` para documentación detallada.

---

**¡Listo!** Los exámenes se guardarán en `data/pdfs/` y las preguntas se cargarán en la base de datos.
