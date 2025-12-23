'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RecommendationCard } from './recommendation-card'
import { Loader2, Target, BookOpen, Calendar, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface TopicRecommendation {
  topicId: string
  topicName: string
  subjectName: string
  subjectCode: string
  currentPercentage: number
  priority: 'high' | 'medium' | 'low'
  reason: string
  suggestedActions: string[]
}

interface ExamRecommendation {
  examId: string
  examTitle: string
  subjectName: string
  subjectCode: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  focusTopics: string[]
}

interface StudyPlan {
  weeklyGoals: Array<{
    week: number
    topics: string[]
    exams: string[]
    description: string
  }>
  estimatedCompletion: string
  focusAreas: string[]
}

interface Recommendations {
  topics: TopicRecommendation[]
  exams: ExamRecommendation[]
  studyPlan: StudyPlan | null
  summary: {
    totalRecommendations: number
    highPriority: number
    estimatedStudyTime: string
  }
}

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch('/api/recommendations')

        if (!res.ok) {
          throw new Error('Error al cargar recomendaciones')
        }

        const data = await res.json()
        setRecommendations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>Cargando recomendaciones...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>No se pudieron cargar las recomendaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (
    !recommendations ||
    (recommendations.topics.length === 0 && recommendations.exams.length === 0)
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendaciones Personalizadas
          </CardTitle>
          <CardDescription>
            Realiza algunos exámenes para recibir recomendaciones personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Aún no hay suficientes datos para generar recomendaciones
            </p>
            <Button asChild>
              <Link href="/exams">
                <BookOpen className="h-4 w-4 mr-2" />
                Comenzar a Practicar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const highPriorityTopics = recommendations.topics.filter(t => t.priority === 'high')
  const mediumPriorityTopics = recommendations.topics.filter(t => t.priority === 'medium')
  const highPriorityExams = recommendations.exams.filter(e => e.priority === 'high')
  const mediumPriorityExams = recommendations.exams.filter(e => e.priority === 'medium')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
            <CardDescription>
              {recommendations.summary.totalRecommendations} recomendaciones •{' '}
              {recommendations.summary.highPriority} de alta prioridad
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Tiempo estimado</p>
            <p className="text-sm font-semibold">{recommendations.summary.estimatedStudyTime}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topics">
              <Target className="h-4 w-4 mr-2" />
              Temas ({recommendations.topics.length})
            </TabsTrigger>
            <TabsTrigger value="exams">
              <BookOpen className="h-4 w-4 mr-2" />
              Exámenes ({recommendations.exams.length})
            </TabsTrigger>
            <TabsTrigger value="plan">
              <Calendar className="h-4 w-4 mr-2" />
              Plan de Estudio
            </TabsTrigger>
          </TabsList>

          {/* Tab de Temas */}
          <TabsContent value="topics" className="space-y-4 mt-4">
            {highPriorityTopics.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-red-600">Alta Prioridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityTopics.map(topic => (
                    <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityTopics.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-yellow-600">Prioridad Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriorityTopics.map(topic => (
                    <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />
                  ))}
                </div>
              </div>
            )}

            {recommendations.topics.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay recomendaciones de temas en este momento</p>
              </div>
            )}
          </TabsContent>

          {/* Tab de Exámenes */}
          <TabsContent value="exams" className="space-y-4 mt-4">
            {highPriorityExams.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-red-600">Alta Prioridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityExams.map(exam => (
                    <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityExams.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-yellow-600">Prioridad Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriorityExams.map(exam => (
                    <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />
                  ))}
                </div>
              </div>
            )}

            {recommendations.exams.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay recomendaciones de exámenes en este momento</p>
              </div>
            )}
          </TabsContent>

          {/* Tab de Plan de Estudio */}
          <TabsContent value="plan" className="mt-4">
            {recommendations.studyPlan ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Áreas de Enfoque</p>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.studyPlan.focusAreas.map((area, idx) => (
                      <span key={idx} className="px-3 py-1 bg-background rounded-full text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {recommendations.studyPlan.weeklyGoals.map(goal => (
                    <Card key={goal.week}>
                      <CardHeader>
                        <CardTitle className="text-lg">Semana {goal.week}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {goal.topics.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Temas a Estudiar:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {goal.topics.map((topic, idx) => (
                                <li key={idx}>{topic}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {goal.exams.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Exámenes Recomendados:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {goal.exams.map((exam, idx) => (
                                <li key={idx}>{exam}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm">
                    <span className="font-medium">Fecha estimada de finalización:</span>{' '}
                    {recommendations.studyPlan.estimatedCompletion}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay plan de estudio disponible en este momento</p>
                <p className="text-xs mt-2">
                  Realiza más exámenes para generar un plan personalizado
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
