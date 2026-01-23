/**
 * Script para generar iconos de PWA
 * 
 * Este script genera iconos placeholder básicos.
 * Para producción, reemplaza estos con iconos diseñados profesionalmente.
 * 
 * Uso: node scripts/generate-pwa-icons.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

// Crear un SVG simple como icono base
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" 
        font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">PAES</text>
</svg>`
}

// Convertir SVG a PNG usando Canvas (requiere canvas package)
// Por ahora, solo creamos el SVG y documentamos cómo generar PNGs

const publicDir = path.join(__dirname, '..', 'public')

// Crear SVGs como placeholder
const sizes = [192, 512]

sizes.forEach((size) => {
  const svgPath = path.join(publicDir, `icon-${size}x${size}.svg`)
  fs.writeFileSync(svgPath, createIconSVG(size))
  console.log(`✅ Creado: icon-${size}x${size}.svg`)
})

console.log('\n📝 Nota: Estos son iconos placeholder.')
console.log('Para producción, reemplaza con iconos PNG reales:')
console.log('  - icon-192x192.png')
console.log('  - icon-512x512.png')
console.log('\nPuedes usar herramientas como:')
console.log('  - https://realfavicongenerator.net/')
console.log('  - https://www.pwabuilder.com/imageGenerator')
console.log('  - Figma/Photoshop para diseñar iconos personalizados')

