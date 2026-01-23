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
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
interface HelpIconProps {
  content: string | React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}
export function HelpIcon({
  content,
  className,
  side = stryMutAct_9fa48("17468") ? "" : (stryCov_9fa48("17468"), 'top')
}: HelpIconProps) {
  if (stryMutAct_9fa48("17469")) {
    {}
  } else {
    stryCov_9fa48("17469");
    return <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className={stryMutAct_9fa48("17470") ? `` : (stryCov_9fa48("17470"), `h-4 w-4 text-muted-foreground hover:text-foreground cursor-help ${stryMutAct_9fa48("17473") ? className && '' : stryMutAct_9fa48("17472") ? false : stryMutAct_9fa48("17471") ? true : (stryCov_9fa48("17471", "17472", "17473"), className || (stryMutAct_9fa48("17474") ? "Stryker was here!" : (stryCov_9fa48("17474"), '')))}`)} />
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {(stryMutAct_9fa48("17477") ? typeof content !== 'string' : stryMutAct_9fa48("17476") ? false : stryMutAct_9fa48("17475") ? true : (stryCov_9fa48("17475", "17476", "17477"), typeof content === (stryMutAct_9fa48("17478") ? "" : (stryCov_9fa48("17478"), 'string')))) ? <p className="text-sm">{content}</p> : <div className="text-sm">{content}</div>}
      </TooltipContent>
    </Tooltip>;
  }
}