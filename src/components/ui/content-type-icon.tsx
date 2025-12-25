'use client'

import { 
  FileText, 
  BookOpen, 
  Bookmark, 
  ClipboardList,
  GraduationCap,
  Target,
  Brain,
  CheckSquare,
  Edit,
  ListChecks,
  FileQuestion,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getQuestionTypeIcon, getExamTypeIcon } from '@/lib/subject-icons'

export type ContentType = 
  | 'exam' 
  | 'question' 
  | 'note' 
  | 'flashcard' 
  | 'bookmark' 
  | 'attempt'
  | 'material'
  | 'topic'

export type QuestionType = 'multiple_choice' | 'true_false' | 'desarrollo' | 'completar' | string

interface ContentTypeIconProps {
  type: ContentType | QuestionType
  questionType?: QuestionType
  examType?: string
  className?: string
  size?: number
  showLabel?: boolean
}

const CONTENT_TYPE_ICONS: Record<ContentType, { icon: LucideIcon; color: string; label: string }> = {
  exam: {
    icon: ClipboardList,
    color: 'text-blue-600 dark:text-blue-400',
    label: 'Examen',
  },
  question: {
    icon: FileQuestion,
    color: 'text-purple-600 dark:text-purple-400',
    label: 'Pregunta',
  },
  note: {
    icon: FileText,
    color: 'text-green-600 dark:text-green-400',
    label: 'Nota',
  },
  flashcard: {
    icon: BookOpen,
    color: 'text-orange-600 dark:text-orange-400',
    label: 'Flashcard',
  },
  bookmark: {
    icon: Bookmark,
    color: 'text-yellow-600 dark:text-yellow-400',
    label: 'Marcador',
  },
  attempt: {
    icon: Target,
    color: 'text-indigo-600 dark:text-indigo-400',
    label: 'Intento',
  },
  material: {
    icon: GraduationCap,
    color: 'text-cyan-600 dark:text-cyan-400',
    label: 'Material',
  },
  topic: {
    icon: Brain,
    color: 'text-pink-600 dark:text-pink-400',
    label: 'Tema',
  },
}

export function ContentTypeIcon({
  type,
  questionType,
  examType,
  className,
  size = 20,
  showLabel = false,
}: ContentTypeIconProps) {
  // Si es un tipo de pregunta, usar iconos de pregunta
  if (type === 'question' && questionType) {
    const config = getQuestionTypeIcon(questionType)
    const Icon = config.icon
    
    if (showLabel) {
      return (
        <div className={cn('flex items-center gap-2', className)}>
          <Icon className={cn(config.color)} size={size} />
          <span className="text-sm text-muted-foreground">{config.description}</span>
        </div>
      )
    }
    
    return <Icon className={cn(config.color, className)} size={size} />
  }

  // Si es un examen, usar iconos de tipo de examen
  if (type === 'exam' && examType) {
    const config = getExamTypeIcon(examType)
    const Icon = config.icon
    
    if (showLabel) {
      return (
        <div className={cn('flex items-center gap-2', className)}>
          <Icon className={cn(config.color)} size={size} />
          <span className="text-sm text-muted-foreground">{config.description}</span>
        </div>
      )
    }
    
    return <Icon className={cn(config.color, className)} size={size} />
  }

  // Tipo de contenido estándar
  const config = CONTENT_TYPE_ICONS[type as ContentType] || CONTENT_TYPE_ICONS.question
  const Icon = config.icon

  if (showLabel) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Icon className={cn(config.color)} size={size} />
        <span className="text-sm text-muted-foreground">{config.label}</span>
      </div>
    )
  }

  return <Icon className={cn(config.color, className)} size={size} />
}

