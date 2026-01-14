/**
 * Script para importar calendario del proceso de admisión 2026/2027
 * Basado en fechas oficiales de DEMRE
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

// Calendario del proceso de admisión 2026/2027
// Nota: Estas fechas son aproximadas basadas en el patrón histórico
// Deben actualizarse con las fechas oficiales cuando se publiquen
const calendario2026 = [
  // Enero 2026 - Resultados y Postulaciones
  {
    proceso: '2026',
    fecha: new Date('2026-01-05'),
    hora: '08:00',
    titulo: 'Publicación de Resultados PAES Regular',
    descripcion: 'Se publican los puntajes obtenidos en la PAES Regular',
    tipo: 'resultados',
    importante: true,
  },
  {
    proceso: '2026',
    fecha: new Date('2026-01-05'),
    hora: '09:00',
    titulo: 'Inicio Etapa de Postulaciones',
    descripcion: 'Comienza el período para postular a carreras',
    tipo: 'postulacion',
    importante: true,
  },
  {
    proceso: '2026',
    fecha: new Date('2026-01-08'),
    hora: '13:00',
    titulo: 'Finaliza Etapa de Postulaciones',
    descripcion: 'Último día y hora para postular a carreras',
    tipo: 'postulacion',
    importante: true,
  },
  // Abril 2026 - Inscripciones PAES Regular
  {
    proceso: '2026',
    fecha: new Date('2026-04-01'),
    hora: '09:00',
    titulo: 'Inicio Inscripción PAES Regular',
    descripcion: 'Comienza el período de inscripción para la PAES Regular',
    tipo: 'inscripcion',
    importante: true,
  },
  {
    proceso: '2026',
    fecha: new Date('2026-05-31'),
    hora: '13:00',
    titulo: 'Finaliza Inscripción PAES Regular',
    descripcion: 'Último día para inscribirse en la PAES Regular',
    tipo: 'inscripcion',
    importante: true,
  },
  // Diciembre 2026 - Aplicación PAES Regular
  {
    proceso: '2026',
    fecha: new Date('2026-12-27'),
    hora: '09:00',
    titulo: 'Aplicación PAES Regular - Día 1',
    descripcion: 'Primer día de aplicación de la PAES Regular',
    tipo: 'aplicacion',
    importante: true,
  },
  {
    proceso: '2026',
    fecha: new Date('2026-12-28'),
    hora: '09:00',
    titulo: 'Aplicación PAES Regular - Día 2',
    descripcion: 'Segundo día de aplicación de la PAES Regular',
    tipo: 'aplicacion',
    importante: true,
  },
  {
    proceso: '2026',
    fecha: new Date('2026-12-29'),
    hora: '09:00',
    titulo: 'Aplicación PAES Regular - Día 3',
    descripcion: 'Tercer día de aplicación de la PAES Regular',
    tipo: 'aplicacion',
    importante: true,
  },
  // Enero 2027 - Resultados y Postulaciones
  {
    proceso: '2027',
    fecha: new Date('2027-01-05'),
    hora: '08:00',
    titulo: 'Publicación de Resultados PAES Regular',
    descripcion: 'Se publican los puntajes obtenidos en la PAES Regular',
    tipo: 'resultados',
    importante: true,
  },
  {
    proceso: '2027',
    fecha: new Date('2027-01-05'),
    hora: '09:00',
    titulo: 'Inicio Etapa de Postulaciones',
    descripcion: 'Comienza el período para postular a carreras',
    tipo: 'postulacion',
    importante: true,
  },
  {
    proceso: '2027',
    fecha: new Date('2027-01-08'),
    hora: '13:00',
    titulo: 'Finaliza Etapa de Postulaciones',
    descripcion: 'Último día y hora para postular a carreras',
    tipo: 'postulacion',
    importante: true,
  },
]

async function main() {
  console.log('📅 Importando calendario del proceso de admisión 2026/2027...')

  for (const evento of calendario2026) {
    try {
      // Verificar si ya existe
      const existente = await prisma.admissionCalendar.findFirst({
        where: {
          proceso: evento.proceso,
          fecha: evento.fecha,
          titulo: evento.titulo,
        },
      })

      if (existente) {
        console.log(`⏭️  Evento ya existe: ${evento.titulo}`)
        continue
      }

      await prisma.admissionCalendar.create({
        data: evento,
      })

      console.log(`✅ Evento creado: ${evento.titulo} (${evento.fecha.toLocaleDateString()})`)
    } catch (error) {
      console.error(`❌ Error al crear evento ${evento.titulo}:`, error)
    }
  }

  console.log('✅ Calendario importado exitosamente')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

