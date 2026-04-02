'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DesuscribirsePage() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const res = await fetch('/api/desuscribirse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al desuscribirse')
      setListo(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setEnviando(false)
    }
  }

  if (listo) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Suscripción cancelada</h1>
        <p className="text-gray-500 text-sm mb-8">
          El correo <strong>{email}</strong> ya no recibirá alertas. Puedes volver a suscribirte cuando quieras.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Ir al inicio
          </Link>
          <Link href="/suscribirse" className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium">
            Volver a suscribirme
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Cancelar alertas</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cancelar suscripción</h1>
      <p className="text-gray-500 text-sm mb-8">
        Ingresa tu correo para dejar de recibir alertas de casos en tu municipio.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {enviando ? 'Procesando...' : 'Cancelar mi suscripción'}
          </button>
        </form>
      </div>
    </div>
  )
}
