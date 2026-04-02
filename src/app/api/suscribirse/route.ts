import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  municipio: z.string().min(2, 'Municipio requerido'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, municipio } = schema.parse(body)

    // Upsert: si ya existe lo reactiva con el nuevo municipio
    await prisma.suscriptorAlerta.upsert({
      where: { email },
      update: { municipio, activo: true },
      create: { email, municipio, activo: true },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Error en /api/suscribirse:', error)
    return NextResponse.json({ error: 'Error al procesar la suscripción' }, { status: 500 })
  }
}
