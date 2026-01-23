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
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
export interface AutocompleteSuggestion {
  id: string;
  text: string;
  type?: 'history' | 'popular' | 'contextual' | 'server';
  metadata?: {
    subject?: string;
    topic?: string;
    relevance?: number;
    frequency?: number;
  };
}
export interface UseSmartAutocompleteOptions {
  /**
   * Función para obtener sugerencias del servidor
   */
  fetchSuggestions?: (query: string) => Promise<AutocompleteSuggestion[]>;
  /**
   * Sugerencias locales (historial, populares, etc.)
   */
  localSuggestions?: AutocompleteSuggestion[];
  /**
   * Delay para debounce (ms)
   */
  debounceDelay?: number;
  /**
   * Número mínimo de caracteres para buscar
   */
  minChars?: number;
  /**
   * Máximo número de sugerencias a mostrar
   */
  maxSuggestions?: number;
  /**
   * Callback cuando se selecciona una sugerencia
   */
  onSelect?: (suggestion: AutocompleteSuggestion) => void;
  /**
   * Callback cuando cambia el query
   */
  onQueryChange?: (query: string) => void;
}

/**
 * Hook avanzado para autocompletado inteligente
 * Basado en Nielsen Heuristic #4: Consistency and standards
 * y #8: Flexibility and efficiency
 */
export function useSmartAutocomplete(options: UseSmartAutocompleteOptions = {}) {
  if (stryMutAct_9fa48("22111")) {
    {}
  } else {
    stryCov_9fa48("22111");
    const {
      fetchSuggestions,
      localSuggestions = stryMutAct_9fa48("22112") ? ["Stryker was here"] : (stryCov_9fa48("22112"), []),
      debounceDelay = 200,
      minChars = 2,
      maxSuggestions = 10,
      onSelect,
      onQueryChange
    } = options;
    const [query, setQuery] = useState(stryMutAct_9fa48("22113") ? "Stryker was here!" : (stryCov_9fa48("22113"), ''));
    const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>(stryMutAct_9fa48("22114") ? ["Stryker was here"] : (stryCov_9fa48("22114"), []));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("22115") ? true : (stryCov_9fa48("22115"), false));
    const [selectedIndex, setSelectedIndex] = useState(stryMutAct_9fa48("22116") ? +1 : (stryCov_9fa48("22116"), -1));
    const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("22117") ? true : (stryCov_9fa48("22117"), false));
    const abortControllerRef = useRef<AbortController | null>(null);
    const debouncedQuery = useDebounce(query, debounceDelay);

    // Combinar y rankear sugerencias
    const rankSuggestions = useCallback((local: AutocompleteSuggestion[], server: AutocompleteSuggestion[]): AutocompleteSuggestion[] => {
      if (stryMutAct_9fa48("22118")) {
        {}
      } else {
        stryCov_9fa48("22118");
        const combined = stryMutAct_9fa48("22119") ? [] : (stryCov_9fa48("22119"), [...local, ...server]);

        // Ordenar por relevancia
        return stryMutAct_9fa48("22121") ? combined.slice(0, maxSuggestions) : stryMutAct_9fa48("22120") ? combined.sort((a, b) => {
          // Prioridad por tipo
          const typePriority = {
            history: 4,
            contextual: 3,
            server: 2,
            popular: 1
          };
          const aPriority = typePriority[a.type || 'server'] || 0;
          const bPriority = typePriority[b.type || 'server'] || 0;
          if (aPriority !== bPriority) return bPriority - aPriority;

          // Luego por relevancia
          const aRelevance = a.metadata?.relevance || 0;
          const bRelevance = b.metadata?.relevance || 0;
          if (aRelevance !== bRelevance) return bRelevance - aRelevance;

          // Finalmente por frecuencia
          const aFreq = a.metadata?.frequency || 0;
          const bFreq = b.metadata?.frequency || 0;
          return bFreq - aFreq;
        }) : (stryCov_9fa48("22120", "22121"), combined.sort((a, b) => {
          if (stryMutAct_9fa48("22122")) {
            {}
          } else {
            stryCov_9fa48("22122");
            // Prioridad por tipo
            const typePriority = stryMutAct_9fa48("22123") ? {} : (stryCov_9fa48("22123"), {
              history: 4,
              contextual: 3,
              server: 2,
              popular: 1
            });
            const aPriority = stryMutAct_9fa48("22126") ? typePriority[a.type || 'server'] && 0 : stryMutAct_9fa48("22125") ? false : stryMutAct_9fa48("22124") ? true : (stryCov_9fa48("22124", "22125", "22126"), typePriority[stryMutAct_9fa48("22129") ? a.type && 'server' : stryMutAct_9fa48("22128") ? false : stryMutAct_9fa48("22127") ? true : (stryCov_9fa48("22127", "22128", "22129"), a.type || (stryMutAct_9fa48("22130") ? "" : (stryCov_9fa48("22130"), 'server')))] || 0);
            const bPriority = stryMutAct_9fa48("22133") ? typePriority[b.type || 'server'] && 0 : stryMutAct_9fa48("22132") ? false : stryMutAct_9fa48("22131") ? true : (stryCov_9fa48("22131", "22132", "22133"), typePriority[stryMutAct_9fa48("22136") ? b.type && 'server' : stryMutAct_9fa48("22135") ? false : stryMutAct_9fa48("22134") ? true : (stryCov_9fa48("22134", "22135", "22136"), b.type || (stryMutAct_9fa48("22137") ? "" : (stryCov_9fa48("22137"), 'server')))] || 0);
            if (stryMutAct_9fa48("22140") ? aPriority === bPriority : stryMutAct_9fa48("22139") ? false : stryMutAct_9fa48("22138") ? true : (stryCov_9fa48("22138", "22139", "22140"), aPriority !== bPriority)) return stryMutAct_9fa48("22141") ? bPriority + aPriority : (stryCov_9fa48("22141"), bPriority - aPriority);

            // Luego por relevancia
            const aRelevance = stryMutAct_9fa48("22144") ? a.metadata?.relevance && 0 : stryMutAct_9fa48("22143") ? false : stryMutAct_9fa48("22142") ? true : (stryCov_9fa48("22142", "22143", "22144"), (stryMutAct_9fa48("22145") ? a.metadata.relevance : (stryCov_9fa48("22145"), a.metadata?.relevance)) || 0);
            const bRelevance = stryMutAct_9fa48("22148") ? b.metadata?.relevance && 0 : stryMutAct_9fa48("22147") ? false : stryMutAct_9fa48("22146") ? true : (stryCov_9fa48("22146", "22147", "22148"), (stryMutAct_9fa48("22149") ? b.metadata.relevance : (stryCov_9fa48("22149"), b.metadata?.relevance)) || 0);
            if (stryMutAct_9fa48("22152") ? aRelevance === bRelevance : stryMutAct_9fa48("22151") ? false : stryMutAct_9fa48("22150") ? true : (stryCov_9fa48("22150", "22151", "22152"), aRelevance !== bRelevance)) return stryMutAct_9fa48("22153") ? bRelevance + aRelevance : (stryCov_9fa48("22153"), bRelevance - aRelevance);

            // Finalmente por frecuencia
            const aFreq = stryMutAct_9fa48("22156") ? a.metadata?.frequency && 0 : stryMutAct_9fa48("22155") ? false : stryMutAct_9fa48("22154") ? true : (stryCov_9fa48("22154", "22155", "22156"), (stryMutAct_9fa48("22157") ? a.metadata.frequency : (stryCov_9fa48("22157"), a.metadata?.frequency)) || 0);
            const bFreq = stryMutAct_9fa48("22160") ? b.metadata?.frequency && 0 : stryMutAct_9fa48("22159") ? false : stryMutAct_9fa48("22158") ? true : (stryCov_9fa48("22158", "22159", "22160"), (stryMutAct_9fa48("22161") ? b.metadata.frequency : (stryCov_9fa48("22161"), b.metadata?.frequency)) || 0);
            return stryMutAct_9fa48("22162") ? bFreq + aFreq : (stryCov_9fa48("22162"), bFreq - aFreq);
          }
        }).slice(0, maxSuggestions));
      }
    }, stryMutAct_9fa48("22163") ? [] : (stryCov_9fa48("22163"), [maxSuggestions]));

    // Filtrar sugerencias locales basadas en el query
    const filterLocalSuggestions = useCallback((query: string): AutocompleteSuggestion[] => {
      if (stryMutAct_9fa48("22164")) {
        {}
      } else {
        stryCov_9fa48("22164");
        if (stryMutAct_9fa48("22167") ? false : stryMutAct_9fa48("22166") ? true : stryMutAct_9fa48("22165") ? query.trim() : (stryCov_9fa48("22165", "22166", "22167"), !(stryMutAct_9fa48("22168") ? query : (stryCov_9fa48("22168"), query.trim())))) return stryMutAct_9fa48("22169") ? localSuggestions : (stryCov_9fa48("22169"), localSuggestions.slice(0, maxSuggestions));
        const lowerQuery = stryMutAct_9fa48("22170") ? query.toUpperCase() : (stryCov_9fa48("22170"), query.toLowerCase());
        return stryMutAct_9fa48("22172") ? localSuggestions.map(suggestion => {
          const text = suggestion.text.toLowerCase();
          const lowerQuery = query.toLowerCase();
          // Crear nueva instancia con metadata actualizada (no mutar el original)
          return {
            ...suggestion,
            metadata: {
              ...suggestion.metadata,
              relevance: text.startsWith(lowerQuery) ? 100 : 50
            }
          };
        }).slice(0, maxSuggestions) : stryMutAct_9fa48("22171") ? localSuggestions.filter(suggestion => {
          const text = suggestion.text.toLowerCase();
          return text.startsWith(lowerQuery) || text.includes(lowerQuery);
        }).map(suggestion => {
          const text = suggestion.text.toLowerCase();
          const lowerQuery = query.toLowerCase();
          // Crear nueva instancia con metadata actualizada (no mutar el original)
          return {
            ...suggestion,
            metadata: {
              ...suggestion.metadata,
              relevance: text.startsWith(lowerQuery) ? 100 : 50
            }
          };
        }) : (stryCov_9fa48("22171", "22172"), localSuggestions.filter(suggestion => {
          if (stryMutAct_9fa48("22173")) {
            {}
          } else {
            stryCov_9fa48("22173");
            const text = stryMutAct_9fa48("22174") ? suggestion.text.toUpperCase() : (stryCov_9fa48("22174"), suggestion.text.toLowerCase());
            return stryMutAct_9fa48("22177") ? text.startsWith(lowerQuery) && text.includes(lowerQuery) : stryMutAct_9fa48("22176") ? false : stryMutAct_9fa48("22175") ? true : (stryCov_9fa48("22175", "22176", "22177"), (stryMutAct_9fa48("22178") ? text.endsWith(lowerQuery) : (stryCov_9fa48("22178"), text.startsWith(lowerQuery))) || text.includes(lowerQuery));
          }
        }).map(suggestion => {
          if (stryMutAct_9fa48("22179")) {
            {}
          } else {
            stryCov_9fa48("22179");
            const text = stryMutAct_9fa48("22180") ? suggestion.text.toUpperCase() : (stryCov_9fa48("22180"), suggestion.text.toLowerCase());
            const lowerQuery = stryMutAct_9fa48("22181") ? query.toUpperCase() : (stryCov_9fa48("22181"), query.toLowerCase());
            // Crear nueva instancia con metadata actualizada (no mutar el original)
            return stryMutAct_9fa48("22182") ? {} : (stryCov_9fa48("22182"), {
              ...suggestion,
              metadata: stryMutAct_9fa48("22183") ? {} : (stryCov_9fa48("22183"), {
                ...suggestion.metadata,
                relevance: (stryMutAct_9fa48("22184") ? text.endsWith(lowerQuery) : (stryCov_9fa48("22184"), text.startsWith(lowerQuery))) ? 100 : 50
              })
            });
          }
        }).slice(0, maxSuggestions));
      }
    }, stryMutAct_9fa48("22185") ? [] : (stryCov_9fa48("22185"), [localSuggestions, maxSuggestions]));

    // Obtener sugerencias del servidor
    useEffect(() => {
      if (stryMutAct_9fa48("22186")) {
        {}
      } else {
        stryCov_9fa48("22186");
        if (stryMutAct_9fa48("22189") ? !fetchSuggestions && debouncedQuery.length < minChars : stryMutAct_9fa48("22188") ? false : stryMutAct_9fa48("22187") ? true : (stryCov_9fa48("22187", "22188", "22189"), (stryMutAct_9fa48("22190") ? fetchSuggestions : (stryCov_9fa48("22190"), !fetchSuggestions)) || (stryMutAct_9fa48("22193") ? debouncedQuery.length >= minChars : stryMutAct_9fa48("22192") ? debouncedQuery.length <= minChars : stryMutAct_9fa48("22191") ? false : (stryCov_9fa48("22191", "22192", "22193"), debouncedQuery.length < minChars)))) {
          if (stryMutAct_9fa48("22194")) {
            {}
          } else {
            stryCov_9fa48("22194");
            setSuggestions(filterLocalSuggestions(debouncedQuery));
            setIsLoading(stryMutAct_9fa48("22195") ? true : (stryCov_9fa48("22195"), false));
            return;
          }
        }

        // Cancelar request anterior
        if (stryMutAct_9fa48("22197") ? false : stryMutAct_9fa48("22196") ? true : (stryCov_9fa48("22196", "22197"), abortControllerRef.current)) {
          if (stryMutAct_9fa48("22198")) {
            {}
          } else {
            stryCov_9fa48("22198");
            abortControllerRef.current.abort();
          }
        }

        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        setIsLoading(stryMutAct_9fa48("22199") ? false : (stryCov_9fa48("22199"), true));
        fetchSuggestions(debouncedQuery).then(serverSuggestions => {
          if (stryMutAct_9fa48("22200")) {
            {}
          } else {
            stryCov_9fa48("22200");
            if (stryMutAct_9fa48("22202") ? false : stryMutAct_9fa48("22201") ? true : (stryCov_9fa48("22201", "22202"), signal.aborted)) return;
            const localFiltered = filterLocalSuggestions(debouncedQuery);
            const ranked = rankSuggestions(localFiltered, serverSuggestions);
            setSuggestions(ranked);
            setIsOpen(stryMutAct_9fa48("22203") ? false : (stryCov_9fa48("22203"), true));
          }
        }).catch(error => {
          if (stryMutAct_9fa48("22204")) {
            {}
          } else {
            stryCov_9fa48("22204");
            if (stryMutAct_9fa48("22206") ? false : stryMutAct_9fa48("22205") ? true : (stryCov_9fa48("22205", "22206"), signal.aborted)) return;
            // Si falla el servidor, usar solo sugerencias locales
            setSuggestions(filterLocalSuggestions(debouncedQuery));
          }
        }).finally(() => {
          if (stryMutAct_9fa48("22207")) {
            {}
          } else {
            stryCov_9fa48("22207");
            if (stryMutAct_9fa48("22210") ? false : stryMutAct_9fa48("22209") ? true : stryMutAct_9fa48("22208") ? signal.aborted : (stryCov_9fa48("22208", "22209", "22210"), !signal.aborted)) {
              if (stryMutAct_9fa48("22211")) {
                {}
              } else {
                stryCov_9fa48("22211");
                setIsLoading(stryMutAct_9fa48("22212") ? true : (stryCov_9fa48("22212"), false));
              }
            }
          }
        });
      }
    }, stryMutAct_9fa48("22213") ? [] : (stryCov_9fa48("22213"), [debouncedQuery, fetchSuggestions, minChars, filterLocalSuggestions, rankSuggestions]));

    // Manejar selección
    const selectSuggestion = useCallback((suggestion: AutocompleteSuggestion) => {
      if (stryMutAct_9fa48("22214")) {
        {}
      } else {
        stryCov_9fa48("22214");
        setQuery(suggestion.text);
        setIsOpen(stryMutAct_9fa48("22215") ? true : (stryCov_9fa48("22215"), false));
        setSelectedIndex(stryMutAct_9fa48("22216") ? +1 : (stryCov_9fa48("22216"), -1));
        if (stryMutAct_9fa48("22218") ? false : stryMutAct_9fa48("22217") ? true : (stryCov_9fa48("22217", "22218"), onSelect)) {
          if (stryMutAct_9fa48("22219")) {
            {}
          } else {
            stryCov_9fa48("22219");
            onSelect(suggestion);
          }
        }
      }
    }, stryMutAct_9fa48("22220") ? [] : (stryCov_9fa48("22220"), [onSelect]));

    // Manejar cambio de query
    const handleQueryChange = useCallback((newQuery: string) => {
      if (stryMutAct_9fa48("22221")) {
        {}
      } else {
        stryCov_9fa48("22221");
        setQuery(newQuery);
        setSelectedIndex(stryMutAct_9fa48("22222") ? +1 : (stryCov_9fa48("22222"), -1));
        setIsOpen(stryMutAct_9fa48("22226") ? newQuery.length < minChars : stryMutAct_9fa48("22225") ? newQuery.length > minChars : stryMutAct_9fa48("22224") ? false : stryMutAct_9fa48("22223") ? true : (stryCov_9fa48("22223", "22224", "22225", "22226"), newQuery.length >= minChars));
        if (stryMutAct_9fa48("22228") ? false : stryMutAct_9fa48("22227") ? true : (stryCov_9fa48("22227", "22228"), onQueryChange)) {
          if (stryMutAct_9fa48("22229")) {
            {}
          } else {
            stryCov_9fa48("22229");
            onQueryChange(newQuery);
          }
        }
      }
    }, stryMutAct_9fa48("22230") ? [] : (stryCov_9fa48("22230"), [minChars, onQueryChange]));

    // Navegación con teclado
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (stryMutAct_9fa48("22231")) {
        {}
      } else {
        stryCov_9fa48("22231");
        if (stryMutAct_9fa48("22234") ? !isOpen && suggestions.length === 0 : stryMutAct_9fa48("22233") ? false : stryMutAct_9fa48("22232") ? true : (stryCov_9fa48("22232", "22233", "22234"), (stryMutAct_9fa48("22235") ? isOpen : (stryCov_9fa48("22235"), !isOpen)) || (stryMutAct_9fa48("22237") ? suggestions.length !== 0 : stryMutAct_9fa48("22236") ? false : (stryCov_9fa48("22236", "22237"), suggestions.length === 0)))) return;
        switch (e.key) {
          case stryMutAct_9fa48("22239") ? "" : (stryCov_9fa48("22239"), 'ArrowDown'):
            if (stryMutAct_9fa48("22238")) {} else {
              stryCov_9fa48("22238");
              e.preventDefault();
              setSelectedIndex(stryMutAct_9fa48("22240") ? () => undefined : (stryCov_9fa48("22240"), prev => (stryMutAct_9fa48("22244") ? prev >= suggestions.length - 1 : stryMutAct_9fa48("22243") ? prev <= suggestions.length - 1 : stryMutAct_9fa48("22242") ? false : stryMutAct_9fa48("22241") ? true : (stryCov_9fa48("22241", "22242", "22243", "22244"), prev < (stryMutAct_9fa48("22245") ? suggestions.length + 1 : (stryCov_9fa48("22245"), suggestions.length - 1)))) ? stryMutAct_9fa48("22246") ? prev - 1 : (stryCov_9fa48("22246"), prev + 1) : prev));
              break;
            }
          case stryMutAct_9fa48("22248") ? "" : (stryCov_9fa48("22248"), 'ArrowUp'):
            if (stryMutAct_9fa48("22247")) {} else {
              stryCov_9fa48("22247");
              e.preventDefault();
              setSelectedIndex(stryMutAct_9fa48("22249") ? () => undefined : (stryCov_9fa48("22249"), prev => (stryMutAct_9fa48("22253") ? prev <= 0 : stryMutAct_9fa48("22252") ? prev >= 0 : stryMutAct_9fa48("22251") ? false : stryMutAct_9fa48("22250") ? true : (stryCov_9fa48("22250", "22251", "22252", "22253"), prev > 0)) ? stryMutAct_9fa48("22254") ? prev + 1 : (stryCov_9fa48("22254"), prev - 1) : stryMutAct_9fa48("22255") ? +1 : (stryCov_9fa48("22255"), -1)));
              break;
            }
          case stryMutAct_9fa48("22257") ? "" : (stryCov_9fa48("22257"), 'Enter'):
            if (stryMutAct_9fa48("22256")) {} else {
              stryCov_9fa48("22256");
              e.preventDefault();
              if (stryMutAct_9fa48("22260") ? selectedIndex >= 0 || selectedIndex < suggestions.length : stryMutAct_9fa48("22259") ? false : stryMutAct_9fa48("22258") ? true : (stryCov_9fa48("22258", "22259", "22260"), (stryMutAct_9fa48("22263") ? selectedIndex < 0 : stryMutAct_9fa48("22262") ? selectedIndex > 0 : stryMutAct_9fa48("22261") ? true : (stryCov_9fa48("22261", "22262", "22263"), selectedIndex >= 0)) && (stryMutAct_9fa48("22266") ? selectedIndex >= suggestions.length : stryMutAct_9fa48("22265") ? selectedIndex <= suggestions.length : stryMutAct_9fa48("22264") ? true : (stryCov_9fa48("22264", "22265", "22266"), selectedIndex < suggestions.length)))) {
                if (stryMutAct_9fa48("22267")) {
                  {}
                } else {
                  stryCov_9fa48("22267");
                  selectSuggestion(suggestions[selectedIndex]);
                }
              }
              break;
            }
          case stryMutAct_9fa48("22269") ? "" : (stryCov_9fa48("22269"), 'Escape'):
            if (stryMutAct_9fa48("22268")) {} else {
              stryCov_9fa48("22268");
              e.preventDefault();
              setIsOpen(stryMutAct_9fa48("22270") ? true : (stryCov_9fa48("22270"), false));
              setSelectedIndex(stryMutAct_9fa48("22271") ? +1 : (stryCov_9fa48("22271"), -1));
              break;
            }
        }
      }
    }, stryMutAct_9fa48("22272") ? [] : (stryCov_9fa48("22272"), [isOpen, suggestions, selectedIndex, selectSuggestion]));

    // Limpiar al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("22273")) {
        {}
      } else {
        stryCov_9fa48("22273");
        return () => {
          if (stryMutAct_9fa48("22274")) {
            {}
          } else {
            stryCov_9fa48("22274");
            if (stryMutAct_9fa48("22276") ? false : stryMutAct_9fa48("22275") ? true : (stryCov_9fa48("22275", "22276"), abortControllerRef.current)) {
              if (stryMutAct_9fa48("22277")) {
                {}
              } else {
                stryCov_9fa48("22277");
                abortControllerRef.current.abort();
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("22278") ? ["Stryker was here"] : (stryCov_9fa48("22278"), []));
    return stryMutAct_9fa48("22279") ? {} : (stryCov_9fa48("22279"), {
      query,
      suggestions,
      isLoading,
      selectedIndex,
      isOpen,
      setQuery: handleQueryChange,
      selectSuggestion,
      setIsOpen,
      handleKeyDown
    });
  }
}