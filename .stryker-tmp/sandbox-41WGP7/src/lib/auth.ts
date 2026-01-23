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
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import { logger, logAuthEvent } from './logger';
import crypto from 'crypto';
import path from 'path';

// Generar un secret persistente si no está definido (solo para desarrollo)
if (stryMutAct_9fa48("23054") ? false : stryMutAct_9fa48("23053") ? true : stryMutAct_9fa48("23052") ? process.env.NEXTAUTH_SECRET : (stryCov_9fa48("23052", "23053", "23054"), !process.env.NEXTAUTH_SECRET)) {
  if (stryMutAct_9fa48("23055")) {
    {}
  } else {
    stryCov_9fa48("23055");
    if (stryMutAct_9fa48("23058") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("23057") ? false : stryMutAct_9fa48("23056") ? true : (stryCov_9fa48("23056", "23057", "23058"), process.env.NODE_ENV === (stryMutAct_9fa48("23059") ? "" : (stryCov_9fa48("23059"), 'production')))) {
      if (stryMutAct_9fa48("23060")) {
        {}
      } else {
        stryCov_9fa48("23060");
        throw new Error(stryMutAct_9fa48("23061") ? "" : (stryCov_9fa48("23061"), 'NEXTAUTH_SECRET debe estar definido en producción. Configura esta variable de entorno antes de desplegar.'));
      }
    }
    // En desarrollo, generar un secret persistente basado en el directorio del proyecto
    // Esto evita que se regeneren las sesiones en cada reinicio
    const projectPath = path.resolve(process.cwd());
    // Generar hash del path del proyecto para crear un secret estable
    const stableSecret = stryMutAct_9fa48("23062") ? crypto.createHash('sha256').update(projectPath).digest('base64') : (stryCov_9fa48("23062"), crypto.createHash(stryMutAct_9fa48("23063") ? "" : (stryCov_9fa48("23063"), 'sha256')).update(projectPath).digest(stryMutAct_9fa48("23064") ? "" : (stryCov_9fa48("23064"), 'base64')).substring(0, 32));
    process.env.NEXTAUTH_SECRET = stryMutAct_9fa48("23065") ? `` : (stryCov_9fa48("23065"), `dev-secret-${stableSecret}`);
    logger.warn(stryMutAct_9fa48("23066") ? {} : (stryCov_9fa48("23066"), {
      type: stryMutAct_9fa48("23067") ? "" : (stryCov_9fa48("23067"), 'security'),
      event: stryMutAct_9fa48("23068") ? "" : (stryCov_9fa48("23068"), 'nextauth_secret_generated')
    }), stryMutAct_9fa48("23069") ? "" : (stryCov_9fa48("23069"), '⚠️ NEXTAUTH_SECRET no está definido. Usando secret persistente para desarrollo. Configura NEXTAUTH_SECRET en .env.local para producción.'));
  }
}
export const authConfig: NextAuthConfig = stryMutAct_9fa48("23070") ? {} : (stryCov_9fa48("23070"), {
  providers: stryMutAct_9fa48("23071") ? [] : (stryCov_9fa48("23071"), [CredentialsProvider(stryMutAct_9fa48("23072") ? {} : (stryCov_9fa48("23072"), {
    name: stryMutAct_9fa48("23073") ? "" : (stryCov_9fa48("23073"), 'Credentials'),
    credentials: stryMutAct_9fa48("23074") ? {} : (stryCov_9fa48("23074"), {
      email: stryMutAct_9fa48("23075") ? {} : (stryCov_9fa48("23075"), {
        label: stryMutAct_9fa48("23076") ? "" : (stryCov_9fa48("23076"), 'Email'),
        type: stryMutAct_9fa48("23077") ? "" : (stryCov_9fa48("23077"), 'email')
      }),
      password: stryMutAct_9fa48("23078") ? {} : (stryCov_9fa48("23078"), {
        label: stryMutAct_9fa48("23079") ? "" : (stryCov_9fa48("23079"), 'Password'),
        type: stryMutAct_9fa48("23080") ? "" : (stryCov_9fa48("23080"), 'password')
      })
    }),
    async authorize(credentials) {
      if (stryMutAct_9fa48("23081")) {
        {}
      } else {
        stryCov_9fa48("23081");
        if (stryMutAct_9fa48("23084") ? !credentials?.email && !credentials?.password : stryMutAct_9fa48("23083") ? false : stryMutAct_9fa48("23082") ? true : (stryCov_9fa48("23082", "23083", "23084"), (stryMutAct_9fa48("23085") ? credentials?.email : (stryCov_9fa48("23085"), !(stryMutAct_9fa48("23086") ? credentials.email : (stryCov_9fa48("23086"), credentials?.email)))) || (stryMutAct_9fa48("23087") ? credentials?.password : (stryCov_9fa48("23087"), !(stryMutAct_9fa48("23088") ? credentials.password : (stryCov_9fa48("23088"), credentials?.password)))))) {
          if (stryMutAct_9fa48("23089")) {
            {}
          } else {
            stryCov_9fa48("23089");
            logger.debug(stryMutAct_9fa48("23090") ? {} : (stryCov_9fa48("23090"), {
              type: stryMutAct_9fa48("23091") ? "" : (stryCov_9fa48("23091"), 'auth'),
              event: stryMutAct_9fa48("23092") ? "" : (stryCov_9fa48("23092"), 'missing_credentials')
            }), stryMutAct_9fa48("23093") ? "" : (stryCov_9fa48("23093"), 'Credenciales faltantes'));
            return null;
          }
        }
        try {
          if (stryMutAct_9fa48("23094")) {
            {}
          } else {
            stryCov_9fa48("23094");
            const user = await prisma.user.findUnique(stryMutAct_9fa48("23095") ? {} : (stryCov_9fa48("23095"), {
              where: stryMutAct_9fa48("23096") ? {} : (stryCov_9fa48("23096"), {
                email: credentials.email as string
              }),
              include: stryMutAct_9fa48("23097") ? {} : (stryCov_9fa48("23097"), {
                student: stryMutAct_9fa48("23098") ? false : (stryCov_9fa48("23098"), true)
              })
            }));
            if (stryMutAct_9fa48("23101") ? false : stryMutAct_9fa48("23100") ? true : stryMutAct_9fa48("23099") ? user : (stryCov_9fa48("23099", "23100", "23101"), !user)) {
              if (stryMutAct_9fa48("23102")) {
                {}
              } else {
                stryCov_9fa48("23102");
                logger.warn(stryMutAct_9fa48("23103") ? {} : (stryCov_9fa48("23103"), {
                  type: stryMutAct_9fa48("23104") ? "" : (stryCov_9fa48("23104"), 'auth'),
                  event: stryMutAct_9fa48("23105") ? "" : (stryCov_9fa48("23105"), 'user_not_found'),
                  email: credentials.email
                }), stryMutAct_9fa48("23106") ? "" : (stryCov_9fa48("23106"), 'Usuario no encontrado'));
                return null;
              }
            }
            if (stryMutAct_9fa48("23109") ? false : stryMutAct_9fa48("23108") ? true : stryMutAct_9fa48("23107") ? user.password : (stryCov_9fa48("23107", "23108", "23109"), !user.password)) {
              if (stryMutAct_9fa48("23110")) {
                {}
              } else {
                stryCov_9fa48("23110");
                logger.warn(stryMutAct_9fa48("23111") ? {} : (stryCov_9fa48("23111"), {
                  type: stryMutAct_9fa48("23112") ? "" : (stryCov_9fa48("23112"), 'auth'),
                  event: stryMutAct_9fa48("23113") ? "" : (stryCov_9fa48("23113"), 'no_password'),
                  userId: user.id
                }), stryMutAct_9fa48("23114") ? "" : (stryCov_9fa48("23114"), 'Usuario sin contraseña'));
                return null;
              }
            }
            const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);
            if (stryMutAct_9fa48("23117") ? false : stryMutAct_9fa48("23116") ? true : stryMutAct_9fa48("23115") ? isPasswordValid : (stryCov_9fa48("23115", "23116", "23117"), !isPasswordValid)) {
              if (stryMutAct_9fa48("23118")) {
                {}
              } else {
                stryCov_9fa48("23118");
                logger.warn(stryMutAct_9fa48("23119") ? {} : (stryCov_9fa48("23119"), {
                  type: stryMutAct_9fa48("23120") ? "" : (stryCov_9fa48("23120"), 'auth'),
                  event: stryMutAct_9fa48("23121") ? "" : (stryCov_9fa48("23121"), 'invalid_password'),
                  userId: user.id
                }), stryMutAct_9fa48("23122") ? "" : (stryCov_9fa48("23122"), 'Contraseña inválida'));
                return null;
              }
            }
            logAuthEvent(stryMutAct_9fa48("23123") ? "" : (stryCov_9fa48("23123"), 'login_success'), user.id, stryMutAct_9fa48("23124") ? false : (stryCov_9fa48("23124"), true));
            return stryMutAct_9fa48("23125") ? {} : (stryCov_9fa48("23125"), {
              id: user.id,
              email: user.email,
              name: user.name,
              studentId: stryMutAct_9fa48("23128") ? user.student?.id && null : stryMutAct_9fa48("23127") ? false : stryMutAct_9fa48("23126") ? true : (stryCov_9fa48("23126", "23127", "23128"), (stryMutAct_9fa48("23129") ? user.student.id : (stryCov_9fa48("23129"), user.student?.id)) || null)
            });
          }
        } catch (error) {
          if (stryMutAct_9fa48("23130")) {
            {}
          } else {
            stryCov_9fa48("23130");
            logger.error(stryMutAct_9fa48("23131") ? {} : (stryCov_9fa48("23131"), {
              type: stryMutAct_9fa48("23132") ? "" : (stryCov_9fa48("23132"), 'auth'),
              event: stryMutAct_9fa48("23133") ? "" : (stryCov_9fa48("23133"), 'authorize_error'),
              error: error instanceof Error ? error.message : String(error)
            }), stryMutAct_9fa48("23134") ? "" : (stryCov_9fa48("23134"), 'Error en authorize'));
            return null;
          }
        }
      }
    }
  }))]),
  session: stryMutAct_9fa48("23135") ? {} : (stryCov_9fa48("23135"), {
    strategy: stryMutAct_9fa48("23136") ? "" : (stryCov_9fa48("23136"), 'jwt')
  }),
  pages: stryMutAct_9fa48("23137") ? {} : (stryCov_9fa48("23137"), {
    signIn: stryMutAct_9fa48("23138") ? "" : (stryCov_9fa48("23138"), '/auth/signin'),
    error: stryMutAct_9fa48("23139") ? "" : (stryCov_9fa48("23139"), '/auth/error')
  }),
  callbacks: stryMutAct_9fa48("23140") ? {} : (stryCov_9fa48("23140"), {
    async jwt({
      token,
      user
    }) {
      if (stryMutAct_9fa48("23141")) {
        {}
      } else {
        stryCov_9fa48("23141");
        if (stryMutAct_9fa48("23143") ? false : stryMutAct_9fa48("23142") ? true : (stryCov_9fa48("23142", "23143"), user)) {
          if (stryMutAct_9fa48("23144")) {
            {}
          } else {
            stryCov_9fa48("23144");
            token.id = user.id;
            token.studentId = stryMutAct_9fa48("23147") ? user.studentId && null : stryMutAct_9fa48("23146") ? false : stryMutAct_9fa48("23145") ? true : (stryCov_9fa48("23145", "23146", "23147"), user.studentId || null);
          }
        }
        return token;
      }
    },
    async session({
      session,
      token
    }) {
      if (stryMutAct_9fa48("23148")) {
        {}
      } else {
        stryCov_9fa48("23148");
        if (stryMutAct_9fa48("23151") ? session.user || token : stryMutAct_9fa48("23150") ? false : stryMutAct_9fa48("23149") ? true : (stryCov_9fa48("23149", "23150", "23151"), session.user && token)) {
          if (stryMutAct_9fa48("23152")) {
            {}
          } else {
            stryCov_9fa48("23152");
            session.user.id = token.id as string;
            session.user.studentId = token.studentId as string | null;
          }
        }
        return session;
      }
    }
  }),
  secret: process.env.NEXTAUTH_SECRET
});
export const {
  auth,
  handlers
} = NextAuth(authConfig);