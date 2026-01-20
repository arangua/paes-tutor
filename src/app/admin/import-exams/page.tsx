'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { trackError } from '@/lib/monitoring'
import {
  Loader2,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Key,
  BookOpen,
  Trash,
} from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { toast } from 'sonner'

interface ExamToImport {
  pdfUrl: string
  pdfFile: File | null
  inputType: 'url' | 'file' // Tipo de entrada: URL o archivo local
  subjectName: string
  examTitle: string
  examType: string
  year: string
}

/**
 * Interfaz para resultados de importación de exámenes
 */
interface ImportResult {
  success: boolean
  examTitle: string
  message: string
  details?: string // Solo presente cuando success es true
}

const SUBJECTS = [
  'Competencia Lectora',
  'Matemática M1',
  'Matemática M2',
  'Ciencias - Biología',
  'Ciencias - Física',
  'Ciencias - Química',
  'Historia y Ciencias Sociales',
]

const EXAM_TYPES = [
  { value: 'oficial', label: 'Oficial' },
  { value: 'simulacro', label: 'Simulacro' },
  { value: 'practica', label: 'Práctica' },
]

export default function ImportExamsPage() {
  const [exams, setExams] = useState<ExamToImport[]>([
    {
      pdfUrl: '',
      pdfFile: null,
      inputType: 'url', // Por defecto usar URL
      subjectName: '',
      examTitle: '',
      examType: 'oficial',
      year: new Date().getFullYear().toString(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [fetchingPDFs, setFetchingPDFs] = useState(false)
  const [demreUrl, setDemreUrl] = useState(
    'https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026'
  )
  const [availablePDFs, setAvailablePDFs] = useState<
    Array<{
      url: string
      title: string
      subject?: string
      year?: string
    }>
  >([])
  const [searchError, setSearchError] = useState<string | null>(null)
  const [results, setResults] = useState<
    Array<{
      success: boolean
      examTitle: string
      message: string
      details?: string
    }>
  >([])

  const addExam = () => {
    setExams([
      ...exams,
      {
        pdfUrl: '',
        pdfFile: null,
        inputType: 'url',
        subjectName: '',
        examTitle: '',
        examType: 'oficial',
        year: new Date().getFullYear().toString(),
      },
    ])
  }

  const removeExam = (index: number) => {
    setExams(exams.filter((_, i) => i !== index))
  }

  const updateExam = (index: number, field: keyof ExamToImport, value: string) => {
    const updated = [...exams]
    const currentExam = updated.at(index)
    // Asegurar que todos los campos siempre tengan valores definidos
    const updatedExam: ExamToImport = {
      pdfUrl: field === 'pdfUrl' ? value || '' : currentExam?.pdfUrl || '',
      pdfFile: currentExam?.pdfFile || null,
      inputType: currentExam?.inputType || 'url',
      subjectName: field === 'subjectName' ? value || '' : currentExam?.subjectName || '',
      examTitle: field === 'examTitle' ? value || '' : currentExam?.examTitle || '',
      examType: field === 'examType' ? value || 'oficial' : currentExam?.examType || 'oficial',
      year: field === 'year' ? value || '' : currentExam?.year || '',
    }
    updated.splice(index, 1, updatedExam)

    // Auto-generar título si está vacío
    if (field === 'subjectName' || field === 'year' || field === 'examType') {
      if (updatedExam.subjectName && updatedExam.year && updatedExam.examType) {
        const typeLabel =
          EXAM_TYPES.find(t => t.value === updatedExam.examType)?.label || 'Examen'
        updatedExam.examTitle =
          `PAES ${updatedExam.year} - ${updatedExam.subjectName} (${typeLabel})`
        updated.splice(index, 1, updatedExam)
      }
    }

    setExams(updated)
  }

  // Helper: Validar PDF (URL o archivo)
  const validatePDF = (exam: ExamToImport, index: number): string[] => {
    const errors: string[] = []
    if (exam.inputType === 'url') {
      if (!exam.pdfUrl) {
        errors.push(`Examen ${index + 1}: URL del PDF requerida`)
      } else {
        try {
          new URL(exam.pdfUrl)
        } catch {
          errors.push(`Examen ${index + 1}: URL del PDF inválida`)
        }
      }
    } else {
      if (!exam.pdfFile) {
        errors.push(`Examen ${index + 1}: Archivo PDF requerido`)
      } else if (exam.pdfFile.type !== 'application/pdf') {
        errors.push(`Examen ${index + 1}: El archivo debe ser un PDF`)
      }
    }
    return errors
  }

  // Helper: Validar campos básicos del examen
  const validateExamFields = (exam: ExamToImport, index: number): string[] => {
    const errors: string[] = []
    if (!exam.subjectName) errors.push(`Examen ${index + 1}: Asignatura requerida`)
    if (!exam.examTitle) errors.push(`Examen ${index + 1}: Título requerido`)
    if (!exam.year) {
      errors.push(`Examen ${index + 1}: Año requerido`)
    } else {
      const year = parseInt(exam.year)
      if (isNaN(year) || year < 2000 || year > 2100) {
        errors.push(`Examen ${index + 1}: Año inválido (debe ser entre 2000 y 2100)`)
      }
    }
    return errors
  }

  // Helper: Validar un solo examen
  const validateSingleExam = (exam: ExamToImport, index: number): string[] => {
    return [...validatePDF(exam, index), ...validateExamFields(exam, index)]
  }

  // Helper: Validar exámenes antes de importar
  const validateExams = (examsToValidate: ExamToImport[]): string[] => {
    const errors: string[] = []
    examsToValidate.forEach((exam, index) => {
      errors.push(...validateSingleExam(exam, index))
    })
    return errors
  }

  // Helper: Construir FormData para envío con archivos
  const buildFormData = (examsToSend: ExamToImport[]): FormData => {
    const formData = new FormData()
    examsToSend.forEach((exam, index) => {
      formData.append(`exams[${index}][inputType]`, exam.inputType)
      if (exam.inputType === 'url') {
        formData.append(`exams[${index}][pdfUrl]`, exam.pdfUrl)
      } else if (exam.pdfFile) {
        formData.append(`exams[${index}][pdfFile]`, exam.pdfFile)
      }
      formData.append(`exams[${index}][subjectName]`, exam.subjectName)
      formData.append(`exams[${index}][examTitle]`, exam.examTitle)
      formData.append(`exams[${index}][examType]`, exam.examType)
      formData.append(`exams[${index}][year]`, exam.year)
    })
    return formData
  }

  // Helper: Extraer mensaje de error de respuesta HTTP
  const getErrorMessageFromResponse = (response: Response, data: { error?: string }): string => {
    if (response.status === 401) {
      return 'No tienes permiso para importar exámenes. Debes ser administrador.'
    }
    if (response.status === 400) {
      return data.error || 'Los datos enviados son inválidos. Verifica el formato de los exámenes.'
    }
    if (response.status >= 500) {
      return 'Error del servidor al procesar los exámenes. Por favor, intenta nuevamente más tarde.'
    }
    return data.error || 'Error al importar exámenes'
  }

  // Helper: Mostrar resultados de importación
  const showImportResults = (results: ImportResult[]) => {
    setResults(results)
    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    if (successCount > 0) {
      toast.success(`${successCount} examen(es) importado(s) correctamente`, {
        description: failCount > 0 ? `${failCount} examen(es) fallaron` : undefined,
        duration: 5000,
      })
    }
    if (failCount > 0 && successCount === 0) {
      toast.error('Error al importar exámenes', {
        description: 'Ningún examen se pudo importar. Revisa los errores detallados abajo.',
        duration: 6000,
      })
    }
  }

  // Helper: Procesar respuesta de importación
  const processImportResponse = async (response: Response): Promise<ImportResult[]> => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(getErrorMessageFromResponse(response, data))
    }
    return data.results || []
  }

  const handleImport = async () => {
    const errors = validateExams(exams)
    if (errors.length > 0) {
      setResults([
        {
          success: false,
          examTitle: 'Validación',
          message: 'Por favor completa todos los campos correctamente',
          details: errors.join('\n'),
        },
      ])
      return
    }

    setLoading(true)
    setResults([])

    try {
      toast.loading(`Iniciando importación de ${exams.length} examen(es)...`, { id: 'import-progress' })
      
      const hasFiles = exams.some(exam => exam.inputType === 'file' && exam.pdfFile)
      let response: Response

      if (hasFiles) {
        const formData = buildFormData(exams)
        response = await fetch('/api/admin/import-exams', {
          method: 'POST',
          body: formData,
        })
      } else {
        response = await fetch('/api/admin/import-exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exams }),
        })
      }

      const results = await processImportResponse(response)
      showImportResults(results)
    } catch (error) {
      const errorInfo = extractErrorInfo(error)
      const structuredError = getErrorMessage(ERROR_CODES.DATA_IMPORT_FAILED, {
        reason: errorInfo.message,
      })

      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'exam_import_error',
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })

      toast.error(structuredError.title, {
        description: `${structuredError.description} ${structuredError.solution}`,
        duration: 6000,
      })
      setResults([
        {
          success: false,
          examTitle: 'Error',
          message: structuredError.description,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchPDFsFromDEMRE = async () => {
    if (!demreUrl) return

    setFetchingPDFs(true)
    setAvailablePDFs([])
    setSearchError(null)

    try {
      const response = await fetch('/api/admin/fetch-demre-pdfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: demreUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.details || data.error || 'Error al obtener PDFs'
        setSearchError(errorMessage)
        setAvailablePDFs([])
        return
      }

      const pdfs = data.pdfs || []

      if (pdfs.length === 0) {
        setSearchError(
          'No se encontraron PDFs en esta página. Asegúrate de que la URL sea correcta y que la página contenga enlaces a archivos PDF.'
        )
        setAvailablePDFs([])
      } else {
        setAvailablePDFs(pdfs)
        setSearchError(null)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error de conexión. Verifica tu conexión a internet o que la URL sea accesible.'
      setSearchError(errorMessage)
      setAvailablePDFs([])
    } finally {
      setFetchingPDFs(false)
    }
  }

  const handleUsePDF = (pdf: { url: string; title: string; subject?: string; year?: string }) => {
    // Agregar o actualizar el primer examen con los datos del PDF
    const updated = [...exams]
    updated[0] = {
      pdfUrl: pdf.url || '', // Asegurar que siempre sea string
      pdfFile: null,
      inputType: 'url',
      subjectName: pdf.subject || '',
      examTitle: pdf.title || `PAES ${pdf.year || new Date().getFullYear()} - Examen`,
      examType: 'oficial',
      year: pdf.year || new Date().getFullYear().toString(),
    }
    setExams(updated)
  }

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...exams]
    const currentExam = updated.at(index)
    updated.splice(index, 1, {
      pdfFile: file,
      pdfUrl: '', // Limpiar URL si se selecciona archivo
      inputType: 'file',
      // Asegurar que todos los campos string siempre tengan valores definidos
      subjectName: currentExam?.subjectName || '',
      examTitle: currentExam?.examTitle || '',
      examType: currentExam?.examType || 'oficial',
      year: currentExam?.year || '',
    })
    setExams(updated)
  }

  const handleInputTypeChange = (index: number, type: 'url' | 'file') => {
    const updated = [...exams]
    const currentExam = updated.at(index)
    updated.splice(index, 1, {
      inputType: type,
      pdfUrl: type === 'url' ? currentExam?.pdfUrl || '' : '',
      pdfFile: type === 'file' ? currentExam?.pdfFile || null : null,
      // Asegurar que todos los campos string siempre tengan valores definidos
      subjectName: currentExam?.subjectName || '',
      examTitle: currentExam?.examTitle || '',
      examType: currentExam?.examType || 'oficial',
      year: currentExam?.year || '',
    })
    setExams(updated)
  }

  const canImport = exams.some(
    e =>
      (e.inputType === 'url' && e.pdfUrl && e.subjectName && e.examTitle && e.year) ||
      (e.inputType === 'file' && e.pdfFile && e.subjectName && e.examTitle && e.year)
  )

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold mb-2">Importar Exámenes desde DEMRE</h1>
        <p className="text-muted-foreground">
          Importa exámenes reales desde el sitio web de DEMRE directamente a la base de datos
        </p>
        <Alert className="mt-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-200">
            ℹ️ Importar Clavijero
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <div className="space-y-2">
              <p>
                <strong>Los exámenes se importan sin respuestas correctas.</strong> Después de
                importar el examen, puedes importar el clavijero (PDF con respuestas correctas) para
                marcar automáticamente las respuestas.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link href="/admin/import-answer-key">
                  <Button variant="outline" size="sm" className="mt-2">
                    <Key className="mr-2 h-4 w-4" />
                    Importar Clavijero
                  </Button>
                </Link>
                <Link href="/admin/import-topics">
                  <Button variant="outline" size="sm" className="mt-2">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Importar Temarios
                  </Button>
                </Link>
                <Link href="/admin/cleanup-test-data">
                  <Button variant="outline" size="sm" className="mt-2">
                    <Trash className="mr-2 h-4 w-4" />
                    Limpiar Datos Ficticios
                  </Button>
                </Link>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Obtener PDFs Automáticamente desde DEMRE</CardTitle>
          <CardDescription>
            Ingresa la URL de la página de DEMRE y obtén automáticamente todos los PDFs disponibles.
            <strong className="block mt-1">
              Luego haz clic en un PDF para llenar automáticamente el formulario.
            </strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="demre-url">URL de la página de DEMRE</Label>
              <Input
                id="demre-url"
                type="url"
                placeholder="https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026"
                value={demreUrl}
                onChange={e => setDemreUrl(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchPDFsFromDEMRE} disabled={fetchingPDFs || !demreUrl}>
                {fetchingPDFs ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar PDFs
                  </>
                )}
              </Button>
            </div>
          </div>

          {searchError && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error al buscar PDFs</AlertTitle>
              <AlertDescription>
                {searchError}
                <p className="mt-2 text-xs">
                  💡 <strong>Sugerencia:</strong> Puedes usar el método manual copiando directamente
                  la URL del PDF en el formulario de abajo.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {availablePDFs.length > 0 && (
            <div className="space-y-2">
              <Label>✅ PDFs Encontrados ({availablePDFs.length})</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {availablePDFs.map((pdf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleUsePDF(pdf)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pdf.title}</p>
                      {pdf.subject && (
                        <p className="text-xs text-muted-foreground">{pdf.subject}</p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">{pdf.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation()
                        handleUsePDF(pdf)
                      }}
                      className="ml-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Haz clic en un PDF para llenar automáticamente el formulario de importación
              </p>
            </div>
          )}

          {!fetchingPDFs && !searchError && availablePDFs.length === 0 && demreUrl && (
            <div className="text-sm text-muted-foreground text-center py-4">
              <p>
                Haz clic en &quot;Buscar PDFs&quot; para encontrar los exámenes disponibles en esta página.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 Método Manual (Alternativa)</CardTitle>
          <CardDescription>
            Si el método automático no funciona o prefieres hacerlo manualmente, tienes dos
            opciones:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">
              Opción 1: Usar URL (puede fallar por headers mal formateados)
            </h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Visita{' '}
                <a
                  href="https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  el sitio de DEMRE
                </a>
              </li>
              <li>Encuentra el PDF del examen que quieres importar</li>
              <li>
                Copia la URL del PDF (clic derecho en el enlace → &quot;Copiar dirección del enlace&quot;)
              </li>
              <li>Selecciona &quot;URL&quot; en el formulario de abajo y pega la URL</li>
              <li>Completa los demás campos y haz clic en &quot;Importar Exámenes&quot;</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">
              Opción 2: Subir Archivo Local (Recomendado si hay problemas)
            </h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Visita{' '}
                <a
                  href="https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  el sitio de DEMRE
                </a>
              </li>
              <li>Descarga el PDF del examen a tu computadora</li>
              <li>Selecciona &quot;Archivo Local&quot; en el formulario de abajo</li>
              <li>Haz clic en &quot;Seleccionar archivo&quot; y elige el PDF descargado</li>
              <li>Completa los demás campos y haz clic en &quot;Importar Exámenes&quot;</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Esta opción evita problemas con headers mal formateados del servidor de DEMRE
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {exams.map((exam, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Examen {index + 1}</CardTitle>
                {exams.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExam(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Método de Importación *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      id={`inputType-url-${index}`}
                      name={`inputType-${index}`}
                      value="url"
                      checked={exam?.inputType === 'url'}
                      onChange={() => handleInputTypeChange(index, 'url')}
                      className="w-4 h-4"
                    />
                    <span>URL (desde DEMRE)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      id={`inputType-file-${index}`}
                      name={`inputType-${index}`}
                      value="file"
                      checked={exam?.inputType === 'file'}
                      onChange={() => handleInputTypeChange(index, 'file')}
                      className="w-4 h-4"
                    />
                    <span>Archivo Local (recomendado si hay problemas con la URL)</span>
                  </label>
                </div>
              </div>

              {exam?.inputType === 'url' ? (
                <div className="space-y-2">
                  <Label htmlFor={`pdfUrl-${index}`}>URL del PDF *</Label>
                  <Input
                    id={`pdfUrl-${index}`}
                    type="url"
                    placeholder="https://demre.cl/.../paes-2026-lectora.pdf"
                    value={String(exam?.pdfUrl ?? '')}
                    onChange={e => updateExam(index, 'pdfUrl', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pega aquí la URL completa del PDF desde DEMRE
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={`pdfFile-${index}`}>Archivo PDF *</Label>
                  <Input
                    id={`pdfFile-${index}`}
                    name={`pdfFile-${index}`}
                    type="file"
                    accept=".pdf"
                    onChange={e => {
                      const file = e.target.files?.[0] || null
                      handleFileChange(index, file)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {exam?.pdfFile
                      ? `Archivo seleccionado: ${exam.pdfFile.name} (${(exam.pdfFile.size / 1024 / 1024).toFixed(2)} MB)`
                      : 'Selecciona un archivo PDF descargado desde DEMRE. Esto evita problemas con headers mal formateados.'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`subjectName-${index}`}>Asignatura *</Label>
                  <Select
                    value={String(exam?.subjectName ?? '')}
                    onValueChange={value => updateExam(index, 'subjectName', value)}
                  >
                    <SelectTrigger id={`subjectName-${index}`}>
                      <SelectValue placeholder="Selecciona una asignatura" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`year-${index}`}>Año *</Label>
                  <Input
                    id={`year-${index}`}
                    type="text"
                    placeholder="2026"
                    value={String(exam?.year ?? '')}
                    onChange={e => updateExam(index, 'year', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`examType-${index}`}>Tipo de Examen</Label>
                  <Select
                    value={String(exam?.examType ?? 'oficial')}
                    onValueChange={value => updateExam(index, 'examType', value)}
                  >
                    <SelectTrigger id={`examType-${index}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`examTitle-${index}`}>Título del Examen *</Label>
                  <Input
                    id={`examTitle-${index}`}
                    type="text"
                    placeholder="PAES 2026 - Competencia Lectora (Oficial)"
                    value={String(exam?.examTitle ?? '')}
                    onChange={e => updateExam(index, 'examTitle', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se genera automáticamente, pero puedes editarlo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addExam} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Otro Examen
        </Button>

        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleImport}
              disabled={loading || !canImport}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Exámenes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <Alert key={index} className={result.success ? '' : 'border-destructive'}>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>{result.examTitle}</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.details && (
                    <pre className="mt-2 text-xs whitespace-pre-wrap">{result.details}</pre>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
