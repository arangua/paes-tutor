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
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TIME_CONSTANTS, UI_CONSTANTS, CSS_TRANSFORM_CONSTANTS } from '@/lib/constants';
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // Selector CSS del elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void; // Acción a ejecutar (ej: abrir un diálogo)
  highlight?: boolean; // Si debe destacar el elemento
}
interface InteractiveTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
  storageKey?: string; // Para guardar progreso
  open?: boolean; // Si el tutorial está abierto/activo
  autoStart?: boolean; // Si debe iniciarse automáticamente
  disableSpotlight?: boolean; // Desactivar el efecto "telescopio"
}

/**
 * Tutorial interactivo con highlights y guía paso a paso
 * Basado en estándares de Linear, Notion, Figma
 */
export function InteractiveTutorial({
  steps,
  onComplete,
  onSkip,
  storageKey = stryMutAct_9fa48("19926") ? "" : (stryCov_9fa48("19926"), 'tutorial-progress'),
  open: controlledOpen,
  autoStart = stryMutAct_9fa48("19927") ? true : (stryCov_9fa48("19927"), false),
  disableSpotlight = stryMutAct_9fa48("19928") ? true : (stryCov_9fa48("19928"), false)
}: InteractiveTutorialProps) {
  if (stryMutAct_9fa48("19929")) {
    {}
  } else {
    stryCov_9fa48("19929");
    const [internalOpen, setInternalOpen] = useState(autoStart);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<ReturnType<typeof getTooltipPosition>>(stryMutAct_9fa48("19930") ? {} : (stryCov_9fa48("19930"), {
      top: stryMutAct_9fa48("19931") ? "" : (stryCov_9fa48("19931"), '50%'),
      left: stryMutAct_9fa48("19932") ? "" : (stryCov_9fa48("19932"), '50%'),
      transform: stryMutAct_9fa48("19933") ? "" : (stryCov_9fa48("19933"), 'translate(-50%, -50%)'),
      position: stryMutAct_9fa48("19934") ? "" : (stryCov_9fa48("19934"), 'fixed')
    }));
    const overlayRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const positionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Determinar si el tutorial está abierto
    const isOpen = (stryMutAct_9fa48("19937") ? controlledOpen === undefined : stryMutAct_9fa48("19936") ? false : stryMutAct_9fa48("19935") ? true : (stryCov_9fa48("19935", "19936", "19937"), controlledOpen !== undefined)) ? controlledOpen : internalOpen;

    // Cargar progreso guardado y verificar si ya se completó
    useEffect(() => {
      if (stryMutAct_9fa48("19938")) {
        {}
      } else {
        stryCov_9fa48("19938");
        if (stryMutAct_9fa48("19941") ? typeof window === 'undefined' && !storageKey : stryMutAct_9fa48("19940") ? false : stryMutAct_9fa48("19939") ? true : (stryCov_9fa48("19939", "19940", "19941"), (stryMutAct_9fa48("19943") ? typeof window !== 'undefined' : stryMutAct_9fa48("19942") ? false : (stryCov_9fa48("19942", "19943"), typeof window === (stryMutAct_9fa48("19944") ? "" : (stryCov_9fa48("19944"), 'undefined')))) || (stryMutAct_9fa48("19945") ? storageKey : (stryCov_9fa48("19945"), !storageKey)))) return;
        try {
          if (stryMutAct_9fa48("19946")) {
            {}
          } else {
            stryCov_9fa48("19946");
            const saved = localStorage.getItem(storageKey);
            if (stryMutAct_9fa48("19948") ? false : stryMutAct_9fa48("19947") ? true : (stryCov_9fa48("19947", "19948"), saved)) {
              if (stryMutAct_9fa48("19949")) {
                {}
              } else {
                stryCov_9fa48("19949");
                const data = JSON.parse(saved);
                // Si ya está completado o saltado, no iniciar automáticamente
                if (stryMutAct_9fa48("19952") ? data.completed && data.skipped : stryMutAct_9fa48("19951") ? false : stryMutAct_9fa48("19950") ? true : (stryCov_9fa48("19950", "19951", "19952"), data.completed || data.skipped)) {
                  if (stryMutAct_9fa48("19953")) {
                    {}
                  } else {
                    stryCov_9fa48("19953");
                    setInternalOpen(stryMutAct_9fa48("19954") ? true : (stryCov_9fa48("19954"), false));
                    return;
                  }
                }
                if (stryMutAct_9fa48("19956") ? false : stryMutAct_9fa48("19955") ? true : (stryCov_9fa48("19955", "19956"), data.completedSteps)) {
                  if (stryMutAct_9fa48("19957")) {
                    {}
                  } else {
                    stryCov_9fa48("19957");
                    setCompletedSteps(new Set(data.completedSteps));
                  }
                }
                if (stryMutAct_9fa48("19960") ? data.currentStep === undefined : stryMutAct_9fa48("19959") ? false : stryMutAct_9fa48("19958") ? true : (stryCov_9fa48("19958", "19959", "19960"), data.currentStep !== undefined)) {
                  if (stryMutAct_9fa48("19961")) {
                    {}
                  } else {
                    stryCov_9fa48("19961");
                    setCurrentStep(data.currentStep);
                  }
                }
              }
            }
            // Si autoStart está activo y no hay datos guardados, iniciar
            if (stryMutAct_9fa48("19964") ? autoStart || !saved : stryMutAct_9fa48("19963") ? false : stryMutAct_9fa48("19962") ? true : (stryCov_9fa48("19962", "19963", "19964"), autoStart && (stryMutAct_9fa48("19965") ? saved : (stryCov_9fa48("19965"), !saved)))) {
              if (stryMutAct_9fa48("19966")) {
                {}
              } else {
                stryCov_9fa48("19966");
                setInternalOpen(stryMutAct_9fa48("19967") ? false : (stryCov_9fa48("19967"), true));
              }
            }
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("19968") ? [] : (stryCov_9fa48("19968"), [storageKey, autoStart]));

    // Guardar progreso
    useEffect(() => {
      if (stryMutAct_9fa48("19969")) {
        {}
      } else {
        stryCov_9fa48("19969");
        if (stryMutAct_9fa48("19972") ? typeof window === 'undefined' && !storageKey : stryMutAct_9fa48("19971") ? false : stryMutAct_9fa48("19970") ? true : (stryCov_9fa48("19970", "19971", "19972"), (stryMutAct_9fa48("19974") ? typeof window !== 'undefined' : stryMutAct_9fa48("19973") ? false : (stryCov_9fa48("19973", "19974"), typeof window === (stryMutAct_9fa48("19975") ? "" : (stryCov_9fa48("19975"), 'undefined')))) || (stryMutAct_9fa48("19976") ? storageKey : (stryCov_9fa48("19976"), !storageKey)))) return;
        try {
          if (stryMutAct_9fa48("19977")) {
            {}
          } else {
            stryCov_9fa48("19977");
            localStorage.setItem(storageKey, JSON.stringify(stryMutAct_9fa48("19978") ? {} : (stryCov_9fa48("19978"), {
              currentStep,
              completedSteps: Array.from(completedSteps)
            })));
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("19979") ? [] : (stryCov_9fa48("19979"), [currentStep, completedSteps, storageKey]));
    const currentStepData = steps[currentStep];
    const isLastStep = stryMutAct_9fa48("19982") ? currentStep !== steps.length - 1 : stryMutAct_9fa48("19981") ? false : stryMutAct_9fa48("19980") ? true : (stryCov_9fa48("19980", "19981", "19982"), currentStep === (stryMutAct_9fa48("19983") ? steps.length + 1 : (stryCov_9fa48("19983"), steps.length - 1)));
    const progress = stryMutAct_9fa48("19984") ? (currentStep + 1) / steps.length / 100 : (stryCov_9fa48("19984"), (stryMutAct_9fa48("19985") ? (currentStep + 1) * steps.length : (stryCov_9fa48("19985"), (stryMutAct_9fa48("19986") ? currentStep - 1 : (stryCov_9fa48("19986"), currentStep + 1)) / steps.length)) * 100);

    // Función para calcular posición (extraída para reutilizar)
    const calculateTooltipPosition = useCallback((): ReturnType<typeof getTooltipPosition> => {
      if (stryMutAct_9fa48("19987")) {
        {}
      } else {
        stryCov_9fa48("19987");
        if (stryMutAct_9fa48("19990") ? !highlightedElement && !currentStepData : stryMutAct_9fa48("19989") ? false : stryMutAct_9fa48("19988") ? true : (stryCov_9fa48("19988", "19989", "19990"), (stryMutAct_9fa48("19991") ? highlightedElement : (stryCov_9fa48("19991"), !highlightedElement)) || (stryMutAct_9fa48("19992") ? currentStepData : (stryCov_9fa48("19992"), !currentStepData)))) {
          if (stryMutAct_9fa48("19993")) {
            {}
          } else {
            stryCov_9fa48("19993");
            return stryMutAct_9fa48("19994") ? {} : (stryCov_9fa48("19994"), {
              top: stryMutAct_9fa48("19995") ? "" : (stryCov_9fa48("19995"), '50%'),
              left: stryMutAct_9fa48("19996") ? "" : (stryCov_9fa48("19996"), '50%'),
              transform: stryMutAct_9fa48("19997") ? "" : (stryCov_9fa48("19997"), 'translate(-50%, -50%)'),
              position: 'fixed' as const
            });
          }
        }
        const rect = highlightedElement.getBoundingClientRect();
        const preferredPosition = stryMutAct_9fa48("20000") ? currentStepData.position && 'bottom' : stryMutAct_9fa48("19999") ? false : stryMutAct_9fa48("19998") ? true : (stryCov_9fa48("19998", "19999", "20000"), currentStepData.position || (stryMutAct_9fa48("20001") ? "" : (stryCov_9fa48("20001"), 'bottom')));

        // Usar dimensiones reales si están disponibles, sino estimadas
        const tooltipWidth = stryMutAct_9fa48("20004") ? tooltipRef.current?.offsetWidth && UI_CONSTANTS.TOOLTIP.DEFAULT_WIDTH : stryMutAct_9fa48("20003") ? false : stryMutAct_9fa48("20002") ? true : (stryCov_9fa48("20002", "20003", "20004"), (stryMutAct_9fa48("20005") ? tooltipRef.current.offsetWidth : (stryCov_9fa48("20005"), tooltipRef.current?.offsetWidth)) || UI_CONSTANTS.TOOLTIP.DEFAULT_WIDTH);
        const tooltipHeight = stryMutAct_9fa48("20008") ? tooltipRef.current?.offsetHeight && UI_CONSTANTS.TOOLTIP.DEFAULT_HEIGHT : stryMutAct_9fa48("20007") ? false : stryMutAct_9fa48("20006") ? true : (stryCov_9fa48("20006", "20007", "20008"), (stryMutAct_9fa48("20009") ? tooltipRef.current.offsetHeight : (stryCov_9fa48("20009"), tooltipRef.current?.offsetHeight)) || UI_CONSTANTS.TOOLTIP.DEFAULT_HEIGHT);
        const padding = UI_CONSTANTS.TOOLTIP.PADDING;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let top = 0;
        let left = 0;
        let transformX = CSS_TRANSFORM_CONSTANTS.CENTER;
        let transformY = CSS_TRANSFORM_CONSTANTS.BOTTOM;
        switch (preferredPosition) {
          case stryMutAct_9fa48("20011") ? "" : (stryCov_9fa48("20011"), 'top'):
            if (stryMutAct_9fa48("20010")) {} else {
              stryCov_9fa48("20010");
              top = stryMutAct_9fa48("20012") ? rect.top - tooltipHeight + padding : (stryCov_9fa48("20012"), (stryMutAct_9fa48("20013") ? rect.top + tooltipHeight : (stryCov_9fa48("20013"), rect.top - tooltipHeight)) - padding);
              left = stryMutAct_9fa48("20014") ? rect.left - rect.width / 2 : (stryCov_9fa48("20014"), rect.left + (stryMutAct_9fa48("20015") ? rect.width * 2 : (stryCov_9fa48("20015"), rect.width / 2)));
              transformY = CSS_TRANSFORM_CONSTANTS.TOP;
              break;
            }
          case stryMutAct_9fa48("20017") ? "" : (stryCov_9fa48("20017"), 'bottom'):
            if (stryMutAct_9fa48("20016")) {} else {
              stryCov_9fa48("20016");
              top = stryMutAct_9fa48("20018") ? rect.bottom - padding : (stryCov_9fa48("20018"), rect.bottom + padding);
              left = stryMutAct_9fa48("20019") ? rect.left - rect.width / 2 : (stryCov_9fa48("20019"), rect.left + (stryMutAct_9fa48("20020") ? rect.width * 2 : (stryCov_9fa48("20020"), rect.width / 2)));
              transformY = CSS_TRANSFORM_CONSTANTS.BOTTOM;
              break;
            }
          case stryMutAct_9fa48("20022") ? "" : (stryCov_9fa48("20022"), 'left'):
            if (stryMutAct_9fa48("20021")) {} else {
              stryCov_9fa48("20021");
              top = stryMutAct_9fa48("20023") ? rect.top - rect.height / 2 : (stryCov_9fa48("20023"), rect.top + (stryMutAct_9fa48("20024") ? rect.height * 2 : (stryCov_9fa48("20024"), rect.height / 2)));
              left = stryMutAct_9fa48("20025") ? rect.left - tooltipWidth + padding : (stryCov_9fa48("20025"), (stryMutAct_9fa48("20026") ? rect.left + tooltipWidth : (stryCov_9fa48("20026"), rect.left - tooltipWidth)) - padding);
              transformX = CSS_TRANSFORM_CONSTANTS.LEFT;
              transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
              break;
            }
          case stryMutAct_9fa48("20028") ? "" : (stryCov_9fa48("20028"), 'right'):
            if (stryMutAct_9fa48("20027")) {} else {
              stryCov_9fa48("20027");
              top = stryMutAct_9fa48("20029") ? rect.top - rect.height / 2 : (stryCov_9fa48("20029"), rect.top + (stryMutAct_9fa48("20030") ? rect.height * 2 : (stryCov_9fa48("20030"), rect.height / 2)));
              left = stryMutAct_9fa48("20031") ? rect.right - padding : (stryCov_9fa48("20031"), rect.right + padding);
              transformX = CSS_TRANSFORM_CONSTANTS.RIGHT;
              transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
              break;
            }
          default:
            if (stryMutAct_9fa48("20032")) {} else {
              stryCov_9fa48("20032");
              top = stryMutAct_9fa48("20033") ? rect.top - rect.height / 2 : (stryCov_9fa48("20033"), rect.top + (stryMutAct_9fa48("20034") ? rect.height * 2 : (stryCov_9fa48("20034"), rect.height / 2)));
              left = stryMutAct_9fa48("20035") ? rect.left - rect.width / 2 : (stryCov_9fa48("20035"), rect.left + (stryMutAct_9fa48("20036") ? rect.width * 2 : (stryCov_9fa48("20036"), rect.width / 2)));
              transformX = CSS_TRANSFORM_CONSTANTS.CENTER;
              transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
            }
        }

        // Función auxiliar para calcular la posición real del tooltip considerando el transform
        const getActualBounds = (top: number, left: number, transformX: string, transformY: string) => {
          if (stryMutAct_9fa48("20037")) {
            {}
          } else {
            stryCov_9fa48("20037");
            let actualTop = top;
            let actualLeft = left;
            let actualRight = left;
            let actualBottom = top;

            // Calcular posición real considerando transform
            if (stryMutAct_9fa48("20040") ? transformY !== CSS_TRANSFORM_CONSTANTS.TOP : stryMutAct_9fa48("20039") ? false : stryMutAct_9fa48("20038") ? true : (stryCov_9fa48("20038", "20039", "20040"), transformY === CSS_TRANSFORM_CONSTANTS.TOP)) {
              if (stryMutAct_9fa48("20041")) {
                {}
              } else {
                stryCov_9fa48("20041");
                // Tooltip arriba: top es la parte inferior del tooltip
                actualTop = stryMutAct_9fa48("20042") ? top + tooltipHeight : (stryCov_9fa48("20042"), top - tooltipHeight);
                actualBottom = top;
              }
            } else if (stryMutAct_9fa48("20045") ? transformY !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20044") ? false : stryMutAct_9fa48("20043") ? true : (stryCov_9fa48("20043", "20044", "20045"), transformY === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20046")) {
                {}
              } else {
                stryCov_9fa48("20046");
                // Tooltip centrado verticalmente
                actualTop = stryMutAct_9fa48("20047") ? top + tooltipHeight / 2 : (stryCov_9fa48("20047"), top - (stryMutAct_9fa48("20048") ? tooltipHeight * 2 : (stryCov_9fa48("20048"), tooltipHeight / 2)));
                actualBottom = stryMutAct_9fa48("20049") ? top - tooltipHeight / 2 : (stryCov_9fa48("20049"), top + (stryMutAct_9fa48("20050") ? tooltipHeight * 2 : (stryCov_9fa48("20050"), tooltipHeight / 2)));
              }
            } else {
              if (stryMutAct_9fa48("20051")) {
                {}
              } else {
                stryCov_9fa48("20051");
                // Tooltip abajo: top es la parte superior del tooltip
                actualTop = top;
                actualBottom = stryMutAct_9fa48("20052") ? top - tooltipHeight : (stryCov_9fa48("20052"), top + tooltipHeight);
              }
            }
            if (stryMutAct_9fa48("20055") ? transformX !== CSS_TRANSFORM_CONSTANTS.LEFT : stryMutAct_9fa48("20054") ? false : stryMutAct_9fa48("20053") ? true : (stryCov_9fa48("20053", "20054", "20055"), transformX === CSS_TRANSFORM_CONSTANTS.LEFT)) {
              if (stryMutAct_9fa48("20056")) {
                {}
              } else {
                stryCov_9fa48("20056");
                // Tooltip a la izquierda: left es la parte derecha del tooltip
                actualLeft = stryMutAct_9fa48("20057") ? left + tooltipWidth : (stryCov_9fa48("20057"), left - tooltipWidth);
                actualRight = left;
              }
            } else if (stryMutAct_9fa48("20060") ? transformX !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20059") ? false : stryMutAct_9fa48("20058") ? true : (stryCov_9fa48("20058", "20059", "20060"), transformX === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20061")) {
                {}
              } else {
                stryCov_9fa48("20061");
                // Tooltip centrado horizontalmente
                actualLeft = stryMutAct_9fa48("20062") ? left + tooltipWidth / 2 : (stryCov_9fa48("20062"), left - (stryMutAct_9fa48("20063") ? tooltipWidth * 2 : (stryCov_9fa48("20063"), tooltipWidth / 2)));
                actualRight = stryMutAct_9fa48("20064") ? left - tooltipWidth / 2 : (stryCov_9fa48("20064"), left + (stryMutAct_9fa48("20065") ? tooltipWidth * 2 : (stryCov_9fa48("20065"), tooltipWidth / 2)));
              }
            } else {
              if (stryMutAct_9fa48("20066")) {
                {}
              } else {
                stryCov_9fa48("20066");
                // Tooltip a la derecha: left es la parte izquierda del tooltip
                actualLeft = left;
                actualRight = stryMutAct_9fa48("20067") ? left - tooltipWidth : (stryCov_9fa48("20067"), left + tooltipWidth);
              }
            }
            return stryMutAct_9fa48("20068") ? {} : (stryCov_9fa48("20068"), {
              actualTop,
              actualBottom,
              actualLeft,
              actualRight
            });
          }
        };

        // Validar y ajustar posición vertical
        let attempts = 0;
        const maxAttempts = UI_CONSTANTS.TOOLTIP.MAX_POSITION_ATTEMPTS;
        while (stryMutAct_9fa48("20071") ? attempts >= maxAttempts : stryMutAct_9fa48("20070") ? attempts <= maxAttempts : stryMutAct_9fa48("20069") ? false : (stryCov_9fa48("20069", "20070", "20071"), attempts < maxAttempts)) {
          if (stryMutAct_9fa48("20072")) {
            {}
          } else {
            stryCov_9fa48("20072");
            const bounds = getActualBounds(top, left, transformX, transformY);

            // Verificar si se sale por arriba
            if (stryMutAct_9fa48("20076") ? bounds.actualTop >= padding : stryMutAct_9fa48("20075") ? bounds.actualTop <= padding : stryMutAct_9fa48("20074") ? false : stryMutAct_9fa48("20073") ? true : (stryCov_9fa48("20073", "20074", "20075", "20076"), bounds.actualTop < padding)) {
              if (stryMutAct_9fa48("20077")) {
                {}
              } else {
                stryCov_9fa48("20077");
                if (stryMutAct_9fa48("20080") ? transformY !== CSS_TRANSFORM_CONSTANTS.TOP : stryMutAct_9fa48("20079") ? false : stryMutAct_9fa48("20078") ? true : (stryCov_9fa48("20078", "20079", "20080"), transformY === CSS_TRANSFORM_CONSTANTS.TOP)) {
                  if (stryMutAct_9fa48("20081")) {
                    {}
                  } else {
                    stryCov_9fa48("20081");
                    // Cambiar a bottom
                    top = stryMutAct_9fa48("20082") ? rect.bottom - padding : (stryCov_9fa48("20082"), rect.bottom + padding);
                    transformY = CSS_TRANSFORM_CONSTANTS.BOTTOM;
                  }
                } else if (stryMutAct_9fa48("20085") ? transformY !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20084") ? false : stryMutAct_9fa48("20083") ? true : (stryCov_9fa48("20083", "20084", "20085"), transformY === CSS_TRANSFORM_CONSTANTS.CENTER)) {
                  if (stryMutAct_9fa48("20086")) {
                    {}
                  } else {
                    stryCov_9fa48("20086");
                    // Mover hacia abajo
                    top = stryMutAct_9fa48("20087") ? padding - tooltipHeight / 2 : (stryCov_9fa48("20087"), padding + (stryMutAct_9fa48("20088") ? tooltipHeight * 2 : (stryCov_9fa48("20088"), tooltipHeight / 2)));
                    transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
                  }
                } else {
                  if (stryMutAct_9fa48("20089")) {
                    {}
                  } else {
                    stryCov_9fa48("20089");
                    // Ya está en bottom, centrar si es necesario
                    top = stryMutAct_9fa48("20090") ? Math.min(padding, Math.min(viewportHeight - tooltipHeight - padding, (viewportHeight - tooltipHeight) / 2)) : (stryCov_9fa48("20090"), Math.max(padding, stryMutAct_9fa48("20091") ? Math.max(viewportHeight - tooltipHeight - padding, (viewportHeight - tooltipHeight) / 2) : (stryCov_9fa48("20091"), Math.min(stryMutAct_9fa48("20092") ? viewportHeight - tooltipHeight + padding : (stryCov_9fa48("20092"), (stryMutAct_9fa48("20093") ? viewportHeight + tooltipHeight : (stryCov_9fa48("20093"), viewportHeight - tooltipHeight)) - padding), stryMutAct_9fa48("20094") ? (viewportHeight - tooltipHeight) * 2 : (stryCov_9fa48("20094"), (stryMutAct_9fa48("20095") ? viewportHeight + tooltipHeight : (stryCov_9fa48("20095"), viewportHeight - tooltipHeight)) / 2)))));
                    transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
                  }
                }
                stryMutAct_9fa48("20096") ? attempts-- : (stryCov_9fa48("20096"), attempts++);
                continue;
              }
            }

            // Verificar si se sale por abajo
            if (stryMutAct_9fa48("20100") ? bounds.actualBottom <= viewportHeight - padding : stryMutAct_9fa48("20099") ? bounds.actualBottom >= viewportHeight - padding : stryMutAct_9fa48("20098") ? false : stryMutAct_9fa48("20097") ? true : (stryCov_9fa48("20097", "20098", "20099", "20100"), bounds.actualBottom > (stryMutAct_9fa48("20101") ? viewportHeight + padding : (stryCov_9fa48("20101"), viewportHeight - padding)))) {
              if (stryMutAct_9fa48("20102")) {
                {}
              } else {
                stryCov_9fa48("20102");
                if (stryMutAct_9fa48("20105") ? transformY !== CSS_TRANSFORM_CONSTANTS.BOTTOM : stryMutAct_9fa48("20104") ? false : stryMutAct_9fa48("20103") ? true : (stryCov_9fa48("20103", "20104", "20105"), transformY === CSS_TRANSFORM_CONSTANTS.BOTTOM)) {
                  if (stryMutAct_9fa48("20106")) {
                    {}
                  } else {
                    stryCov_9fa48("20106");
                    // Cambiar a top
                    const topPos = stryMutAct_9fa48("20107") ? rect.top - tooltipHeight + padding : (stryCov_9fa48("20107"), (stryMutAct_9fa48("20108") ? rect.top + tooltipHeight : (stryCov_9fa48("20108"), rect.top - tooltipHeight)) - padding);
                    if (stryMutAct_9fa48("20112") ? topPos < padding : stryMutAct_9fa48("20111") ? topPos > padding : stryMutAct_9fa48("20110") ? false : stryMutAct_9fa48("20109") ? true : (stryCov_9fa48("20109", "20110", "20111", "20112"), topPos >= padding)) {
                      if (stryMutAct_9fa48("20113")) {
                        {}
                      } else {
                        stryCov_9fa48("20113");
                        top = topPos;
                        transformY = CSS_TRANSFORM_CONSTANTS.TOP;
                      }
                    } else {
                      if (stryMutAct_9fa48("20114")) {
                        {}
                      } else {
                        stryCov_9fa48("20114");
                        // Centrar si no cabe arriba
                        top = stryMutAct_9fa48("20115") ? Math.min(padding + tooltipHeight / 2, (viewportHeight - tooltipHeight) / 2) : (stryCov_9fa48("20115"), Math.max(stryMutAct_9fa48("20116") ? padding - tooltipHeight / 2 : (stryCov_9fa48("20116"), padding + (stryMutAct_9fa48("20117") ? tooltipHeight * 2 : (stryCov_9fa48("20117"), tooltipHeight / 2))), stryMutAct_9fa48("20118") ? (viewportHeight - tooltipHeight) * 2 : (stryCov_9fa48("20118"), (stryMutAct_9fa48("20119") ? viewportHeight + tooltipHeight : (stryCov_9fa48("20119"), viewportHeight - tooltipHeight)) / 2)));
                        transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
                      }
                    }
                  }
                } else if (stryMutAct_9fa48("20122") ? transformY !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20121") ? false : stryMutAct_9fa48("20120") ? true : (stryCov_9fa48("20120", "20121", "20122"), transformY === CSS_TRANSFORM_CONSTANTS.CENTER)) {
                  if (stryMutAct_9fa48("20123")) {
                    {}
                  } else {
                    stryCov_9fa48("20123");
                    // Mover hacia arriba
                    top = stryMutAct_9fa48("20124") ? viewportHeight - padding + tooltipHeight / 2 : (stryCov_9fa48("20124"), (stryMutAct_9fa48("20125") ? viewportHeight + padding : (stryCov_9fa48("20125"), viewportHeight - padding)) - (stryMutAct_9fa48("20126") ? tooltipHeight * 2 : (stryCov_9fa48("20126"), tooltipHeight / 2)));
                    transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
                  }
                } else {
                  if (stryMutAct_9fa48("20127")) {
                    {}
                  } else {
                    stryCov_9fa48("20127");
                    // Ya está en top, centrar si es necesario
                    top = stryMutAct_9fa48("20128") ? Math.min(padding + tooltipHeight / 2, (viewportHeight - tooltipHeight) / 2) : (stryCov_9fa48("20128"), Math.max(stryMutAct_9fa48("20129") ? padding - tooltipHeight / 2 : (stryCov_9fa48("20129"), padding + (stryMutAct_9fa48("20130") ? tooltipHeight * 2 : (stryCov_9fa48("20130"), tooltipHeight / 2))), stryMutAct_9fa48("20131") ? (viewportHeight - tooltipHeight) * 2 : (stryCov_9fa48("20131"), (stryMutAct_9fa48("20132") ? viewportHeight + tooltipHeight : (stryCov_9fa48("20132"), viewportHeight - tooltipHeight)) / 2)));
                    transformY = CSS_TRANSFORM_CONSTANTS.CENTER;
                  }
                }
                stryMutAct_9fa48("20133") ? attempts-- : (stryCov_9fa48("20133"), attempts++);
                continue;
              }
            }

            // Si llegamos aquí, está bien verticalmente
            break;
          }
        }

        // Validar y ajustar posición horizontal
        const bounds = getActualBounds(top, left, transformX, transformY);
        if (stryMutAct_9fa48("20137") ? bounds.actualLeft >= padding : stryMutAct_9fa48("20136") ? bounds.actualLeft <= padding : stryMutAct_9fa48("20135") ? false : stryMutAct_9fa48("20134") ? true : (stryCov_9fa48("20134", "20135", "20136", "20137"), bounds.actualLeft < padding)) {
          if (stryMutAct_9fa48("20138")) {
            {}
          } else {
            stryCov_9fa48("20138");
            if (stryMutAct_9fa48("20141") ? transformX !== CSS_TRANSFORM_CONSTANTS.LEFT : stryMutAct_9fa48("20140") ? false : stryMutAct_9fa48("20139") ? true : (stryCov_9fa48("20139", "20140", "20141"), transformX === CSS_TRANSFORM_CONSTANTS.LEFT)) {
              if (stryMutAct_9fa48("20142")) {
                {}
              } else {
                stryCov_9fa48("20142");
                left = stryMutAct_9fa48("20143") ? padding - tooltipWidth : (stryCov_9fa48("20143"), padding + tooltipWidth);
                transformX = CSS_TRANSFORM_CONSTANTS.RIGHT;
              }
            } else if (stryMutAct_9fa48("20146") ? transformX !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20145") ? false : stryMutAct_9fa48("20144") ? true : (stryCov_9fa48("20144", "20145", "20146"), transformX === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20147")) {
                {}
              } else {
                stryCov_9fa48("20147");
                left = stryMutAct_9fa48("20148") ? padding - tooltipWidth / 2 : (stryCov_9fa48("20148"), padding + (stryMutAct_9fa48("20149") ? tooltipWidth * 2 : (stryCov_9fa48("20149"), tooltipWidth / 2)));
                transformX = CSS_TRANSFORM_CONSTANTS.CENTER;
              }
            } else {
              if (stryMutAct_9fa48("20150")) {
                {}
              } else {
                stryCov_9fa48("20150");
                left = padding;
                transformX = CSS_TRANSFORM_CONSTANTS.RIGHT;
              }
            }
          }
        } else if (stryMutAct_9fa48("20154") ? bounds.actualRight <= viewportWidth - padding : stryMutAct_9fa48("20153") ? bounds.actualRight >= viewportWidth - padding : stryMutAct_9fa48("20152") ? false : stryMutAct_9fa48("20151") ? true : (stryCov_9fa48("20151", "20152", "20153", "20154"), bounds.actualRight > (stryMutAct_9fa48("20155") ? viewportWidth + padding : (stryCov_9fa48("20155"), viewportWidth - padding)))) {
          if (stryMutAct_9fa48("20156")) {
            {}
          } else {
            stryCov_9fa48("20156");
            if (stryMutAct_9fa48("20159") ? transformX !== CSS_TRANSFORM_CONSTANTS.RIGHT : stryMutAct_9fa48("20158") ? false : stryMutAct_9fa48("20157") ? true : (stryCov_9fa48("20157", "20158", "20159"), transformX === CSS_TRANSFORM_CONSTANTS.RIGHT)) {
              if (stryMutAct_9fa48("20160")) {
                {}
              } else {
                stryCov_9fa48("20160");
                left = stryMutAct_9fa48("20161") ? viewportWidth - padding + tooltipWidth : (stryCov_9fa48("20161"), (stryMutAct_9fa48("20162") ? viewportWidth + padding : (stryCov_9fa48("20162"), viewportWidth - padding)) - tooltipWidth);
                transformX = CSS_TRANSFORM_CONSTANTS.LEFT;
              }
            } else if (stryMutAct_9fa48("20165") ? transformX !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20164") ? false : stryMutAct_9fa48("20163") ? true : (stryCov_9fa48("20163", "20164", "20165"), transformX === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20166")) {
                {}
              } else {
                stryCov_9fa48("20166");
                left = stryMutAct_9fa48("20167") ? viewportWidth - padding + tooltipWidth / 2 : (stryCov_9fa48("20167"), (stryMutAct_9fa48("20168") ? viewportWidth + padding : (stryCov_9fa48("20168"), viewportWidth - padding)) - (stryMutAct_9fa48("20169") ? tooltipWidth * 2 : (stryCov_9fa48("20169"), tooltipWidth / 2)));
                transformX = CSS_TRANSFORM_CONSTANTS.CENTER;
              }
            } else {
              if (stryMutAct_9fa48("20170")) {
                {}
              } else {
                stryCov_9fa48("20170");
                left = stryMutAct_9fa48("20171") ? viewportWidth + padding : (stryCov_9fa48("20171"), viewportWidth - padding);
                transformX = CSS_TRANSFORM_CONSTANTS.LEFT;
              }
            }
          }
        }

        // Validación final: asegurar que siempre esté dentro del viewport
        const finalBounds = getActualBounds(top, left, transformX, transformY);

        // Ajustar verticalmente si aún se sale
        if (stryMutAct_9fa48("20175") ? finalBounds.actualTop >= padding : stryMutAct_9fa48("20174") ? finalBounds.actualTop <= padding : stryMutAct_9fa48("20173") ? false : stryMutAct_9fa48("20172") ? true : (stryCov_9fa48("20172", "20173", "20174", "20175"), finalBounds.actualTop < padding)) {
          if (stryMutAct_9fa48("20176")) {
            {}
          } else {
            stryCov_9fa48("20176");
            if (stryMutAct_9fa48("20179") ? transformY !== CSS_TRANSFORM_CONSTANTS.TOP : stryMutAct_9fa48("20178") ? false : stryMutAct_9fa48("20177") ? true : (stryCov_9fa48("20177", "20178", "20179"), transformY === CSS_TRANSFORM_CONSTANTS.TOP)) {
              if (stryMutAct_9fa48("20180")) {
                {}
              } else {
                stryCov_9fa48("20180");
                top = stryMutAct_9fa48("20181") ? padding - tooltipHeight : (stryCov_9fa48("20181"), padding + tooltipHeight);
              }
            } else if (stryMutAct_9fa48("20184") ? transformY !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20183") ? false : stryMutAct_9fa48("20182") ? true : (stryCov_9fa48("20182", "20183", "20184"), transformY === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20185")) {
                {}
              } else {
                stryCov_9fa48("20185");
                top = stryMutAct_9fa48("20186") ? padding - tooltipHeight / 2 : (stryCov_9fa48("20186"), padding + (stryMutAct_9fa48("20187") ? tooltipHeight * 2 : (stryCov_9fa48("20187"), tooltipHeight / 2)));
              }
            } else {
              if (stryMutAct_9fa48("20188")) {
                {}
              } else {
                stryCov_9fa48("20188");
                top = padding;
              }
            }
          }
        } else if (stryMutAct_9fa48("20192") ? finalBounds.actualBottom <= viewportHeight - padding : stryMutAct_9fa48("20191") ? finalBounds.actualBottom >= viewportHeight - padding : stryMutAct_9fa48("20190") ? false : stryMutAct_9fa48("20189") ? true : (stryCov_9fa48("20189", "20190", "20191", "20192"), finalBounds.actualBottom > (stryMutAct_9fa48("20193") ? viewportHeight + padding : (stryCov_9fa48("20193"), viewportHeight - padding)))) {
          if (stryMutAct_9fa48("20194")) {
            {}
          } else {
            stryCov_9fa48("20194");
            if (stryMutAct_9fa48("20197") ? transformY !== CSS_TRANSFORM_CONSTANTS.TOP : stryMutAct_9fa48("20196") ? false : stryMutAct_9fa48("20195") ? true : (stryCov_9fa48("20195", "20196", "20197"), transformY === CSS_TRANSFORM_CONSTANTS.TOP)) {
              if (stryMutAct_9fa48("20198")) {
                {}
              } else {
                stryCov_9fa48("20198");
                top = stryMutAct_9fa48("20199") ? viewportHeight + padding : (stryCov_9fa48("20199"), viewportHeight - padding);
              }
            } else if (stryMutAct_9fa48("20202") ? transformY !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20201") ? false : stryMutAct_9fa48("20200") ? true : (stryCov_9fa48("20200", "20201", "20202"), transformY === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20203")) {
                {}
              } else {
                stryCov_9fa48("20203");
                top = stryMutAct_9fa48("20204") ? viewportHeight - padding + tooltipHeight / 2 : (stryCov_9fa48("20204"), (stryMutAct_9fa48("20205") ? viewportHeight + padding : (stryCov_9fa48("20205"), viewportHeight - padding)) - (stryMutAct_9fa48("20206") ? tooltipHeight * 2 : (stryCov_9fa48("20206"), tooltipHeight / 2)));
              }
            } else {
              if (stryMutAct_9fa48("20207")) {
                {}
              } else {
                stryCov_9fa48("20207");
                top = stryMutAct_9fa48("20208") ? viewportHeight - padding + tooltipHeight : (stryCov_9fa48("20208"), (stryMutAct_9fa48("20209") ? viewportHeight + padding : (stryCov_9fa48("20209"), viewportHeight - padding)) - tooltipHeight);
              }
            }
          }
        }

        // Ajustar horizontalmente si aún se sale
        const finalBounds2 = getActualBounds(top, left, transformX, transformY);
        if (stryMutAct_9fa48("20213") ? finalBounds2.actualLeft >= padding : stryMutAct_9fa48("20212") ? finalBounds2.actualLeft <= padding : stryMutAct_9fa48("20211") ? false : stryMutAct_9fa48("20210") ? true : (stryCov_9fa48("20210", "20211", "20212", "20213"), finalBounds2.actualLeft < padding)) {
          if (stryMutAct_9fa48("20214")) {
            {}
          } else {
            stryCov_9fa48("20214");
            if (stryMutAct_9fa48("20217") ? transformX !== CSS_TRANSFORM_CONSTANTS.LEFT : stryMutAct_9fa48("20216") ? false : stryMutAct_9fa48("20215") ? true : (stryCov_9fa48("20215", "20216", "20217"), transformX === CSS_TRANSFORM_CONSTANTS.LEFT)) {
              if (stryMutAct_9fa48("20218")) {
                {}
              } else {
                stryCov_9fa48("20218");
                left = stryMutAct_9fa48("20219") ? padding - tooltipWidth : (stryCov_9fa48("20219"), padding + tooltipWidth);
              }
            } else if (stryMutAct_9fa48("20222") ? transformX !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20221") ? false : stryMutAct_9fa48("20220") ? true : (stryCov_9fa48("20220", "20221", "20222"), transformX === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20223")) {
                {}
              } else {
                stryCov_9fa48("20223");
                left = stryMutAct_9fa48("20224") ? padding - tooltipWidth / 2 : (stryCov_9fa48("20224"), padding + (stryMutAct_9fa48("20225") ? tooltipWidth * 2 : (stryCov_9fa48("20225"), tooltipWidth / 2)));
              }
            } else {
              if (stryMutAct_9fa48("20226")) {
                {}
              } else {
                stryCov_9fa48("20226");
                left = padding;
              }
            }
          }
        } else if (stryMutAct_9fa48("20230") ? finalBounds2.actualRight <= viewportWidth - padding : stryMutAct_9fa48("20229") ? finalBounds2.actualRight >= viewportWidth - padding : stryMutAct_9fa48("20228") ? false : stryMutAct_9fa48("20227") ? true : (stryCov_9fa48("20227", "20228", "20229", "20230"), finalBounds2.actualRight > (stryMutAct_9fa48("20231") ? viewportWidth + padding : (stryCov_9fa48("20231"), viewportWidth - padding)))) {
          if (stryMutAct_9fa48("20232")) {
            {}
          } else {
            stryCov_9fa48("20232");
            if (stryMutAct_9fa48("20235") ? transformX !== CSS_TRANSFORM_CONSTANTS.LEFT : stryMutAct_9fa48("20234") ? false : stryMutAct_9fa48("20233") ? true : (stryCov_9fa48("20233", "20234", "20235"), transformX === CSS_TRANSFORM_CONSTANTS.LEFT)) {
              if (stryMutAct_9fa48("20236")) {
                {}
              } else {
                stryCov_9fa48("20236");
                left = stryMutAct_9fa48("20237") ? viewportWidth + padding : (stryCov_9fa48("20237"), viewportWidth - padding);
              }
            } else if (stryMutAct_9fa48("20240") ? transformX !== CSS_TRANSFORM_CONSTANTS.CENTER : stryMutAct_9fa48("20239") ? false : stryMutAct_9fa48("20238") ? true : (stryCov_9fa48("20238", "20239", "20240"), transformX === CSS_TRANSFORM_CONSTANTS.CENTER)) {
              if (stryMutAct_9fa48("20241")) {
                {}
              } else {
                stryCov_9fa48("20241");
                left = stryMutAct_9fa48("20242") ? viewportWidth - padding + tooltipWidth / 2 : (stryCov_9fa48("20242"), (stryMutAct_9fa48("20243") ? viewportWidth + padding : (stryCov_9fa48("20243"), viewportWidth - padding)) - (stryMutAct_9fa48("20244") ? tooltipWidth * 2 : (stryCov_9fa48("20244"), tooltipWidth / 2)));
              }
            } else {
              if (stryMutAct_9fa48("20245")) {
                {}
              } else {
                stryCov_9fa48("20245");
                left = stryMutAct_9fa48("20246") ? viewportWidth - padding + tooltipWidth : (stryCov_9fa48("20246"), (stryMutAct_9fa48("20247") ? viewportWidth + padding : (stryCov_9fa48("20247"), viewportWidth - padding)) - tooltipWidth);
              }
            }
          }
        }
        return stryMutAct_9fa48("20248") ? {} : (stryCov_9fa48("20248"), {
          top: stryMutAct_9fa48("20249") ? `` : (stryCov_9fa48("20249"), `${top}px`),
          left: stryMutAct_9fa48("20250") ? `` : (stryCov_9fa48("20250"), `${left}px`),
          transform: stryMutAct_9fa48("20251") ? `` : (stryCov_9fa48("20251"), `translate(${transformX}, ${transformY})`),
          position: 'fixed' as const
        });
      }
    }, stryMutAct_9fa48("20252") ? [] : (stryCov_9fa48("20252"), [highlightedElement, currentStepData]));

    // Encontrar y destacar elemento objetivo
    useEffect(() => {
      if (stryMutAct_9fa48("20253")) {
        {}
      } else {
        stryCov_9fa48("20253");
        if (stryMutAct_9fa48("20256") ? false : stryMutAct_9fa48("20255") ? true : stryMutAct_9fa48("20254") ? currentStepData?.target : (stryCov_9fa48("20254", "20255", "20256"), !(stryMutAct_9fa48("20257") ? currentStepData.target : (stryCov_9fa48("20257"), currentStepData?.target)))) {
          if (stryMutAct_9fa48("20258")) {
            {}
          } else {
            stryCov_9fa48("20258");
            setHighlightedElement(null);
            setTooltipPosition(stryMutAct_9fa48("20259") ? {} : (stryCov_9fa48("20259"), {
              top: stryMutAct_9fa48("20260") ? "" : (stryCov_9fa48("20260"), '50%'),
              left: stryMutAct_9fa48("20261") ? "" : (stryCov_9fa48("20261"), '50%'),
              transform: stryMutAct_9fa48("20262") ? "" : (stryCov_9fa48("20262"), 'translate(-50%, -50%)'),
              position: stryMutAct_9fa48("20263") ? "" : (stryCov_9fa48("20263"), 'fixed')
            }));
            return;
          }
        }
        const element = document.querySelector(currentStepData.target) as HTMLElement;
        if (stryMutAct_9fa48("20265") ? false : stryMutAct_9fa48("20264") ? true : (stryCov_9fa48("20264", "20265"), element)) {
          if (stryMutAct_9fa48("20266")) {
            {}
          } else {
            stryCov_9fa48("20266");
            setHighlightedElement(element);
            // Ejecutar acción si existe
            if (stryMutAct_9fa48("20268") ? false : stryMutAct_9fa48("20267") ? true : (stryCov_9fa48("20267", "20268"), currentStepData.action)) {
              if (stryMutAct_9fa48("20269")) {
                {}
              } else {
                stryCov_9fa48("20269");
                // Limpiar timeout anterior si existe
                if (stryMutAct_9fa48("20271") ? false : stryMutAct_9fa48("20270") ? true : (stryCov_9fa48("20270", "20271"), actionTimeoutRef.current)) {
                  if (stryMutAct_9fa48("20272")) {
                    {}
                  } else {
                    stryCov_9fa48("20272");
                    clearTimeout(actionTimeoutRef.current);
                  }
                }
                actionTimeoutRef.current = setTimeout(() => {
                  if (stryMutAct_9fa48("20273")) {
                    {}
                  } else {
                    stryCov_9fa48("20273");
                    stryMutAct_9fa48("20274") ? currentStepData.action() : (stryCov_9fa48("20274"), currentStepData.action?.());
                  }
                }, TIME_CONSTANTS.ANIMATION_DELAY_MS);
              }
            }

            // Scroll suave al elemento
            element.scrollIntoView(stryMutAct_9fa48("20275") ? {} : (stryCov_9fa48("20275"), {
              behavior: stryMutAct_9fa48("20276") ? "" : (stryCov_9fa48("20276"), 'smooth'),
              block: stryMutAct_9fa48("20277") ? "" : (stryCov_9fa48("20277"), 'center')
            }));

            // Calcular posición inicial
            // Limpiar timeout anterior si existe
            if (stryMutAct_9fa48("20279") ? false : stryMutAct_9fa48("20278") ? true : (stryCov_9fa48("20278", "20279"), positionTimeoutRef.current)) {
              if (stryMutAct_9fa48("20280")) {
                {}
              } else {
                stryCov_9fa48("20280");
                clearTimeout(positionTimeoutRef.current);
              }
            }
            positionTimeoutRef.current = setTimeout(() => {
              if (stryMutAct_9fa48("20281")) {
                {}
              } else {
                stryCov_9fa48("20281");
                setTooltipPosition(calculateTooltipPosition());
              }
            }, TIME_CONSTANTS.FOCUS_TRANSITION_MS);
          }
        } else {
          if (stryMutAct_9fa48("20282")) {
            {}
          } else {
            stryCov_9fa48("20282");
            setHighlightedElement(null);
          }
        }

        // Cleanup: limpiar timeouts al cambiar de paso
        return () => {
          if (stryMutAct_9fa48("20283")) {
            {}
          } else {
            stryCov_9fa48("20283");
            if (stryMutAct_9fa48("20285") ? false : stryMutAct_9fa48("20284") ? true : (stryCov_9fa48("20284", "20285"), actionTimeoutRef.current)) {
              if (stryMutAct_9fa48("20286")) {
                {}
              } else {
                stryCov_9fa48("20286");
                clearTimeout(actionTimeoutRef.current);
                actionTimeoutRef.current = null;
              }
            }
            if (stryMutAct_9fa48("20288") ? false : stryMutAct_9fa48("20287") ? true : (stryCov_9fa48("20287", "20288"), positionTimeoutRef.current)) {
              if (stryMutAct_9fa48("20289")) {
                {}
              } else {
                stryCov_9fa48("20289");
                clearTimeout(positionTimeoutRef.current);
                positionTimeoutRef.current = null;
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("20290") ? [] : (stryCov_9fa48("20290"), [currentStep, currentStepData]));

    // Actualizar posición cuando cambian las dimensiones del tooltip
    useEffect(() => {
      if (stryMutAct_9fa48("20291")) {
        {}
      } else {
        stryCov_9fa48("20291");
        if (stryMutAct_9fa48("20294") ? !isOpen && !highlightedElement : stryMutAct_9fa48("20293") ? false : stryMutAct_9fa48("20292") ? true : (stryCov_9fa48("20292", "20293", "20294"), (stryMutAct_9fa48("20295") ? isOpen : (stryCov_9fa48("20295"), !isOpen)) || (stryMutAct_9fa48("20296") ? highlightedElement : (stryCov_9fa48("20296"), !highlightedElement)))) return;
        const updatePosition = () => {
          if (stryMutAct_9fa48("20297")) {
            {}
          } else {
            stryCov_9fa48("20297");
            setTooltipPosition(calculateTooltipPosition());
          }
        };

        // Actualizar después de que el tooltip se renderice
        const timeout = setTimeout(updatePosition, TIME_CONSTANTS.TOOLTIP_POSITION_UPDATE_DELAY_MS);

        // Actualizar en resize y scroll
        window.addEventListener(stryMutAct_9fa48("20298") ? "" : (stryCov_9fa48("20298"), 'resize'), updatePosition);
        window.addEventListener(stryMutAct_9fa48("20299") ? "" : (stryCov_9fa48("20299"), 'scroll'), updatePosition, stryMutAct_9fa48("20300") ? false : (stryCov_9fa48("20300"), true));

        // Usar ResizeObserver para detectar cambios en el tamaño del tooltip
        // Guardar en ref para garantizar cleanup correcto
        if (stryMutAct_9fa48("20302") ? false : stryMutAct_9fa48("20301") ? true : (stryCov_9fa48("20301", "20302"), tooltipRef.current)) {
          if (stryMutAct_9fa48("20303")) {
            {}
          } else {
            stryCov_9fa48("20303");
            // Desconectar observer anterior si existe
            if (stryMutAct_9fa48("20305") ? false : stryMutAct_9fa48("20304") ? true : (stryCov_9fa48("20304", "20305"), resizeObserverRef.current)) {
              if (stryMutAct_9fa48("20306")) {
                {}
              } else {
                stryCov_9fa48("20306");
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
              }
            }
            const resizeObserver = new ResizeObserver(() => {
              if (stryMutAct_9fa48("20307")) {
                {}
              } else {
                stryCov_9fa48("20307");
                updatePosition();
              }
            });
            resizeObserverRef.current = resizeObserver;
            resizeObserver.observe(tooltipRef.current);
          }
        }
        return () => {
          if (stryMutAct_9fa48("20308")) {
            {}
          } else {
            stryCov_9fa48("20308");
            clearTimeout(timeout);
            window.removeEventListener(stryMutAct_9fa48("20309") ? "" : (stryCov_9fa48("20309"), 'resize'), updatePosition);
            window.removeEventListener(stryMutAct_9fa48("20310") ? "" : (stryCov_9fa48("20310"), 'scroll'), updatePosition, stryMutAct_9fa48("20311") ? false : (stryCov_9fa48("20311"), true));
            // Desconectar observer usando ref para garantizar cleanup
            if (stryMutAct_9fa48("20313") ? false : stryMutAct_9fa48("20312") ? true : (stryCov_9fa48("20312", "20313"), resizeObserverRef.current)) {
              if (stryMutAct_9fa48("20314")) {
                {}
              } else {
                stryCov_9fa48("20314");
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("20315") ? [] : (stryCov_9fa48("20315"), [isOpen, highlightedElement, calculateTooltipPosition]));
    const handleNext = () => {
      if (stryMutAct_9fa48("20316")) {
        {}
      } else {
        stryCov_9fa48("20316");
        setCompletedSteps(stryMutAct_9fa48("20317") ? () => undefined : (stryCov_9fa48("20317"), prev => new Set(stryMutAct_9fa48("20318") ? [] : (stryCov_9fa48("20318"), [...prev, currentStepData.id]))));
        if (stryMutAct_9fa48("20320") ? false : stryMutAct_9fa48("20319") ? true : (stryCov_9fa48("20319", "20320"), isLastStep)) {
          if (stryMutAct_9fa48("20321")) {
            {}
          } else {
            stryCov_9fa48("20321");
            // Marcar tutorial como completado
            if (stryMutAct_9fa48("20324") ? storageKey || typeof window !== 'undefined' : stryMutAct_9fa48("20323") ? false : stryMutAct_9fa48("20322") ? true : (stryCov_9fa48("20322", "20323", "20324"), storageKey && (stryMutAct_9fa48("20326") ? typeof window === 'undefined' : stryMutAct_9fa48("20325") ? true : (stryCov_9fa48("20325", "20326"), typeof window !== (stryMutAct_9fa48("20327") ? "" : (stryCov_9fa48("20327"), 'undefined')))))) {
              if (stryMutAct_9fa48("20328")) {
                {}
              } else {
                stryCov_9fa48("20328");
                try {
                  if (stryMutAct_9fa48("20329")) {
                    {}
                  } else {
                    stryCov_9fa48("20329");
                    localStorage.setItem(storageKey, JSON.stringify(stryMutAct_9fa48("20330") ? {} : (stryCov_9fa48("20330"), {
                      completed: stryMutAct_9fa48("20331") ? false : (stryCov_9fa48("20331"), true),
                      completedAt: new Date().toISOString()
                    })));
                  }
                } catch {
                  // Ignorar errores
                }
              }
            }
            onComplete();
          }
        } else {
          if (stryMutAct_9fa48("20332")) {
            {}
          } else {
            stryCov_9fa48("20332");
            setCurrentStep(stryMutAct_9fa48("20333") ? () => undefined : (stryCov_9fa48("20333"), prev => stryMutAct_9fa48("20334") ? prev - 1 : (stryCov_9fa48("20334"), prev + 1)));
          }
        }
      }
    };
    const handlePrevious = () => {
      if (stryMutAct_9fa48("20335")) {
        {}
      } else {
        stryCov_9fa48("20335");
        if (stryMutAct_9fa48("20339") ? currentStep <= 0 : stryMutAct_9fa48("20338") ? currentStep >= 0 : stryMutAct_9fa48("20337") ? false : stryMutAct_9fa48("20336") ? true : (stryCov_9fa48("20336", "20337", "20338", "20339"), currentStep > 0)) {
          if (stryMutAct_9fa48("20340")) {
            {}
          } else {
            stryCov_9fa48("20340");
            setCurrentStep(stryMutAct_9fa48("20341") ? () => undefined : (stryCov_9fa48("20341"), prev => stryMutAct_9fa48("20342") ? prev + 1 : (stryCov_9fa48("20342"), prev - 1)));
          }
        }
      }
    };
    const handleSkip = () => {
      if (stryMutAct_9fa48("20343")) {
        {}
      } else {
        stryCov_9fa48("20343");
        if (stryMutAct_9fa48("20346") ? storageKey || typeof window !== 'undefined' : stryMutAct_9fa48("20345") ? false : stryMutAct_9fa48("20344") ? true : (stryCov_9fa48("20344", "20345", "20346"), storageKey && (stryMutAct_9fa48("20348") ? typeof window === 'undefined' : stryMutAct_9fa48("20347") ? true : (stryCov_9fa48("20347", "20348"), typeof window !== (stryMutAct_9fa48("20349") ? "" : (stryCov_9fa48("20349"), 'undefined')))))) {
          if (stryMutAct_9fa48("20350")) {
            {}
          } else {
            stryCov_9fa48("20350");
            try {
              if (stryMutAct_9fa48("20351")) {
                {}
              } else {
                stryCov_9fa48("20351");
                localStorage.setItem(storageKey, JSON.stringify(stryMutAct_9fa48("20352") ? {} : (stryCov_9fa48("20352"), {
                  skipped: stryMutAct_9fa48("20353") ? false : (stryCov_9fa48("20353"), true),
                  skippedAt: new Date().toISOString()
                })));
              }
            } catch {
              // Ignorar errores
            }
          }
        }
        onSkip();
      }
    };

    // Atajo de teclado para cerrar (Esc)
    useEffect(() => {
      if (stryMutAct_9fa48("20354")) {
        {}
      } else {
        stryCov_9fa48("20354");
        if (stryMutAct_9fa48("20357") ? false : stryMutAct_9fa48("20356") ? true : stryMutAct_9fa48("20355") ? isOpen : (stryCov_9fa48("20355", "20356", "20357"), !isOpen)) return;
        const handleEscape = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("20358")) {
            {}
          } else {
            stryCov_9fa48("20358");
            if (stryMutAct_9fa48("20361") ? e.key !== 'Escape' : stryMutAct_9fa48("20360") ? false : stryMutAct_9fa48("20359") ? true : (stryCov_9fa48("20359", "20360", "20361"), e.key === (stryMutAct_9fa48("20362") ? "" : (stryCov_9fa48("20362"), 'Escape')))) {
              if (stryMutAct_9fa48("20363")) {
                {}
              } else {
                stryCov_9fa48("20363");
                e.preventDefault();
                handleSkip();
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("20364") ? "" : (stryCov_9fa48("20364"), 'keydown'), handleEscape);
        return stryMutAct_9fa48("20365") ? () => undefined : (stryCov_9fa48("20365"), () => window.removeEventListener(stryMutAct_9fa48("20366") ? "" : (stryCov_9fa48("20366"), 'keydown'), handleEscape));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // handleEscape está definido dentro del efecto y solo depende de isOpen, que ya está en deps
        // No necesitamos agregar handleEscape a las dependencias para evitar re-registros innecesarios
      }
    }, stryMutAct_9fa48("20367") ? [] : (stryCov_9fa48("20367"), [isOpen]));

    // No renderizar si no está abierto
    if (stryMutAct_9fa48("20370") ? false : stryMutAct_9fa48("20369") ? true : stryMutAct_9fa48("20368") ? isOpen : (stryCov_9fa48("20368", "20369", "20370"), !isOpen)) {
      if (stryMutAct_9fa48("20371")) {
        {}
      } else {
        stryCov_9fa48("20371");
        return null;
      }
    }
    return <div ref={overlayRef} className="fixed inset-0 z-[9999] pointer-events-none" style={stryMutAct_9fa48("20372") ? {} : (stryCov_9fa48("20372"), {
      // Overlay más sutil con agujero para el elemento destacado (solo si spotlight está activo)
      background: disableSpotlight ? stryMutAct_9fa48("20373") ? "" : (stryCov_9fa48("20373"), 'transparent') : highlightedElement ? stryMutAct_9fa48("20374") ? `` : (stryCov_9fa48("20374"), `radial-gradient(circle at ${stryMutAct_9fa48("20375") ? highlightedElement.getBoundingClientRect().left - highlightedElement.getBoundingClientRect().width / 2 : (stryCov_9fa48("20375"), highlightedElement.getBoundingClientRect().left + (stryMutAct_9fa48("20376") ? highlightedElement.getBoundingClientRect().width * 2 : (stryCov_9fa48("20376"), highlightedElement.getBoundingClientRect().width / 2)))}px ${stryMutAct_9fa48("20377") ? highlightedElement.getBoundingClientRect().top - highlightedElement.getBoundingClientRect().height / 2 : (stryCov_9fa48("20377"), highlightedElement.getBoundingClientRect().top + (stryMutAct_9fa48("20378") ? highlightedElement.getBoundingClientRect().height * 2 : (stryCov_9fa48("20378"), highlightedElement.getBoundingClientRect().height / 2)))}px, transparent 0px, transparent ${stryMutAct_9fa48("20379") ? Math.max(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height) / 2 - 10 : (stryCov_9fa48("20379"), (stryMutAct_9fa48("20380") ? Math.max(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height) * 2 : (stryCov_9fa48("20380"), (stryMutAct_9fa48("20381") ? Math.min(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height) : (stryCov_9fa48("20381"), Math.max(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height))) / 2)) + 10)}px, rgba(0, 0, 0, 0.3) ${stryMutAct_9fa48("20382") ? Math.max(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height) / 2 - 20 : (stryCov_9fa48("20382"), (stryMutAct_9fa48("20383") ? Math.max(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height) * 2 : (stryCov_9fa48("20383"), (stryMutAct_9fa48("20384") ? Math.min(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height) : (stryCov_9fa48("20384"), Math.max(highlightedElement.getBoundingClientRect().width, highlightedElement.getBoundingClientRect().height))) / 2)) + 20)}px)`) : stryMutAct_9fa48("20385") ? "" : (stryCov_9fa48("20385"), 'rgba(0, 0, 0, 0.3)'),
      backdropFilter: disableSpotlight ? stryMutAct_9fa48("20386") ? "" : (stryCov_9fa48("20386"), 'none') : stryMutAct_9fa48("20387") ? "" : (stryCov_9fa48("20387"), 'blur(1px)')
    })}>
      {/* Highlight del elemento (solo si spotlight no está desactivado) */}
      {stryMutAct_9fa48("20390") ? highlightedElement && !disableSpotlight || <div className="absolute pointer-events-none" style={{
        top: `${highlightedElement.getBoundingClientRect().top}px`,
        left: `${highlightedElement.getBoundingClientRect().left}px`,
        width: `${highlightedElement.getBoundingClientRect().width}px`,
        height: `${highlightedElement.getBoundingClientRect().height}px`,
        boxShadow: `0 0 0 ${UI_CONSTANTS.TOOLTIP.HIGHLIGHT_BORDER_WIDTH}px rgba(59, 130, 246, 0.4), 0 0 ${UI_CONSTANTS.TOOLTIP.HIGHLIGHT_BLUR}px rgba(59, 130, 246, 0.2)`,
        borderRadius: '8px',
        zIndex: 10000,
        animation: `pulse ${UI_CONSTANTS.TOOLTIP.PULSE_ANIMATION_DURATION} cubic-bezier(0.4, 0, 0.6, 1) infinite`
      }} /> : stryMutAct_9fa48("20389") ? false : stryMutAct_9fa48("20388") ? true : (stryCov_9fa48("20388", "20389", "20390"), (stryMutAct_9fa48("20392") ? highlightedElement || !disableSpotlight : stryMutAct_9fa48("20391") ? true : (stryCov_9fa48("20391", "20392"), highlightedElement && (stryMutAct_9fa48("20393") ? disableSpotlight : (stryCov_9fa48("20393"), !disableSpotlight)))) && <div className="absolute pointer-events-none" style={stryMutAct_9fa48("20394") ? {} : (stryCov_9fa48("20394"), {
        top: stryMutAct_9fa48("20395") ? `` : (stryCov_9fa48("20395"), `${highlightedElement.getBoundingClientRect().top}px`),
        left: stryMutAct_9fa48("20396") ? `` : (stryCov_9fa48("20396"), `${highlightedElement.getBoundingClientRect().left}px`),
        width: stryMutAct_9fa48("20397") ? `` : (stryCov_9fa48("20397"), `${highlightedElement.getBoundingClientRect().width}px`),
        height: stryMutAct_9fa48("20398") ? `` : (stryCov_9fa48("20398"), `${highlightedElement.getBoundingClientRect().height}px`),
        boxShadow: stryMutAct_9fa48("20399") ? `` : (stryCov_9fa48("20399"), `0 0 0 ${UI_CONSTANTS.TOOLTIP.HIGHLIGHT_BORDER_WIDTH}px rgba(59, 130, 246, 0.4), 0 0 ${UI_CONSTANTS.TOOLTIP.HIGHLIGHT_BLUR}px rgba(59, 130, 246, 0.2)`),
        borderRadius: stryMutAct_9fa48("20400") ? "" : (stryCov_9fa48("20400"), '8px'),
        zIndex: 10000,
        animation: stryMutAct_9fa48("20401") ? `` : (stryCov_9fa48("20401"), `pulse ${UI_CONSTANTS.TOOLTIP.PULSE_ANIMATION_DURATION} cubic-bezier(0.4, 0, 0.6, 1) infinite`)
      })} />)}

      {/* Tooltip del tutorial */}
      <div ref={tooltipRef} className="pointer-events-auto" style={tooltipPosition}>
        <Card className="w-full max-w-md shadow-2xl border-2 border-primary bg-background">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                </div>
                <CardDescription className="text-sm">{currentStepData.description}</CardDescription>
                {stryMutAct_9fa48("20404") ? !currentStepData.target || <div className="mt-2 p-2 rounded-md bg-muted/50 text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> El efecto "telescopio" resalta elementos importantes. 
                    Puedes cerrar este tutorial en cualquier momento con la X o "Omitir".
                  </div> : stryMutAct_9fa48("20403") ? false : stryMutAct_9fa48("20402") ? true : (stryCov_9fa48("20402", "20403", "20404"), (stryMutAct_9fa48("20405") ? currentStepData.target : (stryCov_9fa48("20405"), !currentStepData.target)) && <div className="mt-2 p-2 rounded-md bg-muted/50 text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> El efecto "telescopio" resalta elementos importantes. 
                    Puedes cerrar este tutorial en cualquier momento con la X o "Omitir".
                  </div>)}
              </div>
              <Button variant="ghost" size="icon" onClick={handleSkip} className="h-8 w-8 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive" title="Cerrar tutorial (Esc)">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Paso {stryMutAct_9fa48("20406") ? currentStep - 1 : (stryCov_9fa48("20406"), currentStep + 1)} de {steps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {steps.map((step, idx) => {
                if (stryMutAct_9fa48("20407")) {
                  {}
                } else {
                  stryCov_9fa48("20407");
                  const isCompleted = stryMutAct_9fa48("20410") ? completedSteps.has(step.id) && idx < currentStep : stryMutAct_9fa48("20409") ? false : stryMutAct_9fa48("20408") ? true : (stryCov_9fa48("20408", "20409", "20410"), completedSteps.has(step.id) || (stryMutAct_9fa48("20413") ? idx >= currentStep : stryMutAct_9fa48("20412") ? idx <= currentStep : stryMutAct_9fa48("20411") ? false : (stryCov_9fa48("20411", "20412", "20413"), idx < currentStep)));
                  const isCurrent = stryMutAct_9fa48("20416") ? idx !== currentStep : stryMutAct_9fa48("20415") ? false : stryMutAct_9fa48("20414") ? true : (stryCov_9fa48("20414", "20415", "20416"), idx === currentStep);
                  return <div key={step.id} className={cn(stryMutAct_9fa48("20417") ? "" : (stryCov_9fa48("20417"), 'h-2 w-2 rounded-full transition-all'), isCompleted ? stryMutAct_9fa48("20418") ? "" : (stryCov_9fa48("20418"), 'bg-green-500') : isCurrent ? stryMutAct_9fa48("20419") ? "" : (stryCov_9fa48("20419"), 'bg-primary w-8') : stryMutAct_9fa48("20420") ? "" : (stryCov_9fa48("20420"), 'bg-muted'))} />;
                }
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                {stryMutAct_9fa48("20423") ? currentStep > 0 || <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button> : stryMutAct_9fa48("20422") ? false : stryMutAct_9fa48("20421") ? true : (stryCov_9fa48("20421", "20422", "20423"), (stryMutAct_9fa48("20426") ? currentStep <= 0 : stryMutAct_9fa48("20425") ? currentStep >= 0 : stryMutAct_9fa48("20424") ? true : (stryCov_9fa48("20424", "20425", "20426"), currentStep > 0)) && <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>)}
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  Cerrar (Esc)
                </Button>
              </div>
              <Button onClick={handleNext} size="sm" className="gap-2">
                {isLastStep ? <>
                    <CheckCircle2 className="h-4 w-4" />
                    Completar
                  </> : <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>}
              </Button>
            </div>

            {/* Hint */}
            {stryMutAct_9fa48("20429") ? currentStepData.target || <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Target className="h-3 w-3" />
                <span>Mira el elemento destacado en azul arriba</span>
              </div> : stryMutAct_9fa48("20428") ? false : stryMutAct_9fa48("20427") ? true : (stryCov_9fa48("20427", "20428", "20429"), currentStepData.target && <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Target className="h-3 w-3" />
                <span>Mira el elemento destacado en azul arriba</span>
              </div>)}
            {stryMutAct_9fa48("20432") ? !currentStepData.target || <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Sparkles className="h-3 w-3" />
                <span>Presiona "Siguiente" para continuar o "Cerrar" para salir</span>
              </div> : stryMutAct_9fa48("20431") ? false : stryMutAct_9fa48("20430") ? true : (stryCov_9fa48("20430", "20431", "20432"), (stryMutAct_9fa48("20433") ? currentStepData.target : (stryCov_9fa48("20433"), !currentStepData.target)) && <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Sparkles className="h-3 w-3" />
                <span>Presiona "Siguiente" para continuar o "Cerrar" para salir</span>
              </div>)}
          </CardContent>
        </Card>
      </div>

      <style>{stryMutAct_9fa48("20434") ? `` : (stryCov_9fa48("20434"), `
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `)}</style>
    </div>;
  }
}