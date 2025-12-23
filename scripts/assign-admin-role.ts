/**
 * Script para asignar rol de administrador a un usuario
 *
 * Uso:
 *   npx tsx scripts/assign-admin-role.ts <email>
 *
 * Ejemplo:
 *   npx tsx scripts/assign-admin-role.ts admin@example.com
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignAdminRole(email: string) {
  try {
    console.log(`🔍 Buscando usuario con email: ${email}...`)

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      console.error(`❌ Usuario no encontrado: ${email}`)
      process.exit(1)
    }

    if (user.role === 'admin') {
      console.log(`✅ El usuario ${email} ya tiene rol de administrador`)
      process.exit(0)
    }

    console.log(`📝 Usuario actual:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nombre: ${user.name || 'N/A'}`)
    console.log(`   Rol actual: ${user.role}`)

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    })

    console.log(`\n✅ Rol de administrador asignado exitosamente a ${email}`)
    console.log(`\n💡 El usuario ahora puede:`)
    console.log(`   - Generar exámenes con IA`)
    console.log(`   - Importar exámenes y clavijeros`)
    console.log(`   - Importar temarios`)
    console.log(`   - Limpiar datos de prueba`)
  } catch (error) {
    console.error('❌ Error al asignar rol:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Obtener email del argumento
const email = process.argv[2]

if (!email) {
  console.error('❌ Error: Debes proporcionar un email')
  console.log('\nUso: npx tsx scripts/assign-admin-role.ts <email>')
  console.log('Ejemplo: npx tsx scripts/assign-admin-role.ts admin@example.com')
  process.exit(1)
}

assignAdminRole(email)
  .then(() => {
    console.log('\n✨ Script finalizado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error fatal:', error)
    process.exit(1)
  })
