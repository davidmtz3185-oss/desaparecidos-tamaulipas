'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

const MUNICIPIOS = [
  'Reynosa', 'Matamoros', 'Nuevo Laredo', 'Tampico', 'Victoria',
  'Laredo', 'Altamira', 'Madero', 'Mante', 'Río Bravo',
]

export default function FiltrosBusqueda() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [nombre, setNombre] = useState(searchParams.get('nombre') ?? '')
  const [municipio, setMunicipio] = useState(searchParams.get('municipio') ?? '')
  const [sexo, setSexo] = useState(searchParams.get('sexo') ?? '')
  const [edadMin, setEdadMin] = useState(searchParams.get('edadMin') ?? '')
  const [edadMax, setEdadMax] = useState(searchParams.get('edadMax') ?? '')
  const [esMenor, setEsMenor] = useState(searchParams.get('esMenor') ?? '')

  function aplicarFiltros(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (nombre) params.set('nombre', nombre)
    if (municipio) params.set('municipio', municipio)
    if (sexo) params.set('sexo', sexo)
    if (edadMin) params.set('edadMin', edadMin)
    if (edadMax) params.set('edadMax', edadMax)
    if (esMenor) params.set('esMenor', esMenor)
    startTransition(() => router.push(`/buscar?${params.toString()}`))
  }

  function limpiarFiltros() {
    setNombre(''); setMunicipio(''); setSexo('')
    setEdadMin(''); setEdadMax(''); setEsMenor('')
    startTransition(() => router.push('/buscar'))
  }

  return (
    <form onSubmit={aplicarFiltros} className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Filtros de búsqueda</h2>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Municipio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
          <select
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            <option value="">Todos los municipios</option>
            {MUNICIPIOS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Sexo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
          <div className="flex gap-3">
            {[['', 'Todos'], ['MASCULINO', 'Hombre'], ['FEMENINO', 'Mujer']].map(([val, label]) => (
              <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value={val}
                  checked={sexo === val}
                  onChange={() => setSexo(val)}
                  className="accent-red-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Edad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rango de edad</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={edadMin}
              onChange={e => setEdadMin(e.target.value)}
              placeholder="Min"
              min={0} max={120}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              value={edadMax}
              onChange={e => setEdadMax(e.target.value)}
              placeholder="Max"
              min={0} max={120}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Menores */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={esMenor === 'true'}
              onChange={e => setEsMenor(e.target.checked ? 'true' : '')}
              className="accent-red-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Solo menores de edad</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          {isPending ? 'Buscando...' : 'Buscar'}
        </button>
        <button
          type="button"
          onClick={limpiarFiltros}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors"
        >
          Limpiar
        </button>
      </div>
    </form>
  )
}
