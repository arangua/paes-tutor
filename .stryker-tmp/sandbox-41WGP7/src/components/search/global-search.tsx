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
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, BookOpen, FileText, Tag, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { toast } from 'sonner';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { TIME_CONSTANTS } from '@/lib/constants';
interface SearchResult {
  type: 'exam' | 'material' | 'topic' | 'attempt';
  id: string;
  title: string;
  description?: string;
  subject: string;
  subjectCode?: string;
  topic?: string;
  ejeTematico?: string;
  tipo?: string;
  totalPreguntas?: number;
  estado?: string;
  puntaje?: number;
  porcentaje?: number;
  relevance: number;
  url: string;
}
interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const TYPE_LABELS = stryMutAct_9fa48("19253") ? {} : (stryCov_9fa48("19253"), {
  exam: stryMutAct_9fa48("19254") ? "" : (stryCov_9fa48("19254"), 'Examen'),
  material: stryMutAct_9fa48("19255") ? "" : (stryCov_9fa48("19255"), 'Material'),
  topic: stryMutAct_9fa48("19256") ? "" : (stryCov_9fa48("19256"), 'Tema'),
  attempt: stryMutAct_9fa48("19257") ? "" : (stryCov_9fa48("19257"), 'Intento')
});
const TYPE_ICONS = stryMutAct_9fa48("19258") ? {} : (stryCov_9fa48("19258"), {
  exam: BookOpen,
  material: FileText,
  topic: Tag,
  attempt: Clock
});
const TYPE_COLORS = stryMutAct_9fa48("19259") ? {} : (stryCov_9fa48("19259"), {
  exam: stryMutAct_9fa48("19260") ? "" : (stryCov_9fa48("19260"), 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'),
  material: stryMutAct_9fa48("19261") ? "" : (stryCov_9fa48("19261"), 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'),
  topic: stryMutAct_9fa48("19262") ? "" : (stryCov_9fa48("19262"), 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'),
  attempt: stryMutAct_9fa48("19263") ? "" : (stryCov_9fa48("19263"), 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300')
});
export function GlobalSearch({
  open,
  onOpenChange
}: GlobalSearchProps) {
  if (stryMutAct_9fa48("19264")) {
    {}
  } else {
    stryCov_9fa48("19264");
    const router = useRouter();
    const [query, setQuery] = useState(stryMutAct_9fa48("19265") ? "Stryker was here!" : (stryCov_9fa48("19265"), ''));
    const [results, setResults] = useState<SearchResult[]>(stryMutAct_9fa48("19266") ? ["Stryker was here"] : (stryCov_9fa48("19266"), []));
    const [suggestions, setSuggestions] = useState<string[]>(stryMutAct_9fa48("19267") ? ["Stryker was here"] : (stryCov_9fa48("19267"), []));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19268") ? true : (stryCov_9fa48("19268"), false));
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);
    const {
      history,
      addToHistory,
      getSuggestions
    } = useSearchHistory();

    // Obtener sugerencias del historial
    const historySuggestions = getSuggestions(query, 5);

    // Buscar
    useEffect(() => {
      if (stryMutAct_9fa48("19269")) {
        {}
      } else {
        stryCov_9fa48("19269");
        if (stryMutAct_9fa48("19272") ? false : stryMutAct_9fa48("19271") ? true : stryMutAct_9fa48("19270") ? open : (stryCov_9fa48("19270", "19271", "19272"), !open)) return;
        const performSearch = async () => {
          if (stryMutAct_9fa48("19273")) {
            {}
          } else {
            stryCov_9fa48("19273");
            if (stryMutAct_9fa48("19276") ? false : stryMutAct_9fa48("19275") ? true : stryMutAct_9fa48("19274") ? debouncedQuery.trim() : (stryCov_9fa48("19274", "19275", "19276"), !(stryMutAct_9fa48("19277") ? debouncedQuery : (stryCov_9fa48("19277"), debouncedQuery.trim())))) {
              if (stryMutAct_9fa48("19278")) {
                {}
              } else {
                stryCov_9fa48("19278");
                setResults(stryMutAct_9fa48("19279") ? ["Stryker was here"] : (stryCov_9fa48("19279"), []));
                setSuggestions(stryMutAct_9fa48("19280") ? ["Stryker was here"] : (stryCov_9fa48("19280"), []));
                return;
              }
            }
            setIsLoading(stryMutAct_9fa48("19281") ? false : (stryCov_9fa48("19281"), true));
            try {
              if (stryMutAct_9fa48("19282")) {
                {}
              } else {
                stryCov_9fa48("19282");
                const response = await fetch(stryMutAct_9fa48("19283") ? `` : (stryCov_9fa48("19283"), `/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`));
                if (stryMutAct_9fa48("19286") ? false : stryMutAct_9fa48("19285") ? true : stryMutAct_9fa48("19284") ? response.ok : (stryCov_9fa48("19284", "19285", "19286"), !response.ok)) {
                  if (stryMutAct_9fa48("19287")) {
                    {}
                  } else {
                    stryCov_9fa48("19287");
                    throw new Error(stryMutAct_9fa48("19288") ? "" : (stryCov_9fa48("19288"), 'Error al buscar'));
                  }
                }
                const data = await response.json();
                setResults(stryMutAct_9fa48("19291") ? data.results && [] : stryMutAct_9fa48("19290") ? false : stryMutAct_9fa48("19289") ? true : (stryCov_9fa48("19289", "19290", "19291"), data.results || (stryMutAct_9fa48("19292") ? ["Stryker was here"] : (stryCov_9fa48("19292"), []))));
                setSuggestions(stryMutAct_9fa48("19295") ? data.suggestions && [] : stryMutAct_9fa48("19294") ? false : stryMutAct_9fa48("19293") ? true : (stryCov_9fa48("19293", "19294", "19295"), data.suggestions || (stryMutAct_9fa48("19296") ? ["Stryker was here"] : (stryCov_9fa48("19296"), []))));
              }
            } catch (error) {
              if (stryMutAct_9fa48("19297")) {
                {}
              } else {
                stryCov_9fa48("19297");
                const errorInfo = extractErrorInfo(error);
                const errorMessage = getErrorMessage(ERROR_CODES.NETWORK_SERVER_ERROR, stryMutAct_9fa48("19298") ? {} : (stryCov_9fa48("19298"), {
                  message: errorInfo.message
                }));
                toast.error(errorMessage.title, stryMutAct_9fa48("19299") ? {} : (stryCov_9fa48("19299"), {
                  description: stryMutAct_9fa48("19300") ? `` : (stryCov_9fa48("19300"), `${errorMessage.description} ${errorMessage.solution}`)
                }));
                setResults(stryMutAct_9fa48("19301") ? ["Stryker was here"] : (stryCov_9fa48("19301"), []));
                setSuggestions(stryMutAct_9fa48("19302") ? ["Stryker was here"] : (stryCov_9fa48("19302"), []));
              }
            } finally {
              if (stryMutAct_9fa48("19303")) {
                {}
              } else {
                stryCov_9fa48("19303");
                setIsLoading(stryMutAct_9fa48("19304") ? true : (stryCov_9fa48("19304"), false));
              }
            }
          }
        };
        performSearch();
      }
    }, stryMutAct_9fa48("19305") ? [] : (stryCov_9fa48("19305"), [debouncedQuery, open]));

    // Enfocar input cuando se abre
    useEffect(() => {
      if (stryMutAct_9fa48("19306")) {
        {}
      } else {
        stryCov_9fa48("19306");
        if (stryMutAct_9fa48("19308") ? false : stryMutAct_9fa48("19307") ? true : (stryCov_9fa48("19307", "19308"), open)) {
          if (stryMutAct_9fa48("19309")) {
            {}
          } else {
            stryCov_9fa48("19309");
            const timeout = setTimeout(() => {
              if (stryMutAct_9fa48("19310")) {
                {}
              } else {
                stryCov_9fa48("19310");
                stryMutAct_9fa48("19311") ? inputRef.current.focus() : (stryCov_9fa48("19311"), inputRef.current?.focus());
              }
            }, TIME_CONSTANTS.FOCUS_DELAY_MS);
            setQuery(stryMutAct_9fa48("19312") ? "Stryker was here!" : (stryCov_9fa48("19312"), ''));
            setSelectedIndex(0);
            return stryMutAct_9fa48("19313") ? () => undefined : (stryCov_9fa48("19313"), () => clearTimeout(timeout));
          }
        }
      }
    }, stryMutAct_9fa48("19314") ? [] : (stryCov_9fa48("19314"), [open]));

    // Manejar teclado
    useEffect(() => {
      if (stryMutAct_9fa48("19315")) {
        {}
      } else {
        stryCov_9fa48("19315");
        if (stryMutAct_9fa48("19318") ? false : stryMutAct_9fa48("19317") ? true : stryMutAct_9fa48("19316") ? open : (stryCov_9fa48("19316", "19317", "19318"), !open)) return;
        const handleKeyDown = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("19319")) {
            {}
          } else {
            stryCov_9fa48("19319");
            if (stryMutAct_9fa48("19322") ? e.key !== 'Escape' : stryMutAct_9fa48("19321") ? false : stryMutAct_9fa48("19320") ? true : (stryCov_9fa48("19320", "19321", "19322"), e.key === (stryMutAct_9fa48("19323") ? "" : (stryCov_9fa48("19323"), 'Escape')))) {
              if (stryMutAct_9fa48("19324")) {
                {}
              } else {
                stryCov_9fa48("19324");
                onOpenChange(stryMutAct_9fa48("19325") ? true : (stryCov_9fa48("19325"), false));
                return;
              }
            }
            if (stryMutAct_9fa48("19328") ? e.key !== 'ArrowDown' : stryMutAct_9fa48("19327") ? false : stryMutAct_9fa48("19326") ? true : (stryCov_9fa48("19326", "19327", "19328"), e.key === (stryMutAct_9fa48("19329") ? "" : (stryCov_9fa48("19329"), 'ArrowDown')))) {
              if (stryMutAct_9fa48("19330")) {
                {}
              } else {
                stryCov_9fa48("19330");
                e.preventDefault();
                setSelectedIndex(prev => {
                  if (stryMutAct_9fa48("19331")) {
                    {}
                  } else {
                    stryCov_9fa48("19331");
                    const maxIndex = stryMutAct_9fa48("19332") ? results.length + suggestions.length + historySuggestions.length + 1 : (stryCov_9fa48("19332"), (stryMutAct_9fa48("19333") ? results.length + suggestions.length - historySuggestions.length : (stryCov_9fa48("19333"), (stryMutAct_9fa48("19334") ? results.length - suggestions.length : (stryCov_9fa48("19334"), results.length + suggestions.length)) + historySuggestions.length)) - 1);
                    return (stryMutAct_9fa48("19338") ? prev >= maxIndex : stryMutAct_9fa48("19337") ? prev <= maxIndex : stryMutAct_9fa48("19336") ? false : stryMutAct_9fa48("19335") ? true : (stryCov_9fa48("19335", "19336", "19337", "19338"), prev < maxIndex)) ? stryMutAct_9fa48("19339") ? prev - 1 : (stryCov_9fa48("19339"), prev + 1) : prev;
                  }
                });
                return;
              }
            }
            if (stryMutAct_9fa48("19342") ? e.key !== 'ArrowUp' : stryMutAct_9fa48("19341") ? false : stryMutAct_9fa48("19340") ? true : (stryCov_9fa48("19340", "19341", "19342"), e.key === (stryMutAct_9fa48("19343") ? "" : (stryCov_9fa48("19343"), 'ArrowUp')))) {
              if (stryMutAct_9fa48("19344")) {
                {}
              } else {
                stryCov_9fa48("19344");
                e.preventDefault();
                setSelectedIndex(stryMutAct_9fa48("19345") ? () => undefined : (stryCov_9fa48("19345"), prev => (stryMutAct_9fa48("19349") ? prev <= 0 : stryMutAct_9fa48("19348") ? prev >= 0 : stryMutAct_9fa48("19347") ? false : stryMutAct_9fa48("19346") ? true : (stryCov_9fa48("19346", "19347", "19348", "19349"), prev > 0)) ? stryMutAct_9fa48("19350") ? prev + 1 : (stryCov_9fa48("19350"), prev - 1) : 0));
                return;
              }
            }
            if (stryMutAct_9fa48("19353") ? e.key !== 'Enter' : stryMutAct_9fa48("19352") ? false : stryMutAct_9fa48("19351") ? true : (stryCov_9fa48("19351", "19352", "19353"), e.key === (stryMutAct_9fa48("19354") ? "" : (stryCov_9fa48("19354"), 'Enter')))) {
              if (stryMutAct_9fa48("19355")) {
                {}
              } else {
                stryCov_9fa48("19355");
                e.preventDefault();
                handleSelect(selectedIndex);
                return;
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("19356") ? "" : (stryCov_9fa48("19356"), 'keydown'), handleKeyDown);
        return stryMutAct_9fa48("19357") ? () => undefined : (stryCov_9fa48("19357"), () => window.removeEventListener(stryMutAct_9fa48("19358") ? "" : (stryCov_9fa48("19358"), 'keydown'), handleKeyDown));
      }
    }, stryMutAct_9fa48("19359") ? [] : (stryCov_9fa48("19359"), [open, results, suggestions, selectedIndex, onOpenChange]));
    const handleSelect = (index: number) => {
      if (stryMutAct_9fa48("19360")) {
        {}
      } else {
        stryCov_9fa48("19360");
        if (stryMutAct_9fa48("19364") ? index >= results.length : stryMutAct_9fa48("19363") ? index <= results.length : stryMutAct_9fa48("19362") ? false : stryMutAct_9fa48("19361") ? true : (stryCov_9fa48("19361", "19362", "19363", "19364"), index < results.length)) {
          if (stryMutAct_9fa48("19365")) {
            {}
          } else {
            stryCov_9fa48("19365");
            // Seleccionar resultado
            const result = results[index];
            addToHistory(query, result.type);
            onOpenChange(stryMutAct_9fa48("19366") ? true : (stryCov_9fa48("19366"), false));
            router.push(result.url);
          }
        } else if (stryMutAct_9fa48("19370") ? index >= results.length + suggestions.length : stryMutAct_9fa48("19369") ? index <= results.length + suggestions.length : stryMutAct_9fa48("19368") ? false : stryMutAct_9fa48("19367") ? true : (stryCov_9fa48("19367", "19368", "19369", "19370"), index < (stryMutAct_9fa48("19371") ? results.length - suggestions.length : (stryCov_9fa48("19371"), results.length + suggestions.length)))) {
          if (stryMutAct_9fa48("19372")) {
            {}
          } else {
            stryCov_9fa48("19372");
            // Seleccionar sugerencia del servidor
            const suggestion = suggestions[stryMutAct_9fa48("19373") ? index + results.length : (stryCov_9fa48("19373"), index - results.length)];
            setQuery(suggestion);
            addToHistory(suggestion);
          }
        } else {
          if (stryMutAct_9fa48("19374")) {
            {}
          } else {
            stryCov_9fa48("19374");
            // Seleccionar sugerencia del historial
            const historyIndex = stryMutAct_9fa48("19375") ? index - results.length + suggestions.length : (stryCov_9fa48("19375"), (stryMutAct_9fa48("19376") ? index + results.length : (stryCov_9fa48("19376"), index - results.length)) - suggestions.length);
            const historyItem = historySuggestions[historyIndex];
            if (stryMutAct_9fa48("19378") ? false : stryMutAct_9fa48("19377") ? true : (stryCov_9fa48("19377", "19378"), historyItem)) {
              if (stryMutAct_9fa48("19379")) {
                {}
              } else {
                stryCov_9fa48("19379");
                setQuery(historyItem.query);
                addToHistory(historyItem.query, historyItem.type);
              }
            }
          }
        }
      }
    };
    const handleResultClick = (result: SearchResult) => {
      if (stryMutAct_9fa48("19380")) {
        {}
      } else {
        stryCov_9fa48("19380");
        addToHistory(query, result.type);
        onOpenChange(stryMutAct_9fa48("19381") ? true : (stryCov_9fa48("19381"), false));
        router.push(result.url);
      }
    };
    const handleSuggestionClick = (suggestion: string) => {
      if (stryMutAct_9fa48("19382")) {
        {}
      } else {
        stryCov_9fa48("19382");
        setQuery(suggestion);
        addToHistory(suggestion);
      }
    };
    const handleRecentSearchClick = (item: SearchHistoryItem) => {
      if (stryMutAct_9fa48("19383")) {
        {}
      } else {
        stryCov_9fa48("19383");
        setQuery(item.query);
        addToHistory(item.query, item.type);
      }
    };
    if (stryMutAct_9fa48("19386") ? false : stryMutAct_9fa48("19385") ? true : stryMutAct_9fa48("19384") ? open : (stryCov_9fa48("19384", "19385", "19386"), !open)) return null;
    return <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[20vh] px-4" onClick={e => {
      if (stryMutAct_9fa48("19387")) {
        {}
      } else {
        stryCov_9fa48("19387");
        if (stryMutAct_9fa48("19390") ? e.target !== e.currentTarget : stryMutAct_9fa48("19389") ? false : stryMutAct_9fa48("19388") ? true : (stryCov_9fa48("19388", "19389", "19390"), e.target === e.currentTarget)) {
          if (stryMutAct_9fa48("19391")) {
            {}
          } else {
            stryCov_9fa48("19391");
            onOpenChange(stryMutAct_9fa48("19392") ? true : (stryCov_9fa48("19392"), false));
          }
        }
      }
    }}>
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg w-full max-w-2xl">
        {/* Input */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input ref={inputRef} type="text" placeholder="Buscar exámenes, materiales, temas..." value={query} onChange={e => {
            if (stryMutAct_9fa48("19393")) {
              {}
            } else {
              stryCov_9fa48("19393");
              setQuery(e.target.value);
              setSelectedIndex(0);
            }
          }} className="border-0 focus-visible:ring-0 text-lg" />
          {stryMutAct_9fa48("19396") ? query || <Button variant="ghost" size="sm" onClick={() => {
            setQuery('');
            setResults([]);
            setSuggestions([]);
            inputRef.current?.focus();
          }}>
              <X className="h-4 w-4" />
            </Button> : stryMutAct_9fa48("19395") ? false : stryMutAct_9fa48("19394") ? true : (stryCov_9fa48("19394", "19395", "19396"), query && <Button variant="ghost" size="sm" onClick={() => {
            if (stryMutAct_9fa48("19397")) {
              {}
            } else {
              stryCov_9fa48("19397");
              setQuery(stryMutAct_9fa48("19398") ? "Stryker was here!" : (stryCov_9fa48("19398"), ''));
              setResults(stryMutAct_9fa48("19399") ? ["Stryker was here"] : (stryCov_9fa48("19399"), []));
              setSuggestions(stryMutAct_9fa48("19400") ? ["Stryker was here"] : (stryCov_9fa48("19400"), []));
              stryMutAct_9fa48("19401") ? inputRef.current.focus() : (stryCov_9fa48("19401"), inputRef.current?.focus());
            }
          }}>
              <X className="h-4 w-4" />
            </Button>)}
        </div>

        {/* Contenido */}
        <div className="max-h-[60vh] overflow-y-auto">
          {stryMutAct_9fa48("19404") ? isLoading || <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div> : stryMutAct_9fa48("19403") ? false : stryMutAct_9fa48("19402") ? true : (stryCov_9fa48("19402", "19403", "19404"), isLoading && <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>)}

          {stryMutAct_9fa48("19407") ? !isLoading && !query && history.length > 0 || <div className="p-4">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Búsquedas recientes
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 5).map((item, idx) => <Button key={idx} variant="outline" size="sm" onClick={() => handleRecentSearchClick(item)} className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.query}
                  </Button>)}
              </div>
            </div> : stryMutAct_9fa48("19406") ? false : stryMutAct_9fa48("19405") ? true : (stryCov_9fa48("19405", "19406", "19407"), (stryMutAct_9fa48("19409") ? !isLoading && !query || history.length > 0 : stryMutAct_9fa48("19408") ? true : (stryCov_9fa48("19408", "19409"), (stryMutAct_9fa48("19411") ? !isLoading || !query : stryMutAct_9fa48("19410") ? true : (stryCov_9fa48("19410", "19411"), (stryMutAct_9fa48("19412") ? isLoading : (stryCov_9fa48("19412"), !isLoading)) && (stryMutAct_9fa48("19413") ? query : (stryCov_9fa48("19413"), !query)))) && (stryMutAct_9fa48("19416") ? history.length <= 0 : stryMutAct_9fa48("19415") ? history.length >= 0 : stryMutAct_9fa48("19414") ? true : (stryCov_9fa48("19414", "19415", "19416"), history.length > 0)))) && <div className="p-4">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Búsquedas recientes
              </div>
              <div className="flex flex-wrap gap-2">
                {stryMutAct_9fa48("19417") ? history.map((item, idx) => <Button key={idx} variant="outline" size="sm" onClick={() => handleRecentSearchClick(item)} className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.query}
                  </Button>) : (stryCov_9fa48("19417"), history.slice(0, 5).map(stryMutAct_9fa48("19418") ? () => undefined : (stryCov_9fa48("19418"), (item, idx) => <Button key={idx} variant="outline" size="sm" onClick={stryMutAct_9fa48("19419") ? () => undefined : (stryCov_9fa48("19419"), () => handleRecentSearchClick(item))} className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.query}
                  </Button>)))}
              </div>
            </div>)}

          {stryMutAct_9fa48("19422") ? !isLoading && query && results.length === 0 && suggestions.length === 0 || <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron resultados para "{query}"</p>
            </div> : stryMutAct_9fa48("19421") ? false : stryMutAct_9fa48("19420") ? true : (stryCov_9fa48("19420", "19421", "19422"), (stryMutAct_9fa48("19424") ? !isLoading && query && results.length === 0 || suggestions.length === 0 : stryMutAct_9fa48("19423") ? true : (stryCov_9fa48("19423", "19424"), (stryMutAct_9fa48("19426") ? !isLoading && query || results.length === 0 : stryMutAct_9fa48("19425") ? true : (stryCov_9fa48("19425", "19426"), (stryMutAct_9fa48("19428") ? !isLoading || query : stryMutAct_9fa48("19427") ? true : (stryCov_9fa48("19427", "19428"), (stryMutAct_9fa48("19429") ? isLoading : (stryCov_9fa48("19429"), !isLoading)) && query)) && (stryMutAct_9fa48("19431") ? results.length !== 0 : stryMutAct_9fa48("19430") ? true : (stryCov_9fa48("19430", "19431"), results.length === 0)))) && (stryMutAct_9fa48("19433") ? suggestions.length !== 0 : stryMutAct_9fa48("19432") ? true : (stryCov_9fa48("19432", "19433"), suggestions.length === 0)))) && <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron resultados para "{query}"</p>
            </div>)}

          {/* Resultados */}
          {stryMutAct_9fa48("19436") ? !isLoading && results.length > 0 || <div className="p-2">
              {results.map((result, idx) => {
              const Icon = TYPE_ICONS[result.type];
              const isSelected = idx === selectedIndex;
              return <Card key={`${result.type}-${result.id}`} className={`mb-2 cursor-pointer transition-colors ${isSelected ? 'bg-accent border-primary' : 'hover:bg-accent/50'}`} onClick={() => handleResultClick(result)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${TYPE_COLORS[result.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {TYPE_LABELS[result.type]}
                            </Badge>
                            <span className="font-semibold truncate">{result.title}</span>
                          </div>
                          {result.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {result.description}
                            </p>}
                          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                            <span>{result.subject}</span>
                            {result.topic && <>
                                <span>•</span>
                                <span>{result.topic}</span>
                              </>}
                            {result.year && <>
                                <span>•</span>
                                <span>{result.year}</span>
                              </>}
                            {result.porcentaje !== undefined && <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {result.porcentaje}%
                                </span>
                              </>}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div> : stryMutAct_9fa48("19435") ? false : stryMutAct_9fa48("19434") ? true : (stryCov_9fa48("19434", "19435", "19436"), (stryMutAct_9fa48("19438") ? !isLoading || results.length > 0 : stryMutAct_9fa48("19437") ? true : (stryCov_9fa48("19437", "19438"), (stryMutAct_9fa48("19439") ? isLoading : (stryCov_9fa48("19439"), !isLoading)) && (stryMutAct_9fa48("19442") ? results.length <= 0 : stryMutAct_9fa48("19441") ? results.length >= 0 : stryMutAct_9fa48("19440") ? true : (stryCov_9fa48("19440", "19441", "19442"), results.length > 0)))) && <div className="p-2">
              {results.map((result, idx) => {
              if (stryMutAct_9fa48("19443")) {
                {}
              } else {
                stryCov_9fa48("19443");
                const Icon = TYPE_ICONS[result.type];
                const isSelected = stryMutAct_9fa48("19446") ? idx !== selectedIndex : stryMutAct_9fa48("19445") ? false : stryMutAct_9fa48("19444") ? true : (stryCov_9fa48("19444", "19445", "19446"), idx === selectedIndex);
                return <Card key={stryMutAct_9fa48("19447") ? `` : (stryCov_9fa48("19447"), `${result.type}-${result.id}`)} className={stryMutAct_9fa48("19448") ? `` : (stryCov_9fa48("19448"), `mb-2 cursor-pointer transition-colors ${isSelected ? stryMutAct_9fa48("19449") ? "" : (stryCov_9fa48("19449"), 'bg-accent border-primary') : stryMutAct_9fa48("19450") ? "" : (stryCov_9fa48("19450"), 'hover:bg-accent/50')}`)} onClick={stryMutAct_9fa48("19451") ? () => undefined : (stryCov_9fa48("19451"), () => handleResultClick(result))}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={stryMutAct_9fa48("19452") ? `` : (stryCov_9fa48("19452"), `p-2 rounded-lg ${TYPE_COLORS[result.type]}`)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {TYPE_LABELS[result.type]}
                            </Badge>
                            <span className="font-semibold truncate">{result.title}</span>
                          </div>
                          {stryMutAct_9fa48("19455") ? result.description || <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {result.description}
                            </p> : stryMutAct_9fa48("19454") ? false : stryMutAct_9fa48("19453") ? true : (stryCov_9fa48("19453", "19454", "19455"), result.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {result.description}
                            </p>)}
                          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                            <span>{result.subject}</span>
                            {stryMutAct_9fa48("19458") ? result.topic || <>
                                <span>•</span>
                                <span>{result.topic}</span>
                              </> : stryMutAct_9fa48("19457") ? false : stryMutAct_9fa48("19456") ? true : (stryCov_9fa48("19456", "19457", "19458"), result.topic && <>
                                <span>•</span>
                                <span>{result.topic}</span>
                              </>)}
                            {stryMutAct_9fa48("19461") ? result.year || <>
                                <span>•</span>
                                <span>{result.year}</span>
                              </> : stryMutAct_9fa48("19460") ? false : stryMutAct_9fa48("19459") ? true : (stryCov_9fa48("19459", "19460", "19461"), result.year && <>
                                <span>•</span>
                                <span>{result.year}</span>
                              </>)}
                            {stryMutAct_9fa48("19464") ? result.porcentaje !== undefined || <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {result.porcentaje}%
                                </span>
                              </> : stryMutAct_9fa48("19463") ? false : stryMutAct_9fa48("19462") ? true : (stryCov_9fa48("19462", "19463", "19464"), (stryMutAct_9fa48("19466") ? result.porcentaje === undefined : stryMutAct_9fa48("19465") ? true : (stryCov_9fa48("19465", "19466"), result.porcentaje !== undefined)) && <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {result.porcentaje}%
                                </span>
                              </>)}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>;
              }
            })}
            </div>)}

          {/* Sugerencias del servidor */}
          {stryMutAct_9fa48("19469") ? !isLoading && suggestions.length > 0 || <div className="p-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Sugerencias</div>
              <div className="space-y-1">
                {suggestions.map((suggestion, idx) => {
                const suggestionIndex = results.length + idx;
                const isSelected = suggestionIndex === selectedIndex;
                return <Button key={idx} variant="ghost" className={`w-full justify-start ${isSelected ? 'bg-accent' : ''}`} onClick={() => handleSuggestionClick(suggestion)}>
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </Button>;
              })}
              </div>
            </div> : stryMutAct_9fa48("19468") ? false : stryMutAct_9fa48("19467") ? true : (stryCov_9fa48("19467", "19468", "19469"), (stryMutAct_9fa48("19471") ? !isLoading || suggestions.length > 0 : stryMutAct_9fa48("19470") ? true : (stryCov_9fa48("19470", "19471"), (stryMutAct_9fa48("19472") ? isLoading : (stryCov_9fa48("19472"), !isLoading)) && (stryMutAct_9fa48("19475") ? suggestions.length <= 0 : stryMutAct_9fa48("19474") ? suggestions.length >= 0 : stryMutAct_9fa48("19473") ? true : (stryCov_9fa48("19473", "19474", "19475"), suggestions.length > 0)))) && <div className="p-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Sugerencias</div>
              <div className="space-y-1">
                {suggestions.map((suggestion, idx) => {
                if (stryMutAct_9fa48("19476")) {
                  {}
                } else {
                  stryCov_9fa48("19476");
                  const suggestionIndex = stryMutAct_9fa48("19477") ? results.length - idx : (stryCov_9fa48("19477"), results.length + idx);
                  const isSelected = stryMutAct_9fa48("19480") ? suggestionIndex !== selectedIndex : stryMutAct_9fa48("19479") ? false : stryMutAct_9fa48("19478") ? true : (stryCov_9fa48("19478", "19479", "19480"), suggestionIndex === selectedIndex);
                  return <Button key={idx} variant="ghost" className={stryMutAct_9fa48("19481") ? `` : (stryCov_9fa48("19481"), `w-full justify-start ${isSelected ? stryMutAct_9fa48("19482") ? "" : (stryCov_9fa48("19482"), 'bg-accent') : stryMutAct_9fa48("19483") ? "Stryker was here!" : (stryCov_9fa48("19483"), '')}`)} onClick={stryMutAct_9fa48("19484") ? () => undefined : (stryCov_9fa48("19484"), () => handleSuggestionClick(suggestion))}>
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </Button>;
                }
              })}
              </div>
            </div>)}

          {/* Sugerencias del historial */}
          {stryMutAct_9fa48("19487") ? !isLoading && query && historySuggestions.length > 0 || <div className="p-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Búsquedas anteriores
              </div>
              <div className="space-y-1">
                {historySuggestions.map((item, idx) => {
                const historyIndex = results.length + suggestions.length + idx;
                const isSelected = historyIndex === selectedIndex;
                return <Button key={idx} variant="ghost" className={`w-full justify-start ${isSelected ? 'bg-accent' : ''}`} onClick={() => handleRecentSearchClick(item)}>
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {item.query}
                    </Button>;
              })}
              </div>
            </div> : stryMutAct_9fa48("19486") ? false : stryMutAct_9fa48("19485") ? true : (stryCov_9fa48("19485", "19486", "19487"), (stryMutAct_9fa48("19489") ? !isLoading && query || historySuggestions.length > 0 : stryMutAct_9fa48("19488") ? true : (stryCov_9fa48("19488", "19489"), (stryMutAct_9fa48("19491") ? !isLoading || query : stryMutAct_9fa48("19490") ? true : (stryCov_9fa48("19490", "19491"), (stryMutAct_9fa48("19492") ? isLoading : (stryCov_9fa48("19492"), !isLoading)) && query)) && (stryMutAct_9fa48("19495") ? historySuggestions.length <= 0 : stryMutAct_9fa48("19494") ? historySuggestions.length >= 0 : stryMutAct_9fa48("19493") ? true : (stryCov_9fa48("19493", "19494", "19495"), historySuggestions.length > 0)))) && <div className="p-4 border-t">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Búsquedas anteriores
              </div>
              <div className="space-y-1">
                {historySuggestions.map((item, idx) => {
                if (stryMutAct_9fa48("19496")) {
                  {}
                } else {
                  stryCov_9fa48("19496");
                  const historyIndex = stryMutAct_9fa48("19497") ? results.length + suggestions.length - idx : (stryCov_9fa48("19497"), (stryMutAct_9fa48("19498") ? results.length - suggestions.length : (stryCov_9fa48("19498"), results.length + suggestions.length)) + idx);
                  const isSelected = stryMutAct_9fa48("19501") ? historyIndex !== selectedIndex : stryMutAct_9fa48("19500") ? false : stryMutAct_9fa48("19499") ? true : (stryCov_9fa48("19499", "19500", "19501"), historyIndex === selectedIndex);
                  return <Button key={idx} variant="ghost" className={stryMutAct_9fa48("19502") ? `` : (stryCov_9fa48("19502"), `w-full justify-start ${isSelected ? stryMutAct_9fa48("19503") ? "" : (stryCov_9fa48("19503"), 'bg-accent') : stryMutAct_9fa48("19504") ? "Stryker was here!" : (stryCov_9fa48("19504"), '')}`)} onClick={stryMutAct_9fa48("19505") ? () => undefined : (stryCov_9fa48("19505"), () => handleRecentSearchClick(item))}>
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {item.query}
                    </Button>;
                }
              })}
              </div>
            </div>)}
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">Enter</kbd>
              Seleccionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">Esc</kbd>
              Cerrar
            </span>
          </div>
          {stryMutAct_9fa48("19508") ? results.length > 0 || <span>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </span> : stryMutAct_9fa48("19507") ? false : stryMutAct_9fa48("19506") ? true : (stryCov_9fa48("19506", "19507", "19508"), (stryMutAct_9fa48("19511") ? results.length <= 0 : stryMutAct_9fa48("19510") ? results.length >= 0 : stryMutAct_9fa48("19509") ? true : (stryCov_9fa48("19509", "19510", "19511"), results.length > 0)) && <span>
              {results.length} resultado{(stryMutAct_9fa48("19514") ? results.length === 1 : stryMutAct_9fa48("19513") ? false : stryMutAct_9fa48("19512") ? true : (stryCov_9fa48("19512", "19513", "19514"), results.length !== 1)) ? stryMutAct_9fa48("19515") ? "" : (stryCov_9fa48("19515"), 's') : stryMutAct_9fa48("19516") ? "Stryker was here!" : (stryCov_9fa48("19516"), '')}
            </span>)}
        </div>
      </div>
    </div>;
  }
}