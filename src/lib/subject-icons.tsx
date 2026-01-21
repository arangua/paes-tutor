/**
 * Iconografía contextual por materia
 * Basado en estándares de educación mundial
 */

import {
  Calculator,
  BookOpen,
  Globe,
  Calendar,
  Users,
  Dna,
  MapPin,
  FileText,
  FunctionSquare,
  Divide,
  BookMarked,
  PenTool,
  Search,
  Zap,
  FlaskConical as BeakerIcon,
  GraduationCap,
  Brain,
  Target,
  CheckSquare,
  FileQuestion,
  Edit,
  ListChecks,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getRecordValue } from '@/lib/safe-record'

export interface SubjectIconConfig {
  icon: LucideIcon
  color: string
  description: string
}

/**
 * Mapeo de códigos de asignatura a iconos contextuales
 */
export const SUBJECT_ICONS: Record<string, SubjectIconConfig> = {
  // Matemáticas - PAES específicos
  M1: {
    icon: FunctionSquare,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'Matemática M1 - Álgebra y funciones',
  },
  M2: {
    icon: Divide,
    color: 'text-indigo-600 dark:text-indigo-400',
    description: 'Matemática M2 - Geometría y probabilidades',
  },
  MAT: {
    icon: Calculator,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'Matemáticas - Cálculos y fórmulas',
  },
  'MAT-1': {
    icon: FunctionSquare,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'Matemática M1 - Álgebra y funciones',
  },
  'MAT-2': {
    icon: Divide,
    color: 'text-indigo-600 dark:text-indigo-400',
    description: 'Matemática M2 - Geometría y probabilidades',
  },

  // Lenguaje - PAES específico
  LECTORA: {
    icon: BookMarked,
    color: 'text-green-600 dark:text-green-400',
    description: 'Competencia Lectora - Comprensión y análisis de textos',
  },
  LEN: {
    icon: BookOpen,
    color: 'text-green-600 dark:text-green-400',
    description: 'Lenguaje y Comunicación - Lectura y escritura',
  },
  'LEN-1': {
    icon: BookMarked,
    color: 'text-green-600 dark:text-green-400',
    description: 'Competencia Lectora - Comprensión y análisis de textos',
  },

  // Ciencias - PAES específicos
  BIO: {
    icon: Dna,
    color: 'text-emerald-600 dark:text-emerald-400',
    description: 'Biología - Estudio de la vida y los organismos',
  },
  QUIM: {
    icon: BeakerIcon,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'Química - Reacciones y compuestos químicos',
  },
  QUI: {
    icon: BeakerIcon,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'Química - Reacciones y compuestos químicos',
  },
  FIS: {
    icon: Zap,
    color: 'text-orange-600 dark:text-orange-400',
    description: 'Física - Leyes y fenómenos naturales',
  },
  CS: {
    icon: Search,
    color: 'text-yellow-600 dark:text-yellow-400',
    description: 'Ciencias - Investigación y experimentación',
  },

  // Historia
  HIST: {
    icon: Calendar,
    color: 'text-red-600 dark:text-red-400',
    description: 'Historia y Ciencias Sociales - Eventos y procesos históricos',
  },
  'HIST-1': {
    icon: Calendar,
    color: 'text-red-600 dark:text-red-400',
    description: 'Historia y Ciencias Sociales - Eventos y procesos históricos',
  },

  // Geografía
  GEO: {
    icon: Globe,
    color: 'text-cyan-600',
    description: 'Geografía - Espacios y territorios',
  },
  'GEO-1': {
    icon: MapPin,
    color: 'text-cyan-600',
    description: 'Geografía - Espacios y territorios',
  },

  // Filosofía
  FIL: {
    icon: Brain,
    color: 'text-indigo-600 dark:text-indigo-400',
    description: 'Filosofía - Pensamiento y reflexión',
  },

  // Educación Física
  EF: {
    icon: Users,
    color: 'text-pink-600 dark:text-pink-400',
    description: 'Educación Física - Actividad y salud',
  },

  // Artes
  ART: {
    icon: PenTool,
    color: 'text-rose-600 dark:text-rose-400',
    description: 'Artes - Expresión y creatividad',
  },
}

/**
 * Iconos para tipos de preguntas
 */
export const QUESTION_TYPE_ICONS: Record<string, SubjectIconConfig> = {
  multiple_choice: {
    icon: CheckSquare,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'Opción múltiple - Selecciona una respuesta',
  },
  true_false: {
    icon: Target,
    color: 'text-green-600 dark:text-green-400',
    description: 'Verdadero/Falso - Indica si es correcto o incorrecto',
  },
  desarrollo: {
    icon: Edit,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'Desarrollo - Escribe tu respuesta',
  },
  completar: {
    icon: ListChecks,
    color: 'text-orange-600 dark:text-orange-400',
    description: 'Completar - Llena los espacios en blanco',
  },
  default: {
    icon: FileQuestion,
    color: 'text-gray-600 dark:text-gray-400',
    description: 'Pregunta',
  },
}

/**
 * Iconos para tipos de exámenes
 */
export const EXAM_TYPE_ICONS: Record<string, SubjectIconConfig> = {
  oficial: {
    icon: GraduationCap,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'Examen oficial PAES',
  },
  simulacro: {
    icon: Target,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'Simulacro - Práctica de examen',
  },
  practica: {
    icon: BookOpen,
    color: 'text-green-600 dark:text-green-400',
    description: 'Práctica - Ejercicios de estudio',
  },
  diagnostico: {
    icon: Brain,
    color: 'text-orange-600 dark:text-orange-400',
    description: 'Diagnóstico - Evaluación inicial',
  },
  default: {
    icon: FileText,
    color: 'text-gray-600 dark:text-gray-400',
    description: 'Examen',
  },
}

/**
 * Obtiene el icono para un tipo de pregunta
 */
export function getQuestionTypeIcon(tipo: string): SubjectIconConfig {
  const icon = getRecordValue(QUESTION_TYPE_ICONS, tipo) as SubjectIconConfig | undefined
  return icon || QUESTION_TYPE_ICONS.default || {
    icon: FileQuestion,
    color: 'text-gray-600 dark:text-gray-400',
    description: 'Pregunta',
  }
}

/**
 * Obtiene el icono para un tipo de examen
 */
export function getExamTypeIcon(tipo: string): SubjectIconConfig {
  const icon = getRecordValue(EXAM_TYPE_ICONS, tipo) as SubjectIconConfig | undefined
  return icon || EXAM_TYPE_ICONS.default || {
    icon: FileText,
    color: 'text-gray-600 dark:text-gray-400',
    description: 'Examen',
  }
}

/**
 * Obtiene el icono y configuración para una asignatura
 */
export function getSubjectIcon(
  codigo: string
): SubjectIconConfig | { icon: LucideIcon; color: string; description: string } {
  // Buscar coincidencia exacta
  const exact = getRecordValue(SUBJECT_ICONS, codigo) as SubjectIconConfig | undefined
  if (exact) {
    return exact
  }

  // Buscar por prefijo
  const prefix = codigo.split('-')[0]
  if (prefix) {
    const byPrefix = getRecordValue(SUBJECT_ICONS, prefix) as SubjectIconConfig | undefined
    if (byPrefix) return byPrefix
  }

  // Icono por defecto
  return {
    icon: FileText,
    color: 'text-gray-600',
    description: 'Asignatura',
  }
}

/**
 * Componente de icono de asignatura
 */
export function SubjectIcon({
  codigo,
  className,
  size = 20,
}: Readonly<{
  codigo: string
  className?: string
  size?: number
}>) {
  const config = getSubjectIcon(codigo)
  const Icon = config.icon

  return <Icon className={`${config.color} ${className || ''}`} size={size} />
}
