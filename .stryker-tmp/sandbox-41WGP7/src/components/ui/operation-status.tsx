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
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, Database, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
export type OperationStatus = 'idle' | 'processing' | 'saving' | 'saved' | 'syncing' | 'synced' | 'error' | 'offline';
interface OperationStatusProps {
  status: OperationStatus;
  message?: string;
  detail?: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}
const statusConfig: Record<OperationStatus, {
  icon: typeof Loader2;
  label: string;
  color: string;
  bgColor: string;
}> = stryMutAct_9fa48("20729") ? {} : (stryCov_9fa48("20729"), {
  idle: stryMutAct_9fa48("20730") ? {} : (stryCov_9fa48("20730"), {
    icon: Clock,
    label: stryMutAct_9fa48("20731") ? "" : (stryCov_9fa48("20731"), 'Listo'),
    color: stryMutAct_9fa48("20732") ? "" : (stryCov_9fa48("20732"), 'text-muted-foreground'),
    bgColor: stryMutAct_9fa48("20733") ? "" : (stryCov_9fa48("20733"), 'bg-muted')
  }),
  processing: stryMutAct_9fa48("20734") ? {} : (stryCov_9fa48("20734"), {
    icon: Loader2,
    label: stryMutAct_9fa48("20735") ? "" : (stryCov_9fa48("20735"), 'Procesando'),
    color: stryMutAct_9fa48("20736") ? "" : (stryCov_9fa48("20736"), 'text-blue-600 dark:text-blue-400'),
    bgColor: stryMutAct_9fa48("20737") ? "" : (stryCov_9fa48("20737"), 'bg-blue-50 dark:bg-blue-950')
  }),
  saving: stryMutAct_9fa48("20738") ? {} : (stryCov_9fa48("20738"), {
    icon: Loader2,
    label: stryMutAct_9fa48("20739") ? "" : (stryCov_9fa48("20739"), 'Guardando'),
    color: stryMutAct_9fa48("20740") ? "" : (stryCov_9fa48("20740"), 'text-blue-600 dark:text-blue-400'),
    bgColor: stryMutAct_9fa48("20741") ? "" : (stryCov_9fa48("20741"), 'bg-blue-50 dark:bg-blue-950')
  }),
  saved: stryMutAct_9fa48("20742") ? {} : (stryCov_9fa48("20742"), {
    icon: CheckCircle2,
    label: stryMutAct_9fa48("20743") ? "" : (stryCov_9fa48("20743"), 'Guardado'),
    color: stryMutAct_9fa48("20744") ? "" : (stryCov_9fa48("20744"), 'text-green-600 dark:text-green-400'),
    bgColor: stryMutAct_9fa48("20745") ? "" : (stryCov_9fa48("20745"), 'bg-green-50 dark:bg-green-950')
  }),
  syncing: stryMutAct_9fa48("20746") ? {} : (stryCov_9fa48("20746"), {
    icon: RefreshCw,
    label: stryMutAct_9fa48("20747") ? "" : (stryCov_9fa48("20747"), 'Sincronizando'),
    color: stryMutAct_9fa48("20748") ? "" : (stryCov_9fa48("20748"), 'text-purple-600 dark:text-purple-400'),
    bgColor: stryMutAct_9fa48("20749") ? "" : (stryCov_9fa48("20749"), 'bg-purple-50 dark:bg-purple-950')
  }),
  synced: stryMutAct_9fa48("20750") ? {} : (stryCov_9fa48("20750"), {
    icon: Cloud,
    label: stryMutAct_9fa48("20751") ? "" : (stryCov_9fa48("20751"), 'Sincronizado'),
    color: stryMutAct_9fa48("20752") ? "" : (stryCov_9fa48("20752"), 'text-green-600 dark:text-green-400'),
    bgColor: stryMutAct_9fa48("20753") ? "" : (stryCov_9fa48("20753"), 'bg-green-50 dark:bg-green-950')
  }),
  error: stryMutAct_9fa48("20754") ? {} : (stryCov_9fa48("20754"), {
    icon: XCircle,
    label: stryMutAct_9fa48("20755") ? "" : (stryCov_9fa48("20755"), 'Error'),
    color: stryMutAct_9fa48("20756") ? "" : (stryCov_9fa48("20756"), 'text-destructive'),
    bgColor: stryMutAct_9fa48("20757") ? "" : (stryCov_9fa48("20757"), 'bg-destructive/10')
  }),
  offline: stryMutAct_9fa48("20758") ? {} : (stryCov_9fa48("20758"), {
    icon: CloudOff,
    label: stryMutAct_9fa48("20759") ? "" : (stryCov_9fa48("20759"), 'Sin conexión'),
    color: stryMutAct_9fa48("20760") ? "" : (stryCov_9fa48("20760"), 'text-orange-600 dark:text-orange-400'),
    bgColor: stryMutAct_9fa48("20761") ? "" : (stryCov_9fa48("20761"), 'bg-orange-50 dark:bg-orange-950')
  })
});
export function OperationStatus({
  status,
  message,
  detail,
  className,
  showIcon = stryMutAct_9fa48("20762") ? false : (stryCov_9fa48("20762"), true),
  variant = stryMutAct_9fa48("20763") ? "" : (stryCov_9fa48("20763"), 'default')
}: OperationStatusProps) {
  if (stryMutAct_9fa48("20764")) {
    {}
  } else {
    stryCov_9fa48("20764");
    const config = statusConfig[status];
    const Icon = config.icon;
    const isAnimated = stryMutAct_9fa48("20767") ? (status === 'processing' || status === 'saving') && status === 'syncing' : stryMutAct_9fa48("20766") ? false : stryMutAct_9fa48("20765") ? true : (stryCov_9fa48("20765", "20766", "20767"), (stryMutAct_9fa48("20769") ? status === 'processing' && status === 'saving' : stryMutAct_9fa48("20768") ? false : (stryCov_9fa48("20768", "20769"), (stryMutAct_9fa48("20771") ? status !== 'processing' : stryMutAct_9fa48("20770") ? false : (stryCov_9fa48("20770", "20771"), status === (stryMutAct_9fa48("20772") ? "" : (stryCov_9fa48("20772"), 'processing')))) || (stryMutAct_9fa48("20774") ? status !== 'saving' : stryMutAct_9fa48("20773") ? false : (stryCov_9fa48("20773", "20774"), status === (stryMutAct_9fa48("20775") ? "" : (stryCov_9fa48("20775"), 'saving')))))) || (stryMutAct_9fa48("20777") ? status !== 'syncing' : stryMutAct_9fa48("20776") ? false : (stryCov_9fa48("20776", "20777"), status === (stryMutAct_9fa48("20778") ? "" : (stryCov_9fa48("20778"), 'syncing')))));
    if (stryMutAct_9fa48("20781") ? variant !== 'minimal' : stryMutAct_9fa48("20780") ? false : stryMutAct_9fa48("20779") ? true : (stryCov_9fa48("20779", "20780", "20781"), variant === (stryMutAct_9fa48("20782") ? "" : (stryCov_9fa48("20782"), 'minimal')))) {
      if (stryMutAct_9fa48("20783")) {
        {}
      } else {
        stryCov_9fa48("20783");
        return <span className={cn(stryMutAct_9fa48("20784") ? "" : (stryCov_9fa48("20784"), 'flex items-center gap-1.5 text-xs'), config.color, className)} role="status" aria-live="polite" aria-atomic="true">
        {stryMutAct_9fa48("20787") ? showIcon || <Icon className={cn('h-3 w-3', isAnimated && 'animate-spin')} aria-hidden="true" /> : stryMutAct_9fa48("20786") ? false : stryMutAct_9fa48("20785") ? true : (stryCov_9fa48("20785", "20786", "20787"), showIcon && <Icon className={cn(stryMutAct_9fa48("20788") ? "" : (stryCov_9fa48("20788"), 'h-3 w-3'), stryMutAct_9fa48("20791") ? isAnimated || 'animate-spin' : stryMutAct_9fa48("20790") ? false : stryMutAct_9fa48("20789") ? true : (stryCov_9fa48("20789", "20790", "20791"), isAnimated && (stryMutAct_9fa48("20792") ? "" : (stryCov_9fa48("20792"), 'animate-spin'))))} aria-hidden="true" />)}
        <span>{stryMutAct_9fa48("20795") ? message && config.label : stryMutAct_9fa48("20794") ? false : stryMutAct_9fa48("20793") ? true : (stryCov_9fa48("20793", "20794", "20795"), message || config.label)}</span>
      </span>;
      }
    }
    if (stryMutAct_9fa48("20798") ? variant !== 'compact' : stryMutAct_9fa48("20797") ? false : stryMutAct_9fa48("20796") ? true : (stryCov_9fa48("20796", "20797", "20798"), variant === (stryMutAct_9fa48("20799") ? "" : (stryCov_9fa48("20799"), 'compact')))) {
      if (stryMutAct_9fa48("20800")) {
        {}
      } else {
        stryCov_9fa48("20800");
        return <Badge variant="outline" className={cn(stryMutAct_9fa48("20801") ? "" : (stryCov_9fa48("20801"), 'flex items-center gap-1.5 text-xs'), config.bgColor, config.color, className)}>
        {stryMutAct_9fa48("20804") ? showIcon || <Icon className={cn('h-3 w-3', isAnimated && 'animate-spin')} /> : stryMutAct_9fa48("20803") ? false : stryMutAct_9fa48("20802") ? true : (stryCov_9fa48("20802", "20803", "20804"), showIcon && <Icon className={cn(stryMutAct_9fa48("20805") ? "" : (stryCov_9fa48("20805"), 'h-3 w-3'), stryMutAct_9fa48("20808") ? isAnimated || 'animate-spin' : stryMutAct_9fa48("20807") ? false : stryMutAct_9fa48("20806") ? true : (stryCov_9fa48("20806", "20807", "20808"), isAnimated && (stryMutAct_9fa48("20809") ? "" : (stryCov_9fa48("20809"), 'animate-spin'))))} />)}
        <span>{stryMutAct_9fa48("20812") ? message && config.label : stryMutAct_9fa48("20811") ? false : stryMutAct_9fa48("20810") ? true : (stryCov_9fa48("20810", "20811", "20812"), message || config.label)}</span>
        {stryMutAct_9fa48("20815") ? detail || <span className="text-muted-foreground">• {detail}</span> : stryMutAct_9fa48("20814") ? false : stryMutAct_9fa48("20813") ? true : (stryCov_9fa48("20813", "20814", "20815"), detail && <span className="text-muted-foreground">• {detail}</span>)}
      </Badge>;
      }
    }
    return <div className={cn(stryMutAct_9fa48("20816") ? "" : (stryCov_9fa48("20816"), 'flex items-center gap-2'), className)} role="status" aria-live="polite" aria-atomic="true">
      {stryMutAct_9fa48("20819") ? showIcon || <Icon className={cn('h-4 w-4', config.color, isAnimated && 'animate-spin')} aria-hidden="true" /> : stryMutAct_9fa48("20818") ? false : stryMutAct_9fa48("20817") ? true : (stryCov_9fa48("20817", "20818", "20819"), showIcon && <Icon className={cn(stryMutAct_9fa48("20820") ? "" : (stryCov_9fa48("20820"), 'h-4 w-4'), config.color, stryMutAct_9fa48("20823") ? isAnimated || 'animate-spin' : stryMutAct_9fa48("20822") ? false : stryMutAct_9fa48("20821") ? true : (stryCov_9fa48("20821", "20822", "20823"), isAnimated && (stryMutAct_9fa48("20824") ? "" : (stryCov_9fa48("20824"), 'animate-spin'))))} aria-hidden="true" />)}
      <div className="flex flex-col">
        <span className={cn(stryMutAct_9fa48("20825") ? "" : (stryCov_9fa48("20825"), 'text-sm font-medium'), config.color)}>
          {stryMutAct_9fa48("20828") ? message && config.label : stryMutAct_9fa48("20827") ? false : stryMutAct_9fa48("20826") ? true : (stryCov_9fa48("20826", "20827", "20828"), message || config.label)}
        </span>
        {stryMutAct_9fa48("20831") ? detail || <span className="text-xs text-muted-foreground">{detail}</span> : stryMutAct_9fa48("20830") ? false : stryMutAct_9fa48("20829") ? true : (stryCov_9fa48("20829", "20830", "20831"), detail && <span className="text-xs text-muted-foreground">{detail}</span>)}
      </div>
    </div>;
  }
}

/**
 * Hook para manejar estados de operaciones con mensajes específicos
 */
export function useOperationStatus() {
  if (stryMutAct_9fa48("20832")) {
    {}
  } else {
    stryCov_9fa48("20832");
    const getStatusMessage = (operation: string, current?: number, total?: number, itemName?: string): string => {
      if (stryMutAct_9fa48("20833")) {
        {}
      } else {
        stryCov_9fa48("20833");
        if (stryMutAct_9fa48("20836") ? current !== undefined || total !== undefined : stryMutAct_9fa48("20835") ? false : stryMutAct_9fa48("20834") ? true : (stryCov_9fa48("20834", "20835", "20836"), (stryMutAct_9fa48("20838") ? current === undefined : stryMutAct_9fa48("20837") ? true : (stryCov_9fa48("20837", "20838"), current !== undefined)) && (stryMutAct_9fa48("20840") ? total === undefined : stryMutAct_9fa48("20839") ? true : (stryCov_9fa48("20839", "20840"), total !== undefined)))) {
          if (stryMutAct_9fa48("20841")) {
            {}
          } else {
            stryCov_9fa48("20841");
            return stryMutAct_9fa48("20842") ? `` : (stryCov_9fa48("20842"), `${operation} ${stryMutAct_9fa48("20845") ? itemName && 'elemento' : stryMutAct_9fa48("20844") ? false : stryMutAct_9fa48("20843") ? true : (stryCov_9fa48("20843", "20844", "20845"), itemName || (stryMutAct_9fa48("20846") ? "" : (stryCov_9fa48("20846"), 'elemento')))} ${current} de ${total}...`);
          }
        }
        return stryMutAct_9fa48("20847") ? `` : (stryCov_9fa48("20847"), `${operation}...`);
      }
    };
    return stryMutAct_9fa48("20848") ? {} : (stryCov_9fa48("20848"), {
      getStatusMessage
    });
  }
}