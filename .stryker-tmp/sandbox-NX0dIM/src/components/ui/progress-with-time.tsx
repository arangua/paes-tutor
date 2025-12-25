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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
interface ProgressWithTimeProps {
  value: number;
  current: number;
  total: number;
  estimatedTimeRemaining?: number; // en segundos
  label?: string;
  className?: string;
}
export function ProgressWithTime({
  value,
  current,
  total,
  estimatedTimeRemaining,
  label,
  className
}: ProgressWithTimeProps) {
  if (stryMutAct_9fa48("21025")) {
    {}
  } else {
    stryCov_9fa48("21025");
    const formatTime = (seconds: number) => {
      if (stryMutAct_9fa48("21026")) {
        {}
      } else {
        stryCov_9fa48("21026");
        if (stryMutAct_9fa48("21030") ? seconds >= 60 : stryMutAct_9fa48("21029") ? seconds <= 60 : stryMutAct_9fa48("21028") ? false : stryMutAct_9fa48("21027") ? true : (stryCov_9fa48("21027", "21028", "21029", "21030"), seconds < 60)) return stryMutAct_9fa48("21031") ? `` : (stryCov_9fa48("21031"), `${seconds}s`);
        const mins = Math.floor(stryMutAct_9fa48("21032") ? seconds * 60 : (stryCov_9fa48("21032"), seconds / 60));
        const secs = stryMutAct_9fa48("21033") ? seconds * 60 : (stryCov_9fa48("21033"), seconds % 60);
        return stryMutAct_9fa48("21034") ? `` : (stryCov_9fa48("21034"), `${mins}m ${secs}s`);
      }
    };
    return <div className={cn(stryMutAct_9fa48("21035") ? "" : (stryCov_9fa48("21035"), 'space-y-2'), className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {stryMutAct_9fa48("21038") ? label && 'Progreso' : stryMutAct_9fa48("21037") ? false : stryMutAct_9fa48("21036") ? true : (stryCov_9fa48("21036", "21037", "21038"), label || (stryMutAct_9fa48("21039") ? "" : (stryCov_9fa48("21039"), 'Progreso')))} {current} de {total}
        </span>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <Progress value={value} className="h-2" />
      {stryMutAct_9fa48("21042") ? estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 || <div className="text-xs text-muted-foreground text-right">
          Tiempo estimado: {formatTime(estimatedTimeRemaining)} restantes
        </div> : stryMutAct_9fa48("21041") ? false : stryMutAct_9fa48("21040") ? true : (stryCov_9fa48("21040", "21041", "21042"), (stryMutAct_9fa48("21044") ? estimatedTimeRemaining !== undefined || estimatedTimeRemaining > 0 : stryMutAct_9fa48("21043") ? true : (stryCov_9fa48("21043", "21044"), (stryMutAct_9fa48("21046") ? estimatedTimeRemaining === undefined : stryMutAct_9fa48("21045") ? true : (stryCov_9fa48("21045", "21046"), estimatedTimeRemaining !== undefined)) && (stryMutAct_9fa48("21049") ? estimatedTimeRemaining <= 0 : stryMutAct_9fa48("21048") ? estimatedTimeRemaining >= 0 : stryMutAct_9fa48("21047") ? true : (stryCov_9fa48("21047", "21048", "21049"), estimatedTimeRemaining > 0)))) && <div className="text-xs text-muted-foreground text-right">
          Tiempo estimado: {formatTime(estimatedTimeRemaining)} restantes
        </div>)}
    </div>;
  }
}