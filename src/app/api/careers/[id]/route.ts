import { NextRequest, NextResponse } from 'next/server'
import { obtenerCarrera, calcularPuntajeParaCarrera } from '@/lib/score-calculator'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const carrera = await obtenerCarrera(id)

    if (!carrera) {
      return NextResponse.json(
        { error: 'Carrera no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ carrera })
  } catch (error) {
    console.error('Error al obtener carrera:', error)
    return NextResponse.json(
      { error: 'Error al obtener carrera' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { nem, ranking, puntajesPAES } = body

    if (!nem || !ranking || !puntajesPAES) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const nemNum = parseFloat(nem)
    const rankingNum = parseFloat(ranking)

    if (isNaN(nemNum) || isNaN(rankingNum)) {
      return NextResponse.json(
        { error: 'NEM y ranking deben ser números válidos' },
        { status: 400 }
      )
    }

    const puntajePonderado = await calcularPuntajeParaCarrera(id, {
      nem: nemNum,
      ranking: rankingNum,
      puntajesPAES,
    })

    return NextResponse.json({ puntajePonderado })
  } catch (error) {
    console.error('Error al calcular puntaje:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al calcular puntaje' },
      { status: 500 }
    )
  }
}

