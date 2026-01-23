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
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
export function OnlineIndicator() {
  if (stryMutAct_9fa48("20726")) {
    {}
  } else {
    stryCov_9fa48("20726");
    const isOnline = useOnlineStatus();
    return <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={isOnline ? stryMutAct_9fa48("20727") ? "" : (stryCov_9fa48("20727"), 'default') : stryMutAct_9fa48("20728") ? "" : (stryCov_9fa48("20728"), 'destructive')} className="flex items-center gap-1.5 cursor-help">
          {isOnline ? <>
              <Wifi className="h-3 w-3" />
              En línea
            </> : <>
              <WifiOff className="h-3 w-3" />
              Sin conexión
            </>}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {isOnline ? <>
              <strong>Conectado</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                Tu conexión está activa. Tus respuestas y notas se guardan automáticamente, como en
                Google Docs.
              </span>
            </> : <>
              <strong>Sin conexión</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                No hay internet. Puedes seguir estudiando; todo se guardará cuando vuelvas a
                conectarte, como en modo avión.
              </span>
            </>}
        </p>
      </TooltipContent>
    </Tooltip>;
  }
}