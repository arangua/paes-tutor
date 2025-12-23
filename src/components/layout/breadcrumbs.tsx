'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Generar breadcrumbs automáticamente si no se proporcionan
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items

    const paths = pathname?.split('/').filter(Boolean) || []
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`

      // Mapear rutas a labels más amigables
      let label = path
      if (path === 'dashboard') label = 'Dashboard'
      else if (path === 'exams') label = 'Exámenes'
      else if (path === 'take') label = 'Realizar Examen'
      else if (path === 'results') label = 'Resultados'
      else if (path === 'attempts') label = 'Intentos'
      else if (path === 'profile') label = 'Perfil'
      else if (path === 'admin') label = 'Panel de Administración'
      else if (path === 'import-exams') label = 'Importar Exámenes'
      else if (path === 'import-answer-key') label = 'Importar Clavijero'
      else if (path === 'import-topics') label = 'Importar Temarios'
      else if (path === 'cleanup-test-data') label = 'Limpiar Datos Ficticios'
      else if (path === 'ai-tutor') label = 'Tutor IA'
      else {
        // Capitalizar primera letra y reemplazar guiones
        label = path
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      // No incluir el último item si es un ID (cuid)
      const isId = /^c[a-z0-9]{24}$/.test(path)
      if (isId && index === paths.length - 1) {
        return
      }

      breadcrumbs.push({
        label,
        href: index === paths.length - 1 ? undefined : currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={item.href || item.label} className="flex items-center space-x-2">
            {index === 0 ? (
              <Link href={item.href || '/'} className="hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4" />
                {isLast ? (
                  <span className="text-foreground font-medium">{item.label}</span>
                ) : (
                  <Link href={item.href || '#'} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}
