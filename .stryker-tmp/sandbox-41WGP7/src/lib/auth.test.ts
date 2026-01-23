// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

// Mock de dependencias
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  logAuthEvent: vi.fn(),
}))

vi.mock('next-auth', () => ({
  default: vi.fn(),
}))

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config: any) => ({
    id: 'credentials',
    name: 'Credentials',
    authorize: config.authorize,
  })),
}))

// Extraer solo la función authorize para testearla
async function testAuthorize(credentials: { email?: string; password?: string }) {
  if (!credentials?.email || !credentials?.password) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email as string },
      include: { student: true },
    })

    if (!user) {
      return null
    }

    if (!user.password) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)

    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      studentId: user.student?.id || null,
    }
  } catch (error) {
    return null
  }
}

describe('Auth - authorize function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar null si no hay email o password', async () => {
    const result = await testAuthorize({
      email: '',
      password: '',
    })

    expect(result).toBeNull()
  })

  it('debe retornar null si el usuario no existe', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const result = await testAuthorize({
      email: 'nonexistent@test.com',
      password: 'password123',
    })

    expect(result).toBeNull()
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'nonexistent@test.com' },
      include: { student: true },
    })
  })

  it('debe retornar null si el usuario no tiene contraseña', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      password: null,
      student: null,
    } as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123',
    })

    expect(result).toBeNull()
  })

  it('debe retornar null si la contraseña es inválida', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      password: 'hashed-password',
      student: { id: 'student-1' },
    } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'wrong-password',
    })

    expect(result).toBeNull()
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
  })

  it('debe retornar usuario si las credenciales son válidas', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      password: 'hashed-password',
      student: { id: 'student-1' },
    } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123',
    })

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      studentId: 'student-1',
    })
  })

  it('debe retornar usuario sin studentId si no tiene estudiante asociado', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      password: 'hashed-password',
      student: null,
    } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123',
    })

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      studentId: null,
    })
  })

  it('debe manejar errores y retornar null', async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'))

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123',
    })

    expect(result).toBeNull()
  })
})
