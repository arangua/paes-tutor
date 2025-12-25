/**
 * Utilidades para exportar datos a diferentes formatos
 * PDF, Excel, Word
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
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

  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      onProgress(Math.round((currentStep / totalSteps) * 100), currentStep, totalSteps, message)
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
    `Resultados_${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  )
}

/**
 * Exporta resultados de examen a Excel
 */
export async function exportExamResultsToExcel(
  data: ExamResultData,
  onProgress?: (progress: number, current: number, total: number, message: string) => void
): Promise<void> {
  const workbook = XLSX.utils.book_new()
  const totalSteps = 4 // Resumen + Respuestas + Ajustes + Guardar
  let currentStep = 0

  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      onProgress(Math.round((currentStep / totalSteps) * 100), currentStep, totalSteps, message)
    }
  }

  // Hoja 1: Resumen
  updateProgress('Generando hoja de resumen...')
  const summaryData = [
    ['Resumen del Examen'],
    [],
    ['Título', data.examTitle],
    ['Asignatura', data.subjectName],
    ['Puntaje', `${data.percentage.toFixed(1)}%`],
    ['Correctas', data.correctas],
    ['Incorrectas', data.incorrectas],
    ['Omitidas', data.omitidas],
    ['Total Preguntas', data.totalPreguntas],
    ...(data.puntajePaes ? [['Puntaje PAES', data.puntajePaes]] : []),
    ['Fecha Inicio', new Date(data.startedAt).toLocaleString('es-CL')],
    ['Fecha Fin', data.finishedAt ? new Date(data.finishedAt).toLocaleString('es-CL') : 'N/A'],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen')

  // Hoja 2: Respuestas detalladas
  const answersData = [
    ['#', 'Pregunta', 'Tu Respuesta', 'Respuesta Correcta', 'Estado', 'Explicación'],
    ...data.answers.map(answer => [
      answer.questionNumber,
      answer.enunciado,
      answer.selectedOption || 'Omitida',
      answer.options.find(o => o.esCorrecta)?.letra || 'N/A',
      answer.isCorrect ? 'Correcta' : answer.isOmitted ? 'Omitida' : 'Incorrecta',
      answer.explicacion || '',
    ]),
  ]

  const answersSheet = XLSX.utils.aoa_to_sheet(answersData)

  // Ajustar ancho de columnas
  answersSheet['!cols'] = [
    { wch: 5 }, // #
    { wch: 60 }, // Pregunta
    { wch: 15 }, // Tu Respuesta
    { wch: 15 }, // Respuesta Correcta
    { wch: 12 }, // Estado
    { wch: 50 }, // Explicación
  ]

  XLSX.utils.book_append_sheet(workbook, answersSheet, 'Respuestas')

  // Guardar
  updateProgress('Guardando archivo Excel...')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(
    blob,
    `Resultados_${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
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
  doc.save(`Estadisticas_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Exporta analytics a Excel
 */
export async function exportAnalyticsToExcel(
  data: AnalyticsData,
  studentName?: string
): Promise<void> {
  const workbook = XLSX.utils.book_new()

  // Hoja 1: Resumen
  const summaryData = [
    ['Estadísticas Avanzadas'],
    studentName ? ['Estudiante', studentName] : [],
    ['Fecha', new Date().toLocaleDateString('es-CL')],
    [],
    ['Comparación de Rendimiento'],
    ['Tu Promedio', data.studentAverage],
    ['Promedio General', data.overallAverage],
    ['Percentil', data.percentile],
    [],
    ['Predicción PAES'],
    ['Puntaje Predicho', data.paesPrediction.predictedScore],
    ['Rango Mínimo', data.paesPrediction.estimatedRange.min],
    ['Rango Máximo', data.paesPrediction.estimatedRange.max],
    ['Confianza', data.paesPrediction.confidence],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen')

  // Hoja 2: Tendencias
  if (data.trends.length > 0) {
    const trendsData = [
      ['Fecha', 'Examen', 'Puntaje (%)'],
      ...data.trends.map(t => [
        new Date(t.date).toLocaleDateString('es-CL'),
        t.examTitle,
        t.percentage,
      ]),
    ]

    const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData)
    trendsSheet['!cols'] = [{ wch: 12 }, { wch: 40 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Tendencias')
  }

  // Hoja 3: Fortalezas
  if (data.strengths.length > 0) {
    const strengthsData = [
      ['Tema', 'Rendimiento (%)'],
      ...data.strengths.map(s => [s.topic, s.percentage]),
    ]

    const strengthsSheet = XLSX.utils.aoa_to_sheet(strengthsData)
    strengthsSheet['!cols'] = [{ wch: 40 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, strengthsSheet, 'Fortalezas')
  }

  // Hoja 4: Debilidades
  if (data.weaknesses.length > 0) {
    const weaknessesData = [
      ['Tema', 'Rendimiento (%)'],
      ...data.weaknesses.map(w => [w.topic, w.percentage]),
    ]

    const weaknessesSheet = XLSX.utils.aoa_to_sheet(weaknessesData)
    weaknessesSheet['!cols'] = [{ wch: 40 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, weaknessesSheet, 'Debilidades')
  }

  // Hoja 5: Desglose por asignatura
  if (data.subjectBreakdown.length > 0) {
    const subjectData = [
      ['Asignatura', 'Promedio (%)', 'Intentos', 'Tendencia'],
      ...data.subjectBreakdown.map(s => [
        s.subject,
        s.average,
        s.attempts,
        s.trend === 'improving' ? 'Mejorando' : s.trend === 'declining' ? 'En declive' : 'Estable',
      ]),
    ]

    const subjectSheet = XLSX.utils.aoa_to_sheet(subjectData)
    subjectSheet['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 10 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, subjectSheet, 'Por Asignatura')
  }

  // Guardar
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `Estadisticas_${new Date().toISOString().split('T')[0]}.xlsx`)
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

  const updateProgress = (message: string) => {
    currentStep++
    if (onProgress) {
      onProgress(Math.round((currentStep / totalSteps) * 100), currentStep, totalSteps, message)
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
    `Resultados_${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.docx`
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
  }>
): Promise<void> {
  const workbook = XLSX.utils.book_new()

  const examsData = [
    ['ID', 'Título', 'Asignatura', 'Código', 'Tipo', 'Preguntas', 'Tiempo (min)', 'Fecha Creación'],
    ...exams.map(exam => [
      exam.id,
      exam.titulo,
      exam.subject.nombre,
      exam.subject.codigo,
      exam.tipo,
      exam.totalPreguntas,
      exam.tiempoLimiteMin || 'N/A',
      new Date(exam.createdAt).toLocaleDateString('es-CL'),
    ]),
  ]

  const sheet = XLSX.utils.aoa_to_sheet(examsData)
  sheet['!cols'] = [
    { wch: 25 }, // ID
    { wch: 40 }, // Título
    { wch: 25 }, // Asignatura
    { wch: 10 }, // Código
    { wch: 15 }, // Tipo
    { wch: 10 }, // Preguntas
    { wch: 12 }, // Tiempo
    { wch: 15 }, // Fecha
  ]

  XLSX.utils.book_append_sheet(workbook, sheet, 'Exámenes')

  updateProgress('Ajustando formato...')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  updateProgress('Guardando archivo Excel...')
  saveAs(blob, `Lista_Examenes_${new Date().toISOString().split('T')[0]}.xlsx`)
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
  const workbook = XLSX.utils.book_new()

  // Hoja 1: Resumen
  const summaryData = [
    ['Resumen del Dashboard'],
    ['Estudiante', data.studentName],
    ['Total Intentos', data.totalAttempts],
    ['Intentos Completados', data.completedAttempts],
    ['Puntaje Promedio', `${data.avgScore.toFixed(1)}%`],
    [],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen')

  // Hoja 2: Intentos
  if (data.attempts.length > 0) {
    const attemptsData = [
      [
        'Fecha',
        'Examen',
        'Asignatura',
        'Estado',
        'Puntaje (%)',
        'Correctas',
        'Total',
        'Puntaje PAES',
      ],
      ...data.attempts.map(attempt => [
        new Date(attempt.createdAt).toLocaleDateString('es-CL'),
        attempt.exam.titulo,
        attempt.exam.subject.nombre,
        attempt.estado,
        attempt.porcentaje,
        attempt.correctas,
        attempt.totalPreguntas,
        attempt.puntajePaes || 'N/A',
      ]),
    ]

    const attemptsSheet = XLSX.utils.aoa_to_sheet(attemptsData)
    attemptsSheet['!cols'] = [
      { wch: 12 },
      { wch: 40 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
    ]
    XLSX.utils.book_append_sheet(workbook, attemptsSheet, 'Intentos')
  }

  // Hoja 3: Métricas por Asignatura
  if (data.metrics.length > 0) {
    const metricsData = [
      ['Asignatura', 'Código', 'Puntaje (%)', 'Preguntas Correctas', 'Total Preguntas'],
      ...data.metrics.map(metric => [
        metric.nombre,
        metric.codigo,
        metric.porcentaje,
        metric.correctas,
        metric.totalPreguntas,
      ]),
    ]

    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData)
    metricsSheet['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métricas')
  }

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(
    blob,
    `Dashboard_${data.studentName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
  )
}
