#!/usr/bin/env node
/**
 * Script wrapper para npm que verifica el directorio del proyecto antes de ejecutar
 * Uso: node scripts/npm-wrapper.js run dev
 *      node scripts/npm-wrapper.js install
 *      node scripts/npm-wrapper.js test
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * Encuentra el directorio raíz del proyecto buscando package.json hacia arriba
 */
function findProjectRoot() {
  let currentDir = __dirname
  const maxDepth = 10
  let depth = 0

  while (depth < maxDepth) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      return currentDir
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      break
    }
    currentDir = parentDir
    depth++
  }

  // Fallback: intentar con la ruta conocida del proyecto
  const knownProjectPath = 'C:\\Users\\arang\\OneDrive\\Escritorio\\PROY. PAES\\paes-tutor\\paes-tutor'
  if (fs.existsSync(path.join(knownProjectPath, 'package.json'))) {
    return knownProjectPath
  }

  throw new Error(
    `No se pudo encontrar package.json.\n` +
    `  Buscado desde: ${__dirname}\n` +
    `  Directorio actual: ${process.cwd()}\n` +
    `  Por favor, ejecuta este script desde el directorio del proyecto o usando: npm run <comando>`
  )
}

// Obtener argumentos de npm (todo después del nombre del script)
const npmArgs = process.argv.slice(2)

if (npmArgs.length === 0) {
  console.log('📦 Uso: node scripts/npm-wrapper.js <comando-npm> [argumentos]')
  console.log('   Ejemplo: node scripts/npm-wrapper.js run dev')
  console.log('   Ejemplo: node scripts/npm-wrapper.js install')
  process.exit(0)
}

try {
  // Encontrar el directorio del proyecto
  const projectRoot = findProjectRoot()
  
  // Cambiar al directorio del proyecto
  process.chdir(projectRoot)
  
  // Verificar que package.json existe
  if (!fs.existsSync('package.json')) {
    console.error(`❌ Error: package.json no encontrado en: ${projectRoot}`)
    process.exit(1)
  }
  
  console.log(`✅ Ejecutando desde: ${projectRoot}`)
  console.log(`📦 Ejecutando: npm ${npmArgs.join(' ')}`)
  console.log('')
  
  // Encontrar el ejecutable real de npm (no alias o funciones)
  // Esto evita bucles infinitos si hay un alias de npm configurado
  function findNpmExecutable() {
    if (process.platform === 'win32') {
      // En Windows, buscar npm.cmd primero (ejecutable real)
      try {
        const output = execSync('where npm.cmd', { 
          stdio: 'pipe', 
          encoding: 'utf8',
          cwd: projectRoot 
        }).trim()
        // where puede devolver múltiples rutas, tomar la primera
        const npmPath = output.split('\n')[0].trim()
        if (npmPath && fs.existsSync(npmPath)) {
          // Devolver la ruta entre comillas si tiene espacios
          return npmPath.includes(' ') ? `"${npmPath}"` : npmPath
        }
      } catch {
        // Continuar con el siguiente método
      }
      // Fallback: usar npm.cmd directamente (debería estar en PATH)
      return 'npm.cmd'
    } else {
      // En Unix/Linux/Mac, usar which para encontrar el ejecutable real
      try {
        const npmPath = execSync('which npm', { 
          stdio: 'pipe', 
          encoding: 'utf8',
          cwd: projectRoot 
        }).trim()
        if (npmPath && fs.existsSync(npmPath)) {
          return npmPath
        }
      } catch {
        // Continuar con el siguiente método
      }
      // Fallback: usar npm directamente (debería estar en PATH)
      return 'npm'
    }
  }
  
  const npmExe = findNpmExecutable()
  
  // Ejecutar npm con los argumentos proporcionados usando el ejecutable real
  // El shell manejará correctamente las rutas con espacios
  const command = `${npmExe} ${npmArgs.join(' ')}`
  
  execSync(command, {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: true, // Usar shell para que funcione en todos los sistemas y maneje rutas con espacios
  })
} catch (error) {
  if (error.status !== undefined) {
    // Error de ejecución de npm
    process.exit(error.status)
  } else {
    // Error de búsqueda del proyecto
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

