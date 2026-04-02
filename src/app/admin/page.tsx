import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { EstadoCaso } from '@prisma/client'

async function getStats() {
  const [pendientes, activos, localizados, informacionNueva, suscriptores] = await Promise.all([
    prisma.personaDesaparecida.count({ where: { validadoPorAdmin: false, estado: EstadoCaso.ACTIVO_PENDIENTE } }),
    prisma.personaDesaparecida.count({ where: { estado: EstadoCaso.ACTIVO, validadoPorAdmin: true } }),
    prisma.personaDesaparecida.count({
      where: { estado: { in: [EstadoCaso.LOCALIZADO_VIVO, EstadoCaso.LOCALIZADO_FALLECIDO] }, validadoPorAdmin: true },
    }),
    prisma.informacion.count({ where: { leido: false } }),
    prisma.suscriptorAlerta.count({ where: { activo: true } }),
  ])
  return { pendientes, activos, localizados, informacionNueva, suscriptores }
}

async function getCasosPendientes() {
  return prisma.personaDesaparecida.findMany({
    where: { validadoPorAdmin: false, estado: EstadoCaso.ACTIVO_PENDIENTE },
    orderBy: { fechaRegistro: 'desc' },
    take: 5,
    select: {
      id: true,
      nombre: true,
      edad: true,
      municipio: true,
      fechaRegistro: true,
      reportantes: {
        where: { esSecundario: false },
        select: { nombre: true },
        take: 1,
      },
    },
  })
}

export default async function AdminDashboard() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const [stats, casosPendientes] = await Promise.all([getStats(), getCasosPendientes()])

  const statCards = [
    { label: 'Pendientes de revisión', value: stats.pendientes, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', href: '/admin/casos?estado=pendiente' },
    { label: 'Casos activos', value: stats.activos, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', href: '/admin/casos?estado=activo' },
    { label: 'Localizados', value: stats.localizados, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', href: '/admin/casos?estado=localizado' },
    { label: 'Info sin leer', value: stats.informacionNueva, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', href: '/admin/informacion' },
    { label: 'Suscriptores', value: stats.suscriptores, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', href: '/admin/suscriptores' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Bienvenido, {session.user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} className={`rounded-xl p-5 border ${s.bg} hover:opacity-80 transition-opacity`}>
            <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Casos pendientes */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-semibold">Casos pendientes de revisión</h2>
          <Link href="/admin/casos?estado=pendiente" className="text-sm text-red-400 hover:text-red-300">
            Ver todos →
          </Link>
        </div>

        {casosPendientes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No hay casos pendientes de revisión ✓
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {casosPendientes.map((caso) => {
              const fechaReg = new Date(caso.fechaRegistro).toLocaleDateString('es-MX', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })
              return (
                <div key={caso.id} className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-white font-medium text-sm">{caso.nombre}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {caso.edad} años · {caso.municipio}
                      {caso.reportantes[0] && ` · Reportado por ${caso.reportantes[0].nombre}`}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{fechaReg}</p>
                  </div>
                  <Link
                    href={`/admin/casos/${caso.id}`}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0 ml-4"
                  >
                    Revisar
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
