/**
 * Script de prueba para detectCorrectAnswers
 * 
 * Prueba diferentes formatos de texto de PDF para verificar
 * que la función detectCorrectAnswers funciona correctamente.
 */


// Copiar la función detectCorrectAnswers del endpoint
function detectCorrectAnswers(text: string): Map<number, string> {
  const answerMap = new Map<number, string>()

  // Validar que text sea un string válido
  const safeText = typeof text === 'string' ? text : ''
  if (!safeText) {
    return answerMap
  }

  // Normalizar el texto
  let normalizedText = ''
  try {
    normalizedText = safeText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toUpperCase()
    if (typeof normalizedText !== 'string') {
      normalizedText = safeText.toUpperCase() // Fallback
    }
  } catch {
    normalizedText = safeText.toUpperCase() // Fallback
  }

  // Buscar sección de respuestas (típicamente al final del documento)
  const answerSectionPatterns = [
    /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
  ]

  let answerSection = ''
  if (typeof normalizedText === 'string' && normalizedText.length > 0) {
    for (const pattern of answerSectionPatterns) {
      try {
        const match = normalizedText.match(pattern)
        if (match && Array.isArray(match) && match.length > 1 && match[1] && typeof match[1] === 'string') {
          answerSection = match[1]
          break
        }
      } catch {
        // Continuar con el siguiente patrón
      }
    }
  }

  // Si no se encuentra una sección específica, buscar en el último 30% del texto
  if (!answerSection && typeof normalizedText === 'string' && normalizedText.length > 0) {
    const textLength = typeof normalizedText === 'string' && Number.isFinite(normalizedText.length) ? normalizedText.length : 0
    if (textLength > 0) {
      const floorResult = Math.floor(textLength * 0.7)
      if (Number.isFinite(floorResult) && floorResult >= 0 && floorResult <= textLength) {
        try {
          const lastSection = normalizedText.substring(floorResult)
          if (typeof lastSection === 'string') {
            answerSection = lastSection
          }
        } catch {
          answerSection = normalizedText // Fallback
        }
      } else {
        answerSection = normalizedText // Fallback
      }
    } else {
      answerSection = normalizedText // Fallback
    }
  }

  // Si aún no hay sección, usar todo el texto (último recurso)
  if (!answerSection || answerSection.length === 0) {
    answerSection = normalizedText
  }

  // Múltiples patrones para detectar respuestas (ordenados por especificidad)
  // IMPORTANTE: Patrones más específicos primero para evitar falsos positivos
  const answerPatterns = [
    // Formato invertido: "A1", "B2" (letra-número) - debe ir primero para evitar conflictos
    /^([A-E])(\d+)$/gm, // Solo si está en su propia línea
    /([A-E])(\d+)(?=\s|$|,|\.)/g, // Con delimitadores claros
    // Formato: "1. A", "1) A", "1.A" (muy específico)
    /(\d+)[.)]\s*([A-E])(?=\s|$|,|\.)/g,
    // Formato: "1: A", "2: B" (dos puntos)
    /(\d+):\s*([A-E])(?=\s|$|,|\.)/g,
    // Formato: "P1: A", "Pregunta 1: A"
    /(?:P|PREGUNTA|PREG)\s*(\d+)[:\s]+([A-E])/gi,
    // Formato en lista: "1) A", "2) B" (inicio de línea)
    /^(\d+)\)\s*([A-E])/gm,
    // Formato: "1) A", "2) B" (sin inicio de línea, más flexible)
    /(\d+)\)\s*([A-E])(?=\s|$|,|\.)/g,
    // Formato: "1-A", "1-A,", "1-A ", "1 - A", "1-A."
    /(\d+)[\s\-]+([A-E])(?=\s|$|,|\.)/g,
    // Formato: "1 A" (con espacio), "1  A" (múltiples espacios) - menos específico, al final
    /(\d+)\s+([A-E])(?=\s|$|,|\.)/g,
  ]

  if (typeof answerSection === 'string' && answerSection.length > 0) {
    for (const pattern of answerPatterns) {
      try {
        const matches = Array.from(answerSection.matchAll(pattern))
        if (!Array.isArray(matches)) {
          continue
        }
        for (const match of matches) {
          if (!match || !Array.isArray(match) || match.length < 3 || !match[1] || !match[2]) {
            continue // Saltar matches inválidos
          }
          
          let questionNum: number
          let answerLetter: string

          // Manejar patrón especial: "A1", "B2" (letra-número) vs "1-A", "2-B" (número-letra)
          const match1 = typeof match[1] === 'string' ? match[1] : String(match[1])
          const match2 = typeof match[2] === 'string' ? match[2] : String(match[2])
          
          // Detectar si es formato invertido (letra-número)
          const isLetterNumberFormat = /^[A-E]$/i.test(match1) && /^\d+$/.test(match2)
          
          if (isLetterNumberFormat) {
            // Formato: "A1", "B2" → letra es match1, número es match2
            answerLetter = match1.toUpperCase()
            const safeMatch2 = typeof match2 === 'string' && match2.length > 0 ? match2 : ''
            if (!safeMatch2) {
              continue
            }
            questionNum = parseInt(safeMatch2, 10)
          } else {
            // Formato normal: "1-A", "2-B" → número es match1, letra es match2
            const safeMatch1 = typeof match1 === 'string' && match1.length > 0 ? match1 : ''
            if (!safeMatch1) {
              continue // Saltar si match1 es inválido o vacío
            }
            questionNum = parseInt(safeMatch1, 10)
            try {
              answerLetter = match2.toUpperCase()
              if (typeof answerLetter !== 'string') {
                answerLetter = match2 // Fallback
              }
            } catch {
              answerLetter = match2 // Fallback
            }
          }

          // Validar número de pregunta
          if (isNaN(questionNum) || questionNum <= 0 || !Number.isFinite(questionNum)) {
            continue // Saltar números inválidos
          }

          // Validar que la letra esté en el rango A-E
          // Aumentar límite a 150 para exámenes más largos
          if (questionNum <= 150 && typeof answerLetter === 'string' && /^[A-E]$/.test(answerLetter)) {
            // Si ya existe una respuesta para esta pregunta, mantener la primera encontrada
            if (!answerMap.has(questionNum)) {
              answerMap.set(questionNum, answerLetter)
            }
          }
        }
      } catch {
        // Continuar con el siguiente patrón
      }
    }
  }

  return answerMap
}

// Casos de prueba
const testCases = [
  {
    name: 'Formato estándar: "1-A", "2-B"',
    text: `
      RESPUESTAS:
      1-A
      2-B
      3-C
      4-D
      5-A
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
      [4, 'D'],
      [5, 'A'],
    ]),
  },
  {
    name: 'Formato con puntos: "1. A", "2. B"',
    text: `
      CLAVE DE RESPUESTAS:
      1. A
      2. B
      3. C
      4. D
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
      [4, 'D'],
    ]),
  },
  {
    name: 'Formato con paréntesis: "1) A", "2) B"',
    text: `
      RESPUESTAS CORRECTAS:
      1) A
      2) B
      3) C
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]),
  },
  {
    name: 'Formato con dos puntos: "1: A", "2: B"',
    text: `
      CLAVE:
      1: A
      2: B
      3: C
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]),
  },
  {
    name: 'Formato en línea: "1-A, 2-B, 3-C"',
    text: `
      RESPUESTAS: 1-A, 2-B, 3-C, 4-D, 5-A
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
      [4, 'D'],
      [5, 'A'],
    ]),
  },
  {
    name: 'Formato invertido: "A1", "B2"',
    text: `
      RESPUESTAS:
      A1
      B2
      C3
      D4
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
      [4, 'D'],
    ]),
  },
  {
    name: 'Formato con espacios: "1 A", "2 B"',
    text: `
      RESPUESTAS:
      1 A
      2 B
      3 C
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]),
  },
  {
    name: 'Texto largo con respuestas al final',
    text: `
      Este es un documento largo con mucho texto.
      Aquí hay más contenido...
      Y más contenido...
      
      RESPUESTAS:
      1-A
      2-B
      3-C
      4-D
      5-E
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
      [4, 'D'],
      [5, 'E'],
    ]),
  },
  {
    name: 'Sin sección de respuestas (buscar en último 30%)',
    text: `
      Contenido del documento...
      Más contenido...
      
      1-A
      2-B
      3-C
    `,
    expected: new Map([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]),
  },
]

// Ejecutar pruebas
console.log('🧪 Probando detectCorrectAnswers con diferentes formatos...\n')

let passed = 0
let failed = 0

for (const testCase of testCases) {
  const result = detectCorrectAnswers(testCase.text)
  
  // Comparar resultados
  const resultMap = new Map(result)
  const expectedMap = new Map(testCase.expected)
  
  let match = true
  const mismatches: string[] = []
  
  // Verificar que todas las respuestas esperadas estén presentes
  for (const [num, letter] of expectedMap) {
    if (!resultMap.has(num) || resultMap.get(num) !== letter) {
      match = false
      mismatches.push(`Pregunta ${num}: esperado ${letter}, obtenido ${resultMap.get(num) || 'ninguno'}`)
    }
  }
  
  // Verificar que no haya respuestas extra
  for (const [num, letter] of resultMap) {
    if (!expectedMap.has(num)) {
      match = false
      mismatches.push(`Pregunta ${num}: inesperada (${letter})`)
    }
  }
  
  if (match) {
    console.log(`✅ ${testCase.name}`)
    console.log(`   Detectadas: ${result.size} respuestas`)
    passed++
  } else {
    console.log(`❌ ${testCase.name}`)
    console.log(`   Esperadas: ${expectedMap.size}, Detectadas: ${result.size}`)
    console.log(`   Errores: ${mismatches.join(', ')}`)
    console.log(`   Resultado:`, Array.from(result.entries()))
    failed++
  }
  console.log()
}

console.log(`\n📊 Resumen: ${passed} pasaron, ${failed} fallaron`)

if (failed > 0) {
  process.exit(1)
}
