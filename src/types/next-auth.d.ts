import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      studentId?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    studentId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    studentId?: string | null
  }
}
