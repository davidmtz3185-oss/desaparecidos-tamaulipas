import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import AccionesAdmin from '@/components/admin/AccionesAdmin'

export default async function AdminCasoDetallePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const caso = await prisma.personaDesaparecida.findUnique({
    where: { id: params.id },
    include: {
      fotos: true,
      reportantes: true,
      informaciones: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })

  if (!caso) notFound()

  const fotoPrincipal = caso.fotos.find(f => f.esPrincipal) ?? caso.fotos[0]
  const reportante = caso.reportantes.find(r => !r.esSecundario)

  const fechaDesap = new Date(caso.fechaDesaparicion).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const fechaReg = new Date(caso.fechaRegistro).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const estadoLabel: Record<string, string> = {
    ACTIVO_PENDIENTE: 'Pendiente de revisión',
    ACTIVO: 'Activo',
    LOCALIZADO_VIVO: 'Localizado con vida',
    LOCALIZADO_FALLECIDO: 'Localizado sin vida',
    ARCHIVADO: 'Archivado',
    RECHAZADO: 'Rechazado',
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin" className="hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/casos" className="hover:text-white">Casos</Link>
        <span>/</span>
        <span className="text-white">{caso.nombre}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{caso.nombre}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Estado actual: <span className="text-yellow-400 font-medium">{estadoLabel[caso.estado] ?? caso.estado}</span>
            {caso.validadoPorAdmin && <span className="ml-2 text-green-400">· Validado</span>}
          </p>
        </div>
        <Link
          href={`/casos/${caso.id}`}
          target="_blank"
          className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg"
        >
          Ver público →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Foto */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
          <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Fotografía</h2>
          {fotoPrincipal ? (
            <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
              <Image src={fotoPrincipal.urlCloudinary} alt={caso.nombre} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-[3/4] bg-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-gray-500 text-sm">Sin foto</span>
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="md:col-span-2 space-y-4">
          {/* Datos personales */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Datos personales</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Nombre', value: caso.nombre },
                { label: 'Edad', value: `${caso.edad} años${caso.esMenor ? ' (menor)' : ''}` },
                { label: 'Sexo', value: caso.sexo === 'MASCULINO' ? 'Masculino' : 'Femenino' },
                { label: 'Municipio', value: caso.municipio },
                { label: 'Colonia', value: caso.colonia ?? '—' },
                { label: 'Fecha desaparición', value: fechaDesap },
                { label: 'Última ubicación', value: caso.ultimaUbicacion ?? '—' },
                { label: 'Fecha de registro', value: fechaReg },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="text-white font-medium capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Descripción física */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Descripción física</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{caso.descripcionFisica}</p>
          </div>
        </div>
      </div>

      {/* Reportante */}
      {reportante && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 mb-6">
          <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Quien reportó</h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <dt className="text-gray-400">Nombre</dt>
              <dd className="text-white font-medium">{reportante.nombre}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Relación</dt>
              <dd className="text-white font-medium">{reportante.relacion.toLowerCase().replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Teléfono</dt>
              <dd className="text-white font-medium">{reportante.telefono ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Email</dt>
              <dd className="text-white font-medium break-all">{reportante.email ?? '—'}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Información recibida */}
      {caso.informaciones.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 mb-6">
          <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">
            Información recibida ({caso.informaciones.length})
          </h2>
          <div className="space-y-3">
            {caso.informaciones.map((info) => (
              <div key={info.id} className="bg-gray-800 rounded-xl p-4 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{info.nombre}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(info.createdAt).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{info.mensaje}</p>
                {(info.telefono || info.email) && (
                  <p className="text-gray-400 text-xs mt-2">
                    {info.telefono && `Tel: ${info.telefono}`}
                    {info.telefono && info.email && ' · '}
                    {info.email && `Email: ${info.email}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <AccionesAdmin casoId={caso.id} estadoActual={caso.estado} validado={caso.validadoPorAdmin} />
    </div>
  )
}
