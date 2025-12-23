'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock } from 'lucide-react'

interface ExamCardProps {
  exam: {
    id: string
    titulo: string
    descripcion: string | null
    tipo: string
    tiempoLimiteMin: number | null
    totalPreguntas: number
    fuente: string | null
    subject: {
      id: string
      nombre: string
      codigo: string
    }
  }
  onStartExam: (examId: string) => void
}

/**
 * Componente optimizado con React.memo para evitar re-renders innecesarios
 * Solo se re-renderiza si las props cambian
 */
export const ExamCard = React.memo(
  function ExamCard({ exam, onStartExam }: ExamCardProps) {
    const handleStartClick = React.useCallback(() => {
      onStartExam(exam.id)
    }, [exam.id, onStartExam])

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{exam.titulo}</CardTitle>
            <Badge variant="outline">{exam.subject.codigo}</Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {exam.descripcion || 'Sin descripción'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información del examen */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Asignatura:</span>
              <span className="font-medium">{exam.subject.nombre}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
              <Badge variant="secondary">{exam.tipo}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Preguntas:</span>
              <span className="font-medium">{exam.totalPreguntas}</span>
            </div>
            {exam.tiempoLimiteMin && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Tiempo límite: {exam.tiempoLimiteMin} minutos
                </span>
              </div>
            )}
            {exam.fuente && (
              <div className="text-xs text-gray-500 dark:text-gray-500">Fuente: {exam.fuente}</div>
            )}
          </div>

          {/* Botón para iniciar */}
          <Button className="w-full" onClick={handleStartClick}>
            <BookOpen className="h-4 w-4 mr-2" />
            Iniciar Examen
          </Button>
        </CardContent>
      </Card>
    )
  },
  (prevProps, nextProps) => {
    // Comparación personalizada para evitar re-renders innecesarios
    return (
      prevProps.exam.id === nextProps.exam.id &&
      prevProps.exam.titulo === nextProps.exam.titulo &&
      prevProps.exam.descripcion === nextProps.exam.descripcion &&
      prevProps.exam.tipo === nextProps.exam.tipo &&
      prevProps.exam.totalPreguntas === nextProps.exam.totalPreguntas &&
      prevProps.exam.subject.id === nextProps.exam.subject.id
    )
  }
)
