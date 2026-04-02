import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  personaId: z.string().min(1),
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    // Verificar que el caso existe
    const caso = await prisma.personaDesaparecida.findUnique({
      where: { id: data.personaId, validadoPorAdmin: true },
      select: { id: true, nombre: true },
    })
    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 })
    }

    // Guardar información
    await prisma.informacion.create({
      data: {
        personaId: data.personaId,
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        mensaje: data.mensaje,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error en /api/informacion:', error)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}
