import { NextResponse } from 'next/server'
import { obtenerCarreras, buscarCarrerasAdecuadas } from '@/lib/score-calculator'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const proceso = searchParams.get('proceso') || '2026'
    const nem = searchParams.get('nem')
    const ranking = searchParams.get('ranking')
    const lectora = searchParams.get('lectora')
    const m1 = searchParams.get('m1')
    const m2 = searchParams.get('m2')
    const ciencias = searchParams.get('ciencias')
    const historia = searchParams.get('historia')
    const puntajeMinimo = searchParams.get('puntajeMinimo')

    // Si hay datos del estudiante, buscar carreras adecuadas
    if (nem && ranking && lectora && m1) {
      const parseFloatSafe = (value: string | null): number | undefined => {
        if (!value) return undefined
        const parsed = parseFloat(value)
        return isNaN(parsed) ? undefined : parsed
      }

      const datosEstudiante = {
        nem: (() => {
          const parsed = parseFloat(nem)
          return isNaN(parsed) ? 0 : parsed
        })(),
        ranking: (() => {
          const parsed = parseFloat(ranking)
          return isNaN(parsed) ? 0 : parsed
        })(),
        puntajesPAES: {
          lectora: parseFloatSafe(lectora),
          m1: parseFloatSafe(m1),
          m2: parseFloatSafe(m2),
          ciencias: parseFloatSafe(ciencias),
          historia: parseFloatSafe(historia),
        },
      }

      const carreras = await buscarCarrerasAdecuadas(
        datosEstudiante,
        proceso,
        parseFloatSafe(puntajeMinimo)
      )

      return NextResponse.json({ carreras })
    }

    // Si no hay datos, retornar todas las carreras
    const carreras = await obtenerCarreras(proceso)
    return NextResponse.json({ carreras })
  } catch (error) {
    console.error('Error al obtener carreras:', error)
    return NextResponse.json(
      { error: 'Error al obtener carreras' },
      { status: 500 }
    )
  }
}

