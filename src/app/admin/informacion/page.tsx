import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminInformacionPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const registros = await prisma.informacion.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      persona: { select: { id: true, nombre: true, municipio: true } },
    },
  })

  // Marcar como leídos automáticamente al ver la página
  await prisma.informacion.updateMany({
    where: { leido: false },
    data: { leido: true },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Información recibida</h1>
        <p className="text-gray-400 text-sm mt-1">
          Mensajes enviados por ciudadanos con información sobre casos
        </p>
      </div>

      {registros.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center text-gray-500">
          No hay información recibida todavía
        </div>
      ) : (
        <div className="space-y-4">
          {registros.map((info) => (
            <div key={info.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-white font-semibold text-sm">{info.nombre}</span>
                  <span className="text-gray-400 text-xs ml-2">
                    {new Date(info.createdAt).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <Link
                  href={`/admin/casos/${info.persona.id}`}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-400/10 px-3 py-1 rounded-full"
                >
                  {info.persona.nombre}
                </Link>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-3">{info.mensaje}</p>

              <div className="flex gap-4 text-xs text-gray-400">
                {info.telefono && (
                  <span>📞 {info.telefono}</span>
                )}
                {info.email && (
                  <span>📧 {info.email}</span>
                )}
                <span className="text-gray-500">Caso en {info.persona.municipio}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
