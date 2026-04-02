'use client'

import { useState } from 'react'
import Link from 'next/link'

const MUNICIPIOS = [
  'Altamira', 'Ciudad Madero', 'Ciudad Victoria', 'Jaumave', 'Mante',
  'Matamoros', 'Mier', 'Miguel Alemán', 'Nuevo Laredo', 'Reynosa',
  'Río Bravo', 'San Fernando', 'Tampico', 'Tula', 'Valle Hermoso',
]

export default function SuscribirsePage() {
  const [form, setForm] = useState({ email: '', municipio: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.municipio) { setError('Selecciona un municipio'); return }

    setEnviando(true)
    try {
      const res = await fetch('/api/suscribirse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al suscribirse')
      setListo(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al suscribirse')
    } finally {
      setEnviando(false)
    }
  }

  if (listo) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Suscripción confirmada!</h1>
        <p className="text-gray-500 mb-2">
          Recibirás alertas en <strong>{form.email}</strong> cada vez que se registre un nuevo caso en{' '}
          <strong>{form.municipio}</strong>.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          Puedes cancelar tu suscripción en cualquier momento desde el enlace al final de cada correo.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Ir al inicio
          </Link>
          <Link href="/buscar" className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium">
            Ver casos activos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Suscribirse a alertas</span>
      </nav>

      <div className="mb-8">
        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Alertas por municipio</h1>
        <p className="text-gray-500 text-sm">
          Recibe un correo cada vez que se registre un nuevo caso en tu municipio.
          Gratis, sin spam, cancela cuando quieras.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipio a vigilar <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.municipio}
              onChange={e => setForm({ ...form, municipio: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="">Seleccionar municipio</option>
              {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {enviando ? 'Suscribiendo...' : 'Suscribirme a alertas'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Al suscribirte aceptas recibir correos de alerta. Consulta nuestro{' '}
            <Link href="/aviso-privacidad" className="underline hover:text-gray-600">aviso de privacidad</Link>.
          </p>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {[
          { icon: '🔔', label: 'Alertas inmediatas' },
          { icon: '🔒', label: 'Sin spam garantizado' },
          { icon: '✕', label: 'Cancela cuando quieras' },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs text-gray-500 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
