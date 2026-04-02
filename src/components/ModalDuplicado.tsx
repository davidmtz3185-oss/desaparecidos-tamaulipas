'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CandidatoDuplicado } from '@/lib/duplicados'

interface ModalDuplicadoProps {
  candidatos: CandidatoDuplicado[]
  onContinuar: () => void
  onCancelar: () => void
}

export default function ModalDuplicado({ candidatos, onContinuar, onCancelar }: ModalDuplicadoProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Posibles casos similares</h2>
              <p className="text-sm text-gray-500">Encontramos {candidatos.length} caso{candidatos.length !== 1 ? 's' : ''} parecido{candidatos.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Antes de continuar, verifica si esta persona ya fue reportada. Esto evita duplicados en la plataforma.
          </p>
        </div>

        {/* Lista de candidatos */}
        <div className="p-4 space-y-3">
          {candidatos.map((c) => {
            const fecha = new Date(c.fechaDesaparicion).toLocaleDateString('es-MX', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            const porcentaje = Math.round(c.similitud * 100)

            return (
              <Link
                key={c.id}
                href={`/casos/${c.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors group"
              >
                {/* Foto */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  {c.fotoPrincipal ? (
                    <Image src={c.fotoPrincipal} alt={c.nombre} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-red-700 truncate">{c.nombre}</p>
                  <p className="text-xs text-gray-500">{c.edad} años · {c.municipio}</p>
                  <p className="text-xs text-gray-400">Desapareció el {fecha}</p>
                </div>

                {/* Similitud */}
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-yellow-600">{porcentaje}%</span>
                  <span className="text-xs text-gray-400">similitud</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-500 text-center">
            ¿Ninguno de los anteriores es la persona que quieres reportar?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancelar}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onContinuar}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Es un caso distinto, continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
