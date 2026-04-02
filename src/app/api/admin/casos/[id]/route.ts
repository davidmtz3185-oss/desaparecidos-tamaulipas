import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enviarAlertaSuscriptor, enviarConfirmacionAprobacion } from '@/lib/resend'
import { EstadoCaso } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { accion, motivo } = await request.json()

    const caso = await prisma.personaDesaparecida.findUnique({
      where: { id: params.id },
      include: {
        reportantes: { where: { esSecundario: false }, take: 1 },
      },
    })
    if (!caso) return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 })

    switch (accion) {
      case 'aprobar': {
        await prisma.personaDesaparecida.update({
          where: { id: params.id },
          data: { estado: EstadoCaso.ACTIVO, validadoPorAdmin: true },
        })

        // Registrar en log
        await prisma.adminLog.create({
          data: {
            accion: 'APROBAR_CASO',
            descripcion: `Caso aprobado: ${caso.nombre}`,
            adminId: (session.user as any).id,
            personaId: params.id,
          },
        })

        // Notificar al reportante si tiene email
        const reportante = caso.reportantes[0]
        if (reportante?.email) {
          enviarConfirmacionAprobacion({
            email: reportante.email,
            nombreReportante: reportante.nombre,
            nombreDesaparecido: caso.nombre,
            casoId: caso.id,
          }).catch(e => console.error('Email confirmación:', e))
        }

        // Enviar alertas a suscriptores del municipio
        const suscriptores = await prisma.suscriptorAlerta.findMany({
          where: { municipio: caso.municipio, activo: true },
          select: { email: true },
        })

        for (const s of suscriptores) {
          enviarAlertaSuscriptor({
            email: s.email,
            nombre: caso.nombre,
            municipio: caso.municipio,
            casoId: caso.id,
            edad: caso.edad,
            sexo: caso.sexo,
            fechaDesaparicion: caso.fechaDesaparicion.toISOString(),
          }).catch(e => console.error('Email alerta:', e))
        }

        break
      }

      case 'rechazar': {
        await prisma.personaDesaparecida.update({
          where: { id: params.id },
          data: { estado: EstadoCaso.RECHAZADO, validadoPorAdmin: false },
        })

        await prisma.adminLog.create({
          data: {
            accion: 'RECHAZAR_CASO',
            descripcion: `Caso rechazado: ${caso.nombre}${motivo ? ` — ${motivo}` : ''}`,
            adminId: (session.user as any).id,
            personaId: params.id,
          },
        })
        break
      }

      case 'localizado_vivo': {
        await prisma.personaDesaparecida.update({
          where: { id: params.id },
          data: { estado: EstadoCaso.LOCALIZADO_VIVO },
        })
        await prisma.adminLog.create({
          data: {
            accion: 'MARCAR_LOCALIZADO',
            descripcion: `Marcado como localizado con vida: ${caso.nombre}`,
            adminId: (session.user as any).id,
            personaId: params.id,
          },
        })
        break
      }

      case 'localizado_fallecido': {
        await prisma.personaDesaparecida.update({
          where: { id: params.id },
          data: { estado: EstadoCaso.LOCALIZADO_FALLECIDO },
        })
        await prisma.adminLog.create({
          data: {
            accion: 'MARCAR_LOCALIZADO',
            descripcion: `Marcado como localizado sin vida: ${caso.nombre}`,
            adminId: (session.user as any).id,
            personaId: params.id,
          },
        })
        break
      }

      case 'archivar': {
        await prisma.personaDesaparecida.update({
          where: { id: params.id },
          data: { estado: EstadoCaso.ARCHIVADO },
        })
        await prisma.adminLog.create({
          data: {
            accion: 'ARCHIVAR_CASO',
            descripcion: `Caso archivado: ${caso.nombre}`,
            adminId: (session.user as any).id,
            personaId: params.id,
          },
        })
        break
      }

      case 'reactivar': {
        await prisma.personaDesaparecida.update({
          where: { id: params.id },
          data: { estado: EstadoCaso.ACTIVO, validadoPorAdmin: true },
        })
        await prisma.adminLog.create({
          data: {
            accion: 'REACTIVAR_CASO',
            descripcion: `Caso reactivado: ${caso.nombre}`,
            adminId: (session.user as any).id,
            personaId: params.id,
          },
        })
        break
      }

      default:
        return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en /api/admin/casos/[id]:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
