'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
  storageKey?: string // Clave para persistir estado en localStorage
}

export function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
  className,
  storageKey,
}: Readonly<CollapsibleSectionProps>) {
  // Cargar estado persistido o usar defaultOpen
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined' || !storageKey) return defaultOpen
    try {
      const saved = localStorage.getItem(storageKey)
      return saved !== null ? JSON.parse(saved) : defaultOpen
    } catch {
      return defaultOpen
    }
  })

  // Persistir estado cuando cambia
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(isOpen))
      } catch {
        // Ignorar errores de localStorage (p. ej., modo privado)
      }
    }
  }, [isOpen, storageKey])

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Colapsar' : 'Expandir'}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  )
}
