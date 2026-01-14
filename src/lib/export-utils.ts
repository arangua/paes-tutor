/**
 * Utilidades para exportar datos a diferentes formatos
 * PDF, Excel, Word
 */

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx'
import { safeRound, safeToISODate, safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

/**
 * Helper para obtener la posición Y después de una tabla autoTable
 */
function getTableFinalY(doc: jsPDF, currentY: number, spacing: number = 15): number {
  const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
  return finalY ? finalY + spacing : currentY + 30
}

// Tipos para exportación
export interface ExamResultData {
  examTitle: string
  subjectName: string
  percentage: number
  correctas: number
  incorrectas: number
  omitidas: number
  totalPreguntas: number
  puntajePaes: number | null
  duracionSegundos: number | null
  startedAt: string
  finishedAt: string | null
  answers: Array<{
    questionNumber: number
    enunciado: string
    selectedOption?: string
    correctOption: string
    isCorrect: boolean
    isOmitted: boolean
    explicacion?: string
    options: Array<{ letra: string; texto: string; esCorrecta: boolean }>
  }>
}

export interface AnalyticsData {
  studentAverage: number
  overallAverage: number
  percentile: number
  paesPrediction: {
    predictedScore: number
    confidence: 'high' | 'medium' | 'low'
    estimatedRange: { min: number; max: number }
  }
  trends: Array<{
    date: string
    percentage: number
    examTitle: string
  }>
  strengths: Array<{ topic: string; percentage: number }>
  weaknesses: Array<{ topic: string; percentage: number }>
  subjectBreakdown: Array<{
    subject: string
    average: number
    attempts: number
    trend: 'improving' | 'declining' | 'stable'
  }>
}

/**
 * Exporta resultados de examen a PDF
 */
export async function exportExamResultsToPDF(
  data: ExamResultData,
  onProgress?: (progress: number, current: number, total: number, message: string) => void
): Promise<void> {
  const doc = new jsPDF()
  const totalSteps = 3 + data.answers.length // Configuración + Resumen + Título sección + cada pregunta
  let currentStep = 0

  // ✅ Enterprise: Calcular progreso usando funciones seguras
  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      const safeCurrent = ensureFiniteNumber(currentStep, 0)
      const safeTotal = ensureFiniteNumber(totalSteps, 1)
      const progress = safeRound(safeDivide(safeCurrent, safeTotal, 0) * 100, 0)
      onProgress(progress, currentStep, totalSteps, message)
    }
  }

  // Configuración
  updateProgress('Configurando documento PDF...')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPos = margin

  // Título
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(data.examTitle, margin, yPos)
  yPos += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(data.subjectName, margin, yPos)
  yPos += 15

  // Resumen
  updateProgress('Generando resumen del examen...')
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumen del Examen', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const summaryData = [
    ['Puntaje', `${data.percentage.toFixed(1)}%`],
    ['Correctas', `${data.correctas} / ${data.totalPreguntas}`],
    ['Incorrectas', data.incorrectas.toString()],
    ['Omitidas', data.omitidas.toString()],
    ...(data.puntajePaes ? [['Puntaje PAES', data.puntajePaes.toString()]] : []),
    ['Fecha', new Date(data.startedAt).toLocaleDateString('es-CL')],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: margin, right: margin },
  })

  // Obtener posición Y después de la tabla
  yPos = getTableFinalY(doc, yPos)

  // Preguntas y respuestas
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Revisión de Respuestas', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  data.answers.forEach((answer, index) => {
    updateProgress(`Procesando pregunta ${index + 1} de ${data.answers.length}...`)
    // Verificar si necesitamos nueva página
    if (yPos > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage()
      yPos = margin
    }

    // Estado de la pregunta
    const status = answer.isCorrect ? '✓ Correcta' : answer.isOmitted ? '○ Omitida' : '✗ Incorrecta'
    const statusColor = answer.isCorrect
      ? [34, 197, 94]
      : answer.isOmitted
        ? [234, 179, 8]
        : [239, 68, 68]

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...statusColor)
    doc.text(`Pregunta ${answer.questionNumber} - ${status}`, margin, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)

    // Enunciado (puede ser largo, dividir en líneas)
    const enunciadoLines = doc.splitTextToSize(answer.enunciado, pageWidth - 2 * margin)
    enunciadoLines.forEach((line: string) => {
      doc.text(line, margin + 5, yPos)
      yPos += 5
    })
    yPos += 3

    // Opciones
    answer.options.forEach(option => {
      const prefix = option.esCorrecta ? '✓ ' : option.letra === answer.selectedOption ? '→ ' : '  '
      const text = `${prefix}${option.letra}. ${option.texto}`
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - 10)
      lines.forEach((line: string) => {
        doc.text(line, margin + 10, yPos)
        yPos += 5
      })
    })
    yPos += 3

    // Explicación si existe
    if (answer.explicacion) {
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(100, 100, 100)
      const explicacionLines = doc.splitTextToSize(
        `Explicación: ${answer.explicacion}`,
        pageWidth - 2 * margin - 10
      )
      explicacionLines.forEach((line: string) => {
        doc.text(line, margin + 10, yPos)
        yPos += 5
      })
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      yPos += 5
    }

    yPos += 5
  })

  // Pie de página
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `PAES Tutor - Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Guardar
  updateProgress('Guardando archivo PDF...')
  doc.save(
    `Resultados_${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${safeToISODate(new Date())}.pdf`
  )
}

/**
 * Exporta resultados de examen a Excel
 */
export async function exportExamResultsToExcel(
  data: ExamResultData,
  onProgress?: (progress: number, current: number, total: number, message: string) => void
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const totalSteps = 4 // Resumen + Respuestas + Ajustes + Guardar
  let currentStep = 0

  // ✅ Enterprise: Calcular progreso usando funciones seguras
  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      const safeCurrent = ensureFiniteNumber(currentStep, 0)
      const safeTotal = ensureFiniteNumber(totalSteps, 1)
      const progress = safeRound(safeDivide(safeCurrent, safeTotal, 0) * 100, 0)
      onProgress(progress, currentStep, totalSteps, message)
    }
  }

  // Hoja 1: Resumen
  updateProgress('Generando hoja de resumen...')
  const summarySheet = workbook.addWorksheet('Resumen')
  summarySheet.addRow(['Resumen del Examen'])
  summarySheet.addRow([])
  summarySheet.addRow(['Título', data.examTitle])
  summarySheet.addRow(['Asignatura', data.subjectName])
  summarySheet.addRow(['Puntaje', `${data.percentage.toFixed(1)}%`])
  summarySheet.addRow(['Correctas', data.correctas])
  summarySheet.addRow(['Incorrectas', data.incorrectas])
  summarySheet.addRow(['Omitidas', data.omitidas])
  summarySheet.addRow(['Total Preguntas', data.totalPreguntas])
  if (data.puntajePaes) {
    summarySheet.addRow(['Puntaje PAES', data.puntajePaes])
  }
  summarySheet.addRow(['Fecha Inicio', new Date(data.startedAt).toLocaleString('es-CL')])
  summarySheet.addRow(['Fecha Fin', data.finishedAt ? new Date(data.finishedAt).toLocaleString('es-CL') : 'N/A'])

  // Hoja 2: Respuestas detalladas
  updateProgress('Generando hoja de respuestas...')
  const answersSheet = workbook.addWorksheet('Respuestas')
  answersSheet.addRow(['#', 'Pregunta', 'Tu Respuesta', 'Respuesta Correcta', 'Estado', 'Explicación'])
  
  data.answers.forEach(answer => {
    answersSheet.addRow([
      answer.questionNumber,
      answer.enunciado,
      answer.selectedOption || 'Omitida',
      answer.options.find(o => o.esCorrecta)?.letra || 'N/A',
      answer.isCorrect ? 'Correcta' : answer.isOmitted ? 'Omitida' : 'Incorrecta',
      answer.explicacion || '',
    ])
  })

  // Ajustar ancho de columnas
  answersSheet.columns = [
    { width: 5 }, // #
    { width: 60 }, // Pregunta
    { width: 15 }, // Tu Respuesta
    { width: 15 }, // Respuesta Correcta
    { width: 12 }, // Estado
    { width: 50 }, // Explicación
  ]

  // Guardar
  updateProgress('Guardando archivo Excel...')
  const excelBuffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // guard:allow-secret
  })
  saveAs(
    blob,
    `Resultados_${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${safeToISODate(new Date())}.xlsx`
  )
}

/**
 * Exporta analytics a PDF
 */
export async function exportAnalyticsToPDF(
  data: AnalyticsData,
  studentName?: string
): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPos = margin

  // Título
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Estadísticas Avanzadas', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  if (studentName) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Estudiante: ${studentName}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 10
  }

  doc.setFontSize(10)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-CL')}`, pageWidth / 2, yPos, {
    align: 'center',
  })
  yPos += 15

  // Comparación
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Comparación de Rendimiento', margin, yPos)
  yPos += 10

  const comparisonData = [
    ['Tu Promedio', `${data.studentAverage.toFixed(1)}%`],
    ['Promedio General', `${data.overallAverage}%`],
    ['Percentil', `${data.percentile}º`],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: comparisonData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: margin, right: margin },
  })

  // Obtener posición Y después de la tabla
  yPos = getTableFinalY(doc, yPos)

  // Predicción PAES
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Predicción de Puntaje PAES', margin, yPos)
  yPos += 10

  const predictionData = [
    ['Puntaje Predicho', data.paesPrediction.predictedScore.toString()],
    [
      'Rango Estimado',
      `${data.paesPrediction.estimatedRange.min} - ${data.paesPrediction.estimatedRange.max}`,
    ],
    ['Confianza', data.paesPrediction.confidence],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: predictionData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
    margin: { left: margin, right: margin },
  })

  // Obtener posición Y después de la tabla
  yPos = getTableFinalY(doc, yPos)

  // Fortalezas y Debilidades
  if (data.strengths.length > 0 || data.weaknesses.length > 0) {
    doc.addPage()
    yPos = margin

    if (data.strengths.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 197, 94)
      doc.text('Fortalezas', margin, yPos)
      yPos += 10

      const strengthsData = data.strengths.map(s => [s.topic, `${s.percentage.toFixed(1)}%`])

      autoTable(doc, {
        startY: yPos,
        head: [['Tema', 'Rendimiento']],
        body: strengthsData,
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] },
        margin: { left: margin, right: margin },
      })

      // Obtener posición Y después de la tabla
      yPos = getTableFinalY(doc, yPos)
    }

    if (data.weaknesses.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(239, 68, 68)
      doc.text('Debilidades', margin, yPos)
      yPos += 10

      const weaknessesData = data.weaknesses.map(w => [w.topic, `${w.percentage.toFixed(1)}%`])

      autoTable(doc, {
        startY: yPos,
        head: [['Tema', 'Rendimiento']],
        body: weaknessesData,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] },
        margin: { left: margin, right: margin },
      })

      // Obtener posición Y después de la tabla
      yPos = getTableFinalY(doc, yPos)
    }
  }

  // Desglose por asignatura
  if (data.subjectBreakdown.length > 0) {
    if (yPos > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage()
      yPos = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Desglose por Asignatura', margin, yPos)
    yPos += 10

    const subjectData = data.subjectBreakdown.map(s => [
      s.subject,
      `${s.average.toFixed(1)}%`,
      s.attempts.toString(),
      s.trend === 'improving' ? 'Mejorando' : s.trend === 'declining' ? 'En declive' : 'Estable',
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Asignatura', 'Promedio', 'Intentos', 'Tendencia']],
      body: subjectData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: margin, right: margin },
    })
  }

  // Pie de página
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `PAES Tutor - Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Guardar
  doc.save(`Estadisticas_${safeToISODate(new Date())}.pdf`)
}

/**
 * Exporta analytics a Excel
 */
export async function exportAnalyticsToExcel(
  data: AnalyticsData,
  studentName?: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook()

  // Hoja 1: Resumen
  const summarySheet = workbook.addWorksheet('Resumen')
  summarySheet.addRow(['Estadísticas Avanzadas'])
  if (studentName) {
    summarySheet.addRow(['Estudiante', studentName])
  }
  summarySheet.addRow(['Fecha', new Date().toLocaleDateString('es-CL')])
  summarySheet.addRow([])
  summarySheet.addRow(['Comparación de Rendimiento'])
  summarySheet.addRow(['Tu Promedio', data.studentAverage])
  summarySheet.addRow(['Promedio General', data.overallAverage])
  summarySheet.addRow(['Percentil', data.percentile])
  summarySheet.addRow([])
  summarySheet.addRow(['Predicción PAES'])
  summarySheet.addRow(['Puntaje Predicho', data.paesPrediction.predictedScore])
  summarySheet.addRow(['Rango Mínimo', data.paesPrediction.estimatedRange.min])
  summarySheet.addRow(['Rango Máximo', data.paesPrediction.estimatedRange.max])
  summarySheet.addRow(['Confianza', data.paesPrediction.confidence])

  // Hoja 2: Tendencias
  if (data.trends.length > 0) {
    const trendsSheet = workbook.addWorksheet('Tendencias')
    trendsSheet.addRow(['Fecha', 'Examen', 'Puntaje (%)'])
    data.trends.forEach(t => {
      trendsSheet.addRow([
        new Date(t.date).toLocaleDateString('es-CL'),
        t.examTitle,
        t.percentage,
      ])
    })
    trendsSheet.columns = [{ width: 12 }, { width: 40 }, { width: 12 }]
  }

  // Hoja 3: Fortalezas
  if (data.strengths.length > 0) {
    const strengthsSheet = workbook.addWorksheet('Fortalezas')
    strengthsSheet.addRow(['Tema', 'Rendimiento (%)'])
    data.strengths.forEach(s => {
      strengthsSheet.addRow([s.topic, s.percentage])
    })
    strengthsSheet.columns = [{ width: 40 }, { width: 15 }]
  }

  // Hoja 4: Debilidades
  if (data.weaknesses.length > 0) {
    const weaknessesSheet = workbook.addWorksheet('Debilidades')
    weaknessesSheet.addRow(['Tema', 'Rendimiento (%)'])
    data.weaknesses.forEach(w => {
      weaknessesSheet.addRow([w.topic, w.percentage])
    })
    weaknessesSheet.columns = [{ width: 40 }, { width: 15 }]
  }

  // Hoja 5: Desglose por asignatura
  if (data.subjectBreakdown.length > 0) {
    const subjectSheet = workbook.addWorksheet('Por Asignatura')
    subjectSheet.addRow(['Asignatura', 'Promedio (%)', 'Intentos', 'Tendencia'])
    data.subjectBreakdown.forEach(s => {
      subjectSheet.addRow([
        s.subject,
        s.average,
        s.attempts,
        s.trend === 'improving' ? 'Mejorando' : s.trend === 'declining' ? 'En declive' : 'Estable',
      ])
    })
    subjectSheet.columns = [{ width: 30 }, { width: 12 }, { width: 10 }, { width: 12 }]
  }

  // Guardar
  const excelBuffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // guard:allow-secret
  })
  saveAs(blob, `Estadisticas_${safeToISODate(new Date())}.xlsx`)
}

/**
 * Exporta resultados de examen a Word
 */
export async function exportExamResultsToWord(
  data: ExamResultData,
  onProgress?: (progress: number, current: number, total: number, message: string) => void
): Promise<void> {
  const children: (Paragraph | Table)[] = []
  const totalSteps = 3 + data.answers.length // Título + Resumen + Título sección + cada pregunta
  let currentStep = 0

  // ✅ Enterprise: Calcular progreso usando funciones seguras
  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      const safeCurrent = ensureFiniteNumber(currentStep, 0)
      const safeTotal = ensureFiniteNumber(totalSteps, 1)
      const progress = safeRound(safeDivide(safeCurrent, safeTotal, 0) * 100, 0)
      onProgress(progress, currentStep, totalSteps, message)
    }
  }

  // Título
  updateProgress('Configurando documento Word...')
  children.push(
    new Paragraph({
      text: data.examTitle,
      heading: HeadingLevel.HEADING_1,
    })
  )

  children.push(
    new Paragraph({
      text: data.subjectName,
      heading: HeadingLevel.HEADING_2,
    })
  )

  children.push(new Paragraph({ text: '' }))

  // Resumen
  children.push(
    new Paragraph({
      text: 'Resumen del Examen',
      heading: HeadingLevel.HEADING_2,
    })
  )

  const summaryTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Métrica')] }),
          new TableCell({ children: [new Paragraph('Valor')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Puntaje')] }),
          new TableCell({ children: [new Paragraph(`${data.percentage.toFixed(1)}%`)] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Correctas')] }),
          new TableCell({
            children: [new Paragraph(`${data.correctas} / ${data.totalPreguntas}`)],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Incorrectas')] }),
          new TableCell({ children: [new Paragraph(data.incorrectas.toString())] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Omitidas')] }),
          new TableCell({ children: [new Paragraph(data.omitidas.toString())] }),
        ],
      }),
      ...(data.puntajePaes
        ? [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph('Puntaje PAES')] }),
                new TableCell({ children: [new Paragraph(data.puntajePaes.toString())] }),
              ],
            }),
          ]
        : []),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  })

  children.push(summaryTable)
  children.push(new Paragraph({ text: '' }))

  // Preguntas
  updateProgress('Generando sección de respuestas...')
  children.push(
    new Paragraph({
      text: 'Revisión de Respuestas',
      heading: HeadingLevel.HEADING_2,
    })
  )

  data.answers.forEach((answer, index) => {
    updateProgress(`Procesando pregunta ${index + 1} de ${data.answers.length}...`)
    const status = answer.isCorrect ? '✓ Correcta' : answer.isOmitted ? '○ Omitida' : '✗ Incorrecta'
    const statusColor = answer.isCorrect ? '00C853' : answer.isOmitted ? 'FFB300' : 'EF4444'

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Pregunta ${answer.questionNumber} - ${status}`,
            bold: true,
            color: statusColor,
          }),
        ],
      })
    )

    children.push(
      new Paragraph({
        text: answer.enunciado,
      })
    )

    answer.options.forEach(option => {
      const prefix = option.esCorrecta ? '✓ ' : option.letra === answer.selectedOption ? '→ ' : '  '
      children.push(
        new Paragraph({
          text: `${prefix}${option.letra}. ${option.texto}`,
          indent: { left: 400 },
        })
      )
    })

    if (answer.explicacion) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Explicación: ',
              bold: true,
              italics: true,
            }),
            new TextRun({
              text: answer.explicacion,
              italics: true,
            }),
          ],
          indent: { left: 400 },
        })
      )
    }

    children.push(new Paragraph({ text: '' }))
  })

  // Crear documento
  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  })

  // Generar y descargar
  const blob = await Packer.toBlob(doc)
  saveAs(
    blob,
    `Resultados_${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${safeToISODate(new Date())}.docx`
  )
}

/**
 * Exporta lista de exámenes a Excel
 */
export async function exportExamsListToExcel(
  exams: Array<{
    id: string
    titulo: string
    descripcion: string | null
    tipo: string
    totalPreguntas: number
    tiempoLimiteMin: number | null
    subject: {
      nombre: string
      codigo: string
    }
    createdAt: string
  }>,
  onProgress?: (progress: number, current: number, total: number, message: string) => void
): Promise<void> {
  const totalSteps = 3
  let currentStep = 0

  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      const safeCurrent = ensureFiniteNumber(currentStep, 0)
      const safeTotal = ensureFiniteNumber(totalSteps, 1)
      const progress = safeRound(safeDivide(safeCurrent, safeTotal, 0) * 100, 0)
      onProgress(progress, currentStep, totalSteps, message)
    }
  }

  updateProgress('Generando lista de exámenes...')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Exámenes')

  sheet.addRow(['ID', 'Título', 'Asignatura', 'Código', 'Tipo', 'Preguntas', 'Tiempo (min)', 'Fecha Creación'])
  exams.forEach(exam => {
    sheet.addRow([
      exam.id,
      exam.titulo,
      exam.subject.nombre,
      exam.subject.codigo,
      exam.tipo,
      exam.totalPreguntas,
      exam.tiempoLimiteMin || 'N/A',
      new Date(exam.createdAt).toLocaleDateString('es-CL'),
    ])
  })

  sheet.columns = [
    { width: 25 }, // ID
    { width: 40 }, // Título
    { width: 25 }, // Asignatura
    { width: 10 }, // Código
    { width: 15 }, // Tipo
    { width: 10 }, // Preguntas
    { width: 12 }, // Tiempo
    { width: 15 }, // Fecha
  ]

  updateProgress('Guardando archivo Excel...')
  const excelBuffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // guard:allow-secret
  })
  saveAs(blob, `Lista_Examenes_${safeToISODate(new Date())}.xlsx`)
}

/**
 * Exporta estadísticas del dashboard a Excel
 */
export async function exportDashboardToExcel(data: {
  studentName: string
  totalAttempts: number
  completedAttempts: number
  avgScore: number
  attempts: Array<{
    id: string
    estado: string
    porcentaje: number
    correctas: number
    totalPreguntas: number
    puntajePaes: number | null
    createdAt: string
    exam: {
      titulo: string
      subject: {
        nombre: string
        codigo: string
      }
    }
  }>
  metrics: Array<{
    codigo: string
    nombre: string
    porcentaje: number
    totalPreguntas: number
    correctas: number
  }>
}): Promise<void> {
  const workbook = new ExcelJS.Workbook()

  // Hoja 1: Resumen
  const summarySheet = workbook.addWorksheet('Resumen')
  summarySheet.addRow(['Resumen del Dashboard'])
  summarySheet.addRow(['Estudiante', data.studentName])
  summarySheet.addRow(['Total Intentos', data.totalAttempts])
  summarySheet.addRow(['Intentos Completados', data.completedAttempts])
  summarySheet.addRow(['Puntaje Promedio', `${data.avgScore.toFixed(1)}%`])
  summarySheet.addRow([])

  // Hoja 2: Intentos
  if (data.attempts.length > 0) {
    const attemptsSheet = workbook.addWorksheet('Intentos')
    attemptsSheet.addRow([
      'Fecha',
      'Examen',
      'Asignatura',
      'Estado',
      'Puntaje (%)',
      'Correctas',
      'Total',
      'Puntaje PAES',
    ])
    data.attempts.forEach(attempt => {
      attemptsSheet.addRow([
        new Date(attempt.createdAt).toLocaleDateString('es-CL'),
        attempt.exam.titulo,
        attempt.exam.subject.nombre,
        attempt.estado,
        attempt.porcentaje,
        attempt.correctas,
        attempt.totalPreguntas,
        attempt.puntajePaes || 'N/A',
      ])
    })
    attemptsSheet.columns = [
      { width: 12 },
      { width: 40 },
      { width: 25 },
      { width: 12 },
      { width: 12 },
      { width: 10 },
      { width: 10 },
      { width: 12 },
    ]
  }

  // Hoja 3: Métricas por Asignatura
  if (data.metrics.length > 0) {
    const metricsSheet = workbook.addWorksheet('Métricas')
    metricsSheet.addRow(['Asignatura', 'Código', 'Puntaje (%)', 'Preguntas Correctas', 'Total Preguntas'])
    data.metrics.forEach(metric => {
      metricsSheet.addRow([
        metric.nombre,
        metric.codigo,
        metric.porcentaje,
        metric.correctas,
        metric.totalPreguntas,
      ])
    })
    metricsSheet.columns = [{ width: 30 }, { width: 10 }, { width: 12 }, { width: 15 }, { width: 15 }]
  }

  const excelBuffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // guard:allow-secret
  })
  saveAs(
    blob,
    `Dashboard_${data.studentName.replace(/[^a-z0-9]/gi, '_')}_${safeToISODate(new Date())}.xlsx`
  )
}
