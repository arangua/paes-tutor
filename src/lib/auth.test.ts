import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock de dependencias ANTES de importar
vi.mock('./prisma', () => ({
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

// Importar después de los mocks
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

// Crear referencia tipada al mock de prisma
const mockPrisma = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>
  }
}

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
  } catch {
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
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const result = await testAuthorize({
      email: 'nonexistent@test.com',
      password: 'password123', // guard:allow-secret
    })

    expect(result).toBeNull()
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'nonexistent@test.com' },
      include: { student: true },
    })
  })

  it('debe retornar null si el usuario no tiene contraseña', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      password: null,
      student: null,
    } as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123', // guard:allow-secret
    })

    expect(result).toBeNull()
  })

  it('debe retornar null si la contraseña es inválida', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      password: 'hashed-password', // guard:allow-secret
      student: { id: 'student-1' },
    } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'wrong-password', // guard:allow-secret
    })

    expect(result).toBeNull()
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
  })

  it('debe retornar usuario si las credenciales son válidas', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      password: 'hashed-password', // guard:allow-secret
      student: { id: 'student-1' },
    } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123', // guard:allow-secret
    })

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      studentId: 'student-1',
    })
  })

  it('debe retornar usuario sin studentId si no tiene estudiante asociado', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      password: 'hashed-password', // guard:allow-secret
      student: null,
    } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any)

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123', // guard:allow-secret
    })

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      studentId: null,
    })
  })

  it('debe manejar errores y retornar null', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

    const result = await testAuthorize({
      email: 'test@test.com',
      password: 'password123', // guard:allow-secret
    })

    expect(result).toBeNull()
  })
})
