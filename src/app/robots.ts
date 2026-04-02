import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://desaparecidostamaulipas.mx'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
