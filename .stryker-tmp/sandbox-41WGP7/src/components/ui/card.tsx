// @ts-nocheck
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
import { cn } from '@/lib/utils';
function Card({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20489")) {
    {}
  } else {
    stryCov_9fa48("20489");
    return <div data-slot="card" className={cn(stryMutAct_9fa48("20490") ? "" : (stryCov_9fa48("20490"), 'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm'), className)} {...props} />;
  }
}
function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20491")) {
    {}
  } else {
    stryCov_9fa48("20491");
    return <div data-slot="card-header" className={cn(stryMutAct_9fa48("20492") ? "" : (stryCov_9fa48("20492"), '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6'), className)} {...props} />;
  }
}
function CardTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20493")) {
    {}
  } else {
    stryCov_9fa48("20493");
    return <div data-slot="card-title" className={cn(stryMutAct_9fa48("20494") ? "" : (stryCov_9fa48("20494"), 'leading-none font-semibold'), className)} {...props} />;
  }
}
function CardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20495")) {
    {}
  } else {
    stryCov_9fa48("20495");
    return <div data-slot="card-description" className={cn(stryMutAct_9fa48("20496") ? "" : (stryCov_9fa48("20496"), 'text-muted-foreground text-sm'), className)} {...props} />;
  }
}
function CardAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20497")) {
    {}
  } else {
    stryCov_9fa48("20497");
    return <div data-slot="card-action" className={cn(stryMutAct_9fa48("20498") ? "" : (stryCov_9fa48("20498"), 'col-start-2 row-span-2 row-start-1 self-start justify-self-end'), className)} {...props} />;
  }
}
function CardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20499")) {
    {}
  } else {
    stryCov_9fa48("20499");
    return <div data-slot="card-content" className={cn(stryMutAct_9fa48("20500") ? "" : (stryCov_9fa48("20500"), 'px-6'), className)} {...props} />;
  }
}
function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20501")) {
    {}
  } else {
    stryCov_9fa48("20501");
    return <div data-slot="card-footer" className={cn(stryMutAct_9fa48("20502") ? "" : (stryCov_9fa48("20502"), 'flex items-center px-6 [.border-t]:pt-6'), className)} {...props} />;
  }
}
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };