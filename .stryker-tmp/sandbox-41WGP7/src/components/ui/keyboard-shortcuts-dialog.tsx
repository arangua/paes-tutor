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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';
import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: KeyboardShortcut[];
}
export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
  shortcuts
}: KeyboardShortcutsDialogProps) {
  if (stryMutAct_9fa48("20686")) {
    {}
  } else {
    stryCov_9fa48("20686");
    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
      if (stryMutAct_9fa48("20687")) {
        {}
      } else {
        stryCov_9fa48("20687");
        const category = stryMutAct_9fa48("20690") ? shortcut.category && 'otros' : stryMutAct_9fa48("20689") ? false : stryMutAct_9fa48("20688") ? true : (stryCov_9fa48("20688", "20689", "20690"), shortcut.category || (stryMutAct_9fa48("20691") ? "" : (stryCov_9fa48("20691"), 'otros')));
        if (stryMutAct_9fa48("20694") ? false : stryMutAct_9fa48("20693") ? true : stryMutAct_9fa48("20692") ? acc[category] : (stryCov_9fa48("20692", "20693", "20694"), !acc[category])) {
          if (stryMutAct_9fa48("20695")) {
            {}
          } else {
            stryCov_9fa48("20695");
            acc[category] = stryMutAct_9fa48("20696") ? ["Stryker was here"] : (stryCov_9fa48("20696"), []);
          }
        }
        acc[category].push(shortcut);
        return acc;
      }
    }, {} as Record<string, KeyboardShortcut[]>);
    const formatKey = (shortcut: KeyboardShortcut) => {
      if (stryMutAct_9fa48("20697")) {
        {}
      } else {
        stryCov_9fa48("20697");
        const parts: string[] = stryMutAct_9fa48("20698") ? ["Stryker was here"] : (stryCov_9fa48("20698"), []);
        if (stryMutAct_9fa48("20701") ? shortcut.ctrl && shortcut.meta : stryMutAct_9fa48("20700") ? false : stryMutAct_9fa48("20699") ? true : (stryCov_9fa48("20699", "20700", "20701"), shortcut.ctrl || shortcut.meta)) parts.push(stryMutAct_9fa48("20702") ? "" : (stryCov_9fa48("20702"), 'Ctrl'));
        if (stryMutAct_9fa48("20704") ? false : stryMutAct_9fa48("20703") ? true : (stryCov_9fa48("20703", "20704"), shortcut.shift)) parts.push(stryMutAct_9fa48("20705") ? "" : (stryCov_9fa48("20705"), 'Shift'));
        if (stryMutAct_9fa48("20707") ? false : stryMutAct_9fa48("20706") ? true : (stryCov_9fa48("20706", "20707"), shortcut.alt)) parts.push(stryMutAct_9fa48("20708") ? "" : (stryCov_9fa48("20708"), 'Alt'));
        parts.push(stryMutAct_9fa48("20709") ? shortcut.key.toLowerCase() : (stryCov_9fa48("20709"), shortcut.key.toUpperCase()));
        return parts.join(stryMutAct_9fa48("20710") ? "" : (stryCov_9fa48("20710"), ' + '));
      }
    };
    const categoryNames: Record<string, string> = stryMutAct_9fa48("20711") ? {} : (stryCov_9fa48("20711"), {
      navegación: stryMutAct_9fa48("20712") ? "" : (stryCov_9fa48("20712"), 'Navegación'),
      respuesta: stryMutAct_9fa48("20713") ? "" : (stryCov_9fa48("20713"), 'Respuestas'),
      acción: stryMutAct_9fa48("20714") ? "" : (stryCov_9fa48("20714"), 'Acciones'),
      otros: stryMutAct_9fa48("20715") ? "" : (stryCov_9fa48("20715"), 'Otros')
    });
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atajos de Teclado
          </DialogTitle>
          <DialogDescription>
            Presiona <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> para ver esta ayuda
            en cualquier momento
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {Object.entries(groupedShortcuts).map(stryMutAct_9fa48("20716") ? () => undefined : (stryCov_9fa48("20716"), ([category, categoryShortcuts]) => <div key={category}>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                {stryMutAct_9fa48("20719") ? categoryNames[category] && category : stryMutAct_9fa48("20718") ? false : stryMutAct_9fa48("20717") ? true : (stryCov_9fa48("20717", "20718", "20719"), categoryNames[category] || category)}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map(stryMutAct_9fa48("20720") ? () => undefined : (stryCov_9fa48("20720"), (shortcut, index) => <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-2">
                      {formatKey(shortcut).split(stryMutAct_9fa48("20721") ? "" : (stryCov_9fa48("20721"), ' + ')).map(stryMutAct_9fa48("20722") ? () => undefined : (stryCov_9fa48("20722"), (key, i) => <kbd key={i} className="px-2 py-1 bg-background border rounded text-xs font-mono">
                            {key}
                          </kbd>))}
                    </div>
                  </div>))}
              </div>
            </div>))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Los atajos funcionan desde cualquier página. Presiona{stryMutAct_9fa48("20723") ? "" : (stryCov_9fa48("20723"), ' ')}
            <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> para ver esta ayuda.
          </p>
        </div>
      </DialogContent>
    </Dialog>;
  }
}