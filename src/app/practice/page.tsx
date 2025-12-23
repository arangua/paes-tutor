'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, BookOpen, PlayCircle, TrendingUp, Target } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'

interface Subject {
  id: string
  nombre: string
  codigo: string
  tipo: string
}

interface Topic {
  id: string
  nombre: string
  ejeTematico: string
  descripcion: string | null
  subjectId: string
}

export default function PracticePage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true)
        const res = await fetch('/api/subjects')
        if (!res.ok) throw new Error('Error al cargar asignaturas')
        const data = await res.json()
        setSubjects(data.subjects || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        toast.error('Error al cargar asignaturas')
      } finally {
        setLoading(false)
      }
    }
    loadSubjects()
  }, [])

  useEffect(() => {
    async function loadTopics() {
      if (!selectedSubjectId) {
        setTopics([])
        return
      }

      try {
        setLoadingTopics(true)
        const res = await fetch(`/api/topics?subjectId=${selectedSubjectId}`)
        if (!res.ok) throw new Error('Error al cargar temas')
        const data = await res.json()
        setTopics(data.topics || [])
      } catch (err) {
        toast.error('Error al cargar temas')
        setTopics([])
      } finally {
        setLoadingTopics(false)
      }
    }
    loadTopics()
  }, [selectedSubjectId])

  const handleStartPractice = (topicId: string) => {
    router.push(`/practice/${topicId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PlayCircle className="h-8 w-8" />
            Modo de Práctica
          </h1>
          <p className="text-muted-foreground mt-2">
            Practica preguntas de temas específicos sin presión de tiempo
          </p>
        </div>
        <HelpIcon content="En el modo de práctica puedes estudiar temas específicos sin timer. Recibirás feedback inmediato después de cada respuesta." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecciona un Tema</CardTitle>
          <CardDescription>
            Elige una asignatura y luego un tema para comenzar a practicar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asignatura</label>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una asignatura" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingTopics && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {!loadingTopics && selectedSubjectId && topics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay temas disponibles para esta asignatura
            </div>
          )}

          {!loadingTopics && topics.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Tema</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(topic => (
                  <Card key={topic.id} className="hover:border-primary transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{topic.nombre}</CardTitle>
                        <Badge variant="outline">{topic.ejeTematico}</Badge>
                      </div>
                      {topic.descripcion && (
                        <CardDescription className="text-sm mt-2">
                          {topic.descripcion}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleStartPractice(topic.id)}
                        className="w-full"
                        size="sm"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Practicar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Beneficios del Modo de Práctica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Sin Presión</h3>
                <p className="text-sm text-muted-foreground">
                  Practica sin timer, a tu propio ritmo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Feedback Inmediato</h3>
                <p className="text-sm text-muted-foreground">Recibe explicaciones al instante</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Enfoque Dirigido</h3>
                <p className="text-sm text-muted-foreground">
                  Practica solo los temas que necesitas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
