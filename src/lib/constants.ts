/**
 * Constantes compartidas del proyecto
 * Centraliza valores mágicos para mejorar mantenibilidad
 */

// Constantes de tiempo (en milisegundos)
export const TIME_CONSTANTS = {
  // Caché
  DEFAULT_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutos
  EXAMS_CACHE_TTL_MS: 10 * 60 * 1000, // 10 minutos
  ATTEMPTS_CACHE_TTL_MS: 1 * 60 * 1000, // 1 minuto
  STUDENT_CACHE_TTL_MS: 2 * 60 * 1000, // 2 minutos
  MATERIALS_CACHE_TTL_MS: 10 * 60 * 1000, // 10 minutos
  RECOMMENDATIONS_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutos
  ANALYTICS_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutos
  CACHE_CLEANUP_INTERVAL_MS: 10 * 60 * 1000, // 10 minutos

  // Rate limiting
  GENERAL_RATE_LIMIT_WINDOW_MS: 10 * 1000, // 10 segundos
  AUTH_RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minuto
  READ_RATE_LIMIT_WINDOW_MS: 10 * 1000, // 10 segundos
  WRITE_RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minuto
  SENSITIVE_RATE_LIMIT_WINDOW_MS: 5 * 60 * 1000, // 5 minutos
  CHALLENGE_RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000, // 1 hora
  EXPENSIVE_RATE_LIMIT_WINDOW_MS: 10 * 60 * 1000, // 10 minutos para operaciones costosas

  // Intentos
  NEW_ATTEMPT_THRESHOLD_MS: 1000, // 1 segundo

  // Auto-guardado
  AUTO_SAVE_DELAY_MS: 2000, // 2 segundos de inactividad antes de guardar

  // UI
  SUCCESS_MESSAGE_DISPLAY_MS: 3000, // 3 segundos para mostrar mensaje de éxito
  TOOLTIP_POSITION_UPDATE_DELAY_MS: 50, // 50ms para actualizar posición de tooltip
  FOCUS_DELAY_MS: 100, // 100ms para enfocar input después de abrir
  ANIMATION_DELAY_MS: 300, // 300ms para animaciones
  FOCUS_TRANSITION_MS: 100, // 100ms para transiciones de foco
} as const

// Constantes de límites
export const LIMIT_CONSTANTS = {
  MAX_OFFSET: 10000, // Máximo offset permitido para prevenir queries costosas
  MAX_STRING_LENGTH: 10000, // Longitud máxima para prevenir DoS
  MAX_RATE_LIMIT_ENTRIES: 10000, // Limitar tamaño del store de rate limiting
  MAX_MATERIALS_CONTEXT: 10, // Máximo de materiales de estudio para contexto de IA
  MAX_SEARCH_RESULTS: 200, // Máximo de resultados a buscar antes de ordenar por relevancia
  MAX_ANALYTICS_ATTEMPTS: 10000, // Máximo de intentos para análisis de comparación
  MAX_SEARCH_DESCRIPTION_LENGTH: 200, // Longitud máxima de descripción en resultados de búsqueda
  MAX_NOTE_VERSIONS: 10, // Máximo de versiones a mantener por nota
  MAX_NOTE_CONTENT_SIZE: 10 * 1024 * 1024, // 10 MB máximo por versión de nota
  MAX_NOTE_TITLE_LENGTH: 200, // Máximo de caracteres para título
  // Constantes específicas para versiones
  VERSION_DEFAULT_LIMIT: 20, // Límite por defecto de versiones
  VERSION_MAX_BULK_DELETE: 50, // Máximo de versiones que se pueden eliminar en lote
  VERSION_SQLITE_SEARCH_BUFFER: 50, // Buffer adicional para búsqueda en SQLite (filtrado en memoria)
  VERSION_MEMORY_FILTER_BUFFER: 100, // Buffer adicional para filtrado en memoria
} as const

// Constantes de rate limiting
export const RATE_LIMIT_CONSTANTS = {
  // En desarrollo, límites más permisivos
  GENERAL_COUNT_DEV: 100,
  GENERAL_COUNT_PROD: 10,
  AUTH_COUNT: 5,
  READ_COUNT_DEV: 200,
  READ_COUNT_PROD: 30,
  WRITE_COUNT: 20,
  SENSITIVE_COUNT: 3,
  CHALLENGE_COUNT: 5,
  EXPENSIVE_COUNT: 5, // Operaciones costosas como comprimir versiones
} as const

// Constantes HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Constantes de validación
export const VALIDATION_CONSTANTS = {
  MIN_RECOMMENDED_ENCRYPTION_KEY_LENGTH: 32, // Longitud mínima recomendada para AES-256
  MAX_EMAIL_LENGTH: 255,
  DEFAULT_MIN_LENGTH: 0,
  DEFAULT_MAX_LENGTH: 1000,
} as const

// Constantes de búsqueda
export const SEARCH_CONSTANTS = {
  RELEVANCE_WEIGHTS: {
    TITLE: 10,
    CONTENT: 2,
    SUBJECT: 5,
    TOPIC: 8,
    EXACT_MATCH: 20,
  },
  POSITION_WEIGHTS: {
    NEAR_START: 5, // index < 50
    MIDDLE: 3, // index < 200
    FAR: 1, // index >= 200
  },
  POSITION_THRESHOLDS: {
    NEAR_START: 50,
    MIDDLE: 200,
  },
  SUGGESTION_RELEVANCE: {
    SUBJECT_STARTS_WITH: 100,
    SUBJECT_INCLUDES: 70,
    SUBJECT_DEFAULT: 50,
    TOPIC_STARTS_WITH: 90,
    TOPIC_INCLUDES: 60,
    TOPIC_EJE_INCLUDES: 50,
    TOPIC_DEFAULT: 40,
    EXAM_STARTS_WITH: 80,
    EXAM_INCLUDES: 50,
    EXAM_DEFAULT: 30,
    EXAM_ATTEMPTED_BONUS: 20, // Bonus para exámenes que el estudiante ya intentó
  },
  SUGGESTION_LIMITS: {
    MAX_SUGGESTIONS: 8, // Top 8 sugerencias a retornar
    SUBJECTS_TAKE: 5,
    TOPICS_TAKE: 5,
    EXAMS_TAKE: 5,
  },
} as const

// Constantes de UI
export const UI_CONSTANTS = {
  TOOLTIP: {
    DEFAULT_WIDTH: 400,
    DEFAULT_HEIGHT: 350,
    PADDING: 16,
    MAX_POSITION_ATTEMPTS: 3,
    HIGHLIGHT_BORDER_WIDTH: 3,
    HIGHLIGHT_BLUR: 15,
    PULSE_ANIMATION_DURATION: '2s',
  },
} as const

// Constantes CSS Transform
export const CSS_TRANSFORM_CONSTANTS = {
  CENTER: '-50%',
  TOP: '-100%',
  BOTTOM: '0',
  LEFT: '-100%',
  RIGHT: '0',
} as const

// Constantes de exámenes
export const EXAM_CONSTANTS = {
  OPTION_LETTERS: ['A', 'B', 'C', 'D'] as const,
  REQUIRED_OPTIONS_COUNT: 4,
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 80,
} as const

// Tipos de búsqueda permitidos
export const SEARCH_TYPES = ['exams', 'materials', 'topics', 'attempts'] as const
export type SearchType = (typeof SEARCH_TYPES)[number]

// Presets de pesos de relevancia para búsqueda
export const SEARCH_WEIGHT_PRESETS = {
  EXAM: {
    title: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TITLE,
    content: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.CONTENT,
    subject: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.SUBJECT,
  },
  MATERIAL: {
    title: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TITLE,
    content: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.CONTENT,
    subject: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.SUBJECT,
    topic: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TOPIC,
  },
  TOPIC: {
    title: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TITLE,
    content: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.CONTENT,
    subject: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.SUBJECT,
    topic: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TOPIC,
  },
} as const

