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
import { Button } from '@/components/ui/button';
import { Undo2, Redo2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
interface UndoRedoToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}
export function UndoRedoToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  className
}: UndoRedoToolbarProps) {
  if (stryMutAct_9fa48("21263")) {
    {}
  } else {
    stryCov_9fa48("21263");
    return <div className={stryMutAct_9fa48("21264") ? `` : (stryCov_9fa48("21264"), `flex items-center gap-1 ${stryMutAct_9fa48("21267") ? className && '' : stryMutAct_9fa48("21266") ? false : stryMutAct_9fa48("21265") ? true : (stryCov_9fa48("21265", "21266", "21267"), className || (stryMutAct_9fa48("21268") ? "Stryker was here!" : (stryCov_9fa48("21268"), '')))}`)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onUndo} disabled={stryMutAct_9fa48("21269") ? canUndo : (stryCov_9fa48("21269"), !canUndo)} aria-label="Deshacer">
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Deshacer</strong> (Ctrl+Z)
            <br />
            <span className="text-muted-foreground text-xs">
              Como en Word o Gmail, revierte tu última acción. Útil si borraste algo por error.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onRedo} disabled={stryMutAct_9fa48("21270") ? canRedo : (stryCov_9fa48("21270"), !canRedo)} aria-label="Rehacer">
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Rehacer</strong> (Ctrl+Shift+Z)
            <br />
            <span className="text-muted-foreground text-xs">
              Recupera lo que acabas de deshacer. Como el botón "adelante" en tu navegador.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
    </div>;
  }
}