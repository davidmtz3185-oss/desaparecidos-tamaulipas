'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ModalDuplicado from '@/components/ModalDuplicado'
import type { CandidatoDuplicado } from '@/lib/duplicados'

const CaptchaWidget = dynamic(() => import('@/components/CaptchaWidget'), { ssr: false })

const MUNICIPIOS = [
  'Altamira', 'Ciudad Madero', 'Ciudad Victoria', 'Jaumave', 'Mante',
  'Matamoros', 'Mier', 'Miguel Alemán', 'Nuevo Laredo', 'Reynosa',
  'Río Bravo', 'San Fernando', 'Tampico', 'Tula', 'Valle Hermoso',
]

const RELACIONES = [
  { value: 'FAMILIAR_DIRECTO', label: 'Familiar directo (padre, madre, hijo/a, hermano/a)' },
  { value: 'FAMILIAR_LEJANO', label: 'Familiar lejano (tío/a, primo/a, abuelo/a...)' },
  { value: 'AMIGO', label: 'Amigo/a' },
  { value: 'CONOCIDO', label: 'Conocido/a' },
  { value: 'AUTORIDAD', label: 'Autoridad (ministerio público, policía...)' },
  { value: 'OTRO', label: 'Otro' },
]

interface FormState {
  nombre: string
  edad: string
  esMenor: boolean
  sexo: string
  municipio: string
  colonia: string
  fechaDesaparicion: string
  ultimaUbicacion: string
  descripcionFisica: string
  reportanteNombre: string
  reportanteRelacion: string
  reportanteTelefono: string
  reportanteEmail: string
  aceptaDatosPublicos: boolean
}

const initialForm: FormState = {
  nombre: '',
  edad: '',
  esMenor: false,
  sexo: '',
  municipio: '',
  colonia: '',
  fechaDesaparicion: '',
  ultimaUbicacion: '',
  descripcionFisica: '',
  reportanteNombre: '',
  reportanteRelacion: '',
  reportanteTelefono: '',
  reportanteEmail: '',
  aceptaDatosPublicos: false,
}

export default function FormularioReporte() {
  const router = useRouter()
  const [paso, setPaso] = useState(1) // 1: persona, 2: reportante, 3: confirmación
  const [form, setForm] = useState<FormState>(initialForm)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoUrl, setFotoUrl] = useState('')
  const [fotoPublicId, setFotoPublicId] = useState('')
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [duplicados, setDuplicados] = useState<CandidatoDuplicado[]>([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [duplicadosRevisados, setDuplicadosRevisados] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm(prev => ({ ...prev, [field]: val }))
  }

  // Manejo de foto
  const handleFoto = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5 MB')
      return
    }
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
    setError('')
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFoto(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFoto(file)
  }

  const subirFoto = async (): Promise<boolean> => {
    if (!fotoFile) return true // foto opcional
    setSubiendoFoto(true)
    try {
      const fd = new FormData()
      fd.append('foto', fotoFile)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir foto')
      setFotoUrl(data.url)
      setFotoPublicId(data.publicId)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir la foto')
      return false
    } finally {
      setSubiendoFoto(false)
    }
  }

  // Paso 1 → verificar duplicados → Paso 2
  const handlePaso1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.sexo) { setError('Selecciona el sexo'); return }
    if (!form.municipio) { setError('Selecciona el municipio'); return }
    if (!form.fechaDesaparicion) { setError('Ingresa la fecha de desaparición'); return }
    if (form.descripcionFisica.length < 10) { setError('La descripción física es muy corta'); return }

    // Verificar duplicados (solo si no los revisó ya)
    if (!duplicadosRevisados) {
      try {
        const res = await fetch('/api/duplicados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: form.nombre,
            municipio: form.municipio,
            edad: Number(form.edad),
          }),
        })
        const data = await res.json()
        if (data.candidatos?.length > 0) {
          setDuplicados(data.candidatos)
          setMostrarModal(true)
          return
        }
      } catch {
        // Si falla la detección de duplicados, continuamos igual
      }
    }

    setPaso(2)
  }

  // Paso 2 → Paso 3
  const handlePaso2 = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.reportanteRelacion) { setError('Selecciona tu relación con la persona'); return }
    if (!form.reportanteTelefono && !form.reportanteEmail) {
      setError('Proporciona al menos un medio de contacto (teléfono o email)')
      return
    }

    setPaso(3)
  }

  // Envío final
  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!captchaToken) {
      setError('Completa la verificación de seguridad')
      return
    }

    // Subir foto primero
    const fotoOk = await subirFoto()
    if (!fotoOk) return

    setEnviando(true)
    try {
      const res = await fetch('/api/casos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          edad: Number(form.edad),
          esMenor: form.esMenor,
          sexo: form.sexo,
          municipio: form.municipio,
          colonia: form.colonia || undefined,
          fechaDesaparicion: form.fechaDesaparicion,
          ultimaUbicacion: form.ultimaUbicacion || undefined,
          descripcionFisica: form.descripcionFisica,
          reportanteNombre: form.reportanteNombre,
          reportanteRelacion: form.reportanteRelacion,
          reportanteTelefono: form.reportanteTelefono || undefined,
          reportanteEmail: form.reportanteEmail || undefined,
          aceptaDatosPublicos: form.aceptaDatosPublicos,
          fotoUrl: fotoUrl || undefined,
          fotoPublicId: fotoPublicId || undefined,
          captchaToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar')
      router.push('/reportar/gracias')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setEnviando(false)
    }
  }

  // Modal de duplicados
  const handleContinuarConReporte = () => {
    setDuplicadosRevisados(true)
    setMostrarModal(false)
    setPaso(2)
  }

  const steps = [
    { n: 1, label: 'Datos del desaparecido' },
    { n: 2, label: 'Quién reporta' },
    { n: 3, label: 'Confirmar' },
  ]

  return (
    <>
      {mostrarModal && (
        <ModalDuplicado
          candidatos={duplicados}
          onContinuar={handleContinuarConReporte}
          onCancelar={() => setMostrarModal(false)}
        />
      )}

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                paso > s.n
                  ? 'bg-green-500 border-green-500 text-white'
                  : paso === s.n
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {paso > s.n ? '✓' : s.n}
              </div>
              <span className={`text-xs mt-1 text-center leading-tight ${paso === s.n ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-12px] ${paso > s.n ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── PASO 1 ── */}
      {paso === 1 && (
        <form onSubmit={handlePaso1} className="space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">Datos de la persona desaparecida</h2>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={set('nombre')}
              placeholder="Nombre y apellidos"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Edad + Sexo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                max={120}
                value={form.edad}
                onChange={set('edad')}
                placeholder="Años"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.sexo}
                onChange={set('sexo')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
          </div>

          {/* Es menor */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.esMenor}
              onChange={set('esMenor')}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            Es menor de edad (menor de 18 años)
          </label>

          {/* Municipio + Colonia */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipio <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.municipio}
                onChange={set('municipio')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">Seleccionar</option>
                {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colonia</label>
              <input
                type="text"
                value={form.colonia}
                onChange={set('colonia')}
                placeholder="Opcional"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Fecha + Última ubicación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de desaparición <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.fechaDesaparicion}
                onChange={set('fechaDesaparicion')}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Última ubicación conocida</label>
              <input
                type="text"
                value={form.ultimaUbicacion}
                onChange={set('ultimaUbicacion')}
                placeholder="Ej: Calle Hidalgo, centro"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Descripción física */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción física <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.descripcionFisica}
              onChange={set('descripcionFisica')}
              rows={4}
              maxLength={1000}
              placeholder="Describe la apariencia física: estatura, complexión, color de piel, cabello, ojos, señas particulares, ropa que llevaba..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{form.descripcionFisica.length}/1000</p>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotografía reciente</label>
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
            >
              {fotoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-32 relative rounded-lg overflow-hidden">
                    <Image src={fotoPreview} alt="Vista previa" fill className="object-cover" />
                  </div>
                  <span className="text-xs text-gray-500">Click para cambiar</span>
                </div>
              ) : (
                <>
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Arrastra una foto o haz click para seleccionar</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · Máx. 5 MB · Opcional</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Continuar →
          </button>
        </form>
      )}

      {/* ── PASO 2 ── */}
      {paso === 2 && (
        <form onSubmit={handlePaso2} className="space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">¿Quién hace el reporte?</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.reportanteNombre}
              onChange={set('reportanteNombre')}
              placeholder="Nombre y apellidos"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relación con la persona desaparecida <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.reportanteRelacion}
              onChange={set('reportanteRelacion')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="">Seleccionar</option>
              {RELACIONES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu teléfono</label>
              <input
                type="tel"
                value={form.reportanteTelefono}
                onChange={set('reportanteTelefono')}
                placeholder="899 000 0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu email</label>
              <input
                type="email"
                value={form.reportanteEmail}
                onChange={set('reportanteEmail')}
                placeholder="tu@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-3">Proporciona al menos uno: teléfono o email.</p>

          <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.aceptaDatosPublicos}
              onChange={set('aceptaDatosPublicos')}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-0.5"
            />
            <span>
              Acepto que mi nombre y datos de contacto puedan ser mostrados en la plataforma junto al caso,
              para que ciudadanos con información puedan contactarme directamente.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              ← Atrás
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Continuar →
            </button>
          </div>
        </form>
      )}

      {/* ── PASO 3 ── */}
      {paso === 3 && (
        <form onSubmit={handleEnviar} className="space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">Confirma el reporte</h2>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nombre</span>
              <span className="font-medium text-gray-900">{form.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Edad</span>
              <span className="font-medium text-gray-900">{form.edad} años</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sexo</span>
              <span className="font-medium text-gray-900">{form.sexo === 'MASCULINO' ? 'Masculino' : 'Femenino'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Municipio</span>
              <span className="font-medium text-gray-900">{form.municipio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fecha desaparición</span>
              <span className="font-medium text-gray-900">
                {new Date(form.fechaDesaparicion + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reportado por</span>
              <span className="font-medium text-gray-900">{form.reportanteNombre}</span>
            </div>
            {fotoPreview && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Foto</span>
                <div className="w-10 h-12 relative rounded overflow-hidden">
                  <Image src={fotoPreview} alt="Foto" fill className="object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <strong>Revisión pendiente.</strong> Tu reporte será revisado por el equipo antes de aparecer en la plataforma.
            Normalmente esto toma menos de 24 horas.
          </div>

          {/* Captcha */}
          <div className="flex justify-center">
            <CaptchaWidget
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken('')}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaso(2)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              ← Atrás
            </button>
            <button
              type="submit"
              disabled={enviando || subiendoFoto || !captchaToken}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {subiendoFoto ? 'Subiendo foto...' : enviando ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Al enviar aceptas los{' '}
            <a href="/aviso-privacidad" className="underline hover:text-gray-600">términos de privacidad</a>.
          </p>
        </form>
      )}
    </>
  )
}
