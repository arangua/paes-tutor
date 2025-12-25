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
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
interface BackButtonProps {
  /**
   * Ruta específica a la que volver. Si no se proporciona, usa router.back()
   */
  href?: string;
  /**
   * Texto del botón. Por defecto: "Volver"
   */
  label?: string;
  /**
   * Variante del botón
   */
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  /**
   * Tamaño del botón
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * Clases CSS adicionales
   */
  className?: string;
  /**
   * Si es true, muestra el icono. Por defecto: true
   */
  showIcon?: boolean;
}

/**
 * Componente reutilizable para botón "Volver"
 *
 * @example
 * // Volver a la página anterior
 * <BackButton />
 *
 * // Volver a una ruta específica
 * <BackButton href="/dashboard" label="Volver al Dashboard" />
 *
 * // Con variante personalizada
 * <BackButton variant="outline" size="sm" />
 */
export function BackButton({
  href,
  label = stryMutAct_9fa48("18008") ? "" : (stryCov_9fa48("18008"), 'Volver'),
  variant = stryMutAct_9fa48("18009") ? "" : (stryCov_9fa48("18009"), 'ghost'),
  size = stryMutAct_9fa48("18010") ? "" : (stryCov_9fa48("18010"), 'default'),
  className,
  showIcon = stryMutAct_9fa48("18011") ? false : (stryCov_9fa48("18011"), true)
}: BackButtonProps) {
  if (stryMutAct_9fa48("18012")) {
    {}
  } else {
    stryCov_9fa48("18012");
    const router = useRouter();
    const handleClick = () => {
      if (stryMutAct_9fa48("18013")) {
        {}
      } else {
        stryCov_9fa48("18013");
        if (stryMutAct_9fa48("18015") ? false : stryMutAct_9fa48("18014") ? true : (stryCov_9fa48("18014", "18015"), href)) {
          if (stryMutAct_9fa48("18016")) {
            {}
          } else {
            stryCov_9fa48("18016");
            router.push(href);
          }
        } else {
          if (stryMutAct_9fa48("18017")) {
            {}
          } else {
            stryCov_9fa48("18017");
            router.back();
          }
        }
      }
    };
    return <Button variant={variant} size={size} onClick={handleClick} className={cn(stryMutAct_9fa48("18018") ? "" : (stryCov_9fa48("18018"), 'flex items-center gap-2'), className)}>
      {stryMutAct_9fa48("18021") ? showIcon || <ArrowLeft className="h-4 w-4" /> : stryMutAct_9fa48("18020") ? false : stryMutAct_9fa48("18019") ? true : (stryCov_9fa48("18019", "18020", "18021"), showIcon && <ArrowLeft className="h-4 w-4" />)}
      {label}
    </Button>;
  }
}