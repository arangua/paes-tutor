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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { UndoRedoToolbar } from '@/components/ui/undo-redo-toolbar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { captureError } from '@/lib/monitoring';
interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId?: string;
  topicId?: string;
  defaultTitle?: string;
  defaultContent?: string;
  noteId?: string;
  onSuccess?: () => void;
}
export function NoteDialog({
  open,
  onOpenChange,
  questionId,
  topicId,
  defaultTitle = stryMutAct_9fa48("18030") ? "Stryker was here!" : (stryCov_9fa48("18030"), ''),
  defaultContent = stryMutAct_9fa48("18031") ? "Stryker was here!" : (stryCov_9fa48("18031"), ''),
  noteId,
  onSuccess
}: NoteDialogProps) {
  if (stryMutAct_9fa48("18032")) {
    {}
  } else {
    stryCov_9fa48("18032");
    const [title, setTitle] = useState(defaultTitle);
    const [content, setContent] = useState(defaultContent);
    const [tags, setTags] = useState(stryMutAct_9fa48("18033") ? "Stryker was here!" : (stryCov_9fa48("18033"), ''));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("18034") ? true : (stryCov_9fa48("18034"), false));
    const [titleError, setTitleError] = useState<string | null>(null);
    const [contentError, setContentError] = useState<string | null>(null);

    // Sistema de undo/redo para el contenido
    const {
      state: noteState,
      setState: setNoteState,
      undo,
      redo,
      canUndo,
      canRedo
    } = useUndoRedo(stryMutAct_9fa48("18035") ? {} : (stryCov_9fa48("18035"), {
      title: defaultTitle,
      content: defaultContent,
      tags: stryMutAct_9fa48("18036") ? "Stryker was here!" : (stryCov_9fa48("18036"), '')
    }), 20);

    // Sincronizar estado con undo/redo
    useEffect(() => {
      if (stryMutAct_9fa48("18037")) {
        {}
      } else {
        stryCov_9fa48("18037");
        setTitle(noteState.title);
        setContent(noteState.content);
        setTags(noteState.tags);
      }
    }, stryMutAct_9fa48("18038") ? [] : (stryCov_9fa48("18038"), [noteState]));

    // Atajos de teclado para undo/redo
    useKeyboardShortcuts(stryMutAct_9fa48("18039") ? [] : (stryCov_9fa48("18039"), [stryMutAct_9fa48("18040") ? {} : (stryCov_9fa48("18040"), {
      key: stryMutAct_9fa48("18041") ? "" : (stryCov_9fa48("18041"), 'z'),
      ctrl: stryMutAct_9fa48("18042") ? false : (stryCov_9fa48("18042"), true),
      description: stryMutAct_9fa48("18043") ? "" : (stryCov_9fa48("18043"), 'Deshacer'),
      action: undo
    }), stryMutAct_9fa48("18044") ? {} : (stryCov_9fa48("18044"), {
      key: stryMutAct_9fa48("18045") ? "" : (stryCov_9fa48("18045"), 'z'),
      ctrl: stryMutAct_9fa48("18046") ? false : (stryCov_9fa48("18046"), true),
      shift: stryMutAct_9fa48("18047") ? false : (stryCov_9fa48("18047"), true),
      description: stryMutAct_9fa48("18048") ? "" : (stryCov_9fa48("18048"), 'Rehacer'),
      action: redo
    })]));
    useEffect(() => {
      if (stryMutAct_9fa48("18049")) {
        {}
      } else {
        stryCov_9fa48("18049");
        if (stryMutAct_9fa48("18051") ? false : stryMutAct_9fa48("18050") ? true : (stryCov_9fa48("18050", "18051"), open)) {
          if (stryMutAct_9fa48("18052")) {
            {}
          } else {
            stryCov_9fa48("18052");
            setTitle(defaultTitle);
            setContent(defaultContent);
            setTags(stryMutAct_9fa48("18053") ? "Stryker was here!" : (stryCov_9fa48("18053"), ''));
            setNoteState(stryMutAct_9fa48("18054") ? {} : (stryCov_9fa48("18054"), {
              title: defaultTitle,
              content: defaultContent,
              tags: stryMutAct_9fa48("18055") ? "Stryker was here!" : (stryCov_9fa48("18055"), '')
            }));
            setTitleError(null);
            setContentError(null);
          }
        }
      }
    }, stryMutAct_9fa48("18056") ? [] : (stryCov_9fa48("18056"), [open, defaultTitle, defaultContent, setNoteState]));

    // Validación en tiempo real
    const handleTitleChange = (value: string) => {
      if (stryMutAct_9fa48("18057")) {
        {}
      } else {
        stryCov_9fa48("18057");
        setTitle(value);
        setNoteState(stryMutAct_9fa48("18058") ? () => undefined : (stryCov_9fa48("18058"), prev => stryMutAct_9fa48("18059") ? {} : (stryCov_9fa48("18059"), {
          ...prev,
          title: value
        })));

        // Validar en tiempo real
        if (stryMutAct_9fa48("18062") ? value.trim().length !== 0 : stryMutAct_9fa48("18061") ? false : stryMutAct_9fa48("18060") ? true : (stryCov_9fa48("18060", "18061", "18062"), (stryMutAct_9fa48("18063") ? value.length : (stryCov_9fa48("18063"), value.trim().length)) === 0)) {
          if (stryMutAct_9fa48("18064")) {
            {}
          } else {
            stryCov_9fa48("18064");
            setTitleError(stryMutAct_9fa48("18065") ? "" : (stryCov_9fa48("18065"), 'El título es requerido'));
          }
        } else if (stryMutAct_9fa48("18069") ? value.trim().length >= 3 : stryMutAct_9fa48("18068") ? value.trim().length <= 3 : stryMutAct_9fa48("18067") ? false : stryMutAct_9fa48("18066") ? true : (stryCov_9fa48("18066", "18067", "18068", "18069"), (stryMutAct_9fa48("18070") ? value.length : (stryCov_9fa48("18070"), value.trim().length)) < 3)) {
          if (stryMutAct_9fa48("18071")) {
            {}
          } else {
            stryCov_9fa48("18071");
            setTitleError(stryMutAct_9fa48("18072") ? "" : (stryCov_9fa48("18072"), 'El título debe tener al menos 3 caracteres'));
          }
        } else if (stryMutAct_9fa48("18076") ? value.length <= 100 : stryMutAct_9fa48("18075") ? value.length >= 100 : stryMutAct_9fa48("18074") ? false : stryMutAct_9fa48("18073") ? true : (stryCov_9fa48("18073", "18074", "18075", "18076"), value.length > 100)) {
          if (stryMutAct_9fa48("18077")) {
            {}
          } else {
            stryCov_9fa48("18077");
            setTitleError(stryMutAct_9fa48("18078") ? "" : (stryCov_9fa48("18078"), 'El título no puede exceder 100 caracteres'));
          }
        } else {
          if (stryMutAct_9fa48("18079")) {
            {}
          } else {
            stryCov_9fa48("18079");
            setTitleError(null);
          }
        }
      }
    };
    const handleContentChange = (value: string) => {
      if (stryMutAct_9fa48("18080")) {
        {}
      } else {
        stryCov_9fa48("18080");
        setContent(value);
        setNoteState(stryMutAct_9fa48("18081") ? () => undefined : (stryCov_9fa48("18081"), prev => stryMutAct_9fa48("18082") ? {} : (stryCov_9fa48("18082"), {
          ...prev,
          content: value
        })));

        // Validar en tiempo real
        if (stryMutAct_9fa48("18085") ? value.trim().length !== 0 : stryMutAct_9fa48("18084") ? false : stryMutAct_9fa48("18083") ? true : (stryCov_9fa48("18083", "18084", "18085"), (stryMutAct_9fa48("18086") ? value.length : (stryCov_9fa48("18086"), value.trim().length)) === 0)) {
          if (stryMutAct_9fa48("18087")) {
            {}
          } else {
            stryCov_9fa48("18087");
            setContentError(stryMutAct_9fa48("18088") ? "" : (stryCov_9fa48("18088"), 'El contenido es requerido'));
          }
        } else if (stryMutAct_9fa48("18092") ? value.trim().length >= 10 : stryMutAct_9fa48("18091") ? value.trim().length <= 10 : stryMutAct_9fa48("18090") ? false : stryMutAct_9fa48("18089") ? true : (stryCov_9fa48("18089", "18090", "18091", "18092"), (stryMutAct_9fa48("18093") ? value.length : (stryCov_9fa48("18093"), value.trim().length)) < 10)) {
          if (stryMutAct_9fa48("18094")) {
            {}
          } else {
            stryCov_9fa48("18094");
            setContentError(stryMutAct_9fa48("18095") ? "" : (stryCov_9fa48("18095"), 'El contenido debe tener al menos 10 caracteres'));
          }
        } else if (stryMutAct_9fa48("18099") ? value.length <= 5000 : stryMutAct_9fa48("18098") ? value.length >= 5000 : stryMutAct_9fa48("18097") ? false : stryMutAct_9fa48("18096") ? true : (stryCov_9fa48("18096", "18097", "18098", "18099"), value.length > 5000)) {
          if (stryMutAct_9fa48("18100")) {
            {}
          } else {
            stryCov_9fa48("18100");
            setContentError(stryMutAct_9fa48("18101") ? "" : (stryCov_9fa48("18101"), 'El contenido no puede exceder 5000 caracteres'));
          }
        } else {
          if (stryMutAct_9fa48("18102")) {
            {}
          } else {
            stryCov_9fa48("18102");
            setContentError(null);
          }
        }
      }
    };
    const handleSubmit = async () => {
      if (stryMutAct_9fa48("18103")) {
        {}
      } else {
        stryCov_9fa48("18103");
        // Validación final
        if (stryMutAct_9fa48("18106") ? false : stryMutAct_9fa48("18105") ? true : stryMutAct_9fa48("18104") ? title.trim() : (stryCov_9fa48("18104", "18105", "18106"), !(stryMutAct_9fa48("18107") ? title : (stryCov_9fa48("18107"), title.trim())))) {
          if (stryMutAct_9fa48("18108")) {
            {}
          } else {
            stryCov_9fa48("18108");
            setTitleError(stryMutAct_9fa48("18109") ? "" : (stryCov_9fa48("18109"), 'El título es requerido'));
            return;
          }
        }
        if (stryMutAct_9fa48("18112") ? false : stryMutAct_9fa48("18111") ? true : stryMutAct_9fa48("18110") ? content.trim() : (stryCov_9fa48("18110", "18111", "18112"), !(stryMutAct_9fa48("18113") ? content : (stryCov_9fa48("18113"), content.trim())))) {
          if (stryMutAct_9fa48("18114")) {
            {}
          } else {
            stryCov_9fa48("18114");
            setContentError(stryMutAct_9fa48("18115") ? "" : (stryCov_9fa48("18115"), 'El contenido es requerido'));
            return;
          }
        }
        if (stryMutAct_9fa48("18118") ? titleError && contentError : stryMutAct_9fa48("18117") ? false : stryMutAct_9fa48("18116") ? true : (stryCov_9fa48("18116", "18117", "18118"), titleError || contentError)) {
          if (stryMutAct_9fa48("18119")) {
            {}
          } else {
            stryCov_9fa48("18119");
            toast.error(stryMutAct_9fa48("18120") ? "" : (stryCov_9fa48("18120"), 'Por favor corrige los errores antes de guardar'));
            return;
          }
        }
        setIsLoading(stryMutAct_9fa48("18121") ? false : (stryCov_9fa48("18121"), true));
        try {
          if (stryMutAct_9fa48("18122")) {
            {}
          } else {
            stryCov_9fa48("18122");
            if (stryMutAct_9fa48("18124") ? false : stryMutAct_9fa48("18123") ? true : (stryCov_9fa48("18123", "18124"), noteId)) {
              if (stryMutAct_9fa48("18125")) {
                {}
              } else {
                stryCov_9fa48("18125");
                // Actualizar nota existente
                const res = await fetch(stryMutAct_9fa48("18126") ? `` : (stryCov_9fa48("18126"), `/api/notes?noteId=${noteId}`), stryMutAct_9fa48("18127") ? {} : (stryCov_9fa48("18127"), {
                  method: stryMutAct_9fa48("18128") ? "" : (stryCov_9fa48("18128"), 'PUT'),
                  headers: stryMutAct_9fa48("18129") ? {} : (stryCov_9fa48("18129"), {
                    'Content-Type': stryMutAct_9fa48("18130") ? "" : (stryCov_9fa48("18130"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("18131") ? {} : (stryCov_9fa48("18131"), {
                    title: stryMutAct_9fa48("18132") ? title : (stryCov_9fa48("18132"), title.trim()),
                    content: stryMutAct_9fa48("18133") ? content : (stryCov_9fa48("18133"), content.trim()),
                    tags: stryMutAct_9fa48("18136") ? tags.trim() && undefined : stryMutAct_9fa48("18135") ? false : stryMutAct_9fa48("18134") ? true : (stryCov_9fa48("18134", "18135", "18136"), (stryMutAct_9fa48("18137") ? tags : (stryCov_9fa48("18137"), tags.trim())) || undefined)
                  }))
                }));
                if (stryMutAct_9fa48("18140") ? false : stryMutAct_9fa48("18139") ? true : stryMutAct_9fa48("18138") ? res.ok : (stryCov_9fa48("18138", "18139", "18140"), !res.ok)) {
                  if (stryMutAct_9fa48("18141")) {
                    {}
                  } else {
                    stryCov_9fa48("18141");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("18142") ? "" : (stryCov_9fa48("18142"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(res, stryMutAct_9fa48("18143") ? {} : (stryCov_9fa48("18143"), {
                      path: (stryMutAct_9fa48("18146") ? typeof window === 'undefined' : stryMutAct_9fa48("18145") ? false : stryMutAct_9fa48("18144") ? true : (stryCov_9fa48("18144", "18145", "18146"), typeof window !== (stryMutAct_9fa48("18147") ? "" : (stryCov_9fa48("18147"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("18148") ? "" : (stryCov_9fa48("18148"), '/notes'),
                      operation: stryMutAct_9fa48("18149") ? "" : (stryCov_9fa48("18149"), 'actualizar nota')
                    }));
                    throw new Error(stryMutAct_9fa48("18152") ? errorData.error && 'Error al actualizar nota' : stryMutAct_9fa48("18151") ? false : stryMutAct_9fa48("18150") ? true : (stryCov_9fa48("18150", "18151", "18152"), errorData.error || (stryMutAct_9fa48("18153") ? "" : (stryCov_9fa48("18153"), 'Error al actualizar nota'))));
                  }
                }
                toast.success(stryMutAct_9fa48("18154") ? "" : (stryCov_9fa48("18154"), 'Nota actualizada correctamente'));
              }
            } else {
              if (stryMutAct_9fa48("18155")) {
                {}
              } else {
                stryCov_9fa48("18155");
                // Crear nueva nota
                const res = await fetch(stryMutAct_9fa48("18156") ? "" : (stryCov_9fa48("18156"), '/api/notes'), stryMutAct_9fa48("18157") ? {} : (stryCov_9fa48("18157"), {
                  method: stryMutAct_9fa48("18158") ? "" : (stryCov_9fa48("18158"), 'POST'),
                  headers: stryMutAct_9fa48("18159") ? {} : (stryCov_9fa48("18159"), {
                    'Content-Type': stryMutAct_9fa48("18160") ? "" : (stryCov_9fa48("18160"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("18161") ? {} : (stryCov_9fa48("18161"), {
                    questionId: stryMutAct_9fa48("18164") ? questionId && undefined : stryMutAct_9fa48("18163") ? false : stryMutAct_9fa48("18162") ? true : (stryCov_9fa48("18162", "18163", "18164"), questionId || undefined),
                    topicId: stryMutAct_9fa48("18167") ? topicId && undefined : stryMutAct_9fa48("18166") ? false : stryMutAct_9fa48("18165") ? true : (stryCov_9fa48("18165", "18166", "18167"), topicId || undefined),
                    title: stryMutAct_9fa48("18168") ? title : (stryCov_9fa48("18168"), title.trim()),
                    content: stryMutAct_9fa48("18169") ? content : (stryCov_9fa48("18169"), content.trim()),
                    tags: stryMutAct_9fa48("18172") ? tags.trim() && undefined : stryMutAct_9fa48("18171") ? false : stryMutAct_9fa48("18170") ? true : (stryCov_9fa48("18170", "18171", "18172"), (stryMutAct_9fa48("18173") ? tags : (stryCov_9fa48("18173"), tags.trim())) || undefined)
                  }))
                }));
                if (stryMutAct_9fa48("18176") ? false : stryMutAct_9fa48("18175") ? true : stryMutAct_9fa48("18174") ? res.ok : (stryCov_9fa48("18174", "18175", "18176"), !res.ok)) {
                  if (stryMutAct_9fa48("18177")) {
                    {}
                  } else {
                    stryCov_9fa48("18177");
                    const {
                      safeJsonParse
                    } = await import(stryMutAct_9fa48("18178") ? "" : (stryCov_9fa48("18178"), '@/lib/api-helpers'));
                    const errorData = await safeJsonParse<{
                      error?: string;
                    }>(res, stryMutAct_9fa48("18179") ? {} : (stryCov_9fa48("18179"), {
                      path: (stryMutAct_9fa48("18182") ? typeof window === 'undefined' : stryMutAct_9fa48("18181") ? false : stryMutAct_9fa48("18180") ? true : (stryCov_9fa48("18180", "18181", "18182"), typeof window !== (stryMutAct_9fa48("18183") ? "" : (stryCov_9fa48("18183"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("18184") ? "" : (stryCov_9fa48("18184"), '/notes'),
                      operation: stryMutAct_9fa48("18185") ? "" : (stryCov_9fa48("18185"), 'crear nota')
                    }));
                    throw new Error(stryMutAct_9fa48("18188") ? errorData.error && 'Error al crear nota' : stryMutAct_9fa48("18187") ? false : stryMutAct_9fa48("18186") ? true : (stryCov_9fa48("18186", "18187", "18188"), errorData.error || (stryMutAct_9fa48("18189") ? "" : (stryCov_9fa48("18189"), 'Error al crear nota'))));
                  }
                }
                toast.success(stryMutAct_9fa48("18190") ? "" : (stryCov_9fa48("18190"), 'Nota creada correctamente'));
              }
            }
            onOpenChange(stryMutAct_9fa48("18191") ? true : (stryCov_9fa48("18191"), false));
            if (stryMutAct_9fa48("18193") ? false : stryMutAct_9fa48("18192") ? true : (stryCov_9fa48("18192", "18193"), onSuccess)) onSuccess();
          }
        } catch (error) {
          if (stryMutAct_9fa48("18194")) {
            {}
          } else {
            stryCov_9fa48("18194");
            const errorInfo = extractErrorInfo(error);
            const errorCode = noteId ? ERROR_CODES.DATA_UPDATE_FAILED : ERROR_CODES.DATA_CREATE_FAILED;
            const structuredError = getErrorMessage(errorCode, stryMutAct_9fa48("18195") ? {} : (stryCov_9fa48("18195"), {
              item: stryMutAct_9fa48("18196") ? "" : (stryCov_9fa48("18196"), 'la nota'),
              reason: errorInfo.message
            }));
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("18197") ? {} : (stryCov_9fa48("18197"), {
              type: stryMutAct_9fa48("18198") ? "" : (stryCov_9fa48("18198"), 'note_error'),
              action: noteId ? stryMutAct_9fa48("18199") ? "" : (stryCov_9fa48("18199"), 'update') : stryMutAct_9fa48("18200") ? "" : (stryCov_9fa48("18200"), 'create'),
              noteId
            }));
            toast.error(structuredError.title, stryMutAct_9fa48("18201") ? {} : (stryCov_9fa48("18201"), {
              description: stryMutAct_9fa48("18202") ? `` : (stryCov_9fa48("18202"), `${structuredError.description} ${structuredError.solution}`),
              duration: 6000
            }));
          }
        } finally {
          if (stryMutAct_9fa48("18203")) {
            {}
          } else {
            stryCov_9fa48("18203");
            setIsLoading(stryMutAct_9fa48("18204") ? true : (stryCov_9fa48("18204"), false));
          }
        }
      }
    };
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{noteId ? stryMutAct_9fa48("18205") ? "" : (stryCov_9fa48("18205"), 'Editar Nota') : stryMutAct_9fa48("18206") ? "" : (stryCov_9fa48("18206"), 'Nueva Nota')}</DialogTitle>
              <DialogDescription>
                {noteId ? stryMutAct_9fa48("18207") ? "" : (stryCov_9fa48("18207"), 'Modifica tu nota de estudio') : stryMutAct_9fa48("18208") ? "" : (stryCov_9fa48("18208"), 'Crea una nota personal para recordar conceptos importantes')}
              </DialogDescription>
            </div>
            <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={stryMutAct_9fa48("18209") ? () => undefined : (stryCov_9fa48("18209"), e => handleTitleChange(e.target.value))} placeholder="Ej: Fórmula importante de matemáticas" className={titleError ? stryMutAct_9fa48("18210") ? "" : (stryCov_9fa48("18210"), 'border-destructive') : stryMutAct_9fa48("18211") ? "Stryker was here!" : (stryCov_9fa48("18211"), '')} />
            {stryMutAct_9fa48("18214") ? titleError || <p className="text-sm text-destructive">{titleError}</p> : stryMutAct_9fa48("18213") ? false : stryMutAct_9fa48("18212") ? true : (stryCov_9fa48("18212", "18213", "18214"), titleError && <p className="text-sm text-destructive">{titleError}</p>)}
            {stryMutAct_9fa48("18217") ? title && !titleError || <p className="text-xs text-muted-foreground">{title.length}/100 caracteres</p> : stryMutAct_9fa48("18216") ? false : stryMutAct_9fa48("18215") ? true : (stryCov_9fa48("18215", "18216", "18217"), (stryMutAct_9fa48("18219") ? title || !titleError : stryMutAct_9fa48("18218") ? true : (stryCov_9fa48("18218", "18219"), title && (stryMutAct_9fa48("18220") ? titleError : (stryCov_9fa48("18220"), !titleError)))) && <p className="text-xs text-muted-foreground">{title.length}/100 caracteres</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea id="content" value={content} onChange={stryMutAct_9fa48("18221") ? () => undefined : (stryCov_9fa48("18221"), e => handleContentChange(e.target.value))} placeholder="Escribe tus apuntes aquí..." rows={8} className={contentError ? stryMutAct_9fa48("18222") ? "" : (stryCov_9fa48("18222"), 'border-destructive') : stryMutAct_9fa48("18223") ? "Stryker was here!" : (stryCov_9fa48("18223"), '')} />
            {stryMutAct_9fa48("18226") ? contentError || <p className="text-sm text-destructive">{contentError}</p> : stryMutAct_9fa48("18225") ? false : stryMutAct_9fa48("18224") ? true : (stryCov_9fa48("18224", "18225", "18226"), contentError && <p className="text-sm text-destructive">{contentError}</p>)}
            {stryMutAct_9fa48("18229") ? content && !contentError || <p className="text-xs text-muted-foreground">{content.length}/5000 caracteres</p> : stryMutAct_9fa48("18228") ? false : stryMutAct_9fa48("18227") ? true : (stryCov_9fa48("18227", "18228", "18229"), (stryMutAct_9fa48("18231") ? content || !contentError : stryMutAct_9fa48("18230") ? true : (stryCov_9fa48("18230", "18231"), content && (stryMutAct_9fa48("18232") ? contentError : (stryCov_9fa48("18232"), !contentError)))) && <p className="text-xs text-muted-foreground">{content.length}/5000 caracteres</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separados por comas)</Label>
            <Input id="tags" value={tags} onChange={stryMutAct_9fa48("18233") ? () => undefined : (stryCov_9fa48("18233"), e => setTags(e.target.value))} placeholder="Ej: matemáticas, fórmulas, importante" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={stryMutAct_9fa48("18234") ? () => undefined : (stryCov_9fa48("18234"), () => onOpenChange(stryMutAct_9fa48("18235") ? true : (stryCov_9fa48("18235"), false)))}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {noteId ? stryMutAct_9fa48("18236") ? "" : (stryCov_9fa48("18236"), 'Actualizando...') : stryMutAct_9fa48("18237") ? "" : (stryCov_9fa48("18237"), 'Creando...')}
              </> : noteId ? stryMutAct_9fa48("18238") ? "" : (stryCov_9fa48("18238"), 'Actualizar') : stryMutAct_9fa48("18239") ? "" : (stryCov_9fa48("18239"), 'Crear')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  }
}