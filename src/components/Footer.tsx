import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Columna 1: Sobre la plataforma */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">DT</span>
              </div>
              <span className="text-white font-semibold text-sm">Desaparecidos Tamaulipas</span>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma ciudadana para la búsqueda de personas desaparecidas en el estado de Tamaulipas, México.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Acciones</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/buscar" className="hover:text-white transition-colors">Buscar personas</Link></li>
              <li><Link href="/reportar" className="hover:text-white transition-colors">Reportar desaparecido</Link></li>
              <li><Link href="/suscribirse" className="hover:text-white transition-colors">Recibir alertas</Link></li>
              <li><Link href="/donar" className="hover:text-white transition-colors">Apoyar</Link></li>
            </ul>
          </div>

          {/* Columna 3: Emergencias */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Emergencias</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-white font-medium">911</span>
                <span className="ml-2">Emergencias</span>
              </li>
              <li>
                <span className="text-white font-medium">800-00-85-400</span>
                <span className="ml-2">AMBER México</span>
              </li>
              <li>
                <span className="text-white font-medium">FGR</span>
                <span className="ml-2">Fiscalía General República</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>&copy; {year} Desaparecidos Tamaulipas. Plataforma sin fines de lucro.</p>
          <Link href="/aviso-privacidad" className="hover:text-white transition-colors">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
