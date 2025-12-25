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
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Home, BarChart3, FileText, User, Settings, PlayCircle, Star, Cards, StickyNote, RotateCcw, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  badge?: string | number;
}
const sidebarItems: SidebarItem[] = stryMutAct_9fa48("17871") ? [] : (stryCov_9fa48("17871"), [stryMutAct_9fa48("17872") ? {} : (stryCov_9fa48("17872"), {
  href: stryMutAct_9fa48("17873") ? "" : (stryCov_9fa48("17873"), '/dashboard'),
  label: stryMutAct_9fa48("17874") ? "" : (stryCov_9fa48("17874"), 'Dashboard'),
  icon: BarChart3
}), stryMutAct_9fa48("17875") ? {} : (stryCov_9fa48("17875"), {
  href: stryMutAct_9fa48("17876") ? "" : (stryCov_9fa48("17876"), '/exams'),
  label: stryMutAct_9fa48("17877") ? "" : (stryCov_9fa48("17877"), 'Exámenes'),
  icon: BookOpen
}), stryMutAct_9fa48("17878") ? {} : (stryCov_9fa48("17878"), {
  href: stryMutAct_9fa48("17879") ? "" : (stryCov_9fa48("17879"), '/practice'),
  label: stryMutAct_9fa48("17880") ? "" : (stryCov_9fa48("17880"), 'Práctica'),
  icon: PlayCircle
}), stryMutAct_9fa48("17881") ? {} : (stryCov_9fa48("17881"), {
  href: stryMutAct_9fa48("17882") ? "" : (stryCov_9fa48("17882"), '/bookmarks'),
  label: stryMutAct_9fa48("17883") ? "" : (stryCov_9fa48("17883"), 'Favoritos'),
  icon: Star
}), stryMutAct_9fa48("17884") ? {} : (stryCov_9fa48("17884"), {
  href: stryMutAct_9fa48("17885") ? "" : (stryCov_9fa48("17885"), '/flashcards'),
  label: stryMutAct_9fa48("17886") ? "" : (stryCov_9fa48("17886"), 'Flashcards'),
  icon: Cards
}), stryMutAct_9fa48("17887") ? {} : (stryCov_9fa48("17887"), {
  href: stryMutAct_9fa48("17888") ? "" : (stryCov_9fa48("17888"), '/notes'),
  label: stryMutAct_9fa48("17889") ? "" : (stryCov_9fa48("17889"), 'Notas'),
  icon: StickyNote
}), stryMutAct_9fa48("17890") ? {} : (stryCov_9fa48("17890"), {
  href: stryMutAct_9fa48("17891") ? "" : (stryCov_9fa48("17891"), '/review/quick'),
  label: stryMutAct_9fa48("17892") ? "" : (stryCov_9fa48("17892"), 'Repaso Rápido'),
  icon: RotateCcw
}), stryMutAct_9fa48("17893") ? {} : (stryCov_9fa48("17893"), {
  href: stryMutAct_9fa48("17894") ? "" : (stryCov_9fa48("17894"), '/schedule'),
  label: stryMutAct_9fa48("17895") ? "" : (stryCov_9fa48("17895"), 'Calendario'),
  icon: Calendar
}), stryMutAct_9fa48("17896") ? {} : (stryCov_9fa48("17896"), {
  href: stryMutAct_9fa48("17897") ? "" : (stryCov_9fa48("17897"), '/'),
  label: stryMutAct_9fa48("17898") ? "" : (stryCov_9fa48("17898"), 'Inicio'),
  icon: Home
})]);
interface SidebarProps {
  className?: string;
}
export function Sidebar({
  className
}: SidebarProps) {
  if (stryMutAct_9fa48("17899")) {
    {}
  } else {
    stryCov_9fa48("17899");
    const pathname = usePathname();
    return <aside className={cn(stryMutAct_9fa48("17900") ? "" : (stryCov_9fa48("17900"), 'hidden lg:flex flex-col w-64 border-r bg-background'), className)}>
      <div className="flex flex-col gap-1 p-4">
        {sidebarItems.map(item => {
          if (stryMutAct_9fa48("17901")) {
            {}
          } else {
            stryCov_9fa48("17901");
            const Icon = item.icon;
            const isActive = stryMutAct_9fa48("17904") ? pathname === item.href && item.href !== '/' && pathname?.startsWith(item.href) : stryMutAct_9fa48("17903") ? false : stryMutAct_9fa48("17902") ? true : (stryCov_9fa48("17902", "17903", "17904"), (stryMutAct_9fa48("17906") ? pathname !== item.href : stryMutAct_9fa48("17905") ? false : (stryCov_9fa48("17905", "17906"), pathname === item.href)) || (stryMutAct_9fa48("17908") ? item.href !== '/' || pathname?.startsWith(item.href) : stryMutAct_9fa48("17907") ? false : (stryCov_9fa48("17907", "17908"), (stryMutAct_9fa48("17910") ? item.href === '/' : stryMutAct_9fa48("17909") ? true : (stryCov_9fa48("17909", "17910"), item.href !== (stryMutAct_9fa48("17911") ? "" : (stryCov_9fa48("17911"), '/')))) && (stryMutAct_9fa48("17913") ? pathname.startsWith(item.href) : stryMutAct_9fa48("17912") ? pathname?.endsWith(item.href) : (stryCov_9fa48("17912", "17913"), pathname?.startsWith(item.href))))));
            return <Button key={item.href} variant={isActive ? stryMutAct_9fa48("17914") ? "" : (stryCov_9fa48("17914"), 'secondary') : stryMutAct_9fa48("17915") ? "" : (stryCov_9fa48("17915"), 'ghost')} asChild className={cn(stryMutAct_9fa48("17916") ? "" : (stryCov_9fa48("17916"), 'w-full justify-start gap-3'), stryMutAct_9fa48("17919") ? isActive || 'bg-secondary' : stryMutAct_9fa48("17918") ? false : stryMutAct_9fa48("17917") ? true : (stryCov_9fa48("17917", "17918", "17919"), isActive && (stryMutAct_9fa48("17920") ? "" : (stryCov_9fa48("17920"), 'bg-secondary'))))}>
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {stryMutAct_9fa48("17923") ? item.badge || <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span> : stryMutAct_9fa48("17922") ? false : stryMutAct_9fa48("17921") ? true : (stryCov_9fa48("17921", "17922", "17923"), item.badge && <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>)}
              </Link>
            </Button>;
          }
        })}
      </div>
    </aside>;
  }
}