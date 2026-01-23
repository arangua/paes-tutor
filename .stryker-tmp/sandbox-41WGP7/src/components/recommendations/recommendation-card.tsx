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
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
interface TopicRecommendation {
  topicId: string;
  topicName: string;
  subjectName: string;
  subjectCode: string;
  currentPercentage: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
}
interface ExamRecommendation {
  examId: string;
  examTitle: string;
  subjectName: string;
  subjectCode: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  focusTopics: string[];
}
interface RecommendationCardProps {
  type: 'topic' | 'exam';
  recommendation: TopicRecommendation | ExamRecommendation;
  className?: string;
}
export function RecommendationCard({
  type,
  recommendation,
  className
}: RecommendationCardProps) {
  if (stryMutAct_9fa48("19073")) {
    {}
  } else {
    stryCov_9fa48("19073");
    const isTopic = stryMutAct_9fa48("19076") ? type !== 'topic' : stryMutAct_9fa48("19075") ? false : stryMutAct_9fa48("19074") ? true : (stryCov_9fa48("19074", "19075", "19076"), type === (stryMutAct_9fa48("19077") ? "" : (stryCov_9fa48("19077"), 'topic')));
    const topicRec = isTopic ? recommendation as TopicRecommendation : null;
    const examRec = (stryMutAct_9fa48("19078") ? isTopic : (stryCov_9fa48("19078"), !isTopic)) ? recommendation as ExamRecommendation : null;
    const priorityColors = stryMutAct_9fa48("19079") ? {} : (stryCov_9fa48("19079"), {
      high: stryMutAct_9fa48("19080") ? "" : (stryCov_9fa48("19080"), 'border-red-500 bg-red-50 dark:bg-red-950/20'),
      medium: stryMutAct_9fa48("19081") ? "" : (stryCov_9fa48("19081"), 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'),
      low: stryMutAct_9fa48("19082") ? "" : (stryCov_9fa48("19082"), 'border-blue-500 bg-blue-50 dark:bg-blue-950/20')
    });
    const priorityBadgeVariants = stryMutAct_9fa48("19083") ? {} : (stryCov_9fa48("19083"), {
      high: 'destructive' as const,
      medium: 'secondary' as const,
      low: 'default' as const
    });
    const priorityLabels = stryMutAct_9fa48("19084") ? {} : (stryCov_9fa48("19084"), {
      high: stryMutAct_9fa48("19085") ? "" : (stryCov_9fa48("19085"), 'Alta Prioridad'),
      medium: stryMutAct_9fa48("19086") ? "" : (stryCov_9fa48("19086"), 'Prioridad Media'),
      low: stryMutAct_9fa48("19087") ? "" : (stryCov_9fa48("19087"), 'Baja Prioridad')
    });
    return <Card className={cn(stryMutAct_9fa48("19088") ? "" : (stryCov_9fa48("19088"), 'transition-all hover:shadow-md'), priorityColors[recommendation.priority], className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isTopic ? <Target className="h-5 w-5 text-primary" /> : <BookOpen className="h-5 w-5 text-primary" />}
              <CardTitle className="text-lg">
                {isTopic ? topicRec!.topicName : examRec!.examTitle}
              </CardTitle>
            </div>
            <CardDescription>
              {isTopic ? topicRec!.subjectName : examRec!.subjectName}
            </CardDescription>
          </div>
          <Badge variant={priorityBadgeVariants[recommendation.priority]}>
            {priorityLabels[recommendation.priority]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Razón de la recomendación */}
        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
          <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm">{recommendation.reason}</p>
        </div>

        {/* Información específica */}
        {stryMutAct_9fa48("19091") ? isTopic && topicRec || <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rendimiento actual:</span>
              <span className={cn('font-semibold', topicRec.currentPercentage < 30 ? 'text-red-600' : topicRec.currentPercentage < 50 ? 'text-yellow-600' : 'text-green-600')}>
                {topicRec.currentPercentage.toFixed(1)}%
              </span>
            </div>

            {/* Acciones sugeridas */}
            {topicRec.suggestedActions.length > 0 && <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Acciones sugeridas:</p>
                <ul className="space-y-1">
                  {topicRec.suggestedActions.slice(0, 3).map((action, idx) => <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>)}
                </ul>
              </div>}
          </div> : stryMutAct_9fa48("19090") ? false : stryMutAct_9fa48("19089") ? true : (stryCov_9fa48("19089", "19090", "19091"), (stryMutAct_9fa48("19093") ? isTopic || topicRec : stryMutAct_9fa48("19092") ? true : (stryCov_9fa48("19092", "19093"), isTopic && topicRec)) && <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rendimiento actual:</span>
              <span className={cn(stryMutAct_9fa48("19094") ? "" : (stryCov_9fa48("19094"), 'font-semibold'), (stryMutAct_9fa48("19098") ? topicRec.currentPercentage >= 30 : stryMutAct_9fa48("19097") ? topicRec.currentPercentage <= 30 : stryMutAct_9fa48("19096") ? false : stryMutAct_9fa48("19095") ? true : (stryCov_9fa48("19095", "19096", "19097", "19098"), topicRec.currentPercentage < 30)) ? stryMutAct_9fa48("19099") ? "" : (stryCov_9fa48("19099"), 'text-red-600') : (stryMutAct_9fa48("19103") ? topicRec.currentPercentage >= 50 : stryMutAct_9fa48("19102") ? topicRec.currentPercentage <= 50 : stryMutAct_9fa48("19101") ? false : stryMutAct_9fa48("19100") ? true : (stryCov_9fa48("19100", "19101", "19102", "19103"), topicRec.currentPercentage < 50)) ? stryMutAct_9fa48("19104") ? "" : (stryCov_9fa48("19104"), 'text-yellow-600') : stryMutAct_9fa48("19105") ? "" : (stryCov_9fa48("19105"), 'text-green-600'))}>
                {topicRec.currentPercentage.toFixed(1)}%
              </span>
            </div>

            {/* Acciones sugeridas */}
            {stryMutAct_9fa48("19108") ? topicRec.suggestedActions.length > 0 || <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Acciones sugeridas:</p>
                <ul className="space-y-1">
                  {topicRec.suggestedActions.slice(0, 3).map((action, idx) => <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>)}
                </ul>
              </div> : stryMutAct_9fa48("19107") ? false : stryMutAct_9fa48("19106") ? true : (stryCov_9fa48("19106", "19107", "19108"), (stryMutAct_9fa48("19111") ? topicRec.suggestedActions.length <= 0 : stryMutAct_9fa48("19110") ? topicRec.suggestedActions.length >= 0 : stryMutAct_9fa48("19109") ? true : (stryCov_9fa48("19109", "19110", "19111"), topicRec.suggestedActions.length > 0)) && <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Acciones sugeridas:</p>
                <ul className="space-y-1">
                  {stryMutAct_9fa48("19112") ? topicRec.suggestedActions.map((action, idx) => <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>) : (stryCov_9fa48("19112"), topicRec.suggestedActions.slice(0, 3).map(stryMutAct_9fa48("19113") ? () => undefined : (stryCov_9fa48("19113"), (action, idx) => <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>)))}
                </ul>
              </div>)}
          </div>)}

        {stryMutAct_9fa48("19116") ? !isTopic && examRec || <div className="space-y-2">
            {examRec.focusTopics.length > 0 && <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Temas a reforzar en este examen:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examRec.focusTopics.slice(0, 3).map((topic, idx) => <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>)}
                </div>
              </div>}
          </div> : stryMutAct_9fa48("19115") ? false : stryMutAct_9fa48("19114") ? true : (stryCov_9fa48("19114", "19115", "19116"), (stryMutAct_9fa48("19118") ? !isTopic || examRec : stryMutAct_9fa48("19117") ? true : (stryCov_9fa48("19117", "19118"), (stryMutAct_9fa48("19119") ? isTopic : (stryCov_9fa48("19119"), !isTopic)) && examRec)) && <div className="space-y-2">
            {stryMutAct_9fa48("19122") ? examRec.focusTopics.length > 0 || <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Temas a reforzar en este examen:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examRec.focusTopics.slice(0, 3).map((topic, idx) => <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>)}
                </div>
              </div> : stryMutAct_9fa48("19121") ? false : stryMutAct_9fa48("19120") ? true : (stryCov_9fa48("19120", "19121", "19122"), (stryMutAct_9fa48("19125") ? examRec.focusTopics.length <= 0 : stryMutAct_9fa48("19124") ? examRec.focusTopics.length >= 0 : stryMutAct_9fa48("19123") ? true : (stryCov_9fa48("19123", "19124", "19125"), examRec.focusTopics.length > 0)) && <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Temas a reforzar en este examen:
                </p>
                <div className="flex flex-wrap gap-2">
                  {stryMutAct_9fa48("19126") ? examRec.focusTopics.map((topic, idx) => <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>) : (stryCov_9fa48("19126"), examRec.focusTopics.slice(0, 3).map(stryMutAct_9fa48("19127") ? () => undefined : (stryCov_9fa48("19127"), (topic, idx) => <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>)))}
                </div>
              </div>)}
          </div>)}

        {/* Acción */}
        <Button variant="default" className="w-full" asChild>
          <Link href={isTopic ? stryMutAct_9fa48("19128") ? `` : (stryCov_9fa48("19128"), `/exams?subject=${topicRec!.subjectCode}`) : stryMutAct_9fa48("19129") ? `` : (stryCov_9fa48("19129"), `/exams/${examRec!.examId}/take`)}>
            {isTopic ? stryMutAct_9fa48("19130") ? "" : (stryCov_9fa48("19130"), 'Ver Exámenes') : stryMutAct_9fa48("19131") ? "" : (stryCov_9fa48("19131"), 'Realizar Examen')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>;
  }
}