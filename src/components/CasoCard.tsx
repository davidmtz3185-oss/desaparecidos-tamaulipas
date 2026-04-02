import Link from 'next/link'
import Image from 'next/image'

type EstadoCaso = 'ACTIVO_PENDIENTE' | 'ACTIVO' | 'LOCALIZADO_VIVO' | 'LOCALIZADO_FALLECIDO' | 'RECHAZADO' | 'ARCHIVADO'

interface CasoCardProps {
  id: string
  nombre: string
  edad: number
  sexo: 'MASCULINO' | 'FEMENINO'
  fechaDesaparicion: string
  municipio: string
  colonia?: string | null
  estado: EstadoCaso
  esMenor: boolean
  fotos?: { urlCloudinary: string }[]
}

const estadoConfig: Record<EstadoCaso, { label: string; color: string }> = {
  ACTIVO_PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  ACTIVO:           { label: 'Desaparecido', color: 'bg-red-100 text-red-800' },
  LOCALIZADO_VIVO:  { label: 'Localizado', color: 'bg-green-100 text-green-800' },
  LOCALIZADO_FALLECIDO: { label: 'Localizado †', color: 'bg-gray-100 text-gray-700' },
  RECHAZADO:        { label: 'Rechazado', color: 'bg-gray-100 text-gray-500' },
  ARCHIVADO:        { label: 'Archivado', color: 'bg-gray-100 text-gray-500' },
}

export default function CasoCard({ id, nombre, edad, sexo, fechaDesaparicion, municipio, colonia, estado, esMenor, fotos }: CasoCardProps) {
  const fotoUrl = fotos?.[0]?.urlCloudinary
  const { label, color } = estadoConfig[estado] ?? estadoConfig.ACTIVO
  const fecha = new Date(fechaDesaparicion).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <Link href={`/casos/${id}`} className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Foto */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={`Foto de ${nombre}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {esMenor && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            MENOR
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
            {nombre}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${color}`}>
            {label}
          </span>
        </div>

        <div className="space-y-1 text-xs text-gray-500">
          <p>{edad} años · {sexo === 'MASCULINO' ? 'Hombre' : 'Mujer'}</p>
          <p className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {municipio}{colonia ? `, ${colonia}` : ''}
          </p>
          <p className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Desapareció: {fecha}
          </p>
        </div>
      </div>
    </Link>
  )
}
