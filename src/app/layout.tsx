import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper'
import { Header } from '@/components/layout/header'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { KeyboardShortcutsProvider } from '@/components/keyboard-shortcuts-provider'
import { GlobalUndoRedoProvider } from '@/hooks/useGlobalUndoRedo'
import { PWAInstaller } from '@/components/pwa/PWAInstaller'
import { SkipLinks } from '@/components/ui/skip-links'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler'
// Startup checks - se ejecutan automáticamente al importar (solo en servidor)
import '@/lib/startup/bootstrap'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PAES Tutor - Tu plataforma de preparación',
  description: 'Plataforma de preparación para la Prueba de Acceso a la Educación Superior (PAES)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PAES Tutor',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthSessionProvider>
          <GlobalErrorHandler />
          <SkipLinks />
          <TooltipProvider>
            <ErrorBoundaryWrapper>
              <GlobalUndoRedoProvider>
                <KeyboardShortcutsProvider>
                  {/* ServiceWorkerRegistration temporalmente deshabilitado para debugging */}
                  {/* <ServiceWorkerRegistration /> */}
                  <Header />
                  <main id="main-content" className="min-h-[calc(100vh-4rem)]" tabIndex={-1}>
                    {children}
                  </main>
                  <Toaster position="top-right" richColors closeButton />
                  <PWAInstaller />
                </KeyboardShortcutsProvider>
              </GlobalUndoRedoProvider>
            </ErrorBoundaryWrapper>
          </TooltipProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
