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
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuestionReview } from '@/components/question-review';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CheckCircle2, XCircle, Circle, Clock, TrendingUp, TrendingDown, BookOpen, Loader2, AlertCircle, BarChart3, Target, Lightbulb, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
interface Topic {
  id: string;
  nombre: string;
  ejeTematico: string;
}
interface Question {
  id: string;
  enunciado: string;
  explicacion: string;
  options: Array<{
    id: string;
    letra: string;
    texto: string;
    esCorrecta: boolean;
  }>;
  topic: Topic | null;
}
interface AttemptAnswer {
  id: string;
  questionId: string;
  optionSelectedId: string | null;
  esCorrecta: boolean | null;
  omitida: boolean;
  question: Question;
  optionSelected: {
    id: string;
    letra: string;
    texto: string;
  } | null;
}
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
  answers: AttemptAnswer[];
}
interface PreviousAttempt {
  id: string;
  porcentaje: number;
  correctas: number;
  totalPreguntas: number;
  startedAt: string;
  exam: {
    titulo: string;
  };
}
export default function AttemptDetailsPage() {
  if (stryMutAct_9fa48("11314")) {
    {}
  } else {
    stryCov_9fa48("11314");
    const params = useParams();
    const router = useRouter();
    const attemptId = params.id as string;
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [previousAttempts, setPreviousAttempts] = useState<PreviousAttempt[]>(stryMutAct_9fa48("11315") ? ["Stryker was here"] : (stryCov_9fa48("11315"), []));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("11316") ? false : (stryCov_9fa48("11316"), true));
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'topics'>(stryMutAct_9fa48("11317") ? "" : (stryCov_9fa48("11317"), 'overview'));
    useEffect(() => {
      if (stryMutAct_9fa48("11318")) {
        {}
      } else {
        stryCov_9fa48("11318");
        async function loadData() {
          if (stryMutAct_9fa48("11319")) {
            {}
          } else {
            stryCov_9fa48("11319");
            if (stryMutAct_9fa48("11322") ? !attemptId && !/^c[a-z0-9]{24}$/.test(attemptId) : stryMutAct_9fa48("11321") ? false : stryMutAct_9fa48("11320") ? true : (stryCov_9fa48("11320", "11321", "11322"), (stryMutAct_9fa48("11323") ? attemptId : (stryCov_9fa48("11323"), !attemptId)) || (stryMutAct_9fa48("11324") ? /^c[a-z0-9]{24}$/.test(attemptId) : (stryCov_9fa48("11324"), !(stryMutAct_9fa48("11328") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("11327") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("11326") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("11325") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("11325", "11326", "11327", "11328"), /^c[a-z0-9]{24}$/)).test(attemptId))))) {
              if (stryMutAct_9fa48("11329")) {
                {}
              } else {
                stryCov_9fa48("11329");
                setError(stryMutAct_9fa48("11330") ? "" : (stryCov_9fa48("11330"), 'ID de intento inválido'));
                setIsLoading(stryMutAct_9fa48("11331") ? true : (stryCov_9fa48("11331"), false));
                return;
              }
            }
            try {
              if (stryMutAct_9fa48("11332")) {
                {}
              } else {
                stryCov_9fa48("11332");
                setIsLoading(stryMutAct_9fa48("11333") ? false : (stryCov_9fa48("11333"), true));
                setError(null);

                // Cargar intento actual
                const attemptRes = await fetch(stryMutAct_9fa48("11334") ? `` : (stryCov_9fa48("11334"), `/api/attempts/${attemptId}`));
                if (stryMutAct_9fa48("11337") ? false : stryMutAct_9fa48("11336") ? true : stryMutAct_9fa48("11335") ? attemptRes.ok : (stryCov_9fa48("11335", "11336", "11337"), !attemptRes.ok)) {
                  if (stryMutAct_9fa48("11338")) {
                    {}
                  } else {
                    stryCov_9fa48("11338");
                    throw new Error(stryMutAct_9fa48("11339") ? "" : (stryCov_9fa48("11339"), 'Error al cargar el intento'));
                  }
                }
                const attemptData = await attemptRes.json();
                setAttempt(attemptData);

                // Cargar intentos anteriores del mismo examen
                const attemptsRes = await fetch(stryMutAct_9fa48("11340") ? `` : (stryCov_9fa48("11340"), `/api/attempts?limit=10`));
                if (stryMutAct_9fa48("11342") ? false : stryMutAct_9fa48("11341") ? true : (stryCov_9fa48("11341", "11342"), attemptsRes.ok)) {
                  if (stryMutAct_9fa48("11343")) {
                    {}
                  } else {
                    stryCov_9fa48("11343");
                    const attemptsData = await attemptsRes.json();
                    const previous = stryMutAct_9fa48("11345") ? attemptsData.slice(0, 5).map((a: Attempt) => ({
                      id: a.id,
                      porcentaje: a.porcentaje,
                      correctas: a.correctas,
                      totalPreguntas: a.totalPreguntas,
                      startedAt: a.startedAt,
                      exam: a.exam
                    })) : stryMutAct_9fa48("11344") ? attemptsData.filter((a: Attempt) => a.id !== attemptId && a.exam.id === attemptData.exam.id && a.estado === 'completado').map((a: Attempt) => ({
                      id: a.id,
                      porcentaje: a.porcentaje,
                      correctas: a.correctas,
                      totalPreguntas: a.totalPreguntas,
                      startedAt: a.startedAt,
                      exam: a.exam
                    })) : (stryCov_9fa48("11344", "11345"), attemptsData.filter(stryMutAct_9fa48("11346") ? () => undefined : (stryCov_9fa48("11346"), (a: Attempt) => stryMutAct_9fa48("11349") ? a.id !== attemptId && a.exam.id === attemptData.exam.id || a.estado === 'completado' : stryMutAct_9fa48("11348") ? false : stryMutAct_9fa48("11347") ? true : (stryCov_9fa48("11347", "11348", "11349"), (stryMutAct_9fa48("11351") ? a.id !== attemptId || a.exam.id === attemptData.exam.id : stryMutAct_9fa48("11350") ? true : (stryCov_9fa48("11350", "11351"), (stryMutAct_9fa48("11353") ? a.id === attemptId : stryMutAct_9fa48("11352") ? true : (stryCov_9fa48("11352", "11353"), a.id !== attemptId)) && (stryMutAct_9fa48("11355") ? a.exam.id !== attemptData.exam.id : stryMutAct_9fa48("11354") ? true : (stryCov_9fa48("11354", "11355"), a.exam.id === attemptData.exam.id)))) && (stryMutAct_9fa48("11357") ? a.estado !== 'completado' : stryMutAct_9fa48("11356") ? true : (stryCov_9fa48("11356", "11357"), a.estado === (stryMutAct_9fa48("11358") ? "" : (stryCov_9fa48("11358"), 'completado'))))))).slice(0, 5).map(stryMutAct_9fa48("11359") ? () => undefined : (stryCov_9fa48("11359"), (a: Attempt) => stryMutAct_9fa48("11360") ? {} : (stryCov_9fa48("11360"), {
                      id: a.id,
                      porcentaje: a.porcentaje,
                      correctas: a.correctas,
                      totalPreguntas: a.totalPreguntas,
                      startedAt: a.startedAt,
                      exam: a.exam
                    }))));
                    setPreviousAttempts(previous);
                  }
                }
              }
            } catch (err) {
              if (stryMutAct_9fa48("11361")) {
                {}
              } else {
                stryCov_9fa48("11361");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("11362") ? "" : (stryCov_9fa48("11362"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("11363")) {
                {}
              } else {
                stryCov_9fa48("11363");
                setIsLoading(stryMutAct_9fa48("11364") ? true : (stryCov_9fa48("11364"), false));
              }
            }
          }
        }
        loadData();
      }
    }, stryMutAct_9fa48("11365") ? [] : (stryCov_9fa48("11365"), [attemptId]));

    // Calcular estadísticas por tema
    const topicStats = () => {
      if (stryMutAct_9fa48("11366")) {
        {}
      } else {
        stryCov_9fa48("11366");
        if (stryMutAct_9fa48("11369") ? false : stryMutAct_9fa48("11368") ? true : stryMutAct_9fa48("11367") ? attempt : (stryCov_9fa48("11367", "11368", "11369"), !attempt)) return stryMutAct_9fa48("11370") ? ["Stryker was here"] : (stryCov_9fa48("11370"), []);
        const topicMap = new Map<string, {
          correct: number;
          total: number;
          nombre: string;
        }>();
        attempt.answers.forEach(answer => {
          if (stryMutAct_9fa48("11371")) {
            {}
          } else {
            stryCov_9fa48("11371");
            const topic = answer.question.topic;
            if (stryMutAct_9fa48("11374") ? false : stryMutAct_9fa48("11373") ? true : stryMutAct_9fa48("11372") ? topic : (stryCov_9fa48("11372", "11373", "11374"), !topic)) return;
            const key = topic.id;
            if (stryMutAct_9fa48("11377") ? false : stryMutAct_9fa48("11376") ? true : stryMutAct_9fa48("11375") ? topicMap.has(key) : (stryCov_9fa48("11375", "11376", "11377"), !topicMap.has(key))) {
              if (stryMutAct_9fa48("11378")) {
                {}
              } else {
                stryCov_9fa48("11378");
                topicMap.set(key, stryMutAct_9fa48("11379") ? {} : (stryCov_9fa48("11379"), {
                  correct: 0,
                  total: 0,
                  nombre: topic.nombre
                }));
              }
            }
            const stats = topicMap.get(key)!;
            stryMutAct_9fa48("11380") ? stats.total-- : (stryCov_9fa48("11380"), stats.total++);
            if (stryMutAct_9fa48("11383") ? answer.esCorrecta !== true : stryMutAct_9fa48("11382") ? false : stryMutAct_9fa48("11381") ? true : (stryCov_9fa48("11381", "11382", "11383"), answer.esCorrecta === (stryMutAct_9fa48("11384") ? false : (stryCov_9fa48("11384"), true)))) {
              if (stryMutAct_9fa48("11385")) {
                {}
              } else {
                stryCov_9fa48("11385");
                stryMutAct_9fa48("11386") ? stats.correct-- : (stryCov_9fa48("11386"), stats.correct++);
              }
            }
          }
        });
        return stryMutAct_9fa48("11387") ? Array.from(topicMap.entries()).map(([id, stats]) => ({
          id,
          nombre: stats.nombre,
          correctas: stats.correct,
          total: stats.total,
          porcentaje: stats.total > 0 ? stats.correct / stats.total * 100 : 0
        })) : (stryCov_9fa48("11387"), Array.from(topicMap.entries()).map(stryMutAct_9fa48("11388") ? () => undefined : (stryCov_9fa48("11388"), ([id, stats]) => stryMutAct_9fa48("11389") ? {} : (stryCov_9fa48("11389"), {
          id,
          nombre: stats.nombre,
          correctas: stats.correct,
          total: stats.total,
          porcentaje: (stryMutAct_9fa48("11393") ? stats.total <= 0 : stryMutAct_9fa48("11392") ? stats.total >= 0 : stryMutAct_9fa48("11391") ? false : stryMutAct_9fa48("11390") ? true : (stryCov_9fa48("11390", "11391", "11392", "11393"), stats.total > 0)) ? stryMutAct_9fa48("11394") ? stats.correct / stats.total / 100 : (stryCov_9fa48("11394"), (stryMutAct_9fa48("11395") ? stats.correct * stats.total : (stryCov_9fa48("11395"), stats.correct / stats.total)) * 100) : 0
        }))).sort(stryMutAct_9fa48("11396") ? () => undefined : (stryCov_9fa48("11396"), (a, b) => stryMutAct_9fa48("11397") ? b.porcentaje + a.porcentaje : (stryCov_9fa48("11397"), b.porcentaje - a.porcentaje))));
      }
    };

    // Generar recomendaciones
    const generateRecommendations = () => {
      if (stryMutAct_9fa48("11398")) {
        {}
      } else {
        stryCov_9fa48("11398");
        if (stryMutAct_9fa48("11401") ? false : stryMutAct_9fa48("11400") ? true : stryMutAct_9fa48("11399") ? attempt : (stryCov_9fa48("11399", "11400", "11401"), !attempt)) return stryMutAct_9fa48("11402") ? ["Stryker was here"] : (stryCov_9fa48("11402"), []);
        const recommendations: string[] = stryMutAct_9fa48("11403") ? ["Stryker was here"] : (stryCov_9fa48("11403"), []);
        const stats = topicStats();
        const weakTopics = stryMutAct_9fa48("11404") ? stats : (stryCov_9fa48("11404"), stats.filter(stryMutAct_9fa48("11405") ? () => undefined : (stryCov_9fa48("11405"), t => stryMutAct_9fa48("11409") ? t.porcentaje >= 50 : stryMutAct_9fa48("11408") ? t.porcentaje <= 50 : stryMutAct_9fa48("11407") ? false : stryMutAct_9fa48("11406") ? true : (stryCov_9fa48("11406", "11407", "11408", "11409"), t.porcentaje < 50))));
        if (stryMutAct_9fa48("11413") ? weakTopics.length <= 0 : stryMutAct_9fa48("11412") ? weakTopics.length >= 0 : stryMutAct_9fa48("11411") ? false : stryMutAct_9fa48("11410") ? true : (stryCov_9fa48("11410", "11411", "11412", "11413"), weakTopics.length > 0)) {
          if (stryMutAct_9fa48("11414")) {
            {}
          } else {
            stryCov_9fa48("11414");
            recommendations.push(stryMutAct_9fa48("11415") ? `` : (stryCov_9fa48("11415"), `Enfócate en estudiar: ${stryMutAct_9fa48("11416") ? weakTopics.map(t => t.nombre).join(', ') : (stryCov_9fa48("11416"), weakTopics.slice(0, 3).map(stryMutAct_9fa48("11417") ? () => undefined : (stryCov_9fa48("11417"), t => t.nombre)).join(stryMutAct_9fa48("11418") ? "" : (stryCov_9fa48("11418"), ', ')))}`));
          }
        }
        if (stryMutAct_9fa48("11422") ? attempt.omitidas <= attempt.totalPreguntas * 0.2 : stryMutAct_9fa48("11421") ? attempt.omitidas >= attempt.totalPreguntas * 0.2 : stryMutAct_9fa48("11420") ? false : stryMutAct_9fa48("11419") ? true : (stryCov_9fa48("11419", "11420", "11421", "11422"), attempt.omitidas > (stryMutAct_9fa48("11423") ? attempt.totalPreguntas / 0.2 : (stryCov_9fa48("11423"), attempt.totalPreguntas * 0.2)))) {
          if (stryMutAct_9fa48("11424")) {
            {}
          } else {
            stryCov_9fa48("11424");
            recommendations.push(stryMutAct_9fa48("11425") ? `` : (stryCov_9fa48("11425"), `Tienes ${attempt.omitidas} preguntas omitidas. Intenta responder todas las preguntas, incluso si no estás seguro.`));
          }
        }
        if (stryMutAct_9fa48("11429") ? attempt.porcentaje >= 50 : stryMutAct_9fa48("11428") ? attempt.porcentaje <= 50 : stryMutAct_9fa48("11427") ? false : stryMutAct_9fa48("11426") ? true : (stryCov_9fa48("11426", "11427", "11428", "11429"), attempt.porcentaje < 50)) {
          if (stryMutAct_9fa48("11430")) {
            {}
          } else {
            stryCov_9fa48("11430");
            recommendations.push(stryMutAct_9fa48("11431") ? "" : (stryCov_9fa48("11431"), 'Tu puntaje está por debajo del 50%. Considera revisar los temas fundamentales antes de intentar otro examen.'));
          }
        } else if (stryMutAct_9fa48("11435") ? attempt.porcentaje < 70 : stryMutAct_9fa48("11434") ? attempt.porcentaje > 70 : stryMutAct_9fa48("11433") ? false : stryMutAct_9fa48("11432") ? true : (stryCov_9fa48("11432", "11433", "11434", "11435"), attempt.porcentaje >= 70)) {
          if (stryMutAct_9fa48("11436")) {
            {}
          } else {
            stryCov_9fa48("11436");
            recommendations.push(stryMutAct_9fa48("11437") ? "" : (stryCov_9fa48("11437"), '¡Excelente trabajo! Continúa practicando para mantener este nivel.'));
          }
        }
        const incorrectCount = attempt.incorrectas;
        if (stryMutAct_9fa48("11441") ? incorrectCount <= 0 : stryMutAct_9fa48("11440") ? incorrectCount >= 0 : stryMutAct_9fa48("11439") ? false : stryMutAct_9fa48("11438") ? true : (stryCov_9fa48("11438", "11439", "11440", "11441"), incorrectCount > 0)) {
          if (stryMutAct_9fa48("11442")) {
            {}
          } else {
            stryCov_9fa48("11442");
            recommendations.push(stryMutAct_9fa48("11443") ? `` : (stryCov_9fa48("11443"), `Revisa las ${incorrectCount} preguntas incorrectas y estudia sus explicaciones.`));
          }
        }
        return recommendations;
      }
    };
    const formatDuration = (seconds: number | null) => {
      if (stryMutAct_9fa48("11444")) {
        {}
      } else {
        stryCov_9fa48("11444");
        if (stryMutAct_9fa48("11447") ? false : stryMutAct_9fa48("11446") ? true : stryMutAct_9fa48("11445") ? seconds : (stryCov_9fa48("11445", "11446", "11447"), !seconds)) return stryMutAct_9fa48("11448") ? "" : (stryCov_9fa48("11448"), 'N/A');
        const mins = Math.floor(stryMutAct_9fa48("11449") ? seconds * 60 : (stryCov_9fa48("11449"), seconds / 60));
        const secs = stryMutAct_9fa48("11450") ? seconds * 60 : (stryCov_9fa48("11450"), seconds % 60);
        return stryMutAct_9fa48("11451") ? `` : (stryCov_9fa48("11451"), `${mins}m ${secs}s`);
      }
    };
    const getScoreColor = (porcentaje: number) => {
      if (stryMutAct_9fa48("11452")) {
        {}
      } else {
        stryCov_9fa48("11452");
        if (stryMutAct_9fa48("11456") ? porcentaje < 70 : stryMutAct_9fa48("11455") ? porcentaje > 70 : stryMutAct_9fa48("11454") ? false : stryMutAct_9fa48("11453") ? true : (stryCov_9fa48("11453", "11454", "11455", "11456"), porcentaje >= 70)) return stryMutAct_9fa48("11457") ? "" : (stryCov_9fa48("11457"), 'text-green-600');
        if (stryMutAct_9fa48("11461") ? porcentaje < 50 : stryMutAct_9fa48("11460") ? porcentaje > 50 : stryMutAct_9fa48("11459") ? false : stryMutAct_9fa48("11458") ? true : (stryCov_9fa48("11458", "11459", "11460", "11461"), porcentaje >= 50)) return stryMutAct_9fa48("11462") ? "" : (stryCov_9fa48("11462"), 'text-yellow-600');
        return stryMutAct_9fa48("11463") ? "" : (stryCov_9fa48("11463"), 'text-red-600');
      }
    };
    if (stryMutAct_9fa48("11465") ? false : stryMutAct_9fa48("11464") ? true : (stryCov_9fa48("11464", "11465"), isLoading)) {
      if (stryMutAct_9fa48("11466")) {
        {}
      } else {
        stryCov_9fa48("11466");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando detalles del intento...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("11469") ? error && !attempt : stryMutAct_9fa48("11468") ? false : stryMutAct_9fa48("11467") ? true : (stryCov_9fa48("11467", "11468", "11469"), error || (stryMutAct_9fa48("11470") ? attempt : (stryCov_9fa48("11470"), !attempt)))) {
      if (stryMutAct_9fa48("11471")) {
        {}
      } else {
        stryCov_9fa48("11471");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("11474") ? error && 'No se pudo cargar el intento' : stryMutAct_9fa48("11473") ? false : stryMutAct_9fa48("11472") ? true : (stryCov_9fa48("11472", "11473", "11474"), error || (stryMutAct_9fa48("11475") ? "" : (stryCov_9fa48("11475"), 'No se pudo cargar el intento')))}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("11476") ? () => undefined : (stryCov_9fa48("11476"), () => router.push(stryMutAct_9fa48("11477") ? "" : (stryCov_9fa48("11477"), '/dashboard')))}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const stats = topicStats();
    const recommendations = generateRecommendations();
    const pieData = stryMutAct_9fa48("11478") ? [] : (stryCov_9fa48("11478"), [stryMutAct_9fa48("11479") ? {} : (stryCov_9fa48("11479"), {
      name: stryMutAct_9fa48("11480") ? "" : (stryCov_9fa48("11480"), 'Correctas'),
      value: attempt.correctas,
      color: stryMutAct_9fa48("11481") ? "" : (stryCov_9fa48("11481"), '#22c55e')
    }), stryMutAct_9fa48("11482") ? {} : (stryCov_9fa48("11482"), {
      name: stryMutAct_9fa48("11483") ? "" : (stryCov_9fa48("11483"), 'Incorrectas'),
      value: attempt.incorrectas,
      color: stryMutAct_9fa48("11484") ? "" : (stryCov_9fa48("11484"), '#ef4444')
    }), stryMutAct_9fa48("11485") ? {} : (stryCov_9fa48("11485"), {
      name: stryMutAct_9fa48("11486") ? "" : (stryCov_9fa48("11486"), 'Omitidas'),
      value: attempt.omitidas,
      color: stryMutAct_9fa48("11487") ? "" : (stryCov_9fa48("11487"), '#eab308')
    })]);
    return <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={stryMutAct_9fa48("11488") ? [] : (stryCov_9fa48("11488"), [stryMutAct_9fa48("11489") ? {} : (stryCov_9fa48("11489"), {
          label: stryMutAct_9fa48("11490") ? "" : (stryCov_9fa48("11490"), 'Inicio'),
          href: stryMutAct_9fa48("11491") ? "" : (stryCov_9fa48("11491"), '/')
        }), stryMutAct_9fa48("11492") ? {} : (stryCov_9fa48("11492"), {
          label: stryMutAct_9fa48("11493") ? "" : (stryCov_9fa48("11493"), 'Dashboard'),
          href: stryMutAct_9fa48("11494") ? "" : (stryCov_9fa48("11494"), '/dashboard')
        }), stryMutAct_9fa48("11495") ? {} : (stryCov_9fa48("11495"), {
          label: stryMutAct_9fa48("11496") ? "" : (stryCov_9fa48("11496"), 'Detalles del Intento')
        })])} />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("11497") ? () => undefined : (stryCov_9fa48("11497"), () => router.back())}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{attempt.exam.titulo}</h1>
          <p className="text-muted-foreground">{attempt.exam.subject.nombre}</p>
        </div>
        <Badge variant={(stryMutAct_9fa48("11500") ? attempt.estado !== 'completado' : stryMutAct_9fa48("11499") ? false : stryMutAct_9fa48("11498") ? true : (stryCov_9fa48("11498", "11499", "11500"), attempt.estado === (stryMutAct_9fa48("11501") ? "" : (stryCov_9fa48("11501"), 'completado')))) ? stryMutAct_9fa48("11502") ? "" : (stryCov_9fa48("11502"), 'default') : stryMutAct_9fa48("11503") ? "" : (stryCov_9fa48("11503"), 'secondary')}>
          {attempt.estado}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <Button variant={(stryMutAct_9fa48("11506") ? activeTab !== 'overview' : stryMutAct_9fa48("11505") ? false : stryMutAct_9fa48("11504") ? true : (stryCov_9fa48("11504", "11505", "11506"), activeTab === (stryMutAct_9fa48("11507") ? "" : (stryCov_9fa48("11507"), 'overview')))) ? stryMutAct_9fa48("11508") ? "" : (stryCov_9fa48("11508"), 'default') : stryMutAct_9fa48("11509") ? "" : (stryCov_9fa48("11509"), 'ghost')} onClick={stryMutAct_9fa48("11510") ? () => undefined : (stryCov_9fa48("11510"), () => setActiveTab(stryMutAct_9fa48("11511") ? "" : (stryCov_9fa48("11511"), 'overview')))}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Resumen
        </Button>
        <Button variant={(stryMutAct_9fa48("11514") ? activeTab !== 'questions' : stryMutAct_9fa48("11513") ? false : stryMutAct_9fa48("11512") ? true : (stryCov_9fa48("11512", "11513", "11514"), activeTab === (stryMutAct_9fa48("11515") ? "" : (stryCov_9fa48("11515"), 'questions')))) ? stryMutAct_9fa48("11516") ? "" : (stryCov_9fa48("11516"), 'default') : stryMutAct_9fa48("11517") ? "" : (stryCov_9fa48("11517"), 'ghost')} onClick={stryMutAct_9fa48("11518") ? () => undefined : (stryCov_9fa48("11518"), () => setActiveTab(stryMutAct_9fa48("11519") ? "" : (stryCov_9fa48("11519"), 'questions')))}>
          <BookOpen className="h-4 w-4 mr-2" />
          Preguntas ({attempt.totalPreguntas})
        </Button>
        <Button variant={(stryMutAct_9fa48("11522") ? activeTab !== 'topics' : stryMutAct_9fa48("11521") ? false : stryMutAct_9fa48("11520") ? true : (stryCov_9fa48("11520", "11521", "11522"), activeTab === (stryMutAct_9fa48("11523") ? "" : (stryCov_9fa48("11523"), 'topics')))) ? stryMutAct_9fa48("11524") ? "" : (stryCov_9fa48("11524"), 'default') : stryMutAct_9fa48("11525") ? "" : (stryCov_9fa48("11525"), 'ghost')} onClick={stryMutAct_9fa48("11526") ? () => undefined : (stryCov_9fa48("11526"), () => setActiveTab(stryMutAct_9fa48("11527") ? "" : (stryCov_9fa48("11527"), 'topics')))}>
          <Target className="h-4 w-4 mr-2" />
          Temas
        </Button>
      </div>

      {/* Overview Tab */}
      {stryMutAct_9fa48("11530") ? activeTab === 'overview' || <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Puntaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(attempt.porcentaje)}`}>
                  {attempt.porcentaje.toFixed(1)}%
                </div>
                {attempt.puntajePaes && <p className="text-sm text-muted-foreground mt-1">
                    PAES: {attempt.puntajePaes}
                    {attempt.puntajeEstimado && ' (estimado)'}
                  </p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Correctas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {attempt.correctas} / {attempt.totalPreguntas}
                </div>
                <Progress value={attempt.correctas / attempt.totalPreguntas * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Duración</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  {formatDuration(attempt.duracionSegundos)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Fecha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {new Date(attempt.finishedAt || attempt.startedAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de distribución */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Respuestas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({
                    name,
                    percent
                  }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Comparación con intentos anteriores */}
            {previousAttempts.length > 0 && <Card>
                <CardHeader>
                  <CardTitle>Comparación con Intentos Anteriores</CardTitle>
                  <CardDescription>Mismo examen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[...previousAttempts.map(a => ({
                  name: new Date(a.startedAt).toLocaleDateString('es-CL', {
                    month: 'short',
                    day: 'numeric'
                  }),
                  porcentaje: a.porcentaje,
                  tipo: 'Anterior'
                })), {
                  name: 'Este intento',
                  porcentaje: attempt.porcentaje,
                  tipo: 'Actual'
                }].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`} />
                      <Bar dataKey="porcentaje" fill="#3b82f6">
                        {previousAttempts.map((_, index) => <Cell key={`cell-${index}`} fill="#94a3b8" />)}
                        <Cell fill="#3b82f6" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {previousAttempts.length > 0 && <div className="mt-4 flex items-center gap-2">
                      {attempt.porcentaje > previousAttempts[0].porcentaje ? <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Mejoraste{' '}
                            {(attempt.porcentaje - previousAttempts[0].porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : attempt.porcentaje < previousAttempts[0].porcentaje ? <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            Disminuiste{' '}
                            {(previousAttempts[0].porcentaje - attempt.porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : <span className="text-sm text-muted-foreground">
                          Mismo rendimiento que tu último intento
                        </span>}
                    </div>}
                </CardContent>
              </Card>}
          </div>

          {/* Recomendaciones */}
          {recommendations.length > 0 && <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>)}
                </ul>
              </CardContent>
            </Card>}
        </div> : stryMutAct_9fa48("11529") ? false : stryMutAct_9fa48("11528") ? true : (stryCov_9fa48("11528", "11529", "11530"), (stryMutAct_9fa48("11532") ? activeTab !== 'overview' : stryMutAct_9fa48("11531") ? true : (stryCov_9fa48("11531", "11532"), activeTab === (stryMutAct_9fa48("11533") ? "" : (stryCov_9fa48("11533"), 'overview')))) && <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Puntaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={stryMutAct_9fa48("11534") ? `` : (stryCov_9fa48("11534"), `text-3xl font-bold ${getScoreColor(attempt.porcentaje)}`)}>
                  {attempt.porcentaje.toFixed(1)}%
                </div>
                {stryMutAct_9fa48("11537") ? attempt.puntajePaes || <p className="text-sm text-muted-foreground mt-1">
                    PAES: {attempt.puntajePaes}
                    {attempt.puntajeEstimado && ' (estimado)'}
                  </p> : stryMutAct_9fa48("11536") ? false : stryMutAct_9fa48("11535") ? true : (stryCov_9fa48("11535", "11536", "11537"), attempt.puntajePaes && <p className="text-sm text-muted-foreground mt-1">
                    PAES: {attempt.puntajePaes}
                    {stryMutAct_9fa48("11540") ? attempt.puntajeEstimado || ' (estimado)' : stryMutAct_9fa48("11539") ? false : stryMutAct_9fa48("11538") ? true : (stryCov_9fa48("11538", "11539", "11540"), attempt.puntajeEstimado && (stryMutAct_9fa48("11541") ? "" : (stryCov_9fa48("11541"), ' (estimado)')))}
                  </p>)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Correctas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {attempt.correctas} / {attempt.totalPreguntas}
                </div>
                <Progress value={stryMutAct_9fa48("11542") ? attempt.correctas / attempt.totalPreguntas / 100 : (stryCov_9fa48("11542"), (stryMutAct_9fa48("11543") ? attempt.correctas * attempt.totalPreguntas : (stryCov_9fa48("11543"), attempt.correctas / attempt.totalPreguntas)) * 100)} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Duración</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  {formatDuration(attempt.duracionSegundos)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Fecha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {new Date(stryMutAct_9fa48("11546") ? attempt.finishedAt && attempt.startedAt : stryMutAct_9fa48("11545") ? false : stryMutAct_9fa48("11544") ? true : (stryCov_9fa48("11544", "11545", "11546"), attempt.finishedAt || attempt.startedAt)).toLocaleDateString(stryMutAct_9fa48("11547") ? "" : (stryCov_9fa48("11547"), 'es-CL'), stryMutAct_9fa48("11548") ? {} : (stryCov_9fa48("11548"), {
                  year: stryMutAct_9fa48("11549") ? "" : (stryCov_9fa48("11549"), 'numeric'),
                  month: stryMutAct_9fa48("11550") ? "" : (stryCov_9fa48("11550"), 'long'),
                  day: stryMutAct_9fa48("11551") ? "" : (stryCov_9fa48("11551"), 'numeric'),
                  hour: stryMutAct_9fa48("11552") ? "" : (stryCov_9fa48("11552"), '2-digit'),
                  minute: stryMutAct_9fa48("11553") ? "" : (stryCov_9fa48("11553"), '2-digit')
                }))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de distribución */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Respuestas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={stryMutAct_9fa48("11554") ? true : (stryCov_9fa48("11554"), false)} label={stryMutAct_9fa48("11555") ? () => undefined : (stryCov_9fa48("11555"), ({
                    name,
                    percent
                  }) => stryMutAct_9fa48("11556") ? `` : (stryCov_9fa48("11556"), `${name}: ${(stryMutAct_9fa48("11557") ? (percent ?? 0) / 100 : (stryCov_9fa48("11557"), (stryMutAct_9fa48("11558") ? percent && 0 : (stryCov_9fa48("11558"), percent ?? 0)) * 100)).toFixed(0)}%`))} outerRadius={80} fill="#8884d8" dataKey="value">
                      {pieData.map(stryMutAct_9fa48("11559") ? () => undefined : (stryCov_9fa48("11559"), (entry, index) => <Cell key={stryMutAct_9fa48("11560") ? `` : (stryCov_9fa48("11560"), `cell-${index}`)} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Comparación con intentos anteriores */}
            {stryMutAct_9fa48("11563") ? previousAttempts.length > 0 || <Card>
                <CardHeader>
                  <CardTitle>Comparación con Intentos Anteriores</CardTitle>
                  <CardDescription>Mismo examen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[...previousAttempts.map(a => ({
                  name: new Date(a.startedAt).toLocaleDateString('es-CL', {
                    month: 'short',
                    day: 'numeric'
                  }),
                  porcentaje: a.porcentaje,
                  tipo: 'Anterior'
                })), {
                  name: 'Este intento',
                  porcentaje: attempt.porcentaje,
                  tipo: 'Actual'
                }].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`} />
                      <Bar dataKey="porcentaje" fill="#3b82f6">
                        {previousAttempts.map((_, index) => <Cell key={`cell-${index}`} fill="#94a3b8" />)}
                        <Cell fill="#3b82f6" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {previousAttempts.length > 0 && <div className="mt-4 flex items-center gap-2">
                      {attempt.porcentaje > previousAttempts[0].porcentaje ? <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Mejoraste{' '}
                            {(attempt.porcentaje - previousAttempts[0].porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : attempt.porcentaje < previousAttempts[0].porcentaje ? <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            Disminuiste{' '}
                            {(previousAttempts[0].porcentaje - attempt.porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : <span className="text-sm text-muted-foreground">
                          Mismo rendimiento que tu último intento
                        </span>}
                    </div>}
                </CardContent>
              </Card> : stryMutAct_9fa48("11562") ? false : stryMutAct_9fa48("11561") ? true : (stryCov_9fa48("11561", "11562", "11563"), (stryMutAct_9fa48("11566") ? previousAttempts.length <= 0 : stryMutAct_9fa48("11565") ? previousAttempts.length >= 0 : stryMutAct_9fa48("11564") ? true : (stryCov_9fa48("11564", "11565", "11566"), previousAttempts.length > 0)) && <Card>
                <CardHeader>
                  <CardTitle>Comparación con Intentos Anteriores</CardTitle>
                  <CardDescription>Mismo examen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stryMutAct_9fa48("11567") ? [...previousAttempts.map(a => ({
                  name: new Date(a.startedAt).toLocaleDateString('es-CL', {
                    month: 'short',
                    day: 'numeric'
                  }),
                  porcentaje: a.porcentaje,
                  tipo: 'Anterior'
                })), {
                  name: 'Este intento',
                  porcentaje: attempt.porcentaje,
                  tipo: 'Actual'
                }] : (stryCov_9fa48("11567"), (stryMutAct_9fa48("11568") ? [] : (stryCov_9fa48("11568"), [...previousAttempts.map(stryMutAct_9fa48("11569") ? () => undefined : (stryCov_9fa48("11569"), a => stryMutAct_9fa48("11570") ? {} : (stryCov_9fa48("11570"), {
                  name: new Date(a.startedAt).toLocaleDateString(stryMutAct_9fa48("11571") ? "" : (stryCov_9fa48("11571"), 'es-CL'), stryMutAct_9fa48("11572") ? {} : (stryCov_9fa48("11572"), {
                    month: stryMutAct_9fa48("11573") ? "" : (stryCov_9fa48("11573"), 'short'),
                    day: stryMutAct_9fa48("11574") ? "" : (stryCov_9fa48("11574"), 'numeric')
                  })),
                  porcentaje: a.porcentaje,
                  tipo: stryMutAct_9fa48("11575") ? "" : (stryCov_9fa48("11575"), 'Anterior')
                }))), stryMutAct_9fa48("11576") ? {} : (stryCov_9fa48("11576"), {
                  name: stryMutAct_9fa48("11577") ? "" : (stryCov_9fa48("11577"), 'Este intento'),
                  porcentaje: attempt.porcentaje,
                  tipo: stryMutAct_9fa48("11578") ? "" : (stryCov_9fa48("11578"), 'Actual')
                })])).reverse())}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={stryMutAct_9fa48("11579") ? [] : (stryCov_9fa48("11579"), [0, 100])} />
                      <Tooltip formatter={stryMutAct_9fa48("11580") ? () => undefined : (stryCov_9fa48("11580"), (value: number | undefined) => stryMutAct_9fa48("11581") ? `` : (stryCov_9fa48("11581"), `${(stryMutAct_9fa48("11582") ? value && 0 : (stryCov_9fa48("11582"), value ?? 0)).toFixed(1)}%`))} />
                      <Bar dataKey="porcentaje" fill="#3b82f6">
                        {previousAttempts.map(stryMutAct_9fa48("11583") ? () => undefined : (stryCov_9fa48("11583"), (_, index) => <Cell key={stryMutAct_9fa48("11584") ? `` : (stryCov_9fa48("11584"), `cell-${index}`)} fill="#94a3b8" />))}
                        <Cell fill="#3b82f6" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {stryMutAct_9fa48("11587") ? previousAttempts.length > 0 || <div className="mt-4 flex items-center gap-2">
                      {attempt.porcentaje > previousAttempts[0].porcentaje ? <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Mejoraste{' '}
                            {(attempt.porcentaje - previousAttempts[0].porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : attempt.porcentaje < previousAttempts[0].porcentaje ? <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            Disminuiste{' '}
                            {(previousAttempts[0].porcentaje - attempt.porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : <span className="text-sm text-muted-foreground">
                          Mismo rendimiento que tu último intento
                        </span>}
                    </div> : stryMutAct_9fa48("11586") ? false : stryMutAct_9fa48("11585") ? true : (stryCov_9fa48("11585", "11586", "11587"), (stryMutAct_9fa48("11590") ? previousAttempts.length <= 0 : stryMutAct_9fa48("11589") ? previousAttempts.length >= 0 : stryMutAct_9fa48("11588") ? true : (stryCov_9fa48("11588", "11589", "11590"), previousAttempts.length > 0)) && <div className="mt-4 flex items-center gap-2">
                      {(stryMutAct_9fa48("11594") ? attempt.porcentaje <= previousAttempts[0].porcentaje : stryMutAct_9fa48("11593") ? attempt.porcentaje >= previousAttempts[0].porcentaje : stryMutAct_9fa48("11592") ? false : stryMutAct_9fa48("11591") ? true : (stryCov_9fa48("11591", "11592", "11593", "11594"), attempt.porcentaje > previousAttempts[0].porcentaje)) ? <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Mejoraste{stryMutAct_9fa48("11595") ? "" : (stryCov_9fa48("11595"), ' ')}
                            {(stryMutAct_9fa48("11596") ? attempt.porcentaje + previousAttempts[0].porcentaje : (stryCov_9fa48("11596"), attempt.porcentaje - previousAttempts[0].porcentaje)).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : (stryMutAct_9fa48("11600") ? attempt.porcentaje >= previousAttempts[0].porcentaje : stryMutAct_9fa48("11599") ? attempt.porcentaje <= previousAttempts[0].porcentaje : stryMutAct_9fa48("11598") ? false : stryMutAct_9fa48("11597") ? true : (stryCov_9fa48("11597", "11598", "11599", "11600"), attempt.porcentaje < previousAttempts[0].porcentaje)) ? <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            Disminuiste{stryMutAct_9fa48("11601") ? "" : (stryCov_9fa48("11601"), ' ')}
                            {(stryMutAct_9fa48("11602") ? previousAttempts[0].porcentaje + attempt.porcentaje : (stryCov_9fa48("11602"), previousAttempts[0].porcentaje - attempt.porcentaje)).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </> : <span className="text-sm text-muted-foreground">
                          Mismo rendimiento que tu último intento
                        </span>}
                    </div>)}
                </CardContent>
              </Card>)}
          </div>

          {/* Recomendaciones */}
          {stryMutAct_9fa48("11605") ? recommendations.length > 0 || <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>)}
                </ul>
              </CardContent>
            </Card> : stryMutAct_9fa48("11604") ? false : stryMutAct_9fa48("11603") ? true : (stryCov_9fa48("11603", "11604", "11605"), (stryMutAct_9fa48("11608") ? recommendations.length <= 0 : stryMutAct_9fa48("11607") ? recommendations.length >= 0 : stryMutAct_9fa48("11606") ? true : (stryCov_9fa48("11606", "11607", "11608"), recommendations.length > 0)) && <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map(stryMutAct_9fa48("11609") ? () => undefined : (stryCov_9fa48("11609"), (rec, index) => <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>))}
                </ul>
              </CardContent>
            </Card>)}
        </div>)}

      {/* Questions Tab */}
      {stryMutAct_9fa48("11612") ? activeTab === 'questions' || <div className="space-y-4">
          {attempt.answers.map((answer, index) => <QuestionReview key={answer.id} answer={answer} index={index} showTopic={true} />)}
        </div> : stryMutAct_9fa48("11611") ? false : stryMutAct_9fa48("11610") ? true : (stryCov_9fa48("11610", "11611", "11612"), (stryMutAct_9fa48("11614") ? activeTab !== 'questions' : stryMutAct_9fa48("11613") ? true : (stryCov_9fa48("11613", "11614"), activeTab === (stryMutAct_9fa48("11615") ? "" : (stryCov_9fa48("11615"), 'questions')))) && <div className="space-y-4">
          {attempt.answers.map(stryMutAct_9fa48("11616") ? () => undefined : (stryCov_9fa48("11616"), (answer, index) => <QuestionReview key={answer.id} answer={answer} index={index} showTopic={stryMutAct_9fa48("11617") ? false : (stryCov_9fa48("11617"), true)} />))}
        </div>)}

      {/* Topics Tab */}
      {stryMutAct_9fa48("11620") ? activeTab === 'topics' || <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tema</CardTitle>
              <CardDescription>Análisis de tu desempeño en cada tema del examen</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.length > 0 ? <div className="space-y-4">
                  {stats.map(topic => <div key={topic.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{topic.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {topic.correctas} de {topic.total} correctas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getScoreColor(topic.porcentaje)}`}>
                            {topic.porcentaje.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Progress value={topic.porcentaje} className="h-2" />
                    </div>)}
                </div> : <p className="text-muted-foreground text-center py-8">
                  No hay información de temas disponible para este examen.
                </p>}
            </CardContent>
          </Card>

          {/* Gráfico de temas */}
          {stats.length > 0 && <Card>
              <CardHeader>
                <CardTitle>Gráfico de Rendimiento por Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`} />
                    <Bar dataKey="porcentaje" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>}
        </div> : stryMutAct_9fa48("11619") ? false : stryMutAct_9fa48("11618") ? true : (stryCov_9fa48("11618", "11619", "11620"), (stryMutAct_9fa48("11622") ? activeTab !== 'topics' : stryMutAct_9fa48("11621") ? true : (stryCov_9fa48("11621", "11622"), activeTab === (stryMutAct_9fa48("11623") ? "" : (stryCov_9fa48("11623"), 'topics')))) && <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tema</CardTitle>
              <CardDescription>Análisis de tu desempeño en cada tema del examen</CardDescription>
            </CardHeader>
            <CardContent>
              {(stryMutAct_9fa48("11627") ? stats.length <= 0 : stryMutAct_9fa48("11626") ? stats.length >= 0 : stryMutAct_9fa48("11625") ? false : stryMutAct_9fa48("11624") ? true : (stryCov_9fa48("11624", "11625", "11626", "11627"), stats.length > 0)) ? <div className="space-y-4">
                  {stats.map(stryMutAct_9fa48("11628") ? () => undefined : (stryCov_9fa48("11628"), topic => <div key={topic.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{topic.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {topic.correctas} de {topic.total} correctas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={stryMutAct_9fa48("11629") ? `` : (stryCov_9fa48("11629"), `text-2xl font-bold ${getScoreColor(topic.porcentaje)}`)}>
                            {topic.porcentaje.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Progress value={topic.porcentaje} className="h-2" />
                    </div>))}
                </div> : <p className="text-muted-foreground text-center py-8">
                  No hay información de temas disponible para este examen.
                </p>}
            </CardContent>
          </Card>

          {/* Gráfico de temas */}
          {stryMutAct_9fa48("11632") ? stats.length > 0 || <Card>
              <CardHeader>
                <CardTitle>Gráfico de Rendimiento por Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`} />
                    <Bar dataKey="porcentaje" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> : stryMutAct_9fa48("11631") ? false : stryMutAct_9fa48("11630") ? true : (stryCov_9fa48("11630", "11631", "11632"), (stryMutAct_9fa48("11635") ? stats.length <= 0 : stryMutAct_9fa48("11634") ? stats.length >= 0 : stryMutAct_9fa48("11633") ? true : (stryCov_9fa48("11633", "11634", "11635"), stats.length > 0)) && <Card>
              <CardHeader>
                <CardTitle>Gráfico de Rendimiento por Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={stryMutAct_9fa48("11636") ? [] : (stryCov_9fa48("11636"), [0, 100])} />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip formatter={stryMutAct_9fa48("11637") ? () => undefined : (stryCov_9fa48("11637"), (value: number | undefined) => stryMutAct_9fa48("11638") ? `` : (stryCov_9fa48("11638"), `${(stryMutAct_9fa48("11639") ? value && 0 : (stryCov_9fa48("11639"), value ?? 0)).toFixed(1)}%`))} />
                    <Bar dataKey="porcentaje" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>)}
        </div>)}
    </div>;
  }
}