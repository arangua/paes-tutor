'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

export function AuthSessionProvider({ children }: Readonly<SessionProviderProps>) {
  return <SessionProvider>{children}</SessionProvider>
}

