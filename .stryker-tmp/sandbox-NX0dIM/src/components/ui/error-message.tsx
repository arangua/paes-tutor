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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ErrorMessage } from '@/lib/error-messages';
interface ErrorMessageProps {
  error: ErrorMessage;
  className?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}
const severityIcons = stryMutAct_9fa48("20658") ? {} : (stryCov_9fa48("20658"), {
  low: Info,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: XCircle
});
const severityColors = stryMutAct_9fa48("20659") ? {} : (stryCov_9fa48("20659"), {
  low: stryMutAct_9fa48("20660") ? "" : (stryCov_9fa48("20660"), 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200'),
  medium: stryMutAct_9fa48("20661") ? "" : (stryCov_9fa48("20661"), 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200'),
  high: stryMutAct_9fa48("20662") ? "" : (stryCov_9fa48("20662"), 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200'),
  critical: stryMutAct_9fa48("20663") ? "" : (stryCov_9fa48("20663"), 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200')
});
export function ErrorMessageComponent({
  error,
  className,
  onAction,
  onDismiss
}: ErrorMessageProps) {
  if (stryMutAct_9fa48("20664")) {
    {}
  } else {
    stryCov_9fa48("20664");
    const Icon = severityIcons[error.severity];
    const colorClass = severityColors[error.severity];
    return <Alert className={cn(colorClass, className)}>
      <Icon className="h-4 w-4" />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <AlertTitle className="flex items-center gap-2">
              {error.title}
              <span className="text-xs font-mono opacity-70">[{error.code}]</span>
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>{error.description}</p>
              <div className="bg-background/50 rounded-md p-3 mt-2">
                <p className="text-sm font-medium mb-1">💡 Solución:</p>
                <p className="text-sm">{error.solution}</p>
              </div>
            </AlertDescription>
          </div>
          {stryMutAct_9fa48("20667") ? onDismiss || <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss} aria-label="Cerrar">
              <XCircle className="h-4 w-4" />
            </Button> : stryMutAct_9fa48("20666") ? false : stryMutAct_9fa48("20665") ? true : (stryCov_9fa48("20665", "20666", "20667"), onDismiss && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss} aria-label="Cerrar">
              <XCircle className="h-4 w-4" />
            </Button>)}
        </div>
        {stryMutAct_9fa48("20670") ? error.action || <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onAction || error.action.onClick} className="bg-background">
              {error.action.label}
            </Button>
          </div> : stryMutAct_9fa48("20669") ? false : stryMutAct_9fa48("20668") ? true : (stryCov_9fa48("20668", "20669", "20670"), error.action && <div className="mt-4">
            <Button variant="outline" size="sm" onClick={stryMutAct_9fa48("20673") ? onAction && error.action.onClick : stryMutAct_9fa48("20672") ? false : stryMutAct_9fa48("20671") ? true : (stryCov_9fa48("20671", "20672", "20673"), onAction || error.action.onClick)} className="bg-background">
              {error.action.label}
            </Button>
          </div>)}
      </div>
    </Alert>;
  }
}