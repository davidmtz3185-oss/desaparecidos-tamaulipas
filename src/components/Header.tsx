'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">DT</span>
            </div>
            <span className="font-bold text-gray-900 text-sm leading-tight hidden sm:block">
              Desaparecidos<br />
              <span className="text-red-600">Tamaulipas</span>
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/buscar" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Buscar
            </Link>
            <Link href="/reportar" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Reportar caso
            </Link>
            <Link href="/suscribirse" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Recibir alertas
            </Link>
            <Link href="/donar" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Apoyar
            </Link>
          </nav>

          {/* Botón CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/reportar"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Reportar desaparecido
            </Link>
          </div>

          {/* Menú hamburguesa mobile */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú mobile */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Link href="/buscar" className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              Buscar personas
            </Link>
            <Link href="/reportar" className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              Reportar caso
            </Link>
            <Link href="/suscribirse" className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              Recibir alertas
            </Link>
            <Link href="/donar" className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              Apoyar
            </Link>
            <Link
              href="/reportar"
              className="mt-2 bg-red-600 text-white text-center py-2 rounded-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Reportar desaparecido
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
