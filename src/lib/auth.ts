import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import { logger, logAuthEvent } from './logger'
import crypto from 'crypto'
import path from 'path'

// Generar un secret persistente si no está definido (solo para desarrollo)
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXTAUTH_SECRET debe estar definido en producción. Configura esta variable de entorno antes de desplegar.'
    )
  }
  // En desarrollo, generar un secret persistente basado en el directorio del proyecto
  // Esto evita que se regeneren las sesiones en cada reinicio
  const projectPath = path.resolve(process.cwd())
  // Generar hash del path del proyecto para crear un secret estable
  const stableSecret = crypto
    .createHash('sha256')
    .update(projectPath)
    .digest('base64')
    .substring(0, 32)

  process.env.NEXTAUTH_SECRET = `dev-secret-${stableSecret}`

  logger.warn(
    { type: 'security', event: 'nextauth_secret_generated' },
    '⚠️ NEXTAUTH_SECRET no está definido. Usando secret persistente para desarrollo. Configura NEXTAUTH_SECRET en .env.local para producción.'
  )
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.debug({ type: 'auth', event: 'missing_credentials' }, 'Credenciales faltantes')
          return null
        }

        try {
          // Normalizar email a minúsculas para búsqueda case-insensitive
          const normalizedEmail = (credentials.email as string).trim().toLowerCase()
          logger.debug(
            { type: 'auth', event: 'authorize_attempt', email: normalizedEmail },
            'Intentando autenticar usuario'
          )

          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { student: true },
          })

          if (!user) {
            logger.warn(
              { type: 'auth', event: 'user_not_found', email: normalizedEmail },
              'Usuario no encontrado'
            )
            return null
          }

          if (!user.password) {
            logger.warn(
              { type: 'auth', event: 'no_password', userId: user.id },
              'Usuario sin contraseña'
            )
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            logger.warn(
              { 
                type: 'auth', 
                event: 'invalid_password', 
                userId: user.id,
                email: normalizedEmail 
              },
              'Contraseña inválida'
            )
            return null
          }

          logger.debug(
            { 
              type: 'auth', 
              event: 'password_valid', 
              userId: user.id,
              email: normalizedEmail 
            },
            'Contraseña válida'
          )

          logAuthEvent('login_success', user.id, true)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            studentId: user.student?.id || null,
          }
        } catch (error) {
          logger.error(
            {
              type: 'auth',
              event: 'authorize_error',
              error: error instanceof Error ? error.message : String(error),
            },
            'Error en authorize'
          )
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.studentId = user.studentId || null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.studentId = token.studentId as string | null
      }
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' // guard:allow-secret
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { auth, handlers } = NextAuth(authConfig)
