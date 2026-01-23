import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Crear PrismaClient con adapter para PostgreSQL (requerido en Prisma 7.2.0)
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL no está configurada')
}

const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'matias@paestutor.com'
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { student: true },
  })

  if (user) {
    console.log('✅ Usuario encontrado:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nombre: ${user.name}`)
    console.log(`   Tiene contraseña: ${user.password ? 'Sí' : 'No'}`)
    console.log(`   Tiene estudiante: ${user.student ? 'Sí' : 'No'}`)
    if (user.student) {
      console.log(`   Estudiante: ${user.student.nombre}`)
    }
  } else {
    console.log('❌ Usuario NO encontrado')
    console.log(`   Email buscado: ${email}`)
    console.log('   Necesitas ejecutar el seed para crear el usuario')
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
