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
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  category?: string;
}

/**
 * Hook para manejar atajos de teclado globales
 * Basado en estándares de Gmail, GitHub, VS Code
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  if (stryMutAct_9fa48("21747")) {
    {}
  } else {
    stryCov_9fa48("21747");
    // Memoizar los shortcuts para evitar re-registrar listeners innecesariamente
    // Usar JSON.stringify para comparación profunda (mejor usar useMemo con dependencias específicas)
    const shortcutsRef = useRef(shortcuts);
    useEffect(() => {
      if (stryMutAct_9fa48("21748")) {
        {}
      } else {
        stryCov_9fa48("21748");
        shortcutsRef.current = shortcuts;
      }
    }, stryMutAct_9fa48("21749") ? [] : (stryCov_9fa48("21749"), [shortcuts]));
    useEffect(() => {
      if (stryMutAct_9fa48("21750")) {
        {}
      } else {
        stryCov_9fa48("21750");
        if (stryMutAct_9fa48("21753") ? shortcuts.length !== 0 : stryMutAct_9fa48("21752") ? false : stryMutAct_9fa48("21751") ? true : (stryCov_9fa48("21751", "21752", "21753"), shortcuts.length === 0)) return;
        const handleKeyDown = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("21754")) {
            {}
          } else {
            stryCov_9fa48("21754");
            // Usar la referencia actual para evitar problemas de closure
            const currentShortcuts = shortcutsRef.current;
            // Ignorar si el usuario está escribiendo en un input
            const target = event.target as HTMLElement;
            if (stryMutAct_9fa48("21757") ? (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.isContentEditable : stryMutAct_9fa48("21756") ? false : stryMutAct_9fa48("21755") ? true : (stryCov_9fa48("21755", "21756", "21757"), (stryMutAct_9fa48("21759") ? target.tagName === 'INPUT' && target.tagName === 'TEXTAREA' : stryMutAct_9fa48("21758") ? false : (stryCov_9fa48("21758", "21759"), (stryMutAct_9fa48("21761") ? target.tagName !== 'INPUT' : stryMutAct_9fa48("21760") ? false : (stryCov_9fa48("21760", "21761"), target.tagName === (stryMutAct_9fa48("21762") ? "" : (stryCov_9fa48("21762"), 'INPUT')))) || (stryMutAct_9fa48("21764") ? target.tagName !== 'TEXTAREA' : stryMutAct_9fa48("21763") ? false : (stryCov_9fa48("21763", "21764"), target.tagName === (stryMutAct_9fa48("21765") ? "" : (stryCov_9fa48("21765"), 'TEXTAREA')))))) || target.isContentEditable)) {
              if (stryMutAct_9fa48("21766")) {
                {}
              } else {
                stryCov_9fa48("21766");
                // Permitir algunos atajos incluso en inputs (como Escape, flechas, números)
                const allowedKeys = stryMutAct_9fa48("21767") ? [] : (stryCov_9fa48("21767"), [stryMutAct_9fa48("21768") ? "" : (stryCov_9fa48("21768"), 'Escape'), stryMutAct_9fa48("21769") ? "" : (stryCov_9fa48("21769"), 'ArrowLeft'), stryMutAct_9fa48("21770") ? "" : (stryCov_9fa48("21770"), 'ArrowRight'), stryMutAct_9fa48("21771") ? "" : (stryCov_9fa48("21771"), '1'), stryMutAct_9fa48("21772") ? "" : (stryCov_9fa48("21772"), '2'), stryMutAct_9fa48("21773") ? "" : (stryCov_9fa48("21773"), '3'), stryMutAct_9fa48("21774") ? "" : (stryCov_9fa48("21774"), '4'), stryMutAct_9fa48("21775") ? "" : (stryCov_9fa48("21775"), 'b'), stryMutAct_9fa48("21776") ? "" : (stryCov_9fa48("21776"), 'B')]);
                if (stryMutAct_9fa48("21779") ? !allowedKeys.includes(event.key) && !event.ctrlKey || !event.metaKey : stryMutAct_9fa48("21778") ? false : stryMutAct_9fa48("21777") ? true : (stryCov_9fa48("21777", "21778", "21779"), (stryMutAct_9fa48("21781") ? !allowedKeys.includes(event.key) || !event.ctrlKey : stryMutAct_9fa48("21780") ? true : (stryCov_9fa48("21780", "21781"), (stryMutAct_9fa48("21782") ? allowedKeys.includes(event.key) : (stryCov_9fa48("21782"), !allowedKeys.includes(event.key))) && (stryMutAct_9fa48("21783") ? event.ctrlKey : (stryCov_9fa48("21783"), !event.ctrlKey)))) && (stryMutAct_9fa48("21784") ? event.metaKey : (stryCov_9fa48("21784"), !event.metaKey)))) {
                  if (stryMutAct_9fa48("21785")) {
                    {}
                  } else {
                    stryCov_9fa48("21785");
                    return;
                  }
                }
              }
            }
            for (const shortcut of currentShortcuts) {
              if (stryMutAct_9fa48("21786")) {
                {}
              } else {
                stryCov_9fa48("21786");
                const keyMatches = stryMutAct_9fa48("21789") ? shortcut.key.toLowerCase() !== event.key.toLowerCase() : stryMutAct_9fa48("21788") ? false : stryMutAct_9fa48("21787") ? true : (stryCov_9fa48("21787", "21788", "21789"), (stryMutAct_9fa48("21790") ? shortcut.key.toUpperCase() : (stryCov_9fa48("21790"), shortcut.key.toLowerCase())) === (stryMutAct_9fa48("21791") ? event.key.toUpperCase() : (stryCov_9fa48("21791"), event.key.toLowerCase())));
                const ctrlMatches = (stryMutAct_9fa48("21794") ? shortcut.ctrl === undefined : stryMutAct_9fa48("21793") ? false : stryMutAct_9fa48("21792") ? true : (stryCov_9fa48("21792", "21793", "21794"), shortcut.ctrl !== undefined)) ? shortcut.ctrl ? stryMutAct_9fa48("21797") ? event.ctrlKey && event.metaKey : stryMutAct_9fa48("21796") ? false : stryMutAct_9fa48("21795") ? true : (stryCov_9fa48("21795", "21796", "21797"), event.ctrlKey || event.metaKey) : stryMutAct_9fa48("21800") ? !event.ctrlKey || !event.metaKey : stryMutAct_9fa48("21799") ? false : stryMutAct_9fa48("21798") ? true : (stryCov_9fa48("21798", "21799", "21800"), (stryMutAct_9fa48("21801") ? event.ctrlKey : (stryCov_9fa48("21801"), !event.ctrlKey)) && (stryMutAct_9fa48("21802") ? event.metaKey : (stryCov_9fa48("21802"), !event.metaKey))) : stryMutAct_9fa48("21803") ? false : (stryCov_9fa48("21803"), true);
                const shiftMatches = (stryMutAct_9fa48("21806") ? shortcut.shift === undefined : stryMutAct_9fa48("21805") ? false : stryMutAct_9fa48("21804") ? true : (stryCov_9fa48("21804", "21805", "21806"), shortcut.shift !== undefined)) ? shortcut.shift ? event.shiftKey : stryMutAct_9fa48("21807") ? event.shiftKey : (stryCov_9fa48("21807"), !event.shiftKey) : stryMutAct_9fa48("21808") ? false : (stryCov_9fa48("21808"), true);
                const altMatches = (stryMutAct_9fa48("21811") ? shortcut.alt === undefined : stryMutAct_9fa48("21810") ? false : stryMutAct_9fa48("21809") ? true : (stryCov_9fa48("21809", "21810", "21811"), shortcut.alt !== undefined)) ? shortcut.alt ? event.altKey : stryMutAct_9fa48("21812") ? event.altKey : (stryCov_9fa48("21812"), !event.altKey) : stryMutAct_9fa48("21813") ? false : (stryCov_9fa48("21813"), true);
                if (stryMutAct_9fa48("21816") ? keyMatches && ctrlMatches && shiftMatches || altMatches : stryMutAct_9fa48("21815") ? false : stryMutAct_9fa48("21814") ? true : (stryCov_9fa48("21814", "21815", "21816"), (stryMutAct_9fa48("21818") ? keyMatches && ctrlMatches || shiftMatches : stryMutAct_9fa48("21817") ? true : (stryCov_9fa48("21817", "21818"), (stryMutAct_9fa48("21820") ? keyMatches || ctrlMatches : stryMutAct_9fa48("21819") ? true : (stryCov_9fa48("21819", "21820"), keyMatches && ctrlMatches)) && shiftMatches)) && altMatches)) {
                  if (stryMutAct_9fa48("21821")) {
                    {}
                  } else {
                    stryCov_9fa48("21821");
                    event.preventDefault();
                    shortcut.action();
                    break;
                  }
                }
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("21822") ? "" : (stryCov_9fa48("21822"), 'keydown'), handleKeyDown);
        return stryMutAct_9fa48("21823") ? () => undefined : (stryCov_9fa48("21823"), () => window.removeEventListener(stryMutAct_9fa48("21824") ? "" : (stryCov_9fa48("21824"), 'keydown'), handleKeyDown));
      }
    }, stryMutAct_9fa48("21825") ? ["Stryker was here"] : (stryCov_9fa48("21825"), [])); // Dependencias vacías porque usamos ref para shortcuts actuales
  }
}

/**
 * Atajos de teclado globales estándar
 */
export const globalShortcuts = stryMutAct_9fa48("21826") ? () => undefined : (stryCov_9fa48("21826"), (() => {
  const globalShortcuts = (router: ReturnType<typeof useRouter>) => stryMutAct_9fa48("21827") ? [] : (stryCov_9fa48("21827"), [stryMutAct_9fa48("21828") ? {} : (stryCov_9fa48("21828"), {
    key: stryMutAct_9fa48("21829") ? "" : (stryCov_9fa48("21829"), 'k'),
    ctrl: stryMutAct_9fa48("21830") ? false : (stryCov_9fa48("21830"), true),
    description: stryMutAct_9fa48("21831") ? "" : (stryCov_9fa48("21831"), 'Abrir búsqueda global'),
    action: () => {
      if (stryMutAct_9fa48("21832")) {
        {}
      } else {
        stryCov_9fa48("21832");
        // Disparar evento para abrir búsqueda
        const event = new KeyboardEvent(stryMutAct_9fa48("21833") ? "" : (stryCov_9fa48("21833"), 'keydown'), stryMutAct_9fa48("21834") ? {} : (stryCov_9fa48("21834"), {
          key: stryMutAct_9fa48("21835") ? "" : (stryCov_9fa48("21835"), 'k'),
          ctrlKey: stryMutAct_9fa48("21836") ? false : (stryCov_9fa48("21836"), true),
          bubbles: stryMutAct_9fa48("21837") ? false : (stryCov_9fa48("21837"), true)
        }));
        document.dispatchEvent(event);
      }
    },
    category: stryMutAct_9fa48("21838") ? "" : (stryCov_9fa48("21838"), 'navegación')
  }), stryMutAct_9fa48("21839") ? {} : (stryCov_9fa48("21839"), {
    key: stryMutAct_9fa48("21840") ? "" : (stryCov_9fa48("21840"), 'd'),
    ctrl: stryMutAct_9fa48("21841") ? false : (stryCov_9fa48("21841"), true),
    shift: stryMutAct_9fa48("21842") ? false : (stryCov_9fa48("21842"), true),
    description: stryMutAct_9fa48("21843") ? "" : (stryCov_9fa48("21843"), 'Ir al Dashboard'),
    action: stryMutAct_9fa48("21844") ? () => undefined : (stryCov_9fa48("21844"), () => router.push(stryMutAct_9fa48("21845") ? "" : (stryCov_9fa48("21845"), '/dashboard'))),
    category: stryMutAct_9fa48("21846") ? "" : (stryCov_9fa48("21846"), 'navegación')
  }), stryMutAct_9fa48("21847") ? {} : (stryCov_9fa48("21847"), {
    key: stryMutAct_9fa48("21848") ? "" : (stryCov_9fa48("21848"), 'e'),
    ctrl: stryMutAct_9fa48("21849") ? false : (stryCov_9fa48("21849"), true),
    shift: stryMutAct_9fa48("21850") ? false : (stryCov_9fa48("21850"), true),
    description: stryMutAct_9fa48("21851") ? "" : (stryCov_9fa48("21851"), 'Ir a Exámenes'),
    action: stryMutAct_9fa48("21852") ? () => undefined : (stryCov_9fa48("21852"), () => router.push(stryMutAct_9fa48("21853") ? "" : (stryCov_9fa48("21853"), '/exams'))),
    category: stryMutAct_9fa48("21854") ? "" : (stryCov_9fa48("21854"), 'navegación')
  }), stryMutAct_9fa48("21855") ? {} : (stryCov_9fa48("21855"), {
    key: stryMutAct_9fa48("21856") ? "" : (stryCov_9fa48("21856"), 'p'),
    ctrl: stryMutAct_9fa48("21857") ? false : (stryCov_9fa48("21857"), true),
    shift: stryMutAct_9fa48("21858") ? false : (stryCov_9fa48("21858"), true),
    description: stryMutAct_9fa48("21859") ? "" : (stryCov_9fa48("21859"), 'Ir a Perfil'),
    action: stryMutAct_9fa48("21860") ? () => undefined : (stryCov_9fa48("21860"), () => router.push(stryMutAct_9fa48("21861") ? "" : (stryCov_9fa48("21861"), '/profile'))),
    category: stryMutAct_9fa48("21862") ? "" : (stryCov_9fa48("21862"), 'navegación')
  }), stryMutAct_9fa48("21863") ? {} : (stryCov_9fa48("21863"), {
    key: stryMutAct_9fa48("21864") ? "" : (stryCov_9fa48("21864"), 'f'),
    ctrl: stryMutAct_9fa48("21865") ? false : (stryCov_9fa48("21865"), true),
    shift: stryMutAct_9fa48("21866") ? false : (stryCov_9fa48("21866"), true),
    description: stryMutAct_9fa48("21867") ? "" : (stryCov_9fa48("21867"), 'Ir a Flashcards'),
    action: stryMutAct_9fa48("21868") ? () => undefined : (stryCov_9fa48("21868"), () => router.push(stryMutAct_9fa48("21869") ? "" : (stryCov_9fa48("21869"), '/flashcards'))),
    category: stryMutAct_9fa48("21870") ? "" : (stryCov_9fa48("21870"), 'navegación')
  }), stryMutAct_9fa48("21871") ? {} : (stryCov_9fa48("21871"), {
    key: stryMutAct_9fa48("21872") ? "" : (stryCov_9fa48("21872"), 'n'),
    ctrl: stryMutAct_9fa48("21873") ? false : (stryCov_9fa48("21873"), true),
    shift: stryMutAct_9fa48("21874") ? false : (stryCov_9fa48("21874"), true),
    description: stryMutAct_9fa48("21875") ? "" : (stryCov_9fa48("21875"), 'Ir a Notas'),
    action: stryMutAct_9fa48("21876") ? () => undefined : (stryCov_9fa48("21876"), () => router.push(stryMutAct_9fa48("21877") ? "" : (stryCov_9fa48("21877"), '/notes'))),
    category: stryMutAct_9fa48("21878") ? "" : (stryCov_9fa48("21878"), 'navegación')
  }), stryMutAct_9fa48("21879") ? {} : (stryCov_9fa48("21879"), {
    key: stryMutAct_9fa48("21880") ? "" : (stryCov_9fa48("21880"), 'h'),
    ctrl: stryMutAct_9fa48("21881") ? false : (stryCov_9fa48("21881"), true),
    shift: stryMutAct_9fa48("21882") ? false : (stryCov_9fa48("21882"), true),
    description: stryMutAct_9fa48("21883") ? "" : (stryCov_9fa48("21883"), 'Ir a Ayuda'),
    action: stryMutAct_9fa48("21884") ? () => undefined : (stryCov_9fa48("21884"), () => router.push(stryMutAct_9fa48("21885") ? "" : (stryCov_9fa48("21885"), '/help'))),
    category: stryMutAct_9fa48("21886") ? "" : (stryCov_9fa48("21886"), 'navegación')
  })]);
  return globalShortcuts;
})());

/**
 * Atajos de teclado para exámenes
 */
export const examShortcuts = stryMutAct_9fa48("21887") ? () => undefined : (stryCov_9fa48("21887"), (() => {
  const examShortcuts = (onPrevious: () => void, onNext: () => void, onSelectOption: (index: number) => void, onBookmark?: () => void, onFinish?: () => void) => stryMutAct_9fa48("21888") ? [] : (stryCov_9fa48("21888"), [stryMutAct_9fa48("21889") ? {} : (stryCov_9fa48("21889"), {
    key: stryMutAct_9fa48("21890") ? "" : (stryCov_9fa48("21890"), 'ArrowLeft'),
    description: stryMutAct_9fa48("21891") ? "" : (stryCov_9fa48("21891"), 'Pregunta anterior'),
    action: onPrevious,
    category: stryMutAct_9fa48("21892") ? "" : (stryCov_9fa48("21892"), 'navegación')
  }), stryMutAct_9fa48("21893") ? {} : (stryCov_9fa48("21893"), {
    key: stryMutAct_9fa48("21894") ? "" : (stryCov_9fa48("21894"), 'ArrowRight'),
    description: stryMutAct_9fa48("21895") ? "" : (stryCov_9fa48("21895"), 'Siguiente pregunta'),
    action: onNext,
    category: stryMutAct_9fa48("21896") ? "" : (stryCov_9fa48("21896"), 'navegación')
  }), stryMutAct_9fa48("21897") ? {} : (stryCov_9fa48("21897"), {
    key: stryMutAct_9fa48("21898") ? "" : (stryCov_9fa48("21898"), '1'),
    description: stryMutAct_9fa48("21899") ? "" : (stryCov_9fa48("21899"), 'Seleccionar opción 1'),
    action: stryMutAct_9fa48("21900") ? () => undefined : (stryCov_9fa48("21900"), () => onSelectOption(0)),
    category: stryMutAct_9fa48("21901") ? "" : (stryCov_9fa48("21901"), 'respuesta')
  }), stryMutAct_9fa48("21902") ? {} : (stryCov_9fa48("21902"), {
    key: stryMutAct_9fa48("21903") ? "" : (stryCov_9fa48("21903"), '2'),
    description: stryMutAct_9fa48("21904") ? "" : (stryCov_9fa48("21904"), 'Seleccionar opción 2'),
    action: stryMutAct_9fa48("21905") ? () => undefined : (stryCov_9fa48("21905"), () => onSelectOption(1)),
    category: stryMutAct_9fa48("21906") ? "" : (stryCov_9fa48("21906"), 'respuesta')
  }), stryMutAct_9fa48("21907") ? {} : (stryCov_9fa48("21907"), {
    key: stryMutAct_9fa48("21908") ? "" : (stryCov_9fa48("21908"), '3'),
    description: stryMutAct_9fa48("21909") ? "" : (stryCov_9fa48("21909"), 'Seleccionar opción 3'),
    action: stryMutAct_9fa48("21910") ? () => undefined : (stryCov_9fa48("21910"), () => onSelectOption(2)),
    category: stryMutAct_9fa48("21911") ? "" : (stryCov_9fa48("21911"), 'respuesta')
  }), stryMutAct_9fa48("21912") ? {} : (stryCov_9fa48("21912"), {
    key: stryMutAct_9fa48("21913") ? "" : (stryCov_9fa48("21913"), '4'),
    description: stryMutAct_9fa48("21914") ? "" : (stryCov_9fa48("21914"), 'Seleccionar opción 4'),
    action: stryMutAct_9fa48("21915") ? () => undefined : (stryCov_9fa48("21915"), () => onSelectOption(3)),
    category: stryMutAct_9fa48("21916") ? "" : (stryCov_9fa48("21916"), 'respuesta')
  }), stryMutAct_9fa48("21917") ? {} : (stryCov_9fa48("21917"), {
    key: stryMutAct_9fa48("21918") ? "" : (stryCov_9fa48("21918"), 'b'),
    description: stryMutAct_9fa48("21919") ? "" : (stryCov_9fa48("21919"), 'Marcar/desmarcar favorito'),
    action: stryMutAct_9fa48("21922") ? onBookmark && (() => {}) : stryMutAct_9fa48("21921") ? false : stryMutAct_9fa48("21920") ? true : (stryCov_9fa48("21920", "21921", "21922"), onBookmark || (() => {})),
    category: stryMutAct_9fa48("21923") ? "" : (stryCov_9fa48("21923"), 'acción')
  }), stryMutAct_9fa48("21924") ? {} : (stryCov_9fa48("21924"), {
    key: stryMutAct_9fa48("21925") ? "" : (stryCov_9fa48("21925"), 'Enter'),
    shift: stryMutAct_9fa48("21926") ? false : (stryCov_9fa48("21926"), true),
    description: stryMutAct_9fa48("21927") ? "" : (stryCov_9fa48("21927"), 'Finalizar examen'),
    action: stryMutAct_9fa48("21930") ? onFinish && (() => {}) : stryMutAct_9fa48("21929") ? false : stryMutAct_9fa48("21928") ? true : (stryCov_9fa48("21928", "21929", "21930"), onFinish || (() => {})),
    category: stryMutAct_9fa48("21931") ? "" : (stryCov_9fa48("21931"), 'acción')
  })]);
  return examShortcuts;
})());