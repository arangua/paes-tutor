import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Proxy simplificado para Edge Runtime (reemplazo de middleware en Next.js 16+)
// No importamos next-auth aquí para evitar problemas con fs
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Verificar si hay cookie de sesión de NextAuth
  const sessionToken =
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token')

  // Proteger rutas de APIs
  if (
    pathname.startsWith('/api/student') ||
    pathname.startsWith('/api/metrics') ||
    pathname.startsWith('/api/attempts') ||
    pathname.startsWith('/api/exams') ||
    pathname.startsWith('/api/recommendations') ||
    pathname.startsWith('/api/analytics') ||
    pathname.startsWith('/api/materials') ||
    pathname.startsWith('/api/user') ||
    pathname.startsWith('/api/admin')
  ) {
    // Para APIs, retornar 401 JSON si no hay sesión
    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Si hay cookie, dejar que la ruta API valide el token
    // Las rutas API tienen runtime='nodejs' y pueden usar getToken
  }

  // Proteger rutas de páginas (redirigir a signin)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/materials') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/admin')
  ) {
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/materials/:path*',
    '/analytics/:path*',
    '/admin/:path*',
    '/api/student',
    '/api/student/:path*',
    '/api/metrics',
    '/api/metrics/:path*',
    '/api/attempts',
    '/api/attempts/:path*',
    '/api/exams',
    '/api/exams/:path*',
    '/api/recommendations/:path*',
    '/api/analytics/:path*',
    '/api/materials/:path*',
    '/api/user/:path*',
    '/api/admin/:path*',
  ],
}
