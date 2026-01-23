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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle, User, Mail, RotateCcw, XCircle } from 'lucide-react';
import { HelpIcon } from '@/components/help/help-icon';
import { ErrorMessageComponent } from '@/components/ui/error-message';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { validateEmail, validateString } from '@/lib/validation-helpers';
import { cn } from '@/lib/utils';
import { TIME_CONSTANTS } from '@/lib/constants';
interface UserFormProps {
  readonly initialData: {
    readonly name: string | null;
    readonly email: string;
  };
  readonly onSuccess?: () => void;
}
interface FieldError {
  message: string;
  code: string;
}
export function UserForm({
  initialData,
  onSuccess
}: UserFormProps) {
  if (stryMutAct_9fa48("18729")) {
    {}
  } else {
    stryCov_9fa48("18729");
    const [name, setName] = useState(stryMutAct_9fa48("18732") ? initialData.name && '' : stryMutAct_9fa48("18731") ? false : stryMutAct_9fa48("18730") ? true : (stryCov_9fa48("18730", "18731", "18732"), initialData.name || (stryMutAct_9fa48("18733") ? "Stryker was here!" : (stryCov_9fa48("18733"), ''))));
    const [email, setEmail] = useState(stryMutAct_9fa48("18736") ? initialData.email && '' : stryMutAct_9fa48("18735") ? false : stryMutAct_9fa48("18734") ? true : (stryCov_9fa48("18734", "18735", "18736"), initialData.email || (stryMutAct_9fa48("18737") ? "Stryker was here!" : (stryCov_9fa48("18737"), ''))));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("18738") ? true : (stryCov_9fa48("18738"), false));
    const [structuredError, setStructuredError] = useState<ReturnType<typeof getErrorMessage> | null>(null);
    const [success, setSuccess] = useState(stryMutAct_9fa48("18739") ? true : (stryCov_9fa48("18739"), false));

    // Validación en tiempo real
    const [nameError, setNameError] = useState<FieldError | null>(null);
    const [emailError, setEmailError] = useState<FieldError | null>(null);
    const [nameTouched, setNameTouched] = useState(stryMutAct_9fa48("18740") ? true : (stryCov_9fa48("18740"), false));
    const [emailTouched, setEmailTouched] = useState(stryMutAct_9fa48("18741") ? true : (stryCov_9fa48("18741"), false));

    // Ref para limpiar timeout al desmontar
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup de timeout al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("18742")) {
        {}
      } else {
        stryCov_9fa48("18742");
        return () => {
          if (stryMutAct_9fa48("18743")) {
            {}
          } else {
            stryCov_9fa48("18743");
            if (stryMutAct_9fa48("18745") ? false : stryMutAct_9fa48("18744") ? true : (stryCov_9fa48("18744", "18745"), successTimeoutRef.current)) {
              if (stryMutAct_9fa48("18746")) {
                {}
              } else {
                stryCov_9fa48("18746");
                clearTimeout(successTimeoutRef.current);
                successTimeoutRef.current = null;
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("18747") ? ["Stryker was here"] : (stryCov_9fa48("18747"), []));

    // Validar nombre en tiempo real
    useEffect(() => {
      if (stryMutAct_9fa48("18748")) {
        {}
      } else {
        stryCov_9fa48("18748");
        if (stryMutAct_9fa48("18750") ? false : stryMutAct_9fa48("18749") ? true : (stryCov_9fa48("18749", "18750"), nameTouched)) {
          if (stryMutAct_9fa48("18751")) {
            {}
          } else {
            stryCov_9fa48("18751");
            const validation = validateString(name, stryMutAct_9fa48("18752") ? {} : (stryCov_9fa48("18752"), {
              minLength: 2,
              maxLength: 100,
              allowEmpty: stryMutAct_9fa48("18753") ? true : (stryCov_9fa48("18753"), false),
              required: stryMutAct_9fa48("18754") ? false : (stryCov_9fa48("18754"), true)
            }));
            if (stryMutAct_9fa48("18756") ? false : stryMutAct_9fa48("18755") ? true : (stryCov_9fa48("18755", "18756"), validation.isValid)) {
              if (stryMutAct_9fa48("18757")) {
                {}
              } else {
                stryCov_9fa48("18757");
                setNameError(null);
              }
            } else {
              if (stryMutAct_9fa48("18758")) {
                {}
              } else {
                stryCov_9fa48("18758");
                setNameError(stryMutAct_9fa48("18759") ? {} : (stryCov_9fa48("18759"), {
                  message: stryMutAct_9fa48("18762") ? validation.error && 'El nombre debe tener entre 2 y 100 caracteres' : stryMutAct_9fa48("18761") ? false : stryMutAct_9fa48("18760") ? true : (stryCov_9fa48("18760", "18761", "18762"), validation.error || (stryMutAct_9fa48("18763") ? "" : (stryCov_9fa48("18763"), 'El nombre debe tener entre 2 y 100 caracteres'))),
                  code: ERROR_CODES.VALIDATION_REQUIRED
                }));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("18764") ? [] : (stryCov_9fa48("18764"), [name, nameTouched]));

    // Validar email en tiempo real
    useEffect(() => {
      if (stryMutAct_9fa48("18765")) {
        {}
      } else {
        stryCov_9fa48("18765");
        if (stryMutAct_9fa48("18767") ? false : stryMutAct_9fa48("18766") ? true : (stryCov_9fa48("18766", "18767"), emailTouched)) {
          if (stryMutAct_9fa48("18768")) {
            {}
          } else {
            stryCov_9fa48("18768");
            const validation = validateEmail(email);
            if (stryMutAct_9fa48("18770") ? false : stryMutAct_9fa48("18769") ? true : (stryCov_9fa48("18769", "18770"), validation.isValid)) {
              if (stryMutAct_9fa48("18771")) {
                {}
              } else {
                stryCov_9fa48("18771");
                setEmailError(null);
              }
            } else {
              if (stryMutAct_9fa48("18772")) {
                {}
              } else {
                stryCov_9fa48("18772");
                setEmailError(stryMutAct_9fa48("18773") ? {} : (stryCov_9fa48("18773"), {
                  message: stryMutAct_9fa48("18776") ? validation.error && 'Email inválido' : stryMutAct_9fa48("18775") ? false : stryMutAct_9fa48("18774") ? true : (stryCov_9fa48("18774", "18775", "18776"), validation.error || (stryMutAct_9fa48("18777") ? "" : (stryCov_9fa48("18777"), 'Email inválido'))),
                  code: ERROR_CODES.VALIDATION_INVALID_FORMAT
                }));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("18778") ? [] : (stryCov_9fa48("18778"), [email, emailTouched]));

    // Limpiar timeout al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("18779")) {
        {}
      } else {
        stryCov_9fa48("18779");
        return () => {
          if (stryMutAct_9fa48("18780")) {
            {}
          } else {
            stryCov_9fa48("18780");
            if (stryMutAct_9fa48("18782") ? false : stryMutAct_9fa48("18781") ? true : (stryCov_9fa48("18781", "18782"), successTimeoutRef.current)) {
              if (stryMutAct_9fa48("18783")) {
                {}
              } else {
                stryCov_9fa48("18783");
                clearTimeout(successTimeoutRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("18784") ? ["Stryker was here"] : (stryCov_9fa48("18784"), []));

    // Restaurar valores originales
    const handleReset = useCallback(() => {
      if (stryMutAct_9fa48("18785")) {
        {}
      } else {
        stryCov_9fa48("18785");
        setName(stryMutAct_9fa48("18788") ? initialData.name && '' : stryMutAct_9fa48("18787") ? false : stryMutAct_9fa48("18786") ? true : (stryCov_9fa48("18786", "18787", "18788"), initialData.name || (stryMutAct_9fa48("18789") ? "Stryker was here!" : (stryCov_9fa48("18789"), ''))));
        setEmail(initialData.email);
        setNameError(null);
        setEmailError(null);
        setStructuredError(null);
        setNameTouched(stryMutAct_9fa48("18790") ? true : (stryCov_9fa48("18790"), false));
        setEmailTouched(stryMutAct_9fa48("18791") ? true : (stryCov_9fa48("18791"), false));
        // Limpiar timeout de éxito si existe
        if (stryMutAct_9fa48("18793") ? false : stryMutAct_9fa48("18792") ? true : (stryCov_9fa48("18792", "18793"), successTimeoutRef.current)) {
          if (stryMutAct_9fa48("18794")) {
            {}
          } else {
            stryCov_9fa48("18794");
            clearTimeout(successTimeoutRef.current);
            successTimeoutRef.current = null;
          }
        }
      }
    }, stryMutAct_9fa48("18795") ? [] : (stryCov_9fa48("18795"), [initialData.name, initialData.email]));
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("18796")) {
        {}
      } else {
        stryCov_9fa48("18796");
        e.preventDefault();
        setStructuredError(null);
        setSuccess(stryMutAct_9fa48("18797") ? true : (stryCov_9fa48("18797"), false));

        // Marcar campos como tocados para mostrar errores
        setNameTouched(stryMutAct_9fa48("18798") ? false : (stryCov_9fa48("18798"), true));
        setEmailTouched(stryMutAct_9fa48("18799") ? false : (stryCov_9fa48("18799"), true));

        // Validación usando helpers
        const nameValidation = validateString(name, stryMutAct_9fa48("18800") ? {} : (stryCov_9fa48("18800"), {
          minLength: 2,
          maxLength: 100,
          allowEmpty: stryMutAct_9fa48("18801") ? true : (stryCov_9fa48("18801"), false),
          required: stryMutAct_9fa48("18802") ? false : (stryCov_9fa48("18802"), true)
        }));
        const emailValidation = validateEmail(email);
        if (stryMutAct_9fa48("18805") ? false : stryMutAct_9fa48("18804") ? true : stryMutAct_9fa48("18803") ? nameValidation.isValid : (stryCov_9fa48("18803", "18804", "18805"), !nameValidation.isValid)) {
          if (stryMutAct_9fa48("18806")) {
            {}
          } else {
            stryCov_9fa48("18806");
            const errorMsg = getErrorMessage(ERROR_CODES.VALIDATION_REQUIRED, stryMutAct_9fa48("18807") ? {} : (stryCov_9fa48("18807"), {
              field: stryMutAct_9fa48("18808") ? "" : (stryCov_9fa48("18808"), 'nombre'),
              minLength: 2,
              maxLength: 100
            }));
            setStructuredError(errorMsg);
            setIsLoading(stryMutAct_9fa48("18809") ? true : (stryCov_9fa48("18809"), false));
            return;
          }
        }
        if (stryMutAct_9fa48("18812") ? false : stryMutAct_9fa48("18811") ? true : stryMutAct_9fa48("18810") ? emailValidation.isValid : (stryCov_9fa48("18810", "18811", "18812"), !emailValidation.isValid)) {
          if (stryMutAct_9fa48("18813")) {
            {}
          } else {
            stryCov_9fa48("18813");
            const errorMsg = getErrorMessage(ERROR_CODES.VALIDATION_INVALID_FORMAT, stryMutAct_9fa48("18814") ? {} : (stryCov_9fa48("18814"), {
              field: stryMutAct_9fa48("18815") ? "" : (stryCov_9fa48("18815"), 'email'),
              expected: stryMutAct_9fa48("18816") ? "" : (stryCov_9fa48("18816"), 'ejemplo@correo.com')
            }));
            setStructuredError(errorMsg);
            setIsLoading(stryMutAct_9fa48("18817") ? true : (stryCov_9fa48("18817"), false));
            return;
          }
        }
        setIsLoading(stryMutAct_9fa48("18818") ? false : (stryCov_9fa48("18818"), true));
        try {
          if (stryMutAct_9fa48("18819")) {
            {}
          } else {
            stryCov_9fa48("18819");
            const res = await fetch(stryMutAct_9fa48("18820") ? "" : (stryCov_9fa48("18820"), '/api/user'), stryMutAct_9fa48("18821") ? {} : (stryCov_9fa48("18821"), {
              method: stryMutAct_9fa48("18822") ? "" : (stryCov_9fa48("18822"), 'PUT'),
              headers: stryMutAct_9fa48("18823") ? {} : (stryCov_9fa48("18823"), {
                'Content-Type': stryMutAct_9fa48("18824") ? "" : (stryCov_9fa48("18824"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("18825") ? {} : (stryCov_9fa48("18825"), {
                name: nameValidation.sanitized,
                email: emailValidation.sanitized
              }))
            }));
            if (stryMutAct_9fa48("18828") ? false : stryMutAct_9fa48("18827") ? true : stryMutAct_9fa48("18826") ? res.ok : (stryCov_9fa48("18826", "18827", "18828"), !res.ok)) {
              if (stryMutAct_9fa48("18829")) {
                {}
              } else {
                stryCov_9fa48("18829");
                // Parsear JSON de forma segura, puede fallar si la respuesta no es JSON
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("18830") ? "" : (stryCov_9fa48("18830"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                }>(res, stryMutAct_9fa48("18831") ? {} : (stryCov_9fa48("18831"), {
                  path: (stryMutAct_9fa48("18834") ? typeof window === 'undefined' : stryMutAct_9fa48("18833") ? false : stryMutAct_9fa48("18832") ? true : (stryCov_9fa48("18832", "18833", "18834"), typeof window !== (stryMutAct_9fa48("18835") ? "" : (stryCov_9fa48("18835"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("18836") ? "" : (stryCov_9fa48("18836"), '/profile'),
                  operation: stryMutAct_9fa48("18837") ? "" : (stryCov_9fa48("18837"), 'actualizar información de usuario')
                }));
                const errorInfo = extractErrorInfo(stryMutAct_9fa48("18840") ? errorData.error && 'Error al actualizar información' : stryMutAct_9fa48("18839") ? false : stryMutAct_9fa48("18838") ? true : (stryCov_9fa48("18838", "18839", "18840"), errorData.error || (stryMutAct_9fa48("18841") ? "" : (stryCov_9fa48("18841"), 'Error al actualizar información'))));
                const errorMsg = getErrorMessage(errorInfo.code, stryMutAct_9fa48("18842") ? {} : (stryCov_9fa48("18842"), {
                  message: errorInfo.message,
                  ...errorInfo.context
                }));
                setStructuredError(errorMsg);
                return;
              }
            }

            // Respuesta exitosa - no necesitamos parsear el body si no lo usamos

            setSuccess(stryMutAct_9fa48("18843") ? false : (stryCov_9fa48("18843"), true));
            setNameTouched(stryMutAct_9fa48("18844") ? true : (stryCov_9fa48("18844"), false));
            setEmailTouched(stryMutAct_9fa48("18845") ? true : (stryCov_9fa48("18845"), false));
            if (stryMutAct_9fa48("18847") ? false : stryMutAct_9fa48("18846") ? true : (stryCov_9fa48("18846", "18847"), onSuccess)) {
              if (stryMutAct_9fa48("18848")) {
                {}
              } else {
                stryCov_9fa48("18848");
                onSuccess();
              }
            }

            // Ocultar mensaje de éxito después de 3 segundos
            // Limpiar timeout anterior si existe
            if (stryMutAct_9fa48("18850") ? false : stryMutAct_9fa48("18849") ? true : (stryCov_9fa48("18849", "18850"), successTimeoutRef.current)) {
              if (stryMutAct_9fa48("18851")) {
                {}
              } else {
                stryCov_9fa48("18851");
                clearTimeout(successTimeoutRef.current);
              }
            }
            successTimeoutRef.current = setTimeout(stryMutAct_9fa48("18852") ? () => undefined : (stryCov_9fa48("18852"), () => setSuccess(stryMutAct_9fa48("18853") ? true : (stryCov_9fa48("18853"), false))), TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS);
          }
        } catch (err) {
          if (stryMutAct_9fa48("18854")) {
            {}
          } else {
            stryCov_9fa48("18854");
            const errorInfo = extractErrorInfo(err);
            const errorMsg = getErrorMessage(errorInfo.code, stryMutAct_9fa48("18855") ? {} : (stryCov_9fa48("18855"), {
              message: errorInfo.message,
              ...errorInfo.context
            }));
            setStructuredError(errorMsg);
          }
        } finally {
          if (stryMutAct_9fa48("18856")) {
            {}
          } else {
            stryCov_9fa48("18856");
            setIsLoading(stryMutAct_9fa48("18857") ? true : (stryCov_9fa48("18857"), false));
          }
        }
      }
    };
    const hasChanges = stryMutAct_9fa48("18860") ? name !== (initialData.name || '') && email !== initialData.email : stryMutAct_9fa48("18859") ? false : stryMutAct_9fa48("18858") ? true : (stryCov_9fa48("18858", "18859", "18860"), (stryMutAct_9fa48("18862") ? name === (initialData.name || '') : stryMutAct_9fa48("18861") ? false : (stryCov_9fa48("18861", "18862"), name !== (stryMutAct_9fa48("18865") ? initialData.name && '' : stryMutAct_9fa48("18864") ? false : stryMutAct_9fa48("18863") ? true : (stryCov_9fa48("18863", "18864", "18865"), initialData.name || (stryMutAct_9fa48("18866") ? "Stryker was here!" : (stryCov_9fa48("18866"), '')))))) || (stryMutAct_9fa48("18868") ? email === initialData.email : stryMutAct_9fa48("18867") ? false : (stryCov_9fa48("18867", "18868"), email !== initialData.email)));
    const isFormValid = stryMutAct_9fa48("18871") ? !nameError && !emailError && name.trim() || email.trim() : stryMutAct_9fa48("18870") ? false : stryMutAct_9fa48("18869") ? true : (stryCov_9fa48("18869", "18870", "18871"), (stryMutAct_9fa48("18873") ? !nameError && !emailError || name.trim() : stryMutAct_9fa48("18872") ? true : (stryCov_9fa48("18872", "18873"), (stryMutAct_9fa48("18875") ? !nameError || !emailError : stryMutAct_9fa48("18874") ? true : (stryCov_9fa48("18874", "18875"), (stryMutAct_9fa48("18876") ? nameError : (stryCov_9fa48("18876"), !nameError)) && (stryMutAct_9fa48("18877") ? emailError : (stryCov_9fa48("18877"), !emailError)))) && (stryMutAct_9fa48("18878") ? name : (stryCov_9fa48("18878"), name.trim())))) && (stryMutAct_9fa48("18879") ? email : (stryCov_9fa48("18879"), email.trim())));
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Información Personal</CardTitle>
            <HelpIcon content="Tu nombre se mostrará en el dashboard y en tus estadísticas. Si cambias tu email, deberás verificarlo nuevamente." />
          </div>
          {stryMutAct_9fa48("18882") ? hasChanges || <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground" aria-label="Restaurar valores originales">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button> : stryMutAct_9fa48("18881") ? false : stryMutAct_9fa48("18880") ? true : (stryCov_9fa48("18880", "18881", "18882"), hasChanges && <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground" aria-label="Restaurar valores originales">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>)}
        </div>
        <CardDescription>Actualiza tu nombre y dirección de correo electrónico</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {stryMutAct_9fa48("18885") ? structuredError || <ErrorMessageComponent error={structuredError} onDismiss={() => {
            setStructuredError(null);
          }} /> : stryMutAct_9fa48("18884") ? false : stryMutAct_9fa48("18883") ? true : (stryCov_9fa48("18883", "18884", "18885"), structuredError && <ErrorMessageComponent error={structuredError} onDismiss={() => {
            if (stryMutAct_9fa48("18886")) {
              {}
            } else {
              stryCov_9fa48("18886");
              setStructuredError(null);
            }
          }} />)}


          {stryMutAct_9fa48("18889") ? success || <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Información actualizada exitosamente</span>
            </div> : stryMutAct_9fa48("18888") ? false : stryMutAct_9fa48("18887") ? true : (stryCov_9fa48("18887", "18888", "18889"), success && <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Información actualizada exitosamente</span>
            </div>)}

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre
              <HelpIcon content="Este nombre se mostrará en tu dashboard y en todas las estadísticas. Puedes cambiarlo en cualquier momento." side="right" />
            </Label>
            <div className="relative">
              <Input id="name" type="text" value={name} onChange={e => {
                if (stryMutAct_9fa48("18890")) {
                  {}
                } else {
                  stryCov_9fa48("18890");
                  setName(e.target.value);
                  if (stryMutAct_9fa48("18893") ? false : stryMutAct_9fa48("18892") ? true : stryMutAct_9fa48("18891") ? nameTouched : (stryCov_9fa48("18891", "18892", "18893"), !nameTouched)) setNameTouched(stryMutAct_9fa48("18894") ? false : (stryCov_9fa48("18894"), true));
                }
              }} onBlur={stryMutAct_9fa48("18895") ? () => undefined : (stryCov_9fa48("18895"), () => setNameTouched(stryMutAct_9fa48("18896") ? false : (stryCov_9fa48("18896"), true)))} placeholder="Tu nombre completo" required maxLength={100} aria-invalid={stryMutAct_9fa48("18899") ? nameError === null : stryMutAct_9fa48("18898") ? false : stryMutAct_9fa48("18897") ? true : (stryCov_9fa48("18897", "18898", "18899"), nameError !== null)} aria-describedby={nameError ? stryMutAct_9fa48("18900") ? "" : (stryCov_9fa48("18900"), 'name-error') : undefined} className={cn(stryMutAct_9fa48("18903") ? nameError || 'border-destructive focus-visible:ring-destructive/20' : stryMutAct_9fa48("18902") ? false : stryMutAct_9fa48("18901") ? true : (stryCov_9fa48("18901", "18902", "18903"), nameError && (stryMutAct_9fa48("18904") ? "" : (stryCov_9fa48("18904"), 'border-destructive focus-visible:ring-destructive/20'))), stryMutAct_9fa48("18907") ? !nameError && nameTouched && name.trim() || 'border-green-500/50' : stryMutAct_9fa48("18906") ? false : stryMutAct_9fa48("18905") ? true : (stryCov_9fa48("18905", "18906", "18907"), (stryMutAct_9fa48("18909") ? !nameError && nameTouched || name.trim() : stryMutAct_9fa48("18908") ? true : (stryCov_9fa48("18908", "18909"), (stryMutAct_9fa48("18911") ? !nameError || nameTouched : stryMutAct_9fa48("18910") ? true : (stryCov_9fa48("18910", "18911"), (stryMutAct_9fa48("18912") ? nameError : (stryCov_9fa48("18912"), !nameError)) && nameTouched)) && (stryMutAct_9fa48("18913") ? name : (stryCov_9fa48("18913"), name.trim())))) && (stryMutAct_9fa48("18914") ? "" : (stryCov_9fa48("18914"), 'border-green-500/50'))))} />
              {stryMutAct_9fa48("18917") ? nameError || <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div> : stryMutAct_9fa48("18916") ? false : stryMutAct_9fa48("18915") ? true : (stryCov_9fa48("18915", "18916", "18917"), nameError && <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>)}
              {stryMutAct_9fa48("18920") ? !nameError && nameTouched && name.trim() || <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div> : stryMutAct_9fa48("18919") ? false : stryMutAct_9fa48("18918") ? true : (stryCov_9fa48("18918", "18919", "18920"), (stryMutAct_9fa48("18922") ? !nameError && nameTouched || name.trim() : stryMutAct_9fa48("18921") ? true : (stryCov_9fa48("18921", "18922"), (stryMutAct_9fa48("18924") ? !nameError || nameTouched : stryMutAct_9fa48("18923") ? true : (stryCov_9fa48("18923", "18924"), (stryMutAct_9fa48("18925") ? nameError : (stryCov_9fa48("18925"), !nameError)) && nameTouched)) && (stryMutAct_9fa48("18926") ? name : (stryCov_9fa48("18926"), name.trim())))) && <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>)}
            </div>
            {stryMutAct_9fa48("18929") ? nameError || <p id="name-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {nameError.message}
              </p> : stryMutAct_9fa48("18928") ? false : stryMutAct_9fa48("18927") ? true : (stryCov_9fa48("18927", "18928", "18929"), nameError && <p id="name-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {nameError.message}
              </p>)}
            {stryMutAct_9fa48("18932") ? !nameError && nameTouched && name.trim() || <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Nombre válido
              </p> : stryMutAct_9fa48("18931") ? false : stryMutAct_9fa48("18930") ? true : (stryCov_9fa48("18930", "18931", "18932"), (stryMutAct_9fa48("18934") ? !nameError && nameTouched || name.trim() : stryMutAct_9fa48("18933") ? true : (stryCov_9fa48("18933", "18934"), (stryMutAct_9fa48("18936") ? !nameError || nameTouched : stryMutAct_9fa48("18935") ? true : (stryCov_9fa48("18935", "18936"), (stryMutAct_9fa48("18937") ? nameError : (stryCov_9fa48("18937"), !nameError)) && nameTouched)) && (stryMutAct_9fa48("18938") ? name : (stryCov_9fa48("18938"), name.trim())))) && <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Nombre válido
              </p>)}
            {stryMutAct_9fa48("18941") ? name.trim() || <p className="text-xs text-muted-foreground">
                {name.length}/100 caracteres
              </p> : stryMutAct_9fa48("18940") ? false : stryMutAct_9fa48("18939") ? true : (stryCov_9fa48("18939", "18940", "18941"), (stryMutAct_9fa48("18942") ? name : (stryCov_9fa48("18942"), name.trim())) && <p className="text-xs text-muted-foreground">
                {name.length}/100 caracteres
              </p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Correo Electrónico
              <HelpIcon content="Si cambias tu email, recibirás un correo de verificación. Tu email se usa para iniciar sesión y recuperar tu cuenta." side="right" />
            </Label>
            <div className="relative">
              <Input id="email" type="email" value={email} onChange={e => {
                if (stryMutAct_9fa48("18943")) {
                  {}
                } else {
                  stryCov_9fa48("18943");
                  setEmail(e.target.value);
                  if (stryMutAct_9fa48("18946") ? false : stryMutAct_9fa48("18945") ? true : stryMutAct_9fa48("18944") ? emailTouched : (stryCov_9fa48("18944", "18945", "18946"), !emailTouched)) setEmailTouched(stryMutAct_9fa48("18947") ? false : (stryCov_9fa48("18947"), true));
                }
              }} onBlur={stryMutAct_9fa48("18948") ? () => undefined : (stryCov_9fa48("18948"), () => setEmailTouched(stryMutAct_9fa48("18949") ? false : (stryCov_9fa48("18949"), true)))} placeholder="tu@email.com" required aria-invalid={stryMutAct_9fa48("18952") ? emailError === null : stryMutAct_9fa48("18951") ? false : stryMutAct_9fa48("18950") ? true : (stryCov_9fa48("18950", "18951", "18952"), emailError !== null)} aria-describedby={emailError ? stryMutAct_9fa48("18953") ? "" : (stryCov_9fa48("18953"), 'email-error') : undefined} className={cn(stryMutAct_9fa48("18956") ? emailError || 'border-destructive focus-visible:ring-destructive/20' : stryMutAct_9fa48("18955") ? false : stryMutAct_9fa48("18954") ? true : (stryCov_9fa48("18954", "18955", "18956"), emailError && (stryMutAct_9fa48("18957") ? "" : (stryCov_9fa48("18957"), 'border-destructive focus-visible:ring-destructive/20'))), stryMutAct_9fa48("18960") ? !emailError && emailTouched && email.trim() || 'border-green-500/50' : stryMutAct_9fa48("18959") ? false : stryMutAct_9fa48("18958") ? true : (stryCov_9fa48("18958", "18959", "18960"), (stryMutAct_9fa48("18962") ? !emailError && emailTouched || email.trim() : stryMutAct_9fa48("18961") ? true : (stryCov_9fa48("18961", "18962"), (stryMutAct_9fa48("18964") ? !emailError || emailTouched : stryMutAct_9fa48("18963") ? true : (stryCov_9fa48("18963", "18964"), (stryMutAct_9fa48("18965") ? emailError : (stryCov_9fa48("18965"), !emailError)) && emailTouched)) && (stryMutAct_9fa48("18966") ? email : (stryCov_9fa48("18966"), email.trim())))) && (stryMutAct_9fa48("18967") ? "" : (stryCov_9fa48("18967"), 'border-green-500/50'))))} />
              {stryMutAct_9fa48("18970") ? emailError || <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div> : stryMutAct_9fa48("18969") ? false : stryMutAct_9fa48("18968") ? true : (stryCov_9fa48("18968", "18969", "18970"), emailError && <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>)}
              {stryMutAct_9fa48("18973") ? !emailError && emailTouched && email.trim() || <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div> : stryMutAct_9fa48("18972") ? false : stryMutAct_9fa48("18971") ? true : (stryCov_9fa48("18971", "18972", "18973"), (stryMutAct_9fa48("18975") ? !emailError && emailTouched || email.trim() : stryMutAct_9fa48("18974") ? true : (stryCov_9fa48("18974", "18975"), (stryMutAct_9fa48("18977") ? !emailError || emailTouched : stryMutAct_9fa48("18976") ? true : (stryCov_9fa48("18976", "18977"), (stryMutAct_9fa48("18978") ? emailError : (stryCov_9fa48("18978"), !emailError)) && emailTouched)) && (stryMutAct_9fa48("18979") ? email : (stryCov_9fa48("18979"), email.trim())))) && <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>)}
            </div>
            {stryMutAct_9fa48("18982") ? emailError || <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError.message}
              </p> : stryMutAct_9fa48("18981") ? false : stryMutAct_9fa48("18980") ? true : (stryCov_9fa48("18980", "18981", "18982"), emailError && <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError.message}
              </p>)}
            {stryMutAct_9fa48("18985") ? !emailError && emailTouched && email.trim() || <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Email válido
              </p> : stryMutAct_9fa48("18984") ? false : stryMutAct_9fa48("18983") ? true : (stryCov_9fa48("18983", "18984", "18985"), (stryMutAct_9fa48("18987") ? !emailError && emailTouched || email.trim() : stryMutAct_9fa48("18986") ? true : (stryCov_9fa48("18986", "18987"), (stryMutAct_9fa48("18989") ? !emailError || emailTouched : stryMutAct_9fa48("18988") ? true : (stryCov_9fa48("18988", "18989"), (stryMutAct_9fa48("18990") ? emailError : (stryCov_9fa48("18990"), !emailError)) && emailTouched)) && (stryMutAct_9fa48("18991") ? email : (stryCov_9fa48("18991"), email.trim())))) && <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Email válido
              </p>)}
            <p className="text-xs text-muted-foreground">
              Si cambias tu email, deberás verificarlo nuevamente
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={stryMutAct_9fa48("18994") ? isLoading && !hasChanges : stryMutAct_9fa48("18993") ? false : stryMutAct_9fa48("18992") ? true : (stryCov_9fa48("18992", "18993", "18994"), isLoading || (stryMutAct_9fa48("18995") ? hasChanges : (stryCov_9fa48("18995"), !hasChanges)))} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={stryMutAct_9fa48("18998") ? (isLoading || !hasChanges) && !isFormValid : stryMutAct_9fa48("18997") ? false : stryMutAct_9fa48("18996") ? true : (stryCov_9fa48("18996", "18997", "18998"), (stryMutAct_9fa48("19000") ? isLoading && !hasChanges : stryMutAct_9fa48("18999") ? false : (stryCov_9fa48("18999", "19000"), isLoading || (stryMutAct_9fa48("19001") ? hasChanges : (stryCov_9fa48("19001"), !hasChanges)))) || (stryMutAct_9fa48("19002") ? isFormValid : (stryCov_9fa48("19002"), !isFormValid)))} className="flex-1">
              {isLoading ? <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </> : <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
  }
}