'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  /**
   * Ruta específica a la que volver. Si no se proporciona, usa router.back()
   */
  href?: string
  /**
   * Texto del botón. Por defecto: "Volver"
   */
  label?: string
  /**
   * Variante del botón
   */
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
  /**
   * Tamaño del botón
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /**
   * Clases CSS adicionales
   */
  className?: string
  /**
   * Si es true, muestra el icono. Por defecto: true
   */
  showIcon?: boolean
}

/**
 * Componente reutilizable para botón "Volver"
 *
 * @example
 * // Volver a la página anterior
 * <BackButton />
 *
 * // Volver a una ruta específica
 * <BackButton href="/dashboard" label="Volver al Dashboard" />
 *
 * // Con variante personalizada
 * <BackButton variant="outline" size="sm" />
 */
export function BackButton({
  href,
  label = 'Volver',
  variant = 'ghost',
  size = 'default',
  className,
  showIcon = true,
}: Readonly<BackButtonProps>) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn('flex items-center gap-2', className)}
    >
      {showIcon && <ArrowLeft className="h-4 w-4" />}
      {label}
    </Button>
  )
}
