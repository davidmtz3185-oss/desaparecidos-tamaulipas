import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { EstadoCaso } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://desaparecidostamaulipas.mx'

  let casoUrls: MetadataRoute.Sitemap = []
  try {
    const casos = await prisma.personaDesaparecida.findMany({
      where: {
        validadoPorAdmin: true,
        estado: { in: [EstadoCaso.ACTIVO, EstadoCaso.LOCALIZADO_VIVO, EstadoCaso.LOCALIZADO_FALLECIDO] },
      },
      select: { id: true, fechaRegistro: true },
    })
    casoUrls = casos.map(c => ({
      url: `${APP_URL}/casos/${c.id}`,
      lastModified: c.fechaRegistro,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not available at build time — return static URLs only
  }

  return [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${APP_URL}/buscar`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${APP_URL}/reportar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/suscribirse`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${APP_URL}/donar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${APP_URL}/aviso-privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...casoUrls,
  ]
}
