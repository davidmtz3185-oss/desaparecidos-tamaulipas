import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { EstadoCaso } from '@prisma/client'
import CasoCard from '@/components/CasoCard'

export const dynamic = 'force-dynamic'

export const revalidate = 3600 // revalidar cada hora

async function getEstadisticas() {
  const [activos, localizados, municipios, suscriptores] = await Promise.all([
    prisma.personaDesaparecida.count({
      where: { estado: EstadoCaso.ACTIVO, validadoPorAdmin: true },
    }),
    prisma.personaDesaparecida.count({
      where: {
        estado: { in: [EstadoCaso.LOCALIZADO_VIVO, EstadoCaso.LOCALIZADO_FALLECIDO] },
        validadoPorAdmin: true,
      },
    }),
    prisma.personaDesaparecida.findMany({
      where: { validadoPorAdmin: true },
      select: { municipio: true },
      distinct: ['municipio'],
    }),
    prisma.suscriptorAlerta.count({ where: { activo: true } }),
  ])
  return { activos, localizados, municipios: municipios.length, suscriptores }
}

async function getUltimosCasos() {
  return prisma.personaDesaparecida.findMany({
    where: {
      estado: { in: [EstadoCaso.ACTIVO, EstadoCaso.LOCALIZADO_VIVO] },
      validadoPorAdmin: true,
    },
    orderBy: { fechaRegistro: 'desc' },
    take: 6,
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
}

export default async function Home() {
  const [stats, ultimosCasos] = await Promise.all([getEstadisticas(), getUltimosCasos()])

  const statsItems = [
    { label: 'Casos activos', value: stats.activos.toLocaleString('es-MX') },
    { label: 'Localizados', value: stats.localizados.toLocaleString('es-MX') },
    { label: 'Municipios cubiertos', value: stats.municipios.toLocaleString('es-MX') },
    { label: 'Suscriptores de alertas', value: stats.suscriptores.toLocaleString('es-MX') },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5 border border-red-100">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Plataforma ciudadana activa
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Búsqueda de personas desaparecidas<br className="hidden sm:block" /> en{' '}
          <span className="text-red-600">Tamaulipas</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Reporta un caso, busca a alguien, recibe alertas por tu municipio.
          Juntos podemos ayudar a encontrarlos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/reportar"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
          >
            Reportar desaparecido
          </Link>
          <Link
            href="/buscar"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
          >
            Buscar persona
          </Link>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {statsItems.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Últimos casos */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Últimos casos registrados</h2>
          <Link href="/buscar" className="text-sm text-red-600 hover:text-red-700 font-medium">
            Ver todos →
          </Link>
        </div>
        {ultimosCasos.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 border border-dashed border-gray-200">
            No hay casos registrados todavía.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ultimosCasos.map(caso => (
              <CasoCard
                key={caso.id}
                {...caso}
                fechaDesaparicion={caso.fechaDesaparicion.toISOString()}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Alertas */}
      <section className="bg-gray-900 text-white rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Recibe alertas por tu municipio</h2>
        <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
          Suscríbete y te notificamos por email cada vez que se registre un nuevo caso en tu municipio.
        </p>
        <Link
          href="/suscribirse"
          className="inline-block bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Suscribirme a alertas
        </Link>
      </section>
    </div>
  )
}
