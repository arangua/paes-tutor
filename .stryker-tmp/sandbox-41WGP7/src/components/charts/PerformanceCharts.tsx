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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
interface SubjectPerformanceChartProps {
  data: Array<{
    name: string;
    porcentaje: number;
  }>;
}
export function SubjectPerformanceChart({
  data
}: SubjectPerformanceChartProps) {
  if (stryMutAct_9fa48("16187")) {
    {}
  } else {
    stryCov_9fa48("16187");
    if (stryMutAct_9fa48("16190") ? data.length !== 0 : stryMutAct_9fa48("16189") ? false : stryMutAct_9fa48("16188") ? true : (stryCov_9fa48("16188", "16189", "16190"), data.length === 0)) {
      if (stryMutAct_9fa48("16191")) {
        {}
      } else {
        stryCov_9fa48("16191");
        return <div className="flex items-center justify-center h-[300px] text-gray-500">
        <p>No hay datos para mostrar</p>
      </div>;
      }
    }
    return <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="porcentaje" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>;
  }
}
interface RecentAttemptsChartProps {
  data: Array<{
    name: string;
    porcentaje: number;
  }>;
}
export function RecentAttemptsChart({
  data
}: RecentAttemptsChartProps) {
  if (stryMutAct_9fa48("16192")) {
    {}
  } else {
    stryCov_9fa48("16192");
    if (stryMutAct_9fa48("16195") ? data.length !== 0 : stryMutAct_9fa48("16194") ? false : stryMutAct_9fa48("16193") ? true : (stryCov_9fa48("16193", "16194", "16195"), data.length === 0)) {
      if (stryMutAct_9fa48("16196")) {
        {}
      } else {
        stryCov_9fa48("16196");
        return <div className="flex items-center justify-center h-[300px] text-gray-500">
        <p>No hay datos para mostrar</p>
      </div>;
      }
    }
    return <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="porcentaje" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>;
  }
}