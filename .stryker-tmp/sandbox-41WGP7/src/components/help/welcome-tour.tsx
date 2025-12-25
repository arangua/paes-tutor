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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, BookOpen, BarChart3, FileText, Bot, Search, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}
const TOUR_STEPS = stryMutAct_9fa48("17531") ? [] : (stryCov_9fa48("17531"), [stryMutAct_9fa48("17532") ? {} : (stryCov_9fa48("17532"), {
  id: stryMutAct_9fa48("17533") ? "" : (stryCov_9fa48("17533"), 'search'),
  title: stryMutAct_9fa48("17534") ? "" : (stryCov_9fa48("17534"), 'Búsqueda Global'),
  description: stryMutAct_9fa48("17535") ? "" : (stryCov_9fa48("17535"), 'Presiona Cmd/Ctrl+K o haz clic en "Buscar..." para encontrar rápidamente exámenes, materiales y temas.'),
  icon: Search,
  color: stryMutAct_9fa48("17536") ? "" : (stryCov_9fa48("17536"), 'text-blue-600')
}), stryMutAct_9fa48("17537") ? {} : (stryCov_9fa48("17537"), {
  id: stryMutAct_9fa48("17538") ? "" : (stryCov_9fa48("17538"), 'exams'),
  title: stryMutAct_9fa48("17539") ? "" : (stryCov_9fa48("17539"), 'Realizar Exámenes'),
  description: stryMutAct_9fa48("17540") ? "" : (stryCov_9fa48("17540"), 'Ve a "Exámenes" para practicar con exámenes reales. Tu progreso se guarda automáticamente.'),
  icon: BookOpen,
  color: stryMutAct_9fa48("17541") ? "" : (stryCov_9fa48("17541"), 'text-green-600')
}), stryMutAct_9fa48("17542") ? {} : (stryCov_9fa48("17542"), {
  id: stryMutAct_9fa48("17543") ? "" : (stryCov_9fa48("17543"), 'dashboard'),
  title: stryMutAct_9fa48("17544") ? "" : (stryCov_9fa48("17544"), 'Ver tu Progreso'),
  description: stryMutAct_9fa48("17545") ? "" : (stryCov_9fa48("17545"), 'El Dashboard muestra tus estadísticas, fortalezas, debilidades y recomendaciones personalizadas.'),
  icon: BarChart3,
  color: stryMutAct_9fa48("17546") ? "" : (stryCov_9fa48("17546"), 'text-purple-600')
}), stryMutAct_9fa48("17547") ? {} : (stryCov_9fa48("17547"), {
  id: stryMutAct_9fa48("17548") ? "" : (stryCov_9fa48("17548"), 'materials'),
  title: stryMutAct_9fa48("17549") ? "" : (stryCov_9fa48("17549"), 'Materiales de Estudio'),
  description: stryMutAct_9fa48("17550") ? "" : (stryCov_9fa48("17550"), 'Encuentra recursos educativos organizados por asignatura y tema para reforzar tus conocimientos.'),
  icon: FileText,
  color: stryMutAct_9fa48("17551") ? "" : (stryCov_9fa48("17551"), 'text-orange-600')
}), stryMutAct_9fa48("17552") ? {} : (stryCov_9fa48("17552"), {
  id: stryMutAct_9fa48("17553") ? "" : (stryCov_9fa48("17553"), 'ai-tutor'),
  title: stryMutAct_9fa48("17554") ? "" : (stryCov_9fa48("17554"), 'Tutor de IA'),
  description: stryMutAct_9fa48("17555") ? "" : (stryCov_9fa48("17555"), 'Haz preguntas sobre cualquier tema de PAES y recibe explicaciones personalizadas con IA.'),
  icon: Bot,
  color: stryMutAct_9fa48("17556") ? "" : (stryCov_9fa48("17556"), 'text-indigo-600')
})]);
export function WelcomeTour({
  onComplete,
  onSkip
}: WelcomeTourProps) {
  if (stryMutAct_9fa48("17557")) {
    {}
  } else {
    stryCov_9fa48("17557");
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const currentStepData = TOUR_STEPS[currentStep];
    const Icon = currentStepData.icon;
    const isLastStep = stryMutAct_9fa48("17560") ? currentStep !== TOUR_STEPS.length - 1 : stryMutAct_9fa48("17559") ? false : stryMutAct_9fa48("17558") ? true : (stryCov_9fa48("17558", "17559", "17560"), currentStep === (stryMutAct_9fa48("17561") ? TOUR_STEPS.length + 1 : (stryCov_9fa48("17561"), TOUR_STEPS.length - 1)));
    const handleNext = () => {
      if (stryMutAct_9fa48("17562")) {
        {}
      } else {
        stryCov_9fa48("17562");
        setCompletedSteps(stryMutAct_9fa48("17563") ? () => undefined : (stryCov_9fa48("17563"), prev => new Set(stryMutAct_9fa48("17564") ? [] : (stryCov_9fa48("17564"), [...prev, currentStepData.id]))));
        if (stryMutAct_9fa48("17566") ? false : stryMutAct_9fa48("17565") ? true : (stryCov_9fa48("17565", "17566"), isLastStep)) {
          if (stryMutAct_9fa48("17567")) {
            {}
          } else {
            stryCov_9fa48("17567");
            onComplete();
          }
        } else {
          if (stryMutAct_9fa48("17568")) {
            {}
          } else {
            stryCov_9fa48("17568");
            setCurrentStep(stryMutAct_9fa48("17569") ? () => undefined : (stryCov_9fa48("17569"), prev => stryMutAct_9fa48("17570") ? prev - 1 : (stryCov_9fa48("17570"), prev + 1)));
          }
        }
      }
    };
    const handleSkip = () => {
      if (stryMutAct_9fa48("17571")) {
        {}
      } else {
        stryCov_9fa48("17571");
        onSkip();
      }
    };
    const progress = stryMutAct_9fa48("17572") ? (currentStep + 1) / TOUR_STEPS.length / 100 : (stryCov_9fa48("17572"), (stryMutAct_9fa48("17573") ? (currentStep + 1) * TOUR_STEPS.length : (stryCov_9fa48("17573"), (stryMutAct_9fa48("17574") ? currentStep - 1 : (stryCov_9fa48("17574"), currentStep + 1)) / TOUR_STEPS.length)) * 100);
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl relative">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={stryMutAct_9fa48("17575") ? `` : (stryCov_9fa48("17575"), `p-2 rounded-lg bg-muted ${currentStepData.color}`)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Bienvenido a PAES Tutor</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    Paso {stryMutAct_9fa48("17576") ? currentStep - 1 : (stryCov_9fa48("17576"), currentStep + 1)} de {TOUR_STEPS.length}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-base mt-2">
                {currentStepData.description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progreso del tour</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={stryMutAct_9fa48("17577") ? {} : (stryCov_9fa48("17577"), {
                width: stryMutAct_9fa48("17578") ? `` : (stryCov_9fa48("17578"), `${progress}%`)
              })} />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2">
            {TOUR_STEPS.map((step, idx) => {
              if (stryMutAct_9fa48("17579")) {
                {}
              } else {
                stryCov_9fa48("17579");
                const StepIcon = step.icon;
                const isCompleted = stryMutAct_9fa48("17582") ? completedSteps.has(step.id) && idx < currentStep : stryMutAct_9fa48("17581") ? false : stryMutAct_9fa48("17580") ? true : (stryCov_9fa48("17580", "17581", "17582"), completedSteps.has(step.id) || (stryMutAct_9fa48("17585") ? idx >= currentStep : stryMutAct_9fa48("17584") ? idx <= currentStep : stryMutAct_9fa48("17583") ? false : (stryCov_9fa48("17583", "17584", "17585"), idx < currentStep)));
                const isCurrent = stryMutAct_9fa48("17588") ? idx !== currentStep : stryMutAct_9fa48("17587") ? false : stryMutAct_9fa48("17586") ? true : (stryCov_9fa48("17586", "17587", "17588"), idx === currentStep);
                return <div key={step.id} className={stryMutAct_9fa48("17589") ? `` : (stryCov_9fa48("17589"), `flex items-center gap-2 ${isCurrent ? stryMutAct_9fa48("17590") ? "" : (stryCov_9fa48("17590"), 'scale-110') : stryMutAct_9fa48("17591") ? "Stryker was here!" : (stryCov_9fa48("17591"), '')} transition-transform`)}>
                  <div className={stryMutAct_9fa48("17592") ? `` : (stryCov_9fa48("17592"), `p-2 rounded-lg ${isCompleted ? stryMutAct_9fa48("17593") ? "" : (stryCov_9fa48("17593"), 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300') : isCurrent ? stryMutAct_9fa48("17594") ? `` : (stryCov_9fa48("17594"), `bg-primary/10 ${step.color}`) : stryMutAct_9fa48("17595") ? "" : (stryCov_9fa48("17595"), 'bg-muted text-muted-foreground')}`)}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </div>
                  {stryMutAct_9fa48("17598") ? idx < TOUR_STEPS.length - 1 || <div className={`h-0.5 w-8 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} /> : stryMutAct_9fa48("17597") ? false : stryMutAct_9fa48("17596") ? true : (stryCov_9fa48("17596", "17597", "17598"), (stryMutAct_9fa48("17601") ? idx >= TOUR_STEPS.length - 1 : stryMutAct_9fa48("17600") ? idx <= TOUR_STEPS.length - 1 : stryMutAct_9fa48("17599") ? true : (stryCov_9fa48("17599", "17600", "17601"), idx < (stryMutAct_9fa48("17602") ? TOUR_STEPS.length + 1 : (stryCov_9fa48("17602"), TOUR_STEPS.length - 1)))) && <div className={stryMutAct_9fa48("17603") ? `` : (stryCov_9fa48("17603"), `h-0.5 w-8 ${isCompleted ? stryMutAct_9fa48("17604") ? "" : (stryCov_9fa48("17604"), 'bg-green-500') : stryMutAct_9fa48("17605") ? "" : (stryCov_9fa48("17605"), 'bg-muted')}`)} />)}
                </div>;
              }
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={handleSkip}>
              Omitir tour
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {isLastStep ? stryMutAct_9fa48("17606") ? "" : (stryCov_9fa48("17606"), 'Comenzar') : stryMutAct_9fa48("17607") ? "" : (stryCov_9fa48("17607"), 'Siguiente')}
              {stryMutAct_9fa48("17610") ? !isLastStep || <ArrowRight className="h-4 w-4" /> : stryMutAct_9fa48("17609") ? false : stryMutAct_9fa48("17608") ? true : (stryCov_9fa48("17608", "17609", "17610"), (stryMutAct_9fa48("17611") ? isLastStep : (stryCov_9fa48("17611"), !isLastStep)) && <ArrowRight className="h-4 w-4" />)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
  }
}