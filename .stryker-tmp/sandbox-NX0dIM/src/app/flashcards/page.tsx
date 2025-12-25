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
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookOpen, RotateCcw, Trash2, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button';
import { HelpIcon } from '@/components/help/help-icon';
import { Skeleton } from '@/components/ui/skeleton';
interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  reviewCount: number;
  nextReview: string;
  lastReview: string;
  question?: {
    subject: {
      nombre: string;
    };
    topic: {
      nombre: string;
    } | null;
  } | null;
}
export default function FlashcardsPage() {
  if (stryMutAct_9fa48("13667")) {
    {}
  } else {
    stryCov_9fa48("13667");
    const router = useRouter();
    const [flashcards, setFlashcards] = useState<Flashcard[]>(stryMutAct_9fa48("13668") ? ["Stryker was here"] : (stryCov_9fa48("13668"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("13669") ? false : (stryCov_9fa48("13669"), true));
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'due'>(stryMutAct_9fa48("13670") ? "" : (stryCov_9fa48("13670"), 'all'));
    useEffect(() => {
      if (stryMutAct_9fa48("13671")) {
        {}
      } else {
        stryCov_9fa48("13671");
        loadFlashcards();
      }
    }, stryMutAct_9fa48("13672") ? [] : (stryCov_9fa48("13672"), [activeTab]));
    async function loadFlashcards() {
      if (stryMutAct_9fa48("13673")) {
        {}
      } else {
        stryCov_9fa48("13673");
        try {
          if (stryMutAct_9fa48("13674")) {
            {}
          } else {
            stryCov_9fa48("13674");
            setLoading(stryMutAct_9fa48("13675") ? false : (stryCov_9fa48("13675"), true));
            const res = await fetch(stryMutAct_9fa48("13676") ? `` : (stryCov_9fa48("13676"), `/api/flashcards?dueOnly=${stryMutAct_9fa48("13679") ? activeTab !== 'due' : stryMutAct_9fa48("13678") ? false : stryMutAct_9fa48("13677") ? true : (stryCov_9fa48("13677", "13678", "13679"), activeTab === (stryMutAct_9fa48("13680") ? "" : (stryCov_9fa48("13680"), 'due')))}`));
            if (stryMutAct_9fa48("13683") ? false : stryMutAct_9fa48("13682") ? true : stryMutAct_9fa48("13681") ? res.ok : (stryCov_9fa48("13681", "13682", "13683"), !res.ok)) throw new Error(stryMutAct_9fa48("13684") ? "" : (stryCov_9fa48("13684"), 'Error al cargar flashcards'));
            const data = await res.json();
            setFlashcards(stryMutAct_9fa48("13687") ? data.flashcards && [] : stryMutAct_9fa48("13686") ? false : stryMutAct_9fa48("13685") ? true : (stryCov_9fa48("13685", "13686", "13687"), data.flashcards || (stryMutAct_9fa48("13688") ? ["Stryker was here"] : (stryCov_9fa48("13688"), []))));
          }
        } catch (err) {
          if (stryMutAct_9fa48("13689")) {
            {}
          } else {
            stryCov_9fa48("13689");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("13690") ? "" : (stryCov_9fa48("13690"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("13691") ? "" : (stryCov_9fa48("13691"), 'Error al cargar flashcards'));
          }
        } finally {
          if (stryMutAct_9fa48("13692")) {
            {}
          } else {
            stryCov_9fa48("13692");
            setLoading(stryMutAct_9fa48("13693") ? true : (stryCov_9fa48("13693"), false));
          }
        }
      }
    }
    const handleDelete = async (flashcardId: string) => {
      if (stryMutAct_9fa48("13694")) {
        {}
      } else {
        stryCov_9fa48("13694");
        if (stryMutAct_9fa48("13697") ? false : stryMutAct_9fa48("13696") ? true : stryMutAct_9fa48("13695") ? confirm('¿Estás seguro de que quieres eliminar esta flashcard?') : (stryCov_9fa48("13695", "13696", "13697"), !confirm(stryMutAct_9fa48("13698") ? "" : (stryCov_9fa48("13698"), '¿Estás seguro de que quieres eliminar esta flashcard?')))) return;
        try {
          if (stryMutAct_9fa48("13699")) {
            {}
          } else {
            stryCov_9fa48("13699");
            const res = await fetch(stryMutAct_9fa48("13700") ? `` : (stryCov_9fa48("13700"), `/api/flashcards?flashcardId=${flashcardId}`), stryMutAct_9fa48("13701") ? {} : (stryCov_9fa48("13701"), {
              method: stryMutAct_9fa48("13702") ? "" : (stryCov_9fa48("13702"), 'DELETE')
            }));
            if (stryMutAct_9fa48("13705") ? false : stryMutAct_9fa48("13704") ? true : stryMutAct_9fa48("13703") ? res.ok : (stryCov_9fa48("13703", "13704", "13705"), !res.ok)) throw new Error(stryMutAct_9fa48("13706") ? "" : (stryCov_9fa48("13706"), 'Error al eliminar flashcard'));
            toast.success(stryMutAct_9fa48("13707") ? "" : (stryCov_9fa48("13707"), 'Flashcard eliminada'));
            loadFlashcards();
          }
        } catch (err) {
          if (stryMutAct_9fa48("13708")) {
            {}
          } else {
            stryCov_9fa48("13708");
            toast.error(stryMutAct_9fa48("13709") ? "" : (stryCov_9fa48("13709"), 'Error al eliminar flashcard'));
          }
        }
      }
    };

    // Memoizar conteo de flashcards vencidas
    const dueCount = useMemo(() => {
      if (stryMutAct_9fa48("13710")) {
        {}
      } else {
        stryCov_9fa48("13710");
        const now = new Date();
        return stryMutAct_9fa48("13711") ? flashcards.length : (stryCov_9fa48("13711"), flashcards.filter(stryMutAct_9fa48("13712") ? () => undefined : (stryCov_9fa48("13712"), f => stryMutAct_9fa48("13716") ? new Date(f.nextReview) > now : stryMutAct_9fa48("13715") ? new Date(f.nextReview) < now : stryMutAct_9fa48("13714") ? false : stryMutAct_9fa48("13713") ? true : (stryCov_9fa48("13713", "13714", "13715", "13716"), new Date(f.nextReview) <= now))).length);
      }
    }, stryMutAct_9fa48("13717") ? [] : (stryCov_9fa48("13717"), [flashcards]));

    // Memoizar función para verificar si una flashcard está vencida
    const isDue = useMemo(() => {
      if (stryMutAct_9fa48("13718")) {
        {}
      } else {
        stryCov_9fa48("13718");
        const now = new Date();
        return stryMutAct_9fa48("13719") ? () => undefined : (stryCov_9fa48("13719"), (nextReview: string) => stryMutAct_9fa48("13723") ? new Date(nextReview) > now : stryMutAct_9fa48("13722") ? new Date(nextReview) < now : stryMutAct_9fa48("13721") ? false : stryMutAct_9fa48("13720") ? true : (stryCov_9fa48("13720", "13721", "13722", "13723"), new Date(nextReview) <= now));
      }
    }, stryMutAct_9fa48("13724") ? ["Stryker was here"] : (stryCov_9fa48("13724"), []));
    if (stryMutAct_9fa48("13726") ? false : stryMutAct_9fa48("13725") ? true : (stryCov_9fa48("13725", "13726"), loading)) {
      if (stryMutAct_9fa48("13727")) {
        {}
      } else {
        stryCov_9fa48("13727");
        return <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="space-y-4">
          {(stryMutAct_9fa48("13728") ? [] : (stryCov_9fa48("13728"), [1, 2, 3, 4])).map(stryMutAct_9fa48("13729") ? () => undefined : (stryCov_9fa48("13729"), i => <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>))}
        </div>
      </div>;
      }
    }
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Flashcards
          </h1>
          <p className="text-muted-foreground mt-2">
            Estudia con tarjetas de memoria usando repaso espaciado
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateFlashcardButton />
          <HelpIcon content="Las flashcards usan el algoritmo SM-2 para optimizar tu aprendizaje. Repasa las tarjetas pendientes regularmente para mejorar la retención." />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={stryMutAct_9fa48("13730") ? () => undefined : (stryCov_9fa48("13730"), v => setActiveTab(v as 'all' | 'due'))}>
        <TabsList>
          <TabsTrigger value="all">Todas ({flashcards.length})</TabsTrigger>
          <TabsTrigger value="due">Pendientes ({dueCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {(stryMutAct_9fa48("13733") ? flashcards.length !== 0 : stryMutAct_9fa48("13732") ? false : stryMutAct_9fa48("13731") ? true : (stryCov_9fa48("13731", "13732", "13733"), flashcards.length === 0)) ? <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">No tienes flashcards aún</p>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera flashcard para comenzar a estudiar
                </p>
                <CreateFlashcardButton variant="default" />
              </CardContent>
            </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map(stryMutAct_9fa48("13734") ? () => undefined : (stryCov_9fa48("13734"), flashcard => <Card key={flashcard.id} className={stryMutAct_9fa48("13735") ? `` : (stryCov_9fa48("13735"), `
                    hover:border-primary transition-colors cursor-pointer
                    ${isDue(flashcard.nextReview) ? stryMutAct_9fa48("13736") ? "" : (stryCov_9fa48("13736"), 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20') : stryMutAct_9fa48("13737") ? "Stryker was here!" : (stryCov_9fa48("13737"), '')}
                  `)} onClick={stryMutAct_9fa48("13738") ? () => undefined : (stryCov_9fa48("13738"), () => router.push(stryMutAct_9fa48("13739") ? `` : (stryCov_9fa48("13739"), `/flashcards/${flashcard.id}/study`)))}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">{flashcard.front}</CardTitle>
                      {stryMutAct_9fa48("13742") ? isDue(flashcard.nextReview) || <Badge variant="destructive" className="ml-2">
                          Pendiente
                        </Badge> : stryMutAct_9fa48("13741") ? false : stryMutAct_9fa48("13740") ? true : (stryCov_9fa48("13740", "13741", "13742"), isDue(flashcard.nextReview) && <Badge variant="destructive" className="ml-2">
                          Pendiente
                        </Badge>)}
                    </div>
                    {stryMutAct_9fa48("13745") ? flashcard.question || <CardDescription className="text-xs">
                        {flashcard.question.subject.nombre}
                        {flashcard.question.topic && ` • ${flashcard.question.topic.nombre}`}
                      </CardDescription> : stryMutAct_9fa48("13744") ? false : stryMutAct_9fa48("13743") ? true : (stryCov_9fa48("13743", "13744", "13745"), flashcard.question && <CardDescription className="text-xs">
                        {flashcard.question.subject.nombre}
                        {stryMutAct_9fa48("13748") ? flashcard.question.topic || ` • ${flashcard.question.topic.nombre}` : stryMutAct_9fa48("13747") ? false : stryMutAct_9fa48("13746") ? true : (stryCov_9fa48("13746", "13747", "13748"), flashcard.question.topic && (stryMutAct_9fa48("13749") ? `` : (stryCov_9fa48("13749"), ` • ${flashcard.question.topic.nombre}`)))}
                      </CardDescription>)}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Repasos: {flashcard.reviewCount}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(flashcard.nextReview).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={e => {
                      if (stryMutAct_9fa48("13750")) {
                        {}
                      } else {
                        stryCov_9fa48("13750");
                        e.stopPropagation();
                        router.push(stryMutAct_9fa48("13751") ? `` : (stryCov_9fa48("13751"), `/flashcards/${flashcard.id}/study`));
                      }
                    }}>
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Estudiar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={e => {
                      if (stryMutAct_9fa48("13752")) {
                        {}
                      } else {
                        stryCov_9fa48("13752");
                        e.stopPropagation();
                        handleDelete(flashcard.id);
                      }
                    }}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>))}
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
  }
}