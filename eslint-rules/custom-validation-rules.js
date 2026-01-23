/**
 * ESLint Custom Rules para Detectar Problemas de Validación
 * 
 * Estas reglas detectan automáticamente patrones problemáticos comunes
 * y sugieren usar las funciones centralizadas de validation-utils.ts
 */

module.exports = {
  'no-unsafe-math-round': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Prohibir Math.round sin validación previa de que el argumento sea finito',
        category: 'Possible Errors',
        recommended: true,
      },
      fixable: null,
      schema: [],
      messages: {
        unsafeMathRound: 'Math.round() debe validar que el argumento sea finito. Use safeRound() de @/app/api/notes/versions/validation-utils',
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'Math' &&
            node.callee.property.name === 'round'
          ) {
            // Verificar si hay validación Number.isFinite antes
            const hasValidation = checkForFiniteValidation(context, node)
            if (!hasValidation) {
              context.report({
                node,
                messageId: 'unsafeMathRound',
              })
            }
          }
        },
      }
    },
  },

  'no-unsafe-array-length-division': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Prohibir división por array.length sin validar que length > 0',
        category: 'Possible Errors',
        recommended: true,
      },
      fixable: null,
      schema: [],
      messages: {
        unsafeDivision: 'División por array.length debe validar que length > 0. Use safeAverage() de @/app/api/notes/versions/validation-utils',
      },
    },
    create(context) {
      return {
        BinaryExpression(node) {
          if (node.operator === '/') {
            const right = node.right
            if (
              right.type === 'MemberExpression' &&
              right.property.name === 'length'
            ) {
              // Verificar si hay validación de length > 0
              const hasValidation = checkForLengthValidation(context, node)
              if (!hasValidation) {
                context.report({
                  node,
                  messageId: 'unsafeDivision',
                })
              }
            }
          }
        },
      }
    },
  },

  'no-unsafe-spread-math': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Prohibir Math.max/min con spread operator sin validación',
        category: 'Possible Errors',
        recommended: true,
      },
      fixable: null,
      schema: [],
      messages: {
        unsafeSpread: 'Math.max/min con spread operator debe validar el array. Use safeMathMax() o safeMathMin() de @/app/api/notes/versions/validation-utils',
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'Math' &&
            (node.callee.property.name === 'max' || node.callee.property.name === 'min')
          ) {
            // Verificar si usa spread operator
            const hasSpread = node.arguments.some(
              arg => arg.type === 'SpreadElement'
            )
            if (hasSpread) {
              // Verificar si hay validación del array
              const hasValidation = checkForArrayValidation(context, node)
              if (!hasValidation) {
                context.report({
                  node,
                  messageId: 'unsafeSpread',
                })
              }
            }
          }
        },
      }
    },
  },

  'no-unsafe-toisostring': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Prohibir toISOString() sin validar que la fecha sea válida',
        category: 'Possible Errors',
        recommended: true,
      },
      fixable: null,
      schema: [],
      messages: {
        unsafeToISOString: 'toISOString() debe validar que la fecha sea válida. Use safeToISOString() de @/app/api/notes/versions/validation-utils',
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === 'MemberExpression' &&
            node.callee.property.name === 'toISOString'
          ) {
            // Verificar si hay validación de fecha
            const hasValidation = checkForDateValidation(context, node)
            if (!hasValidation) {
              context.report({
                node,
                messageId: 'unsafeToISOString',
              })
            }
          }
        },
      }
    },
  },
}

/**
 * Helper: Verificar si hay validación Number.isFinite antes de Math.round
 */
function checkForFiniteValidation(context, node) {
  const sourceCode = context.getSourceCode()
  const text = sourceCode.getText()
  const nodeText = sourceCode.getText(node)
  const nodeIndex = text.indexOf(nodeText)
  
  // Buscar en las 10 líneas anteriores
  const linesBefore = text.substring(Math.max(0, nodeIndex - 1000), nodeIndex)
  
  // Verificar si hay validación Number.isFinite
  if (linesBefore.includes('Number.isFinite')) {
    return true
  }
  
  // Verificar si ya usa safeRound
  if (text.includes('safeRound')) {
    return true
  }
  
  return false
}

/**
 * Helper: Verificar si hay validación de array.length > 0
 */
function checkForLengthValidation(context, node) {
  const sourceCode = context.getSourceCode()
  const text = sourceCode.getText()
  const nodeText = sourceCode.getText(node)
  const nodeIndex = text.indexOf(nodeText)
  
  // Buscar en el contexto cercano
  const contextBefore = text.substring(Math.max(0, nodeIndex - 500), nodeIndex)
  
  // Verificar si hay validación de length > 0
  if (contextBefore.match(/\.length\s*>\s*0/)) {
    return true
  }
  
  // Verificar si ya usa safeAverage
  if (text.includes('safeAverage')) {
    return true
  }
  
  return false
}

/**
 * Helper: Verificar si hay validación del array antes de spread
 */
function checkForArrayValidation(context, node) {
  const sourceCode = context.getSourceCode()
  const text = sourceCode.getText()
  const nodeText = sourceCode.getText(node)
  const nodeIndex = text.indexOf(nodeText)
  
  // Buscar en el contexto cercano
  const contextBefore = text.substring(Math.max(0, nodeIndex - 500), nodeIndex)
  
  // Verificar si hay validación Array.isArray
  if (contextBefore.includes('Array.isArray')) {
    return true
  }
  
  // Verificar si ya usa safeMathMax o safeMathMin
  if (text.includes('safeMathMax') || text.includes('safeMathMin')) {
    return true
  }
  
  return false
}

/**
 * Helper: Verificar si hay validación de fecha antes de toISOString
 */
function checkForDateValidation(context, node) {
  const sourceCode = context.getSourceCode()
  const text = sourceCode.getText()
  const nodeText = sourceCode.getText(node)
  const nodeIndex = text.indexOf(nodeText)
  
  // Buscar en el contexto cercano
  const contextBefore = text.substring(Math.max(0, nodeIndex - 500), nodeIndex)
  
  // Verificar si hay validación instanceof Date
  if (contextBefore.includes('instanceof Date')) {
    return true
  }
  
  // Verificar si ya usa safeToISOString
  if (text.includes('safeToISOString')) {
    return true
  }
  
  return false
}

