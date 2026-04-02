import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Apoya la plataforma',
  description: 'Ayuda a mantener viva y actualizada la plataforma ciudadana de búsqueda de personas desaparecidas en Tamaulipas.',
}

// ─── DATOS BANCARIOS ────────────────────────────────────────────
const TITULAR   = 'Josue David Aguilar Martinez'
const BANCO     = 'BBVA México'
const CLABE     = '012180015332767215'
const CUENTA    = '153 327 6721'
// ────────────────────────────────────────────────────────────────

const usos = [
  { icon: '🖥️', label: 'Hosting y base de datos', desc: 'Servidores en Railway para que la plataforma esté disponible las 24 horas.' },
  { icon: '📧', label: 'Servicio de correos', desc: 'Envío de alertas a suscriptores y notificaciones a familias.' },
  { icon: '🖼️', label: 'Almacenamiento de fotos', desc: 'Cloudinary para guardar y servir las fotografías de los casos.' },
  { icon: '🔧', label: 'Mejoras y nuevas funciones', desc: 'Desarrollo continuo para hacer la plataforma más útil y accesible.' },
]

export default function DonarPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Apoyar</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🤝</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Ayuda a mantener viva esta plataforma</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Esta es una iniciativa ciudadana <strong>sin fines de lucro</strong>. Tu aportación cubre
          los servidores y servicios necesarios para que siga funcionando y mejorando cada día.
        </p>
      </div>

      {/* Datos bancarios */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-1">Transferencia bancaria</h2>
        <p className="text-gray-400 text-sm mb-5">Cualquier cantidad ayuda. No hay monto mínimo.</p>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Banco</p>
            <p className="text-white font-semibold">{BANCO}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Titular</p>
            <p className="text-white font-semibold">{TITULAR}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">CLABE interbancaria</p>
            <p className="text-white font-semibold font-mono tracking-widest text-lg">{CLABE}</p>
          </div>

          {CUENTA && (
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Número de cuenta</p>
              <p className="text-white font-semibold font-mono">{CUENTA}</p>
            </div>
          )}
        </div>

        <p className="text-gray-400 text-xs mt-5 text-center">
          Al transferir, puedes usar como concepto: <em>"Apoyo plataforma desaparecidos"</em>
        </p>
      </div>

      {/* En qué se usa */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">¿En qué se usa tu donación?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {usos.map(u => (
            <div key={u.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="text-2xl mb-2">{u.icon}</div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{u.label}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Otras formas de ayudar */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
        <h2 className="font-bold text-gray-900 mb-2">¿No puedes donar? También puedes ayudar</h2>
        <p className="text-gray-500 text-sm mb-5">
          Comparte los casos en tus redes sociales o suscríbete a las alertas de tu municipio.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/buscar"
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Compartir casos
          </Link>
          <Link
            href="/suscribirse"
            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Suscribirme a alertas
          </Link>
        </div>
      </div>
    </div>
  )
}
