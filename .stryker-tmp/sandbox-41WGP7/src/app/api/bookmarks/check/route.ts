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
export const runtime = stryMutAct_9fa48("7399") ? "" : (stryCov_9fa48("7399"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("7400")) {
    {}
  } else {
    stryCov_9fa48("7400");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7401")) {
        {}
      } else {
        stryCov_9fa48("7401");
        try {
          if (stryMutAct_9fa48("7402")) {
            {}
          } else {
            stryCov_9fa48("7402");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7405") ? false : stryMutAct_9fa48("7404") ? true : stryMutAct_9fa48("7403") ? dbUser?.email : (stryCov_9fa48("7403", "7404", "7405"), !(stryMutAct_9fa48("7406") ? dbUser.email : (stryCov_9fa48("7406"), dbUser?.email)))) {
              if (stryMutAct_9fa48("7407")) {
                {}
              } else {
                stryCov_9fa48("7407");
                return NextResponse.json(stryMutAct_9fa48("7408") ? {} : (stryCov_9fa48("7408"), {
                  error: stryMutAct_9fa48("7409") ? "" : (stryCov_9fa48("7409"), 'No autorizado')
                }), stryMutAct_9fa48("7410") ? {} : (stryCov_9fa48("7410"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("7413") ? false : stryMutAct_9fa48("7412") ? true : stryMutAct_9fa48("7411") ? dbUser.student : (stryCov_9fa48("7411", "7412", "7413"), !dbUser.student)) {
              if (stryMutAct_9fa48("7414")) {
                {}
              } else {
                stryCov_9fa48("7414");
                return NextResponse.json(stryMutAct_9fa48("7415") ? {} : (stryCov_9fa48("7415"), {
                  error: stryMutAct_9fa48("7416") ? "" : (stryCov_9fa48("7416"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("7417") ? {} : (stryCov_9fa48("7417"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const questionIds = searchParams.get(stryMutAct_9fa48("7418") ? "" : (stryCov_9fa48("7418"), 'questionIds'));
            if (stryMutAct_9fa48("7421") ? false : stryMutAct_9fa48("7420") ? true : stryMutAct_9fa48("7419") ? questionIds : (stryCov_9fa48("7419", "7420", "7421"), !questionIds)) {
              if (stryMutAct_9fa48("7422")) {
                {}
              } else {
                stryCov_9fa48("7422");
                return NextResponse.json(stryMutAct_9fa48("7423") ? {} : (stryCov_9fa48("7423"), {
                  error: stryMutAct_9fa48("7424") ? "" : (stryCov_9fa48("7424"), 'IDs de preguntas requeridos')
                }), stryMutAct_9fa48("7425") ? {} : (stryCov_9fa48("7425"), {
                  status: 400
                }));
              }
            }
            const ids = stryMutAct_9fa48("7426") ? questionIds.split(',') : (stryCov_9fa48("7426"), questionIds.split(stryMutAct_9fa48("7427") ? "" : (stryCov_9fa48("7427"), ',')).filter(Boolean));
            const bookmarks = await prisma.bookmark.findMany(stryMutAct_9fa48("7428") ? {} : (stryCov_9fa48("7428"), {
              where: stryMutAct_9fa48("7429") ? {} : (stryCov_9fa48("7429"), {
                studentId: dbUser.student.id,
                questionId: stryMutAct_9fa48("7430") ? {} : (stryCov_9fa48("7430"), {
                  in: ids
                })
              }),
              select: stryMutAct_9fa48("7431") ? {} : (stryCov_9fa48("7431"), {
                questionId: stryMutAct_9fa48("7432") ? false : (stryCov_9fa48("7432"), true)
              })
            }));
            const bookmarkedIds = new Set(bookmarks.map(stryMutAct_9fa48("7433") ? () => undefined : (stryCov_9fa48("7433"), b => b.questionId)));
            return NextResponse.json(stryMutAct_9fa48("7434") ? {} : (stryCov_9fa48("7434"), {
              bookmarked: ids.map(stryMutAct_9fa48("7435") ? () => undefined : (stryCov_9fa48("7435"), id => stryMutAct_9fa48("7436") ? {} : (stryCov_9fa48("7436"), {
                questionId: id,
                isBookmarked: bookmarkedIds.has(id)
              })))
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7437")) {
            {}
          } else {
            stryCov_9fa48("7437");
            logger.error(stryMutAct_9fa48("7438") ? {} : (stryCov_9fa48("7438"), {
              type: stryMutAct_9fa48("7439") ? "" : (stryCov_9fa48("7439"), 'bookmarks_check_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("7440") ? "" : (stryCov_9fa48("7440"), 'Error al verificar favoritos'));
            return NextResponse.json(stryMutAct_9fa48("7441") ? {} : (stryCov_9fa48("7441"), {
              error: stryMutAct_9fa48("7442") ? "" : (stryCov_9fa48("7442"), 'Error al verificar favoritos')
            }), stryMutAct_9fa48("7443") ? {} : (stryCov_9fa48("7443"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}