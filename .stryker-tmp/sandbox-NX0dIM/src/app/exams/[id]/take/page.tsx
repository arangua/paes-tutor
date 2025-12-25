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
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, CheckCircle2, XCircle, Loader2, ArrowLeft, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { captureError } from '@/lib/monitoring';
import { validateIdParam } from '@/lib/validation-helpers';
import { useKeyboardShortcuts, examShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { ErrorMessageComponent } from '@/components/ui/error-message';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { ProgressWithTime } from '@/components/ui/progress-with-time';
import { TIME_CONSTANTS } from '@/lib/constants';
interface Exam {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  tiempoLimiteMin: number | null;
  totalPreguntas: number;
  subject: {
    nombre: string;
    codigo: string;
  };
  questions: Array<{
    orden: number;
    question: {
      id: string;
      enunciado: string;
      explicacion: string;
      options: Array<{
        id: string;
        letra: string;
        texto: string;
        esCorrecta: boolean;
      }>;
    };
  }>;
}
interface Attempt {
  id: string;
  estado: string;
  startedAt: string;
  examId: string;
}
interface Answer {
  questionId: string;
  optionSelectedId?: string;
  omitida?: boolean;
}
export default function TakeExamPage() {
  if (stryMutAct_9fa48("13099")) {
    {}
  } else {
    stryCov_9fa48("13099");
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;
    const [exam, setExam] = useState<Exam | null>(null);
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("13100") ? true : (stryCov_9fa48("13100"), false));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("13101") ? false : (stryCov_9fa48("13101"), true));
    const [error, setError] = useState<string | null>(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>(stryMutAct_9fa48("13102") ? "" : (stryCov_9fa48("13102"), 'saved'));
    const [saveMessage, setSaveMessage] = useState<string>(stryMutAct_9fa48("13103") ? "Stryker was here!" : (stryCov_9fa48("13103"), ''));
    const [showCancelDialog, setShowCancelDialog] = useState(stryMutAct_9fa48("13104") ? true : (stryCov_9fa48("13104"), false));
    const [showUnansweredDialog, setShowUnansweredDialog] = useState(stryMutAct_9fa48("13105") ? true : (stryCov_9fa48("13105"), false));
    const [unansweredCount, setUnansweredCount] = useState(0);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cargar examen y crear/obtener intento
    useEffect(() => {
      if (stryMutAct_9fa48("13106")) {
        {}
      } else {
        stryCov_9fa48("13106");
        // VALIDACIÓN: Verificar que examId sea válido (formato cuid)
        // Usar helper de validación para consistencia
        if (stryMutAct_9fa48("13109") ? false : stryMutAct_9fa48("13108") ? true : stryMutAct_9fa48("13107") ? validateIdParam(examId) : (stryCov_9fa48("13107", "13108", "13109"), !validateIdParam(examId))) {
          if (stryMutAct_9fa48("13110")) {
            {}
          } else {
            stryCov_9fa48("13110");
            setError(stryMutAct_9fa48("13111") ? "" : (stryCov_9fa48("13111"), 'ID de examen inválido'));
            setIsLoading(stryMutAct_9fa48("13112") ? true : (stryCov_9fa48("13112"), false));
            return;
          }
        }
        async function loadExam() {
          if (stryMutAct_9fa48("13113")) {
            {}
          } else {
            stryCov_9fa48("13113");
            try {
              if (stryMutAct_9fa48("13114")) {
                {}
              } else {
                stryCov_9fa48("13114");
                setIsLoading(stryMutAct_9fa48("13115") ? false : (stryCov_9fa48("13115"), true));
                setError(null);

                // Cargar examen específico
                const examRes = await fetch(stryMutAct_9fa48("13116") ? `` : (stryCov_9fa48("13116"), `/api/exams/${examId}`));
                if (stryMutAct_9fa48("13119") ? false : stryMutAct_9fa48("13118") ? true : stryMutAct_9fa48("13117") ? examRes.ok : (stryCov_9fa48("13117", "13118", "13119"), !examRes.ok)) {
                  if (stryMutAct_9fa48("13120")) {
                    {}
                  } else {
                    stryCov_9fa48("13120");
                    throw new Error(stryMutAct_9fa48("13121") ? "" : (stryCov_9fa48("13121"), 'Error al cargar el examen'));
                  }
                }
                const examData = await examRes.json();
                if (stryMutAct_9fa48("13124") ? false : stryMutAct_9fa48("13123") ? true : stryMutAct_9fa48("13122") ? examData : (stryCov_9fa48("13122", "13123", "13124"), !examData)) {
                  if (stryMutAct_9fa48("13125")) {
                    {}
                  } else {
                    stryCov_9fa48("13125");
                    throw new Error(stryMutAct_9fa48("13126") ? "" : (stryCov_9fa48("13126"), 'Examen no encontrado'));
                  }
                }

                // Ordenar preguntas por orden
                interface ExamQuestion {
                  orden: number;
                  question: {
                    id: string;
                    enunciado: string;
                    explicacion: string;
                    options: Array<{
                      id: string;
                      letra: string;
                      texto: string;
                      esCorrecta: boolean;
                    }>;
                  };
                }
                interface AttemptAnswer {
                  questionId: string;
                  optionSelectedId: string | null;
                  omitida: boolean;
                }
                const sortedExam = stryMutAct_9fa48("13127") ? {} : (stryCov_9fa48("13127"), {
                  ...examData,
                  questions: stryMutAct_9fa48("13128") ? examData.questions : (stryCov_9fa48("13128"), examData.questions.sort(stryMutAct_9fa48("13129") ? () => undefined : (stryCov_9fa48("13129"), (a: ExamQuestion, b: ExamQuestion) => stryMutAct_9fa48("13130") ? a.orden + b.orden : (stryCov_9fa48("13130"), a.orden - b.orden))))
                });
                setExam(sortedExam);

                // Crear o obtener intento
                const attemptRes = await fetch(stryMutAct_9fa48("13131") ? "" : (stryCov_9fa48("13131"), '/api/attempts'), stryMutAct_9fa48("13132") ? {} : (stryCov_9fa48("13132"), {
                  method: stryMutAct_9fa48("13133") ? "" : (stryCov_9fa48("13133"), 'POST'),
                  headers: stryMutAct_9fa48("13134") ? {} : (stryCov_9fa48("13134"), {
                    'Content-Type': stryMutAct_9fa48("13135") ? "" : (stryCov_9fa48("13135"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("13136") ? {} : (stryCov_9fa48("13136"), {
                    examId
                  }))
                }));
                if (stryMutAct_9fa48("13139") ? false : stryMutAct_9fa48("13138") ? true : stryMutAct_9fa48("13137") ? attemptRes.ok : (stryCov_9fa48("13137", "13138", "13139"), !attemptRes.ok)) {
                  if (stryMutAct_9fa48("13140")) {
                    {}
                  } else {
                    stryCov_9fa48("13140");
                    if (stryMutAct_9fa48("13143") ? attemptRes.status !== 401 : stryMutAct_9fa48("13142") ? false : stryMutAct_9fa48("13141") ? true : (stryCov_9fa48("13141", "13142", "13143"), attemptRes.status === 401)) {
                      if (stryMutAct_9fa48("13144")) {
                        {}
                      } else {
                        stryCov_9fa48("13144");
                        throw new Error(stryMutAct_9fa48("13145") ? "" : (stryCov_9fa48("13145"), 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente para comenzar el examen.'));
                      }
                    } else if (stryMutAct_9fa48("13148") ? attemptRes.status !== 404 : stryMutAct_9fa48("13147") ? false : stryMutAct_9fa48("13146") ? true : (stryCov_9fa48("13146", "13147", "13148"), attemptRes.status === 404)) {
                      if (stryMutAct_9fa48("13149")) {
                        {}
                      } else {
                        stryCov_9fa48("13149");
                        throw new Error(stryMutAct_9fa48("13150") ? "" : (stryCov_9fa48("13150"), 'El examen no se encontró. Verifica que el examen exista y que tengas acceso a él.'));
                      }
                    } else if (stryMutAct_9fa48("13154") ? attemptRes.status < 500 : stryMutAct_9fa48("13153") ? attemptRes.status > 500 : stryMutAct_9fa48("13152") ? false : stryMutAct_9fa48("13151") ? true : (stryCov_9fa48("13151", "13152", "13153", "13154"), attemptRes.status >= 500)) {
                      if (stryMutAct_9fa48("13155")) {
                        {}
                      } else {
                        stryCov_9fa48("13155");
                        throw new Error(stryMutAct_9fa48("13156") ? "" : (stryCov_9fa48("13156"), 'Error del servidor. Por favor, intenta nuevamente en unos momentos.'));
                      }
                    } else {
                      if (stryMutAct_9fa48("13157")) {
                        {}
                      } else {
                        stryCov_9fa48("13157");
                        throw new Error(stryMutAct_9fa48("13158") ? "" : (stryCov_9fa48("13158"), 'No se pudo iniciar el examen. Por favor, intenta nuevamente o contacta al administrador.'));
                      }
                    }
                  }
                }
                const attemptData = await attemptRes.json();
                setAttempt(attemptData);

                // Cargar respuestas existentes si hay
                if (stryMutAct_9fa48("13161") ? attemptData.answers || attemptData.answers.length > 0 : stryMutAct_9fa48("13160") ? false : stryMutAct_9fa48("13159") ? true : (stryCov_9fa48("13159", "13160", "13161"), attemptData.answers && (stryMutAct_9fa48("13164") ? attemptData.answers.length <= 0 : stryMutAct_9fa48("13163") ? attemptData.answers.length >= 0 : stryMutAct_9fa48("13162") ? true : (stryCov_9fa48("13162", "13163", "13164"), attemptData.answers.length > 0)))) {
                  if (stryMutAct_9fa48("13165")) {
                    {}
                  } else {
                    stryCov_9fa48("13165");
                    const existingAnswers = new Map<string, Answer>();
                    attemptData.answers.forEach((ans: AttemptAnswer) => {
                      if (stryMutAct_9fa48("13166")) {
                        {}
                      } else {
                        stryCov_9fa48("13166");
                        existingAnswers.set(ans.questionId, stryMutAct_9fa48("13167") ? {} : (stryCov_9fa48("13167"), {
                          questionId: ans.questionId,
                          optionSelectedId: stryMutAct_9fa48("13170") ? ans.optionSelectedId && undefined : stryMutAct_9fa48("13169") ? false : stryMutAct_9fa48("13168") ? true : (stryCov_9fa48("13168", "13169", "13170"), ans.optionSelectedId || undefined),
                          omitida: ans.omitida
                        }));
                      }
                    });
                    setAnswers(existingAnswers);
                  }
                }

                // Calcular tiempo restante si hay límite
                if (stryMutAct_9fa48("13172") ? false : stryMutAct_9fa48("13171") ? true : (stryCov_9fa48("13171", "13172"), examData.tiempoLimiteMin)) {
                  if (stryMutAct_9fa48("13173")) {
                    {}
                  } else {
                    stryCov_9fa48("13173");
                    const startedAt = new Date(attemptData.startedAt);
                    const limitMs = stryMutAct_9fa48("13174") ? examData.tiempoLimiteMin * 60 / 1000 : (stryCov_9fa48("13174"), (stryMutAct_9fa48("13175") ? examData.tiempoLimiteMin / 60 : (stryCov_9fa48("13175"), examData.tiempoLimiteMin * 60)) * 1000);
                    const elapsed = stryMutAct_9fa48("13176") ? Date.now() + startedAt.getTime() : (stryCov_9fa48("13176"), Date.now() - startedAt.getTime());
                    const remaining = stryMutAct_9fa48("13177") ? Math.min(0, limitMs - elapsed) : (stryCov_9fa48("13177"), Math.max(0, stryMutAct_9fa48("13178") ? limitMs + elapsed : (stryCov_9fa48("13178"), limitMs - elapsed)));
                    setTimeRemaining(Math.floor(stryMutAct_9fa48("13179") ? remaining * 1000 : (stryCov_9fa48("13179"), remaining / 1000)));
                  }
                }
              }
            } catch (err) {
              if (stryMutAct_9fa48("13180")) {
                {}
              } else {
                stryCov_9fa48("13180");
                const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("13181") ? "" : (stryCov_9fa48("13181"), 'Error desconocido al cargar el examen');
                setError(errorMessage);
                toast.error(stryMutAct_9fa48("13182") ? "" : (stryCov_9fa48("13182"), 'Error al cargar el examen'), stryMutAct_9fa48("13183") ? {} : (stryCov_9fa48("13183"), {
                  description: errorMessage,
                  duration: 5000
                }));
              }
            } finally {
              if (stryMutAct_9fa48("13184")) {
                {}
              } else {
                stryCov_9fa48("13184");
                setIsLoading(stryMutAct_9fa48("13185") ? true : (stryCov_9fa48("13185"), false));
              }
            }
          }
        }
        if (stryMutAct_9fa48("13187") ? false : stryMutAct_9fa48("13186") ? true : (stryCov_9fa48("13186", "13187"), examId)) {
          if (stryMutAct_9fa48("13188")) {
            {}
          } else {
            stryCov_9fa48("13188");
            loadExam();
          }
        }
      }
    }, stryMutAct_9fa48("13189") ? [] : (stryCov_9fa48("13189"), [examId]));
    const saveAnswers = useCallback(async () => {
      if (stryMutAct_9fa48("13190")) {
        {}
      } else {
        stryCov_9fa48("13190");
        if (stryMutAct_9fa48("13193") ? !attempt && !exam : stryMutAct_9fa48("13192") ? false : stryMutAct_9fa48("13191") ? true : (stryCov_9fa48("13191", "13192", "13193"), (stryMutAct_9fa48("13194") ? attempt : (stryCov_9fa48("13194"), !attempt)) || (stryMutAct_9fa48("13195") ? exam : (stryCov_9fa48("13195"), !exam)))) return;

        // VALIDACIÓN FRONTEND: Verificar que no haya más respuestas que preguntas
        if (stryMutAct_9fa48("13199") ? answers.size <= exam.totalPreguntas : stryMutAct_9fa48("13198") ? answers.size >= exam.totalPreguntas : stryMutAct_9fa48("13197") ? false : stryMutAct_9fa48("13196") ? true : (stryCov_9fa48("13196", "13197", "13198", "13199"), answers.size > exam.totalPreguntas)) {
          if (stryMutAct_9fa48("13200")) {
            {}
          } else {
            stryCov_9fa48("13200");
            setError(stryMutAct_9fa48("13201") ? `` : (stryCov_9fa48("13201"), `No puedes tener más de ${exam.totalPreguntas} respuestas`));
            setAutoSaveStatus(stryMutAct_9fa48("13202") ? "" : (stryCov_9fa48("13202"), 'error'));
            return;
          }
        }

        // VALIDACIÓN FRONTEND: Verificar que no haya respuestas duplicadas
        const questionIds = new Set<string>();
        const duplicates: string[] = stryMutAct_9fa48("13203") ? ["Stryker was here"] : (stryCov_9fa48("13203"), []);
        for (const answer of answers.values()) {
          if (stryMutAct_9fa48("13204")) {
            {}
          } else {
            stryCov_9fa48("13204");
            if (stryMutAct_9fa48("13206") ? false : stryMutAct_9fa48("13205") ? true : (stryCov_9fa48("13205", "13206"), questionIds.has(answer.questionId))) {
              if (stryMutAct_9fa48("13207")) {
                {}
              } else {
                stryCov_9fa48("13207");
                duplicates.push(answer.questionId);
              }
            }
            questionIds.add(answer.questionId);
          }
        }
        if (stryMutAct_9fa48("13211") ? duplicates.length <= 0 : stryMutAct_9fa48("13210") ? duplicates.length >= 0 : stryMutAct_9fa48("13209") ? false : stryMutAct_9fa48("13208") ? true : (stryCov_9fa48("13208", "13209", "13210", "13211"), duplicates.length > 0)) {
          if (stryMutAct_9fa48("13212")) {
            {}
          } else {
            stryCov_9fa48("13212");
            setError(stryMutAct_9fa48("13213") ? "" : (stryCov_9fa48("13213"), 'Hay respuestas duplicadas. Por favor, revisa tus respuestas.'));
            setAutoSaveStatus(stryMutAct_9fa48("13214") ? "" : (stryCov_9fa48("13214"), 'error'));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("13215")) {
            {}
          } else {
            stryCov_9fa48("13215");
            setAutoSaveStatus(stryMutAct_9fa48("13216") ? "" : (stryCov_9fa48("13216"), 'saving'));
            const answersArray = Array.from(answers.values());
            const savedCount = answersArray.length;
            const totalQuestions = exam.totalPreguntas;
            setSaveMessage(stryMutAct_9fa48("13217") ? `` : (stryCov_9fa48("13217"), `Guardando ${savedCount} de ${totalQuestions} respuesta${(stryMutAct_9fa48("13220") ? savedCount === 1 : stryMutAct_9fa48("13219") ? false : stryMutAct_9fa48("13218") ? true : (stryCov_9fa48("13218", "13219", "13220"), savedCount !== 1)) ? stryMutAct_9fa48("13221") ? "" : (stryCov_9fa48("13221"), 's') : stryMutAct_9fa48("13222") ? "Stryker was here!" : (stryCov_9fa48("13222"), '')}...`));
            const res = await fetch(stryMutAct_9fa48("13223") ? `` : (stryCov_9fa48("13223"), `/api/attempts/${attempt.id}`), stryMutAct_9fa48("13224") ? {} : (stryCov_9fa48("13224"), {
              method: stryMutAct_9fa48("13225") ? "" : (stryCov_9fa48("13225"), 'PUT'),
              headers: stryMutAct_9fa48("13226") ? {} : (stryCov_9fa48("13226"), {
                'Content-Type': stryMutAct_9fa48("13227") ? "" : (stryCov_9fa48("13227"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("13228") ? {} : (stryCov_9fa48("13228"), {
                answers: answersArray
              }))
            }));
            if (stryMutAct_9fa48("13231") ? false : stryMutAct_9fa48("13230") ? true : stryMutAct_9fa48("13229") ? res.ok : (stryCov_9fa48("13229", "13230", "13231"), !res.ok)) {
              if (stryMutAct_9fa48("13232")) {
                {}
              } else {
                stryCov_9fa48("13232");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("13233") ? "" : (stryCov_9fa48("13233"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                  details?: string;
                }>(res, stryMutAct_9fa48("13234") ? {} : (stryCov_9fa48("13234"), {
                  path: (stryMutAct_9fa48("13237") ? typeof window === 'undefined' : stryMutAct_9fa48("13236") ? false : stryMutAct_9fa48("13235") ? true : (stryCov_9fa48("13235", "13236", "13237"), typeof window !== (stryMutAct_9fa48("13238") ? "" : (stryCov_9fa48("13238"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("13239") ? "" : (stryCov_9fa48("13239"), '/exams/[id]/take'),
                  operation: stryMutAct_9fa48("13240") ? "" : (stryCov_9fa48("13240"), 'guardar respuestas')
                }));
                const errorInfo = extractErrorInfo(stryMutAct_9fa48("13243") ? errorData.error && 'Error al guardar respuestas' : stryMutAct_9fa48("13242") ? false : stryMutAct_9fa48("13241") ? true : (stryCov_9fa48("13241", "13242", "13243"), errorData.error || (stryMutAct_9fa48("13244") ? "" : (stryCov_9fa48("13244"), 'Error al guardar respuestas'))));
                const errorMessage = getErrorMessage(errorInfo.code, stryMutAct_9fa48("13245") ? {} : (stryCov_9fa48("13245"), {
                  ...errorInfo.context,
                  details: errorData.details
                }));
                throw new Error(stryMutAct_9fa48("13246") ? `` : (stryCov_9fa48("13246"), `[${errorInfo.code}] ${errorMessage.description}`));
              }
            }
            setAutoSaveStatus(stryMutAct_9fa48("13247") ? "" : (stryCov_9fa48("13247"), 'saved'));
            setSaveMessage(stryMutAct_9fa48("13248") ? `` : (stryCov_9fa48("13248"), `Guardado: ${savedCount} respuesta${(stryMutAct_9fa48("13251") ? savedCount === 1 : stryMutAct_9fa48("13250") ? false : stryMutAct_9fa48("13249") ? true : (stryCov_9fa48("13249", "13250", "13251"), savedCount !== 1)) ? stryMutAct_9fa48("13252") ? "" : (stryCov_9fa48("13252"), 's') : stryMutAct_9fa48("13253") ? "Stryker was here!" : (stryCov_9fa48("13253"), '')} en el servidor`));
            // Limpiar error si se guardó correctamente
            if (stryMutAct_9fa48("13255") ? false : stryMutAct_9fa48("13254") ? true : (stryCov_9fa48("13254", "13255"), error)) setError(null);

            // Limpiar mensaje después de 2 segundos
            setTimeout(() => {
              if (stryMutAct_9fa48("13256")) {
                {}
              } else {
                stryCov_9fa48("13256");
                setSaveMessage(stryMutAct_9fa48("13257") ? "Stryker was here!" : (stryCov_9fa48("13257"), ''));
              }
            }, 2000);
          }
        } catch (err) {
          if (stryMutAct_9fa48("13258")) {
            {}
          } else {
            stryCov_9fa48("13258");
            setAutoSaveStatus(stryMutAct_9fa48("13259") ? "" : (stryCov_9fa48("13259"), 'error'));
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("13260") ? "" : (stryCov_9fa48("13260"), 'Error al guardar respuestas');

            // Mostrar toast solo si el error es crítico (no para errores temporales de red)
            if (stryMutAct_9fa48("13263") ? err instanceof Error && !errorMessage.includes('red') || !errorMessage.includes('conexión') : stryMutAct_9fa48("13262") ? false : stryMutAct_9fa48("13261") ? true : (stryCov_9fa48("13261", "13262", "13263"), (stryMutAct_9fa48("13265") ? err instanceof Error || !errorMessage.includes('red') : stryMutAct_9fa48("13264") ? true : (stryCov_9fa48("13264", "13265"), err instanceof Error && (stryMutAct_9fa48("13266") ? errorMessage.includes('red') : (stryCov_9fa48("13266"), !errorMessage.includes(stryMutAct_9fa48("13267") ? "" : (stryCov_9fa48("13267"), 'red')))))) && (stryMutAct_9fa48("13268") ? errorMessage.includes('conexión') : (stryCov_9fa48("13268"), !errorMessage.includes(stryMutAct_9fa48("13269") ? "" : (stryCov_9fa48("13269"), 'conexión')))))) {
              if (stryMutAct_9fa48("13270")) {
                {}
              } else {
                stryCov_9fa48("13270");
                toast.error(stryMutAct_9fa48("13271") ? "" : (stryCov_9fa48("13271"), 'Error al guardar respuestas'), stryMutAct_9fa48("13272") ? {} : (stryCov_9fa48("13272"), {
                  description: errorMessage,
                  duration: 4000
                }));
              }
            }

            // Log error usando servicio de monitoreo
            captureError(err instanceof Error ? err : new Error(String(err)), stryMutAct_9fa48("13273") ? {} : (stryCov_9fa48("13273"), {
              type: stryMutAct_9fa48("13274") ? "" : (stryCov_9fa48("13274"), 'exam_save_error'),
              attemptId: stryMutAct_9fa48("13275") ? attempt.id : (stryCov_9fa48("13275"), attempt?.id),
              path: (stryMutAct_9fa48("13278") ? typeof window === 'undefined' : stryMutAct_9fa48("13277") ? false : stryMutAct_9fa48("13276") ? true : (stryCov_9fa48("13276", "13277", "13278"), typeof window !== (stryMutAct_9fa48("13279") ? "" : (stryCov_9fa48("13279"), 'undefined')))) ? window.location.pathname : undefined
            }));
          }
        }
      }
    }, stryMutAct_9fa48("13280") ? [] : (stryCov_9fa48("13280"), [attempt, exam, answers, error]));

    // Función para confirmar y finalizar examen
    const confirmSubmit = useCallback(async () => {
      if (stryMutAct_9fa48("13281")) {
        {}
      } else {
        stryCov_9fa48("13281");
        if (stryMutAct_9fa48("13284") ? (!attempt || !exam) && isSubmitting : stryMutAct_9fa48("13283") ? false : stryMutAct_9fa48("13282") ? true : (stryCov_9fa48("13282", "13283", "13284"), (stryMutAct_9fa48("13286") ? !attempt && !exam : stryMutAct_9fa48("13285") ? false : (stryCov_9fa48("13285", "13286"), (stryMutAct_9fa48("13287") ? attempt : (stryCov_9fa48("13287"), !attempt)) || (stryMutAct_9fa48("13288") ? exam : (stryCov_9fa48("13288"), !exam)))) || isSubmitting)) return;
        setIsSubmitting(stryMutAct_9fa48("13289") ? false : (stryCov_9fa48("13289"), true));
        setError(null);
        setShowUnansweredDialog(stryMutAct_9fa48("13290") ? true : (stryCov_9fa48("13290"), false));
        try {
          if (stryMutAct_9fa48("13291")) {
            {}
          } else {
            stryCov_9fa48("13291");
            const answersArray = Array.from(answers.values());

            // VALIDACIÓN FRONTEND: Verificar límites antes de enviar
            if (stryMutAct_9fa48("13295") ? answersArray.length <= exam.totalPreguntas : stryMutAct_9fa48("13294") ? answersArray.length >= exam.totalPreguntas : stryMutAct_9fa48("13293") ? false : stryMutAct_9fa48("13292") ? true : (stryCov_9fa48("13292", "13293", "13294", "13295"), answersArray.length > exam.totalPreguntas)) {
              if (stryMutAct_9fa48("13296")) {
                {}
              } else {
                stryCov_9fa48("13296");
                setError(stryMutAct_9fa48("13297") ? `` : (stryCov_9fa48("13297"), `Error: Tienes ${answersArray.length} respuestas, pero el examen solo tiene ${exam.totalPreguntas} preguntas`));
                setIsSubmitting(stryMutAct_9fa48("13298") ? true : (stryCov_9fa48("13298"), false));
                return;
              }
            }

            // Guardar respuestas finales
            setSaveMessage(stryMutAct_9fa48("13299") ? "" : (stryCov_9fa48("13299"), 'Guardando respuestas finales...'));
            await fetch(stryMutAct_9fa48("13300") ? `` : (stryCov_9fa48("13300"), `/api/attempts/${attempt.id}`), stryMutAct_9fa48("13301") ? {} : (stryCov_9fa48("13301"), {
              method: stryMutAct_9fa48("13302") ? "" : (stryCov_9fa48("13302"), 'PUT'),
              headers: stryMutAct_9fa48("13303") ? {} : (stryCov_9fa48("13303"), {
                'Content-Type': stryMutAct_9fa48("13304") ? "" : (stryCov_9fa48("13304"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("13305") ? {} : (stryCov_9fa48("13305"), {
                answers: answersArray
              }))
            }));

            // Finalizar intento
            setSaveMessage(stryMutAct_9fa48("13306") ? "" : (stryCov_9fa48("13306"), 'Procesando finalización del examen...'));
            const res = await fetch(stryMutAct_9fa48("13307") ? `` : (stryCov_9fa48("13307"), `/api/attempts/${attempt.id}/submit`), stryMutAct_9fa48("13308") ? {} : (stryCov_9fa48("13308"), {
              method: stryMutAct_9fa48("13309") ? "" : (stryCov_9fa48("13309"), 'POST')
            }));
            if (stryMutAct_9fa48("13312") ? false : stryMutAct_9fa48("13311") ? true : stryMutAct_9fa48("13310") ? res.ok : (stryCov_9fa48("13310", "13311", "13312"), !res.ok)) {
              if (stryMutAct_9fa48("13313")) {
                {}
              } else {
                stryCov_9fa48("13313");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("13314") ? "" : (stryCov_9fa48("13314"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                  details?: string;
                }>(res, stryMutAct_9fa48("13315") ? {} : (stryCov_9fa48("13315"), {
                  path: (stryMutAct_9fa48("13318") ? typeof window === 'undefined' : stryMutAct_9fa48("13317") ? false : stryMutAct_9fa48("13316") ? true : (stryCov_9fa48("13316", "13317", "13318"), typeof window !== (stryMutAct_9fa48("13319") ? "" : (stryCov_9fa48("13319"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("13320") ? "" : (stryCov_9fa48("13320"), '/exams/[id]/take'),
                  operation: stryMutAct_9fa48("13321") ? "" : (stryCov_9fa48("13321"), 'finalizar examen')
                }));
                const errorMessage = stryMutAct_9fa48("13324") ? errorData.error && 'Error al finalizar examen' : stryMutAct_9fa48("13323") ? false : stryMutAct_9fa48("13322") ? true : (stryCov_9fa48("13322", "13323", "13324"), errorData.error || (stryMutAct_9fa48("13325") ? "" : (stryCov_9fa48("13325"), 'Error al finalizar examen')));
                const errorDetails = errorData.details ? stryMutAct_9fa48("13326") ? `` : (stryCov_9fa48("13326"), `: ${errorData.details}`) : stryMutAct_9fa48("13327") ? "Stryker was here!" : (stryCov_9fa48("13327"), '');
                throw new Error(stryMutAct_9fa48("13328") ? `` : (stryCov_9fa48("13328"), `${errorMessage}${errorDetails}`));
              }
            }

            // Redirigir a resultados
            router.push(stryMutAct_9fa48("13329") ? `` : (stryCov_9fa48("13329"), `/exams/${examId}/results?attemptId=${attempt.id}`));
          }
        } catch (err) {
          if (stryMutAct_9fa48("13330")) {
            {}
          } else {
            stryCov_9fa48("13330");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("13331") ? "" : (stryCov_9fa48("13331"), 'Error al finalizar examen');
            setError(errorMessage);
            setIsSubmitting(stryMutAct_9fa48("13332") ? true : (stryCov_9fa48("13332"), false));
            toast.error(stryMutAct_9fa48("13333") ? "" : (stryCov_9fa48("13333"), 'Error al finalizar examen'), stryMutAct_9fa48("13334") ? {} : (stryCov_9fa48("13334"), {
              description: errorMessage,
              duration: 6000,
              action: stryMutAct_9fa48("13335") ? {} : (stryCov_9fa48("13335"), {
                label: stryMutAct_9fa48("13336") ? "" : (stryCov_9fa48("13336"), 'Reintentar'),
                onClick: stryMutAct_9fa48("13337") ? () => undefined : (stryCov_9fa48("13337"), () => handleSubmit())
              })
            }));
          }
        }
      }
    }, stryMutAct_9fa48("13338") ? [] : (stryCov_9fa48("13338"), [attempt, exam, answers, examId, router, isSubmitting]));
    const handleSubmit = useCallback(async () => {
      if (stryMutAct_9fa48("13339")) {
        {}
      } else {
        stryCov_9fa48("13339");
        if (stryMutAct_9fa48("13342") ? (!attempt || !exam) && isSubmitting : stryMutAct_9fa48("13341") ? false : stryMutAct_9fa48("13340") ? true : (stryCov_9fa48("13340", "13341", "13342"), (stryMutAct_9fa48("13344") ? !attempt && !exam : stryMutAct_9fa48("13343") ? false : (stryCov_9fa48("13343", "13344"), (stryMutAct_9fa48("13345") ? attempt : (stryCov_9fa48("13345"), !attempt)) || (stryMutAct_9fa48("13346") ? exam : (stryCov_9fa48("13346"), !exam)))) || isSubmitting)) return;

        // VALIDACIÓN FRONTEND: Verificar que todas las preguntas tengan respuesta o estén omitidas
        const answersArray = Array.from(answers.values());
        const answeredQuestions = new Set(answersArray.map(stryMutAct_9fa48("13347") ? () => undefined : (stryCov_9fa48("13347"), a => a.questionId)));
        const totalQuestions = exam.questions.length;
        if (stryMutAct_9fa48("13351") ? answeredQuestions.size >= totalQuestions : stryMutAct_9fa48("13350") ? answeredQuestions.size <= totalQuestions : stryMutAct_9fa48("13349") ? false : stryMutAct_9fa48("13348") ? true : (stryCov_9fa48("13348", "13349", "13350", "13351"), answeredQuestions.size < totalQuestions)) {
          if (stryMutAct_9fa48("13352")) {
            {}
          } else {
            stryCov_9fa48("13352");
            const unanswered = stryMutAct_9fa48("13353") ? totalQuestions + answeredQuestions.size : (stryCov_9fa48("13353"), totalQuestions - answeredQuestions.size);
            setUnansweredCount(unanswered);
            setShowUnansweredDialog(stryMutAct_9fa48("13354") ? false : (stryCov_9fa48("13354"), true));
            return;
          }
        }

        // Si todas las preguntas están respondidas, proceder directamente
        await confirmSubmit();
      }
    }, stryMutAct_9fa48("13355") ? [] : (stryCov_9fa48("13355"), [attempt, exam, answers, isSubmitting, confirmSubmit]));

    // Timer countdown - optimizado para evitar re-renders innecesarios
    useEffect(() => {
      if (stryMutAct_9fa48("13356")) {
        {}
      } else {
        stryCov_9fa48("13356");
        if (stryMutAct_9fa48("13359") ? timeRemaining === null && timeRemaining <= 0 : stryMutAct_9fa48("13358") ? false : stryMutAct_9fa48("13357") ? true : (stryCov_9fa48("13357", "13358", "13359"), (stryMutAct_9fa48("13361") ? timeRemaining !== null : stryMutAct_9fa48("13360") ? false : (stryCov_9fa48("13360", "13361"), timeRemaining === null)) || (stryMutAct_9fa48("13364") ? timeRemaining > 0 : stryMutAct_9fa48("13363") ? timeRemaining < 0 : stryMutAct_9fa48("13362") ? false : (stryCov_9fa48("13362", "13363", "13364"), timeRemaining <= 0)))) {
          if (stryMutAct_9fa48("13365")) {
            {}
          } else {
            stryCov_9fa48("13365");
            // Si el tiempo se agotó, auto-submit (solo si el intento aún está en progreso)
            if (stryMutAct_9fa48("13368") ? timeRemaining === 0 && attempt && attempt.estado === 'en_progreso' || !isSubmitting : stryMutAct_9fa48("13367") ? false : stryMutAct_9fa48("13366") ? true : (stryCov_9fa48("13366", "13367", "13368"), (stryMutAct_9fa48("13370") ? timeRemaining === 0 && attempt || attempt.estado === 'en_progreso' : stryMutAct_9fa48("13369") ? true : (stryCov_9fa48("13369", "13370"), (stryMutAct_9fa48("13372") ? timeRemaining === 0 || attempt : stryMutAct_9fa48("13371") ? true : (stryCov_9fa48("13371", "13372"), (stryMutAct_9fa48("13374") ? timeRemaining !== 0 : stryMutAct_9fa48("13373") ? true : (stryCov_9fa48("13373", "13374"), timeRemaining === 0)) && attempt)) && (stryMutAct_9fa48("13376") ? attempt.estado !== 'en_progreso' : stryMutAct_9fa48("13375") ? true : (stryCov_9fa48("13375", "13376"), attempt.estado === (stryMutAct_9fa48("13377") ? "" : (stryCov_9fa48("13377"), 'en_progreso')))))) && (stryMutAct_9fa48("13378") ? isSubmitting : (stryCov_9fa48("13378"), !isSubmitting)))) {
              if (stryMutAct_9fa48("13379")) {
                {}
              } else {
                stryCov_9fa48("13379");
                handleSubmit();
              }
            }
            return;
          }
        }
        const interval = setInterval(() => {
          if (stryMutAct_9fa48("13380")) {
            {}
          } else {
            stryCov_9fa48("13380");
            setTimeRemaining(prev => {
              if (stryMutAct_9fa48("13381")) {
                {}
              } else {
                stryCov_9fa48("13381");
                if (stryMutAct_9fa48("13384") ? prev === null && prev <= 1 : stryMutAct_9fa48("13383") ? false : stryMutAct_9fa48("13382") ? true : (stryCov_9fa48("13382", "13383", "13384"), (stryMutAct_9fa48("13386") ? prev !== null : stryMutAct_9fa48("13385") ? false : (stryCov_9fa48("13385", "13386"), prev === null)) || (stryMutAct_9fa48("13389") ? prev > 1 : stryMutAct_9fa48("13388") ? prev < 1 : stryMutAct_9fa48("13387") ? false : (stryCov_9fa48("13387", "13388", "13389"), prev <= 1)))) {
                  if (stryMutAct_9fa48("13390")) {
                    {}
                  } else {
                    stryCov_9fa48("13390");
                    return 0; // Marcar como agotado, el efecto se ejecutará de nuevo
                  }
                }
                return stryMutAct_9fa48("13391") ? prev + 1 : (stryCov_9fa48("13391"), prev - 1);
              }
            });
          }
        }, 1000);
        return stryMutAct_9fa48("13392") ? () => undefined : (stryCov_9fa48("13392"), () => clearInterval(interval));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // handleSubmit está memoizado con useCallback y es estable, no necesita estar en deps
        // timeRemaining, attempt e isSubmitting son las únicas dependencias necesarias para el efecto
      }
    }, stryMutAct_9fa48("13393") ? [] : (stryCov_9fa48("13393"), [timeRemaining, attempt, isSubmitting]));

    // Auto-guardar respuestas con prevención de race condition
    useEffect(() => {
      if (stryMutAct_9fa48("13394")) {
        {}
      } else {
        stryCov_9fa48("13394");
        if (stryMutAct_9fa48("13397") ? !attempt && answers.size === 0 : stryMutAct_9fa48("13396") ? false : stryMutAct_9fa48("13395") ? true : (stryCov_9fa48("13395", "13396", "13397"), (stryMutAct_9fa48("13398") ? attempt : (stryCov_9fa48("13398"), !attempt)) || (stryMutAct_9fa48("13400") ? answers.size !== 0 : stryMutAct_9fa48("13399") ? false : (stryCov_9fa48("13399", "13400"), answers.size === 0)))) return;

        // Cancelar timeout anterior si existe
        if (stryMutAct_9fa48("13402") ? false : stryMutAct_9fa48("13401") ? true : (stryCov_9fa48("13401", "13402"), saveTimeoutRef.current)) {
          if (stryMutAct_9fa48("13403")) {
            {}
          } else {
            stryCov_9fa48("13403");
            clearTimeout(saveTimeoutRef.current);
          }
        }
        saveTimeoutRef.current = setTimeout(async () => {
          if (stryMutAct_9fa48("13404")) {
            {}
          } else {
            stryCov_9fa48("13404");
            await saveAnswers();
            saveTimeoutRef.current = null;
          }
        }, TIME_CONSTANTS.AUTO_SAVE_DELAY_MS);
        return () => {
          if (stryMutAct_9fa48("13405")) {
            {}
          } else {
            stryCov_9fa48("13405");
            if (stryMutAct_9fa48("13407") ? false : stryMutAct_9fa48("13406") ? true : (stryCov_9fa48("13406", "13407"), saveTimeoutRef.current)) {
              if (stryMutAct_9fa48("13408")) {
                {}
              } else {
                stryCov_9fa48("13408");
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("13409") ? [] : (stryCov_9fa48("13409"), [answers, attempt, saveAnswers]));

    // Prevenir navegación accidental durante el examen
    useEffect(() => {
      if (stryMutAct_9fa48("13410")) {
        {}
      } else {
        stryCov_9fa48("13410");
        if (stryMutAct_9fa48("13413") ? !attempt && attempt.estado !== 'en_progreso' : stryMutAct_9fa48("13412") ? false : stryMutAct_9fa48("13411") ? true : (stryCov_9fa48("13411", "13412", "13413"), (stryMutAct_9fa48("13414") ? attempt : (stryCov_9fa48("13414"), !attempt)) || (stryMutAct_9fa48("13416") ? attempt.estado === 'en_progreso' : stryMutAct_9fa48("13415") ? false : (stryCov_9fa48("13415", "13416"), attempt.estado !== (stryMutAct_9fa48("13417") ? "" : (stryCov_9fa48("13417"), 'en_progreso')))))) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          if (stryMutAct_9fa48("13418")) {
            {}
          } else {
            stryCov_9fa48("13418");
            // Guardar respuestas antes de salir
            if (stryMutAct_9fa48("13422") ? answers.size <= 0 : stryMutAct_9fa48("13421") ? answers.size >= 0 : stryMutAct_9fa48("13420") ? false : stryMutAct_9fa48("13419") ? true : (stryCov_9fa48("13419", "13420", "13421", "13422"), answers.size > 0)) {
              if (stryMutAct_9fa48("13423")) {
                {}
              } else {
                stryCov_9fa48("13423");
                saveAnswers().catch(err => {
                  if (stryMutAct_9fa48("13424")) {
                    {}
                  } else {
                    stryCov_9fa48("13424");
                    captureError(err instanceof Error ? err : new Error(String(err)), stryMutAct_9fa48("13425") ? {} : (stryCov_9fa48("13425"), {
                      type: stryMutAct_9fa48("13426") ? "" : (stryCov_9fa48("13426"), 'exam_save_error'),
                      action: stryMutAct_9fa48("13427") ? "" : (stryCov_9fa48("13427"), 'before_unload'),
                      path: (stryMutAct_9fa48("13430") ? typeof window === 'undefined' : stryMutAct_9fa48("13429") ? false : stryMutAct_9fa48("13428") ? true : (stryCov_9fa48("13428", "13429", "13430"), typeof window !== (stryMutAct_9fa48("13431") ? "" : (stryCov_9fa48("13431"), 'undefined')))) ? window.location.pathname : undefined
                    }));
                  }
                });
              }
            }

            // Mostrar advertencia del navegador
            e.preventDefault();
            e.returnValue = stryMutAct_9fa48("13432") ? "" : (stryCov_9fa48("13432"), '¿Estás seguro de que quieres salir? Tu progreso se guardará automáticamente, pero perderás el tiempo restante del examen.');
            return e.returnValue;
          }
        };
        window.addEventListener(stryMutAct_9fa48("13433") ? "" : (stryCov_9fa48("13433"), 'beforeunload'), handleBeforeUnload);
        return () => {
          if (stryMutAct_9fa48("13434")) {
            {}
          } else {
            stryCov_9fa48("13434");
            window.removeEventListener(stryMutAct_9fa48("13435") ? "" : (stryCov_9fa48("13435"), 'beforeunload'), handleBeforeUnload);
          }
        };
      }
    }, stryMutAct_9fa48("13436") ? [] : (stryCov_9fa48("13436"), [attempt, answers, saveAnswers]));
    const handleAnswerSelect = useCallback((questionId: string, optionId: string) => {
      if (stryMutAct_9fa48("13437")) {
        {}
      } else {
        stryCov_9fa48("13437");
        setAnswers(prev => {
          if (stryMutAct_9fa48("13438")) {
            {}
          } else {
            stryCov_9fa48("13438");
            const newAnswers = new Map(prev);
            newAnswers.set(questionId, stryMutAct_9fa48("13439") ? {} : (stryCov_9fa48("13439"), {
              questionId,
              optionSelectedId: optionId,
              omitida: stryMutAct_9fa48("13440") ? true : (stryCov_9fa48("13440"), false)
            }));
            return newAnswers;
          }
        });
      }
    }, stryMutAct_9fa48("13441") ? ["Stryker was here"] : (stryCov_9fa48("13441"), []));
    const handleSelectOptionByIndex = useCallback((index: number) => {
      if (stryMutAct_9fa48("13442")) {
        {}
      } else {
        stryCov_9fa48("13442");
        if (stryMutAct_9fa48("13445") ? false : stryMutAct_9fa48("13444") ? true : stryMutAct_9fa48("13443") ? exam : (stryCov_9fa48("13443", "13444", "13445"), !exam)) return;
        const currentQ = exam.questions[currentQuestion];
        if (stryMutAct_9fa48("13448") ? currentQ || currentQ.question.options[index] : stryMutAct_9fa48("13447") ? false : stryMutAct_9fa48("13446") ? true : (stryCov_9fa48("13446", "13447", "13448"), currentQ && currentQ.question.options[index])) {
          if (stryMutAct_9fa48("13449")) {
            {}
          } else {
            stryCov_9fa48("13449");
            handleAnswerSelect(currentQ.question.id, currentQ.question.options[index].id);
          }
        }
      }
    }, stryMutAct_9fa48("13450") ? [] : (stryCov_9fa48("13450"), [exam, currentQuestion, handleAnswerSelect]));
    const handlePrevious = useCallback(() => {
      if (stryMutAct_9fa48("13451")) {
        {}
      } else {
        stryCov_9fa48("13451");
        setCurrentQuestion(stryMutAct_9fa48("13452") ? () => undefined : (stryCov_9fa48("13452"), prev => stryMutAct_9fa48("13453") ? Math.min(0, prev - 1) : (stryCov_9fa48("13453"), Math.max(0, stryMutAct_9fa48("13454") ? prev + 1 : (stryCov_9fa48("13454"), prev - 1)))));
      }
    }, stryMutAct_9fa48("13455") ? ["Stryker was here"] : (stryCov_9fa48("13455"), []));
    const handleNext = useCallback(() => {
      if (stryMutAct_9fa48("13456")) {
        {}
      } else {
        stryCov_9fa48("13456");
        if (stryMutAct_9fa48("13459") ? false : stryMutAct_9fa48("13458") ? true : stryMutAct_9fa48("13457") ? exam : (stryCov_9fa48("13457", "13458", "13459"), !exam)) return;
        setCurrentQuestion(stryMutAct_9fa48("13460") ? () => undefined : (stryCov_9fa48("13460"), prev => stryMutAct_9fa48("13461") ? Math.max(exam.questions.length - 1, prev + 1) : (stryCov_9fa48("13461"), Math.min(stryMutAct_9fa48("13462") ? exam.questions.length + 1 : (stryCov_9fa48("13462"), exam.questions.length - 1), stryMutAct_9fa48("13463") ? prev - 1 : (stryCov_9fa48("13463"), prev + 1)))));
      }
    }, stryMutAct_9fa48("13464") ? [] : (stryCov_9fa48("13464"), [exam]));
    const handleBookmark = useCallback(() => {
      // El BookmarkButton manejará el toggle automáticamente
    }, stryMutAct_9fa48("13465") ? ["Stryker was here"] : (stryCov_9fa48("13465"), []));

    // Atajos de teclado para exámenes (solo cuando el examen está cargado)
    useKeyboardShortcuts((stryMutAct_9fa48("13468") ? exam && attempt || exam.questions.length > 0 : stryMutAct_9fa48("13467") ? false : stryMutAct_9fa48("13466") ? true : (stryCov_9fa48("13466", "13467", "13468"), (stryMutAct_9fa48("13470") ? exam || attempt : stryMutAct_9fa48("13469") ? true : (stryCov_9fa48("13469", "13470"), exam && attempt)) && (stryMutAct_9fa48("13473") ? exam.questions.length <= 0 : stryMutAct_9fa48("13472") ? exam.questions.length >= 0 : stryMutAct_9fa48("13471") ? true : (stryCov_9fa48("13471", "13472", "13473"), exam.questions.length > 0)))) ? examShortcuts(handlePrevious, handleNext, handleSelectOptionByIndex, handleBookmark, handleSubmit) : stryMutAct_9fa48("13474") ? ["Stryker was here"] : (stryCov_9fa48("13474"), []));
    const handleOmit = (questionId: string) => {
      if (stryMutAct_9fa48("13475")) {
        {}
      } else {
        stryCov_9fa48("13475");
        setAnswers(prev => {
          if (stryMutAct_9fa48("13476")) {
            {}
          } else {
            stryCov_9fa48("13476");
            const newAnswers = new Map(prev);
            newAnswers.set(questionId, stryMutAct_9fa48("13477") ? {} : (stryCov_9fa48("13477"), {
              questionId,
              omitida: stryMutAct_9fa48("13478") ? false : (stryCov_9fa48("13478"), true)
            }));
            return newAnswers;
          }
        });
      }
    };
    const handleCancel = () => {
      if (stryMutAct_9fa48("13479")) {
        {}
      } else {
        stryCov_9fa48("13479");
        setShowCancelDialog(stryMutAct_9fa48("13480") ? false : (stryCov_9fa48("13480"), true));
      }
    };
    const confirmCancel = async () => {
      if (stryMutAct_9fa48("13481")) {
        {}
      } else {
        stryCov_9fa48("13481");
        // Guardar progreso antes de salir
        if (stryMutAct_9fa48("13484") ? attempt || answers.size > 0 : stryMutAct_9fa48("13483") ? false : stryMutAct_9fa48("13482") ? true : (stryCov_9fa48("13482", "13483", "13484"), attempt && (stryMutAct_9fa48("13487") ? answers.size <= 0 : stryMutAct_9fa48("13486") ? answers.size >= 0 : stryMutAct_9fa48("13485") ? true : (stryCov_9fa48("13485", "13486", "13487"), answers.size > 0)))) {
          if (stryMutAct_9fa48("13488")) {
            {}
          } else {
            stryCov_9fa48("13488");
            try {
              if (stryMutAct_9fa48("13489")) {
                {}
              } else {
                stryCov_9fa48("13489");
                const res = await fetch(stryMutAct_9fa48("13490") ? `` : (stryCov_9fa48("13490"), `/api/attempts/${attempt.id}`), stryMutAct_9fa48("13491") ? {} : (stryCov_9fa48("13491"), {
                  method: stryMutAct_9fa48("13492") ? "" : (stryCov_9fa48("13492"), 'PUT'),
                  headers: stryMutAct_9fa48("13493") ? {} : (stryCov_9fa48("13493"), {
                    'Content-Type': stryMutAct_9fa48("13494") ? "" : (stryCov_9fa48("13494"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("13495") ? {} : (stryCov_9fa48("13495"), {
                    answers: Array.from(answers.values())
                  }))
                }));
                if (stryMutAct_9fa48("13498") ? false : stryMutAct_9fa48("13497") ? true : stryMutAct_9fa48("13496") ? res.ok : (stryCov_9fa48("13496", "13497", "13498"), !res.ok)) {
                  if (stryMutAct_9fa48("13499")) {
                    {}
                  } else {
                    stryCov_9fa48("13499");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("13500") ? "" : (stryCov_9fa48("13500"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                      details?: string;
                    }>(res, stryMutAct_9fa48("13501") ? {} : (stryCov_9fa48("13501"), {
                      path: (stryMutAct_9fa48("13504") ? typeof window === 'undefined' : stryMutAct_9fa48("13503") ? false : stryMutAct_9fa48("13502") ? true : (stryCov_9fa48("13502", "13503", "13504"), typeof window !== (stryMutAct_9fa48("13505") ? "" : (stryCov_9fa48("13505"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("13506") ? "" : (stryCov_9fa48("13506"), '/exams/[id]/take'),
                      operation: stryMutAct_9fa48("13507") ? "" : (stryCov_9fa48("13507"), 'cancelar examen')
                    }));
                    const errorMessage = stryMutAct_9fa48("13510") ? errorData.error && 'Error desconocido' : stryMutAct_9fa48("13509") ? false : stryMutAct_9fa48("13508") ? true : (stryCov_9fa48("13508", "13509", "13510"), errorData.error || (stryMutAct_9fa48("13511") ? "" : (stryCov_9fa48("13511"), 'Error desconocido')));
                    const errorDetails = errorData.details ? stryMutAct_9fa48("13512") ? `` : (stryCov_9fa48("13512"), `: ${errorData.details}`) : stryMutAct_9fa48("13513") ? "Stryker was here!" : (stryCov_9fa48("13513"), '');

                    // Mostrar error mejorado
                    setError(stryMutAct_9fa48("13514") ? `` : (stryCov_9fa48("13514"), `No se pudo guardar el progreso${errorDetails}`));

                    // Aún así redirigir, pero el usuario sabe que hubo un problema
                    await new Promise<void>(stryMutAct_9fa48("13515") ? () => undefined : (stryCov_9fa48("13515"), resolve => setTimeout(stryMutAct_9fa48("13516") ? () => undefined : (stryCov_9fa48("13516"), () => resolve()), TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS)));
                  }
                }
              }
            } catch (err) {
              if (stryMutAct_9fa48("13517")) {
                {}
              } else {
                stryCov_9fa48("13517");
                const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("13518") ? "" : (stryCov_9fa48("13518"), 'Error desconocido');
                setError(stryMutAct_9fa48("13519") ? `` : (stryCov_9fa48("13519"), `Error al guardar el progreso: ${errorMessage}`));
                // Esperar un momento para que el usuario vea el error
                await new Promise<void>(stryMutAct_9fa48("13520") ? () => undefined : (stryCov_9fa48("13520"), resolve => setTimeout(stryMutAct_9fa48("13521") ? () => undefined : (stryCov_9fa48("13521"), () => resolve()), TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS)));
              }
            }
          }
        }
        router.push(stryMutAct_9fa48("13522") ? "" : (stryCov_9fa48("13522"), '/dashboard'));
      }
    };
    const formatTime = (seconds: number) => {
      if (stryMutAct_9fa48("13523")) {
        {}
      } else {
        stryCov_9fa48("13523");
        const mins = Math.floor(stryMutAct_9fa48("13524") ? seconds * 60 : (stryCov_9fa48("13524"), seconds / 60));
        const secs = stryMutAct_9fa48("13525") ? seconds * 60 : (stryCov_9fa48("13525"), seconds % 60);
        return stryMutAct_9fa48("13526") ? `` : (stryCov_9fa48("13526"), `${mins}:${secs.toString().padStart(2, stryMutAct_9fa48("13527") ? "" : (stryCov_9fa48("13527"), '0'))}`);
      }
    };
    const getProgress = () => {
      if (stryMutAct_9fa48("13528")) {
        {}
      } else {
        stryCov_9fa48("13528");
        if (stryMutAct_9fa48("13531") ? false : stryMutAct_9fa48("13530") ? true : stryMutAct_9fa48("13529") ? exam : (stryCov_9fa48("13529", "13530", "13531"), !exam)) return 0;
        return stryMutAct_9fa48("13532") ? answers.size / exam.totalPreguntas / 100 : (stryCov_9fa48("13532"), (stryMutAct_9fa48("13533") ? answers.size * exam.totalPreguntas : (stryCov_9fa48("13533"), answers.size / exam.totalPreguntas)) * 100);
      }
    };
    if (stryMutAct_9fa48("13535") ? false : stryMutAct_9fa48("13534") ? true : (stryCov_9fa48("13534", "13535"), isLoading)) {
      if (stryMutAct_9fa48("13536")) {
        {}
      } else {
        stryCov_9fa48("13536");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando examen...</p>
        </div>
      </div>;
      }
    }

    // Procesar error para mostrar mensaje estructurado
    const processedError = error ? getErrorMessage(extractErrorInfo(error).code, stryMutAct_9fa48("13537") ? {} : (stryCov_9fa48("13537"), {
      message: error
    })) : null;
    if (stryMutAct_9fa48("13540") ? (error || !exam) && !attempt : stryMutAct_9fa48("13539") ? false : stryMutAct_9fa48("13538") ? true : (stryCov_9fa48("13538", "13539", "13540"), (stryMutAct_9fa48("13542") ? error && !exam : stryMutAct_9fa48("13541") ? false : (stryCov_9fa48("13541", "13542"), error || (stryMutAct_9fa48("13543") ? exam : (stryCov_9fa48("13543"), !exam)))) || (stryMutAct_9fa48("13544") ? attempt : (stryCov_9fa48("13544"), !attempt)))) {
      if (stryMutAct_9fa48("13545")) {
        {}
      } else {
        stryCov_9fa48("13545");
        return <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            {processedError ? <ErrorMessageComponent error={processedError} onAction={() => {
                if (stryMutAct_9fa48("13546")) {
                  {}
                } else {
                  stryCov_9fa48("13546");
                  setError(null);
                  if (stryMutAct_9fa48("13548") ? false : stryMutAct_9fa48("13547") ? true : (stryCov_9fa48("13547", "13548"), examId)) {
                    if (stryMutAct_9fa48("13549")) {
                      {}
                    } else {
                      stryCov_9fa48("13549");
                      window.location.reload();
                    }
                  }
                }
              }} /> : <p className="text-muted-foreground">{stryMutAct_9fa48("13552") ? error && 'No se pudo cargar el examen' : stryMutAct_9fa48("13551") ? false : stryMutAct_9fa48("13550") ? true : (stryCov_9fa48("13550", "13551", "13552"), error || (stryMutAct_9fa48("13553") ? "" : (stryCov_9fa48("13553"), 'No se pudo cargar el examen')))}</p>}
            <div className="mt-4">
              <Button onClick={stryMutAct_9fa48("13554") ? () => undefined : (stryCov_9fa48("13554"), () => router.push(stryMutAct_9fa48("13555") ? "" : (stryCov_9fa48("13555"), '/dashboard')))}>Volver al Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const currentQ = exam.questions[currentQuestion];
    const currentAnswer = answers.get(currentQ.question.id);
    return <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Botón de volver */}
      <div className="mb-4">
        <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Cancelar Examen
        </Button>
      </div>

      {/* Dialog de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar examen?</DialogTitle>
            <DialogDescription>
              Tu progreso se guardará automáticamente. Podrás continuar más tarde desde el
              dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={stryMutAct_9fa48("13556") ? () => undefined : (stryCov_9fa48("13556"), () => setShowCancelDialog(stryMutAct_9fa48("13557") ? true : (stryCov_9fa48("13557"), false)))}>
              Continuar Examen
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Sí, Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de preguntas sin responder */}
      <Dialog open={showUnansweredDialog} onOpenChange={setShowUnansweredDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Finalizar con preguntas sin responder?</DialogTitle>
            <DialogDescription>
              {(stryMutAct_9fa48("13560") ? unansweredCount !== 1 : stryMutAct_9fa48("13559") ? false : stryMutAct_9fa48("13558") ? true : (stryCov_9fa48("13558", "13559", "13560"), unansweredCount === 1)) ? stryMutAct_9fa48("13561") ? "" : (stryCov_9fa48("13561"), 'Tienes 1 pregunta sin responder. ¿Deseas finalizar el examen de todas formas?') : stryMutAct_9fa48("13562") ? `` : (stryCov_9fa48("13562"), `Tienes ${unansweredCount} preguntas sin responder. ¿Deseas finalizar el examen de todas formas?`)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={stryMutAct_9fa48("13563") ? () => undefined : (stryCov_9fa48("13563"), () => setShowUnansweredDialog(stryMutAct_9fa48("13564") ? true : (stryCov_9fa48("13564"), false)))}>
              Volver al Examen
            </Button>
            <Button onClick={() => {
              if (stryMutAct_9fa48("13565")) {
                {}
              } else {
                stryCov_9fa48("13565");
                setShowUnansweredDialog(stryMutAct_9fa48("13566") ? true : (stryCov_9fa48("13566"), false));
                confirmSubmit();
              }
            }}>
              Sí, Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header con timer y progreso */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{exam.titulo}</CardTitle>
                <HelpIcon content="Durante el examen, tu progreso se guarda automáticamente cada 2 segundos. Puedes navegar entre preguntas usando los botones o el mapa de preguntas. Presiona 'Omitir pregunta' si no estás seguro de la respuesta." side="right" />
              </div>
              <CardDescription className="mt-1">
                {exam.subject.nombre} • {exam.totalPreguntas} preguntas
              </CardDescription>
            </div>
            {stryMutAct_9fa48("13569") ? timeRemaining !== null || <Badge variant={timeRemaining < 300 ? 'destructive' : 'default'} className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </Badge> : stryMutAct_9fa48("13568") ? false : stryMutAct_9fa48("13567") ? true : (stryCov_9fa48("13567", "13568", "13569"), (stryMutAct_9fa48("13571") ? timeRemaining === null : stryMutAct_9fa48("13570") ? true : (stryCov_9fa48("13570", "13571"), timeRemaining !== null)) && <Badge variant={(stryMutAct_9fa48("13575") ? timeRemaining >= 300 : stryMutAct_9fa48("13574") ? timeRemaining <= 300 : stryMutAct_9fa48("13573") ? false : stryMutAct_9fa48("13572") ? true : (stryCov_9fa48("13572", "13573", "13574", "13575"), timeRemaining < 300)) ? stryMutAct_9fa48("13576") ? "" : (stryCov_9fa48("13576"), 'destructive') : stryMutAct_9fa48("13577") ? "" : (stryCov_9fa48("13577"), 'default')} className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </Badge>)}
          </div>
        </CardHeader>
        <CardContent>
          <ProgressWithTime value={getProgress()} current={stryMutAct_9fa48("13578") ? currentQuestion - 1 : (stryCov_9fa48("13578"), currentQuestion + 1)} total={exam.totalPreguntas} estimatedTimeRemaining={(stryMutAct_9fa48("13581") ? timeRemaining !== null || exam.tiempoLimiteMin : stryMutAct_9fa48("13580") ? false : stryMutAct_9fa48("13579") ? true : (stryCov_9fa48("13579", "13580", "13581"), (stryMutAct_9fa48("13583") ? timeRemaining === null : stryMutAct_9fa48("13582") ? true : (stryCov_9fa48("13582", "13583"), timeRemaining !== null)) && exam.tiempoLimiteMin)) ? stryMutAct_9fa48("13584") ? Math.min(0, timeRemaining) : (stryCov_9fa48("13584"), Math.max(0, timeRemaining)) : undefined} label="Progreso del examen" />
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>
              {answers.size} respondida{(stryMutAct_9fa48("13587") ? answers.size === 1 : stryMutAct_9fa48("13586") ? false : stryMutAct_9fa48("13585") ? true : (stryCov_9fa48("13585", "13586", "13587"), answers.size !== 1)) ? stryMutAct_9fa48("13588") ? "" : (stryCov_9fa48("13588"), 's') : stryMutAct_9fa48("13589") ? "Stryker was here!" : (stryCov_9fa48("13589"), '')} •{stryMutAct_9fa48("13590") ? "" : (stryCov_9fa48("13590"), ' ')}
              {stryMutAct_9fa48("13591") ? exam.totalPreguntas + answers.size : (stryCov_9fa48("13591"), exam.totalPreguntas - answers.size)} pendiente
              {(stryMutAct_9fa48("13594") ? exam.totalPreguntas - answers.size === 1 : stryMutAct_9fa48("13593") ? false : stryMutAct_9fa48("13592") ? true : (stryCov_9fa48("13592", "13593", "13594"), (stryMutAct_9fa48("13595") ? exam.totalPreguntas + answers.size : (stryCov_9fa48("13595"), exam.totalPreguntas - answers.size)) !== 1)) ? stryMutAct_9fa48("13596") ? "" : (stryCov_9fa48("13596"), 's') : stryMutAct_9fa48("13597") ? "Stryker was here!" : (stryCov_9fa48("13597"), '')}
            </span>
            <span className="flex items-center gap-2">
              {stryMutAct_9fa48("13600") ? autoSaveStatus === 'saving' || <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">{saveMessage || 'Guardando cambios en el servidor...'}</span>
                </> : stryMutAct_9fa48("13599") ? false : stryMutAct_9fa48("13598") ? true : (stryCov_9fa48("13598", "13599", "13600"), (stryMutAct_9fa48("13602") ? autoSaveStatus !== 'saving' : stryMutAct_9fa48("13601") ? true : (stryCov_9fa48("13601", "13602"), autoSaveStatus === (stryMutAct_9fa48("13603") ? "" : (stryCov_9fa48("13603"), 'saving')))) && <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">{stryMutAct_9fa48("13606") ? saveMessage && 'Guardando cambios en el servidor...' : stryMutAct_9fa48("13605") ? false : stryMutAct_9fa48("13604") ? true : (stryCov_9fa48("13604", "13605", "13606"), saveMessage || (stryMutAct_9fa48("13607") ? "" : (stryCov_9fa48("13607"), 'Guardando cambios en el servidor...')))}</span>
                </>)}
              {stryMutAct_9fa48("13610") ? autoSaveStatus === 'saved' || <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {saveMessage || 'Guardado'}
                  </span>
                </> : stryMutAct_9fa48("13609") ? false : stryMutAct_9fa48("13608") ? true : (stryCov_9fa48("13608", "13609", "13610"), (stryMutAct_9fa48("13612") ? autoSaveStatus !== 'saved' : stryMutAct_9fa48("13611") ? true : (stryCov_9fa48("13611", "13612"), autoSaveStatus === (stryMutAct_9fa48("13613") ? "" : (stryCov_9fa48("13613"), 'saved')))) && <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {stryMutAct_9fa48("13616") ? saveMessage && 'Guardado' : stryMutAct_9fa48("13615") ? false : stryMutAct_9fa48("13614") ? true : (stryCov_9fa48("13614", "13615", "13616"), saveMessage || (stryMutAct_9fa48("13617") ? "" : (stryCov_9fa48("13617"), 'Guardado')))}
                  </span>
                </>)}
              {stryMutAct_9fa48("13620") ? autoSaveStatus === 'error' || <>
                  <XCircle className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive">Error al guardar</span>
                </> : stryMutAct_9fa48("13619") ? false : stryMutAct_9fa48("13618") ? true : (stryCov_9fa48("13618", "13619", "13620"), (stryMutAct_9fa48("13622") ? autoSaveStatus !== 'error' : stryMutAct_9fa48("13621") ? true : (stryCov_9fa48("13621", "13622"), autoSaveStatus === (stryMutAct_9fa48("13623") ? "" : (stryCov_9fa48("13623"), 'error')))) && <>
                  <XCircle className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive">Error al guardar</span>
                </>)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pregunta actual */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pregunta {stryMutAct_9fa48("13624") ? currentQuestion - 1 : (stryCov_9fa48("13624"), currentQuestion + 1)}</CardTitle>
            <div className="flex items-center gap-2">
              <BookmarkButton questionId={currentQ.question.id} size="sm" />
              <HelpIcon content="Usa las flechas ← → para navegar, números 1-4 para seleccionar opciones, B para marcar favorito, Shift+Enter para finalizar. Presiona ? para ver todos los atajos." side="left" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed">{currentQ.question.enunciado}</p>

          <div className="space-y-2">
            {currentQ.question.options.map(option => {
              if (stryMutAct_9fa48("13625")) {
                {}
              } else {
                stryCov_9fa48("13625");
                const isSelected = stryMutAct_9fa48("13628") ? currentAnswer?.optionSelectedId !== option.id : stryMutAct_9fa48("13627") ? false : stryMutAct_9fa48("13626") ? true : (stryCov_9fa48("13626", "13627", "13628"), (stryMutAct_9fa48("13629") ? currentAnswer.optionSelectedId : (stryCov_9fa48("13629"), currentAnswer?.optionSelectedId)) === option.id);
                return <button key={option.id} onClick={stryMutAct_9fa48("13630") ? () => undefined : (stryCov_9fa48("13630"), () => handleAnswerSelect(currentQ.question.id, option.id))} className={stryMutAct_9fa48("13631") ? `` : (stryCov_9fa48("13631"), `w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected ? stryMutAct_9fa48("13632") ? "" : (stryCov_9fa48("13632"), 'border-primary bg-primary/10') : stryMutAct_9fa48("13633") ? "" : (stryCov_9fa48("13633"), 'border-border hover:border-primary/50')}`)}>
                  <div className="flex items-center gap-3">
                    <div className={stryMutAct_9fa48("13634") ? `` : (stryCov_9fa48("13634"), `w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? stryMutAct_9fa48("13635") ? "" : (stryCov_9fa48("13635"), 'border-primary bg-primary') : stryMutAct_9fa48("13636") ? "" : (stryCov_9fa48("13636"), 'border-muted-foreground')}`)}>
                      {stryMutAct_9fa48("13639") ? isSelected || <div className="w-3 h-3 rounded-full bg-primary-foreground" /> : stryMutAct_9fa48("13638") ? false : stryMutAct_9fa48("13637") ? true : (stryCov_9fa48("13637", "13638", "13639"), isSelected && <div className="w-3 h-3 rounded-full bg-primary-foreground" />)}
                    </div>
                    <span className="font-medium mr-2">
                      {option.letra}.
                      <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-muted rounded border">
                        {stryMutAct_9fa48("13640") ? currentQ.question.options.indexOf(option) - 1 : (stryCov_9fa48("13640"), currentQ.question.options.indexOf(option) + 1)}
                      </kbd>
                    </span>
                    <span>{option.texto}</span>
                  </div>
                </button>;
              }
            })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={stryMutAct_9fa48("13641") ? () => undefined : (stryCov_9fa48("13641"), () => handleOmit(currentQ.question.id))} className="flex-1">
              Omitir pregunta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={stryMutAct_9fa48("13642") ? () => undefined : (stryCov_9fa48("13642"), () => setCurrentQuestion(stryMutAct_9fa48("13643") ? Math.min(0, currentQuestion - 1) : (stryCov_9fa48("13643"), Math.max(0, stryMutAct_9fa48("13644") ? currentQuestion + 1 : (stryCov_9fa48("13644"), currentQuestion - 1)))))} disabled={stryMutAct_9fa48("13647") ? currentQuestion !== 0 : stryMutAct_9fa48("13646") ? false : stryMutAct_9fa48("13645") ? true : (stryCov_9fa48("13645", "13646", "13647"), currentQuestion === 0)}>
          Anterior
        </Button>

        <div className="flex gap-2">
          {exam.questions.map((_, idx) => {
            if (stryMutAct_9fa48("13648")) {
              {}
            } else {
              stryCov_9fa48("13648");
              const hasAnswer = answers.has(exam.questions[idx].question.id);
              return <button key={idx} onClick={stryMutAct_9fa48("13649") ? () => undefined : (stryCov_9fa48("13649"), () => setCurrentQuestion(idx))} className={stryMutAct_9fa48("13650") ? `` : (stryCov_9fa48("13650"), `w-8 h-8 rounded text-sm ${(stryMutAct_9fa48("13653") ? idx !== currentQuestion : stryMutAct_9fa48("13652") ? false : stryMutAct_9fa48("13651") ? true : (stryCov_9fa48("13651", "13652", "13653"), idx === currentQuestion)) ? stryMutAct_9fa48("13654") ? "" : (stryCov_9fa48("13654"), 'bg-primary text-primary-foreground') : hasAnswer ? stryMutAct_9fa48("13655") ? "" : (stryCov_9fa48("13655"), 'bg-green-500 text-white') : stryMutAct_9fa48("13656") ? "" : (stryCov_9fa48("13656"), 'bg-muted hover:bg-muted/80')}`)}>
                {stryMutAct_9fa48("13657") ? idx - 1 : (stryCov_9fa48("13657"), idx + 1)}
              </button>;
            }
          })}
        </div>

        <Button variant="outline" onClick={stryMutAct_9fa48("13658") ? () => undefined : (stryCov_9fa48("13658"), () => setCurrentQuestion(stryMutAct_9fa48("13659") ? Math.max(exam.questions.length - 1, currentQuestion + 1) : (stryCov_9fa48("13659"), Math.min(stryMutAct_9fa48("13660") ? exam.questions.length + 1 : (stryCov_9fa48("13660"), exam.questions.length - 1), stryMutAct_9fa48("13661") ? currentQuestion - 1 : (stryCov_9fa48("13661"), currentQuestion + 1)))))} disabled={stryMutAct_9fa48("13664") ? currentQuestion !== exam.questions.length - 1 : stryMutAct_9fa48("13663") ? false : stryMutAct_9fa48("13662") ? true : (stryCov_9fa48("13662", "13663", "13664"), currentQuestion === (stryMutAct_9fa48("13665") ? exam.questions.length + 1 : (stryCov_9fa48("13665"), exam.questions.length - 1)))}>
          Siguiente
        </Button>
      </div>

      {/* Botón finalizar */}
      <div className="mt-6 flex justify-center">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="min-w-[200px]">
          {isSubmitting ? <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Finalizando...
            </> : stryMutAct_9fa48("13666") ? "" : (stryCov_9fa48("13666"), 'Finalizar Examen')}
        </Button>
      </div>
    </div>;
  }
}