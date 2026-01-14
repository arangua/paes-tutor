import dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar .env.local primero, luego .env
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// Crear PrismaClient con adapter para PostgreSQL (requerido en Prisma 7.2.0)
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL no está configurada. Debe configurar una URL de PostgreSQL (Neon) en .env.local')
}

if (databaseUrl.startsWith('file:')) {
  throw new Error(
    `❌ SQLite detectado en DATABASE_URL. Este proyecto solo usa PostgreSQL (Neon).\n` +
    `   Configure DATABASE_URL con una URL de PostgreSQL en .env.local`
  )
}

const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'matias@paestutor.com'
  const password = 'password123'
  
  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('✅ Usuario ya existe:')
    console.log(`   ID: ${existingUser.id}`)
    console.log(`   Email: ${existingUser.email}`)
    console.log(`   Nombre: ${existingUser.name}`)
    console.log(`   Tiene contraseña: ${existingUser.password ? 'Sí' : 'No'}`)
    
    // Verificar si tiene estudiante
    const student = await prisma.student.findFirst({
      where: { userId: existingUser.id },
    })
    
    if (student) {
      console.log(`   Estudiante: ${student.nombre}`)
    } else {
      console.log('   ⚠️  No tiene estudiante asociado')
      // Crear estudiante si no existe
      const newStudent = await prisma.student.create({
        data: {
          userId: existingUser.id,
          nombre: 'Matías',
        },
      })
      console.log(`   ✅ Estudiante creado: ${newStudent.nombre}`)
    }
    
    // Si no tiene contraseña o queremos actualizarla
    if (!existingUser.password) {
      console.log('   🔄 Actualizando contraseña...')
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      })
      console.log('   ✅ Contraseña actualizada')
    }
    
    return
  }

  // Crear nuevo usuario
  console.log('📝 Creando nuevo usuario...')
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Matías',
      password: hashedPassword,
    },
  })

  const student = await prisma.student.create({
    data: {
      userId: user.id,
      nombre: 'Matías',
    },
  })

  console.log('✅ Usuario y estudiante creados:')
  console.log(`   ID: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Nombre: ${user.name}`)
  console.log(`   Estudiante: ${student.nombre}`)
  console.log('')
  console.log('📧 Credenciales:')
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
