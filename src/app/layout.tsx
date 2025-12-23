import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper'
import { Header } from '@/components/layout/header'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          <ErrorBoundaryWrapper>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Toaster position="top-right" richColors closeButton />
          </ErrorBoundaryWrapper>
        </TooltipProvider>
      </body>
    </html>
  )
}
