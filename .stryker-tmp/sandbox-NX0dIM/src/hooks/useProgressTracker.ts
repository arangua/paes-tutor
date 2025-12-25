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
import { useState, useCallback, useRef } from 'react';
export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}
export interface ProgressTrackerOptions {
  totalSteps?: number;
  onProgress?: (progress: number, current: number, total: number, message: string) => void;
  onStepChange?: (step: ProgressStep) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para rastrear progreso granular de operaciones
 * Basado en estándares de Google Drive, Dropbox, VS Code
 */
export function useProgressTracker(options: ProgressTrackerOptions = {}) {
  if (stryMutAct_9fa48("21954")) {
    {}
  } else {
    stryCov_9fa48("21954");
    const [progress, setProgress] = useState(0);
    const [current, setCurrent] = useState(0);
    const [total, setTotal] = useState(stryMutAct_9fa48("21957") ? options.totalSteps && 0 : stryMutAct_9fa48("21956") ? false : stryMutAct_9fa48("21955") ? true : (stryCov_9fa48("21955", "21956", "21957"), options.totalSteps || 0));
    const [message, setMessage] = useState(stryMutAct_9fa48("21958") ? "Stryker was here!" : (stryCov_9fa48("21958"), ''));
    const [steps, setSteps] = useState<ProgressStep[]>(stryMutAct_9fa48("21959") ? ["Stryker was here"] : (stryCov_9fa48("21959"), []));
    const [isActive, setIsActive] = useState(stryMutAct_9fa48("21960") ? true : (stryCov_9fa48("21960"), false));
    const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef<number | null>(null);
    const updateProgress = useCallback((currentValue: number, totalValue: number, stepMessage?: string) => {
      if (stryMutAct_9fa48("21961")) {
        {}
      } else {
        stryCov_9fa48("21961");
        const newProgress = (stryMutAct_9fa48("21965") ? totalValue <= 0 : stryMutAct_9fa48("21964") ? totalValue >= 0 : stryMutAct_9fa48("21963") ? false : stryMutAct_9fa48("21962") ? true : (stryCov_9fa48("21962", "21963", "21964", "21965"), totalValue > 0)) ? Math.round(stryMutAct_9fa48("21966") ? currentValue / totalValue / 100 : (stryCov_9fa48("21966"), (stryMutAct_9fa48("21967") ? currentValue * totalValue : (stryCov_9fa48("21967"), currentValue / totalValue)) * 100)) : 0;
        setCurrent(currentValue);
        setTotal(totalValue);
        setProgress(newProgress);
        if (stryMutAct_9fa48("21969") ? false : stryMutAct_9fa48("21968") ? true : (stryCov_9fa48("21968", "21969"), stepMessage)) {
          if (stryMutAct_9fa48("21970")) {
            {}
          } else {
            stryCov_9fa48("21970");
            setMessage(stepMessage);
          }
        }

        // Calcular tiempo estimado
        const now = Date.now();
        if (stryMutAct_9fa48("21973") ? startTimeRef.current !== null : stryMutAct_9fa48("21972") ? false : stryMutAct_9fa48("21971") ? true : (stryCov_9fa48("21971", "21972", "21973"), startTimeRef.current === null)) {
          if (stryMutAct_9fa48("21974")) {
            {}
          } else {
            stryCov_9fa48("21974");
            startTimeRef.current = now;
            lastUpdateTimeRef.current = now;
            return;
          }
        }
        if (stryMutAct_9fa48("21977") ? lastUpdateTimeRef.current || currentValue > 0 : stryMutAct_9fa48("21976") ? false : stryMutAct_9fa48("21975") ? true : (stryCov_9fa48("21975", "21976", "21977"), lastUpdateTimeRef.current && (stryMutAct_9fa48("21980") ? currentValue <= 0 : stryMutAct_9fa48("21979") ? currentValue >= 0 : stryMutAct_9fa48("21978") ? true : (stryCov_9fa48("21978", "21979", "21980"), currentValue > 0)))) {
          if (stryMutAct_9fa48("21981")) {
            {}
          } else {
            stryCov_9fa48("21981");
            const elapsed = stryMutAct_9fa48("21982") ? (now - startTimeRef.current) * 1000 : (stryCov_9fa48("21982"), (stryMutAct_9fa48("21983") ? now + startTimeRef.current : (stryCov_9fa48("21983"), now - startTimeRef.current)) / 1000); // segundos
            const rate = stryMutAct_9fa48("21984") ? currentValue * elapsed : (stryCov_9fa48("21984"), currentValue / elapsed); // items por segundo
            const remaining = stryMutAct_9fa48("21985") ? totalValue + currentValue : (stryCov_9fa48("21985"), totalValue - currentValue);
            const estimated = stryMutAct_9fa48("21986") ? remaining * rate : (stryCov_9fa48("21986"), remaining / rate); // segundos restantes

            if (stryMutAct_9fa48("21989") ? estimated > 0 || estimated < 3600 : stryMutAct_9fa48("21988") ? false : stryMutAct_9fa48("21987") ? true : (stryCov_9fa48("21987", "21988", "21989"), (stryMutAct_9fa48("21992") ? estimated <= 0 : stryMutAct_9fa48("21991") ? estimated >= 0 : stryMutAct_9fa48("21990") ? true : (stryCov_9fa48("21990", "21991", "21992"), estimated > 0)) && (stryMutAct_9fa48("21995") ? estimated >= 3600 : stryMutAct_9fa48("21994") ? estimated <= 3600 : stryMutAct_9fa48("21993") ? true : (stryCov_9fa48("21993", "21994", "21995"), estimated < 3600)))) {
              if (stryMutAct_9fa48("21996")) {
                {}
              } else {
                stryCov_9fa48("21996");
                // Solo mostrar si es menos de 1 hora
                setEstimatedTimeRemaining(Math.round(estimated));
              }
            }
          }
        }
        lastUpdateTimeRef.current = now;

        // Llamar callbacks
        if (stryMutAct_9fa48("21998") ? false : stryMutAct_9fa48("21997") ? true : (stryCov_9fa48("21997", "21998"), options.onProgress)) {
          if (stryMutAct_9fa48("21999")) {
            {}
          } else {
            stryCov_9fa48("21999");
            options.onProgress(newProgress, currentValue, totalValue, stryMutAct_9fa48("22002") ? stepMessage && message : stryMutAct_9fa48("22001") ? false : stryMutAct_9fa48("22000") ? true : (stryCov_9fa48("22000", "22001", "22002"), stepMessage || message));
          }
        }
      }
    }, stryMutAct_9fa48("22003") ? [] : (stryCov_9fa48("22003"), [message, options]));
    const addStep = useCallback((step: Omit<ProgressStep, 'status'>) => {
      if (stryMutAct_9fa48("22004")) {
        {}
      } else {
        stryCov_9fa48("22004");
        const newStep: ProgressStep = stryMutAct_9fa48("22005") ? {} : (stryCov_9fa48("22005"), {
          ...step,
          status: stryMutAct_9fa48("22006") ? "" : (stryCov_9fa48("22006"), 'pending')
        });
        setSteps(stryMutAct_9fa48("22007") ? () => undefined : (stryCov_9fa48("22007"), prev => stryMutAct_9fa48("22008") ? [] : (stryCov_9fa48("22008"), [...prev, newStep])));
        return newStep.id;
      }
    }, stryMutAct_9fa48("22009") ? ["Stryker was here"] : (stryCov_9fa48("22009"), []));
    const updateStep = useCallback((stepId: string, updates: Partial<ProgressStep>) => {
      if (stryMutAct_9fa48("22010")) {
        {}
      } else {
        stryCov_9fa48("22010");
        setSteps(stryMutAct_9fa48("22011") ? () => undefined : (stryCov_9fa48("22011"), prev => prev.map(stryMutAct_9fa48("22012") ? () => undefined : (stryCov_9fa48("22012"), step => (stryMutAct_9fa48("22015") ? step.id !== stepId : stryMutAct_9fa48("22014") ? false : stryMutAct_9fa48("22013") ? true : (stryCov_9fa48("22013", "22014", "22015"), step.id === stepId)) ? stryMutAct_9fa48("22016") ? {} : (stryCov_9fa48("22016"), {
          ...step,
          ...updates
        }) : step))));
        const updatedStep = steps.find(stryMutAct_9fa48("22017") ? () => undefined : (stryCov_9fa48("22017"), s => stryMutAct_9fa48("22020") ? s.id !== stepId : stryMutAct_9fa48("22019") ? false : stryMutAct_9fa48("22018") ? true : (stryCov_9fa48("22018", "22019", "22020"), s.id === stepId)));
        if (stryMutAct_9fa48("22023") ? updatedStep || options.onStepChange : stryMutAct_9fa48("22022") ? false : stryMutAct_9fa48("22021") ? true : (stryCov_9fa48("22021", "22022", "22023"), updatedStep && options.onStepChange)) {
          if (stryMutAct_9fa48("22024")) {
            {}
          } else {
            stryCov_9fa48("22024");
            options.onStepChange(stryMutAct_9fa48("22025") ? {} : (stryCov_9fa48("22025"), {
              ...updatedStep,
              ...updates
            }));
          }
        }
      }
    }, stryMutAct_9fa48("22026") ? [] : (stryCov_9fa48("22026"), [steps, options]));
    const startStep = useCallback((stepId: string) => {
      if (stryMutAct_9fa48("22027")) {
        {}
      } else {
        stryCov_9fa48("22027");
        updateStep(stepId, stryMutAct_9fa48("22028") ? {} : (stryCov_9fa48("22028"), {
          status: stryMutAct_9fa48("22029") ? "" : (stryCov_9fa48("22029"), 'processing')
        }));
      }
    }, stryMutAct_9fa48("22030") ? [] : (stryCov_9fa48("22030"), [updateStep]));
    const completeStep = useCallback((stepId: string) => {
      if (stryMutAct_9fa48("22031")) {
        {}
      } else {
        stryCov_9fa48("22031");
        updateStep(stepId, stryMutAct_9fa48("22032") ? {} : (stryCov_9fa48("22032"), {
          status: stryMutAct_9fa48("22033") ? "" : (stryCov_9fa48("22033"), 'completed')
        }));
      }
    }, stryMutAct_9fa48("22034") ? [] : (stryCov_9fa48("22034"), [updateStep]));
    const errorStep = useCallback((stepId: string, error: string) => {
      if (stryMutAct_9fa48("22035")) {
        {}
      } else {
        stryCov_9fa48("22035");
        updateStep(stepId, stryMutAct_9fa48("22036") ? {} : (stryCov_9fa48("22036"), {
          status: stryMutAct_9fa48("22037") ? "" : (stryCov_9fa48("22037"), 'error'),
          error
        }));
      }
    }, stryMutAct_9fa48("22038") ? [] : (stryCov_9fa48("22038"), [updateStep]));
    const start = useCallback((totalSteps: number, initialMessage = stryMutAct_9fa48("22039") ? "" : (stryCov_9fa48("22039"), 'Iniciando...')) => {
      if (stryMutAct_9fa48("22040")) {
        {}
      } else {
        stryCov_9fa48("22040");
        setIsActive(stryMutAct_9fa48("22041") ? false : (stryCov_9fa48("22041"), true));
        setProgress(0);
        setCurrent(0);
        setTotal(totalSteps);
        setMessage(initialMessage);
        setSteps(stryMutAct_9fa48("22042") ? ["Stryker was here"] : (stryCov_9fa48("22042"), []));
        setEstimatedTimeRemaining(null);
        startTimeRef.current = Date.now();
        lastUpdateTimeRef.current = Date.now();
      }
    }, stryMutAct_9fa48("22043") ? ["Stryker was here"] : (stryCov_9fa48("22043"), []));
    const reset = useCallback(() => {
      if (stryMutAct_9fa48("22044")) {
        {}
      } else {
        stryCov_9fa48("22044");
        setIsActive(stryMutAct_9fa48("22045") ? true : (stryCov_9fa48("22045"), false));
        setProgress(0);
        setCurrent(0);
        setTotal(0);
        setMessage(stryMutAct_9fa48("22046") ? "Stryker was here!" : (stryCov_9fa48("22046"), ''));
        setSteps(stryMutAct_9fa48("22047") ? ["Stryker was here"] : (stryCov_9fa48("22047"), []));
        setEstimatedTimeRemaining(null);
        startTimeRef.current = null;
        lastUpdateTimeRef.current = null;
      }
    }, stryMutAct_9fa48("22048") ? ["Stryker was here"] : (stryCov_9fa48("22048"), []));
    const complete = useCallback(() => {
      if (stryMutAct_9fa48("22049")) {
        {}
      } else {
        stryCov_9fa48("22049");
        setIsActive(stryMutAct_9fa48("22050") ? true : (stryCov_9fa48("22050"), false));
        setProgress(100);
        setEstimatedTimeRemaining(0);
        if (stryMutAct_9fa48("22052") ? false : stryMutAct_9fa48("22051") ? true : (stryCov_9fa48("22051", "22052"), options.onComplete)) {
          if (stryMutAct_9fa48("22053")) {
            {}
          } else {
            stryCov_9fa48("22053");
            options.onComplete();
          }
        }
      }
    }, stryMutAct_9fa48("22054") ? [] : (stryCov_9fa48("22054"), [options]));
    const fail = useCallback((error: Error) => {
      if (stryMutAct_9fa48("22055")) {
        {}
      } else {
        stryCov_9fa48("22055");
        setIsActive(stryMutAct_9fa48("22056") ? true : (stryCov_9fa48("22056"), false));
        if (stryMutAct_9fa48("22058") ? false : stryMutAct_9fa48("22057") ? true : (stryCov_9fa48("22057", "22058"), options.onError)) {
          if (stryMutAct_9fa48("22059")) {
            {}
          } else {
            stryCov_9fa48("22059");
            options.onError(error);
          }
        }
      }
    }, stryMutAct_9fa48("22060") ? [] : (stryCov_9fa48("22060"), [options]));
    return stryMutAct_9fa48("22061") ? {} : (stryCov_9fa48("22061"), {
      progress,
      current,
      total,
      message,
      steps,
      isActive,
      estimatedTimeRemaining,
      updateProgress,
      addStep,
      updateStep,
      startStep,
      completeStep,
      errorStep,
      start,
      reset,
      complete,
      fail
    });
  }
}