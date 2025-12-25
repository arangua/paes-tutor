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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = stryMutAct_9fa48("20542") ? "" : (stryCov_9fa48("20542"), 'Confirmar'),
  cancelText = stryMutAct_9fa48("20543") ? "" : (stryCov_9fa48("20543"), 'Cancelar'),
  variant = stryMutAct_9fa48("20544") ? "" : (stryCov_9fa48("20544"), 'default'),
  loading = stryMutAct_9fa48("20545") ? true : (stryCov_9fa48("20545"), false)
}: ConfirmDialogProps) {
  if (stryMutAct_9fa48("20546")) {
    {}
  } else {
    stryCov_9fa48("20546");
    const handleConfirm = () => {
      if (stryMutAct_9fa48("20547")) {
        {}
      } else {
        stryCov_9fa48("20547");
        onConfirm();
      }
    };
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {stryMutAct_9fa48("20550") ? variant === 'destructive' || <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div> : stryMutAct_9fa48("20549") ? false : stryMutAct_9fa48("20548") ? true : (stryCov_9fa48("20548", "20549", "20550"), (stryMutAct_9fa48("20552") ? variant !== 'destructive' : stryMutAct_9fa48("20551") ? true : (stryCov_9fa48("20551", "20552"), variant === (stryMutAct_9fa48("20553") ? "" : (stryCov_9fa48("20553"), 'destructive')))) && <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>)}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={stryMutAct_9fa48("20554") ? () => undefined : (stryCov_9fa48("20554"), () => onOpenChange(stryMutAct_9fa48("20555") ? true : (stryCov_9fa48("20555"), false)))} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={loading}>
            {loading ? stryMutAct_9fa48("20556") ? "" : (stryCov_9fa48("20556"), 'Procesando...') : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  }
}