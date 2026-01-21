'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { NoteDialog } from './note-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface CreateNoteButtonProps {
  questionId?: string
  topicId?: string
  defaultTitle?: string
  defaultContent?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function CreateNoteButton({
  questionId,
  topicId,
  defaultTitle = '',
  defaultContent = '',
  variant = 'ghost',
  size = 'sm',
}: Readonly<CreateNoteButtonProps>) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={() => setOpen(true)}
            aria-label="Crear nota de estudio"
          >
            <FileText className="h-4 w-4 mr-2" />
            Nota
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Crear nota de estudio</strong>
            <br />
            <span className="text-muted-foreground text-xs">
              Como los post-its en tus libros. Guarda trucos, fórmulas o conceptos clave para
              repasar después.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
      <NoteDialog
        open={open}
        onOpenChange={setOpen}
        questionId={questionId}
        topicId={topicId}
        defaultTitle={defaultTitle}
        defaultContent={defaultContent}
      />
    </>
  )
}
