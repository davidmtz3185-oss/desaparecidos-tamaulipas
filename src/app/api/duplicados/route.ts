import { NextRequest, NextResponse } from 'next/server'
import { buscarDuplicados } from '@/lib/duplicados'
import { z } from 'zod'

const schema = z.object({
  nombre: z.string().min(2),
  municipio: z.string().min(2),
  edad: z.coerce.number().int().min(0).max(120),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, municipio, edad } = schema.parse(body)

    const candidatos = await buscarDuplicados(nombre, municipio, edad)

    return NextResponse.json({ candidatos })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Error en /api/duplicados:', error)
    return NextResponse.json({ error: 'Error al buscar duplicados' }, { status: 500 })
  }
}
