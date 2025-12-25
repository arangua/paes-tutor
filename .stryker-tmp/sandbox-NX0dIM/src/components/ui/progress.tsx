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
import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  if (stryMutAct_9fa48("21050")) {
    {}
  } else {
    stryCov_9fa48("21050");
    return <ProgressPrimitive.Root data-slot="progress" className={cn(stryMutAct_9fa48("21051") ? "" : (stryCov_9fa48("21051"), 'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full'), className)} {...props}>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className="bg-primary h-full w-full flex-1 transition-all" style={stryMutAct_9fa48("21052") ? {} : (stryCov_9fa48("21052"), {
        transform: stryMutAct_9fa48("21053") ? `` : (stryCov_9fa48("21053"), `translateX(-${stryMutAct_9fa48("21054") ? 100 + (value || 0) : (stryCov_9fa48("21054"), 100 - (stryMutAct_9fa48("21057") ? value && 0 : stryMutAct_9fa48("21056") ? false : stryMutAct_9fa48("21055") ? true : (stryCov_9fa48("21055", "21056", "21057"), value || 0)))}%)`)
      })} />
    </ProgressPrimitive.Root>;
  }
}
export { Progress };