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
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, XCircle, Loader2, ArrowRight, Check, RotateCcw } from 'lucide-react';
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
    nombre: string;
    ejeTematico: string;
  } | null;
}
export default function QuickReviewPage() {
  if (stryMutAct_9fa48("15051")) {
    {}
  } else {
    stryCov_9fa48("15051");
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>(stryMutAct_9fa48("15052") ? ["Stryker was here"] : (stryCov_9fa48("15052"), []));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(stryMutAct_9fa48("15053") ? true : (stryCov_9fa48("15053"), false));
    const [isCorrect, setIsCorrect] = useState(stryMutAct_9fa48("15054") ? true : (stryCov_9fa48("15054"), false));
    const [score, setScore] = useState(stryMutAct_9fa48("15055") ? {} : (stryCov_9fa48("15055"), {
      correct: 0,
      total: 0
    }));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("15056") ? false : (stryCov_9fa48("15056"), true));
    const [error, setError] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(stryMutAct_9fa48("15057") ? true : (stryCov_9fa48("15057"), false));
    const questionStartTimeRef = useRef<number>(Date.now());
    useEffect(() => {
      if (stryMutAct_9fa48("15058")) {
        {}
      } else {
        stryCov_9fa48("15058");
        loadQuestions();
      }
    }, stryMutAct_9fa48("15059") ? ["Stryker was here"] : (stryCov_9fa48("15059"), []));
    async function loadQuestions() {
      if (stryMutAct_9fa48("15060")) {
        {}
      } else {
        stryCov_9fa48("15060");
        try {
          if (stryMutAct_9fa48("15061")) {
            {}
          } else {
            stryCov_9fa48("15061");
            setIsLoading(stryMutAct_9fa48("15062") ? false : (stryCov_9fa48("15062"), true));
            setError(null);
            const res = await fetch(stryMutAct_9fa48("15063") ? "" : (stryCov_9fa48("15063"), '/api/review/quick?limit=10'));
            if (stryMutAct_9fa48("15066") ? false : stryMutAct_9fa48("15065") ? true : stryMutAct_9fa48("15064") ? res.ok : (stryCov_9fa48("15064", "15065", "15066"), !res.ok)) {
              if (stryMutAct_9fa48("15067")) {
                {}
              } else {
                stryCov_9fa48("15067");
                throw new Error(stryMutAct_9fa48("15068") ? "" : (stryCov_9fa48("15068"), 'Error al cargar preguntas'));
              }
            }
            const data = await res.json();
            if (stryMutAct_9fa48("15071") ? !data.questions && data.questions.length === 0 : stryMutAct_9fa48("15070") ? false : stryMutAct_9fa48("15069") ? true : (stryCov_9fa48("15069", "15070", "15071"), (stryMutAct_9fa48("15072") ? data.questions : (stryCov_9fa48("15072"), !data.questions)) || (stryMutAct_9fa48("15074") ? data.questions.length !== 0 : stryMutAct_9fa48("15073") ? false : (stryCov_9fa48("15073", "15074"), data.questions.length === 0)))) {
              if (stryMutAct_9fa48("15075")) {
                {}
              } else {
                stryCov_9fa48("15075");
                throw new Error(stryMutAct_9fa48("15076") ? "" : (stryCov_9fa48("15076"), 'No tienes preguntas falladas para repasar. ¡Excelente trabajo!'));
              }
            }
            setQuestions(data.questions);
            questionStartTimeRef.current = Date.now();
          }
        } catch (err) {
          if (stryMutAct_9fa48("15077")) {
            {}
          } else {
            stryCov_9fa48("15077");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("15078") ? "" : (stryCov_9fa48("15078"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("15079") ? "" : (stryCov_9fa48("15079"), 'Error al cargar preguntas'));
          }
        } finally {
          if (stryMutAct_9fa48("15080")) {
            {}
          } else {
            stryCov_9fa48("15080");
            setIsLoading(stryMutAct_9fa48("15081") ? true : (stryCov_9fa48("15081"), false));
          }
        }
      }
    }
    const handleOptionSelect = (optionId: string) => {
      if (stryMutAct_9fa48("15082")) {
        {}
      } else {
        stryCov_9fa48("15082");
        if (stryMutAct_9fa48("15084") ? false : stryMutAct_9fa48("15083") ? true : (stryCov_9fa48("15083", "15084"), showExplanation)) return;
        const currentQ = questions[currentQuestion];
        const selectedOptionData = currentQ.options.find(stryMutAct_9fa48("15085") ? () => undefined : (stryCov_9fa48("15085"), opt => stryMutAct_9fa48("15088") ? opt.id !== optionId : stryMutAct_9fa48("15087") ? false : stryMutAct_9fa48("15086") ? true : (stryCov_9fa48("15086", "15087", "15088"), opt.id === optionId)));
        const correct = stryMutAct_9fa48("15091") ? selectedOptionData?.esCorrecta && false : stryMutAct_9fa48("15090") ? false : stryMutAct_9fa48("15089") ? true : (stryCov_9fa48("15089", "15090", "15091"), (stryMutAct_9fa48("15092") ? selectedOptionData.esCorrecta : (stryCov_9fa48("15092"), selectedOptionData?.esCorrecta)) || (stryMutAct_9fa48("15093") ? true : (stryCov_9fa48("15093"), false)));
        setSelectedOption(optionId);
        setIsCorrect(correct);
        setShowExplanation(stryMutAct_9fa48("15094") ? false : (stryCov_9fa48("15094"), true));
        setScore(stryMutAct_9fa48("15095") ? () => undefined : (stryCov_9fa48("15095"), prev => stryMutAct_9fa48("15096") ? {} : (stryCov_9fa48("15096"), {
          correct: stryMutAct_9fa48("15097") ? prev.correct - (correct ? 1 : 0) : (stryCov_9fa48("15097"), prev.correct + (correct ? 1 : 0)),
          total: stryMutAct_9fa48("15098") ? prev.total - 1 : (stryCov_9fa48("15098"), prev.total + 1)
        })));
        if (stryMutAct_9fa48("15100") ? false : stryMutAct_9fa48("15099") ? true : (stryCov_9fa48("15099", "15100"), correct)) {
          if (stryMutAct_9fa48("15101")) {
            {}
          } else {
            stryCov_9fa48("15101");
            toast.success(stryMutAct_9fa48("15102") ? "" : (stryCov_9fa48("15102"), '¡Correcto!'), stryMutAct_9fa48("15103") ? {} : (stryCov_9fa48("15103"), {
              duration: 2000
            }));
          }
        } else {
          if (stryMutAct_9fa48("15104")) {
            {}
          } else {
            stryCov_9fa48("15104");
            toast.error(stryMutAct_9fa48("15105") ? "" : (stryCov_9fa48("15105"), 'Incorrecto'), stryMutAct_9fa48("15106") ? {} : (stryCov_9fa48("15106"), {
              duration: 2000
            }));
          }
        }
      }
    };
    const handleNext = () => {
      if (stryMutAct_9fa48("15107")) {
        {}
      } else {
        stryCov_9fa48("15107");
        if (stryMutAct_9fa48("15111") ? currentQuestion >= questions.length - 1 : stryMutAct_9fa48("15110") ? currentQuestion <= questions.length - 1 : stryMutAct_9fa48("15109") ? false : stryMutAct_9fa48("15108") ? true : (stryCov_9fa48("15108", "15109", "15110", "15111"), currentQuestion < (stryMutAct_9fa48("15112") ? questions.length + 1 : (stryCov_9fa48("15112"), questions.length - 1)))) {
          if (stryMutAct_9fa48("15113")) {
            {}
          } else {
            stryCov_9fa48("15113");
            setCurrentQuestion(stryMutAct_9fa48("15114") ? () => undefined : (stryCov_9fa48("15114"), prev => stryMutAct_9fa48("15115") ? prev - 1 : (stryCov_9fa48("15115"), prev + 1)));
            setSelectedOption(null);
            setShowExplanation(stryMutAct_9fa48("15116") ? true : (stryCov_9fa48("15116"), false));
            setIsCorrect(stryMutAct_9fa48("15117") ? true : (stryCov_9fa48("15117"), false));
            questionStartTimeRef.current = Date.now();
          }
        } else {
          if (stryMutAct_9fa48("15118")) {
            {}
          } else {
            stryCov_9fa48("15118");
            setIsFinished(stryMutAct_9fa48("15119") ? false : (stryCov_9fa48("15119"), true));
          }
        }
      }
    };
    const handleRestart = () => {
      if (stryMutAct_9fa48("15120")) {
        {}
      } else {
        stryCov_9fa48("15120");
        setCurrentQuestion(0);
        setSelectedOption(null);
        setShowExplanation(stryMutAct_9fa48("15121") ? true : (stryCov_9fa48("15121"), false));
        setIsCorrect(stryMutAct_9fa48("15122") ? true : (stryCov_9fa48("15122"), false));
        setScore(stryMutAct_9fa48("15123") ? {} : (stryCov_9fa48("15123"), {
          correct: 0,
          total: 0
        }));
        setIsFinished(stryMutAct_9fa48("15124") ? true : (stryCov_9fa48("15124"), false));
        questionStartTimeRef.current = Date.now();
        // Aleatorizar orden de preguntas
        setQuestions(stryMutAct_9fa48("15125") ? () => undefined : (stryCov_9fa48("15125"), prev => stryMutAct_9fa48("15126") ? [...prev] : (stryCov_9fa48("15126"), (stryMutAct_9fa48("15127") ? [] : (stryCov_9fa48("15127"), [...prev])).sort(stryMutAct_9fa48("15128") ? () => undefined : (stryCov_9fa48("15128"), () => stryMutAct_9fa48("15129") ? Math.random() + 0.5 : (stryCov_9fa48("15129"), Math.random() - 0.5))))));
      }
    };
    const getProgress = () => {
      if (stryMutAct_9fa48("15130")) {
        {}
      } else {
        stryCov_9fa48("15130");
        if (stryMutAct_9fa48("15133") ? questions.length !== 0 : stryMutAct_9fa48("15132") ? false : stryMutAct_9fa48("15131") ? true : (stryCov_9fa48("15131", "15132", "15133"), questions.length === 0)) return 0;
        return stryMutAct_9fa48("15134") ? (currentQuestion + 1) / questions.length / 100 : (stryCov_9fa48("15134"), (stryMutAct_9fa48("15135") ? (currentQuestion + 1) * questions.length : (stryCov_9fa48("15135"), (stryMutAct_9fa48("15136") ? currentQuestion - 1 : (stryCov_9fa48("15136"), currentQuestion + 1)) / questions.length)) * 100);
      }
    };
    const getScorePercentage = () => {
      if (stryMutAct_9fa48("15137")) {
        {}
      } else {
        stryCov_9fa48("15137");
        if (stryMutAct_9fa48("15140") ? score.total !== 0 : stryMutAct_9fa48("15139") ? false : stryMutAct_9fa48("15138") ? true : (stryCov_9fa48("15138", "15139", "15140"), score.total === 0)) return 0;
        return Math.round(stryMutAct_9fa48("15141") ? score.correct / score.total / 100 : (stryCov_9fa48("15141"), (stryMutAct_9fa48("15142") ? score.correct * score.total : (stryCov_9fa48("15142"), score.correct / score.total)) * 100));
      }
    };
    if (stryMutAct_9fa48("15144") ? false : stryMutAct_9fa48("15143") ? true : (stryCov_9fa48("15143", "15144"), isLoading)) {
      if (stryMutAct_9fa48("15145")) {
        {}
      } else {
        stryCov_9fa48("15145");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando preguntas para repaso rápido...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("15148") ? error && questions.length === 0 : stryMutAct_9fa48("15147") ? false : stryMutAct_9fa48("15146") ? true : (stryCov_9fa48("15146", "15147", "15148"), error || (stryMutAct_9fa48("15150") ? questions.length !== 0 : stryMutAct_9fa48("15149") ? false : (stryCov_9fa48("15149", "15150"), questions.length === 0)))) {
      if (stryMutAct_9fa48("15151")) {
        {}
      } else {
        stryCov_9fa48("15151");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              {error ? stryMutAct_9fa48("15152") ? "" : (stryCov_9fa48("15152"), 'Error') : stryMutAct_9fa48("15153") ? "" : (stryCov_9fa48("15153"), 'Sin preguntas')}
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("15156") ? error && 'No hay preguntas falladas para repasar' : stryMutAct_9fa48("15155") ? false : stryMutAct_9fa48("15154") ? true : (stryCov_9fa48("15154", "15155", "15156"), error || (stryMutAct_9fa48("15157") ? "" : (stryCov_9fa48("15157"), 'No hay preguntas falladas para repasar')))}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={stryMutAct_9fa48("15158") ? () => undefined : (stryCov_9fa48("15158"), () => router.push(stryMutAct_9fa48("15159") ? "" : (stryCov_9fa48("15159"), '/dashboard')))} className="w-full">
              Volver al Dashboard
            </Button>
            {stryMutAct_9fa48("15162") ? !error || <Button variant="outline" onClick={() => router.push('/practice')} className="w-full">
                Ir a Práctica
              </Button> : stryMutAct_9fa48("15161") ? false : stryMutAct_9fa48("15160") ? true : (stryCov_9fa48("15160", "15161", "15162"), (stryMutAct_9fa48("15163") ? error : (stryCov_9fa48("15163"), !error)) && <Button variant="outline" onClick={stryMutAct_9fa48("15164") ? () => undefined : (stryCov_9fa48("15164"), () => router.push(stryMutAct_9fa48("15165") ? "" : (stryCov_9fa48("15165"), '/practice')))} className="w-full">
                Ir a Práctica
              </Button>)}
          </CardContent>
        </Card>
      </div>;
      }
    }
    if (stryMutAct_9fa48("15167") ? false : stryMutAct_9fa48("15166") ? true : (stryCov_9fa48("15166", "15167"), isFinished)) {
      if (stryMutAct_9fa48("15168")) {
        {}
      } else {
        stryCov_9fa48("15168");
        return <div className="container mx-auto p-6 max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Repaso Completado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{getScorePercentage()}%</div>
              <p className="text-muted-foreground">
                {score.correct} de {score.total} preguntas correctas
              </p>
            </div>
            <Progress value={getScorePercentage()} className="h-3" />
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button onClick={handleRestart} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Repetir
              </Button>
              <Button onClick={stryMutAct_9fa48("15169") ? () => undefined : (stryCov_9fa48("15169"), () => router.push(stryMutAct_9fa48("15170") ? "" : (stryCov_9fa48("15170"), '/dashboard')))}>Volver al Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const currentQ = questions[currentQuestion];
    const correctOption = currentQ.options.find(stryMutAct_9fa48("15171") ? () => undefined : (stryCov_9fa48("15171"), opt => opt.esCorrecta));
    return <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <RotateCcw className="h-6 w-6" />
                Repaso Rápido
              </h1>
              <HelpIcon content="Este repaso rápido muestra preguntas que has fallado anteriormente. Es ideal para reforzar conceptos difíciles. Recibirás feedback inmediato después de cada respuesta." side="right" />
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Preguntas que has fallado anteriormente
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {stryMutAct_9fa48("15172") ? currentQuestion - 1 : (stryCov_9fa48("15172"), currentQuestion + 1)} / {questions.length}
            </Badge>
            {stryMutAct_9fa48("15175") ? score.total > 0 || <Badge variant={getScorePercentage() >= 70 ? 'default' : 'destructive'}>
                {getScorePercentage()}%
              </Badge> : stryMutAct_9fa48("15174") ? false : stryMutAct_9fa48("15173") ? true : (stryCov_9fa48("15173", "15174", "15175"), (stryMutAct_9fa48("15178") ? score.total <= 0 : stryMutAct_9fa48("15177") ? score.total >= 0 : stryMutAct_9fa48("15176") ? true : (stryCov_9fa48("15176", "15177", "15178"), score.total > 0)) && <Badge variant={(stryMutAct_9fa48("15182") ? getScorePercentage() < 70 : stryMutAct_9fa48("15181") ? getScorePercentage() > 70 : stryMutAct_9fa48("15180") ? false : stryMutAct_9fa48("15179") ? true : (stryCov_9fa48("15179", "15180", "15181", "15182"), getScorePercentage() >= 70)) ? stryMutAct_9fa48("15183") ? "" : (stryCov_9fa48("15183"), 'default') : stryMutAct_9fa48("15184") ? "" : (stryCov_9fa48("15184"), 'destructive')}>
                {getScorePercentage()}%
              </Badge>)}
          </div>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{currentQ.subject.nombre}</Badge>
                {stryMutAct_9fa48("15187") ? currentQ.topic || <Badge variant="secondary">{currentQ.topic.nombre}</Badge> : stryMutAct_9fa48("15186") ? false : stryMutAct_9fa48("15185") ? true : (stryCov_9fa48("15185", "15186", "15187"), currentQ.topic && <Badge variant="secondary">{currentQ.topic.nombre}</Badge>)}
                <Badge variant="outline" className="text-xs">
                  Dificultad: {currentQ.dificultad}/5
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2">{currentQ.enunciado}</CardTitle>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <BookmarkButton questionId={currentQ.id} size="sm" />
              <CreateFlashcardButton questionId={currentQ.id} defaultFront={currentQ.enunciado} defaultBack={currentQ.explicacion} size="sm" />
              <CreateNoteButton questionId={currentQ.id} defaultTitle={stryMutAct_9fa48("15188") ? `` : (stryCov_9fa48("15188"), `Nota: ${stryMutAct_9fa48("15189") ? currentQ.enunciado : (stryCov_9fa48("15189"), currentQ.enunciado.substring(0, 50))}...`)} defaultContent={currentQ.explicacion} size="sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQ.options.map(option => {
              if (stryMutAct_9fa48("15190")) {
                {}
              } else {
                stryCov_9fa48("15190");
                const isSelected = stryMutAct_9fa48("15193") ? selectedOption !== option.id : stryMutAct_9fa48("15192") ? false : stryMutAct_9fa48("15191") ? true : (stryCov_9fa48("15191", "15192", "15193"), selectedOption === option.id);
                const showCorrect = stryMutAct_9fa48("15196") ? showExplanation || option.esCorrecta : stryMutAct_9fa48("15195") ? false : stryMutAct_9fa48("15194") ? true : (stryCov_9fa48("15194", "15195", "15196"), showExplanation && option.esCorrecta);
                const showIncorrect = stryMutAct_9fa48("15199") ? showExplanation && isSelected || !option.esCorrecta : stryMutAct_9fa48("15198") ? false : stryMutAct_9fa48("15197") ? true : (stryCov_9fa48("15197", "15198", "15199"), (stryMutAct_9fa48("15201") ? showExplanation || isSelected : stryMutAct_9fa48("15200") ? true : (stryCov_9fa48("15200", "15201"), showExplanation && isSelected)) && (stryMutAct_9fa48("15202") ? option.esCorrecta : (stryCov_9fa48("15202"), !option.esCorrecta)));
                return <button key={option.id} onClick={stryMutAct_9fa48("15203") ? () => undefined : (stryCov_9fa48("15203"), () => handleOptionSelect(option.id))} disabled={showExplanation} className={stryMutAct_9fa48("15204") ? `` : (stryCov_9fa48("15204"), `
                    w-full p-4 text-left rounded-lg border-2 transition-all
                    ${isSelected ? showCorrect ? stryMutAct_9fa48("15205") ? "" : (stryCov_9fa48("15205"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : showIncorrect ? stryMutAct_9fa48("15206") ? "" : (stryCov_9fa48("15206"), 'border-red-500 bg-red-50 dark:bg-red-950/20') : stryMutAct_9fa48("15207") ? "" : (stryCov_9fa48("15207"), 'border-primary bg-primary/5') : stryMutAct_9fa48("15208") ? "" : (stryCov_9fa48("15208"), 'border-border hover:border-primary/50')}
                    ${showExplanation ? stryMutAct_9fa48("15209") ? "" : (stryCov_9fa48("15209"), 'cursor-default') : stryMutAct_9fa48("15210") ? "" : (stryCov_9fa48("15210"), 'cursor-pointer hover:bg-accent')}
                  `)}>
                  <div className="flex items-center gap-3">
                    <div className={stryMutAct_9fa48("15211") ? `` : (stryCov_9fa48("15211"), `
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${isSelected ? showCorrect ? stryMutAct_9fa48("15212") ? "" : (stryCov_9fa48("15212"), 'bg-green-500 text-white') : showIncorrect ? stryMutAct_9fa48("15213") ? "" : (stryCov_9fa48("15213"), 'bg-red-500 text-white') : stryMutAct_9fa48("15214") ? "" : (stryCov_9fa48("15214"), 'bg-primary text-primary-foreground') : stryMutAct_9fa48("15215") ? "" : (stryCov_9fa48("15215"), 'bg-muted text-muted-foreground')}
                    `)}>
                      {showCorrect ? <CheckCircle2 className="h-5 w-5" /> : showIncorrect ? <XCircle className="h-5 w-5" /> : option.letra}
                    </div>
                    <span className="flex-1">{option.texto}</span>
                    {stryMutAct_9fa48("15218") ? showCorrect || <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge> : stryMutAct_9fa48("15217") ? false : stryMutAct_9fa48("15216") ? true : (stryCov_9fa48("15216", "15217", "15218"), showCorrect && <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge>)}
                  </div>
                </button>;
              }
            })}
          </div>

          {/* Explanation */}
          {stryMutAct_9fa48("15221") ? showExplanation || <div className={`
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
            </div> : stryMutAct_9fa48("15220") ? false : stryMutAct_9fa48("15219") ? true : (stryCov_9fa48("15219", "15220", "15221"), showExplanation && <div className={stryMutAct_9fa48("15222") ? `` : (stryCov_9fa48("15222"), `
              mt-4 p-4 rounded-lg border-2
              ${isCorrect ? stryMutAct_9fa48("15223") ? "" : (stryCov_9fa48("15223"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : stryMutAct_9fa48("15224") ? "" : (stryCov_9fa48("15224"), 'border-orange-500 bg-orange-50 dark:bg-orange-950/20')}
            `)}>
              <div className="flex items-start gap-2">
                {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" /> : <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-semibold mb-2">{isCorrect ? stryMutAct_9fa48("15225") ? "" : (stryCov_9fa48("15225"), '¡Correcto!') : stryMutAct_9fa48("15226") ? "" : (stryCov_9fa48("15226"), 'Incorrecto')}</p>
                  <p className="text-sm text-muted-foreground">{currentQ.explicacion}</p>
                </div>
              </div>
            </div>)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-end">
        <Button onClick={handleNext} disabled={stryMutAct_9fa48("15227") ? showExplanation : (stryCov_9fa48("15227"), !showExplanation)} size="lg">
          {(stryMutAct_9fa48("15231") ? currentQuestion >= questions.length - 1 : stryMutAct_9fa48("15230") ? currentQuestion <= questions.length - 1 : stryMutAct_9fa48("15229") ? false : stryMutAct_9fa48("15228") ? true : (stryCov_9fa48("15228", "15229", "15230", "15231"), currentQuestion < (stryMutAct_9fa48("15232") ? questions.length + 1 : (stryCov_9fa48("15232"), questions.length - 1)))) ? <>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </> : <>
              <Check className="h-4 w-4 mr-2" />
              Finalizar
            </>}
        </Button>
      </div>
    </div>;
  }
}