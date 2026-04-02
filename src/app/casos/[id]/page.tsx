import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

const estadoConfig: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVO:               { label: 'Desaparecido/a', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  ACTIVO_PENDIENTE:     { label: 'En revisión', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  LOCALIZADO_VIVO:      { label: 'Localizado/a con vida', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  LOCALIZADO_FALLECIDO: { label: 'Localizado/a sin vida', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' },
  ARCHIVADO:            { label: 'Archivado', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
  RECHAZADO:            { label: 'Rechazado', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const caso = await prisma.personaDesaparecida.findUnique({
    where: { id: params.id },
    select: { nombre: true, municipio: true, edad: true },
  })
  if (!caso) return { title: 'Caso no encontrado' }
  return {
    title: `${caso.nombre} — ${caso.municipio}`,
    description: `Información sobre la desaparición de ${caso.nombre}, ${caso.edad} años, en ${caso.municipio}, Tamaulipas.`,
  }
}

export default async function CasoDetallePage({ params }: PageProps) {
  const caso = await prisma.personaDesaparecida.findUnique({
    where: { id: params.id, validadoPorAdmin: true },
    include: {
      fotos: true,
      reportantes: {
        where: { esSecundario: false },
        select: { nombre: true, relacion: true, aceptaDatosPublicos: true },
      },
    },
  })

  if (!caso) notFound()

  const estado = estadoConfig[caso.estado] ?? estadoConfig.ACTIVO
  const fotoPrincipal = caso.fotos.find(f => f.esPrincipal) ?? caso.fotos[0]
  const reportante = caso.reportantes[0]

  const fechaDesap = new Date(caso.fechaDesaparicion).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const fechaReg = new Date(caso.fechaRegistro).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const diasDesaparecido = Math.floor(
    (Date.now() - new Date(caso.fechaDesaparicion).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <Link href="/buscar" className="hover:text-gray-700">Búsqueda</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{caso.nombre}</span>
      </nav>

      {/* Badge de estado */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 ${estado.bg} ${estado.color}`}>
        <span className="w-2 h-2 rounded-full bg-current opacity-70" />
        {estado.label}
        {caso.estado === 'ACTIVO' && (
          <span className="ml-1 text-xs font-normal opacity-80">· {diasDesaparecido} días</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Foto */}
        <div>
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative">
            {fotoPrincipal ? (
              <Image
                src={fotoPrincipal.urlCloudinary}
                alt={`Foto de ${caso.nombre}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-400">Sin fotografía</span>
              </div>
            )}
            {caso.esMenor && (
              <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MENOR DE EDAD
              </div>
            )}
          </div>

          {/* Galería de fotos adicionales */}
          {caso.fotos.length > 1 && (
            <div className="flex gap-2 mt-3">
              {caso.fotos.slice(0, 4).map((foto) => (
                <div key={foto.id} className="w-16 h-16 rounded-lg overflow-hidden relative bg-gray-100 flex-shrink-0">
                  <Image src={foto.urlCloudinary} alt="Foto adicional" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{caso.nombre}</h1>
            <p className="text-gray-500 text-sm">Registrado el {fechaReg}</p>
          </div>

          {/* Info básica */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Datos personales</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 block">Edad</span>
                <span className="font-medium text-gray-900">{caso.edad} años</span>
              </div>
              <div>
                <span className="text-gray-500 block">Sexo</span>
                <span className="font-medium text-gray-900">{caso.sexo === 'MASCULINO' ? 'Masculino' : 'Femenino'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Municipio</span>
                <span className="font-medium text-gray-900">{caso.municipio}</span>
              </div>
              {caso.colonia && (
                <div>
                  <span className="text-gray-500 block">Colonia</span>
                  <span className="font-medium text-gray-900">{caso.colonia}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-gray-500 block">Fecha de desaparición</span>
                <span className="font-medium text-gray-900 capitalize">{fechaDesap}</span>
              </div>
              {caso.ultimaUbicacion && (
                <div className="col-span-2">
                  <span className="text-gray-500 block">Última ubicación conocida</span>
                  <span className="font-medium text-gray-900">{caso.ultimaUbicacion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Descripción física */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-2">Descripción física</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{caso.descripcionFisica}</p>
          </div>

          {/* Botón reportar información */}
          <Link
            href={`/casos/${caso.id}/informacion`}
            className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-3 rounded-xl transition-colors"
          >
            Tengo información sobre este caso
          </Link>

          {/* Quién reportó */}
          {reportante && (
            <div className="border border-gray-200 rounded-xl p-4 text-sm">
              <h2 className="font-semibold text-gray-900 mb-2">Reportado por</h2>
              <p className="text-gray-700">
                {reportante.nombre}
                <span className="text-gray-400 ml-1">({reportante.relacion.toLowerCase()})</span>
              </p>
            </div>
          )}

          {/* Compartir */}
          <div className="flex gap-2">
            <span className="text-sm text-gray-500 self-center">Compartir:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🚨 Persona desaparecida: ${caso.nombre}, ${caso.edad} años, ${caso.municipio}, Tamaulipas. Más info: ${process.env.NEXT_PUBLIC_APP_URL}/casos/${caso.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚨 Persona desaparecida: ${caso.nombre}, ${caso.edad} años, ${caso.municipio}. ¿La has visto? ${process.env.NEXT_PUBLIC_APP_URL}/casos/${caso.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Twitter / X
            </a>
          </div>
        </div>
      </div>

      {/* Aviso emergencias */}
      <div className="mt-10 bg-red-50 border border-red-200 rounded-xl p-5">
        <h3 className="font-semibold text-red-900 mb-1">¿Tienes una emergencia?</h3>
        <p className="text-red-800 text-sm">
          Si sabes dónde se encuentra esta persona o tu vida está en peligro, llama al <strong>911</strong> de inmediato.
          También puedes comunicarte con la Fiscalía de Tamaulipas.
        </p>
      </div>
    </div>
  )
}
