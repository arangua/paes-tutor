'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
// Usar input type="checkbox" nativo si no existe el componente Checkbox
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'

const SUBJECTS = [
  { code: 'LECTORA', name: 'Competencia Lectora' },
  { code: 'M1', name: 'Matemática M1' },
  { code: 'M2', name: 'Matemática M2' },
  { code: 'BIO', name: 'Ciencias - Biología' },
  { code: 'FIS', name: 'Ciencias - Física' },
  { code: 'QUI', name: 'Ciencias - Química' },
  { code: 'HIST', name: 'Historia y Ciencias Sociales' },
]

export default function CleanupTestDataPage() {
  const [deleteExams, setDeleteExams] = useState(false)
  const [deleteTopics, setDeleteTopics] = useState(false)
  const [deleteQuestions, setDeleteQuestions] = useState(false)
  const [deleteAttempts, setDeleteAttempts] = useState(false)
  const [deleteTestUsers, setDeleteTestUsers] = useState(false)
  const [onlyTestData, setOnlyTestData] = useState(true)
  const [yearFilter, setYearFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
    result?: {
      exams: { deleted: number; total: number }
      topics: { deleted: number; total: number }
      questions: { deleted: number; total: number }
      attempts: { deleted: number; total: number }
      users: { deleted: number; total: number }
      errors: Array<{ type: string; error: string }>
    }
  } | null>(null)

  const handleCleanup = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/cleanup-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteExams,
          deleteTopics,
          deleteQuestions,
          deleteAttempts,
          deleteTestUsers,
          onlyTestData,
          yearFilter: yearFilter.trim() || undefined,
          subjectFilter: subjectFilter.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al limpiar datos')
      }

      setResult({
        success: true,
        message: data.message,
        details: data.details,
        result: data.result,
      })
    } catch (error) {
      setResult({
        success: false,
        message: 'Error al limpiar datos',
        details: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setLoading(false)
      setShowConfirmDialog(false)
    }
  }

  const handleCleanupClick = () => {
    // Validar que al menos una opción esté seleccionada
    if (!deleteExams && !deleteTopics && !deleteQuestions && !deleteAttempts && !deleteTestUsers) {
      setResult({
        success: false,
        message: 'Debe seleccionar al menos un tipo de dato para eliminar',
      })
      return
    }
    setShowConfirmDialog(true)
  }

  // Calcular totales para mostrar en el resumen
  const totalDeleted = result?.result
    ? result.result.exams.deleted +
      result.result.topics.deleted +
      result.result.questions.deleted +
      result.result.attempts.deleted +
      result.result.users.deleted
    : 0

  if (loading && !result) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <SkeletonLoader variant="form" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Limpiar Datos Ficticios</h1>
        <p className="text-muted-foreground mt-2">
          Elimina datos de prueba, simulacros y contenido ficticio de la base de datos.
        </p>
      </div>

      <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-200">⚠️ Advertencia</AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 mt-2">
          Esta acción es <strong>irreversible</strong>. Los datos eliminados no se pueden recuperar.
          Asegúrate de haber hecho un respaldo si es necesario.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Datos a Eliminar</CardTitle>
          <CardDescription>
            Marca los tipos de datos que deseas eliminar. Por defecto, solo se eliminan datos
            marcados como prueba/test.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opciones de eliminación */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteExams"
                name="deleteExams"
                checked={deleteExams}
                onChange={e => setDeleteExams(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <Label htmlFor="deleteExams" className="cursor-pointer">
                Eliminar exámenes de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteTopics"
                name="deleteTopics"
                checked={deleteTopics}
                onChange={e => setDeleteTopics(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <Label htmlFor="deleteTopics" className="cursor-pointer">
                Eliminar temas de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteQuestions"
                name="deleteQuestions"
                checked={deleteQuestions}
                onChange={e => setDeleteQuestions(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <Label htmlFor="deleteQuestions" className="cursor-pointer">
                Eliminar preguntas de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteAttempts"
                name="deleteAttempts"
                checked={deleteAttempts}
                onChange={e => setDeleteAttempts(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <Label htmlFor="deleteAttempts" className="cursor-pointer">
                Eliminar intentos de exámenes de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteTestUsers"
                name="deleteTestUsers"
                checked={deleteTestUsers}
                onChange={e => setDeleteTestUsers(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <Label htmlFor="deleteTestUsers" className="cursor-pointer">
                Eliminar usuarios de prueba
              </Label>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="onlyTestData"
                name="onlyTestData"
                checked={onlyTestData}
                onChange={e => setOnlyTestData(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <Label htmlFor="onlyTestData" className="cursor-pointer">
                Solo eliminar datos marcados como prueba/test
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Si está desmarcado, se eliminarán todos los datos seleccionados sin importar si son de
              prueba o no.
            </p>

            <div className="space-y-2">
              <Label htmlFor="yearFilter">Filtrar por año (opcional)</Label>
              <input
                id="yearFilter"
                type="text"
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                placeholder="Ej: 2024"
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Solo eliminar datos del año especificado (busca en el campo &quot;fuente&quot; de los
                exámenes).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectFilter">Filtrar por asignatura (opcional)</Label>
              <select
                id="subjectFilter"
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="">Todas las asignaturas</option>
                {SUBJECTS.map(subject => (
                  <option key={subject.code} value={subject.code}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-muted-foreground">
                Solo eliminar datos de la asignatura seleccionada.
              </p>
            </div>
          </div>

          {/* Botón de limpieza */}
          <Button
            onClick={handleCleanupClick}
            disabled={
              loading ||
              (!deleteExams &&
                !deleteTopics &&
                !deleteQuestions &&
                !deleteAttempts &&
                !deleteTestUsers)
            }
            className="w-full"
            size="lg"
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar Datos Ficticios
          </Button>

          {/* Dialog de confirmación */}
          <ConfirmDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            onConfirm={handleCleanup}
            title="Confirmar Limpieza de Datos"
            description="Esta acción es irreversible. ¿Estás seguro de que deseas eliminar los datos seleccionados? Esta operación no se puede deshacer."
            confirmText="Sí, eliminar datos"
            cancelText="Cancelar"
            variant="destructive"
            loading={loading}
          />

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
              <AlertTitle>{result.success ? 'Limpieza Completada' : 'Error'}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {result.details && (
                  <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>
                )}
                {result.result && totalDeleted > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="font-semibold mb-2">Resumen:</div>
                    <div className="text-sm space-y-1">
                      <div>Exámenes: {result.result.exams.deleted} eliminados</div>
                      <div>Temas: {result.result.topics.deleted} eliminados</div>
                      <div>Preguntas: {result.result.questions.deleted} eliminadas</div>
                      <div>Intentos: {result.result.attempts.deleted} eliminados</div>
                      <div>Usuarios: {result.result.users.deleted} eliminados</div>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Información adicional */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Los datos se identifican como &quot;de prueba&quot; si contienen palabras como: test,
                  prueba, demo, ejemplo, simulacro, etc.
                </li>
                <li>Los exámenes de tipo &quot;simulacro&quot; se consideran datos de prueba.</li>
                <li>
                  Los usuarios con emails que contengan &quot;test&quot;, &quot;demo&quot;, &quot;prueba&quot; o &quot;example&quot; se
                  consideran usuarios de prueba.
                </li>
                <li>La eliminación se realiza en transacción: si falla algo, se revierte todo.</li>
                <li>Se respetan las relaciones de la base de datos (eliminación en cascada).</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
