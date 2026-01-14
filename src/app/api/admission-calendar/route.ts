import { NextResponse } from 'next/server'
import {
  obtenerEventosCalendario,
  obtenerProximosEventos,
  obtenerEventosImportantes,
  obtenerProximoEventoImportante,
} from '@/lib/admission-calendar'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const proceso = searchParams.get('proceso') || '2026'
    const tipo = searchParams.get('tipo') // 'proximos', 'importantes', 'proximo'
    const limite = searchParams.get('limite')

    let eventos

    switch (tipo) {
      case 'proximos': {
        const limiteNum = limite ? parseInt(limite, 10) : 5
        if (isNaN(limiteNum) || limiteNum < 1) {
          return NextResponse.json(
            { error: 'El límite debe ser un número válido mayor a 0' },
            { status: 400 }
          )
        }
        eventos = await obtenerProximosEventos(proceso, limiteNum)
        break
      }
      case 'importantes':
        eventos = await obtenerEventosImportantes(proceso)
        break
      case 'proximo': {
        const proximo = await obtenerProximoEventoImportante(proceso)
        return NextResponse.json({ evento: proximo })
      }
      default:
        eventos = await obtenerEventosCalendario(proceso)
    }

    return NextResponse.json({ eventos })
  } catch (error) {
    console.error('Error al obtener calendario:', error)
    return NextResponse.json(
      { error: 'Error al obtener calendario' },
      { status: 500 }
    )
  }
}

