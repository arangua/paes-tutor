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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
interface StatsCardProps {
  title: string;
  description?: string;
  value: number;
  maxValue?: number;
  percentage?: number;
  comparison?: {
    value: number;
    label: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  icon?: React.ReactNode;
  className?: string;
}
export function StatsCard({
  title,
  description,
  value,
  maxValue,
  percentage,
  comparison,
  badge,
  icon,
  className
}: StatsCardProps) {
  if (stryMutAct_9fa48("17082")) {
    {}
  } else {
    stryCov_9fa48("17082");
    const showProgress = stryMutAct_9fa48("17085") ? percentage === undefined : stryMutAct_9fa48("17084") ? false : stryMutAct_9fa48("17083") ? true : (stryCov_9fa48("17083", "17084", "17085"), percentage !== undefined);
    const showComparison = stryMutAct_9fa48("17088") ? comparison === undefined : stryMutAct_9fa48("17087") ? false : stryMutAct_9fa48("17086") ? true : (stryCov_9fa48("17086", "17087", "17088"), comparison !== undefined);
    const diff = showComparison ? stryMutAct_9fa48("17089") ? value + comparison.value : (stryCov_9fa48("17089"), value - comparison.value) : 0;
    const isPositive = stryMutAct_9fa48("17093") ? diff <= 0 : stryMutAct_9fa48("17092") ? diff >= 0 : stryMutAct_9fa48("17091") ? false : stryMutAct_9fa48("17090") ? true : (stryCov_9fa48("17090", "17091", "17092", "17093"), diff > 0);
    const isNegative = stryMutAct_9fa48("17097") ? diff >= 0 : stryMutAct_9fa48("17096") ? diff <= 0 : stryMutAct_9fa48("17095") ? false : stryMutAct_9fa48("17094") ? true : (stryCov_9fa48("17094", "17095", "17096", "17097"), diff < 0);
    const isNeutral = stryMutAct_9fa48("17100") ? diff !== 0 : stryMutAct_9fa48("17099") ? false : stryMutAct_9fa48("17098") ? true : (stryCov_9fa48("17098", "17099", "17100"), diff === 0);
    return <Card className={cn(stryMutAct_9fa48("17101") ? "Stryker was here!" : (stryCov_9fa48("17101"), ''), className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          {stryMutAct_9fa48("17104") ? icon || <div className="text-muted-foreground">{icon}</div> : stryMutAct_9fa48("17103") ? false : stryMutAct_9fa48("17102") ? true : (stryCov_9fa48("17102", "17103", "17104"), icon && <div className="text-muted-foreground">{icon}</div>)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">
              {(stryMutAct_9fa48("17107") ? maxValue === undefined : stryMutAct_9fa48("17106") ? false : stryMutAct_9fa48("17105") ? true : (stryCov_9fa48("17105", "17106", "17107"), maxValue !== undefined)) ? stryMutAct_9fa48("17108") ? `` : (stryCov_9fa48("17108"), `${value} / ${maxValue}`) : value}
            </div>
            {stryMutAct_9fa48("17111") ? percentage !== undefined || <span className="text-lg text-muted-foreground">({percentage.toFixed(1)}%)</span> : stryMutAct_9fa48("17110") ? false : stryMutAct_9fa48("17109") ? true : (stryCov_9fa48("17109", "17110", "17111"), (stryMutAct_9fa48("17113") ? percentage === undefined : stryMutAct_9fa48("17112") ? true : (stryCov_9fa48("17112", "17113"), percentage !== undefined)) && <span className="text-lg text-muted-foreground">({percentage.toFixed(1)}%)</span>)}
            {stryMutAct_9fa48("17116") ? badge || <Badge variant={badge.variant || 'default'} className="ml-auto">
                {badge.text}
              </Badge> : stryMutAct_9fa48("17115") ? false : stryMutAct_9fa48("17114") ? true : (stryCov_9fa48("17114", "17115", "17116"), badge && <Badge variant={stryMutAct_9fa48("17119") ? badge.variant && 'default' : stryMutAct_9fa48("17118") ? false : stryMutAct_9fa48("17117") ? true : (stryCov_9fa48("17117", "17118", "17119"), badge.variant || (stryMutAct_9fa48("17120") ? "" : (stryCov_9fa48("17120"), 'default')))} className="ml-auto">
                {badge.text}
              </Badge>)}
          </div>

          {stryMutAct_9fa48("17123") ? description || <p className="text-sm text-muted-foreground">{description}</p> : stryMutAct_9fa48("17122") ? false : stryMutAct_9fa48("17121") ? true : (stryCov_9fa48("17121", "17122", "17123"), description && <p className="text-sm text-muted-foreground">{description}</p>)}

          {stryMutAct_9fa48("17126") ? showProgress || <Progress value={percentage} className="h-2" /> : stryMutAct_9fa48("17125") ? false : stryMutAct_9fa48("17124") ? true : (stryCov_9fa48("17124", "17125", "17126"), showProgress && <Progress value={percentage} className="h-2" />)}

          {stryMutAct_9fa48("17129") ? showComparison || <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn('flex items-center gap-1 text-sm pt-1 cursor-help', isPositive && 'text-green-600', isNegative && 'text-red-600', isNeutral && 'text-muted-foreground')}>
                  {isPositive && <TrendingUp className="h-4 w-4" />}
                  {isNegative && <TrendingDown className="h-4 w-4" />}
                  {isNeutral && <Minus className="h-4 w-4" />}
                  <span>
                    {isPositive && '+'}
                    {diff.toFixed(1)}% vs {comparison.label}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Comparación con {comparison.label}.{' '}
                  {isPositive ? 'Estás por encima' : isNegative ? 'Estás por debajo' : 'Estás igual'}{' '}
                  del promedio.
                </p>
              </TooltipContent>
            </Tooltip> : stryMutAct_9fa48("17128") ? false : stryMutAct_9fa48("17127") ? true : (stryCov_9fa48("17127", "17128", "17129"), showComparison && <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(stryMutAct_9fa48("17130") ? "" : (stryCov_9fa48("17130"), 'flex items-center gap-1 text-sm pt-1 cursor-help'), stryMutAct_9fa48("17133") ? isPositive || 'text-green-600' : stryMutAct_9fa48("17132") ? false : stryMutAct_9fa48("17131") ? true : (stryCov_9fa48("17131", "17132", "17133"), isPositive && (stryMutAct_9fa48("17134") ? "" : (stryCov_9fa48("17134"), 'text-green-600'))), stryMutAct_9fa48("17137") ? isNegative || 'text-red-600' : stryMutAct_9fa48("17136") ? false : stryMutAct_9fa48("17135") ? true : (stryCov_9fa48("17135", "17136", "17137"), isNegative && (stryMutAct_9fa48("17138") ? "" : (stryCov_9fa48("17138"), 'text-red-600'))), stryMutAct_9fa48("17141") ? isNeutral || 'text-muted-foreground' : stryMutAct_9fa48("17140") ? false : stryMutAct_9fa48("17139") ? true : (stryCov_9fa48("17139", "17140", "17141"), isNeutral && (stryMutAct_9fa48("17142") ? "" : (stryCov_9fa48("17142"), 'text-muted-foreground'))))}>
                  {stryMutAct_9fa48("17145") ? isPositive || <TrendingUp className="h-4 w-4" /> : stryMutAct_9fa48("17144") ? false : stryMutAct_9fa48("17143") ? true : (stryCov_9fa48("17143", "17144", "17145"), isPositive && <TrendingUp className="h-4 w-4" />)}
                  {stryMutAct_9fa48("17148") ? isNegative || <TrendingDown className="h-4 w-4" /> : stryMutAct_9fa48("17147") ? false : stryMutAct_9fa48("17146") ? true : (stryCov_9fa48("17146", "17147", "17148"), isNegative && <TrendingDown className="h-4 w-4" />)}
                  {stryMutAct_9fa48("17151") ? isNeutral || <Minus className="h-4 w-4" /> : stryMutAct_9fa48("17150") ? false : stryMutAct_9fa48("17149") ? true : (stryCov_9fa48("17149", "17150", "17151"), isNeutral && <Minus className="h-4 w-4" />)}
                  <span>
                    {stryMutAct_9fa48("17154") ? isPositive || '+' : stryMutAct_9fa48("17153") ? false : stryMutAct_9fa48("17152") ? true : (stryCov_9fa48("17152", "17153", "17154"), isPositive && (stryMutAct_9fa48("17155") ? "" : (stryCov_9fa48("17155"), '+')))}
                    {diff.toFixed(1)}% vs {comparison.label}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Comparación con {comparison.label}.{stryMutAct_9fa48("17156") ? "" : (stryCov_9fa48("17156"), ' ')}
                  {isPositive ? stryMutAct_9fa48("17157") ? "" : (stryCov_9fa48("17157"), 'Estás por encima') : isNegative ? stryMutAct_9fa48("17158") ? "" : (stryCov_9fa48("17158"), 'Estás por debajo') : stryMutAct_9fa48("17159") ? "" : (stryCov_9fa48("17159"), 'Estás igual')}{stryMutAct_9fa48("17160") ? "" : (stryCov_9fa48("17160"), ' ')}
                  del promedio.
                </p>
              </TooltipContent>
            </Tooltip>)}
        </div>
      </CardContent>
    </Card>;
  }
}