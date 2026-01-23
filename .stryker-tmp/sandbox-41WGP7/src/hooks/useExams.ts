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
import { useState, useEffect, useMemo } from 'react';
import { captureError } from '@/lib/monitoring';
interface Exam {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  tiempoLimiteMin: number | null;
  totalPreguntas: number;
  fuente: string | null;
  createdAt: string;
  subject: {
    id: string;
    nombre: string;
    codigo: string;
  };
  questions: Array<{
    question: {
      id: string;
    };
  }>;
}
interface UseExamsOptions {
  subjectId?: string;
  tipo?: string;
  limit?: number;
  offset?: number;
}
interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Hook personalizado para cargar y filtrar exámenes
 */
export function useExams(options: UseExamsOptions = {}) {
  if (stryMutAct_9fa48("21460")) {
    {}
  } else {
    stryCov_9fa48("21460");
    const [exams, setExams] = useState<Exam[]>(stryMutAct_9fa48("21461") ? ["Stryker was here"] : (stryCov_9fa48("21461"), []));
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("21462") ? false : (stryCov_9fa48("21462"), true));
    const [error, setError] = useState<string | null>(null);

    // Cargar exámenes
    useEffect(() => {
      if (stryMutAct_9fa48("21463")) {
        {}
      } else {
        stryCov_9fa48("21463");
        async function loadExams() {
          if (stryMutAct_9fa48("21464")) {
            {}
          } else {
            stryCov_9fa48("21464");
            try {
              if (stryMutAct_9fa48("21465")) {
                {}
              } else {
                stryCov_9fa48("21465");
                setIsLoading(stryMutAct_9fa48("21466") ? false : (stryCov_9fa48("21466"), true));
                setError(null);
                const params = new URLSearchParams();
                if (stryMutAct_9fa48("21469") ? options.subjectId || options.subjectId !== 'all' : stryMutAct_9fa48("21468") ? false : stryMutAct_9fa48("21467") ? true : (stryCov_9fa48("21467", "21468", "21469"), options.subjectId && (stryMutAct_9fa48("21471") ? options.subjectId === 'all' : stryMutAct_9fa48("21470") ? true : (stryCov_9fa48("21470", "21471"), options.subjectId !== (stryMutAct_9fa48("21472") ? "" : (stryCov_9fa48("21472"), 'all')))))) {
                  if (stryMutAct_9fa48("21473")) {
                    {}
                  } else {
                    stryCov_9fa48("21473");
                    params.append(stryMutAct_9fa48("21474") ? "" : (stryCov_9fa48("21474"), 'subjectId'), options.subjectId);
                  }
                }
                if (stryMutAct_9fa48("21477") ? options.tipo || options.tipo !== 'all' : stryMutAct_9fa48("21476") ? false : stryMutAct_9fa48("21475") ? true : (stryCov_9fa48("21475", "21476", "21477"), options.tipo && (stryMutAct_9fa48("21479") ? options.tipo === 'all' : stryMutAct_9fa48("21478") ? true : (stryCov_9fa48("21478", "21479"), options.tipo !== (stryMutAct_9fa48("21480") ? "" : (stryCov_9fa48("21480"), 'all')))))) {
                  if (stryMutAct_9fa48("21481")) {
                    {}
                  } else {
                    stryCov_9fa48("21481");
                    params.append(stryMutAct_9fa48("21482") ? "" : (stryCov_9fa48("21482"), 'tipo'), options.tipo);
                  }
                }
                if (stryMutAct_9fa48("21484") ? false : stryMutAct_9fa48("21483") ? true : (stryCov_9fa48("21483", "21484"), options.limit)) {
                  if (stryMutAct_9fa48("21485")) {
                    {}
                  } else {
                    stryCov_9fa48("21485");
                    params.append(stryMutAct_9fa48("21486") ? "" : (stryCov_9fa48("21486"), 'limit'), options.limit.toString());
                  }
                }
                if (stryMutAct_9fa48("21488") ? false : stryMutAct_9fa48("21487") ? true : (stryCov_9fa48("21487", "21488"), options.offset)) {
                  if (stryMutAct_9fa48("21489")) {
                    {}
                  } else {
                    stryCov_9fa48("21489");
                    params.append(stryMutAct_9fa48("21490") ? "" : (stryCov_9fa48("21490"), 'offset'), options.offset.toString());
                  }
                }
                const url = stryMutAct_9fa48("21491") ? `` : (stryCov_9fa48("21491"), `/api/exams${params.toString() ? stryMutAct_9fa48("21492") ? `` : (stryCov_9fa48("21492"), `?${params.toString()}`) : stryMutAct_9fa48("21493") ? "Stryker was here!" : (stryCov_9fa48("21493"), '')}`);
                const res = await fetch(url);
                if (stryMutAct_9fa48("21496") ? false : stryMutAct_9fa48("21495") ? true : stryMutAct_9fa48("21494") ? res.ok : (stryCov_9fa48("21494", "21495", "21496"), !res.ok)) {
                  if (stryMutAct_9fa48("21497")) {
                    {}
                  } else {
                    stryCov_9fa48("21497");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("21498") ? "" : (stryCov_9fa48("21498"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(res, stryMutAct_9fa48("21499") ? {} : (stryCov_9fa48("21499"), {
                      path: (stryMutAct_9fa48("21502") ? typeof window === 'undefined' : stryMutAct_9fa48("21501") ? false : stryMutAct_9fa48("21500") ? true : (stryCov_9fa48("21500", "21501", "21502"), typeof window !== (stryMutAct_9fa48("21503") ? "" : (stryCov_9fa48("21503"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("21504") ? "" : (stryCov_9fa48("21504"), '/exams'),
                      operation: stryMutAct_9fa48("21505") ? "" : (stryCov_9fa48("21505"), 'cargar exámenes')
                    }));
                    const statusText = (stryMutAct_9fa48("21508") ? res.status !== 401 : stryMutAct_9fa48("21507") ? false : stryMutAct_9fa48("21506") ? true : (stryCov_9fa48("21506", "21507", "21508"), res.status === 401)) ? stryMutAct_9fa48("21509") ? "" : (stryCov_9fa48("21509"), 'No autorizado. Por favor, inicia sesión.') : (stryMutAct_9fa48("21512") ? res.status !== 404 : stryMutAct_9fa48("21511") ? false : stryMutAct_9fa48("21510") ? true : (stryCov_9fa48("21510", "21511", "21512"), res.status === 404)) ? stryMutAct_9fa48("21513") ? "" : (stryCov_9fa48("21513"), 'Exámenes no encontrados') : stryMutAct_9fa48("21516") ? errorData.error && `Error ${res.status}: Error al cargar exámenes` : stryMutAct_9fa48("21515") ? false : stryMutAct_9fa48("21514") ? true : (stryCov_9fa48("21514", "21515", "21516"), errorData.error || (stryMutAct_9fa48("21517") ? `` : (stryCov_9fa48("21517"), `Error ${res.status}: Error al cargar exámenes`)));
                    throw new Error(statusText);
                  }
                }
                const data = await res.json();

                // Manejar nueva estructura con paginación o estructura antigua
                let examsData: Exam[];
                let paginationData: PaginationInfo | null = null;
                if (stryMutAct_9fa48("21520") ? data.exams || data.pagination : stryMutAct_9fa48("21519") ? false : stryMutAct_9fa48("21518") ? true : (stryCov_9fa48("21518", "21519", "21520"), data.exams && data.pagination)) {
                  if (stryMutAct_9fa48("21521")) {
                    {}
                  } else {
                    stryCov_9fa48("21521");
                    // Nueva estructura con paginación
                    examsData = data.exams;
                    paginationData = data.pagination;
                  }
                } else if (stryMutAct_9fa48("21523") ? false : stryMutAct_9fa48("21522") ? true : (stryCov_9fa48("21522", "21523"), Array.isArray(data))) {
                  if (stryMutAct_9fa48("21524")) {
                    {}
                  } else {
                    stryCov_9fa48("21524");
                    // Estructura antigua (sin paginación) - retrocompatibilidad
                    examsData = data;
                  }
                } else {
                  if (stryMutAct_9fa48("21525")) {
                    {}
                  } else {
                    stryCov_9fa48("21525");
                    throw new Error(stryMutAct_9fa48("21526") ? "" : (stryCov_9fa48("21526"), 'Formato de respuesta inválido del servidor'));
                  }
                }

                // Validar estructura básica de cada examen
                const validExams = stryMutAct_9fa48("21527") ? examsData : (stryCov_9fa48("21527"), examsData.filter(stryMutAct_9fa48("21528") ? () => undefined : (stryCov_9fa48("21528"), (exam: Exam) => stryMutAct_9fa48("21531") ? exam?.id && exam?.titulo && exam?.subject?.id || typeof exam.totalPreguntas === 'number' : stryMutAct_9fa48("21530") ? false : stryMutAct_9fa48("21529") ? true : (stryCov_9fa48("21529", "21530", "21531"), (stryMutAct_9fa48("21533") ? exam?.id && exam?.titulo || exam?.subject?.id : stryMutAct_9fa48("21532") ? true : (stryCov_9fa48("21532", "21533"), (stryMutAct_9fa48("21535") ? exam?.id || exam?.titulo : stryMutAct_9fa48("21534") ? true : (stryCov_9fa48("21534", "21535"), (stryMutAct_9fa48("21536") ? exam.id : (stryCov_9fa48("21536"), exam?.id)) && (stryMutAct_9fa48("21537") ? exam.titulo : (stryCov_9fa48("21537"), exam?.titulo)))) && (stryMutAct_9fa48("21539") ? exam.subject?.id : stryMutAct_9fa48("21538") ? exam?.subject.id : (stryCov_9fa48("21538", "21539"), exam?.subject?.id)))) && (stryMutAct_9fa48("21541") ? typeof exam.totalPreguntas !== 'number' : stryMutAct_9fa48("21540") ? true : (stryCov_9fa48("21540", "21541"), typeof exam.totalPreguntas === (stryMutAct_9fa48("21542") ? "" : (stryCov_9fa48("21542"), 'number'))))))));
                if (stryMutAct_9fa48("21545") ? validExams.length === examsData.length : stryMutAct_9fa48("21544") ? false : stryMutAct_9fa48("21543") ? true : (stryCov_9fa48("21543", "21544", "21545"), validExams.length !== examsData.length)) {
                  if (stryMutAct_9fa48("21546")) {
                    {}
                  } else {
                    stryCov_9fa48("21546");
                    // Warning usando servicio de monitoreo
                    captureError(new Error(stryMutAct_9fa48("21547") ? "" : (stryCov_9fa48("21547"), 'Algunos exámenes tienen estructura inválida y fueron filtrados')), stryMutAct_9fa48("21548") ? {} : (stryCov_9fa48("21548"), {
                      type: stryMutAct_9fa48("21549") ? "" : (stryCov_9fa48("21549"), 'exams_validation_warning'),
                      filteredCount: stryMutAct_9fa48("21550") ? examsData.length + validExams.length : (stryCov_9fa48("21550"), examsData.length - validExams.length),
                      totalCount: examsData.length,
                      path: (stryMutAct_9fa48("21553") ? typeof window === 'undefined' : stryMutAct_9fa48("21552") ? false : stryMutAct_9fa48("21551") ? true : (stryCov_9fa48("21551", "21552", "21553"), typeof window !== (stryMutAct_9fa48("21554") ? "" : (stryCov_9fa48("21554"), 'undefined')))) ? window.location.pathname : undefined
                    }));
                  }
                }
                setExams(validExams);
                setPagination(paginationData);
              }
            } catch (err) {
              if (stryMutAct_9fa48("21555")) {
                {}
              } else {
                stryCov_9fa48("21555");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("21556") ? "" : (stryCov_9fa48("21556"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("21557")) {
                {}
              } else {
                stryCov_9fa48("21557");
                setIsLoading(stryMutAct_9fa48("21558") ? true : (stryCov_9fa48("21558"), false));
              }
            }
          }
        }
        loadExams();
      }
    }, stryMutAct_9fa48("21559") ? [] : (stryCov_9fa48("21559"), [options.subjectId, options.tipo, options.limit, options.offset]));

    // Filtrar exámenes por búsqueda
    const filterExams = useMemo(() => {
      if (stryMutAct_9fa48("21560")) {
        {}
      } else {
        stryCov_9fa48("21560");
        return (searchQuery: string): Exam[] => {
          if (stryMutAct_9fa48("21561")) {
            {}
          } else {
            stryCov_9fa48("21561");
            if (stryMutAct_9fa48("21564") ? false : stryMutAct_9fa48("21563") ? true : stryMutAct_9fa48("21562") ? searchQuery.trim() : (stryCov_9fa48("21562", "21563", "21564"), !(stryMutAct_9fa48("21565") ? searchQuery : (stryCov_9fa48("21565"), searchQuery.trim())))) {
              if (stryMutAct_9fa48("21566")) {
                {}
              } else {
                stryCov_9fa48("21566");
                return exams;
              }
            }
            const query = stryMutAct_9fa48("21568") ? searchQuery.toUpperCase().trim() : stryMutAct_9fa48("21567") ? searchQuery.toLowerCase() : (stryCov_9fa48("21567", "21568"), searchQuery.toLowerCase().trim());
            return stryMutAct_9fa48("21569") ? exams : (stryCov_9fa48("21569"), exams.filter(stryMutAct_9fa48("21570") ? () => undefined : (stryCov_9fa48("21570"), exam => stryMutAct_9fa48("21573") ? (exam.titulo.toLowerCase().includes(query) || exam.descripcion?.toLowerCase().includes(query) || exam.subject.nombre.toLowerCase().includes(query)) && exam.subject.codigo.toLowerCase().includes(query) : stryMutAct_9fa48("21572") ? false : stryMutAct_9fa48("21571") ? true : (stryCov_9fa48("21571", "21572", "21573"), (stryMutAct_9fa48("21575") ? (exam.titulo.toLowerCase().includes(query) || exam.descripcion?.toLowerCase().includes(query)) && exam.subject.nombre.toLowerCase().includes(query) : stryMutAct_9fa48("21574") ? false : (stryCov_9fa48("21574", "21575"), (stryMutAct_9fa48("21577") ? exam.titulo.toLowerCase().includes(query) && exam.descripcion?.toLowerCase().includes(query) : stryMutAct_9fa48("21576") ? false : (stryCov_9fa48("21576", "21577"), (stryMutAct_9fa48("21578") ? exam.titulo.toUpperCase().includes(query) : (stryCov_9fa48("21578"), exam.titulo.toLowerCase().includes(query))) || (stryMutAct_9fa48("21580") ? exam.descripcion.toLowerCase().includes(query) : stryMutAct_9fa48("21579") ? exam.descripcion?.toUpperCase().includes(query) : (stryCov_9fa48("21579", "21580"), exam.descripcion?.toLowerCase().includes(query))))) || (stryMutAct_9fa48("21581") ? exam.subject.nombre.toUpperCase().includes(query) : (stryCov_9fa48("21581"), exam.subject.nombre.toLowerCase().includes(query))))) || (stryMutAct_9fa48("21582") ? exam.subject.codigo.toUpperCase().includes(query) : (stryCov_9fa48("21582"), exam.subject.codigo.toLowerCase().includes(query)))))));
          }
        };
      }
    }, stryMutAct_9fa48("21583") ? [] : (stryCov_9fa48("21583"), [exams]));

    // Obtener asignaturas únicas
    const subjects = useMemo(() => {
      if (stryMutAct_9fa48("21584")) {
        {}
      } else {
        stryCov_9fa48("21584");
        const uniqueSubjects = new Map<string, {
          id: string;
          nombre: string;
          codigo: string;
        }>();
        exams.forEach(exam => {
          if (stryMutAct_9fa48("21585")) {
            {}
          } else {
            stryCov_9fa48("21585");
            if (stryMutAct_9fa48("21588") ? false : stryMutAct_9fa48("21587") ? true : stryMutAct_9fa48("21586") ? uniqueSubjects.has(exam.subject.id) : (stryCov_9fa48("21586", "21587", "21588"), !uniqueSubjects.has(exam.subject.id))) {
              if (stryMutAct_9fa48("21589")) {
                {}
              } else {
                stryCov_9fa48("21589");
                uniqueSubjects.set(exam.subject.id, exam.subject);
              }
            }
          }
        });
        return stryMutAct_9fa48("21590") ? Array.from(uniqueSubjects.values()) : (stryCov_9fa48("21590"), Array.from(uniqueSubjects.values()).sort(stryMutAct_9fa48("21591") ? () => undefined : (stryCov_9fa48("21591"), (a, b) => a.nombre.localeCompare(b.nombre))));
      }
    }, stryMutAct_9fa48("21592") ? [] : (stryCov_9fa48("21592"), [exams]));

    // Obtener tipos únicos
    const tipos = useMemo(() => {
      if (stryMutAct_9fa48("21593")) {
        {}
      } else {
        stryCov_9fa48("21593");
        const uniqueTipos = new Set<string>();
        exams.forEach(exam => {
          if (stryMutAct_9fa48("21594")) {
            {}
          } else {
            stryCov_9fa48("21594");
            if (stryMutAct_9fa48("21596") ? false : stryMutAct_9fa48("21595") ? true : (stryCov_9fa48("21595", "21596"), exam.tipo)) {
              if (stryMutAct_9fa48("21597")) {
                {}
              } else {
                stryCov_9fa48("21597");
                uniqueTipos.add(exam.tipo);
              }
            }
          }
        });
        return stryMutAct_9fa48("21598") ? Array.from(uniqueTipos) : (stryCov_9fa48("21598"), Array.from(uniqueTipos).sort());
      }
    }, stryMutAct_9fa48("21599") ? [] : (stryCov_9fa48("21599"), [exams]));
    return stryMutAct_9fa48("21600") ? {} : (stryCov_9fa48("21600"), {
      exams,
      pagination,
      isLoading,
      error,
      filterExams,
      subjects,
      tipos,
      refetch: () => {
        if (stryMutAct_9fa48("21601")) {
          {}
        } else {
          stryCov_9fa48("21601");
          // Trigger reload by updating dependencies
          setExams(stryMutAct_9fa48("21602") ? ["Stryker was here"] : (stryCov_9fa48("21602"), []));
          setIsLoading(stryMutAct_9fa48("21603") ? false : (stryCov_9fa48("21603"), true));
        }
      }
    });
  }
}