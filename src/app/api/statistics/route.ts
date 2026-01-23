import { NextResponse } from 'next/server'
import {
  obtenerEstadisticasOficiales,
  compararConEstadisticas,
  obtenerTodasEstadisticas,
} from '@/lib/official-statistics'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const prueba = searchParams.get('prueba')
    const proceso = searchParams.get('proceso') || '2026'
    const tipoAplicacion = searchParams.get('tipoAplicacion')
    const puntaje = searchParams.get('puntaje')
    const todas = searchParams.get('todas') === 'true'

    // Si se solicita comparación con un puntaje
    if (puntaje && prueba) {
      const puntajeNum = parseFloat(puntaje)
      if (isNaN(puntajeNum)) {
        return NextResponse.json(
          { error: 'Puntaje inválido' },
          { status: 400 }
        )
      }
      const comparacion = await compararConEstadisticas(
        puntajeNum,
        prueba,
        proceso,
        tipoAplicacion || undefined
      )
      return NextResponse.json({ comparacion })
    }

    // Si se solicitan todas las estadísticas
    if (todas) {
      const estadisticas = await obtenerTodasEstadisticas(proceso)
      return NextResponse.json({ estadisticas })
    }

    // Si se solicita una prueba específica
    if (prueba) {
      const estadisticas = await obtenerEstadisticasOficiales(
        prueba,
        proceso,
        tipoAplicacion || undefined
      )
      return NextResponse.json({ estadisticas })
    }

    return NextResponse.json(
      { error: 'Debe especificar una prueba o solicitar todas' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}

