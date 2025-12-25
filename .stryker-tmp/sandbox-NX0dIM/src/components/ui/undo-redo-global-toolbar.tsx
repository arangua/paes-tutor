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
import { Undo2, Redo2, History } from 'lucide-react';
import { useGlobalUndoRedo } from '@/hooks/useGlobalUndoRedo';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

/**
 * Toolbar global para undo/redo
 * Basado en estándares de Google Docs, Figma
 */
export function GlobalUndoRedoToolbar() {
  if (stryMutAct_9fa48("21247")) {
    {}
  } else {
    stryCov_9fa48("21247");
    const {
      undo,
      redo,
      canUndo,
      canRedo,
      getRecentActions,
      historyLength
    } = useGlobalUndoRedo();
    const recentActions = getRecentActions(10);
    return <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={undo} disabled={stryMutAct_9fa48("21248") ? canUndo : (stryCov_9fa48("21248"), !canUndo)} className="h-8 w-8">
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Deshacer</strong> (Ctrl+Z)
            <br />
            <span className="text-muted-foreground text-xs">
              Revierte cambios en toda la app. Funciona como el "deshacer" de Google Docs.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={redo} disabled={stryMutAct_9fa48("21249") ? canRedo : (stryCov_9fa48("21249"), !canRedo)} className="h-8 w-8">
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Rehacer</strong> (Ctrl+Shift+Z)
            <br />
            <span className="text-muted-foreground text-xs">
              Restaura lo que deshiciste. Como el botón "adelante" en tu navegador web.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>

      {stryMutAct_9fa48("21252") ? historyLength > 0 || <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <History className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                <strong>Historial de acciones</strong>
                <br />
                <span className="text-muted-foreground text-xs">
                  Ve las últimas {historyLength || 0} cosas que hiciste. Útil para encontrar
                  cambios recientes.
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              Historial reciente
              <Badge variant="outline" className="ml-2">
                {historyLength}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentActions.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">
                No hay acciones recientes
              </div> : recentActions.map((action, idx) => <DropdownMenuItem key={action.id} className="flex flex-col items-start gap-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{action.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {action.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {action.type}
                  </Badge>
                </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu> : stryMutAct_9fa48("21251") ? false : stryMutAct_9fa48("21250") ? true : (stryCov_9fa48("21250", "21251", "21252"), (stryMutAct_9fa48("21255") ? historyLength <= 0 : stryMutAct_9fa48("21254") ? historyLength >= 0 : stryMutAct_9fa48("21253") ? true : (stryCov_9fa48("21253", "21254", "21255"), historyLength > 0)) && <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <History className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                <strong>Historial de acciones</strong>
                <br />
                <span className="text-muted-foreground text-xs">
                  Ve las últimas {stryMutAct_9fa48("21258") ? historyLength && 0 : stryMutAct_9fa48("21257") ? false : stryMutAct_9fa48("21256") ? true : (stryCov_9fa48("21256", "21257", "21258"), historyLength || 0)} cosas que hiciste. Útil para encontrar
                  cambios recientes.
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              Historial reciente
              <Badge variant="outline" className="ml-2">
                {historyLength}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(stryMutAct_9fa48("21261") ? recentActions.length !== 0 : stryMutAct_9fa48("21260") ? false : stryMutAct_9fa48("21259") ? true : (stryCov_9fa48("21259", "21260", "21261"), recentActions.length === 0)) ? <div className="p-4 text-center text-sm text-muted-foreground">
                No hay acciones recientes
              </div> : recentActions.map(stryMutAct_9fa48("21262") ? () => undefined : (stryCov_9fa48("21262"), (action, idx) => <DropdownMenuItem key={action.id} className="flex flex-col items-start gap-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{action.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {action.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {action.type}
                  </Badge>
                </DropdownMenuItem>))}
          </DropdownMenuContent>
        </DropdownMenu>)}
    </div>;
  }
}