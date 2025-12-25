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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, Plus, Edit, Trash2, CheckCircle2, Clock, BookOpen, PlayCircle, RotateCcw, Cards, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
import { captureError } from '@/lib/monitoring';
interface StudySchedule {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  durationMinutes: number;
  type: 'exam' | 'practice' | 'review' | 'flashcards' | 'custom';
  completed: boolean;
  completedAt: string | null;
  topic?: {
    id: string;
    nombre: string;
    subject: {
      nombre: string;
    };
  } | null;
  exam?: {
    id: string;
    titulo: string;
    subject: {
      nombre: string;
    };
  } | null;
}
export default function SchedulePage() {
  if (stryMutAct_9fa48("15233")) {
    {}
  } else {
    stryCov_9fa48("15233");
    const router = useRouter();
    const [schedules, setSchedules] = useState<StudySchedule[]>(stryMutAct_9fa48("15234") ? ["Stryker was here"] : (stryCov_9fa48("15234"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("15235") ? false : (stryCov_9fa48("15235"), true));
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(stryMutAct_9fa48("15236") ? true : (stryCov_9fa48("15236"), false));
    const [editingSchedule, setEditingSchedule] = useState<StudySchedule | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Form state
    const [formTitle, setFormTitle] = useState(stryMutAct_9fa48("15237") ? "Stryker was here!" : (stryCov_9fa48("15237"), ''));
    const [formDescription, setFormDescription] = useState(stryMutAct_9fa48("15238") ? "Stryker was here!" : (stryCov_9fa48("15238"), ''));
    const [formScheduledAt, setFormScheduledAt] = useState(stryMutAct_9fa48("15239") ? "Stryker was here!" : (stryCov_9fa48("15239"), ''));
    const [formDuration, setFormDuration] = useState(60);
    const [formType, setFormType] = useState<'exam' | 'practice' | 'review' | 'flashcards' | 'custom'>(stryMutAct_9fa48("15240") ? "" : (stryCov_9fa48("15240"), 'custom'));
    const [formTopicId, setFormTopicId] = useState<string>(stryMutAct_9fa48("15241") ? "Stryker was here!" : (stryCov_9fa48("15241"), ''));
    const [formExamId, setFormExamId] = useState<string>(stryMutAct_9fa48("15242") ? "Stryker was here!" : (stryCov_9fa48("15242"), ''));
    const [topics, setTopics] = useState<Array<{
      id: string;
      nombre: string;
    }>>(stryMutAct_9fa48("15243") ? ["Stryker was here"] : (stryCov_9fa48("15243"), []));
    const [exams, setExams] = useState<Array<{
      id: string;
      titulo: string;
    }>>(stryMutAct_9fa48("15244") ? ["Stryker was here"] : (stryCov_9fa48("15244"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("15245")) {
        {}
      } else {
        stryCov_9fa48("15245");
        loadSchedules();
        loadTopics();
        loadExams();
      }
    }, stryMutAct_9fa48("15246") ? [] : (stryCov_9fa48("15246"), [currentMonth]));
    async function loadSchedules() {
      if (stryMutAct_9fa48("15247")) {
        {}
      } else {
        stryCov_9fa48("15247");
        try {
          if (stryMutAct_9fa48("15248")) {
            {}
          } else {
            stryCov_9fa48("15248");
            setLoading(stryMutAct_9fa48("15249") ? false : (stryCov_9fa48("15249"), true));
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endOfMonth = new Date(currentMonth.getFullYear(), stryMutAct_9fa48("15250") ? currentMonth.getMonth() - 1 : (stryCov_9fa48("15250"), currentMonth.getMonth() + 1), 0, 23, 59, 59);
            const res = await fetch(stryMutAct_9fa48("15251") ? `` : (stryCov_9fa48("15251"), `/api/schedule?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`));
            if (stryMutAct_9fa48("15254") ? false : stryMutAct_9fa48("15253") ? true : stryMutAct_9fa48("15252") ? res.ok : (stryCov_9fa48("15252", "15253", "15254"), !res.ok)) throw new Error(stryMutAct_9fa48("15255") ? "" : (stryCov_9fa48("15255"), 'Error al cargar calendario'));
            const data = await res.json();
            setSchedules(stryMutAct_9fa48("15258") ? data.schedules && [] : stryMutAct_9fa48("15257") ? false : stryMutAct_9fa48("15256") ? true : (stryCov_9fa48("15256", "15257", "15258"), data.schedules || (stryMutAct_9fa48("15259") ? ["Stryker was here"] : (stryCov_9fa48("15259"), []))));
          }
        } catch (error) {
          if (stryMutAct_9fa48("15260")) {
            {}
          } else {
            stryCov_9fa48("15260");
            setError(error instanceof Error ? error.message : stryMutAct_9fa48("15261") ? "" : (stryCov_9fa48("15261"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("15262") ? "" : (stryCov_9fa48("15262"), 'Error al cargar calendario'));
          }
        } finally {
          if (stryMutAct_9fa48("15263")) {
            {}
          } else {
            stryCov_9fa48("15263");
            setLoading(stryMutAct_9fa48("15264") ? true : (stryCov_9fa48("15264"), false));
          }
        }
      }
    }
    async function loadTopics() {
      if (stryMutAct_9fa48("15265")) {
        {}
      } else {
        stryCov_9fa48("15265");
        try {
          if (stryMutAct_9fa48("15266")) {
            {}
          } else {
            stryCov_9fa48("15266");
            const res = await fetch(stryMutAct_9fa48("15267") ? "" : (stryCov_9fa48("15267"), '/api/topics'));
            if (stryMutAct_9fa48("15269") ? false : stryMutAct_9fa48("15268") ? true : (stryCov_9fa48("15268", "15269"), res.ok)) {
              if (stryMutAct_9fa48("15270")) {
                {}
              } else {
                stryCov_9fa48("15270");
                const data = await res.json();
                setTopics(stryMutAct_9fa48("15273") ? data.topics && [] : stryMutAct_9fa48("15272") ? false : stryMutAct_9fa48("15271") ? true : (stryCov_9fa48("15271", "15272", "15273"), data.topics || (stryMutAct_9fa48("15274") ? ["Stryker was here"] : (stryCov_9fa48("15274"), []))));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("15275")) {
            {}
          } else {
            stryCov_9fa48("15275");
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("15276") ? {} : (stryCov_9fa48("15276"), {
              type: stryMutAct_9fa48("15277") ? "" : (stryCov_9fa48("15277"), 'schedule_load_error'),
              action: stryMutAct_9fa48("15278") ? "" : (stryCov_9fa48("15278"), 'load_topics'),
              path: (stryMutAct_9fa48("15281") ? typeof window === 'undefined' : stryMutAct_9fa48("15280") ? false : stryMutAct_9fa48("15279") ? true : (stryCov_9fa48("15279", "15280", "15281"), typeof window !== (stryMutAct_9fa48("15282") ? "" : (stryCov_9fa48("15282"), 'undefined')))) ? window.location.pathname : undefined
            }));
          }
        }
      }
    }
    async function loadExams() {
      if (stryMutAct_9fa48("15283")) {
        {}
      } else {
        stryCov_9fa48("15283");
        try {
          if (stryMutAct_9fa48("15284")) {
            {}
          } else {
            stryCov_9fa48("15284");
            const res = await fetch(stryMutAct_9fa48("15285") ? "" : (stryCov_9fa48("15285"), '/api/exams'));
            if (stryMutAct_9fa48("15287") ? false : stryMutAct_9fa48("15286") ? true : (stryCov_9fa48("15286", "15287"), res.ok)) {
              if (stryMutAct_9fa48("15288")) {
                {}
              } else {
                stryCov_9fa48("15288");
                const data = await res.json();
                setExams(stryMutAct_9fa48("15291") ? data.exams && [] : stryMutAct_9fa48("15290") ? false : stryMutAct_9fa48("15289") ? true : (stryCov_9fa48("15289", "15290", "15291"), data.exams || (stryMutAct_9fa48("15292") ? ["Stryker was here"] : (stryCov_9fa48("15292"), []))));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("15293")) {
            {}
          } else {
            stryCov_9fa48("15293");
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("15294") ? {} : (stryCov_9fa48("15294"), {
              type: stryMutAct_9fa48("15295") ? "" : (stryCov_9fa48("15295"), 'schedule_load_error'),
              action: stryMutAct_9fa48("15296") ? "" : (stryCov_9fa48("15296"), 'load_exams'),
              path: (stryMutAct_9fa48("15299") ? typeof window === 'undefined' : stryMutAct_9fa48("15298") ? false : stryMutAct_9fa48("15297") ? true : (stryCov_9fa48("15297", "15298", "15299"), typeof window !== (stryMutAct_9fa48("15300") ? "" : (stryCov_9fa48("15300"), 'undefined')))) ? window.location.pathname : undefined
            }));
          }
        }
      }
    }
    const handleOpenDialog = (schedule?: StudySchedule) => {
      if (stryMutAct_9fa48("15301")) {
        {}
      } else {
        stryCov_9fa48("15301");
        if (stryMutAct_9fa48("15303") ? false : stryMutAct_9fa48("15302") ? true : (stryCov_9fa48("15302", "15303"), schedule)) {
          if (stryMutAct_9fa48("15304")) {
            {}
          } else {
            stryCov_9fa48("15304");
            setEditingSchedule(schedule);
            setFormTitle(schedule.title);
            setFormDescription(stryMutAct_9fa48("15307") ? schedule.description && '' : stryMutAct_9fa48("15306") ? false : stryMutAct_9fa48("15305") ? true : (stryCov_9fa48("15305", "15306", "15307"), schedule.description || (stryMutAct_9fa48("15308") ? "Stryker was here!" : (stryCov_9fa48("15308"), ''))));
            setFormScheduledAt(stryMutAct_9fa48("15309") ? new Date(schedule.scheduledAt).toISOString() : (stryCov_9fa48("15309"), new Date(schedule.scheduledAt).toISOString().slice(0, 16)));
            setFormDuration(schedule.durationMinutes);
            setFormType(schedule.type);
            setFormTopicId(stryMutAct_9fa48("15312") ? schedule.topic?.id && '' : stryMutAct_9fa48("15311") ? false : stryMutAct_9fa48("15310") ? true : (stryCov_9fa48("15310", "15311", "15312"), (stryMutAct_9fa48("15313") ? schedule.topic.id : (stryCov_9fa48("15313"), schedule.topic?.id)) || (stryMutAct_9fa48("15314") ? "Stryker was here!" : (stryCov_9fa48("15314"), ''))));
            setFormExamId(stryMutAct_9fa48("15317") ? schedule.exam?.id && '' : stryMutAct_9fa48("15316") ? false : stryMutAct_9fa48("15315") ? true : (stryCov_9fa48("15315", "15316", "15317"), (stryMutAct_9fa48("15318") ? schedule.exam.id : (stryCov_9fa48("15318"), schedule.exam?.id)) || (stryMutAct_9fa48("15319") ? "Stryker was here!" : (stryCov_9fa48("15319"), ''))));
          }
        } else {
          if (stryMutAct_9fa48("15320")) {
            {}
          } else {
            stryCov_9fa48("15320");
            setEditingSchedule(null);
            setFormTitle(stryMutAct_9fa48("15321") ? "Stryker was here!" : (stryCov_9fa48("15321"), ''));
            setFormDescription(stryMutAct_9fa48("15322") ? "Stryker was here!" : (stryCov_9fa48("15322"), ''));
            setFormScheduledAt(stryMutAct_9fa48("15323") ? "Stryker was here!" : (stryCov_9fa48("15323"), ''));
            setFormDuration(60);
            setFormType(stryMutAct_9fa48("15324") ? "" : (stryCov_9fa48("15324"), 'custom'));
            setFormTopicId(stryMutAct_9fa48("15325") ? "Stryker was here!" : (stryCov_9fa48("15325"), ''));
            setFormExamId(stryMutAct_9fa48("15326") ? "Stryker was here!" : (stryCov_9fa48("15326"), ''));
          }
        }
        setDialogOpen(stryMutAct_9fa48("15327") ? false : (stryCov_9fa48("15327"), true));
      }
    };
    const handleSubmit = async () => {
      if (stryMutAct_9fa48("15328")) {
        {}
      } else {
        stryCov_9fa48("15328");
        if (stryMutAct_9fa48("15331") ? !formTitle.trim() && !formScheduledAt : stryMutAct_9fa48("15330") ? false : stryMutAct_9fa48("15329") ? true : (stryCov_9fa48("15329", "15330", "15331"), (stryMutAct_9fa48("15332") ? formTitle.trim() : (stryCov_9fa48("15332"), !(stryMutAct_9fa48("15333") ? formTitle : (stryCov_9fa48("15333"), formTitle.trim())))) || (stryMutAct_9fa48("15334") ? formScheduledAt : (stryCov_9fa48("15334"), !formScheduledAt)))) {
          if (stryMutAct_9fa48("15335")) {
            {}
          } else {
            stryCov_9fa48("15335");
            toast.error(stryMutAct_9fa48("15336") ? "" : (stryCov_9fa48("15336"), 'Por favor completa título y fecha'));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("15337")) {
            {}
          } else {
            stryCov_9fa48("15337");
            const url = editingSchedule ? stryMutAct_9fa48("15338") ? `` : (stryCov_9fa48("15338"), `/api/schedule?scheduleId=${editingSchedule.id}`) : stryMutAct_9fa48("15339") ? "" : (stryCov_9fa48("15339"), '/api/schedule');
            const method = editingSchedule ? stryMutAct_9fa48("15340") ? "" : (stryCov_9fa48("15340"), 'PUT') : stryMutAct_9fa48("15341") ? "" : (stryCov_9fa48("15341"), 'POST');
            const body = editingSchedule ? stryMutAct_9fa48("15342") ? {} : (stryCov_9fa48("15342"), {
              title: stryMutAct_9fa48("15343") ? formTitle : (stryCov_9fa48("15343"), formTitle.trim()),
              description: stryMutAct_9fa48("15346") ? formDescription.trim() && undefined : stryMutAct_9fa48("15345") ? false : stryMutAct_9fa48("15344") ? true : (stryCov_9fa48("15344", "15345", "15346"), (stryMutAct_9fa48("15347") ? formDescription : (stryCov_9fa48("15347"), formDescription.trim())) || undefined),
              scheduledAt: formScheduledAt,
              durationMinutes: formDuration,
              completed: editingSchedule.completed
            }) : stryMutAct_9fa48("15348") ? {} : (stryCov_9fa48("15348"), {
              title: stryMutAct_9fa48("15349") ? formTitle : (stryCov_9fa48("15349"), formTitle.trim()),
              description: stryMutAct_9fa48("15352") ? formDescription.trim() && undefined : stryMutAct_9fa48("15351") ? false : stryMutAct_9fa48("15350") ? true : (stryCov_9fa48("15350", "15351", "15352"), (stryMutAct_9fa48("15353") ? formDescription : (stryCov_9fa48("15353"), formDescription.trim())) || undefined),
              scheduledAt: formScheduledAt,
              durationMinutes: formDuration,
              type: formType,
              topicId: stryMutAct_9fa48("15356") ? formTopicId && undefined : stryMutAct_9fa48("15355") ? false : stryMutAct_9fa48("15354") ? true : (stryCov_9fa48("15354", "15355", "15356"), formTopicId || undefined),
              examId: stryMutAct_9fa48("15359") ? formExamId && undefined : stryMutAct_9fa48("15358") ? false : stryMutAct_9fa48("15357") ? true : (stryCov_9fa48("15357", "15358", "15359"), formExamId || undefined)
            });
            const res = await fetch(url, stryMutAct_9fa48("15360") ? {} : (stryCov_9fa48("15360"), {
              method,
              headers: stryMutAct_9fa48("15361") ? {} : (stryCov_9fa48("15361"), {
                'Content-Type': stryMutAct_9fa48("15362") ? "" : (stryCov_9fa48("15362"), 'application/json')
              }),
              body: JSON.stringify(body)
            }));
            if (stryMutAct_9fa48("15365") ? false : stryMutAct_9fa48("15364") ? true : stryMutAct_9fa48("15363") ? res.ok : (stryCov_9fa48("15363", "15364", "15365"), !res.ok)) {
              if (stryMutAct_9fa48("15366")) {
                {}
              } else {
                stryCov_9fa48("15366");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("15367") ? "" : (stryCov_9fa48("15367"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                }>(res, stryMutAct_9fa48("15368") ? {} : (stryCov_9fa48("15368"), {
                  path: (stryMutAct_9fa48("15371") ? typeof window === 'undefined' : stryMutAct_9fa48("15370") ? false : stryMutAct_9fa48("15369") ? true : (stryCov_9fa48("15369", "15370", "15371"), typeof window !== (stryMutAct_9fa48("15372") ? "" : (stryCov_9fa48("15372"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("15373") ? "" : (stryCov_9fa48("15373"), '/schedule'),
                  operation: stryMutAct_9fa48("15374") ? "" : (stryCov_9fa48("15374"), 'guardar sesión')
                }));
                throw new Error(stryMutAct_9fa48("15377") ? errorData.error && 'Error al guardar sesión' : stryMutAct_9fa48("15376") ? false : stryMutAct_9fa48("15375") ? true : (stryCov_9fa48("15375", "15376", "15377"), errorData.error || (stryMutAct_9fa48("15378") ? "" : (stryCov_9fa48("15378"), 'Error al guardar sesión'))));
              }
            }
            toast.success(editingSchedule ? stryMutAct_9fa48("15379") ? "" : (stryCov_9fa48("15379"), 'Sesión actualizada') : stryMutAct_9fa48("15380") ? "" : (stryCov_9fa48("15380"), 'Sesión creada'));
            setDialogOpen(stryMutAct_9fa48("15381") ? true : (stryCov_9fa48("15381"), false));
            loadSchedules();
          }
        } catch (error) {
          if (stryMutAct_9fa48("15382")) {
            {}
          } else {
            stryCov_9fa48("15382");
            const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("15383") ? "" : (stryCov_9fa48("15383"), 'Error desconocido');
            toast.error(stryMutAct_9fa48("15384") ? "" : (stryCov_9fa48("15384"), 'Error'), stryMutAct_9fa48("15385") ? {} : (stryCov_9fa48("15385"), {
              description: errorMessage
            }));
          }
        }
      }
    };
    const handleDelete = async (scheduleId: string) => {
      if (stryMutAct_9fa48("15386")) {
        {}
      } else {
        stryCov_9fa48("15386");
        if (stryMutAct_9fa48("15389") ? false : stryMutAct_9fa48("15388") ? true : stryMutAct_9fa48("15387") ? confirm('¿Estás seguro de que quieres eliminar esta sesión?') : (stryCov_9fa48("15387", "15388", "15389"), !confirm(stryMutAct_9fa48("15390") ? "" : (stryCov_9fa48("15390"), '¿Estás seguro de que quieres eliminar esta sesión?')))) return;
        try {
          if (stryMutAct_9fa48("15391")) {
            {}
          } else {
            stryCov_9fa48("15391");
            const res = await fetch(stryMutAct_9fa48("15392") ? `` : (stryCov_9fa48("15392"), `/api/schedule?scheduleId=${scheduleId}`), stryMutAct_9fa48("15393") ? {} : (stryCov_9fa48("15393"), {
              method: stryMutAct_9fa48("15394") ? "" : (stryCov_9fa48("15394"), 'DELETE')
            }));
            if (stryMutAct_9fa48("15397") ? false : stryMutAct_9fa48("15396") ? true : stryMutAct_9fa48("15395") ? res.ok : (stryCov_9fa48("15395", "15396", "15397"), !res.ok)) throw new Error(stryMutAct_9fa48("15398") ? "" : (stryCov_9fa48("15398"), 'Error al eliminar sesión'));
            toast.success(stryMutAct_9fa48("15399") ? "" : (stryCov_9fa48("15399"), 'Sesión eliminada'));
            loadSchedules();
          }
        } catch (error) {
          if (stryMutAct_9fa48("15400")) {
            {}
          } else {
            stryCov_9fa48("15400");
            toast.error(stryMutAct_9fa48("15401") ? "" : (stryCov_9fa48("15401"), 'Error al eliminar sesión'));
          }
        }
      }
    };
    const handleToggleComplete = async (schedule: StudySchedule) => {
      if (stryMutAct_9fa48("15402")) {
        {}
      } else {
        stryCov_9fa48("15402");
        try {
          if (stryMutAct_9fa48("15403")) {
            {}
          } else {
            stryCov_9fa48("15403");
            const res = await fetch(stryMutAct_9fa48("15404") ? `` : (stryCov_9fa48("15404"), `/api/schedule?scheduleId=${schedule.id}`), stryMutAct_9fa48("15405") ? {} : (stryCov_9fa48("15405"), {
              method: stryMutAct_9fa48("15406") ? "" : (stryCov_9fa48("15406"), 'PUT'),
              headers: stryMutAct_9fa48("15407") ? {} : (stryCov_9fa48("15407"), {
                'Content-Type': stryMutAct_9fa48("15408") ? "" : (stryCov_9fa48("15408"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("15409") ? {} : (stryCov_9fa48("15409"), {
                completed: stryMutAct_9fa48("15410") ? schedule.completed : (stryCov_9fa48("15410"), !schedule.completed)
              }))
            }));
            if (stryMutAct_9fa48("15413") ? false : stryMutAct_9fa48("15412") ? true : stryMutAct_9fa48("15411") ? res.ok : (stryCov_9fa48("15411", "15412", "15413"), !res.ok)) throw new Error(stryMutAct_9fa48("15414") ? "" : (stryCov_9fa48("15414"), 'Error al actualizar sesión'));
            toast.success(schedule.completed ? stryMutAct_9fa48("15415") ? "" : (stryCov_9fa48("15415"), 'Sesión marcada como pendiente') : stryMutAct_9fa48("15416") ? "" : (stryCov_9fa48("15416"), 'Sesión completada'));
            loadSchedules();
          }
        } catch (error) {
          if (stryMutAct_9fa48("15417")) {
            {}
          } else {
            stryCov_9fa48("15417");
            toast.error(stryMutAct_9fa48("15418") ? "" : (stryCov_9fa48("15418"), 'Error al actualizar sesión'));
          }
        }
      }
    };
    const getTypeIcon = (type: string) => {
      if (stryMutAct_9fa48("15419")) {
        {}
      } else {
        stryCov_9fa48("15419");
        switch (type) {
          case stryMutAct_9fa48("15421") ? "" : (stryCov_9fa48("15421"), 'exam'):
            if (stryMutAct_9fa48("15420")) {} else {
              stryCov_9fa48("15420");
              return <FileText className="h-4 w-4" />;
            }
          case stryMutAct_9fa48("15423") ? "" : (stryCov_9fa48("15423"), 'practice'):
            if (stryMutAct_9fa48("15422")) {} else {
              stryCov_9fa48("15422");
              return <PlayCircle className="h-4 w-4" />;
            }
          case stryMutAct_9fa48("15425") ? "" : (stryCov_9fa48("15425"), 'review'):
            if (stryMutAct_9fa48("15424")) {} else {
              stryCov_9fa48("15424");
              return <RotateCcw className="h-4 w-4" />;
            }
          case stryMutAct_9fa48("15427") ? "" : (stryCov_9fa48("15427"), 'flashcards'):
            if (stryMutAct_9fa48("15426")) {} else {
              stryCov_9fa48("15426");
              return <Cards className="h-4 w-4" />;
            }
          default:
            if (stryMutAct_9fa48("15428")) {} else {
              stryCov_9fa48("15428");
              return <BookOpen className="h-4 w-4" />;
            }
        }
      }
    };
    const getTypeLabel = (type: string) => {
      if (stryMutAct_9fa48("15429")) {
        {}
      } else {
        stryCov_9fa48("15429");
        switch (type) {
          case stryMutAct_9fa48("15431") ? "" : (stryCov_9fa48("15431"), 'exam'):
            if (stryMutAct_9fa48("15430")) {} else {
              stryCov_9fa48("15430");
              return stryMutAct_9fa48("15432") ? "" : (stryCov_9fa48("15432"), 'Examen');
            }
          case stryMutAct_9fa48("15434") ? "" : (stryCov_9fa48("15434"), 'practice'):
            if (stryMutAct_9fa48("15433")) {} else {
              stryCov_9fa48("15433");
              return stryMutAct_9fa48("15435") ? "" : (stryCov_9fa48("15435"), 'Práctica');
            }
          case stryMutAct_9fa48("15437") ? "" : (stryCov_9fa48("15437"), 'review'):
            if (stryMutAct_9fa48("15436")) {} else {
              stryCov_9fa48("15436");
              return stryMutAct_9fa48("15438") ? "" : (stryCov_9fa48("15438"), 'Repaso');
            }
          case stryMutAct_9fa48("15440") ? "" : (stryCov_9fa48("15440"), 'flashcards'):
            if (stryMutAct_9fa48("15439")) {} else {
              stryCov_9fa48("15439");
              return stryMutAct_9fa48("15441") ? "" : (stryCov_9fa48("15441"), 'Flashcards');
            }
          default:
            if (stryMutAct_9fa48("15442")) {} else {
              stryCov_9fa48("15442");
              return stryMutAct_9fa48("15443") ? "" : (stryCov_9fa48("15443"), 'Personalizado');
            }
        }
      }
    };

    // Memoizar agrupación de schedules por fecha para evitar recálculos innecesarios
    const schedulesByDate = useMemo(() => {
      if (stryMutAct_9fa48("15444")) {
        {}
      } else {
        stryCov_9fa48("15444");
        const grouped = new Map<string, StudySchedule[]>();
        schedules.forEach(schedule => {
          if (stryMutAct_9fa48("15445")) {
            {}
          } else {
            stryCov_9fa48("15445");
            const date = new Date(schedule.scheduledAt).toISOString().split(stryMutAct_9fa48("15446") ? "" : (stryCov_9fa48("15446"), 'T'))[0];
            if (stryMutAct_9fa48("15449") ? false : stryMutAct_9fa48("15448") ? true : stryMutAct_9fa48("15447") ? grouped.has(date) : (stryCov_9fa48("15447", "15448", "15449"), !grouped.has(date))) {
              if (stryMutAct_9fa48("15450")) {
                {}
              } else {
                stryCov_9fa48("15450");
                grouped.set(date, stryMutAct_9fa48("15451") ? ["Stryker was here"] : (stryCov_9fa48("15451"), []));
              }
            }
            grouped.get(date)!.push(schedule);
          }
        });
        return grouped;
      }
    }, stryMutAct_9fa48("15452") ? [] : (stryCov_9fa48("15452"), [schedules]));
    const navigateMonth = (direction: 'prev' | 'next') => {
      if (stryMutAct_9fa48("15453")) {
        {}
      } else {
        stryCov_9fa48("15453");
        setCurrentMonth(prev => {
          if (stryMutAct_9fa48("15454")) {
            {}
          } else {
            stryCov_9fa48("15454");
            const newDate = new Date(prev);
            if (stryMutAct_9fa48("15457") ? direction !== 'prev' : stryMutAct_9fa48("15456") ? false : stryMutAct_9fa48("15455") ? true : (stryCov_9fa48("15455", "15456", "15457"), direction === (stryMutAct_9fa48("15458") ? "" : (stryCov_9fa48("15458"), 'prev')))) {
              if (stryMutAct_9fa48("15459")) {
                {}
              } else {
                stryCov_9fa48("15459");
                stryMutAct_9fa48("15460") ? newDate.setFullYear(prev.getMonth() - 1) : (stryCov_9fa48("15460"), newDate.setMonth(stryMutAct_9fa48("15461") ? prev.getMonth() + 1 : (stryCov_9fa48("15461"), prev.getMonth() - 1)));
              }
            } else {
              if (stryMutAct_9fa48("15462")) {
                {}
              } else {
                stryCov_9fa48("15462");
                stryMutAct_9fa48("15463") ? newDate.setFullYear(prev.getMonth() + 1) : (stryCov_9fa48("15463"), newDate.setMonth(stryMutAct_9fa48("15464") ? prev.getMonth() - 1 : (stryCov_9fa48("15464"), prev.getMonth() + 1)));
              }
            }
            return newDate;
          }
        });
      }
    };
    if (stryMutAct_9fa48("15466") ? false : stryMutAct_9fa48("15465") ? true : (stryCov_9fa48("15465", "15466"), loading)) {
      if (stryMutAct_9fa48("15467")) {
        {}
      } else {
        stryCov_9fa48("15467");
        return <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stryMutAct_9fa48("15468") ? [] : (stryCov_9fa48("15468"), [1, 2, 3])).map(stryMutAct_9fa48("15469") ? () => undefined : (stryCov_9fa48("15469"), i => <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const monthName = currentMonth.toLocaleDateString(stryMutAct_9fa48("15470") ? "" : (stryCov_9fa48("15470"), 'es-ES'), stryMutAct_9fa48("15471") ? {} : (stryCov_9fa48("15471"), {
      month: stryMutAct_9fa48("15472") ? "" : (stryCov_9fa48("15472"), 'long'),
      year: stryMutAct_9fa48("15473") ? "" : (stryCov_9fa48("15473"), 'numeric')
    }));
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Calendario de Estudio
          </h1>
          <p className="text-muted-foreground mt-2">
            Planifica tus sesiones de estudio y mantén un hábito constante
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={stryMutAct_9fa48("15474") ? () => undefined : (stryCov_9fa48("15474"), () => handleOpenDialog())}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sesión
          </Button>
          <HelpIcon content="Planifica tus sesiones de estudio para mantener un hábito constante. Puedes programar exámenes, prácticas, repasos y más." />
        </div>
      </div>

      {/* Month Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={stryMutAct_9fa48("15475") ? () => undefined : (stryCov_9fa48("15475"), () => navigateMonth(stryMutAct_9fa48("15476") ? "" : (stryCov_9fa48("15476"), 'prev')))}>
              ← Anterior
            </Button>
            <CardTitle className="capitalize">{monthName}</CardTitle>
            <Button variant="outline" onClick={stryMutAct_9fa48("15477") ? () => undefined : (stryCov_9fa48("15477"), () => navigateMonth(stryMutAct_9fa48("15478") ? "" : (stryCov_9fa48("15478"), 'next')))}>
              Siguiente →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(stryMutAct_9fa48("15481") ? schedules.length !== 0 : stryMutAct_9fa48("15480") ? false : stryMutAct_9fa48("15479") ? true : (stryCov_9fa48("15479", "15480", "15481"), schedules.length === 0)) ? <div className="text-center py-8 text-muted-foreground">
              No hay sesiones programadas para este mes
            </div> : <div className="space-y-4">
              {stryMutAct_9fa48("15482") ? Array.from(schedulesByDate.entries()).map(([date, daySchedules]) => <div key={date} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {new Date(date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {daySchedules.length} sesión{daySchedules.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {daySchedules.map(schedule => <Card key={schedule.id} className={schedule.completed ? 'opacity-60' : ''}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(schedule.type)}
                                  <CardTitle className="text-base">{schedule.title}</CardTitle>
                                  <Badge variant="outline">{getTypeLabel(schedule.type)}</Badge>
                                  {schedule.completed && <Badge variant="default" className="bg-green-600">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completada
                                    </Badge>}
                                </div>
                                {schedule.description && <p className="text-sm text-muted-foreground mb-2">
                                    {schedule.description}
                                  </p>}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(schedule.scheduledAt).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                                  </div>
                                  <span>{schedule.durationMinutes} min</span>
                                  {schedule.topic && <span>
                                      {schedule.topic.subject.nombre} • {schedule.topic.nombre}
                                    </span>}
                                  {schedule.exam && <span>
                                      {schedule.exam.subject.nombre} • {schedule.exam.titulo}
                                    </span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <Button variant="ghost" size="sm" onClick={() => handleToggleComplete(schedule)} title={schedule.completed ? 'Marcar como pendiente' : 'Marcar como completada'}>
                                  <CheckCircle2 className={`h-4 w-4 ${schedule.completed ? 'text-green-600' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(schedule)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>)}
                    </div>
                  </div>) : (stryCov_9fa48("15482"), Array.from(schedulesByDate.entries()).sort(stryMutAct_9fa48("15483") ? () => undefined : (stryCov_9fa48("15483"), (a, b) => a[0].localeCompare(b[0]))).map(stryMutAct_9fa48("15484") ? () => undefined : (stryCov_9fa48("15484"), ([date, daySchedules]) => <div key={date} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {new Date(date).toLocaleDateString(stryMutAct_9fa48("15485") ? "" : (stryCov_9fa48("15485"), 'es-ES'), stryMutAct_9fa48("15486") ? {} : (stryCov_9fa48("15486"), {
                    weekday: stryMutAct_9fa48("15487") ? "" : (stryCov_9fa48("15487"), 'long'),
                    day: stryMutAct_9fa48("15488") ? "" : (stryCov_9fa48("15488"), 'numeric'),
                    month: stryMutAct_9fa48("15489") ? "" : (stryCov_9fa48("15489"), 'long')
                  }))}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {daySchedules.length} sesión{(stryMutAct_9fa48("15492") ? daySchedules.length === 1 : stryMutAct_9fa48("15491") ? false : stryMutAct_9fa48("15490") ? true : (stryCov_9fa48("15490", "15491", "15492"), daySchedules.length !== 1)) ? stryMutAct_9fa48("15493") ? "" : (stryCov_9fa48("15493"), 'es') : stryMutAct_9fa48("15494") ? "Stryker was here!" : (stryCov_9fa48("15494"), '')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {daySchedules.map(stryMutAct_9fa48("15495") ? () => undefined : (stryCov_9fa48("15495"), schedule => <Card key={schedule.id} className={schedule.completed ? stryMutAct_9fa48("15496") ? "" : (stryCov_9fa48("15496"), 'opacity-60') : stryMutAct_9fa48("15497") ? "Stryker was here!" : (stryCov_9fa48("15497"), '')}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(schedule.type)}
                                  <CardTitle className="text-base">{schedule.title}</CardTitle>
                                  <Badge variant="outline">{getTypeLabel(schedule.type)}</Badge>
                                  {stryMutAct_9fa48("15500") ? schedule.completed || <Badge variant="default" className="bg-green-600">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completada
                                    </Badge> : stryMutAct_9fa48("15499") ? false : stryMutAct_9fa48("15498") ? true : (stryCov_9fa48("15498", "15499", "15500"), schedule.completed && <Badge variant="default" className="bg-green-600">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completada
                                    </Badge>)}
                                </div>
                                {stryMutAct_9fa48("15503") ? schedule.description || <p className="text-sm text-muted-foreground mb-2">
                                    {schedule.description}
                                  </p> : stryMutAct_9fa48("15502") ? false : stryMutAct_9fa48("15501") ? true : (stryCov_9fa48("15501", "15502", "15503"), schedule.description && <p className="text-sm text-muted-foreground mb-2">
                                    {schedule.description}
                                  </p>)}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(schedule.scheduledAt).toLocaleTimeString(stryMutAct_9fa48("15504") ? "" : (stryCov_9fa48("15504"), 'es-ES'), stryMutAct_9fa48("15505") ? {} : (stryCov_9fa48("15505"), {
                              hour: stryMutAct_9fa48("15506") ? "" : (stryCov_9fa48("15506"), '2-digit'),
                              minute: stryMutAct_9fa48("15507") ? "" : (stryCov_9fa48("15507"), '2-digit')
                            }))}
                                  </div>
                                  <span>{schedule.durationMinutes} min</span>
                                  {stryMutAct_9fa48("15510") ? schedule.topic || <span>
                                      {schedule.topic.subject.nombre} • {schedule.topic.nombre}
                                    </span> : stryMutAct_9fa48("15509") ? false : stryMutAct_9fa48("15508") ? true : (stryCov_9fa48("15508", "15509", "15510"), schedule.topic && <span>
                                      {schedule.topic.subject.nombre} • {schedule.topic.nombre}
                                    </span>)}
                                  {stryMutAct_9fa48("15513") ? schedule.exam || <span>
                                      {schedule.exam.subject.nombre} • {schedule.exam.titulo}
                                    </span> : stryMutAct_9fa48("15512") ? false : stryMutAct_9fa48("15511") ? true : (stryCov_9fa48("15511", "15512", "15513"), schedule.exam && <span>
                                      {schedule.exam.subject.nombre} • {schedule.exam.titulo}
                                    </span>)}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("15514") ? () => undefined : (stryCov_9fa48("15514"), () => handleToggleComplete(schedule))} title={schedule.completed ? stryMutAct_9fa48("15515") ? "" : (stryCov_9fa48("15515"), 'Marcar como pendiente') : stryMutAct_9fa48("15516") ? "" : (stryCov_9fa48("15516"), 'Marcar como completada')}>
                                  <CheckCircle2 className={stryMutAct_9fa48("15517") ? `` : (stryCov_9fa48("15517"), `h-4 w-4 ${schedule.completed ? stryMutAct_9fa48("15518") ? "" : (stryCov_9fa48("15518"), 'text-green-600') : stryMutAct_9fa48("15519") ? "Stryker was here!" : (stryCov_9fa48("15519"), '')}`)} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("15520") ? () => undefined : (stryCov_9fa48("15520"), () => handleOpenDialog(schedule))}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("15521") ? () => undefined : (stryCov_9fa48("15521"), () => handleDelete(schedule.id))}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>))}
                    </div>
                  </div>)))}
            </div>}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? stryMutAct_9fa48("15522") ? "" : (stryCov_9fa48("15522"), 'Editar Sesión') : stryMutAct_9fa48("15523") ? "" : (stryCov_9fa48("15523"), 'Nueva Sesión de Estudio')}
            </DialogTitle>
            <DialogDescription>
              {editingSchedule ? stryMutAct_9fa48("15524") ? "" : (stryCov_9fa48("15524"), 'Modifica los detalles de tu sesión de estudio') : stryMutAct_9fa48("15525") ? "" : (stryCov_9fa48("15525"), 'Planifica una nueva sesión de estudio')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={formTitle} onChange={stryMutAct_9fa48("15526") ? () => undefined : (stryCov_9fa48("15526"), e => setFormTitle(e.target.value))} placeholder="Ej: Repaso de Matemáticas" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={formDescription} onChange={stryMutAct_9fa48("15527") ? () => undefined : (stryCov_9fa48("15527"), e => setFormDescription(e.target.value))} placeholder="Notas adicionales sobre esta sesión..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Fecha y Hora *</Label>
                <Input id="scheduledAt" type="datetime-local" value={formScheduledAt} onChange={stryMutAct_9fa48("15528") ? () => undefined : (stryCov_9fa48("15528"), e => setFormScheduledAt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input id="duration" type="number" min="15" max="480" value={formDuration} onChange={stryMutAct_9fa48("15529") ? () => undefined : (stryCov_9fa48("15529"), e => setFormDuration(stryMutAct_9fa48("15532") ? parseInt(e.target.value) && 60 : stryMutAct_9fa48("15531") ? false : stryMutAct_9fa48("15530") ? true : (stryCov_9fa48("15530", "15531", "15532"), parseInt(e.target.value) || 60)))} />
              </div>
            </div>
            {stryMutAct_9fa48("15535") ? !editingSchedule || <>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Sesión</Label>
                  <Select value={formType} onValueChange={v => setFormType(v as 'exam' | 'practice' | 'review' | 'flashcards' | 'custom')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Personalizado</SelectItem>
                      <SelectItem value="exam">Examen</SelectItem>
                      <SelectItem value="practice">Práctica</SelectItem>
                      <SelectItem value="review">Repaso</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(formType === 'practice' || formType === 'review') && <div className="space-y-2">
                    <Label htmlFor="topicId">Tema (opcional)</Label>
                    <Select value={formTopicId} onValueChange={setFormTopicId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {topics.map(topic => <SelectItem key={topic.id} value={topic.id}>
                            {topic.nombre}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>}
                {formType === 'exam' && <div className="space-y-2">
                    <Label htmlFor="examId">Examen (opcional)</Label>
                    <Select value={formExamId} onValueChange={setFormExamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {exams.map(exam => <SelectItem key={exam.id} value={exam.id}>
                            {exam.titulo}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>}
              </> : stryMutAct_9fa48("15534") ? false : stryMutAct_9fa48("15533") ? true : (stryCov_9fa48("15533", "15534", "15535"), (stryMutAct_9fa48("15536") ? editingSchedule : (stryCov_9fa48("15536"), !editingSchedule)) && <>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Sesión</Label>
                  <Select value={formType} onValueChange={stryMutAct_9fa48("15537") ? () => undefined : (stryCov_9fa48("15537"), v => setFormType(v as 'exam' | 'practice' | 'review' | 'flashcards' | 'custom'))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Personalizado</SelectItem>
                      <SelectItem value="exam">Examen</SelectItem>
                      <SelectItem value="practice">Práctica</SelectItem>
                      <SelectItem value="review">Repaso</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {stryMutAct_9fa48("15540") ? formType === 'practice' || formType === 'review' || <div className="space-y-2">
                    <Label htmlFor="topicId">Tema (opcional)</Label>
                    <Select value={formTopicId} onValueChange={setFormTopicId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {topics.map(topic => <SelectItem key={topic.id} value={topic.id}>
                            {topic.nombre}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div> : stryMutAct_9fa48("15539") ? false : stryMutAct_9fa48("15538") ? true : (stryCov_9fa48("15538", "15539", "15540"), (stryMutAct_9fa48("15542") ? formType === 'practice' && formType === 'review' : stryMutAct_9fa48("15541") ? true : (stryCov_9fa48("15541", "15542"), (stryMutAct_9fa48("15544") ? formType !== 'practice' : stryMutAct_9fa48("15543") ? false : (stryCov_9fa48("15543", "15544"), formType === (stryMutAct_9fa48("15545") ? "" : (stryCov_9fa48("15545"), 'practice')))) || (stryMutAct_9fa48("15547") ? formType !== 'review' : stryMutAct_9fa48("15546") ? false : (stryCov_9fa48("15546", "15547"), formType === (stryMutAct_9fa48("15548") ? "" : (stryCov_9fa48("15548"), 'review')))))) && <div className="space-y-2">
                    <Label htmlFor="topicId">Tema (opcional)</Label>
                    <Select value={formTopicId} onValueChange={setFormTopicId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {topics.map(stryMutAct_9fa48("15549") ? () => undefined : (stryCov_9fa48("15549"), topic => <SelectItem key={topic.id} value={topic.id}>
                            {topic.nombre}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>)}
                {stryMutAct_9fa48("15552") ? formType === 'exam' || <div className="space-y-2">
                    <Label htmlFor="examId">Examen (opcional)</Label>
                    <Select value={formExamId} onValueChange={setFormExamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {exams.map(exam => <SelectItem key={exam.id} value={exam.id}>
                            {exam.titulo}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div> : stryMutAct_9fa48("15551") ? false : stryMutAct_9fa48("15550") ? true : (stryCov_9fa48("15550", "15551", "15552"), (stryMutAct_9fa48("15554") ? formType !== 'exam' : stryMutAct_9fa48("15553") ? true : (stryCov_9fa48("15553", "15554"), formType === (stryMutAct_9fa48("15555") ? "" : (stryCov_9fa48("15555"), 'exam')))) && <div className="space-y-2">
                    <Label htmlFor="examId">Examen (opcional)</Label>
                    <Select value={formExamId} onValueChange={setFormExamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {exams.map(stryMutAct_9fa48("15556") ? () => undefined : (stryCov_9fa48("15556"), exam => <SelectItem key={exam.id} value={exam.id}>
                            {exam.titulo}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>)}
              </>)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={stryMutAct_9fa48("15557") ? () => undefined : (stryCov_9fa48("15557"), () => setDialogOpen(stryMutAct_9fa48("15558") ? true : (stryCov_9fa48("15558"), false)))}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>{editingSchedule ? stryMutAct_9fa48("15559") ? "" : (stryCov_9fa48("15559"), 'Actualizar') : stryMutAct_9fa48("15560") ? "" : (stryCov_9fa48("15560"), 'Crear')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
  }
}