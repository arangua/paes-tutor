/**
 * Form Field Components
 * 
 * Componentes wrapper que exigen `name` obligatorio para uso con FormData.
 * 
 * Uso:
 * ```tsx
 * import { FieldInput, FieldTextarea } from '@/components/forms'
 * 
 * <FieldInput name="email" type="email" /> // ✅ name obligatorio
 * <FieldTextarea name="message" /> // ✅ name obligatorio
 * ```
 */

export { FieldInput } from './FieldInput'
export { FieldTextarea } from './FieldTextarea'
