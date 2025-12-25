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
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, Filter, Home, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { MaterialCard } from '@/components/materials/material-card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Pagination } from '@/components/ui/pagination';
interface Material {
  id: string;
  titulo: string;
  contenido: string;
  fuente: string | null;
  tipo: string;
  createdAt: string;
  subject: {
    id: string;
    nombre: string;
    codigo: string;
  };
  topic: {
    id: string;
    nombre: string;
    ejeTematico: string;
  } | null;
}
interface Subject {
  id: string;
  nombre: string;
  codigo: string;
}
export default function MaterialsPage() {
  if (stryMutAct_9fa48("13978")) {
    {}
  } else {
    stryCov_9fa48("13978");
    const router = useRouter();
    const [materials, setMaterials] = useState<Material[]>(stryMutAct_9fa48("13979") ? ["Stryker was here"] : (stryCov_9fa48("13979"), []));
    const [subjects, setSubjects] = useState<Subject[]>(stryMutAct_9fa48("13980") ? ["Stryker was here"] : (stryCov_9fa48("13980"), []));
    const [topics, setTopics] = useState<Array<{
      id: string;
      nombre: string;
    }>>(stryMutAct_9fa48("13981") ? ["Stryker was here"] : (stryCov_9fa48("13981"), []));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("13982") ? false : (stryCov_9fa48("13982"), true));
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("13983") ? "Stryker was here!" : (stryCov_9fa48("13983"), ''));
    const [selectedSubject, setSelectedSubject] = useState<string>(stryMutAct_9fa48("13984") ? "" : (stryCov_9fa48("13984"), 'all'));
    const [selectedTopic, setSelectedTopic] = useState<string>(stryMutAct_9fa48("13985") ? "" : (stryCov_9fa48("13985"), 'all'));
    const [selectedTipo, setSelectedTipo] = useState<string>(stryMutAct_9fa48("13986") ? "" : (stryCov_9fa48("13986"), 'all'));
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    } | null>(null);
    const itemsPerPage = 20;

    // Debounce de búsqueda
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
      if (stryMutAct_9fa48("13987")) {
        {}
      } else {
        stryCov_9fa48("13987");
        setCurrentPage(1);
      }
    }, stryMutAct_9fa48("13988") ? [] : (stryCov_9fa48("13988"), [selectedSubject, selectedTopic, selectedTipo, searchQuery]));

    // Cargar materiales
    useEffect(() => {
      if (stryMutAct_9fa48("13989")) {
        {}
      } else {
        stryCov_9fa48("13989");
        async function loadMaterials() {
          if (stryMutAct_9fa48("13990")) {
            {}
          } else {
            stryCov_9fa48("13990");
            try {
              if (stryMutAct_9fa48("13991")) {
                {}
              } else {
                stryCov_9fa48("13991");
                setIsLoading(stryMutAct_9fa48("13992") ? false : (stryCov_9fa48("13992"), true));
                setError(null);
                const params = new URLSearchParams();
                if (stryMutAct_9fa48("13995") ? selectedSubject || selectedSubject !== 'all' : stryMutAct_9fa48("13994") ? false : stryMutAct_9fa48("13993") ? true : (stryCov_9fa48("13993", "13994", "13995"), selectedSubject && (stryMutAct_9fa48("13997") ? selectedSubject === 'all' : stryMutAct_9fa48("13996") ? true : (stryCov_9fa48("13996", "13997"), selectedSubject !== (stryMutAct_9fa48("13998") ? "" : (stryCov_9fa48("13998"), 'all')))))) {
                  if (stryMutAct_9fa48("13999")) {
                    {}
                  } else {
                    stryCov_9fa48("13999");
                    params.append(stryMutAct_9fa48("14000") ? "" : (stryCov_9fa48("14000"), 'subjectId'), selectedSubject);
                  }
                }
                if (stryMutAct_9fa48("14003") ? selectedTopic || selectedTopic !== 'all' : stryMutAct_9fa48("14002") ? false : stryMutAct_9fa48("14001") ? true : (stryCov_9fa48("14001", "14002", "14003"), selectedTopic && (stryMutAct_9fa48("14005") ? selectedTopic === 'all' : stryMutAct_9fa48("14004") ? true : (stryCov_9fa48("14004", "14005"), selectedTopic !== (stryMutAct_9fa48("14006") ? "" : (stryCov_9fa48("14006"), 'all')))))) {
                  if (stryMutAct_9fa48("14007")) {
                    {}
                  } else {
                    stryCov_9fa48("14007");
                    params.append(stryMutAct_9fa48("14008") ? "" : (stryCov_9fa48("14008"), 'topicId'), selectedTopic);
                  }
                }
                if (stryMutAct_9fa48("14011") ? selectedTipo || selectedTipo !== 'all' : stryMutAct_9fa48("14010") ? false : stryMutAct_9fa48("14009") ? true : (stryCov_9fa48("14009", "14010", "14011"), selectedTipo && (stryMutAct_9fa48("14013") ? selectedTipo === 'all' : stryMutAct_9fa48("14012") ? true : (stryCov_9fa48("14012", "14013"), selectedTipo !== (stryMutAct_9fa48("14014") ? "" : (stryCov_9fa48("14014"), 'all')))))) {
                  if (stryMutAct_9fa48("14015")) {
                    {}
                  } else {
                    stryCov_9fa48("14015");
                    params.append(stryMutAct_9fa48("14016") ? "" : (stryCov_9fa48("14016"), 'tipo'), selectedTipo);
                  }
                }
                params.append(stryMutAct_9fa48("14017") ? "" : (stryCov_9fa48("14017"), 'limit'), itemsPerPage.toString());
                params.append(stryMutAct_9fa48("14018") ? "" : (stryCov_9fa48("14018"), 'offset'), (stryMutAct_9fa48("14019") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("14019"), (stryMutAct_9fa48("14020") ? currentPage + 1 : (stryCov_9fa48("14020"), currentPage - 1)) * itemsPerPage)).toString());
                const url = stryMutAct_9fa48("14021") ? `` : (stryCov_9fa48("14021"), `/api/materials${params.toString() ? stryMutAct_9fa48("14022") ? `` : (stryCov_9fa48("14022"), `?${params.toString()}`) : stryMutAct_9fa48("14023") ? "Stryker was here!" : (stryCov_9fa48("14023"), '')}`);
                const res = await fetch(url);
                if (stryMutAct_9fa48("14026") ? res.status !== 401 : stryMutAct_9fa48("14025") ? false : stryMutAct_9fa48("14024") ? true : (stryCov_9fa48("14024", "14025", "14026"), res.status === 401)) {
                  if (stryMutAct_9fa48("14027")) {
                    {}
                  } else {
                    stryCov_9fa48("14027");
                    router.push(stryMutAct_9fa48("14028") ? "" : (stryCov_9fa48("14028"), '/auth/signin?callbackUrl=/materials'));
                    return;
                  }
                }
                if (stryMutAct_9fa48("14031") ? false : stryMutAct_9fa48("14030") ? true : stryMutAct_9fa48("14029") ? res.ok : (stryCov_9fa48("14029", "14030", "14031"), !res.ok)) {
                  if (stryMutAct_9fa48("14032")) {
                    {}
                  } else {
                    stryCov_9fa48("14032");
                    throw new Error(stryMutAct_9fa48("14033") ? "" : (stryCov_9fa48("14033"), 'Error al cargar materiales'));
                  }
                }
                const data = await res.json();

                // Manejar nueva estructura con paginación o estructura antigua
                let materialsData: Material[];
                let paginationData: typeof pagination = null;
                if (stryMutAct_9fa48("14036") ? data.materials || data.pagination : stryMutAct_9fa48("14035") ? false : stryMutAct_9fa48("14034") ? true : (stryCov_9fa48("14034", "14035", "14036"), data.materials && data.pagination)) {
                  if (stryMutAct_9fa48("14037")) {
                    {}
                  } else {
                    stryCov_9fa48("14037");
                    // Nueva estructura con paginación
                    materialsData = data.materials;
                    paginationData = data.pagination;
                  }
                } else if (stryMutAct_9fa48("14039") ? false : stryMutAct_9fa48("14038") ? true : (stryCov_9fa48("14038", "14039"), Array.isArray(data))) {
                  if (stryMutAct_9fa48("14040")) {
                    {}
                  } else {
                    stryCov_9fa48("14040");
                    // Estructura antigua (sin paginación) - retrocompatibilidad
                    materialsData = data;
                  }
                } else {
                  if (stryMutAct_9fa48("14041")) {
                    {}
                  } else {
                    stryCov_9fa48("14041");
                    throw new Error(stryMutAct_9fa48("14042") ? "" : (stryCov_9fa48("14042"), 'Formato de respuesta inválido'));
                  }
                }
                setMaterials(materialsData);
                setPagination(paginationData);

                // Extraer asignaturas únicas
                const uniqueSubjects = new Map<string, Subject>();
                materialsData.forEach((material: Material) => {
                  if (stryMutAct_9fa48("14043")) {
                    {}
                  } else {
                    stryCov_9fa48("14043");
                    if (stryMutAct_9fa48("14046") ? false : stryMutAct_9fa48("14045") ? true : stryMutAct_9fa48("14044") ? uniqueSubjects.has(material.subject.id) : (stryCov_9fa48("14044", "14045", "14046"), !uniqueSubjects.has(material.subject.id))) {
                      if (stryMutAct_9fa48("14047")) {
                        {}
                      } else {
                        stryCov_9fa48("14047");
                        uniqueSubjects.set(material.subject.id, material.subject);
                      }
                    }
                  }
                });
                setSubjects(stryMutAct_9fa48("14048") ? Array.from(uniqueSubjects.values()) : (stryCov_9fa48("14048"), Array.from(uniqueSubjects.values()).sort(stryMutAct_9fa48("14049") ? () => undefined : (stryCov_9fa48("14049"), (a, b) => a.nombre.localeCompare(b.nombre)))));

                // Extraer temas únicos (solo del subject seleccionado)
                if (stryMutAct_9fa48("14052") ? selectedSubject || selectedSubject !== 'all' : stryMutAct_9fa48("14051") ? false : stryMutAct_9fa48("14050") ? true : (stryCov_9fa48("14050", "14051", "14052"), selectedSubject && (stryMutAct_9fa48("14054") ? selectedSubject === 'all' : stryMutAct_9fa48("14053") ? true : (stryCov_9fa48("14053", "14054"), selectedSubject !== (stryMutAct_9fa48("14055") ? "" : (stryCov_9fa48("14055"), 'all')))))) {
                  if (stryMutAct_9fa48("14056")) {
                    {}
                  } else {
                    stryCov_9fa48("14056");
                    const uniqueTopics = new Map<string, {
                      id: string;
                      nombre: string;
                    }>();
                    materialsData.forEach((material: Material) => {
                      if (stryMutAct_9fa48("14057")) {
                        {}
                      } else {
                        stryCov_9fa48("14057");
                        if (stryMutAct_9fa48("14060") ? material.topic || !uniqueTopics.has(material.topic.id) : stryMutAct_9fa48("14059") ? false : stryMutAct_9fa48("14058") ? true : (stryCov_9fa48("14058", "14059", "14060"), material.topic && (stryMutAct_9fa48("14061") ? uniqueTopics.has(material.topic.id) : (stryCov_9fa48("14061"), !uniqueTopics.has(material.topic.id))))) {
                          if (stryMutAct_9fa48("14062")) {
                            {}
                          } else {
                            stryCov_9fa48("14062");
                            uniqueTopics.set(material.topic.id, stryMutAct_9fa48("14063") ? {} : (stryCov_9fa48("14063"), {
                              id: material.topic.id,
                              nombre: material.topic.nombre
                            }));
                          }
                        }
                      }
                    });
                    setTopics(stryMutAct_9fa48("14064") ? Array.from(uniqueTopics.values()) : (stryCov_9fa48("14064"), Array.from(uniqueTopics.values()).sort(stryMutAct_9fa48("14065") ? () => undefined : (stryCov_9fa48("14065"), (a, b) => a.nombre.localeCompare(b.nombre)))));
                  }
                } else {
                  if (stryMutAct_9fa48("14066")) {
                    {}
                  } else {
                    stryCov_9fa48("14066");
                    setTopics(stryMutAct_9fa48("14067") ? ["Stryker was here"] : (stryCov_9fa48("14067"), []));
                  }
                }
              }
            } catch (err) {
              if (stryMutAct_9fa48("14068")) {
                {}
              } else {
                stryCov_9fa48("14068");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("14069") ? "" : (stryCov_9fa48("14069"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("14070")) {
                {}
              } else {
                stryCov_9fa48("14070");
                setIsLoading(stryMutAct_9fa48("14071") ? true : (stryCov_9fa48("14071"), false));
              }
            }
          }
        }
        loadMaterials();
      }
    }, stryMutAct_9fa48("14072") ? [] : (stryCov_9fa48("14072"), [selectedSubject, selectedTopic, selectedTipo, currentPage, router]));

    // Filtrar materiales por búsqueda (mejorado para malla curricular chilena)
    const filteredMaterials = useMemo(() => {
      if (stryMutAct_9fa48("14073")) {
        {}
      } else {
        stryCov_9fa48("14073");
        if (stryMutAct_9fa48("14076") ? false : stryMutAct_9fa48("14075") ? true : stryMutAct_9fa48("14074") ? debouncedSearchQuery.trim() : (stryCov_9fa48("14074", "14075", "14076"), !(stryMutAct_9fa48("14077") ? debouncedSearchQuery : (stryCov_9fa48("14077"), debouncedSearchQuery.trim())))) {
          if (stryMutAct_9fa48("14078")) {
            {}
          } else {
            stryCov_9fa48("14078");
            return materials;
          }
        }
        const query = stryMutAct_9fa48("14080") ? debouncedSearchQuery.toUpperCase().trim() : stryMutAct_9fa48("14079") ? debouncedSearchQuery.toLowerCase() : (stryCov_9fa48("14079", "14080"), debouncedSearchQuery.toLowerCase().trim());
        const queryWords = stryMutAct_9fa48("14081") ? query.split(/\s+/) : (stryCov_9fa48("14081"), query.split(stryMutAct_9fa48("14083") ? /\S+/ : stryMutAct_9fa48("14082") ? /\s/ : (stryCov_9fa48("14082", "14083"), /\s+/)).filter(stryMutAct_9fa48("14084") ? () => undefined : (stryCov_9fa48("14084"), w => stryMutAct_9fa48("14088") ? w.length <= 0 : stryMutAct_9fa48("14087") ? w.length >= 0 : stryMutAct_9fa48("14086") ? false : stryMutAct_9fa48("14085") ? true : (stryCov_9fa48("14085", "14086", "14087", "14088"), w.length > 0))));
        return stryMutAct_9fa48("14090") ? materials.map(material => {
          // Calcular relevancia basada en malla curricular
          let relevance = 0;

          // Búsqueda en título (mayor peso)
          const titleMatch = material.titulo.toLowerCase();
          queryWords.forEach(word => {
            if (titleMatch.includes(word)) relevance += 10;
          });

          // Búsqueda en contenido
          const contentMatch = material.contenido.toLowerCase();
          queryWords.forEach(word => {
            if (contentMatch.includes(word)) relevance += 2;
          });

          // Búsqueda en asignatura (según malla curricular)
          const subjectMatch = material.subject.nombre.toLowerCase();
          queryWords.forEach(word => {
            if (subjectMatch.includes(word)) relevance += 5;
          });

          // Búsqueda en tema y eje temático (alta relevancia curricular)
          if (material.topic) {
            const topicMatch = material.topic.nombre.toLowerCase();
            const ejeMatch = material.topic.ejeTematico.toLowerCase();
            queryWords.forEach(word => {
              if (topicMatch.includes(word)) relevance += 8;
              if (ejeMatch.includes(word)) relevance += 7;
            });
          }

          // Búsqueda en tipo
          const tipoMatch = material.tipo.toLowerCase();
          queryWords.forEach(word => {
            if (tipoMatch.includes(word)) relevance += 1;
          });
          return {
            material,
            relevance
          };
        }).sort((a, b) => b.relevance - a.relevance) // Ordenar por relevancia
        .map(({
          material
        }) => material) : stryMutAct_9fa48("14089") ? materials.map(material => {
          // Calcular relevancia basada en malla curricular
          let relevance = 0;

          // Búsqueda en título (mayor peso)
          const titleMatch = material.titulo.toLowerCase();
          queryWords.forEach(word => {
            if (titleMatch.includes(word)) relevance += 10;
          });

          // Búsqueda en contenido
          const contentMatch = material.contenido.toLowerCase();
          queryWords.forEach(word => {
            if (contentMatch.includes(word)) relevance += 2;
          });

          // Búsqueda en asignatura (según malla curricular)
          const subjectMatch = material.subject.nombre.toLowerCase();
          queryWords.forEach(word => {
            if (subjectMatch.includes(word)) relevance += 5;
          });

          // Búsqueda en tema y eje temático (alta relevancia curricular)
          if (material.topic) {
            const topicMatch = material.topic.nombre.toLowerCase();
            const ejeMatch = material.topic.ejeTematico.toLowerCase();
            queryWords.forEach(word => {
              if (topicMatch.includes(word)) relevance += 8;
              if (ejeMatch.includes(word)) relevance += 7;
            });
          }

          // Búsqueda en tipo
          const tipoMatch = material.tipo.toLowerCase();
          queryWords.forEach(word => {
            if (tipoMatch.includes(word)) relevance += 1;
          });
          return {
            material,
            relevance
          };
        }).filter(({
          relevance
        }) => relevance > 0)
        // Ordenar por relevancia
        .map(({
          material
        }) => material) : (stryCov_9fa48("14089", "14090"), materials.map(material => {
          if (stryMutAct_9fa48("14091")) {
            {}
          } else {
            stryCov_9fa48("14091");
            // Calcular relevancia basada en malla curricular
            let relevance = 0;

            // Búsqueda en título (mayor peso)
            const titleMatch = stryMutAct_9fa48("14092") ? material.titulo.toUpperCase() : (stryCov_9fa48("14092"), material.titulo.toLowerCase());
            queryWords.forEach(word => {
              if (stryMutAct_9fa48("14093")) {
                {}
              } else {
                stryCov_9fa48("14093");
                if (stryMutAct_9fa48("14095") ? false : stryMutAct_9fa48("14094") ? true : (stryCov_9fa48("14094", "14095"), titleMatch.includes(word))) stryMutAct_9fa48("14096") ? relevance -= 10 : (stryCov_9fa48("14096"), relevance += 10);
              }
            });

            // Búsqueda en contenido
            const contentMatch = stryMutAct_9fa48("14097") ? material.contenido.toUpperCase() : (stryCov_9fa48("14097"), material.contenido.toLowerCase());
            queryWords.forEach(word => {
              if (stryMutAct_9fa48("14098")) {
                {}
              } else {
                stryCov_9fa48("14098");
                if (stryMutAct_9fa48("14100") ? false : stryMutAct_9fa48("14099") ? true : (stryCov_9fa48("14099", "14100"), contentMatch.includes(word))) stryMutAct_9fa48("14101") ? relevance -= 2 : (stryCov_9fa48("14101"), relevance += 2);
              }
            });

            // Búsqueda en asignatura (según malla curricular)
            const subjectMatch = stryMutAct_9fa48("14102") ? material.subject.nombre.toUpperCase() : (stryCov_9fa48("14102"), material.subject.nombre.toLowerCase());
            queryWords.forEach(word => {
              if (stryMutAct_9fa48("14103")) {
                {}
              } else {
                stryCov_9fa48("14103");
                if (stryMutAct_9fa48("14105") ? false : stryMutAct_9fa48("14104") ? true : (stryCov_9fa48("14104", "14105"), subjectMatch.includes(word))) stryMutAct_9fa48("14106") ? relevance -= 5 : (stryCov_9fa48("14106"), relevance += 5);
              }
            });

            // Búsqueda en tema y eje temático (alta relevancia curricular)
            if (stryMutAct_9fa48("14108") ? false : stryMutAct_9fa48("14107") ? true : (stryCov_9fa48("14107", "14108"), material.topic)) {
              if (stryMutAct_9fa48("14109")) {
                {}
              } else {
                stryCov_9fa48("14109");
                const topicMatch = stryMutAct_9fa48("14110") ? material.topic.nombre.toUpperCase() : (stryCov_9fa48("14110"), material.topic.nombre.toLowerCase());
                const ejeMatch = stryMutAct_9fa48("14111") ? material.topic.ejeTematico.toUpperCase() : (stryCov_9fa48("14111"), material.topic.ejeTematico.toLowerCase());
                queryWords.forEach(word => {
                  if (stryMutAct_9fa48("14112")) {
                    {}
                  } else {
                    stryCov_9fa48("14112");
                    if (stryMutAct_9fa48("14114") ? false : stryMutAct_9fa48("14113") ? true : (stryCov_9fa48("14113", "14114"), topicMatch.includes(word))) stryMutAct_9fa48("14115") ? relevance -= 8 : (stryCov_9fa48("14115"), relevance += 8);
                    if (stryMutAct_9fa48("14117") ? false : stryMutAct_9fa48("14116") ? true : (stryCov_9fa48("14116", "14117"), ejeMatch.includes(word))) stryMutAct_9fa48("14118") ? relevance -= 7 : (stryCov_9fa48("14118"), relevance += 7);
                  }
                });
              }
            }

            // Búsqueda en tipo
            const tipoMatch = stryMutAct_9fa48("14119") ? material.tipo.toUpperCase() : (stryCov_9fa48("14119"), material.tipo.toLowerCase());
            queryWords.forEach(word => {
              if (stryMutAct_9fa48("14120")) {
                {}
              } else {
                stryCov_9fa48("14120");
                if (stryMutAct_9fa48("14122") ? false : stryMutAct_9fa48("14121") ? true : (stryCov_9fa48("14121", "14122"), tipoMatch.includes(word))) stryMutAct_9fa48("14123") ? relevance -= 1 : (stryCov_9fa48("14123"), relevance += 1);
              }
            });
            return stryMutAct_9fa48("14124") ? {} : (stryCov_9fa48("14124"), {
              material,
              relevance
            });
          }
        }).filter(stryMutAct_9fa48("14125") ? () => undefined : (stryCov_9fa48("14125"), ({
          relevance
        }) => stryMutAct_9fa48("14129") ? relevance <= 0 : stryMutAct_9fa48("14128") ? relevance >= 0 : stryMutAct_9fa48("14127") ? false : stryMutAct_9fa48("14126") ? true : (stryCov_9fa48("14126", "14127", "14128", "14129"), relevance > 0))).sort(stryMutAct_9fa48("14130") ? () => undefined : (stryCov_9fa48("14130"), (a, b) => stryMutAct_9fa48("14131") ? b.relevance + a.relevance : (stryCov_9fa48("14131"), b.relevance - a.relevance))) // Ordenar por relevancia
        .map(stryMutAct_9fa48("14132") ? () => undefined : (stryCov_9fa48("14132"), ({
          material
        }) => material)));
      }
    }, stryMutAct_9fa48("14133") ? [] : (stryCov_9fa48("14133"), [materials, debouncedSearchQuery]));

    // Obtener tipos únicos
    const tipos = useMemo(() => {
      if (stryMutAct_9fa48("14134")) {
        {}
      } else {
        stryCov_9fa48("14134");
        const uniqueTipos = new Set<string>();
        materials.forEach(material => {
          if (stryMutAct_9fa48("14135")) {
            {}
          } else {
            stryCov_9fa48("14135");
            if (stryMutAct_9fa48("14137") ? false : stryMutAct_9fa48("14136") ? true : (stryCov_9fa48("14136", "14137"), material.tipo)) {
              if (stryMutAct_9fa48("14138")) {
                {}
              } else {
                stryCov_9fa48("14138");
                uniqueTipos.add(material.tipo);
              }
            }
          }
        });
        return stryMutAct_9fa48("14139") ? Array.from(uniqueTipos) : (stryCov_9fa48("14139"), Array.from(uniqueTipos).sort());
      }
    }, stryMutAct_9fa48("14140") ? [] : (stryCov_9fa48("14140"), [materials]));
    if (stryMutAct_9fa48("14142") ? false : stryMutAct_9fa48("14141") ? true : (stryCov_9fa48("14141", "14142"), isLoading)) {
      if (stryMutAct_9fa48("14143")) {
        {}
      } else {
        stryCov_9fa48("14143");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando materiales...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("14145") ? false : stryMutAct_9fa48("14144") ? true : (stryCov_9fa48("14144", "14145"), error)) {
      if (stryMutAct_9fa48("14146")) {
        {}
      } else {
        stryCov_9fa48("14146");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={stryMutAct_9fa48("14147") ? () => undefined : (stryCov_9fa48("14147"), () => window.location.reload())}>Reintentar</Button>
        </div>
      </div>;
      }
    }
    return <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={stryMutAct_9fa48("14148") ? [] : (stryCov_9fa48("14148"), [stryMutAct_9fa48("14149") ? {} : (stryCov_9fa48("14149"), {
          label: stryMutAct_9fa48("14150") ? "" : (stryCov_9fa48("14150"), 'Inicio'),
          href: stryMutAct_9fa48("14151") ? "" : (stryCov_9fa48("14151"), '/')
        }), stryMutAct_9fa48("14152") ? {} : (stryCov_9fa48("14152"), {
          label: stryMutAct_9fa48("14153") ? "" : (stryCov_9fa48("14153"), 'Materiales de Estudio')
        })])} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Materiales de Estudio</h1>
            <p className="text-muted-foreground">
              Recursos educativos para reforzar tus conocimientos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <FileText className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Buscar materiales..." value={searchQuery} onChange={stryMutAct_9fa48("14154") ? () => undefined : (stryCov_9fa48("14154"), e => setSearchQuery(e.target.value))} className="pl-10" role="search" aria-label="Buscar materiales por título, contenido, asignatura o tema" />
              </div>
            </div>

            {/* Filtro por Asignatura */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las asignaturas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las asignaturas</SelectItem>
                {subjects.map(stryMutAct_9fa48("14155") ? () => undefined : (stryCov_9fa48("14155"), subject => <SelectItem key={subject.id} value={subject.id}>
                    {subject.nombre}
                  </SelectItem>))}
              </SelectContent>
            </Select>

            {/* Filtro por Tipo */}
            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tipos.map(stryMutAct_9fa48("14156") ? () => undefined : (stryCov_9fa48("14156"), tipo => <SelectItem key={tipo} value={tipo}>
                    {stryMutAct_9fa48("14157") ? tipo.charAt(0).toUpperCase() - tipo.slice(1) : (stryCov_9fa48("14157"), (stryMutAct_9fa48("14159") ? tipo.toUpperCase() : stryMutAct_9fa48("14158") ? tipo.charAt(0).toLowerCase() : (stryCov_9fa48("14158", "14159"), tipo.charAt(0).toUpperCase())) + (stryMutAct_9fa48("14160") ? tipo : (stryCov_9fa48("14160"), tipo.slice(1))))}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Tema (solo si hay asignatura seleccionada) */}
          {stryMutAct_9fa48("14163") ? selectedSubject && selectedSubject !== 'all' && topics.length > 0 || <div className="mt-4">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Todos los temas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los temas</SelectItem>
                  {topics.map(topic => <SelectItem key={topic.id} value={topic.id}>
                      {topic.nombre}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div> : stryMutAct_9fa48("14162") ? false : stryMutAct_9fa48("14161") ? true : (stryCov_9fa48("14161", "14162", "14163"), (stryMutAct_9fa48("14165") ? selectedSubject && selectedSubject !== 'all' || topics.length > 0 : stryMutAct_9fa48("14164") ? true : (stryCov_9fa48("14164", "14165"), (stryMutAct_9fa48("14167") ? selectedSubject || selectedSubject !== 'all' : stryMutAct_9fa48("14166") ? true : (stryCov_9fa48("14166", "14167"), selectedSubject && (stryMutAct_9fa48("14169") ? selectedSubject === 'all' : stryMutAct_9fa48("14168") ? true : (stryCov_9fa48("14168", "14169"), selectedSubject !== (stryMutAct_9fa48("14170") ? "" : (stryCov_9fa48("14170"), 'all')))))) && (stryMutAct_9fa48("14173") ? topics.length <= 0 : stryMutAct_9fa48("14172") ? topics.length >= 0 : stryMutAct_9fa48("14171") ? true : (stryCov_9fa48("14171", "14172", "14173"), topics.length > 0)))) && <div className="mt-4">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Todos los temas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los temas</SelectItem>
                  {topics.map(stryMutAct_9fa48("14174") ? () => undefined : (stryCov_9fa48("14174"), topic => <SelectItem key={topic.id} value={topic.id}>
                      {topic.nombre}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>)}
        </CardContent>
      </Card>

      {/* Lista de Materiales */}
      {(stryMutAct_9fa48("14177") ? filteredMaterials.length !== 0 : stryMutAct_9fa48("14176") ? false : stryMutAct_9fa48("14175") ? true : (stryCov_9fa48("14175", "14176", "14177"), filteredMaterials.length === 0)) ? <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {(stryMutAct_9fa48("14180") ? (searchQuery || selectedSubject !== 'all' || selectedTopic !== 'all') && selectedTipo !== 'all' : stryMutAct_9fa48("14179") ? false : stryMutAct_9fa48("14178") ? true : (stryCov_9fa48("14178", "14179", "14180"), (stryMutAct_9fa48("14182") ? (searchQuery || selectedSubject !== 'all') && selectedTopic !== 'all' : stryMutAct_9fa48("14181") ? false : (stryCov_9fa48("14181", "14182"), (stryMutAct_9fa48("14184") ? searchQuery && selectedSubject !== 'all' : stryMutAct_9fa48("14183") ? false : (stryCov_9fa48("14183", "14184"), searchQuery || (stryMutAct_9fa48("14186") ? selectedSubject === 'all' : stryMutAct_9fa48("14185") ? false : (stryCov_9fa48("14185", "14186"), selectedSubject !== (stryMutAct_9fa48("14187") ? "" : (stryCov_9fa48("14187"), 'all')))))) || (stryMutAct_9fa48("14189") ? selectedTopic === 'all' : stryMutAct_9fa48("14188") ? false : (stryCov_9fa48("14188", "14189"), selectedTopic !== (stryMutAct_9fa48("14190") ? "" : (stryCov_9fa48("14190"), 'all')))))) || (stryMutAct_9fa48("14192") ? selectedTipo === 'all' : stryMutAct_9fa48("14191") ? false : (stryCov_9fa48("14191", "14192"), selectedTipo !== (stryMutAct_9fa48("14193") ? "" : (stryCov_9fa48("14193"), 'all')))))) ? stryMutAct_9fa48("14194") ? "" : (stryCov_9fa48("14194"), 'No se encontraron materiales con los filtros seleccionados') : stryMutAct_9fa48("14195") ? "" : (stryCov_9fa48("14195"), 'No hay materiales disponibles en este momento')}
            </p>
          </CardContent>
        </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(stryMutAct_9fa48("14196") ? () => undefined : (stryCov_9fa48("14196"), material => <MaterialCard key={material.id} material={material} />))}
        </div>}

      {/* Contador de resultados y paginación */}
      {stryMutAct_9fa48("14199") ? filteredMaterials.length > 0 || <>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {pagination ? <>
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, pagination.total)} -{' '}
                {Math.min(currentPage * itemsPerPage, pagination.total)} de {pagination.total}{' '}
                materiales
              </> : <>
                Mostrando {filteredMaterials.length} de {materials.length} materiales
              </>}
          </div>

          {/* Paginación */}
          {pagination && pagination.total > itemsPerPage && <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={Math.ceil(pagination.total / itemsPerPage)} onPageChange={page => {
            setCurrentPage(page);
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }} />
            </div>}
        </> : stryMutAct_9fa48("14198") ? false : stryMutAct_9fa48("14197") ? true : (stryCov_9fa48("14197", "14198", "14199"), (stryMutAct_9fa48("14202") ? filteredMaterials.length <= 0 : stryMutAct_9fa48("14201") ? filteredMaterials.length >= 0 : stryMutAct_9fa48("14200") ? true : (stryCov_9fa48("14200", "14201", "14202"), filteredMaterials.length > 0)) && <>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {pagination ? <>
                Mostrando {stryMutAct_9fa48("14203") ? Math.max((currentPage - 1) * itemsPerPage + 1, pagination.total) : (stryCov_9fa48("14203"), Math.min(stryMutAct_9fa48("14204") ? (currentPage - 1) * itemsPerPage - 1 : (stryCov_9fa48("14204"), (stryMutAct_9fa48("14205") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("14205"), (stryMutAct_9fa48("14206") ? currentPage + 1 : (stryCov_9fa48("14206"), currentPage - 1)) * itemsPerPage)) + 1), pagination.total))} -{stryMutAct_9fa48("14207") ? "" : (stryCov_9fa48("14207"), ' ')}
                {stryMutAct_9fa48("14208") ? Math.max(currentPage * itemsPerPage, pagination.total) : (stryCov_9fa48("14208"), Math.min(stryMutAct_9fa48("14209") ? currentPage / itemsPerPage : (stryCov_9fa48("14209"), currentPage * itemsPerPage), pagination.total))} de {pagination.total}{stryMutAct_9fa48("14210") ? "" : (stryCov_9fa48("14210"), ' ')}
                materiales
              </> : <>
                Mostrando {filteredMaterials.length} de {materials.length} materiales
              </>}
          </div>

          {/* Paginación */}
          {stryMutAct_9fa48("14213") ? pagination && pagination.total > itemsPerPage || <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={Math.ceil(pagination.total / itemsPerPage)} onPageChange={page => {
            setCurrentPage(page);
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }} />
            </div> : stryMutAct_9fa48("14212") ? false : stryMutAct_9fa48("14211") ? true : (stryCov_9fa48("14211", "14212", "14213"), (stryMutAct_9fa48("14215") ? pagination || pagination.total > itemsPerPage : stryMutAct_9fa48("14214") ? true : (stryCov_9fa48("14214", "14215"), pagination && (stryMutAct_9fa48("14218") ? pagination.total <= itemsPerPage : stryMutAct_9fa48("14217") ? pagination.total >= itemsPerPage : stryMutAct_9fa48("14216") ? true : (stryCov_9fa48("14216", "14217", "14218"), pagination.total > itemsPerPage)))) && <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={Math.ceil(stryMutAct_9fa48("14219") ? pagination.total * itemsPerPage : (stryCov_9fa48("14219"), pagination.total / itemsPerPage))} onPageChange={page => {
            if (stryMutAct_9fa48("14220")) {
              {}
            } else {
              stryCov_9fa48("14220");
              setCurrentPage(page);
              window.scrollTo(stryMutAct_9fa48("14221") ? {} : (stryCov_9fa48("14221"), {
                top: 0,
                behavior: stryMutAct_9fa48("14222") ? "" : (stryCov_9fa48("14222"), 'smooth')
              }));
            }
          }} />
            </div>)}
        </>)}
    </div>;
  }
}