'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
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

interface UserInfo {
  nombre?: string
  email?: string
}

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await fetch('/api/student')
        if (res.ok) {
          const data = await res.json()
          setUserInfo({
            nombre: data.nombre,
            email: data.email,
          })
        }
      } catch (error) {
        // Silenciar errores de autenticación
      } finally {
        setIsLoading(false)
      }
    }

    // Solo cargar si no estamos en la página de login
    if (pathname !== '/auth/signin') {
      fetchUserInfo()
    } else {
      setIsLoading(false)
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/auth/signin',
        redirect: true,
      })
    } catch (error) {
      // En caso de error, redirigir de todas formas
      router.push('/auth/signin')
    }
  }

  const isAuthenticated = !!userInfo
  const isHomePage = pathname === '/'
  const isAuthPage = pathname?.startsWith('/auth')

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

  // Atajo de teclado para búsqueda (Cmd/Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PAES Tutor</span>
            </Link>
            {/* Botón de búsqueda */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Buscar...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Button
                  key={link.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  asChild
                  className="gap-2"
                >
                  <Link href={link.href}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              )
            })}
          </nav>

          {/* Usuario y acciones */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <>
                {/* Desktop: Dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">
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
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
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
              <Button asChild variant="default">
                <Link href="/auth/signin">Iniciar Sesión</Link>
              </Button>
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
