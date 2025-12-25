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
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Circle, Clock, Award, TrendingUp, BookOpen, Loader2, AlertCircle, BarChart3, Printer, Trophy } from 'lucide-react';
import { CreateChallengeButton } from '@/components/challenges/create-challenge-button';
import { ExportButton } from '@/components/export/export-button';
import { exportExamResultsToPDF, exportExamResultsToExcel, exportExamResultsToWord, type ExamResultData } from '@/lib/export-utils';
import { toast } from 'sonner';
import { useProgressTracker } from '@/hooks/useProgressTracker';
import { ProgressDialog } from '@/components/ui/progress-dialog';
interface Attempt {
  id: string;
  estado: string;
  porcentaje: number;
  correctas: number;
  incorrectas: number;
  omitidas: number;
  totalPreguntas: number;
  puntajePaes: number | null;
  puntajeEstimado: boolean;
  duracionSegundos: number | null;
  startedAt: string;
  finishedAt: string | null;
  exam: {
    id: string;
    titulo: string;
    subject: {
      nombre: string;
      codigo: string;
    };
  };
  answers: Array<{
    id: string;
    questionId: string;
    optionSelectedId: string | null;
    esCorrecta: boolean | null;
    omitida: boolean;
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
    optionSelected: {
      id: string;
      letra: string;
      texto: string;
    } | null;
  }>;
}
export default function ExamResultsPage() {
  if (stryMutAct_9fa48("12863")) {
    {}
  } else {
    stryCov_9fa48("12863");
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const examId = params.id as string;
    const attemptId = searchParams.get(stryMutAct_9fa48("12864") ? "" : (stryCov_9fa48("12864"), 'attemptId'));
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("12865") ? false : (stryCov_9fa48("12865"), true));
    const [error, setError] = useState<string | null>(null);
    const exportProgress = useProgressTracker();
    useEffect(() => {
      if (stryMutAct_9fa48("12866")) {
        {}
      } else {
        stryCov_9fa48("12866");
        async function loadResults() {
          if (stryMutAct_9fa48("12867")) {
            {}
          } else {
            stryCov_9fa48("12867");
            if (stryMutAct_9fa48("12870") ? false : stryMutAct_9fa48("12869") ? true : stryMutAct_9fa48("12868") ? attemptId : (stryCov_9fa48("12868", "12869", "12870"), !attemptId)) {
              if (stryMutAct_9fa48("12871")) {
                {}
              } else {
                stryCov_9fa48("12871");
                setError(stryMutAct_9fa48("12872") ? "" : (stryCov_9fa48("12872"), 'ID de intento no proporcionado'));
                setIsLoading(stryMutAct_9fa48("12873") ? true : (stryCov_9fa48("12873"), false));
                return;
              }
            }
            try {
              if (stryMutAct_9fa48("12874")) {
                {}
              } else {
                stryCov_9fa48("12874");
                setIsLoading(stryMutAct_9fa48("12875") ? false : (stryCov_9fa48("12875"), true));

                // Obtener intento con respuestas
                const res = await fetch(stryMutAct_9fa48("12876") ? `` : (stryCov_9fa48("12876"), `/api/attempts/${attemptId}`));
                if (stryMutAct_9fa48("12879") ? false : stryMutAct_9fa48("12878") ? true : stryMutAct_9fa48("12877") ? res.ok : (stryCov_9fa48("12877", "12878", "12879"), !res.ok)) {
                  if (stryMutAct_9fa48("12880")) {
                    {}
                  } else {
                    stryCov_9fa48("12880");
                    let errorMessage = stryMutAct_9fa48("12881") ? "" : (stryCov_9fa48("12881"), 'Error al cargar resultados');
                    if (stryMutAct_9fa48("12884") ? res.status !== 404 : stryMutAct_9fa48("12883") ? false : stryMutAct_9fa48("12882") ? true : (stryCov_9fa48("12882", "12883", "12884"), res.status === 404)) {
                      if (stryMutAct_9fa48("12885")) {
                        {}
                      } else {
                        stryCov_9fa48("12885");
                        errorMessage = stryMutAct_9fa48("12886") ? "" : (stryCov_9fa48("12886"), 'Resultados no encontrados. El intento puede haber sido eliminado o el ID es incorrecto.');
                      }
                    } else if (stryMutAct_9fa48("12889") ? res.status !== 401 : stryMutAct_9fa48("12888") ? false : stryMutAct_9fa48("12887") ? true : (stryCov_9fa48("12887", "12888", "12889"), res.status === 401)) {
                      if (stryMutAct_9fa48("12890")) {
                        {}
                      } else {
                        stryCov_9fa48("12890");
                        errorMessage = stryMutAct_9fa48("12891") ? "" : (stryCov_9fa48("12891"), 'No tienes permiso para ver estos resultados. Por favor, inicia sesión.');
                      }
                    } else if (stryMutAct_9fa48("12895") ? res.status < 500 : stryMutAct_9fa48("12894") ? res.status > 500 : stryMutAct_9fa48("12893") ? false : stryMutAct_9fa48("12892") ? true : (stryCov_9fa48("12892", "12893", "12894", "12895"), res.status >= 500)) {
                      if (stryMutAct_9fa48("12896")) {
                        {}
                      } else {
                        stryCov_9fa48("12896");
                        errorMessage = stryMutAct_9fa48("12897") ? "" : (stryCov_9fa48("12897"), 'Error del servidor. Por favor, intenta nuevamente más tarde.');
                      }
                    }
                    throw new Error(errorMessage);
                  }
                }
                const data = await res.json();
                setAttempt(data);
              }
            } catch (err) {
              if (stryMutAct_9fa48("12898")) {
                {}
              } else {
                stryCov_9fa48("12898");
                const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("12899") ? "" : (stryCov_9fa48("12899"), 'Error desconocido');
                setError(errorMessage);
                toast.error(stryMutAct_9fa48("12900") ? "" : (stryCov_9fa48("12900"), 'Error al cargar resultados'), stryMutAct_9fa48("12901") ? {} : (stryCov_9fa48("12901"), {
                  description: errorMessage,
                  duration: 5000,
                  action: stryMutAct_9fa48("12902") ? {} : (stryCov_9fa48("12902"), {
                    label: stryMutAct_9fa48("12903") ? "" : (stryCov_9fa48("12903"), 'Reintentar'),
                    onClick: stryMutAct_9fa48("12904") ? () => undefined : (stryCov_9fa48("12904"), () => window.location.reload())
                  })
                }));
              }
            } finally {
              if (stryMutAct_9fa48("12905")) {
                {}
              } else {
                stryCov_9fa48("12905");
                setIsLoading(stryMutAct_9fa48("12906") ? true : (stryCov_9fa48("12906"), false));
              }
            }
          }
        }
        loadResults();
      }
    }, stryMutAct_9fa48("12907") ? [] : (stryCov_9fa48("12907"), [attemptId]));
    const formatDuration = (seconds: number | null) => {
      if (stryMutAct_9fa48("12908")) {
        {}
      } else {
        stryCov_9fa48("12908");
        if (stryMutAct_9fa48("12911") ? false : stryMutAct_9fa48("12910") ? true : stryMutAct_9fa48("12909") ? seconds : (stryCov_9fa48("12909", "12910", "12911"), !seconds)) return stryMutAct_9fa48("12912") ? "" : (stryCov_9fa48("12912"), 'N/A');
        const mins = Math.floor(stryMutAct_9fa48("12913") ? seconds * 60 : (stryCov_9fa48("12913"), seconds / 60));
        const secs = stryMutAct_9fa48("12914") ? seconds * 60 : (stryCov_9fa48("12914"), seconds % 60);
        return stryMutAct_9fa48("12915") ? `` : (stryCov_9fa48("12915"), `${mins}m ${secs}s`);
      }
    };
    const getScoreColor = (porcentaje: number) => {
      if (stryMutAct_9fa48("12916")) {
        {}
      } else {
        stryCov_9fa48("12916");
        if (stryMutAct_9fa48("12920") ? porcentaje < 70 : stryMutAct_9fa48("12919") ? porcentaje > 70 : stryMutAct_9fa48("12918") ? false : stryMutAct_9fa48("12917") ? true : (stryCov_9fa48("12917", "12918", "12919", "12920"), porcentaje >= 70)) return stryMutAct_9fa48("12921") ? "" : (stryCov_9fa48("12921"), 'text-green-600');
        if (stryMutAct_9fa48("12925") ? porcentaje < 50 : stryMutAct_9fa48("12924") ? porcentaje > 50 : stryMutAct_9fa48("12923") ? false : stryMutAct_9fa48("12922") ? true : (stryCov_9fa48("12922", "12923", "12924", "12925"), porcentaje >= 50)) return stryMutAct_9fa48("12926") ? "" : (stryCov_9fa48("12926"), 'text-yellow-600');
        return stryMutAct_9fa48("12927") ? "" : (stryCov_9fa48("12927"), 'text-red-600');
      }
    };
    const getScoreBadgeVariant = (porcentaje: number): 'default' | 'secondary' | 'destructive' => {
      if (stryMutAct_9fa48("12928")) {
        {}
      } else {
        stryCov_9fa48("12928");
        if (stryMutAct_9fa48("12932") ? porcentaje < 70 : stryMutAct_9fa48("12931") ? porcentaje > 70 : stryMutAct_9fa48("12930") ? false : stryMutAct_9fa48("12929") ? true : (stryCov_9fa48("12929", "12930", "12931", "12932"), porcentaje >= 70)) return stryMutAct_9fa48("12933") ? "" : (stryCov_9fa48("12933"), 'default');
        if (stryMutAct_9fa48("12937") ? porcentaje < 50 : stryMutAct_9fa48("12936") ? porcentaje > 50 : stryMutAct_9fa48("12935") ? false : stryMutAct_9fa48("12934") ? true : (stryCov_9fa48("12934", "12935", "12936", "12937"), porcentaje >= 50)) return stryMutAct_9fa48("12938") ? "" : (stryCov_9fa48("12938"), 'secondary');
        return stryMutAct_9fa48("12939") ? "" : (stryCov_9fa48("12939"), 'destructive');
      }
    };
    const handlePrint = () => {
      if (stryMutAct_9fa48("12940")) {
        {}
      } else {
        stryCov_9fa48("12940");
        window.print();
      }
    };
    const prepareExportData = (): ExamResultData | null => {
      if (stryMutAct_9fa48("12941")) {
        {}
      } else {
        stryCov_9fa48("12941");
        if (stryMutAct_9fa48("12944") ? false : stryMutAct_9fa48("12943") ? true : stryMutAct_9fa48("12942") ? attempt : (stryCov_9fa48("12942", "12943", "12944"), !attempt)) return null;
        return stryMutAct_9fa48("12945") ? {} : (stryCov_9fa48("12945"), {
          examTitle: attempt.exam.titulo,
          subjectName: attempt.exam.subject.nombre,
          percentage: attempt.porcentaje,
          correctas: attempt.correctas,
          incorrectas: attempt.incorrectas,
          omitidas: attempt.omitidas,
          totalPreguntas: attempt.totalPreguntas,
          puntajePaes: attempt.puntajePaes,
          duracionSegundos: attempt.duracionSegundos,
          startedAt: attempt.startedAt,
          finishedAt: attempt.finishedAt,
          answers: attempt.answers.map(stryMutAct_9fa48("12946") ? () => undefined : (stryCov_9fa48("12946"), (answer, idx) => stryMutAct_9fa48("12947") ? {} : (stryCov_9fa48("12947"), {
            questionNumber: stryMutAct_9fa48("12948") ? idx - 1 : (stryCov_9fa48("12948"), idx + 1),
            enunciado: answer.question.enunciado,
            selectedOption: stryMutAct_9fa48("12949") ? answer.optionSelected.letra : (stryCov_9fa48("12949"), answer.optionSelected?.letra),
            correctOption: stryMutAct_9fa48("12952") ? answer.question.options.find(o => o.esCorrecta)?.letra && '' : stryMutAct_9fa48("12951") ? false : stryMutAct_9fa48("12950") ? true : (stryCov_9fa48("12950", "12951", "12952"), (stryMutAct_9fa48("12953") ? answer.question.options.find(o => o.esCorrecta).letra : (stryCov_9fa48("12953"), answer.question.options.find(stryMutAct_9fa48("12954") ? () => undefined : (stryCov_9fa48("12954"), o => o.esCorrecta))?.letra)) || (stryMutAct_9fa48("12955") ? "Stryker was here!" : (stryCov_9fa48("12955"), ''))),
            isCorrect: stryMutAct_9fa48("12958") ? answer.esCorrecta !== true : stryMutAct_9fa48("12957") ? false : stryMutAct_9fa48("12956") ? true : (stryCov_9fa48("12956", "12957", "12958"), answer.esCorrecta === (stryMutAct_9fa48("12959") ? false : (stryCov_9fa48("12959"), true))),
            isOmitted: answer.omitida,
            explicacion: stryMutAct_9fa48("12962") ? answer.question.explicacion && undefined : stryMutAct_9fa48("12961") ? false : stryMutAct_9fa48("12960") ? true : (stryCov_9fa48("12960", "12961", "12962"), answer.question.explicacion || undefined),
            options: answer.question.options.map(stryMutAct_9fa48("12963") ? () => undefined : (stryCov_9fa48("12963"), opt => stryMutAct_9fa48("12964") ? {} : (stryCov_9fa48("12964"), {
              letra: opt.letra,
              texto: opt.texto,
              esCorrecta: opt.esCorrecta
            })))
          })))
        });
      }
    };
    const handleExportPDF = async () => {
      if (stryMutAct_9fa48("12965")) {
        {}
      } else {
        stryCov_9fa48("12965");
        const data = prepareExportData();
        if (stryMutAct_9fa48("12968") ? false : stryMutAct_9fa48("12967") ? true : stryMutAct_9fa48("12966") ? data : (stryCov_9fa48("12966", "12967", "12968"), !data)) {
          if (stryMutAct_9fa48("12969")) {
            {}
          } else {
            stryCov_9fa48("12969");
            toast.error(stryMutAct_9fa48("12970") ? "" : (stryCov_9fa48("12970"), 'No hay datos disponibles'), stryMutAct_9fa48("12971") ? {} : (stryCov_9fa48("12971"), {
              description: stryMutAct_9fa48("12972") ? "" : (stryCov_9fa48("12972"), 'No se encontraron datos del examen para exportar.')
            }));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("12973")) {
            {}
          } else {
            stryCov_9fa48("12973");
            exportProgress.start(stryMutAct_9fa48("12974") ? 3 - data.answers.length : (stryCov_9fa48("12974"), 3 + data.answers.length), stryMutAct_9fa48("12975") ? "" : (stryCov_9fa48("12975"), 'Iniciando exportación a PDF...'));
            await exportExamResultsToPDF(data, (progress, current, total, message) => {
              if (stryMutAct_9fa48("12976")) {
                {}
              } else {
                stryCov_9fa48("12976");
                exportProgress.updateProgress(current, total, message);
              }
            });
            exportProgress.complete();
            toast.success(stryMutAct_9fa48("12977") ? "" : (stryCov_9fa48("12977"), 'Exportación exitosa'), stryMutAct_9fa48("12978") ? {} : (stryCov_9fa48("12978"), {
              description: stryMutAct_9fa48("12979") ? "" : (stryCov_9fa48("12979"), 'El archivo PDF se ha descargado correctamente.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("12980")) {
            {}
          } else {
            stryCov_9fa48("12980");
            exportProgress.fail(error instanceof Error ? error : new Error(stryMutAct_9fa48("12981") ? "" : (stryCov_9fa48("12981"), 'Error desconocido')));
            toast.error(stryMutAct_9fa48("12982") ? "" : (stryCov_9fa48("12982"), 'Error al exportar'), stryMutAct_9fa48("12983") ? {} : (stryCov_9fa48("12983"), {
              description: error instanceof Error ? error.message : stryMutAct_9fa48("12984") ? "" : (stryCov_9fa48("12984"), 'No se pudo exportar el archivo PDF. Por favor, intenta nuevamente.')
            }));
          }
        }
      }
    };
    const handleExportExcel = async () => {
      if (stryMutAct_9fa48("12985")) {
        {}
      } else {
        stryCov_9fa48("12985");
        const data = prepareExportData();
        if (stryMutAct_9fa48("12988") ? false : stryMutAct_9fa48("12987") ? true : stryMutAct_9fa48("12986") ? data : (stryCov_9fa48("12986", "12987", "12988"), !data)) {
          if (stryMutAct_9fa48("12989")) {
            {}
          } else {
            stryCov_9fa48("12989");
            toast.error(stryMutAct_9fa48("12990") ? "" : (stryCov_9fa48("12990"), 'No hay datos disponibles'), stryMutAct_9fa48("12991") ? {} : (stryCov_9fa48("12991"), {
              description: stryMutAct_9fa48("12992") ? "" : (stryCov_9fa48("12992"), 'No se encontraron datos del examen para exportar.')
            }));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("12993")) {
            {}
          } else {
            stryCov_9fa48("12993");
            exportProgress.start(4, stryMutAct_9fa48("12994") ? "" : (stryCov_9fa48("12994"), 'Iniciando exportación a Excel...'));
            await exportExamResultsToExcel(data, (progress, current, total, message) => {
              if (stryMutAct_9fa48("12995")) {
                {}
              } else {
                stryCov_9fa48("12995");
                exportProgress.updateProgress(current, total, message);
              }
            });
            exportProgress.complete();
            toast.success(stryMutAct_9fa48("12996") ? "" : (stryCov_9fa48("12996"), 'Exportación exitosa'), stryMutAct_9fa48("12997") ? {} : (stryCov_9fa48("12997"), {
              description: stryMutAct_9fa48("12998") ? "" : (stryCov_9fa48("12998"), 'El archivo Excel se ha descargado correctamente.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("12999")) {
            {}
          } else {
            stryCov_9fa48("12999");
            exportProgress.fail(error instanceof Error ? error : new Error(stryMutAct_9fa48("13000") ? "" : (stryCov_9fa48("13000"), 'Error desconocido')));
            toast.error(stryMutAct_9fa48("13001") ? "" : (stryCov_9fa48("13001"), 'Error al exportar'), stryMutAct_9fa48("13002") ? {} : (stryCov_9fa48("13002"), {
              description: error instanceof Error ? error.message : stryMutAct_9fa48("13003") ? "" : (stryCov_9fa48("13003"), 'No se pudo exportar el archivo Excel. Por favor, intenta nuevamente.')
            }));
          }
        }
      }
    };
    const handleExportWord = async () => {
      if (stryMutAct_9fa48("13004")) {
        {}
      } else {
        stryCov_9fa48("13004");
        const data = prepareExportData();
        if (stryMutAct_9fa48("13007") ? false : stryMutAct_9fa48("13006") ? true : stryMutAct_9fa48("13005") ? data : (stryCov_9fa48("13005", "13006", "13007"), !data)) {
          if (stryMutAct_9fa48("13008")) {
            {}
          } else {
            stryCov_9fa48("13008");
            toast.error(stryMutAct_9fa48("13009") ? "" : (stryCov_9fa48("13009"), 'No hay datos disponibles'), stryMutAct_9fa48("13010") ? {} : (stryCov_9fa48("13010"), {
              description: stryMutAct_9fa48("13011") ? "" : (stryCov_9fa48("13011"), 'No se encontraron datos del examen para exportar.')
            }));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("13012")) {
            {}
          } else {
            stryCov_9fa48("13012");
            exportProgress.start(stryMutAct_9fa48("13013") ? 3 - data.answers.length : (stryCov_9fa48("13013"), 3 + data.answers.length), stryMutAct_9fa48("13014") ? "" : (stryCov_9fa48("13014"), 'Iniciando exportación a Word...'));
            await exportExamResultsToWord(data, (progress, current, total, message) => {
              if (stryMutAct_9fa48("13015")) {
                {}
              } else {
                stryCov_9fa48("13015");
                exportProgress.updateProgress(current, total, message);
              }
            });
            exportProgress.complete();
            toast.success(stryMutAct_9fa48("13016") ? "" : (stryCov_9fa48("13016"), 'Exportación exitosa'), stryMutAct_9fa48("13017") ? {} : (stryCov_9fa48("13017"), {
              description: stryMutAct_9fa48("13018") ? "" : (stryCov_9fa48("13018"), 'El archivo Word se ha descargado correctamente.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("13019")) {
            {}
          } else {
            stryCov_9fa48("13019");
            exportProgress.fail(error instanceof Error ? error : new Error(stryMutAct_9fa48("13020") ? "" : (stryCov_9fa48("13020"), 'Error desconocido')));
            toast.error(stryMutAct_9fa48("13021") ? "" : (stryCov_9fa48("13021"), 'Error al exportar'), stryMutAct_9fa48("13022") ? {} : (stryCov_9fa48("13022"), {
              description: error instanceof Error ? error.message : stryMutAct_9fa48("13023") ? "" : (stryCov_9fa48("13023"), 'No se pudo exportar el archivo Word. Por favor, intenta nuevamente.')
            }));
          }
        }
      }
    };
    if (stryMutAct_9fa48("13025") ? false : stryMutAct_9fa48("13024") ? true : (stryCov_9fa48("13024", "13025"), isLoading)) {
      if (stryMutAct_9fa48("13026")) {
        {}
      } else {
        stryCov_9fa48("13026");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando resultados...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("13029") ? error && !attempt : stryMutAct_9fa48("13028") ? false : stryMutAct_9fa48("13027") ? true : (stryCov_9fa48("13027", "13028", "13029"), error || (stryMutAct_9fa48("13030") ? attempt : (stryCov_9fa48("13030"), !attempt)))) {
      if (stryMutAct_9fa48("13031")) {
        {}
      } else {
        stryCov_9fa48("13031");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("13034") ? error && 'No se pudieron cargar los resultados' : stryMutAct_9fa48("13033") ? false : stryMutAct_9fa48("13032") ? true : (stryCov_9fa48("13032", "13033", "13034"), error || (stryMutAct_9fa48("13035") ? "" : (stryCov_9fa48("13035"), 'No se pudieron cargar los resultados')))}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("13036") ? () => undefined : (stryCov_9fa48("13036"), () => router.push(stryMutAct_9fa48("13037") ? "" : (stryCov_9fa48("13037"), '/dashboard')))}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <>
      <ProgressDialog open={exportProgress.isActive} title="Exportando resultados" description="Por favor espera mientras se genera el archivo..." progress={exportProgress.progress} current={exportProgress.current} total={exportProgress.total} message={exportProgress.message} estimatedTimeRemaining={exportProgress.estimatedTimeRemaining} />
      <style jsx global>{stryMutAct_9fa48("13038") ? `` : (stryCov_9fa48("13038"), `
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `)}</style>
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header con resumen */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{attempt.exam.titulo}</CardTitle>
            <CardDescription>{attempt.exam.subject.nombre}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={stryMutAct_9fa48("13039") ? `` : (stryCov_9fa48("13039"), `text-4xl font-bold ${getScoreColor(attempt.porcentaje)}`)}>
                  {attempt.porcentaje.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Puntaje</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {attempt.correctas} / {attempt.totalPreguntas}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Correctas</p>
              </div>
              {stryMutAct_9fa48("13042") ? attempt.puntajePaes || <div className="text-center">
                  <div className="text-4xl font-bold flex items-center justify-center gap-2">
                    {attempt.puntajePaes}
                    {attempt.puntajeEstimado && <Badge variant="secondary" className="text-xs">
                        ~
                      </Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Puntaje PAES</p>
                </div> : stryMutAct_9fa48("13041") ? false : stryMutAct_9fa48("13040") ? true : (stryCov_9fa48("13040", "13041", "13042"), attempt.puntajePaes && <div className="text-center">
                  <div className="text-4xl font-bold flex items-center justify-center gap-2">
                    {attempt.puntajePaes}
                    {stryMutAct_9fa48("13045") ? attempt.puntajeEstimado || <Badge variant="secondary" className="text-xs">
                        ~
                      </Badge> : stryMutAct_9fa48("13044") ? false : stryMutAct_9fa48("13043") ? true : (stryCov_9fa48("13043", "13044", "13045"), attempt.puntajeEstimado && <Badge variant="secondary" className="text-xs">
                        ~
                      </Badge>)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Puntaje PAES</p>
                </div>)}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{attempt.correctas}</div>
                <p className="text-xs text-muted-foreground">Correctas</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{attempt.incorrectas}</div>
                <p className="text-xs text-muted-foreground">Incorrectas</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{attempt.omitidas}</div>
                <p className="text-xs text-muted-foreground">Omitidas</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  {formatDuration(attempt.duracionSegundos)}
                </div>
                <p className="text-xs text-muted-foreground">Duración</p>
              </div>
            </div>

            <div className="mt-6">
              <Progress value={attempt.porcentaje} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Preguntas y respuestas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Revisión de Respuestas</CardTitle>
            <CardDescription>Revisa tus respuestas y las explicaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {attempt.answers.map((answer, idx) => {
              if (stryMutAct_9fa48("13046")) {
                {}
              } else {
                stryCov_9fa48("13046");
                const correctOption = answer.question.options.find(stryMutAct_9fa48("13047") ? () => undefined : (stryCov_9fa48("13047"), opt => opt.esCorrecta));
                const isCorrect = stryMutAct_9fa48("13050") ? answer.esCorrecta !== true : stryMutAct_9fa48("13049") ? false : stryMutAct_9fa48("13048") ? true : (stryCov_9fa48("13048", "13049", "13050"), answer.esCorrecta === (stryMutAct_9fa48("13051") ? false : (stryCov_9fa48("13051"), true)));
                const isOmitted = answer.omitida;
                return <div key={answer.id} className={stryMutAct_9fa48("13052") ? `` : (stryCov_9fa48("13052"), `p-4 rounded-lg border-2 ${isCorrect ? stryMutAct_9fa48("13053") ? "" : (stryCov_9fa48("13053"), 'border-green-500 bg-green-50 dark:bg-green-950') : isOmitted ? stryMutAct_9fa48("13054") ? "" : (stryCov_9fa48("13054"), 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950') : stryMutAct_9fa48("13055") ? "" : (stryCov_9fa48("13055"), 'border-red-500 bg-red-50 dark:bg-red-950')}`)}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      {isCorrect ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : isOmitted ? <Circle className="h-6 w-6 text-yellow-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Pregunta {stryMutAct_9fa48("13056") ? idx - 1 : (stryCov_9fa48("13056"), idx + 1)}</Badge>
                        {stryMutAct_9fa48("13059") ? isCorrect || <Badge variant="default">Correcta</Badge> : stryMutAct_9fa48("13058") ? false : stryMutAct_9fa48("13057") ? true : (stryCov_9fa48("13057", "13058", "13059"), isCorrect && <Badge variant="default">Correcta</Badge>)}
                        {stryMutAct_9fa48("13062") ? isOmitted || <Badge variant="secondary">Omitida</Badge> : stryMutAct_9fa48("13061") ? false : stryMutAct_9fa48("13060") ? true : (stryCov_9fa48("13060", "13061", "13062"), isOmitted && <Badge variant="secondary">Omitida</Badge>)}
                        {stryMutAct_9fa48("13065") ? !isCorrect && !isOmitted || <Badge variant="destructive">Incorrecta</Badge> : stryMutAct_9fa48("13064") ? false : stryMutAct_9fa48("13063") ? true : (stryCov_9fa48("13063", "13064", "13065"), (stryMutAct_9fa48("13067") ? !isCorrect || !isOmitted : stryMutAct_9fa48("13066") ? true : (stryCov_9fa48("13066", "13067"), (stryMutAct_9fa48("13068") ? isCorrect : (stryCov_9fa48("13068"), !isCorrect)) && (stryMutAct_9fa48("13069") ? isOmitted : (stryCov_9fa48("13069"), !isOmitted)))) && <Badge variant="destructive">Incorrecta</Badge>)}
                      </div>
                      <p className="font-medium mb-3">{answer.question.enunciado}</p>
                    </div>
                  </div>

                  <div className="space-y-2 ml-9">
                    {answer.question.options.map(option => {
                      if (stryMutAct_9fa48("13070")) {
                        {}
                      } else {
                        stryCov_9fa48("13070");
                        const isSelected = stryMutAct_9fa48("13073") ? answer.optionSelectedId !== option.id : stryMutAct_9fa48("13072") ? false : stryMutAct_9fa48("13071") ? true : (stryCov_9fa48("13071", "13072", "13073"), answer.optionSelectedId === option.id);
                        const isCorrectOption = option.esCorrecta;
                        return <div key={option.id} className={stryMutAct_9fa48("13074") ? `` : (stryCov_9fa48("13074"), `p-3 rounded border ${isCorrectOption ? stryMutAct_9fa48("13075") ? "" : (stryCov_9fa48("13075"), 'border-green-500 bg-green-100 dark:bg-green-900') : isSelected ? stryMutAct_9fa48("13076") ? "" : (stryCov_9fa48("13076"), 'border-red-500 bg-red-100 dark:bg-red-900') : stryMutAct_9fa48("13077") ? "" : (stryCov_9fa48("13077"), 'border-border')}`)}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.letra}.</span>
                            <span>{option.texto}</span>
                            {stryMutAct_9fa48("13080") ? isCorrectOption || <Badge variant="default" className="ml-auto">
                                Correcta
                              </Badge> : stryMutAct_9fa48("13079") ? false : stryMutAct_9fa48("13078") ? true : (stryCov_9fa48("13078", "13079", "13080"), isCorrectOption && <Badge variant="default" className="ml-auto">
                                Correcta
                              </Badge>)}
                            {stryMutAct_9fa48("13083") ? isSelected && !isCorrectOption || <Badge variant="destructive" className="ml-auto">
                                Tu respuesta
                              </Badge> : stryMutAct_9fa48("13082") ? false : stryMutAct_9fa48("13081") ? true : (stryCov_9fa48("13081", "13082", "13083"), (stryMutAct_9fa48("13085") ? isSelected || !isCorrectOption : stryMutAct_9fa48("13084") ? true : (stryCov_9fa48("13084", "13085"), isSelected && (stryMutAct_9fa48("13086") ? isCorrectOption : (stryCov_9fa48("13086"), !isCorrectOption)))) && <Badge variant="destructive" className="ml-auto">
                                Tu respuesta
                              </Badge>)}
                          </div>
                        </div>;
                      }
                    })}
                  </div>

                  {stryMutAct_9fa48("13089") ? answer.question.explicacion || <div className="mt-4 p-3 bg-muted rounded-lg ml-9">
                      <p className="text-sm font-medium mb-1">Explicación:</p>
                      <p className="text-sm">{answer.question.explicacion}</p>
                    </div> : stryMutAct_9fa48("13088") ? false : stryMutAct_9fa48("13087") ? true : (stryCov_9fa48("13087", "13088", "13089"), answer.question.explicacion && <div className="mt-4 p-3 bg-muted rounded-lg ml-9">
                      <p className="text-sm font-medium mb-1">Explicación:</p>
                      <p className="text-sm">{answer.question.explicacion}</p>
                    </div>)}
                </div>;
              }
            })}
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-4 justify-center flex-wrap no-print">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Resultados
          </Button>
          <ExportButton onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} onExportWord={handleExportWord} variant="outline" />
          <Button variant="outline" onClick={stryMutAct_9fa48("13090") ? () => undefined : (stryCov_9fa48("13090"), () => router.push(stryMutAct_9fa48("13091") ? "" : (stryCov_9fa48("13091"), '/dashboard')))}>
            <BookOpen className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          {stryMutAct_9fa48("13094") ? attemptId || <Button variant="outline" onClick={() => router.push(`/attempts/${attemptId}`)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Análisis Detallado
            </Button> : stryMutAct_9fa48("13093") ? false : stryMutAct_9fa48("13092") ? true : (stryCov_9fa48("13092", "13093", "13094"), attemptId && <Button variant="outline" onClick={stryMutAct_9fa48("13095") ? () => undefined : (stryCov_9fa48("13095"), () => router.push(stryMutAct_9fa48("13096") ? `` : (stryCov_9fa48("13096"), `/attempts/${attemptId}`)))}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Análisis Detallado
            </Button>)}
          <CreateChallengeButton examId={examId} examTitle={attempt.exam.titulo} />
          <Button onClick={stryMutAct_9fa48("13097") ? () => undefined : (stryCov_9fa48("13097"), () => router.push(stryMutAct_9fa48("13098") ? `` : (stryCov_9fa48("13098"), `/exams/${examId}/take`)))}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Intentar Nuevamente
          </Button>
        </div>
      </div>
    </>;
  }
}