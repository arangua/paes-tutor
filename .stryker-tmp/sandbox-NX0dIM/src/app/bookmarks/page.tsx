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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Star, BookOpen, Filter, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { captureError } from '@/lib/monitoring';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
interface Bookmark {
  id: string;
  questionId: string;
  notes: string | null;
  createdAt: string;
  question: {
    id: string;
    enunciado: string;
    explicacion: string;
    dificultad: number;
    fuente: string;
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
  };
}
export default function BookmarksPage() {
  if (stryMutAct_9fa48("11705")) {
    {}
  } else {
    stryCov_9fa48("11705");
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(stryMutAct_9fa48("11706") ? ["Stryker was here"] : (stryCov_9fa48("11706"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("11707") ? false : (stryCov_9fa48("11707"), true));
    const [error, setError] = useState<string | null>(null);
    const [filterSubject, setFilterSubject] = useState<string>(stryMutAct_9fa48("11708") ? "" : (stryCov_9fa48("11708"), 'all'));
    const [filterTopic, setFilterTopic] = useState<string>(stryMutAct_9fa48("11709") ? "" : (stryCov_9fa48("11709"), 'all'));
    const [subjects, setSubjects] = useState<Array<{
      id: string;
      nombre: string;
      codigo: string;
    }>>(stryMutAct_9fa48("11710") ? ["Stryker was here"] : (stryCov_9fa48("11710"), []));

    // Memoizar filtrado de bookmarks para evitar recálculos innecesarios
    const filteredBookmarks = useMemo(() => {
      if (stryMutAct_9fa48("11711")) {
        {}
      } else {
        stryCov_9fa48("11711");
        let filtered = stryMutAct_9fa48("11712") ? [] : (stryCov_9fa48("11712"), [...bookmarks]);
        if (stryMutAct_9fa48("11715") ? filterSubject === 'all' : stryMutAct_9fa48("11714") ? false : stryMutAct_9fa48("11713") ? true : (stryCov_9fa48("11713", "11714", "11715"), filterSubject !== (stryMutAct_9fa48("11716") ? "" : (stryCov_9fa48("11716"), 'all')))) {
          if (stryMutAct_9fa48("11717")) {
            {}
          } else {
            stryCov_9fa48("11717");
            filtered = stryMutAct_9fa48("11718") ? filtered : (stryCov_9fa48("11718"), filtered.filter(stryMutAct_9fa48("11719") ? () => undefined : (stryCov_9fa48("11719"), b => stryMutAct_9fa48("11722") ? b.question.subject.codigo !== filterSubject : stryMutAct_9fa48("11721") ? false : stryMutAct_9fa48("11720") ? true : (stryCov_9fa48("11720", "11721", "11722"), b.question.subject.codigo === filterSubject))));
          }
        }
        if (stryMutAct_9fa48("11725") ? filterTopic !== 'all' || filterTopic : stryMutAct_9fa48("11724") ? false : stryMutAct_9fa48("11723") ? true : (stryCov_9fa48("11723", "11724", "11725"), (stryMutAct_9fa48("11727") ? filterTopic === 'all' : stryMutAct_9fa48("11726") ? true : (stryCov_9fa48("11726", "11727"), filterTopic !== (stryMutAct_9fa48("11728") ? "" : (stryCov_9fa48("11728"), 'all')))) && filterTopic)) {
          if (stryMutAct_9fa48("11729")) {
            {}
          } else {
            stryCov_9fa48("11729");
            filtered = stryMutAct_9fa48("11730") ? filtered : (stryCov_9fa48("11730"), filtered.filter(stryMutAct_9fa48("11731") ? () => undefined : (stryCov_9fa48("11731"), b => stryMutAct_9fa48("11734") ? b.question.topic?.nombre !== filterTopic : stryMutAct_9fa48("11733") ? false : stryMutAct_9fa48("11732") ? true : (stryCov_9fa48("11732", "11733", "11734"), (stryMutAct_9fa48("11735") ? b.question.topic.nombre : (stryCov_9fa48("11735"), b.question.topic?.nombre)) === filterTopic))));
          }
        }
        return filtered;
      }
    }, stryMutAct_9fa48("11736") ? [] : (stryCov_9fa48("11736"), [bookmarks, filterSubject, filterTopic]));
    useEffect(() => {
      if (stryMutAct_9fa48("11737")) {
        {}
      } else {
        stryCov_9fa48("11737");
        async function loadBookmarks() {
          if (stryMutAct_9fa48("11738")) {
            {}
          } else {
            stryCov_9fa48("11738");
            try {
              if (stryMutAct_9fa48("11739")) {
                {}
              } else {
                stryCov_9fa48("11739");
                setLoading(stryMutAct_9fa48("11740") ? false : (stryCov_9fa48("11740"), true));
                const res = await fetch(stryMutAct_9fa48("11741") ? "" : (stryCov_9fa48("11741"), '/api/bookmarks'));
                if (stryMutAct_9fa48("11744") ? false : stryMutAct_9fa48("11743") ? true : stryMutAct_9fa48("11742") ? res.ok : (stryCov_9fa48("11742", "11743", "11744"), !res.ok)) throw new Error(stryMutAct_9fa48("11745") ? "" : (stryCov_9fa48("11745"), 'Error al cargar favoritos'));
                const data = await res.json();
                setBookmarks(stryMutAct_9fa48("11748") ? data.bookmarks && [] : stryMutAct_9fa48("11747") ? false : stryMutAct_9fa48("11746") ? true : (stryCov_9fa48("11746", "11747", "11748"), data.bookmarks || (stryMutAct_9fa48("11749") ? ["Stryker was here"] : (stryCov_9fa48("11749"), []))));
              }
            } catch (err) {
              if (stryMutAct_9fa48("11750")) {
                {}
              } else {
                stryCov_9fa48("11750");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("11751") ? "" : (stryCov_9fa48("11751"), 'Error desconocido'));
                toast.error(stryMutAct_9fa48("11752") ? "" : (stryCov_9fa48("11752"), 'Error al cargar favoritos'));
              }
            } finally {
              if (stryMutAct_9fa48("11753")) {
                {}
              } else {
                stryCov_9fa48("11753");
                setLoading(stryMutAct_9fa48("11754") ? true : (stryCov_9fa48("11754"), false));
              }
            }
          }
        }
        async function loadSubjects() {
          if (stryMutAct_9fa48("11755")) {
            {}
          } else {
            stryCov_9fa48("11755");
            try {
              if (stryMutAct_9fa48("11756")) {
                {}
              } else {
                stryCov_9fa48("11756");
                const res = await fetch(stryMutAct_9fa48("11757") ? "" : (stryCov_9fa48("11757"), '/api/subjects'));
                if (stryMutAct_9fa48("11759") ? false : stryMutAct_9fa48("11758") ? true : (stryCov_9fa48("11758", "11759"), res.ok)) {
                  if (stryMutAct_9fa48("11760")) {
                    {}
                  } else {
                    stryCov_9fa48("11760");
                    const data = await res.json();
                    setSubjects(stryMutAct_9fa48("11763") ? data.subjects && [] : stryMutAct_9fa48("11762") ? false : stryMutAct_9fa48("11761") ? true : (stryCov_9fa48("11761", "11762", "11763"), data.subjects || (stryMutAct_9fa48("11764") ? ["Stryker was here"] : (stryCov_9fa48("11764"), []))));
                  }
                }
              }
            } catch (err) {
              if (stryMutAct_9fa48("11765")) {
                {}
              } else {
                stryCov_9fa48("11765");
                captureError(err instanceof Error ? err : new Error(String(err)), stryMutAct_9fa48("11766") ? {} : (stryCov_9fa48("11766"), {
                  type: stryMutAct_9fa48("11767") ? "" : (stryCov_9fa48("11767"), 'bookmarks_load_error'),
                  action: stryMutAct_9fa48("11768") ? "" : (stryCov_9fa48("11768"), 'load_subjects'),
                  path: (stryMutAct_9fa48("11771") ? typeof window === 'undefined' : stryMutAct_9fa48("11770") ? false : stryMutAct_9fa48("11769") ? true : (stryCov_9fa48("11769", "11770", "11771"), typeof window !== (stryMutAct_9fa48("11772") ? "" : (stryCov_9fa48("11772"), 'undefined')))) ? window.location.pathname : undefined
                }));
              }
            }
          }
        }
        loadBookmarks();
        loadSubjects();
      }
    }, stryMutAct_9fa48("11773") ? ["Stryker was here"] : (stryCov_9fa48("11773"), []));
    const handleRemoveBookmark = async (bookmarkId: string, questionId: string) => {
      if (stryMutAct_9fa48("11774")) {
        {}
      } else {
        stryCov_9fa48("11774");
        try {
          if (stryMutAct_9fa48("11775")) {
            {}
          } else {
            stryCov_9fa48("11775");
            const res = await fetch(stryMutAct_9fa48("11776") ? `` : (stryCov_9fa48("11776"), `/api/bookmarks?questionId=${questionId}`), stryMutAct_9fa48("11777") ? {} : (stryCov_9fa48("11777"), {
              method: stryMutAct_9fa48("11778") ? "" : (stryCov_9fa48("11778"), 'DELETE')
            }));
            if (stryMutAct_9fa48("11780") ? false : stryMutAct_9fa48("11779") ? true : (stryCov_9fa48("11779", "11780"), res.ok)) {
              if (stryMutAct_9fa48("11781")) {
                {}
              } else {
                stryCov_9fa48("11781");
                setBookmarks(stryMutAct_9fa48("11782") ? () => undefined : (stryCov_9fa48("11782"), prev => stryMutAct_9fa48("11783") ? prev : (stryCov_9fa48("11783"), prev.filter(stryMutAct_9fa48("11784") ? () => undefined : (stryCov_9fa48("11784"), b => stryMutAct_9fa48("11787") ? b.id === bookmarkId : stryMutAct_9fa48("11786") ? false : stryMutAct_9fa48("11785") ? true : (stryCov_9fa48("11785", "11786", "11787"), b.id !== bookmarkId))))));
                setFilteredBookmarks(stryMutAct_9fa48("11788") ? () => undefined : (stryCov_9fa48("11788"), prev => stryMutAct_9fa48("11789") ? prev : (stryCov_9fa48("11789"), prev.filter(stryMutAct_9fa48("11790") ? () => undefined : (stryCov_9fa48("11790"), b => stryMutAct_9fa48("11793") ? b.id === bookmarkId : stryMutAct_9fa48("11792") ? false : stryMutAct_9fa48("11791") ? true : (stryCov_9fa48("11791", "11792", "11793"), b.id !== bookmarkId))))));
                toast.success(stryMutAct_9fa48("11794") ? "" : (stryCov_9fa48("11794"), 'Eliminado de favoritos'));
              }
            } else {
              if (stryMutAct_9fa48("11795")) {
                {}
              } else {
                stryCov_9fa48("11795");
                throw new Error(stryMutAct_9fa48("11796") ? "" : (stryCov_9fa48("11796"), 'Error al eliminar favorito'));
              }
            }
          }
        } catch (err) {
          if (stryMutAct_9fa48("11797")) {
            {}
          } else {
            stryCov_9fa48("11797");
            toast.error(stryMutAct_9fa48("11798") ? "" : (stryCov_9fa48("11798"), 'Error al eliminar favorito'));
          }
        }
      }
    };
    const getTopicsForSubject = () => {
      if (stryMutAct_9fa48("11799")) {
        {}
      } else {
        stryCov_9fa48("11799");
        if (stryMutAct_9fa48("11802") ? filterSubject !== 'all' : stryMutAct_9fa48("11801") ? false : stryMutAct_9fa48("11800") ? true : (stryCov_9fa48("11800", "11801", "11802"), filterSubject === (stryMutAct_9fa48("11803") ? "" : (stryCov_9fa48("11803"), 'all')))) return stryMutAct_9fa48("11804") ? ["Stryker was here"] : (stryCov_9fa48("11804"), []);
        const subjectBookmarks = stryMutAct_9fa48("11805") ? bookmarks : (stryCov_9fa48("11805"), bookmarks.filter(stryMutAct_9fa48("11806") ? () => undefined : (stryCov_9fa48("11806"), b => stryMutAct_9fa48("11809") ? b.question.subject.codigo !== filterSubject : stryMutAct_9fa48("11808") ? false : stryMutAct_9fa48("11807") ? true : (stryCov_9fa48("11807", "11808", "11809"), b.question.subject.codigo === filterSubject))));
        const topics = new Set(stryMutAct_9fa48("11810") ? subjectBookmarks.map(b => b.question.topic?.nombre) : (stryCov_9fa48("11810"), subjectBookmarks.map(stryMutAct_9fa48("11811") ? () => undefined : (stryCov_9fa48("11811"), b => stryMutAct_9fa48("11812") ? b.question.topic.nombre : (stryCov_9fa48("11812"), b.question.topic?.nombre))).filter(Boolean)));
        return Array.from(topics) as string[];
      }
    };
    if (stryMutAct_9fa48("11814") ? false : stryMutAct_9fa48("11813") ? true : (stryCov_9fa48("11813", "11814"), loading)) {
      if (stryMutAct_9fa48("11815")) {
        {}
      } else {
        stryCov_9fa48("11815");
        return <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {(stryMutAct_9fa48("11816") ? [] : (stryCov_9fa48("11816"), [1, 2, 3])).map(stryMutAct_9fa48("11817") ? () => undefined : (stryCov_9fa48("11817"), i => <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>))}
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("11819") ? false : stryMutAct_9fa48("11818") ? true : (stryCov_9fa48("11818", "11819"), error)) {
      if (stryMutAct_9fa48("11820")) {
        {}
      } else {
        stryCov_9fa48("11820");
        return <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            Mis Favoritos
          </h1>
          <p className="text-muted-foreground mt-2">
            {(stryMutAct_9fa48("11823") ? bookmarks.length !== 0 : stryMutAct_9fa48("11822") ? false : stryMutAct_9fa48("11821") ? true : (stryCov_9fa48("11821", "11822", "11823"), bookmarks.length === 0)) ? stryMutAct_9fa48("11824") ? "" : (stryCov_9fa48("11824"), 'No tienes preguntas marcadas como favoritas') : stryMutAct_9fa48("11825") ? `` : (stryCov_9fa48("11825"), `${bookmarks.length} pregunta${(stryMutAct_9fa48("11828") ? bookmarks.length === 1 : stryMutAct_9fa48("11827") ? false : stryMutAct_9fa48("11826") ? true : (stryCov_9fa48("11826", "11827", "11828"), bookmarks.length !== 1)) ? stryMutAct_9fa48("11829") ? "" : (stryCov_9fa48("11829"), 's') : stryMutAct_9fa48("11830") ? "Stryker was here!" : (stryCov_9fa48("11830"), '')} marcada${(stryMutAct_9fa48("11833") ? bookmarks.length === 1 : stryMutAct_9fa48("11832") ? false : stryMutAct_9fa48("11831") ? true : (stryCov_9fa48("11831", "11832", "11833"), bookmarks.length !== 1)) ? stryMutAct_9fa48("11834") ? "" : (stryCov_9fa48("11834"), 's') : stryMutAct_9fa48("11835") ? "Stryker was here!" : (stryCov_9fa48("11835"), '')} como favorita${(stryMutAct_9fa48("11838") ? bookmarks.length === 1 : stryMutAct_9fa48("11837") ? false : stryMutAct_9fa48("11836") ? true : (stryCov_9fa48("11836", "11837", "11838"), bookmarks.length !== 1)) ? stryMutAct_9fa48("11839") ? "" : (stryCov_9fa48("11839"), 's') : stryMutAct_9fa48("11840") ? "Stryker was here!" : (stryCov_9fa48("11840"), '')}`)}
          </p>
        </div>
        <HelpIcon content="Las preguntas marcadas como favoritas aparecerán aquí para que puedas revisarlas fácilmente más tarde." />
      </div>

      {stryMutAct_9fa48("11843") ? bookmarks.length > 0 || <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las asignaturas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las asignaturas</SelectItem>
                    {subjects.map(subject => <SelectItem key={subject.id} value={subject.codigo}>
                        {subject.nombre}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tema</label>
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los temas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los temas</SelectItem>
                    {getTopicsForSubject().map(topic => <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card> : stryMutAct_9fa48("11842") ? false : stryMutAct_9fa48("11841") ? true : (stryCov_9fa48("11841", "11842", "11843"), (stryMutAct_9fa48("11846") ? bookmarks.length <= 0 : stryMutAct_9fa48("11845") ? bookmarks.length >= 0 : stryMutAct_9fa48("11844") ? true : (stryCov_9fa48("11844", "11845", "11846"), bookmarks.length > 0)) && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las asignaturas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las asignaturas</SelectItem>
                    {subjects.map(stryMutAct_9fa48("11847") ? () => undefined : (stryCov_9fa48("11847"), subject => <SelectItem key={subject.id} value={subject.codigo}>
                        {subject.nombre}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tema</label>
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los temas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los temas</SelectItem>
                    {getTopicsForSubject().map(stryMutAct_9fa48("11848") ? () => undefined : (stryCov_9fa48("11848"), topic => <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>)}

      {stryMutAct_9fa48("11851") ? filteredBookmarks.length === 0 && bookmarks.length > 0 || <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay favoritos que coincidan con los filtros seleccionados
            </p>
          </CardContent>
        </Card> : stryMutAct_9fa48("11850") ? false : stryMutAct_9fa48("11849") ? true : (stryCov_9fa48("11849", "11850", "11851"), (stryMutAct_9fa48("11853") ? filteredBookmarks.length === 0 || bookmarks.length > 0 : stryMutAct_9fa48("11852") ? true : (stryCov_9fa48("11852", "11853"), (stryMutAct_9fa48("11855") ? filteredBookmarks.length !== 0 : stryMutAct_9fa48("11854") ? true : (stryCov_9fa48("11854", "11855"), filteredBookmarks.length === 0)) && (stryMutAct_9fa48("11858") ? bookmarks.length <= 0 : stryMutAct_9fa48("11857") ? bookmarks.length >= 0 : stryMutAct_9fa48("11856") ? true : (stryCov_9fa48("11856", "11857", "11858"), bookmarks.length > 0)))) && <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay favoritos que coincidan con los filtros seleccionados
            </p>
          </CardContent>
        </Card>)}

      {stryMutAct_9fa48("11861") ? filteredBookmarks.length === 0 && bookmarks.length === 0 || <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-semibold mb-2">No tienes favoritos aún</p>
            <p className="text-muted-foreground mb-4">
              Marca preguntas como favoritas mientras estudias para revisarlas después
            </p>
            <Button onClick={() => router.push('/exams')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Ir a Exámenes
            </Button>
          </CardContent>
        </Card> : stryMutAct_9fa48("11860") ? false : stryMutAct_9fa48("11859") ? true : (stryCov_9fa48("11859", "11860", "11861"), (stryMutAct_9fa48("11863") ? filteredBookmarks.length === 0 || bookmarks.length === 0 : stryMutAct_9fa48("11862") ? true : (stryCov_9fa48("11862", "11863"), (stryMutAct_9fa48("11865") ? filteredBookmarks.length !== 0 : stryMutAct_9fa48("11864") ? true : (stryCov_9fa48("11864", "11865"), filteredBookmarks.length === 0)) && (stryMutAct_9fa48("11867") ? bookmarks.length !== 0 : stryMutAct_9fa48("11866") ? true : (stryCov_9fa48("11866", "11867"), bookmarks.length === 0)))) && <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-semibold mb-2">No tienes favoritos aún</p>
            <p className="text-muted-foreground mb-4">
              Marca preguntas como favoritas mientras estudias para revisarlas después
            </p>
            <Button onClick={stryMutAct_9fa48("11868") ? () => undefined : (stryCov_9fa48("11868"), () => router.push(stryMutAct_9fa48("11869") ? "" : (stryCov_9fa48("11869"), '/exams')))}>
              <BookOpen className="h-4 w-4 mr-2" />
              Ir a Exámenes
            </Button>
          </CardContent>
        </Card>)}

      <div className="space-y-4">
        {filteredBookmarks.map(bookmark => {
          if (stryMutAct_9fa48("11870")) {
            {}
          } else {
            stryCov_9fa48("11870");
            const correctOption = bookmark.question.options.find(stryMutAct_9fa48("11871") ? () => undefined : (stryCov_9fa48("11871"), opt => opt.esCorrecta));
            return <Card key={bookmark.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{bookmark.question.subject.nombre}</Badge>
                      {stryMutAct_9fa48("11874") ? bookmark.question.topic || <Badge variant="secondary">{bookmark.question.topic.nombre}</Badge> : stryMutAct_9fa48("11873") ? false : stryMutAct_9fa48("11872") ? true : (stryCov_9fa48("11872", "11873", "11874"), bookmark.question.topic && <Badge variant="secondary">{bookmark.question.topic.nombre}</Badge>)}
                      <Badge variant="outline" className="text-xs">
                        Dificultad: {bookmark.question.dificultad}/5
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{bookmark.question.enunciado}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookmarkButton questionId={bookmark.question.id} />
                    <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("11875") ? () => undefined : (stryCov_9fa48("11875"), () => handleRemoveBookmark(bookmark.id, bookmark.question.id))} title="Eliminar de favoritos">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Opciones:</p>
                  <div className="space-y-1">
                    {bookmark.question.options.map(stryMutAct_9fa48("11876") ? () => undefined : (stryCov_9fa48("11876"), option => <div key={option.id} className={stryMutAct_9fa48("11877") ? `` : (stryCov_9fa48("11877"), `
                          p-2 rounded text-sm
                          ${option.esCorrecta ? stryMutAct_9fa48("11878") ? "" : (stryCov_9fa48("11878"), 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800') : stryMutAct_9fa48("11879") ? "" : (stryCov_9fa48("11879"), 'bg-muted')}
                        `)}>
                        <span className="font-semibold">{option.letra}.</span> {option.texto}
                        {stryMutAct_9fa48("11882") ? option.esCorrecta || <Badge variant="default" className="ml-2 bg-green-600">
                            Correcta
                          </Badge> : stryMutAct_9fa48("11881") ? false : stryMutAct_9fa48("11880") ? true : (stryCov_9fa48("11880", "11881", "11882"), option.esCorrecta && <Badge variant="default" className="ml-2 bg-green-600">
                            Correcta
                          </Badge>)}
                      </div>))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Explicación:</p>
                  <p className="text-sm text-muted-foreground">{bookmark.question.explicacion}</p>
                </div>
                {stryMutAct_9fa48("11885") ? bookmark.notes || <div>
                    <p className="text-sm font-semibold mb-2">Mis notas:</p>
                    <p className="text-sm text-muted-foreground italic">{bookmark.notes}</p>
                  </div> : stryMutAct_9fa48("11884") ? false : stryMutAct_9fa48("11883") ? true : (stryCov_9fa48("11883", "11884", "11885"), bookmark.notes && <div>
                    <p className="text-sm font-semibold mb-2">Mis notas:</p>
                    <p className="text-sm text-muted-foreground italic">{bookmark.notes}</p>
                  </div>)}
                <div className="text-xs text-muted-foreground">
                  Fuente: {bookmark.question.fuente} • Agregado:{stryMutAct_9fa48("11886") ? "" : (stryCov_9fa48("11886"), ' ')}
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>;
          }
        })}
      </div>
    </div>;
  }
}