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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserForm } from '@/components/profile/user-form';
import { PasswordForm } from '@/components/profile/password-form';
import { AIKeysForm } from '@/components/profile/ai-keys-form';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { User, Mail, Calendar, Loader2, AlertCircle, ArrowLeft, Shield, Settings } from 'lucide-react';
import { HelpIcon } from '@/components/help/help-icon';
import { ShortcutsSettings } from '@/components/settings/shortcuts-settings';
import { ExpertMode } from '@/components/settings/expert-mode';
import { getAvailableShortcutActions } from '@/lib/shortcut-actions';
interface UserData {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  student: {
    id: string;
    nombre: string;
  } | null;
}
export default function ProfilePage() {
  if (stryMutAct_9fa48("14992")) {
    {}
  } else {
    stryCov_9fa48("14992");
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("14993") ? false : (stryCov_9fa48("14993"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("14994")) {
        {}
      } else {
        stryCov_9fa48("14994");
        async function loadUserData() {
          if (stryMutAct_9fa48("14995")) {
            {}
          } else {
            stryCov_9fa48("14995");
            try {
              if (stryMutAct_9fa48("14996")) {
                {}
              } else {
                stryCov_9fa48("14996");
                setIsLoading(stryMutAct_9fa48("14997") ? false : (stryCov_9fa48("14997"), true));
                setError(null);
                const res = await fetch(stryMutAct_9fa48("14998") ? "" : (stryCov_9fa48("14998"), '/api/user'));
                if (stryMutAct_9fa48("15001") ? res.status !== 401 : stryMutAct_9fa48("15000") ? false : stryMutAct_9fa48("14999") ? true : (stryCov_9fa48("14999", "15000", "15001"), res.status === 401)) {
                  if (stryMutAct_9fa48("15002")) {
                    {}
                  } else {
                    stryCov_9fa48("15002");
                    router.push(stryMutAct_9fa48("15003") ? "" : (stryCov_9fa48("15003"), '/auth/signin?callbackUrl=/profile'));
                    return;
                  }
                }
                if (stryMutAct_9fa48("15006") ? false : stryMutAct_9fa48("15005") ? true : stryMutAct_9fa48("15004") ? res.ok : (stryCov_9fa48("15004", "15005", "15006"), !res.ok)) {
                  if (stryMutAct_9fa48("15007")) {
                    {}
                  } else {
                    stryCov_9fa48("15007");
                    throw new Error(stryMutAct_9fa48("15008") ? "" : (stryCov_9fa48("15008"), 'Error al cargar información del usuario'));
                  }
                }
                const data = await res.json();
                setUserData(data);
              }
            } catch (err) {
              if (stryMutAct_9fa48("15009")) {
                {}
              } else {
                stryCov_9fa48("15009");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("15010") ? "" : (stryCov_9fa48("15010"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("15011")) {
                {}
              } else {
                stryCov_9fa48("15011");
                setIsLoading(stryMutAct_9fa48("15012") ? true : (stryCov_9fa48("15012"), false));
              }
            }
          }
        }
        loadUserData();
      }
    }, stryMutAct_9fa48("15013") ? [] : (stryCov_9fa48("15013"), [router]));
    const handleUpdateSuccess = () => {
      if (stryMutAct_9fa48("15014")) {
        {}
      } else {
        stryCov_9fa48("15014");
        // Recargar datos del usuario
        fetch(stryMutAct_9fa48("15015") ? "" : (stryCov_9fa48("15015"), '/api/user')).then(stryMutAct_9fa48("15016") ? () => undefined : (stryCov_9fa48("15016"), res => res.json())).then(stryMutAct_9fa48("15017") ? () => undefined : (stryCov_9fa48("15017"), data => setUserData(data))).catch(() => {
          // Silenciar errores al recargar
        });
      }
    };
    if (stryMutAct_9fa48("15019") ? false : stryMutAct_9fa48("15018") ? true : (stryCov_9fa48("15018", "15019"), isLoading)) {
      if (stryMutAct_9fa48("15020")) {
        {}
      } else {
        stryCov_9fa48("15020");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("15023") ? error && !userData : stryMutAct_9fa48("15022") ? false : stryMutAct_9fa48("15021") ? true : (stryCov_9fa48("15021", "15022", "15023"), error || (stryMutAct_9fa48("15024") ? userData : (stryCov_9fa48("15024"), !userData)))) {
      if (stryMutAct_9fa48("15025")) {
        {}
      } else {
        stryCov_9fa48("15025");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("15028") ? error && 'No se pudo cargar el perfil' : stryMutAct_9fa48("15027") ? false : stryMutAct_9fa48("15026") ? true : (stryCov_9fa48("15026", "15027", "15028"), error || (stryMutAct_9fa48("15029") ? "" : (stryCov_9fa48("15029"), 'No se pudo cargar el perfil')))}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("15030") ? () => undefined : (stryCov_9fa48("15030"), () => router.push(stryMutAct_9fa48("15031") ? "" : (stryCov_9fa48("15031"), '/dashboard')))}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={stryMutAct_9fa48("15032") ? [] : (stryCov_9fa48("15032"), [stryMutAct_9fa48("15033") ? {} : (stryCov_9fa48("15033"), {
          label: stryMutAct_9fa48("15034") ? "" : (stryCov_9fa48("15034"), 'Inicio'),
          href: stryMutAct_9fa48("15035") ? "" : (stryCov_9fa48("15035"), '/')
        }), stryMutAct_9fa48("15036") ? {} : (stryCov_9fa48("15036"), {
          label: stryMutAct_9fa48("15037") ? "" : (stryCov_9fa48("15037"), 'Dashboard'),
          href: stryMutAct_9fa48("15038") ? "" : (stryCov_9fa48("15038"), '/dashboard')
        }), stryMutAct_9fa48("15039") ? {} : (stryCov_9fa48("15039"), {
          label: stryMutAct_9fa48("15040") ? "" : (stryCov_9fa48("15040"), 'Perfil')
        })])} />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("15041") ? () => undefined : (stryCov_9fa48("15041"), () => router.back())}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <HelpIcon content="Aquí puedes actualizar tu información personal, cambiar tu contraseña y configurar tus API keys para usar el Tutor de IA." side="right" />
          </div>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
      </div>

      {/* Información de Cuenta */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Información de Cuenta
          </CardTitle>
          <CardDescription>Detalles de tu cuenta de usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ID de Usuario</p>
              <p className="text-sm font-mono">{userData.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
              <p className="text-sm">
                {new Date(userData.createdAt).toLocaleDateString(stryMutAct_9fa48("15042") ? "" : (stryCov_9fa48("15042"), 'es-CL'), stryMutAct_9fa48("15043") ? {} : (stryCov_9fa48("15043"), {
                  year: stryMutAct_9fa48("15044") ? "" : (stryCov_9fa48("15044"), 'numeric'),
                  month: stryMutAct_9fa48("15045") ? "" : (stryCov_9fa48("15045"), 'long'),
                  day: stryMutAct_9fa48("15046") ? "" : (stryCov_9fa48("15046"), 'numeric')
                }))}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Estado de Email</p>
              <div className="flex items-center gap-2">
                {userData.emailVerified ? <Badge variant="default" className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Verificado
                  </Badge> : <Badge variant="secondary">No verificado</Badge>}
              </div>
            </div>
            {stryMutAct_9fa48("15049") ? userData.student || <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID de Estudiante</p>
                <p className="text-sm font-mono">{userData.student.id}</p>
              </div> : stryMutAct_9fa48("15048") ? false : stryMutAct_9fa48("15047") ? true : (stryCov_9fa48("15047", "15048", "15049"), userData.student && <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID de Estudiante</p>
                <p className="text-sm font-mono">{userData.student.id}</p>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Información Personal */}
      <div className="mb-6">
        <UserForm initialData={stryMutAct_9fa48("15050") ? {} : (stryCov_9fa48("15050"), {
          name: userData.name,
          email: userData.email
        })} onSuccess={handleUpdateSuccess} />
      </div>

      {/* Formulario de Cambio de Contraseña */}
      <div className="mb-6">
        <PasswordForm onSuccess={handleUpdateSuccess} />
      </div>

      {/* Configuración de API Keys de IA */}
      <div className="mb-6">
        <AIKeysForm />
      </div>

      {/* Configuración de Atajos de Teclado */}
      <div className="mb-6">
        <ShortcutsSettings availableActions={getAvailableShortcutActions(router)} />
      </div>

      {/* Modo Experto */}
      <div className="mb-6">
        <ExpertMode />
      </div>

      {/* Información de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>Recomendaciones para mantener tu cuenta segura</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Usa una contraseña única y segura que no uses en otros sitios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Cambia tu contraseña regularmente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>No compartas tu contraseña con nadie</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                Verifica que tu email esté actualizado para recuperar tu cuenta si es necesario
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>;
  }
}