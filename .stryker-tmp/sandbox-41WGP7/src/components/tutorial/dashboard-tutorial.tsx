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
import { InteractiveTutorial, TutorialStep } from './interactive-tutorial';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
const DASHBOARD_TUTORIAL_STEPS: TutorialStep[] = stryMutAct_9fa48("19853") ? [] : (stryCov_9fa48("19853"), [stryMutAct_9fa48("19854") ? {} : (stryCov_9fa48("19854"), {
  id: stryMutAct_9fa48("19855") ? "" : (stryCov_9fa48("19855"), 'welcome'),
  title: stryMutAct_9fa48("19856") ? "" : (stryCov_9fa48("19856"), '¡Bienvenido al Dashboard!'),
  description: stryMutAct_9fa48("19857") ? "" : (stryCov_9fa48("19857"), 'Este es tu centro de control. Aquí verás tu progreso, estadísticas y recomendaciones personalizadas.')
}), stryMutAct_9fa48("19858") ? {} : (stryCov_9fa48("19858"), {
  id: stryMutAct_9fa48("19859") ? "" : (stryCov_9fa48("19859"), 'stats'),
  title: stryMutAct_9fa48("19860") ? "" : (stryCov_9fa48("19860"), 'Tarjetas de Estadísticas'),
  description: stryMutAct_9fa48("19861") ? "" : (stryCov_9fa48("19861"), 'Estas tarjetas muestran tu progreso general: total de intentos, promedio, asignaturas y mejor puntaje.'),
  target: stryMutAct_9fa48("19862") ? "" : (stryCov_9fa48("19862"), '[data-tutorial="stats-cards"]'),
  position: stryMutAct_9fa48("19863") ? "" : (stryCov_9fa48("19863"), 'bottom')
}), stryMutAct_9fa48("19864") ? {} : (stryCov_9fa48("19864"), {
  id: stryMutAct_9fa48("19865") ? "" : (stryCov_9fa48("19865"), 'quick-actions'),
  title: stryMutAct_9fa48("19866") ? "" : (stryCov_9fa48("19866"), 'Accesos Rápidos'),
  description: stryMutAct_9fa48("19867") ? "" : (stryCov_9fa48("19867"), 'Usa estos botones para acceder rápidamente a las funciones más importantes. También puedes usar atajos de teclado (presiona ? para verlos).'),
  target: stryMutAct_9fa48("19868") ? "" : (stryCov_9fa48("19868"), '[data-tutorial="quick-actions"]'),
  position: stryMutAct_9fa48("19869") ? "" : (stryCov_9fa48("19869"), 'bottom')
}), stryMutAct_9fa48("19870") ? {} : (stryCov_9fa48("19870"), {
  id: stryMutAct_9fa48("19871") ? "" : (stryCov_9fa48("19871"), 'charts'),
  title: stryMutAct_9fa48("19872") ? "" : (stryCov_9fa48("19872"), 'Gráficos de Rendimiento'),
  description: stryMutAct_9fa48("19873") ? "" : (stryCov_9fa48("19873"), 'Los gráficos te ayudan a visualizar tu progreso. Puedes colapsar esta sección si prefieres ver menos información.'),
  target: stryMutAct_9fa48("19874") ? "" : (stryCov_9fa48("19874"), '[data-tutorial="charts"]'),
  position: stryMutAct_9fa48("19875") ? "" : (stryCov_9fa48("19875"), 'top')
}), stryMutAct_9fa48("19876") ? {} : (stryCov_9fa48("19876"), {
  id: stryMutAct_9fa48("19877") ? "" : (stryCov_9fa48("19877"), 'recommendations'),
  title: stryMutAct_9fa48("19878") ? "" : (stryCov_9fa48("19878"), 'Recomendaciones'),
  description: stryMutAct_9fa48("19879") ? "" : (stryCov_9fa48("19879"), 'Basado en tu rendimiento, el sistema te sugiere temas y acciones para mejorar. Revisa estas recomendaciones regularmente.'),
  target: stryMutAct_9fa48("19880") ? "" : (stryCov_9fa48("19880"), '[data-tutorial="recommendations"]'),
  position: stryMutAct_9fa48("19881") ? "" : (stryCov_9fa48("19881"), 'top')
}), stryMutAct_9fa48("19882") ? {} : (stryCov_9fa48("19882"), {
  id: stryMutAct_9fa48("19883") ? "" : (stryCov_9fa48("19883"), 'complete'),
  title: stryMutAct_9fa48("19884") ? "" : (stryCov_9fa48("19884"), '¡Listo para comenzar!'),
  description: stryMutAct_9fa48("19885") ? "" : (stryCov_9fa48("19885"), 'Ya conoces lo básico. Explora las diferentes secciones y usa los atajos de teclado (?) para navegar más rápido.')
})]);
export function DashboardTutorial() {
  if (stryMutAct_9fa48("19886")) {
    {}
  } else {
    stryCov_9fa48("19886");
    const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("19887") ? true : (stryCov_9fa48("19887"), false));
    const [hasSeenTutorial, setHasSeenTutorial] = useState(stryMutAct_9fa48("19888") ? true : (stryCov_9fa48("19888"), false));

    // Verificar si ya se completó el tutorial
    useEffect(() => {
      if (stryMutAct_9fa48("19889")) {
        {}
      } else {
        stryCov_9fa48("19889");
        if (stryMutAct_9fa48("19892") ? typeof window !== 'undefined' : stryMutAct_9fa48("19891") ? false : stryMutAct_9fa48("19890") ? true : (stryCov_9fa48("19890", "19891", "19892"), typeof window === (stryMutAct_9fa48("19893") ? "" : (stryCov_9fa48("19893"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("19894")) {
            {}
          } else {
            stryCov_9fa48("19894");
            const saved = localStorage.getItem(stryMutAct_9fa48("19895") ? "" : (stryCov_9fa48("19895"), 'dashboard-tutorial-completed'));
            if (stryMutAct_9fa48("19897") ? false : stryMutAct_9fa48("19896") ? true : (stryCov_9fa48("19896", "19897"), saved)) {
              if (stryMutAct_9fa48("19898")) {
                {}
              } else {
                stryCov_9fa48("19898");
                const data = JSON.parse(saved);
                if (stryMutAct_9fa48("19901") ? data.completed && data.skipped : stryMutAct_9fa48("19900") ? false : stryMutAct_9fa48("19899") ? true : (stryCov_9fa48("19899", "19900", "19901"), data.completed || data.skipped)) {
                  if (stryMutAct_9fa48("19902")) {
                    {}
                  } else {
                    stryCov_9fa48("19902");
                    setHasSeenTutorial(stryMutAct_9fa48("19903") ? false : (stryCov_9fa48("19903"), true));
                  }
                }
              }
            }
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("19904") ? ["Stryker was here"] : (stryCov_9fa48("19904"), []));

    // No mostrar nada si ya se vio el tutorial
    if (stryMutAct_9fa48("19907") ? hasSeenTutorial || !isOpen : stryMutAct_9fa48("19906") ? false : stryMutAct_9fa48("19905") ? true : (stryCov_9fa48("19905", "19906", "19907"), hasSeenTutorial && (stryMutAct_9fa48("19908") ? isOpen : (stryCov_9fa48("19908"), !isOpen)))) {
      if (stryMutAct_9fa48("19909")) {
        {}
      } else {
        stryCov_9fa48("19909");
        return null;
      }
    }
    return <>
      {stryMutAct_9fa48("19912") ? !hasSeenTutorial && !isOpen || <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={() => setIsOpen(true)} className="shadow-lg" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Iniciar Tutorial
          </Button>
        </div> : stryMutAct_9fa48("19911") ? false : stryMutAct_9fa48("19910") ? true : (stryCov_9fa48("19910", "19911", "19912"), (stryMutAct_9fa48("19914") ? !hasSeenTutorial || !isOpen : stryMutAct_9fa48("19913") ? true : (stryCov_9fa48("19913", "19914"), (stryMutAct_9fa48("19915") ? hasSeenTutorial : (stryCov_9fa48("19915"), !hasSeenTutorial)) && (stryMutAct_9fa48("19916") ? isOpen : (stryCov_9fa48("19916"), !isOpen)))) && <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={stryMutAct_9fa48("19917") ? () => undefined : (stryCov_9fa48("19917"), () => setIsOpen(stryMutAct_9fa48("19918") ? false : (stryCov_9fa48("19918"), true)))} className="shadow-lg" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Iniciar Tutorial
          </Button>
        </div>)}
      <InteractiveTutorial steps={DASHBOARD_TUTORIAL_STEPS} storageKey="dashboard-tutorial-completed" open={isOpen} disableSpotlight={stryMutAct_9fa48("19919") ? false : (stryCov_9fa48("19919"), true)} // Efecto telescopio desactivado por defecto (cambiar a false para activarlo)
      onComplete={() => {
        if (stryMutAct_9fa48("19920")) {
          {}
        } else {
          stryCov_9fa48("19920");
          setIsOpen(stryMutAct_9fa48("19921") ? true : (stryCov_9fa48("19921"), false));
          setHasSeenTutorial(stryMutAct_9fa48("19922") ? false : (stryCov_9fa48("19922"), true));
        }
      }} onSkip={() => {
        if (stryMutAct_9fa48("19923")) {
          {}
        } else {
          stryCov_9fa48("19923");
          setIsOpen(stryMutAct_9fa48("19924") ? true : (stryCov_9fa48("19924"), false));
          setHasSeenTutorial(stryMutAct_9fa48("19925") ? false : (stryCov_9fa48("19925"), true));
        }
      }} />
    </>;
  }
}