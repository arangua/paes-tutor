/**
 * Script de migración de encriptación
 *
 * Migra API keys encriptadas del método legacy (Base64) al nuevo método (AES-256)
 *
 * Uso:
 *   npx tsx scripts/migrate-encryption.ts
 *
 * IMPORTANTE: Haz un backup de la base de datos antes de ejecutar este script
 */
// @ts-nocheck


import { PrismaClient } from '@prisma/client'
import { decrypt, migrateEncryption } from '../src/lib/encryption'

const prisma = new PrismaClient()

async function migrateUserApiKeys() {
  console.log('🔄 Iniciando migración de encriptación de API keys...\n')

  try {
    // Obtener todos los usuarios con API keys
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { openaiApiKey: { not: null } },
          { anthropicApiKey: { not: null } },
          { geminiApiKey: { not: null } },
        ],
      },
      select: {
        id: true,
        email: true,
        openaiApiKey: true,
        anthropicApiKey: true,
        geminiApiKey: true,
      },
    })

    console.log(`📊 Encontrados ${users.length} usuarios con API keys\n`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const user of users) {
      try {
        const updates: {
          openaiApiKey?: string | null
          anthropicApiKey?: string | null
          geminiApiKey?: string | null
        } = {}

        // Migrar cada key si existe
        if (user.openaiApiKey) {
          try {
            // Intentar desencriptar con método nuevo
            const decrypted = decrypt(user.openaiApiKey)
            if (decrypted) {
              // Si ya está encriptado con AES, no migrar
              // Si está en Base64 legacy, migrar
              const migratedKey = migrateEncryption(user.openaiApiKey)
              if (migratedKey !== user.openaiApiKey) {
                updates.openaiApiKey = migratedKey
              }
            }
          } catch (error) {
            console.error(`  ⚠️  Error al migrar OpenAI key para ${user.email}:`, error)
          }
        }

        if (user.anthropicApiKey) {
          try {
            const decrypted = decrypt(user.anthropicApiKey)
            if (decrypted) {
              const migratedKey = migrateEncryption(user.anthropicApiKey)
              if (migratedKey !== user.anthropicApiKey) {
                updates.anthropicApiKey = migratedKey
              }
            }
          } catch (error) {
            console.error(`  ⚠️  Error al migrar Anthropic key para ${user.email}:`, error)
          }
        }

        if (user.geminiApiKey) {
          try {
            const decrypted = decrypt(user.geminiApiKey)
            if (decrypted) {
              const migratedKey = migrateEncryption(user.geminiApiKey)
              if (migratedKey !== user.geminiApiKey) {
                updates.geminiApiKey = migratedKey
              }
            }
          } catch (error) {
            console.error(`  ⚠️  Error al migrar Gemini key para ${user.email}:`, error)
          }
        }

        // Actualizar usuario si hay cambios
        if (Object.keys(updates).length > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: updates,
          })
          migrated++
          console.log(`  ✅ Migrado: ${user.email}`)
        } else {
          skipped++
          console.log(`  ⏭️  Ya migrado o sin cambios: ${user.email}`)
        }
      } catch (error) {
        errors++
        console.error(`  ❌ Error al procesar usuario ${user.email}:`, error)
      }
    }

    console.log('\n📈 Resumen de migración:')
    console.log(`  ✅ Migrados: ${migrated}`)
    console.log(`  ⏭️  Omitidos: ${skipped}`)
    console.log(`  ❌ Errores: ${errors}`)
    console.log('\n✨ Migración completada')
  } catch (error) {
    console.error('❌ Error fatal durante la migración:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateUserApiKeys()
  .then(() => {
    console.log('\n✅ Script finalizado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error fatal:', error)
    process.exit(1)
  })
