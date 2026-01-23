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
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BookOpen, BarChart3, FileText, Bot, Search, ChevronDown, ChevronRight, HelpCircle, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { HelpIcon } from './help-icon';
interface QuickGuideProps {
  className?: string;
}
const GUIDE_SECTIONS = stryMutAct_9fa48("17479") ? [] : (stryCov_9fa48("17479"), [stryMutAct_9fa48("17480") ? {} : (stryCov_9fa48("17480"), {
  id: stryMutAct_9fa48("17481") ? "" : (stryCov_9fa48("17481"), 'getting-started'),
  title: stryMutAct_9fa48("17482") ? "" : (stryCov_9fa48("17482"), 'Comenzar'),
  icon: Target,
  items: stryMutAct_9fa48("17483") ? [] : (stryCov_9fa48("17483"), [stryMutAct_9fa48("17484") ? {} : (stryCov_9fa48("17484"), {
    question: stryMutAct_9fa48("17485") ? "" : (stryCov_9fa48("17485"), '¿Cómo empiezo?'),
    answer: stryMutAct_9fa48("17486") ? "" : (stryCov_9fa48("17486"), '1. Ve a "Exámenes" y selecciona un examen para practicar. 2. Revisa tu progreso en el Dashboard. 3. Usa los Materiales de Estudio para reforzar temas débiles.')
  }), stryMutAct_9fa48("17487") ? {} : (stryCov_9fa48("17487"), {
    question: stryMutAct_9fa48("17488") ? "" : (stryCov_9fa48("17488"), '¿Puedo hacer el mismo examen varias veces?'),
    answer: stryMutAct_9fa48("17489") ? "" : (stryCov_9fa48("17489"), 'Sí, puedes realizar el mismo examen múltiples veces. Cada intento se guarda por separado para que puedas ver tu progreso.')
  }), stryMutAct_9fa48("17490") ? {} : (stryCov_9fa48("17490"), {
    question: stryMutAct_9fa48("17491") ? "" : (stryCov_9fa48("17491"), '¿Cómo funciona el sistema de puntuación?'),
    answer: stryMutAct_9fa48("17492") ? "" : (stryCov_9fa48("17492"), 'El sistema calcula tu porcentaje de aciertos y estima tu puntaje PAES basado en las tablas oficiales de conversión del DEMRE.')
  })])
}), stryMutAct_9fa48("17493") ? {} : (stryCov_9fa48("17493"), {
  id: stryMutAct_9fa48("17494") ? "" : (stryCov_9fa48("17494"), 'features'),
  title: stryMutAct_9fa48("17495") ? "" : (stryCov_9fa48("17495"), 'Funcionalidades'),
  icon: Lightbulb,
  items: stryMutAct_9fa48("17496") ? [] : (stryCov_9fa48("17496"), [stryMutAct_9fa48("17497") ? {} : (stryCov_9fa48("17497"), {
    question: stryMutAct_9fa48("17498") ? "" : (stryCov_9fa48("17498"), '¿Cómo uso la búsqueda global?'),
    answer: stryMutAct_9fa48("17499") ? "" : (stryCov_9fa48("17499"), 'Presiona Cmd/Ctrl+K o haz clic en "Buscar..." en el header. Puedes buscar exámenes, materiales, temas e intentos anteriores.')
  }), stryMutAct_9fa48("17500") ? {} : (stryCov_9fa48("17500"), {
    question: stryMutAct_9fa48("17501") ? "" : (stryCov_9fa48("17501"), '¿Qué es el Tutor de IA?'),
    answer: stryMutAct_9fa48("17502") ? "" : (stryCov_9fa48("17502"), 'El Tutor de IA te permite hacer preguntas sobre cualquier tema de PAES y recibir explicaciones personalizadas. Necesitas configurar una API key en tu perfil.')
  }), stryMutAct_9fa48("17503") ? {} : (stryCov_9fa48("17503"), {
    question: stryMutAct_9fa48("17504") ? "" : (stryCov_9fa48("17504"), '¿Cómo veo mis fortalezas y debilidades?'),
    answer: stryMutAct_9fa48("17505") ? "" : (stryCov_9fa48("17505"), 'Ve al Dashboard y revisa la sección de "Análisis de Rendimiento". Ahí verás tus fortalezas, debilidades y recomendaciones personalizadas.')
  })])
}), stryMutAct_9fa48("17506") ? {} : (stryCov_9fa48("17506"), {
  id: stryMutAct_9fa48("17507") ? "" : (stryCov_9fa48("17507"), 'tips'),
  title: stryMutAct_9fa48("17508") ? "" : (stryCov_9fa48("17508"), 'Consejos'),
  icon: TrendingUp,
  items: stryMutAct_9fa48("17509") ? [] : (stryCov_9fa48("17509"), [stryMutAct_9fa48("17510") ? {} : (stryCov_9fa48("17510"), {
    question: stryMutAct_9fa48("17511") ? "" : (stryCov_9fa48("17511"), '¿Cómo mejorar mi rendimiento?'),
    answer: stryMutAct_9fa48("17512") ? "" : (stryCov_9fa48("17512"), '1. Practica regularmente con exámenes. 2. Revisa tus errores y lee las explicaciones. 3. Usa los Materiales de Estudio para temas débiles. 4. Revisa tus estadísticas para identificar patrones.')
  }), stryMutAct_9fa48("17513") ? {} : (stryCov_9fa48("17513"), {
    question: stryMutAct_9fa48("17514") ? "" : (stryCov_9fa48("17514"), '¿Puedo exportar mis resultados?'),
    answer: stryMutAct_9fa48("17515") ? "" : (stryCov_9fa48("17515"), 'Sí, puedes exportar tus resultados, estadísticas y listas de exámenes a PDF, Word o Excel usando los botones de exportación.')
  }), stryMutAct_9fa48("17516") ? {} : (stryCov_9fa48("17516"), {
    question: stryMutAct_9fa48("17517") ? "" : (stryCov_9fa48("17517"), '¿El sistema guarda mi progreso automáticamente?'),
    answer: stryMutAct_9fa48("17518") ? "" : (stryCov_9fa48("17518"), 'Sí, durante un examen tu progreso se guarda automáticamente cada 2 segundos. Si cierras la pestaña, podrás continuar desde donde quedaste.')
  })])
})]);
export function QuickGuide({
  className
}: QuickGuideProps) {
  if (stryMutAct_9fa48("17519")) {
    {}
  } else {
    stryCov_9fa48("17519");
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(stryMutAct_9fa48("17520") ? [] : (stryCov_9fa48("17520"), [stryMutAct_9fa48("17521") ? "" : (stryCov_9fa48("17521"), 'getting-started')])));
    const toggleSection = (sectionId: string) => {
      if (stryMutAct_9fa48("17522")) {
        {}
      } else {
        stryCov_9fa48("17522");
        setOpenSections(prev => {
          if (stryMutAct_9fa48("17523")) {
            {}
          } else {
            stryCov_9fa48("17523");
            const newSet = new Set(prev);
            if (stryMutAct_9fa48("17525") ? false : stryMutAct_9fa48("17524") ? true : (stryCov_9fa48("17524", "17525"), newSet.has(sectionId))) {
              if (stryMutAct_9fa48("17526")) {
                {}
              } else {
                stryCov_9fa48("17526");
                newSet.delete(sectionId);
              }
            } else {
              if (stryMutAct_9fa48("17527")) {
                {}
              } else {
                stryCov_9fa48("17527");
                newSet.add(sectionId);
              }
            }
            return newSet;
          }
        });
      }
    };
    return <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <CardTitle>Guía Rápida</CardTitle>
        </div>
        <CardDescription>Preguntas frecuentes y consejos para usar PAES Tutor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {GUIDE_SECTIONS.map(section => {
          if (stryMutAct_9fa48("17528")) {
            {}
          } else {
            stryCov_9fa48("17528");
            const Icon = section.icon;
            const isOpen = openSections.has(section.id);
            return <Collapsible key={section.id} open={isOpen} onOpenChange={stryMutAct_9fa48("17529") ? () => undefined : (stryCov_9fa48("17529"), () => toggleSection(section.id))}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{section.title}</span>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2 pl-8">
                {section.items.map(stryMutAct_9fa48("17530") ? () => undefined : (stryCov_9fa48("17530"), (item, idx) => <div key={idx} className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-sm">{item.question}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-0">{item.answer}</p>
                  </div>))}
              </CollapsibleContent>
            </Collapsible>;
          }
        })}
      </CardContent>
    </Card>;
  }
}