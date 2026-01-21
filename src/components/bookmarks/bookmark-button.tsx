'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { trackError } from '@/lib/monitoring'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'

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
}: Readonly<BookmarkButtonProps>) {
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
        trackError(error instanceof Error ? error : new Error(String(error)), {
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

  // Helper para parsear errores de API con contexto consistente
  const parseBookmarkApiError = async (res: Response, operation: string) => {
    const { safeJsonParse } = await import('@/lib/api-helpers')
    const errorData = await safeJsonParse<{ error?: string }>(res, {
      path: typeof window !== 'undefined' ? window.location.pathname : '/bookmarks',
      operation,
    })
    return new Error(errorData.error || `Error al ${operation}`)
  }

  const deleteBookmark = async (): Promise<void> => {
    const res = await fetch(`/api/bookmarks?questionId=${questionId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw await parseBookmarkApiError(res, 'eliminar favorito')
    }

    setIsBookmarked(false)
    toast.success('Eliminado de favoritos')
  }

  const createBookmark = async (): Promise<void> => {
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    })

    if (res.ok) {
      setIsBookmarked(true)
      toast.success('Agregado a favoritos')
      return
    }

    if (res.status === 409) {
      // Ya existe, actualizar estado
      setIsBookmarked(true)
      return
    }

    throw await parseBookmarkApiError(res, 'agregar favorito')
  }

  const handleToggle = async () => {
    if (isLoading || isChecking) return

    setIsLoading(true)
    try {
      if (isBookmarked) await deleteBookmark()
      else await createBookmark()
    } catch (error) {
      const errorInfo = extractErrorInfo(error)
      const errorCode = isBookmarked ? ERROR_CODES.DATA_DELETE_FAILED : ERROR_CODES.DATA_CREATE_FAILED
      const structuredError = getErrorMessage(errorCode, {
        item: 'el favorito',
        reason: errorInfo.message,
      })

      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'bookmark_error',
        action: isBookmarked ? 'delete' : 'create',
        questionId,
      })

      toast.error(structuredError.title, {
        description: `${structuredError.description} ${structuredError.solution}`,
        duration: 6000,
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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(className, isBookmarked && 'text-yellow-500 hover:text-yellow-600')}
          onClick={handleToggle}
          disabled={isLoading}
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
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {isBookmarked ? (
            <>
              <strong>Quitar de favoritos</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                Esta pregunta ya está guardada. Haz clic para quitarla de tu lista de favoritos.
              </span>
            </>
          ) : (
            <>
              <strong>Guardar en favoritos</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                Como marcar una página en un libro. Guarda esta pregunta para repasarla más tarde.
              </span>
            </>
          )}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
