/**
 * Script para importar carreras de ejemplo con ponderaciones
 * Nota: Estas son carreras de ejemplo. Deben actualizarse con datos oficiales de DEMRE
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// ⛔ GUARD CRÍTICO: Validar DATABASE_URL antes de crear PrismaClient
const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  throw new Error(
    'DATABASE_URL no está configurada. Debe configurar una URL de PostgreSQL (Neon) en .env.local'
  )
}

if (dbUrl.startsWith('file:')) {
  throw new Error(
    `❌ SQLite detectado en DATABASE_URL. Este proyecto solo usa PostgreSQL (Neon).\n` +
    `   DATABASE_URL actual: ${dbUrl.substring(0, 50)}...\n` +
    `   Configure DATABASE_URL con una URL de PostgreSQL en .env.local`
  )
}

if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  throw new Error(
    `❌ DATABASE_URL no es una URL de PostgreSQL válida.\n` +
    `   DATABASE_URL actual: ${dbUrl.substring(0, 50)}...\n` +
    `   Debe comenzar con 'postgresql://' o 'postgres://'`
  )
}

// Crear PrismaClient estándar para PostgreSQL
const prisma = new PrismaClient()

// Carreras de ejemplo con ponderaciones típicas
// Nota: Estas deben actualizarse con la oferta definitiva oficial de DEMRE
const carrerasEjemplo = [
  // Ingenierías
  {
    nombre: 'Ingeniería Civil',
    universidad: 'Universidad de Chile',
    proceso: '2026',
    vacantes: 150,
    ponderacionNEM: 10,
    ponderacionRanking: 10,
    ponderacionLectora: 10,
    ponderacionM1: 35,
    ponderacionM2: 35,
    pruebasRequeridas: JSON.stringify(['LECTORA', 'M1', 'M2']),
    activa: true,
  },
  {
    nombre: 'Ingeniería Comercial',
    universidad: 'Pontificia Universidad Católica de Chile',
    proceso: '2026',
    vacantes: 200,
    ponderacionNEM: 10,
    ponderacionRanking: 10,
    ponderacionLectora: 25,
    ponderacionM1: 35,
    ponderacionM2: 20,
    pruebasRequeridas: JSON.stringify(['LECTORA', 'M1', 'M2']),
    activa: true,
  },
  // Medicina
  {
    nombre: 'Medicina',
    universidad: 'Universidad de Chile',
    proceso: '2026',
    vacantes: 120,
    ponderacionNEM: 10,
    ponderacionRanking: 10,
    ponderacionLectora: 20,
    ponderacionM1: 30,
    ponderacionCiencias: 30, // Biología
    pruebasRequeridas: JSON.stringify(['LECTORA', 'M1', 'BIO']),
    activa: true,
  },
  // Derecho
  {
    nombre: 'Derecho',
    universidad: 'Pontificia Universidad Católica de Chile',
    proceso: '2026',
    vacantes: 180,
    ponderacionNEM: 15,
    ponderacionRanking: 15,
    ponderacionLectora: 40,
    ponderacionM1: 15,
    ponderacionHistoria: 15,
    pruebasRequeridas: JSON.stringify(['LECTORA', 'M1', 'HIST']),
    activa: true,
  },
  // Pedagogías
  {
    nombre: 'Pedagogía en Educación Básica',
    universidad: 'Universidad de Chile',
    proceso: '2026',
    vacantes: 100,
    ponderacionNEM: 20,
    ponderacionRanking: 20,
    ponderacionLectora: 30,
    ponderacionM1: 15,
    ponderacionHistoria: 15,
    pruebasRequeridas: JSON.stringify(['LECTORA', 'M1', 'HIST']),
    activa: true,
  },
  // Psicología
  {
    nombre: 'Psicología',
    universidad: 'Pontificia Universidad Católica de Chile',
    proceso: '2026',
    vacantes: 150,
    ponderacionNEM: 15,
    ponderacionRanking: 15,
    ponderacionLectora: 30,
    ponderacionM1: 20,
    ponderacionCiencias: 20, // Biología
    pruebasRequeridas: JSON.stringify(['LECTORA', 'M1', 'BIO']),
    activa: true,
  },
]

async function main() {
  console.log('🎓 Importando carreras de ejemplo...')

  for (const carrera of carrerasEjemplo) {
    try {
      // Verificar si ya existe
      const existente = await prisma.career.findFirst({
        where: {
          nombre: carrera.nombre,
          universidad: carrera.universidad,
          proceso: carrera.proceso,
        },
      })

      if (existente) {
        console.log(`⏭️  Carrera ya existe: ${carrera.nombre} - ${carrera.universidad}`)
        continue
      }

      await prisma.career.create({
        data: carrera,
      })

      console.log(`✅ Carrera creada: ${carrera.nombre} - ${carrera.universidad}`)
    } catch (error) {
      console.error(`❌ Error al crear carrera ${carrera.nombre}:`, error)
    }
  }

  console.log('✅ Carreras importadas exitosamente')
  console.log('⚠️  Nota: Estas son carreras de ejemplo. Actualiza con datos oficiales de DEMRE.')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

