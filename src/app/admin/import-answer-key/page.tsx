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
import { Loader2, Upload, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
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

export default function ImportAnswerKeyPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [subjectName, setSubjectName] = useState<string | undefined>(undefined)
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
    examId?: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (file.type && file.type !== 'application/pdf') {
        setResult({
          success: false,
          message: 'El archivo debe ser un PDF',
          details: 'Por favor, selecciona un archivo PDF válido.',
        })
        return
      }

      // Validar extensión
      const fileName = file.name.toLowerCase()
      if (!fileName.endsWith('.pdf')) {
        setResult({
          success: false,
          message: 'El archivo debe tener extensión .pdf',
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
          details: `El tamaño máximo permitido es ${MAX_FILE_SIZE / 1024 / 1024} MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
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

  const handleImport = async () => {
    // Validar
    if (!pdfFile) {
      setResult({
        success: false,
        message: 'Archivo requerido',
        details: 'Por favor, selecciona un archivo PDF del clavijero.',
      })
      return
    }

    if (!subjectName) {
      setResult({
        success: false,
        message: 'Asignatura requerida',
        details: 'Por favor, selecciona la asignatura del examen.',
      })
      return
    }

    if (!year) {
      setResult({
        success: false,
        message: 'Año requerido',
        details: 'Por favor, ingresa el año del examen.',
      })
      return
    }

    // Validar año
    const yearNum = parseInt(year)
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setResult({
        success: false,
        message: 'Año inválido',
        details: 'El año debe ser un número entre 2000 y 2100.',
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('pdfFile', pdfFile)
      formData.append('subjectName', subjectName)
      formData.append('year', year)

      const response = await fetch('/api/admin/import-answer-key', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al importar clavijero')
      }

      setResult({
        success: true,
        message: data.message,
        details: data.details,
        examId: data.examId,
      })

      // Limpiar formulario si fue exitoso
      setPdfFile(null)
      const fileInput = document.getElementById('pdfFile') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Error al importar clavijero',
        details: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Importar Clavijero</h1>
        <p className="text-muted-foreground mt-2">
          Importa el PDF del clavijero para marcar automáticamente las respuestas correctas del
          examen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir Clavijero</CardTitle>
          <CardDescription>
            El sistema detectará automáticamente el examen correspondiente por año y asignatura.
            Asegúrate de haber importado el examen primero.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Asignatura */}
          <div className="space-y-2">
            <Label htmlFor="subjectName">Asignatura *</Label>
            <Select value={subjectName || undefined} onValueChange={setSubjectName}>
              <SelectTrigger id="subjectName">
                <SelectValue placeholder="Selecciona la asignatura" />
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

          {/* Año */}
          <div className="space-y-2">
            <Label htmlFor="year">Año del Examen *</Label>
            <Input
              id="year"
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Ej: 2026"
            />
            <p className="text-sm text-muted-foreground">
              El sistema buscará automáticamente el examen de esta asignatura y año.
            </p>
          </div>

          {/* Archivo PDF */}
          <div className="space-y-2">
            <Label htmlFor="pdfFile">Archivo PDF del Clavijero *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="pdfFile"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="cursor-pointer"
              />
            </div>
            {pdfFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>
                  {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              El PDF debe contener las respuestas correctas en formato como "1-A", "2-B", etc.
              Tamaño máximo: 50 MB.
            </p>
          </div>

          {/* Botón de importar */}
          <Button
            onClick={handleImport}
            disabled={loading || !pdfFile || !subjectName || !year}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando clavijero...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Clavijero
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
                <li>El examen debe estar importado antes de importar el clavijero.</li>
                <li>El sistema buscará automáticamente el examen por año y asignatura.</li>
                <li>
                  Si hay múltiples exámenes del mismo año/asignatura, deberás especificar el ID del
                  examen.
                </li>
                <li>
                  El formato del clavijero debe ser similar a: "1-A, 2-B, 3-C..." o "Respuestas:
                  1-A, 2-B..."
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
