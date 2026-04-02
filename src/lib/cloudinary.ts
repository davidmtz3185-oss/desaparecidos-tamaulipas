import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export async function subirFoto(
  archivo: Buffer,
  carpeta: string = 'desaparecidos'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: carpeta,
          transformation: [
            { width: 800, height: 1067, crop: 'limit' }, // max 800x1067 (3:4 ratio)
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          max_bytes: 5 * 1024 * 1024, // 5 MB
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Sin resultado de Cloudinary'))
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      )
      .end(archivo)
  })
}

export async function eliminarFoto(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
