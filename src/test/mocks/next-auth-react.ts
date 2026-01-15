import React from 'react'

export function useSession() {
  return { data: null, status: 'unauthenticated' as const }
}

export function signIn(..._args: any[]) {
  return Promise.resolve(undefined)
}

export function signOut(..._args: any[]) {
  return Promise.resolve(undefined)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children)
}