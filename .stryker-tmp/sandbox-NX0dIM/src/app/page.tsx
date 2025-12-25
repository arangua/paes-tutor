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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, Target, Award, Search, BarChart3, FileText, Bot, ArrowRight, HelpCircle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WelcomeTour } from '@/components/help/welcome-tour';
const FEATURES = stryMutAct_9fa48("14484") ? [] : (stryCov_9fa48("14484"), [stryMutAct_9fa48("14485") ? {} : (stryCov_9fa48("14485"), {
  icon: BookOpen,
  title: stryMutAct_9fa48("14486") ? "" : (stryCov_9fa48("14486"), 'Simulacros'),
  description: stryMutAct_9fa48("14487") ? "" : (stryCov_9fa48("14487"), 'Practica con exámenes reales de años anteriores'),
  color: stryMutAct_9fa48("14488") ? "" : (stryCov_9fa48("14488"), 'text-blue-600'),
  bgColor: stryMutAct_9fa48("14489") ? "" : (stryCov_9fa48("14489"), 'bg-blue-50 dark:bg-blue-900/20'),
  href: stryMutAct_9fa48("14490") ? "" : (stryCov_9fa48("14490"), '/exams')
}), stryMutAct_9fa48("14491") ? {} : (stryCov_9fa48("14491"), {
  icon: TrendingUp,
  title: stryMutAct_9fa48("14492") ? "" : (stryCov_9fa48("14492"), 'Seguimiento'),
  description: stryMutAct_9fa48("14493") ? "" : (stryCov_9fa48("14493"), 'Analiza tu progreso con métricas detalladas'),
  color: stryMutAct_9fa48("14494") ? "" : (stryCov_9fa48("14494"), 'text-green-600'),
  bgColor: stryMutAct_9fa48("14495") ? "" : (stryCov_9fa48("14495"), 'bg-green-50 dark:bg-green-900/20'),
  href: stryMutAct_9fa48("14496") ? "" : (stryCov_9fa48("14496"), '/dashboard')
}), stryMutAct_9fa48("14497") ? {} : (stryCov_9fa48("14497"), {
  icon: Target,
  title: stryMutAct_9fa48("14498") ? "" : (stryCov_9fa48("14498"), 'Preparación'),
  description: stryMutAct_9fa48("14499") ? "" : (stryCov_9fa48("14499"), 'Materiales de estudio y recomendaciones personalizadas'),
  color: stryMutAct_9fa48("14500") ? "" : (stryCov_9fa48("14500"), 'text-purple-600'),
  bgColor: stryMutAct_9fa48("14501") ? "" : (stryCov_9fa48("14501"), 'bg-purple-50 dark:bg-purple-900/20'),
  href: stryMutAct_9fa48("14502") ? "" : (stryCov_9fa48("14502"), '/materials')
}), stryMutAct_9fa48("14503") ? {} : (stryCov_9fa48("14503"), {
  icon: Search,
  title: stryMutAct_9fa48("14504") ? "" : (stryCov_9fa48("14504"), 'Búsqueda Inteligente'),
  description: stryMutAct_9fa48("14505") ? "" : (stryCov_9fa48("14505"), 'Encuentra rápidamente cualquier contenido (Cmd/Ctrl+K)'),
  color: stryMutAct_9fa48("14506") ? "" : (stryCov_9fa48("14506"), 'text-orange-600'),
  bgColor: stryMutAct_9fa48("14507") ? "" : (stryCov_9fa48("14507"), 'bg-orange-50 dark:bg-orange-900/20'),
  href: null // Se activa con Cmd/Ctrl+K, no necesita link
}), stryMutAct_9fa48("14508") ? {} : (stryCov_9fa48("14508"), {
  icon: Bot,
  title: stryMutAct_9fa48("14509") ? "" : (stryCov_9fa48("14509"), 'Tutor de IA'),
  description: stryMutAct_9fa48("14510") ? "" : (stryCov_9fa48("14510"), 'Explicaciones personalizadas con inteligencia artificial'),
  color: stryMutAct_9fa48("14511") ? "" : (stryCov_9fa48("14511"), 'text-indigo-600'),
  bgColor: stryMutAct_9fa48("14512") ? "" : (stryCov_9fa48("14512"), 'bg-indigo-50 dark:bg-indigo-900/20'),
  href: stryMutAct_9fa48("14513") ? "" : (stryCov_9fa48("14513"), '/ai-tutor')
}), stryMutAct_9fa48("14514") ? {} : (stryCov_9fa48("14514"), {
  icon: BarChart3,
  title: stryMutAct_9fa48("14515") ? "" : (stryCov_9fa48("14515"), 'Analytics'),
  description: stryMutAct_9fa48("14516") ? "" : (stryCov_9fa48("14516"), 'Identifica fortalezas, debilidades y áreas de mejora'),
  color: stryMutAct_9fa48("14517") ? "" : (stryCov_9fa48("14517"), 'text-pink-600'),
  bgColor: stryMutAct_9fa48("14518") ? "" : (stryCov_9fa48("14518"), 'bg-pink-50 dark:bg-pink-900/20'),
  href: stryMutAct_9fa48("14519") ? "" : (stryCov_9fa48("14519"), '/analytics')
})]);
const QUICK_STEPS = stryMutAct_9fa48("14520") ? [] : (stryCov_9fa48("14520"), [stryMutAct_9fa48("14521") ? {} : (stryCov_9fa48("14521"), {
  step: 1,
  title: stryMutAct_9fa48("14522") ? "" : (stryCov_9fa48("14522"), 'Inicia Sesión'),
  description: stryMutAct_9fa48("14523") ? "" : (stryCov_9fa48("14523"), 'Crea tu cuenta o inicia sesión para comenzar')
}), stryMutAct_9fa48("14524") ? {} : (stryCov_9fa48("14524"), {
  step: 2,
  title: stryMutAct_9fa48("14525") ? "" : (stryCov_9fa48("14525"), 'Realiza un Examen'),
  description: stryMutAct_9fa48("14526") ? "" : (stryCov_9fa48("14526"), "Ve a 'Exámenes' y selecciona uno para practicar")
}), stryMutAct_9fa48("14527") ? {} : (stryCov_9fa48("14527"), {
  step: 3,
  title: stryMutAct_9fa48("14528") ? "" : (stryCov_9fa48("14528"), 'Revisa tus Resultados'),
  description: stryMutAct_9fa48("14529") ? "" : (stryCov_9fa48("14529"), 'Analiza tu rendimiento en el Dashboard')
}), stryMutAct_9fa48("14530") ? {} : (stryCov_9fa48("14530"), {
  step: 4,
  title: stryMutAct_9fa48("14531") ? "" : (stryCov_9fa48("14531"), 'Mejora Continuamente'),
  description: stryMutAct_9fa48("14532") ? "" : (stryCov_9fa48("14532"), 'Usa materiales de estudio y el Tutor de IA')
})]);
export default function Home() {
  if (stryMutAct_9fa48("14533")) {
    {}
  } else {
    stryCov_9fa48("14533");
    const [showTour, setShowTour] = useState(stryMutAct_9fa48("14534") ? true : (stryCov_9fa48("14534"), false));
    const [hasSeenTour, setHasSeenTour] = useState(stryMutAct_9fa48("14535") ? true : (stryCov_9fa48("14535"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("14536")) {
        {}
      } else {
        stryCov_9fa48("14536");
        // Verificar si el usuario ya vio el tour
        const seen = localStorage.getItem(stryMutAct_9fa48("14537") ? "" : (stryCov_9fa48("14537"), 'paes-tutor-tour-seen'));
        setHasSeenTour(stryMutAct_9fa48("14538") ? !seen : (stryCov_9fa48("14538"), !(stryMutAct_9fa48("14539") ? seen : (stryCov_9fa48("14539"), !seen))));
      }
    }, stryMutAct_9fa48("14540") ? ["Stryker was here"] : (stryCov_9fa48("14540"), []));
    const handleStartTour = () => {
      if (stryMutAct_9fa48("14541")) {
        {}
      } else {
        stryCov_9fa48("14541");
        setShowTour(stryMutAct_9fa48("14542") ? false : (stryCov_9fa48("14542"), true));
      }
    };
    const handleTourComplete = () => {
      if (stryMutAct_9fa48("14543")) {
        {}
      } else {
        stryCov_9fa48("14543");
        localStorage.setItem(stryMutAct_9fa48("14544") ? "" : (stryCov_9fa48("14544"), 'paes-tutor-tour-seen'), stryMutAct_9fa48("14545") ? "" : (stryCov_9fa48("14545"), 'true'));
        setShowTour(stryMutAct_9fa48("14546") ? true : (stryCov_9fa48("14546"), false));
        setHasSeenTour(stryMutAct_9fa48("14547") ? false : (stryCov_9fa48("14547"), true));
      }
    };
    const handleTourSkip = () => {
      if (stryMutAct_9fa48("14548")) {
        {}
      } else {
        stryCov_9fa48("14548");
        localStorage.setItem(stryMutAct_9fa48("14549") ? "" : (stryCov_9fa48("14549"), 'paes-tutor-tour-seen'), stryMutAct_9fa48("14550") ? "" : (stryCov_9fa48("14550"), 'true'));
        setShowTour(stryMutAct_9fa48("14551") ? true : (stryCov_9fa48("14551"), false));
        setHasSeenTour(stryMutAct_9fa48("14552") ? false : (stryCov_9fa48("14552"), true));
      }
    };
    return <>
      {stryMutAct_9fa48("14555") ? showTour || <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} /> : stryMutAct_9fa48("14554") ? false : stryMutAct_9fa48("14553") ? true : (stryCov_9fa48("14553", "14554", "14555"), showTour && <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} />)}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-16 px-8">
          <div className="text-center space-y-8 w-full">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  PAES Tutor
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Tu plataforma de preparación para la Prueba de Acceso a la Educación Superior
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/dashboard">
                    <Award className="mr-2 h-5 w-5" />
                    Ir al Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="/exams">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Ver Exámenes
                  </Link>
                </Button>
                {stryMutAct_9fa48("14558") ? !hasSeenTour || <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={handleStartTour}>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Tour Guiado
                  </Button> : stryMutAct_9fa48("14557") ? false : stryMutAct_9fa48("14556") ? true : (stryCov_9fa48("14556", "14557", "14558"), (stryMutAct_9fa48("14559") ? hasSeenTour : (stryCov_9fa48("14559"), !hasSeenTour)) && <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={handleStartTour}>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Tour Guiado
                  </Button>)}
              </div>
            </div>

            {/* Quick Start Guide */}
            <Card className="mt-12 text-left">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Guía de Inicio Rápido</CardTitle>
                </div>
                <CardDescription>Sigue estos pasos para comenzar a usar PAES Tutor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {QUICK_STEPS.map(stryMutAct_9fa48("14560") ? () => undefined : (stryCov_9fa48("14560"), item => <div key={item.step} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Características Principales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature, idx) => {
                  if (stryMutAct_9fa48("14561")) {
                    {}
                  } else {
                    stryCov_9fa48("14561");
                    const Icon = feature.icon;
                    const CardWrapper = feature.href ? Link : stryMutAct_9fa48("14562") ? "" : (stryCov_9fa48("14562"), 'div');
                    const cardProps = feature.href ? stryMutAct_9fa48("14563") ? {} : (stryCov_9fa48("14563"), {
                      href: feature.href,
                      className: stryMutAct_9fa48("14564") ? "" : (stryCov_9fa48("14564"), 'block')
                    }) : stryMutAct_9fa48("14565") ? {} : (stryCov_9fa48("14565"), {
                      className: stryMutAct_9fa48("14566") ? "" : (stryCov_9fa48("14566"), 'block')
                    });
                    return <CardWrapper key={idx} {...cardProps}>
                      <Card className={stryMutAct_9fa48("14567") ? `` : (stryCov_9fa48("14567"), `hover:shadow-lg transition-all h-full hover:border-primary/50 ${feature.href ? stryMutAct_9fa48("14568") ? "" : (stryCov_9fa48("14568"), 'cursor-pointer group') : stryMutAct_9fa48("14569") ? "Stryker was here!" : (stryCov_9fa48("14569"), '')}`)}>
                        <CardHeader>
                          <div className={stryMutAct_9fa48("14570") ? `` : (stryCov_9fa48("14570"), `w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-2`)}>
                            <Icon className={stryMutAct_9fa48("14571") ? `` : (stryCov_9fa48("14571"), `h-6 w-6 ${feature.color}`)} />
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            {stryMutAct_9fa48("14574") ? feature.href || <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> : stryMutAct_9fa48("14573") ? false : stryMutAct_9fa48("14572") ? true : (stryCov_9fa48("14572", "14573", "14574"), feature.href && <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </CardWrapper>;
                  }
                })}
              </div>
            </div>

            {/* Help Section */}
            <Card className="mt-12">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle>¿Necesitas Ayuda?</CardTitle>
                </div>
                <CardDescription>
                  Encuentra respuestas a tus preguntas y aprende a usar todas las funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Centro de Ayuda
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleStartTour}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Ver Tour Guiado
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">💡 Consejo Pro</h3>
                    <p className="text-sm text-muted-foreground">
                      Presiona{stryMutAct_9fa48("14575") ? "" : (stryCov_9fa48("14575"), ' ')}
                      <kbd className="px-2 py-1 bg-background border rounded text-xs">
                        Cmd/Ctrl + K
                      </kbd>{stryMutAct_9fa48("14576") ? "" : (stryCov_9fa48("14576"), ' ')}
                      desde cualquier página para buscar rápidamente exámenes, materiales y temas.
                      Tu progreso se guarda automáticamente, así que puedes continuar donde lo
                      dejaste.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>;
  }
}