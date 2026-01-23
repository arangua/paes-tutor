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
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Bot, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { HelpIcon } from '@/components/help/help-icon';
import { TIME_CONSTANTS } from '@/lib/constants';
interface AIKeysData {
  openaiApiKey: string;
  anthropicApiKey: string;
  geminiApiKey: string;
  preferredAIService: string | null;
  hasOpenAI: boolean;
  hasAnthropic: boolean;
  hasGemini: boolean;
}
export function AIKeysForm() {
  if (stryMutAct_9fa48("18410")) {
    {}
  } else {
    stryCov_9fa48("18410");
    const [loading, setLoading] = useState(stryMutAct_9fa48("18411") ? true : (stryCov_9fa48("18411"), false));
    const [loadingData, setLoadingData] = useState(stryMutAct_9fa48("18412") ? false : (stryCov_9fa48("18412"), true));
    const [saved, setSaved] = useState(stryMutAct_9fa48("18413") ? true : (stryCov_9fa48("18413"), false));
    const [error, setError] = useState<string | null>(null);
    const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Limpiar timeout al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("18414")) {
        {}
      } else {
        stryCov_9fa48("18414");
        return () => {
          if (stryMutAct_9fa48("18415")) {
            {}
          } else {
            stryCov_9fa48("18415");
            if (stryMutAct_9fa48("18417") ? false : stryMutAct_9fa48("18416") ? true : (stryCov_9fa48("18416", "18417"), savedTimeoutRef.current)) {
              if (stryMutAct_9fa48("18418")) {
                {}
              } else {
                stryCov_9fa48("18418");
                clearTimeout(savedTimeoutRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("18419") ? ["Stryker was here"] : (stryCov_9fa48("18419"), []));
    const [showKeys, setShowKeys] = useState(stryMutAct_9fa48("18420") ? {} : (stryCov_9fa48("18420"), {
      openai: stryMutAct_9fa48("18421") ? true : (stryCov_9fa48("18421"), false),
      anthropic: stryMutAct_9fa48("18422") ? true : (stryCov_9fa48("18422"), false),
      gemini: stryMutAct_9fa48("18423") ? true : (stryCov_9fa48("18423"), false)
    }));
    const [formData, setFormData] = useState<AIKeysData>(stryMutAct_9fa48("18424") ? {} : (stryCov_9fa48("18424"), {
      openaiApiKey: stryMutAct_9fa48("18425") ? "Stryker was here!" : (stryCov_9fa48("18425"), ''),
      anthropicApiKey: stryMutAct_9fa48("18426") ? "Stryker was here!" : (stryCov_9fa48("18426"), ''),
      geminiApiKey: stryMutAct_9fa48("18427") ? "Stryker was here!" : (stryCov_9fa48("18427"), ''),
      preferredAIService: null,
      hasOpenAI: stryMutAct_9fa48("18428") ? true : (stryCov_9fa48("18428"), false),
      hasAnthropic: stryMutAct_9fa48("18429") ? true : (stryCov_9fa48("18429"), false),
      hasGemini: stryMutAct_9fa48("18430") ? true : (stryCov_9fa48("18430"), false)
    }));
    useEffect(() => {
      if (stryMutAct_9fa48("18431")) {
        {}
      } else {
        stryCov_9fa48("18431");
        loadKeys();
      }
    }, stryMutAct_9fa48("18432") ? ["Stryker was here"] : (stryCov_9fa48("18432"), []));
    const loadKeys = async () => {
      if (stryMutAct_9fa48("18433")) {
        {}
      } else {
        stryCov_9fa48("18433");
        try {
          if (stryMutAct_9fa48("18434")) {
            {}
          } else {
            stryCov_9fa48("18434");
            setLoadingData(stryMutAct_9fa48("18435") ? false : (stryCov_9fa48("18435"), true));
            const res = await fetch(stryMutAct_9fa48("18436") ? "" : (stryCov_9fa48("18436"), '/api/user/ai-keys'));
            if (stryMutAct_9fa48("18439") ? false : stryMutAct_9fa48("18438") ? true : stryMutAct_9fa48("18437") ? res.ok : (stryCov_9fa48("18437", "18438", "18439"), !res.ok)) {
              if (stryMutAct_9fa48("18440")) {
                {}
              } else {
                stryCov_9fa48("18440");
                throw new Error(stryMutAct_9fa48("18441") ? "" : (stryCov_9fa48("18441"), 'Error al cargar configuración'));
              }
            }
            const data = await res.json();
            setFormData(data);
          }
        } catch (err) {
          if (stryMutAct_9fa48("18442")) {
            {}
          } else {
            stryCov_9fa48("18442");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("18443") ? "" : (stryCov_9fa48("18443"), 'Error desconocido'));
          }
        } finally {
          if (stryMutAct_9fa48("18444")) {
            {}
          } else {
            stryCov_9fa48("18444");
            setLoadingData(stryMutAct_9fa48("18445") ? true : (stryCov_9fa48("18445"), false));
          }
        }
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("18446")) {
        {}
      } else {
        stryCov_9fa48("18446");
        e.preventDefault();
        setLoading(stryMutAct_9fa48("18447") ? false : (stryCov_9fa48("18447"), true));
        setError(null);
        setSaved(stryMutAct_9fa48("18448") ? true : (stryCov_9fa48("18448"), false));
        try {
          if (stryMutAct_9fa48("18449")) {
            {}
          } else {
            stryCov_9fa48("18449");
            const res = await fetch(stryMutAct_9fa48("18450") ? "" : (stryCov_9fa48("18450"), '/api/user/ai-keys'), stryMutAct_9fa48("18451") ? {} : (stryCov_9fa48("18451"), {
              method: stryMutAct_9fa48("18452") ? "" : (stryCov_9fa48("18452"), 'POST'),
              headers: stryMutAct_9fa48("18453") ? {} : (stryCov_9fa48("18453"), {
                'Content-Type': stryMutAct_9fa48("18454") ? "" : (stryCov_9fa48("18454"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("18455") ? {} : (stryCov_9fa48("18455"), {
                openaiApiKey: stryMutAct_9fa48("18458") ? formData.openaiApiKey && null : stryMutAct_9fa48("18457") ? false : stryMutAct_9fa48("18456") ? true : (stryCov_9fa48("18456", "18457", "18458"), formData.openaiApiKey || null),
                anthropicApiKey: stryMutAct_9fa48("18461") ? formData.anthropicApiKey && null : stryMutAct_9fa48("18460") ? false : stryMutAct_9fa48("18459") ? true : (stryCov_9fa48("18459", "18460", "18461"), formData.anthropicApiKey || null),
                geminiApiKey: stryMutAct_9fa48("18464") ? formData.geminiApiKey && null : stryMutAct_9fa48("18463") ? false : stryMutAct_9fa48("18462") ? true : (stryCov_9fa48("18462", "18463", "18464"), formData.geminiApiKey || null),
                preferredAIService: stryMutAct_9fa48("18467") ? formData.preferredAIService && null : stryMutAct_9fa48("18466") ? false : stryMutAct_9fa48("18465") ? true : (stryCov_9fa48("18465", "18466", "18467"), formData.preferredAIService || null)
              }))
            }));
            const data = await res.json();
            if (stryMutAct_9fa48("18470") ? false : stryMutAct_9fa48("18469") ? true : stryMutAct_9fa48("18468") ? res.ok : (stryCov_9fa48("18468", "18469", "18470"), !res.ok)) {
              if (stryMutAct_9fa48("18471")) {
                {}
              } else {
                stryCov_9fa48("18471");
                throw new Error(stryMutAct_9fa48("18474") ? data.error && 'Error al guardar configuración' : stryMutAct_9fa48("18473") ? false : stryMutAct_9fa48("18472") ? true : (stryCov_9fa48("18472", "18473", "18474"), data.error || (stryMutAct_9fa48("18475") ? "" : (stryCov_9fa48("18475"), 'Error al guardar configuración'))));
              }
            }
            setSaved(stryMutAct_9fa48("18476") ? false : (stryCov_9fa48("18476"), true));
            // Recargar datos para mostrar keys enmascaradas
            await loadKeys();
            // Limpiar campos de entrada
            setFormData(stryMutAct_9fa48("18477") ? () => undefined : (stryCov_9fa48("18477"), prev => stryMutAct_9fa48("18478") ? {} : (stryCov_9fa48("18478"), {
              ...prev,
              openaiApiKey: stryMutAct_9fa48("18479") ? "Stryker was here!" : (stryCov_9fa48("18479"), ''),
              anthropicApiKey: stryMutAct_9fa48("18480") ? "Stryker was here!" : (stryCov_9fa48("18480"), ''),
              geminiApiKey: stryMutAct_9fa48("18481") ? "Stryker was here!" : (stryCov_9fa48("18481"), '')
            })));

            // Limpiar timeout anterior si existe
            if (stryMutAct_9fa48("18483") ? false : stryMutAct_9fa48("18482") ? true : (stryCov_9fa48("18482", "18483"), savedTimeoutRef.current)) {
              if (stryMutAct_9fa48("18484")) {
                {}
              } else {
                stryCov_9fa48("18484");
                clearTimeout(savedTimeoutRef.current);
              }
            }
            savedTimeoutRef.current = setTimeout(stryMutAct_9fa48("18485") ? () => undefined : (stryCov_9fa48("18485"), () => setSaved(stryMutAct_9fa48("18486") ? true : (stryCov_9fa48("18486"), false))), TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS);
          }
        } catch (err) {
          if (stryMutAct_9fa48("18487")) {
            {}
          } else {
            stryCov_9fa48("18487");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("18488") ? "" : (stryCov_9fa48("18488"), 'Error desconocido'));
          }
        } finally {
          if (stryMutAct_9fa48("18489")) {
            {}
          } else {
            stryCov_9fa48("18489");
            setLoading(stryMutAct_9fa48("18490") ? true : (stryCov_9fa48("18490"), false));
          }
        }
      }
    };
    const handleClear = async (service: 'openai' | 'anthropic' | 'gemini') => {
      if (stryMutAct_9fa48("18491")) {
        {}
      } else {
        stryCov_9fa48("18491");
        setLoading(stryMutAct_9fa48("18492") ? false : (stryCov_9fa48("18492"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("18493")) {
            {}
          } else {
            stryCov_9fa48("18493");
            const res = await fetch(stryMutAct_9fa48("18494") ? "" : (stryCov_9fa48("18494"), '/api/user/ai-keys'), stryMutAct_9fa48("18495") ? {} : (stryCov_9fa48("18495"), {
              method: stryMutAct_9fa48("18496") ? "" : (stryCov_9fa48("18496"), 'POST'),
              headers: stryMutAct_9fa48("18497") ? {} : (stryCov_9fa48("18497"), {
                'Content-Type': stryMutAct_9fa48("18498") ? "" : (stryCov_9fa48("18498"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("18500") ? {
                [``]: null
              } : stryMutAct_9fa48("18499") ? {} : (stryCov_9fa48("18499", "18500"), {
                [`${service}ApiKey`]: null
              }))
            }));
            if (stryMutAct_9fa48("18503") ? false : stryMutAct_9fa48("18502") ? true : stryMutAct_9fa48("18501") ? res.ok : (stryCov_9fa48("18501", "18502", "18503"), !res.ok)) {
              if (stryMutAct_9fa48("18504")) {
                {}
              } else {
                stryCov_9fa48("18504");
                throw new Error(stryMutAct_9fa48("18505") ? "" : (stryCov_9fa48("18505"), 'Error al eliminar API key'));
              }
            }
            await loadKeys();
          }
        } catch (err) {
          if (stryMutAct_9fa48("18506")) {
            {}
          } else {
            stryCov_9fa48("18506");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("18507") ? "" : (stryCov_9fa48("18507"), 'Error desconocido'));
          }
        } finally {
          if (stryMutAct_9fa48("18508")) {
            {}
          } else {
            stryCov_9fa48("18508");
            setLoading(stryMutAct_9fa48("18509") ? true : (stryCov_9fa48("18509"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("18511") ? false : stryMutAct_9fa48("18510") ? true : (stryCov_9fa48("18510", "18511"), loadingData)) {
      if (stryMutAct_9fa48("18512")) {
        {}
      } else {
        stryCov_9fa48("18512");
        return <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>;
      }
    }
    return <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Configuración de Servicios de IA
          </CardTitle>
          <HelpIcon content="Puedes usar las API keys de tus cuentas existentes (ChatGPT Plus, Claude Pro, Gemini) sin costo adicional. Las keys se almacenan de forma encriptada." />
        </div>
        <CardDescription>
          Configura tus API keys para usar ChatGPT, Claude o Gemini con tus cuentas existentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>¿Cómo obtener tus API Keys?</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="text-sm">
              Puedes usar las API keys de tus cuentas existentes (ChatGPT Plus, Claude Pro, Gemini)
              sin costo adicional:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>
                <strong>Claude:</strong>{stryMutAct_9fa48("18513") ? "" : (stryCov_9fa48("18513"), ' ')}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Obtener API Key <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <strong>ChatGPT:</strong>{stryMutAct_9fa48("18514") ? "" : (stryCov_9fa48("18514"), ' ')}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Obtener API Key <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <strong>Gemini:</strong>{stryMutAct_9fa48("18515") ? "" : (stryCov_9fa48("18515"), ' ')}
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Obtener API Key <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Las API keys se almacenan de forma encriptada y solo tú puedes verlas.
            </p>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OpenAI (ChatGPT) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="openaiApiKey">OpenAI API Key (ChatGPT)</Label>
              {stryMutAct_9fa48("18518") ? formData.hasOpenAI || <Button type="button" variant="ghost" size="sm" onClick={() => handleClear('openai')} disabled={loading}>
                  Eliminar
                </Button> : stryMutAct_9fa48("18517") ? false : stryMutAct_9fa48("18516") ? true : (stryCov_9fa48("18516", "18517", "18518"), formData.hasOpenAI && <Button type="button" variant="ghost" size="sm" onClick={stryMutAct_9fa48("18519") ? () => undefined : (stryCov_9fa48("18519"), () => handleClear(stryMutAct_9fa48("18520") ? "" : (stryCov_9fa48("18520"), 'openai')))} disabled={loading}>
                  Eliminar
                </Button>)}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input id="openaiApiKey" type={showKeys.openai ? stryMutAct_9fa48("18521") ? "" : (stryCov_9fa48("18521"), 'text') : stryMutAct_9fa48("18522") ? "" : (stryCov_9fa48("18522"), 'password')} placeholder={formData.hasOpenAI ? stryMutAct_9fa48("18523") ? "" : (stryCov_9fa48("18523"), '••••••••••••') : stryMutAct_9fa48("18524") ? "" : (stryCov_9fa48("18524"), 'sk-...')} value={formData.openaiApiKey} onChange={stryMutAct_9fa48("18525") ? () => undefined : (stryCov_9fa48("18525"), e => setFormData(stryMutAct_9fa48("18526") ? () => undefined : (stryCov_9fa48("18526"), prev => stryMutAct_9fa48("18527") ? {} : (stryCov_9fa48("18527"), {
                  ...prev,
                  openaiApiKey: e.target.value
                }))))} disabled={loading} />
                {stryMutAct_9fa48("18530") ? formData.hasOpenAI && !formData.openaiApiKey || <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div> : stryMutAct_9fa48("18529") ? false : stryMutAct_9fa48("18528") ? true : (stryCov_9fa48("18528", "18529", "18530"), (stryMutAct_9fa48("18532") ? formData.hasOpenAI || !formData.openaiApiKey : stryMutAct_9fa48("18531") ? true : (stryCov_9fa48("18531", "18532"), formData.hasOpenAI && (stryMutAct_9fa48("18533") ? formData.openaiApiKey : (stryCov_9fa48("18533"), !formData.openaiApiKey)))) && <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div>)}
              </div>
              <Button type="button" variant="outline" size="icon" onClick={stryMutAct_9fa48("18534") ? () => undefined : (stryCov_9fa48("18534"), () => setShowKeys(stryMutAct_9fa48("18535") ? () => undefined : (stryCov_9fa48("18535"), prev => stryMutAct_9fa48("18536") ? {} : (stryCov_9fa48("18536"), {
                ...prev,
                openai: stryMutAct_9fa48("18537") ? prev.openai : (stryCov_9fa48("18537"), !prev.openai)
              }))))} disabled={loading}>
                {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {stryMutAct_9fa48("18540") ? formData.hasOpenAI || <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p> : stryMutAct_9fa48("18539") ? false : stryMutAct_9fa48("18538") ? true : (stryCov_9fa48("18538", "18539", "18540"), formData.hasOpenAI && <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p>)}
          </div>

          {/* Anthropic (Claude) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="anthropicApiKey">Anthropic API Key (Claude)</Label>
              {stryMutAct_9fa48("18543") ? formData.hasAnthropic || <Button type="button" variant="ghost" size="sm" onClick={() => handleClear('anthropic')} disabled={loading}>
                  Eliminar
                </Button> : stryMutAct_9fa48("18542") ? false : stryMutAct_9fa48("18541") ? true : (stryCov_9fa48("18541", "18542", "18543"), formData.hasAnthropic && <Button type="button" variant="ghost" size="sm" onClick={stryMutAct_9fa48("18544") ? () => undefined : (stryCov_9fa48("18544"), () => handleClear(stryMutAct_9fa48("18545") ? "" : (stryCov_9fa48("18545"), 'anthropic')))} disabled={loading}>
                  Eliminar
                </Button>)}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input id="anthropicApiKey" type={showKeys.anthropic ? stryMutAct_9fa48("18546") ? "" : (stryCov_9fa48("18546"), 'text') : stryMutAct_9fa48("18547") ? "" : (stryCov_9fa48("18547"), 'password')} placeholder={formData.hasAnthropic ? stryMutAct_9fa48("18548") ? "" : (stryCov_9fa48("18548"), '••••••••••••') : stryMutAct_9fa48("18549") ? "" : (stryCov_9fa48("18549"), 'sk-ant-...')} value={formData.anthropicApiKey} onChange={stryMutAct_9fa48("18550") ? () => undefined : (stryCov_9fa48("18550"), e => setFormData(stryMutAct_9fa48("18551") ? () => undefined : (stryCov_9fa48("18551"), prev => stryMutAct_9fa48("18552") ? {} : (stryCov_9fa48("18552"), {
                  ...prev,
                  anthropicApiKey: e.target.value
                }))))} disabled={loading} />
                {stryMutAct_9fa48("18555") ? formData.hasAnthropic && !formData.anthropicApiKey || <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div> : stryMutAct_9fa48("18554") ? false : stryMutAct_9fa48("18553") ? true : (stryCov_9fa48("18553", "18554", "18555"), (stryMutAct_9fa48("18557") ? formData.hasAnthropic || !formData.anthropicApiKey : stryMutAct_9fa48("18556") ? true : (stryCov_9fa48("18556", "18557"), formData.hasAnthropic && (stryMutAct_9fa48("18558") ? formData.anthropicApiKey : (stryCov_9fa48("18558"), !formData.anthropicApiKey)))) && <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div>)}
              </div>
              <Button type="button" variant="outline" size="icon" onClick={stryMutAct_9fa48("18559") ? () => undefined : (stryCov_9fa48("18559"), () => setShowKeys(stryMutAct_9fa48("18560") ? () => undefined : (stryCov_9fa48("18560"), prev => stryMutAct_9fa48("18561") ? {} : (stryCov_9fa48("18561"), {
                ...prev,
                anthropic: stryMutAct_9fa48("18562") ? prev.anthropic : (stryCov_9fa48("18562"), !prev.anthropic)
              }))))} disabled={loading}>
                {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {stryMutAct_9fa48("18565") ? formData.hasAnthropic || <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p> : stryMutAct_9fa48("18564") ? false : stryMutAct_9fa48("18563") ? true : (stryCov_9fa48("18563", "18564", "18565"), formData.hasAnthropic && <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p>)}
          </div>

          {/* Gemini */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="geminiApiKey">Gemini API Key (Google)</Label>
              {stryMutAct_9fa48("18568") ? formData.hasGemini || <Button type="button" variant="ghost" size="sm" onClick={() => handleClear('gemini')} disabled={loading}>
                  Eliminar
                </Button> : stryMutAct_9fa48("18567") ? false : stryMutAct_9fa48("18566") ? true : (stryCov_9fa48("18566", "18567", "18568"), formData.hasGemini && <Button type="button" variant="ghost" size="sm" onClick={stryMutAct_9fa48("18569") ? () => undefined : (stryCov_9fa48("18569"), () => handleClear(stryMutAct_9fa48("18570") ? "" : (stryCov_9fa48("18570"), 'gemini')))} disabled={loading}>
                  Eliminar
                </Button>)}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input id="geminiApiKey" type={showKeys.gemini ? stryMutAct_9fa48("18571") ? "" : (stryCov_9fa48("18571"), 'text') : stryMutAct_9fa48("18572") ? "" : (stryCov_9fa48("18572"), 'password')} placeholder={formData.hasGemini ? stryMutAct_9fa48("18573") ? "" : (stryCov_9fa48("18573"), '••••••••••••') : stryMutAct_9fa48("18574") ? "" : (stryCov_9fa48("18574"), 'AIza...')} value={formData.geminiApiKey} onChange={stryMutAct_9fa48("18575") ? () => undefined : (stryCov_9fa48("18575"), e => setFormData(stryMutAct_9fa48("18576") ? () => undefined : (stryCov_9fa48("18576"), prev => stryMutAct_9fa48("18577") ? {} : (stryCov_9fa48("18577"), {
                  ...prev,
                  geminiApiKey: e.target.value
                }))))} disabled={loading} />
                {stryMutAct_9fa48("18580") ? formData.hasGemini && !formData.geminiApiKey || <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div> : stryMutAct_9fa48("18579") ? false : stryMutAct_9fa48("18578") ? true : (stryCov_9fa48("18578", "18579", "18580"), (stryMutAct_9fa48("18582") ? formData.hasGemini || !formData.geminiApiKey : stryMutAct_9fa48("18581") ? true : (stryCov_9fa48("18581", "18582"), formData.hasGemini && (stryMutAct_9fa48("18583") ? formData.geminiApiKey : (stryCov_9fa48("18583"), !formData.geminiApiKey)))) && <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                    Configurada
                  </div>)}
              </div>
              <Button type="button" variant="outline" size="icon" onClick={stryMutAct_9fa48("18584") ? () => undefined : (stryCov_9fa48("18584"), () => setShowKeys(stryMutAct_9fa48("18585") ? () => undefined : (stryCov_9fa48("18585"), prev => stryMutAct_9fa48("18586") ? {} : (stryCov_9fa48("18586"), {
                ...prev,
                gemini: stryMutAct_9fa48("18587") ? prev.gemini : (stryCov_9fa48("18587"), !prev.gemini)
              }))))} disabled={loading}>
                {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {stryMutAct_9fa48("18590") ? formData.hasGemini || <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p> : stryMutAct_9fa48("18589") ? false : stryMutAct_9fa48("18588") ? true : (stryCov_9fa48("18588", "18589", "18590"), formData.hasGemini && <p className="text-xs text-muted-foreground">
                API Key configurada. Ingresa una nueva para actualizarla.
              </p>)}
          </div>

          {/* Servicio preferido */}
          <div className="space-y-2">
            <Label htmlFor="preferredAIService" className="flex items-center gap-2">
              Servicio Preferido
              <HelpIcon content="Si tienes múltiples servicios configurados, puedes elegir cuál usar por defecto. Si no seleccionas ninguno, se usará el primero disponible." side="right" />
            </Label>
            <Select value={stryMutAct_9fa48("18593") ? formData.preferredAIService && '__none__' : stryMutAct_9fa48("18592") ? false : stryMutAct_9fa48("18591") ? true : (stryCov_9fa48("18591", "18592", "18593"), formData.preferredAIService || (stryMutAct_9fa48("18594") ? "" : (stryCov_9fa48("18594"), '__none__')))} onValueChange={stryMutAct_9fa48("18595") ? () => undefined : (stryCov_9fa48("18595"), value => setFormData(stryMutAct_9fa48("18596") ? () => undefined : (stryCov_9fa48("18596"), prev => stryMutAct_9fa48("18597") ? {} : (stryCov_9fa48("18597"), {
              ...prev,
              preferredAIService: (stryMutAct_9fa48("18600") ? value !== '__none__' : stryMutAct_9fa48("18599") ? false : stryMutAct_9fa48("18598") ? true : (stryCov_9fa48("18598", "18599", "18600"), value === (stryMutAct_9fa48("18601") ? "" : (stryCov_9fa48("18601"), '__none__')))) ? null : value
            }))))}>
              <SelectTrigger id="preferredAIService">
                <SelectValue placeholder="Selecciona un servicio (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Automático (usar el primero disponible)</SelectItem>
                <SelectItem value="anthropic">Claude (Anthropic)</SelectItem>
                <SelectItem value="openai">ChatGPT (OpenAI)</SelectItem>
                <SelectItem value="gemini">Gemini (Google)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              El sistema usará este servicio por defecto si está disponible
            </p>
          </div>

          {/* Mensajes */}
          {stryMutAct_9fa48("18604") ? saved || <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Configuración guardada
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Tus API keys se han guardado correctamente
              </AlertDescription>
            </Alert> : stryMutAct_9fa48("18603") ? false : stryMutAct_9fa48("18602") ? true : (stryCov_9fa48("18602", "18603", "18604"), saved && <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Configuración guardada
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Tus API keys se han guardado correctamente
              </AlertDescription>
            </Alert>)}

          {stryMutAct_9fa48("18607") ? error || <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert> : stryMutAct_9fa48("18606") ? false : stryMutAct_9fa48("18605") ? true : (stryCov_9fa48("18605", "18606", "18607"), error && <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>)}

          {/* Botón de guardar */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </> : stryMutAct_9fa48("18608") ? "" : (stryCov_9fa48("18608"), 'Guardar Configuración')}
          </Button>
        </form>
      </CardContent>
    </Card>;
  }
}