import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reporte enviado — Tamaulipas',
}

export default function GraciasPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {/* Icono */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">Reporte recibido</h1>
      <p className="text-gray-500 mb-2">
        Gracias por reportar este caso. Nuestro equipo revisará la información y la publicará
        en la plataforma en las próximas horas.
      </p>
      <p className="text-gray-400 text-sm mb-10">
        Si proporcionaste tu email, recibirás una notificación cuando el caso sea aprobado.
      </p>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-8 text-left">
        <p className="font-semibold mb-1">Mientras tanto, puedes:</p>
        <ul className="space-y-1 text-blue-700">
          <li>· Compartir en redes sociales para difundir el caso</li>
          <li>· Contactar a la Fiscalía de Tamaulipas: <strong>800-00-85-400</strong></li>
          <li>· Llamar al <strong>911</strong> si hay una emergencia activa</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          Ir al inicio
        </Link>
        <Link
          href="/buscar"
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium"
        >
          Ver casos activos
        </Link>
      </div>
    </div>
  )
}
