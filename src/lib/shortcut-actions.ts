'use client'

import { useRouter } from 'next/navigation'
import type { ShortcutAction } from '@/hooks/useCustomizableShortcuts'

/**
 * Acciones disponibles para atajos de teclado
 * Basado en estándares de VS Code, GitHub, Linear
 */
export function getAvailableShortcutActions(
  router: ReturnType<typeof useRouter>
): ShortcutAction[] {
  return [
    // Navegación
    {
      id: 'nav-dashboard',
      name: 'Ir al Dashboard',
      description: 'Navega rápidamente al dashboard principal',
      handler: () => router.push('/dashboard'),
      category: 'Navegación',
    },
    {
      id: 'nav-exams',
      name: 'Ir a Exámenes',
      description: 'Abre la página de exámenes disponibles',
      handler: () => router.push('/exams'),
      category: 'Navegación',
    },
    {
      id: 'nav-profile',
      name: 'Ir a Perfil',
      description: 'Abre tu página de perfil',
      handler: () => router.push('/profile'),
      category: 'Navegación',
    },
    {
      id: 'nav-materials',
      name: 'Ir a Materiales',
      description: 'Abre la página de materiales de estudio',
      handler: () => router.push('/materials'),
      category: 'Navegación',
    },
    {
      id: 'nav-ai-tutor',
      name: 'Ir a Tutor IA',
      description: 'Abre el tutor de inteligencia artificial',
      handler: () => router.push('/ai-tutor'),
      category: 'Navegación',
    },
    {
      id: 'nav-notes',
      name: 'Ir a Notas',
      description: 'Abre tus notas de estudio',
      handler: () => router.push('/notes'),
      category: 'Navegación',
    },
    {
      id: 'nav-flashcards',
      name: 'Ir a Flashcards',
      description: 'Abre tus tarjetas de estudio',
      handler: () => router.push('/flashcards'),
      category: 'Navegación',
    },
    {
      id: 'nav-help',
      name: 'Ir a Ayuda',
      description: 'Abre la página de ayuda',
      handler: () => router.push('/help'),
      category: 'Navegación',
    },

    // Acciones globales
    {
      id: 'action-search',
      name: 'Buscar',
      description: 'Abre la búsqueda global (Cmd/Ctrl+K)',
      handler: () => {
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true,
        })
        document.dispatchEvent(event)
      },
      category: 'Acciones',
    },
    {
      id: 'action-shortcuts',
      name: 'Ver Atajos',
      description: 'Muestra el diálogo de atajos de teclado',
      handler: () => {
        const event = new KeyboardEvent('keydown', {
          key: '?',
          shiftKey: true,
          bubbles: true,
        })
        document.dispatchEvent(event)
      },
      category: 'Acciones',
    },
  ]
}
