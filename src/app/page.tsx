import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Plataforma de búsqueda de personas desaparecidas en{' '}
          <span className="text-red-600">Tamaulipas</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Reporta un caso, busca personas, recibe alertas por tu municipio.
          Juntos podemos ayudar a encontrarlos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/reportar"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
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

      {/* Placeholder para estadísticas — se llenará en Paso 9 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Casos activos', value: '—' },
          { label: 'Localizados', value: '—' },
          { label: 'Municipios cubiertos', value: '—' },
          { label: 'Alertas enviadas', value: '—' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Placeholder para últimos casos — se llenará en Paso 9 */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Últimos casos registrados</h2>
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
          Los casos aparecerán aquí cuando estén listos (Paso 9).
        </div>
      </section>
    </div>
  )
}
