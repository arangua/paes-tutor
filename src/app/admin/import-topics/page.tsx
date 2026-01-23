'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  FileJson,
  File,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'

const SUBJECTS = [
  'Competencia Lectora',
  'Matemática M1',
  'Matemática M2',
  'Ciencias - Biología',
  'Ciencias - Física',
  'Ciencias - Química',
  'Historia y Ciencias Sociales',
]

interface Topic {
  asignatura: string
  ejeTematico: string
  nombre: string
  descripcion?: string
}

export default function ImportTopicsPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [csvText, setCsvText] = useState('')
  const [jsonText, setJsonText] = useState('')
  const [subjectName, setSubjectName] = useState<string | undefined>(undefined) // Para PDFs cuando no se detecta asignatura
  const [activeTab, setActiveTab] = useState<'pdf' | 'csv-file' | 'csv-text' | 'json'>('pdf')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
    result?: {
      total: number
      created: number
      updated: number
      skipped: number
      errors: Array<{ topic: string; error: string }>
    }
  } | null>(null)

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar extensión
      const fileName = file.name.toLowerCase()
      if (!fileName.endsWith('.pdf')) {
        setResult({
          success: false,
          message: 'El archivo debe ser un PDF',
          details: 'Por favor, selecciona un archivo PDF válido.',
        })
        return
      }

      // Validar tamaño (máximo 50 MB)
      const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
      if (file.size > MAX_FILE_SIZE) {
        setResult({
          success: false,
          message: 'El archivo es demasiado grande',
          details: `El tamaño máximo permitido es ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        })
        return
      }

      // Validar tamaño mínimo
      const MIN_FILE_SIZE = 100 // 100 bytes
      if (file.size < MIN_FILE_SIZE) {
        setResult({
          success: false,
          message: 'El archivo es demasiado pequeño',
          details: 'El archivo parece estar vacío o corrupto.',
        })
        return
      }

      setPdfFile(file)
      setResult(null)
    }
  }

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar extensión
      const fileName = file.name.toLowerCase()
      if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
        setResult({
          success: false,
          message: 'El archivo debe ser CSV o TXT',
          details: 'Por favor, selecciona un archivo CSV o TXT válido.',
        })
        return
      }

      // Validar tamaño (máximo 5 MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
      if (file.size > MAX_FILE_SIZE) {
        setResult({
          success: false,
          message: 'El archivo es demasiado grande',
          details: `El tamaño máximo permitido es ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        })
        return
      }

      setCsvFile(file)
      setResult(null)
    }
  }

  const handleCsvTextChange = (value: string) => {
    setCsvText(value)
    setResult(null)
  }

  const handleJsonTextChange = (value: string) => {
    setJsonText(value)
    setResult(null)
  }

  const validateJsonFormat = (text: string): Topic[] | null => {
    try {
      const parsed = JSON.parse(text)

      if (!Array.isArray(parsed)) {
        throw new Error('El JSON debe ser un array de temas')
      }

      const topics: Topic[] = []
      for (const item of parsed) {
        if (!item.asignatura || !item.ejeTematico || !item.nombre) {
          throw new Error('Cada tema debe tener: asignatura, ejeTematico, nombre')
        }
        topics.push({
          asignatura: item.asignatura,
          ejeTematico: item.ejeTematico,
          nombre: item.nombre,
          descripcion: item.descripcion || undefined,
        })
      }

      return topics
    } catch {
      return null
    }
  }

  // Helper: Validar y preparar request según tipo de tab
  const prepareImportRequest = async (): Promise<Response | null> => {
    if (activeTab === 'pdf') {
      if (!pdfFile) {
        setResult({
          success: false,
          message: 'Archivo PDF requerido',
          details: 'Por favor, selecciona un archivo PDF del temario.',
        })
        return null
      }
      const formData = new FormData()
      formData.append('pdfFile', pdfFile)
      if (subjectName) {
        formData.append('subjectName', subjectName)
      }
      return fetch('/api/admin/import-topics', { method: 'POST', body: formData })
    }

    if (activeTab === 'csv-file') {
      if (!csvFile) {
        setResult({
          success: false,
          message: 'Archivo requerido',
          details: 'Por favor, selecciona un archivo CSV.',
        })
        return null
      }
      const formData = new FormData()
      formData.append('csvFile', csvFile)
      return fetch('/api/admin/import-topics', { method: 'POST', body: formData })
    }

    if (activeTab === 'csv-text') {
      if (!csvText.trim()) {
        setResult({
          success: false,
          message: 'Texto CSV requerido',
          details: 'Por favor, ingresa el contenido CSV.',
        })
        return null
      }
      const formData = new FormData()
      formData.append('csvText', csvText)
      return fetch('/api/admin/import-topics', { method: 'POST', body: formData })
    }

    // JSON
    if (!jsonText.trim()) {
      setResult({
        success: false,
        message: 'JSON requerido',
        details: 'Por favor, ingresa el JSON con los temas.',
      })
      return null
    }

    const topics = validateJsonFormat(jsonText)
    if (!topics) {
      setResult({
        success: false,
        message: 'JSON inválido',
        details: 'El formato JSON no es válido. Cada tema debe tener: asignatura, ejeTematico, nombre.',
      })
      return null
    }

    return fetch('/api/admin/import-topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topics }),
    })
  }

  // Helper: Limpiar formularios después de importación exitosa
  const clearFormAfterSuccess = () => {
    if (activeTab === 'pdf') {
      setPdfFile(null)
      setSubjectName(undefined)
      const fileInput = document.getElementById('pdfFile') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } else if (activeTab === 'csv-file') {
      setCsvFile(null)
      const fileInput = document.getElementById('csvFile') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } else if (activeTab === 'csv-text') {
      setCsvText('')
    } else {
      setJsonText('')
    }
  }

  const handleImport = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await prepareImportRequest()
      if (!response) {
        setLoading(false)
        return
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Error al importar temarios')
      }

      setResult({
        success: true,
        message: data.message,
        details: data.details,
        result: data.result,
      })

      clearFormAfterSuccess()
    } catch (error) {
      setResult({
        success: false,
        message: 'Error al importar temarios',
        details: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setLoading(false)
    }
  }

  const getExampleJson = () => {
    return JSON.stringify(
      [
        {
          asignatura: 'Matemática M1',
          ejeTematico: 'Álgebra',
          nombre: 'Ecuaciones lineales',
          descripcion: 'Resolución de ecuaciones de primer grado',
        },
        {
          asignatura: 'Matemática M1',
          ejeTematico: 'Álgebra',
          nombre: 'Sistemas de ecuaciones',
          descripcion: 'Métodos de resolución de sistemas',
        },
      ],
      null,
      2
    )
  }

  const getExampleCsv = () => {
    return `asignatura,eje tematico,nombre,descripcion
Matemática M1,Álgebra,Ecuaciones lineales,Resolución de ecuaciones de primer grado
Matemática M1,Álgebra,Sistemas de ecuaciones,Métodos de resolución de sistemas
Competencia Lectora,Comprensión lectora,Inferencia,Capacidad de inferir información implícita`
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Importar Temarios</h1>
        <p className="text-muted-foreground mt-2">
          Importa temarios completos para organizar el contenido por asignatura, eje temático y
          tema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Temarios</CardTitle>
          <CardDescription>
            Puedes importar temarios desde un archivo PDF, CSV, texto CSV o formato JSON. Los temas
            se organizarán automáticamente por asignatura y eje temático.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pdf">
                <File className="mr-2 h-4 w-4" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="csv-file">
                <FileText className="mr-2 h-4 w-4" />
                CSV Archivo
              </TabsTrigger>
              <TabsTrigger value="csv-text">
                <FileText className="mr-2 h-4 w-4" />
                CSV Texto
              </TabsTrigger>
              <TabsTrigger value="json">
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pdf" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfFile">Archivo PDF del Temario *</Label>
                <Input
                  id="pdfFile"
                  name="pdfFile"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfFileChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
                {pdfFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  El sistema detectará automáticamente asignaturas, ejes temáticos y temas del PDF.
                </p>
              </div>

              {/* Selector de asignatura (opcional, para cuando no se detecta) */}
              <div className="space-y-2">
                <Label htmlFor="subjectName">Asignatura (Opcional)</Label>
                <Select
                  value={subjectName || '__none__'}
                  onValueChange={value => setSubjectName(value === '__none__' ? undefined : value)}
                >
                  <SelectTrigger id="subjectName">
                    <SelectValue placeholder="Selecciona si el PDF no tiene asignatura explícita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Ninguna (detectar automáticamente)</SelectItem>
                    {SUBJECTS.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Si el PDF no contiene el nombre de la asignatura, selecciona una aquí.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csv-file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvFile">Archivo CSV *</Label>
                <Input
                  id="csvFile"
                  name="csvFile"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCsvFileChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
                {csvFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  El CSV debe tener columnas: asignatura, eje temático, nombre, descripción
                  (opcional)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csv-text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvText">Contenido CSV *</Label>
                <Textarea
                  id="csvText"
                  value={csvText}
                  onChange={e => handleCsvTextChange(e.target.value)}
                  disabled={loading}
                  placeholder={getExampleCsv()}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Pega el contenido CSV aquí. Primera fila debe ser encabezados.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jsonText">JSON *</Label>
                <Textarea
                  id="jsonText"
                  value={jsonText}
                  onChange={e => handleJsonTextChange(e.target.value)}
                  disabled={loading}
                  placeholder={getExampleJson()}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Formato: array de objetos con asignatura, ejeTematico, nombre, descripcion
                  (opcional)
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Botón de importar */}
          <Button
            onClick={handleImport}
            disabled={
              loading ||
              (activeTab === 'pdf' && !pdfFile) ||
              (activeTab === 'csv-file' && !csvFile) ||
              (activeTab === 'csv-text' && !csvText.trim()) ||
              (activeTab === 'json' && !jsonText.trim())
            }
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando temarios...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Temarios
              </>
            )}
          </Button>

          {/* Resultados */}
          {result && (
            <Alert
              variant={result.success ? 'default' : 'destructive'}
              className={result.success ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
            >
              {result.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? 'Éxito' : 'Error'}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {result.details && (
                  <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Información adicional */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>PDF:</strong> El sistema detectará automáticamente asignaturas, ejes
                  temáticos y temas. Si no se detecta la asignatura, puedes seleccionarla
                  manualmente.
                </li>
                <li>Las asignaturas válidas son: {SUBJECTS.join(', ')}</li>
                <li>
                  Los temas duplicados (misma asignatura, eje temático y nombre) se actualizarán en
                  lugar de crear duplicados.
                </li>
                <li>El formato CSV debe tener encabezados en la primera fila.</li>
                <li>El formato JSON debe ser un array de objetos.</li>
                <li>La descripción es opcional en todos los formatos.</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Ejemplos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ejemplo CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {getExampleCsv()}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setActiveTab('csv-text')
                    setCsvText(getExampleCsv())
                  }}
                >
                  Usar ejemplo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ejemplo JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {getExampleJson()}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setActiveTab('json')
                    setJsonText(getExampleJson())
                  }}
                >
                  Usar ejemplo
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
