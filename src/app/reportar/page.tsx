import Link from 'next/link'
import FormularioReporte from '@/components/FormularioReporte'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reportar persona desaparecida — Tamaulipas',
  description: 'Reporta un caso de persona desaparecida en Tamaulipas. Tu información es confidencial.',
}

export default function ReportarPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Reportar desaparecido</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportar persona desaparecida</h1>
        <p className="text-gray-500 text-sm">
          Completa el formulario con la información disponible. Todos los datos son confidenciales
          y serán revisados antes de publicarse.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <FormularioReporte />
      </div>

      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
        <strong>¿Es una emergencia?</strong> Si la persona desapareció hace menos de 24 horas o estás
        en peligro, llama al <strong>911</strong> o contacta a la Fiscalía de Tamaulipas al{' '}
        <strong>800-00-85-400</strong>.
      </div>
    </div>
  )
}
