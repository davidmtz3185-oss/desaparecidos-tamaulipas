import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)

    await prisma.suscriptorAlerta.updateMany({
      where: { email },
      data: { activo: false },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Error en /api/desuscribirse:', error)
    return NextResponse.json({ error: 'Error al procesar' }, { status: 500 })
  }
}
