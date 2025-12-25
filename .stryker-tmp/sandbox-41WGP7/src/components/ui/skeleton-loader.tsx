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
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'form' | 'table';
  count?: number;
  className?: string;
}
export function SkeletonLoader({
  variant = stryMutAct_9fa48("21093") ? "" : (stryCov_9fa48("21093"), 'card'),
  count = 1,
  className
}: SkeletonLoaderProps) {
  if (stryMutAct_9fa48("21094")) {
    {}
  } else {
    stryCov_9fa48("21094");
    if (stryMutAct_9fa48("21097") ? variant !== 'card' : stryMutAct_9fa48("21096") ? false : stryMutAct_9fa48("21095") ? true : (stryCov_9fa48("21095", "21096", "21097"), variant === (stryMutAct_9fa48("21098") ? "" : (stryCov_9fa48("21098"), 'card')))) {
      if (stryMutAct_9fa48("21099")) {
        {}
      } else {
        stryCov_9fa48("21099");
        return <div className={className}>
        {Array.from(stryMutAct_9fa48("21100") ? {} : (stryCov_9fa48("21100"), {
            length: count
          })).map(stryMutAct_9fa48("21101") ? () => undefined : (stryCov_9fa48("21101"), (_, i) => <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>))}
      </div>;
      }
    }
    if (stryMutAct_9fa48("21104") ? variant !== 'list' : stryMutAct_9fa48("21103") ? false : stryMutAct_9fa48("21102") ? true : (stryCov_9fa48("21102", "21103", "21104"), variant === (stryMutAct_9fa48("21105") ? "" : (stryCov_9fa48("21105"), 'list')))) {
      if (stryMutAct_9fa48("21106")) {
        {}
      } else {
        stryCov_9fa48("21106");
        return <div className={className}>
        {Array.from(stryMutAct_9fa48("21107") ? {} : (stryCov_9fa48("21107"), {
            length: count
          })).map(stryMutAct_9fa48("21108") ? () => undefined : (stryCov_9fa48("21108"), (_, i) => <div key={i} className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>))}
      </div>;
      }
    }
    if (stryMutAct_9fa48("21111") ? variant !== 'form' : stryMutAct_9fa48("21110") ? false : stryMutAct_9fa48("21109") ? true : (stryCov_9fa48("21109", "21110", "21111"), variant === (stryMutAct_9fa48("21112") ? "" : (stryCov_9fa48("21112"), 'form')))) {
      if (stryMutAct_9fa48("21113")) {
        {}
      } else {
        stryCov_9fa48("21113");
        return <div className={className}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>;
      }
    }
    if (stryMutAct_9fa48("21116") ? variant !== 'table' : stryMutAct_9fa48("21115") ? false : stryMutAct_9fa48("21114") ? true : (stryCov_9fa48("21114", "21115", "21116"), variant === (stryMutAct_9fa48("21117") ? "" : (stryCov_9fa48("21117"), 'table')))) {
      if (stryMutAct_9fa48("21118")) {
        {}
      } else {
        stryCov_9fa48("21118");
        return <div className={className}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          {/* Rows */}
          {Array.from(stryMutAct_9fa48("21119") ? {} : (stryCov_9fa48("21119"), {
              length: count
            })).map(stryMutAct_9fa48("21120") ? () => undefined : (stryCov_9fa48("21120"), (_, i) => <div key={i} className="flex space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>))}
        </div>
      </div>;
      }
    }
    return null;
  }
}