'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Circle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BookmarkButton } from '@/components/bookmarks/bookmark-button'
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button'
import { CreateNoteButton } from '@/components/notes/create-note-button'
import { ContentTypeIcon } from '@/components/ui/content-type-icon'

interface QuestionOption {
  id: string
  letra: string
  texto: string
  esCorrecta: boolean
}

interface Question {
  id: string
  enunciado: string
  explicacion: string
  tipo?: string
  options: QuestionOption[]
  topic?: {
    nombre: string
    ejeTematico: string
  } | null
}

interface AttemptAnswer {
  id: string
  questionId: string
  optionSelectedId: string | null
  esCorrecta: boolean | null
  omitida: boolean
  question: Question
  optionSelected: {
    id: string
    letra: string
    texto: string
  } | null
}

interface QuestionReviewProps {
  answer: AttemptAnswer
  index: number
  showTopic?: boolean
}

export function QuestionReview({ answer, index, showTopic = true }: QuestionReviewProps) {
  const isCorrect = answer.esCorrecta === true
  const isOmitted = answer.omitida
  const isIncorrect = !isCorrect && !isOmitted

  const correctOption = answer.question.options.find(opt => opt.esCorrecta)

  return (
    <Card
      className={cn(
        'transition-all',
        isCorrect && 'border-green-500 bg-green-50/50 dark:bg-green-950/20',
        isOmitted && 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20',
        isIncorrect && 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Pregunta {index + 1}</Badge>
              {answer.question.tipo && (
                <ContentTypeIcon 
                  type="question" 
                  questionType={answer.question.tipo} 
                  size={16} 
                />
              )}
              <BookmarkButton questionId={answer.question.id} />
              <CreateFlashcardButton
                questionId={answer.question.id}
                defaultFront={answer.question.enunciado}
                defaultBack={answer.question.explicacion}
                size="sm"
              />
              <CreateNoteButton
                questionId={answer.question.id}
                defaultTitle={`Nota: ${answer.question.enunciado.substring(0, 50)}...`}
                defaultContent={answer.question.explicacion}
                size="sm"
              />
              {isCorrect && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Correcta
                </Badge>
              )}
              {isOmitted && (
                <Badge variant="secondary" className="bg-yellow-600">
                  <Circle className="h-3 w-3 mr-1" />
                  Omitida
                </Badge>
              )}
              {isIncorrect && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Incorrecta
                </Badge>
              )}
            </div>
            {showTopic && answer.question.topic && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="outline" className="text-xs">
                  {answer.question.topic.nombre}
                </Badge>
                <span className="text-xs">{answer.question.topic.ejeTematico}</span>
              </div>
            )}
            <CardTitle className="text-lg mt-2">{answer.question.enunciado}</CardTitle>
          </div>
          <div className="flex-shrink-0">
            {isCorrect ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : isOmitted ? (
              <Circle className="h-6 w-6 text-yellow-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opciones */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Opciones:</p>
          {answer.question.options.map(option => {
            const isSelected = answer.optionSelectedId === option.id
            const isCorrectOption = option.esCorrecta

            return (
              <div
                key={option.id}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  isCorrectOption
                    ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
                    : isSelected
                      ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                      : 'border-border bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[24px]">{option.letra}.</span>
                  <span className="flex-1">{option.texto}</span>
                  <div className="flex items-center gap-2">
                    {isCorrectOption && (
                      <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge>
                    )}
                    {isSelected && !isCorrectOption && (
                      <Badge variant="destructive">Tu respuesta</Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Explicación */}
        {answer.question.explicacion && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Explicación:</p>
            </div>
            <p className="text-sm text-muted-foreground">{answer.question.explicacion}</p>
          </div>
        )}

        {/* Feedback adicional para respuestas incorrectas */}
        {isIncorrect && correctOption && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Respuesta correcta: {correctOption.letra}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{correctOption.texto}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
