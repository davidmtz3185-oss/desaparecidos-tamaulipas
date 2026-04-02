import { NextRequest, NextResponse } from 'next/server'
import { subirFoto } from '@/lib/cloudinary'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const archivo = formData.get('foto') as File | null

    if (!archivo) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usa JPG, PNG o WebP.' },
        { status: 400 }
      )
    }

    if (archivo.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 5 MB.' },
        { status: 400 }
      )
    }

    const bytes = await archivo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { url, publicId } = await subirFoto(buffer, 'desaparecidos')

    return NextResponse.json({ url, publicId })
  } catch (error) {
    console.error('Error en /api/upload:', error)
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
  }
}
