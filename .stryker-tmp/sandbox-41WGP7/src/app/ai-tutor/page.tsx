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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Loader2, Bot, Send, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { HelpIcon } from '@/components/help/help-icon';
import Link from 'next/link';
interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}
interface AIService {
  service: string;
  name: string;
  configured: boolean;
}
export default function AITutorPage() {
  if (stryMutAct_9fa48("1526")) {
    {}
  } else {
    stryCov_9fa48("1526");
    const [messages, setMessages] = useState<AIMessage[]>(stryMutAct_9fa48("1527") ? ["Stryker was here"] : (stryCov_9fa48("1527"), []));
    const [input, setInput] = useState(stryMutAct_9fa48("1528") ? "Stryker was here!" : (stryCov_9fa48("1528"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("1529") ? true : (stryCov_9fa48("1529"), false));
    const [availableServices, setAvailableServices] = useState<AIService[]>(stryMutAct_9fa48("1530") ? ["Stryker was here"] : (stryCov_9fa48("1530"), []));
    const [selectedService, setSelectedService] = useState<string>(stryMutAct_9fa48("1531") ? "Stryker was here!" : (stryCov_9fa48("1531"), ''));
    const [error, setError] = useState<string | null>(null);

    // Cargar servicios disponibles al montar
    useEffect(() => {
      if (stryMutAct_9fa48("1532")) {
        {}
      } else {
        stryCov_9fa48("1532");
        const loadServices = async () => {
          if (stryMutAct_9fa48("1533")) {
            {}
          } else {
            stryCov_9fa48("1533");
            try {
              if (stryMutAct_9fa48("1534")) {
                {}
              } else {
                stryCov_9fa48("1534");
                const res = await fetch(stryMutAct_9fa48("1535") ? "" : (stryCov_9fa48("1535"), '/api/ai/config'));
                const data = await res.json();
                if (stryMutAct_9fa48("1537") ? false : stryMutAct_9fa48("1536") ? true : (stryCov_9fa48("1536", "1537"), data.availableServices)) {
                  if (stryMutAct_9fa48("1538")) {
                    {}
                  } else {
                    stryCov_9fa48("1538");
                    setAvailableServices(data.availableServices);
                    if (stryMutAct_9fa48("1540") ? false : stryMutAct_9fa48("1539") ? true : (stryCov_9fa48("1539", "1540"), data.defaultService)) {
                      if (stryMutAct_9fa48("1541")) {
                        {}
                      } else {
                        stryCov_9fa48("1541");
                        setSelectedService(data.defaultService);
                      }
                    }
                  }
                }
              }
            } catch (err) {
              // Error silencioso - el usuario verá el mensaje en la UI
            }
          }
        };
        loadServices();
      }
    }, stryMutAct_9fa48("1542") ? ["Stryker was here"] : (stryCov_9fa48("1542"), []));
    const handleSend = async () => {
      if (stryMutAct_9fa48("1543")) {
        {}
      } else {
        stryCov_9fa48("1543");
        if (stryMutAct_9fa48("1546") ? !input.trim() && loading : stryMutAct_9fa48("1545") ? false : stryMutAct_9fa48("1544") ? true : (stryCov_9fa48("1544", "1545", "1546"), (stryMutAct_9fa48("1547") ? input.trim() : (stryCov_9fa48("1547"), !(stryMutAct_9fa48("1548") ? input : (stryCov_9fa48("1548"), input.trim())))) || loading)) return;
        const userMessage: AIMessage = stryMutAct_9fa48("1549") ? {} : (stryCov_9fa48("1549"), {
          role: stryMutAct_9fa48("1550") ? "" : (stryCov_9fa48("1550"), 'user'),
          content: input
        });
        const newMessages = stryMutAct_9fa48("1551") ? [] : (stryCov_9fa48("1551"), [...messages, userMessage]);
        setMessages(newMessages);
        setInput(stryMutAct_9fa48("1552") ? "Stryker was here!" : (stryCov_9fa48("1552"), ''));
        setLoading(stryMutAct_9fa48("1553") ? false : (stryCov_9fa48("1553"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("1554")) {
            {}
          } else {
            stryCov_9fa48("1554");
            const response = await fetch(stryMutAct_9fa48("1555") ? "" : (stryCov_9fa48("1555"), '/api/ai/chat'), stryMutAct_9fa48("1556") ? {} : (stryCov_9fa48("1556"), {
              method: stryMutAct_9fa48("1557") ? "" : (stryCov_9fa48("1557"), 'POST'),
              headers: stryMutAct_9fa48("1558") ? {} : (stryCov_9fa48("1558"), {
                'Content-Type': stryMutAct_9fa48("1559") ? "" : (stryCov_9fa48("1559"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("1560") ? {} : (stryCov_9fa48("1560"), {
                type: stryMutAct_9fa48("1561") ? "" : (stryCov_9fa48("1561"), 'chat'),
                messages: newMessages,
                service: stryMutAct_9fa48("1564") ? selectedService && undefined : stryMutAct_9fa48("1563") ? false : stryMutAct_9fa48("1562") ? true : (stryCov_9fa48("1562", "1563", "1564"), selectedService || undefined)
              }))
            }));
            const data = await response.json();
            if (stryMutAct_9fa48("1567") ? false : stryMutAct_9fa48("1566") ? true : stryMutAct_9fa48("1565") ? response.ok : (stryCov_9fa48("1565", "1566", "1567"), !response.ok)) {
              if (stryMutAct_9fa48("1568")) {
                {}
              } else {
                stryCov_9fa48("1568");
                throw new Error(stryMutAct_9fa48("1571") ? data.error && 'Error al obtener respuesta de IA' : stryMutAct_9fa48("1570") ? false : stryMutAct_9fa48("1569") ? true : (stryCov_9fa48("1569", "1570", "1571"), data.error || (stryMutAct_9fa48("1572") ? "" : (stryCov_9fa48("1572"), 'Error al obtener respuesta de IA'))));
              }
            }
            setMessages(stryMutAct_9fa48("1573") ? [] : (stryCov_9fa48("1573"), [...newMessages, stryMutAct_9fa48("1574") ? {} : (stryCov_9fa48("1574"), {
              role: stryMutAct_9fa48("1575") ? "" : (stryCov_9fa48("1575"), 'assistant'),
              content: data.content
            })]));
          }
        } catch (err) {
          if (stryMutAct_9fa48("1576")) {
            {}
          } else {
            stryCov_9fa48("1576");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("1577") ? "" : (stryCov_9fa48("1577"), 'Error desconocido'));
            setMessages(newMessages); // Mantener el mensaje del usuario aunque falle
          }
        } finally {
          if (stryMutAct_9fa48("1578")) {
            {}
          } else {
            stryCov_9fa48("1578");
            setLoading(stryMutAct_9fa48("1579") ? true : (stryCov_9fa48("1579"), false));
          }
        }
      }
    };
    return <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Tutor de IA</h1>
          <HelpIcon content="El Tutor de IA usa ChatGPT, Claude o Gemini para responder tus preguntas. Necesitas configurar al menos una API key en tu perfil. Puedes usar tus propias cuentas o compartidas." side="right" />
        </div>
        <p className="text-muted-foreground mt-2">
          Haz preguntas sobre los temas de PAES y recibe explicaciones personalizadas
        </p>
      </div>

      {/* Configuración de servicios */}
      {stryMutAct_9fa48("1582") ? availableServices.length > 0 || <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
            <CardDescription>Selecciona el servicio de IA que deseas usar</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map(service => <SelectItem key={service.service} value={service.service}>
                    {service.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              {availableServices.length === 1 ? 'Solo hay un servicio configurado' : `${availableServices.length} servicios disponibles`}
            </p>
          </CardContent>
        </Card> : stryMutAct_9fa48("1581") ? false : stryMutAct_9fa48("1580") ? true : (stryCov_9fa48("1580", "1581", "1582"), (stryMutAct_9fa48("1585") ? availableServices.length <= 0 : stryMutAct_9fa48("1584") ? availableServices.length >= 0 : stryMutAct_9fa48("1583") ? true : (stryCov_9fa48("1583", "1584", "1585"), availableServices.length > 0)) && <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
            <CardDescription>Selecciona el servicio de IA que deseas usar</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map(stryMutAct_9fa48("1586") ? () => undefined : (stryCov_9fa48("1586"), service => <SelectItem key={service.service} value={service.service}>
                    {service.name}
                  </SelectItem>))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              {(stryMutAct_9fa48("1589") ? availableServices.length !== 1 : stryMutAct_9fa48("1588") ? false : stryMutAct_9fa48("1587") ? true : (stryCov_9fa48("1587", "1588", "1589"), availableServices.length === 1)) ? stryMutAct_9fa48("1590") ? "" : (stryCov_9fa48("1590"), 'Solo hay un servicio configurado') : stryMutAct_9fa48("1591") ? `` : (stryCov_9fa48("1591"), `${availableServices.length} servicios disponibles`)}
            </p>
          </CardContent>
        </Card>)}

      {/* Alerta si no hay servicios */}
      {stryMutAct_9fa48("1594") ? availableServices.length === 0 || <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              No hay servicios de IA configurados. Para usar el Tutor de IA, necesitas configurar al
              menos una API key.
            </p>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div>
                <p className="font-semibold mb-2">
                  📝 Opción 1: Configuración por Usuario (Recomendado)
                </p>
                <p className="text-sm mb-2">
                  Configura tus propias API keys en tu perfil para usar tus cuentas existentes
                  (ChatGPT Plus, Claude Pro, Gemini).
                </p>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Ir a Configuración de Perfil
                  </Link>
                </Button>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">⚙️ Opción 2: Configuración Global (.env)</p>
                <p className="text-sm mb-2">
                  Agrega una de estas variables a tu archivo{' '}
                  <code className="bg-background px-1 py-0.5 rounded">.env</code>:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 font-mono bg-background p-2 rounded">
                  <li>ANTHROPIC_API_KEY=tu_clave_aqui (Claude)</li>
                  <li>OPENAI_API_KEY=tu_clave_aqui (ChatGPT)</li>
                  <li>GEMINI_API_KEY=tu_clave_aqui (Gemini)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Luego reinicia el servidor:{' '}
                  <code className="bg-background px-1 py-0.5 rounded">npm run dev</code>
                </p>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-semibold mb-1">📚 ¿Necesitas ayuda?</p>
              <p className="text-muted-foreground">
                Consulta la guía completa en:{' '}
                <code className="bg-background px-1 py-0.5 rounded">
                  GUIA_CONFIGURACION_API_KEYS.md
                </code>
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Obtén tus API keys en: Claude (console.anthropic.com), ChatGPT
                (platform.openai.com), Gemini (makersuite.google.com)
              </p>
            </div>
          </AlertDescription>
        </Alert> : stryMutAct_9fa48("1593") ? false : stryMutAct_9fa48("1592") ? true : (stryCov_9fa48("1592", "1593", "1594"), (stryMutAct_9fa48("1596") ? availableServices.length !== 0 : stryMutAct_9fa48("1595") ? true : (stryCov_9fa48("1595", "1596"), availableServices.length === 0)) && <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              No hay servicios de IA configurados. Para usar el Tutor de IA, necesitas configurar al
              menos una API key.
            </p>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div>
                <p className="font-semibold mb-2">
                  📝 Opción 1: Configuración por Usuario (Recomendado)
                </p>
                <p className="text-sm mb-2">
                  Configura tus propias API keys en tu perfil para usar tus cuentas existentes
                  (ChatGPT Plus, Claude Pro, Gemini).
                </p>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Ir a Configuración de Perfil
                  </Link>
                </Button>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">⚙️ Opción 2: Configuración Global (.env)</p>
                <p className="text-sm mb-2">
                  Agrega una de estas variables a tu archivo{stryMutAct_9fa48("1597") ? "" : (stryCov_9fa48("1597"), ' ')}
                  <code className="bg-background px-1 py-0.5 rounded">.env</code>:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 font-mono bg-background p-2 rounded">
                  <li>ANTHROPIC_API_KEY=tu_clave_aqui (Claude)</li>
                  <li>OPENAI_API_KEY=tu_clave_aqui (ChatGPT)</li>
                  <li>GEMINI_API_KEY=tu_clave_aqui (Gemini)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Luego reinicia el servidor:{stryMutAct_9fa48("1598") ? "" : (stryCov_9fa48("1598"), ' ')}
                  <code className="bg-background px-1 py-0.5 rounded">npm run dev</code>
                </p>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-semibold mb-1">📚 ¿Necesitas ayuda?</p>
              <p className="text-muted-foreground">
                Consulta la guía completa en:{stryMutAct_9fa48("1599") ? "" : (stryCov_9fa48("1599"), ' ')}
                <code className="bg-background px-1 py-0.5 rounded">
                  GUIA_CONFIGURACION_API_KEYS.md
                </code>
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Obtén tus API keys en: Claude (console.anthropic.com), ChatGPT
                (platform.openai.com), Gemini (makersuite.google.com)
              </p>
            </div>
          </AlertDescription>
        </Alert>)}

      {/* Chat */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Conversación
          </CardTitle>
          <CardDescription>Pregunta sobre cualquier tema de PAES</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mensajes */}
          <div className="space-y-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {(stryMutAct_9fa48("1602") ? messages.length !== 0 : stryMutAct_9fa48("1601") ? false : stryMutAct_9fa48("1600") ? true : (stryCov_9fa48("1600", "1601", "1602"), messages.length === 0)) ? <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Comienza una conversación haciendo una pregunta</p>
                <p className="text-sm mt-2">Ejemplo: "Explícame las ecuaciones cuadráticas"</p>
              </div> : messages.map(stryMutAct_9fa48("1603") ? () => undefined : (stryCov_9fa48("1603"), (msg, idx) => <div key={idx} className={stryMutAct_9fa48("1604") ? `` : (stryCov_9fa48("1604"), `flex ${(stryMutAct_9fa48("1607") ? msg.role !== 'user' : stryMutAct_9fa48("1606") ? false : stryMutAct_9fa48("1605") ? true : (stryCov_9fa48("1605", "1606", "1607"), msg.role === (stryMutAct_9fa48("1608") ? "" : (stryCov_9fa48("1608"), 'user')))) ? stryMutAct_9fa48("1609") ? "" : (stryCov_9fa48("1609"), 'justify-end') : stryMutAct_9fa48("1610") ? "" : (stryCov_9fa48("1610"), 'justify-start')}`)}>
                  <div className={stryMutAct_9fa48("1611") ? `` : (stryCov_9fa48("1611"), `max-w-[80%] rounded-lg p-3 ${(stryMutAct_9fa48("1614") ? msg.role !== 'user' : stryMutAct_9fa48("1613") ? false : stryMutAct_9fa48("1612") ? true : (stryCov_9fa48("1612", "1613", "1614"), msg.role === (stryMutAct_9fa48("1615") ? "" : (stryCov_9fa48("1615"), 'user')))) ? stryMutAct_9fa48("1616") ? "" : (stryCov_9fa48("1616"), 'bg-primary text-primary-foreground') : stryMutAct_9fa48("1617") ? "" : (stryCov_9fa48("1617"), 'bg-muted')}`)}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>))}
            {stryMutAct_9fa48("1620") ? loading || <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div> : stryMutAct_9fa48("1619") ? false : stryMutAct_9fa48("1618") ? true : (stryCov_9fa48("1618", "1619", "1620"), loading && <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>)}
          </div>

          {/* Error */}
          {stryMutAct_9fa48("1623") ? error || <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert> : stryMutAct_9fa48("1622") ? false : stryMutAct_9fa48("1621") ? true : (stryCov_9fa48("1621", "1622", "1623"), error && <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>)}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea value={input} onChange={stryMutAct_9fa48("1624") ? () => undefined : (stryCov_9fa48("1624"), e => setInput(e.target.value))} onKeyDown={e => {
              if (stryMutAct_9fa48("1625")) {
                {}
              } else {
                stryCov_9fa48("1625");
                if (stryMutAct_9fa48("1628") ? e.key === 'Enter' || !e.shiftKey : stryMutAct_9fa48("1627") ? false : stryMutAct_9fa48("1626") ? true : (stryCov_9fa48("1626", "1627", "1628"), (stryMutAct_9fa48("1630") ? e.key !== 'Enter' : stryMutAct_9fa48("1629") ? true : (stryCov_9fa48("1629", "1630"), e.key === (stryMutAct_9fa48("1631") ? "" : (stryCov_9fa48("1631"), 'Enter')))) && (stryMutAct_9fa48("1632") ? e.shiftKey : (stryCov_9fa48("1632"), !e.shiftKey)))) {
                  if (stryMutAct_9fa48("1633")) {
                    {}
                  } else {
                    stryCov_9fa48("1633");
                    e.preventDefault();
                    handleSend();
                  }
                }
              }
            }} placeholder="Escribe tu pregunta aquí..." disabled={stryMutAct_9fa48("1636") ? loading && availableServices.length === 0 : stryMutAct_9fa48("1635") ? false : stryMutAct_9fa48("1634") ? true : (stryCov_9fa48("1634", "1635", "1636"), loading || (stryMutAct_9fa48("1638") ? availableServices.length !== 0 : stryMutAct_9fa48("1637") ? false : (stryCov_9fa48("1637", "1638"), availableServices.length === 0)))} rows={3} />
            <Button onClick={handleSend} disabled={stryMutAct_9fa48("1641") ? (loading || !input.trim()) && availableServices.length === 0 : stryMutAct_9fa48("1640") ? false : stryMutAct_9fa48("1639") ? true : (stryCov_9fa48("1639", "1640", "1641"), (stryMutAct_9fa48("1643") ? loading && !input.trim() : stryMutAct_9fa48("1642") ? false : (stryCov_9fa48("1642", "1643"), loading || (stryMutAct_9fa48("1644") ? input.trim() : (stryCov_9fa48("1644"), !(stryMutAct_9fa48("1645") ? input : (stryCov_9fa48("1645"), input.trim())))))) || (stryMutAct_9fa48("1647") ? availableServices.length !== 0 : stryMutAct_9fa48("1646") ? false : (stryCov_9fa48("1646", "1647"), availableServices.length === 0)))} size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>¿Cómo funciona?</strong> El Tutor de IA utiliza modelos avanzados de lenguaje
            para responder tus preguntas sobre los temas de PAES.
          </p>
          <p>
            <strong>Servicios disponibles:</strong> Puedes usar Claude (Anthropic), ChatGPT (OpenAI)
            o Gemini (Google) según tengas configurado.
          </p>
          <p>
            <strong>Privacidad:</strong> Las API keys se almacenan de forma segura y solo se usan
            para procesar tus consultas.
          </p>
        </CardContent>
      </Card>
    </div>;
  }
}