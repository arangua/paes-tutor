'use client'

import { useEffect, useState, startTransition } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  // Inicializar como 'system' para que servidor y cliente rendericen lo mismo
  const [theme, setTheme] = useState<Theme>('system')
  // Inicializar como no montado para evitar problemas de hidratación
  const [mounted, setMounted] = useState(false)

  const applyTheme = (themeToApply: 'light' | 'dark') => {
    const root = document.documentElement
    if (themeToApply === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Cargar tema desde localStorage solo después del montaje
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system'
    
    // Usar startTransition para evitar renders en cascada
    startTransition(() => {
      setTheme(savedTheme)
      setMounted(true)
    })
  }, [])

  // Aplicar tema cuando cambia
  useEffect(() => {
    if (!mounted) return

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'system') {
      applyTheme(systemPrefersDark ? 'dark' : 'light')
    } else {
      applyTheme(theme)
    }

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, mounted])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(systemPrefersDark ? 'dark' : 'light')
    } else {
      applyTheme(newTheme)
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleThemeChange('light')}
              className={cn(theme === 'light' && 'bg-accent')}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Claro</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange('dark')}
              className={cn(theme === 'dark' && 'bg-accent')}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Oscuro</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange('system')}
              className={cn(theme === 'system' && 'bg-accent')}
            >
              <span className="mr-2 h-4 w-4 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full border-2 border-current" />
              </span>
              <span>Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Cambiar tema</p>
      </TooltipContent>
    </Tooltip>
  )
}
