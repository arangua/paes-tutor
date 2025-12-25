'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'
import { captureError } from '@/lib/monitoring'
import {
  Loader2,
  Sparkles,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowLeft,
} from 'lucide-react'

interface Subject {
  id: string
  nombre: string
  codigo: string
}

interface Topic {
  id: string
  nombre: string
  ejeTematico: string
}

export default function GenerateExamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [numQuestions, setNumQuestions] = useState(30)
  const [difficulty, setDifficulty] = useState<'baja' | 'media' | 'alta' | 'mixta'>('mixta')
  const [tipo, setTipo] = useState<'objetiva' | 'desarrollo' | 'mixta'>('objetiva')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tiempoLimiteMin, setTiempoLimiteMin] = useState<number | undefined>()
  const [fuente, setFuente] = useState('')
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ examId: string; message: string } | null>(null)

  // Cargar asignaturas
  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingData(true)
        const res = await fetch('/api/subjects')
        if (!res.ok) throw new Error('Error al cargar asignaturas')
        const data = await res.json()
        setSubjects(data.subjects || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoadingData(false)
      }
    }
    loadSubjects()
  }, [])

  // Cargar temas cuando se selecciona una asignatura
  useEffect(() => {
    async function loadTopics() {
      if (!selectedSubject) {
        setTopics([])
        return
      }

      try {
        const res = await fetch(`/api/topics?subjectId=${selectedSubject}`)
        if (!res.ok) throw new Error('Error al cargar temas')
        const data = await res.json()
        setTopics(data.topics || [])
        setSelectedTopics([]) // Resetear selección de temas
      } catch (err) {
        captureError(error instanceof Error ? error : new Error(String(error)), {
          type: 'admin_generate_exam_error',
          action: 'load_topics',
          subjectId: selectedSubject,
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        })
        setTopics([])
      }
    }
    loadTopics()
  }, [selectedSubject])

  // Calcular tiempo límite sugerido
  useEffect(() => {
    if (!tiempoLimiteMin && numQuestions) {
      setTiempoLimiteMin(Math.ceil(numQuestions * 1.5))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Solo recalcular cuando cambia numQuestions, tiempoLimiteMin no debe estar en deps
    // para evitar loops infinitos cuando el usuario establece manualmente el tiempo
  }, [numQuestions])

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId: selectedSubject,
          topicIds: selectedTopics.length > 0 ? selectedTopics : undefined,
          numQuestions,
          difficulty,
          tipo,
          includeAnswerKey,
          titulo: titulo || undefined,
          descripcion: descripcion || undefined,
          tiempoLimiteMin: tiempoLimiteMin || undefined,
          fuente: fuente || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al generar examen')
      }

      setSuccess({
        examId: data.exam.id,
        message: data.message,
      })

      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setTitulo('')
        setDescripcion('')
        setFuente('')
        setSelectedTopics([])
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Breadcrumbs className="mb-6" />
        <SkeletonLoader variant="form" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Breadcrumbs className="mb-6" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Generar Examen con IA
          </h1>
          <p className="text-muted-foreground mt-2">
            Genera exámenes automáticamente basados en temarios y la malla curricular chilena
          </p>
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Generación Inteligente de Exámenes</AlertTitle>
        <AlertDescription className="mt-2">
          El sistema utiliza IA para generar exámenes alineados con la malla curricular del MINEDUC.
          Las preguntas se basan en los temarios importados y siguen el formato de la PAES.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asignatura */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Examen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Asignatura *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecciona una asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.nombre} ({subject.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Temas (opcional) */}
            {selectedSubject && topics.length > 0 && (
              <div className="space-y-2">
                <Label>Temas Específicos (opcional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selecciona temas específicos. Si no seleccionas ninguno, se usarán todos los temas
                  de la asignatura.
                </p>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {topics.map(topic => (
                      <div key={topic.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`topic-${topic.id}`}
                          checked={selectedTopics.includes(topic.id)}
                          onCheckedChange={() => handleTopicToggle(topic.id)}
                        />
                        <label
                          htmlFor={`topic-${topic.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <div className="font-medium">{topic.nombre}</div>
                          <div className="text-xs text-muted-foreground">
                            Eje: {topic.ejeTematico}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Número de Preguntas *</Label>
                <Input
                  id="numQuestions"
                  type="number"
                  min={5}
                  max={80}
                  value={numQuestions}
                  onChange={e => setNumQuestions(parseInt(e.target.value) || 30)}
                  required
                />
                <p className="text-xs text-muted-foreground">Entre 5 y 80 preguntas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select
                  value={difficulty}
                  onValueChange={v => setDifficulty(v as '1' | '2' | '3' | '4' | '5' | 'all')}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixta">Mixta</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Examen</Label>
                <Select
                  value={tipo}
                  onValueChange={v => setTipo(v as 'obligatorio' | 'electivo' | 'all')}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="objetiva">Objetiva (Opción Múltiple)</SelectItem>
                    <SelectItem value="desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="mixta">Mixta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiempoLimiteMin">Tiempo Límite (minutos)</Label>
                <Input
                  id="tiempoLimiteMin"
                  type="number"
                  min={1}
                  value={tiempoLimiteMin || ''}
                  onChange={e =>
                    setTiempoLimiteMin(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="Auto (1.5 min/pregunta)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional (Opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Examen</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ej: PAES 2026 - Matemática (Simulacro)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Descripción del examen..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuente">Fuente</Label>
              <Input
                id="fuente"
                value={fuente}
                onChange={e => setFuente(e.target.value)}
                placeholder="Ej: Generado con IA - PAES Tutor"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAnswerKey"
                checked={includeAnswerKey}
                onCheckedChange={checked => setIncludeAnswerKey(checked === true)}
              />
              <label htmlFor="includeAnswerKey" className="text-sm cursor-pointer">
                Incluir clavijero (respuestas correctas)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Mensajes */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Examen Generado Exitosamente
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {success.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Botón de generar */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading || !selectedSubject} className="flex-1" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando Examen...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Examen con IA
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin')}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
