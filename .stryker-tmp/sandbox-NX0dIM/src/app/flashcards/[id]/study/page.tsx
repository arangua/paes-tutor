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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RotateCcw, ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  reviewCount: number;
  nextReview: string;
  question?: {
    subject: {
      nombre: string;
    };
  } | null;
}
export default function StudyFlashcardPage() {
  if (stryMutAct_9fa48("13753")) {
    {}
  } else {
    stryCov_9fa48("13753");
    const params = useParams();
    const router = useRouter();
    const flashcardId = params.id as string;
    const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
    const [isFlipped, setIsFlipped] = useState(stryMutAct_9fa48("13754") ? true : (stryCov_9fa48("13754"), false));
    const [loading, setLoading] = useState(stryMutAct_9fa48("13755") ? false : (stryCov_9fa48("13755"), true));
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("13756") ? true : (stryCov_9fa48("13756"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("13757")) {
        {}
      } else {
        stryCov_9fa48("13757");
        loadFlashcard();
      }
    }, stryMutAct_9fa48("13758") ? [] : (stryCov_9fa48("13758"), [flashcardId]));
    async function loadFlashcard() {
      if (stryMutAct_9fa48("13759")) {
        {}
      } else {
        stryCov_9fa48("13759");
        try {
          if (stryMutAct_9fa48("13760")) {
            {}
          } else {
            stryCov_9fa48("13760");
            setLoading(stryMutAct_9fa48("13761") ? false : (stryCov_9fa48("13761"), true));
            const res = await fetch(stryMutAct_9fa48("13762") ? "" : (stryCov_9fa48("13762"), '/api/flashcards'));
            if (stryMutAct_9fa48("13765") ? false : stryMutAct_9fa48("13764") ? true : stryMutAct_9fa48("13763") ? res.ok : (stryCov_9fa48("13763", "13764", "13765"), !res.ok)) {
              if (stryMutAct_9fa48("13766")) {
                {}
              } else {
                stryCov_9fa48("13766");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("13767") ? "" : (stryCov_9fa48("13767"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                }>(res, stryMutAct_9fa48("13768") ? {} : (stryCov_9fa48("13768"), {
                  path: (stryMutAct_9fa48("13771") ? typeof window === 'undefined' : stryMutAct_9fa48("13770") ? false : stryMutAct_9fa48("13769") ? true : (stryCov_9fa48("13769", "13770", "13771"), typeof window !== (stryMutAct_9fa48("13772") ? "" : (stryCov_9fa48("13772"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("13773") ? "" : (stryCov_9fa48("13773"), '/flashcards/[id]/study'),
                  operation: stryMutAct_9fa48("13774") ? "" : (stryCov_9fa48("13774"), 'cargar flashcard')
                }));
                throw new Error(stryMutAct_9fa48("13777") ? errorData.error && 'Error al cargar flashcard' : stryMutAct_9fa48("13776") ? false : stryMutAct_9fa48("13775") ? true : (stryCov_9fa48("13775", "13776", "13777"), errorData.error || (stryMutAct_9fa48("13778") ? "" : (stryCov_9fa48("13778"), 'Error al cargar flashcard'))));
              }
            }
            const data = await res.json();
            const found = stryMutAct_9fa48("13779") ? data.flashcards.find((f: Flashcard) => f.id === flashcardId) : (stryCov_9fa48("13779"), data.flashcards?.find(stryMutAct_9fa48("13780") ? () => undefined : (stryCov_9fa48("13780"), (f: Flashcard) => stryMutAct_9fa48("13783") ? f.id !== flashcardId : stryMutAct_9fa48("13782") ? false : stryMutAct_9fa48("13781") ? true : (stryCov_9fa48("13781", "13782", "13783"), f.id === flashcardId))));
            if (stryMutAct_9fa48("13786") ? false : stryMutAct_9fa48("13785") ? true : stryMutAct_9fa48("13784") ? found : (stryCov_9fa48("13784", "13785", "13786"), !found)) {
              if (stryMutAct_9fa48("13787")) {
                {}
              } else {
                stryCov_9fa48("13787");
                throw new Error(stryMutAct_9fa48("13788") ? "" : (stryCov_9fa48("13788"), 'Flashcard no encontrada'));
              }
            }
            setFlashcard(found);
          }
        } catch (err) {
          if (stryMutAct_9fa48("13789")) {
            {}
          } else {
            stryCov_9fa48("13789");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("13790") ? "" : (stryCov_9fa48("13790"), 'Error desconocido');
            setError(errorMessage);
            toast.error(stryMutAct_9fa48("13791") ? "" : (stryCov_9fa48("13791"), 'Error al cargar flashcard'), stryMutAct_9fa48("13792") ? {} : (stryCov_9fa48("13792"), {
              description: errorMessage
            }));
          }
        } finally {
          if (stryMutAct_9fa48("13793")) {
            {}
          } else {
            stryCov_9fa48("13793");
            setLoading(stryMutAct_9fa48("13794") ? true : (stryCov_9fa48("13794"), false));
          }
        }
      }
    }
    const handleReview = async (isCorrect: boolean, difficulty: 'easy' | 'medium' | 'hard' = stryMutAct_9fa48("13795") ? "" : (stryCov_9fa48("13795"), 'medium')) => {
      if (stryMutAct_9fa48("13796")) {
        {}
      } else {
        stryCov_9fa48("13796");
        if (stryMutAct_9fa48("13799") ? !flashcard && isSubmitting : stryMutAct_9fa48("13798") ? false : stryMutAct_9fa48("13797") ? true : (stryCov_9fa48("13797", "13798", "13799"), (stryMutAct_9fa48("13800") ? flashcard : (stryCov_9fa48("13800"), !flashcard)) || isSubmitting)) return;
        setIsSubmitting(stryMutAct_9fa48("13801") ? false : (stryCov_9fa48("13801"), true));
        try {
          if (stryMutAct_9fa48("13802")) {
            {}
          } else {
            stryCov_9fa48("13802");
            const res = await fetch(stryMutAct_9fa48("13803") ? "" : (stryCov_9fa48("13803"), '/api/flashcards'), stryMutAct_9fa48("13804") ? {} : (stryCov_9fa48("13804"), {
              method: stryMutAct_9fa48("13805") ? "" : (stryCov_9fa48("13805"), 'PUT'),
              headers: stryMutAct_9fa48("13806") ? {} : (stryCov_9fa48("13806"), {
                'Content-Type': stryMutAct_9fa48("13807") ? "" : (stryCov_9fa48("13807"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("13808") ? {} : (stryCov_9fa48("13808"), {
                flashcardId: flashcard.id,
                isCorrect,
                difficulty
              }))
            }));
            if (stryMutAct_9fa48("13811") ? false : stryMutAct_9fa48("13810") ? true : stryMutAct_9fa48("13809") ? res.ok : (stryCov_9fa48("13809", "13810", "13811"), !res.ok)) {
              if (stryMutAct_9fa48("13812")) {
                {}
              } else {
                stryCov_9fa48("13812");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("13813") ? "" : (stryCov_9fa48("13813"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                }>(res, stryMutAct_9fa48("13814") ? {} : (stryCov_9fa48("13814"), {
                  path: (stryMutAct_9fa48("13817") ? typeof window === 'undefined' : stryMutAct_9fa48("13816") ? false : stryMutAct_9fa48("13815") ? true : (stryCov_9fa48("13815", "13816", "13817"), typeof window !== (stryMutAct_9fa48("13818") ? "" : (stryCov_9fa48("13818"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("13819") ? "" : (stryCov_9fa48("13819"), '/flashcards/[id]/study'),
                  operation: stryMutAct_9fa48("13820") ? "" : (stryCov_9fa48("13820"), 'guardar repaso de flashcard')
                }));
                throw new Error(stryMutAct_9fa48("13823") ? errorData.error && 'Error al guardar repaso' : stryMutAct_9fa48("13822") ? false : stryMutAct_9fa48("13821") ? true : (stryCov_9fa48("13821", "13822", "13823"), errorData.error || (stryMutAct_9fa48("13824") ? "" : (stryCov_9fa48("13824"), 'Error al guardar repaso'))));
              }
            }
            toast.success(isCorrect ? stryMutAct_9fa48("13825") ? "" : (stryCov_9fa48("13825"), '¡Correcto! Continuemos') : stryMutAct_9fa48("13826") ? "" : (stryCov_9fa48("13826"), 'No te preocupes, seguimos practicando'));

            // Volver a la lista o cargar siguiente
            router.push(stryMutAct_9fa48("13827") ? "" : (stryCov_9fa48("13827"), '/flashcards'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("13828")) {
            {}
          } else {
            stryCov_9fa48("13828");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("13829") ? "" : (stryCov_9fa48("13829"), 'Error desconocido');
            toast.error(stryMutAct_9fa48("13830") ? "" : (stryCov_9fa48("13830"), 'Error al guardar repaso'), stryMutAct_9fa48("13831") ? {} : (stryCov_9fa48("13831"), {
              description: errorMessage
            }));
          }
        } finally {
          if (stryMutAct_9fa48("13832")) {
            {}
          } else {
            stryCov_9fa48("13832");
            setIsSubmitting(stryMutAct_9fa48("13833") ? true : (stryCov_9fa48("13833"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("13835") ? false : stryMutAct_9fa48("13834") ? true : (stryCov_9fa48("13834", "13835"), loading)) {
      if (stryMutAct_9fa48("13836")) {
        {}
      } else {
        stryCov_9fa48("13836");
        return <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
      }
    }
    if (stryMutAct_9fa48("13839") ? error && !flashcard : stryMutAct_9fa48("13838") ? false : stryMutAct_9fa48("13837") ? true : (stryCov_9fa48("13837", "13838", "13839"), error || (stryMutAct_9fa48("13840") ? flashcard : (stryCov_9fa48("13840"), !flashcard)))) {
      if (stryMutAct_9fa48("13841")) {
        {}
      } else {
        stryCov_9fa48("13841");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{stryMutAct_9fa48("13844") ? error && 'Flashcard no encontrada' : stryMutAct_9fa48("13843") ? false : stryMutAct_9fa48("13842") ? true : (stryCov_9fa48("13842", "13843", "13844"), error || (stryMutAct_9fa48("13845") ? "" : (stryCov_9fa48("13845"), 'Flashcard no encontrada')))}</p>
            <Button onClick={stryMutAct_9fa48("13846") ? () => undefined : (stryCov_9fa48("13846"), () => router.push(stryMutAct_9fa48("13847") ? "" : (stryCov_9fa48("13847"), '/flashcards')))}>Volver a Flashcards</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={stryMutAct_9fa48("13848") ? () => undefined : (stryCov_9fa48("13848"), () => router.push(stryMutAct_9fa48("13849") ? "" : (stryCov_9fa48("13849"), '/flashcards')))} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        {stryMutAct_9fa48("13852") ? flashcard.question || <Badge variant="outline" className="mb-2">
            {flashcard.question.subject.nombre}
          </Badge> : stryMutAct_9fa48("13851") ? false : stryMutAct_9fa48("13850") ? true : (stryCov_9fa48("13850", "13851", "13852"), flashcard.question && <Badge variant="outline" className="mb-2">
            {flashcard.question.subject.nombre}
          </Badge>)}
      </div>

      <Card className={stryMutAct_9fa48("13853") ? `` : (stryCov_9fa48("13853"), `
          min-h-[400px] cursor-pointer transition-all
          ${isFlipped ? stryMutAct_9fa48("13854") ? "" : (stryCov_9fa48("13854"), 'bg-primary/5') : stryMutAct_9fa48("13855") ? "Stryker was here!" : (stryCov_9fa48("13855"), '')}
        `)} onClick={stryMutAct_9fa48("13856") ? () => undefined : (stryCov_9fa48("13856"), () => setIsFlipped(stryMutAct_9fa48("13857") ? isFlipped : (stryCov_9fa48("13857"), !isFlipped)))}>
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 w-full">
            {(stryMutAct_9fa48("13858") ? isFlipped : (stryCov_9fa48("13858"), !isFlipped)) ? <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Anverso - Haz clic para voltear
                  </span>
                </div>
                <p className="text-2xl font-semibold leading-relaxed">{flashcard.front}</p>
              </> : <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Reverso - Haz clic para voltear
                  </span>
                </div>
                <p className="text-xl leading-relaxed text-muted-foreground">{flashcard.back}</p>
              </>}
          </div>
        </CardContent>
      </Card>

      {stryMutAct_9fa48("13861") ? isFlipped || <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-center mb-4">¿Qué tan bien recordaste esto?</p>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="destructive" onClick={() => handleReview(false, 'hard')} disabled={isSubmitting} className="flex flex-col h-auto py-4">
              <XCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Difícil</span>
            </Button>
            <Button variant="secondary" onClick={() => handleReview(true, 'medium')} disabled={isSubmitting} className="flex flex-col h-auto py-4">
              <RotateCcw className="h-5 w-5 mb-1" />
              <span className="text-xs">Bien</span>
            </Button>
            <Button variant="default" onClick={() => handleReview(true, 'easy')} disabled={isSubmitting} className="flex flex-col h-auto py-4">
              <CheckCircle2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Fácil</span>
            </Button>
          </div>
        </div> : stryMutAct_9fa48("13860") ? false : stryMutAct_9fa48("13859") ? true : (stryCov_9fa48("13859", "13860", "13861"), isFlipped && <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-center mb-4">¿Qué tan bien recordaste esto?</p>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="destructive" onClick={stryMutAct_9fa48("13862") ? () => undefined : (stryCov_9fa48("13862"), () => handleReview(stryMutAct_9fa48("13863") ? true : (stryCov_9fa48("13863"), false), stryMutAct_9fa48("13864") ? "" : (stryCov_9fa48("13864"), 'hard')))} disabled={isSubmitting} className="flex flex-col h-auto py-4">
              <XCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Difícil</span>
            </Button>
            <Button variant="secondary" onClick={stryMutAct_9fa48("13865") ? () => undefined : (stryCov_9fa48("13865"), () => handleReview(stryMutAct_9fa48("13866") ? false : (stryCov_9fa48("13866"), true), stryMutAct_9fa48("13867") ? "" : (stryCov_9fa48("13867"), 'medium')))} disabled={isSubmitting} className="flex flex-col h-auto py-4">
              <RotateCcw className="h-5 w-5 mb-1" />
              <span className="text-xs">Bien</span>
            </Button>
            <Button variant="default" onClick={stryMutAct_9fa48("13868") ? () => undefined : (stryCov_9fa48("13868"), () => handleReview(stryMutAct_9fa48("13869") ? false : (stryCov_9fa48("13869"), true), stryMutAct_9fa48("13870") ? "" : (stryCov_9fa48("13870"), 'easy')))} disabled={isSubmitting} className="flex flex-col h-auto py-4">
              <CheckCircle2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Fácil</span>
            </Button>
          </div>
        </div>)}

      {stryMutAct_9fa48("13873") ? !isFlipped || <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setIsFlipped(true)} className="w-full">
            Mostrar Respuesta
          </Button>
        </div> : stryMutAct_9fa48("13872") ? false : stryMutAct_9fa48("13871") ? true : (stryCov_9fa48("13871", "13872", "13873"), (stryMutAct_9fa48("13874") ? isFlipped : (stryCov_9fa48("13874"), !isFlipped)) && <div className="mt-6 text-center">
          <Button variant="outline" onClick={stryMutAct_9fa48("13875") ? () => undefined : (stryCov_9fa48("13875"), () => setIsFlipped(stryMutAct_9fa48("13876") ? false : (stryCov_9fa48("13876"), true)))} className="w-full">
            Mostrar Respuesta
          </Button>
        </div>)}
    </div>;
  }
}