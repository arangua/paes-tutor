/**
 * Iconografía contextual por materia
 * Basado en estándares de educación mundial
 */
// @ts-nocheck
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
import { Calculator, BookOpen, FlaskConical, Globe, Calendar, Users, Atom, Dna, Mountain, MapPin, FileText, Lightbulb, FunctionSquare, Divide, BookMarked, PenTool, Search, Zap, FlaskConical as BeakerIcon, GraduationCap, Brain, Target, CheckSquare, FileQuestion, Edit, ListChecks } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
export interface SubjectIconConfig {
  icon: LucideIcon;
  color: string;
  description: string;
}

/**
 * Mapeo de códigos de asignatura a iconos contextuales
 */
export const SUBJECT_ICONS: Record<string, SubjectIconConfig> = stryMutAct_9fa48("26142") ? {} : (stryCov_9fa48("26142"), {
  // Matemáticas - PAES específicos
  M1: stryMutAct_9fa48("26143") ? {} : (stryCov_9fa48("26143"), {
    icon: FunctionSquare,
    color: stryMutAct_9fa48("26144") ? "" : (stryCov_9fa48("26144"), 'text-blue-600 dark:text-blue-400'),
    description: stryMutAct_9fa48("26145") ? "" : (stryCov_9fa48("26145"), 'Matemática M1 - Álgebra y funciones')
  }),
  M2: stryMutAct_9fa48("26146") ? {} : (stryCov_9fa48("26146"), {
    icon: Divide,
    color: stryMutAct_9fa48("26147") ? "" : (stryCov_9fa48("26147"), 'text-indigo-600 dark:text-indigo-400'),
    description: stryMutAct_9fa48("26148") ? "" : (stryCov_9fa48("26148"), 'Matemática M2 - Geometría y probabilidades')
  }),
  MAT: stryMutAct_9fa48("26149") ? {} : (stryCov_9fa48("26149"), {
    icon: Calculator,
    color: stryMutAct_9fa48("26150") ? "" : (stryCov_9fa48("26150"), 'text-blue-600 dark:text-blue-400'),
    description: stryMutAct_9fa48("26151") ? "" : (stryCov_9fa48("26151"), 'Matemáticas - Cálculos y fórmulas')
  }),
  'MAT-1': stryMutAct_9fa48("26152") ? {} : (stryCov_9fa48("26152"), {
    icon: FunctionSquare,
    color: stryMutAct_9fa48("26153") ? "" : (stryCov_9fa48("26153"), 'text-blue-600 dark:text-blue-400'),
    description: stryMutAct_9fa48("26154") ? "" : (stryCov_9fa48("26154"), 'Matemática M1 - Álgebra y funciones')
  }),
  'MAT-2': stryMutAct_9fa48("26155") ? {} : (stryCov_9fa48("26155"), {
    icon: Divide,
    color: stryMutAct_9fa48("26156") ? "" : (stryCov_9fa48("26156"), 'text-indigo-600 dark:text-indigo-400'),
    description: stryMutAct_9fa48("26157") ? "" : (stryCov_9fa48("26157"), 'Matemática M2 - Geometría y probabilidades')
  }),
  // Lenguaje - PAES específico
  LECTORA: stryMutAct_9fa48("26158") ? {} : (stryCov_9fa48("26158"), {
    icon: BookMarked,
    color: stryMutAct_9fa48("26159") ? "" : (stryCov_9fa48("26159"), 'text-green-600 dark:text-green-400'),
    description: stryMutAct_9fa48("26160") ? "" : (stryCov_9fa48("26160"), 'Competencia Lectora - Comprensión y análisis de textos')
  }),
  LEN: stryMutAct_9fa48("26161") ? {} : (stryCov_9fa48("26161"), {
    icon: BookOpen,
    color: stryMutAct_9fa48("26162") ? "" : (stryCov_9fa48("26162"), 'text-green-600 dark:text-green-400'),
    description: stryMutAct_9fa48("26163") ? "" : (stryCov_9fa48("26163"), 'Lenguaje y Comunicación - Lectura y escritura')
  }),
  'LEN-1': stryMutAct_9fa48("26164") ? {} : (stryCov_9fa48("26164"), {
    icon: BookMarked,
    color: stryMutAct_9fa48("26165") ? "" : (stryCov_9fa48("26165"), 'text-green-600 dark:text-green-400'),
    description: stryMutAct_9fa48("26166") ? "" : (stryCov_9fa48("26166"), 'Competencia Lectora - Comprensión y análisis de textos')
  }),
  // Ciencias - PAES específicos
  BIO: stryMutAct_9fa48("26167") ? {} : (stryCov_9fa48("26167"), {
    icon: Dna,
    color: stryMutAct_9fa48("26168") ? "" : (stryCov_9fa48("26168"), 'text-emerald-600 dark:text-emerald-400'),
    description: stryMutAct_9fa48("26169") ? "" : (stryCov_9fa48("26169"), 'Biología - Estudio de la vida y los organismos')
  }),
  QUIM: stryMutAct_9fa48("26170") ? {} : (stryCov_9fa48("26170"), {
    icon: BeakerIcon,
    color: stryMutAct_9fa48("26171") ? "" : (stryCov_9fa48("26171"), 'text-purple-600 dark:text-purple-400'),
    description: stryMutAct_9fa48("26172") ? "" : (stryCov_9fa48("26172"), 'Química - Reacciones y compuestos químicos')
  }),
  QUI: stryMutAct_9fa48("26173") ? {} : (stryCov_9fa48("26173"), {
    icon: BeakerIcon,
    color: stryMutAct_9fa48("26174") ? "" : (stryCov_9fa48("26174"), 'text-purple-600 dark:text-purple-400'),
    description: stryMutAct_9fa48("26175") ? "" : (stryCov_9fa48("26175"), 'Química - Reacciones y compuestos químicos')
  }),
  FIS: stryMutAct_9fa48("26176") ? {} : (stryCov_9fa48("26176"), {
    icon: Zap,
    color: stryMutAct_9fa48("26177") ? "" : (stryCov_9fa48("26177"), 'text-orange-600 dark:text-orange-400'),
    description: stryMutAct_9fa48("26178") ? "" : (stryCov_9fa48("26178"), 'Física - Leyes y fenómenos naturales')
  }),
  CS: stryMutAct_9fa48("26179") ? {} : (stryCov_9fa48("26179"), {
    icon: Search,
    color: stryMutAct_9fa48("26180") ? "" : (stryCov_9fa48("26180"), 'text-yellow-600 dark:text-yellow-400'),
    description: stryMutAct_9fa48("26181") ? "" : (stryCov_9fa48("26181"), 'Ciencias - Investigación y experimentación')
  }),
  // Historia
  HIST: stryMutAct_9fa48("26182") ? {} : (stryCov_9fa48("26182"), {
    icon: Calendar,
    color: stryMutAct_9fa48("26183") ? "" : (stryCov_9fa48("26183"), 'text-red-600 dark:text-red-400'),
    description: stryMutAct_9fa48("26184") ? "" : (stryCov_9fa48("26184"), 'Historia y Ciencias Sociales - Eventos y procesos históricos')
  }),
  'HIST-1': stryMutAct_9fa48("26185") ? {} : (stryCov_9fa48("26185"), {
    icon: Calendar,
    color: stryMutAct_9fa48("26186") ? "" : (stryCov_9fa48("26186"), 'text-red-600 dark:text-red-400'),
    description: stryMutAct_9fa48("26187") ? "" : (stryCov_9fa48("26187"), 'Historia y Ciencias Sociales - Eventos y procesos históricos')
  }),
  // Geografía
  GEO: stryMutAct_9fa48("26188") ? {} : (stryCov_9fa48("26188"), {
    icon: Globe,
    color: stryMutAct_9fa48("26189") ? "" : (stryCov_9fa48("26189"), 'text-cyan-600'),
    description: stryMutAct_9fa48("26190") ? "" : (stryCov_9fa48("26190"), 'Geografía - Espacios y territorios')
  }),
  'GEO-1': stryMutAct_9fa48("26191") ? {} : (stryCov_9fa48("26191"), {
    icon: MapPin,
    color: stryMutAct_9fa48("26192") ? "" : (stryCov_9fa48("26192"), 'text-cyan-600'),
    description: stryMutAct_9fa48("26193") ? "" : (stryCov_9fa48("26193"), 'Geografía - Espacios y territorios')
  }),
  // Filosofía
  FIL: stryMutAct_9fa48("26194") ? {} : (stryCov_9fa48("26194"), {
    icon: Brain,
    color: stryMutAct_9fa48("26195") ? "" : (stryCov_9fa48("26195"), 'text-indigo-600 dark:text-indigo-400'),
    description: stryMutAct_9fa48("26196") ? "" : (stryCov_9fa48("26196"), 'Filosofía - Pensamiento y reflexión')
  }),
  // Educación Física
  EF: stryMutAct_9fa48("26197") ? {} : (stryCov_9fa48("26197"), {
    icon: Users,
    color: stryMutAct_9fa48("26198") ? "" : (stryCov_9fa48("26198"), 'text-pink-600 dark:text-pink-400'),
    description: stryMutAct_9fa48("26199") ? "" : (stryCov_9fa48("26199"), 'Educación Física - Actividad y salud')
  }),
  // Artes
  ART: stryMutAct_9fa48("26200") ? {} : (stryCov_9fa48("26200"), {
    icon: PenTool,
    color: stryMutAct_9fa48("26201") ? "" : (stryCov_9fa48("26201"), 'text-rose-600 dark:text-rose-400'),
    description: stryMutAct_9fa48("26202") ? "" : (stryCov_9fa48("26202"), 'Artes - Expresión y creatividad')
  })
});

/**
 * Iconos para tipos de preguntas
 */
export const QUESTION_TYPE_ICONS: Record<string, SubjectIconConfig> = stryMutAct_9fa48("26203") ? {} : (stryCov_9fa48("26203"), {
  multiple_choice: stryMutAct_9fa48("26204") ? {} : (stryCov_9fa48("26204"), {
    icon: CheckSquare,
    color: stryMutAct_9fa48("26205") ? "" : (stryCov_9fa48("26205"), 'text-blue-600 dark:text-blue-400'),
    description: stryMutAct_9fa48("26206") ? "" : (stryCov_9fa48("26206"), 'Opción múltiple - Selecciona una respuesta')
  }),
  true_false: stryMutAct_9fa48("26207") ? {} : (stryCov_9fa48("26207"), {
    icon: Target,
    color: stryMutAct_9fa48("26208") ? "" : (stryCov_9fa48("26208"), 'text-green-600 dark:text-green-400'),
    description: stryMutAct_9fa48("26209") ? "" : (stryCov_9fa48("26209"), 'Verdadero/Falso - Indica si es correcto o incorrecto')
  }),
  desarrollo: stryMutAct_9fa48("26210") ? {} : (stryCov_9fa48("26210"), {
    icon: Edit,
    color: stryMutAct_9fa48("26211") ? "" : (stryCov_9fa48("26211"), 'text-purple-600 dark:text-purple-400'),
    description: stryMutAct_9fa48("26212") ? "" : (stryCov_9fa48("26212"), 'Desarrollo - Escribe tu respuesta')
  }),
  completar: stryMutAct_9fa48("26213") ? {} : (stryCov_9fa48("26213"), {
    icon: ListChecks,
    color: stryMutAct_9fa48("26214") ? "" : (stryCov_9fa48("26214"), 'text-orange-600 dark:text-orange-400'),
    description: stryMutAct_9fa48("26215") ? "" : (stryCov_9fa48("26215"), 'Completar - Llena los espacios en blanco')
  }),
  default: stryMutAct_9fa48("26216") ? {} : (stryCov_9fa48("26216"), {
    icon: FileQuestion,
    color: stryMutAct_9fa48("26217") ? "" : (stryCov_9fa48("26217"), 'text-gray-600 dark:text-gray-400'),
    description: stryMutAct_9fa48("26218") ? "" : (stryCov_9fa48("26218"), 'Pregunta')
  })
});

/**
 * Iconos para tipos de exámenes
 */
export const EXAM_TYPE_ICONS: Record<string, SubjectIconConfig> = stryMutAct_9fa48("26219") ? {} : (stryCov_9fa48("26219"), {
  oficial: stryMutAct_9fa48("26220") ? {} : (stryCov_9fa48("26220"), {
    icon: GraduationCap,
    color: stryMutAct_9fa48("26221") ? "" : (stryCov_9fa48("26221"), 'text-blue-600 dark:text-blue-400'),
    description: stryMutAct_9fa48("26222") ? "" : (stryCov_9fa48("26222"), 'Examen oficial PAES')
  }),
  simulacro: stryMutAct_9fa48("26223") ? {} : (stryCov_9fa48("26223"), {
    icon: Target,
    color: stryMutAct_9fa48("26224") ? "" : (stryCov_9fa48("26224"), 'text-purple-600 dark:text-purple-400'),
    description: stryMutAct_9fa48("26225") ? "" : (stryCov_9fa48("26225"), 'Simulacro - Práctica de examen')
  }),
  practica: stryMutAct_9fa48("26226") ? {} : (stryCov_9fa48("26226"), {
    icon: BookOpen,
    color: stryMutAct_9fa48("26227") ? "" : (stryCov_9fa48("26227"), 'text-green-600 dark:text-green-400'),
    description: stryMutAct_9fa48("26228") ? "" : (stryCov_9fa48("26228"), 'Práctica - Ejercicios de estudio')
  }),
  diagnostico: stryMutAct_9fa48("26229") ? {} : (stryCov_9fa48("26229"), {
    icon: Brain,
    color: stryMutAct_9fa48("26230") ? "" : (stryCov_9fa48("26230"), 'text-orange-600 dark:text-orange-400'),
    description: stryMutAct_9fa48("26231") ? "" : (stryCov_9fa48("26231"), 'Diagnóstico - Evaluación inicial')
  }),
  default: stryMutAct_9fa48("26232") ? {} : (stryCov_9fa48("26232"), {
    icon: FileText,
    color: stryMutAct_9fa48("26233") ? "" : (stryCov_9fa48("26233"), 'text-gray-600 dark:text-gray-400'),
    description: stryMutAct_9fa48("26234") ? "" : (stryCov_9fa48("26234"), 'Examen')
  })
});

/**
 * Obtiene el icono para un tipo de pregunta
 */
export function getQuestionTypeIcon(tipo: string): SubjectIconConfig {
  if (stryMutAct_9fa48("26235")) {
    {}
  } else {
    stryCov_9fa48("26235");
    return stryMutAct_9fa48("26238") ? QUESTION_TYPE_ICONS[tipo] && QUESTION_TYPE_ICONS.default : stryMutAct_9fa48("26237") ? false : stryMutAct_9fa48("26236") ? true : (stryCov_9fa48("26236", "26237", "26238"), QUESTION_TYPE_ICONS[tipo] || QUESTION_TYPE_ICONS.default);
  }
}

/**
 * Obtiene el icono para un tipo de examen
 */
export function getExamTypeIcon(tipo: string): SubjectIconConfig {
  if (stryMutAct_9fa48("26239")) {
    {}
  } else {
    stryCov_9fa48("26239");
    return stryMutAct_9fa48("26242") ? EXAM_TYPE_ICONS[tipo] && EXAM_TYPE_ICONS.default : stryMutAct_9fa48("26241") ? false : stryMutAct_9fa48("26240") ? true : (stryCov_9fa48("26240", "26241", "26242"), EXAM_TYPE_ICONS[tipo] || EXAM_TYPE_ICONS.default);
  }
}

/**
 * Obtiene el icono y configuración para una asignatura
 */
export function getSubjectIcon(codigo: string): SubjectIconConfig | {
  icon: LucideIcon;
  color: string;
  description: string;
} {
  if (stryMutAct_9fa48("26243")) {
    {}
  } else {
    stryCov_9fa48("26243");
    // Buscar coincidencia exacta
    if (stryMutAct_9fa48("26245") ? false : stryMutAct_9fa48("26244") ? true : (stryCov_9fa48("26244", "26245"), SUBJECT_ICONS[codigo])) {
      if (stryMutAct_9fa48("26246")) {
        {}
      } else {
        stryCov_9fa48("26246");
        return SUBJECT_ICONS[codigo];
      }
    }

    // Buscar por prefijo
    const prefix = codigo.split(stryMutAct_9fa48("26247") ? "" : (stryCov_9fa48("26247"), '-'))[0];
    if (stryMutAct_9fa48("26249") ? false : stryMutAct_9fa48("26248") ? true : (stryCov_9fa48("26248", "26249"), SUBJECT_ICONS[prefix])) {
      if (stryMutAct_9fa48("26250")) {
        {}
      } else {
        stryCov_9fa48("26250");
        return SUBJECT_ICONS[prefix];
      }
    }

    // Icono por defecto
    return stryMutAct_9fa48("26251") ? {} : (stryCov_9fa48("26251"), {
      icon: FileText,
      color: stryMutAct_9fa48("26252") ? "" : (stryCov_9fa48("26252"), 'text-gray-600'),
      description: stryMutAct_9fa48("26253") ? "" : (stryCov_9fa48("26253"), 'Asignatura')
    });
  }
}

/**
 * Componente de icono de asignatura
 */
export function SubjectIcon({
  codigo,
  className,
  size = 20
}: {
  codigo: string;
  className?: string;
  size?: number;
}) {
  if (stryMutAct_9fa48("26254")) {
    {}
  } else {
    stryCov_9fa48("26254");
    const config = getSubjectIcon(codigo);
    const Icon = config.icon;
    return <Icon className={stryMutAct_9fa48("26255") ? `` : (stryCov_9fa48("26255"), `${config.color} ${stryMutAct_9fa48("26258") ? className && '' : stryMutAct_9fa48("26257") ? false : stryMutAct_9fa48("26256") ? true : (stryCov_9fa48("26256", "26257", "26258"), className || (stryMutAct_9fa48("26259") ? "Stryker was here!" : (stryCov_9fa48("26259"), '')))}`)} size={size} />;
  }
}