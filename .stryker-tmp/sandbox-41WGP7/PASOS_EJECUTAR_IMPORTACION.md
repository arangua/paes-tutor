# 🚀 Pasos para Ejecutar la Importación de Exámenes DEMRE

## 📋 Paso a Paso

### Paso 1: Obtener URLs de PDFs desde DEMRE

1. **Abre tu navegador** y visita:

   ```
   https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes
   ```

2. **Navega por la página** hasta encontrar los enlaces a los PDFs de los exámenes

3. **Para cada PDF que quieras importar:**
   - Haz **clic derecho** en el enlace del PDF
   - Selecciona **"Copiar dirección del enlace"** o **"Copy link address"**
   - Pega la URL en un documento temporal (Notas, Bloc de notas, etc.)

4. **Anota la información de cada examen:**
   - URL del PDF
   - Nombre de la asignatura (ej: "Competencia Lectora", "Matemática M1")
   - Año del proceso (ej: "2026")
   - Tipo de examen (ej: "oficial", "simulacro")

---

### Paso 2: Configurar el Script

1. **Abre el archivo** `scripts/import-demre-exams.ts` en tu editor

2. **Busca la sección** `examsToImport` (alrededor de la línea 200)

3. **Reemplaza el array vacío** con tus exámenes:

```typescript
const examsToImport = [
  {
    pdfUrl: 'https://demre.cl/.../paes-2026-lectora.pdf', // ← Pega aquí la URL
    subjectName: 'Competencia Lectora', // ← Nombre exacto de la asignatura
    examTitle: 'PAES 2026 - Competencia Lectora (Oficial)', // ← Título del examen
    examType: 'oficial', // ← Tipo: 'oficial', 'simulacro', etc.
    year: '2026', // ← Año del proceso
  },
  {
    pdfUrl: 'https://demre.cl/.../paes-2026-m1.pdf',
    subjectName: 'Matemática M1',
    examTitle: 'PAES 2026 - Matemática M1 (Oficial)',
    examType: 'oficial',
    year: '2026',
  },
  // Agrega más exámenes aquí...
]
```

**Ejemplo completo:**

```typescript
const examsToImport = [
  {
    pdfUrl: 'https://demre.cl/publicaciones/2026/archivos/paes-2026-competencia-lectora.pdf',
    subjectName: 'Competencia Lectora',
    examTitle: 'PAES 2026 - Competencia Lectora (Oficial)',
    examType: 'oficial',
    year: '2026',
  },
  {
    pdfUrl: 'https://demre.cl/publicaciones/2026/archivos/paes-2026-matematica-m1.pdf',
    subjectName: 'Matemática M1',
    examTitle: 'PAES 2026 - Matemática M1 (Oficial)',
    examType: 'oficial',
    year: '2026',
  },
]
```

**⚠️ Importante:**

- El `subjectName` debe coincidir exactamente con uno de estos:
  - `'Competencia Lectora'`
  - `'Matemática M1'`
  - `'Matemática M2'`
  - `'Ciencias - Biología'`
  - `'Ciencias - Física'`
  - `'Ciencias - Química'`
  - `'Historia y Ciencias Sociales'`

---

### Paso 3: Ejecutar el Script

1. **Abre la terminal** en la raíz del proyecto:

   ```bash
   cd paes-tutor
   ```

2. **Ejecuta el comando:**

   ```bash
   npm run import:demre
   ```

   O directamente:

   ```bash
   npx tsx scripts/import-demre-exams.ts
   ```

3. **Observa la salida:**
   El script mostrará el progreso:

   ```
   🚀 Iniciando importación de exámenes desde DEMRE

   📥 Descargando PDF: PAES 2026 - Competencia Lectora (Oficial)
      URL: https://demre.cl/...
   ✅ PDF descargado: LECTORA_2026_1234567890.pdf
   📄 Extrayendo texto del PDF...
   ✅ Texto extraído (50000 caracteres)
   🔍 Parseando preguntas...
   ✅ 65 preguntas encontradas
   💾 Guardando preguntas en la base de datos...
   ✅ 65 preguntas creadas
   📝 Creando examen...
   ✅ Examen creado: PAES 2026 - Competencia Lectora (Oficial) (ID: cxxx...)
      Total de preguntas: 65

   ✅ Importación completada!
   ```

---

### Paso 4: Verificar la Importación

1. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

2. **Abre tu navegador** y visita:

   ```
   http://localhost:3000/exams
   ```

3. **Verifica que los exámenes aparezcan** en la lista

4. **Revisa las preguntas:**
   - Haz clic en un examen
   - Verifica que las preguntas se vean correctamente
   - Revisa que las opciones estén completas

---

### Paso 5: Corregir Respuestas Correctas (Opcional pero Recomendado)

El script marca la primera opción como correcta por defecto. Debes corregir esto:

1. **Opción A: Desde la interfaz web**
   - Ve a `/exams/[id]/take`
   - Revisa cada pregunta y marca la respuesta correcta manualmente

2. **Opción B: Desde la base de datos**

   ```bash
   npx prisma studio
   ```

   - Abre Prisma Studio
   - Ve a `Question` → Selecciona una pregunta
   - Edita `QuestionOption` y marca `esCorrecta: true` en la opción correcta

3. **Opción C: Script de corrección** (puede crearse si es necesario)

---

## 🆘 Solución de Problemas

### Error: "Asignatura no encontrada"

- Verifica que el `subjectName` coincida exactamente con los nombres listados arriba
- Verifica que la asignatura exista en la base de datos (ejecuta `npx prisma db seed` si es necesario)

### Error: "No se encontraron preguntas"

- El formato del PDF puede ser diferente
- Revisa el texto extraído en `data/pdfs/[nombre-archivo].pdf`
- Puede ser necesario ajustar los patrones de regex en el script

### Error: "Error descargando PDF"

- Verifica que la URL sea accesible
- Algunos PDFs pueden requerir autenticación
- Intenta descargar el PDF manualmente primero para verificar

### El script no encuentra preguntas

- Abre el PDF descargado en `data/pdfs/` y verifica su formato
- Puede ser necesario ajustar los patrones en `parseQuestionsFromText`
- Considera usar OCR si el PDF es escaneado

---

## 📝 Ejemplo Completo de Configuración

```typescript
const examsToImport = [
  // Competencia Lectora
  {
    pdfUrl: 'https://demre.cl/publicaciones/2026/archivos/paes-2026-competencia-lectora.pdf',
    subjectName: 'Competencia Lectora',
    examTitle: 'PAES 2026 - Competencia Lectora (Oficial)',
    examType: 'oficial',
    year: '2026',
  },

  // Matemática M1
  {
    pdfUrl: 'https://demre.cl/publicaciones/2026/archivos/paes-2026-matematica-m1.pdf',
    subjectName: 'Matemática M1',
    examTitle: 'PAES 2026 - Matemática M1 (Oficial)',
    examType: 'oficial',
    year: '2026',
  },

  // Matemática M2
  {
    pdfUrl: 'https://demre.cl/publicaciones/2026/archivos/paes-2026-matematica-m2.pdf',
    subjectName: 'Matemática M2',
    examTitle: 'PAES 2026 - Matemática M2 (Oficial)',
    examType: 'oficial',
    year: '2026',
  },

  // Ciencias - Biología
  {
    pdfUrl: 'https://demre.cl/publicaciones/2026/archivos/paes-2026-biologia.pdf',
    subjectName: 'Ciencias - Biología',
    examTitle: 'PAES 2026 - Ciencias - Biología (Oficial)',
    examType: 'oficial',
    year: '2026',
  },
]
```

---

## ✅ Checklist de Ejecución

- [ ] URLs de PDFs obtenidas desde DEMRE
- [ ] Script configurado con las URLs en `examsToImport`
- [ ] Nombres de asignaturas verificados (coinciden exactamente)
- [ ] Script ejecutado: `npm run import:demre`
- [ ] PDFs descargados en `data/pdfs/`
- [ ] Preguntas importadas verificadas en la base de datos
- [ ] Exámenes visibles en `/exams`
- [ ] Respuestas correctas revisadas y corregidas (opcional)

---

## 🎯 Comandos Rápidos

```bash
# 1. Ejecutar importación
npm run import:demre

# 2. Ver base de datos (opcional)
npx prisma studio

# 3. Iniciar servidor para verificar
npm run dev

# 4. Verificar exámenes en navegador
# http://localhost:3000/exams
```

---

**¡Listo!** Sigue estos pasos y tendrás los exámenes reales de DEMRE cargados en tu aplicación.
