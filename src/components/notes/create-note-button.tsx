'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'
import { NoteDialog } from './note-dialog'

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
}: CreateNoteButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        title="Crear nota"
        aria-label="Crear nota de estudio"
      >
        <FileText className="h-4 w-4 mr-2" />
        Nota
      </Button>
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
