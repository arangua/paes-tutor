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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, BarChart3, Target, TrendingUp, Award, RotateCcw, Users, Share2, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  variant?: 'default' | 'outline' | 'secondary';
}
const defaultActions: QuickAction[] = stryMutAct_9fa48("17027") ? [] : (stryCov_9fa48("17027"), [stryMutAct_9fa48("17028") ? {} : (stryCov_9fa48("17028"), {
  title: stryMutAct_9fa48("17029") ? "" : (stryCov_9fa48("17029"), 'Ver Exámenes'),
  description: stryMutAct_9fa48("17030") ? "" : (stryCov_9fa48("17030"), 'Explora todos los exámenes disponibles'),
  href: stryMutAct_9fa48("17031") ? "" : (stryCov_9fa48("17031"), '/exams'),
  icon: BookOpen,
  variant: stryMutAct_9fa48("17032") ? "" : (stryCov_9fa48("17032"), 'default')
}), stryMutAct_9fa48("17033") ? {} : (stryCov_9fa48("17033"), {
  title: stryMutAct_9fa48("17034") ? "" : (stryCov_9fa48("17034"), 'Realizar Examen'),
  description: stryMutAct_9fa48("17035") ? "" : (stryCov_9fa48("17035"), 'Comienza un nuevo examen de práctica'),
  href: stryMutAct_9fa48("17036") ? "" : (stryCov_9fa48("17036"), '/exams'),
  icon: FileText,
  variant: stryMutAct_9fa48("17037") ? "" : (stryCov_9fa48("17037"), 'outline')
}), stryMutAct_9fa48("17038") ? {} : (stryCov_9fa48("17038"), {
  title: stryMutAct_9fa48("17039") ? "" : (stryCov_9fa48("17039"), 'Ver Estadísticas'),
  description: stryMutAct_9fa48("17040") ? "" : (stryCov_9fa48("17040"), 'Analiza tu rendimiento detallado'),
  href: stryMutAct_9fa48("17041") ? "" : (stryCov_9fa48("17041"), '/dashboard'),
  icon: BarChart3,
  variant: stryMutAct_9fa48("17042") ? "" : (stryCov_9fa48("17042"), 'outline')
}), stryMutAct_9fa48("17043") ? {} : (stryCov_9fa48("17043"), {
  title: stryMutAct_9fa48("17044") ? "" : (stryCov_9fa48("17044"), 'Analytics Avanzado'),
  description: stryMutAct_9fa48("17045") ? "" : (stryCov_9fa48("17045"), 'Estadísticas y predicciones avanzadas'),
  href: stryMutAct_9fa48("17046") ? "" : (stryCov_9fa48("17046"), '/analytics'),
  icon: TrendingUp,
  variant: stryMutAct_9fa48("17047") ? "" : (stryCov_9fa48("17047"), 'outline')
}), stryMutAct_9fa48("17048") ? {} : (stryCov_9fa48("17048"), {
  title: stryMutAct_9fa48("17049") ? "" : (stryCov_9fa48("17049"), 'Repaso Rápido'),
  description: stryMutAct_9fa48("17050") ? "" : (stryCov_9fa48("17050"), 'Repasa preguntas falladas (5-10 preguntas)'),
  href: stryMutAct_9fa48("17051") ? "" : (stryCov_9fa48("17051"), '/review/quick'),
  icon: RotateCcw,
  variant: stryMutAct_9fa48("17052") ? "" : (stryCov_9fa48("17052"), 'default')
}), stryMutAct_9fa48("17053") ? {} : (stryCov_9fa48("17053"), {
  title: stryMutAct_9fa48("17054") ? "" : (stryCov_9fa48("17054"), 'Comparación Directa'),
  description: stryMutAct_9fa48("17055") ? "" : (stryCov_9fa48("17055"), 'Compara tu progreso con el otro estudiante'),
  href: stryMutAct_9fa48("17056") ? "" : (stryCov_9fa48("17056"), '/comparison'),
  icon: Users,
  variant: stryMutAct_9fa48("17057") ? "" : (stryCov_9fa48("17057"), 'default')
}), stryMutAct_9fa48("17058") ? {} : (stryCov_9fa48("17058"), {
  title: stryMutAct_9fa48("17059") ? "" : (stryCov_9fa48("17059"), 'Exámenes Compartidos'),
  description: stryMutAct_9fa48("17060") ? "" : (stryCov_9fa48("17060"), 'Ver exámenes compartidos contigo'),
  href: stryMutAct_9fa48("17061") ? "" : (stryCov_9fa48("17061"), '/shared-exams'),
  icon: Share2,
  variant: stryMutAct_9fa48("17062") ? "" : (stryCov_9fa48("17062"), 'outline')
}), stryMutAct_9fa48("17063") ? {} : (stryCov_9fa48("17063"), {
  title: stryMutAct_9fa48("17064") ? "" : (stryCov_9fa48("17064"), 'Materiales Compartidos'),
  description: stryMutAct_9fa48("17065") ? "" : (stryCov_9fa48("17065"), 'Ver materiales compartidos contigo'),
  href: stryMutAct_9fa48("17066") ? "" : (stryCov_9fa48("17066"), '/shared-materials'),
  icon: FileText,
  variant: stryMutAct_9fa48("17067") ? "" : (stryCov_9fa48("17067"), 'outline')
}), stryMutAct_9fa48("17068") ? {} : (stryCov_9fa48("17068"), {
  title: stryMutAct_9fa48("17069") ? "" : (stryCov_9fa48("17069"), 'Desafíos'),
  description: stryMutAct_9fa48("17070") ? "" : (stryCov_9fa48("17070"), 'Desafía al otro estudiante y compite'),
  href: stryMutAct_9fa48("17071") ? "" : (stryCov_9fa48("17071"), '/challenges'),
  icon: Trophy,
  variant: stryMutAct_9fa48("17072") ? "" : (stryCov_9fa48("17072"), 'default')
})]);
interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  description?: string;
}
export function QuickActions({
  actions = defaultActions,
  title = stryMutAct_9fa48("17073") ? "" : (stryCov_9fa48("17073"), 'Accesos Rápidos'),
  description = stryMutAct_9fa48("17074") ? "" : (stryCov_9fa48("17074"), 'Acciones comunes para continuar tu preparación')
}: QuickActionsProps) {
  if (stryMutAct_9fa48("17075")) {
    {}
  } else {
    stryCov_9fa48("17075");
    return <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            if (stryMutAct_9fa48("17076")) {
              {}
            } else {
              stryCov_9fa48("17076");
              const Icon = action.icon;
              return <Button key={stryMutAct_9fa48("17077") ? `` : (stryCov_9fa48("17077"), `${action.title}-${index}`)} variant={stryMutAct_9fa48("17080") ? action.variant && 'outline' : stryMutAct_9fa48("17079") ? false : stryMutAct_9fa48("17078") ? true : (stryCov_9fa48("17078", "17079", "17080"), action.variant || (stryMutAct_9fa48("17081") ? "" : (stryCov_9fa48("17081"), 'outline')))} asChild className="h-auto flex-col items-start justify-start p-4 gap-2">
                <Link href={action.href}>
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Link>
              </Button>;
            }
          })}
        </div>
      </CardContent>
    </Card>;
  }
}