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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Plus, Search, Edit, Trash2, BookOpen, Tag, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { NoteDialog } from '@/components/notes/note-dialog';
import { NoteVersions } from '@/components/notes/note-versions';
import { HelpIcon } from '@/components/help/help-icon';
interface StudyNote {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
  question?: {
    id: string;
    enunciado: string;
    subject: {
      nombre: string;
      codigo: string;
    };
    topic: {
      nombre: string;
    } | null;
  } | null;
  topic?: {
    id: string;
    nombre: string;
    subject: {
      nombre: string;
      codigo: string;
    };
  } | null;
}
export default function NotesPage() {
  if (stryMutAct_9fa48("14323")) {
    {}
  } else {
    stryCov_9fa48("14323");
    const [notes, setNotes] = useState<StudyNote[]>(stryMutAct_9fa48("14324") ? ["Stryker was here"] : (stryCov_9fa48("14324"), []));
    const [filteredNotes, setFilteredNotes] = useState<StudyNote[]>(stryMutAct_9fa48("14325") ? ["Stryker was here"] : (stryCov_9fa48("14325"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("14326") ? false : (stryCov_9fa48("14326"), true));
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("14327") ? "Stryker was here!" : (stryCov_9fa48("14327"), ''));
    const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'topics'>(stryMutAct_9fa48("14328") ? "" : (stryCov_9fa48("14328"), 'all'));
    const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(stryMutAct_9fa48("14329") ? true : (stryCov_9fa48("14329"), false));
    const [versionsNoteId, setVersionsNoteId] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("14330")) {
        {}
      } else {
        stryCov_9fa48("14330");
        loadNotes();
      }
    }, stryMutAct_9fa48("14331") ? ["Stryker was here"] : (stryCov_9fa48("14331"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("14332")) {
        {}
      } else {
        stryCov_9fa48("14332");
        filterNotes();
      }
    }, stryMutAct_9fa48("14333") ? [] : (stryCov_9fa48("14333"), [notes, searchQuery, activeTab]));
    async function loadNotes() {
      if (stryMutAct_9fa48("14334")) {
        {}
      } else {
        stryCov_9fa48("14334");
        try {
          if (stryMutAct_9fa48("14335")) {
            {}
          } else {
            stryCov_9fa48("14335");
            setLoading(stryMutAct_9fa48("14336") ? false : (stryCov_9fa48("14336"), true));
            const res = await fetch(stryMutAct_9fa48("14337") ? "" : (stryCov_9fa48("14337"), '/api/notes'));
            if (stryMutAct_9fa48("14340") ? false : stryMutAct_9fa48("14339") ? true : stryMutAct_9fa48("14338") ? res.ok : (stryCov_9fa48("14338", "14339", "14340"), !res.ok)) throw new Error(stryMutAct_9fa48("14341") ? "" : (stryCov_9fa48("14341"), 'Error al cargar notas'));
            const data = await res.json();
            setNotes(stryMutAct_9fa48("14344") ? data.notes && [] : stryMutAct_9fa48("14343") ? false : stryMutAct_9fa48("14342") ? true : (stryCov_9fa48("14342", "14343", "14344"), data.notes || (stryMutAct_9fa48("14345") ? ["Stryker was here"] : (stryCov_9fa48("14345"), []))));
          }
        } catch (err) {
          if (stryMutAct_9fa48("14346")) {
            {}
          } else {
            stryCov_9fa48("14346");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("14347") ? "" : (stryCov_9fa48("14347"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("14348") ? "" : (stryCov_9fa48("14348"), 'Error al cargar notas'));
          }
        } finally {
          if (stryMutAct_9fa48("14349")) {
            {}
          } else {
            stryCov_9fa48("14349");
            setLoading(stryMutAct_9fa48("14350") ? true : (stryCov_9fa48("14350"), false));
          }
        }
      }
    }
    function filterNotes() {
      if (stryMutAct_9fa48("14351")) {
        {}
      } else {
        stryCov_9fa48("14351");
        let filtered = stryMutAct_9fa48("14352") ? [] : (stryCov_9fa48("14352"), [...notes]);

        // Filtrar por tipo
        if (stryMutAct_9fa48("14355") ? activeTab !== 'questions' : stryMutAct_9fa48("14354") ? false : stryMutAct_9fa48("14353") ? true : (stryCov_9fa48("14353", "14354", "14355"), activeTab === (stryMutAct_9fa48("14356") ? "" : (stryCov_9fa48("14356"), 'questions')))) {
          if (stryMutAct_9fa48("14357")) {
            {}
          } else {
            stryCov_9fa48("14357");
            filtered = stryMutAct_9fa48("14358") ? filtered : (stryCov_9fa48("14358"), filtered.filter(stryMutAct_9fa48("14359") ? () => undefined : (stryCov_9fa48("14359"), n => stryMutAct_9fa48("14362") ? n.question === null : stryMutAct_9fa48("14361") ? false : stryMutAct_9fa48("14360") ? true : (stryCov_9fa48("14360", "14361", "14362"), n.question !== null))));
          }
        } else if (stryMutAct_9fa48("14365") ? activeTab !== 'topics' : stryMutAct_9fa48("14364") ? false : stryMutAct_9fa48("14363") ? true : (stryCov_9fa48("14363", "14364", "14365"), activeTab === (stryMutAct_9fa48("14366") ? "" : (stryCov_9fa48("14366"), 'topics')))) {
          if (stryMutAct_9fa48("14367")) {
            {}
          } else {
            stryCov_9fa48("14367");
            filtered = stryMutAct_9fa48("14368") ? filtered : (stryCov_9fa48("14368"), filtered.filter(stryMutAct_9fa48("14369") ? () => undefined : (stryCov_9fa48("14369"), n => stryMutAct_9fa48("14372") ? n.topic === null : stryMutAct_9fa48("14371") ? false : stryMutAct_9fa48("14370") ? true : (stryCov_9fa48("14370", "14371", "14372"), n.topic !== null))));
          }
        }

        // Filtrar por búsqueda
        if (stryMutAct_9fa48("14375") ? searchQuery : stryMutAct_9fa48("14374") ? false : stryMutAct_9fa48("14373") ? true : (stryCov_9fa48("14373", "14374", "14375"), searchQuery.trim())) {
          if (stryMutAct_9fa48("14376")) {
            {}
          } else {
            stryCov_9fa48("14376");
            const query = stryMutAct_9fa48("14377") ? searchQuery.toUpperCase() : (stryCov_9fa48("14377"), searchQuery.toLowerCase());
            filtered = stryMutAct_9fa48("14378") ? filtered : (stryCov_9fa48("14378"), filtered.filter(stryMutAct_9fa48("14379") ? () => undefined : (stryCov_9fa48("14379"), note => stryMutAct_9fa48("14382") ? (note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)) && note.tags && note.tags.toLowerCase().includes(query) : stryMutAct_9fa48("14381") ? false : stryMutAct_9fa48("14380") ? true : (stryCov_9fa48("14380", "14381", "14382"), (stryMutAct_9fa48("14384") ? note.title.toLowerCase().includes(query) && note.content.toLowerCase().includes(query) : stryMutAct_9fa48("14383") ? false : (stryCov_9fa48("14383", "14384"), (stryMutAct_9fa48("14385") ? note.title.toUpperCase().includes(query) : (stryCov_9fa48("14385"), note.title.toLowerCase().includes(query))) || (stryMutAct_9fa48("14386") ? note.content.toUpperCase().includes(query) : (stryCov_9fa48("14386"), note.content.toLowerCase().includes(query))))) || (stryMutAct_9fa48("14388") ? note.tags || note.tags.toLowerCase().includes(query) : stryMutAct_9fa48("14387") ? false : (stryCov_9fa48("14387", "14388"), note.tags && (stryMutAct_9fa48("14389") ? note.tags.toUpperCase().includes(query) : (stryCov_9fa48("14389"), note.tags.toLowerCase().includes(query)))))))));
          }
        }
        setFilteredNotes(filtered);
      }
    }
    const handleDelete = async (noteId: string) => {
      if (stryMutAct_9fa48("14390")) {
        {}
      } else {
        stryCov_9fa48("14390");
        if (stryMutAct_9fa48("14393") ? false : stryMutAct_9fa48("14392") ? true : stryMutAct_9fa48("14391") ? confirm('¿Estás seguro de que quieres eliminar esta nota?') : (stryCov_9fa48("14391", "14392", "14393"), !confirm(stryMutAct_9fa48("14394") ? "" : (stryCov_9fa48("14394"), '¿Estás seguro de que quieres eliminar esta nota?')))) return;
        try {
          if (stryMutAct_9fa48("14395")) {
            {}
          } else {
            stryCov_9fa48("14395");
            const res = await fetch(stryMutAct_9fa48("14396") ? `` : (stryCov_9fa48("14396"), `/api/notes?noteId=${noteId}`), stryMutAct_9fa48("14397") ? {} : (stryCov_9fa48("14397"), {
              method: stryMutAct_9fa48("14398") ? "" : (stryCov_9fa48("14398"), 'DELETE')
            }));
            if (stryMutAct_9fa48("14401") ? false : stryMutAct_9fa48("14400") ? true : stryMutAct_9fa48("14399") ? res.ok : (stryCov_9fa48("14399", "14400", "14401"), !res.ok)) throw new Error(stryMutAct_9fa48("14402") ? "" : (stryCov_9fa48("14402"), 'Error al eliminar nota'));
            toast.success(stryMutAct_9fa48("14403") ? "" : (stryCov_9fa48("14403"), 'Nota eliminada'));
            loadNotes();
          }
        } catch (err) {
          if (stryMutAct_9fa48("14404")) {
            {}
          } else {
            stryCov_9fa48("14404");
            toast.error(stryMutAct_9fa48("14405") ? "" : (stryCov_9fa48("14405"), 'Error al eliminar nota'));
          }
        }
      }
    };
    const getTags = (tagsString: string | null) => {
      if (stryMutAct_9fa48("14406")) {
        {}
      } else {
        stryCov_9fa48("14406");
        if (stryMutAct_9fa48("14409") ? false : stryMutAct_9fa48("14408") ? true : stryMutAct_9fa48("14407") ? tagsString : (stryCov_9fa48("14407", "14408", "14409"), !tagsString)) return stryMutAct_9fa48("14410") ? ["Stryker was here"] : (stryCov_9fa48("14410"), []);
        return stryMutAct_9fa48("14411") ? tagsString.split(',').map(t => t.trim()) : (stryCov_9fa48("14411"), tagsString.split(stryMutAct_9fa48("14412") ? "" : (stryCov_9fa48("14412"), ',')).map(stryMutAct_9fa48("14413") ? () => undefined : (stryCov_9fa48("14413"), t => stryMutAct_9fa48("14414") ? t : (stryCov_9fa48("14414"), t.trim()))).filter(Boolean));
      }
    };
    if (stryMutAct_9fa48("14416") ? false : stryMutAct_9fa48("14415") ? true : (stryCov_9fa48("14415", "14416"), loading)) {
      if (stryMutAct_9fa48("14417")) {
        {}
      } else {
        stryCov_9fa48("14417");
        return <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(stryMutAct_9fa48("14418") ? [] : (stryCov_9fa48("14418"), [1, 2, 3, 4, 5, 6])).map(stryMutAct_9fa48("14419") ? () => undefined : (stryCov_9fa48("14419"), i => <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-3 w-24" />
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
            <FileText className="h-8 w-8" />
            Mis Notas
          </h1>
          <p className="text-muted-foreground mt-2">Organiza tus apuntes y conceptos importantes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={stryMutAct_9fa48("14420") ? () => undefined : (stryCov_9fa48("14420"), () => setCreateDialogOpen(stryMutAct_9fa48("14421") ? false : (stryCov_9fa48("14421"), true)))}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Nota
          </Button>
          <HelpIcon content="Crea notas personales sobre preguntas o temas para recordar conceptos importantes. Puedes buscar y filtrar tus notas fácilmente." />
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar en notas..." value={searchQuery} onChange={stryMutAct_9fa48("14422") ? () => undefined : (stryCov_9fa48("14422"), e => setSearchQuery(e.target.value))} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={stryMutAct_9fa48("14423") ? () => undefined : (stryCov_9fa48("14423"), v => setActiveTab(v as 'all' | 'questions' | 'topics'))}>
        <TabsList>
          <TabsTrigger value="all">Todas ({notes.length})</TabsTrigger>
          <TabsTrigger value="questions">
            Sobre Preguntas ({stryMutAct_9fa48("14424") ? notes.length : (stryCov_9fa48("14424"), notes.filter(stryMutAct_9fa48("14425") ? () => undefined : (stryCov_9fa48("14425"), n => n.question)).length)})
          </TabsTrigger>
          <TabsTrigger value="topics">
            Sobre Temas ({stryMutAct_9fa48("14426") ? notes.length : (stryCov_9fa48("14426"), notes.filter(stryMutAct_9fa48("14427") ? () => undefined : (stryCov_9fa48("14427"), n => n.topic)).length)})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {(stryMutAct_9fa48("14430") ? filteredNotes.length !== 0 : stryMutAct_9fa48("14429") ? false : stryMutAct_9fa48("14428") ? true : (stryCov_9fa48("14428", "14429", "14430"), filteredNotes.length === 0)) ? <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">
                  {searchQuery ? stryMutAct_9fa48("14431") ? "" : (stryCov_9fa48("14431"), 'No se encontraron notas') : stryMutAct_9fa48("14432") ? "" : (stryCov_9fa48("14432"), 'No tienes notas aún')}
                </p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? stryMutAct_9fa48("14433") ? "" : (stryCov_9fa48("14433"), 'Intenta con otros términos de búsqueda') : stryMutAct_9fa48("14434") ? "" : (stryCov_9fa48("14434"), 'Crea tu primera nota para comenzar a organizar tus apuntes')}
                </p>
                {stryMutAct_9fa48("14437") ? !searchQuery || <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nota
                  </Button> : stryMutAct_9fa48("14436") ? false : stryMutAct_9fa48("14435") ? true : (stryCov_9fa48("14435", "14436", "14437"), (stryMutAct_9fa48("14438") ? searchQuery : (stryCov_9fa48("14438"), !searchQuery)) && <Button onClick={stryMutAct_9fa48("14439") ? () => undefined : (stryCov_9fa48("14439"), () => setCreateDialogOpen(stryMutAct_9fa48("14440") ? false : (stryCov_9fa48("14440"), true)))}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nota
                  </Button>)}
              </CardContent>
            </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => {
              if (stryMutAct_9fa48("14441")) {
                {}
              } else {
                stryCov_9fa48("14441");
                const tags = getTags(note.tags);
                return <Card key={note.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 flex-1">{note.title}</CardTitle>
                        <div className="flex items-center gap-1 ml-2">
                          <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("14442") ? () => undefined : (stryCov_9fa48("14442"), () => setVersionsNoteId(note.id))} title="Ver versiones">
                            <History className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("14443") ? () => undefined : (stryCov_9fa48("14443"), () => setEditingNote(note))}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("14444") ? () => undefined : (stryCov_9fa48("14444"), () => handleDelete(note.id))}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {stryMutAct_9fa48("14447") ? note.question || note.topic || <CardDescription>
                          {note.question ? <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              <span>{note.question.subject.nombre}</span>
                              {note.question.topic && <span>• {note.question.topic.nombre}</span>}
                            </div> : note.topic ? <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              <span>
                                {note.topic.subject.nombre} • {note.topic.nombre}
                              </span>
                            </div> : null}
                        </CardDescription> : stryMutAct_9fa48("14446") ? false : stryMutAct_9fa48("14445") ? true : (stryCov_9fa48("14445", "14446", "14447"), (stryMutAct_9fa48("14449") ? note.question && note.topic : stryMutAct_9fa48("14448") ? true : (stryCov_9fa48("14448", "14449"), note.question || note.topic)) && <CardDescription>
                          {note.question ? <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              <span>{note.question.subject.nombre}</span>
                              {stryMutAct_9fa48("14452") ? note.question.topic || <span>• {note.question.topic.nombre}</span> : stryMutAct_9fa48("14451") ? false : stryMutAct_9fa48("14450") ? true : (stryCov_9fa48("14450", "14451", "14452"), note.question.topic && <span>• {note.question.topic.nombre}</span>)}
                            </div> : note.topic ? <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              <span>
                                {note.topic.subject.nombre} • {note.topic.nombre}
                              </span>
                            </div> : null}
                        </CardDescription>)}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                      {stryMutAct_9fa48("14455") ? tags.length > 0 || <div className="flex flex-wrap gap-1">
                          {tags.map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>)}
                        </div> : stryMutAct_9fa48("14454") ? false : stryMutAct_9fa48("14453") ? true : (stryCov_9fa48("14453", "14454", "14455"), (stryMutAct_9fa48("14458") ? tags.length <= 0 : stryMutAct_9fa48("14457") ? tags.length >= 0 : stryMutAct_9fa48("14456") ? true : (stryCov_9fa48("14456", "14457", "14458"), tags.length > 0)) && <div className="flex flex-wrap gap-1">
                          {tags.map(stryMutAct_9fa48("14459") ? () => undefined : (stryCov_9fa48("14459"), (tag, idx) => <Badge key={idx} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>))}
                        </div>)}
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Actualizada: {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>;
              }
            })}
            </div>}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <NoteDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={loadNotes} />

      {/* Edit Dialog */}
      {stryMutAct_9fa48("14462") ? editingNote || <NoteDialog open={!!editingNote} onOpenChange={open => !open && setEditingNote(null)} noteId={editingNote.id} questionId={editingNote.question?.id} topicId={editingNote.topic?.id} defaultTitle={editingNote.title} defaultContent={editingNote.content} onSuccess={() => {
        setEditingNote(null);
        loadNotes();
      }} /> : stryMutAct_9fa48("14461") ? false : stryMutAct_9fa48("14460") ? true : (stryCov_9fa48("14460", "14461", "14462"), editingNote && <NoteDialog open={stryMutAct_9fa48("14463") ? !editingNote : (stryCov_9fa48("14463"), !(stryMutAct_9fa48("14464") ? editingNote : (stryCov_9fa48("14464"), !editingNote)))} onOpenChange={stryMutAct_9fa48("14465") ? () => undefined : (stryCov_9fa48("14465"), open => stryMutAct_9fa48("14468") ? !open || setEditingNote(null) : stryMutAct_9fa48("14467") ? false : stryMutAct_9fa48("14466") ? true : (stryCov_9fa48("14466", "14467", "14468"), (stryMutAct_9fa48("14469") ? open : (stryCov_9fa48("14469"), !open)) && setEditingNote(null)))} noteId={editingNote.id} questionId={stryMutAct_9fa48("14470") ? editingNote.question.id : (stryCov_9fa48("14470"), editingNote.question?.id)} topicId={stryMutAct_9fa48("14471") ? editingNote.topic.id : (stryCov_9fa48("14471"), editingNote.topic?.id)} defaultTitle={editingNote.title} defaultContent={editingNote.content} onSuccess={() => {
        if (stryMutAct_9fa48("14472")) {
          {}
        } else {
          stryCov_9fa48("14472");
          setEditingNote(null);
          loadNotes();
        }
      }} />)}

      {/* Versions Dialog */}
      {stryMutAct_9fa48("14475") ? versionsNoteId || <NoteVersions noteId={versionsNoteId} open={!!versionsNoteId} onOpenChange={open => !open && setVersionsNoteId(null)} onRestore={() => {
        setVersionsNoteId(null);
        loadNotes();
      }} /> : stryMutAct_9fa48("14474") ? false : stryMutAct_9fa48("14473") ? true : (stryCov_9fa48("14473", "14474", "14475"), versionsNoteId && <NoteVersions noteId={versionsNoteId} open={stryMutAct_9fa48("14476") ? !versionsNoteId : (stryCov_9fa48("14476"), !(stryMutAct_9fa48("14477") ? versionsNoteId : (stryCov_9fa48("14477"), !versionsNoteId)))} onOpenChange={stryMutAct_9fa48("14478") ? () => undefined : (stryCov_9fa48("14478"), open => stryMutAct_9fa48("14481") ? !open || setVersionsNoteId(null) : stryMutAct_9fa48("14480") ? false : stryMutAct_9fa48("14479") ? true : (stryCov_9fa48("14479", "14480", "14481"), (stryMutAct_9fa48("14482") ? open : (stryCov_9fa48("14482"), !open)) && setVersionsNoteId(null)))} onRestore={() => {
        if (stryMutAct_9fa48("14483")) {
          {}
        } else {
          stryCov_9fa48("14483");
          setVersionsNoteId(null);
          loadNotes();
        }
      }} />)}
    </div>;
  }
}