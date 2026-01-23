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
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const alertVariants = cva(stryMutAct_9fa48("20435") ? "" : (stryCov_9fa48("20435"), 'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current'), stryMutAct_9fa48("20436") ? {} : (stryCov_9fa48("20436"), {
  variants: stryMutAct_9fa48("20437") ? {} : (stryCov_9fa48("20437"), {
    variant: stryMutAct_9fa48("20438") ? {} : (stryCov_9fa48("20438"), {
      default: stryMutAct_9fa48("20439") ? "" : (stryCov_9fa48("20439"), 'bg-card text-card-foreground'),
      destructive: stryMutAct_9fa48("20440") ? "" : (stryCov_9fa48("20440"), 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90')
    })
  }),
  defaultVariants: stryMutAct_9fa48("20441") ? {} : (stryCov_9fa48("20441"), {
    variant: stryMutAct_9fa48("20442") ? "" : (stryCov_9fa48("20442"), 'default')
  })
}));
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  if (stryMutAct_9fa48("20443")) {
    {}
  } else {
    stryCov_9fa48("20443");
    return <div data-slot="alert" role="alert" className={cn(alertVariants(stryMutAct_9fa48("20444") ? {} : (stryCov_9fa48("20444"), {
      variant
    })), className)} {...props} />;
  }
}
function AlertTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20445")) {
    {}
  } else {
    stryCov_9fa48("20445");
    return <div data-slot="alert-title" className={cn(stryMutAct_9fa48("20446") ? "" : (stryCov_9fa48("20446"), 'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight'), className)} {...props} />;
  }
}
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20447")) {
    {}
  } else {
    stryCov_9fa48("20447");
    return <div data-slot="alert-description" className={cn(stryMutAct_9fa48("20448") ? "" : (stryCov_9fa48("20448"), 'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed'), className)} {...props} />;
  }
}
export { Alert, AlertTitle, AlertDescription };