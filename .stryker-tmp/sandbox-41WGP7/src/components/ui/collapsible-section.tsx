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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CollapsibleSectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  storageKey?: string; // Clave para persistir estado en localStorage
}
export function CollapsibleSection({
  title,
  description,
  defaultOpen = stryMutAct_9fa48("20506") ? true : (stryCov_9fa48("20506"), false),
  children,
  className,
  storageKey
}: CollapsibleSectionProps) {
  if (stryMutAct_9fa48("20507")) {
    {}
  } else {
    stryCov_9fa48("20507");
    // Cargar estado persistido o usar defaultOpen
    const [isOpen, setIsOpen] = useState(() => {
      if (stryMutAct_9fa48("20508")) {
        {}
      } else {
        stryCov_9fa48("20508");
        if (stryMutAct_9fa48("20511") ? typeof window === 'undefined' && !storageKey : stryMutAct_9fa48("20510") ? false : stryMutAct_9fa48("20509") ? true : (stryCov_9fa48("20509", "20510", "20511"), (stryMutAct_9fa48("20513") ? typeof window !== 'undefined' : stryMutAct_9fa48("20512") ? false : (stryCov_9fa48("20512", "20513"), typeof window === (stryMutAct_9fa48("20514") ? "" : (stryCov_9fa48("20514"), 'undefined')))) || (stryMutAct_9fa48("20515") ? storageKey : (stryCov_9fa48("20515"), !storageKey)))) return defaultOpen;
        try {
          if (stryMutAct_9fa48("20516")) {
            {}
          } else {
            stryCov_9fa48("20516");
            const saved = localStorage.getItem(storageKey);
            return (stryMutAct_9fa48("20519") ? saved === null : stryMutAct_9fa48("20518") ? false : stryMutAct_9fa48("20517") ? true : (stryCov_9fa48("20517", "20518", "20519"), saved !== null)) ? JSON.parse(saved) : defaultOpen;
          }
        } catch {
          if (stryMutAct_9fa48("20520")) {
            {}
          } else {
            stryCov_9fa48("20520");
            return defaultOpen;
          }
        }
      }
    });

    // Persistir estado cuando cambia
    useEffect(() => {
      if (stryMutAct_9fa48("20521")) {
        {}
      } else {
        stryCov_9fa48("20521");
        if (stryMutAct_9fa48("20524") ? storageKey || typeof window !== 'undefined' : stryMutAct_9fa48("20523") ? false : stryMutAct_9fa48("20522") ? true : (stryCov_9fa48("20522", "20523", "20524"), storageKey && (stryMutAct_9fa48("20526") ? typeof window === 'undefined' : stryMutAct_9fa48("20525") ? true : (stryCov_9fa48("20525", "20526"), typeof window !== (stryMutAct_9fa48("20527") ? "" : (stryCov_9fa48("20527"), 'undefined')))))) {
          if (stryMutAct_9fa48("20528")) {
            {}
          } else {
            stryCov_9fa48("20528");
            try {
              if (stryMutAct_9fa48("20529")) {
                {}
              } else {
                stryCov_9fa48("20529");
                localStorage.setItem(storageKey, JSON.stringify(isOpen));
              }
            } catch {
              // Ignorar errores de localStorage (p. ej., modo privado)
            }
          }
        }
      }
    }, stryMutAct_9fa48("20530") ? [] : (stryCov_9fa48("20530"), [isOpen, storageKey]));
    return <Card className={cn(stryMutAct_9fa48("20531") ? "Stryker was here!" : (stryCov_9fa48("20531"), ''), className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {stryMutAct_9fa48("20534") ? description || <p className="text-sm text-muted-foreground mt-1">{description}</p> : stryMutAct_9fa48("20533") ? false : stryMutAct_9fa48("20532") ? true : (stryCov_9fa48("20532", "20533", "20534"), description && <p className="text-sm text-muted-foreground mt-1">{description}</p>)}
          </div>
          <Button variant="ghost" size="icon" onClick={stryMutAct_9fa48("20535") ? () => undefined : (stryCov_9fa48("20535"), () => setIsOpen(stryMutAct_9fa48("20536") ? isOpen : (stryCov_9fa48("20536"), !isOpen)))} aria-label={isOpen ? stryMutAct_9fa48("20537") ? "" : (stryCov_9fa48("20537"), 'Colapsar') : stryMutAct_9fa48("20538") ? "" : (stryCov_9fa48("20538"), 'Expandir')}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {stryMutAct_9fa48("20541") ? isOpen || <CardContent>{children}</CardContent> : stryMutAct_9fa48("20540") ? false : stryMutAct_9fa48("20539") ? true : (stryCov_9fa48("20539", "20540", "20541"), isOpen && <CardContent>{children}</CardContent>)}
    </Card>;
  }
}