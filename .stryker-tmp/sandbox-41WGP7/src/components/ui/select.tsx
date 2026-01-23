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
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  if (stryMutAct_9fa48("21058")) {
    {}
  } else {
    stryCov_9fa48("21058");
    return <SelectPrimitive.Root data-slot="select" {...props} />;
  }
}
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  if (stryMutAct_9fa48("21059")) {
    {}
  } else {
    stryCov_9fa48("21059");
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
  }
}
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  if (stryMutAct_9fa48("21060")) {
    {}
  } else {
    stryCov_9fa48("21060");
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
  }
}
function SelectTrigger({
  className,
  size = stryMutAct_9fa48("21061") ? "" : (stryCov_9fa48("21061"), 'default'),
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
}) {
  if (stryMutAct_9fa48("21062")) {
    {}
  } else {
    stryCov_9fa48("21062");
    return <SelectPrimitive.Trigger data-slot="select-trigger" data-size={size} className={cn(stryMutAct_9fa48("21063") ? "" : (stryCov_9fa48("21063"), "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"), className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>;
  }
}
function SelectContent({
  className,
  children,
  position = stryMutAct_9fa48("21064") ? "" : (stryCov_9fa48("21064"), 'item-aligned'),
  align = stryMutAct_9fa48("21065") ? "" : (stryCov_9fa48("21065"), 'center'),
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  if (stryMutAct_9fa48("21066")) {
    {}
  } else {
    stryCov_9fa48("21066");
    return <SelectPrimitive.Portal>
      <SelectPrimitive.Content data-slot="select-content" className={cn(stryMutAct_9fa48("21067") ? "" : (stryCov_9fa48("21067"), 'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md'), stryMutAct_9fa48("21070") ? position === 'popper' || 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1' : stryMutAct_9fa48("21069") ? false : stryMutAct_9fa48("21068") ? true : (stryCov_9fa48("21068", "21069", "21070"), (stryMutAct_9fa48("21072") ? position !== 'popper' : stryMutAct_9fa48("21071") ? true : (stryCov_9fa48("21071", "21072"), position === (stryMutAct_9fa48("21073") ? "" : (stryCov_9fa48("21073"), 'popper')))) && (stryMutAct_9fa48("21074") ? "" : (stryCov_9fa48("21074"), 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'))), className)} position={position} align={align} {...props}>
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={cn(stryMutAct_9fa48("21075") ? "" : (stryCov_9fa48("21075"), 'p-1'), stryMutAct_9fa48("21078") ? position === 'popper' || 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1' : stryMutAct_9fa48("21077") ? false : stryMutAct_9fa48("21076") ? true : (stryCov_9fa48("21076", "21077", "21078"), (stryMutAct_9fa48("21080") ? position !== 'popper' : stryMutAct_9fa48("21079") ? true : (stryCov_9fa48("21079", "21080"), position === (stryMutAct_9fa48("21081") ? "" : (stryCov_9fa48("21081"), 'popper')))) && (stryMutAct_9fa48("21082") ? "" : (stryCov_9fa48("21082"), 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'))))}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>;
  }
}
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  if (stryMutAct_9fa48("21083")) {
    {}
  } else {
    stryCov_9fa48("21083");
    return <SelectPrimitive.Label data-slot="select-label" className={cn(stryMutAct_9fa48("21084") ? "" : (stryCov_9fa48("21084"), 'text-muted-foreground px-2 py-1.5 text-xs'), className)} {...props} />;
  }
}
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  if (stryMutAct_9fa48("21085")) {
    {}
  } else {
    stryCov_9fa48("21085");
    return <SelectPrimitive.Item data-slot="select-item" className={cn(stryMutAct_9fa48("21086") ? "" : (stryCov_9fa48("21086"), "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"), className)} {...props}>
      <span data-slot="select-item-indicator" className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>;
  }
}
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  if (stryMutAct_9fa48("21087")) {
    {}
  } else {
    stryCov_9fa48("21087");
    return <SelectPrimitive.Separator data-slot="select-separator" className={cn(stryMutAct_9fa48("21088") ? "" : (stryCov_9fa48("21088"), 'bg-border pointer-events-none -mx-1 my-1 h-px'), className)} {...props} />;
  }
}
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (stryMutAct_9fa48("21089")) {
    {}
  } else {
    stryCov_9fa48("21089");
    return <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn(stryMutAct_9fa48("21090") ? "" : (stryCov_9fa48("21090"), 'flex cursor-default items-center justify-center py-1'), className)} {...props}>
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>;
  }
}
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (stryMutAct_9fa48("21091")) {
    {}
  } else {
    stryCov_9fa48("21091");
    return <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn(stryMutAct_9fa48("21092") ? "" : (stryCov_9fa48("21092"), 'flex cursor-default items-center justify-center py-1'), className)} {...props}>
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>;
  }
}
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };