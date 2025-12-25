'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useKeyboardShortcuts, globalShortcuts } from '@/hooks/useKeyboardShortcuts'
import { KeyboardShortcutsDialog } from '@/components/ui/keyboard-shortcuts-dialog'

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Atajos globales
  const shortcuts = [
    ...globalShortcuts(router),
    {
      key: '?',
      description: 'Mostrar/ocultar atajos de teclado',
      action: () => setShowShortcuts(prev => !prev),
      category: 'ayuda',
    },
  ]

  // Registrar atajos globales
  useKeyboardShortcuts(shortcuts)

  return (
    <>
      {children}
      <KeyboardShortcutsDialog
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
        shortcuts={shortcuts}
      />
    </>
  )
}
