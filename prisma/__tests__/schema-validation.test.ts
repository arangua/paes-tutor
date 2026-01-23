/**
 * Tests Enterprise: Schema.prisma Validation
 * 
 * Regla Enterprise:
 * El schema.prisma debe estar configurado correctamente para PostgreSQL estándar.
 * NO debe tener engineType = "client" ni previewFeatures = ["driverAdapters"].
 * 
 * Estos tests previenen cambios accidentales en el schema.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')

describe('Schema.prisma Validation', () => {
  let schemaContent: string

  beforeAll(() => {
    schemaContent = readFileSync(schemaPath, 'utf-8')
  })

  describe('Generator Configuration', () => {
    it('debe tener generator client con provider prisma-client-js', () => {
      expect(schemaContent).toMatch(/generator\s+client\s*\{/)
      expect(schemaContent).toMatch(/provider\s*=\s*["']prisma-client-js["']/)
    })

    it('NO debe tener engineType = "client"', () => {
      // Buscar engineType = "client" que no esté comentado
      const lines = schemaContent.split('\n')
      const engineTypeClientLines = lines.filter(line => {
        const trimmed = line.trim()
        return (
          trimmed.includes('engineType') &&
          trimmed.includes('client') &&
          !trimmed.includes('binary') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('*')
        )
      })

      expect(engineTypeClientLines.length).toBe(0)
    })

    it('NO debe tener engineType (removido en Prisma 7.2.0+)', () => {
      // Prisma 7.2.0+ removió engineType. El engine "client" es el predeterminado.
      // Buscar engineType que no esté comentado
      const lines = schemaContent.split('\n')
      const engineTypeLines = lines.filter(line => {
        const trimmed = line.trim()
        return (
          trimmed.includes('engineType') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('*')
        )
      })

      expect(engineTypeLines.length).toBe(0)
    })

    it('NO debe tener previewFeatures = ["driverAdapters"]', () => {
      // Buscar previewFeatures con driverAdapters que no esté comentado
      const lines = schemaContent.split('\n')
      const driverAdaptersLines = lines.filter(line => {
        const trimmed = line.trim()
        return (
          trimmed.includes('driverAdapters') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('*')
        )
      })

      expect(driverAdaptersLines.length).toBe(0)
    })
  })

  describe('Datasource Configuration', () => {
    it('debe tener datasource con provider postgresql', () => {
      expect(schemaContent).toMatch(/datasource\s+\w+\s*\{/)
      expect(schemaContent).toMatch(/provider\s*=\s*["']postgresql["']/)
    })

    it('debe usar DATABASE_URL del entorno (implícito o explícito)', () => {
      // Prisma puede usar DATABASE_URL implícitamente o explícitamente con env("DATABASE_URL")
      // Ambos son válidos, así que verificamos que al menos no esté hardcodeado
      const explicitUrlRegex = /url\s*=\s*env\(["']DATABASE_URL["']\)/
      const hardcodedUrlRegex = /url\s*=\s*["'](?!env\().*["']/
      const hasExplicitUrl = explicitUrlRegex.exec(schemaContent) !== null
      const hasHardcodedUrl = hardcodedUrlRegex.exec(schemaContent) !== null
      
      // Debe tener URL explícita O no tener URL hardcodeada (usa DATABASE_URL por defecto)
      expect(hasExplicitUrl || !hasHardcodedUrl).toBe(true)
    })
  })

  describe('No SQLite Configuration', () => {
    it('NO debe tener provider sqlite', () => {
      // Buscar provider = "sqlite" que no esté comentado
      const lines = schemaContent.split('\n')
      const sqliteLines = lines.filter(line => {
        const trimmed = line.trim()
        return (
          trimmed.includes('sqlite') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('*')
        )
      })

      expect(sqliteLines.length).toBe(0)
    })
  })
})
