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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, Search, BarChart3, FileText, Bot, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { QuickGuide } from '@/components/help/quick-guide';
import Link from 'next/link';
const HELP_SECTIONS = stryMutAct_9fa48("13877") ? [] : (stryCov_9fa48("13877"), [stryMutAct_9fa48("13878") ? {} : (stryCov_9fa48("13878"), {
  id: stryMutAct_9fa48("13879") ? "" : (stryCov_9fa48("13879"), 'getting-started'),
  title: stryMutAct_9fa48("13880") ? "" : (stryCov_9fa48("13880"), 'Comenzar'),
  icon: Target,
  description: stryMutAct_9fa48("13881") ? "" : (stryCov_9fa48("13881"), 'Aprende los conceptos básicos para usar PAES Tutor'),
  topics: stryMutAct_9fa48("13882") ? [] : (stryCov_9fa48("13882"), [stryMutAct_9fa48("13883") ? {} : (stryCov_9fa48("13883"), {
    question: stryMutAct_9fa48("13884") ? "" : (stryCov_9fa48("13884"), '¿Cómo creo mi cuenta?'),
    answer: stryMutAct_9fa48("13885") ? "" : (stryCov_9fa48("13885"), 'Haz clic en "Iniciar Sesión" en el header. Si no tienes cuenta, puedes registrarte con tu email y contraseña.')
  }), stryMutAct_9fa48("13886") ? {} : (stryCov_9fa48("13886"), {
    question: stryMutAct_9fa48("13887") ? "" : (stryCov_9fa48("13887"), '¿Qué puedo hacer en PAES Tutor?'),
    answer: stryMutAct_9fa48("13888") ? "" : (stryCov_9fa48("13888"), 'Puedes realizar exámenes de práctica, revisar tu progreso, acceder a materiales de estudio, usar el Tutor de IA y exportar tus resultados.')
  }), stryMutAct_9fa48("13889") ? {} : (stryCov_9fa48("13889"), {
    question: stryMutAct_9fa48("13890") ? "" : (stryCov_9fa48("13890"), '¿Cómo empiezo a practicar?'),
    answer: stryMutAct_9fa48("13891") ? "" : (stryCov_9fa48("13891"), 'Ve a la sección "Exámenes", selecciona un examen y haz clic en "Comenzar Examen". Tu progreso se guarda automáticamente.')
  })])
}), stryMutAct_9fa48("13892") ? {} : (stryCov_9fa48("13892"), {
  id: stryMutAct_9fa48("13893") ? "" : (stryCov_9fa48("13893"), 'exams'),
  title: stryMutAct_9fa48("13894") ? "" : (stryCov_9fa48("13894"), 'Exámenes'),
  icon: BookOpen,
  description: stryMutAct_9fa48("13895") ? "" : (stryCov_9fa48("13895"), 'Todo sobre realizar y revisar exámenes'),
  topics: stryMutAct_9fa48("13896") ? [] : (stryCov_9fa48("13896"), [stryMutAct_9fa48("13897") ? {} : (stryCov_9fa48("13897"), {
    question: stryMutAct_9fa48("13898") ? "" : (stryCov_9fa48("13898"), '¿Puedo hacer el mismo examen varias veces?'),
    answer: stryMutAct_9fa48("13899") ? "" : (stryCov_9fa48("13899"), 'Sí, puedes realizar el mismo examen múltiples veces. Cada intento se guarda por separado para que puedas ver tu progreso y mejoras.')
  }), stryMutAct_9fa48("13900") ? {} : (stryCov_9fa48("13900"), {
    question: stryMutAct_9fa48("13901") ? "" : (stryCov_9fa48("13901"), '¿Qué pasa si cierro el navegador durante un examen?'),
    answer: stryMutAct_9fa48("13902") ? "" : (stryCov_9fa48("13902"), 'Tu progreso se guarda automáticamente cada 2 segundos. Si cierras el navegador, verás una advertencia y podrás continuar desde donde quedaste al volver.')
  }), stryMutAct_9fa48("13903") ? {} : (stryCov_9fa48("13903"), {
    question: stryMutAct_9fa48("13904") ? "" : (stryCov_9fa48("13904"), '¿Cómo se calcula mi puntaje?'),
    answer: stryMutAct_9fa48("13905") ? "" : (stryCov_9fa48("13905"), 'El sistema calcula tu porcentaje de aciertos y estima tu puntaje PAES basado en las tablas oficiales de conversión del DEMRE.')
  }), stryMutAct_9fa48("13906") ? {} : (stryCov_9fa48("13906"), {
    question: stryMutAct_9fa48("13907") ? "" : (stryCov_9fa48("13907"), '¿Puedo omitir preguntas?'),
    answer: stryMutAct_9fa48("13908") ? "" : (stryCov_9fa48("13908"), 'Sí, puedes omitir preguntas durante el examen. Las preguntas omitidas se marcan y puedes volver a ellas más tarde.')
  })])
}), stryMutAct_9fa48("13909") ? {} : (stryCov_9fa48("13909"), {
  id: stryMutAct_9fa48("13910") ? "" : (stryCov_9fa48("13910"), 'dashboard'),
  title: stryMutAct_9fa48("13911") ? "" : (stryCov_9fa48("13911"), 'Dashboard y Analytics'),
  icon: BarChart3,
  description: stryMutAct_9fa48("13912") ? "" : (stryCov_9fa48("13912"), 'Entiende tus estadísticas y progreso'),
  topics: stryMutAct_9fa48("13913") ? [] : (stryCov_9fa48("13913"), [stryMutAct_9fa48("13914") ? {} : (stryCov_9fa48("13914"), {
    question: stryMutAct_9fa48("13915") ? "" : (stryCov_9fa48("13915"), '¿Qué información muestra el Dashboard?'),
    answer: stryMutAct_9fa48("13916") ? "" : (stryCov_9fa48("13916"), 'El Dashboard muestra tus estadísticas generales, rendimiento por asignatura, intentos recientes, fortalezas, debilidades y recomendaciones personalizadas.')
  }), stryMutAct_9fa48("13917") ? {} : (stryCov_9fa48("13917"), {
    question: stryMutAct_9fa48("13918") ? "" : (stryCov_9fa48("13918"), '¿Cómo identifico mis fortalezas y debilidades?'),
    answer: stryMutAct_9fa48("13919") ? "" : (stryCov_9fa48("13919"), 'Ve a la sección "Análisis de Rendimiento" en el Dashboard. Ahí verás un desglose detallado por tema y asignatura.')
  }), stryMutAct_9fa48("13920") ? {} : (stryCov_9fa48("13920"), {
    question: stryMutAct_9fa48("13921") ? "" : (stryCov_9fa48("13921"), '¿Puedo exportar mis estadísticas?'),
    answer: stryMutAct_9fa48("13922") ? "" : (stryCov_9fa48("13922"), 'Sí, puedes exportar tu Dashboard completo a Excel usando el botón de exportación en la parte superior.')
  })])
}), stryMutAct_9fa48("13923") ? {} : (stryCov_9fa48("13923"), {
  id: stryMutAct_9fa48("13924") ? "" : (stryCov_9fa48("13924"), 'search'),
  title: stryMutAct_9fa48("13925") ? "" : (stryCov_9fa48("13925"), 'Búsqueda'),
  icon: Search,
  description: stryMutAct_9fa48("13926") ? "" : (stryCov_9fa48("13926"), 'Aprende a usar la búsqueda global'),
  topics: stryMutAct_9fa48("13927") ? [] : (stryCov_9fa48("13927"), [stryMutAct_9fa48("13928") ? {} : (stryCov_9fa48("13928"), {
    question: stryMutAct_9fa48("13929") ? "" : (stryCov_9fa48("13929"), '¿Cómo uso la búsqueda global?'),
    answer: stryMutAct_9fa48("13930") ? "" : (stryCov_9fa48("13930"), 'Presiona Cmd/Ctrl+K desde cualquier página o haz clic en "Buscar..." en el header. Puedes buscar exámenes, materiales, temas e intentos anteriores.')
  }), stryMutAct_9fa48("13931") ? {} : (stryCov_9fa48("13931"), {
    question: stryMutAct_9fa48("13932") ? "" : (stryCov_9fa48("13932"), '¿Qué puedo buscar?'),
    answer: stryMutAct_9fa48("13933") ? "" : (stryCov_9fa48("13933"), 'Puedes buscar por título, asignatura, tema, año, o cualquier palabra clave relacionada con el contenido que buscas.')
  }), stryMutAct_9fa48("13934") ? {} : (stryCov_9fa48("13934"), {
    question: stryMutAct_9fa48("13935") ? "" : (stryCov_9fa48("13935"), '¿Cómo funcionan las sugerencias?'),
    answer: stryMutAct_9fa48("13936") ? "" : (stryCov_9fa48("13936"), 'Mientras escribes, el sistema muestra sugerencias basadas en asignaturas, temas y títulos de exámenes disponibles.')
  })])
}), stryMutAct_9fa48("13937") ? {} : (stryCov_9fa48("13937"), {
  id: stryMutAct_9fa48("13938") ? "" : (stryCov_9fa48("13938"), 'materials'),
  title: stryMutAct_9fa48("13939") ? "" : (stryCov_9fa48("13939"), 'Materiales de Estudio'),
  icon: FileText,
  description: stryMutAct_9fa48("13940") ? "" : (stryCov_9fa48("13940"), 'Usa los recursos educativos disponibles'),
  topics: stryMutAct_9fa48("13941") ? [] : (stryCov_9fa48("13941"), [stryMutAct_9fa48("13942") ? {} : (stryCov_9fa48("13942"), {
    question: stryMutAct_9fa48("13943") ? "" : (stryCov_9fa48("13943"), '¿Qué materiales están disponibles?'),
    answer: stryMutAct_9fa48("13944") ? "" : (stryCov_9fa48("13944"), 'Los materiales incluyen recursos educativos organizados por asignatura y tema, alineados con la malla curricular chilena del MINEDUC.')
  }), stryMutAct_9fa48("13945") ? {} : (stryCov_9fa48("13945"), {
    question: stryMutAct_9fa48("13946") ? "" : (stryCov_9fa48("13946"), '¿Cómo encuentro materiales para un tema específico?'),
    answer: stryMutAct_9fa48("13947") ? "" : (stryCov_9fa48("13947"), 'Ve a "Materiales" y usa los filtros por asignatura y tema. También puedes usar la búsqueda global (Cmd/Ctrl+K) para encontrar materiales específicos.')
  })])
}), stryMutAct_9fa48("13948") ? {} : (stryCov_9fa48("13948"), {
  id: stryMutAct_9fa48("13949") ? "" : (stryCov_9fa48("13949"), 'ai-tutor'),
  title: stryMutAct_9fa48("13950") ? "" : (stryCov_9fa48("13950"), 'Tutor de IA'),
  icon: Bot,
  description: stryMutAct_9fa48("13951") ? "" : (stryCov_9fa48("13951"), 'Usa la inteligencia artificial para aprender'),
  topics: stryMutAct_9fa48("13952") ? [] : (stryCov_9fa48("13952"), [stryMutAct_9fa48("13953") ? {} : (stryCov_9fa48("13953"), {
    question: stryMutAct_9fa48("13954") ? "" : (stryCov_9fa48("13954"), '¿Cómo configuro el Tutor de IA?'),
    answer: stryMutAct_9fa48("13955") ? "" : (stryCov_9fa48("13955"), 'Ve a tu Perfil y configura tus API keys de ChatGPT, Claude o Gemini. Puedes usar tus propias cuentas o las compartidas.')
  }), stryMutAct_9fa48("13956") ? {} : (stryCov_9fa48("13956"), {
    question: stryMutAct_9fa48("13957") ? "" : (stryCov_9fa48("13957"), '¿Qué puedo preguntar al Tutor de IA?'),
    answer: stryMutAct_9fa48("13958") ? "" : (stryCov_9fa48("13958"), 'Puedes hacer cualquier pregunta sobre temas de PAES. El tutor te dará explicaciones personalizadas y te ayudará a entender conceptos difíciles.')
  }), stryMutAct_9fa48("13959") ? {} : (stryCov_9fa48("13959"), {
    question: stryMutAct_9fa48("13960") ? "" : (stryCov_9fa48("13960"), '¿Es necesario configurar una API key?'),
    answer: stryMutAct_9fa48("13961") ? "" : (stryCov_9fa48("13961"), 'Sí, necesitas al menos una API key configurada para usar el Tutor de IA. Puedes usar tus propias cuentas de ChatGPT, Claude o Gemini.')
  })])
})]);
export default function HelpPage() {
  if (stryMutAct_9fa48("13962")) {
    {}
  } else {
    stryCov_9fa48("13962");
    return <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Centro de Ayuda</h1>
        </div>
        <p className="text-muted-foreground">
          Encuentra respuestas a tus preguntas y aprende a usar todas las funcionalidades de PAES
          Tutor
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Guía Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Preguntas frecuentes y consejos prácticos
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#quick-guide">
                Ver Guía
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Primeros Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Aprende a usar PAES Tutor paso a paso
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                Ir al Inicio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Consejos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Mejora tu rendimiento con estos tips
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#tips">
                Ver Consejos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Sections */}
      <div className="space-y-6 mb-8">
        {HELP_SECTIONS.map(section => {
          if (stryMutAct_9fa48("13963")) {
            {}
          } else {
            stryCov_9fa48("13963");
            const Icon = section.icon;
            return <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.topics.map(stryMutAct_9fa48("13964") ? () => undefined : (stryCov_9fa48("13964"), (topic, idx) => <div key={idx} className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">{topic.question}</h4>
                      <p className="text-sm text-muted-foreground">{topic.answer}</p>
                    </div>))}
                </div>
              </CardContent>
            </Card>;
          }
        })}
      </div>

      {/* Quick Guide */}
      <div id="quick-guide" className="mb-8">
        <QuickGuide />
      </div>

      {/* Tips Section */}
      <Card id="tips" className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Consejos para Mejorar tu Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Practica Regularmente</h4>
                <p className="text-sm text-muted-foreground">
                  Realiza exámenes de práctica con frecuencia. La consistencia es clave para
                  mejorar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Revisa tus Errores</h4>
                <p className="text-sm text-muted-foreground">
                  Después de cada examen, revisa las preguntas incorrectas y lee las explicaciones
                  detalladas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Usa los Materiales de Estudio</h4>
                <p className="text-sm text-muted-foreground">
                  Refuerza tus temas débiles con los materiales de estudio organizados por
                  asignatura y tema.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Aprovecha el Tutor de IA</h4>
                <p className="text-sm text-muted-foreground">
                  Haz preguntas específicas sobre temas que no entiendes. El tutor te dará
                  explicaciones personalizadas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold mb-1">Monitorea tu Progreso</h4>
                <p className="text-sm text-muted-foreground">
                  Revisa regularmente tu Dashboard para identificar patrones, fortalezas y áreas de
                  mejora.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
  }
}