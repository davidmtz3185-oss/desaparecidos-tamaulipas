'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  casoId: string
  estadoActual: string
  validado: boolean
}

export default function AccionesAdmin({ casoId, estadoActual, validado }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [motivo, setMotivo] = useState('')
  const [mostrarRechazo, setMostrarRechazo] = useState(false)

  async function ejecutarAccion(accion: string, extra?: object) {
    setError('')
    setLoading(accion)
    try {
      const res = await fetch(`/api/admin/casos/${casoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al ejecutar acción')
      router.refresh()
      setMostrarRechazo(false)
      setMotivo('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(null)
    }
  }

  const isPendiente = estadoActual === 'ACTIVO_PENDIENTE' && !validado
  const isActivo = estadoActual === 'ACTIVO' && validado
  const isLocalizado = estadoActual === 'LOCALIZADO_VIVO' || estadoActual === 'LOCALIZADO_FALLECIDO'

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Acciones de administración</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {/* Aprobar (solo si está pendiente) */}
        {isPendiente && (
          <button
            onClick={() => ejecutarAccion('aprobar')}
            disabled={!!loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading === 'aprobar' ? 'Aprobando...' : '✓ Aprobar y publicar'}
          </button>
        )}

        {/* Rechazar (solo si está pendiente) */}
        {isPendiente && !mostrarRechazo && (
          <button
            onClick={() => setMostrarRechazo(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            ✕ Rechazar
          </button>
        )}

        {/* Marcar como localizado vivo */}
        {isActivo && (
          <button
            onClick={() => ejecutarAccion('localizado_vivo')}
            disabled={!!loading}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading === 'localizado_vivo' ? 'Guardando...' : '🟢 Localizado con vida'}
          </button>
        )}

        {/* Marcar como localizado fallecido */}
        {isActivo && (
          <button
            onClick={() => ejecutarAccion('localizado_fallecido')}
            disabled={!!loading}
            className="bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading === 'localizado_fallecido' ? 'Guardando...' : '⚫ Localizado sin vida'}
          </button>
        )}

        {/* Archivar */}
        {(isActivo || isLocalizado) && (
          <button
            onClick={() => ejecutarAccion('archivar')}
            disabled={!!loading}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading === 'archivar' ? 'Archivando...' : 'Archivar'}
          </button>
        )}

        {/* Reactivar (si está archivado/rechazado) */}
        {(estadoActual === 'ARCHIVADO' || estadoActual === 'RECHAZADO') && (
          <button
            onClick={() => ejecutarAccion('reactivar')}
            disabled={!!loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading === 'reactivar' ? 'Reactivando...' : 'Reactivar'}
          </button>
        )}
      </div>

      {/* Form de rechazo */}
      {mostrarRechazo && (
        <div className="mt-4 bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Motivo del rechazo (opcional)
          </label>
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            rows={3}
            placeholder="Ej: Información duplicada, datos insuficientes..."
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => ejecutarAccion('rechazar', { motivo })}
              disabled={!!loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {loading === 'rechazar' ? 'Rechazando...' : 'Confirmar rechazo'}
            </button>
            <button
              onClick={() => { setMostrarRechazo(false); setMotivo('') }}
              className="text-gray-400 hover:text-white text-sm px-3 py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
