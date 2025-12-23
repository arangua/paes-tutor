'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { captureError } from '@/lib/monitoring'

interface BookmarkButtonProps {
  questionId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

export function BookmarkButton({
  questionId,
  className,
  size = 'sm',
  variant = 'ghost',
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkBookmark() {
      try {
        const res = await fetch(`/api/bookmarks/check?questionIds=${questionId}`)
        if (res.ok) {
          const data = await res.json()
          interface BookmarkedItem {
            questionId: string
            isBookmarked: boolean
          }
          const item = (data.bookmarked as BookmarkedItem[] | undefined)?.find(
            b => b.questionId === questionId
          )
          setIsBookmarked(item?.isBookmarked || false)
        }
      } catch (error) {
        captureError(error instanceof Error ? error : new Error(String(error)), {
          type: 'bookmark_check_error',
          questionId,
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        })
      } finally {
        setIsChecking(false)
      }
    }
    checkBookmark()
  }, [questionId])

  const handleToggle = async () => {
    if (isLoading || isChecking) return

    setIsLoading(true)
    try {
      if (isBookmarked) {
        // Eliminar favorito
        const res = await fetch(`/api/bookmarks?questionId=${questionId}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          setIsBookmarked(false)
          toast.success('Eliminado de favoritos')
        } else {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Error al eliminar favorito')
        }
      } else {
        // Agregar favorito
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId }),
        })

        if (res.ok) {
          setIsBookmarked(true)
          toast.success('Agregado a favoritos')
        } else {
          const errorData = await res.json().catch(() => ({}))
          if (res.status === 409) {
            // Ya existe, actualizar estado
            setIsBookmarked(true)
          } else {
            throw new Error(errorData.error || 'Error al agregar favorito')
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error('Error', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <Button variant={variant} size={size} className={cn(className)} disabled>
        <Star className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className, isBookmarked && 'text-yellow-500 hover:text-yellow-600')}
      onClick={handleToggle}
      disabled={isLoading}
      title={isBookmarked ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      aria-label={isBookmarked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isBookmarked}
    >
      <Star
        className={cn(
          'h-4 w-4 transition-all',
          isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''
        )}
      />
    </Button>
  )
}
