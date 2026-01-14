/**
 * Sistema de Mensajes de Error Estructurado
 * Basado en mejores prácticas de UX mundial (Google, Apple, Microsoft)
 */

export interface ErrorMessage {
  code: string
  title: string
  description: string
  solution: string
  action?: {
    label: string
    onClick?: () => void
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'validation' | 'network' | 'permission' | 'data' | 'system'
}

export const ERROR_CODES = {
  // Validación
  VALIDATION_REQUIRED: 'VAL-001',
  VALIDATION_INVALID_FORMAT: 'VAL-002',
  VALIDATION_TOO_LONG: 'VAL-003',
  VALIDATION_TOO_SHORT: 'VAL-004',
  VALIDATION_DUPLICATE: 'VAL-005',

  // Red
  NETWORK_TIMEOUT: 'NET-001',
  NETWORK_OFFLINE: 'NET-002',
  NETWORK_SERVER_ERROR: 'NET-003',

  // Permisos
  PERMISSION_DENIED: 'PERM-001',
  PERMISSION_UNAUTHORIZED: 'PERM-002',

  // Datos
  DATA_NOT_FOUND: 'DATA-001',
  DATA_EXPORT_FAILED: 'DATA-002',
  DATA_IMPORT_FAILED: 'DATA-003',
  DATA_TOO_LARGE: 'DATA-004',
  DATA_SAVE_FAILED: 'DATA-005',
  DATA_CREATE_FAILED: 'DATA-006',
  DATA_UPDATE_FAILED: 'DATA-007',
  DATA_DELETE_FAILED: 'DATA-008',

  // Sistema
  SYSTEM_UNKNOWN: 'SYS-001',
  SYSTEM_LOAD_FAILED: 'SYS-002',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

/**
 * Genera un mensaje de error estructurado basado en el código
 */
export function getErrorMessage(
  code: ErrorCode | string,
  context?: Record<string, unknown>
): ErrorMessage {
  const errorMap: Record<string, Omit<ErrorMessage, 'code'>> = {
    // Validación
    [ERROR_CODES.VALIDATION_REQUIRED]: {
      title: 'Campo requerido',
      description: 'Este campo es obligatorio para continuar.',
      solution: 'Por favor, completa todos los campos marcados como requeridos.',
      severity: 'medium',
      category: 'validation',
    },
    [ERROR_CODES.VALIDATION_INVALID_FORMAT]: {
      title: 'Formato inválido',
      description: `El formato ingresado no es válido. ${context?.expected ? `Formato esperado: ${context.expected}` : ''}`,
      solution: 'Verifica que el formato sea correcto e intenta nuevamente.',
      severity: 'medium',
      category: 'validation',
    },
    [ERROR_CODES.VALIDATION_TOO_LONG]: {
      title: 'Texto demasiado largo',
      description: `El texto excede el límite máximo de ${context?.maxLength || 'caracteres'}.`,
      solution: `Reduce el texto a ${context?.maxLength || 'menos caracteres'} o menos.`,
      severity: 'low',
      category: 'validation',
    },
    [ERROR_CODES.VALIDATION_DUPLICATE]: {
      title: 'Elemento duplicado',
      description: 'Este elemento ya existe en el sistema.',
      solution: 'Verifica que no estés intentando agregar un elemento duplicado.',
      severity: 'medium',
      category: 'validation',
    },

    // Red
    [ERROR_CODES.NETWORK_TIMEOUT]: {
      title: 'Tiempo de espera agotado',
      description: 'La solicitud tardó demasiado en responder.',
      solution:
        'Verifica tu conexión a internet y vuelve a intentar. Si el problema persiste, el servidor puede estar sobrecargado.',
      severity: 'high',
      category: 'network',
      action: {
        label: 'Reintentar',
      },
    },
    [ERROR_CODES.NETWORK_OFFLINE]: {
      title: 'Sin conexión a internet',
      description: 'No se pudo conectar al servidor. Verifica tu conexión.',
      solution:
        'Asegúrate de estar conectado a internet y vuelve a intentar. Tu progreso se guardará automáticamente cuando se restablezca la conexión.',
      severity: 'critical',
      category: 'network',
      action: {
        label: 'Reintentar',
      },
    },
    [ERROR_CODES.NETWORK_SERVER_ERROR]: {
      title: 'Error del servidor',
      description: 'El servidor encontró un error al procesar tu solicitud.',
      solution:
        'El problema es temporal. Por favor, intenta nuevamente en unos momentos. Si el problema persiste, contacta al soporte.',
      severity: 'high',
      category: 'network',
      action: {
        label: 'Reintentar',
      },
    },

    // Permisos
    [ERROR_CODES.PERMISSION_DENIED]: {
      title: 'Permiso denegado',
      description: 'No tienes permisos para realizar esta acción.',
      solution: 'Contacta a un administrador si crees que deberías tener acceso a esta función.',
      severity: 'high',
      category: 'permission',
    },
    [ERROR_CODES.PERMISSION_UNAUTHORIZED]: {
      title: 'Sesión expirada',
      description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      solution: 'Serás redirigido a la página de inicio de sesión.',
      severity: 'high',
      category: 'permission',
      action: {
        label: 'Iniciar sesión',
      },
    },

    // Datos
    [ERROR_CODES.DATA_NOT_FOUND]: {
      title: 'Datos no encontrados',
      description: context?.item
        ? `No se encontró ${context.item}.`
        : 'Los datos solicitados no están disponibles.',
      solution: typeof context?.suggestion === 'string' ? context.suggestion : 'Verifica que los datos existan o intenta más tarde.',
      severity: 'medium',
      category: 'data',
    },
    [ERROR_CODES.DATA_EXPORT_FAILED]: {
      title: 'Error al exportar',
      description: context?.reason
        ? `No se pudo exportar: ${context.reason}`
        : 'Ocurrió un error al exportar los datos.',
      solution: context?.fileSize
        ? `El archivo es demasiado grande (${context.fileSize}). Intenta exportar menos datos o usa un formato diferente.`
        : 'Intenta exportar nuevamente. Si el problema persiste, verifica que tengas espacio suficiente en tu dispositivo.',
      severity: 'medium',
      category: 'data',
      action: {
        label: 'Intentar de nuevo',
      },
    },
    [ERROR_CODES.DATA_IMPORT_FAILED]: {
      title: 'Error al importar',
      description: context?.reason
        ? `No se pudo importar: ${context.reason}`
        : 'Ocurrió un error al importar los datos.',
      solution:
        'Verifica que el archivo tenga el formato correcto y que no esté corrupto. Revisa la documentación para ver los formatos soportados.',
      severity: 'high',
      category: 'data',
    },
    [ERROR_CODES.DATA_TOO_LARGE]: {
      title: 'Archivo demasiado grande',
      description: `El archivo excede el tamaño máximo permitido (${context?.maxSize || 'límite'}).`,
      solution: `Reduce el tamaño del archivo a ${context?.maxSize || 'menos'} o divide los datos en múltiples archivos.`,
      severity: 'medium',
      category: 'data',
    },
    [ERROR_CODES.DATA_SAVE_FAILED]: {
      title: 'Error al guardar',
      description: context?.item
        ? `No se pudo guardar ${context.item}.`
        : context?.reason
          ? `Error al guardar: ${context.reason}`
          : 'Ocurrió un error al guardar los datos.',
      solution:
        'Verifica tu conexión a internet e intenta nuevamente. Si el problema persiste, los datos pueden estar corruptos o el servidor puede estar sobrecargado.',
      severity: 'high',
      category: 'data',
      action: {
        label: 'Reintentar',
      },
    },
    [ERROR_CODES.DATA_CREATE_FAILED]: {
      title: 'Error al crear',
      description: context?.item
        ? `No se pudo crear ${context.item}.`
        : context?.reason
          ? `Error al crear: ${context.reason}`
          : 'Ocurrió un error al crear el elemento.',
      solution:
        'Verifica que todos los campos requeridos estén completos y que no haya duplicados. Intenta nuevamente o contacta al soporte si el problema persiste.',
      severity: 'high',
      category: 'data',
      action: {
        label: 'Reintentar',
      },
    },
    [ERROR_CODES.DATA_UPDATE_FAILED]: {
      title: 'Error al actualizar',
      description: context?.item
        ? `No se pudo actualizar ${context.item}.`
        : context?.reason
          ? `Error al actualizar: ${context.reason}`
          : 'Ocurrió un error al actualizar los datos.',
      solution:
        'Verifica que los datos sean válidos y que tengas permisos para actualizar. Intenta nuevamente o contacta al soporte si el problema persiste.',
      severity: 'high',
      category: 'data',
      action: {
        label: 'Reintentar',
      },
    },
    [ERROR_CODES.DATA_DELETE_FAILED]: {
      title: 'Error al eliminar',
      description: context?.item
        ? `No se pudo eliminar ${context.item}.`
        : context?.reason
          ? `Error al eliminar: ${context.reason}`
          : 'Ocurrió un error al eliminar el elemento.',
      solution:
        'Verifica que tengas permisos para eliminar y que el elemento no esté en uso. Intenta nuevamente o contacta al soporte si el problema persiste.',
      severity: 'high',
      category: 'data',
      action: {
        label: 'Reintentar',
      },
    },

    // Sistema
    [ERROR_CODES.SYSTEM_UNKNOWN]: {
      title: 'Error inesperado',
      description: 'Ocurrió un error inesperado. Nuestro equipo ha sido notificado.',
      solution:
        'Por favor, intenta nuevamente. Si el problema persiste, contacta al soporte con el código de error.',
      severity: 'high',
      category: 'system',
      action: {
        label: 'Reintentar',
      },
    },
    [ERROR_CODES.SYSTEM_LOAD_FAILED]: {
      title: 'Error al cargar',
      description: 'No se pudieron cargar los datos necesarios.',
      solution:
        'Verifica tu conexión a internet y recarga la página. Si el problema persiste, contacta al soporte.',
      severity: 'high',
      category: 'system',
      action: {
        label: 'Recargar página',
      },
    },
  }

  const error = errorMap[code]

  if (error) {
    return {
      code,
      ...error,
    }
  }

  // Error desconocido
  return {
    code: ERROR_CODES.SYSTEM_UNKNOWN,
    title: 'Error desconocido',
    description: typeof context?.message === 'string' ? context.message : 'Ocurrió un error inesperado.',
    solution: 'Por favor, intenta nuevamente o contacta al soporte si el problema persiste.',
    severity: 'high',
    category: 'system',
    action: {
      label: 'Reintentar',
    },
  }
}

/**
 * Extrae información de error de una respuesta o excepción
 */
export function extractErrorInfo(error: unknown): {
  code: ErrorCode | string
  message: string
  context?: Record<string, unknown>
} {
  if (error instanceof Error) {
    // Intentar extraer código de error del mensaje
    const errorMessage = error.message || 'Error desconocido'
    const codeMatch = errorMessage.match(/\[([A-Z]+-\d+)\]/)
    if (codeMatch) {
      const cleanedMessage = errorMessage.replace(/\[([A-Z]+-\d+)\]\s*/, '')
      return {
        code: codeMatch[1],
        message: cleanedMessage || 'Error desconocido',
      }
    }

    return {
      code: ERROR_CODES.SYSTEM_UNKNOWN,
      message: errorMessage,
    }
  }

  if (typeof error === 'string') {
    return {
      code: ERROR_CODES.SYSTEM_UNKNOWN,
      message: error,
    }
  }

  return {
    code: ERROR_CODES.SYSTEM_UNKNOWN,
    message: 'Error desconocido',
  }
}
