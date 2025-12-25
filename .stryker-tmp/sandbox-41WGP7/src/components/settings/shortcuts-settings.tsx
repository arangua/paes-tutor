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
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomizableShortcuts, ShortcutAction } from '@/hooks/useCustomizableShortcuts';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { RotateCcw, Keyboard, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface ShortcutsSettingsProps {
  availableActions: ShortcutAction[];
}

/**
 * Componente para configurar atajos de teclado personalizables
 * Basado en VS Code, GitHub, Linear
 */
export function ShortcutsSettings({
  availableActions
}: ShortcutsSettingsProps) {
  if (stryMutAct_9fa48("19602")) {
    {}
  } else {
    stryCov_9fa48("19602");
    const {
      customShortcuts,
      updateShortcut,
      resetToDefaults,
      getActiveShortcuts,
      isLoaded
    } = useCustomizableShortcuts(availableActions);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [capturing, setCapturing] = useState(stryMutAct_9fa48("19603") ? true : (stryCov_9fa48("19603"), false));
    const [capturedKeys, setCapturedKeys] = useState<{
      key: string;
      ctrl?: boolean;
      shift?: boolean;
      alt?: boolean;
      meta?: boolean;
    } | null>(null);

    // Registrar atajos activos
    const activeShortcuts = getActiveShortcuts();
    useKeyboardShortcuts(activeShortcuts);
    const handleStartCapture = (actionId: string) => {
      if (stryMutAct_9fa48("19604")) {
        {}
      } else {
        stryCov_9fa48("19604");
        setEditingId(actionId);
        setCapturing(stryMutAct_9fa48("19605") ? false : (stryCov_9fa48("19605"), true));
        setCapturedKeys(null);
      }
    };
    const handleKeyCapture = useCallback((e: KeyboardEvent) => {
      if (stryMutAct_9fa48("19606")) {
        {}
      } else {
        stryCov_9fa48("19606");
        if (stryMutAct_9fa48("19609") ? !capturing && !editingId : stryMutAct_9fa48("19608") ? false : stryMutAct_9fa48("19607") ? true : (stryCov_9fa48("19607", "19608", "19609"), (stryMutAct_9fa48("19610") ? capturing : (stryCov_9fa48("19610"), !capturing)) || (stryMutAct_9fa48("19611") ? editingId : (stryCov_9fa48("19611"), !editingId)))) return;
        e.preventDefault();
        e.stopPropagation();

        // Ignorar teclas especiales solas
        if (stryMutAct_9fa48("19613") ? false : stryMutAct_9fa48("19612") ? true : (stryCov_9fa48("19612", "19613"), (stryMutAct_9fa48("19614") ? [] : (stryCov_9fa48("19614"), [stryMutAct_9fa48("19615") ? "" : (stryCov_9fa48("19615"), 'Control'), stryMutAct_9fa48("19616") ? "" : (stryCov_9fa48("19616"), 'Shift'), stryMutAct_9fa48("19617") ? "" : (stryCov_9fa48("19617"), 'Alt'), stryMutAct_9fa48("19618") ? "" : (stryCov_9fa48("19618"), 'Meta'), stryMutAct_9fa48("19619") ? "" : (stryCov_9fa48("19619"), 'OS')])).includes(e.key))) {
          if (stryMutAct_9fa48("19620")) {
            {}
          } else {
            stryCov_9fa48("19620");
            return;
          }
        }
        setCapturedKeys(stryMutAct_9fa48("19621") ? {} : (stryCov_9fa48("19621"), {
          key: e.key,
          ctrl: stryMutAct_9fa48("19624") ? e.ctrlKey && e.metaKey : stryMutAct_9fa48("19623") ? false : stryMutAct_9fa48("19622") ? true : (stryCov_9fa48("19622", "19623", "19624"), e.ctrlKey || e.metaKey),
          shift: e.shiftKey,
          alt: e.altKey,
          meta: stryMutAct_9fa48("19627") ? e.metaKey || !e.ctrlKey : stryMutAct_9fa48("19626") ? false : stryMutAct_9fa48("19625") ? true : (stryCov_9fa48("19625", "19626", "19627"), e.metaKey && (stryMutAct_9fa48("19628") ? e.ctrlKey : (stryCov_9fa48("19628"), !e.ctrlKey)))
        }));
        setCapturing(stryMutAct_9fa48("19629") ? true : (stryCov_9fa48("19629"), false));
      }
    }, stryMutAct_9fa48("19630") ? [] : (stryCov_9fa48("19630"), [capturing, editingId]));
    useEffect(() => {
      if (stryMutAct_9fa48("19631")) {
        {}
      } else {
        stryCov_9fa48("19631");
        if (stryMutAct_9fa48("19633") ? false : stryMutAct_9fa48("19632") ? true : (stryCov_9fa48("19632", "19633"), capturing)) {
          if (stryMutAct_9fa48("19634")) {
            {}
          } else {
            stryCov_9fa48("19634");
            window.addEventListener(stryMutAct_9fa48("19635") ? "" : (stryCov_9fa48("19635"), 'keydown'), handleKeyCapture);
            return stryMutAct_9fa48("19636") ? () => undefined : (stryCov_9fa48("19636"), () => window.removeEventListener(stryMutAct_9fa48("19637") ? "" : (stryCov_9fa48("19637"), 'keydown'), handleKeyCapture));
          }
        }
      }
    }, stryMutAct_9fa48("19638") ? [] : (stryCov_9fa48("19638"), [capturing, handleKeyCapture]));
    const handleSaveShortcut = (actionId: string) => {
      if (stryMutAct_9fa48("19639")) {
        {}
      } else {
        stryCov_9fa48("19639");
        if (stryMutAct_9fa48("19642") ? false : stryMutAct_9fa48("19641") ? true : stryMutAct_9fa48("19640") ? capturedKeys : (stryCov_9fa48("19640", "19641", "19642"), !capturedKeys)) {
          if (stryMutAct_9fa48("19643")) {
            {}
          } else {
            stryCov_9fa48("19643");
            setEditingId(null);
            return;
          }
        }

        // Verificar si el atajo ya está en uso
        const isInUse = stryMutAct_9fa48("19644") ? Object.values(customShortcuts).every(s => s.id !== actionId && s.enabled && s.key === capturedKeys.key && s.ctrl === capturedKeys.ctrl && s.shift === capturedKeys.shift && s.alt === capturedKeys.alt) : (stryCov_9fa48("19644"), Object.values(customShortcuts).some(stryMutAct_9fa48("19645") ? () => undefined : (stryCov_9fa48("19645"), s => stryMutAct_9fa48("19648") ? s.id !== actionId && s.enabled && s.key === capturedKeys.key && s.ctrl === capturedKeys.ctrl && s.shift === capturedKeys.shift || s.alt === capturedKeys.alt : stryMutAct_9fa48("19647") ? false : stryMutAct_9fa48("19646") ? true : (stryCov_9fa48("19646", "19647", "19648"), (stryMutAct_9fa48("19650") ? s.id !== actionId && s.enabled && s.key === capturedKeys.key && s.ctrl === capturedKeys.ctrl || s.shift === capturedKeys.shift : stryMutAct_9fa48("19649") ? true : (stryCov_9fa48("19649", "19650"), (stryMutAct_9fa48("19652") ? s.id !== actionId && s.enabled && s.key === capturedKeys.key || s.ctrl === capturedKeys.ctrl : stryMutAct_9fa48("19651") ? true : (stryCov_9fa48("19651", "19652"), (stryMutAct_9fa48("19654") ? s.id !== actionId && s.enabled || s.key === capturedKeys.key : stryMutAct_9fa48("19653") ? true : (stryCov_9fa48("19653", "19654"), (stryMutAct_9fa48("19656") ? s.id !== actionId || s.enabled : stryMutAct_9fa48("19655") ? true : (stryCov_9fa48("19655", "19656"), (stryMutAct_9fa48("19658") ? s.id === actionId : stryMutAct_9fa48("19657") ? true : (stryCov_9fa48("19657", "19658"), s.id !== actionId)) && s.enabled)) && (stryMutAct_9fa48("19660") ? s.key !== capturedKeys.key : stryMutAct_9fa48("19659") ? true : (stryCov_9fa48("19659", "19660"), s.key === capturedKeys.key)))) && (stryMutAct_9fa48("19662") ? s.ctrl !== capturedKeys.ctrl : stryMutAct_9fa48("19661") ? true : (stryCov_9fa48("19661", "19662"), s.ctrl === capturedKeys.ctrl)))) && (stryMutAct_9fa48("19664") ? s.shift !== capturedKeys.shift : stryMutAct_9fa48("19663") ? true : (stryCov_9fa48("19663", "19664"), s.shift === capturedKeys.shift)))) && (stryMutAct_9fa48("19666") ? s.alt !== capturedKeys.alt : stryMutAct_9fa48("19665") ? true : (stryCov_9fa48("19665", "19666"), s.alt === capturedKeys.alt))))));
        if (stryMutAct_9fa48("19668") ? false : stryMutAct_9fa48("19667") ? true : (stryCov_9fa48("19667", "19668"), isInUse)) {
          if (stryMutAct_9fa48("19669")) {
            {}
          } else {
            stryCov_9fa48("19669");
            toast.error(stryMutAct_9fa48("19670") ? "" : (stryCov_9fa48("19670"), 'Este atajo ya está en uso'), stryMutAct_9fa48("19671") ? {} : (stryCov_9fa48("19671"), {
              description: stryMutAct_9fa48("19672") ? "" : (stryCov_9fa48("19672"), 'Por favor, elige otro atajo o deshabilita el existente.')
            }));
            return;
          }
        }
        updateShortcut(actionId, stryMutAct_9fa48("19673") ? {} : (stryCov_9fa48("19673"), {
          key: capturedKeys.key,
          ctrl: capturedKeys.ctrl,
          shift: capturedKeys.shift,
          alt: capturedKeys.alt,
          meta: capturedKeys.meta
        }));
        setEditingId(null);
        setCapturedKeys(null);
        toast.success(stryMutAct_9fa48("19674") ? "" : (stryCov_9fa48("19674"), 'Atajo guardado correctamente'));
      }
    };
    const handleCancelEdit = () => {
      if (stryMutAct_9fa48("19675")) {
        {}
      } else {
        stryCov_9fa48("19675");
        setEditingId(null);
        setCapturing(stryMutAct_9fa48("19676") ? true : (stryCov_9fa48("19676"), false));
        setCapturedKeys(null);
      }
    };
    const formatShortcut = (shortcut: ReturnType<typeof useCustomizableShortcuts>['customShortcuts'][string]) => {
      if (stryMutAct_9fa48("19677")) {
        {}
      } else {
        stryCov_9fa48("19677");
        if (stryMutAct_9fa48("19680") ? false : stryMutAct_9fa48("19679") ? true : stryMutAct_9fa48("19678") ? shortcut.key : (stryCov_9fa48("19678", "19679", "19680"), !shortcut.key)) return stryMutAct_9fa48("19681") ? "" : (stryCov_9fa48("19681"), 'No asignado');
        const parts: string[] = stryMutAct_9fa48("19682") ? ["Stryker was here"] : (stryCov_9fa48("19682"), []);
        if (stryMutAct_9fa48("19685") ? shortcut.ctrl && shortcut.meta : stryMutAct_9fa48("19684") ? false : stryMutAct_9fa48("19683") ? true : (stryCov_9fa48("19683", "19684", "19685"), shortcut.ctrl || shortcut.meta)) parts.push(shortcut.meta ? stryMutAct_9fa48("19686") ? "" : (stryCov_9fa48("19686"), 'Cmd') : stryMutAct_9fa48("19687") ? "" : (stryCov_9fa48("19687"), 'Ctrl'));
        if (stryMutAct_9fa48("19689") ? false : stryMutAct_9fa48("19688") ? true : (stryCov_9fa48("19688", "19689"), shortcut.alt)) parts.push(stryMutAct_9fa48("19690") ? "" : (stryCov_9fa48("19690"), 'Alt'));
        if (stryMutAct_9fa48("19692") ? false : stryMutAct_9fa48("19691") ? true : (stryCov_9fa48("19691", "19692"), shortcut.shift)) parts.push(stryMutAct_9fa48("19693") ? "" : (stryCov_9fa48("19693"), 'Shift'));
        parts.push(stryMutAct_9fa48("19694") ? shortcut.key.toLowerCase() : (stryCov_9fa48("19694"), shortcut.key.toUpperCase()));
        return parts.join(stryMutAct_9fa48("19695") ? "" : (stryCov_9fa48("19695"), ' + '));
      }
    };

    // Agrupar por categoría
    const groupedActions = availableActions.reduce((acc, action) => {
      if (stryMutAct_9fa48("19696")) {
        {}
      } else {
        stryCov_9fa48("19696");
        if (stryMutAct_9fa48("19699") ? false : stryMutAct_9fa48("19698") ? true : stryMutAct_9fa48("19697") ? acc[action.category] : (stryCov_9fa48("19697", "19698", "19699"), !acc[action.category])) {
          if (stryMutAct_9fa48("19700")) {
            {}
          } else {
            stryCov_9fa48("19700");
            acc[action.category] = stryMutAct_9fa48("19701") ? ["Stryker was here"] : (stryCov_9fa48("19701"), []);
          }
        }
        acc[action.category].push(action);
        return acc;
      }
    }, {} as Record<string, typeof availableActions>);
    if (stryMutAct_9fa48("19704") ? false : stryMutAct_9fa48("19703") ? true : stryMutAct_9fa48("19702") ? isLoaded : (stryCov_9fa48("19702", "19703", "19704"), !isLoaded)) {
      if (stryMutAct_9fa48("19705")) {
        {}
      } else {
        stryCov_9fa48("19705");
        return <div className="text-center py-8">Cargando configuración...</div>;
      }
    }
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Atajos de Teclado Personalizables
            </CardTitle>
            <CardDescription className="mt-2">
              Personaliza los atajos de teclado según tus preferencias. Haz clic en un atajo para
              editarlo.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(groupedActions)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(groupedActions).map(stryMutAct_9fa48("19706") ? () => undefined : (stryCov_9fa48("19706"), category => <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>))}
          </TabsList>

          {Object.entries(groupedActions).map(stryMutAct_9fa48("19707") ? () => undefined : (stryCov_9fa48("19707"), ([category, actions]) => <TabsContent key={category} value={category} className="space-y-4 mt-4">
              {actions.map(action => {
              if (stryMutAct_9fa48("19708")) {
                {}
              } else {
                stryCov_9fa48("19708");
                const shortcut = customShortcuts[action.id];
                const isEditing = stryMutAct_9fa48("19711") ? editingId !== action.id : stryMutAct_9fa48("19710") ? false : stryMutAct_9fa48("19709") ? true : (stryCov_9fa48("19709", "19710", "19711"), editingId === action.id);
                return <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label className="font-semibold">{action.name}</Label>
                        {stryMutAct_9fa48("19714") ? shortcut?.enabled && shortcut.key || <Badge variant="secondary" className="text-xs">
                            {formatShortcut(shortcut)}
                          </Badge> : stryMutAct_9fa48("19713") ? false : stryMutAct_9fa48("19712") ? true : (stryCov_9fa48("19712", "19713", "19714"), (stryMutAct_9fa48("19716") ? shortcut?.enabled || shortcut.key : stryMutAct_9fa48("19715") ? true : (stryCov_9fa48("19715", "19716"), (stryMutAct_9fa48("19717") ? shortcut.enabled : (stryCov_9fa48("19717"), shortcut?.enabled)) && shortcut.key)) && <Badge variant="secondary" className="text-xs">
                            {formatShortcut(shortcut)}
                          </Badge>)}
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={stryMutAct_9fa48("19718") ? shortcut?.enabled && true : (stryCov_9fa48("19718"), (stryMutAct_9fa48("19719") ? shortcut.enabled : (stryCov_9fa48("19719"), shortcut?.enabled)) ?? (stryMutAct_9fa48("19720") ? false : (stryCov_9fa48("19720"), true)))} onCheckedChange={stryMutAct_9fa48("19721") ? () => undefined : (stryCov_9fa48("19721"), enabled => updateShortcut(action.id, stryMutAct_9fa48("19722") ? {} : (stryCov_9fa48("19722"), {
                      enabled
                    })))} />

                      {isEditing ? <div className="flex items-center gap-2">
                          {capturing ? <span className="text-sm text-muted-foreground animate-pulse">
                              Presiona las teclas...
                            </span> : capturedKeys ? <span className="text-sm font-mono">
                              {formatShortcut(stryMutAct_9fa48("19723") ? {} : (stryCov_9fa48("19723"), {
                          ...shortcut,
                          key: capturedKeys.key,
                          ctrl: capturedKeys.ctrl,
                          shift: capturedKeys.shift,
                          alt: capturedKeys.alt,
                          meta: capturedKeys.meta
                        }))}
                            </span> : null}
                          <Button size="sm" onClick={stryMutAct_9fa48("19724") ? () => undefined : (stryCov_9fa48("19724"), () => handleSaveShortcut(action.id))}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                        </div> : <Button size="sm" variant="outline" onClick={stryMutAct_9fa48("19725") ? () => undefined : (stryCov_9fa48("19725"), () => handleStartCapture(action.id))} disabled={stryMutAct_9fa48("19726") ? shortcut?.enabled : (stryCov_9fa48("19726"), !(stryMutAct_9fa48("19727") ? shortcut.enabled : (stryCov_9fa48("19727"), shortcut?.enabled)))}>
                          {(stryMutAct_9fa48("19728") ? shortcut.key : (stryCov_9fa48("19728"), shortcut?.key)) ? stryMutAct_9fa48("19729") ? "" : (stryCov_9fa48("19729"), 'Editar') : stryMutAct_9fa48("19730") ? "" : (stryCov_9fa48("19730"), 'Asignar')}
                        </Button>}
                    </div>
                  </div>;
              }
            })}
            </TabsContent>))}
        </Tabs>

        {/* Dialog para capturar teclas */}
        {stryMutAct_9fa48("19733") ? capturing || <Dialog open={capturing} onOpenChange={() => handleCancelEdit()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Capturar Atajo</DialogTitle>
                <DialogDescription>
                  Presiona la combinación de teclas que deseas usar para esta acción.
                </DialogDescription>
              </DialogHeader>
              <div className="py-8 text-center">
                <Keyboard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Presiona las teclas...</p>
                <p className="text-sm text-muted-foreground">
                  La combinación se capturará automáticamente
                </p>
              </div>
            </DialogContent>
          </Dialog> : stryMutAct_9fa48("19732") ? false : stryMutAct_9fa48("19731") ? true : (stryCov_9fa48("19731", "19732", "19733"), capturing && <Dialog open={capturing} onOpenChange={stryMutAct_9fa48("19734") ? () => undefined : (stryCov_9fa48("19734"), () => handleCancelEdit())}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Capturar Atajo</DialogTitle>
                <DialogDescription>
                  Presiona la combinación de teclas que deseas usar para esta acción.
                </DialogDescription>
              </DialogHeader>
              <div className="py-8 text-center">
                <Keyboard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Presiona las teclas...</p>
                <p className="text-sm text-muted-foreground">
                  La combinación se capturará automáticamente
                </p>
              </div>
            </DialogContent>
          </Dialog>)}
      </CardContent>
    </Card>;
  }
}