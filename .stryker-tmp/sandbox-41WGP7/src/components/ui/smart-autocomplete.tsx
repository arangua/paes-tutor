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
import React, { useRef, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Loader2, Search, Clock, TrendingUp, X } from 'lucide-react';
import { useSmartAutocomplete, AutocompleteSuggestion } from '@/hooks/useSmartAutocomplete';
import { cn } from '@/lib/utils';
export interface SmartAutocompleteProps {
  /**
   * Valor actual del input
   */
  value: string;
  /**
   * Callback cuando cambia el valor
   */
  onChange: (value: string) => void;
  /**
   * Placeholder del input
   */
  placeholder?: string;
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
   * Clase CSS adicional
   */
  className?: string;
  /**
   * Deshabilitar el componente
   */
  disabled?: boolean;
  /**
   * Otras props del Input
   */
  inputProps?: React.ComponentProps<typeof Input>;
}

/**
 * Componente de autocompletado inteligente
 * Basado en Nielsen Heuristic #4: Consistency and standards
 * y #8: Flexibility and efficiency
 */
export function SmartAutocomplete({
  value,
  onChange,
  placeholder = stryMutAct_9fa48("21123") ? "" : (stryCov_9fa48("21123"), 'Escribe para buscar...'),
  fetchSuggestions,
  localSuggestions = stryMutAct_9fa48("21124") ? ["Stryker was here"] : (stryCov_9fa48("21124"), []),
  debounceDelay = 200,
  minChars = 2,
  maxSuggestions = 10,
  onSelect,
  className,
  disabled,
  inputProps
}: SmartAutocompleteProps) {
  if (stryMutAct_9fa48("21125")) {
    {}
  } else {
    stryCov_9fa48("21125");
    const containerRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const {
      query,
      suggestions,
      isLoading,
      selectedIndex,
      isOpen,
      setQuery,
      selectSuggestion,
      setIsOpen,
      handleKeyDown
    } = useSmartAutocomplete(stryMutAct_9fa48("21126") ? {} : (stryCov_9fa48("21126"), {
      fetchSuggestions,
      localSuggestions,
      debounceDelay,
      minChars,
      maxSuggestions,
      onSelect,
      onQueryChange: onChange
    }));

    // Sincronizar query con value externo
    useEffect(() => {
      if (stryMutAct_9fa48("21127")) {
        {}
      } else {
        stryCov_9fa48("21127");
        if (stryMutAct_9fa48("21130") ? value === query : stryMutAct_9fa48("21129") ? false : stryMutAct_9fa48("21128") ? true : (stryCov_9fa48("21128", "21129", "21130"), value !== query)) {
          if (stryMutAct_9fa48("21131")) {
            {}
          } else {
            stryCov_9fa48("21131");
            setQuery(value);
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // setQuery es estable del hook useState, no necesita estar en dependencias
        // Solo value y query son las dependencias necesarias para este efecto
      }
    }, stryMutAct_9fa48("21132") ? [] : (stryCov_9fa48("21132"), [value, query]));

    // Cerrar al hacer click fuera
    useEffect(() => {
      if (stryMutAct_9fa48("21133")) {
        {}
      } else {
        stryCov_9fa48("21133");
        const handleClickOutside = (event: MouseEvent) => {
          if (stryMutAct_9fa48("21134")) {
            {}
          } else {
            stryCov_9fa48("21134");
            if (stryMutAct_9fa48("21137") ? containerRef.current || !containerRef.current.contains(event.target as Node) : stryMutAct_9fa48("21136") ? false : stryMutAct_9fa48("21135") ? true : (stryCov_9fa48("21135", "21136", "21137"), containerRef.current && (stryMutAct_9fa48("21138") ? containerRef.current.contains(event.target as Node) : (stryCov_9fa48("21138"), !containerRef.current.contains(event.target as Node))))) {
              if (stryMutAct_9fa48("21139")) {
                {}
              } else {
                stryCov_9fa48("21139");
                setIsOpen(stryMutAct_9fa48("21140") ? true : (stryCov_9fa48("21140"), false));
              }
            }
          }
        };
        if (stryMutAct_9fa48("21142") ? false : stryMutAct_9fa48("21141") ? true : (stryCov_9fa48("21141", "21142"), isOpen)) {
          if (stryMutAct_9fa48("21143")) {
            {}
          } else {
            stryCov_9fa48("21143");
            document.addEventListener(stryMutAct_9fa48("21144") ? "" : (stryCov_9fa48("21144"), 'mousedown'), handleClickOutside);
            return stryMutAct_9fa48("21145") ? () => undefined : (stryCov_9fa48("21145"), () => document.removeEventListener(stryMutAct_9fa48("21146") ? "" : (stryCov_9fa48("21146"), 'mousedown'), handleClickOutside));
          }
        }
      }
    }, stryMutAct_9fa48("21147") ? [] : (stryCov_9fa48("21147"), [isOpen, setIsOpen]));

    // Scroll a la sugerencia seleccionada
    useEffect(() => {
      if (stryMutAct_9fa48("21148")) {
        {}
      } else {
        stryCov_9fa48("21148");
        if (stryMutAct_9fa48("21151") ? selectedIndex >= 0 || suggestionsRef.current : stryMutAct_9fa48("21150") ? false : stryMutAct_9fa48("21149") ? true : (stryCov_9fa48("21149", "21150", "21151"), (stryMutAct_9fa48("21154") ? selectedIndex < 0 : stryMutAct_9fa48("21153") ? selectedIndex > 0 : stryMutAct_9fa48("21152") ? true : (stryCov_9fa48("21152", "21153", "21154"), selectedIndex >= 0)) && suggestionsRef.current)) {
          if (stryMutAct_9fa48("21155")) {
            {}
          } else {
            stryCov_9fa48("21155");
            const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
            if (stryMutAct_9fa48("21157") ? false : stryMutAct_9fa48("21156") ? true : (stryCov_9fa48("21156", "21157"), selectedElement)) {
              if (stryMutAct_9fa48("21158")) {
                {}
              } else {
                stryCov_9fa48("21158");
                selectedElement.scrollIntoView(stryMutAct_9fa48("21159") ? {} : (stryCov_9fa48("21159"), {
                  block: stryMutAct_9fa48("21160") ? "" : (stryCov_9fa48("21160"), 'nearest'),
                  behavior: stryMutAct_9fa48("21161") ? "" : (stryCov_9fa48("21161"), 'smooth')
                }));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("21162") ? [] : (stryCov_9fa48("21162"), [selectedIndex]));
    const getSuggestionIcon = (suggestion: AutocompleteSuggestion) => {
      if (stryMutAct_9fa48("21163")) {
        {}
      } else {
        stryCov_9fa48("21163");
        switch (suggestion.type) {
          case stryMutAct_9fa48("21165") ? "" : (stryCov_9fa48("21165"), 'history'):
            if (stryMutAct_9fa48("21164")) {} else {
              stryCov_9fa48("21164");
              return Clock;
            }
          case stryMutAct_9fa48("21167") ? "" : (stryCov_9fa48("21167"), 'popular'):
            if (stryMutAct_9fa48("21166")) {} else {
              stryCov_9fa48("21166");
              return TrendingUp;
            }
          default:
            if (stryMutAct_9fa48("21168")) {} else {
              stryCov_9fa48("21168");
              return Search;
            }
        }
      }
    };
    const getSuggestionLabel = (suggestion: AutocompleteSuggestion) => {
      if (stryMutAct_9fa48("21169")) {
        {}
      } else {
        stryCov_9fa48("21169");
        switch (suggestion.type) {
          case stryMutAct_9fa48("21171") ? "" : (stryCov_9fa48("21171"), 'history'):
            if (stryMutAct_9fa48("21170")) {} else {
              stryCov_9fa48("21170");
              return stryMutAct_9fa48("21172") ? "" : (stryCov_9fa48("21172"), 'Reciente');
            }
          case stryMutAct_9fa48("21174") ? "" : (stryCov_9fa48("21174"), 'popular'):
            if (stryMutAct_9fa48("21173")) {} else {
              stryCov_9fa48("21173");
              return stryMutAct_9fa48("21175") ? "" : (stryCov_9fa48("21175"), 'Popular');
            }
          case stryMutAct_9fa48("21177") ? "" : (stryCov_9fa48("21177"), 'contextual'):
            if (stryMutAct_9fa48("21176")) {} else {
              stryCov_9fa48("21176");
              return stryMutAct_9fa48("21178") ? "" : (stryCov_9fa48("21178"), 'Sugerido');
            }
          default:
            if (stryMutAct_9fa48("21179")) {} else {
              stryCov_9fa48("21179");
              return stryMutAct_9fa48("21180") ? "" : (stryCov_9fa48("21180"), 'Resultado');
            }
        }
      }
    };
    return <div ref={containerRef} className={cn(stryMutAct_9fa48("21181") ? "" : (stryCov_9fa48("21181"), 'relative'), className)}>
      <div className="relative">
        <Input {...inputProps} value={query} onChange={stryMutAct_9fa48("21182") ? () => undefined : (stryCov_9fa48("21182"), e => setQuery(e.target.value))} onKeyDown={handleKeyDown} onFocus={() => {
          if (stryMutAct_9fa48("21183")) {
            {}
          } else {
            stryCov_9fa48("21183");
            if (stryMutAct_9fa48("21186") ? query.length >= minChars && suggestions.length > 0 : stryMutAct_9fa48("21185") ? false : stryMutAct_9fa48("21184") ? true : (stryCov_9fa48("21184", "21185", "21186"), (stryMutAct_9fa48("21189") ? query.length < minChars : stryMutAct_9fa48("21188") ? query.length > minChars : stryMutAct_9fa48("21187") ? false : (stryCov_9fa48("21187", "21188", "21189"), query.length >= minChars)) || (stryMutAct_9fa48("21192") ? suggestions.length <= 0 : stryMutAct_9fa48("21191") ? suggestions.length >= 0 : stryMutAct_9fa48("21190") ? false : (stryCov_9fa48("21190", "21191", "21192"), suggestions.length > 0)))) {
              if (stryMutAct_9fa48("21193")) {
                {}
              } else {
                stryCov_9fa48("21193");
                setIsOpen(stryMutAct_9fa48("21194") ? false : (stryCov_9fa48("21194"), true));
              }
            }
          }
        }} placeholder={placeholder} disabled={disabled} className={cn(stryMutAct_9fa48("21195") ? "" : (stryCov_9fa48("21195"), 'pr-10'), stryMutAct_9fa48("21196") ? inputProps.className : (stryCov_9fa48("21196"), inputProps?.className))} />
        {stryMutAct_9fa48("21199") ? isLoading || <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div> : stryMutAct_9fa48("21198") ? false : stryMutAct_9fa48("21197") ? true : (stryCov_9fa48("21197", "21198", "21199"), isLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>)}
        {stryMutAct_9fa48("21202") ? query && !isLoading || <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => {
          setQuery('');
          setIsOpen(false);
        }} aria-label="Limpiar búsqueda">
            <X className="h-3 w-3" />
          </Button> : stryMutAct_9fa48("21201") ? false : stryMutAct_9fa48("21200") ? true : (stryCov_9fa48("21200", "21201", "21202"), (stryMutAct_9fa48("21204") ? query || !isLoading : stryMutAct_9fa48("21203") ? true : (stryCov_9fa48("21203", "21204"), query && (stryMutAct_9fa48("21205") ? isLoading : (stryCov_9fa48("21205"), !isLoading)))) && <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => {
          if (stryMutAct_9fa48("21206")) {
            {}
          } else {
            stryCov_9fa48("21206");
            setQuery(stryMutAct_9fa48("21207") ? "Stryker was here!" : (stryCov_9fa48("21207"), ''));
            setIsOpen(stryMutAct_9fa48("21208") ? true : (stryCov_9fa48("21208"), false));
          }
        }} aria-label="Limpiar búsqueda">
            <X className="h-3 w-3" />
          </Button>)}
      </div>

      {/* Dropdown de sugerencias */}
      {stryMutAct_9fa48("21211") ? isOpen && suggestions.length > 0 || <Card className="absolute z-50 w-full mt-1 shadow-lg max-h-60 overflow-hidden">
          <CardContent className="p-0">
            <div ref={suggestionsRef} className="max-h-60 overflow-y-auto" role="listbox" aria-label="Sugerencias de búsqueda" aria-live="polite">
              {suggestions.map((suggestion, index) => {
              const Icon = getSuggestionIcon(suggestion);
              const isSelected = index === selectedIndex;
              return <button key={suggestion.id} type="button" role="option" aria-selected={isSelected} onClick={() => selectSuggestion(suggestion)} className={cn('w-full flex items-center gap-3 px-4 py-2 text-left transition-colors', isSelected ? 'bg-accent' : 'hover:bg-accent/50')}>
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{suggestion.text}</span>
                        {suggestion.type && <Badge variant="outline" className="text-xs">
                            {getSuggestionLabel(suggestion)}
                          </Badge>}
                      </div>
                      {suggestion.metadata?.subject && <p className="text-xs text-muted-foreground truncate">
                          {suggestion.metadata.subject}
                        </p>}
                    </div>
                  </button>;
            })}
            </div>
          </CardContent>
        </Card> : stryMutAct_9fa48("21210") ? false : stryMutAct_9fa48("21209") ? true : (stryCov_9fa48("21209", "21210", "21211"), (stryMutAct_9fa48("21213") ? isOpen || suggestions.length > 0 : stryMutAct_9fa48("21212") ? true : (stryCov_9fa48("21212", "21213"), isOpen && (stryMutAct_9fa48("21216") ? suggestions.length <= 0 : stryMutAct_9fa48("21215") ? suggestions.length >= 0 : stryMutAct_9fa48("21214") ? true : (stryCov_9fa48("21214", "21215", "21216"), suggestions.length > 0)))) && <Card className="absolute z-50 w-full mt-1 shadow-lg max-h-60 overflow-hidden">
          <CardContent className="p-0">
            <div ref={suggestionsRef} className="max-h-60 overflow-y-auto" role="listbox" aria-label="Sugerencias de búsqueda" aria-live="polite">
              {suggestions.map((suggestion, index) => {
              if (stryMutAct_9fa48("21217")) {
                {}
              } else {
                stryCov_9fa48("21217");
                const Icon = getSuggestionIcon(suggestion);
                const isSelected = stryMutAct_9fa48("21220") ? index !== selectedIndex : stryMutAct_9fa48("21219") ? false : stryMutAct_9fa48("21218") ? true : (stryCov_9fa48("21218", "21219", "21220"), index === selectedIndex);
                return <button key={suggestion.id} type="button" role="option" aria-selected={isSelected} onClick={stryMutAct_9fa48("21221") ? () => undefined : (stryCov_9fa48("21221"), () => selectSuggestion(suggestion))} className={cn(stryMutAct_9fa48("21222") ? "" : (stryCov_9fa48("21222"), 'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors'), isSelected ? stryMutAct_9fa48("21223") ? "" : (stryCov_9fa48("21223"), 'bg-accent') : stryMutAct_9fa48("21224") ? "" : (stryCov_9fa48("21224"), 'hover:bg-accent/50'))}>
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{suggestion.text}</span>
                        {stryMutAct_9fa48("21227") ? suggestion.type || <Badge variant="outline" className="text-xs">
                            {getSuggestionLabel(suggestion)}
                          </Badge> : stryMutAct_9fa48("21226") ? false : stryMutAct_9fa48("21225") ? true : (stryCov_9fa48("21225", "21226", "21227"), suggestion.type && <Badge variant="outline" className="text-xs">
                            {getSuggestionLabel(suggestion)}
                          </Badge>)}
                      </div>
                      {stryMutAct_9fa48("21230") ? suggestion.metadata?.subject || <p className="text-xs text-muted-foreground truncate">
                          {suggestion.metadata.subject}
                        </p> : stryMutAct_9fa48("21229") ? false : stryMutAct_9fa48("21228") ? true : (stryCov_9fa48("21228", "21229", "21230"), (stryMutAct_9fa48("21231") ? suggestion.metadata.subject : (stryCov_9fa48("21231"), suggestion.metadata?.subject)) && <p className="text-xs text-muted-foreground truncate">
                          {suggestion.metadata.subject}
                        </p>)}
                    </div>
                  </button>;
              }
            })}
            </div>
          </CardContent>
        </Card>)}
    </div>;
  }
}