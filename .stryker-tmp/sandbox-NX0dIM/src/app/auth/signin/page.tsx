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
import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { validateEmail, validatePassword } from '@/lib/validation-helpers';
function SignInForm() {
  if (stryMutAct_9fa48("11640")) {
    {}
  } else {
    stryCov_9fa48("11640");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(stryMutAct_9fa48("11641") ? "Stryker was here!" : (stryCov_9fa48("11641"), ''));
    const [password, setPassword] = useState(stryMutAct_9fa48("11642") ? "Stryker was here!" : (stryCov_9fa48("11642"), ''));
    const [error, setError] = useState(stryMutAct_9fa48("11643") ? "Stryker was here!" : (stryCov_9fa48("11643"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("11644") ? true : (stryCov_9fa48("11644"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("11645")) {
        {}
      } else {
        stryCov_9fa48("11645");
        const errorParam = searchParams.get(stryMutAct_9fa48("11646") ? "" : (stryCov_9fa48("11646"), 'error'));
        if (stryMutAct_9fa48("11649") ? errorParam !== 'CredentialsSignin' : stryMutAct_9fa48("11648") ? false : stryMutAct_9fa48("11647") ? true : (stryCov_9fa48("11647", "11648", "11649"), errorParam === (stryMutAct_9fa48("11650") ? "" : (stryCov_9fa48("11650"), 'CredentialsSignin')))) {
          if (stryMutAct_9fa48("11651")) {
            {}
          } else {
            stryCov_9fa48("11651");
            setError(stryMutAct_9fa48("11652") ? "" : (stryCov_9fa48("11652"), 'Credenciales inválidas'));
          }
        }
      }
    }, stryMutAct_9fa48("11653") ? [] : (stryCov_9fa48("11653"), [searchParams]));
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("11654")) {
        {}
      } else {
        stryCov_9fa48("11654");
        e.preventDefault();
        setError(stryMutAct_9fa48("11655") ? "Stryker was here!" : (stryCov_9fa48("11655"), ''));
        setLoading(stryMutAct_9fa48("11656") ? false : (stryCov_9fa48("11656"), true));

        // Validación de email usando helper
        const emailValidation = validateEmail(email);
        if (stryMutAct_9fa48("11659") ? false : stryMutAct_9fa48("11658") ? true : stryMutAct_9fa48("11657") ? emailValidation.isValid : (stryCov_9fa48("11657", "11658", "11659"), !emailValidation.isValid)) {
          if (stryMutAct_9fa48("11660")) {
            {}
          } else {
            stryCov_9fa48("11660");
            setError(stryMutAct_9fa48("11663") ? emailValidation.error && 'Por favor ingresa un email válido' : stryMutAct_9fa48("11662") ? false : stryMutAct_9fa48("11661") ? true : (stryCov_9fa48("11661", "11662", "11663"), emailValidation.error || (stryMutAct_9fa48("11664") ? "" : (stryCov_9fa48("11664"), 'Por favor ingresa un email válido'))));
            setLoading(stryMutAct_9fa48("11665") ? true : (stryCov_9fa48("11665"), false));
            return;
          }
        }

        // Validación de contraseña usando helper
        const passwordValidation = validatePassword(password);
        if (stryMutAct_9fa48("11668") ? false : stryMutAct_9fa48("11667") ? true : stryMutAct_9fa48("11666") ? passwordValidation.isValid : (stryCov_9fa48("11666", "11667", "11668"), !passwordValidation.isValid)) {
          if (stryMutAct_9fa48("11669")) {
            {}
          } else {
            stryCov_9fa48("11669");
            setError(stryMutAct_9fa48("11672") ? passwordValidation.error && 'Contraseña inválida' : stryMutAct_9fa48("11671") ? false : stryMutAct_9fa48("11670") ? true : (stryCov_9fa48("11670", "11671", "11672"), passwordValidation.error || (stryMutAct_9fa48("11673") ? "" : (stryCov_9fa48("11673"), 'Contraseña inválida'))));
            setLoading(stryMutAct_9fa48("11674") ? true : (stryCov_9fa48("11674"), false));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("11675")) {
            {}
          } else {
            stryCov_9fa48("11675");
            const callbackUrl = stryMutAct_9fa48("11678") ? searchParams.get('callbackUrl') && '/dashboard' : stryMutAct_9fa48("11677") ? false : stryMutAct_9fa48("11676") ? true : (stryCov_9fa48("11676", "11677", "11678"), searchParams.get(stryMutAct_9fa48("11679") ? "" : (stryCov_9fa48("11679"), 'callbackUrl')) || (stryMutAct_9fa48("11680") ? "" : (stryCov_9fa48("11680"), '/dashboard')));
            const result = await signIn(stryMutAct_9fa48("11681") ? "" : (stryCov_9fa48("11681"), 'credentials'), stryMutAct_9fa48("11682") ? {} : (stryCov_9fa48("11682"), {
              email,
              password,
              redirect: stryMutAct_9fa48("11683") ? true : (stryCov_9fa48("11683"), false),
              callbackUrl
            }));
            if (stryMutAct_9fa48("11686") ? result.error : stryMutAct_9fa48("11685") ? false : stryMutAct_9fa48("11684") ? true : (stryCov_9fa48("11684", "11685", "11686"), result?.error)) {
              if (stryMutAct_9fa48("11687")) {
                {}
              } else {
                stryCov_9fa48("11687");
                setError(stryMutAct_9fa48("11688") ? "" : (stryCov_9fa48("11688"), 'Credenciales inválidas'));
              }
            } else if (stryMutAct_9fa48("11691") ? result.ok : stryMutAct_9fa48("11690") ? false : stryMutAct_9fa48("11689") ? true : (stryCov_9fa48("11689", "11690", "11691"), result?.ok)) {
              if (stryMutAct_9fa48("11692")) {
                {}
              } else {
                stryCov_9fa48("11692");
                router.push(callbackUrl);
                router.refresh();
              }
            }
          }
        } catch (err) {
          if (stryMutAct_9fa48("11693")) {
            {}
          } else {
            stryCov_9fa48("11693");
            setError(stryMutAct_9fa48("11694") ? "" : (stryCov_9fa48("11694"), 'Error al iniciar sesión. Por favor intenta nuevamente.'));
          }
        } finally {
          if (stryMutAct_9fa48("11695")) {
            {}
          } else {
            stryCov_9fa48("11695");
            setLoading(stryMutAct_9fa48("11696") ? true : (stryCov_9fa48("11696"), false));
          }
        }
      }
    };
    return <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a PAES Tutor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
          {stryMutAct_9fa48("11699") ? error || <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div> : stryMutAct_9fa48("11698") ? false : stryMutAct_9fa48("11697") ? true : (stryCov_9fa48("11697", "11698", "11699"), error && <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>)}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={stryMutAct_9fa48("11700") ? () => undefined : (stryCov_9fa48("11700"), e => setEmail(e.target.value))} required disabled={loading} suppressHydrationWarning autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={stryMutAct_9fa48("11701") ? () => undefined : (stryCov_9fa48("11701"), e => setPassword(e.target.value))} required disabled={loading} suppressHydrationWarning autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? stryMutAct_9fa48("11702") ? "" : (stryCov_9fa48("11702"), 'Iniciando sesión...') : stryMutAct_9fa48("11703") ? "" : (stryCov_9fa48("11703"), 'Iniciar Sesión')}
          </Button>
        </form>
      </CardContent>
    </Card>;
  }
}
export default function SignInPage() {
  if (stryMutAct_9fa48("11704")) {
    {}
  } else {
    stryCov_9fa48("11704");
    return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Suspense fallback={<Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </CardContent>
          </Card>}>
        <SignInForm />
      </Suspense>
    </div>;
  }
}