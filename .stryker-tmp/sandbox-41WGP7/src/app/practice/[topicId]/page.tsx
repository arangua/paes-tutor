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
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, XCircle, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button';
import { CreateNoteButton } from '@/components/notes/create-note-button';
interface Question {
  id: string;
  enunciado: string;
  explicacion: string;
  dificultad: number;
  options: Array<{
    id: string;
    letra: string;
    texto: string;
    esCorrecta: boolean;
  }>;
  subject: {
    nombre: string;
    codigo: string;
  };
  topic: {
    id?: string;
    nombre: string;
    ejeTematico: string;
  };
}
interface Answer {
  questionId: string;
  optionSelectedId?: string;
  omitida?: boolean;
  tiempoSegundos?: number;
  isCorrect?: boolean;
  answeredAt?: number;
}
export default function PracticeTopicPage() {
  if (stryMutAct_9fa48("14664")) {
    {}
  } else {
    stryCov_9fa48("14664");
    const params = useParams();
    const router = useRouter();
    const topicId = params.topicId as string;
    const [questions, setQuestions] = useState<Question[]>(stryMutAct_9fa48("14665") ? ["Stryker was here"] : (stryCov_9fa48("14665"), []));
    const [topicName, setTopicName] = useState<string>(stryMutAct_9fa48("14666") ? "Stryker was here!" : (stryCov_9fa48("14666"), ''));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
    const [showExplanation, setShowExplanation] = useState(stryMutAct_9fa48("14667") ? true : (stryCov_9fa48("14667"), false));
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("14668") ? true : (stryCov_9fa48("14668"), false));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("14669") ? false : (stryCov_9fa48("14669"), true));
    const [error, setError] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const questionStartTimeRef = useRef<number>(Date.now());
    useEffect(() => {
      if (stryMutAct_9fa48("14670")) {
        {}
      } else {
        stryCov_9fa48("14670");
        if (stryMutAct_9fa48("14673") ? false : stryMutAct_9fa48("14672") ? true : stryMutAct_9fa48("14671") ? topicId : (stryCov_9fa48("14671", "14672", "14673"), !topicId)) {
          if (stryMutAct_9fa48("14674")) {
            {}
          } else {
            stryCov_9fa48("14674");
            setError(stryMutAct_9fa48("14675") ? "" : (stryCov_9fa48("14675"), 'ID de tema inválido'));
            setIsLoading(stryMutAct_9fa48("14676") ? true : (stryCov_9fa48("14676"), false));
            return;
          }
        }
        async function loadQuestions() {
          if (stryMutAct_9fa48("14677")) {
            {}
          } else {
            stryCov_9fa48("14677");
            try {
              if (stryMutAct_9fa48("14678")) {
                {}
              } else {
                stryCov_9fa48("14678");
                setIsLoading(stryMutAct_9fa48("14679") ? false : (stryCov_9fa48("14679"), true));
                setError(null);
                const res = await fetch(stryMutAct_9fa48("14680") ? `` : (stryCov_9fa48("14680"), `/api/practice/questions?topicId=${topicId}&limit=20`));
                if (stryMutAct_9fa48("14683") ? false : stryMutAct_9fa48("14682") ? true : stryMutAct_9fa48("14681") ? res.ok : (stryCov_9fa48("14681", "14682", "14683"), !res.ok)) {
                  if (stryMutAct_9fa48("14684")) {
                    {}
                  } else {
                    stryCov_9fa48("14684");
                    throw new Error(stryMutAct_9fa48("14685") ? "" : (stryCov_9fa48("14685"), 'Error al cargar preguntas'));
                  }
                }
                const data = await res.json();
                if (stryMutAct_9fa48("14688") ? !data.questions && data.questions.length === 0 : stryMutAct_9fa48("14687") ? false : stryMutAct_9fa48("14686") ? true : (stryCov_9fa48("14686", "14687", "14688"), (stryMutAct_9fa48("14689") ? data.questions : (stryCov_9fa48("14689"), !data.questions)) || (stryMutAct_9fa48("14691") ? data.questions.length !== 0 : stryMutAct_9fa48("14690") ? false : (stryCov_9fa48("14690", "14691"), data.questions.length === 0)))) {
                  if (stryMutAct_9fa48("14692")) {
                    {}
                  } else {
                    stryCov_9fa48("14692");
                    throw new Error(stryMutAct_9fa48("14693") ? "" : (stryCov_9fa48("14693"), 'No hay preguntas disponibles para este tema'));
                  }
                }
                setQuestions(data.questions);
                setTopicName(stryMutAct_9fa48("14696") ? data.topic?.nombre && 'Tema' : stryMutAct_9fa48("14695") ? false : stryMutAct_9fa48("14694") ? true : (stryCov_9fa48("14694", "14695", "14696"), (stryMutAct_9fa48("14697") ? data.topic.nombre : (stryCov_9fa48("14697"), data.topic?.nombre)) || (stryMutAct_9fa48("14698") ? "" : (stryCov_9fa48("14698"), 'Tema'))));
                setStartTime(Date.now());
                questionStartTimeRef.current = Date.now();
              }
            } catch (err) {
              if (stryMutAct_9fa48("14699")) {
                {}
              } else {
                stryCov_9fa48("14699");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("14700") ? "" : (stryCov_9fa48("14700"), 'Error desconocido'));
                toast.error(stryMutAct_9fa48("14701") ? "" : (stryCov_9fa48("14701"), 'Error al cargar preguntas'));
              }
            } finally {
              if (stryMutAct_9fa48("14702")) {
                {}
              } else {
                stryCov_9fa48("14702");
                setIsLoading(stryMutAct_9fa48("14703") ? true : (stryCov_9fa48("14703"), false));
              }
            }
          }
        }
        loadQuestions();
      }
    }, stryMutAct_9fa48("14704") ? [] : (stryCov_9fa48("14704"), [topicId]));
    const handleAnswerSelect = (optionId: string) => {
      if (stryMutAct_9fa48("14705")) {
        {}
      } else {
        stryCov_9fa48("14705");
        if (stryMutAct_9fa48("14707") ? false : stryMutAct_9fa48("14706") ? true : (stryCov_9fa48("14706", "14707"), showExplanation)) return; // No permitir cambiar respuesta después de ver explicación

        const currentQ = questions[currentQuestion];
        const selectedOption = currentQ.options.find(stryMutAct_9fa48("14708") ? () => undefined : (stryCov_9fa48("14708"), opt => stryMutAct_9fa48("14711") ? opt.id !== optionId : stryMutAct_9fa48("14710") ? false : stryMutAct_9fa48("14709") ? true : (stryCov_9fa48("14709", "14710", "14711"), opt.id === optionId)));
        const isCorrect = stryMutAct_9fa48("14714") ? selectedOption?.esCorrecta && false : stryMutAct_9fa48("14713") ? false : stryMutAct_9fa48("14712") ? true : (stryCov_9fa48("14712", "14713", "14714"), (stryMutAct_9fa48("14715") ? selectedOption.esCorrecta : (stryCov_9fa48("14715"), selectedOption?.esCorrecta)) || (stryMutAct_9fa48("14716") ? true : (stryCov_9fa48("14716"), false)));
        const tiempoSegundos = Math.floor(stryMutAct_9fa48("14717") ? (Date.now() - questionStartTimeRef.current) * 1000 : (stryCov_9fa48("14717"), (stryMutAct_9fa48("14718") ? Date.now() + questionStartTimeRef.current : (stryCov_9fa48("14718"), Date.now() - questionStartTimeRef.current)) / 1000));
        setAnswers(prev => {
          if (stryMutAct_9fa48("14719")) {
            {}
          } else {
            stryCov_9fa48("14719");
            const newAnswers = new Map(prev);
            newAnswers.set(currentQ.id, stryMutAct_9fa48("14720") ? {} : (stryCov_9fa48("14720"), {
              questionId: currentQ.id,
              optionSelectedId: optionId,
              omitida: stryMutAct_9fa48("14721") ? true : (stryCov_9fa48("14721"), false),
              tiempoSegundos,
              isCorrect,
              answeredAt: Date.now()
            }));
            return newAnswers;
          }
        });

        // Mostrar feedback inmediato
        setShowExplanation(stryMutAct_9fa48("14722") ? false : (stryCov_9fa48("14722"), true));
        if (stryMutAct_9fa48("14724") ? false : stryMutAct_9fa48("14723") ? true : (stryCov_9fa48("14723", "14724"), isCorrect)) {
          if (stryMutAct_9fa48("14725")) {
            {}
          } else {
            stryCov_9fa48("14725");
            toast.success(stryMutAct_9fa48("14726") ? "" : (stryCov_9fa48("14726"), '¡Correcto!'), stryMutAct_9fa48("14727") ? {} : (stryCov_9fa48("14727"), {
              duration: 2000
            }));
          }
        } else {
          if (stryMutAct_9fa48("14728")) {
            {}
          } else {
            stryCov_9fa48("14728");
            toast.error(stryMutAct_9fa48("14729") ? "" : (stryCov_9fa48("14729"), 'Incorrecto'), stryMutAct_9fa48("14730") ? {} : (stryCov_9fa48("14730"), {
              duration: 2000
            }));
          }
        }
      }
    };
    const handleNext = () => {
      if (stryMutAct_9fa48("14731")) {
        {}
      } else {
        stryCov_9fa48("14731");
        if (stryMutAct_9fa48("14735") ? currentQuestion >= questions.length - 1 : stryMutAct_9fa48("14734") ? currentQuestion <= questions.length - 1 : stryMutAct_9fa48("14733") ? false : stryMutAct_9fa48("14732") ? true : (stryCov_9fa48("14732", "14733", "14734", "14735"), currentQuestion < (stryMutAct_9fa48("14736") ? questions.length + 1 : (stryCov_9fa48("14736"), questions.length - 1)))) {
          if (stryMutAct_9fa48("14737")) {
            {}
          } else {
            stryCov_9fa48("14737");
            setCurrentQuestion(stryMutAct_9fa48("14738") ? () => undefined : (stryCov_9fa48("14738"), prev => stryMutAct_9fa48("14739") ? prev - 1 : (stryCov_9fa48("14739"), prev + 1)));
            setShowExplanation(stryMutAct_9fa48("14740") ? true : (stryCov_9fa48("14740"), false));
            questionStartTimeRef.current = Date.now();
          }
        }
      }
    };
    const handlePrevious = () => {
      if (stryMutAct_9fa48("14741")) {
        {}
      } else {
        stryCov_9fa48("14741");
        if (stryMutAct_9fa48("14745") ? currentQuestion <= 0 : stryMutAct_9fa48("14744") ? currentQuestion >= 0 : stryMutAct_9fa48("14743") ? false : stryMutAct_9fa48("14742") ? true : (stryCov_9fa48("14742", "14743", "14744", "14745"), currentQuestion > 0)) {
          if (stryMutAct_9fa48("14746")) {
            {}
          } else {
            stryCov_9fa48("14746");
            setCurrentQuestion(stryMutAct_9fa48("14747") ? () => undefined : (stryCov_9fa48("14747"), prev => stryMutAct_9fa48("14748") ? prev + 1 : (stryCov_9fa48("14748"), prev - 1)));
            setShowExplanation(stryMutAct_9fa48("14749") ? true : (stryCov_9fa48("14749"), false));
            questionStartTimeRef.current = Date.now();
          }
        }
      }
    };
    const handleFinish = async () => {
      if (stryMutAct_9fa48("14750")) {
        {}
      } else {
        stryCov_9fa48("14750");
        if (stryMutAct_9fa48("14752") ? false : stryMutAct_9fa48("14751") ? true : (stryCov_9fa48("14751", "14752"), isSubmitting)) return;
        setIsSubmitting(stryMutAct_9fa48("14753") ? false : (stryCov_9fa48("14753"), true));
        try {
          if (stryMutAct_9fa48("14754")) {
            {}
          } else {
            stryCov_9fa48("14754");
            const answersArray = Array.from(answers.values()).map(stryMutAct_9fa48("14755") ? () => undefined : (stryCov_9fa48("14755"), answer => stryMutAct_9fa48("14756") ? {} : (stryCov_9fa48("14756"), {
              questionId: answer.questionId,
              optionSelectedId: answer.optionSelectedId,
              omitida: stryMutAct_9fa48("14759") ? answer.omitida && false : stryMutAct_9fa48("14758") ? false : stryMutAct_9fa48("14757") ? true : (stryCov_9fa48("14757", "14758", "14759"), answer.omitida || (stryMutAct_9fa48("14760") ? true : (stryCov_9fa48("14760"), false))),
              tiempoSegundos: stryMutAct_9fa48("14763") ? answer.tiempoSegundos && 0 : stryMutAct_9fa48("14762") ? false : stryMutAct_9fa48("14761") ? true : (stryCov_9fa48("14761", "14762", "14763"), answer.tiempoSegundos || 0)
            })));

            // Agregar preguntas sin responder como omitidas
            const answeredQuestionIds = new Set(answersArray.map(stryMutAct_9fa48("14764") ? () => undefined : (stryCov_9fa48("14764"), a => a.questionId)));
            questions.forEach(q => {
              if (stryMutAct_9fa48("14765")) {
                {}
              } else {
                stryCov_9fa48("14765");
                if (stryMutAct_9fa48("14768") ? false : stryMutAct_9fa48("14767") ? true : stryMutAct_9fa48("14766") ? answeredQuestionIds.has(q.id) : (stryCov_9fa48("14766", "14767", "14768"), !answeredQuestionIds.has(q.id))) {
                  if (stryMutAct_9fa48("14769")) {
                    {}
                  } else {
                    stryCov_9fa48("14769");
                    answersArray.push(stryMutAct_9fa48("14770") ? {} : (stryCov_9fa48("14770"), {
                      questionId: q.id,
                      omitida: stryMutAct_9fa48("14771") ? false : (stryCov_9fa48("14771"), true),
                      tiempoSegundos: 0
                    }));
                  }
                }
              }
            });
            const res = await fetch(stryMutAct_9fa48("14772") ? "" : (stryCov_9fa48("14772"), '/api/practice/sessions'), stryMutAct_9fa48("14773") ? {} : (stryCov_9fa48("14773"), {
              method: stryMutAct_9fa48("14774") ? "" : (stryCov_9fa48("14774"), 'POST'),
              headers: stryMutAct_9fa48("14775") ? {} : (stryCov_9fa48("14775"), {
                'Content-Type': stryMutAct_9fa48("14776") ? "" : (stryCov_9fa48("14776"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("14777") ? {} : (stryCov_9fa48("14777"), {
                topicId,
                answers: answersArray
              }))
            }));
            if (stryMutAct_9fa48("14780") ? false : stryMutAct_9fa48("14779") ? true : stryMutAct_9fa48("14778") ? res.ok : (stryCov_9fa48("14778", "14779", "14780"), !res.ok)) {
              if (stryMutAct_9fa48("14781")) {
                {}
              } else {
                stryCov_9fa48("14781");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("14782") ? "" : (stryCov_9fa48("14782"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                }>(res, stryMutAct_9fa48("14783") ? {} : (stryCov_9fa48("14783"), {
                  path: (stryMutAct_9fa48("14786") ? typeof window === 'undefined' : stryMutAct_9fa48("14785") ? false : stryMutAct_9fa48("14784") ? true : (stryCov_9fa48("14784", "14785", "14786"), typeof window !== (stryMutAct_9fa48("14787") ? "" : (stryCov_9fa48("14787"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("14788") ? "" : (stryCov_9fa48("14788"), '/practice/[topicId]'),
                  operation: stryMutAct_9fa48("14789") ? "" : (stryCov_9fa48("14789"), 'guardar sesión de práctica')
                }));
                throw new Error(stryMutAct_9fa48("14792") ? errorData.error && 'Error al guardar sesión' : stryMutAct_9fa48("14791") ? false : stryMutAct_9fa48("14790") ? true : (stryCov_9fa48("14790", "14791", "14792"), errorData.error || (stryMutAct_9fa48("14793") ? "" : (stryCov_9fa48("14793"), 'Error al guardar sesión'))));
              }
            }
            const data = await res.json();

            // Guardar sesión en sessionStorage para la página de resultados
            if (stryMutAct_9fa48("14796") ? typeof window === 'undefined' : stryMutAct_9fa48("14795") ? false : stryMutAct_9fa48("14794") ? true : (stryCov_9fa48("14794", "14795", "14796"), typeof window !== (stryMutAct_9fa48("14797") ? "" : (stryCov_9fa48("14797"), 'undefined')))) {
              if (stryMutAct_9fa48("14798")) {
                {}
              } else {
                stryCov_9fa48("14798");
                sessionStorage.setItem(stryMutAct_9fa48("14799") ? `` : (stryCov_9fa48("14799"), `practice-session-${data.session.id}`), JSON.stringify(data.session));
              }
            }
            toast.success(stryMutAct_9fa48("14800") ? "" : (stryCov_9fa48("14800"), 'Sesión de práctica completada'));

            // Redirigir a resultados
            router.push(stryMutAct_9fa48("14801") ? `` : (stryCov_9fa48("14801"), `/practice/${topicId}/results?sessionId=${data.session.id}`));
          }
        } catch (err) {
          if (stryMutAct_9fa48("14802")) {
            {}
          } else {
            stryCov_9fa48("14802");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("14803") ? "" : (stryCov_9fa48("14803"), 'Error desconocido');
            toast.error(stryMutAct_9fa48("14804") ? "" : (stryCov_9fa48("14804"), 'Error al finalizar práctica'), stryMutAct_9fa48("14805") ? {} : (stryCov_9fa48("14805"), {
              description: errorMessage
            }));
            setIsSubmitting(stryMutAct_9fa48("14806") ? true : (stryCov_9fa48("14806"), false));
          }
        }
      }
    };
    const getProgress = () => {
      if (stryMutAct_9fa48("14807")) {
        {}
      } else {
        stryCov_9fa48("14807");
        if (stryMutAct_9fa48("14810") ? questions.length !== 0 : stryMutAct_9fa48("14809") ? false : stryMutAct_9fa48("14808") ? true : (stryCov_9fa48("14808", "14809", "14810"), questions.length === 0)) return 0;
        return stryMutAct_9fa48("14811") ? (currentQuestion + 1) / questions.length / 100 : (stryCov_9fa48("14811"), (stryMutAct_9fa48("14812") ? (currentQuestion + 1) * questions.length : (stryCov_9fa48("14812"), (stryMutAct_9fa48("14813") ? currentQuestion - 1 : (stryCov_9fa48("14813"), currentQuestion + 1)) / questions.length)) * 100);
      }
    };
    const getScore = () => {
      if (stryMutAct_9fa48("14814")) {
        {}
      } else {
        stryCov_9fa48("14814");
        const correct = stryMutAct_9fa48("14815") ? Array.from(answers.values()).length : (stryCov_9fa48("14815"), Array.from(answers.values()).filter(stryMutAct_9fa48("14816") ? () => undefined : (stryCov_9fa48("14816"), a => a.isCorrect)).length);
        const total = answers.size;
        return (stryMutAct_9fa48("14820") ? total <= 0 : stryMutAct_9fa48("14819") ? total >= 0 : stryMutAct_9fa48("14818") ? false : stryMutAct_9fa48("14817") ? true : (stryCov_9fa48("14817", "14818", "14819", "14820"), total > 0)) ? Math.round(stryMutAct_9fa48("14821") ? correct / total / 100 : (stryCov_9fa48("14821"), (stryMutAct_9fa48("14822") ? correct * total : (stryCov_9fa48("14822"), correct / total)) * 100)) : 0;
      }
    };
    if (stryMutAct_9fa48("14824") ? false : stryMutAct_9fa48("14823") ? true : (stryCov_9fa48("14823", "14824"), isLoading)) {
      if (stryMutAct_9fa48("14825")) {
        {}
      } else {
        stryCov_9fa48("14825");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando preguntas...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("14828") ? error && questions.length === 0 : stryMutAct_9fa48("14827") ? false : stryMutAct_9fa48("14826") ? true : (stryCov_9fa48("14826", "14827", "14828"), error || (stryMutAct_9fa48("14830") ? questions.length !== 0 : stryMutAct_9fa48("14829") ? false : (stryCov_9fa48("14829", "14830"), questions.length === 0)))) {
      if (stryMutAct_9fa48("14831")) {
        {}
      } else {
        stryCov_9fa48("14831");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("14834") ? error && 'No se pudieron cargar las preguntas' : stryMutAct_9fa48("14833") ? false : stryMutAct_9fa48("14832") ? true : (stryCov_9fa48("14832", "14833", "14834"), error || (stryMutAct_9fa48("14835") ? "" : (stryCov_9fa48("14835"), 'No se pudieron cargar las preguntas')))}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("14836") ? () => undefined : (stryCov_9fa48("14836"), () => router.push(stryMutAct_9fa48("14837") ? "" : (stryCov_9fa48("14837"), '/practice')))}>Volver a Selección</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const currentQ = questions[currentQuestion];
    const currentAnswer = answers.get(currentQ.id);
    const isAnswered = stryMutAct_9fa48("14838") ? !currentAnswer : (stryCov_9fa48("14838"), !(stryMutAct_9fa48("14839") ? currentAnswer : (stryCov_9fa48("14839"), !currentAnswer)));
    const isCorrect = stryMutAct_9fa48("14842") ? currentAnswer?.isCorrect && false : stryMutAct_9fa48("14841") ? false : stryMutAct_9fa48("14840") ? true : (stryCov_9fa48("14840", "14841", "14842"), (stryMutAct_9fa48("14843") ? currentAnswer.isCorrect : (stryCov_9fa48("14843"), currentAnswer?.isCorrect)) || (stryMutAct_9fa48("14844") ? true : (stryCov_9fa48("14844"), false)));
    return <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={stryMutAct_9fa48("14845") ? () => undefined : (stryCov_9fa48("14845"), () => router.push(stryMutAct_9fa48("14846") ? "" : (stryCov_9fa48("14846"), '/practice')))} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{topicName}</Badge>
            <Badge variant="secondary">
              Pregunta {stryMutAct_9fa48("14847") ? currentQuestion - 1 : (stryCov_9fa48("14847"), currentQuestion + 1)} de {questions.length}
            </Badge>
            {stryMutAct_9fa48("14850") ? isAnswered || <Badge variant={isCorrect ? 'default' : 'destructive'}>
                {isCorrect ? 'Correcta' : 'Incorrecta'}
              </Badge> : stryMutAct_9fa48("14849") ? false : stryMutAct_9fa48("14848") ? true : (stryCov_9fa48("14848", "14849", "14850"), isAnswered && <Badge variant={isCorrect ? stryMutAct_9fa48("14851") ? "" : (stryCov_9fa48("14851"), 'default') : stryMutAct_9fa48("14852") ? "" : (stryCov_9fa48("14852"), 'destructive')}>
                {isCorrect ? stryMutAct_9fa48("14853") ? "" : (stryCov_9fa48("14853"), 'Correcta') : stryMutAct_9fa48("14854") ? "" : (stryCov_9fa48("14854"), 'Incorrecta')}
              </Badge>)}
          </div>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Pregunta {stryMutAct_9fa48("14855") ? currentQuestion - 1 : (stryCov_9fa48("14855"), currentQuestion + 1)}</CardTitle>
              <BookmarkButton questionId={currentQ.id} />
              <CreateFlashcardButton questionId={currentQ.id} defaultFront={currentQ.enunciado} defaultBack={currentQ.explicacion} size="sm" />
              <CreateNoteButton questionId={currentQ.id} topicId={topicId} defaultTitle={stryMutAct_9fa48("14856") ? `` : (stryCov_9fa48("14856"), `Nota: ${stryMutAct_9fa48("14857") ? currentQ.enunciado : (stryCov_9fa48("14857"), currentQ.enunciado.substring(0, 50))}...`)} defaultContent={currentQ.explicacion} size="sm" />
            </div>
            <HelpIcon content="Selecciona una respuesta para recibir feedback inmediato. Puedes navegar entre preguntas con los botones de abajo." />
          </div>
          <CardDescription>
            {currentQ.subject.nombre} - {currentQ.topic.ejeTematico}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{currentQ.enunciado}</p>

          <div className="space-y-2">
            {currentQ.options.map(option => {
              if (stryMutAct_9fa48("14858")) {
                {}
              } else {
                stryCov_9fa48("14858");
                const isSelected = stryMutAct_9fa48("14861") ? currentAnswer?.optionSelectedId !== option.id : stryMutAct_9fa48("14860") ? false : stryMutAct_9fa48("14859") ? true : (stryCov_9fa48("14859", "14860", "14861"), (stryMutAct_9fa48("14862") ? currentAnswer.optionSelectedId : (stryCov_9fa48("14862"), currentAnswer?.optionSelectedId)) === option.id);
                const showCorrect = stryMutAct_9fa48("14865") ? showExplanation || option.esCorrecta : stryMutAct_9fa48("14864") ? false : stryMutAct_9fa48("14863") ? true : (stryCov_9fa48("14863", "14864", "14865"), showExplanation && option.esCorrecta);
                const showIncorrect = stryMutAct_9fa48("14868") ? showExplanation && isSelected || !option.esCorrecta : stryMutAct_9fa48("14867") ? false : stryMutAct_9fa48("14866") ? true : (stryCov_9fa48("14866", "14867", "14868"), (stryMutAct_9fa48("14870") ? showExplanation || isSelected : stryMutAct_9fa48("14869") ? true : (stryCov_9fa48("14869", "14870"), showExplanation && isSelected)) && (stryMutAct_9fa48("14871") ? option.esCorrecta : (stryCov_9fa48("14871"), !option.esCorrecta)));
                return <button key={option.id} onClick={stryMutAct_9fa48("14872") ? () => undefined : (stryCov_9fa48("14872"), () => handleAnswerSelect(option.id))} disabled={showExplanation} className={stryMutAct_9fa48("14873") ? `` : (stryCov_9fa48("14873"), `
                    w-full p-4 text-left rounded-lg border-2 transition-all
                    ${isSelected ? showCorrect ? stryMutAct_9fa48("14874") ? "" : (stryCov_9fa48("14874"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : showIncorrect ? stryMutAct_9fa48("14875") ? "" : (stryCov_9fa48("14875"), 'border-red-500 bg-red-50 dark:bg-red-950/20') : stryMutAct_9fa48("14876") ? "" : (stryCov_9fa48("14876"), 'border-primary bg-primary/5') : stryMutAct_9fa48("14877") ? "" : (stryCov_9fa48("14877"), 'border-border hover:border-primary/50')}
                    ${showExplanation ? stryMutAct_9fa48("14878") ? "" : (stryCov_9fa48("14878"), 'cursor-default') : stryMutAct_9fa48("14879") ? "" : (stryCov_9fa48("14879"), 'cursor-pointer hover:bg-accent')}
                  `)}>
                  <div className="flex items-center gap-3">
                    <div className={stryMutAct_9fa48("14880") ? `` : (stryCov_9fa48("14880"), `
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${isSelected ? showCorrect ? stryMutAct_9fa48("14881") ? "" : (stryCov_9fa48("14881"), 'bg-green-500 text-white') : showIncorrect ? stryMutAct_9fa48("14882") ? "" : (stryCov_9fa48("14882"), 'bg-red-500 text-white') : stryMutAct_9fa48("14883") ? "" : (stryCov_9fa48("14883"), 'bg-primary text-primary-foreground') : stryMutAct_9fa48("14884") ? "" : (stryCov_9fa48("14884"), 'bg-muted text-muted-foreground')}
                    `)}>
                      {showCorrect ? <CheckCircle2 className="h-5 w-5" /> : showIncorrect ? <XCircle className="h-5 w-5" /> : option.letra}
                    </div>
                    <span className="flex-1">{option.texto}</span>
                    {stryMutAct_9fa48("14887") ? showCorrect || <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge> : stryMutAct_9fa48("14886") ? false : stryMutAct_9fa48("14885") ? true : (stryCov_9fa48("14885", "14886", "14887"), showCorrect && <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge>)}
                  </div>
                </button>;
              }
            })}
          </div>

          {/* Explanation */}
          {stryMutAct_9fa48("14890") ? showExplanation || <div className={`
              mt-4 p-4 rounded-lg border-2
              ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'}
            `}>
              <div className="flex items-start gap-2">
                {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" /> : <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-semibold mb-2">{isCorrect ? '¡Correcto!' : 'Incorrecto'}</p>
                  <p className="text-sm text-muted-foreground">{currentQ.explicacion}</p>
                </div>
              </div>
            </div> : stryMutAct_9fa48("14889") ? false : stryMutAct_9fa48("14888") ? true : (stryCov_9fa48("14888", "14889", "14890"), showExplanation && <div className={stryMutAct_9fa48("14891") ? `` : (stryCov_9fa48("14891"), `
              mt-4 p-4 rounded-lg border-2
              ${isCorrect ? stryMutAct_9fa48("14892") ? "" : (stryCov_9fa48("14892"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : stryMutAct_9fa48("14893") ? "" : (stryCov_9fa48("14893"), 'border-orange-500 bg-orange-50 dark:bg-orange-950/20')}
            `)}>
              <div className="flex items-start gap-2">
                {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" /> : <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-semibold mb-2">{isCorrect ? stryMutAct_9fa48("14894") ? "" : (stryCov_9fa48("14894"), '¡Correcto!') : stryMutAct_9fa48("14895") ? "" : (stryCov_9fa48("14895"), 'Incorrecto')}</p>
                  <p className="text-sm text-muted-foreground">{currentQ.explicacion}</p>
                </div>
              </div>
            </div>)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={stryMutAct_9fa48("14898") ? currentQuestion !== 0 : stryMutAct_9fa48("14897") ? false : stryMutAct_9fa48("14896") ? true : (stryCov_9fa48("14896", "14897", "14898"), currentQuestion === 0)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Progreso: {answers.size} / {questions.length}
          </span>
          {stryMutAct_9fa48("14901") ? answers.size > 0 || <Badge variant="secondary">{getScore()}% correctas</Badge> : stryMutAct_9fa48("14900") ? false : stryMutAct_9fa48("14899") ? true : (stryCov_9fa48("14899", "14900", "14901"), (stryMutAct_9fa48("14904") ? answers.size <= 0 : stryMutAct_9fa48("14903") ? answers.size >= 0 : stryMutAct_9fa48("14902") ? true : (stryCov_9fa48("14902", "14903", "14904"), answers.size > 0)) && <Badge variant="secondary">{getScore()}% correctas</Badge>)}
        </div>

        {(stryMutAct_9fa48("14908") ? currentQuestion >= questions.length - 1 : stryMutAct_9fa48("14907") ? currentQuestion <= questions.length - 1 : stryMutAct_9fa48("14906") ? false : stryMutAct_9fa48("14905") ? true : (stryCov_9fa48("14905", "14906", "14907", "14908"), currentQuestion < (stryMutAct_9fa48("14909") ? questions.length + 1 : (stryCov_9fa48("14909"), questions.length - 1)))) ? <Button onClick={handleNext} disabled={stryMutAct_9fa48("14910") ? isAnswered : (stryCov_9fa48("14910"), !isAnswered)}>
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button> : <Button onClick={handleFinish} disabled={stryMutAct_9fa48("14913") ? !isAnswered && isSubmitting : stryMutAct_9fa48("14912") ? false : stryMutAct_9fa48("14911") ? true : (stryCov_9fa48("14911", "14912", "14913"), (stryMutAct_9fa48("14914") ? isAnswered : (stryCov_9fa48("14914"), !isAnswered)) || isSubmitting)}>
            {isSubmitting ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finalizando...
              </> : <>
                <Check className="h-4 w-4 mr-2" />
                Finalizar Práctica
              </>}
          </Button>}
      </div>
    </div>;
  }
}