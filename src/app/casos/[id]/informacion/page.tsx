'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InformacionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.telefono && !form.email) {
      setError('Proporciona al menos un medio de contacto (teléfono o email)')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch('/api/informacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId: params.id, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar')
      setEnviado(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Información enviada</h1>
        <p className="text-gray-600 mb-8">
          Gracias por tu ayuda. La información fue recibida y será revisada por el equipo de la plataforma.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.back()} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Volver al caso
          </button>
          <Link href="/buscar" className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">
            Ver más casos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <Link href={`/casos/${params.id}`} className="hover:text-gray-700">Caso</Link>
        <span>/</span>
        <span className="text-gray-900">Tengo información</span>
      </nav>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>Tu información es confidencial.</strong> Solo el administrador de la plataforma y
        la familia del desaparecido tendrán acceso a tus datos de contacto.
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tengo información sobre este caso</h1>
      <p className="text-gray-500 text-sm mb-6">
        Comparte lo que sabes. Cualquier dato puede ayudar a encontrar a esta persona.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tu nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre completo o alias"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              placeholder="899 000 0000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 -mt-3">Proporciona al menos uno: teléfono o email.</p>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Información que tienes <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={form.mensaje}
            onChange={e => setForm({ ...form, mensaje: e.target.value })}
            rows={5}
            maxLength={2000}
            placeholder="Describe lo que sabes: lugar donde la viste, fecha, con quién estaba, cualquier detalle relevante..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.mensaje.length}/2000</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {enviando ? 'Enviando...' : 'Enviar información'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Al enviar aceptas que tus datos de contacto sean compartidos con la familia del desaparecido.
        </p>
      </form>
    </div>
  )
}
