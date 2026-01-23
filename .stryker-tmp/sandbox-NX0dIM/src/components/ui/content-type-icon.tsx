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
import { FileText, BookOpen, Bookmark, ClipboardList, GraduationCap, Target, Brain, CheckSquare, Edit, ListChecks, FileQuestion } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getQuestionTypeIcon, getExamTypeIcon } from '@/lib/subject-icons';
export type ContentType = 'exam' | 'question' | 'note' | 'flashcard' | 'bookmark' | 'attempt' | 'material' | 'topic';
export type QuestionType = 'multiple_choice' | 'true_false' | 'desarrollo' | 'completar' | string;
interface ContentTypeIconProps {
  type: ContentType | QuestionType;
  questionType?: QuestionType;
  examType?: string;
  className?: string;
  size?: number;
  showLabel?: boolean;
}
const CONTENT_TYPE_ICONS: Record<ContentType, {
  icon: LucideIcon;
  color: string;
  label: string;
}> = stryMutAct_9fa48("20557") ? {} : (stryCov_9fa48("20557"), {
  exam: stryMutAct_9fa48("20558") ? {} : (stryCov_9fa48("20558"), {
    icon: ClipboardList,
    color: stryMutAct_9fa48("20559") ? "" : (stryCov_9fa48("20559"), 'text-blue-600 dark:text-blue-400'),
    label: stryMutAct_9fa48("20560") ? "" : (stryCov_9fa48("20560"), 'Examen')
  }),
  question: stryMutAct_9fa48("20561") ? {} : (stryCov_9fa48("20561"), {
    icon: FileQuestion,
    color: stryMutAct_9fa48("20562") ? "" : (stryCov_9fa48("20562"), 'text-purple-600 dark:text-purple-400'),
    label: stryMutAct_9fa48("20563") ? "" : (stryCov_9fa48("20563"), 'Pregunta')
  }),
  note: stryMutAct_9fa48("20564") ? {} : (stryCov_9fa48("20564"), {
    icon: FileText,
    color: stryMutAct_9fa48("20565") ? "" : (stryCov_9fa48("20565"), 'text-green-600 dark:text-green-400'),
    label: stryMutAct_9fa48("20566") ? "" : (stryCov_9fa48("20566"), 'Nota')
  }),
  flashcard: stryMutAct_9fa48("20567") ? {} : (stryCov_9fa48("20567"), {
    icon: BookOpen,
    color: stryMutAct_9fa48("20568") ? "" : (stryCov_9fa48("20568"), 'text-orange-600 dark:text-orange-400'),
    label: stryMutAct_9fa48("20569") ? "" : (stryCov_9fa48("20569"), 'Flashcard')
  }),
  bookmark: stryMutAct_9fa48("20570") ? {} : (stryCov_9fa48("20570"), {
    icon: Bookmark,
    color: stryMutAct_9fa48("20571") ? "" : (stryCov_9fa48("20571"), 'text-yellow-600 dark:text-yellow-400'),
    label: stryMutAct_9fa48("20572") ? "" : (stryCov_9fa48("20572"), 'Marcador')
  }),
  attempt: stryMutAct_9fa48("20573") ? {} : (stryCov_9fa48("20573"), {
    icon: Target,
    color: stryMutAct_9fa48("20574") ? "" : (stryCov_9fa48("20574"), 'text-indigo-600 dark:text-indigo-400'),
    label: stryMutAct_9fa48("20575") ? "" : (stryCov_9fa48("20575"), 'Intento')
  }),
  material: stryMutAct_9fa48("20576") ? {} : (stryCov_9fa48("20576"), {
    icon: GraduationCap,
    color: stryMutAct_9fa48("20577") ? "" : (stryCov_9fa48("20577"), 'text-cyan-600 dark:text-cyan-400'),
    label: stryMutAct_9fa48("20578") ? "" : (stryCov_9fa48("20578"), 'Material')
  }),
  topic: stryMutAct_9fa48("20579") ? {} : (stryCov_9fa48("20579"), {
    icon: Brain,
    color: stryMutAct_9fa48("20580") ? "" : (stryCov_9fa48("20580"), 'text-pink-600 dark:text-pink-400'),
    label: stryMutAct_9fa48("20581") ? "" : (stryCov_9fa48("20581"), 'Tema')
  })
});
export function ContentTypeIcon({
  type,
  questionType,
  examType,
  className,
  size = 20,
  showLabel = stryMutAct_9fa48("20582") ? true : (stryCov_9fa48("20582"), false)
}: ContentTypeIconProps) {
  if (stryMutAct_9fa48("20583")) {
    {}
  } else {
    stryCov_9fa48("20583");
    // Si es un tipo de pregunta, usar iconos de pregunta
    if (stryMutAct_9fa48("20586") ? type === 'question' || questionType : stryMutAct_9fa48("20585") ? false : stryMutAct_9fa48("20584") ? true : (stryCov_9fa48("20584", "20585", "20586"), (stryMutAct_9fa48("20588") ? type !== 'question' : stryMutAct_9fa48("20587") ? true : (stryCov_9fa48("20587", "20588"), type === (stryMutAct_9fa48("20589") ? "" : (stryCov_9fa48("20589"), 'question')))) && questionType)) {
      if (stryMutAct_9fa48("20590")) {
        {}
      } else {
        stryCov_9fa48("20590");
        const config = getQuestionTypeIcon(questionType);
        const Icon = config.icon;
        if (stryMutAct_9fa48("20592") ? false : stryMutAct_9fa48("20591") ? true : (stryCov_9fa48("20591", "20592"), showLabel)) {
          if (stryMutAct_9fa48("20593")) {
            {}
          } else {
            stryCov_9fa48("20593");
            return <div className={cn(stryMutAct_9fa48("20594") ? "" : (stryCov_9fa48("20594"), 'flex items-center gap-2'), className)}>
          <Icon className={cn(config.color)} size={size} />
          <span className="text-sm text-muted-foreground">{config.description}</span>
        </div>;
          }
        }
        return <Icon className={cn(config.color, className)} size={size} />;
      }
    }

    // Si es un examen, usar iconos de tipo de examen
    if (stryMutAct_9fa48("20597") ? type === 'exam' || examType : stryMutAct_9fa48("20596") ? false : stryMutAct_9fa48("20595") ? true : (stryCov_9fa48("20595", "20596", "20597"), (stryMutAct_9fa48("20599") ? type !== 'exam' : stryMutAct_9fa48("20598") ? true : (stryCov_9fa48("20598", "20599"), type === (stryMutAct_9fa48("20600") ? "" : (stryCov_9fa48("20600"), 'exam')))) && examType)) {
      if (stryMutAct_9fa48("20601")) {
        {}
      } else {
        stryCov_9fa48("20601");
        const config = getExamTypeIcon(examType);
        const Icon = config.icon;
        if (stryMutAct_9fa48("20603") ? false : stryMutAct_9fa48("20602") ? true : (stryCov_9fa48("20602", "20603"), showLabel)) {
          if (stryMutAct_9fa48("20604")) {
            {}
          } else {
            stryCov_9fa48("20604");
            return <div className={cn(stryMutAct_9fa48("20605") ? "" : (stryCov_9fa48("20605"), 'flex items-center gap-2'), className)}>
          <Icon className={cn(config.color)} size={size} />
          <span className="text-sm text-muted-foreground">{config.description}</span>
        </div>;
          }
        }
        return <Icon className={cn(config.color, className)} size={size} />;
      }
    }

    // Tipo de contenido estándar
    const config = stryMutAct_9fa48("20608") ? CONTENT_TYPE_ICONS[type as ContentType] && CONTENT_TYPE_ICONS.question : stryMutAct_9fa48("20607") ? false : stryMutAct_9fa48("20606") ? true : (stryCov_9fa48("20606", "20607", "20608"), CONTENT_TYPE_ICONS[type as ContentType] || CONTENT_TYPE_ICONS.question);
    const Icon = config.icon;
    if (stryMutAct_9fa48("20610") ? false : stryMutAct_9fa48("20609") ? true : (stryCov_9fa48("20609", "20610"), showLabel)) {
      if (stryMutAct_9fa48("20611")) {
        {}
      } else {
        stryCov_9fa48("20611");
        return <div className={cn(stryMutAct_9fa48("20612") ? "" : (stryCov_9fa48("20612"), 'flex items-center gap-2'), className)}>
        <Icon className={cn(config.color)} size={size} />
        <span className="text-sm text-muted-foreground">{config.label}</span>
      </div>;
      }
    }
    return <Icon className={cn(config.color, className)} size={size} />;
  }
}