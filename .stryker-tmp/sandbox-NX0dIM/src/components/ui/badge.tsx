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
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const badgeVariants = cva(stryMutAct_9fa48("20449") ? "" : (stryCov_9fa48("20449"), 'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden'), stryMutAct_9fa48("20450") ? {} : (stryCov_9fa48("20450"), {
  variants: stryMutAct_9fa48("20451") ? {} : (stryCov_9fa48("20451"), {
    variant: stryMutAct_9fa48("20452") ? {} : (stryCov_9fa48("20452"), {
      default: stryMutAct_9fa48("20453") ? "" : (stryCov_9fa48("20453"), 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90'),
      secondary: stryMutAct_9fa48("20454") ? "" : (stryCov_9fa48("20454"), 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90'),
      destructive: stryMutAct_9fa48("20455") ? "" : (stryCov_9fa48("20455"), 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60'),
      outline: stryMutAct_9fa48("20456") ? "" : (stryCov_9fa48("20456"), 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground')
    })
  }),
  defaultVariants: stryMutAct_9fa48("20457") ? {} : (stryCov_9fa48("20457"), {
    variant: stryMutAct_9fa48("20458") ? "" : (stryCov_9fa48("20458"), 'default')
  })
}));
function Badge({
  className,
  variant,
  asChild = stryMutAct_9fa48("20459") ? true : (stryCov_9fa48("20459"), false),
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {
  asChild?: boolean;
}) {
  if (stryMutAct_9fa48("20460")) {
    {}
  } else {
    stryCov_9fa48("20460");
    const Comp = asChild ? Slot : stryMutAct_9fa48("20461") ? "" : (stryCov_9fa48("20461"), 'span');
    return <Comp data-slot="badge" className={cn(badgeVariants(stryMutAct_9fa48("20462") ? {} : (stryCov_9fa48("20462"), {
      variant
    })), className)} {...props} />;
  }
}
export { Badge, badgeVariants };