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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Keyboard, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
const EXPERT_MODE_KEY = stryMutAct_9fa48("19517") ? "" : (stryCov_9fa48("19517"), 'paes-tutor-expert-mode');
interface ExpertModeSettings {
  enabled: boolean;
  showAllShortcuts: boolean;
  compactView: boolean;
  advancedFeatures: boolean;
  quickActions: boolean;
}

/**
 * Componente de configuración de modo experto
 * Basado en estándares de VS Code, GitHub, Linear
 */
export function ExpertMode() {
  if (stryMutAct_9fa48("19518")) {
    {}
  } else {
    stryCov_9fa48("19518");
    const [settings, setSettings] = useState<ExpertModeSettings>(stryMutAct_9fa48("19519") ? {} : (stryCov_9fa48("19519"), {
      enabled: stryMutAct_9fa48("19520") ? true : (stryCov_9fa48("19520"), false),
      showAllShortcuts: stryMutAct_9fa48("19521") ? true : (stryCov_9fa48("19521"), false),
      compactView: stryMutAct_9fa48("19522") ? true : (stryCov_9fa48("19522"), false),
      advancedFeatures: stryMutAct_9fa48("19523") ? true : (stryCov_9fa48("19523"), false),
      quickActions: stryMutAct_9fa48("19524") ? true : (stryCov_9fa48("19524"), false)
    }));

    // Cargar configuración
    useEffect(() => {
      if (stryMutAct_9fa48("19525")) {
        {}
      } else {
        stryCov_9fa48("19525");
        if (stryMutAct_9fa48("19528") ? typeof window !== 'undefined' : stryMutAct_9fa48("19527") ? false : stryMutAct_9fa48("19526") ? true : (stryCov_9fa48("19526", "19527", "19528"), typeof window === (stryMutAct_9fa48("19529") ? "" : (stryCov_9fa48("19529"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("19530")) {
            {}
          } else {
            stryCov_9fa48("19530");
            const saved = localStorage.getItem(EXPERT_MODE_KEY);
            if (stryMutAct_9fa48("19532") ? false : stryMutAct_9fa48("19531") ? true : (stryCov_9fa48("19531", "19532"), saved)) {
              if (stryMutAct_9fa48("19533")) {
                {}
              } else {
                stryCov_9fa48("19533");
                setSettings(JSON.parse(saved));
              }
            }
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("19534") ? ["Stryker was here"] : (stryCov_9fa48("19534"), []));

    // Guardar configuración
    const saveSettings = (newSettings: ExpertModeSettings) => {
      if (stryMutAct_9fa48("19535")) {
        {}
      } else {
        stryCov_9fa48("19535");
        setSettings(newSettings);
        if (stryMutAct_9fa48("19538") ? typeof window === 'undefined' : stryMutAct_9fa48("19537") ? false : stryMutAct_9fa48("19536") ? true : (stryCov_9fa48("19536", "19537", "19538"), typeof window !== (stryMutAct_9fa48("19539") ? "" : (stryCov_9fa48("19539"), 'undefined')))) {
          if (stryMutAct_9fa48("19540")) {
            {}
          } else {
            stryCov_9fa48("19540");
            try {
              if (stryMutAct_9fa48("19541")) {
                {}
              } else {
                stryCov_9fa48("19541");
                localStorage.setItem(EXPERT_MODE_KEY, JSON.stringify(newSettings));
                toast.success(stryMutAct_9fa48("19542") ? "" : (stryCov_9fa48("19542"), 'Configuración guardada'));
              }
            } catch {
              if (stryMutAct_9fa48("19543")) {
                {}
              } else {
                stryCov_9fa48("19543");
                toast.error(stryMutAct_9fa48("19544") ? "" : (stryCov_9fa48("19544"), 'Error al guardar configuración'));
              }
            }
          }
        }
      }
    };
    const toggleSetting = (key: keyof ExpertModeSettings) => {
      if (stryMutAct_9fa48("19545")) {
        {}
      } else {
        stryCov_9fa48("19545");
        const newSettings = stryMutAct_9fa48("19546") ? {} : (stryCov_9fa48("19546"), {
          ...settings,
          [key]: stryMutAct_9fa48("19547") ? settings[key] : (stryCov_9fa48("19547"), !settings[key])
        });
        // Si se desactiva el modo experto, desactivar todas las opciones
        if (stryMutAct_9fa48("19550") ? key === 'enabled' || !newSettings.enabled : stryMutAct_9fa48("19549") ? false : stryMutAct_9fa48("19548") ? true : (stryCov_9fa48("19548", "19549", "19550"), (stryMutAct_9fa48("19552") ? key !== 'enabled' : stryMutAct_9fa48("19551") ? true : (stryCov_9fa48("19551", "19552"), key === (stryMutAct_9fa48("19553") ? "" : (stryCov_9fa48("19553"), 'enabled')))) && (stryMutAct_9fa48("19554") ? newSettings.enabled : (stryCov_9fa48("19554"), !newSettings.enabled)))) {
          if (stryMutAct_9fa48("19555")) {
            {}
          } else {
            stryCov_9fa48("19555");
            newSettings.showAllShortcuts = stryMutAct_9fa48("19556") ? true : (stryCov_9fa48("19556"), false);
            newSettings.compactView = stryMutAct_9fa48("19557") ? true : (stryCov_9fa48("19557"), false);
            newSettings.advancedFeatures = stryMutAct_9fa48("19558") ? true : (stryCov_9fa48("19558"), false);
            newSettings.quickActions = stryMutAct_9fa48("19559") ? true : (stryCov_9fa48("19559"), false);
          }
        }
        saveSettings(newSettings);
      }
    };
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Modo Experto</CardTitle>
              <CardDescription>
                Activa funciones avanzadas para usuarios experimentados
              </CardDescription>
            </div>
          </div>
          <Badge variant={settings.enabled ? stryMutAct_9fa48("19560") ? "" : (stryCov_9fa48("19560"), 'default') : stryMutAct_9fa48("19561") ? "" : (stryCov_9fa48("19561"), 'outline')}>
            {settings.enabled ? stryMutAct_9fa48("19562") ? "" : (stryCov_9fa48("19562"), 'Activado') : stryMutAct_9fa48("19563") ? "" : (stryCov_9fa48("19563"), 'Desactivado')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle principal */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <Label htmlFor="expert-mode" className="text-base font-semibold cursor-pointer">
                Activar Modo Experto
              </Label>
              <p className="text-sm text-muted-foreground">
                Desbloquea funciones avanzadas y atajos adicionales
              </p>
            </div>
          </div>
          <Switch id="expert-mode" checked={settings.enabled} onCheckedChange={stryMutAct_9fa48("19564") ? () => undefined : (stryCov_9fa48("19564"), () => toggleSetting(stryMutAct_9fa48("19565") ? "" : (stryCov_9fa48("19565"), 'enabled')))} />
        </div>

        {stryMutAct_9fa48("19568") ? settings.enabled || <div className="space-y-4 pt-4 border-t">
            {/* Mostrar todos los atajos */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="show-shortcuts" className="cursor-pointer">
                    Mostrar todos los atajos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Muestra atajos avanzados en tooltips y ayuda
                  </p>
                </div>
              </div>
              <Switch id="show-shortcuts" checked={settings.showAllShortcuts} onCheckedChange={() => toggleSetting('showAllShortcuts')} />
            </div>

            {/* Vista compacta */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="compact-view" className="cursor-pointer">
                    Vista compacta
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce espaciado para mostrar más información
                  </p>
                </div>
              </div>
              <Switch id="compact-view" checked={settings.compactView} onCheckedChange={() => toggleSetting('compactView')} />
            </div>

            {/* Funciones avanzadas */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="advanced-features" className="cursor-pointer">
                    Funciones avanzadas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Habilita opciones experimentales y avanzadas
                  </p>
                </div>
              </div>
              <Switch id="advanced-features" checked={settings.advancedFeatures} onCheckedChange={() => toggleSetting('advancedFeatures')} />
            </div>

            {/* Acciones rápidas */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="quick-actions" className="cursor-pointer">
                    Acciones rápidas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Muestra botones de acción rápida en más lugares
                  </p>
                </div>
              </div>
              <Switch id="quick-actions" checked={settings.quickActions} onCheckedChange={() => toggleSetting('quickActions')} />
            </div>
          </div> : stryMutAct_9fa48("19567") ? false : stryMutAct_9fa48("19566") ? true : (stryCov_9fa48("19566", "19567", "19568"), settings.enabled && <div className="space-y-4 pt-4 border-t">
            {/* Mostrar todos los atajos */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="show-shortcuts" className="cursor-pointer">
                    Mostrar todos los atajos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Muestra atajos avanzados en tooltips y ayuda
                  </p>
                </div>
              </div>
              <Switch id="show-shortcuts" checked={settings.showAllShortcuts} onCheckedChange={stryMutAct_9fa48("19569") ? () => undefined : (stryCov_9fa48("19569"), () => toggleSetting(stryMutAct_9fa48("19570") ? "" : (stryCov_9fa48("19570"), 'showAllShortcuts')))} />
            </div>

            {/* Vista compacta */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="compact-view" className="cursor-pointer">
                    Vista compacta
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce espaciado para mostrar más información
                  </p>
                </div>
              </div>
              <Switch id="compact-view" checked={settings.compactView} onCheckedChange={stryMutAct_9fa48("19571") ? () => undefined : (stryCov_9fa48("19571"), () => toggleSetting(stryMutAct_9fa48("19572") ? "" : (stryCov_9fa48("19572"), 'compactView')))} />
            </div>

            {/* Funciones avanzadas */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="advanced-features" className="cursor-pointer">
                    Funciones avanzadas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Habilita opciones experimentales y avanzadas
                  </p>
                </div>
              </div>
              <Switch id="advanced-features" checked={settings.advancedFeatures} onCheckedChange={stryMutAct_9fa48("19573") ? () => undefined : (stryCov_9fa48("19573"), () => toggleSetting(stryMutAct_9fa48("19574") ? "" : (stryCov_9fa48("19574"), 'advancedFeatures')))} />
            </div>

            {/* Acciones rápidas */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="quick-actions" className="cursor-pointer">
                    Acciones rápidas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Muestra botones de acción rápida en más lugares
                  </p>
                </div>
              </div>
              <Switch id="quick-actions" checked={settings.quickActions} onCheckedChange={stryMutAct_9fa48("19575") ? () => undefined : (stryCov_9fa48("19575"), () => toggleSetting(stryMutAct_9fa48("19576") ? "" : (stryCov_9fa48("19576"), 'quickActions')))} />
            </div>
          </div>)}

        {/* Información */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <p className="text-sm text-muted-foreground">
            El modo experto está diseñado para usuarios que conocen bien la plataforma. Algunas
            funciones pueden requerir conocimiento técnico adicional.
          </p>
        </div>
      </CardContent>
    </Card>;
  }
}

/**
 * Hook para usar configuración de modo experto
 */
export function useExpertMode() {
  if (stryMutAct_9fa48("19577")) {
    {}
  } else {
    stryCov_9fa48("19577");
    const [settings, setSettings] = useState<ExpertModeSettings | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("19578")) {
        {}
      } else {
        stryCov_9fa48("19578");
        if (stryMutAct_9fa48("19581") ? typeof window !== 'undefined' : stryMutAct_9fa48("19580") ? false : stryMutAct_9fa48("19579") ? true : (stryCov_9fa48("19579", "19580", "19581"), typeof window === (stryMutAct_9fa48("19582") ? "" : (stryCov_9fa48("19582"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("19583")) {
            {}
          } else {
            stryCov_9fa48("19583");
            const saved = localStorage.getItem(EXPERT_MODE_KEY);
            if (stryMutAct_9fa48("19585") ? false : stryMutAct_9fa48("19584") ? true : (stryCov_9fa48("19584", "19585"), saved)) {
              if (stryMutAct_9fa48("19586")) {
                {}
              } else {
                stryCov_9fa48("19586");
                setSettings(JSON.parse(saved));
              }
            } else {
              if (stryMutAct_9fa48("19587")) {
                {}
              } else {
                stryCov_9fa48("19587");
                setSettings(stryMutAct_9fa48("19588") ? {} : (stryCov_9fa48("19588"), {
                  enabled: stryMutAct_9fa48("19589") ? true : (stryCov_9fa48("19589"), false),
                  showAllShortcuts: stryMutAct_9fa48("19590") ? true : (stryCov_9fa48("19590"), false),
                  compactView: stryMutAct_9fa48("19591") ? true : (stryCov_9fa48("19591"), false),
                  advancedFeatures: stryMutAct_9fa48("19592") ? true : (stryCov_9fa48("19592"), false),
                  quickActions: stryMutAct_9fa48("19593") ? true : (stryCov_9fa48("19593"), false)
                }));
              }
            }
          }
        } catch {
          if (stryMutAct_9fa48("19594")) {
            {}
          } else {
            stryCov_9fa48("19594");
            setSettings(stryMutAct_9fa48("19595") ? {} : (stryCov_9fa48("19595"), {
              enabled: stryMutAct_9fa48("19596") ? true : (stryCov_9fa48("19596"), false),
              showAllShortcuts: stryMutAct_9fa48("19597") ? true : (stryCov_9fa48("19597"), false),
              compactView: stryMutAct_9fa48("19598") ? true : (stryCov_9fa48("19598"), false),
              advancedFeatures: stryMutAct_9fa48("19599") ? true : (stryCov_9fa48("19599"), false),
              quickActions: stryMutAct_9fa48("19600") ? true : (stryCov_9fa48("19600"), false)
            }));
          }
        }
      }
    }, stryMutAct_9fa48("19601") ? ["Stryker was here"] : (stryCov_9fa48("19601"), []));
    return settings;
  }
}