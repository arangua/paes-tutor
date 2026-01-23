// @ts-nocheck
'use client';

function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, User, LogOut, Menu, X, FileText, BarChart3, Settings, Bot, Search, HelpCircle, Trash2 } from 'lucide-react';
import { GlobalSearch } from '@/components/search/global-search';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { TrashDialog } from '@/components/trash/trash-dialog';
import { GlobalUndoRedoToolbar } from '@/components/ui/undo-redo-global-toolbar';
interface UserInfo {
  nombre?: string;
  email?: string;
}
export function Header() {
  if (stryMutAct_9fa48("17749")) {
    {}
  } else {
    stryCov_9fa48("17749");
    const router = useRouter();
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("17750") ? false : (stryCov_9fa48("17750"), true));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(stryMutAct_9fa48("17751") ? true : (stryCov_9fa48("17751"), false));
    const [isSearchOpen, setIsSearchOpen] = useState(stryMutAct_9fa48("17752") ? true : (stryCov_9fa48("17752"), false));
    const [isTrashOpen, setIsTrashOpen] = useState(stryMutAct_9fa48("17753") ? true : (stryCov_9fa48("17753"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("17754")) {
        {}
      } else {
        stryCov_9fa48("17754");
        async function fetchUserInfo() {
          if (stryMutAct_9fa48("17755")) {
            {}
          } else {
            stryCov_9fa48("17755");
            try {
              if (stryMutAct_9fa48("17756")) {
                {}
              } else {
                stryCov_9fa48("17756");
                const res = await fetch(stryMutAct_9fa48("17757") ? "" : (stryCov_9fa48("17757"), '/api/student'));
                if (stryMutAct_9fa48("17759") ? false : stryMutAct_9fa48("17758") ? true : (stryCov_9fa48("17758", "17759"), res.ok)) {
                  if (stryMutAct_9fa48("17760")) {
                    {}
                  } else {
                    stryCov_9fa48("17760");
                    const data = await res.json();
                    setUserInfo(stryMutAct_9fa48("17761") ? {} : (stryCov_9fa48("17761"), {
                      nombre: data.nombre,
                      email: data.email
                    }));
                  }
                }
              }
            } catch {
              // Silenciar errores de autenticación
            } finally {
              if (stryMutAct_9fa48("17762")) {
                {}
              } else {
                stryCov_9fa48("17762");
                setIsLoading(stryMutAct_9fa48("17763") ? true : (stryCov_9fa48("17763"), false));
              }
            }
          }
        }

        // Solo cargar si no estamos en la página de login
        if (stryMutAct_9fa48("17766") ? pathname === '/auth/signin' : stryMutAct_9fa48("17765") ? false : stryMutAct_9fa48("17764") ? true : (stryCov_9fa48("17764", "17765", "17766"), pathname !== (stryMutAct_9fa48("17767") ? "" : (stryCov_9fa48("17767"), '/auth/signin')))) {
          if (stryMutAct_9fa48("17768")) {
            {}
          } else {
            stryCov_9fa48("17768");
            fetchUserInfo();
          }
        } else {
          if (stryMutAct_9fa48("17769")) {
            {}
          } else {
            stryCov_9fa48("17769");
            setIsLoading(stryMutAct_9fa48("17770") ? true : (stryCov_9fa48("17770"), false));
          }
        }
      }
    }, stryMutAct_9fa48("17771") ? [] : (stryCov_9fa48("17771"), [pathname]));
    const handleLogout = async () => {
      if (stryMutAct_9fa48("17772")) {
        {}
      } else {
        stryCov_9fa48("17772");
        try {
          if (stryMutAct_9fa48("17773")) {
            {}
          } else {
            stryCov_9fa48("17773");
            await signOut(stryMutAct_9fa48("17774") ? {} : (stryCov_9fa48("17774"), {
              callbackUrl: stryMutAct_9fa48("17775") ? "" : (stryCov_9fa48("17775"), '/auth/signin'),
              redirect: stryMutAct_9fa48("17776") ? false : (stryCov_9fa48("17776"), true)
            }));
          }
        } catch {
          if (stryMutAct_9fa48("17777")) {
            {}
          } else {
            stryCov_9fa48("17777");
            // En caso de error, redirigir de todas formas
            router.push(stryMutAct_9fa48("17778") ? "" : (stryCov_9fa48("17778"), '/auth/signin'));
          }
        }
      }
    };
    const isAuthenticated = stryMutAct_9fa48("17779") ? !userInfo : (stryCov_9fa48("17779"), !(stryMutAct_9fa48("17780") ? userInfo : (stryCov_9fa48("17780"), !userInfo)));
    const isAuthPage = stryMutAct_9fa48("17782") ? pathname.startsWith('/auth') : stryMutAct_9fa48("17781") ? pathname?.endsWith('/auth') : (stryCov_9fa48("17781", "17782"), pathname?.startsWith(stryMutAct_9fa48("17783") ? "" : (stryCov_9fa48("17783"), '/auth')));

    // No mostrar header en página de login
    if (stryMutAct_9fa48("17785") ? false : stryMutAct_9fa48("17784") ? true : (stryCov_9fa48("17784", "17785"), isAuthPage)) {
      if (stryMutAct_9fa48("17786")) {
        {}
      } else {
        stryCov_9fa48("17786");
        return null;
      }
    }
    const navLinks = stryMutAct_9fa48("17787") ? [] : (stryCov_9fa48("17787"), [stryMutAct_9fa48("17788") ? {} : (stryCov_9fa48("17788"), {
      href: stryMutAct_9fa48("17789") ? "" : (stryCov_9fa48("17789"), '/'),
      label: stryMutAct_9fa48("17790") ? "" : (stryCov_9fa48("17790"), 'Inicio'),
      icon: Home
    }), stryMutAct_9fa48("17791") ? {} : (stryCov_9fa48("17791"), {
      href: stryMutAct_9fa48("17792") ? "" : (stryCov_9fa48("17792"), '/exams'),
      label: stryMutAct_9fa48("17793") ? "" : (stryCov_9fa48("17793"), 'Exámenes'),
      icon: BookOpen
    }), stryMutAct_9fa48("17794") ? {} : (stryCov_9fa48("17794"), {
      href: stryMutAct_9fa48("17795") ? "" : (stryCov_9fa48("17795"), '/materials'),
      label: stryMutAct_9fa48("17796") ? "" : (stryCov_9fa48("17796"), 'Materiales'),
      icon: FileText
    }), stryMutAct_9fa48("17797") ? {} : (stryCov_9fa48("17797"), {
      href: stryMutAct_9fa48("17798") ? "" : (stryCov_9fa48("17798"), '/dashboard'),
      label: stryMutAct_9fa48("17799") ? "" : (stryCov_9fa48("17799"), 'Dashboard'),
      icon: BarChart3
    }), stryMutAct_9fa48("17800") ? {} : (stryCov_9fa48("17800"), {
      href: stryMutAct_9fa48("17801") ? "" : (stryCov_9fa48("17801"), '/ai-tutor'),
      label: stryMutAct_9fa48("17802") ? "" : (stryCov_9fa48("17802"), 'Tutor IA'),
      icon: Bot
    }), stryMutAct_9fa48("17803") ? {} : (stryCov_9fa48("17803"), {
      href: stryMutAct_9fa48("17804") ? "" : (stryCov_9fa48("17804"), '/help'),
      label: stryMutAct_9fa48("17805") ? "" : (stryCov_9fa48("17805"), 'Ayuda'),
      icon: HelpCircle
    })]);

    // Atajo de teclado para búsqueda (Cmd/Ctrl+K)
    useEffect(() => {
      if (stryMutAct_9fa48("17806")) {
        {}
      } else {
        stryCov_9fa48("17806");
        if (stryMutAct_9fa48("17809") ? typeof window !== 'undefined' : stryMutAct_9fa48("17808") ? false : stryMutAct_9fa48("17807") ? true : (stryCov_9fa48("17807", "17808", "17809"), typeof window === (stryMutAct_9fa48("17810") ? "" : (stryCov_9fa48("17810"), 'undefined')))) return;
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
          if (stryMutAct_9fa48("17811")) {
            {}
          } else {
            stryCov_9fa48("17811");
            if (stryMutAct_9fa48("17814") ? e.metaKey || e.ctrlKey || e.key === 'k' : stryMutAct_9fa48("17813") ? false : stryMutAct_9fa48("17812") ? true : (stryCov_9fa48("17812", "17813", "17814"), (stryMutAct_9fa48("17816") ? e.metaKey && e.ctrlKey : stryMutAct_9fa48("17815") ? true : (stryCov_9fa48("17815", "17816"), e.metaKey || e.ctrlKey)) && (stryMutAct_9fa48("17818") ? e.key !== 'k' : stryMutAct_9fa48("17817") ? true : (stryCov_9fa48("17817", "17818"), e.key === (stryMutAct_9fa48("17819") ? "" : (stryCov_9fa48("17819"), 'k')))))) {
              if (stryMutAct_9fa48("17820")) {
                {}
              } else {
                stryCov_9fa48("17820");
                e.preventDefault();
                setIsSearchOpen(stryMutAct_9fa48("17821") ? false : (stryCov_9fa48("17821"), true));
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("17822") ? "" : (stryCov_9fa48("17822"), 'keydown'), handleKeyDown);
        return stryMutAct_9fa48("17823") ? () => undefined : (stryCov_9fa48("17823"), () => window.removeEventListener(stryMutAct_9fa48("17824") ? "" : (stryCov_9fa48("17824"), 'keydown'), handleKeyDown));
      }
    }, stryMutAct_9fa48("17825") ? [] : (stryCov_9fa48("17825"), [setIsSearchOpen]));
    return <>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <TrashDialog open={isTrashOpen} onOpenChange={setIsTrashOpen} />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PAES Tutor</span>
            </Link>
            {/* Botón de búsqueda */}
            <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("17826") ? () => undefined : (stryCov_9fa48("17826"), () => setIsSearchOpen(stryMutAct_9fa48("17827") ? false : (stryCov_9fa48("17827"), true)))} className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground">
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
              if (stryMutAct_9fa48("17828")) {
                {}
              } else {
                stryCov_9fa48("17828");
                const Icon = link.icon;
                const isActive = stryMutAct_9fa48("17831") ? pathname !== link.href : stryMutAct_9fa48("17830") ? false : stryMutAct_9fa48("17829") ? true : (stryCov_9fa48("17829", "17830", "17831"), pathname === link.href);
                return <Button key={link.href} variant={isActive ? stryMutAct_9fa48("17832") ? "" : (stryCov_9fa48("17832"), 'secondary') : stryMutAct_9fa48("17833") ? "" : (stryCov_9fa48("17833"), 'ghost')} asChild className="gap-2">
                  <Link href={link.href}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>;
              }
            })}
          </nav>

          {/* Usuario y acciones */}
          <div className="flex items-center gap-2">
            {/* Toolbar de Undo/Redo - visible solo cuando está autenticado */}
            {stryMutAct_9fa48("17836") ? isAuthenticated || <div className="hidden md:flex">
                <GlobalUndoRedoToolbar />
              </div> : stryMutAct_9fa48("17835") ? false : stryMutAct_9fa48("17834") ? true : (stryCov_9fa48("17834", "17835", "17836"), isAuthenticated && <div className="hidden md:flex">
                <GlobalUndoRedoToolbar />
              </div>)}
            {/* Indicador de conexión - visible solo cuando está autenticado */}
            {stryMutAct_9fa48("17839") ? isAuthenticated || <div className="hidden md:block">
                <OnlineIndicator />
              </div> : stryMutAct_9fa48("17838") ? false : stryMutAct_9fa48("17837") ? true : (stryCov_9fa48("17837", "17838", "17839"), isAuthenticated && <div className="hidden md:block">
                <OnlineIndicator />
              </div>)}
            {isLoading ? <div className="h-8 w-8 rounded-full bg-muted animate-pulse" /> : isAuthenticated ? <>
                {/* Desktop: Dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">
                        {stryMutAct_9fa48("17842") ? (userInfo?.nombre || userInfo?.email) && 'Usuario' : stryMutAct_9fa48("17841") ? false : stryMutAct_9fa48("17840") ? true : (stryCov_9fa48("17840", "17841", "17842"), (stryMutAct_9fa48("17844") ? userInfo?.nombre && userInfo?.email : stryMutAct_9fa48("17843") ? false : (stryCov_9fa48("17843", "17844"), (stryMutAct_9fa48("17845") ? userInfo.nombre : (stryCov_9fa48("17845"), userInfo?.nombre)) || (stryMutAct_9fa48("17846") ? userInfo.email : (stryCov_9fa48("17846"), userInfo?.email)))) || (stryMutAct_9fa48("17847") ? "" : (stryCov_9fa48("17847"), 'Usuario')))}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {stryMutAct_9fa48("17850") ? userInfo?.nombre && 'Usuario' : stryMutAct_9fa48("17849") ? false : stryMutAct_9fa48("17848") ? true : (stryCov_9fa48("17848", "17849", "17850"), (stryMutAct_9fa48("17851") ? userInfo.nombre : (stryCov_9fa48("17851"), userInfo?.nombre)) || (stryMutAct_9fa48("17852") ? "" : (stryCov_9fa48("17852"), 'Usuario')))}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {stryMutAct_9fa48("17853") ? userInfo.email : (stryCov_9fa48("17853"), userInfo?.email)}
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
                    <DropdownMenuItem onClick={stryMutAct_9fa48("17854") ? () => undefined : (stryCov_9fa48("17854"), () => setIsTrashOpen(stryMutAct_9fa48("17855") ? false : (stryCov_9fa48("17855"), true)))} className="flex items-center gap-2 cursor-pointer">
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
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile: Menu button */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={stryMutAct_9fa48("17856") ? () => undefined : (stryCov_9fa48("17856"), () => setIsMobileMenuOpen(stryMutAct_9fa48("17857") ? isMobileMenuOpen : (stryCov_9fa48("17857"), !isMobileMenuOpen)))}>
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </> : <Button asChild variant="default">
                <Link href="/auth/signin">Iniciar Sesión</Link>
              </Button>}
          </div>
        </div>

        {/* Mobile Menu */}
        {stryMutAct_9fa48("17860") ? isMobileMenuOpen && isAuthenticated || <div className="md:hidden border-t bg-background">
            <nav className="container px-4 py-4 space-y-2">
              {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return <Button key={link.href} variant={isActive ? 'secondary' : 'ghost'} asChild className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href={link.href}>
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </Button>;
            })}
              <div className="pt-2 border-t">
                <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </nav>
          </div> : stryMutAct_9fa48("17859") ? false : stryMutAct_9fa48("17858") ? true : (stryCov_9fa48("17858", "17859", "17860"), (stryMutAct_9fa48("17862") ? isMobileMenuOpen || isAuthenticated : stryMutAct_9fa48("17861") ? true : (stryCov_9fa48("17861", "17862"), isMobileMenuOpen && isAuthenticated)) && <div className="md:hidden border-t bg-background">
            <nav className="container px-4 py-4 space-y-2">
              {navLinks.map(link => {
              if (stryMutAct_9fa48("17863")) {
                {}
              } else {
                stryCov_9fa48("17863");
                const Icon = link.icon;
                const isActive = stryMutAct_9fa48("17866") ? pathname !== link.href : stryMutAct_9fa48("17865") ? false : stryMutAct_9fa48("17864") ? true : (stryCov_9fa48("17864", "17865", "17866"), pathname === link.href);
                return <Button key={link.href} variant={isActive ? stryMutAct_9fa48("17867") ? "" : (stryCov_9fa48("17867"), 'secondary') : stryMutAct_9fa48("17868") ? "" : (stryCov_9fa48("17868"), 'ghost')} asChild className="w-full justify-start gap-2" onClick={stryMutAct_9fa48("17869") ? () => undefined : (stryCov_9fa48("17869"), () => setIsMobileMenuOpen(stryMutAct_9fa48("17870") ? true : (stryCov_9fa48("17870"), false)))}>
                    <Link href={link.href}>
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </Button>;
              }
            })}
              <div className="pt-2 border-t">
                <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </nav>
          </div>)}
      </header>
    </>;
  }
}