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
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { captureError } from '@/lib/monitoring';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
interface BookmarkButtonProps {
  questionId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}
export function BookmarkButton({
  questionId,
  className,
  size = stryMutAct_9fa48("15952") ? "" : (stryCov_9fa48("15952"), 'sm'),
  variant = stryMutAct_9fa48("15953") ? "" : (stryCov_9fa48("15953"), 'ghost')
}: BookmarkButtonProps) {
  if (stryMutAct_9fa48("15954")) {
    {}
  } else {
    stryCov_9fa48("15954");
    const [isBookmarked, setIsBookmarked] = useState(stryMutAct_9fa48("15955") ? true : (stryCov_9fa48("15955"), false));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("15956") ? true : (stryCov_9fa48("15956"), false));
    const [isChecking, setIsChecking] = useState(stryMutAct_9fa48("15957") ? false : (stryCov_9fa48("15957"), true));
    useEffect(() => {
      if (stryMutAct_9fa48("15958")) {
        {}
      } else {
        stryCov_9fa48("15958");
        async function checkBookmark() {
          if (stryMutAct_9fa48("15959")) {
            {}
          } else {
            stryCov_9fa48("15959");
            try {
              if (stryMutAct_9fa48("15960")) {
                {}
              } else {
                stryCov_9fa48("15960");
                const res = await fetch(stryMutAct_9fa48("15961") ? `` : (stryCov_9fa48("15961"), `/api/bookmarks/check?questionIds=${questionId}`));
                if (stryMutAct_9fa48("15963") ? false : stryMutAct_9fa48("15962") ? true : (stryCov_9fa48("15962", "15963"), res.ok)) {
                  if (stryMutAct_9fa48("15964")) {
                    {}
                  } else {
                    stryCov_9fa48("15964");
                    const data = await res.json();
                    interface BookmarkedItem {
                      questionId: string;
                      isBookmarked: boolean;
                    }
                    const item = stryMutAct_9fa48("15965") ? (data.bookmarked as BookmarkedItem[] | undefined).find(b => b.questionId === questionId) : (stryCov_9fa48("15965"), (data.bookmarked as BookmarkedItem[] | undefined)?.find(stryMutAct_9fa48("15966") ? () => undefined : (stryCov_9fa48("15966"), b => stryMutAct_9fa48("15969") ? b.questionId !== questionId : stryMutAct_9fa48("15968") ? false : stryMutAct_9fa48("15967") ? true : (stryCov_9fa48("15967", "15968", "15969"), b.questionId === questionId))));
                    setIsBookmarked(stryMutAct_9fa48("15972") ? item?.isBookmarked && false : stryMutAct_9fa48("15971") ? false : stryMutAct_9fa48("15970") ? true : (stryCov_9fa48("15970", "15971", "15972"), (stryMutAct_9fa48("15973") ? item.isBookmarked : (stryCov_9fa48("15973"), item?.isBookmarked)) || (stryMutAct_9fa48("15974") ? true : (stryCov_9fa48("15974"), false))));
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("15975")) {
                {}
              } else {
                stryCov_9fa48("15975");
                captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("15976") ? {} : (stryCov_9fa48("15976"), {
                  type: stryMutAct_9fa48("15977") ? "" : (stryCov_9fa48("15977"), 'bookmark_check_error'),
                  questionId,
                  path: (stryMutAct_9fa48("15980") ? typeof window === 'undefined' : stryMutAct_9fa48("15979") ? false : stryMutAct_9fa48("15978") ? true : (stryCov_9fa48("15978", "15979", "15980"), typeof window !== (stryMutAct_9fa48("15981") ? "" : (stryCov_9fa48("15981"), 'undefined')))) ? window.location.pathname : undefined
                }));
              }
            } finally {
              if (stryMutAct_9fa48("15982")) {
                {}
              } else {
                stryCov_9fa48("15982");
                setIsChecking(stryMutAct_9fa48("15983") ? true : (stryCov_9fa48("15983"), false));
              }
            }
          }
        }
        checkBookmark();
      }
    }, stryMutAct_9fa48("15984") ? [] : (stryCov_9fa48("15984"), [questionId]));
    const handleToggle = async () => {
      if (stryMutAct_9fa48("15985")) {
        {}
      } else {
        stryCov_9fa48("15985");
        if (stryMutAct_9fa48("15988") ? isLoading && isChecking : stryMutAct_9fa48("15987") ? false : stryMutAct_9fa48("15986") ? true : (stryCov_9fa48("15986", "15987", "15988"), isLoading || isChecking)) return;
        setIsLoading(stryMutAct_9fa48("15989") ? false : (stryCov_9fa48("15989"), true));
        try {
          if (stryMutAct_9fa48("15990")) {
            {}
          } else {
            stryCov_9fa48("15990");
            if (stryMutAct_9fa48("15992") ? false : stryMutAct_9fa48("15991") ? true : (stryCov_9fa48("15991", "15992"), isBookmarked)) {
              if (stryMutAct_9fa48("15993")) {
                {}
              } else {
                stryCov_9fa48("15993");
                // Eliminar favorito
                const res = await fetch(stryMutAct_9fa48("15994") ? `` : (stryCov_9fa48("15994"), `/api/bookmarks?questionId=${questionId}`), stryMutAct_9fa48("15995") ? {} : (stryCov_9fa48("15995"), {
                  method: stryMutAct_9fa48("15996") ? "" : (stryCov_9fa48("15996"), 'DELETE')
                }));
                if (stryMutAct_9fa48("15998") ? false : stryMutAct_9fa48("15997") ? true : (stryCov_9fa48("15997", "15998"), res.ok)) {
                  if (stryMutAct_9fa48("15999")) {
                    {}
                  } else {
                    stryCov_9fa48("15999");
                    setIsBookmarked(stryMutAct_9fa48("16000") ? true : (stryCov_9fa48("16000"), false));
                    toast.success(stryMutAct_9fa48("16001") ? "" : (stryCov_9fa48("16001"), 'Eliminado de favoritos'));
                  }
                } else {
                  if (stryMutAct_9fa48("16002")) {
                    {}
                  } else {
                    stryCov_9fa48("16002");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("16003") ? "" : (stryCov_9fa48("16003"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(res, stryMutAct_9fa48("16004") ? {} : (stryCov_9fa48("16004"), {
                      path: (stryMutAct_9fa48("16007") ? typeof window === 'undefined' : stryMutAct_9fa48("16006") ? false : stryMutAct_9fa48("16005") ? true : (stryCov_9fa48("16005", "16006", "16007"), typeof window !== (stryMutAct_9fa48("16008") ? "" : (stryCov_9fa48("16008"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("16009") ? "" : (stryCov_9fa48("16009"), '/bookmarks'),
                      operation: stryMutAct_9fa48("16010") ? "" : (stryCov_9fa48("16010"), 'eliminar favorito')
                    }));
                    throw new Error(stryMutAct_9fa48("16013") ? errorData.error && 'Error al eliminar favorito' : stryMutAct_9fa48("16012") ? false : stryMutAct_9fa48("16011") ? true : (stryCov_9fa48("16011", "16012", "16013"), errorData.error || (stryMutAct_9fa48("16014") ? "" : (stryCov_9fa48("16014"), 'Error al eliminar favorito'))));
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("16015")) {
                {}
              } else {
                stryCov_9fa48("16015");
                // Agregar favorito
                const res = await fetch(stryMutAct_9fa48("16016") ? "" : (stryCov_9fa48("16016"), '/api/bookmarks'), stryMutAct_9fa48("16017") ? {} : (stryCov_9fa48("16017"), {
                  method: stryMutAct_9fa48("16018") ? "" : (stryCov_9fa48("16018"), 'POST'),
                  headers: stryMutAct_9fa48("16019") ? {} : (stryCov_9fa48("16019"), {
                    'Content-Type': stryMutAct_9fa48("16020") ? "" : (stryCov_9fa48("16020"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("16021") ? {} : (stryCov_9fa48("16021"), {
                    questionId
                  }))
                }));
                if (stryMutAct_9fa48("16023") ? false : stryMutAct_9fa48("16022") ? true : (stryCov_9fa48("16022", "16023"), res.ok)) {
                  if (stryMutAct_9fa48("16024")) {
                    {}
                  } else {
                    stryCov_9fa48("16024");
                    setIsBookmarked(stryMutAct_9fa48("16025") ? false : (stryCov_9fa48("16025"), true));
                    toast.success(stryMutAct_9fa48("16026") ? "" : (stryCov_9fa48("16026"), 'Agregado a favoritos'));
                  }
                } else {
                  if (stryMutAct_9fa48("16027")) {
                    {}
                  } else {
                    stryCov_9fa48("16027");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("16028") ? "" : (stryCov_9fa48("16028"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(res, stryMutAct_9fa48("16029") ? {} : (stryCov_9fa48("16029"), {
                      path: (stryMutAct_9fa48("16032") ? typeof window === 'undefined' : stryMutAct_9fa48("16031") ? false : stryMutAct_9fa48("16030") ? true : (stryCov_9fa48("16030", "16031", "16032"), typeof window !== (stryMutAct_9fa48("16033") ? "" : (stryCov_9fa48("16033"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("16034") ? "" : (stryCov_9fa48("16034"), '/bookmarks'),
                      operation: stryMutAct_9fa48("16035") ? "" : (stryCov_9fa48("16035"), 'agregar favorito')
                    }));
                    if (stryMutAct_9fa48("16038") ? res.status !== 409 : stryMutAct_9fa48("16037") ? false : stryMutAct_9fa48("16036") ? true : (stryCov_9fa48("16036", "16037", "16038"), res.status === 409)) {
                      if (stryMutAct_9fa48("16039")) {
                        {}
                      } else {
                        stryCov_9fa48("16039");
                        // Ya existe, actualizar estado
                        setIsBookmarked(stryMutAct_9fa48("16040") ? false : (stryCov_9fa48("16040"), true));
                      }
                    } else {
                      if (stryMutAct_9fa48("16041")) {
                        {}
                      } else {
                        stryCov_9fa48("16041");
                        throw new Error(stryMutAct_9fa48("16044") ? errorData.error && 'Error al agregar favorito' : stryMutAct_9fa48("16043") ? false : stryMutAct_9fa48("16042") ? true : (stryCov_9fa48("16042", "16043", "16044"), errorData.error || (stryMutAct_9fa48("16045") ? "" : (stryCov_9fa48("16045"), 'Error al agregar favorito'))));
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("16046")) {
            {}
          } else {
            stryCov_9fa48("16046");
            const errorInfo = extractErrorInfo(error);
            const errorCode = isBookmarked ? ERROR_CODES.DATA_DELETE_FAILED : ERROR_CODES.DATA_CREATE_FAILED;
            const structuredError = getErrorMessage(errorCode, stryMutAct_9fa48("16047") ? {} : (stryCov_9fa48("16047"), {
              item: stryMutAct_9fa48("16048") ? "" : (stryCov_9fa48("16048"), 'el favorito'),
              reason: errorInfo.message
            }));
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("16049") ? {} : (stryCov_9fa48("16049"), {
              type: stryMutAct_9fa48("16050") ? "" : (stryCov_9fa48("16050"), 'bookmark_error'),
              action: isBookmarked ? stryMutAct_9fa48("16051") ? "" : (stryCov_9fa48("16051"), 'delete') : stryMutAct_9fa48("16052") ? "" : (stryCov_9fa48("16052"), 'create'),
              questionId
            }));
            toast.error(structuredError.title, stryMutAct_9fa48("16053") ? {} : (stryCov_9fa48("16053"), {
              description: stryMutAct_9fa48("16054") ? `` : (stryCov_9fa48("16054"), `${structuredError.description} ${structuredError.solution}`),
              duration: 6000
            }));
          }
        } finally {
          if (stryMutAct_9fa48("16055")) {
            {}
          } else {
            stryCov_9fa48("16055");
            setIsLoading(stryMutAct_9fa48("16056") ? true : (stryCov_9fa48("16056"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("16058") ? false : stryMutAct_9fa48("16057") ? true : (stryCov_9fa48("16057", "16058"), isChecking)) {
      if (stryMutAct_9fa48("16059")) {
        {}
      } else {
        stryCov_9fa48("16059");
        return <Button variant={variant} size={size} className={cn(className)} disabled>
        <Star className="h-4 w-4" />
      </Button>;
      }
    }
    return <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} size={size} className={cn(className, stryMutAct_9fa48("16062") ? isBookmarked || 'text-yellow-500 hover:text-yellow-600' : stryMutAct_9fa48("16061") ? false : stryMutAct_9fa48("16060") ? true : (stryCov_9fa48("16060", "16061", "16062"), isBookmarked && (stryMutAct_9fa48("16063") ? "" : (stryCov_9fa48("16063"), 'text-yellow-500 hover:text-yellow-600'))))} onClick={handleToggle} disabled={isLoading} aria-label={isBookmarked ? stryMutAct_9fa48("16064") ? "" : (stryCov_9fa48("16064"), 'Quitar de favoritos') : stryMutAct_9fa48("16065") ? "" : (stryCov_9fa48("16065"), 'Agregar a favoritos')} aria-pressed={isBookmarked}>
          <Star className={cn(stryMutAct_9fa48("16066") ? "" : (stryCov_9fa48("16066"), 'h-4 w-4 transition-all'), isBookmarked ? stryMutAct_9fa48("16067") ? "" : (stryCov_9fa48("16067"), 'fill-yellow-500 text-yellow-500') : stryMutAct_9fa48("16068") ? "Stryker was here!" : (stryCov_9fa48("16068"), ''))} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {isBookmarked ? <>
              <strong>Quitar de favoritos</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                Esta pregunta ya está guardada. Haz clic para quitarla de tu lista de favoritos.
              </span>
            </> : <>
              <strong>Guardar en favoritos</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                Como marcar una página en un libro. Guarda esta pregunta para repasarla más tarde.
              </span>
            </>}
        </p>
      </TooltipContent>
    </Tooltip>;
  }
}