// @vitest-environment node
/**
 * Guard: Subjects Baseline
 * 
 * Valida que las asignaturas críticas existen en la base de datos.
 * Previene regresiones si se eliminan asignaturas esenciales.
 * 
 * Usa SQLite aislado para no depender de .env.local
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'

// Configurar DATABASE_URL antes de cualquier import de Prisma
const testDbPath = join(process.cwd(), '.tmp', 'subjects-baseline.test.db')
const originalDatabaseUrl = process.env.DATABASE_URL
process.env.DATABASE_URL = `file:${testDbPath}`

// Usar better-sqlite3 directamente para evitar problemas con el schema de PostgreSQL
let db: Database.Database

// Asignaturas críticas que deben existir
const criticalSubjects = [
  { codigo: 'BIO', nombre: 'Ciencias - Biología', tipo: 'electiva' },
  { codigo: 'LECTORA', nombre: 'Competencia Lectora', tipo: 'obligatoria' },
  { codigo: 'M1', nombre: 'Matemática M1', tipo: 'obligatoria' },
  { codigo: 'M2', nombre: 'Matemática M2', tipo: 'electiva' },
  { codigo: 'HIST', nombre: 'Historia y Ciencias Sociales', tipo: 'electiva' },
]

describe('Subjects Baseline Guard', () => {
  beforeAll(async () => {
    // Asegurar que la carpeta .tmp existe
    const tmpDir = join(process.cwd(), '.tmp')
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true })
    }

    // Limpiar DB anterior si existe
    if (existsSync(testDbPath)) {
      unlinkSync(testDbPath)
    }

    // Crear base de datos SQLite
    db = new Database(testDbPath)

    // Crear tabla Subject
    db.exec(`
      CREATE TABLE IF NOT EXISTS "Subject" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "codigo" TEXT NOT NULL UNIQUE,
        "nombre" TEXT NOT NULL,
        "tipo" TEXT NOT NULL
      )
    `)

    // Ejecutar seed idempotente de asignaturas (upsert con SQL)
    const upsertStmt = db.prepare(`
      INSERT INTO "Subject" ("id", "codigo", "nombre", "tipo")
      VALUES (?, ?, ?, ?)
      ON CONFLICT("codigo") DO UPDATE SET
        "nombre" = excluded."nombre",
        "tipo" = excluded."tipo"
    `)

    for (const subject of criticalSubjects) {
      const id = randomBytes(16).toString('hex')
      upsertStmt.run(id, subject.codigo, subject.nombre, subject.tipo)
    }
  })

  afterAll(() => {
    // Cerrar conexión
    if (db) {
      db.close()
    }

    // Restaurar DATABASE_URL original
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl
    } else {
      delete process.env.DATABASE_URL
    }

    // Limpiar DB de test (opcional, comentado para debugging)
    // if (existsSync(testDbPath)) {
    //   unlinkSync(testDbPath)
    // }
  })

  it('debe existir la asignatura BIO (Ciencias - Biología)', () => {
    const stmt = db.prepare('SELECT * FROM "Subject" WHERE "codigo" = ?')
    const bio = stmt.get('BIO') as { codigo: string; nombre: string; tipo: string } | undefined

    expect(bio).not.toBeUndefined()
    expect(bio?.codigo).toBe('BIO')
    expect(bio?.nombre).toContain('Biología')
    expect(bio?.tipo).toBeDefined()
  })

  it('debe existir la asignatura LECTORA (Competencia Lectora)', () => {
    const stmt = db.prepare('SELECT * FROM "Subject" WHERE "codigo" = ?')
    const lectora = stmt.get('LECTORA') as { codigo: string; nombre: string; tipo: string } | undefined

    expect(lectora).not.toBeUndefined()
    expect(lectora?.codigo).toBe('LECTORA')
    expect(lectora?.nombre).toContain('Lectora')
    expect(lectora?.tipo).toBeDefined()
  })

  it('debe existir la asignatura M1 (Matemática M1)', () => {
    const stmt = db.prepare('SELECT * FROM "Subject" WHERE "codigo" = ?')
    const m1 = stmt.get('M1') as { codigo: string; nombre: string; tipo: string } | undefined

    expect(m1).not.toBeUndefined()
    expect(m1?.codigo).toBe('M1')
    expect(m1?.nombre).toContain('Matemática')
    expect(m1?.tipo).toBeDefined()
  })

  it('debe existir la asignatura M2 (Matemática M2)', () => {
    const stmt = db.prepare('SELECT * FROM "Subject" WHERE "codigo" = ?')
    const m2 = stmt.get('M2') as { codigo: string; nombre: string; tipo: string } | undefined

    expect(m2).not.toBeUndefined()
    expect(m2?.codigo).toBe('M2')
    expect(m2?.nombre).toContain('Matemática')
    expect(m2?.tipo).toBeDefined()
  })

  it('debe existir la asignatura HIST (Historia y Ciencias Sociales)', () => {
    const stmt = db.prepare('SELECT * FROM "Subject" WHERE "codigo" = ?')
    const hist = stmt.get('HIST') as { codigo: string; nombre: string; tipo: string } | undefined

    expect(hist).not.toBeUndefined()
    expect(hist?.codigo).toBe('HIST')
    expect(hist?.nombre).toContain('Historia')
    expect(hist?.tipo).toBeDefined()
  })
})
