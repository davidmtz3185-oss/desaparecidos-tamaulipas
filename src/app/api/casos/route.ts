import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarCaptcha } from '@/lib/captcha'
import { enviarNotificacionAdmin } from '@/lib/resend'
import { z } from 'zod'
import { EstadoCaso, Relacion } from '@prisma/client'

const schema = z.object({
  // Datos de la persona
  nombre: z.string().min(2, 'Nombre requerido (mínimo 2 caracteres)'),
  edad: z.coerce.number().int().min(0).max(120),
  esMenor: z.boolean(),
  sexo: z.enum(['MASCULINO', 'FEMENINO']),
  municipio: z.string().min(2),
  colonia: z.string().optional(),
  fechaDesaparicion: z.string().min(1, 'Fecha de desaparición requerida'),
  ultimaUbicacion: z.string().optional(),
  descripcionFisica: z.string().min(10, 'Descripción física requerida (mínimo 10 caracteres)').max(1000),

  // Datos del reportante
  reportanteNombre: z.string().min(2, 'Tu nombre es requerido'),
  reportanteRelacion: z.enum([
    'FAMILIAR_DIRECTO',
    'FAMILIAR_LEJANO',
    'AMIGO',
    'CONOCIDO',
    'AUTORIDAD',
    'OTRO',
  ]),
  reportanteTelefono: z.string().optional(),
  reportanteEmail: z.string().email('Email inválido').optional(),
  aceptaDatosPublicos: z.boolean(),

  // Foto
  fotoUrl: z.string().url('URL de foto inválida').optional(),
  fotoPublicId: z.string().optional(),

  // Captcha
  captchaToken: z.string().min(1, 'Verifica que no eres un robot'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    // Verificar captcha
    const captchaOk = await verificarCaptcha(data.captchaToken)
    if (!captchaOk) {
      return NextResponse.json({ error: 'Captcha inválido. Intenta de nuevo.' }, { status: 400 })
    }

    // Verificar al menos un contacto del reportante
    if (!data.reportanteTelefono && !data.reportanteEmail) {
      return NextResponse.json(
        { error: 'Proporciona al menos un medio de contacto (teléfono o email)' },
        { status: 400 }
      )
    }

    // Crear el caso
    const caso = await prisma.personaDesaparecida.create({
      data: {
        nombre: data.nombre,
        edad: data.edad,
        esMenor: data.esMenor,
        sexo: data.sexo as 'MASCULINO' | 'FEMENINO',
        municipio: data.municipio,
        colonia: data.colonia,
        fechaDesaparicion: new Date(data.fechaDesaparicion),
        ultimaUbicacion: data.ultimaUbicacion,
        descripcionFisica: data.descripcionFisica,
        estado: EstadoCaso.ACTIVO_PENDIENTE,
        validadoPorAdmin: false,
        reportantes: {
          create: {
            nombre: data.reportanteNombre,
            relacion: data.reportanteRelacion as Relacion,
            telefono: data.reportanteTelefono,
            email: data.reportanteEmail,
            aceptaDatosPublicos: data.aceptaDatosPublicos,
            esSecundario: false,
          },
        },
        ...(data.fotoUrl && data.fotoPublicId
          ? {
              fotos: {
                create: {
                  urlCloudinary: data.fotoUrl,
                  publicId: data.fotoPublicId,
                  esPrincipal: true,
                },
              },
            }
          : {}),
      },
      select: { id: true },
    })

    // Notificar al admin (sin bloquear la respuesta)
    enviarNotificacionAdmin({
      nombre: data.nombre,
      municipio: data.municipio,
      casoId: caso.id,
    }).catch(err => console.error('Error enviando email admin:', err))

    return NextResponse.json({ ok: true, id: caso.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Error en /api/casos:', error)
    return NextResponse.json({ error: 'Error al guardar el reporte' }, { status: 500 })
  }
}
