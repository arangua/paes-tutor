export type Session = {
  user?: { 
    name?: string | null
    email?: string | null
    image?: string | null
    id?: string
    studentId?: string | null
  }
  expires?: string
}

export type NextAuthOptions = Record<string, unknown>

export type NextAuthConfig = Record<string, unknown>

export function auth(..._args: any[]) {
  return Promise.resolve(null as Session | null)
}

export default function NextAuth(_options: NextAuthOptions) {
  return {
    handlers: {
      GET: async () => new Response('Not implemented in tests', { status: 501 }),
      POST: async () => new Response('Not implemented in tests', { status: 501 }),
    },
    auth,
  }
}