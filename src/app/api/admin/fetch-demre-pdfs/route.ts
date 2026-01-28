import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { isAdmin } from '@/lib/check-admin'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import * as cheerio from 'cheerio'
import axios from 'axios'
import https from 'https'
import http from 'http'

export const runtime = 'nodejs'

interface PDFLink {
  url: string
  title: string
  subject?: string
  year?: string
}

/**
 * Obtiene el contenido HTML de una URL usando axios con configuración muy permisiva
 * Intenta manejar headers mal formateados del servidor de DEMRE
 */
async function fetchHTML(url: string): Promise<string> {
  try {
    // Usar axios con configuración muy permisiva para manejar headers mal formateados
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: status => status >= 200 && status < 400,
      // Usar arraybuffer y convertir manualmente para evitar problemas de encoding
      responseType: 'arraybuffer',
      // Configurar para ser más tolerante con errores
      transformResponse: [data => data], // No transformar, manejar manualmente
    })

    // Convertir el buffer a string
    const buffer = Buffer.from(response.data)
    let html: string

    // Intentar diferentes encodings
    try {
      html = buffer.toString('utf-8')
    } catch {
      try {
        html = buffer.toString('latin1')
      } catch {
        html = buffer.toString('binary')
      }
    }

    if (!html || html.length === 0) {
      throw new Error('No se recibieron datos de la página')
    }

    return html
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Si axios falla por parsing de headers, intentar con método alternativo
      if (error.message.includes('Parse Error') || error.message.includes('CR after header')) {
        logger.warn(
          {
            type: 'fetch_html_fallback',
            url,
            error: error.message,
            reason: 'headers_mal_formateados',
          },
          'Axios falló por headers mal formateados, intentando método alternativo...'
        )
        return fetchHTMLAlternative(url)
      }

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('La petición tardó demasiado')
      }

      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('No se pudo conectar al servidor')
      }

      if (error.response) {
        throw new Error(`Error HTTP ${error.response.status}: ${error.response.statusText}`)
      }

      throw new Error(`Error de red: ${error.message}`)
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Error desconocido al obtener la página')
  }
}

/**
 * Método alternativo usando módulos nativos con manejo de errores más permisivo
 */
async function fetchHTMLAlternative(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const protocol = urlObj.protocol === 'https:' ? https : http

    const portNum = urlObj.port ? parseInt(urlObj.port, 10) : null
    const safePort = portNum && !isNaN(portNum) && portNum > 0 && portNum <= 65535
      ? portNum
      : urlObj.protocol === 'https:' ? 443 : 80

    const options: https.RequestOptions = {
      hostname: urlObj.hostname,
      port: safePort,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      timeout: 20000,
      // Deshabilitar validación estricta de certificados (solo para desarrollo)
      rejectUnauthorized: false,
    }

    let responseData = Buffer.alloc(0)
    let headersReceived = false

    const req = protocol.request(options, (res: http.IncomingMessage) => {
      headersReceived = true

      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`Error HTTP: ${res.statusCode || 'unknown'}`))
        return
      }

      res.on('data', (chunk: Buffer) => {
        responseData = Buffer.concat([responseData, chunk])
      })

      res.on('end', () => {
        try {
          let html: string
          try {
            html = responseData.toString('utf-8')
          } catch {
            html = responseData.toString('latin1')
          }

          if (!html || html.length === 0) {
            reject(new Error('No se recibieron datos de la página'))
            return
          }
          resolve(html)
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Error al procesar respuesta'))
        }
      })
    })

    req.on('error', (error: Error) => {
      // Si el error es de parsing pero ya recibimos headers, intentar usar los datos
      if (
        headersReceived &&
        (error.message.includes('Parse Error') || error.message.includes('CR after header'))
      ) {
        if (responseData.length > 0) {
          try {
            const html = responseData.toString('utf-8') || responseData.toString('latin1')
            if (html && html.length > 0) {
              resolve(html)
              return
            }
          } catch {
            // Si falla, rechazar con el error original
          }
        }
      }
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('La petición tardó demasiado'))
    })

    req.end()
  })
}

/**
 * Extrae enlaces a PDFs desde una página de DEMRE
 */
async function extractPDFLinksFromPage(url: string): Promise<PDFLink[]> {
  try {
    // Usar módulos nativos de Node.js para mayor tolerancia con headers mal formateados
    const html = await fetchHTML(url)
    const $ = cheerio.load(html)
    const pdfLinks: PDFLink[] = []

    // Buscar todos los enlaces que apuntan a PDFs
    $('a[href$=".pdf"], a[href*=".pdf"]').each((_, element) => {
      const href = $(element).attr('href')
      const text = $(element).text().trim() || $(element).attr('title') || ''

      if (href) {
        // Convertir URL relativa a absoluta si es necesario
        let absoluteUrl: string
        try {
          absoluteUrl = href.startsWith('http') ? href : new URL(href, url).toString()
        } catch {
          // Si falla la conversión, usar la URL original
          absoluteUrl = href
        }

        // Intentar extraer información del texto del enlace
        let title = text
        if (!title || title.length === 0) {
          try {
            const splitResult = typeof href === 'string' ? href.split('/') : []
            if (Array.isArray(splitResult) && splitResult.length > 0) {
              const lastElement = splitResult[splitResult.length - 1]
              if (typeof lastElement === 'string' && lastElement.length > 0) {
                title = lastElement
              } else {
                title = 'PDF'
              }
            } else {
              title = 'PDF'
            }
          } catch {
            title = 'PDF'
          }
        }
        if (!title || title.length === 0) {
          title = 'PDF'
        }

        pdfLinks.push({
          url: absoluteUrl,
          title,
          subject: extractSubjectFromText(title),
          year: extractYearFromText(title),
        })
      }
    })

    return pdfLinks
  } catch (error) {
    // Mejorar mensajes de error
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('tardó demasiado')) {
        throw new Error(
          'La petición tardó demasiado. Verifica tu conexión a internet o intenta más tarde.'
        )
      }
      if (
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('No se pudo conectar')
      ) {
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.')
      }
      if (error.message.includes('Error HTTP')) {
        throw new Error(`Error al acceder a la página: ${error.message}`)
      }
      throw new Error(`Error al obtener PDFs: ${error.message}`)
    }
    throw new Error('Error desconocido al obtener PDFs')
  }
}

/**
 * Intenta extraer el nombre de la asignatura del texto
 */
function extractSubjectFromText(text: string): string | undefined {
  const safeText = typeof text === 'string' ? text : ''
  if (!safeText) {
    return undefined
  }

  let textLower = ''
  try {
    textLower = safeText.toLowerCase()
    if (typeof textLower !== 'string') {
      textLower = safeText // Fallback
    }
  } catch {
    textLower = safeText // Fallback
  }

  const subjectPatterns: Record<string, string> = {
    lector: 'Competencia Lectora',
    lectora: 'Competencia Lectora',
    'matemática m1': 'Matemática M1',
    'matemática 1': 'Matemática M1',
    m1: 'Matemática M1',
    'matemática m2': 'Matemática M2',
    'matemática 2': 'Matemática M2',
    m2: 'Matemática M2',
    biología: 'Ciencias - Biología',
    biologia: 'Ciencias - Biología',
    física: 'Ciencias - Física',
    fisica: 'Ciencias - Física',
    química: 'Ciencias - Química',
    quimica: 'Ciencias - Química',
    historia: 'Historia y Ciencias Sociales',
  }

  if (typeof textLower === 'string' && textLower.length > 0) {
    for (const [pattern, subject] of Object.entries(subjectPatterns)) {
      if (typeof pattern === 'string' && pattern.length > 0) {
        try {
          if (textLower.includes(pattern)) {
            return typeof subject === 'string' ? subject : undefined
          }
        } catch {
          // Continuar con el siguiente patrón
        }
      }
    }
  }

  return undefined
}

/**
 * Intenta extraer el año del texto
 */
function extractYearFromText(text: string): string | undefined {
  if (!text || typeof text !== 'string') {
    return undefined
  }
  try {
    const yearMatch = text.match(/\b(20\d{2})\b/)
    if (yearMatch && Array.isArray(yearMatch) && yearMatch.length > 1 && typeof yearMatch[1] === 'string') {
      return yearMatch[1]
    }
  } catch {
    // Ignorar error de match
  }
  return undefined
}

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      let url: string | undefined
      try {
        // Verificar autenticación
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verificar que el usuario sea admin
        const userIsAdmin = await isAdmin()
        if (!userIsAdmin) {
          logger.warn(
            { userId: user.id, email: user.email },
            'Intento de obtener PDFs DEMRE sin permisos de admin'
          )
          return NextResponse.json(
            { error: 'No tienes permisos para esta operación. Se requieren permisos de administrador.' },
            { status: 403 }
          )
        }

        const body = await request.json()
        url = body.url

        if (!url || typeof url !== 'string') {
          return NextResponse.json({ error: 'URL requerida' }, { status: 400 })
        }

        // Validar que sea una URL válida y de DEMRE
        let urlObj: URL
        try {
          urlObj = new URL(url)
        } catch {
          return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
        }

        // Validar que el hostname sea de DEMRE (prevenir SSRF)
        // CORRECCIÓN: Validar que urlObj.hostname sea un string válido antes de usar toLowerCase()
        const safeHostname = typeof urlObj.hostname === 'string' ? urlObj.hostname : ''
        if (!safeHostname || safeHostname.length === 0) {
          return NextResponse.json({ error: 'Hostname inválido' }, { status: 400 })
        }
        let hostname = ''
        try {
          hostname = safeHostname.toLowerCase()
          if (typeof hostname !== 'string') {
            hostname = safeHostname // Fallback
          }
        } catch {
          hostname = safeHostname // Fallback
        }
        // CORRECCIÓN: Validar que hostname sea un string válido antes de usar endsWith()
        if (typeof hostname === 'string' && hostname !== 'demre.cl' && !hostname.endsWith('.demre.cl')) {
          return NextResponse.json(
            { error: 'La URL debe ser del sitio oficial de DEMRE (demre.cl)' },
            { status: 400 }
          )
        }

        // Solo permitir HTTP y HTTPS
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
          return NextResponse.json({ error: 'Solo se permiten URLs HTTP/HTTPS' }, { status: 400 })
        }

        // Extraer enlaces a PDFs
        const pdfLinks = await extractPDFLinksFromPage(url)

        return NextResponse.json({
          success: true,
          pdfs: pdfLinks,
          count: pdfLinks.length,
        })
      } catch (error) {
        // Log del error para debugging
        logger.error(
          {
            type: 'fetch_demre_pdfs_error',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            url: url || 'unknown',
          },
          'Error en fetch-demre-pdfs'
        )

        // Proporcionar mensaje de error más detallado
        let errorMessage = 'Error desconocido'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'string') {
          errorMessage = error
        }

        return NextResponse.json(
          {
            error: 'Error al obtener PDFs',
            details: errorMessage,
          },
          { status: 500 }
        )
      }
    },
    'read'
  )
}
