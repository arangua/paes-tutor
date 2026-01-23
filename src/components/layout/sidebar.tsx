'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Home,
  BarChart3,
  PlayCircle,
  Star,
  Cards,
  StickyNote,
  RotateCcw,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

const sidebarItems: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
  },
  {
    href: '/exams',
    label: 'Exámenes',
    icon: BookOpen,
  },
  {
    href: '/practice',
    label: 'Práctica',
    icon: PlayCircle,
  },
  {
    href: '/bookmarks',
    label: 'Favoritos',
    icon: Star,
  },
  {
    href: '/flashcards',
    label: 'Flashcards',
    icon: Cards,
  },
  {
    href: '/notes',
    label: 'Notas',
    icon: StickyNote,
  },
  {
    href: '/review/quick',
    label: 'Repaso Rápido',
    icon: RotateCcw,
  },
  {
    href: '/schedule',
    label: 'Calendario',
    icon: Calendar,
  },
  {
    href: '/',
    label: 'Inicio',
    icon: Home,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: Readonly<SidebarProps>) {
  const pathname = usePathname()

  return (
    <aside className={cn('hidden lg:flex flex-col w-64 border-r bg-background', className)}>
      <div className="flex flex-col gap-1 p-4">
        {sidebarItems.map(item => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              asChild
              className={cn('w-full justify-start gap-3', isActive && 'bg-secondary')}
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
