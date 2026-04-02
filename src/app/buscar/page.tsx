import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { EstadoCaso, Sexo } from '@prisma/client'
import CasoCard from '@/components/CasoCard'
import FiltrosBusqueda from '@/components/FiltrosBusqueda'

export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscar personas desaparecidas',
  description: 'Busca personas desaparecidas en Tamaulipas por nombre, municipio, edad y más filtros.',
}

interface PageProps {
  searchParams: {
    nombre?: string
    municipio?: string
    sexo?: string
    edadMin?: string
    edadMax?: string
    esMenor?: string
    cursor?: string
  }
}

async function ResultadosBusqueda({ searchParams }: PageProps) {
  const { nombre, municipio, sexo, edadMin, edadMax, esMenor, cursor } = searchParams
  const POR_PAGINA = 12

  const where: Record<string, unknown> = {
    estado: { in: [EstadoCaso.ACTIVO, EstadoCaso.LOCALIZADO_VIVO, EstadoCaso.LOCALIZADO_FALLECIDO] },
    validadoPorAdmin: true,
  }

  if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' }
  if (municipio) where.municipio = { contains: municipio, mode: 'insensitive' }
  if (sexo && (sexo === 'MASCULINO' || sexo === 'FEMENINO')) where.sexo = sexo as Sexo
  if (edadMin || edadMax) {
    where.edad = {
      ...(edadMin ? { gte: parseInt(edadMin) } : {}),
      ...(edadMax ? { lte: parseInt(edadMax) } : {}),
    }
  }
  if (esMenor === 'true') where.esMenor = true

  const casos = await prisma.personaDesaparecida.findMany({
    where,
    take: POR_PAGINA + 1,
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
      fotos: { where: { esPrincipal: true }, select: { urlCloudinary: true }, take: 1 },
    },
  })

  const hayMas = casos.length > POR_PAGINA
  const items = hayMas ? casos.slice(0, POR_PAGINA) : casos
  const nextCursor = hayMas ? items[items.length - 1].id : null

  const totalActivos = await prisma.personaDesaparecida.count({
    where: { estado: EstadoCaso.ACTIVO, validadoPorAdmin: true },
  })

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-gray-700 font-medium mb-1">Sin resultados</h3>
        <p className="text-gray-500 text-sm">Intenta con otros filtros de búsqueda.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {items.length} resultado{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
        {totalActivos > 0 && ` · ${totalActivos} casos activos en total`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(caso => (
          <CasoCard
            key={caso.id}
            {...caso}
            fechaDesaparicion={caso.fechaDesaparicion.toISOString()}
          />
        ))}
      </div>

      {hayMas && nextCursor && (
        <div className="mt-8 text-center">
          <a
            href={`/buscar?${new URLSearchParams({ ...searchParams, cursor: nextCursor }).toString()}`}
            className="inline-block bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Ver más casos
          </a>
        </div>
      )}
    </div>
  )
}

export default function BuscarPage({ searchParams }: PageProps) {
  const tienesFiltros = Object.values(searchParams).some(Boolean)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Buscar personas desaparecidas en Tamaulipas
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filtros */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <Suspense>
            <FiltrosBusqueda />
          </Suspense>
        </aside>

        {/* Resultados */}
        <div className="flex-1 min-w-0">
          {!tienesFiltros && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
              Mostrando todos los casos activos. Usa los filtros para refinar tu búsqueda.
            </div>
          )}
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <ResultadosBusqueda searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
