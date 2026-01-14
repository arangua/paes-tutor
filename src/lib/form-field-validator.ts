/**
 * Enterprise Form Field Validator
 * 
 * Sistema de validación enterprise para garantizar que todos los campos de formulario
 * tengan atributos id o name para accesibilidad y autocompletado del navegador.
 * 
 * Este módulo proporciona:
 * - Validación en tiempo de desarrollo
 * - Utilidades para garantizar id/name en componentes
 * - Hooks para validación automática
 */

import * as React from 'react'

/**
 * Genera un id único para campos de formulario
 * Solo debe usarse dentro de componentes React (usa useId internamente)
 * 
 * @param prefix - prefijo para el id
 * @returns id único
 */
function generateUniqueId(prefix: string): string {
  // Esta función solo debe llamarse desde useFormFieldAttributes
  // que es un hook y puede usar useId
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Genera un id o name garantizado para campos de formulario
 * 
 * NOTA: Esta función NO puede usar hooks. Use useFormFieldAttributes en su lugar
 * para componentes React que necesiten ids únicos.
 * 
 * @param providedId - id proporcionado explícitamente
 * @param providedName - name proporcionado explícitamente
 * @param fallbackPrefix - prefijo para id automático (opcional)
 * @returns Objeto con id y name garantizados
 */
export function ensureFormFieldAttributes(
  providedId?: string,
  providedName?: string,
  fallbackPrefix = 'form-field'
): { id: string; name: string } {
  // Prioridad: id proporcionado > name como id > id generado con prefijo
  const finalId = providedId || (providedName || generateUniqueId(fallbackPrefix))
  
  // name debe estar presente: name proporcionado > id como name
  const finalName = providedName || finalId
  
  return {
    id: finalId,
    name: finalName,
  }
}

/**
 * Hook para garantizar atributos id/name en componentes de formulario
 * 
 * @param providedId - id proporcionado
 * @param providedName - name proporcionado
 * @param fallbackPrefix - prefijo para id automático
 * @returns Objeto con id y name garantizados
 * 
 * @example
 * ```tsx
 * function MyInput({ id, name, ...props }) {
 *   const { id: finalId, name: finalName } = useFormFieldAttributes(id, name, 'my-input')
 *   return <input id={finalId} name={finalName} {...props} />
 * }
 * ```
 */
export function useFormFieldAttributes(
  providedId?: string,
  providedName?: string,
  fallbackPrefix = 'form-field'
): { id: string; name: string } {
  const autoId = React.useId()
  
  return React.useMemo(() => {
    // Prioridad: id proporcionado > name como id > id automático con prefijo
    const finalId = providedId || (providedName || `${fallbackPrefix}-${autoId}`)
    
    // name debe estar presente: name proporcionado > id como name
    const finalName = providedName || finalId
    
    return {
      id: finalId,
      name: finalName,
    }
  }, [providedId, providedName, fallbackPrefix, autoId])
}

/**
 * Valida que un elemento tenga id o name (solo en desarrollo)
 * 
 * @param element - Elemento HTML a validar
 * @param componentName - Nombre del componente para mensajes de error
 * @returns true si es válido, false si no
 */
export function validateFormField(
  element: HTMLElement | null,
  componentName = 'FormField'
): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true // No validar en producción
  }
  
  if (!element) {
    return true // Elemento no existe aún
  }
  
  const hasId = element.hasAttribute('id') && element.getAttribute('id')?.trim()
  const hasName = element.hasAttribute('name') && element.getAttribute('name')?.trim()
  
  if (!hasId && !hasName) {
    console.warn(
      `[${componentName}] Campo de formulario sin atributos id o name:`,
      element,
      '\nEsto puede prevenir el autocompletado del navegador. Agrega un id o name al campo.'
    )
    return false
  }
  
  return true
}

/**
 * Hook para validar campos de formulario en tiempo de desarrollo
 * 
 * @param ref - Ref del elemento
 * @param componentName - Nombre del componente
 */
export function useFormFieldValidation(
  ref: React.RefObject<HTMLElement>,
  componentName = 'FormField'
): void {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }
    
    if (ref.current) {
      validateFormField(ref.current, componentName)
    }
  }, [ref, componentName])
}

/**
 * Type guard para verificar si un componente tiene props de formulario
 */
export function hasFormFieldProps(props: Record<string, unknown>): boolean {
  return 'id' in props || 'name' in props
}
