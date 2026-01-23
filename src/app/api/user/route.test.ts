// @vitest-environment node
/**
 * Tests Enterprise para API de User
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, PUT } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createUser,
  createUserWithStudent,
  setupAuthenticatedUser,
  setupUnauthenticatedUser,
  setupUserMock,
  setupStudentMock,
  setupTransactionMock,
  setupValidateBodySuccess,
  setupValidateBodyError,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    student: { findUnique: vi.fn(), update: vi.fn() },
    $transaction: vi.fn(),
  },
}))

// Mock global está en src/test/setup.ts - solo sobrescribir valores específicos con vi.mocked()

vi.mock('@/lib/api-helpers', () => ({
  validateBody: vi.fn(),
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }),
}))

import { invalidateCachePattern } from '@/lib/cache'

vi.mock('@/lib/cache', () => ({
  invalidateCachePattern: vi.fn(),
}))

// Mock global de logger está en src/test/setup.ts

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/user', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar información del usuario', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    const fullUser = createUserWithStudent({ user })
    setupUserMock(fullUser)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.id).toBe(user.id)
    expect(data.email).toBe(user.email)
  })

  it('debe retornar 404 si el usuario no existe', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    setupUserMock(null)
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 404, 'Usuario no encontrado')
  })

  it('debe incluir información del estudiante si existe', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    const fullUser = createUserWithStudent({ user, student: { id: TEST_IDS.STUDENT, nombre: 'Test Student' } })
    setupUserMock(fullUser)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.student).toBeDefined()
    expect(data.student?.nombre).toBe('Test Student')
  })
})

describe('PUT /api/user', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({ method: 'PUT', body: { name: 'New Name' } })
    const response = await PUT(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    const errorResponse = new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400 })
    setupValidateBodyError(errorResponse)
    const request = createTestRequest({ method: 'PUT', body: {} })
    const response = await PUT(request)
    expect(response.status).toBe(400)
  })

  it('debe actualizar el nombre del usuario', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    setupValidateBodySuccess({ name: 'New Name' })
    const updatedUser = createUser({ ...user, name: 'New Name' })
    setupTransactionMock(async (tx: any) => {
      tx.user.update = vi.fn().mockResolvedValue(updatedUser)
      tx.student.findUnique = vi.fn().mockResolvedValue(null)
      return updatedUser
    })
    // Mock de student.findUnique después de la transacción (para invalidar caché)
    setupStudentMock(null)
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
    const request = createTestRequest({ method: 'PUT', body: { name: 'New Name' } })
    const response = await PUT(request)
    const data = await assertSuccessResponse(response)
    expect(data.name).toBe('New Name')
  })

  it('debe actualizar el email del usuario', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    setupValidateBodySuccess({ email: 'newemail@example.com' })
    const updatedUser = createUser({ ...user, email: 'newemail@example.com', emailVerified: null })
    setupTransactionMock(async (tx: any) => {
      tx.user.update = vi.fn().mockResolvedValue(updatedUser)
      return updatedUser
    })
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null) // No existe otro usuario con ese email
    // Mock de student.findUnique después de la transacción (para invalidar caché)
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
    const request = createTestRequest({ method: 'PUT', body: { email: 'newemail@example.com' } })
    const response = await PUT(request)
    const data = await assertSuccessResponse(response)
    expect(data.email).toBe('newemail@example.com')
    expect(data.emailVerified).toBeNull()
  })

  it('debe retornar 400 si el email ya está en uso', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    setupValidateBodySuccess({ email: 'existing@example.com' })
    const existingUser = createUser({ id: 'cotheruser123456789012345', email: 'existing@example.com' })
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(existingUser as any)
    const request = createTestRequest({ method: 'PUT', body: { email: 'existing@example.com' } })
    const response = await PUT(request)
    await assertErrorResponse(response, 400, 'Este email ya está en uso')
  })

  it('debe actualizar el nombre del estudiante si existe', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    setupValidateBodySuccess({ name: 'New Name' })
    const updatedUser = createUser({ ...user, name: 'New Name' })
    const student = { id: TEST_IDS.STUDENT, nombre: 'Old Name', userId: user.id, createdAt: new Date(), updatedAt: new Date() }
    setupTransactionMock(async (tx: any) => {
      tx.user.update = vi.fn().mockResolvedValue(updatedUser)
      tx.student.findUnique = vi.fn().mockResolvedValue(student)
      tx.student.update = vi.fn().mockResolvedValue({ ...student, nombre: 'New Name' })
      return updatedUser
    })
    // Mock de student.findUnique después de la transacción (para invalidar caché)
    setupStudentMock(student as any)
    vi.mocked(prisma.student.findUnique).mockResolvedValue(student as any)
    const request = createTestRequest({ method: 'PUT', body: { name: 'New Name' } })
    const response = await PUT(request)
    const data = await assertSuccessResponse(response)
    expect(data.name).toBe('New Name')
    expect(vi.mocked(invalidateCachePattern)).toHaveBeenCalled()
  })

  it('debe invalidar caché después de actualizar', async () => {
    const user = createUser()
    setupAuthenticatedUser(user)
    setupValidateBodySuccess({ name: 'New Name' })
    const updatedUser = createUser({ ...user, name: 'New Name' })
    setupTransactionMock(async (tx: any) => {
      tx.user.update = vi.fn().mockResolvedValue(updatedUser)
      tx.student.findUnique = vi.fn().mockResolvedValue(null)
      return updatedUser
    })
    // Mock de student.findUnique después de la transacción (para invalidar caché)
    setupStudentMock(null)
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
    const request = createTestRequest({ method: 'PUT', body: { name: 'New Name' } })
    await PUT(request)
    expect(vi.mocked(invalidateCachePattern)).toHaveBeenCalledWith(`user:${user.id}:*`)
  })
})

