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
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  if (stryMutAct_9fa48("20613")) {
    {}
  } else {
    stryCov_9fa48("20613");
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
  }
}
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  if (stryMutAct_9fa48("20614")) {
    {}
  } else {
    stryCov_9fa48("20614");
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
  }
}
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  if (stryMutAct_9fa48("20615")) {
    {}
  } else {
    stryCov_9fa48("20615");
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
  }
}
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  if (stryMutAct_9fa48("20616")) {
    {}
  } else {
    stryCov_9fa48("20616");
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
  }
}
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  if (stryMutAct_9fa48("20617")) {
    {}
  } else {
    stryCov_9fa48("20617");
    return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn(stryMutAct_9fa48("20618") ? "" : (stryCov_9fa48("20618"), 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm'), className)} {...props} />;
  }
}
function DialogContent({
  className,
  children,
  showCloseButton = stryMutAct_9fa48("20619") ? false : (stryCov_9fa48("20619"), true),
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  if (stryMutAct_9fa48("20620")) {
    {}
  } else {
    stryCov_9fa48("20620");
    return <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content data-slot="dialog-content" className={cn(stryMutAct_9fa48("20621") ? "" : (stryCov_9fa48("20621"), 'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[100] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg'), className)} {...props}>
        {children}
        {stryMutAct_9fa48("20624") ? showCloseButton || <DialogPrimitive.Close data-slot="dialog-close" className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close> : stryMutAct_9fa48("20623") ? false : stryMutAct_9fa48("20622") ? true : (stryCov_9fa48("20622", "20623", "20624"), showCloseButton && <DialogPrimitive.Close data-slot="dialog-close" className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>)}
      </DialogPrimitive.Content>
    </DialogPortal>;
  }
}
function DialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20625")) {
    {}
  } else {
    stryCov_9fa48("20625");
    return <div data-slot="dialog-header" className={cn(stryMutAct_9fa48("20626") ? "" : (stryCov_9fa48("20626"), 'flex flex-col gap-2 text-center sm:text-left'), className)} {...props} />;
  }
}
function DialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  if (stryMutAct_9fa48("20627")) {
    {}
  } else {
    stryCov_9fa48("20627");
    return <div data-slot="dialog-footer" className={cn(stryMutAct_9fa48("20628") ? "" : (stryCov_9fa48("20628"), 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'), className)} {...props} />;
  }
}
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  if (stryMutAct_9fa48("20629")) {
    {}
  } else {
    stryCov_9fa48("20629");
    return <DialogPrimitive.Title data-slot="dialog-title" className={cn(stryMutAct_9fa48("20630") ? "" : (stryCov_9fa48("20630"), 'text-lg leading-none font-semibold'), className)} {...props} />;
  }
}
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  if (stryMutAct_9fa48("20631")) {
    {}
  } else {
    stryCov_9fa48("20631");
    return <DialogPrimitive.Description data-slot="dialog-description" className={cn(stryMutAct_9fa48("20632") ? "" : (stryCov_9fa48("20632"), 'text-muted-foreground text-sm'), className)} {...props} />;
  }
}
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };