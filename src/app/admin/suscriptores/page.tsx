import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminSuscriptoresPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const suscriptores = await prisma.suscriptorAlerta.findMany({
    orderBy: { creadoEn: 'desc' },
    take: 200,
  })

  const activos = suscriptores.filter(s => s.activo).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Suscriptores de alertas</h1>
        <p className="text-gray-400 text-sm mt-1">
          {activos} suscriptores activos de {suscriptores.length} totales
        </p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {suscriptores.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No hay suscriptores todavía</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">Email</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">Municipio</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">Fecha</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {suscriptores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/50">
                  <td className="px-5 py-3 text-white text-sm">{s.email}</td>
                  <td className="px-5 py-3 text-gray-300 text-sm">{s.municipio}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">
                    {new Date(s.creadoEn).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      s.activo
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-gray-500 bg-gray-500/10'
                    }`}>
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
