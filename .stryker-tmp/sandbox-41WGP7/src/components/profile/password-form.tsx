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
import { Loader2, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { HelpIcon } from '@/components/help/help-icon';
import { TIME_CONSTANTS } from '@/lib/constants';
interface PasswordFormProps {
  onSuccess?: () => void;
}
export function PasswordForm({
  onSuccess
}: PasswordFormProps) {
  if (stryMutAct_9fa48("18609")) {
    {}
  } else {
    stryCov_9fa48("18609");
    const [currentPassword, setCurrentPassword] = useState(stryMutAct_9fa48("18610") ? "Stryker was here!" : (stryCov_9fa48("18610"), ''));
    const [newPassword, setNewPassword] = useState(stryMutAct_9fa48("18611") ? "Stryker was here!" : (stryCov_9fa48("18611"), ''));
    const [confirmPassword, setConfirmPassword] = useState(stryMutAct_9fa48("18612") ? "Stryker was here!" : (stryCov_9fa48("18612"), ''));
    const [showCurrentPassword, setShowCurrentPassword] = useState(stryMutAct_9fa48("18613") ? true : (stryCov_9fa48("18613"), false));
    const [showNewPassword, setShowNewPassword] = useState(stryMutAct_9fa48("18614") ? true : (stryCov_9fa48("18614"), false));
    const [showConfirmPassword, setShowConfirmPassword] = useState(stryMutAct_9fa48("18615") ? true : (stryCov_9fa48("18615"), false));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("18616") ? true : (stryCov_9fa48("18616"), false));
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(stryMutAct_9fa48("18617") ? true : (stryCov_9fa48("18617"), false));

    // Ref para limpiar timeout al desmontar
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Limpiar timeout al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("18618")) {
        {}
      } else {
        stryCov_9fa48("18618");
        return () => {
          if (stryMutAct_9fa48("18619")) {
            {}
          } else {
            stryCov_9fa48("18619");
            if (stryMutAct_9fa48("18621") ? false : stryMutAct_9fa48("18620") ? true : (stryCov_9fa48("18620", "18621"), successTimeoutRef.current)) {
              if (stryMutAct_9fa48("18622")) {
                {}
              } else {
                stryCov_9fa48("18622");
                clearTimeout(successTimeoutRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("18623") ? ["Stryker was here"] : (stryCov_9fa48("18623"), []));
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("18624")) {
        {}
      } else {
        stryCov_9fa48("18624");
        e.preventDefault();
        setError(null);
        setSuccess(stryMutAct_9fa48("18625") ? true : (stryCov_9fa48("18625"), false));
        setIsLoading(stryMutAct_9fa48("18626") ? false : (stryCov_9fa48("18626"), true));
        try {
          if (stryMutAct_9fa48("18627")) {
            {}
          } else {
            stryCov_9fa48("18627");
            // Validación básica
            if (stryMutAct_9fa48("18630") ? false : stryMutAct_9fa48("18629") ? true : stryMutAct_9fa48("18628") ? currentPassword : (stryCov_9fa48("18628", "18629", "18630"), !currentPassword)) {
              if (stryMutAct_9fa48("18631")) {
                {}
              } else {
                stryCov_9fa48("18631");
                setError(stryMutAct_9fa48("18632") ? "" : (stryCov_9fa48("18632"), 'La contraseña actual es requerida'));
                setIsLoading(stryMutAct_9fa48("18633") ? true : (stryCov_9fa48("18633"), false));
                return;
              }
            }
            if (stryMutAct_9fa48("18637") ? newPassword.length >= 8 : stryMutAct_9fa48("18636") ? newPassword.length <= 8 : stryMutAct_9fa48("18635") ? false : stryMutAct_9fa48("18634") ? true : (stryCov_9fa48("18634", "18635", "18636", "18637"), newPassword.length < 8)) {
              if (stryMutAct_9fa48("18638")) {
                {}
              } else {
                stryCov_9fa48("18638");
                setError(stryMutAct_9fa48("18639") ? "" : (stryCov_9fa48("18639"), 'La nueva contraseña debe tener al menos 8 caracteres'));
                setIsLoading(stryMutAct_9fa48("18640") ? true : (stryCov_9fa48("18640"), false));
                return;
              }
            }
            if (stryMutAct_9fa48("18643") ? false : stryMutAct_9fa48("18642") ? true : stryMutAct_9fa48("18641") ? /[A-Z]/.test(newPassword) : (stryCov_9fa48("18641", "18642", "18643"), !(stryMutAct_9fa48("18644") ? /[^A-Z]/ : (stryCov_9fa48("18644"), /[A-Z]/)).test(newPassword))) {
              if (stryMutAct_9fa48("18645")) {
                {}
              } else {
                stryCov_9fa48("18645");
                setError(stryMutAct_9fa48("18646") ? "" : (stryCov_9fa48("18646"), 'La contraseña debe contener al menos una mayúscula'));
                setIsLoading(stryMutAct_9fa48("18647") ? true : (stryCov_9fa48("18647"), false));
                return;
              }
            }
            if (stryMutAct_9fa48("18650") ? false : stryMutAct_9fa48("18649") ? true : stryMutAct_9fa48("18648") ? /[a-z]/.test(newPassword) : (stryCov_9fa48("18648", "18649", "18650"), !(stryMutAct_9fa48("18651") ? /[^a-z]/ : (stryCov_9fa48("18651"), /[a-z]/)).test(newPassword))) {
              if (stryMutAct_9fa48("18652")) {
                {}
              } else {
                stryCov_9fa48("18652");
                setError(stryMutAct_9fa48("18653") ? "" : (stryCov_9fa48("18653"), 'La contraseña debe contener al menos una minúscula'));
                setIsLoading(stryMutAct_9fa48("18654") ? true : (stryCov_9fa48("18654"), false));
                return;
              }
            }
            if (stryMutAct_9fa48("18657") ? false : stryMutAct_9fa48("18656") ? true : stryMutAct_9fa48("18655") ? /[0-9]/.test(newPassword) : (stryCov_9fa48("18655", "18656", "18657"), !(stryMutAct_9fa48("18658") ? /[^0-9]/ : (stryCov_9fa48("18658"), /[0-9]/)).test(newPassword))) {
              if (stryMutAct_9fa48("18659")) {
                {}
              } else {
                stryCov_9fa48("18659");
                setError(stryMutAct_9fa48("18660") ? "" : (stryCov_9fa48("18660"), 'La contraseña debe contener al menos un número'));
                setIsLoading(stryMutAct_9fa48("18661") ? true : (stryCov_9fa48("18661"), false));
                return;
              }
            }
            if (stryMutAct_9fa48("18664") ? newPassword === confirmPassword : stryMutAct_9fa48("18663") ? false : stryMutAct_9fa48("18662") ? true : (stryCov_9fa48("18662", "18663", "18664"), newPassword !== confirmPassword)) {
              if (stryMutAct_9fa48("18665")) {
                {}
              } else {
                stryCov_9fa48("18665");
                setError(stryMutAct_9fa48("18666") ? "" : (stryCov_9fa48("18666"), 'Las contraseñas no coinciden'));
                setIsLoading(stryMutAct_9fa48("18667") ? true : (stryCov_9fa48("18667"), false));
                return;
              }
            }
            const res = await fetch(stryMutAct_9fa48("18668") ? "" : (stryCov_9fa48("18668"), '/api/user/password'), stryMutAct_9fa48("18669") ? {} : (stryCov_9fa48("18669"), {
              method: stryMutAct_9fa48("18670") ? "" : (stryCov_9fa48("18670"), 'PUT'),
              headers: stryMutAct_9fa48("18671") ? {} : (stryCov_9fa48("18671"), {
                'Content-Type': stryMutAct_9fa48("18672") ? "" : (stryCov_9fa48("18672"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("18673") ? {} : (stryCov_9fa48("18673"), {
                currentPassword,
                newPassword,
                confirmPassword
              }))
            }));
            const data = await res.json();
            if (stryMutAct_9fa48("18676") ? false : stryMutAct_9fa48("18675") ? true : stryMutAct_9fa48("18674") ? res.ok : (stryCov_9fa48("18674", "18675", "18676"), !res.ok)) {
              if (stryMutAct_9fa48("18677")) {
                {}
              } else {
                stryCov_9fa48("18677");
                throw new Error(stryMutAct_9fa48("18680") ? data.error && 'Error al cambiar contraseña' : stryMutAct_9fa48("18679") ? false : stryMutAct_9fa48("18678") ? true : (stryCov_9fa48("18678", "18679", "18680"), data.error || (stryMutAct_9fa48("18681") ? "" : (stryCov_9fa48("18681"), 'Error al cambiar contraseña'))));
              }
            }
            setSuccess(stryMutAct_9fa48("18682") ? false : (stryCov_9fa48("18682"), true));
            setCurrentPassword(stryMutAct_9fa48("18683") ? "Stryker was here!" : (stryCov_9fa48("18683"), ''));
            setNewPassword(stryMutAct_9fa48("18684") ? "Stryker was here!" : (stryCov_9fa48("18684"), ''));
            setConfirmPassword(stryMutAct_9fa48("18685") ? "Stryker was here!" : (stryCov_9fa48("18685"), ''));
            if (stryMutAct_9fa48("18687") ? false : stryMutAct_9fa48("18686") ? true : (stryCov_9fa48("18686", "18687"), onSuccess)) {
              if (stryMutAct_9fa48("18688")) {
                {}
              } else {
                stryCov_9fa48("18688");
                onSuccess();
              }
            }

            // Ocultar mensaje de éxito después de 3 segundos
            // Limpiar timeout anterior si existe
            if (stryMutAct_9fa48("18690") ? false : stryMutAct_9fa48("18689") ? true : (stryCov_9fa48("18689", "18690"), successTimeoutRef.current)) {
              if (stryMutAct_9fa48("18691")) {
                {}
              } else {
                stryCov_9fa48("18691");
                clearTimeout(successTimeoutRef.current);
              }
            }
            successTimeoutRef.current = setTimeout(stryMutAct_9fa48("18692") ? () => undefined : (stryCov_9fa48("18692"), () => setSuccess(stryMutAct_9fa48("18693") ? true : (stryCov_9fa48("18693"), false))), TIME_CONSTANTS.SUCCESS_MESSAGE_DISPLAY_MS);
          }
        } catch (err) {
          if (stryMutAct_9fa48("18694")) {
            {}
          } else {
            stryCov_9fa48("18694");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("18695") ? "" : (stryCov_9fa48("18695"), 'Error al cambiar contraseña'));
          }
        } finally {
          if (stryMutAct_9fa48("18696")) {
            {}
          } else {
            stryCov_9fa48("18696");
            setIsLoading(stryMutAct_9fa48("18697") ? true : (stryCov_9fa48("18697"), false));
          }
        }
      }
    };
    const hasChanges = stryMutAct_9fa48("18700") ? (currentPassword || newPassword) && confirmPassword : stryMutAct_9fa48("18699") ? false : stryMutAct_9fa48("18698") ? true : (stryCov_9fa48("18698", "18699", "18700"), (stryMutAct_9fa48("18702") ? currentPassword && newPassword : stryMutAct_9fa48("18701") ? false : (stryCov_9fa48("18701", "18702"), currentPassword || newPassword)) || confirmPassword);
    return <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Cambiar Contraseña
          </CardTitle>
          <HelpIcon content="Tu contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números. Cámbiala regularmente por seguridad." />
        </div>
        <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {stryMutAct_9fa48("18705") ? error || <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div> : stryMutAct_9fa48("18704") ? false : stryMutAct_9fa48("18703") ? true : (stryCov_9fa48("18703", "18704", "18705"), error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>)}

          {stryMutAct_9fa48("18708") ? success || <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Contraseña actualizada exitosamente</span>
            </div> : stryMutAct_9fa48("18707") ? false : stryMutAct_9fa48("18706") ? true : (stryCov_9fa48("18706", "18707", "18708"), success && <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Contraseña actualizada exitosamente</span>
            </div>)}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <div className="relative">
              <Input id="currentPassword" type={showCurrentPassword ? stryMutAct_9fa48("18709") ? "" : (stryCov_9fa48("18709"), 'text') : stryMutAct_9fa48("18710") ? "" : (stryCov_9fa48("18710"), 'password')} value={currentPassword} onChange={stryMutAct_9fa48("18711") ? () => undefined : (stryCov_9fa48("18711"), e => setCurrentPassword(e.target.value))} placeholder="Ingresa tu contraseña actual" required />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={stryMutAct_9fa48("18712") ? () => undefined : (stryCov_9fa48("18712"), () => setShowCurrentPassword(stryMutAct_9fa48("18713") ? showCurrentPassword : (stryCov_9fa48("18713"), !showCurrentPassword)))}>
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input id="newPassword" type={showNewPassword ? stryMutAct_9fa48("18714") ? "" : (stryCov_9fa48("18714"), 'text') : stryMutAct_9fa48("18715") ? "" : (stryCov_9fa48("18715"), 'password')} value={newPassword} onChange={stryMutAct_9fa48("18716") ? () => undefined : (stryCov_9fa48("18716"), e => setNewPassword(e.target.value))} placeholder="Mínimo 8 caracteres" required minLength={8} />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={stryMutAct_9fa48("18717") ? () => undefined : (stryCov_9fa48("18717"), () => setShowNewPassword(stryMutAct_9fa48("18718") ? showNewPassword : (stryCov_9fa48("18718"), !showNewPassword)))}>
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número
              </p>
              <HelpIcon content="Ejemplo de contraseña segura: MiClave123. Evita usar información personal o palabras comunes." side="right" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirmPassword ? stryMutAct_9fa48("18719") ? "" : (stryCov_9fa48("18719"), 'text') : stryMutAct_9fa48("18720") ? "" : (stryCov_9fa48("18720"), 'password')} value={confirmPassword} onChange={stryMutAct_9fa48("18721") ? () => undefined : (stryCov_9fa48("18721"), e => setConfirmPassword(e.target.value))} placeholder="Confirma tu nueva contraseña" required minLength={8} />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={stryMutAct_9fa48("18722") ? () => undefined : (stryCov_9fa48("18722"), () => setShowConfirmPassword(stryMutAct_9fa48("18723") ? showConfirmPassword : (stryCov_9fa48("18723"), !showConfirmPassword)))}>
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={stryMutAct_9fa48("18726") ? isLoading && !hasChanges : stryMutAct_9fa48("18725") ? false : stryMutAct_9fa48("18724") ? true : (stryCov_9fa48("18724", "18725", "18726"), isLoading || (stryMutAct_9fa48("18727") ? hasChanges : (stryCov_9fa48("18727"), !hasChanges)))} className="w-full">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cambiando...
              </> : stryMutAct_9fa48("18728") ? "" : (stryCov_9fa48("18728"), 'Cambiar Contraseña')}
          </Button>
        </form>
      </CardContent>
    </Card>;
  }
}