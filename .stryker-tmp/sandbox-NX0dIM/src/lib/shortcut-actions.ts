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
import type { ShortcutAction } from '@/hooks/useCustomizableShortcuts';

/**
 * Acciones disponibles para atajos de teclado
 * Basado en estándares de VS Code, GitHub, Linear
 */
export function getAvailableShortcutActions(router: ReturnType<typeof useRouter>): ShortcutAction[] {
  if (stryMutAct_9fa48("26017")) {
    {}
  } else {
    stryCov_9fa48("26017");
    return stryMutAct_9fa48("26018") ? [] : (stryCov_9fa48("26018"), [// Navegación
    stryMutAct_9fa48("26019") ? {} : (stryCov_9fa48("26019"), {
      id: stryMutAct_9fa48("26020") ? "" : (stryCov_9fa48("26020"), 'nav-dashboard'),
      name: stryMutAct_9fa48("26021") ? "" : (stryCov_9fa48("26021"), 'Ir al Dashboard'),
      description: stryMutAct_9fa48("26022") ? "" : (stryCov_9fa48("26022"), 'Navega rápidamente al dashboard principal'),
      handler: stryMutAct_9fa48("26023") ? () => undefined : (stryCov_9fa48("26023"), () => router.push(stryMutAct_9fa48("26024") ? "" : (stryCov_9fa48("26024"), '/dashboard'))),
      category: stryMutAct_9fa48("26025") ? "" : (stryCov_9fa48("26025"), 'Navegación')
    }), stryMutAct_9fa48("26026") ? {} : (stryCov_9fa48("26026"), {
      id: stryMutAct_9fa48("26027") ? "" : (stryCov_9fa48("26027"), 'nav-exams'),
      name: stryMutAct_9fa48("26028") ? "" : (stryCov_9fa48("26028"), 'Ir a Exámenes'),
      description: stryMutAct_9fa48("26029") ? "" : (stryCov_9fa48("26029"), 'Abre la página de exámenes disponibles'),
      handler: stryMutAct_9fa48("26030") ? () => undefined : (stryCov_9fa48("26030"), () => router.push(stryMutAct_9fa48("26031") ? "" : (stryCov_9fa48("26031"), '/exams'))),
      category: stryMutAct_9fa48("26032") ? "" : (stryCov_9fa48("26032"), 'Navegación')
    }), stryMutAct_9fa48("26033") ? {} : (stryCov_9fa48("26033"), {
      id: stryMutAct_9fa48("26034") ? "" : (stryCov_9fa48("26034"), 'nav-profile'),
      name: stryMutAct_9fa48("26035") ? "" : (stryCov_9fa48("26035"), 'Ir a Perfil'),
      description: stryMutAct_9fa48("26036") ? "" : (stryCov_9fa48("26036"), 'Abre tu página de perfil'),
      handler: stryMutAct_9fa48("26037") ? () => undefined : (stryCov_9fa48("26037"), () => router.push(stryMutAct_9fa48("26038") ? "" : (stryCov_9fa48("26038"), '/profile'))),
      category: stryMutAct_9fa48("26039") ? "" : (stryCov_9fa48("26039"), 'Navegación')
    }), stryMutAct_9fa48("26040") ? {} : (stryCov_9fa48("26040"), {
      id: stryMutAct_9fa48("26041") ? "" : (stryCov_9fa48("26041"), 'nav-materials'),
      name: stryMutAct_9fa48("26042") ? "" : (stryCov_9fa48("26042"), 'Ir a Materiales'),
      description: stryMutAct_9fa48("26043") ? "" : (stryCov_9fa48("26043"), 'Abre la página de materiales de estudio'),
      handler: stryMutAct_9fa48("26044") ? () => undefined : (stryCov_9fa48("26044"), () => router.push(stryMutAct_9fa48("26045") ? "" : (stryCov_9fa48("26045"), '/materials'))),
      category: stryMutAct_9fa48("26046") ? "" : (stryCov_9fa48("26046"), 'Navegación')
    }), stryMutAct_9fa48("26047") ? {} : (stryCov_9fa48("26047"), {
      id: stryMutAct_9fa48("26048") ? "" : (stryCov_9fa48("26048"), 'nav-ai-tutor'),
      name: stryMutAct_9fa48("26049") ? "" : (stryCov_9fa48("26049"), 'Ir a Tutor IA'),
      description: stryMutAct_9fa48("26050") ? "" : (stryCov_9fa48("26050"), 'Abre el tutor de inteligencia artificial'),
      handler: stryMutAct_9fa48("26051") ? () => undefined : (stryCov_9fa48("26051"), () => router.push(stryMutAct_9fa48("26052") ? "" : (stryCov_9fa48("26052"), '/ai-tutor'))),
      category: stryMutAct_9fa48("26053") ? "" : (stryCov_9fa48("26053"), 'Navegación')
    }), stryMutAct_9fa48("26054") ? {} : (stryCov_9fa48("26054"), {
      id: stryMutAct_9fa48("26055") ? "" : (stryCov_9fa48("26055"), 'nav-notes'),
      name: stryMutAct_9fa48("26056") ? "" : (stryCov_9fa48("26056"), 'Ir a Notas'),
      description: stryMutAct_9fa48("26057") ? "" : (stryCov_9fa48("26057"), 'Abre tus notas de estudio'),
      handler: stryMutAct_9fa48("26058") ? () => undefined : (stryCov_9fa48("26058"), () => router.push(stryMutAct_9fa48("26059") ? "" : (stryCov_9fa48("26059"), '/notes'))),
      category: stryMutAct_9fa48("26060") ? "" : (stryCov_9fa48("26060"), 'Navegación')
    }), stryMutAct_9fa48("26061") ? {} : (stryCov_9fa48("26061"), {
      id: stryMutAct_9fa48("26062") ? "" : (stryCov_9fa48("26062"), 'nav-flashcards'),
      name: stryMutAct_9fa48("26063") ? "" : (stryCov_9fa48("26063"), 'Ir a Flashcards'),
      description: stryMutAct_9fa48("26064") ? "" : (stryCov_9fa48("26064"), 'Abre tus tarjetas de estudio'),
      handler: stryMutAct_9fa48("26065") ? () => undefined : (stryCov_9fa48("26065"), () => router.push(stryMutAct_9fa48("26066") ? "" : (stryCov_9fa48("26066"), '/flashcards'))),
      category: stryMutAct_9fa48("26067") ? "" : (stryCov_9fa48("26067"), 'Navegación')
    }), stryMutAct_9fa48("26068") ? {} : (stryCov_9fa48("26068"), {
      id: stryMutAct_9fa48("26069") ? "" : (stryCov_9fa48("26069"), 'nav-help'),
      name: stryMutAct_9fa48("26070") ? "" : (stryCov_9fa48("26070"), 'Ir a Ayuda'),
      description: stryMutAct_9fa48("26071") ? "" : (stryCov_9fa48("26071"), 'Abre la página de ayuda'),
      handler: stryMutAct_9fa48("26072") ? () => undefined : (stryCov_9fa48("26072"), () => router.push(stryMutAct_9fa48("26073") ? "" : (stryCov_9fa48("26073"), '/help'))),
      category: stryMutAct_9fa48("26074") ? "" : (stryCov_9fa48("26074"), 'Navegación')
    }), // Acciones globales
    stryMutAct_9fa48("26075") ? {} : (stryCov_9fa48("26075"), {
      id: stryMutAct_9fa48("26076") ? "" : (stryCov_9fa48("26076"), 'action-search'),
      name: stryMutAct_9fa48("26077") ? "" : (stryCov_9fa48("26077"), 'Buscar'),
      description: stryMutAct_9fa48("26078") ? "" : (stryCov_9fa48("26078"), 'Abre la búsqueda global (Cmd/Ctrl+K)'),
      handler: () => {
        if (stryMutAct_9fa48("26079")) {
          {}
        } else {
          stryCov_9fa48("26079");
          const event = new KeyboardEvent(stryMutAct_9fa48("26080") ? "" : (stryCov_9fa48("26080"), 'keydown'), stryMutAct_9fa48("26081") ? {} : (stryCov_9fa48("26081"), {
            key: stryMutAct_9fa48("26082") ? "" : (stryCov_9fa48("26082"), 'k'),
            ctrlKey: stryMutAct_9fa48("26083") ? false : (stryCov_9fa48("26083"), true),
            bubbles: stryMutAct_9fa48("26084") ? false : (stryCov_9fa48("26084"), true)
          }));
          document.dispatchEvent(event);
        }
      },
      category: stryMutAct_9fa48("26085") ? "" : (stryCov_9fa48("26085"), 'Acciones')
    }), stryMutAct_9fa48("26086") ? {} : (stryCov_9fa48("26086"), {
      id: stryMutAct_9fa48("26087") ? "" : (stryCov_9fa48("26087"), 'action-shortcuts'),
      name: stryMutAct_9fa48("26088") ? "" : (stryCov_9fa48("26088"), 'Ver Atajos'),
      description: stryMutAct_9fa48("26089") ? "" : (stryCov_9fa48("26089"), 'Muestra el diálogo de atajos de teclado'),
      handler: () => {
        if (stryMutAct_9fa48("26090")) {
          {}
        } else {
          stryCov_9fa48("26090");
          const event = new KeyboardEvent(stryMutAct_9fa48("26091") ? "" : (stryCov_9fa48("26091"), 'keydown'), stryMutAct_9fa48("26092") ? {} : (stryCov_9fa48("26092"), {
            key: stryMutAct_9fa48("26093") ? "" : (stryCov_9fa48("26093"), '?'),
            shiftKey: stryMutAct_9fa48("26094") ? false : (stryCov_9fa48("26094"), true),
            bubbles: stryMutAct_9fa48("26095") ? false : (stryCov_9fa48("26095"), true)
          }));
          document.dispatchEvent(event);
        }
      },
      category: stryMutAct_9fa48("26096") ? "" : (stryCov_9fa48("26096"), 'Acciones')
    })]);
  }
}