/**
 * Enterprise Test Data Generators
 * 
 * Generadores de datos de test avanzados con fábricas y builders
 * para crear datos de prueba realistas y consistentes.
 * 
 * @module test-data-generators
 * @version 2.0.0
 * @enterprise
 */

import { z } from 'zod'

// ✅ Enterprise: Faker opcional - usar valores por defecto si no está disponible
type FakerType = {
  internet: { email: () => string }
  person: { fullName: () => string }
  lorem: { sentence: () => string; paragraphs: (count: number) => string; words: (count: number) => string }
  number: { int: (options?: { min?: number; max?: number }) => number }
}
let faker: FakerType | null = null
try {
  const nodeRequire = require as unknown as (id: string) => { faker?: FakerType }
  const fakerModule = nodeRequire('@faker-js/faker')
  faker = fakerModule.faker as FakerType
} catch {
  // Faker no disponible, usar generadores simples
}

// Seeded PRNG para tests deterministas (evita sonarjs/pseudo-random)
let seed = 1
function seededNextInt(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed
}
function seededNextFloat(): number {
  return seededNextInt() / 0x7fffffff
}
function seededRandomString(length: number = 7): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(seededNextFloat() * chars.length))
  }
  return result
}

// Helper para generar datos cuando faker no está disponible
const simpleFaker = {
  internet: {
    email: () => `test${seededRandomString()}@example.com`,
  },
  person: {
    fullName: () => `Test User ${seededRandomString()}`,
  },
  lorem: {
    sentence: () => `Test sentence ${seededRandomString()}`,
    paragraphs: (count: number) => Array(count).fill(0).map(() => `Test paragraph ${seededRandomString()}`).join('\n\n'),
    words: (count: number) => Array(count).fill(0).map(() => `word${seededRandomString()}`).join(' '),
  },
  number: {
    int: (options?: { min?: number; max?: number }) => {
      const min = options?.min || 0
      const max = options?.max || 100
      return Math.floor(seededNextFloat() * (max - min + 1)) + min
    },
  },
}

const getFaker = () => faker || simpleFaker

// ============================================
// GENERADORES BASE
// ============================================

/**
 * Generador base con configuración enterprise
 */
export class EnterpriseDataGenerator<T> {
  protected data: Partial<T> = {}

  /**
   * Establece un campo
   */
  set<K extends keyof T>(key: K, value: T[K]): this {
     
    this.data[key] = value // key validated via generic union (keyof T)
    return this
  }

  /**
   * Genera datos aleatorios
   */
  random(): this {
    return this
  }

  /**
   * Construye el objeto final
   */
  build(): T {
    return this.data as T
  }

  /**
   * Genera múltiples instancias
   */
  generateMany(count: number): T[] {
    return Array.from({ length: count }, () => this.build())
  }
}

// ============================================
// GENERADORES ESPECÍFICOS
// ============================================

/**
 * Generador de CUIDs válidos
 */
export class CUIDGenerator {
  /**
   * Genera un CUID válido usando seeded PRNG para tests deterministas
   */
  static generate(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const prefix = 'c'
    const length = 24
    
    let cuid = prefix
    for (let i = 0; i < length; i++) {
      cuid += chars.charAt(Math.floor(seededNextFloat() * chars.length))
    }
    
    return cuid
  }

  /**
   * Genera múltiples CUIDs
   */
  static generateMany(count: number): string[] {
    return Array.from({ length: count }, () => this.generate())
  }

  /**
   * Valida que un string sea un CUID válido
   */
  static isValid(cuid: string): boolean {
    return /^c[a-z0-9]{24}$/.test(cuid)
  }
}

/**
 * Generador de usuarios de test
 */
export class UserGenerator extends EnterpriseDataGenerator<{
  id: string
  email: string
  name: string | null
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}> {
  constructor() {
    super()
    const f = getFaker()
    this.data = {
      id: CUIDGenerator.generate(),
      email: f.internet.email(),
      name: f.person.fullName(),
      emailVerified: new Date(),
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  withEmail(email: string): this {
    return this.set('email', email)
  }

  withName(name: string): this {
    return this.set('name', name)
  }

  unverified(): this {
    return this.set('emailVerified', null)
  }
}

/**
 * Generador de estudiantes de test
 */
export class StudentGenerator extends EnterpriseDataGenerator<{
  id: string
  userId: string
  nombre: string
  createdAt: Date
  updatedAt: Date
}> {
  constructor(userId?: string) {
    super()
    const f = getFaker()
    this.data = {
      id: CUIDGenerator.generate(),
      userId: userId || CUIDGenerator.generate(),
      nombre: f.person.fullName(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  withName(nombre: string): this {
    return this.set('nombre', nombre)
  }

  withUserId(userId: string): this {
    return this.set('userId', userId)
  }
}

/**
 * Generador de notas de estudio
 */
export class StudyNoteGenerator extends EnterpriseDataGenerator<{
  id: string
  studentId: string
  title: string
  content: string
  tags: string | null
  createdAt: Date
  updatedAt: Date
}> {
  constructor(studentId?: string) {
    super()
    const f = getFaker()
    this.data = {
      id: CUIDGenerator.generate(),
      studentId: studentId || CUIDGenerator.generate(),
      title: f.lorem.sentence(),
      content: f.lorem.paragraphs(3),
      tags: f.lorem.words(3).split(' ').join(','),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  withTitle(title: string): this {
    return this.set('title', title)
  }

  withContent(content: string): this {
    return this.set('content', content)
  }

  withTags(tags: string[]): this {
    return this.set('tags', tags.join(','))
  }
}

/**
 * Generador de versiones de notas
 */
export class StudyNoteVersionGenerator extends EnterpriseDataGenerator<{
  id: string
  noteId: string
  title: string
  content: string
  isCompressed: boolean
  importance: number
  createdAt: Date
  updatedAt: Date
}> {
  constructor(noteId?: string) {
    super()
    const f = getFaker()
    this.data = {
      id: CUIDGenerator.generate(),
      noteId: noteId || CUIDGenerator.generate(),
      title: f.lorem.sentence(),
      content: f.lorem.paragraphs(5),
      isCompressed: false,
      importance: f.number.int({ min: 1, max: 5 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  compressed(): this {
    return this.set('isCompressed', true)
  }

  withImportance(importance: number): this {
    return this.set('importance', importance)
  }
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Factory para crear usuarios
 */
export function createTestUser(overrides?: Partial<ReturnType<UserGenerator['build']>>) {
  const generator = new UserGenerator()
  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      generator.set(key as keyof ReturnType<UserGenerator['build']>, value)
    })
  }
  return generator.build()
}

/**
 * Factory para crear estudiantes
 */
export function createTestStudent(overrides?: Partial<ReturnType<StudentGenerator['build']>>) {
  const generator = new StudentGenerator()
  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      generator.set(key as keyof ReturnType<StudentGenerator['build']>, value)
    })
  }
  return generator.build()
}

/**
 * Factory para crear notas
 */
export function createTestNote(overrides?: Partial<ReturnType<StudyNoteGenerator['build']>>) {
  const generator = new StudyNoteGenerator()
  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      generator.set(key as keyof ReturnType<StudyNoteGenerator['build']>, value)
    })
  }
  return generator.build()
}

/**
 * Factory para crear versiones
 */
export function createTestVersion(overrides?: Partial<ReturnType<StudyNoteVersionGenerator['build']>>) {
  const generator = new StudyNoteVersionGenerator()
  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      generator.set(key as keyof ReturnType<StudyNoteVersionGenerator['build']>, value)
    })
  }
  return generator.build()
}

// ============================================
// SCHEMA VALIDATORS
// ============================================

/**
 * Schemas de validación para datos de test
 */
export const TestDataSchemas = {
  user: z.object({
    id: z.string().regex(/^c[a-z0-9]{24}$/),
    email: z.email({ error: 'Invalid email' }),
    name: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),

  student: z.object({
    id: z.string().regex(/^c[a-z0-9]{24}$/),
    userId: z.string().regex(/^c[a-z0-9]{24}$/),
    nombre: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),

  studyNote: z.object({
    id: z.string().regex(/^c[a-z0-9]{24}$/),
    studentId: z.string().regex(/^c[a-z0-9]{24}$/),
    title: z.string().min(1),
    content: z.string().min(1),
    tags: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),

  studyNoteVersion: z.object({
    id: z.string().regex(/^c[a-z0-9]{24}$/),
    noteId: z.string().regex(/^c[a-z0-9]{24}$/),
    title: z.string().min(1),
    content: z.string().min(1),
    isCompressed: z.boolean(),
    importance: z.number().int().min(1).max(5),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
}

/**
 * Valida datos de test contra schemas
 */
export function validateTestData<T extends keyof typeof TestDataSchemas>(
  type: T,
  data: unknown
): z.output<typeof TestDataSchemas[T]> {
   
  const schema = TestDataSchemas[type] // key validated via union (keyof typeof TestDataSchemas)
  return schema.parse(data) as z.output<typeof TestDataSchemas[T]>
}

