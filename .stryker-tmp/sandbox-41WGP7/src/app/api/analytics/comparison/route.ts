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
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserWithStudent } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("5469") ? "" : (stryCov_9fa48("5469"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("5470")) {
    {}
  } else {
    stryCov_9fa48("5470");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5471")) {
        {}
      } else {
        stryCov_9fa48("5471");
        try {
          if (stryMutAct_9fa48("5472")) {
            {}
          } else {
            stryCov_9fa48("5472");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("5475") ? false : stryMutAct_9fa48("5474") ? true : stryMutAct_9fa48("5473") ? dbUser?.email : (stryCov_9fa48("5473", "5474", "5475"), !(stryMutAct_9fa48("5476") ? dbUser.email : (stryCov_9fa48("5476"), dbUser?.email)))) {
              if (stryMutAct_9fa48("5477")) {
                {}
              } else {
                stryCov_9fa48("5477");
                return NextResponse.json(stryMutAct_9fa48("5478") ? {} : (stryCov_9fa48("5478"), {
                  error: stryMutAct_9fa48("5479") ? "" : (stryCov_9fa48("5479"), 'No autorizado')
                }), stryMutAct_9fa48("5480") ? {} : (stryCov_9fa48("5480"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("5483") ? false : stryMutAct_9fa48("5482") ? true : stryMutAct_9fa48("5481") ? dbUser.student : (stryCov_9fa48("5481", "5482", "5483"), !dbUser.student)) {
              if (stryMutAct_9fa48("5484")) {
                {}
              } else {
                stryCov_9fa48("5484");
                return NextResponse.json(stryMutAct_9fa48("5485") ? {} : (stryCov_9fa48("5485"), {
                  error: stryMutAct_9fa48("5486") ? "" : (stryCov_9fa48("5486"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("5487") ? {} : (stryCov_9fa48("5487"), {
                  status: 404
                }));
              }
            }

            // Obtener todos los intentos completados de todos los estudiantes
            // Limitar a 10,000 intentos para evitar problemas de performance
            const allAttempts = await prisma.attempt.findMany(stryMutAct_9fa48("5488") ? {} : (stryCov_9fa48("5488"), {
              where: stryMutAct_9fa48("5489") ? {} : (stryCov_9fa48("5489"), {
                estado: stryMutAct_9fa48("5490") ? "" : (stryCov_9fa48("5490"), 'completado')
              }),
              take: 10000,
              select: stryMutAct_9fa48("5491") ? {} : (stryCov_9fa48("5491"), {
                id: stryMutAct_9fa48("5492") ? false : (stryCov_9fa48("5492"), true),
                studentId: stryMutAct_9fa48("5493") ? false : (stryCov_9fa48("5493"), true),
                porcentaje: stryMutAct_9fa48("5494") ? false : (stryCov_9fa48("5494"), true),
                puntajePaes: stryMutAct_9fa48("5495") ? false : (stryCov_9fa48("5495"), true),
                correctas: stryMutAct_9fa48("5496") ? false : (stryCov_9fa48("5496"), true),
                totalPreguntas: stryMutAct_9fa48("5497") ? false : (stryCov_9fa48("5497"), true),
                createdAt: stryMutAct_9fa48("5498") ? false : (stryCov_9fa48("5498"), true),
                exam: stryMutAct_9fa48("5499") ? {} : (stryCov_9fa48("5499"), {
                  select: stryMutAct_9fa48("5500") ? {} : (stryCov_9fa48("5500"), {
                    subjectId: stryMutAct_9fa48("5501") ? false : (stryCov_9fa48("5501"), true),
                    subject: stryMutAct_9fa48("5502") ? {} : (stryCov_9fa48("5502"), {
                      select: stryMutAct_9fa48("5503") ? {} : (stryCov_9fa48("5503"), {
                        codigo: stryMutAct_9fa48("5504") ? false : (stryCov_9fa48("5504"), true),
                        nombre: stryMutAct_9fa48("5505") ? false : (stryCov_9fa48("5505"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("5506") ? {} : (stryCov_9fa48("5506"), {
                porcentaje: stryMutAct_9fa48("5507") ? "" : (stryCov_9fa48("5507"), 'desc')
              })
            }));
            if (stryMutAct_9fa48("5510") ? allAttempts.length !== 0 : stryMutAct_9fa48("5509") ? false : stryMutAct_9fa48("5508") ? true : (stryCov_9fa48("5508", "5509", "5510"), allAttempts.length === 0)) {
              if (stryMutAct_9fa48("5511")) {
                {}
              } else {
                stryCov_9fa48("5511");
                return NextResponse.json(stryMutAct_9fa48("5512") ? {} : (stryCov_9fa48("5512"), {
                  message: stryMutAct_9fa48("5513") ? "" : (stryCov_9fa48("5513"), 'No hay datos suficientes para comparación'),
                  userStats: null,
                  overallStats: null,
                  subjectStats: null
                }));
              }
            }

            // Calcular estadísticas generales
            const percentages = allAttempts.map(stryMutAct_9fa48("5514") ? () => undefined : (stryCov_9fa48("5514"), a => a.porcentaje));
            const paesScores = stryMutAct_9fa48("5515") ? allAttempts.map(a => a.puntajePaes) : (stryCov_9fa48("5515"), allAttempts.map(stryMutAct_9fa48("5516") ? () => undefined : (stryCov_9fa48("5516"), a => a.puntajePaes)).filter(stryMutAct_9fa48("5517") ? () => undefined : (stryCov_9fa48("5517"), (p): p is number => stryMutAct_9fa48("5520") ? p === null : stryMutAct_9fa48("5519") ? false : stryMutAct_9fa48("5518") ? true : (stryCov_9fa48("5518", "5519", "5520"), p !== null))));
            const overallStats = stryMutAct_9fa48("5521") ? {} : (stryCov_9fa48("5521"), {
              totalAttempts: allAttempts.length,
              averagePercentage: stryMutAct_9fa48("5522") ? percentages.reduce((a, b) => a + b, 0) * percentages.length : (stryCov_9fa48("5522"), percentages.reduce(stryMutAct_9fa48("5523") ? () => undefined : (stryCov_9fa48("5523"), (a, b) => stryMutAct_9fa48("5524") ? a - b : (stryCov_9fa48("5524"), a + b)), 0) / percentages.length),
              medianPercentage: calculateMedian(percentages),
              minPercentage: stryMutAct_9fa48("5525") ? Math.max(...percentages) : (stryCov_9fa48("5525"), Math.min(...percentages)),
              maxPercentage: stryMutAct_9fa48("5526") ? Math.min(...percentages) : (stryCov_9fa48("5526"), Math.max(...percentages)),
              averagePaesScore: (stryMutAct_9fa48("5530") ? paesScores.length <= 0 : stryMutAct_9fa48("5529") ? paesScores.length >= 0 : stryMutAct_9fa48("5528") ? false : stryMutAct_9fa48("5527") ? true : (stryCov_9fa48("5527", "5528", "5529", "5530"), paesScores.length > 0)) ? stryMutAct_9fa48("5531") ? paesScores.reduce((a, b) => a + b, 0) * paesScores.length : (stryCov_9fa48("5531"), paesScores.reduce(stryMutAct_9fa48("5532") ? () => undefined : (stryCov_9fa48("5532"), (a, b) => stryMutAct_9fa48("5533") ? a - b : (stryCov_9fa48("5533"), a + b)), 0) / paesScores.length) : null,
              medianPaesScore: (stryMutAct_9fa48("5537") ? paesScores.length <= 0 : stryMutAct_9fa48("5536") ? paesScores.length >= 0 : stryMutAct_9fa48("5535") ? false : stryMutAct_9fa48("5534") ? true : (stryCov_9fa48("5534", "5535", "5536", "5537"), paesScores.length > 0)) ? calculateMedian(paesScores) : null
            });

            // Obtener intentos del usuario actual
            const userAttempts = stryMutAct_9fa48("5538") ? allAttempts : (stryCov_9fa48("5538"), allAttempts.filter(stryMutAct_9fa48("5539") ? () => undefined : (stryCov_9fa48("5539"), a => stryMutAct_9fa48("5542") ? a.studentId !== dbUser.student.id : stryMutAct_9fa48("5541") ? false : stryMutAct_9fa48("5540") ? true : (stryCov_9fa48("5540", "5541", "5542"), a.studentId === dbUser.student.id))));
            if (stryMutAct_9fa48("5545") ? userAttempts.length !== 0 : stryMutAct_9fa48("5544") ? false : stryMutAct_9fa48("5543") ? true : (stryCov_9fa48("5543", "5544", "5545"), userAttempts.length === 0)) {
              if (stryMutAct_9fa48("5546")) {
                {}
              } else {
                stryCov_9fa48("5546");
                return NextResponse.json(stryMutAct_9fa48("5547") ? {} : (stryCov_9fa48("5547"), {
                  message: stryMutAct_9fa48("5548") ? "" : (stryCov_9fa48("5548"), 'No tienes intentos completados'),
                  userStats: null,
                  overallStats,
                  subjectStats: null
                }));
              }
            }

            // Calcular percentil del usuario
            const userAveragePercentage = stryMutAct_9fa48("5549") ? userAttempts.reduce((sum, a) => sum + a.porcentaje, 0) * userAttempts.length : (stryCov_9fa48("5549"), userAttempts.reduce(stryMutAct_9fa48("5550") ? () => undefined : (stryCov_9fa48("5550"), (sum, a) => stryMutAct_9fa48("5551") ? sum - a.porcentaje : (stryCov_9fa48("5551"), sum + a.porcentaje)), 0) / userAttempts.length);
            const userBestPercentage = stryMutAct_9fa48("5552") ? Math.min(...userAttempts.map(a => a.porcentaje)) : (stryCov_9fa48("5552"), Math.max(...userAttempts.map(stryMutAct_9fa48("5553") ? () => undefined : (stryCov_9fa48("5553"), a => a.porcentaje))));
            const userAveragePaes = stryMutAct_9fa48("5554") ? userAttempts.map(a => a.puntajePaes) : (stryCov_9fa48("5554"), userAttempts.map(stryMutAct_9fa48("5555") ? () => undefined : (stryCov_9fa48("5555"), a => a.puntajePaes)).filter(stryMutAct_9fa48("5556") ? () => undefined : (stryCov_9fa48("5556"), (p): p is number => stryMutAct_9fa48("5559") ? p === null : stryMutAct_9fa48("5558") ? false : stryMutAct_9fa48("5557") ? true : (stryCov_9fa48("5557", "5558", "5559"), p !== null))));
            const userAveragePaesScore = (stryMutAct_9fa48("5563") ? userAveragePaes.length <= 0 : stryMutAct_9fa48("5562") ? userAveragePaes.length >= 0 : stryMutAct_9fa48("5561") ? false : stryMutAct_9fa48("5560") ? true : (stryCov_9fa48("5560", "5561", "5562", "5563"), userAveragePaes.length > 0)) ? stryMutAct_9fa48("5564") ? userAveragePaes.reduce((a, b) => a + b, 0) * userAveragePaes.length : (stryCov_9fa48("5564"), userAveragePaes.reduce(stryMutAct_9fa48("5565") ? () => undefined : (stryCov_9fa48("5565"), (a, b) => stryMutAct_9fa48("5566") ? a - b : (stryCov_9fa48("5566"), a + b)), 0) / userAveragePaes.length) : null;

            // Calcular percentil basado en porcentaje promedio
            const percentile = calculatePercentile(userAveragePercentage, percentages);
            const bestPercentile = calculatePercentile(userBestPercentage, percentages);

            // Calcular posición en ranking
            const sortedByAverage = (stryMutAct_9fa48("5567") ? [] : (stryCov_9fa48("5567"), [...allAttempts])).reduce((acc, attempt) => {
              if (stryMutAct_9fa48("5568")) {
                {}
              } else {
                stryCov_9fa48("5568");
                if (stryMutAct_9fa48("5571") ? false : stryMutAct_9fa48("5570") ? true : stryMutAct_9fa48("5569") ? acc[attempt.studentId] : (stryCov_9fa48("5569", "5570", "5571"), !acc[attempt.studentId])) {
                  if (stryMutAct_9fa48("5572")) {
                    {}
                  } else {
                    stryCov_9fa48("5572");
                    acc[attempt.studentId] = stryMutAct_9fa48("5573") ? ["Stryker was here"] : (stryCov_9fa48("5573"), []);
                  }
                }
                acc[attempt.studentId].push(attempt.porcentaje);
                return acc;
              }
            }, {} as Record<string, number[]>);
            const studentAverages = stryMutAct_9fa48("5574") ? Object.entries(sortedByAverage).map(([studentId, scores]) => ({
              studentId,
              average: scores.reduce((a, b) => a + b, 0) / scores.length,
              count: scores.length
            })) : (stryCov_9fa48("5574"), Object.entries(sortedByAverage).map(stryMutAct_9fa48("5575") ? () => undefined : (stryCov_9fa48("5575"), ([studentId, scores]) => stryMutAct_9fa48("5576") ? {} : (stryCov_9fa48("5576"), {
              studentId,
              average: stryMutAct_9fa48("5577") ? scores.reduce((a, b) => a + b, 0) * scores.length : (stryCov_9fa48("5577"), scores.reduce(stryMutAct_9fa48("5578") ? () => undefined : (stryCov_9fa48("5578"), (a, b) => stryMutAct_9fa48("5579") ? a - b : (stryCov_9fa48("5579"), a + b)), 0) / scores.length),
              count: scores.length
            }))).sort(stryMutAct_9fa48("5580") ? () => undefined : (stryCov_9fa48("5580"), (a, b) => stryMutAct_9fa48("5581") ? b.average + a.average : (stryCov_9fa48("5581"), b.average - a.average))));
            const userRank = stryMutAct_9fa48("5582") ? studentAverages.findIndex(s => s.studentId === dbUser.student.id) - 1 : (stryCov_9fa48("5582"), studentAverages.findIndex(stryMutAct_9fa48("5583") ? () => undefined : (stryCov_9fa48("5583"), s => stryMutAct_9fa48("5586") ? s.studentId !== dbUser.student.id : stryMutAct_9fa48("5585") ? false : stryMutAct_9fa48("5584") ? true : (stryCov_9fa48("5584", "5585", "5586"), s.studentId === dbUser.student.id))) + 1);
            const totalStudents = studentAverages.length;
            const userStats = stryMutAct_9fa48("5587") ? {} : (stryCov_9fa48("5587"), {
              totalAttempts: userAttempts.length,
              averagePercentage: userAveragePercentage,
              bestPercentage: userBestPercentage,
              averagePaesScore: userAveragePaesScore,
              percentile,
              bestPercentile,
              rank: userRank,
              totalStudents,
              rankPercentage: (stryMutAct_9fa48("5591") ? totalStudents <= 0 : stryMutAct_9fa48("5590") ? totalStudents >= 0 : stryMutAct_9fa48("5589") ? false : stryMutAct_9fa48("5588") ? true : (stryCov_9fa48("5588", "5589", "5590", "5591"), totalStudents > 0)) ? stryMutAct_9fa48("5592") ? (totalStudents - userRank + 1) / totalStudents / 100 : (stryCov_9fa48("5592"), (stryMutAct_9fa48("5593") ? (totalStudents - userRank + 1) * totalStudents : (stryCov_9fa48("5593"), (stryMutAct_9fa48("5594") ? totalStudents - userRank - 1 : (stryCov_9fa48("5594"), (stryMutAct_9fa48("5595") ? totalStudents + userRank : (stryCov_9fa48("5595"), totalStudents - userRank)) + 1)) / totalStudents)) * 100) : 0
            });

            // Calcular estadísticas por asignatura
            const subjectStats: Record<string, {
              subjectCode: string;
              subjectName: string;
              totalAttempts: number;
              userAttempts: number;
              userAverage: number;
              overallAverage: number;
              userPercentile: number;
              userRank: number;
              totalStudents: number;
            }> = {};

            // Agrupar por asignatura
            const attemptsBySubject = new Map<string, typeof allAttempts>();
            allAttempts.forEach(attempt => {
              if (stryMutAct_9fa48("5596")) {
                {}
              } else {
                stryCov_9fa48("5596");
                const subjectCode = attempt.exam.subject.codigo;
                if (stryMutAct_9fa48("5599") ? false : stryMutAct_9fa48("5598") ? true : stryMutAct_9fa48("5597") ? attemptsBySubject.has(subjectCode) : (stryCov_9fa48("5597", "5598", "5599"), !attemptsBySubject.has(subjectCode))) {
                  if (stryMutAct_9fa48("5600")) {
                    {}
                  } else {
                    stryCov_9fa48("5600");
                    attemptsBySubject.set(subjectCode, stryMutAct_9fa48("5601") ? ["Stryker was here"] : (stryCov_9fa48("5601"), []));
                  }
                }
                attemptsBySubject.get(subjectCode)!.push(attempt);
              }
            });
            attemptsBySubject.forEach((attempts, subjectCode) => {
              if (stryMutAct_9fa48("5602")) {
                {}
              } else {
                stryCov_9fa48("5602");
                const subjectName = attempts[0].exam.subject.nombre;
                const userSubjectAttempts = stryMutAct_9fa48("5603") ? attempts : (stryCov_9fa48("5603"), attempts.filter(stryMutAct_9fa48("5604") ? () => undefined : (stryCov_9fa48("5604"), a => stryMutAct_9fa48("5607") ? a.studentId !== dbUser.student.id : stryMutAct_9fa48("5606") ? false : stryMutAct_9fa48("5605") ? true : (stryCov_9fa48("5605", "5606", "5607"), a.studentId === dbUser.student.id))));
                if (stryMutAct_9fa48("5610") ? userSubjectAttempts.length !== 0 : stryMutAct_9fa48("5609") ? false : stryMutAct_9fa48("5608") ? true : (stryCov_9fa48("5608", "5609", "5610"), userSubjectAttempts.length === 0)) return;
                const userSubjectAverage = stryMutAct_9fa48("5611") ? userSubjectAttempts.reduce((sum, a) => sum + a.porcentaje, 0) * userSubjectAttempts.length : (stryCov_9fa48("5611"), userSubjectAttempts.reduce(stryMutAct_9fa48("5612") ? () => undefined : (stryCov_9fa48("5612"), (sum, a) => stryMutAct_9fa48("5613") ? sum - a.porcentaje : (stryCov_9fa48("5613"), sum + a.porcentaje)), 0) / userSubjectAttempts.length);
                const overallSubjectAverage = stryMutAct_9fa48("5614") ? attempts.reduce((sum, a) => sum + a.porcentaje, 0) * attempts.length : (stryCov_9fa48("5614"), attempts.reduce(stryMutAct_9fa48("5615") ? () => undefined : (stryCov_9fa48("5615"), (sum, a) => stryMutAct_9fa48("5616") ? sum - a.porcentaje : (stryCov_9fa48("5616"), sum + a.porcentaje)), 0) / attempts.length);
                const subjectPercentages = attempts.map(stryMutAct_9fa48("5617") ? () => undefined : (stryCov_9fa48("5617"), a => a.porcentaje));
                const userSubjectPercentile = calculatePercentile(userSubjectAverage, subjectPercentages);

                // Calcular ranking por asignatura
                const subjectStudentAverages = stryMutAct_9fa48("5618") ? Object.entries(attempts.reduce((acc, attempt) => {
                  if (!acc[attempt.studentId]) {
                    acc[attempt.studentId] = [];
                  }
                  acc[attempt.studentId].push(attempt.porcentaje);
                  return acc;
                }, {} as Record<string, number[]>)).map(([studentId, scores]) => ({
                  studentId,
                  average: scores.reduce((a, b) => a + b, 0) / scores.length
                })) : (stryCov_9fa48("5618"), Object.entries(attempts.reduce((acc, attempt) => {
                  if (stryMutAct_9fa48("5619")) {
                    {}
                  } else {
                    stryCov_9fa48("5619");
                    if (stryMutAct_9fa48("5622") ? false : stryMutAct_9fa48("5621") ? true : stryMutAct_9fa48("5620") ? acc[attempt.studentId] : (stryCov_9fa48("5620", "5621", "5622"), !acc[attempt.studentId])) {
                      if (stryMutAct_9fa48("5623")) {
                        {}
                      } else {
                        stryCov_9fa48("5623");
                        acc[attempt.studentId] = stryMutAct_9fa48("5624") ? ["Stryker was here"] : (stryCov_9fa48("5624"), []);
                      }
                    }
                    acc[attempt.studentId].push(attempt.porcentaje);
                    return acc;
                  }
                }, {} as Record<string, number[]>)).map(stryMutAct_9fa48("5625") ? () => undefined : (stryCov_9fa48("5625"), ([studentId, scores]) => stryMutAct_9fa48("5626") ? {} : (stryCov_9fa48("5626"), {
                  studentId,
                  average: stryMutAct_9fa48("5627") ? scores.reduce((a, b) => a + b, 0) * scores.length : (stryCov_9fa48("5627"), scores.reduce(stryMutAct_9fa48("5628") ? () => undefined : (stryCov_9fa48("5628"), (a, b) => stryMutAct_9fa48("5629") ? a - b : (stryCov_9fa48("5629"), a + b)), 0) / scores.length)
                }))).sort(stryMutAct_9fa48("5630") ? () => undefined : (stryCov_9fa48("5630"), (a, b) => stryMutAct_9fa48("5631") ? b.average + a.average : (stryCov_9fa48("5631"), b.average - a.average))));
                const userSubjectRank = stryMutAct_9fa48("5632") ? subjectStudentAverages.findIndex(s => s.studentId === dbUser.student.id) - 1 : (stryCov_9fa48("5632"), subjectStudentAverages.findIndex(stryMutAct_9fa48("5633") ? () => undefined : (stryCov_9fa48("5633"), s => stryMutAct_9fa48("5636") ? s.studentId !== dbUser.student.id : stryMutAct_9fa48("5635") ? false : stryMutAct_9fa48("5634") ? true : (stryCov_9fa48("5634", "5635", "5636"), s.studentId === dbUser.student.id))) + 1);
                const totalSubjectStudents = subjectStudentAverages.length;
                subjectStats[subjectCode] = stryMutAct_9fa48("5637") ? {} : (stryCov_9fa48("5637"), {
                  subjectCode,
                  subjectName,
                  totalAttempts: attempts.length,
                  userAttempts: userSubjectAttempts.length,
                  userAverage: userSubjectAverage,
                  overallAverage: overallSubjectAverage,
                  userPercentile: userSubjectPercentile,
                  userRank: userSubjectRank,
                  totalStudents: totalSubjectStudents
                });
              }
            });
            return NextResponse.json(stryMutAct_9fa48("5638") ? {} : (stryCov_9fa48("5638"), {
              userStats,
              overallStats,
              subjectStats: Object.values(subjectStats)
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5639")) {
            {}
          } else {
            stryCov_9fa48("5639");
            logger.error(stryMutAct_9fa48("5640") ? {} : (stryCov_9fa48("5640"), {
              type: stryMutAct_9fa48("5641") ? "" : (stryCov_9fa48("5641"), 'analytics_comparison_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("5642") ? "" : (stryCov_9fa48("5642"), 'Error al calcular comparación'));
            return NextResponse.json(stryMutAct_9fa48("5643") ? {} : (stryCov_9fa48("5643"), {
              error: stryMutAct_9fa48("5644") ? "" : (stryCov_9fa48("5644"), 'Error al calcular comparación')
            }), stryMutAct_9fa48("5645") ? {} : (stryCov_9fa48("5645"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
function calculatePercentile(value: number, array: number[]): number {
  if (stryMutAct_9fa48("5646")) {
    {}
  } else {
    stryCov_9fa48("5646");
    const sorted = stryMutAct_9fa48("5647") ? [...array] : (stryCov_9fa48("5647"), (stryMutAct_9fa48("5648") ? [] : (stryCov_9fa48("5648"), [...array])).sort(stryMutAct_9fa48("5649") ? () => undefined : (stryCov_9fa48("5649"), (a, b) => stryMutAct_9fa48("5650") ? a + b : (stryCov_9fa48("5650"), a - b))));
    const index = sorted.findIndex(stryMutAct_9fa48("5651") ? () => undefined : (stryCov_9fa48("5651"), v => stryMutAct_9fa48("5655") ? v < value : stryMutAct_9fa48("5654") ? v > value : stryMutAct_9fa48("5653") ? false : stryMutAct_9fa48("5652") ? true : (stryCov_9fa48("5652", "5653", "5654", "5655"), v >= value)));
    if (stryMutAct_9fa48("5658") ? index !== -1 : stryMutAct_9fa48("5657") ? false : stryMutAct_9fa48("5656") ? true : (stryCov_9fa48("5656", "5657", "5658"), index === (stryMutAct_9fa48("5659") ? +1 : (stryCov_9fa48("5659"), -1)))) return 100;
    return Math.round(stryMutAct_9fa48("5660") ? index / sorted.length / 100 : (stryCov_9fa48("5660"), (stryMutAct_9fa48("5661") ? index * sorted.length : (stryCov_9fa48("5661"), index / sorted.length)) * 100));
  }
}
function calculateMedian(array: number[]): number {
  if (stryMutAct_9fa48("5662")) {
    {}
  } else {
    stryCov_9fa48("5662");
    const sorted = stryMutAct_9fa48("5663") ? [...array] : (stryCov_9fa48("5663"), (stryMutAct_9fa48("5664") ? [] : (stryCov_9fa48("5664"), [...array])).sort(stryMutAct_9fa48("5665") ? () => undefined : (stryCov_9fa48("5665"), (a, b) => stryMutAct_9fa48("5666") ? a + b : (stryCov_9fa48("5666"), a - b))));
    const mid = Math.floor(stryMutAct_9fa48("5667") ? sorted.length * 2 : (stryCov_9fa48("5667"), sorted.length / 2));
    return (stryMutAct_9fa48("5670") ? sorted.length % 2 === 0 : stryMutAct_9fa48("5669") ? false : stryMutAct_9fa48("5668") ? true : (stryCov_9fa48("5668", "5669", "5670"), (stryMutAct_9fa48("5671") ? sorted.length * 2 : (stryCov_9fa48("5671"), sorted.length % 2)) !== 0)) ? sorted[mid] : stryMutAct_9fa48("5672") ? (sorted[mid - 1] + sorted[mid]) * 2 : (stryCov_9fa48("5672"), (stryMutAct_9fa48("5673") ? sorted[mid - 1] - sorted[mid] : (stryCov_9fa48("5673"), sorted[stryMutAct_9fa48("5674") ? mid + 1 : (stryCov_9fa48("5674"), mid - 1)] + sorted[mid])) / 2);
  }
}