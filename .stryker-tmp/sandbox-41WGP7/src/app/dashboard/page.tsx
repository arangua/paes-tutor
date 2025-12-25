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
import { useEffect, useState, lazy, Suspense, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Target, Award, AlertCircle, Loader2, HelpCircle, PlayCircle } from 'lucide-react';
import { exportDashboardToExcel } from '@/lib/export-utils';
import { toast } from 'sonner';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Achievements } from '@/components/dashboard/achievements';
import { RecommendationsSection } from '@/components/recommendations/recommendations-section';
import { JointProgress } from '@/components/dashboard/joint-progress';
import { WelcomeTour } from '@/components/help/welcome-tour';
import { QuickGuide } from '@/components/help/quick-guide';
import { HelpIcon } from '@/components/help/help-icon';
import { ExportButton } from '@/components/export/export-button';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { ErrorMessageComponent } from '@/components/ui/error-message';
import { SubjectIcon } from '@/lib/subject-icons';
import { DashboardTutorial } from '@/components/tutorial/dashboard-tutorial';
import { ActionHistory } from '@/components/dashboard/action-history';
import { PendingReminders } from '@/components/dashboard/pending-reminders';
import { ErrorHistory } from '@/components/dashboard/error-history';

// Lazy load recharts para reducir el bundle inicial
const SubjectPerformanceChart = lazy(stryMutAct_9fa48("12369") ? () => undefined : (stryCov_9fa48("12369"), () => import(stryMutAct_9fa48("12370") ? "" : (stryCov_9fa48("12370"), '@/components/charts/PerformanceCharts')).then(stryMutAct_9fa48("12371") ? () => undefined : (stryCov_9fa48("12371"), mod => stryMutAct_9fa48("12372") ? {} : (stryCov_9fa48("12372"), {
  default: mod.SubjectPerformanceChart
})))));
interface Student {
  id: string;
  nombre: string;
  attempts: Attempt[];
  metrics: Metric[];
}
interface Attempt {
  id: string;
  estado: string;
  porcentaje: number;
  correctas: number;
  totalPreguntas: number;
  puntajePaes: number | null;
  createdAt: string;
  startedAt?: string | null;
  exam: {
    titulo: string;
    subject: {
      nombre: string;
      codigo: string;
    };
  };
}
interface Metric {
  porcentaje: number;
  totalPreguntas: number;
  correctas: number;
  codigo: string;
  nombre: string;
  temas: Array<{
    nombre: string;
    porcentaje: number;
    nivel: string | null;
  }>;
}
export default function DashboardPage() {
  if (stryMutAct_9fa48("12373")) {
    {}
  } else {
    stryCov_9fa48("12373");
    const [student, setStudent] = useState<Student | null>(null);
    const [metrics, setMetrics] = useState<Metric[]>(stryMutAct_9fa48("12374") ? ["Stryker was here"] : (stryCov_9fa48("12374"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("12375") ? false : (stryCov_9fa48("12375"), true));
    const [error, setError] = useState<string | null>(null);
    const [showTour, setShowTour] = useState(stryMutAct_9fa48("12376") ? true : (stryCov_9fa48("12376"), false));
    const [showGuide, setShowGuide] = useState(stryMutAct_9fa48("12377") ? true : (stryCov_9fa48("12377"), false));
    const [hasSeenTour, setHasSeenTour] = useState(stryMutAct_9fa48("12378") ? true : (stryCov_9fa48("12378"), false));
    const [pendingFlashcards, setPendingFlashcards] = useState(0);
    const [pendingChallenges, setPendingChallenges] = useState(0);
    const [pendingReviews, setPendingReviews] = useState(0);

    // Calcular estadísticas generales (memoizadas para evitar recálculos)
    // Nota: Estos cálculos se hacen antes de los early returns para cumplir con las reglas de React Hooks
    const {
      totalAttempts,
      avgScore,
      completedAttempts,
      pendingAttempts
    } = useMemo(() => {
      if (stryMutAct_9fa48("12379")) {
        {}
      } else {
        stryCov_9fa48("12379");
        if (stryMutAct_9fa48("12382") ? false : stryMutAct_9fa48("12381") ? true : stryMutAct_9fa48("12380") ? student : (stryCov_9fa48("12380", "12381", "12382"), !student)) {
          if (stryMutAct_9fa48("12383")) {
            {}
          } else {
            stryCov_9fa48("12383");
            return stryMutAct_9fa48("12384") ? {} : (stryCov_9fa48("12384"), {
              totalAttempts: 0,
              avgScore: 0,
              completedAttempts: 0,
              pendingAttempts: stryMutAct_9fa48("12385") ? ["Stryker was here"] : (stryCov_9fa48("12385"), [])
            });
          }
        }
        const total = student.attempts.length;
        const avg = (stryMutAct_9fa48("12389") ? total <= 0 : stryMutAct_9fa48("12388") ? total >= 0 : stryMutAct_9fa48("12387") ? false : stryMutAct_9fa48("12386") ? true : (stryCov_9fa48("12386", "12387", "12388", "12389"), total > 0)) ? stryMutAct_9fa48("12390") ? student.attempts.reduce((sum, a) => sum + a.porcentaje, 0) * total : (stryCov_9fa48("12390"), student.attempts.reduce(stryMutAct_9fa48("12391") ? () => undefined : (stryCov_9fa48("12391"), (sum, a) => stryMutAct_9fa48("12392") ? sum - a.porcentaje : (stryCov_9fa48("12392"), sum + a.porcentaje)), 0) / total) : 0;
        const completed = stryMutAct_9fa48("12393") ? student.attempts.length : (stryCov_9fa48("12393"), student.attempts.filter(stryMutAct_9fa48("12394") ? () => undefined : (stryCov_9fa48("12394"), a => stryMutAct_9fa48("12397") ? a.estado !== 'completado' : stryMutAct_9fa48("12396") ? false : stryMutAct_9fa48("12395") ? true : (stryCov_9fa48("12395", "12396", "12397"), a.estado === (stryMutAct_9fa48("12398") ? "" : (stryCov_9fa48("12398"), 'completado'))))).length);
        const pending = stryMutAct_9fa48("12399") ? student.attempts.map(a => ({
          id: a.id,
          exam: {
            id: a.exam.id || '',
            titulo: a.exam.titulo,
            subject: {
              codigo: a.exam.subject.codigo,
              nombre: a.exam.subject.nombre
            }
          },
          startedAt: a.startedAt || a.createdAt,
          totalPreguntas: a.totalPreguntas,
          correctas: a.correctas
        })) : (stryCov_9fa48("12399"), student.attempts.filter(stryMutAct_9fa48("12400") ? () => undefined : (stryCov_9fa48("12400"), a => stryMutAct_9fa48("12403") ? a.estado !== 'en_progreso' : stryMutAct_9fa48("12402") ? false : stryMutAct_9fa48("12401") ? true : (stryCov_9fa48("12401", "12402", "12403"), a.estado === (stryMutAct_9fa48("12404") ? "" : (stryCov_9fa48("12404"), 'en_progreso'))))).map(stryMutAct_9fa48("12405") ? () => undefined : (stryCov_9fa48("12405"), a => stryMutAct_9fa48("12406") ? {} : (stryCov_9fa48("12406"), {
          id: a.id,
          exam: stryMutAct_9fa48("12407") ? {} : (stryCov_9fa48("12407"), {
            id: stryMutAct_9fa48("12410") ? a.exam.id && '' : stryMutAct_9fa48("12409") ? false : stryMutAct_9fa48("12408") ? true : (stryCov_9fa48("12408", "12409", "12410"), a.exam.id || (stryMutAct_9fa48("12411") ? "Stryker was here!" : (stryCov_9fa48("12411"), ''))),
            titulo: a.exam.titulo,
            subject: stryMutAct_9fa48("12412") ? {} : (stryCov_9fa48("12412"), {
              codigo: a.exam.subject.codigo,
              nombre: a.exam.subject.nombre
            })
          }),
          startedAt: stryMutAct_9fa48("12415") ? a.startedAt && a.createdAt : stryMutAct_9fa48("12414") ? false : stryMutAct_9fa48("12413") ? true : (stryCov_9fa48("12413", "12414", "12415"), a.startedAt || a.createdAt),
          totalPreguntas: a.totalPreguntas,
          correctas: a.correctas
        }))));
        return stryMutAct_9fa48("12416") ? {} : (stryCov_9fa48("12416"), {
          totalAttempts: total,
          avgScore: avg,
          completedAttempts: completed,
          pendingAttempts: pending
        });
      }
    }, stryMutAct_9fa48("12417") ? [] : (stryCov_9fa48("12417"), [student]));

    // Preparar datos para gráficos (memoizadas)
    const subjectPerformance = useMemo(stryMutAct_9fa48("12418") ? () => undefined : (stryCov_9fa48("12418"), () => metrics.map(stryMutAct_9fa48("12419") ? () => undefined : (stryCov_9fa48("12419"), m => stryMutAct_9fa48("12420") ? {} : (stryCov_9fa48("12420"), {
      name: m.codigo,
      porcentaje: Math.round(m.porcentaje)
    })))), stryMutAct_9fa48("12421") ? [] : (stryCov_9fa48("12421"), [metrics]));
    const handleExportExcel = useCallback(async () => {
      if (stryMutAct_9fa48("12422")) {
        {}
      } else {
        stryCov_9fa48("12422");
        if (stryMutAct_9fa48("12425") ? false : stryMutAct_9fa48("12424") ? true : stryMutAct_9fa48("12423") ? student : (stryCov_9fa48("12423", "12424", "12425"), !student)) return;
        try {
          if (stryMutAct_9fa48("12426")) {
            {}
          } else {
            stryCov_9fa48("12426");
            const dashboardData = stryMutAct_9fa48("12427") ? {} : (stryCov_9fa48("12427"), {
              studentName: student.nombre,
              totalAttempts,
              completedAttempts,
              avgScore,
              attempts: student.attempts.map(stryMutAct_9fa48("12428") ? () => undefined : (stryCov_9fa48("12428"), attempt => stryMutAct_9fa48("12429") ? {} : (stryCov_9fa48("12429"), {
                id: attempt.id,
                estado: attempt.estado,
                porcentaje: attempt.porcentaje,
                correctas: attempt.correctas,
                totalPreguntas: attempt.totalPreguntas,
                puntajePaes: attempt.puntajePaes,
                createdAt: attempt.createdAt,
                exam: stryMutAct_9fa48("12430") ? {} : (stryCov_9fa48("12430"), {
                  titulo: attempt.exam.titulo,
                  subject: stryMutAct_9fa48("12431") ? {} : (stryCov_9fa48("12431"), {
                    nombre: attempt.exam.subject.nombre,
                    codigo: attempt.exam.subject.codigo
                  })
                })
              }))),
              metrics: metrics.map(stryMutAct_9fa48("12432") ? () => undefined : (stryCov_9fa48("12432"), m => stryMutAct_9fa48("12433") ? {} : (stryCov_9fa48("12433"), {
                codigo: m.codigo,
                nombre: m.nombre,
                porcentaje: m.porcentaje,
                totalPreguntas: m.totalPreguntas,
                correctas: m.correctas
              })))
            });
            toast.loading(stryMutAct_9fa48("12434") ? "" : (stryCov_9fa48("12434"), 'Exportando dashboard...'), stryMutAct_9fa48("12435") ? {} : (stryCov_9fa48("12435"), {
              id: stryMutAct_9fa48("12436") ? "" : (stryCov_9fa48("12436"), 'export-dashboard')
            }));
            await exportDashboardToExcel(dashboardData);
            toast.success(stryMutAct_9fa48("12437") ? "" : (stryCov_9fa48("12437"), 'Exportación exitosa'), stryMutAct_9fa48("12438") ? {} : (stryCov_9fa48("12438"), {
              id: stryMutAct_9fa48("12439") ? "" : (stryCov_9fa48("12439"), 'export-dashboard'),
              description: stryMutAct_9fa48("12440") ? "" : (stryCov_9fa48("12440"), 'Tu dashboard se ha exportado correctamente a Excel.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("12441")) {
            {}
          } else {
            stryCov_9fa48("12441");
            const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("12442") ? "" : (stryCov_9fa48("12442"), 'No se pudo exportar el dashboard. Por favor, intenta nuevamente.');
            const errorInfo = extractErrorInfo(error);
            const structuredError = getErrorMessage(ERROR_CODES.DATA_EXPORT_FAILED, stryMutAct_9fa48("12443") ? {} : (stryCov_9fa48("12443"), {
              reason: errorInfo.message,
              context: stryMutAct_9fa48("12444") ? {} : (stryCov_9fa48("12444"), {
                action: stryMutAct_9fa48("12445") ? "" : (stryCov_9fa48("12445"), 'export_dashboard')
              })
            }));
            toast.error(structuredError.title, stryMutAct_9fa48("12446") ? {} : (stryCov_9fa48("12446"), {
              id: stryMutAct_9fa48("12447") ? "" : (stryCov_9fa48("12447"), 'export-dashboard'),
              description: stryMutAct_9fa48("12448") ? `` : (stryCov_9fa48("12448"), `${structuredError.description} ${structuredError.solution}`)
            }));

            // Log del error para debugging
            if (stryMutAct_9fa48("12451") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("12450") ? false : stryMutAct_9fa48("12449") ? true : (stryCov_9fa48("12449", "12450", "12451"), typeof globalThis !== (stryMutAct_9fa48("12452") ? "" : (stryCov_9fa48("12452"), 'undefined')))) {
              if (stryMutAct_9fa48("12453")) {
                {}
              } else {
                stryCov_9fa48("12453");
                const globalWithCapture = globalThis as {
                  captureError?: (error: Error, context?: Record<string, unknown>) => void;
                };
                if (stryMutAct_9fa48("12455") ? false : stryMutAct_9fa48("12454") ? true : (stryCov_9fa48("12454", "12455"), globalWithCapture.captureError)) {
                  if (stryMutAct_9fa48("12456")) {
                    {}
                  } else {
                    stryCov_9fa48("12456");
                    globalWithCapture.captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("12457") ? {} : (stryCov_9fa48("12457"), {
                      type: stryMutAct_9fa48("12458") ? "" : (stryCov_9fa48("12458"), 'export_error'),
                      action: stryMutAct_9fa48("12459") ? "" : (stryCov_9fa48("12459"), 'export_dashboard'),
                      context: stryMutAct_9fa48("12460") ? {} : (stryCov_9fa48("12460"), {
                        studentId: student.id
                      })
                    }));
                  }
                }
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("12461") ? [] : (stryCov_9fa48("12461"), [student, totalAttempts, completedAttempts, avgScore, metrics]));
    const handleTourComplete = useCallback(() => {
      if (stryMutAct_9fa48("12462")) {
        {}
      } else {
        stryCov_9fa48("12462");
        if (stryMutAct_9fa48("12465") ? typeof globalThis !== 'undefined' || globalThis.window : stryMutAct_9fa48("12464") ? false : stryMutAct_9fa48("12463") ? true : (stryCov_9fa48("12463", "12464", "12465"), (stryMutAct_9fa48("12467") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("12466") ? true : (stryCov_9fa48("12466", "12467"), typeof globalThis !== (stryMutAct_9fa48("12468") ? "" : (stryCov_9fa48("12468"), 'undefined')))) && globalThis.window)) {
          if (stryMutAct_9fa48("12469")) {
            {}
          } else {
            stryCov_9fa48("12469");
            globalThis.window.localStorage.setItem(stryMutAct_9fa48("12470") ? "" : (stryCov_9fa48("12470"), 'paes-tutor-tour-seen'), stryMutAct_9fa48("12471") ? "" : (stryCov_9fa48("12471"), 'true'));
          }
        }
        setShowTour(stryMutAct_9fa48("12472") ? true : (stryCov_9fa48("12472"), false));
        setHasSeenTour(stryMutAct_9fa48("12473") ? false : (stryCov_9fa48("12473"), true));
      }
    }, stryMutAct_9fa48("12474") ? ["Stryker was here"] : (stryCov_9fa48("12474"), []));
    const handleTourSkip = useCallback(() => {
      if (stryMutAct_9fa48("12475")) {
        {}
      } else {
        stryCov_9fa48("12475");
        if (stryMutAct_9fa48("12478") ? typeof globalThis !== 'undefined' || globalThis.window : stryMutAct_9fa48("12477") ? false : stryMutAct_9fa48("12476") ? true : (stryCov_9fa48("12476", "12477", "12478"), (stryMutAct_9fa48("12480") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("12479") ? true : (stryCov_9fa48("12479", "12480"), typeof globalThis !== (stryMutAct_9fa48("12481") ? "" : (stryCov_9fa48("12481"), 'undefined')))) && globalThis.window)) {
          if (stryMutAct_9fa48("12482")) {
            {}
          } else {
            stryCov_9fa48("12482");
            globalThis.window.localStorage.setItem(stryMutAct_9fa48("12483") ? "" : (stryCov_9fa48("12483"), 'paes-tutor-tour-seen'), stryMutAct_9fa48("12484") ? "" : (stryCov_9fa48("12484"), 'true'));
          }
        }
        setShowTour(stryMutAct_9fa48("12485") ? true : (stryCov_9fa48("12485"), false));
        setHasSeenTour(stryMutAct_9fa48("12486") ? false : (stryCov_9fa48("12486"), true));
      }
    }, stryMutAct_9fa48("12487") ? ["Stryker was here"] : (stryCov_9fa48("12487"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("12488")) {
        {}
      } else {
        stryCov_9fa48("12488");
        // Verificar si el usuario ya vio el tour (solo en cliente)
        if (stryMutAct_9fa48("12491") ? typeof globalThis !== 'undefined' || globalThis.window : stryMutAct_9fa48("12490") ? false : stryMutAct_9fa48("12489") ? true : (stryCov_9fa48("12489", "12490", "12491"), (stryMutAct_9fa48("12493") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("12492") ? true : (stryCov_9fa48("12492", "12493"), typeof globalThis !== (stryMutAct_9fa48("12494") ? "" : (stryCov_9fa48("12494"), 'undefined')))) && globalThis.window)) {
          if (stryMutAct_9fa48("12495")) {
            {}
          } else {
            stryCov_9fa48("12495");
            const seen = globalThis.window.localStorage.getItem(stryMutAct_9fa48("12496") ? "" : (stryCov_9fa48("12496"), 'paes-tutor-tour-seen'));
            setHasSeenTour(stryMutAct_9fa48("12497") ? !seen : (stryCov_9fa48("12497"), !(stryMutAct_9fa48("12498") ? seen : (stryCov_9fa48("12498"), !seen))));

            // Mostrar tour si es primera vez
            const isFirstVisit = globalThis.window.localStorage.getItem(stryMutAct_9fa48("12499") ? "" : (stryCov_9fa48("12499"), 'paes-tutor-dashboard-first-visit'));
            if (stryMutAct_9fa48("12502") ? !seen || !isFirstVisit : stryMutAct_9fa48("12501") ? false : stryMutAct_9fa48("12500") ? true : (stryCov_9fa48("12500", "12501", "12502"), (stryMutAct_9fa48("12503") ? seen : (stryCov_9fa48("12503"), !seen)) && (stryMutAct_9fa48("12504") ? isFirstVisit : (stryCov_9fa48("12504"), !isFirstVisit)))) {
              if (stryMutAct_9fa48("12505")) {
                {}
              } else {
                stryCov_9fa48("12505");
                setShowTour(stryMutAct_9fa48("12506") ? false : (stryCov_9fa48("12506"), true));
                globalThis.window.localStorage.setItem(stryMutAct_9fa48("12507") ? "" : (stryCov_9fa48("12507"), 'paes-tutor-dashboard-first-visit'), stryMutAct_9fa48("12508") ? "" : (stryCov_9fa48("12508"), 'true'));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("12509") ? ["Stryker was here"] : (stryCov_9fa48("12509"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("12510")) {
        {}
      } else {
        stryCov_9fa48("12510");
        async function fetchData() {
          if (stryMutAct_9fa48("12511")) {
            {}
          } else {
            stryCov_9fa48("12511");
            try {
              if (stryMutAct_9fa48("12512")) {
                {}
              } else {
                stryCov_9fa48("12512");
                const [studentRes, metricsRes, flashcardsRes, challengesRes, reviewsRes] = await Promise.all(stryMutAct_9fa48("12513") ? [] : (stryCov_9fa48("12513"), [fetch(stryMutAct_9fa48("12514") ? "" : (stryCov_9fa48("12514"), '/api/student')), fetch(stryMutAct_9fa48("12515") ? "" : (stryCov_9fa48("12515"), '/api/metrics')), fetch(stryMutAct_9fa48("12516") ? "" : (stryCov_9fa48("12516"), '/api/flashcards?dueOnly=true')).catch(stryMutAct_9fa48("12517") ? () => undefined : (stryCov_9fa48("12517"), () => stryMutAct_9fa48("12518") ? {} : (stryCov_9fa48("12518"), {
                  ok: stryMutAct_9fa48("12519") ? true : (stryCov_9fa48("12519"), false)
                }))), fetch(stryMutAct_9fa48("12520") ? "" : (stryCov_9fa48("12520"), '/api/challenges?status=pending')).catch(stryMutAct_9fa48("12521") ? () => undefined : (stryCov_9fa48("12521"), () => stryMutAct_9fa48("12522") ? {} : (stryCov_9fa48("12522"), {
                  ok: stryMutAct_9fa48("12523") ? true : (stryCov_9fa48("12523"), false)
                }))), fetch(stryMutAct_9fa48("12524") ? "" : (stryCov_9fa48("12524"), '/api/review/quick?limit=1')).catch(stryMutAct_9fa48("12525") ? () => undefined : (stryCov_9fa48("12525"), () => stryMutAct_9fa48("12526") ? {} : (stryCov_9fa48("12526"), {
                  ok: stryMutAct_9fa48("12527") ? true : (stryCov_9fa48("12527"), false)
                })))]));

                // Manejar errores de autenticación
                if (stryMutAct_9fa48("12530") ? studentRes.status === 401 && metricsRes.status === 401 : stryMutAct_9fa48("12529") ? false : stryMutAct_9fa48("12528") ? true : (stryCov_9fa48("12528", "12529", "12530"), (stryMutAct_9fa48("12532") ? studentRes.status !== 401 : stryMutAct_9fa48("12531") ? false : (stryCov_9fa48("12531", "12532"), studentRes.status === 401)) || (stryMutAct_9fa48("12534") ? metricsRes.status !== 401 : stryMutAct_9fa48("12533") ? false : (stryCov_9fa48("12533", "12534"), metricsRes.status === 401)))) {
                  if (stryMutAct_9fa48("12535")) {
                    {}
                  } else {
                    stryCov_9fa48("12535");
                    // Redirigir a login si no está autenticado
                    router.push(stryMutAct_9fa48("12536") ? "" : (stryCov_9fa48("12536"), '/auth/signin?callbackUrl=/dashboard'));
                    return;
                  }
                }
                if (stryMutAct_9fa48("12539") ? false : stryMutAct_9fa48("12538") ? true : stryMutAct_9fa48("12537") ? studentRes.ok : (stryCov_9fa48("12537", "12538", "12539"), !studentRes.ok)) {
                  if (stryMutAct_9fa48("12540")) {
                    {}
                  } else {
                    stryCov_9fa48("12540");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("12541") ? "" : (stryCov_9fa48("12541"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(studentRes, stryMutAct_9fa48("12542") ? {} : (stryCov_9fa48("12542"), {
                      path: (stryMutAct_9fa48("12545") ? typeof window === 'undefined' : stryMutAct_9fa48("12544") ? false : stryMutAct_9fa48("12543") ? true : (stryCov_9fa48("12543", "12544", "12545"), typeof window !== (stryMutAct_9fa48("12546") ? "" : (stryCov_9fa48("12546"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("12547") ? "" : (stryCov_9fa48("12547"), '/dashboard'),
                      operation: stryMutAct_9fa48("12548") ? "" : (stryCov_9fa48("12548"), 'obtener datos del estudiante')
                    }));
                    throw new Error(stryMutAct_9fa48("12551") ? errorData.error && `Error ${studentRes.status}: Error al obtener datos del estudiante` : stryMutAct_9fa48("12550") ? false : stryMutAct_9fa48("12549") ? true : (stryCov_9fa48("12549", "12550", "12551"), errorData.error || (stryMutAct_9fa48("12552") ? `` : (stryCov_9fa48("12552"), `Error ${studentRes.status}: Error al obtener datos del estudiante`))));
                  }
                }
                if (stryMutAct_9fa48("12555") ? false : stryMutAct_9fa48("12554") ? true : stryMutAct_9fa48("12553") ? metricsRes.ok : (stryCov_9fa48("12553", "12554", "12555"), !metricsRes.ok)) {
                  if (stryMutAct_9fa48("12556")) {
                    {}
                  } else {
                    stryCov_9fa48("12556");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("12557") ? "" : (stryCov_9fa48("12557"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(metricsRes, stryMutAct_9fa48("12558") ? {} : (stryCov_9fa48("12558"), {
                      path: (stryMutAct_9fa48("12561") ? typeof window === 'undefined' : stryMutAct_9fa48("12560") ? false : stryMutAct_9fa48("12559") ? true : (stryCov_9fa48("12559", "12560", "12561"), typeof window !== (stryMutAct_9fa48("12562") ? "" : (stryCov_9fa48("12562"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("12563") ? "" : (stryCov_9fa48("12563"), '/dashboard'),
                      operation: stryMutAct_9fa48("12564") ? "" : (stryCov_9fa48("12564"), 'obtener métricas')
                    }));
                    throw new Error(stryMutAct_9fa48("12567") ? errorData.error && `Error ${metricsRes.status}: Error al obtener métricas` : stryMutAct_9fa48("12566") ? false : stryMutAct_9fa48("12565") ? true : (stryCov_9fa48("12565", "12566", "12567"), errorData.error || (stryMutAct_9fa48("12568") ? `` : (stryCov_9fa48("12568"), `Error ${metricsRes.status}: Error al obtener métricas`))));
                  }
                }
                const studentData = await studentRes.json();
                const metricsData = await metricsRes.json();

                // Validar que no haya errores en la respuesta
                if (stryMutAct_9fa48("12570") ? false : stryMutAct_9fa48("12569") ? true : (stryCov_9fa48("12569", "12570"), studentData.error)) {
                  if (stryMutAct_9fa48("12571")) {
                    {}
                  } else {
                    stryCov_9fa48("12571");
                    throw new Error(studentData.error);
                  }
                }
                if (stryMutAct_9fa48("12574") ? Array.isArray(metricsData) && metricsData.length > 0 || metricsData[0].error : stryMutAct_9fa48("12573") ? false : stryMutAct_9fa48("12572") ? true : (stryCov_9fa48("12572", "12573", "12574"), (stryMutAct_9fa48("12576") ? Array.isArray(metricsData) || metricsData.length > 0 : stryMutAct_9fa48("12575") ? true : (stryCov_9fa48("12575", "12576"), Array.isArray(metricsData) && (stryMutAct_9fa48("12579") ? metricsData.length <= 0 : stryMutAct_9fa48("12578") ? metricsData.length >= 0 : stryMutAct_9fa48("12577") ? true : (stryCov_9fa48("12577", "12578", "12579"), metricsData.length > 0)))) && metricsData[0].error)) {
                  if (stryMutAct_9fa48("12580")) {
                    {}
                  } else {
                    stryCov_9fa48("12580");
                    throw new Error(metricsData[0].error);
                  }
                }
                setStudent(studentData);
                setMetrics(Array.isArray(metricsData) ? metricsData : stryMutAct_9fa48("12581") ? ["Stryker was here"] : (stryCov_9fa48("12581"), []));

                // Procesar datos de recordatorios (sin bloquear si fallan)
                try {
                  if (stryMutAct_9fa48("12582")) {
                    {}
                  } else {
                    stryCov_9fa48("12582");
                    if (stryMutAct_9fa48("12584") ? false : stryMutAct_9fa48("12583") ? true : (stryCov_9fa48("12583", "12584"), flashcardsRes.ok)) {
                      if (stryMutAct_9fa48("12585")) {
                        {}
                      } else {
                        stryCov_9fa48("12585");
                        const flashcardsData = await flashcardsRes.json();
                        setPendingFlashcards(stryMutAct_9fa48("12588") ? flashcardsData.flashcards?.length && 0 : stryMutAct_9fa48("12587") ? false : stryMutAct_9fa48("12586") ? true : (stryCov_9fa48("12586", "12587", "12588"), (stryMutAct_9fa48("12589") ? flashcardsData.flashcards.length : (stryCov_9fa48("12589"), flashcardsData.flashcards?.length)) || 0));
                      }
                    }
                  }
                } catch {
                  // Ignorar errores de flashcards
                }
                try {
                  if (stryMutAct_9fa48("12590")) {
                    {}
                  } else {
                    stryCov_9fa48("12590");
                    if (stryMutAct_9fa48("12592") ? false : stryMutAct_9fa48("12591") ? true : (stryCov_9fa48("12591", "12592"), challengesRes.ok)) {
                      if (stryMutAct_9fa48("12593")) {
                        {}
                      } else {
                        stryCov_9fa48("12593");
                        const challengesData = await challengesRes.json();
                        setPendingChallenges(stryMutAct_9fa48("12596") ? challengesData.challenges?.length && 0 : stryMutAct_9fa48("12595") ? false : stryMutAct_9fa48("12594") ? true : (stryCov_9fa48("12594", "12595", "12596"), (stryMutAct_9fa48("12597") ? challengesData.challenges.length : (stryCov_9fa48("12597"), challengesData.challenges?.length)) || 0));
                      }
                    }
                  }
                } catch {
                  // Ignorar errores de challenges
                }
                try {
                  if (stryMutAct_9fa48("12598")) {
                    {}
                  } else {
                    stryCov_9fa48("12598");
                    if (stryMutAct_9fa48("12600") ? false : stryMutAct_9fa48("12599") ? true : (stryCov_9fa48("12599", "12600"), reviewsRes.ok)) {
                      if (stryMutAct_9fa48("12601")) {
                        {}
                      } else {
                        stryCov_9fa48("12601");
                        const reviewsData = await reviewsRes.json();
                        setPendingReviews(stryMutAct_9fa48("12604") ? reviewsData.questions?.length && 0 : stryMutAct_9fa48("12603") ? false : stryMutAct_9fa48("12602") ? true : (stryCov_9fa48("12602", "12603", "12604"), (stryMutAct_9fa48("12605") ? reviewsData.questions.length : (stryCov_9fa48("12605"), reviewsData.questions?.length)) || 0));
                      }
                    }
                  }
                } catch {
                  // Ignorar errores de reviews
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("12606")) {
                {}
              } else {
                stryCov_9fa48("12606");
                // Manejar errores con sistema estructurado
                const errorInfo = extractErrorInfo(error);
                const errorMessage = getErrorMessage(ERROR_CODES.SYSTEM_LOAD_FAILED, stryMutAct_9fa48("12607") ? {} : (stryCov_9fa48("12607"), {
                  message: errorInfo.message,
                  context: stryMutAct_9fa48("12608") ? "" : (stryCov_9fa48("12608"), 'dashboard')
                }));
                setError(JSON.stringify(errorMessage));
              }
            } finally {
              if (stryMutAct_9fa48("12609")) {
                {}
              } else {
                stryCov_9fa48("12609");
                setLoading(stryMutAct_9fa48("12610") ? true : (stryCov_9fa48("12610"), false));
              }
            }
          }
        }
        fetchData();
      }
    }, stryMutAct_9fa48("12611") ? ["Stryker was here"] : (stryCov_9fa48("12611"), []));
    if (stryMutAct_9fa48("12613") ? false : stryMutAct_9fa48("12612") ? true : (stryCov_9fa48("12612", "12613"), loading)) {
      if (stryMutAct_9fa48("12614")) {
        {}
      } else {
        stryCov_9fa48("12614");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <div className="absolute inset-0 h-12 w-12 mx-auto">
              <div className="h-full w-full border-4 border-gray-200 dark:border-gray-800 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando dashboard...
            </p>
            <p className="text-sm text-muted-foreground">
              Obteniendo tus estadísticas y progreso
            </p>
          </div>
        </div>
      </div>;
      }
    }

    // Procesar error para mostrar mensaje estructurado
    let processedError = null;
    if (stryMutAct_9fa48("12616") ? false : stryMutAct_9fa48("12615") ? true : (stryCov_9fa48("12615", "12616"), error)) {
      if (stryMutAct_9fa48("12617")) {
        {}
      } else {
        stryCov_9fa48("12617");
        try {
          if (stryMutAct_9fa48("12618")) {
            {}
          } else {
            stryCov_9fa48("12618");
            processedError = JSON.parse(error);
          }
        } catch {
          if (stryMutAct_9fa48("12619")) {
            {}
          } else {
            stryCov_9fa48("12619");
            const errorInfo = extractErrorInfo(error);
            processedError = getErrorMessage(ERROR_CODES.SYSTEM_LOAD_FAILED, stryMutAct_9fa48("12620") ? {} : (stryCov_9fa48("12620"), {
              message: error
            }));
          }
        }
      }
    }
    if (stryMutAct_9fa48("12622") ? false : stryMutAct_9fa48("12621") ? true : (stryCov_9fa48("12621", "12622"), error)) {
      if (stryMutAct_9fa48("12623")) {
        {}
      } else {
        stryCov_9fa48("12623");
        return <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {stryMutAct_9fa48("12626") ? processedError || <ErrorMessageComponent error={processedError} onAction={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }} /> : stryMutAct_9fa48("12625") ? false : stryMutAct_9fa48("12624") ? true : (stryCov_9fa48("12624", "12625", "12626"), processedError && <ErrorMessageComponent error={processedError} onAction={() => {
              if (stryMutAct_9fa48("12627")) {
                {}
              } else {
                stryCov_9fa48("12627");
                if (stryMutAct_9fa48("12630") ? typeof window === 'undefined' : stryMutAct_9fa48("12629") ? false : stryMutAct_9fa48("12628") ? true : (stryCov_9fa48("12628", "12629", "12630"), typeof window !== (stryMutAct_9fa48("12631") ? "" : (stryCov_9fa48("12631"), 'undefined')))) {
                  if (stryMutAct_9fa48("12632")) {
                    {}
                  } else {
                    stryCov_9fa48("12632");
                    window.location.reload();
                  }
                }
              }
            }} />)}
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("12635") ? false : stryMutAct_9fa48("12634") ? true : stryMutAct_9fa48("12633") ? student : (stryCov_9fa48("12633", "12634", "12635"), !student)) {
      if (stryMutAct_9fa48("12636")) {
        {}
      } else {
        stryCov_9fa48("12636");
        return <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">No se encontró información del estudiante</p>
      </div>;
      }
    }
    return <>
      {stryMutAct_9fa48("12639") ? showTour || <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} /> : stryMutAct_9fa48("12638") ? false : stryMutAct_9fa48("12637") ? true : (stryCov_9fa48("12637", "12638", "12639"), showTour && <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} />)}
      <DashboardTutorial />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    ¡Hola, {student.nombre}! 👋
                  </h1>
                  <HelpIcon content="El Dashboard muestra tu progreso general, estadísticas por asignatura, intentos recientes y recomendaciones personalizadas basadas en tu rendimiento." side="right" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Bienvenido a tu dashboard de preparación PAES
                </p>
              </div>
              <div className="flex gap-2">
                <ExportButton onExportExcel={handleExportExcel} variant="outline" size="sm" />
                <Button variant="outline" size="sm" onClick={stryMutAct_9fa48("12640") ? () => undefined : (stryCov_9fa48("12640"), () => setShowGuide(stryMutAct_9fa48("12641") ? showGuide : (stryCov_9fa48("12641"), !showGuide)))}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {showGuide ? stryMutAct_9fa48("12642") ? "" : (stryCov_9fa48("12642"), 'Ocultar') : stryMutAct_9fa48("12643") ? "" : (stryCov_9fa48("12643"), 'Mostrar')} Guía
                </Button>
                {stryMutAct_9fa48("12646") ? !hasSeenTour || <Button variant="outline" size="sm" onClick={() => setShowTour(true)}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Tour
                  </Button> : stryMutAct_9fa48("12645") ? false : stryMutAct_9fa48("12644") ? true : (stryCov_9fa48("12644", "12645", "12646"), (stryMutAct_9fa48("12647") ? hasSeenTour : (stryCov_9fa48("12647"), !hasSeenTour)) && <Button variant="outline" size="sm" onClick={stryMutAct_9fa48("12648") ? () => undefined : (stryCov_9fa48("12648"), () => setShowTour(stryMutAct_9fa48("12649") ? false : (stryCov_9fa48("12649"), true)))}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Tour
                  </Button>)}
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          {stryMutAct_9fa48("12652") ? showGuide || <QuickGuide /> : stryMutAct_9fa48("12651") ? false : stryMutAct_9fa48("12650") ? true : (stryCov_9fa48("12650", "12651", "12652"), showGuide && <QuickGuide />)}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-tutorial="stats-cards">
            <StatsCard title="Total Intentos" description={stryMutAct_9fa48("12653") ? `` : (stryCov_9fa48("12653"), `${completedAttempts} completados`)} value={totalAttempts} icon={<BookOpen className="h-4 w-4" />} />
            <StatsCard title="Promedio General" description="Rendimiento promedio" value={Math.round(avgScore)} percentage={avgScore} comparison={stryMutAct_9fa48("12654") ? {} : (stryCov_9fa48("12654"), {
              value: 60,
              // Promedio general estimado
              label: stryMutAct_9fa48("12655") ? "" : (stryCov_9fa48("12655"), 'Promedio general')
            })} icon={<TrendingUp className="h-4 w-4" />} />
            <StatsCard title="Asignaturas" description="Con métricas registradas" value={metrics.length} icon={<Target className="h-4 w-4" />} />
            <StatsCard title="Mejor Puntaje" description="En tus intentos" value={(stryMutAct_9fa48("12659") ? student.attempts.length <= 0 : stryMutAct_9fa48("12658") ? student.attempts.length >= 0 : stryMutAct_9fa48("12657") ? false : stryMutAct_9fa48("12656") ? true : (stryCov_9fa48("12656", "12657", "12658", "12659"), student.attempts.length > 0)) ? Math.round(stryMutAct_9fa48("12660") ? Math.min(...student.attempts.map(a => a.porcentaje)) : (stryCov_9fa48("12660"), Math.max(...student.attempts.map(stryMutAct_9fa48("12661") ? () => undefined : (stryCov_9fa48("12661"), a => a.porcentaje))))) : 0} percentage={(stryMutAct_9fa48("12665") ? student.attempts.length <= 0 : stryMutAct_9fa48("12664") ? student.attempts.length >= 0 : stryMutAct_9fa48("12663") ? false : stryMutAct_9fa48("12662") ? true : (stryCov_9fa48("12662", "12663", "12664", "12665"), student.attempts.length > 0)) ? stryMutAct_9fa48("12666") ? Math.min(...student.attempts.map(a => a.porcentaje)) : (stryCov_9fa48("12666"), Math.max(...student.attempts.map(stryMutAct_9fa48("12667") ? () => undefined : (stryCov_9fa48("12667"), a => a.porcentaje)))) : 0} icon={<Award className="h-4 w-4" />} badge={(stryMutAct_9fa48("12670") ? student.attempts.length > 0 || Math.max(...student.attempts.map(a => a.porcentaje)) >= 90 : stryMutAct_9fa48("12669") ? false : stryMutAct_9fa48("12668") ? true : (stryCov_9fa48("12668", "12669", "12670"), (stryMutAct_9fa48("12673") ? student.attempts.length <= 0 : stryMutAct_9fa48("12672") ? student.attempts.length >= 0 : stryMutAct_9fa48("12671") ? true : (stryCov_9fa48("12671", "12672", "12673"), student.attempts.length > 0)) && (stryMutAct_9fa48("12676") ? Math.max(...student.attempts.map(a => a.porcentaje)) < 90 : stryMutAct_9fa48("12675") ? Math.max(...student.attempts.map(a => a.porcentaje)) > 90 : stryMutAct_9fa48("12674") ? true : (stryCov_9fa48("12674", "12675", "12676"), (stryMutAct_9fa48("12677") ? Math.min(...student.attempts.map(a => a.porcentaje)) : (stryCov_9fa48("12677"), Math.max(...student.attempts.map(stryMutAct_9fa48("12678") ? () => undefined : (stryCov_9fa48("12678"), a => a.porcentaje))))) >= 90)))) ? stryMutAct_9fa48("12679") ? {} : (stryCov_9fa48("12679"), {
              text: stryMutAct_9fa48("12680") ? "" : (stryCov_9fa48("12680"), 'Excelente'),
              variant: stryMutAct_9fa48("12681") ? "" : (stryCov_9fa48("12681"), 'default')
            }) : undefined} />
          </div>

          {/* Quick Actions */}
          <div data-tutorial="quick-actions">
            <QuickActions />
          </div>

          {/* Pending Reminders */}
          <PendingReminders pendingAttempts={pendingAttempts} pendingFlashcards={pendingFlashcards} pendingChallenges={pendingChallenges} pendingReviews={pendingReviews} />

          {/* Error History */}
          <ErrorHistory />

          {/* Action History and Joint Progress - Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionHistory />
            <JointProgress />
          </div>

          {/* Achievements */}
          <Achievements attempts={student.attempts} avgScore={avgScore} />

          {/* Recommendations */}
          <div data-tutorial="recommendations">
            <RecommendationsSection />
          </div>

          {/* Charts Row - Colapsable */}
          <CollapsibleSection title="Gráficos de Rendimiento" description="Visualiza tu progreso con gráficos interactivos" defaultOpen={stryMutAct_9fa48("12682") ? true : (stryCov_9fa48("12682"), false)} storageKey="dashboard-charts-collapsed" className="[&>div]:data-tutorial-charts">
            <div data-tutorial="charts">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance by Subject */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rendimiento por Asignatura</CardTitle>
                    <CardDescription>Porcentaje de aciertos por materia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="flex items-center justify-center h-[300px]">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>}>
                      <SubjectPerformanceChart data={subjectPerformance} />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progreso Temporal</CardTitle>
                    <CardDescription>Evolución de tu rendimiento en el tiempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProgressChart attempts={stryMutAct_9fa48("12683") ? student.attempts.map(a => ({
                      porcentaje: a.porcentaje,
                      startedAt: a.startedAt!,
                      exam: {
                        titulo: a.exam.titulo,
                        subject: {
                          codigo: a.exam.subject.codigo
                        }
                      }
                    })) : (stryCov_9fa48("12683"), student.attempts.filter(stryMutAct_9fa48("12684") ? () => undefined : (stryCov_9fa48("12684"), a => stryMutAct_9fa48("12687") ? a.estado === 'completado' || a.startedAt : stryMutAct_9fa48("12686") ? false : stryMutAct_9fa48("12685") ? true : (stryCov_9fa48("12685", "12686", "12687"), (stryMutAct_9fa48("12689") ? a.estado !== 'completado' : stryMutAct_9fa48("12688") ? true : (stryCov_9fa48("12688", "12689"), a.estado === (stryMutAct_9fa48("12690") ? "" : (stryCov_9fa48("12690"), 'completado')))) && a.startedAt))).map(stryMutAct_9fa48("12691") ? () => undefined : (stryCov_9fa48("12691"), a => stryMutAct_9fa48("12692") ? {} : (stryCov_9fa48("12692"), {
                      porcentaje: a.porcentaje,
                      startedAt: a.startedAt!,
                      exam: stryMutAct_9fa48("12693") ? {} : (stryCov_9fa48("12693"), {
                        titulo: a.exam.titulo,
                        subject: stryMutAct_9fa48("12694") ? {} : (stryCov_9fa48("12694"), {
                          codigo: a.exam.subject.codigo
                        })
                      })
                    }))))} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CollapsibleSection>

          {/* Subject Details - Colapsable */}
          <CollapsibleSection title="Detalles por Asignatura" description="Revisa tu rendimiento detallado por materia" defaultOpen={stryMutAct_9fa48("12695") ? true : (stryCov_9fa48("12695"), false)} storageKey="dashboard-subjects-collapsed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.map(metric => {
                if (stryMutAct_9fa48("12696")) {
                  {}
                } else {
                  stryCov_9fa48("12696");
                  // Determinar variante del badge basado en el porcentaje
                  let badgeVariant: 'default' | 'secondary' | 'destructive';
                  if (stryMutAct_9fa48("12700") ? metric.porcentaje < 70 : stryMutAct_9fa48("12699") ? metric.porcentaje > 70 : stryMutAct_9fa48("12698") ? false : stryMutAct_9fa48("12697") ? true : (stryCov_9fa48("12697", "12698", "12699", "12700"), metric.porcentaje >= 70)) {
                    if (stryMutAct_9fa48("12701")) {
                      {}
                    } else {
                      stryCov_9fa48("12701");
                      badgeVariant = stryMutAct_9fa48("12702") ? "" : (stryCov_9fa48("12702"), 'default');
                    }
                  } else if (stryMutAct_9fa48("12706") ? metric.porcentaje < 50 : stryMutAct_9fa48("12705") ? metric.porcentaje > 50 : stryMutAct_9fa48("12704") ? false : stryMutAct_9fa48("12703") ? true : (stryCov_9fa48("12703", "12704", "12705", "12706"), metric.porcentaje >= 50)) {
                    if (stryMutAct_9fa48("12707")) {
                      {}
                    } else {
                      stryCov_9fa48("12707");
                      badgeVariant = stryMutAct_9fa48("12708") ? "" : (stryCov_9fa48("12708"), 'secondary');
                    }
                  } else {
                    if (stryMutAct_9fa48("12709")) {
                      {}
                    } else {
                      stryCov_9fa48("12709");
                      badgeVariant = stryMutAct_9fa48("12710") ? "" : (stryCov_9fa48("12710"), 'destructive');
                    }
                  }
                  return <Card key={metric.codigo}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SubjectIcon codigo={metric.codigo} size={20} />
                          <CardTitle className="text-lg">{metric.nombre}</CardTitle>
                        </div>
                        <Badge variant={badgeVariant}>{Math.round(metric.porcentaje)}%</Badge>
                      </div>
                      <CardDescription>
                        {metric.correctas} de {metric.totalPreguntas} correctas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={metric.porcentaje} className="mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Temas evaluados:</p>
                        <div className="flex flex-wrap gap-2">
                          {metric.temas.map(stryMutAct_9fa48("12711") ? () => undefined : (stryCov_9fa48("12711"), tema => <Badge key={stryMutAct_9fa48("12712") ? `` : (stryCov_9fa48("12712"), `${tema.nombre}-${tema.porcentaje}`)} variant="outline" className="text-xs">
                              {tema.nombre}: {Math.round(tema.porcentaje)}%
                            </Badge>))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>;
                }
              })}
            </div>
          </CollapsibleSection>

          {/* Recent Attempts */}
          <Card>
            <CardHeader>
              <CardTitle>Últimos Intentos</CardTitle>
              <CardDescription>Historial de tus exámenes recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stryMutAct_9fa48("12715") ? student.attempts.length !== 0 : stryMutAct_9fa48("12714") ? false : stryMutAct_9fa48("12713") ? true : (stryCov_9fa48("12713", "12714", "12715"), student.attempts.length === 0)) ? <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No has realizado intentos aún</p>
                    <Button className="mt-4">Comenzar Examen</Button>
                  </div> : student.attempts.map(stryMutAct_9fa48("12716") ? () => undefined : (stryCov_9fa48("12716"), attempt => <Link key={attempt.id} href={stryMutAct_9fa48("12717") ? `` : (stryCov_9fa48("12717"), `/attempts/${attempt.id}`)} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{attempt.exam.titulo}</h3>
                          <Badge variant={(stryMutAct_9fa48("12720") ? attempt.estado !== 'completado' : stryMutAct_9fa48("12719") ? false : stryMutAct_9fa48("12718") ? true : (stryCov_9fa48("12718", "12719", "12720"), attempt.estado === (stryMutAct_9fa48("12721") ? "" : (stryCov_9fa48("12721"), 'completado')))) ? stryMutAct_9fa48("12722") ? "" : (stryCov_9fa48("12722"), 'default') : stryMutAct_9fa48("12723") ? "" : (stryCov_9fa48("12723"), 'secondary')}>
                            {attempt.estado}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {attempt.exam.subject.nombre} • {attempt.correctas}/
                          {attempt.totalPreguntas} correctas
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(attempt.createdAt).toLocaleDateString(stryMutAct_9fa48("12724") ? "" : (stryCov_9fa48("12724"), 'es-CL'))}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round(attempt.porcentaje)}%</div>
                        {stryMutAct_9fa48("12727") ? attempt.puntajePaes || <div className="text-sm text-gray-600 dark:text-gray-400">
                            PAES: {attempt.puntajePaes}
                          </div> : stryMutAct_9fa48("12726") ? false : stryMutAct_9fa48("12725") ? true : (stryCov_9fa48("12725", "12726", "12727"), attempt.puntajePaes && <div className="text-sm text-gray-600 dark:text-gray-400">
                            PAES: {attempt.puntajePaes}
                          </div>)}
                      </div>
                    </Link>))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>;
  }
}