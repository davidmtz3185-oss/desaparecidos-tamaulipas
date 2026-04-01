import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EstadoCaso, Sexo } from '@prisma/client'

const RESULTADOS_POR_PAGINA = 12

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const nombre = searchParams.get('nombre') || ''
  const municipio = searchParams.get('municipio') || ''
  const sexo = searchParams.get('sexo') as Sexo | null
  const edadMin = searchParams.get('edadMin') ? parseInt(searchParams.get('edadMin')!) : null
  const edadMax = searchParams.get('edadMax') ? parseInt(searchParams.get('edadMax')!) : null
  const fechaDesde = searchParams.get('fechaDesde') || ''
  const fechaHasta = searchParams.get('fechaHasta') || ''
  const estado = searchParams.get('estado') as EstadoCaso | null
  const esMenor = searchParams.get('esMenor')
  const cursor = searchParams.get('cursor') || ''

  try {
    const where: Record<string, unknown> = {
      // Solo mostrar casos aprobados al público
      estado: estado
        ? estado
        : { in: [EstadoCaso.ACTIVO, EstadoCaso.LOCALIZADO_VIVO, EstadoCaso.LOCALIZADO_FALLECIDO] },
      validadoPorAdmin: true,
    }

    if (nombre) {
      where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    if (municipio) {
      where.municipio = { contains: municipio, mode: 'insensitive' }
    }

    if (sexo && Object.values(Sexo).includes(sexo)) {
      where.sexo = sexo
    }

    if (edadMin !== null || edadMax !== null) {
      where.edad = {
        ...(edadMin !== null ? { gte: edadMin } : {}),
        ...(edadMax !== null ? { lte: edadMax } : {}),
      }
    }

    if (fechaDesde || fechaHasta) {
      where.fechaDesaparicion = {
        ...(fechaDesde ? { gte: new Date(fechaDesde) } : {}),
        ...(fechaHasta ? { lte: new Date(fechaHasta + 'T23:59:59') } : {}),
      }
    }

    if (esMenor === 'true') {
      where.esMenor = true
    } else if (esMenor === 'false') {
      where.esMenor = false
    }

    const resultados = await prisma.personaDesaparecida.findMany({
      where,
      take: RESULTADOS_POR_PAGINA + 1, // +1 para saber si hay más páginas
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { fechaRegistro: 'desc' },
      select: {
        id: true,
        nombre: true,
        edad: true,
        sexo: true,
        fechaDesaparicion: true,
        municipio: true,
        colonia: true,
        estado: true,
        esMenor: true,
        fechaRegistro: true,
        fotos: {
          where: { esPrincipal: true },
          select: { urlCloudinary: true },
          take: 1,
        },
      },
    })

    const hayMas = resultados.length > RESULTADOS_POR_PAGINA
    const items = hayMas ? resultados.slice(0, RESULTADOS_POR_PAGINA) : resultados
    const nextCursor = hayMas ? items[items.length - 1].id : null

    return NextResponse.json({ items, nextCursor, total: items.length })
  } catch (error) {
    console.error('Error en búsqueda:', error)
    return NextResponse.json({ error: 'Error al buscar casos' }, { status: 500 })
  }
}
