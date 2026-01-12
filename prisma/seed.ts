import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// ⛔ GUARD CRÍTICO: Validar DATABASE_URL antes de crear PrismaClient
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL no está configurada. Debe configurar una URL de PostgreSQL (Neon) en .env.local'
  )
}

if (databaseUrl.startsWith('file:')) {
  throw new Error(
    `❌ SQLite detectado en DATABASE_URL. Este proyecto solo usa PostgreSQL (Neon).\n` +
    `   DATABASE_URL actual: ${databaseUrl.substring(0, 50)}...\n` +
    `   Configure DATABASE_URL con una URL de PostgreSQL en .env.local`
  )
}

if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  throw new Error(
    `❌ DATABASE_URL no es una URL de PostgreSQL válida.\n` +
    `   DATABASE_URL actual: ${databaseUrl.substring(0, 50)}...\n` +
    `   Debe comenzar con 'postgresql://' o 'postgres://'`
  )
}

// Crear PrismaClient estándar para PostgreSQL
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')
  console.log('🧹 Limpiando base de datos existente...')

  // Limpiar datos en orden inverso de dependencias
  await prisma.attemptAnswer.deleteMany()
  await prisma.attempt.deleteMany()
  await prisma.examQuestion.deleteMany()
  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()
  await prisma.studyMaterial.deleteMany()
  await prisma.performanceMetric.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.scoreTable.deleteMany()
  await prisma.student.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()
  await prisma.subject.deleteMany()

  console.log('✅ Base de datos limpiada')

  // Crear usuario y estudiante Matías
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.create({
    data: {
      email: 'matias@paestutor.com',
      name: 'Matías',
      password: hashedPassword
    }
  })

  const matias = await prisma.student.create({
    data: {
      userId: user.id,
      nombre: 'Matías'
    }
  })
  console.log('✅ Usuario y estudiante creados:', matias.nombre)
  console.log('📧 Email: matias@paestutor.com')
  console.log('🔑 Password: password123')

  // Definir asignaturas PAES (idempotente: upsert)
  const asignaturas = [
    { codigo: 'LECTORA', nombre: 'Competencia Lectora', tipo: 'obligatoria' },
    { codigo: 'M1', nombre: 'Matemática M1', tipo: 'obligatoria' },
    { codigo: 'M2', nombre: 'Matemática M2', tipo: 'electiva' },
    { codigo: 'BIO', nombre: 'Ciencias - Biología', tipo: 'electiva' },
    { codigo: 'FIS', nombre: 'Ciencias - Física', tipo: 'electiva' },
    { codigo: 'QUI', nombre: 'Ciencias - Química', tipo: 'electiva' },
    { codigo: 'HIST', nombre: 'Historia y Ciencias Sociales', tipo: 'electiva' }
  ]

  for (const asig of asignaturas) {
    await prisma.subject.upsert({
      where: { codigo: asig.codigo },
      update: {
        nombre: asig.nombre,
        tipo: asig.tipo,
      },
      create: asig
    })
  }
  console.log('✅ Asignaturas garantizadas (upsert):', asignaturas.length)

  // Definir temas por asignatura
  const temasPorAsignatura: Record<string, { nombre: string; ejeTematico: string }[]> = {
    LECTORA: [
      { nombre: 'Comprensión literal', ejeTematico: 'Localizar información' },
      { nombre: 'Comprensión inferencial', ejeTematico: 'Relacionar e interpretar' },
      { nombre: 'Comprensión crítica', ejeTematico: 'Reflexionar y evaluar' },
      { nombre: 'Textos literarios', ejeTematico: 'Géneros literarios' },
      { nombre: 'Textos no literarios', ejeTematico: 'Textos informativos y argumentativos' }
    ],
    M1: [
      { nombre: 'Números', ejeTematico: 'Conjuntos numéricos y operaciones' },
      { nombre: 'Álgebra', ejeTematico: 'Expresiones algebraicas y ecuaciones' },
      { nombre: 'Geometría', ejeTematico: 'Figuras geométricas y medición' },
      { nombre: 'Probabilidad', ejeTematico: 'Probabilidad y estadística' },
      { nombre: 'Funciones', ejeTematico: 'Funciones y gráficos' }
    ],
    M2: [
      { nombre: 'Álgebra avanzada', ejeTematico: 'Sistemas de ecuaciones y polinomios' },
      { nombre: 'Geometría analítica', ejeTematico: 'Coordenadas y rectas' },
      { nombre: 'Funciones avanzadas', ejeTematico: 'Funciones exponenciales y logarítmicas' },
      { nombre: 'Trigonometría', ejeTematico: 'Razones trigonométricas' },
      { nombre: 'Cálculo introductorio', ejeTematico: 'Límites y derivadas' }
    ],
    BIO: [
      { nombre: 'Biología celular', ejeTematico: 'Célula y organelos' },
      { nombre: 'Genética', ejeTematico: 'Herencia y ADN' },
      { nombre: 'Evolución', ejeTematico: 'Selección natural y especiación' },
      { nombre: 'Ecología', ejeTematico: 'Ecosistemas y biodiversidad' },
      { nombre: 'Fisiología humana', ejeTematico: 'Sistemas del cuerpo humano' }
    ],
    FIS: [
      { nombre: 'Mecánica', ejeTematico: 'Movimiento y fuerzas' },
      { nombre: 'Energía', ejeTematico: 'Trabajo y energía' },
      { nombre: 'Ondas', ejeTematico: 'Ondas mecánicas y sonido' },
      { nombre: 'Electricidad', ejeTematico: 'Circuitos y electromagnetismo' },
      { nombre: 'Física moderna', ejeTematico: 'Relatividad y cuántica' }
    ],
    QUI: [
      { nombre: 'Estructura atómica', ejeTematico: 'Modelos atómicos y configuración' },
      { nombre: 'Tabla periódica', ejeTematico: 'Propiedades periódicas' },
      { nombre: 'Enlaces químicos', ejeTematico: 'Tipos de enlaces' },
      { nombre: 'Reacciones químicas', ejeTematico: 'Estequiometría y balanceo' },
      { nombre: 'Química orgánica', ejeTematico: 'Compuestos del carbono' }
    ],
    HIST: [
      { nombre: 'Historia de Chile', ejeTematico: 'Siglos XIX y XX' },
      { nombre: 'Historia universal', ejeTematico: 'Procesos históricos mundiales' },
      { nombre: 'Geografía', ejeTematico: 'Territorio y población' },
      { nombre: 'Formación ciudadana', ejeTematico: 'Democracia y derechos' },
      { nombre: 'Economía', ejeTematico: 'Conceptos económicos básicos' }
    ]
  }

  // Obtener asignaturas creadas
  const subjects = await prisma.subject.findMany()

  for (const subject of subjects) {
    const temas = temasPorAsignatura[subject.codigo] || []
    for (const tema of temas) {
      await prisma.topic.create({
        data: {
          subjectId: subject.id,
          nombre: tema.nombre,
          ejeTematico: tema.ejeTematico
        }
      })
    }
  }
  console.log('✅ Temas creados para todas las asignaturas')

  // Crear preguntas de ejemplo
  const lectoraSubject = subjects.find((s: { codigo: string }) => s.codigo === 'LECTORA')!
  const m1Subject = subjects.find((s: { codigo: string }) => s.codigo === 'M1')!
  
  const lectoraTopics = await prisma.topic.findMany({ where: { subjectId: lectoraSubject.id } })
  const m1Topics = await prisma.topic.findMany({ where: { subjectId: m1Subject.id } })

  // Preguntas de Comprensión Lectora
  const preguntasLectora = [
    {
      topicIndex: 0,
      enunciado: '¿Cuál es la idea principal del siguiente texto? "La lectura es una herramienta fundamental para el desarrollo intelectual y personal de los estudiantes."',
      dificultad: 1,
      explicacion: 'La idea principal es que la lectura es fundamental para el desarrollo intelectual y personal.',
      options: [
        { letra: 'A', texto: 'La lectura es una herramienta fundamental', esCorrecta: true },
        { letra: 'B', texto: 'Los estudiantes necesitan leer más', esCorrecta: false },
        { letra: 'C', texto: 'La lectura es opcional', esCorrecta: false },
        { letra: 'D', texto: 'El desarrollo intelectual no requiere lectura', esCorrecta: false },
        { letra: 'E', texto: 'La lectura solo es importante para algunos', esCorrecta: false }
      ]
    },
    {
      topicIndex: 1,
      enunciado: 'En el texto: "El cambio climático representa uno de los desafíos más importantes de nuestro tiempo. Sus efectos se manifiestan en el aumento de temperaturas, el derretimiento de glaciares y la alteración de ecosistemas." ¿Qué se puede inferir sobre el cambio climático?',
      dificultad: 2,
      explicacion: 'El texto permite inferir que el cambio climático tiene múltiples consecuencias visibles y significativas.',
      options: [
        { letra: 'A', texto: 'Solo afecta las temperaturas', esCorrecta: false },
        { letra: 'B', texto: 'Tiene múltiples efectos observables', esCorrecta: true },
        { letra: 'C', texto: 'Es un problema menor', esCorrecta: false },
        { letra: 'D', texto: 'No afecta los ecosistemas', esCorrecta: false },
        { letra: 'E', texto: 'Solo ocurre en glaciares', esCorrecta: false }
      ]
    },
    {
      topicIndex: 2,
      enunciado: 'Un autor escribe: "La tecnología ha transformado la forma en que nos comunicamos, pero también ha generado nuevas formas de aislamiento social." ¿Cuál es la postura crítica del autor?',
      dificultad: 3,
      explicacion: 'El autor presenta una visión crítica que reconoce tanto beneficios como consecuencias negativas de la tecnología.',
      options: [
        { letra: 'A', texto: 'La tecnología solo tiene beneficios', esCorrecta: false },
        { letra: 'B', texto: 'La tecnología es completamente negativa', esCorrecta: false },
        { letra: 'C', texto: 'La tecnología tiene aspectos positivos y negativos', esCorrecta: true },
        { letra: 'D', texto: 'La tecnología no afecta la comunicación', esCorrecta: false },
        { letra: 'E', texto: 'El aislamiento social no existe', esCorrecta: false }
      ]
    },
    {
      topicIndex: 3,
      enunciado: 'En un poema se lee: "La luna plateada / baña el jardín / con su luz suave / mientras duermen las flores." ¿Qué figura literaria predomina?',
      dificultad: 2,
      explicacion: 'La personificación es evidente al atribuir la acción de dormir a las flores, que son objetos inanimados.',
      options: [
        { letra: 'A', texto: 'Metáfora', esCorrecta: false },
        { letra: 'B', texto: 'Personificación', esCorrecta: true },
        { letra: 'C', texto: 'Hipérbole', esCorrecta: false },
        { letra: 'D', texto: 'Comparación', esCorrecta: false },
        { letra: 'E', texto: 'Onomatopeya', esCorrecta: false }
      ]
    },
    {
      topicIndex: 4,
      enunciado: 'En un artículo científico se afirma: "Los estudios demuestran que el ejercicio regular reduce el riesgo de enfermedades cardiovasculares en un 30%." ¿Qué tipo de texto es este?',
      dificultad: 1,
      explicacion: 'Es un texto informativo que presenta datos científicos y estadísticos de manera objetiva.',
      options: [
        { letra: 'A', texto: 'Texto literario', esCorrecta: false },
        { letra: 'B', texto: 'Texto argumentativo', esCorrecta: false },
        { letra: 'C', texto: 'Texto informativo', esCorrecta: true },
        { letra: 'D', texto: 'Texto narrativo', esCorrecta: false },
        { letra: 'E', texto: 'Texto poético', esCorrecta: false }
      ]
    },
    {
      topicIndex: 0,
      enunciado: 'Según el texto: "La democracia requiere participación ciudadana activa. Sin ella, el sistema político pierde legitimidad." ¿Qué relación se establece?',
      dificultad: 2,
      explicacion: 'Se establece una relación de causa-efecto: sin participación ciudadana, la democracia pierde legitimidad.',
      options: [
        { letra: 'A', texto: 'Causa-efecto', esCorrecta: true },
        { letra: 'B', texto: 'Comparación', esCorrecta: false },
        { letra: 'C', texto: 'Contraste', esCorrecta: false },
        { letra: 'D', texto: 'Ejemplificación', esCorrecta: false },
        { letra: 'E', texto: 'Definición', esCorrecta: false }
      ]
    },
    {
      topicIndex: 1,
      enunciado: 'El autor menciona: "A pesar de las dificultades económicas, la comunidad logró organizarse y mejorar su calidad de vida." ¿Qué se puede inferir sobre la comunidad?',
      dificultad: 2,
      explicacion: 'Se puede inferir que la comunidad tiene capacidad de organización y resiliencia ante las adversidades.',
      options: [
        { letra: 'A', texto: 'No tiene capacidad de organización', esCorrecta: false },
        { letra: 'B', texto: 'Es resiliente y organizada', esCorrecta: true },
        { letra: 'C', texto: 'Solo se preocupa por la economía', esCorrecta: false },
        { letra: 'D', texto: 'No enfrenta dificultades', esCorrecta: false },
        { letra: 'E', texto: 'Depende completamente de ayuda externa', esCorrecta: false }
      ]
    },
    {
      topicIndex: 2,
      enunciado: 'Un crítico literario escribe: "La obra de este autor refleja las tensiones sociales de su época, pero su tratamiento de los personajes femeninos resulta problemático desde una perspectiva contemporánea." ¿Qué evaluación hace el crítico?',
      dificultad: 3,
      explicacion: 'El crítico hace una evaluación que reconoce méritos históricos pero señala limitaciones desde una perspectiva actual.',
      options: [
        { letra: 'A', texto: 'Solo elogia la obra', esCorrecta: false },
        { letra: 'B', texto: 'Solo critica la obra', esCorrecta: false },
        { letra: 'C', texto: 'Hace una evaluación balanceada', esCorrecta: true },
        { letra: 'D', texto: 'No evalúa la obra', esCorrecta: false },
        { letra: 'E', texto: 'Se enfoca solo en los personajes', esCorrecta: false }
      ]
    },
    {
      topicIndex: 3,
      enunciado: 'En un cuento se describe: "El viento susurraba secretos entre las hojas de los árboles, mientras la noche envolvía todo en un manto oscuro." ¿Qué atmósfera se crea?',
      dificultad: 2,
      explicacion: 'Se crea una atmósfera misteriosa y envolvente mediante la personificación y las imágenes sensoriales.',
      options: [
        { letra: 'A', texto: 'Alegre y festiva', esCorrecta: false },
        { letra: 'B', texto: 'Misteriosa y envolvente', esCorrecta: true },
        { letra: 'C', texto: 'Tensa y violenta', esCorrecta: false },
        { letra: 'D', texto: 'Neutra y descriptiva', esCorrecta: false },
        { letra: 'E', texto: 'Cómica y ligera', esCorrecta: false }
      ]
    },
    {
      topicIndex: 4,
      enunciado: 'Un editorial afirma: "Es necesario implementar políticas públicas que garanticen el acceso universal a la educación superior." ¿Cuál es la intención del texto?',
      dificultad: 1,
      explicacion: 'La intención es persuadir o convencer sobre la necesidad de implementar ciertas políticas públicas.',
      options: [
        { letra: 'A', texto: 'Informar', esCorrecta: false },
        { letra: 'B', texto: 'Persuadir', esCorrecta: true },
        { letra: 'C', texto: 'Entretener', esCorrecta: false },
        { letra: 'D', texto: 'Narrar', esCorrecta: false },
        { letra: 'E', texto: 'Describir', esCorrecta: false }
      ]
    }
  ]

  const preguntasM1 = [
    {
      topicIndex: 0,
      enunciado: 'Si x + 5 = 12, ¿cuál es el valor de x?',
      dificultad: 1,
      explicacion: 'Para resolver x + 5 = 12, restamos 5 a ambos lados: x = 12 - 5 = 7',
      options: [
        { letra: 'A', texto: '5', esCorrecta: false },
        { letra: 'B', texto: '7', esCorrecta: true },
        { letra: 'C', texto: '12', esCorrecta: false },
        { letra: 'D', texto: '17', esCorrecta: false },
        { letra: 'E', texto: '60', esCorrecta: false }
      ]
    },
    {
      topicIndex: 0,
      enunciado: '¿Cuál es el resultado de 3² + 4²?',
      dificultad: 1,
      explicacion: '3² = 9 y 4² = 16, entonces 9 + 16 = 25',
      options: [
        { letra: 'A', texto: '7', esCorrecta: false },
        { letra: 'B', texto: '12', esCorrecta: false },
        { letra: 'C', texto: '25', esCorrecta: true },
        { letra: 'D', texto: '49', esCorrecta: false },
        { letra: 'E', texto: '81', esCorrecta: false }
      ]
    },
    {
      topicIndex: 1,
      enunciado: 'Si 2x - 3 = 7, ¿cuál es el valor de x?',
      dificultad: 2,
      explicacion: '2x - 3 = 7 → 2x = 7 + 3 → 2x = 10 → x = 5',
      options: [
        { letra: 'A', texto: '2', esCorrecta: false },
        { letra: 'B', texto: '4', esCorrecta: false },
        { letra: 'C', texto: '5', esCorrecta: true },
        { letra: 'D', texto: '7', esCorrecta: false },
        { letra: 'E', texto: '10', esCorrecta: false }
      ]
    },
    {
      topicIndex: 1,
      enunciado: 'Factoriza la expresión: x² - 9',
      dificultad: 2,
      explicacion: 'x² - 9 es una diferencia de cuadrados: (x + 3)(x - 3)',
      options: [
        { letra: 'A', texto: '(x - 3)²', esCorrecta: false },
        { letra: 'B', texto: '(x + 3)(x - 3)', esCorrecta: true },
        { letra: 'C', texto: '(x + 9)(x - 1)', esCorrecta: false },
        { letra: 'D', texto: 'x(x - 9)', esCorrecta: false },
        { letra: 'E', texto: 'No se puede factorizar', esCorrecta: false }
      ]
    },
    {
      topicIndex: 2,
      enunciado: '¿Cuál es el área de un círculo con radio 5 cm? (Usa π ≈ 3.14)',
      dificultad: 2,
      explicacion: 'Área = πr² = 3.14 × 5² = 3.14 × 25 = 78.5 cm²',
      options: [
        { letra: 'A', texto: '15.7 cm²', esCorrecta: false },
        { letra: 'B', texto: '25 cm²', esCorrecta: false },
        { letra: 'C', texto: '78.5 cm²', esCorrecta: true },
        { letra: 'D', texto: '157 cm²', esCorrecta: false },
        { letra: 'E', texto: '314 cm²', esCorrecta: false }
      ]
    },
    {
      topicIndex: 2,
      enunciado: 'Un triángulo rectángulo tiene catetos de 3 cm y 4 cm. ¿Cuál es la longitud de la hipotenusa?',
      dificultad: 2,
      explicacion: 'Usando el teorema de Pitágoras: h² = 3² + 4² = 9 + 16 = 25, entonces h = 5 cm',
      options: [
        { letra: 'A', texto: '5 cm', esCorrecta: true },
        { letra: 'B', texto: '7 cm', esCorrecta: false },
        { letra: 'C', texto: '12 cm', esCorrecta: false },
        { letra: 'D', texto: '25 cm', esCorrecta: false },
        { letra: 'E', texto: 'No se puede determinar', esCorrecta: false }
      ]
    },
    {
      topicIndex: 3,
      enunciado: 'Si lanzas un dado, ¿cuál es la probabilidad de obtener un número par?',
      dificultad: 1,
      explicacion: 'Los números pares en un dado son 2, 4, 6. Probabilidad = 3/6 = 1/2',
      options: [
        { letra: 'A', texto: '1/6', esCorrecta: false },
        { letra: 'B', texto: '1/3', esCorrecta: false },
        { letra: 'C', texto: '1/2', esCorrecta: true },
        { letra: 'D', texto: '2/3', esCorrecta: false },
        { letra: 'E', texto: '5/6', esCorrecta: false }
      ]
    },
    {
      topicIndex: 3,
      enunciado: 'En una encuesta, el 60% de los encuestados prefiere el color azul. Si hay 200 encuestados, ¿cuántos prefieren el azul?',
      dificultad: 2,
      explicacion: '60% de 200 = 0.60 × 200 = 120 personas',
      options: [
        { letra: 'A', texto: '60', esCorrecta: false },
        { letra: 'B', texto: '80', esCorrecta: false },
        { letra: 'C', texto: '120', esCorrecta: true },
        { letra: 'D', texto: '140', esCorrecta: false },
        { letra: 'E', texto: '160', esCorrecta: false }
      ]
    },
    {
      topicIndex: 4,
      enunciado: 'Si f(x) = 2x + 3, ¿cuál es el valor de f(4)?',
      dificultad: 1,
      explicacion: 'f(4) = 2(4) + 3 = 8 + 3 = 11',
      options: [
        { letra: 'A', texto: '8', esCorrecta: false },
        { letra: 'B', texto: '9', esCorrecta: false },
        { letra: 'C', texto: '11', esCorrecta: true },
        { letra: 'D', texto: '14', esCorrecta: false },
        { letra: 'E', texto: '15', esCorrecta: false }
      ]
    },
    {
      topicIndex: 4,
      enunciado: '¿Cuál es la pendiente de la recta que pasa por los puntos (2, 3) y (5, 9)?',
      dificultad: 2,
      explicacion: 'Pendiente = (y₂ - y₁)/(x₂ - x₁) = (9 - 3)/(5 - 2) = 6/3 = 2',
      options: [
        { letra: 'A', texto: '1', esCorrecta: false },
        { letra: 'B', texto: '2', esCorrecta: true },
        { letra: 'C', texto: '3', esCorrecta: false },
        { letra: 'D', texto: '4', esCorrecta: false },
        { letra: 'E', texto: '6', esCorrecta: false }
      ]
    }
  ]

  // Crear preguntas de Lectora
  const preguntasCreadasLectora = []
  for (const pregunta of preguntasLectora) {
    if (lectoraTopics[pregunta.topicIndex]) {
      const preguntaCreada = await prisma.question.create({
        data: {
          subjectId: lectoraSubject.id,
          topicId: lectoraTopics[pregunta.topicIndex].id,
          enunciado: pregunta.enunciado,
          dificultad: pregunta.dificultad,
          explicacion: pregunta.explicacion,
          fuente: 'PAES 2023',
          tipo: 'multiple_choice',
          options: {
            create: pregunta.options
          }
        }
      })
      preguntasCreadasLectora.push(preguntaCreada)
    }
  }
  console.log('✅ Preguntas de Lectora creadas:', preguntasCreadasLectora.length)

  // Crear preguntas de M1
  const preguntasCreadasM1 = []
  for (const pregunta of preguntasM1) {
    if (m1Topics[pregunta.topicIndex]) {
      const preguntaCreada = await prisma.question.create({
        data: {
          subjectId: m1Subject.id,
          topicId: m1Topics[pregunta.topicIndex].id,
          enunciado: pregunta.enunciado,
          dificultad: pregunta.dificultad,
          explicacion: pregunta.explicacion,
          fuente: 'PAES 2023',
          tipo: 'multiple_choice',
          options: {
            create: pregunta.options
          }
        }
      })
      preguntasCreadasM1.push(preguntaCreada)
    }
  }
  console.log('✅ Preguntas de Matemática M1 creadas:', preguntasCreadasM1.length)

  // Crear materiales de estudio de ejemplo
  if (lectoraTopics.length > 0) {
    await prisma.studyMaterial.create({
      data: {
        subjectId: lectoraSubject.id,
        topicId: lectoraTopics[0].id,
        titulo: 'Guía de Comprensión Lectora',
        contenido: 'La comprensión lectora es la capacidad de entender, interpretar y analizar textos escritos. Incluye tres niveles: literal, inferencial y crítico.',
        fuente: 'DEMRE',
        tipo: 'guia'
      }
    })
    console.log('✅ Material de estudio creado (Lectora)')
  }

  if (m1Topics.length > 0) {
    await prisma.studyMaterial.create({
      data: {
        subjectId: m1Subject.id,
        topicId: m1Topics[0].id,
        titulo: 'Introducción a los Números',
        contenido: 'Los números naturales, enteros, racionales e irracionales forman el conjunto de los números reales. Cada conjunto tiene propiedades específicas que es importante conocer.',
        fuente: 'DEMRE',
        tipo: 'guia'
      }
    })
    console.log('✅ Material de estudio creado (Matemática M1)')
  }

  // Crear exámenes de ejemplo
  const examLectora = await prisma.exam.create({
    data: {
      subjectId: lectoraSubject.id,
      titulo: 'Simulacro PAES - Competencia Lectora',
      descripcion: 'Examen de práctica para Competencia Lectora',
      tipo: 'simulacro',
      tiempoLimiteMin: 90,
      totalPreguntas: preguntasCreadasLectora.length,
      fuente: 'DEMRE',
      questions: {
        create: preguntasCreadasLectora.map((pregunta, index) => ({
          questionId: pregunta.id,
          orden: index + 1
        }))
      }
    }
  })

  const examM1 = await prisma.exam.create({
    data: {
      subjectId: m1Subject.id,
      titulo: 'Simulacro PAES - Matemática M1',
      descripcion: 'Examen de práctica para Matemática M1',
      tipo: 'simulacro',
      tiempoLimiteMin: 135,
      totalPreguntas: preguntasCreadasM1.length,
      fuente: 'DEMRE',
      questions: {
        create: preguntasCreadasM1.map((pregunta, index) => ({
          questionId: pregunta.id,
          orden: index + 1
        }))
      }
    }
  })
  console.log('✅ Exámenes creados y vinculados con preguntas')

  // Crear tabla de puntajes PAES completa
  const scoreTables = [
    // Competencia Lectora - PAES 2023 (Forma A)
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 0, puntajePaes: 150 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 5, puntajePaes: 300 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 10, puntajePaes: 450 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 15, puntajePaes: 550 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 20, puntajePaes: 650 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 25, puntajePaes: 725 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 30, puntajePaes: 800 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 35, puntajePaes: 875 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 40, puntajePaes: 950 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 45, puntajePaes: 1025 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 50, puntajePaes: 1100 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 55, puntajePaes: 1200 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 60, puntajePaes: 1350 },
    { subjectCodigo: 'LECTORA', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 65, puntajePaes: 1500 },
    
    // Competencia Lectora - PAES 2024 (Forma A)
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 0, puntajePaes: 150 },
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 10, puntajePaes: 440 },
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 20, puntajePaes: 640 },
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 30, puntajePaes: 790 },
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 40, puntajePaes: 940 },
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 50, puntajePaes: 1090 },
    { subjectCodigo: 'LECTORA', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 65, puntajePaes: 1500 },
    
    // Matemática M1 - PAES 2023 (Forma A)
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 0, puntajePaes: 150 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 5, puntajePaes: 275 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 10, puntajePaes: 400 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 15, puntajePaes: 500 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 20, puntajePaes: 600 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 25, puntajePaes: 675 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 30, puntajePaes: 750 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 35, puntajePaes: 825 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 40, puntajePaes: 900 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 45, puntajePaes: 975 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 50, puntajePaes: 1050 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 55, puntajePaes: 1150 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 60, puntajePaes: 1300 },
    { subjectCodigo: 'M1', proceso: '2023', tipoAplicacion: 'regular', forma: 'A', correctas: 65, puntajePaes: 1500 },
    
    // Matemática M1 - PAES 2024 (Forma A)
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 0, puntajePaes: 150 },
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 10, puntajePaes: 390 },
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 20, puntajePaes: 590 },
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 30, puntajePaes: 740 },
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 40, puntajePaes: 890 },
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 50, puntajePaes: 1040 },
    { subjectCodigo: 'M1', proceso: '2024', tipoAplicacion: 'regular', forma: 'A', correctas: 65, puntajePaes: 1500 }
  ]

  for (const score of scoreTables) {
    await prisma.scoreTable.create({ data: score })
  }
  console.log('✅ Tabla de puntajes PAES creada:', scoreTables.length, 'registros')

  // Crear intentos de ejemplo
  const fechaInicio = new Date()
  fechaInicio.setDate(fechaInicio.getDate() - 7) // Hace 7 días
  
  // Intentar obtener las preguntas del examen de Lectora
  const preguntasExamLectora = await prisma.examQuestion.findMany({
    where: { examId: examLectora.id },
    include: { question: { include: { options: true } } },
    orderBy: { orden: 'asc' }
  })

  if (preguntasExamLectora.length > 0) {
    // Crear un intento completado
    const respuestasCorrectas = []
    const respuestasIncorrectas = []
    
    // Simular respuestas: 7 correctas de 10
    for (let i = 0; i < Math.min(10, preguntasExamLectora.length); i++) {
      const examQ = preguntasExamLectora[i]
      const pregunta = examQ.question
      const opcionCorrecta = pregunta.options.find((opt: { esCorrecta: boolean }) => opt.esCorrecta)
      const opcionesIncorrectas = pregunta.options.filter((opt: { esCorrecta: boolean }) => !opt.esCorrecta)
      
      if (i < 7 && opcionCorrecta) {
        // Respuesta correcta
        respuestasCorrectas.push({
          questionId: pregunta.id,
          optionSelectedId: opcionCorrecta.id,
          esCorrecta: true,
          omitida: false,
          tiempoSegundos: Math.floor(Math.random() * 60) + 30
        })
      } else if (opcionesIncorrectas.length > 0) {
        // Respuesta incorrecta
        const opcionIncorrecta = opcionesIncorrectas[Math.floor(Math.random() * opcionesIncorrectas.length)]
        respuestasIncorrectas.push({
          questionId: pregunta.id,
          optionSelectedId: opcionIncorrecta.id,
          esCorrecta: false,
          omitida: false,
          tiempoSegundos: Math.floor(Math.random() * 60) + 30
        })
      }
    }

    const fechaFin = new Date(fechaInicio)
    fechaFin.setMinutes(fechaFin.getMinutes() + 45) // 45 minutos después

    const attemptLectora = await prisma.attempt.create({
      data: {
        studentId: matias.id,
        examId: examLectora.id,
        proceso: '2023',
        tipoAplicacion: 'regular',
        forma: 'A',
        estado: 'completado',
        startedAt: fechaInicio,
        finishedAt: fechaFin,
        duracionSegundos: 45 * 60,
        totalPreguntas: 10,
        correctas: respuestasCorrectas.length,
        incorrectas: respuestasIncorrectas.length,
        omitidas: 0,
        porcentaje: (respuestasCorrectas.length / 10) * 100,
        puntajePaes: 650, // Aproximado según tabla
        puntajeEstimado: true,
        analisisIA: 'El estudiante muestra buen dominio en comprensión literal e inferencial. Debe reforzar comprensión crítica.',
        fortalezas: 'Identificación de ideas principales, inferencias básicas',
        debilidades: 'Análisis crítico de textos, evaluación de argumentos',
        recomendaciones: 'Practicar con textos argumentativos y ejercicios de evaluación crítica',
        answers: {
          create: [...respuestasCorrectas, ...respuestasIncorrectas]
        }
      }
    })
    console.log('✅ Intento de ejemplo creado (Lectora):', attemptLectora.id)
  }

  // Crear intento para M1
  const preguntasExamM1 = await prisma.examQuestion.findMany({
    where: { examId: examM1.id },
    include: { question: { include: { options: true } } },
    orderBy: { orden: 'asc' }
  })

  if (preguntasExamM1.length > 0) {
    const respuestasCorrectasM1 = []
    const respuestasIncorrectasM1 = []
    
    // Simular respuestas: 8 correctas de 10
    for (let i = 0; i < Math.min(10, preguntasExamM1.length); i++) {
      const examQ = preguntasExamM1[i]
      const pregunta = examQ.question
      const opcionCorrecta = pregunta.options.find((opt: { esCorrecta: boolean }) => opt.esCorrecta)
      const opcionesIncorrectas = pregunta.options.filter((opt: { esCorrecta: boolean }) => !opt.esCorrecta)
      
      if (i < 8 && opcionCorrecta) {
        respuestasCorrectasM1.push({
          questionId: pregunta.id,
          optionSelectedId: opcionCorrecta.id,
          esCorrecta: true,
          omitida: false,
          tiempoSegundos: Math.floor(Math.random() * 90) + 45
        })
      } else if (opcionesIncorrectas.length > 0) {
        const opcionIncorrecta = opcionesIncorrectas[Math.floor(Math.random() * opcionesIncorrectas.length)]
        respuestasIncorrectasM1.push({
          questionId: pregunta.id,
          optionSelectedId: opcionIncorrecta.id,
          esCorrecta: false,
          omitida: false,
          tiempoSegundos: Math.floor(Math.random() * 90) + 45
        })
      }
    }

    const fechaInicioM1 = new Date()
    fechaInicioM1.setDate(fechaInicioM1.getDate() - 3) // Hace 3 días
    const fechaFinM1 = new Date(fechaInicioM1)
    fechaFinM1.setMinutes(fechaFinM1.getMinutes() + 60) // 60 minutos después

    const attemptM1 = await prisma.attempt.create({
      data: {
        studentId: matias.id,
        examId: examM1.id,
        proceso: '2023',
        tipoAplicacion: 'regular',
        forma: 'A',
        estado: 'completado',
        startedAt: fechaInicioM1,
        finishedAt: fechaFinM1,
        duracionSegundos: 60 * 60,
        totalPreguntas: 10,
        correctas: respuestasCorrectasM1.length,
        incorrectas: respuestasIncorrectasM1.length,
        omitidas: 0,
        porcentaje: (respuestasCorrectasM1.length / 10) * 100,
        puntajePaes: 750, // Aproximado según tabla
        puntajeEstimado: true,
        analisisIA: 'Buen desempeño en álgebra y geometría. Necesita reforzar probabilidad y funciones.',
        fortalezas: 'Resolución de ecuaciones, geometría básica',
        debilidades: 'Probabilidad, funciones avanzadas',
        recomendaciones: 'Practicar ejercicios de probabilidad y análisis de funciones',
        answers: {
          create: [...respuestasCorrectasM1, ...respuestasIncorrectasM1]
        }
      }
    })
    console.log('✅ Intento de ejemplo creado (M1):', attemptM1.id)
  }

  // Crear métricas de rendimiento iniciales
  // Nota: allTopics se obtiene implícitamente a través de los intentos

  // Obtener todos los intentos del estudiante
  const attempts = await prisma.attempt.findMany({
    where: { studentId: matias.id },
    include: {
      answers: {
        include: {
          question: { include: { topic: true } }
        }
      }
    }
  })

  // Calcular métricas por tema
  const metricasPorTema = new Map<string, { total: number; correctas: number }>()

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      if (answer.question.topic) {
        const topicId = answer.question.topic.id
        const current = metricasPorTema.get(topicId) || { total: 0, correctas: 0 }
        current.total++
        if (answer.esCorrecta) {
          current.correctas++
        }
        metricasPorTema.set(topicId, current)
      }
    }
  }

  // Crear registros de métricas
  let metricasCreadas = 0
  for (const [topicId, datos] of metricasPorTema.entries()) {
    const porcentaje = datos.total > 0 ? (datos.correctas / datos.total) * 100 : 0
    let nivel = 'bajo'
    if (porcentaje >= 80) nivel = 'alto'
    else if (porcentaje >= 60) nivel = 'medio'
    
    let tendencia = 'estable'
    if (porcentaje >= 70) tendencia = 'mejorando'
    else if (porcentaje < 50) tendencia = 'bajando'

    await prisma.performanceMetric.create({
      data: {
        studentId: matias.id,
        topicId: topicId,
        totalPreguntas: datos.total,
        correctas: datos.correctas,
        porcentaje: porcentaje,
        nivel: nivel,
        tendencia: tendencia
      }
    })
    metricasCreadas++
  }
  console.log('✅ Métricas de rendimiento creadas:', metricasCreadas)

  console.log('🎉 Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })