import { NextResponse } from 'next/server'
import {
  transformarNEM,
  transformarPSUaPAES,
  transformarPDTaPAES,
  obtenerTransformaciones,
} from '@/lib/score-transformation'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const proceso = searchParams.get('proceso')
    const valor = searchParams.get('valor')
    const prueba = searchParams.get('prueba')
    const listar = searchParams.get('listar') === 'true'

    // Si se solicita listar transformaciones
    if (listar) {
      const transformaciones = await obtenerTransformaciones(
        tipo as any,
        proceso || undefined
      )
      return NextResponse.json({ transformaciones })
    }

    // Si se solicita transformar un valor
    if (valor && tipo) {
      const valorNum = parseFloat(valor)
      if (isNaN(valorNum)) {
        return NextResponse.json(
          { error: 'El valor debe ser un número válido' },
          { status: 400 }
        )
      }

      let resultado: number | null = null

      switch (tipo) {
        case 'NEM':
          resultado = await transformarNEM(valorNum, proceso || undefined)
          break
        case 'PSU_TO_PAES':
          if (!prueba) {
            return NextResponse.json(
              { error: 'Debe especificar la prueba para transformar PSU a PAES' },
              { status: 400 }
            )
          }
          resultado = await transformarPSUaPAES(
            valorNum,
            prueba,
            proceso || undefined
          )
          break
        case 'PDT_TO_PAES':
          if (!prueba) {
            return NextResponse.json(
              { error: 'Debe especificar la prueba para transformar PDT a PAES' },
              { status: 400 }
            )
          }
          resultado = await transformarPDTaPAES(
            valorNum,
            prueba,
            proceso || undefined
          )
          break
        default:
          return NextResponse.json(
            { error: 'Tipo de transformación no válido' },
            { status: 400 }
          )
      }

      return NextResponse.json({
        valorOrigen: valorNum,
        valorDestino: resultado,
        tipo,
        prueba: prueba || undefined,
        proceso: proceso || undefined,
      })
    }

    return NextResponse.json(
      { error: 'Debe especificar un valor y tipo o solicitar listar' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error al transformar puntaje:', error)
    return NextResponse.json(
      { error: 'Error al transformar puntaje' },
      { status: 500 }
    )
  }
}

