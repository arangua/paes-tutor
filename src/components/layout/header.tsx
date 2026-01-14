'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Home,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  BarChart3,
  Settings,
  Bot,
  Search,
  HelpCircle,
  Trash2,
} from 'lucide-react'
import { GlobalSearch } from '@/components/search/global-search'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { OnlineIndicator } from '@/components/ui/online-indicator'
import { TrashDialog } from '@/components/trash/trash-dialog'
import { GlobalUndoRedoToolbar } from '@/components/ui/undo-redo-global-toolbar'
import { NotificationsDropdown } from '@/components/notifications/notifications-dropdown'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface UserInfo {
  nombre?: string
  email?: string
}

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isTrashOpen, setIsTrashOpen] = useState(false)

  useEffect(() => {
    async function fetchUserInfo() {
      // Solo intentar obtener información si hay una sesión activa
      if (status === 'unauthenticated') {
        setIsLoading(false)
        return
      }

      // Si el status es 'loading', esperar a que se resuelva
      if (status === 'loading') {
        return
      }

      // Si hay sesión autenticada, obtener información del estudiante
      if (status === 'authenticated' && session) {
        // Si no hay studentId en la sesión, usar información de la sesión directamente
        if (!session.user?.studentId) {
          setUserInfo({
            nombre: session.user?.name || undefined,
            email: session.user?.email || undefined,
          })
          setIsLoading(false)
          return
        }

        // Intentar obtener información del estudiante o usuario
        try {
          const res = await fetch('/api/student', {
            credentials: 'include', // Incluir cookies de sesión
          })
          if (res.ok) {
            const data = await res.json()
            // El endpoint ahora siempre retorna información útil (estudiante o usuario)
            setUserInfo({
              nombre: data.nombre || session.user?.name || undefined,
              email: data.email || session.user?.email || undefined,
            })
          } else if (res.status === 401) {
            // Solo 401 significa que no hay sesión - usar información de la sesión como fallback
            if (session.user) {
              setUserInfo({
                nombre: session.user.name || undefined,
                email: session.user.email || undefined,
              })
            }
          }
        } catch {
          // Silenciar errores de red, usar información de la sesión como fallback
          if (session.user) {
            setUserInfo({
              nombre: session.user.name || undefined,
              email: session.user.email || undefined,
            })
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    // Solo cargar si no estamos en la página de login
    if (pathname !== '/auth/signin') {
      fetchUserInfo()
    } else {
      setIsLoading(false)
    }
  }, [pathname, status, session])

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/auth/signin',
        redirect: true,
      })
    } catch {
      // En caso de error, redirigir de todas formas
      router.push('/auth/signin')
    }
  }

  const isAuthenticated = !!userInfo
  const isAuthPage = pathname?.startsWith('/auth')

  // Atajo de teclado para búsqueda (Cmd/Ctrl+K)
  // IMPORTANTE: Los hooks deben ejecutarse antes de cualquier return condicional
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsSearchOpen])

  // No mostrar header en página de login
  if (isAuthPage) {
    return null
  }

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/exams', label: 'Exámenes', icon: BookOpen },
    { href: '/materials', label: 'Materiales', icon: FileText },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/ai-tutor', label: 'Tutor IA', icon: Bot },
    { href: '/help', label: 'Ayuda', icon: HelpCircle },
  ]

  return (
    <>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <TrashDialog open={isTrashOpen} onOpenChange={setIsTrashOpen} />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 gap-2 min-w-0">
          {/* Logo y título */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="text-xl font-bold hidden sm:inline whitespace-nowrap">
                PAES Tutor
              </span>
            </Link>
            {/* Botón de búsqueda */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground flex-shrink-0 whitespace-nowrap"
            >
              <Search className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm hidden lg:inline">Buscar...</span>
              <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 flex-shrink-0">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Navegación Desktop */}
          <nav
            id="navigation"
            role="navigation"
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-0.5 flex-shrink-0 min-w-0 overflow-hidden"
          >
            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      asChild
                      size="sm"
                      className="gap-1.5 px-2 text-xs"
                    >
                      <Link href={link.href}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="hidden xl:inline">{link.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>

          {/* Usuario y acciones */}
          <div className="flex items-center gap-0.5 min-w-0 flex-shrink-0">
            {/* Toolbar de Undo/Redo - visible solo en pantallas grandes */}
            {isAuthenticated && (
              <div className="hidden xl:flex flex-shrink-0">
                <GlobalUndoRedoToolbar />
              </div>
            )}
            {/* Indicador de conexión - visible solo en pantallas grandes */}
            {isAuthenticated && (
              <div className="hidden xl:block flex-shrink-0">
                <OnlineIndicator />
              </div>
            )}
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
            ) : isAuthenticated ? (
              <>
                {/* Toggle de tema - siempre visible */}
                <ThemeToggle />
                {/* Notificaciones */}
                <NotificationsDropdown />
                {/* Desktop: Dropdown menu - solo icono en pantallas medianas, con nombre en pantallas grandes */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hidden md:flex lg:size-auto lg:px-2 lg:gap-1.5 lg:max-w-[120px]"
                        >
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate text-xs max-w-[80px] hidden lg:inline">
                            {userInfo?.nombre || userInfo?.email || 'Usuario'}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {userInfo?.nombre || 'Usuario'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {userInfo?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/exams" className="flex items-center gap-2 cursor-pointer">
                            <FileText className="h-4 w-4" />
                            Exámenes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                            <User className="h-4 w-4" />
                            Mi Perfil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsTrashOpen(true)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          Papelera
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Administración</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                            <Settings className="h-4 w-4" />
                            Panel de Administración
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar Sesión
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{userInfo?.nombre || userInfo?.email || 'Mi cuenta'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Mobile: Menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button asChild variant="default">
                  <Link href="/auth/signin">Iniciar Sesión</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t bg-background">
            <nav className="container px-4 py-4 space-y-2">
              {navLinks.map(link => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Button
                    key={link.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    asChild
                    className="w-full justify-start gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={link.href}>
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </Button>
                )
              })}
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
