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
import { getCurrentUser } from '@/lib/get-session';
import { handleApiError } from '@/lib/api-helpers';
import { withRateLimit, RateLimitType } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { validateBody } from '@/lib/api-helpers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("11095") ? "" : (stryCov_9fa48("11095"), 'nodejs');

// Schema de validación para cambiar contraseña
const changePasswordSchema = z.object(stryMutAct_9fa48("11096") ? {} : (stryCov_9fa48("11096"), {
  currentPassword: stryMutAct_9fa48("11097") ? z.string().max(1, 'La contraseña actual es requerida') : (stryCov_9fa48("11097"), z.string().min(1, stryMutAct_9fa48("11098") ? "" : (stryCov_9fa48("11098"), 'La contraseña actual es requerida'))),
  newPassword: stryMutAct_9fa48("11100") ? z.string().max(8, 'La nueva contraseña debe tener al menos 8 caracteres').max(100, 'La contraseña es demasiado larga').regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula').regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula').regex(/[0-9]/, 'La contraseña debe contener al menos un número') : stryMutAct_9fa48("11099") ? z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').min(100, 'La contraseña es demasiado larga').regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula').regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula').regex(/[0-9]/, 'La contraseña debe contener al menos un número') : (stryCov_9fa48("11099", "11100"), z.string().min(8, stryMutAct_9fa48("11101") ? "" : (stryCov_9fa48("11101"), 'La nueva contraseña debe tener al menos 8 caracteres')).max(100, stryMutAct_9fa48("11102") ? "" : (stryCov_9fa48("11102"), 'La contraseña es demasiado larga')).regex(stryMutAct_9fa48("11103") ? /[^A-Z]/ : (stryCov_9fa48("11103"), /[A-Z]/), stryMutAct_9fa48("11104") ? "" : (stryCov_9fa48("11104"), 'La contraseña debe contener al menos una mayúscula')).regex(stryMutAct_9fa48("11105") ? /[^a-z]/ : (stryCov_9fa48("11105"), /[a-z]/), stryMutAct_9fa48("11106") ? "" : (stryCov_9fa48("11106"), 'La contraseña debe contener al menos una minúscula')).regex(stryMutAct_9fa48("11107") ? /[^0-9]/ : (stryCov_9fa48("11107"), /[0-9]/), stryMutAct_9fa48("11108") ? "" : (stryCov_9fa48("11108"), 'La contraseña debe contener al menos un número'))),
  confirmPassword: z.string()
})).refine(stryMutAct_9fa48("11109") ? () => undefined : (stryCov_9fa48("11109"), data => stryMutAct_9fa48("11112") ? data.newPassword !== data.confirmPassword : stryMutAct_9fa48("11111") ? false : stryMutAct_9fa48("11110") ? true : (stryCov_9fa48("11110", "11111", "11112"), data.newPassword === data.confirmPassword)), stryMutAct_9fa48("11113") ? {} : (stryCov_9fa48("11113"), {
  message: stryMutAct_9fa48("11114") ? "" : (stryCov_9fa48("11114"), 'Las contraseñas no coinciden'),
  path: stryMutAct_9fa48("11115") ? [] : (stryCov_9fa48("11115"), [stryMutAct_9fa48("11116") ? "" : (stryCov_9fa48("11116"), 'confirmPassword')])
}));
export async function PUT(request: NextRequest) {
  if (stryMutAct_9fa48("11117")) {
    {}
  } else {
    stryCov_9fa48("11117");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("11118")) {
        {}
      } else {
        stryCov_9fa48("11118");
        try {
          if (stryMutAct_9fa48("11119")) {
            {}
          } else {
            stryCov_9fa48("11119");
            logApiRequest(stryMutAct_9fa48("11120") ? "" : (stryCov_9fa48("11120"), 'PUT'), stryMutAct_9fa48("11121") ? "" : (stryCov_9fa48("11121"), '/api/user/password'));
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("11124") ? false : stryMutAct_9fa48("11123") ? true : stryMutAct_9fa48("11122") ? user : (stryCov_9fa48("11122", "11123", "11124"), !user)) {
              if (stryMutAct_9fa48("11125")) {
                {}
              } else {
                stryCov_9fa48("11125");
                const {
                  logSecurityEvent,
                  getClientIp
                } = await import(stryMutAct_9fa48("11126") ? "" : (stryCov_9fa48("11126"), '@/lib/security-logger'));
                logSecurityEvent(stryMutAct_9fa48("11127") ? {} : (stryCov_9fa48("11127"), {
                  type: stryMutAct_9fa48("11128") ? "" : (stryCov_9fa48("11128"), 'unauthorized_access'),
                  ip: getClientIp(request),
                  path: stryMutAct_9fa48("11129") ? "" : (stryCov_9fa48("11129"), '/api/user/password'),
                  severity: stryMutAct_9fa48("11130") ? "" : (stryCov_9fa48("11130"), 'high')
                }));
                return NextResponse.json(stryMutAct_9fa48("11131") ? {} : (stryCov_9fa48("11131"), {
                  error: stryMutAct_9fa48("11132") ? "" : (stryCov_9fa48("11132"), 'No autorizado')
                }), stryMutAct_9fa48("11133") ? {} : (stryCov_9fa48("11133"), {
                  status: 401
                }));
              }
            }

            // Validar body
            const validation = await validateBody(request, changePasswordSchema);
            if (stryMutAct_9fa48("11136") ? false : stryMutAct_9fa48("11135") ? true : stryMutAct_9fa48("11134") ? validation.success : (stryCov_9fa48("11134", "11135", "11136"), !validation.success)) {
              if (stryMutAct_9fa48("11137")) {
                {}
              } else {
                stryCov_9fa48("11137");
                return validation.error;
              }
            }
            const {
              currentPassword,
              newPassword
            } = validation.data;

            // Obtener usuario con contraseña
            const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("11138") ? {} : (stryCov_9fa48("11138"), {
              where: stryMutAct_9fa48("11139") ? {} : (stryCov_9fa48("11139"), {
                id: user.id
              }),
              select: stryMutAct_9fa48("11140") ? {} : (stryCov_9fa48("11140"), {
                id: stryMutAct_9fa48("11141") ? false : (stryCov_9fa48("11141"), true),
                password: stryMutAct_9fa48("11142") ? false : (stryCov_9fa48("11142"), true)
              })
            }));
            if (stryMutAct_9fa48("11145") ? false : stryMutAct_9fa48("11144") ? true : stryMutAct_9fa48("11143") ? fullUser : (stryCov_9fa48("11143", "11144", "11145"), !fullUser)) {
              if (stryMutAct_9fa48("11146")) {
                {}
              } else {
                stryCov_9fa48("11146");
                return NextResponse.json(stryMutAct_9fa48("11147") ? {} : (stryCov_9fa48("11147"), {
                  error: stryMutAct_9fa48("11148") ? "" : (stryCov_9fa48("11148"), 'Usuario no encontrado')
                }), stryMutAct_9fa48("11149") ? {} : (stryCov_9fa48("11149"), {
                  status: 404
                }));
              }
            }

            // Verificar que el usuario tenga contraseña (no es OAuth)
            if (stryMutAct_9fa48("11152") ? false : stryMutAct_9fa48("11151") ? true : stryMutAct_9fa48("11150") ? fullUser.password : (stryCov_9fa48("11150", "11151", "11152"), !fullUser.password)) {
              if (stryMutAct_9fa48("11153")) {
                {}
              } else {
                stryCov_9fa48("11153");
                return NextResponse.json(stryMutAct_9fa48("11154") ? {} : (stryCov_9fa48("11154"), {
                  error: stryMutAct_9fa48("11155") ? "" : (stryCov_9fa48("11155"), 'Este usuario no tiene contraseña configurada (probablemente usa OAuth)')
                }), stryMutAct_9fa48("11156") ? {} : (stryCov_9fa48("11156"), {
                  status: 400
                }));
              }
            }

            // Verificar contraseña actual
            const isPasswordValid = await bcrypt.compare(currentPassword, fullUser.password);
            if (stryMutAct_9fa48("11159") ? false : stryMutAct_9fa48("11158") ? true : stryMutAct_9fa48("11157") ? isPasswordValid : (stryCov_9fa48("11157", "11158", "11159"), !isPasswordValid)) {
              if (stryMutAct_9fa48("11160")) {
                {}
              } else {
                stryCov_9fa48("11160");
                return NextResponse.json(stryMutAct_9fa48("11161") ? {} : (stryCov_9fa48("11161"), {
                  error: stryMutAct_9fa48("11162") ? "" : (stryCov_9fa48("11162"), 'La contraseña actual es incorrecta')
                }), stryMutAct_9fa48("11163") ? {} : (stryCov_9fa48("11163"), {
                  status: 400
                }));
              }
            }

            // Verificar que la nueva contraseña sea diferente
            const isSamePassword = await bcrypt.compare(newPassword, fullUser.password);
            if (stryMutAct_9fa48("11165") ? false : stryMutAct_9fa48("11164") ? true : (stryCov_9fa48("11164", "11165"), isSamePassword)) {
              if (stryMutAct_9fa48("11166")) {
                {}
              } else {
                stryCov_9fa48("11166");
                return NextResponse.json(stryMutAct_9fa48("11167") ? {} : (stryCov_9fa48("11167"), {
                  error: stryMutAct_9fa48("11168") ? "" : (stryCov_9fa48("11168"), 'La nueva contraseña debe ser diferente a la actual')
                }), stryMutAct_9fa48("11169") ? {} : (stryCov_9fa48("11169"), {
                  status: 400
                }));
              }
            }

            // Hashear nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Actualizar contraseña
            await prisma.user.update(stryMutAct_9fa48("11170") ? {} : (stryCov_9fa48("11170"), {
              where: stryMutAct_9fa48("11171") ? {} : (stryCov_9fa48("11171"), {
                id: user.id
              }),
              data: stryMutAct_9fa48("11172") ? {} : (stryCov_9fa48("11172"), {
                password: hashedPassword
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("11173") ? {} : (stryCov_9fa48("11173"), {
              message: stryMutAct_9fa48("11174") ? "" : (stryCov_9fa48("11174"), 'Contraseña actualizada exitosamente')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("11175")) {
            {}
          } else {
            stryCov_9fa48("11175");
            return handleApiError(error, stryMutAct_9fa48("11176") ? "" : (stryCov_9fa48("11176"), 'Error al cambiar contraseña'), stryMutAct_9fa48("11177") ? {} : (stryCov_9fa48("11177"), {
              path: stryMutAct_9fa48("11178") ? "" : (stryCov_9fa48("11178"), '/api/user/password')
            }));
          }
        }
      }
    });
  }
}