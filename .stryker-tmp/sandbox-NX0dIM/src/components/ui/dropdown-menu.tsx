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
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  if (stryMutAct_9fa48("20633")) {
    {}
  } else {
    stryCov_9fa48("20633");
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
  }
}
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  if (stryMutAct_9fa48("20634")) {
    {}
  } else {
    stryCov_9fa48("20634");
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
  }
}
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  if (stryMutAct_9fa48("20635")) {
    {}
  } else {
    stryCov_9fa48("20635");
    return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
  }
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  if (stryMutAct_9fa48("20636")) {
    {}
  } else {
    stryCov_9fa48("20636");
    return <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} className={cn(stryMutAct_9fa48("20637") ? "" : (stryCov_9fa48("20637"), 'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md'), className)} {...props} />
    </DropdownMenuPrimitive.Portal>;
  }
}
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  if (stryMutAct_9fa48("20638")) {
    {}
  } else {
    stryCov_9fa48("20638");
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
  }
}
function DropdownMenuItem({
  className,
  inset,
  variant = stryMutAct_9fa48("20639") ? "" : (stryCov_9fa48("20639"), 'default'),
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  if (stryMutAct_9fa48("20640")) {
    {}
  } else {
    stryCov_9fa48("20640");
    return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" data-inset={inset} data-variant={variant} className={cn(stryMutAct_9fa48("20641") ? "" : (stryCov_9fa48("20641"), "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"), className)} {...props} />;
  }
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  if (stryMutAct_9fa48("20642")) {
    {}
  } else {
    stryCov_9fa48("20642");
    return <DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn(stryMutAct_9fa48("20643") ? "" : (stryCov_9fa48("20643"), "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"), className)} checked={checked} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>;
  }
}
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  if (stryMutAct_9fa48("20644")) {
    {}
  } else {
    stryCov_9fa48("20644");
    return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
  }
}
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  if (stryMutAct_9fa48("20645")) {
    {}
  } else {
    stryCov_9fa48("20645");
    return <DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn(stryMutAct_9fa48("20646") ? "" : (stryCov_9fa48("20646"), "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"), className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>;
  }
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  if (stryMutAct_9fa48("20647")) {
    {}
  } else {
    stryCov_9fa48("20647");
    return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" data-inset={inset} className={cn(stryMutAct_9fa48("20648") ? "" : (stryCov_9fa48("20648"), 'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8'), className)} {...props} />;
  }
}
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  if (stryMutAct_9fa48("20649")) {
    {}
  } else {
    stryCov_9fa48("20649");
    return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn(stryMutAct_9fa48("20650") ? "" : (stryCov_9fa48("20650"), 'bg-border -mx-1 my-1 h-px'), className)} {...props} />;
  }
}
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  if (stryMutAct_9fa48("20651")) {
    {}
  } else {
    stryCov_9fa48("20651");
    return <span data-slot="dropdown-menu-shortcut" className={cn(stryMutAct_9fa48("20652") ? "" : (stryCov_9fa48("20652"), 'text-muted-foreground ml-auto text-xs tracking-widest'), className)} {...props} />;
  }
}
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  if (stryMutAct_9fa48("20653")) {
    {}
  } else {
    stryCov_9fa48("20653");
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
  }
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  if (stryMutAct_9fa48("20654")) {
    {}
  } else {
    stryCov_9fa48("20654");
    return <DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" data-inset={inset} className={cn(stryMutAct_9fa48("20655") ? "" : (stryCov_9fa48("20655"), "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"), className)} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>;
  }
}
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  if (stryMutAct_9fa48("20656")) {
    {}
  } else {
    stryCov_9fa48("20656");
    return <DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" className={cn(stryMutAct_9fa48("20657") ? "" : (stryCov_9fa48("20657"), 'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg'), className)} {...props} />;
  }
}
export { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent };