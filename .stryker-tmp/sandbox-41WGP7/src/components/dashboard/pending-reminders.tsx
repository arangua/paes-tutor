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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// ScrollArea no existe, usaremos un div con overflow
import { Clock, FileText, BookOpen, Trophy, AlertCircle, CheckCircle2, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpIcon } from '@/components/help/help-icon';
import { cn } from '@/lib/utils';
interface PendingAttempt {
  id: string;
  exam: {
    id?: string;
    titulo: string;
    subject: {
      codigo: string;
      nombre: string;
    };
  };
  startedAt: string;
  totalPreguntas: number;
  correctas: number;
}
interface PendingReminder {
  id: string;
  type: 'exam' | 'flashcard' | 'challenge' | 'note' | 'review';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl: string;
  metadata?: {
    subject?: string;
    count?: number;
    dueDate?: string;
  };
}
interface PendingRemindersProps {
  pendingAttempts?: PendingAttempt[];
  pendingFlashcards?: number;
  pendingChallenges?: number;
  pendingReviews?: number;
}

/**
 * Componente para mostrar recordatorios visuales de tareas pendientes
 * Basado en Nielsen Heuristic #1: Visibility of system status
 */
export function PendingReminders({
  pendingAttempts = stryMutAct_9fa48("16766") ? ["Stryker was here"] : (stryCov_9fa48("16766"), []),
  pendingFlashcards = 0,
  pendingChallenges = 0,
  pendingReviews = 0
}: PendingRemindersProps) {
  if (stryMutAct_9fa48("16767")) {
    {}
  } else {
    stryCov_9fa48("16767");
    const reminders: PendingReminder[] = stryMutAct_9fa48("16768") ? ["Stryker was here"] : (stryCov_9fa48("16768"), []);

    // Agregar exámenes en progreso
    pendingAttempts.forEach(attempt => {
      if (stryMutAct_9fa48("16769")) {
        {}
      } else {
        stryCov_9fa48("16769");
        const daysSinceStart = Math.floor(stryMutAct_9fa48("16770") ? (Date.now() - new Date(attempt.startedAt).getTime()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("16770"), (stryMutAct_9fa48("16771") ? Date.now() + new Date(attempt.startedAt).getTime() : (stryCov_9fa48("16771"), Date.now() - new Date(attempt.startedAt).getTime())) / (stryMutAct_9fa48("16772") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("16772"), (stryMutAct_9fa48("16773") ? 1000 * 60 / 60 : (stryCov_9fa48("16773"), (stryMutAct_9fa48("16774") ? 1000 / 60 : (stryCov_9fa48("16774"), 1000 * 60)) * 60)) * 24))));
        reminders.push(stryMutAct_9fa48("16775") ? {} : (stryCov_9fa48("16775"), {
          id: stryMutAct_9fa48("16776") ? `` : (stryCov_9fa48("16776"), `attempt-${attempt.id}`),
          type: stryMutAct_9fa48("16777") ? "" : (stryCov_9fa48("16777"), 'exam'),
          title: attempt.exam.titulo,
          description: stryMutAct_9fa48("16778") ? `` : (stryCov_9fa48("16778"), `Examen en progreso desde hace ${daysSinceStart} ${(stryMutAct_9fa48("16781") ? daysSinceStart !== 1 : stryMutAct_9fa48("16780") ? false : stryMutAct_9fa48("16779") ? true : (stryCov_9fa48("16779", "16780", "16781"), daysSinceStart === 1)) ? stryMutAct_9fa48("16782") ? "" : (stryCov_9fa48("16782"), 'día') : stryMutAct_9fa48("16783") ? "" : (stryCov_9fa48("16783"), 'días')}`),
          priority: (stryMutAct_9fa48("16787") ? daysSinceStart < 3 : stryMutAct_9fa48("16786") ? daysSinceStart > 3 : stryMutAct_9fa48("16785") ? false : stryMutAct_9fa48("16784") ? true : (stryCov_9fa48("16784", "16785", "16786", "16787"), daysSinceStart >= 3)) ? stryMutAct_9fa48("16788") ? "" : (stryCov_9fa48("16788"), 'high') : (stryMutAct_9fa48("16792") ? daysSinceStart < 1 : stryMutAct_9fa48("16791") ? daysSinceStart > 1 : stryMutAct_9fa48("16790") ? false : stryMutAct_9fa48("16789") ? true : (stryCov_9fa48("16789", "16790", "16791", "16792"), daysSinceStart >= 1)) ? stryMutAct_9fa48("16793") ? "" : (stryCov_9fa48("16793"), 'medium') : stryMutAct_9fa48("16794") ? "" : (stryCov_9fa48("16794"), 'low'),
          actionUrl: attempt.exam.id ? stryMutAct_9fa48("16795") ? `` : (stryCov_9fa48("16795"), `/exams/${attempt.exam.id}/take?attemptId=${attempt.id}`) : stryMutAct_9fa48("16796") ? `` : (stryCov_9fa48("16796"), `/exams?attemptId=${attempt.id}`),
          metadata: stryMutAct_9fa48("16797") ? {} : (stryCov_9fa48("16797"), {
            subject: attempt.exam.subject.nombre,
            count: attempt.correctas
          })
        }));
      }
    });

    // Agregar flashcards pendientes
    if (stryMutAct_9fa48("16801") ? pendingFlashcards <= 0 : stryMutAct_9fa48("16800") ? pendingFlashcards >= 0 : stryMutAct_9fa48("16799") ? false : stryMutAct_9fa48("16798") ? true : (stryCov_9fa48("16798", "16799", "16800", "16801"), pendingFlashcards > 0)) {
      if (stryMutAct_9fa48("16802")) {
        {}
      } else {
        stryCov_9fa48("16802");
        reminders.push(stryMutAct_9fa48("16803") ? {} : (stryCov_9fa48("16803"), {
          id: stryMutAct_9fa48("16804") ? "" : (stryCov_9fa48("16804"), 'flashcards-pending'),
          type: stryMutAct_9fa48("16805") ? "" : (stryCov_9fa48("16805"), 'flashcard'),
          title: stryMutAct_9fa48("16806") ? "" : (stryCov_9fa48("16806"), 'Flashcards pendientes'),
          description: stryMutAct_9fa48("16807") ? `` : (stryCov_9fa48("16807"), `${pendingFlashcards} ${(stryMutAct_9fa48("16810") ? pendingFlashcards !== 1 : stryMutAct_9fa48("16809") ? false : stryMutAct_9fa48("16808") ? true : (stryCov_9fa48("16808", "16809", "16810"), pendingFlashcards === 1)) ? stryMutAct_9fa48("16811") ? "" : (stryCov_9fa48("16811"), 'flashcard') : stryMutAct_9fa48("16812") ? "" : (stryCov_9fa48("16812"), 'flashcards')} ${(stryMutAct_9fa48("16815") ? pendingFlashcards !== 1 : stryMutAct_9fa48("16814") ? false : stryMutAct_9fa48("16813") ? true : (stryCov_9fa48("16813", "16814", "16815"), pendingFlashcards === 1)) ? stryMutAct_9fa48("16816") ? "" : (stryCov_9fa48("16816"), 'está') : stryMutAct_9fa48("16817") ? "" : (stryCov_9fa48("16817"), 'están')} lista${(stryMutAct_9fa48("16820") ? pendingFlashcards !== 1 : stryMutAct_9fa48("16819") ? false : stryMutAct_9fa48("16818") ? true : (stryCov_9fa48("16818", "16819", "16820"), pendingFlashcards === 1)) ? stryMutAct_9fa48("16821") ? "Stryker was here!" : (stryCov_9fa48("16821"), '') : stryMutAct_9fa48("16822") ? "" : (stryCov_9fa48("16822"), 's')} para repasar`),
          priority: (stryMutAct_9fa48("16826") ? pendingFlashcards < 10 : stryMutAct_9fa48("16825") ? pendingFlashcards > 10 : stryMutAct_9fa48("16824") ? false : stryMutAct_9fa48("16823") ? true : (stryCov_9fa48("16823", "16824", "16825", "16826"), pendingFlashcards >= 10)) ? stryMutAct_9fa48("16827") ? "" : (stryCov_9fa48("16827"), 'high') : (stryMutAct_9fa48("16831") ? pendingFlashcards < 5 : stryMutAct_9fa48("16830") ? pendingFlashcards > 5 : stryMutAct_9fa48("16829") ? false : stryMutAct_9fa48("16828") ? true : (stryCov_9fa48("16828", "16829", "16830", "16831"), pendingFlashcards >= 5)) ? stryMutAct_9fa48("16832") ? "" : (stryCov_9fa48("16832"), 'medium') : stryMutAct_9fa48("16833") ? "" : (stryCov_9fa48("16833"), 'low'),
          actionUrl: stryMutAct_9fa48("16834") ? "" : (stryCov_9fa48("16834"), '/flashcards'),
          metadata: stryMutAct_9fa48("16835") ? {} : (stryCov_9fa48("16835"), {
            count: pendingFlashcards
          })
        }));
      }
    }

    // Agregar desafíos pendientes
    if (stryMutAct_9fa48("16839") ? pendingChallenges <= 0 : stryMutAct_9fa48("16838") ? pendingChallenges >= 0 : stryMutAct_9fa48("16837") ? false : stryMutAct_9fa48("16836") ? true : (stryCov_9fa48("16836", "16837", "16838", "16839"), pendingChallenges > 0)) {
      if (stryMutAct_9fa48("16840")) {
        {}
      } else {
        stryCov_9fa48("16840");
        reminders.push(stryMutAct_9fa48("16841") ? {} : (stryCov_9fa48("16841"), {
          id: stryMutAct_9fa48("16842") ? "" : (stryCov_9fa48("16842"), 'challenges-pending'),
          type: stryMutAct_9fa48("16843") ? "" : (stryCov_9fa48("16843"), 'challenge'),
          title: stryMutAct_9fa48("16844") ? "" : (stryCov_9fa48("16844"), 'Desafíos pendientes'),
          description: stryMutAct_9fa48("16845") ? `` : (stryCov_9fa48("16845"), `Tienes ${pendingChallenges} ${(stryMutAct_9fa48("16848") ? pendingChallenges !== 1 : stryMutAct_9fa48("16847") ? false : stryMutAct_9fa48("16846") ? true : (stryCov_9fa48("16846", "16847", "16848"), pendingChallenges === 1)) ? stryMutAct_9fa48("16849") ? "" : (stryCov_9fa48("16849"), 'desafío') : stryMutAct_9fa48("16850") ? "" : (stryCov_9fa48("16850"), 'desafíos')} ${(stryMutAct_9fa48("16853") ? pendingChallenges !== 1 : stryMutAct_9fa48("16852") ? false : stryMutAct_9fa48("16851") ? true : (stryCov_9fa48("16851", "16852", "16853"), pendingChallenges === 1)) ? stryMutAct_9fa48("16854") ? "" : (stryCov_9fa48("16854"), 'pendiente') : stryMutAct_9fa48("16855") ? "" : (stryCov_9fa48("16855"), 'pendientes')}`),
          priority: stryMutAct_9fa48("16856") ? "" : (stryCov_9fa48("16856"), 'medium'),
          actionUrl: stryMutAct_9fa48("16857") ? "" : (stryCov_9fa48("16857"), '/challenges'),
          metadata: stryMutAct_9fa48("16858") ? {} : (stryCov_9fa48("16858"), {
            count: pendingChallenges
          })
        }));
      }
    }

    // Agregar repasos pendientes
    if (stryMutAct_9fa48("16862") ? pendingReviews <= 0 : stryMutAct_9fa48("16861") ? pendingReviews >= 0 : stryMutAct_9fa48("16860") ? false : stryMutAct_9fa48("16859") ? true : (stryCov_9fa48("16859", "16860", "16861", "16862"), pendingReviews > 0)) {
      if (stryMutAct_9fa48("16863")) {
        {}
      } else {
        stryCov_9fa48("16863");
        reminders.push(stryMutAct_9fa48("16864") ? {} : (stryCov_9fa48("16864"), {
          id: stryMutAct_9fa48("16865") ? "" : (stryCov_9fa48("16865"), 'reviews-pending'),
          type: stryMutAct_9fa48("16866") ? "" : (stryCov_9fa48("16866"), 'review'),
          title: stryMutAct_9fa48("16867") ? "" : (stryCov_9fa48("16867"), 'Repasos pendientes'),
          description: stryMutAct_9fa48("16868") ? `` : (stryCov_9fa48("16868"), `${pendingReviews} ${(stryMutAct_9fa48("16871") ? pendingReviews !== 1 : stryMutAct_9fa48("16870") ? false : stryMutAct_9fa48("16869") ? true : (stryCov_9fa48("16869", "16870", "16871"), pendingReviews === 1)) ? stryMutAct_9fa48("16872") ? "" : (stryCov_9fa48("16872"), 'pregunta') : stryMutAct_9fa48("16873") ? "" : (stryCov_9fa48("16873"), 'preguntas')} ${(stryMutAct_9fa48("16876") ? pendingReviews !== 1 : stryMutAct_9fa48("16875") ? false : stryMutAct_9fa48("16874") ? true : (stryCov_9fa48("16874", "16875", "16876"), pendingReviews === 1)) ? stryMutAct_9fa48("16877") ? "" : (stryCov_9fa48("16877"), 'requiere') : stryMutAct_9fa48("16878") ? "" : (stryCov_9fa48("16878"), 'requieren')} repaso`),
          priority: (stryMutAct_9fa48("16882") ? pendingReviews < 20 : stryMutAct_9fa48("16881") ? pendingReviews > 20 : stryMutAct_9fa48("16880") ? false : stryMutAct_9fa48("16879") ? true : (stryCov_9fa48("16879", "16880", "16881", "16882"), pendingReviews >= 20)) ? stryMutAct_9fa48("16883") ? "" : (stryCov_9fa48("16883"), 'high') : (stryMutAct_9fa48("16887") ? pendingReviews < 10 : stryMutAct_9fa48("16886") ? pendingReviews > 10 : stryMutAct_9fa48("16885") ? false : stryMutAct_9fa48("16884") ? true : (stryCov_9fa48("16884", "16885", "16886", "16887"), pendingReviews >= 10)) ? stryMutAct_9fa48("16888") ? "" : (stryCov_9fa48("16888"), 'medium') : stryMutAct_9fa48("16889") ? "" : (stryCov_9fa48("16889"), 'low'),
          actionUrl: stryMutAct_9fa48("16890") ? "" : (stryCov_9fa48("16890"), '/review/quick'),
          metadata: stryMutAct_9fa48("16891") ? {} : (stryCov_9fa48("16891"), {
            count: pendingReviews
          })
        }));
      }
    }
    if (stryMutAct_9fa48("16894") ? reminders.length !== 0 : stryMutAct_9fa48("16893") ? false : stryMutAct_9fa48("16892") ? true : (stryCov_9fa48("16892", "16893", "16894"), reminders.length === 0)) {
      if (stryMutAct_9fa48("16895")) {
        {}
      } else {
        stryCov_9fa48("16895");
        return <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle>Recordatorios</CardTitle>
            </div>
            <HelpIcon content={<>
                  <strong>Recordatorios</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Aquí verás tus tareas pendientes: exámenes sin terminar, flashcards para
                    repasar, desafíos y más. Como una lista de tareas, pero para tu estudio.
                  </span>
                </>} />
          </div>
          <CardDescription>No tienes tareas pendientes en este momento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              ¡Excelente! Estás al día con todas tus tareas.
            </p>
          </div>
        </CardContent>
      </Card>;
      }
    }

    // Ordenar por prioridad
    const priorityOrder = stryMutAct_9fa48("16896") ? {} : (stryCov_9fa48("16896"), {
      high: 0,
      medium: 1,
      low: 2
    });
    const sortedReminders = stryMutAct_9fa48("16897") ? [...reminders] : (stryCov_9fa48("16897"), (stryMutAct_9fa48("16898") ? [] : (stryCov_9fa48("16898"), [...reminders])).sort(stryMutAct_9fa48("16899") ? () => undefined : (stryCov_9fa48("16899"), (a, b) => stryMutAct_9fa48("16900") ? priorityOrder[a.priority] + priorityOrder[b.priority] : (stryCov_9fa48("16900"), priorityOrder[a.priority] - priorityOrder[b.priority]))));
    const getReminderIcon = (type: string) => {
      if (stryMutAct_9fa48("16901")) {
        {}
      } else {
        stryCov_9fa48("16901");
        switch (type) {
          case stryMutAct_9fa48("16903") ? "" : (stryCov_9fa48("16903"), 'exam'):
            if (stryMutAct_9fa48("16902")) {} else {
              stryCov_9fa48("16902");
              return PlayCircle;
            }
          case stryMutAct_9fa48("16905") ? "" : (stryCov_9fa48("16905"), 'flashcard'):
            if (stryMutAct_9fa48("16904")) {} else {
              stryCov_9fa48("16904");
              return BookOpen;
            }
          case stryMutAct_9fa48("16907") ? "" : (stryCov_9fa48("16907"), 'challenge'):
            if (stryMutAct_9fa48("16906")) {} else {
              stryCov_9fa48("16906");
              return Trophy;
            }
          case stryMutAct_9fa48("16909") ? "" : (stryCov_9fa48("16909"), 'review'):
            if (stryMutAct_9fa48("16908")) {} else {
              stryCov_9fa48("16908");
              return FileText;
            }
          default:
            if (stryMutAct_9fa48("16910")) {} else {
              stryCov_9fa48("16910");
              return AlertCircle;
            }
        }
      }
    };
    const getPriorityColor = (priority: string) => {
      if (stryMutAct_9fa48("16911")) {
        {}
      } else {
        stryCov_9fa48("16911");
        switch (priority) {
          case stryMutAct_9fa48("16913") ? "" : (stryCov_9fa48("16913"), 'high'):
            if (stryMutAct_9fa48("16912")) {} else {
              stryCov_9fa48("16912");
              return stryMutAct_9fa48("16914") ? "" : (stryCov_9fa48("16914"), 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800');
            }
          case stryMutAct_9fa48("16916") ? "" : (stryCov_9fa48("16916"), 'medium'):
            if (stryMutAct_9fa48("16915")) {} else {
              stryCov_9fa48("16915");
              return stryMutAct_9fa48("16917") ? "" : (stryCov_9fa48("16917"), 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800');
            }
          case stryMutAct_9fa48("16919") ? "" : (stryCov_9fa48("16919"), 'low'):
            if (stryMutAct_9fa48("16918")) {} else {
              stryCov_9fa48("16918");
              return stryMutAct_9fa48("16920") ? "" : (stryCov_9fa48("16920"), 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800');
            }
          default:
            if (stryMutAct_9fa48("16921")) {} else {
              stryCov_9fa48("16921");
              return stryMutAct_9fa48("16922") ? "" : (stryCov_9fa48("16922"), 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300');
            }
        }
      }
    };
    const getPriorityLabel = (priority: string) => {
      if (stryMutAct_9fa48("16923")) {
        {}
      } else {
        stryCov_9fa48("16923");
        switch (priority) {
          case stryMutAct_9fa48("16925") ? "" : (stryCov_9fa48("16925"), 'high'):
            if (stryMutAct_9fa48("16924")) {} else {
              stryCov_9fa48("16924");
              return stryMutAct_9fa48("16926") ? "" : (stryCov_9fa48("16926"), 'Alta');
            }
          case stryMutAct_9fa48("16928") ? "" : (stryCov_9fa48("16928"), 'medium'):
            if (stryMutAct_9fa48("16927")) {} else {
              stryCov_9fa48("16927");
              return stryMutAct_9fa48("16929") ? "" : (stryCov_9fa48("16929"), 'Media');
            }
          case stryMutAct_9fa48("16931") ? "" : (stryCov_9fa48("16931"), 'low'):
            if (stryMutAct_9fa48("16930")) {} else {
              stryCov_9fa48("16930");
              return stryMutAct_9fa48("16932") ? "" : (stryCov_9fa48("16932"), 'Baja');
            }
          default:
            if (stryMutAct_9fa48("16933")) {} else {
              stryCov_9fa48("16933");
              return stryMutAct_9fa48("16934") ? "" : (stryCov_9fa48("16934"), 'Normal');
            }
        }
      }
    };
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Recordatorios</CardTitle>
            <Badge variant="outline" className="ml-2">
              {reminders.length}
            </Badge>
          </div>
          <HelpIcon content={<>
                <strong>Recordatorios</strong>
                <br />
                <span className="text-muted-foreground text-xs">
                  Tus tareas pendientes aparecen aquí. Como una lista de tareas, pero para tu
                  estudio. Las tareas de alta prioridad aparecen primero.
                </span>
              </>} />
        </div>
        <CardDescription>
          {reminders.length} {(stryMutAct_9fa48("16937") ? reminders.length !== 1 : stryMutAct_9fa48("16936") ? false : stryMutAct_9fa48("16935") ? true : (stryCov_9fa48("16935", "16936", "16937"), reminders.length === 1)) ? stryMutAct_9fa48("16938") ? "" : (stryCov_9fa48("16938"), 'tarea pendiente') : stryMutAct_9fa48("16939") ? "" : (stryCov_9fa48("16939"), 'tareas pendientes')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {sortedReminders.map(reminder => {
              if (stryMutAct_9fa48("16940")) {
                {}
              } else {
                stryCov_9fa48("16940");
                const Icon = getReminderIcon(reminder.type);
                return <div key={reminder.id} className={cn(stryMutAct_9fa48("16941") ? "" : (stryCov_9fa48("16941"), 'flex items-start gap-3 p-3 rounded-lg border transition-colors'), stryMutAct_9fa48("16942") ? "" : (stryCov_9fa48("16942"), 'hover:bg-muted/50'), getPriorityColor(reminder.priority))}>
                  <div className="p-2 rounded-md bg-background/50 flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium leading-tight">{reminder.title}</p>
                      <Badge variant="outline" className={cn(stryMutAct_9fa48("16943") ? "" : (stryCov_9fa48("16943"), 'text-xs flex-shrink-0'), getPriorityColor(reminder.priority))}>
                        {getPriorityLabel(reminder.priority)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{reminder.description}</p>
                    {stryMutAct_9fa48("16946") ? reminder.metadata?.subject || <p className="text-xs text-muted-foreground mb-2">
                        Materia: {reminder.metadata.subject}
                      </p> : stryMutAct_9fa48("16945") ? false : stryMutAct_9fa48("16944") ? true : (stryCov_9fa48("16944", "16945", "16946"), (stryMutAct_9fa48("16947") ? reminder.metadata.subject : (stryCov_9fa48("16947"), reminder.metadata?.subject)) && <p className="text-xs text-muted-foreground mb-2">
                        Materia: {reminder.metadata.subject}
                      </p>)}
                    <Button asChild variant="outline" size="sm" className="w-full mt-2">
                      <Link href={reminder.actionUrl}>
                        {stryMutAct_9fa48("16950") ? reminder.type === 'exam' || 'Continuar examen' : stryMutAct_9fa48("16949") ? false : stryMutAct_9fa48("16948") ? true : (stryCov_9fa48("16948", "16949", "16950"), (stryMutAct_9fa48("16952") ? reminder.type !== 'exam' : stryMutAct_9fa48("16951") ? true : (stryCov_9fa48("16951", "16952"), reminder.type === (stryMutAct_9fa48("16953") ? "" : (stryCov_9fa48("16953"), 'exam')))) && (stryMutAct_9fa48("16954") ? "" : (stryCov_9fa48("16954"), 'Continuar examen')))}
                        {stryMutAct_9fa48("16957") ? reminder.type === 'flashcard' || 'Repasar flashcards' : stryMutAct_9fa48("16956") ? false : stryMutAct_9fa48("16955") ? true : (stryCov_9fa48("16955", "16956", "16957"), (stryMutAct_9fa48("16959") ? reminder.type !== 'flashcard' : stryMutAct_9fa48("16958") ? true : (stryCov_9fa48("16958", "16959"), reminder.type === (stryMutAct_9fa48("16960") ? "" : (stryCov_9fa48("16960"), 'flashcard')))) && (stryMutAct_9fa48("16961") ? "" : (stryCov_9fa48("16961"), 'Repasar flashcards')))}
                        {stryMutAct_9fa48("16964") ? reminder.type === 'challenge' || 'Ver desafíos' : stryMutAct_9fa48("16963") ? false : stryMutAct_9fa48("16962") ? true : (stryCov_9fa48("16962", "16963", "16964"), (stryMutAct_9fa48("16966") ? reminder.type !== 'challenge' : stryMutAct_9fa48("16965") ? true : (stryCov_9fa48("16965", "16966"), reminder.type === (stryMutAct_9fa48("16967") ? "" : (stryCov_9fa48("16967"), 'challenge')))) && (stryMutAct_9fa48("16968") ? "" : (stryCov_9fa48("16968"), 'Ver desafíos')))}
                        {stryMutAct_9fa48("16971") ? reminder.type === 'review' || 'Iniciar repaso' : stryMutAct_9fa48("16970") ? false : stryMutAct_9fa48("16969") ? true : (stryCov_9fa48("16969", "16970", "16971"), (stryMutAct_9fa48("16973") ? reminder.type !== 'review' : stryMutAct_9fa48("16972") ? true : (stryCov_9fa48("16972", "16973"), reminder.type === (stryMutAct_9fa48("16974") ? "" : (stryCov_9fa48("16974"), 'review')))) && (stryMutAct_9fa48("16975") ? "" : (stryCov_9fa48("16975"), 'Iniciar repaso')))}
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>;
              }
            })}
          </div>
        </div>
      </CardContent>
    </Card>;
  }
}