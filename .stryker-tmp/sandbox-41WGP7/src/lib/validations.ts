// @ts-nocheck
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
import { z } from 'zod';

// Esquemas de validación para APIs
export const studentQuerySchema = z.object(stryMutAct_9fa48("26535") ? {} : (stryCov_9fa48("26535"), {
  include: z.enum(stryMutAct_9fa48("26536") ? [] : (stryCov_9fa48("26536"), [stryMutAct_9fa48("26537") ? "" : (stryCov_9fa48("26537"), 'attempts'), stryMutAct_9fa48("26538") ? "" : (stryCov_9fa48("26538"), 'metrics')])).array().optional()
}));
export const attemptQuerySchema = z.object(stryMutAct_9fa48("26539") ? {} : (stryCov_9fa48("26539"), {
  limit: stryMutAct_9fa48("26541") ? z.coerce.number().int().max(1).max(100).optional().default(10) : stryMutAct_9fa48("26540") ? z.coerce.number().int().min(1).min(100).optional().default(10) : (stryCov_9fa48("26540", "26541"), z.coerce.number().int().min(1).max(100).optional().default(10)),
  offset: stryMutAct_9fa48("26542") ? z.coerce.number().int().max(0).optional().default(0) : (stryCov_9fa48("26542"), z.coerce.number().int().min(0).optional().default(0))
}));
export const examQuerySchema = z.object(stryMutAct_9fa48("26543") ? {} : (stryCov_9fa48("26543"), {
  subjectId: z.string().optional(),
  tipo: z.string().optional(),
  limit: stryMutAct_9fa48("26545") ? z.coerce.number().int().max(1).max(100).optional().default(20) : stryMutAct_9fa48("26544") ? z.coerce.number().int().min(1).min(100).optional().default(20) : (stryCov_9fa48("26544", "26545"), z.coerce.number().int().min(1).max(100).optional().default(20)),
  offset: stryMutAct_9fa48("26546") ? z.coerce.number().int().max(0).optional().default(0) : (stryCov_9fa48("26546"), z.coerce.number().int().min(0).optional().default(0))
}));
export const metricsQuerySchema = z.object(stryMutAct_9fa48("26547") ? {} : (stryCov_9fa48("26547"), {
  subjectId: z.string().optional(),
  topicId: z.string().optional()
}));
export const materialsQuerySchema = z.object(stryMutAct_9fa48("26548") ? {} : (stryCov_9fa48("26548"), {
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  tipo: z.string().optional(),
  limit: stryMutAct_9fa48("26550") ? z.coerce.number().int().max(1).max(100).optional().default(20) : stryMutAct_9fa48("26549") ? z.coerce.number().int().min(1).min(100).optional().default(20) : (stryCov_9fa48("26549", "26550"), z.coerce.number().int().min(1).max(100).optional().default(20)),
  offset: stryMutAct_9fa48("26551") ? z.coerce.number().int().max(0).optional().default(0) : (stryCov_9fa48("26551"), z.coerce.number().int().min(0).optional().default(0))
}));

// Esquemas para creación/actualización
export const createAttemptSchema = z.object(stryMutAct_9fa48("26552") ? {} : (stryCov_9fa48("26552"), {
  examId: stryMutAct_9fa48("26553") ? z.string().max(1) : (stryCov_9fa48("26553"), z.string().min(1)),
  proceso: z.string().optional(),
  tipoAplicacion: z.string().optional(),
  forma: z.string().optional()
}));
export const updateAttemptSchema = z.object(stryMutAct_9fa48("26554") ? {} : (stryCov_9fa48("26554"), {
  estado: z.enum(stryMutAct_9fa48("26555") ? [] : (stryCov_9fa48("26555"), [stryMutAct_9fa48("26556") ? "" : (stryCov_9fa48("26556"), 'en_progreso'), stryMutAct_9fa48("26557") ? "" : (stryCov_9fa48("26557"), 'completado'), stryMutAct_9fa48("26558") ? "" : (stryCov_9fa48("26558"), 'cancelado')])).optional(),
  answers: z.array(z.object(stryMutAct_9fa48("26559") ? {} : (stryCov_9fa48("26559"), {
    questionId: stryMutAct_9fa48("26560") ? z.string().max(1) : (stryCov_9fa48("26560"), z.string().min(1)),
    optionSelectedId: z.string().optional(),
    omitida: z.boolean().optional().default(stryMutAct_9fa48("26561") ? true : (stryCov_9fa48("26561"), false))
  }))).optional()
}));

// Esquema para autenticación
export const signInSchema = z.object(stryMutAct_9fa48("26562") ? {} : (stryCov_9fa48("26562"), {
  email: z.string().email(stryMutAct_9fa48("26563") ? "" : (stryCov_9fa48("26563"), 'Email inválido')),
  password: stryMutAct_9fa48("26564") ? z.string().max(6, 'La contraseña debe tener al menos 6 caracteres') : (stryCov_9fa48("26564"), z.string().min(6, stryMutAct_9fa48("26565") ? "" : (stryCov_9fa48("26565"), 'La contraseña debe tener al menos 6 caracteres')))
}));
export const signUpSchema = z.object(stryMutAct_9fa48("26566") ? {} : (stryCov_9fa48("26566"), {
  email: z.string().email(stryMutAct_9fa48("26567") ? "" : (stryCov_9fa48("26567"), 'Email inválido')),
  password: stryMutAct_9fa48("26568") ? z.string().max(6, 'La contraseña debe tener al menos 6 caracteres') : (stryCov_9fa48("26568"), z.string().min(6, stryMutAct_9fa48("26569") ? "" : (stryCov_9fa48("26569"), 'La contraseña debe tener al menos 6 caracteres'))),
  name: stryMutAct_9fa48("26570") ? z.string().max(1, 'El nombre es requerido') : (stryCov_9fa48("26570"), z.string().min(1, stryMutAct_9fa48("26571") ? "" : (stryCov_9fa48("26571"), 'El nombre es requerido'))),
  nombre: stryMutAct_9fa48("26572") ? z.string().max(1, 'El nombre del estudiante es requerido') : (stryCov_9fa48("26572"), z.string().min(1, stryMutAct_9fa48("26573") ? "" : (stryCov_9fa48("26573"), 'El nombre del estudiante es requerido')))
}));