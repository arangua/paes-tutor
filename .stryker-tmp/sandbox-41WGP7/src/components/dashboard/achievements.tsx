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
import { Badge } from '@/components/ui/badge';
import { Award, Target, TrendingUp, Star, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  unlocked: boolean;
  progress?: {
    current: number;
    target: number;
  };
  badge?: string;
}
interface AchievementsProps {
  attempts: Array<{
    porcentaje: number;
    estado: string;
    totalPreguntas: number;
    correctas: number;
  }>;
  avgScore: number;
}
export function Achievements({
  attempts,
  avgScore
}: AchievementsProps) {
  if (stryMutAct_9fa48("16197")) {
    {}
  } else {
    stryCov_9fa48("16197");
    const completedAttempts = stryMutAct_9fa48("16198") ? attempts.length : (stryCov_9fa48("16198"), attempts.filter(stryMutAct_9fa48("16199") ? () => undefined : (stryCov_9fa48("16199"), a => stryMutAct_9fa48("16202") ? a.estado !== 'completado' : stryMutAct_9fa48("16201") ? false : stryMutAct_9fa48("16200") ? true : (stryCov_9fa48("16200", "16201", "16202"), a.estado === (stryMutAct_9fa48("16203") ? "" : (stryCov_9fa48("16203"), 'completado'))))).length);
    const highScores = stryMutAct_9fa48("16204") ? attempts.length : (stryCov_9fa48("16204"), attempts.filter(stryMutAct_9fa48("16205") ? () => undefined : (stryCov_9fa48("16205"), a => stryMutAct_9fa48("16209") ? a.porcentaje < 70 : stryMutAct_9fa48("16208") ? a.porcentaje > 70 : stryMutAct_9fa48("16207") ? false : stryMutAct_9fa48("16206") ? true : (stryCov_9fa48("16206", "16207", "16208", "16209"), a.porcentaje >= 70))).length);
    const perfectScores = stryMutAct_9fa48("16210") ? attempts.length : (stryCov_9fa48("16210"), attempts.filter(stryMutAct_9fa48("16211") ? () => undefined : (stryCov_9fa48("16211"), a => stryMutAct_9fa48("16214") ? a.porcentaje !== 100 : stryMutAct_9fa48("16213") ? false : stryMutAct_9fa48("16212") ? true : (stryCov_9fa48("16212", "16213", "16214"), a.porcentaje === 100))).length);
    const achievements: Achievement[] = stryMutAct_9fa48("16215") ? [] : (stryCov_9fa48("16215"), [stryMutAct_9fa48("16216") ? {} : (stryCov_9fa48("16216"), {
      id: stryMutAct_9fa48("16217") ? "" : (stryCov_9fa48("16217"), 'first-attempt'),
      title: stryMutAct_9fa48("16218") ? "" : (stryCov_9fa48("16218"), 'Primer Paso'),
      description: stryMutAct_9fa48("16219") ? "" : (stryCov_9fa48("16219"), 'Completa tu primer examen'),
      icon: Target,
      unlocked: stryMutAct_9fa48("16223") ? completedAttempts < 1 : stryMutAct_9fa48("16222") ? completedAttempts > 1 : stryMutAct_9fa48("16221") ? false : stryMutAct_9fa48("16220") ? true : (stryCov_9fa48("16220", "16221", "16222", "16223"), completedAttempts >= 1),
      badge: (stryMutAct_9fa48("16227") ? completedAttempts < 1 : stryMutAct_9fa48("16226") ? completedAttempts > 1 : stryMutAct_9fa48("16225") ? false : stryMutAct_9fa48("16224") ? true : (stryCov_9fa48("16224", "16225", "16226", "16227"), completedAttempts >= 1)) ? stryMutAct_9fa48("16228") ? "" : (stryCov_9fa48("16228"), 'Desbloqueado') : undefined
    }), stryMutAct_9fa48("16229") ? {} : (stryCov_9fa48("16229"), {
      id: stryMutAct_9fa48("16230") ? "" : (stryCov_9fa48("16230"), 'dedicated'),
      title: stryMutAct_9fa48("16231") ? "" : (stryCov_9fa48("16231"), 'Estudiante Dedicado'),
      description: stryMutAct_9fa48("16232") ? "" : (stryCov_9fa48("16232"), 'Completa 5 exámenes'),
      icon: TrendingUp,
      unlocked: stryMutAct_9fa48("16236") ? completedAttempts < 5 : stryMutAct_9fa48("16235") ? completedAttempts > 5 : stryMutAct_9fa48("16234") ? false : stryMutAct_9fa48("16233") ? true : (stryCov_9fa48("16233", "16234", "16235", "16236"), completedAttempts >= 5),
      progress: (stryMutAct_9fa48("16240") ? completedAttempts >= 5 : stryMutAct_9fa48("16239") ? completedAttempts <= 5 : stryMutAct_9fa48("16238") ? false : stryMutAct_9fa48("16237") ? true : (stryCov_9fa48("16237", "16238", "16239", "16240"), completedAttempts < 5)) ? stryMutAct_9fa48("16241") ? {} : (stryCov_9fa48("16241"), {
        current: completedAttempts,
        target: 5
      }) : undefined,
      badge: (stryMutAct_9fa48("16245") ? completedAttempts < 5 : stryMutAct_9fa48("16244") ? completedAttempts > 5 : stryMutAct_9fa48("16243") ? false : stryMutAct_9fa48("16242") ? true : (stryCov_9fa48("16242", "16243", "16244", "16245"), completedAttempts >= 5)) ? stryMutAct_9fa48("16246") ? "" : (stryCov_9fa48("16246"), 'Desbloqueado') : undefined
    }), stryMutAct_9fa48("16247") ? {} : (stryCov_9fa48("16247"), {
      id: stryMutAct_9fa48("16248") ? "" : (stryCov_9fa48("16248"), 'expert'),
      title: stryMutAct_9fa48("16249") ? "" : (stryCov_9fa48("16249"), 'Experto'),
      description: stryMutAct_9fa48("16250") ? "" : (stryCov_9fa48("16250"), 'Completa 10 exámenes'),
      icon: Star,
      unlocked: stryMutAct_9fa48("16254") ? completedAttempts < 10 : stryMutAct_9fa48("16253") ? completedAttempts > 10 : stryMutAct_9fa48("16252") ? false : stryMutAct_9fa48("16251") ? true : (stryCov_9fa48("16251", "16252", "16253", "16254"), completedAttempts >= 10),
      progress: (stryMutAct_9fa48("16258") ? completedAttempts >= 10 : stryMutAct_9fa48("16257") ? completedAttempts <= 10 : stryMutAct_9fa48("16256") ? false : stryMutAct_9fa48("16255") ? true : (stryCov_9fa48("16255", "16256", "16257", "16258"), completedAttempts < 10)) ? stryMutAct_9fa48("16259") ? {} : (stryCov_9fa48("16259"), {
        current: completedAttempts,
        target: 10
      }) : undefined,
      badge: (stryMutAct_9fa48("16263") ? completedAttempts < 10 : stryMutAct_9fa48("16262") ? completedAttempts > 10 : stryMutAct_9fa48("16261") ? false : stryMutAct_9fa48("16260") ? true : (stryCov_9fa48("16260", "16261", "16262", "16263"), completedAttempts >= 10)) ? stryMutAct_9fa48("16264") ? "" : (stryCov_9fa48("16264"), 'Desbloqueado') : undefined
    }), stryMutAct_9fa48("16265") ? {} : (stryCov_9fa48("16265"), {
      id: stryMutAct_9fa48("16266") ? "" : (stryCov_9fa48("16266"), 'high-achiever'),
      title: stryMutAct_9fa48("16267") ? "" : (stryCov_9fa48("16267"), 'Alto Rendimiento'),
      description: stryMutAct_9fa48("16268") ? "" : (stryCov_9fa48("16268"), 'Obtén 70% o más en un examen'),
      icon: Trophy,
      unlocked: stryMutAct_9fa48("16272") ? highScores < 1 : stryMutAct_9fa48("16271") ? highScores > 1 : stryMutAct_9fa48("16270") ? false : stryMutAct_9fa48("16269") ? true : (stryCov_9fa48("16269", "16270", "16271", "16272"), highScores >= 1),
      badge: (stryMutAct_9fa48("16276") ? highScores < 1 : stryMutAct_9fa48("16275") ? highScores > 1 : stryMutAct_9fa48("16274") ? false : stryMutAct_9fa48("16273") ? true : (stryCov_9fa48("16273", "16274", "16275", "16276"), highScores >= 1)) ? stryMutAct_9fa48("16277") ? "" : (stryCov_9fa48("16277"), 'Desbloqueado') : undefined
    }), stryMutAct_9fa48("16278") ? {} : (stryCov_9fa48("16278"), {
      id: stryMutAct_9fa48("16279") ? "" : (stryCov_9fa48("16279"), 'perfectionist'),
      title: stryMutAct_9fa48("16280") ? "" : (stryCov_9fa48("16280"), 'Perfeccionista'),
      description: stryMutAct_9fa48("16281") ? "" : (stryCov_9fa48("16281"), 'Obtén 100% en un examen'),
      icon: Zap,
      unlocked: stryMutAct_9fa48("16285") ? perfectScores < 1 : stryMutAct_9fa48("16284") ? perfectScores > 1 : stryMutAct_9fa48("16283") ? false : stryMutAct_9fa48("16282") ? true : (stryCov_9fa48("16282", "16283", "16284", "16285"), perfectScores >= 1),
      badge: (stryMutAct_9fa48("16289") ? perfectScores < 1 : stryMutAct_9fa48("16288") ? perfectScores > 1 : stryMutAct_9fa48("16287") ? false : stryMutAct_9fa48("16286") ? true : (stryCov_9fa48("16286", "16287", "16288", "16289"), perfectScores >= 1)) ? stryMutAct_9fa48("16290") ? "" : (stryCov_9fa48("16290"), 'Desbloqueado') : undefined
    }), stryMutAct_9fa48("16291") ? {} : (stryCov_9fa48("16291"), {
      id: stryMutAct_9fa48("16292") ? "" : (stryCov_9fa48("16292"), 'consistency'),
      title: stryMutAct_9fa48("16293") ? "" : (stryCov_9fa48("16293"), 'Consistencia'),
      description: stryMutAct_9fa48("16294") ? "" : (stryCov_9fa48("16294"), 'Mantén un promedio de 70% o más'),
      icon: Award,
      unlocked: stryMutAct_9fa48("16297") ? avgScore >= 70 || completedAttempts >= 3 : stryMutAct_9fa48("16296") ? false : stryMutAct_9fa48("16295") ? true : (stryCov_9fa48("16295", "16296", "16297"), (stryMutAct_9fa48("16300") ? avgScore < 70 : stryMutAct_9fa48("16299") ? avgScore > 70 : stryMutAct_9fa48("16298") ? true : (stryCov_9fa48("16298", "16299", "16300"), avgScore >= 70)) && (stryMutAct_9fa48("16303") ? completedAttempts < 3 : stryMutAct_9fa48("16302") ? completedAttempts > 3 : stryMutAct_9fa48("16301") ? true : (stryCov_9fa48("16301", "16302", "16303"), completedAttempts >= 3))),
      badge: (stryMutAct_9fa48("16306") ? avgScore >= 70 || completedAttempts >= 3 : stryMutAct_9fa48("16305") ? false : stryMutAct_9fa48("16304") ? true : (stryCov_9fa48("16304", "16305", "16306"), (stryMutAct_9fa48("16309") ? avgScore < 70 : stryMutAct_9fa48("16308") ? avgScore > 70 : stryMutAct_9fa48("16307") ? true : (stryCov_9fa48("16307", "16308", "16309"), avgScore >= 70)) && (stryMutAct_9fa48("16312") ? completedAttempts < 3 : stryMutAct_9fa48("16311") ? completedAttempts > 3 : stryMutAct_9fa48("16310") ? true : (stryCov_9fa48("16310", "16311", "16312"), completedAttempts >= 3)))) ? stryMutAct_9fa48("16313") ? "" : (stryCov_9fa48("16313"), 'Desbloqueado') : undefined
    })]);
    const unlockedCount = stryMutAct_9fa48("16314") ? achievements.length : (stryCov_9fa48("16314"), achievements.filter(stryMutAct_9fa48("16315") ? () => undefined : (stryCov_9fa48("16315"), a => a.unlocked)).length);
    const totalCount = achievements.length;
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Logros
            </CardTitle>
            <CardDescription>
              {unlockedCount} de {totalCount} logros desbloqueados
            </CardDescription>
          </div>
          <Badge variant="secondary">{Math.round(stryMutAct_9fa48("16316") ? unlockedCount / totalCount / 100 : (stryCov_9fa48("16316"), (stryMutAct_9fa48("16317") ? unlockedCount * totalCount : (stryCov_9fa48("16317"), unlockedCount / totalCount)) * 100))}%</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map(achievement => {
            if (stryMutAct_9fa48("16318")) {
              {}
            } else {
              stryCov_9fa48("16318");
              const Icon = achievement.icon;
              return <div key={achievement.id} className={cn(stryMutAct_9fa48("16319") ? "" : (stryCov_9fa48("16319"), 'p-3 rounded-lg border-2 transition-all'), achievement.unlocked ? stryMutAct_9fa48("16320") ? "" : (stryCov_9fa48("16320"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : stryMutAct_9fa48("16321") ? "" : (stryCov_9fa48("16321"), 'border-muted bg-muted/30 opacity-60'))}>
                <div className="flex items-start gap-3">
                  <div className={cn(stryMutAct_9fa48("16322") ? "" : (stryCov_9fa48("16322"), 'p-2 rounded-lg'), achievement.unlocked ? stryMutAct_9fa48("16323") ? "" : (stryCov_9fa48("16323"), 'bg-green-100 dark:bg-green-900/30') : stryMutAct_9fa48("16324") ? "" : (stryCov_9fa48("16324"), 'bg-muted'))}>
                    <Icon className={cn(stryMutAct_9fa48("16325") ? "" : (stryCov_9fa48("16325"), 'h-5 w-5'), achievement.unlocked ? stryMutAct_9fa48("16326") ? "" : (stryCov_9fa48("16326"), 'text-green-600') : stryMutAct_9fa48("16327") ? "" : (stryCov_9fa48("16327"), 'text-muted-foreground'))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn(stryMutAct_9fa48("16328") ? "" : (stryCov_9fa48("16328"), 'font-semibold text-sm'), achievement.unlocked ? stryMutAct_9fa48("16329") ? "" : (stryCov_9fa48("16329"), 'text-foreground') : stryMutAct_9fa48("16330") ? "" : (stryCov_9fa48("16330"), 'text-muted-foreground'))}>
                        {achievement.title}
                      </p>
                      {stryMutAct_9fa48("16333") ? achievement.badge || <Badge variant="default" className="text-xs">
                          {achievement.badge}
                        </Badge> : stryMutAct_9fa48("16332") ? false : stryMutAct_9fa48("16331") ? true : (stryCov_9fa48("16331", "16332", "16333"), achievement.badge && <Badge variant="default" className="text-xs">
                          {achievement.badge}
                        </Badge>)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    {stryMutAct_9fa48("16336") ? achievement.progress || <div className="text-xs text-muted-foreground">
                        Progreso: {achievement.progress.current} / {achievement.progress.target}
                      </div> : stryMutAct_9fa48("16335") ? false : stryMutAct_9fa48("16334") ? true : (stryCov_9fa48("16334", "16335", "16336"), achievement.progress && <div className="text-xs text-muted-foreground">
                        Progreso: {achievement.progress.current} / {achievement.progress.target}
                      </div>)}
                  </div>
                </div>
              </div>;
            }
          })}
        </div>
      </CardContent>
    </Card>;
  }
}