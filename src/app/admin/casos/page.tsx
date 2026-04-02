import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { EstadoCaso } from '@prisma/client'

const estadoConfig: Record<string, { label: string; color: string }> = {
  ACTIVO_PENDIENTE:     { label: 'Pendiente', color: 'text-yellow-400 bg-yellow-400/10' },
  ACTIVO:               { label: 'Activo', color: 'text-red-400 bg-red-400/10' },
  LOCALIZADO_VIVO:      { label: 'Localizado vivo', color: 'text-green-400 bg-green-400/10' },
  LOCALIZADO_FALLECIDO: { label: 'Localizado fallecido', color: 'text-gray-400 bg-gray-400/10' },
  ARCHIVADO:            { label: 'Archivado', color: 'text-gray-500 bg-gray-500/10' },
  RECHAZADO:            { label: 'Rechazado', color: 'text-red-700 bg-red-700/10' },
}

export default async function AdminCasosPage({
  searchParams,
}: {
  searchParams: { estado?: string; q?: string }
}) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const estado = searchParams.estado
  const q = searchParams.q

  let whereEstado: any = {}
  if (estado === 'pendiente') whereEstado = { estado: EstadoCaso.ACTIVO_PENDIENTE, validadoPorAdmin: false }
  else if (estado === 'activo') whereEstado = { estado: EstadoCaso.ACTIVO, validadoPorAdmin: true }
  else if (estado === 'localizado') whereEstado = { estado: { in: [EstadoCaso.LOCALIZADO_VIVO, EstadoCaso.LOCALIZADO_FALLECIDO] } }
  else if (estado === 'archivado') whereEstado = { estado: { in: [EstadoCaso.ARCHIVADO, EstadoCaso.RECHAZADO] } }

  const casos = await prisma.personaDesaparecida.findMany({
    where: {
      ...whereEstado,
      ...(q ? { nombre: { contains: q, mode: 'insensitive' } } : {}),
    },
    orderBy: { fechaRegistro: 'desc' },
    take: 50,
    select: {
      id: true,
      nombre: true,
      edad: true,
      municipio: true,
      estado: true,
      validadoPorAdmin: true,
      fechaRegistro: true,
      esMenor: true,
    },
  })

  const filtros = [
    { label: 'Todos', value: '' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Activos', value: 'activo' },
    { label: 'Localizados', value: 'localizado' },
    { label: 'Archivados', value: 'archivado' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Casos</h1>
        <span className="text-gray-400 text-sm">{casos.length} resultados</span>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filtros.map((f) => (
          <Link
            key={f.value}
            href={`/admin/casos${f.value ? `?estado=${f.value}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              estado === f.value || (!estado && !f.value)
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {casos.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No hay casos con este filtro</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">Nombre</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Municipio</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Registrado</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {casos.map((caso) => {
                const cfg = estadoConfig[caso.estado] ?? estadoConfig.ACTIVO
                const fechaReg = new Date(caso.fechaRegistro).toLocaleDateString('es-MX', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
                return (
                  <tr key={caso.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{caso.nombre}</span>
                        {caso.esMenor && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-medium">Menor</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">{caso.edad} años</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-gray-300 text-sm">{caso.municipio}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-gray-400 text-sm">{fechaReg}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/casos/${caso.id}`}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
